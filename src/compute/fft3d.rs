//! FFT-based 3D convolution for efficient kernel application.
//!
//! Uses rustfft for O(N log N) convolution instead of O(N * K^3) direct convolution.
//! 3D FFT is performed via separable 1D FFTs along each axis.

use std::sync::Arc;

use num_complex::Complex;
use rustfft::{Fft, FftPlanner};

use super::Kernel3D;

/// Pre-allocated scratch buffers for 3D FFT operations.
pub struct Fft3DScratch {
    /// Scratch for X-axis FFT
    pub x_scratch: Vec<Complex<f32>>,
    /// Scratch for Y-axis FFT
    pub y_scratch: Vec<Complex<f32>>,
    /// Scratch for Z-axis FFT
    pub z_scratch: Vec<Complex<f32>>,
    /// Input frequency buffer
    pub input_freq: Vec<Complex<f32>>,
    /// Result frequency buffer
    pub result_freq: Vec<Complex<f32>>,
    /// Line buffer for axis extraction
    pub line_buffer: Vec<Complex<f32>>,
}

impl Fft3DScratch {
    /// Create new scratch buffers sized for the given convolver.
    pub fn new(convolver: &CachedConvolver3D) -> Self {
        let x_scratch_len = convolver
            .fft_x
            .get_inplace_scratch_len()
            .max(convolver.ifft_x.get_inplace_scratch_len());
        let y_scratch_len = convolver
            .fft_y
            .get_inplace_scratch_len()
            .max(convolver.ifft_y.get_inplace_scratch_len());
        let z_scratch_len = convolver
            .fft_z
            .get_inplace_scratch_len()
            .max(convolver.ifft_z.get_inplace_scratch_len());

        let grid_size = convolver.width * convolver.height * convolver.depth;
        let max_dim = convolver.width.max(convolver.height).max(convolver.depth);

        Self {
            x_scratch: vec![Complex::new(0.0, 0.0); x_scratch_len],
            y_scratch: vec![Complex::new(0.0, 0.0); y_scratch_len],
            z_scratch: vec![Complex::new(0.0, 0.0); z_scratch_len],
            input_freq: vec![Complex::new(0.0, 0.0); grid_size],
            result_freq: vec![Complex::new(0.0, 0.0); grid_size],
            line_buffer: vec![Complex::new(0.0, 0.0); max_dim],
        }
    }
}

/// Precomputed 3D kernel in frequency domain for efficient repeated convolution.
#[derive(Clone)]
pub struct FrequencyKernel3D {
    pub data: Vec<Complex<f32>>,
    pub source_channel: usize,
    pub target_channel: usize,
    pub weight: f32,
    pub mu: f32,
    pub sigma: f32,
}

impl FrequencyKernel3D {
    /// Create frequency-domain kernel from spatial kernel.
    #[allow(clippy::too_many_arguments)]
    pub fn from_spatial(
        kernel_data: &[f32],
        width: usize,
        height: usize,
        depth: usize,
        source_channel: usize,
        target_channel: usize,
        weight: f32,
        mu: f32,
        sigma: f32,
    ) -> Self {
        let mut convolver = FftConvolver3D::new(width, height, depth);
        let data = convolver.fft3d(kernel_data);

        Self {
            data,
            source_channel,
            target_channel,
            weight,
            mu,
            sigma,
        }
    }

    /// Create from Kernel3D struct.
    pub fn from_kernel(kernel: &Kernel3D, width: usize, height: usize, depth: usize) -> Self {
        let padded = kernel.pad_to_size(width, height, depth);
        Self::from_spatial(
            &padded,
            width,
            height,
            depth,
            kernel.source_channel,
            kernel.target_channel,
            kernel.weight,
            kernel.mu,
            kernel.sigma,
        )
    }
}

/// Basic 3D FFT convolver (allocates on each call).
pub struct FftConvolver3D {
    width: usize,
    height: usize,
    depth: usize,
}

impl FftConvolver3D {
    /// Create a new 3D FFT convolver for the given grid dimensions.
    pub fn new(width: usize, height: usize, depth: usize) -> Self {
        Self {
            width,
            height,
            depth,
        }
    }

