//! 3D Reintegration tracking for mass-conservative state updates.
//!
//! Implements the advection scheme that guarantees total mass conservation in 3D.

#![allow(clippy::too_many_arguments)]

use super::reintegration::wrap_coord;

/// Advect mass from current 3D state to new state using flow field.
///
/// Uses reintegration tracking: mass at each cell is moved to a new position
/// determined by the flow field, then distributed using a cube kernel.
///
/// # Arguments
/// * `current` - Current state grid (flat array, z-major: z*H*W + y*W + x)
/// * `flow_x`, `flow_y`, `flow_z` - Flow field components
/// * `width`, `height`, `depth` - Grid dimensions
/// * `dt` - Time step
/// * `distribution_size` - Half-width of distribution kernel (s parameter)
///
/// # Returns
/// New state grid with advected mass.
pub fn advect_mass_3d(
    current: &[f32],
    flow_x: &[f32],
    flow_y: &[f32],
    flow_z: &[f32],
    width: usize,
    height: usize,
    depth: usize,
    dt: f32,
    distribution_size: f32,
) -> Vec<f32> {
    let mut next = vec![0.0f32; width * height * depth];
    advect_mass_3d_into(
        current,
        flow_x,
        flow_y,
        flow_z,
        &mut next,
        width,
        height,
        depth,
        dt,
        distribution_size,
    );
    next
}

/// Advect mass from current 3D state into a pre-allocated output buffer.
///
/// This is the allocation-free version for use with pre-allocated buffers.
/// The `next` buffer must be zeroed before calling (or contain desired initial values).
#[inline]
#[allow(clippy::too_many_arguments)]
pub fn advect_mass_3d_into(
    current: &[f32],
    flow_x: &[f32],
    flow_y: &[f32],
    flow_z: &[f32],
    next: &mut [f32],
    width: usize,
    height: usize,
    depth: usize,
    dt: f32,
    distribution_size: f32,
) {
    let slice_size = width * height;

    for z in 0..depth {
        for y in 0..height {
            for x in 0..width {
                let idx = z * slice_size + y * width + x;
                let mass = current[idx];

                // Skip cells with negligible mass
                if mass.abs() < 1e-10 {
                    continue;
                }

                // Compute destination position
                let dest_x = x as f32 + dt * flow_x[idx];
                let dest_y = y as f32 + dt * flow_y[idx];
                let dest_z = z as f32 + dt * flow_z[idx];

                // Distribute mass to destination using cube kernel
                distribute_mass_3d(
                    next,
                    mass,
                    dest_x,
                    dest_y,
                    dest_z,
                    width,
                    height,
                    depth,
                    distribution_size,
                );
            }
        }
    }
}

