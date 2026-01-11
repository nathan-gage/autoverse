//! FFT-based 2D convolution for efficient kernel application.
//!
//! Uses rustfft for O(N log N) convolution instead of O(N * K^2) direct convolution.

use std::sync::Arc;

use num_complex::Complex;
use rustfft::{Fft, FftPlanner};

/// Block size for cache-friendly transpose operations.
/// 32×32 blocks fit well in L1 cache (32×32×8 bytes = 8KB for Complex<f32>).
const TRANSPOSE_BLOCK_SIZE: usize = 32;

/// Pre-allocated scratch buffers for FFT operations.
/// Each thread/parallel task should have its own FftScratch to avoid allocation.
pub struct FftScratch {
    /// Scratch for row FFT
    pub row_scratch: Vec<Complex<f32>>,
    /// Scratch for column FFT (used for transposed rows)
    pub col_scratch: Vec<Complex<f32>>,
    /// Transpose buffer for cache-friendly column FFT
    pub transpose_buffer: Vec<Complex<f32>>,
    /// Input frequency buffer
    pub input_freq: Vec<Complex<f32>>,
    /// Result frequency buffer
    pub result_freq: Vec<Complex<f32>>,
}

impl FftScratch {
    /// Create new scratch buffers sized for the given convolver.
    pub fn new(convolver: &CachedConvolver) -> Self {
        let row_scratch_len = convolver.fft_row.get_inplace_scratch_len();
        let col_scratch_len = convolver.fft_col.get_inplace_scratch_len();
        let ifft_row_scratch_len = convolver.ifft_row.get_inplace_scratch_len();
        let ifft_col_scratch_len = convolver.ifft_col.get_inplace_scratch_len();

        // Use max of forward/inverse scratch requirements
        let max_row_scratch = row_scratch_len.max(ifft_row_scratch_len);
        let max_col_scratch = col_scratch_len.max(ifft_col_scratch_len);

        let grid_size = convolver.width * convolver.height;

        Self {
            row_scratch: vec![Complex::new(0.0, 0.0); max_row_scratch],
            col_scratch: vec![Complex::new(0.0, 0.0); max_col_scratch],
            transpose_buffer: vec![Complex::new(0.0, 0.0); grid_size],
            input_freq: vec![Complex::new(0.0, 0.0); grid_size],
            result_freq: vec![Complex::new(0.0, 0.0); grid_size],
        }
    }
}

/// Transpose a matrix from src to dst using cache-friendly block algorithm.
/// src is width×height (row-major), dst becomes height×width (row-major).
#[inline]
fn transpose_blocked(src: &[Complex<f32>], dst: &mut [Complex<f32>], width: usize, height: usize) {
    // Process in blocks for cache efficiency
    for block_y in (0..height).step_by(TRANSPOSE_BLOCK_SIZE) {
        let block_y_end = (block_y + TRANSPOSE_BLOCK_SIZE).min(height);
        for block_x in (0..width).step_by(TRANSPOSE_BLOCK_SIZE) {
            let block_x_end = (block_x + TRANSPOSE_BLOCK_SIZE).min(width);

            // Transpose this block
            for y in block_y..block_y_end {
                for x in block_x..block_x_end {
                    // src[y][x] -> dst[x][y]
                    // src index: y * width + x
                    // dst index: x * height + y
                    dst[x * height + y] = src[y * width + x];
                }
            }
        }
    }
}

/// FFT convolution engine with cached plans.
pub struct FftConvolver {
    width: usize,
    height: usize,
}

impl FftConvolver {
    /// Create a new FFT convolver for the given grid dimensions.
    pub fn new(width: usize, height: usize) -> Self {
        Self { width, height }
    }

    /// Perform 2D FFT on real-valued input.
    /// Returns complex frequency-domain representation.
    pub fn fft2d(&mut self, input: &[f32]) -> Vec<Complex<f32>> {
        assert_eq!(input.len(), self.width * self.height);

        let mut data: Vec<Complex<f32>> = input.iter().map(|&x| Complex::new(x, 0.0)).collect();

        // Row-wise FFT
        let mut planner = FftPlanner::new();
        let fft_row = planner.plan_fft_forward(self.width);
        for row in data.chunks_exact_mut(self.width) {
            fft_row.process(row);
        }

        // Column-wise FFT (transpose, FFT, transpose back)
        let fft_col = planner.plan_fft_forward(self.height);
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];