    /// Perform 3D FFT on real-valued input.
    /// Returns complex frequency-domain representation.
    pub fn fft3d(&mut self, input: &[f32]) -> Vec<Complex<f32>> {
        assert_eq!(input.len(), self.width * self.height * self.depth);

        let mut data: Vec<Complex<f32>> = input.iter().map(|&x| Complex::new(x, 0.0)).collect();

        let mut planner = FftPlanner::new();
        let fft_x = planner.plan_fft_forward(self.width);
        let fft_y = planner.plan_fft_forward(self.height);
        let fft_z = planner.plan_fft_forward(self.depth);

        let slice_size = self.width * self.height;

        // X-axis FFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut data[start..start + self.width];
                fft_x.process(row);
            }
        }

        // Y-axis FFT (along columns within each Z slice)
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column
                for y in 0..self.height {
                    col_buffer[y] = data[z * slice_size + y * self.width + x];
                }
                fft_y.process(&mut col_buffer);
                // Write back
                for y in 0..self.height {
                    data[z * slice_size + y * self.width + x] = col_buffer[y];
                }
            }
        }

        // Z-axis FFT (along depth)
        let mut depth_buffer = vec![Complex::new(0.0, 0.0); self.depth];
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    depth_buffer[z] = data[z * slice_size + y * self.width + x];
                }
                fft_z.process(&mut depth_buffer);
                // Write back
                for z in 0..self.depth {
                    data[z * slice_size + y * self.width + x] = depth_buffer[z];
                }
            }
        }

        data
    }

    /// Perform inverse 3D FFT, returning real values.
    pub fn ifft3d(&mut self, input: &mut [Complex<f32>]) -> Vec<f32> {
        assert_eq!(input.len(), self.width * self.height * self.depth);

        let mut planner = FftPlanner::new();
        let ifft_x = planner.plan_fft_inverse(self.width);
        let ifft_y = planner.plan_fft_inverse(self.height);
        let ifft_z = planner.plan_fft_inverse(self.depth);

        let slice_size = self.width * self.height;

        // Z-axis IFFT (along depth)
        let mut depth_buffer = vec![Complex::new(0.0, 0.0); self.depth];
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    depth_buffer[z] = input[z * slice_size + y * self.width + x];
                }
                ifft_z.process(&mut depth_buffer);
                // Write back
                for z in 0..self.depth {
                    input[z * slice_size + y * self.width + x] = depth_buffer[z];
                }
            }
        }

        // Y-axis IFFT (along columns within each Z slice)
        let mut col_buffer = vec![Complex::new(0.0, 0.0); self.height];
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column
                for y in 0..self.height {
                    col_buffer[y] = input[z * slice_size + y * self.width + x];
                }
                ifft_y.process(&mut col_buffer);
                // Write back
                for y in 0..self.height {
                    input[z * slice_size + y * self.width + x] = col_buffer[y];
                }
            }
        }

        // X-axis IFFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut input[start..start + self.width];
                ifft_x.process(row);
            }
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height * self.depth) as f32;
        input.iter().map(|c| c.re * scale).collect()
    }

    /// Convolve input grid with kernel (both in spatial domain).
    pub fn convolve(&mut self, input: &[f32], kernel: &[f32]) -> Vec<f32> {
        let input_freq = self.fft3d(input);
        let kernel_freq = self.fft3d(kernel);

        let mut result_freq: Vec<Complex<f32>> = input_freq
            .iter()
            .zip(kernel_freq.iter())
            .map(|(a, b)| a * b)
            .collect();

        self.ifft3d(&mut result_freq)
    }
}

/// Optimized 3D convolver with precomputed frequency-domain kernels and cached FFT plans.
pub struct CachedConvolver3D {
    width: usize,
    height: usize,
    depth: usize,
    kernels: Vec<FrequencyKernel3D>,
    // Cached FFT plans
    fft_x: Arc<dyn Fft<f32>>,
    fft_y: Arc<dyn Fft<f32>>,
    fft_z: Arc<dyn Fft<f32>>,
    ifft_x: Arc<dyn Fft<f32>>,
    ifft_y: Arc<dyn Fft<f32>>,
    ifft_z: Arc<dyn Fft<f32>>,
}

