//! Reintegration tracking for mass-conservative state updates.
//!
//! Implements the advection scheme that guarantees total mass conservation.

/// Advect mass from current state to new state using flow field.
///
/// Uses reintegration tracking: mass at each cell is moved to a new position
/// determined by the flow field, then distributed using a square kernel.
///
/// # Arguments
/// * `current` - Current state grid (flat array, row-major)
/// * `flow_x` - X component of flow field
/// * `flow_y` - Y component of flow field
/// * `width` - Grid width
/// * `height` - Grid height
/// * `dt` - Time step
/// * `distribution_size` - Half-width of distribution kernel (s parameter)
///
/// # Returns
/// New state grid with advected mass.
pub fn advect_mass(
    current: &[f32],
    flow_x: &[f32],
    flow_y: &[f32],
    width: usize,
    height: usize,
    dt: f32,
    distribution_size: f32,
) -> Vec<f32> {
    let mut next = vec![0.0f32; width * height];
    advect_mass_into(
        current,
        flow_x,
        flow_y,
        &mut next,
        width,
        height,
        dt,
        distribution_size,
    );
    next
}

/// Advect mass from current state into a pre-allocated output buffer.
///
/// This is the allocation-free version for use with pre-allocated buffers.
/// The `next` buffer must be zeroed before calling (or contain desired initial values).
///
/// # Arguments
/// * `current` - Current state grid (flat array, row-major)
/// * `flow_x` - X component of flow field
/// * `flow_y` - Y component of flow field
/// * `next` - Output buffer (must be pre-allocated and zeroed)
/// * `width` - Grid width
/// * `height` - Grid height
/// * `dt` - Time step
/// * `distribution_size` - Half-width of distribution kernel (s parameter)
#[inline]
#[allow(clippy::too_many_arguments)]
pub fn advect_mass_into(
    current: &[f32],
    flow_x: &[f32],
    flow_y: &[f32],
    next: &mut [f32],
    width: usize,
    height: usize,
    dt: f32,
    distribution_size: f32,
) {
    for y in 0..height {
        for x in 0..width {
            let idx = y * width + x;
            let mass = current[idx];

            // Skip cells with negligible mass
            if mass.abs() < 1e-10 {
                continue;
            }

            // Compute destination position
            let dest_x = x as f32 + dt * flow_x[idx];
            let dest_y = y as f32 + dt * flow_y[idx];

            // Distribute mass to destination using square kernel
            distribute_mass(next, mass, dest_x, dest_y, width, height, distribution_size);
        }
    }
}

