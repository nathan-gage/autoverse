//! Gradient computation using Sobel filters.
//!
//! Computes spatial gradients for flow field calculation.

/// Sobel filter kernels for gradient computation.
/// These are the standard 3x3 Sobel operators.
const SOBEL_X: [[f32; 3]; 3] = [[-1.0, 0.0, 1.0], [-2.0, 0.0, 2.0], [-1.0, 0.0, 1.0]];

const SOBEL_Y: [[f32; 3]; 3] = [[-1.0, -2.0, -1.0], [0.0, 0.0, 0.0], [1.0, 2.0, 1.0]];

/// Compute gradient of a 2D grid using Sobel filters.
/// Returns (gradient_x, gradient_y) as flat vectors.
///
/// Uses periodic boundary conditions (wraps at edges).
pub fn sobel_gradient(grid: &[f32], width: usize, height: usize) -> (Vec<f32>, Vec<f32>) {
    let mut grad_x = vec![0.0f32; width * height];
    let mut grad_y = vec![0.0f32; width * height];

    for y in 0..height {
        for x in 0..width {
            let mut gx = 0.0f32;
            let mut gy = 0.0f32;

            // Apply 3x3 Sobel kernels with periodic boundary
            for ky in 0..3 {
                for kx in 0..3 {
                    let sx = (x + kx + width - 1) % width;
                    let sy = (y + ky + height - 1) % height;
                    let val = grid[sy * width + sx];

                    gx += SOBEL_X[ky][kx] * val;
                    gy += SOBEL_Y[ky][kx] * val;
                }
            }

            // Normalize by kernel sum (optional, but keeps gradients in reasonable range)
            // Sobel normalization factor is typically 1/8 or 1/4
            grad_x[y * width + x] = gx * 0.125;
            grad_y[y * width + x] = gy * 0.125;
        }
    }

    (grad_x, grad_y)
}

/// Compute gradient magnitude from gradient components.
pub fn gradient_magnitude(grad_x: &[f32], grad_y: &[f32]) -> Vec<f32> {
    grad_x
        .iter()
        .zip(grad_y.iter())
        .map(|(&gx, &gy)| (gx * gx + gy * gy).sqrt())
        .collect()
}