/// Distribute mass from a source point to the 3D grid using a cube distribution kernel.
///
/// The kernel D(x'', s) is a uniform cube of size 2s centered at the destination.
/// Mass is distributed to all cells overlapping with this cube.
#[inline]
#[allow(clippy::too_many_arguments)]
fn distribute_mass_3d(
    grid: &mut [f32],
    mass: f32,
    dest_x: f32,
    dest_y: f32,
    dest_z: f32,
    width: usize,
    height: usize,
    depth: usize,
    s: f32,
) {
    // Compute bounds of distribution cube
    let x_min = dest_x - s;
    let x_max = dest_x + s;
    let y_min = dest_y - s;
    let y_max = dest_y + s;
    let z_min = dest_z - s;
    let z_max = dest_z + s;

    // Integer bounds (with margin for edge cases)
    let ix_min = (x_min.floor() as i32).max(-(width as i32));
    let ix_max = (x_max.ceil() as i32).min(2 * width as i32);
    let iy_min = (y_min.floor() as i32).max(-(height as i32));
    let iy_max = (y_max.ceil() as i32).min(2 * height as i32);
    let iz_min = (z_min.floor() as i32).max(-(depth as i32));
    let iz_max = (z_max.ceil() as i32).min(2 * depth as i32);

    // Calculate total volume for normalization
    let total_volume = (2.0 * s) * (2.0 * s) * (2.0 * s);
    if total_volume < 1e-10 {
        // Very small distribution, just put all mass at nearest cell
        let nx = wrap_coord(dest_x.round() as i32, width);
        let ny = wrap_coord(dest_y.round() as i32, height);
        let nz = wrap_coord(dest_z.round() as i32, depth);
        let slice_size = width * height;
        grid[nz * slice_size + ny * width + nx] += mass;
        return;
    }

    let slice_size = width * height;
    let mut distributed_mass = 0.0f32;

    // Distribute to each overlapping cell
    for iz in iz_min..=iz_max {
        for iy in iy_min..=iy_max {
            for ix in ix_min..=ix_max {
                // Calculate overlap of cell [ix,ix+1] x [iy,iy+1] x [iz,iz+1] with distribution cube
                let cell_x_min = ix as f32;
                let cell_x_max = (ix + 1) as f32;
                let cell_y_min = iy as f32;
                let cell_y_max = (iy + 1) as f32;
                let cell_z_min = iz as f32;
                let cell_z_max = (iz + 1) as f32;

                let overlap_x_min = cell_x_min.max(x_min);
                let overlap_x_max = cell_x_max.min(x_max);
                let overlap_y_min = cell_y_min.max(y_min);
                let overlap_y_max = cell_y_max.min(y_max);
                let overlap_z_min = cell_z_min.max(z_min);
                let overlap_z_max = cell_z_max.min(z_max);

                let overlap_width = (overlap_x_max - overlap_x_min).max(0.0);
                let overlap_height = (overlap_y_max - overlap_y_min).max(0.0);
                let overlap_depth = (overlap_z_max - overlap_z_min).max(0.0);
                let overlap_volume = overlap_width * overlap_height * overlap_depth;

                if overlap_volume > 0.0 {
                    let fraction = overlap_volume / total_volume;
                    let cell_mass = mass * fraction;

                    // Wrap coordinates for periodic boundary
                    let nx = wrap_coord(ix, width);
                    let ny = wrap_coord(iy, height);
                    let nz = wrap_coord(iz, depth);

                    grid[nz * slice_size + ny * width + nx] += cell_mass;
                    distributed_mass += cell_mass;
                }
            }
        }
    }

    // Verify mass conservation (debug)
    debug_assert!(
        (distributed_mass - mass).abs() < mass * 0.01 + 1e-6,
        "Mass not conserved: {} vs {}",
        distributed_mass,
        mass
    );
}

/// Advect multiple channels with shared 3D flow field.
pub fn advect_mass_3d_multichannel(
    channels: &[Vec<f32>],
    flow_x: &[f32],
    flow_y: &[f32],
    flow_z: &[f32],
    width: usize,
    height: usize,
    depth: usize,
    dt: f32,
    distribution_size: f32,
) -> Vec<Vec<f32>> {
    channels
        .iter()
        .map(|channel| {
            advect_mass_3d(
                channel,
                flow_x,
                flow_y,
                flow_z,
                width,
                height,
                depth,
                dt,
                distribution_size,
            )
        })
        .collect()
}

