//! Direct convolution for parameter embedding mode.
//!
//! When parameters vary spatially (per-cell), FFT-based convolution cannot be used
//! because it applies a uniform kernel everywhere. Direct convolution allows
//! each cell to use its own parameter values for the growth function.
//!
//! # Complexity
//!
//! Direct convolution has O(N * K^2) complexity where N is grid size and K is kernel diameter.
//! This is slower than FFT's O(N log N) for large kernels, but is required for
//! spatially-varying parameters.

use crate::schema::ParameterGrid;

use super::{Kernel, wrap_coord};

/// Perform direct 2D convolution with periodic boundary conditions.
///
/// This is the basic convolution without growth function application.
/// Used when parameters are uniform (standard mode).
#[inline]
pub fn convolve_direct(input: &[f32], kernel: &Kernel, width: usize, height: usize) -> Vec<f32> {
    let mut output = vec![0.0f32; width * height];
    convolve_direct_into(input, kernel, width, height, &mut output);
    output
}

/// Perform direct convolution into pre-allocated buffer.
#[inline]
pub fn convolve_direct_into(
    input: &[f32],
    kernel: &Kernel,
    width: usize,
    height: usize,
    output: &mut [f32],
) {
    let k_size = kernel.size;
    let k_half = k_size / 2;
    let k_data = &kernel.data;

    for y in 0..height {
        for x in 0..width {
            let mut sum = 0.0f32;

            for ky in 0..k_size {
                for kx in 0..k_size {
                    let k_val = k_data[ky * k_size + kx];
                    if k_val == 0.0 {
                        continue;
                    }

                    // Sample position with periodic wrapping
                    let sx = wrap_coord(x as i32 + kx as i32 - k_half as i32, width);
                    let sy = wrap_coord(y as i32 + ky as i32 - k_half as i32, height);

                    sum += input[sy * width + sx] * k_val;
                }
            }

            output[y * width + x] = sum;
        }
    }
}

/// Perform convolution and apply growth function with spatially-varying parameters.
///
/// This is the key function for parameter embedding mode. Each output cell
/// uses its own mu and sigma parameters for the growth function.
pub fn convolve_growth_embedded(
    input: &[f32],
    kernel: &Kernel,
    params: &ParameterGrid,
    width: usize,
    height: usize,
) -> Vec<f32> {
    let mut output = vec![0.0f32; width * height];
    convolve_growth_embedded_into(input, kernel, params, width, height, &mut output);
    output
}

/// Perform convolution and growth with embedded parameters into pre-allocated buffer.
pub fn convolve_growth_embedded_into(
    input: &[f32],
    kernel: &Kernel,
    params: &ParameterGrid,
    width: usize,
    height: usize,
    output: &mut [f32],
) {
    let k_size = kernel.size;
    let k_half = k_size / 2;
    let k_data = &kernel.data;

    for y in 0..height {
        for x in 0..width {
            let idx = y * width + x;

            // Convolution sum
            let mut conv_sum = 0.0f32;
            for ky in 0..k_size {
                for kx in 0..k_size {
                    let k_val = k_data[ky * k_size + kx];
                    if k_val == 0.0 {
                        continue;
                    }

                    let sx = wrap_coord(x as i32 + kx as i32 - k_half as i32, width);
                    let sy = wrap_coord(y as i32 + ky as i32 - k_half as i32, height);

                    conv_sum += input[sy * width + sx] * k_val;
                }
            }

            // Get per-cell parameters
            let cell_params = params.get_idx(idx);

            // Apply growth function with cell-specific parameters
            // G(u; mu, sigma) = 2 * exp(-(u - mu)^2 / (2*sigma^2)) - 1
            let diff = conv_sum - cell_params.mu;
            let sigma_sq_2 = 2.0 * cell_params.sigma * cell_params.sigma;
            let g = 2.0 * (-diff * diff / sigma_sq_2).exp() - 1.0;

            // Apply cell-specific weight
            output[idx] = cell_params.weight * g;
        }
    }
}