        for x in 0..self.width {
            // Extract column
            for y in 0..self.height {
                col_buffer[y] = data[y * self.width + x];
            }

            // FFT column
            fft_col.process(&mut col_buffer);

            // Write back
            for y in 0..self.height {
                data[y * self.width + x] = col_buffer[y];
            }
        }

        data
    }

    /// Perform inverse 2D FFT, returning real values.
    pub fn ifft2d(&mut self, input: &mut [Complex<f32>]) -> Vec<f32> {
        assert_eq!(input.len(), self.width * self.height);

        let mut planner = FftPlanner::new();

        // Column-wise IFFT
        let ifft_col = planner.plan_fft_inverse(self.height);
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];

        for x in 0..self.width {
            // Extract column
            for y in 0..self.height {
                col_buffer[y] = input[y * self.width + x];
            }

            // IFFT column
            ifft_col.process(&mut col_buffer);

            // Write back
            for y in 0..self.height {
                input[y * self.width + x] = col_buffer[y];
            }
        }

        // Row-wise IFFT
        let ifft_row = planner.plan_fft_inverse(self.width);
        for row in input.chunks_exact_mut(self.width) {
            ifft_row.process(row);
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height) as f32;
        input.iter().map(|c| c.re * scale).collect()
    }

    /// Convolve input grid with kernel (both in spatial domain).
    /// Returns convolution result.
    pub fn convolve(&mut self, input: &[f32], kernel: &[f32]) -> Vec<f32> {
        // Transform both to frequency domain
        let input_freq = self.fft2d(input);
        let kernel_freq = self.fft2d(kernel);

        // Pointwise multiplication in frequency domain
        let mut result_freq: Vec<Complex<f32>> = input_freq
            .iter()
            .zip(kernel_freq.iter())
            .map(|(a, b)| a * b)
            .collect();

        // Transform back to spatial domain
        self.ifft2d(&mut result_freq)
    }
}

/// Precomputed kernel in frequency domain for efficient repeated convolution.
#[derive(Clone)]
pub struct FrequencyKernel {
    pub data: Vec<Complex<f32>>,
    pub source_channel: usize,
    pub target_channel: usize,
    pub weight: f32,
    pub mu: f32,
    pub sigma: f32,
}

impl FrequencyKernel {
    /// Create frequency-domain kernel from spatial kernel.
    #[allow(clippy::too_many_arguments)]
    pub fn from_spatial(
        kernel_data: &[f32],
        width: usize,
        height: usize,
        source_channel: usize,
        target_channel: usize,
        weight: f32,
        mu: f32,
        sigma: f32,
    ) -> Self {
        let mut convolver = FftConvolver::new(width, height);
        let data = convolver.fft2d(kernel_data);

        Self {
            data,
            source_channel,
            target_channel,
            weight,
            mu,
            sigma,
        }
    }
}

/// Optimized convolver with precomputed frequency-domain kernels and cached FFT plans.
pub struct CachedConvolver {
    width: usize,
    height: usize,
    kernels: Vec<FrequencyKernel>,
    // Cached FFT plans (expensive to create, reuse across convolutions)
    fft_row: Arc<dyn Fft<f32>>,
    fft_col: Arc<dyn Fft<f32>>,
    ifft_row: Arc<dyn Fft<f32>>,
    ifft_col: Arc<dyn Fft<f32>>,
}

impl CachedConvolver {
    /// Create convolver with precomputed kernels and cached FFT plans.
    pub fn new(width: usize, height: usize, kernels: Vec<FrequencyKernel>) -> Self {
        // Pre-compute FFT plans once (this is the expensive part we're caching)
        let mut planner = FftPlanner::new();
        let fft_row = planner.plan_fft_forward(width);
        let fft_col = planner.plan_fft_forward(height);
        let ifft_row = planner.plan_fft_inverse(width);
        let ifft_col = planner.plan_fft_inverse(height);

        Self {
            width,
            height,
            kernels,
            fft_row,
            fft_col,
            ifft_row,
            ifft_col,
        }
    }