/// Calculate total mass in 3D grid (for conservation checking).
pub fn total_mass_3d(grid: &[f32]) -> f32 {
    grid.iter().sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mass_conservation_3d_no_flow() {
        let size = 8;
        let mut current = vec![0.0f32; size * size * size];

        // Place some mass in center
        let center = size / 2;
        let idx = center * size * size + center * size + center;
        current[idx] = 1.0;
        current[idx - 1] = 0.5;
        current[idx + size] = 0.3;

        let initial_mass = total_mass_3d(&current);

        // Zero flow
        let flow_x = vec![0.0f32; size * size * size];
        let flow_y = vec![0.0f32; size * size * size];
        let flow_z = vec![0.0f32; size * size * size];

        let next = advect_mass_3d(
            &current, &flow_x, &flow_y, &flow_z, size, size, size, 0.2, 1.0,
        );

        let final_mass = total_mass_3d(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_mass_conservation_3d_with_flow() {
        let size = 16;
        let mut current = vec![0.0f32; size * size * size];

        // Place mass in a region
        for z in 4..8 {
            for y in 4..8 {
                for x in 4..8 {
                    current[z * size * size + y * size + x] = 1.0;
                }
            }
        }

        let initial_mass = total_mass_3d(&current);

        // Uniform flow in all directions
        let flow_x = vec![3.0f32; size * size * size];
        let flow_y = vec![2.0f32; size * size * size];
        let flow_z = vec![1.0f32; size * size * size];

        let next = advect_mass_3d(
            &current, &flow_x, &flow_y, &flow_z, size, size, size, 0.2, 1.0,
        );

        let final_mass = total_mass_3d(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-4,
            "Mass not conserved: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_wrap_coord_3d() {
        assert_eq!(wrap_coord(0, 10), 0);
        assert_eq!(wrap_coord(5, 10), 5);
        assert_eq!(wrap_coord(10, 10), 0);
        assert_eq!(wrap_coord(-1, 10), 9);
        assert_eq!(wrap_coord(-10, 10), 0);
        assert_eq!(wrap_coord(15, 10), 5);
    }

    #[test]
    fn test_mass_conservation_3d_across_boundary() {
        // Test mass flowing across periodic boundary
        let size = 8;
        let mut current = vec![0.0f32; size * size * size];

        // Place mass at edge
        current[4 * size * size + 4 * size + (size - 1)] = 1.0;

        let initial_mass = total_mass_3d(&current);

        // Flow that moves mass across X boundary
        let flow_x = vec![5.0f32; size * size * size];
        let flow_y = vec![0.0f32; size * size * size];
        let flow_z = vec![0.0f32; size * size * size];

        let next = advect_mass_3d(
            &current, &flow_x, &flow_y, &flow_z, size, size, size, 0.5, 1.0,
        );

        let final_mass = total_mass_3d(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved across boundary: {} -> {}",
            initial_mass,
            final_mass
        );

        // Verify some mass wrapped to left side
        let wrapped_mass: f32 = (0..3).map(|x| next[4 * size * size + 4 * size + x]).sum();
        assert!(
            wrapped_mass > 0.1,
            "Some mass should have wrapped to left side"
        );
    }

    #[test]
    fn test_mass_conservation_3d_corner_wrap() {
        // Test mass flowing diagonally across corner (all 3 axes)
        let size = 8;
        let mut current = vec![0.0f32; size * size * size];

        // Place mass at corner
        current[(size - 1) * size * size + (size - 1) * size + (size - 1)] = 1.0;

        let initial_mass = total_mass_3d(&current);

        // Diagonal flow toward opposite corner
        let flow_x = vec![4.0f32; size * size * size];
        let flow_y = vec![4.0f32; size * size * size];
        let flow_z = vec![4.0f32; size * size * size];

        let next = advect_mass_3d(
            &current, &flow_x, &flow_y, &flow_z, size, size, size, 0.5, 1.0,
        );

        let final_mass = total_mass_3d(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved in corner wrap: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_advect_mass_3d_multichannel() {
        let size = 8;
        let grid_size = size * size * size;

        // Two channels with different mass distributions
        let mut ch0 = vec![0.0f32; grid_size];
        let mut ch1 = vec![0.0f32; grid_size];

        let center = size / 2;
        ch0[center * size * size + center * size + center] = 1.0;
        ch1[(center - 1) * size * size + center * size + center] = 2.0;

        let channels = vec![ch0, ch1];
        let initial_mass_0 = total_mass_3d(&channels[0]);
        let initial_mass_1 = total_mass_3d(&channels[1]);

        // Shared flow field
        let flow_x = vec![2.0f32; grid_size];
        let flow_y = vec![1.0f32; grid_size];
        let flow_z = vec![0.5f32; grid_size];

        let result = advect_mass_3d_multichannel(
            &channels, &flow_x, &flow_y, &flow_z, size, size, size, 0.2, 1.0,
        );

        assert_eq!(result.len(), 2);

        let final_mass_0 = total_mass_3d(&result[0]);
        let final_mass_1 = total_mass_3d(&result[1]);

        assert!(
            (initial_mass_0 - final_mass_0).abs() < 1e-5,
            "Channel 0 mass not conserved: {} -> {}",
            initial_mass_0,
            final_mass_0
        );
        assert!(
            (initial_mass_1 - final_mass_1).abs() < 1e-5,
            "Channel 1 mass not conserved: {} -> {}",
            initial_mass_1,
            final_mass_1
        );
    }

    #[test]
    fn test_advect_mass_3d_small_distribution() {
        // Test with very small distribution size (point-like)
        let size = 8;
        let mut current = vec![0.0f32; size * size * size];

        let center = size / 2;
        current[center * size * size + center * size + center] = 1.0;
        let initial_mass = total_mass_3d(&current);

        let flow_x = vec![1.0f32; size * size * size];
        let flow_y = vec![0.0f32; size * size * size];
        let flow_z = vec![0.0f32; size * size * size];

        // Very small distribution size triggers point-mass fallback
        let next = advect_mass_3d(
            &current, &flow_x, &flow_y, &flow_z, size, size, size, 0.2, 0.01,
        );

        let final_mass = total_mass_3d(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-4,
            "Mass not conserved with small distribution: {} -> {}",
            initial_mass,
            final_mass
        );
    }
}