/// Perform convolution, growth, and accumulate into target with embedded parameters.
///
/// This combines convolution, growth function, and accumulation in one pass
/// for efficiency. Used during the affinity computation stage.
pub fn convolve_growth_accumulate_embedded(
    input: &[f32],
    kernel: &Kernel,
    params: &ParameterGrid,
    target: &mut [f32],
    width: usize,
    height: usize,
) {
    let k_size = kernel.size;
    let k_half = k_size / 2;
    let k_data = &kernel.data;

    for y in 0..height {
        for x in 0..width {
            let idx = y * width + x;

            // Convolution sum
            let mut conv_sum = 0.0f32;
            for ky in 0..k_size {
                for kx in 0..k_size {
                    let k_val = k_data[ky * k_size + kx];
                    if k_val == 0.0 {
                        continue;
                    }

                    let sx = wrap_coord(x as i32 + kx as i32 - k_half as i32, width);
                    let sy = wrap_coord(y as i32 + ky as i32 - k_half as i32, height);

                    conv_sum += input[sy * width + sx] * k_val;
                }
            }

            // Get per-cell parameters
            let cell_params = params.get_idx(idx);

            // Apply growth function with cell-specific parameters
            let diff = conv_sum - cell_params.mu;
            let sigma_sq_2 = 2.0 * cell_params.sigma * cell_params.sigma;
            let g = 2.0 * (-diff * diff / sigma_sq_2).exp() - 1.0;

            // Accumulate with cell-specific weight
            target[idx] += cell_params.weight * g;
        }
    }
}

/// Optimized direct convolution using sliding window for cache efficiency.
///
/// This version processes rows in a cache-friendly manner for larger kernels.
pub fn convolve_direct_optimized(
    input: &[f32],
    kernel: &Kernel,
    width: usize,
    height: usize,
) -> Vec<f32> {
    let mut output = vec![0.0f32; width * height];
    convolve_direct_optimized_into(input, kernel, width, height, &mut output);
    output
}