impl CachedConvolver3D {
    /// Create convolver with precomputed kernels and cached FFT plans.
    pub fn new(width: usize, height: usize, depth: usize, kernels: Vec<FrequencyKernel3D>) -> Self {
        let mut planner = FftPlanner::new();
        let fft_x = planner.plan_fft_forward(width);
        let fft_y = planner.plan_fft_forward(height);
        let fft_z = planner.plan_fft_forward(depth);
        let ifft_x = planner.plan_fft_inverse(width);
        let ifft_y = planner.plan_fft_inverse(height);
        let ifft_z = planner.plan_fft_inverse(depth);

        Self {
            width,
            height,
            depth,
            kernels,
            fft_x,
            fft_y,
            fft_z,
            ifft_x,
            ifft_y,
            ifft_z,
        }
    }

    /// Get reference to precomputed kernels.
    pub fn kernels(&self) -> &[FrequencyKernel3D] {
        &self.kernels
    }

    /// Convolve input with precomputed kernel using scratch buffers.
    #[inline]
    pub fn convolve_with_kernel_scratch(
        &self,
        input: &[f32],
        kernel_idx: usize,
        scratch: &mut Fft3DScratch,
        output: &mut [f32],
    ) {
        // Forward 3D FFT
        self.fft3d_into_scratch(input, scratch);

        let kernel = &self.kernels[kernel_idx];

        // Pointwise multiplication
        for (i, (inp, k)) in scratch
            .input_freq
            .iter()
            .zip(kernel.data.iter())
            .enumerate()
        {
            scratch.result_freq[i] = inp * k;
        }

        // Inverse 3D FFT
        self.ifft3d_into_scratch(scratch, output);
    }

