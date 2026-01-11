//! FFT-based 2D convolution for efficient kernel application.
//!
//! Uses rustfft for O(N log N) convolution instead of O(N * K^2) direct convolution.

use std::sync::Arc;

use num_complex::Complex;
use rustfft::{Fft, FftPlanner};

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
}