    /// Get reference to precomputed kernels.
    pub fn kernels(&self) -> &[FrequencyKernel] {
        &self.kernels
    }

    /// Get grid width.
    #[inline]
    pub fn width(&self) -> usize {
        self.width
    }

    /// Get grid height.
    #[inline]
    pub fn height(&self) -> usize {
        self.height
    }

    /// Convolve input with precomputed kernel at given index.
    /// Uses cached FFT plans for efficiency.
    pub fn convolve_with_kernel(&self, input: &[f32], kernel_idx: usize) -> Vec<f32> {
        let input_freq = self.fft2d_cached(input);

        let kernel = &self.kernels[kernel_idx];

        // Pointwise multiplication
        let mut result_freq: Vec<Complex<f32>> = input_freq
            .iter()
            .zip(kernel.data.iter())
            .map(|(a, b)| a * b)
            .collect();

        self.ifft2d_cached(&mut result_freq)
    }

    /// Convolve input with precomputed kernel using scratch buffers.
    /// Avoids allocation by using pre-allocated scratch space.
    /// Uses matrix transpose for cache-friendly column FFT operations.
    #[inline]
    pub fn convolve_with_kernel_scratch(
        &self,
        input: &[f32],
        kernel_idx: usize,
        scratch: &mut FftScratch,
        output: &mut [f32],
    ) {
        // Forward FFT into scratch.input_freq using transpose for column FFT
        self.fft2d_transpose(
            input,
            &mut scratch.input_freq,
            &mut scratch.transpose_buffer,
            &mut scratch.row_scratch,
            &mut scratch.col_scratch,
        );

        let kernel = &self.kernels[kernel_idx];

        // Pointwise multiplication into scratch.result_freq
        for (i, (inp, k)) in scratch
            .input_freq
            .iter()
            .zip(kernel.data.iter())
            .enumerate()
        {
            scratch.result_freq[i] = inp * k;
        }

        // Inverse FFT into output using transpose for column IFFT
        self.ifft2d_transpose(
            &mut scratch.result_freq,
            output,
            &mut scratch.transpose_buffer,
            &mut scratch.row_scratch,
            &mut scratch.col_scratch,
        );
    }

    /// Perform 2D FFT using matrix transpose for cache-friendly column access.
    /// Algorithm: row FFT -> transpose -> row FFT (on transposed = column FFT) -> transpose back
    #[inline]
    fn fft2d_transpose(
        &self,
        input: &[f32],
        output: &mut [Complex<f32>],
        transpose_buf: &mut [Complex<f32>],
        row_scratch: &mut [Complex<f32>],
        col_scratch: &mut [Complex<f32>],
    ) {
        // Convert input to complex
        for (i, &x) in input.iter().enumerate() {
            output[i] = Complex::new(x, 0.0);
        }

        // Row-wise FFT (width rows of length width)
        for row in output.chunks_exact_mut(self.width) {
            self.fft_row.process_with_scratch(row, row_scratch);
        }

        // Transpose: output (height×width) -> transpose_buf (width×height)
        // After transpose, what were columns are now rows
        transpose_blocked(output, transpose_buf, self.width, self.height);

        // Row-wise FFT on transposed data (this is column FFT on original)
        // transpose_buf has width rows of length height
        for row in transpose_buf.chunks_exact_mut(self.height) {
            self.fft_col.process_with_scratch(row, col_scratch);
        }

        // Transpose back: transpose_buf (width×height) -> output (height×width)
        transpose_blocked(transpose_buf, output, self.height, self.width);
    }

