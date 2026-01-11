//! Parameter advection - Transporting parameters alongside mass flow.
//!
//! This module implements the core mechanism of parameter embedding: when mass
//! flows from one cell to another, the associated parameters flow with it.
//! When mass from multiple sources converges at a destination, the parameters
//! are mixed using stochastic (softmax) weighting.
//!
//! # Algorithm
//!
//! For each destination cell, we:
//! 1. Identify all source cells that contribute mass
//! 2. Calculate the mass contribution from each source (using the distribution kernel)
//! 3. Mix the source parameters using softmax weighting proportional to mass
//!
//! The result is that parameters naturally flow and mix with the mass dynamics.

use crate::schema::{CellParams, EmbeddingConfig, ParameterGrid};

/// Contribution from a source cell during advection.
#[derive(Clone, Copy)]
struct MassContribution {
    /// Mass amount from this source.
    mass: f32,
    /// Parameters of the source cell.
    params: CellParams,
}

/// Advect mass and parameters simultaneously.
///
/// This is the main entry point for parameter-embedded advection.
/// It computes both the new mass distribution and the new parameter distribution.
///
/// # Arguments
/// * `current_mass` - Current mass grid
/// * `current_params` - Current parameter grid
/// * `flow_x` - X component of flow field
/// * `flow_y` - Y component of flow field
/// * `config` - Embedding configuration (mixing temperature, etc.)
/// * `dt` - Time step
/// * `distribution_size` - Half-width of distribution kernel
/// * `width` - Grid width
/// * `height` - Grid height
///
/// # Returns
/// Tuple of (new mass grid, new parameter grid)
pub fn advect_mass_and_params(
    current_mass: &[f32],
    current_params: &ParameterGrid,
    flow_x: &[f32],
    flow_y: &[f32],
    config: &EmbeddingConfig,
    dt: f32,
    distribution_size: f32,
    width: usize,
    height: usize,
) -> (Vec<f32>, ParameterGrid) {
    let grid_size = width * height;
    let mut next_mass = vec![0.0f32; grid_size];
    let mut next_params = ParameterGrid::from_defaults(width, height);

    advect_mass_and_params_into(
        current_mass,
        current_params,
        flow_x,
        flow_y,
        config,
        dt,
        distribution_size,
        width,
        height,
        &mut next_mass,
        &mut next_params,
    );

    (next_mass, next_params)
}

/// Advect mass and parameters into pre-allocated buffers.
pub fn advect_mass_and_params_into(
    current_mass: &[f32],
    current_params: &ParameterGrid,
    flow_x: &[f32],
    flow_y: &[f32],
    config: &EmbeddingConfig,
    dt: f32,
    distribution_size: f32,
    width: usize,
    height: usize,
    next_mass: &mut [f32],
    next_params: &mut ParameterGrid,
) {
    // First pass: gather all contributions at each destination cell
    // We need to track which sources contribute to each destination

    // For efficiency, we use a gather-based approach:
    // Each destination cell looks at potential source cells that could reach it

    let max_flow_mag = compute_max_flow_magnitude(flow_x, flow_y);
    let search_radius = (max_flow_mag * dt + distribution_size).ceil() as i32 + 1;

    // For each destination cell
    for dest_y in 0..height {
        for dest_x in 0..width {
            let dest_idx = dest_y * width + dest_x;

            let mut contributions: Vec<MassContribution> = Vec::new();
            let mut total_mass = 0.0f32;

            // Search potential source cells
            for dy in -search_radius..=search_radius {
                for dx in -search_radius..=search_radius {
                    let src_x = wrap_coord(dest_x as i32 + dx, width);
                    let src_y = wrap_coord(dest_y as i32 + dy, height);
                    let src_idx = src_y * width + src_x;

                    let src_mass = current_mass[src_idx];
                    if src_mass.abs() < 1e-10 {
                        continue;
                    }

                    // Compute where this source cell's mass goes
                    let dest_fx = src_x as f32 + dt * flow_x[src_idx];
                    let dest_fy = src_y as f32 + dt * flow_y[src_idx];

                    // Calculate overlap with our destination cell
                    let overlap = compute_distribution_overlap(
                        dest_fx,
                        dest_fy,
                        distribution_size,
                        dest_x as f32,
                        dest_y as f32,
                    );

                    if overlap > 0.0 {
                        let mass_contribution = src_mass * overlap;
                        total_mass += mass_contribution;

                        contributions.push(MassContribution {
                            mass: mass_contribution,
                            params: current_params.get_idx(src_idx),
                        });
                    }
                }
            }

            next_mass[dest_idx] = total_mass;

            // Mix parameters from all contributing sources
            if !contributions.is_empty() && total_mass > 1e-10 {
                let mixed_params = mix_contributions(&contributions, config);
                next_params.set_idx(dest_idx, mixed_params);
            }
            // If no contributions, next_params keeps default values
        }
    }
}