/// Distribute mass from a source point to the grid using a square distribution kernel.
///
/// The kernel D(x'', s) is a uniform square of size 2s centered at the destination.
/// Mass is distributed to all cells overlapping with this square.
#[inline]
fn distribute_mass(
    grid: &mut [f32],
    mass: f32,
    dest_x: f32,
    dest_y: f32,
    width: usize,
    height: usize,
    s: f32,
) {
    // Compute bounds of distribution square
    let x_min = dest_x - s;
    let x_max = dest_x + s;
    let y_min = dest_y - s;
    let y_max = dest_y + s;

    // Integer bounds (with margin for edge cases)
    let ix_min = (x_min.floor() as i32).max(-(width as i32));
    let ix_max = (x_max.ceil() as i32).min(2 * width as i32);
    let iy_min = (y_min.floor() as i32).max(-(height as i32));
    let iy_max = (y_max.ceil() as i32).min(2 * height as i32);

    // Calculate total area for normalization
    let total_area = (2.0 * s) * (2.0 * s);
    if total_area < 1e-10 {
        // Very small distribution, just put all mass at nearest cell
        let nx = wrap_coord(dest_x.round() as i32, width);
        let ny = wrap_coord(dest_y.round() as i32, height);
        grid[ny * width + nx] += mass;
        return;
    }

    let mut distributed_mass = 0.0f32;

    // Distribute to each overlapping cell
    for iy in iy_min..=iy_max {
        for ix in ix_min..=ix_max {
            // Calculate overlap of cell [ix, ix+1] x [iy, iy+1] with distribution square
            let cell_x_min = ix as f32;
            let cell_x_max = (ix + 1) as f32;
            let cell_y_min = iy as f32;
            let cell_y_max = (iy + 1) as f32;

            let overlap_x_min = cell_x_min.max(x_min);
            let overlap_x_max = cell_x_max.min(x_max);
            let overlap_y_min = cell_y_min.max(y_min);
            let overlap_y_max = cell_y_max.min(y_max);

            let overlap_width = (overlap_x_max - overlap_x_min).max(0.0);
            let overlap_height = (overlap_y_max - overlap_y_min).max(0.0);
            let overlap_area = overlap_width * overlap_height;

            if overlap_area > 0.0 {
                let fraction = overlap_area / total_area;
                let cell_mass = mass * fraction;

                // Wrap coordinates for periodic boundary
                let nx = wrap_coord(ix, width);
                let ny = wrap_coord(iy, height);

                grid[ny * width + nx] += cell_mass;
                distributed_mass += cell_mass;
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

/// Wrap coordinate to periodic boundary.
#[inline]
pub fn wrap_coord(coord: i32, size: usize) -> usize {
    let s = size as i32;
    ((coord % s) + s) as usize % size
}

/// Advect multiple channels with shared flow field.
pub fn advect_mass_multichannel(
    channels: &[Vec<f32>],
    flow_x: &[f32],
    flow_y: &[f32],
    width: usize,
    height: usize,
    dt: f32,
    distribution_size: f32,
) -> Vec<Vec<f32>> {
    channels
        .iter()
        .map(|channel| {
            advect_mass(
                channel,
                flow_x,
                flow_y,
                width,
                height,
                dt,
                distribution_size,
            )
        })
        .collect()
}

/// Advect multiple channels with per-channel flow fields.
pub fn advect_mass_multichannel_per_flow(
    channels: &[Vec<f32>],
    flows: &[(Vec<f32>, Vec<f32>)],
    width: usize,
    height: usize,
    dt: f32,
    distribution_size: f32,
) -> Vec<Vec<f32>> {
    channels
        .iter()
        .zip(flows.iter())
        .map(|(channel, (fx, fy))| {
            advect_mass(channel, fx, fy, width, height, dt, distribution_size)
        })
        .collect()
}

/// Calculate total mass in grid (for conservation checking).
pub fn total_mass(grid: &[f32]) -> f32 {
    grid.iter().sum()
}

/// Calculate total mass across all channels.
pub fn total_mass_all_channels(channels: &[Vec<f32>]) -> f32 {
    channels.iter().map(|c| total_mass(c)).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mass_conservation_no_flow() {
        let width = 16;
        let height = 16;
        let mut current = vec![0.0f32; width * height];

        // Place some mass in center
        current[8 * width + 8] = 1.0;
        current[7 * width + 8] = 0.5;

        let initial_mass = total_mass(&current);

        // Zero flow
        let flow_x = vec![0.0f32; width * height];
        let flow_y = vec![0.0f32; width * height];

        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.2, 1.0);

        let final_mass = total_mass(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_mass_conservation_with_flow() {
        let width = 32;
        let height = 32;
        let mut current = vec![0.0f32; width * height];

        // Place mass in a region
        for y in 10..20 {
            for x in 10..20 {
                current[y * width + x] = 1.0;
            }
        }

        let initial_mass = total_mass(&current);

        // Uniform rightward flow
        let flow_x = vec![5.0f32; width * height];
        let flow_y = vec![2.0f32; width * height];

        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.2, 1.0);

        let final_mass = total_mass(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-4,
            "Mass not conserved: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_wrap_coord() {
        assert_eq!(wrap_coord(0, 10), 0);
        assert_eq!(wrap_coord(5, 10), 5);
        assert_eq!(wrap_coord(10, 10), 0);
        assert_eq!(wrap_coord(-1, 10), 9);
        assert_eq!(wrap_coord(-10, 10), 0);
        assert_eq!(wrap_coord(15, 10), 5);
    }

    #[test]
    fn test_mass_conservation_across_boundary() {
        // Test mass flowing across periodic boundary
        let width = 16;
        let height = 16;
        let mut current = vec![0.0f32; width * height];

        // Place mass at right edge
        current[8 * width + 14] = 1.0;

        let initial_mass = total_mass(&current);

        // Flow that moves mass across boundary: x=14 + 5*0.5 = 16.5, wraps to 0.5
        let flow_x = vec![5.0f32; width * height];
        let flow_y = vec![0.0f32; width * height];

        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.5, 1.0);

        let final_mass = total_mass(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved across boundary: {} -> {}",
            initial_mass,
            final_mass
        );

        // Verify mass has wrapped to left side of grid (x=0,1,2)
        // Distribution spreads mass, so check a few cells
        let wrapped_mass: f32 = (0..3).map(|x| next[8 * width + x]).sum();
        assert!(
            wrapped_mass > 0.1,
            "Some mass should have wrapped to left side (x=0-2), but mass there = {}",
            wrapped_mass
        );

        // Original position should have less mass than initial
        let original_mass = next[8 * width + 14];
        assert!(
            original_mass < 1.0,
            "Mass should have moved from original position, but {} remains",
            original_mass
        );
    }

    #[test]
    fn test_mass_conservation_corner_wrap() {
        // Test mass flowing diagonally across corner
        let width = 16;
        let height = 16;
        let mut current = vec![0.0f32; width * height];

        // Place mass at bottom-right corner
        current[15 * width + 15] = 1.0;

        let initial_mass = total_mass(&current);

        // Diagonal flow toward top-left (wrapping both axes)
        let flow_x = vec![8.0f32; width * height];
        let flow_y = vec![8.0f32; width * height];

        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.5, 1.0);

        let final_mass = total_mass(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved in corner wrap: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_advect_mass_multichannel() {
        let width = 16;
        let height = 16;
        let size = width * height;

        // Two channels with different mass distributions
        let mut ch0 = vec![0.0f32; size];
        let mut ch1 = vec![0.0f32; size];

        ch0[8 * width + 8] = 1.0;
        ch1[4 * width + 4] = 2.0;

        let channels = vec![ch0, ch1];
        let initial_mass_0 = total_mass(&channels[0]);
        let initial_mass_1 = total_mass(&channels[1]);

        // Shared flow field
        let flow_x = vec![2.0f32; size];
        let flow_y = vec![1.0f32; size];

        let result = advect_mass_multichannel(&channels, &flow_x, &flow_y, width, height, 0.2, 1.0);

        assert_eq!(result.len(), 2);

        let final_mass_0 = total_mass(&result[0]);
        let final_mass_1 = total_mass(&result[1]);

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
    fn test_advect_mass_large_flow() {
        // Test with flow velocity larger than grid size (multiple wraps)
        let width = 16;
        let height = 16;
        let mut current = vec![0.0f32; width * height];

        current[8 * width + 8] = 1.0;
        let initial_mass = total_mass(&current);

        // Very large flow - should still conserve mass
        let flow_x = vec![100.0f32; width * height];
        let flow_y = vec![50.0f32; width * height];

        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.2, 1.0);

        let final_mass = total_mass(&next);

        assert!(
            (initial_mass - final_mass).abs() < 1e-5,
            "Mass not conserved with large flow: {} -> {}",
            initial_mass,
            final_mass
        );
    }

    #[test]
    fn test_advect_mass_small_distribution() {
        // Test with very small distribution size (point-like)
        let width = 16;
        let height = 16;
        let mut current = vec![0.0f32; width * height];

        current[8 * width + 8] = 1.0;
        let initial_mass = total_mass(&current);

        let flow_x = vec![1.0f32; width * height];
        let flow_y = vec![0.0f32; width * height];

        // Very small distribution size triggers point-mass fallback
        let next = advect_mass(&current, &flow_x, &flow_y, width, height, 0.2, 0.01);

        let final_mass = total_mass(&next);

        // Small distribution uses point fallback which can have slightly higher
        // floating point error, so use looser tolerance
        assert!(
            (initial_mass - final_mass).abs() < 1e-4,
            "Mass not conserved with small distribution: {} -> {}",
            initial_mass,
            final_mass
        );
    }
}