    /// Perform inverse 2D FFT using matrix transpose for cache-friendly column access.
    /// Algorithm: transpose -> row IFFT (= column IFFT) -> transpose back -> row IFFT
    #[inline]
    fn ifft2d_transpose(
        &self,
        freq_data: &mut [Complex<f32>],
        output: &mut [f32],
        transpose_buf: &mut [Complex<f32>],
        row_scratch: &mut [Complex<f32>],
        col_scratch: &mut [Complex<f32>],
    ) {
        // Transpose: freq_data (height×width) -> transpose_buf (width×height)
        transpose_blocked(freq_data, transpose_buf, self.width, self.height);

        // Row-wise IFFT on transposed data (this is column IFFT on original)
        for row in transpose_buf.chunks_exact_mut(self.height) {
            self.ifft_col.process_with_scratch(row, col_scratch);
        }

        // Transpose back: transpose_buf (width×height) -> freq_data (height×width)
        transpose_blocked(transpose_buf, freq_data, self.height, self.width);

        // Row-wise IFFT
        for row in freq_data.chunks_exact_mut(self.width) {
            self.ifft_row.process_with_scratch(row, row_scratch);
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height) as f32;
        for (i, c) in freq_data.iter().enumerate() {
            output[i] = c.re * scale;
        }
    }

    /// Perform 2D FFT using cached plans.
    fn fft2d_cached(&self, input: &[f32]) -> Vec<Complex<f32>> {
        let mut data: Vec<Complex<f32>> = input.iter().map(|&x| Complex::new(x, 0.0)).collect();

        // Row-wise FFT using cached plan
        for row in data.chunks_exact_mut(self.width) {
            self.fft_row.process(row);
        }

        // Column-wise FFT
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];
        for x in 0..self.width {
            // Extract column
            for y in 0..self.height {
                col_buffer[y] = data[y * self.width + x];
            }

            // FFT column using cached plan
            self.fft_col.process(&mut col_buffer);

            // Write back
            for y in 0..self.height {
                data[y * self.width + x] = col_buffer[y];
            }
        }