/// Optimized direct convolution into pre-allocated buffer.
pub fn convolve_direct_optimized_into(
    input: &[f32],
    kernel: &Kernel,
    width: usize,
    height: usize,
    output: &mut [f32],
) {
    let k_size = kernel.size;
    let k_half = k_size / 2;

    // For small kernels, use basic implementation
    if k_size <= 5 {
        convolve_direct_into(input, kernel, width, height, output);
        return;
    }

    // Precompute row indices for wrapping
    let row_indices: Vec<Vec<usize>> = (0..height)
        .map(|y| {
            (0..k_size)
                .map(|ky| wrap_coord(y as i32 + ky as i32 - k_half as i32, height))
                .collect()
        })
        .collect();

    // Process with better cache utilization
    for y in 0..height {
        let src_rows = &row_indices[y];

        for x in 0..width {
            let mut sum = 0.0f32;

            for (ky, &sy) in src_rows.iter().enumerate() {
                let k_row = &kernel.data[ky * k_size..(ky + 1) * k_size];
                let input_row = &input[sy * width..];

                for (kx, &k_val) in k_row.iter().enumerate() {
                    if k_val == 0.0 {
                        continue;
                    }

                    let sx = wrap_coord(x as i32 + kx as i32 - k_half as i32, width);
                    sum += input_row[sx] * k_val;
                }
            }

            output[y * width + x] = sum;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{KernelConfig, RingConfig};

    fn simple_kernel() -> Kernel {
        // 3x3 averaging kernel
        Kernel {
            data: vec![
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
                1.0 / 9.0,
            ],
            size: 3,
            source_channel: 0,
            target_channel: 0,
            weight: 1.0,
            mu: 0.15,
            sigma: 0.015,
        }
    }

    #[test]
    fn test_convolve_direct_uniform() {
        let kernel = simple_kernel();
        let width = 8;
        let height = 8;

        // Uniform input should give uniform output
        let input = vec![1.0f32; width * height];
        let output = convolve_direct(&input, &kernel, width, height);

        for &v in &output {
            assert!(
                (v - 1.0).abs() < 1e-6,
                "Uniform input should give uniform output"
            );
        }
    }

    #[test]
    fn test_convolve_direct_impulse() {
        let kernel = simple_kernel();
        let width = 16;
        let height = 16;

        // Single impulse in center
        let mut input = vec![0.0f32; width * height];
        input[8 * width + 8] = 9.0; // 9.0 so output is 1.0 after averaging

        let output = convolve_direct(&input, &kernel, width, height);

        // Should spread to 3x3 region around center
        for y in 7..=9 {
            for x in 7..=9 {
                assert!(
                    (output[y * width + x] - 1.0).abs() < 1e-6,
                    "3x3 region should have value 1.0"
                );
            }
        }
    }

    #[test]
    fn test_convolve_direct_wrap() {
        let kernel = simple_kernel();
        let width = 8;
        let height = 8;

        // Impulse at corner
        let mut input = vec![0.0f32; width * height];
        input[0] = 9.0; // Top-left corner

        let output = convolve_direct(&input, &kernel, width, height);

        // Should wrap around to all four corners
        assert!(output[0] > 0.9, "Top-left should receive contribution");
        assert!(
            output[width - 1] > 0.9,
            "Top-right should wrap and receive contribution"
        );
        assert!(
            output[(height - 1) * width] > 0.9,
            "Bottom-left should wrap"
        );
        assert!(
            output[(height - 1) * width + (width - 1)] > 0.9,
            "Bottom-right should wrap"
        );
    }

    #[test]
    fn test_convolve_growth_embedded() {
        let width = 8;
        let height = 8;

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
        let kernel = Kernel::from_config(&kernel_config, 5);

        // Uniform input
        let input = vec![0.15f32; width * height]; // At mu = 0.15

        // Create parameter grid with default params (mu = 0.15)
        let params = ParameterGrid::from_defaults(width, height);

        let output = convolve_growth_embedded(&input, &kernel, &params, width, height);

        // With uniform input at mu and normalized kernel, convolution gives mu,
        // and growth function at optimal returns 1.0
        for &v in &output {
            // Output should be close to weight * 1.0 = 1.0
            assert!(v > 0.5, "Growth at optimal should be positive: {}", v);
        }
    }

    #[test]
    fn test_convolve_growth_embedded_varying_params() {
        let width = 16;
        let height = 16;

        let kernel_config = KernelConfig::default();
        let kernel = Kernel::from_config(&kernel_config, 5);

        // Uniform input
        let input = vec![0.2f32; width * height];

        // Create parameter grid with different mu values
        let mut params = ParameterGrid::from_defaults(width, height);

        // Left half: mu = 0.2 (optimal for input)
        // Right half: mu = 0.5 (suboptimal for input)
        for y in 0..height {
            for x in 0..width {
                if x < width / 2 {
                    params.get_mut(x, y).mu = 0.2;
                } else {
                    params.get_mut(x, y).mu = 0.5;
                }
            }
        }

        let output = convolve_growth_embedded(&input, &kernel, &params, width, height);

        // Left half should have higher values (closer to optimal)
        let mut left_sum = 0.0f32;
        let mut right_sum = 0.0f32;

        for y in 0..height {
            for x in 0..width / 2 {
                left_sum += output[y * width + x];
            }
            for x in width / 2..width {
                right_sum += output[y * width + x];
            }
        }

        let left_avg = left_sum / (width * height / 2) as f32;
        let right_avg = right_sum / (width * height / 2) as f32;

        assert!(
            left_avg > right_avg,
            "Left (optimal mu) should have higher growth than right: {} vs {}",
            left_avg,
            right_avg
        );
    }

    #[test]
    fn test_optimized_matches_basic() {
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
        let kernel = Kernel::from_config(&kernel_config, 7);

        let width = 32;
        let height = 32;

        // Random-ish input
        let input: Vec<f32> = (0..width * height)
            .map(|i| ((i * 17) % 100) as f32 / 100.0)
            .collect();

        let basic = convolve_direct(&input, &kernel, width, height);
        let optimized = convolve_direct_optimized(&input, &kernel, width, height);

        for i in 0..width * height {
            assert!(
                (basic[i] - optimized[i]).abs() < 1e-5,
                "Mismatch at {}: {} vs {}",
                i,
                basic[i],
                optimized[i]
            );
        }
    }
}