    /// Perform 3D FFT using cached plans into scratch.input_freq.
    fn fft3d_into_scratch(&self, input: &[f32], scratch: &mut Fft3DScratch) {
        let slice_size = self.width * self.height;

        // Convert input to complex
        for (i, &x) in input.iter().enumerate() {
            scratch.input_freq[i] = Complex::new(x, 0.0);
        }

        // X-axis FFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut scratch.input_freq[start..start + self.width];
                self.fft_x.process_with_scratch(row, &mut scratch.x_scratch);
            }
        }

        // Y-axis FFT (along columns within each Z slice)
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column into line buffer
                for y in 0..self.height {
                    scratch.line_buffer[y] =
                        scratch.input_freq[z * slice_size + y * self.width + x];
                }
                self.fft_y.process_with_scratch(
                    &mut scratch.line_buffer[..self.height],
                    &mut scratch.y_scratch,
                );
                // Write back
                for y in 0..self.height {
                    scratch.input_freq[z * slice_size + y * self.width + x] =
                        scratch.line_buffer[y];
                }
            }
        }

        // Z-axis FFT (along depth)
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    scratch.line_buffer[z] =
                        scratch.input_freq[z * slice_size + y * self.width + x];
                }
                self.fft_z.process_with_scratch(
                    &mut scratch.line_buffer[..self.depth],
                    &mut scratch.z_scratch,
                );
                // Write back
                for z in 0..self.depth {
                    scratch.input_freq[z * slice_size + y * self.width + x] =
                        scratch.line_buffer[z];
                }
            }
        }
    }

    /// Perform inverse 3D FFT using cached plans from scratch.result_freq.
    fn ifft3d_into_scratch(&self, scratch: &mut Fft3DScratch, output: &mut [f32]) {
        let slice_size = self.width * self.height;

        // Z-axis IFFT (along depth)
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    scratch.line_buffer[z] =
                        scratch.result_freq[z * slice_size + y * self.width + x];
                }
                self.ifft_z.process_with_scratch(
                    &mut scratch.line_buffer[..self.depth],
                    &mut scratch.z_scratch,
                );
                // Write back
                for z in 0..self.depth {
                    scratch.result_freq[z * slice_size + y * self.width + x] =
                        scratch.line_buffer[z];
                }
            }
        }

        // Y-axis IFFT (along columns within each Z slice)
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column
                for y in 0..self.height {
                    scratch.line_buffer[y] =
                        scratch.result_freq[z * slice_size + y * self.width + x];
                }
                self.ifft_y.process_with_scratch(
                    &mut scratch.line_buffer[..self.height],
                    &mut scratch.y_scratch,
                );
                // Write back
                for y in 0..self.height {
                    scratch.result_freq[z * slice_size + y * self.width + x] =
                        scratch.line_buffer[y];
                }
            }
        }

        // X-axis IFFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut scratch.result_freq[start..start + self.width];
                self.ifft_x
                    .process_with_scratch(row, &mut scratch.x_scratch);
            }
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height * self.depth) as f32;
        for (i, c) in scratch.result_freq.iter().enumerate() {
            output[i] = c.re * scale;
        }
    }

    /// Perform 3D FFT using cached plans (legacy API).
    #[allow(dead_code)]
    fn fft3d_into(&self, input: &[f32], output: &mut [Complex<f32>], scratch: &mut Fft3DScratch) {
        let slice_size = self.width * self.height;

        // Convert input to complex
        for (i, &x) in input.iter().enumerate() {
            output[i] = Complex::new(x, 0.0);
        }

        // X-axis FFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut output[start..start + self.width];
                self.fft_x.process_with_scratch(row, &mut scratch.x_scratch);
            }
        }

        // Y-axis FFT (along columns within each Z slice)
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column into line buffer
                for y in 0..self.height {
                    scratch.line_buffer[y] = output[z * slice_size + y * self.width + x];
                }
                self.fft_y.process_with_scratch(
                    &mut scratch.line_buffer[..self.height],
                    &mut scratch.y_scratch,
                );
                // Write back
                for y in 0..self.height {
                    output[z * slice_size + y * self.width + x] = scratch.line_buffer[y];
                }
            }
        }

        // Z-axis FFT (along depth)
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    scratch.line_buffer[z] = output[z * slice_size + y * self.width + x];
                }
                self.fft_z.process_with_scratch(
                    &mut scratch.line_buffer[..self.depth],
                    &mut scratch.z_scratch,
                );
                // Write back
                for z in 0..self.depth {
                    output[z * slice_size + y * self.width + x] = scratch.line_buffer[z];
                }
            }
        }
    }

    /// Perform inverse 3D FFT using cached plans.
    #[allow(dead_code)]
    fn ifft3d_into(
        &self,
        freq_data: &mut [Complex<f32>],
        output: &mut [f32],
        scratch: &mut Fft3DScratch,
    ) {
        let slice_size = self.width * self.height;

        // Z-axis IFFT (along depth)
        for y in 0..self.height {
            for x in 0..self.width {
                // Extract depth line
                for z in 0..self.depth {
                    scratch.line_buffer[z] = freq_data[z * slice_size + y * self.width + x];
                }
                self.ifft_z.process_with_scratch(
                    &mut scratch.line_buffer[..self.depth],
                    &mut scratch.z_scratch,
                );
                // Write back
                for z in 0..self.depth {
                    freq_data[z * slice_size + y * self.width + x] = scratch.line_buffer[z];
                }
            }
        }

        // Y-axis IFFT (along columns within each Z slice)
        for z in 0..self.depth {
            for x in 0..self.width {
                // Extract column
                for y in 0..self.height {
                    scratch.line_buffer[y] = freq_data[z * slice_size + y * self.width + x];
                }
                self.ifft_y.process_with_scratch(
                    &mut scratch.line_buffer[..self.height],
                    &mut scratch.y_scratch,
                );
                // Write back
                for y in 0..self.height {
                    freq_data[z * slice_size + y * self.width + x] = scratch.line_buffer[y];
                }
            }
        }

        // X-axis IFFT (along rows)
        for z in 0..self.depth {
            for y in 0..self.height {
                let start = z * slice_size + y * self.width;
                let row = &mut freq_data[start..start + self.width];
                self.ifft_x
                    .process_with_scratch(row, &mut scratch.x_scratch);
            }
        }

        // Normalize and extract real part
        let scale = 1.0 / (self.width * self.height * self.depth) as f32;
        for (i, c) in freq_data.iter().enumerate() {
            output[i] = c.re * scale;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fft3d_identity() {
        let size = 8;
        let mut convolver = FftConvolver3D::new(size, size, size);

        let input: Vec<f32> = (0..size * size * size).map(|i| (i % 10) as f32).collect();

        let freq = convolver.fft3d(&input);
        let mut freq_copy = freq.clone();
        let recovered = convolver.ifft3d(&mut freq_copy);

        for (orig, rec) in input.iter().zip(recovered.iter()) {
            assert!((orig - rec).abs() < 1e-4, "Mismatch: {} vs {}", orig, rec);
        }
    }

    #[test]
    fn test_convolution3d_with_delta() {
        let size = 8;
        let mut convolver = FftConvolver3D::new(size, size, size);

        // Create test input with single point
        let mut input = vec![0.0f32; size * size * size];
        let center = size / 2;
        input[center * size * size + center * size + center] = 1.0;

        // Delta kernel (identity)
        let mut kernel = vec![0.0f32; size * size * size];
        kernel[0] = 1.0;

        let result = convolver.convolve(&input, &kernel);

        // Result should equal input
        for (inp, res) in input.iter().zip(result.iter()) {
            assert!((inp - res).abs() < 1e-4, "Mismatch: {} vs {}", inp, res);
        }
    }

    #[test]
    fn test_convolution3d_mass_conservation() {
        let size = 8;
        let mut convolver = FftConvolver3D::new(size, size, size);

        // Create Gaussian input
        let mut input = vec![0.0f32; size * size * size];
        let center = size as f32 / 2.0;
        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    let dx = x as f32 - center;
                    let dy = y as f32 - center;
                    let dz = z as f32 - center;
                    let dist_sq = dx * dx + dy * dy + dz * dz;
                    input[z * size * size + y * size + x] = (-dist_sq / 8.0).exp();
                }
            }
        }

        let initial_mass: f32 = input.iter().sum();

        // Normalized blur kernel
        let mut kernel = vec![0.0f32; size * size * size];
        let kernel_val = 1.0 / 27.0; // 3x3x3 uniform
        for kz in 0..3 {
            for ky in 0..3 {
                for kx in 0..3 {
                    let wz = if kz == 0 { 0 } else { size - (3 - kz) };
                    let wy = if ky == 0 { 0 } else { size - (3 - ky) };
                    let wx = if kx == 0 { 0 } else { size - (3 - kx) };
                    kernel[wz * size * size + wy * size + wx] = kernel_val;
                }
            }
        }

        let result = convolver.convolve(&input, &kernel);
        let final_mass: f32 = result.iter().sum();

        assert!(
            (initial_mass - final_mass).abs() < 1e-3,
            "Mass not conserved: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_cached_convolver3d() {
        use crate::schema::{KernelConfig, RingConfig};

        let size = 16;
        let kernel_radius = 4;

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

        let kernel = Kernel3D::from_config(&kernel_config, kernel_radius);
        let freq_kernel = FrequencyKernel3D::from_kernel(&kernel, size, size, size);

        let convolver = CachedConvolver3D::new(size, size, size, vec![freq_kernel]);
        let mut scratch = Fft3DScratch::new(&convolver);

        // Create test input
        let mut input = vec![0.0f32; size * size * size];
        let center = size / 2;
        input[center * size * size + center * size + center] = 1.0;

        let mut output = vec![0.0f32; size * size * size];
        convolver.convolve_with_kernel_scratch(&input, 0, &mut scratch, &mut output);

        // Verify output has values
        let total: f32 = output.iter().sum();
        assert!(total > 0.0, "Convolution should produce non-zero output");

        // Mass should be approximately conserved (kernel is normalized)
        let input_mass: f32 = input.iter().sum();
        assert!(
            (total - input_mass).abs() < 0.01,
            "Mass should be ~conserved: {} -> {}",
            input_mass,
            total
        );
    }
}