/// Simplified advection that just tracks the dominant source's parameters.
///
/// This is faster than full mixing but less accurate for parameter blending.
/// The dominant source (highest mass contribution) determines the output parameters.
pub fn advect_mass_and_params_dominant(
    current_mass: &[f32],
    current_params: &ParameterGrid,
    flow_x: &[f32],
    flow_y: &[f32],
    dt: f32,
    distribution_size: f32,
    width: usize,
    height: usize,
    next_mass: &mut [f32],
    next_params: &mut ParameterGrid,
) {
    let max_flow_mag = compute_max_flow_magnitude(flow_x, flow_y);
    let search_radius = (max_flow_mag * dt + distribution_size).ceil() as i32 + 1;

    for dest_y in 0..height {
        for dest_x in 0..width {
            let dest_idx = dest_y * width + dest_x;

            let mut total_mass = 0.0f32;
            let mut max_contribution = 0.0f32;
            let mut dominant_params = CellParams::default();

            for dy in -search_radius..=search_radius {
                for dx in -search_radius..=search_radius {
                    let src_x = wrap_coord(dest_x as i32 + dx, width);
                    let src_y = wrap_coord(dest_y as i32 + dy, height);
                    let src_idx = src_y * width + src_x;

                    let src_mass = current_mass[src_idx];
                    if src_mass.abs() < 1e-10 {
                        continue;
                    }

                    let dest_fx = src_x as f32 + dt * flow_x[src_idx];
                    let dest_fy = src_y as f32 + dt * flow_y[src_idx];

                    let overlap = compute_distribution_overlap(
                        dest_fx,
                        dest_fy,
                        distribution_size,
                        dest_x as f32,
                        dest_y as f32,
                    );

                    if overlap > 0.0 {
                        let mass_contribution = src_mass * overlap;
                        total_mass += mass_contribution;

                        if mass_contribution > max_contribution {
                            max_contribution = mass_contribution;
                            dominant_params = current_params.get_idx(src_idx);
                        }
                    }
                }
            }

            next_mass[dest_idx] = total_mass;

            if total_mass > 1e-10 {
                next_params.set_idx(dest_idx, dominant_params);
            }
        }
    }
}

/// Mix parameters from multiple contributions using configured mixing strategy.
fn mix_contributions(contributions: &[MassContribution], config: &EmbeddingConfig) -> CellParams {
    if contributions.is_empty() {
        return CellParams::default();
    }

    if contributions.len() == 1 {
        return contributions[0].params;
    }

    // Convert to format expected by CellParams::mix_*
    let sources: Vec<(CellParams, f32)> =
        contributions.iter().map(|c| (c.params, c.mass)).collect();

    if config.linear_mixing {
        CellParams::mix_linear(&sources)
    } else {
        CellParams::mix_softmax(&sources, config.mixing_temperature)
    }
}