        data
    }

    /// Perform inverse 2D FFT using cached plans.
    fn ifft2d_cached(&self, input: &mut [Complex<f32>]) -> Vec<f32> {
        // Column-wise IFFT
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];
        for x in 0..self.width {
            // Extract column
            for y in 0..self.height {
                col_buffer[y] = input[y * self.width + x];
            }

            // IFFT column using cached plan
            self.ifft_col.process(&mut col_buffer);

            // Write back
            for y in 0..self.height {
                input[y * self.width + x] = col_buffer[y];
            }
        }

        // Row-wise IFFT using cached plan
        for row in input.chunks_exact_mut(self.width) {
            self.ifft_row.process(row);
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height) as f32;
        input.iter().map(|c| c.re * scale).collect()
    }

    /// Convolve input grid with all kernels for a given source channel.
    /// Returns vector of (target_channel, weight, mu, sigma, convolution_result).
    /// Uses cached FFT plans for efficiency.
    pub fn convolve_channel(
        &self,
        input: &[f32],
        source_channel: usize,
    ) -> Vec<(usize, f32, f32, f32, Vec<f32>)> {
        let input_freq = self.fft2d_cached(input);

        self.kernels
            .iter()
            .filter(|k| k.source_channel == source_channel)
            .map(|kernel| {
                // Pointwise multiplication
                let mut result_freq: Vec<Complex<f32>> = input_freq
                    .iter()
                    .zip(kernel.data.iter())
                    .map(|(a, b)| a * b)
                    .collect();

                let result = self.ifft2d_cached(&mut result_freq);

                (
                    kernel.target_channel,
                    kernel.weight,
                    kernel.mu,
                    kernel.sigma,
                    result,
                )
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fft_identity() {
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Create simple test pattern
        let input: Vec<f32> = (0..width * height).map(|i| (i % 10) as f32).collect();

        // FFT then IFFT should recover original
        let freq = convolver.fft2d(&input);
        let mut freq_copy = freq.clone();
        let recovered = convolver.ifft2d(&mut freq_copy);

        for (orig, rec) in input.iter().zip(recovered.iter()) {
            assert!((orig - rec).abs() < 1e-4, "Mismatch: {} vs {}", orig, rec);
        }
    }

    #[test]
    fn test_convolution_with_delta() {
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Create test input
        let input: Vec<f32> = (0..width * height)
            .map(|i| {
                if i == width * height / 2 + width / 2 {
                    1.0
                } else {
                    0.0
                }
            })
            .collect();

        // Delta kernel (identity)
        let mut kernel = vec![0.0f32; width * height];
        kernel[0] = 1.0;

        let result = convolver.convolve(&input, &kernel);

        // Result should equal input
        for (inp, res) in input.iter().zip(result.iter()) {
            assert!((inp - res).abs() < 1e-4, "Mismatch: {} vs {}", inp, res);
        }
    }

    #[test]
    fn test_convolution_shift() {
        // A shifted delta kernel should shift the result
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Create input with a single point
        let mut input = vec![0.0f32; width * height];
        let input_x = 5;
        let input_y = 5;
        input[input_y * width + input_x] = 1.0;

        // Delta kernel shifted by (3, 2) - in FFT terms, this is at position (3, 2)
        let shift_x = 3;
        let shift_y = 2;
        let mut kernel = vec![0.0f32; width * height];
        kernel[shift_y * width + shift_x] = 1.0;

        let result = convolver.convolve(&input, &kernel);

        // The point should move to (input_x + shift_x, input_y + shift_y) with wrapping
        let expected_x = (input_x + shift_x) % width;
        let expected_y = (input_y + shift_y) % height;

        // Check that mass is at expected location
        let result_at_expected = result[expected_y * width + expected_x];
        assert!(
            (result_at_expected - 1.0).abs() < 1e-4,
            "Expected 1.0 at ({}, {}), got {}",
            expected_x,
            expected_y,
            result_at_expected
        );

        // Check that total mass is conserved
        let total: f32 = result.iter().sum();
        assert!(
            (total - 1.0).abs() < 1e-4,
            "Total mass should be 1.0, got {}",
            total
        );
    }

    #[test]
    fn test_convolution_blur() {
        // A uniform kernel should blur/average the input
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Create input with a single point
        let mut input = vec![0.0f32; width * height];
        input[8 * width + 8] = 1.0;

        // 3x3 uniform blur kernel (normalized)
        let mut kernel = vec![0.0f32; width * height];
        let kernel_val = 1.0 / 9.0;
        for ky in 0..3 {
            for kx in 0..3 {
                // Wrap kernel around (FFT convention)
                let wy = if ky == 0 { 0 } else { height - (3 - ky) };
                let wx = if kx == 0 { 0 } else { width - (3 - kx) };
                kernel[wy * width + wx] = kernel_val;
            }
        }

        let result = convolver.convolve(&input, &kernel);

        // Total mass should be conserved
        let total: f32 = result.iter().sum();
        assert!(
            (total - 1.0).abs() < 1e-4,
            "Total mass should be 1.0 after blur, got {}",
            total
        );

        // The result should have spread the point mass
        let center_val = result[8 * width + 8];
        assert!(
            center_val < 0.5,
            "Blur should spread mass, center should be < 0.5, got {}",
            center_val
        );
        assert!(
            center_val > 0.05,
            "Center should still have significant mass, got {}",
            center_val
        );
    }

    #[test]
    fn test_convolution_commutative() {
        // Convolution should be commutative: f * g == g * f
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Two different patterns
        let pattern_a: Vec<f32> = (0..width * height)
            .map(|i| ((i * 17) % 100) as f32 / 100.0)
            .collect();
        let pattern_b: Vec<f32> = (0..width * height)
            .map(|i| ((i * 31 + 7) % 100) as f32 / 100.0)
            .collect();

        let result_ab = convolver.convolve(&pattern_a, &pattern_b);
        let result_ba = convolver.convolve(&pattern_b, &pattern_a);

        for i in 0..width * height {
            assert!(
                (result_ab[i] - result_ba[i]).abs() < 1e-4,
                "Convolution not commutative at {}: {} vs {}",
                i,
                result_ab[i],
                result_ba[i]
            );
        }
    }

    #[test]
    fn test_fft_different_sizes() {
        // Test FFT works correctly for different grid sizes
        for &(width, height) in &[(8, 8), (16, 16), (32, 32), (16, 32), (32, 16)] {
            let mut convolver = FftConvolver::new(width, height);

            let input: Vec<f32> = (0..width * height).map(|i| (i % 10) as f32).collect();

            let freq = convolver.fft2d(&input);
            let mut freq_copy = freq.clone();
            let recovered = convolver.ifft2d(&mut freq_copy);

            for (orig, rec) in input.iter().zip(recovered.iter()) {
                assert!(
                    (orig - rec).abs() < 1e-4,
                    "FFT roundtrip failed for {}x{}: {} vs {}",
                    width,
                    height,
                    orig,
                    rec
                );
            }
        }
    }

    /// Direct convolution for testing (matches GPU shader logic).
    fn direct_convolve(
        input: &[f32],
        kernel: &[f32],
        width: usize,
        height: usize,
        kernel_radius: usize,
    ) -> Vec<f32> {
        let kernel_size = 2 * kernel_radius + 1;
        let mut output = vec![0.0f32; width * height];

        for y in 0..height {
            for x in 0..width {
                let mut sum = 0.0f32;
                for ky in 0..kernel_size {
                    for kx in 0..kernel_size {
                        // Offset from center
                        let dx = kx as i32 - kernel_radius as i32;
                        let dy = ky as i32 - kernel_radius as i32;

                        // Source position with wrapping
                        let sx = ((x as i32 + dx + width as i32) % width as i32) as usize;
                        let sy = ((y as i32 + dy + height as i32) % height as i32) as usize;

                        sum += input[sy * width + sx] * kernel[ky * kernel_size + kx];
                    }
                }
                output[y * width + x] = sum;
            }
        }
        output
    }

    #[test]
    fn test_fft_vs_direct_convolution() {
        use crate::compute::Kernel;
        use crate::schema::{KernelConfig, RingConfig};

        let width = 64;
        let height = 64;
        let kernel_radius = 7;

        // Create a Lenia-style kernel
        let kernel_config = KernelConfig {
            radius: 1.0,
            rings: vec![RingConfig {
                amplitude: 1.0,
                distance: 0.5,
                width: 0.15,
            }],
            weight: 1.0,
            mu: 0.15,
            sigma: 0.015,
            source_channel: 0,
            target_channel: 0,
        };

        let kernel = Kernel::from_config(&kernel_config, kernel_radius);

        // Create test input (Gaussian blob in center)
        let mut input = vec![0.0f32; width * height];
        let cx = width / 2;
        let cy = height / 2;
        for y in 0..height {
            for x in 0..width {
                let dx = x as f32 - cx as f32;
                let dy = y as f32 - cy as f32;
                let dist_sq = dx * dx + dy * dy;
                input[y * width + x] = (-dist_sq / 50.0).exp();
            }
        }

        // FFT convolution (padded kernel)
        let padded_kernel = kernel.pad_to_size(width, height);
        let mut fft_conv = FftConvolver::new(width, height);
        let fft_result = fft_conv.convolve(&input, &padded_kernel);

        // Direct convolution (raw kernel)
        let actual_radius = (kernel_config.radius * kernel_radius as f32).round() as usize;
        let direct_result = direct_convolve(&input, &kernel.data, width, height, actual_radius);

        // Compare results
        let mut max_diff = 0.0f32;
        let mut sum_diff_sq = 0.0f32;
        for i in 0..width * height {
            let diff = (fft_result[i] - direct_result[i]).abs();
            max_diff = max_diff.max(diff);
            sum_diff_sq += diff * diff;
        }
        let rms_diff = (sum_diff_sq / (width * height) as f32).sqrt();

        println!(
            "FFT vs Direct convolution: max_diff={:.6}, rms_diff={:.6}",
            max_diff, rms_diff
        );

        // They should match closely
        assert!(
            max_diff < 1e-4,
            "FFT and direct convolution differ too much: max_diff={}",
            max_diff
        );
    }
}
