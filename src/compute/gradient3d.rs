//! 3D Gradient computation using Sobel filters.
//!
//! Computes spatial gradients in X, Y, and Z for flow field calculation.

// Allow -1.0 * expr pattern for clarity in Sobel kernel implementation
#![allow(clippy::neg_multiply)]

/// Compute 3D gradient using Sobel filters.
///
/// Returns (grad_x, grad_y, grad_z) as flat vectors.
/// Uses periodic boundary conditions (wraps at edges).
pub fn sobel_gradient_3d(
    grid: &[f32],
    width: usize,
    height: usize,
    depth: usize,
) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
    let size = width * height * depth;
    let mut grad_x = vec![0.0f32; size];
    let mut grad_y = vec![0.0f32; size];
    let mut grad_z = vec![0.0f32; size];

    sobel_gradient_3d_into(
        grid,
        &mut grad_x,
        &mut grad_y,
        &mut grad_z,
        width,
        height,
        depth,
    );

    (grad_x, grad_y, grad_z)
}

/// Compute 3D Sobel gradient into pre-allocated buffers.
///
/// Uses 3x3x3 Sobel kernels for each axis direction.
/// This is the allocation-free version for use with pre-allocated buffers.
#[inline]
pub fn sobel_gradient_3d_into(
    grid: &[f32],
    grad_x: &mut [f32],
    grad_y: &mut [f32],
    grad_z: &mut [f32],
    width: usize,
    height: usize,
    depth: usize,
) {
    let slice_size = width * height;

    // Process in z-major order for cache efficiency
    for z in 0..depth {
        let z_prev = (z + depth - 1) % depth;
        let z_next = (z + 1) % depth;

        for y in 0..height {
            let y_prev = (y + height - 1) % height;
            let y_next = (y + 1) % height;

            for x in 0..width {
                let x_prev = (x + width - 1) % width;
                let x_next = (x + 1) % width;

                // Indices for the 3x3x3 neighborhood
                // Using Sobel 3D kernels - separable approach
                // The 3D Sobel is the outer product of 1D kernels:
                // X derivative: [1,0,-1] convolved with [1,2,1]⊗[1,2,1] smoothing in YZ
                // Y derivative: [1,2,1] ⊗ [1,0,-1] ⊗ [1,2,1]
                // Z derivative: [1,2,1] ⊗ [1,2,1] ⊗ [1,0,-1]

                // Fetch all 27 neighbors (could optimize with sliding window)
                // Layer z-1 (previous)
                let p_mmm = grid[z_prev * slice_size + y_prev * width + x_prev];
                let p_mm0 = grid[z_prev * slice_size + y_prev * width + x];
                let p_mmp = grid[z_prev * slice_size + y_prev * width + x_next];
                let p_m0m = grid[z_prev * slice_size + y * width + x_prev];
                let p_m00 = grid[z_prev * slice_size + y * width + x];
                let p_m0p = grid[z_prev * slice_size + y * width + x_next];
                let p_mpm = grid[z_prev * slice_size + y_next * width + x_prev];
                let p_mp0 = grid[z_prev * slice_size + y_next * width + x];
                let p_mpp = grid[z_prev * slice_size + y_next * width + x_next];

                // Layer z (current)
                let p_0mm = grid[z * slice_size + y_prev * width + x_prev];
                let p_0m0 = grid[z * slice_size + y_prev * width + x];
                let p_0mp = grid[z * slice_size + y_prev * width + x_next];
                let p_00m = grid[z * slice_size + y * width + x_prev];
                // p_000 = center, not used in derivative
                let p_00p = grid[z * slice_size + y * width + x_next];
                let p_0pm = grid[z * slice_size + y_next * width + x_prev];
                let p_0p0 = grid[z * slice_size + y_next * width + x];
                let p_0pp = grid[z * slice_size + y_next * width + x_next];

                // Layer z+1 (next)
                let p_pmm = grid[z_next * slice_size + y_prev * width + x_prev];
                let p_pm0 = grid[z_next * slice_size + y_prev * width + x];
                let p_pmp = grid[z_next * slice_size + y_prev * width + x_next];
                let p_p0m = grid[z_next * slice_size + y * width + x_prev];
                let p_p00 = grid[z_next * slice_size + y * width + x];
                let p_p0p = grid[z_next * slice_size + y * width + x_next];
                let p_ppm = grid[z_next * slice_size + y_next * width + x_prev];
                let p_pp0 = grid[z_next * slice_size + y_next * width + x];
                let p_ppp = grid[z_next * slice_size + y_next * width + x_next];

                // X gradient: derivative in X, smooth in Y and Z
                // Weights: outer product of [1,2,1] (Y) and [1,2,1] (Z) with [-1,0,1] (X)
                // z-1 layer: weights [1,2,1] in Z (weight 1)
                let gx_zm = -1.0 * (1.0 * p_mmm + 2.0 * p_m0m + 1.0 * p_mpm)
                    + 1.0 * (1.0 * p_mmp + 2.0 * p_m0p + 1.0 * p_mpp);
                // z layer: weight 2
                let gx_z0 = -1.0 * (1.0 * p_0mm + 2.0 * p_00m + 1.0 * p_0pm)
                    + 1.0 * (1.0 * p_0mp + 2.0 * p_00p + 1.0 * p_0pp);
                // z+1 layer: weight 1
                let gx_zp = -1.0 * (1.0 * p_pmm + 2.0 * p_p0m + 1.0 * p_ppm)
                    + 1.0 * (1.0 * p_pmp + 2.0 * p_p0p + 1.0 * p_ppp);

                let gx = (1.0 * gx_zm + 2.0 * gx_z0 + 1.0 * gx_zp) / 32.0;

                // Y gradient: derivative in Y, smooth in X and Z
                let gy_zm = -1.0 * (1.0 * p_mmm + 2.0 * p_mm0 + 1.0 * p_mmp)
                    + 1.0 * (1.0 * p_mpm + 2.0 * p_mp0 + 1.0 * p_mpp);
                let gy_z0 = -1.0 * (1.0 * p_0mm + 2.0 * p_0m0 + 1.0 * p_0mp)
                    + 1.0 * (1.0 * p_0pm + 2.0 * p_0p0 + 1.0 * p_0pp);
                let gy_zp = -1.0 * (1.0 * p_pmm + 2.0 * p_pm0 + 1.0 * p_pmp)
                    + 1.0 * (1.0 * p_ppm + 2.0 * p_pp0 + 1.0 * p_ppp);

                let gy = (1.0 * gy_zm + 2.0 * gy_z0 + 1.0 * gy_zp) / 32.0;

                // Z gradient: derivative in Z, smooth in X and Y
                let gz_xm = -1.0 * (1.0 * p_mmm + 2.0 * p_m0m + 1.0 * p_mpm)
                    + 1.0 * (1.0 * p_pmm + 2.0 * p_p0m + 1.0 * p_ppm);
                let gz_x0 = -1.0 * (1.0 * p_mm0 + 2.0 * p_m00 + 1.0 * p_mp0)
                    + 1.0 * (1.0 * p_pm0 + 2.0 * p_p00 + 1.0 * p_pp0);
                let gz_xp = -1.0 * (1.0 * p_mmp + 2.0 * p_m0p + 1.0 * p_mpp)
                    + 1.0 * (1.0 * p_pmp + 2.0 * p_p0p + 1.0 * p_ppp);

                let gz = (1.0 * gz_xm + 2.0 * gz_x0 + 1.0 * gz_xp) / 32.0;

                let idx = z * slice_size + y * width + x;
                grad_x[idx] = gx;
                grad_y[idx] = gy;
                grad_z[idx] = gz;
            }
        }
    }
}