/// Compute the overlap area of a distribution square with a cell.
///
/// The distribution kernel is a uniform square of size 2s centered at (dest_x, dest_y).
/// The target cell occupies [cell_x, cell_x+1] x [cell_y, cell_y+1].
#[inline]
fn compute_distribution_overlap(dest_x: f32, dest_y: f32, s: f32, cell_x: f32, cell_y: f32) -> f32 {
    // Distribution square bounds
    let dist_x_min = dest_x - s;
    let dist_x_max = dest_x + s;
    let dist_y_min = dest_y - s;
    let dist_y_max = dest_y + s;

    // Cell bounds
    let cell_x_max = cell_x + 1.0;
    let cell_y_max = cell_y + 1.0;

    // Compute intersection
    let overlap_x_min = dist_x_min.max(cell_x);
    let overlap_x_max = dist_x_max.min(cell_x_max);
    let overlap_y_min = dist_y_min.max(cell_y);
    let overlap_y_max = dist_y_max.min(cell_y_max);

    let overlap_width = (overlap_x_max - overlap_x_min).max(0.0);
    let overlap_height = (overlap_y_max - overlap_y_min).max(0.0);
    let overlap_area = overlap_width * overlap_height;

    // Normalize by total distribution area
    let total_area = (2.0 * s) * (2.0 * s);
    if total_area > 1e-10 {
        overlap_area / total_area
    } else {
        // Point distribution - check if cell contains the point
        if cell_x <= dest_x && dest_x < cell_x_max && cell_y <= dest_y && dest_y < cell_y_max {
            1.0
        } else {
            0.0
        }
    }
}

/// Compute maximum flow magnitude for determining search radius.
fn compute_max_flow_magnitude(flow_x: &[f32], flow_y: &[f32]) -> f32 {
    flow_x
        .iter()
        .zip(flow_y.iter())
        .map(|(fx, fy)| (fx * fx + fy * fy).sqrt())
        .fold(0.0f32, f32::max)
}