/// Optimized Sobel gradient using SIMD-friendly memory access patterns.
/// Processes rows in chunks for better cache utilization.
#[inline]
pub fn sobel_gradient_fast(grid: &[f32], width: usize, height: usize) -> (Vec<f32>, Vec<f32>) {
    let mut grad_x = vec![0.0f32; width * height];
    let mut grad_y = vec![0.0f32; width * height];

    // Process in row-major order for cache efficiency
    for y in 0..height {
        let y_prev = (y + height - 1) % height;
        let y_next = (y + 1) % height;

        let row_prev = y_prev * width;
        let row_curr = y * width;
        let row_next = y_next * width;

        for x in 0..width {
            let x_prev = (x + width - 1) % width;
            let x_next = (x + 1) % width;

            // Fetch values with optimized memory access
            let tl = grid[row_prev + x_prev];
            let tc = grid[row_prev + x];
            let tr = grid[row_prev + x_next];
            let ml = grid[row_curr + x_prev];
            let mr = grid[row_curr + x_next];
            let bl = grid[row_next + x_prev];
            let bc = grid[row_next + x];
            let br = grid[row_next + x_next];

            // Sobel X: [-1, 0, 1; -2, 0, 2; -1, 0, 1]
            let gx = (-tl + tr - 2.0 * ml + 2.0 * mr - bl + br) * 0.125;

            // Sobel Y: [-1, -2, -1; 0, 0, 0; 1, 2, 1]
            let gy = (-tl - 2.0 * tc - tr + bl + 2.0 * bc + br) * 0.125;

            grad_x[row_curr + x] = gx;
            grad_y[row_curr + x] = gy;
        }
    }

    (grad_x, grad_y)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gradient_uniform() {
        // Uniform field should have zero gradient
        let width = 16;
        let height = 16;
        let grid = vec![1.0f32; width * height];

        let (gx, gy) = sobel_gradient(&grid, width, height);

        for &v in &gx {
            assert!(v.abs() < 1e-6, "Expected zero gradient, got {}", v);
        }
        for &v in &gy {
            assert!(v.abs() < 1e-6, "Expected zero gradient, got {}", v);
        }
    }

    #[test]
    fn test_gradient_horizontal_ramp() {
        // Horizontal ramp should have positive X gradient
        let width = 16;
        let height = 16;
        let mut grid = vec![0.0f32; width * height];

        for y in 0..height {
            for x in 0..width {
                grid[y * width + x] = x as f32;
            }
        }

        let (gx, _gy) = sobel_gradient(&grid, width, height);

        // Interior points should have positive X gradient
        for y in 1..height - 1 {
            for x in 1..width - 1 {
                let idx = y * width + x;
                assert!(
                    gx[idx] > 0.0,
                    "Expected positive X gradient at ({}, {})",
                    x,
                    y
                );
            }
        }
    }

    #[test]
    fn test_fast_matches_standard() {
        let width = 32;
        let height = 32;
        let grid: Vec<f32> = (0..width * height)
            .map(|i| ((i * 7) % 100) as f32 / 100.0)
            .collect();

        let (gx1, gy1) = sobel_gradient(&grid, width, height);
        let (gx2, gy2) = sobel_gradient_fast(&grid, width, height);

        for i in 0..width * height {
            assert!(
                (gx1[i] - gx2[i]).abs() < 1e-6,
                "X gradient mismatch at {}: {} vs {}",
                i,
                gx1[i],
                gx2[i]
            );
            assert!(
                (gy1[i] - gy2[i]).abs() < 1e-6,
                "Y gradient mismatch at {}: {} vs {}",
                i,
                gy1[i],
                gy2[i]
            );
        }
    }

    #[test]
    fn test_gradient_magnitude() {
        let width = 8;
        let height = 8;

        // Create a simple pattern with known gradients
        // Diagonal gradient: both x and y components should be equal
        let mut grid = vec![0.0f32; width * height];
        for y in 0..height {
            for x in 0..width {
                // Smooth periodic function to avoid edge discontinuities
                let fx = (2.0 * std::f32::consts::PI * x as f32 / width as f32).sin();
                let fy = (2.0 * std::f32::consts::PI * y as f32 / height as f32).sin();
                grid[y * width + x] = fx + fy;
            }
        }

        let (gx, gy) = sobel_gradient(&grid, width, height);
        let mag = gradient_magnitude(&gx, &gy);

        // Verify magnitude is computed correctly for all cells
        for i in 0..width * height {
            let expected = (gx[i] * gx[i] + gy[i] * gy[i]).sqrt();
            assert!(
                (mag[i] - expected).abs() < 1e-6,
                "Magnitude mismatch at {}: {} vs {}",
                i,
                mag[i],
                expected
            );
        }

        // Magnitude should be non-negative everywhere
        for &m in &mag {
            assert!(m >= 0.0, "Magnitude should be non-negative");
        }
    }

    #[test]
    fn test_gradient_vertical_ramp() {
        // Vertical ramp should have positive Y gradient
        let width = 16;
        let height = 16;
        let mut grid = vec![0.0f32; width * height];

        for y in 0..height {
            for x in 0..width {
                grid[y * width + x] = y as f32;
            }
        }

        let (_gx, gy) = sobel_gradient(&grid, width, height);

        // Interior points should have positive Y gradient
        // (edges have discontinuity due to periodic boundary with ramp)
        for y in 1..height - 1 {
            for x in 0..width {
                let idx = y * width + x;
                assert!(
                    gy[idx] > 0.0,
                    "Expected positive Y gradient at ({}, {})",
                    x,
                    y
                );
            }
        }
    }

    #[test]
    fn test_gradient_periodic_smooth() {
        // Test with a smooth periodic function where ALL cells should have consistent gradient
        let width = 16;
        let height = 16;
        let mut grid = vec![0.0f32; width * height];

        // Use sin function - smooth and periodic
        for y in 0..height {
            for x in 0..width {
                let phase = 2.0 * std::f32::consts::PI * x as f32 / width as f32;
                grid[y * width + x] = phase.sin();
            }
        }

        let (gx, gy) = sobel_gradient(&grid, width, height);

        // Y gradient should be zero everywhere (function only varies in x)
        for i in 0..width * height {
            assert!(
                gy[i].abs() < 1e-5,
                "Y gradient should be ~0 for x-only variation, got {} at index {}",
                gy[i],
                i
            );
        }

        // X gradient should follow cosine pattern (derivative of sin)
        // and be consistent across the grid INCLUDING edges
        for y in 0..height {
            for x in 0..width {
                let idx = y * width + x;
                // Check that gradient exists and has correct sign
                let phase = 2.0 * std::f32::consts::PI * x as f32 / width as f32;
                let expected_sign = phase.cos(); // derivative of sin
                if expected_sign.abs() > 0.3 {
                    // Only check where gradient is significant
                    assert!(
                        gx[idx] * expected_sign > 0.0,
                        "X gradient sign mismatch at ({}, {}): got {}, expected sign of {}",
                        x,
                        y,
                        gx[idx],
                        expected_sign
                    );
                }
            }
        }
    }

    #[test]
    fn test_gradient_diagonal() {
        // Diagonal pattern: both gradients should be similar in magnitude
        let width = 16;
        let height = 16;
        let mut grid = vec![0.0f32; width * height];

        // Smooth diagonal periodic pattern
        for y in 0..height {
            for x in 0..width {
                let phase_x = 2.0 * std::f32::consts::PI * x as f32 / width as f32;
                let phase_y = 2.0 * std::f32::consts::PI * y as f32 / height as f32;
                grid[y * width + x] = (phase_x + phase_y).sin();
            }
        }

        let (gx, gy) = sobel_gradient(&grid, width, height);

        // For a symmetric diagonal pattern, gx and gy should have similar magnitudes
        let mut total_gx_mag = 0.0f32;
        let mut total_gy_mag = 0.0f32;
        for i in 0..width * height {
            total_gx_mag += gx[i].abs();
            total_gy_mag += gy[i].abs();
        }

        let ratio = total_gx_mag / total_gy_mag;
        assert!(
            (ratio - 1.0).abs() < 0.2,
            "Diagonal gradient should have similar x/y magnitudes, ratio: {}",
            ratio
        );
    }
}