/// Compute gradient magnitude from 3D gradient components.
pub fn gradient_magnitude_3d(grad_x: &[f32], grad_y: &[f32], grad_z: &[f32]) -> Vec<f32> {
    grad_x
        .iter()
        .zip(grad_y.iter())
        .zip(grad_z.iter())
        .map(|((&gx, &gy), &gz)| (gx * gx + gy * gy + gz * gz).sqrt())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gradient_3d_uniform() {
        // Uniform field should have zero gradient
        let size = 8;
        let grid = vec![1.0f32; size * size * size];

        let (gx, gy, gz) = sobel_gradient_3d(&grid, size, size, size);

        for i in 0..grid.len() {
            assert!(
                gx[i].abs() < 1e-6,
                "Expected zero X gradient, got {}",
                gx[i]
            );
            assert!(
                gy[i].abs() < 1e-6,
                "Expected zero Y gradient, got {}",
                gy[i]
            );
            assert!(
                gz[i].abs() < 1e-6,
                "Expected zero Z gradient, got {}",
                gz[i]
            );
        }
    }

    #[test]
    fn test_gradient_3d_x_ramp() {
        // X ramp should have positive X gradient, zero Y and Z
        let size = 8;
        let mut grid = vec![0.0f32; size * size * size];

        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    // Use smooth periodic function to avoid discontinuity
                    let phase = 2.0 * std::f32::consts::PI * x as f32 / size as f32;
                    grid[z * size * size + y * size + x] = phase.sin();
                }
            }
        }

        let (gx, gy, gz) = sobel_gradient_3d(&grid, size, size, size);

        // Check that Y and Z gradients are near zero (function only varies in X)
        for i in 0..grid.len() {
            assert!(
                gy[i].abs() < 1e-4,
                "Expected ~zero Y gradient, got {} at idx {}",
                gy[i],
                i
            );
            assert!(
                gz[i].abs() < 1e-4,
                "Expected ~zero Z gradient, got {} at idx {}",
                gz[i],
                i
            );
        }

        // Check that X gradient follows cosine pattern (derivative of sin)
        // At x=0 and x=1, cos is positive, so gradient should be positive
        for z in 0..size {
            for y in 0..size {
                let idx = z * size * size + y * size + 1; // x = 1 where cos > 0
                assert!(
                    gx[idx] > 0.0,
                    "Expected positive X gradient at x=1 where cos > 0, got {} at z={}, y={}",
                    gx[idx],
                    z,
                    y
                );
            }
        }
    }

    #[test]
    fn test_gradient_3d_spherical() {
        // Spherical pattern centered in grid
        let size = 16;
        let mut grid = vec![0.0f32; size * size * size];
        let center = size as f32 / 2.0;

        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    let dx = x as f32 - center;
                    let dy = y as f32 - center;
                    let dz = z as f32 - center;
                    let dist_sq = dx * dx + dy * dy + dz * dz;
                    grid[z * size * size + y * size + x] = (-dist_sq / 20.0).exp();
                }
            }
        }

        let (gx, gy, gz) = sobel_gradient_3d(&grid, size, size, size);

        // At center, gradient should be near zero (peak of Gaussian)
        let center_idx = (size / 2) * size * size + (size / 2) * size + size / 2;
        assert!(
            gx[center_idx].abs() < 0.1,
            "Center X gradient should be small: {}",
            gx[center_idx]
        );
        assert!(
            gy[center_idx].abs() < 0.1,
            "Center Y gradient should be small: {}",
            gy[center_idx]
        );
        assert!(
            gz[center_idx].abs() < 0.1,
            "Center Z gradient should be small: {}",
            gz[center_idx]
        );

        // Gradient should point inward (negative away from center)
        let off_center_idx = (size / 2) * size * size + (size / 2) * size + (size / 2 + 2);
        assert!(
            gx[off_center_idx] < 0.0,
            "Gradient should point toward center (negative X)"
        );
    }

    #[test]
    fn test_gradient_3d_magnitude() {
        let size = 8;
        let mut grid = vec![0.0f32; size * size * size];

        // Diagonal gradient
        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    grid[z * size * size + y * size + x] = (x + y + z) as f32;
                }
            }
        }

        let (gx, gy, gz) = sobel_gradient_3d(&grid, size, size, size);
        let mag = gradient_magnitude_3d(&gx, &gy, &gz);

        // Verify magnitude is computed correctly
        for i in 0..grid.len() {
            let expected = (gx[i] * gx[i] + gy[i] * gy[i] + gz[i] * gz[i]).sqrt();
            assert!(
                (mag[i] - expected).abs() < 1e-6,
                "Magnitude mismatch at {}: {} vs {}",
                i,
                mag[i],
                expected
            );
        }
    }
}