/// Wrap coordinate to periodic boundary.
#[inline]
fn wrap_coord(coord: i32, size: usize) -> usize {
    let s = size as i32;
    ((coord % s) + s) as usize % size
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_advect_no_flow() {
        let width = 16;
        let height = 16;
        let grid_size = width * height;

        // Initial mass at center
        let mut mass = vec![0.0f32; grid_size];
        mass[8 * width + 8] = 1.0;

        // Custom parameters at that location
        let mut params = ParameterGrid::from_defaults(width, height);
        let custom = CellParams::new(0.25, 0.025, 2.0, 1.5, 3.0);
        params.set(8, 8, custom);

        // Zero flow
        let flow_x = vec![0.0f32; grid_size];
        let flow_y = vec![0.0f32; grid_size];

        let config = EmbeddingConfig::enabled();
        let (next_mass, next_params) = advect_mass_and_params(
            &mass, &params, &flow_x, &flow_y, &config, 0.2, 1.0, width, height,
        );

        // Mass should be conserved
        let total: f32 = next_mass.iter().sum();
        assert!((total - 1.0).abs() < 0.01, "Mass not conserved: {}", total);

        // Parameters near center should have picked up the custom values
        // (some spreading due to distribution kernel)
        let center_params = next_params.get(8, 8);
        assert!(
            (center_params.mu - 0.25).abs() < 0.1,
            "Parameters should approximately preserve: mu = {}",
            center_params.mu
        );
    }

    #[test]
    fn test_advect_with_flow() {
        let width = 32;
        let height = 32;
        let grid_size = width * height;

        // Mass at position (10, 16)
        let mut mass = vec![0.0f32; grid_size];
        mass[16 * width + 10] = 1.0;

        // Custom parameters
        let mut params = ParameterGrid::from_defaults(width, height);
        let custom = CellParams::new(0.3, 0.03, 1.5, 1.0, 2.0);
        params.set(10, 16, custom);

        // Rightward flow
        let flow_x = vec![5.0f32; grid_size];
        let flow_y = vec![0.0f32; grid_size];

        let config = EmbeddingConfig::enabled();
        let (next_mass, next_params) = advect_mass_and_params(
            &mass, &params, &flow_x, &flow_y, &config, 0.2, // dt
            1.0, // distribution_size
            width, height,
        );

        // Mass should be conserved
        let total: f32 = next_mass.iter().sum();
        assert!((total - 1.0).abs() < 0.01, "Mass not conserved: {}", total);

        // Mass should have moved right (10 + 5*0.2 = 11)
        // With distribution spreading, mass goes to both 10 and 11, but 11 and 12 should have mass
        let new_pos_mass_11 = next_mass[16 * width + 11];
        let new_pos_mass_12 = next_mass[16 * width + 12];
        assert!(
            new_pos_mass_11 > 0.0 || new_pos_mass_12 > 0.0,
            "Mass should have moved right: pos11={}, pos12={}",
            new_pos_mass_11,
            new_pos_mass_12
        );

        // Parameters at new position should reflect the moved mass
        let new_pos_params = next_params.get(11, 16);
        // Due to distribution spreading, parameters may be diluted
        // but should show influence from the custom source
        if next_mass[16 * width + 11] > 0.1 {
            assert!(
                (new_pos_params.mu - custom.mu).abs() < 0.2,
                "Parameters should have moved with mass: mu = {}",
                new_pos_params.mu
            );
        }
    }

    #[test]
    fn test_mixing_collision() {
        let width = 16;
        let height = 16;
        let grid_size = width * height;

        // Two masses with different parameters moving toward each other
        let mut mass = vec![0.0f32; grid_size];
        mass[8 * width + 4] = 1.0; // Left mass
        mass[8 * width + 10] = 1.0; // Right mass

        let mut params = ParameterGrid::from_defaults(width, height);
        params.set(4, 8, CellParams::new(0.1, 0.01, 1.0, 1.0, 2.0)); // Low mu
        params.set(10, 8, CellParams::new(0.3, 0.03, 1.0, 1.0, 2.0)); // High mu

        // Converging flow (meet around x=7)
        let mut flow_x = vec![0.0f32; grid_size];
        flow_x[8 * width + 4] = 15.0; // Move right
        flow_x[8 * width + 10] = -15.0; // Move left
        let flow_y = vec![0.0f32; grid_size];

        let config = EmbeddingConfig::enabled_linear(); // Use linear for predictable mixing
        let (next_mass, next_params) = advect_mass_and_params(
            &mass, &params, &flow_x, &flow_y, &config, 0.2, 1.0, width, height,
        );

        // Total mass should be conserved
        let total: f32 = next_mass.iter().sum();
        assert!(
            (total - 2.0).abs() < 0.01,
            "Total mass not conserved: {}",
            total
        );

        // Find cell with highest mass (collision point)
        let max_idx = next_mass
            .iter()
            .enumerate()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
            .map(|(i, _)| i)
            .unwrap();

        let collision_params = next_params.get_idx(max_idx);

        // If both sources contribute equally, mu should be average of 0.1 and 0.3 = 0.2
        // Allow some tolerance due to distribution spreading
        if next_mass[max_idx] > 0.5 {
            assert!(
                collision_params.mu > 0.1 && collision_params.mu < 0.3,
                "Mixed parameters should be between sources: mu = {}",
                collision_params.mu
            );
        }
    }

    #[test]
    fn test_distribution_overlap() {
        // Full overlap (cell entirely within distribution)
        let overlap = compute_distribution_overlap(0.5, 0.5, 2.0, 0.0, 0.0);
        assert!(overlap > 0.0, "Cell should overlap distribution");

        // No overlap
        let no_overlap = compute_distribution_overlap(10.0, 10.0, 1.0, 0.0, 0.0);
        assert!((no_overlap - 0.0).abs() < 1e-6, "No overlap expected");

        // Partial overlap
        let partial = compute_distribution_overlap(0.0, 0.0, 1.0, 0.0, 0.0);
        assert!(
            partial > 0.0 && partial < 1.0,
            "Partial overlap expected: {}",
            partial
        );
    }
}
