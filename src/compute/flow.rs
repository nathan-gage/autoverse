//! Flow field computation for mass-conservative updates.
//!
//! The flow field determines how mass moves through the grid.

use crate::schema::FlowConfig;

/// Compute the alpha weighting factor for diffusion priority.
///
/// alpha(x) = clamp((A_sum(x) / beta_A)^n, 0, 1)
///
/// When mass approaches beta_A, alpha approaches 1 and diffusion dominates.
#[inline]
pub fn compute_alpha(mass: f32, beta_a: f32, n: f32) -> f32 {
    (mass / beta_a).powf(n).clamp(0.0, 1.0)
}

/// Compute flow field from affinity gradient and mass gradient.
///
/// F(x) = (1 - alpha) * grad_U(x) - alpha * grad_A(x)
///
/// Returns (flow_x, flow_y) vectors.
pub fn compute_flow_field(
    grad_u_x: &[f32],
    grad_u_y: &[f32],
    grad_a_x: &[f32],
    grad_a_y: &[f32],
    mass_sum: &[f32],
    config: &FlowConfig,
) -> (Vec<f32>, Vec<f32>) {
    let len = grad_u_x.len();
    let mut flow_x = vec![0.0f32; len];
    let mut flow_y = vec![0.0f32; len];

    for i in 0..len {
        let alpha = compute_alpha(mass_sum[i], config.beta_a, config.n);
        let one_minus_alpha = 1.0 - alpha;

        // F = (1 - alpha) * grad_U - alpha * grad_A
        flow_x[i] = one_minus_alpha * grad_u_x[i] - alpha * grad_a_x[i];
        flow_y[i] = one_minus_alpha * grad_u_y[i] - alpha * grad_a_y[i];
    }

    (flow_x, flow_y)
}

/// Compute flow field per channel (when channels have separate affinities).
pub fn compute_flow_field_per_channel(
    affinity_grads: &[(Vec<f32>, Vec<f32>)], // Per-channel (grad_x, grad_y)
    grad_a_x: &[f32],                         // Total mass gradient
    grad_a_y: &[f32],
    mass_sum: &[f32],
    config: &FlowConfig,
) -> Vec<(Vec<f32>, Vec<f32>)> {
    affinity_grads
        .iter()
        .map(|(gux, guy)| compute_flow_field(gux, guy, grad_a_x, grad_a_y, mass_sum, config))
        .collect()
}

/// Flow field with magnitude limiting for stability.
///
/// Limits flow magnitude to prevent mass from moving more than one cell per step.
pub fn limit_flow_magnitude(flow_x: &mut [f32], flow_y: &mut [f32], max_magnitude: f32) {
    for (fx, fy) in flow_x.iter_mut().zip(flow_y.iter_mut()) {
        let mag = (*fx * *fx + *fy * *fy).sqrt();
        if mag > max_magnitude {
            let scale = max_magnitude / mag;
            *fx *= scale;
            *fy *= scale;
        }
    }
}

/// Compute flow field statistics for debugging/monitoring.
pub struct FlowStats {
    pub mean_magnitude: f32,
    pub max_magnitude: f32,
    pub mean_alpha: f32,
}

