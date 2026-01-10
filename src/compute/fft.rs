//! FFT-based 2D convolution for efficient kernel application.
//!
//! Uses rustfft for O(N log N) convolution instead of O(N * K^2) direct convolution.

use num_complex::Complex;
use rustfft::FftPlanner;

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

/// Optimized convolver with precomputed frequency-domain kernels.
pub struct CachedConvolver {
    width: usize,
    height: usize,
    kernels: Vec<FrequencyKernel>,
}

impl CachedConvolver {
    /// Create convolver with precomputed kernels.
    pub fn new(width: usize, height: usize, kernels: Vec<FrequencyKernel>) -> Self {
        Self {
            width,
            height,
            kernels,
        }
    }

    /// Get reference to precomputed kernels.
    pub fn kernels(&self) -> &[FrequencyKernel] {
        &self.kernels
    }

    /// Convolve input with precomputed kernel at given index.
    pub fn convolve_with_kernel(&self, input: &[f32], kernel_idx: usize) -> Vec<f32> {
        let mut convolver = FftConvolver::new(self.width, self.height);
        let input_freq = convolver.fft2d(input);

        let kernel = &self.kernels[kernel_idx];

        // Pointwise multiplication
        let mut result_freq: Vec<Complex<f32>> = input_freq
            .iter()
            .zip(kernel.data.iter())
            .map(|(a, b)| a * b)
            .collect();

        convolver.ifft2d(&mut result_freq)
    }

    /// Convolve input grid with all kernels for a given source channel.
    /// Returns vector of (target_channel, weight, mu, sigma, convolution_result).
    pub fn convolve_channel(
        &self,
        input: &[f32],
        source_channel: usize,
    ) -> Vec<(usize, f32, f32, f32, Vec<f32>)> {
        let mut convolver = FftConvolver::new(self.width, self.height);
        let input_freq = convolver.fft2d(input);

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

                let mut conv = FftConvolver::new(self.width, self.height);
                let result = conv.ifft2d(&mut result_freq);

                (kernel.target_channel, kernel.weight, kernel.mu, kernel.sigma, result)
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
            assert!(
                (orig - rec).abs() < 1e-4,
                "Mismatch: {} vs {}",
                orig,
                rec
            );
        }
    }

    #[test]
    fn test_convolution_with_delta() {
        let width = 16;
        let height = 16;
        let mut convolver = FftConvolver::new(width, height);

        // Create test input
        let input: Vec<f32> = (0..width * height)
            .map(|i| if i == width * height / 2 + width / 2 { 1.0 } else { 0.0 })
            .collect();

        // Delta kernel (identity)
        let mut kernel = vec![0.0f32; width * height];
        kernel[0] = 1.0;

        let result = convolver.convolve(&input, &kernel);

        // Result should equal input
        for (inp, res) in input.iter().zip(result.iter()) {
            assert!(
                (inp - res).abs() < 1e-4,
                "Mismatch: {} vs {}",
                inp,
                res
            );
        }
    }
}
