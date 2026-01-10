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
}