impl FlowStats {
    pub fn compute(flow_x: &[f32], flow_y: &[f32], mass_sum: &[f32], config: &FlowConfig) -> Self {
        let len = flow_x.len();
        if len == 0 {
            return Self {
                mean_magnitude: 0.0,
                max_magnitude: 0.0,
                mean_alpha: 0.0,
            };
        }

        let mut sum_mag = 0.0f32;
        let mut max_mag = 0.0f32;
        let mut sum_alpha = 0.0f32;

        for i in 0..len {
            let mag = (flow_x[i] * flow_x[i] + flow_y[i] * flow_y[i]).sqrt();
            sum_mag += mag;
            max_mag = max_mag.max(mag);
            sum_alpha += compute_alpha(mass_sum[i], config.beta_a, config.n);
        }

        Self {
            mean_magnitude: sum_mag / len as f32,
            max_magnitude: max_mag,
            mean_alpha: sum_alpha / len as f32,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_alpha_bounds() {
        let config = FlowConfig::default();

        // Zero mass -> alpha = 0
        assert_eq!(compute_alpha(0.0, config.beta_a, config.n), 0.0);

        // Mass at beta_a -> alpha = 1
        assert_eq!(compute_alpha(config.beta_a, config.beta_a, config.n), 1.0);

        // Mass above beta_a -> alpha clamped to 1
        assert_eq!(compute_alpha(config.beta_a * 2.0, config.beta_a, config.n), 1.0);
    }

    #[test]
    fn test_flow_zero_mass() {
        // With zero mass (alpha=0), flow should follow affinity gradient
        let grad_u_x = vec![1.0, 2.0, 3.0];
        let grad_u_y = vec![0.5, 1.0, 1.5];
        let grad_a_x = vec![-1.0, -2.0, -3.0];
        let grad_a_y = vec![-0.5, -1.0, -1.5];
        let mass_sum = vec![0.0, 0.0, 0.0];
        let config = FlowConfig::default();

        let (fx, fy) = compute_flow_field(&grad_u_x, &grad_u_y, &grad_a_x, &grad_a_y, &mass_sum, &config);

        // Should equal grad_U since alpha = 0
        for i in 0..3 {
            assert!((fx[i] - grad_u_x[i]).abs() < 1e-6);
            assert!((fy[i] - grad_u_y[i]).abs() < 1e-6);
        }
    }

    #[test]
    fn test_flow_high_mass() {
        // With high mass (alpha=1), flow should follow negative mass gradient
        let grad_u_x = vec![1.0, 2.0, 3.0];
        let grad_u_y = vec![0.5, 1.0, 1.5];
        let grad_a_x = vec![-1.0, -2.0, -3.0];
        let grad_a_y = vec![-0.5, -1.0, -1.5];
        let config = FlowConfig::default();
        let mass_sum = vec![config.beta_a * 10.0; 3]; // Very high mass

        let (fx, fy) = compute_flow_field(&grad_u_x, &grad_u_y, &grad_a_x, &grad_a_y, &mass_sum, &config);

        // Should equal -grad_A since alpha = 1
        for i in 0..3 {
            assert!((fx[i] - (-grad_a_x[i])).abs() < 1e-6);
            assert!((fy[i] - (-grad_a_y[i])).abs() < 1e-6);
        }
    }

    #[test]
    fn test_alpha_intermediate_values() {
        let config = FlowConfig {
            beta_a: 1.0,
            n: 2.0,
            distribution_size: 1.0,
        };

        // Test monotonicity: alpha should increase with mass
        let alpha_0 = compute_alpha(0.0, config.beta_a, config.n);
        let alpha_quarter = compute_alpha(0.25 * config.beta_a, config.beta_a, config.n);
        let alpha_half = compute_alpha(0.5 * config.beta_a, config.beta_a, config.n);
        let alpha_three_quarter = compute_alpha(0.75 * config.beta_a, config.beta_a, config.n);
        let alpha_full = compute_alpha(config.beta_a, config.beta_a, config.n);

        assert!(alpha_0 < alpha_quarter, "alpha should increase: {} < {}", alpha_0, alpha_quarter);
        assert!(alpha_quarter < alpha_half, "alpha should increase: {} < {}", alpha_quarter, alpha_half);
        assert!(alpha_half < alpha_three_quarter, "alpha should increase: {} < {}", alpha_half, alpha_three_quarter);
        assert!(alpha_three_quarter < alpha_full, "alpha should increase: {} < {}", alpha_three_quarter, alpha_full);

        // With n=2, alpha at half beta_a should be 0.25
        assert!(
            (alpha_half - 0.25).abs() < 1e-6,
            "alpha(0.5*beta_a) with n=2 should be 0.25, got {}",
            alpha_half
        );

        // All intermediate values should be in (0, 1)
        assert!(alpha_quarter > 0.0 && alpha_quarter < 1.0);
        assert!(alpha_half > 0.0 && alpha_half < 1.0);
        assert!(alpha_three_quarter > 0.0 && alpha_three_quarter < 1.0);
    }

    #[test]
    fn test_alpha_different_n_values() {
        let beta_a = 1.0;
        let mass = 0.5;

        // n=1: linear transition
        let alpha_n1 = compute_alpha(mass, beta_a, 1.0);
        assert!((alpha_n1 - 0.5).abs() < 1e-6, "n=1 should give linear alpha");

        // n=2: quadratic (slower initial transition)
        let alpha_n2 = compute_alpha(mass, beta_a, 2.0);
        assert!((alpha_n2 - 0.25).abs() < 1e-6, "n=2 should give quadratic alpha");

        // Higher n means slower transition at low mass
        let alpha_n4 = compute_alpha(mass, beta_a, 4.0);
        assert!(alpha_n4 < alpha_n2, "higher n should give slower transition");
    }

    #[test]
    fn test_limit_flow_magnitude() {
        let mut flow_x = vec![3.0, 0.0, 4.0, 10.0];
        let mut flow_y = vec![4.0, 5.0, 3.0, 0.0];
        // Magnitudes: 5.0, 5.0, 5.0, 10.0

        let max_mag = 6.0;
        limit_flow_magnitude(&mut flow_x, &mut flow_y, max_mag);

        // First three should be unchanged (mag=5 < 6)
        assert!((flow_x[0] - 3.0).abs() < 1e-6);
        assert!((flow_y[0] - 4.0).abs() < 1e-6);
        assert!((flow_x[1] - 0.0).abs() < 1e-6);
        assert!((flow_y[1] - 5.0).abs() < 1e-6);
        assert!((flow_x[2] - 4.0).abs() < 1e-6);
        assert!((flow_y[2] - 3.0).abs() < 1e-6);

        // Last one should be scaled down (mag=10 > 6)
        let final_mag = (flow_x[3] * flow_x[3] + flow_y[3] * flow_y[3]).sqrt();
        assert!(
            (final_mag - max_mag).abs() < 1e-5,
            "Magnitude should be limited to {}, got {}",
            max_mag,
            final_mag
        );
        // Direction should be preserved (purely in x direction)
        assert!(flow_y[3].abs() < 1e-6, "y component should remain 0");
        assert!(flow_x[3] > 0.0, "x component should remain positive");
    }

    #[test]
    fn test_limit_flow_magnitude_preserves_direction() {
        let mut flow_x = vec![30.0];
        let mut flow_y = vec![40.0];
        // Magnitude: 50.0, direction: atan2(40, 30)

        let max_mag = 5.0;
        limit_flow_magnitude(&mut flow_x, &mut flow_y, max_mag);

        let final_mag = (flow_x[0] * flow_x[0] + flow_y[0] * flow_y[0]).sqrt();
        assert!((final_mag - max_mag).abs() < 1e-5);

        // Check ratio preserved (should be 3:4)
        let ratio = flow_x[0] / flow_y[0];
        assert!(
            (ratio - 0.75).abs() < 1e-5,
            "Direction should be preserved, ratio should be 0.75, got {}",
            ratio
        );
    }

    #[test]
    fn test_flow_stats_computation() {
        let flow_x = vec![3.0, 0.0, 4.0];
        let flow_y = vec![4.0, 5.0, 3.0];
        // Magnitudes: 5.0, 5.0, 5.0
        let mass_sum = vec![0.0, 0.5, 1.0];
        let config = FlowConfig {
            beta_a: 1.0,
            n: 2.0,
            distribution_size: 1.0,
        };

        let stats = FlowStats::compute(&flow_x, &flow_y, &mass_sum, &config);

        assert!((stats.mean_magnitude - 5.0).abs() < 1e-5, "Mean magnitude should be 5.0");
        assert!((stats.max_magnitude - 5.0).abs() < 1e-5, "Max magnitude should be 5.0");

        // Alpha values: 0, 0.25, 1.0 -> mean = 0.4167
        let expected_mean_alpha = (0.0 + 0.25 + 1.0) / 3.0;
        assert!(
            (stats.mean_alpha - expected_mean_alpha).abs() < 1e-5,
            "Mean alpha should be {}, got {}",
            expected_mean_alpha,
            stats.mean_alpha
        );
    }
}
