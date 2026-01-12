//! 3D Flow field computation for mass-conservative updates.
//!
//! The flow field determines how mass moves through the 3D grid.

use crate::schema::FlowConfig;

use super::compute_alpha;

/// Compute 3D flow field from affinity gradient and mass gradient.
///
/// F(x) = (1 - alpha) * grad_U(x) - alpha * grad_A(x)
///
/// Returns (flow_x, flow_y, flow_z) vectors.
#[allow(clippy::too_many_arguments)]
#[inline]
pub fn compute_flow_field_3d(
    grad_u_x: &[f32],
    grad_u_y: &[f32],
    grad_u_z: &[f32],
    grad_a_x: &[f32],
    grad_a_y: &[f32],
    grad_a_z: &[f32],
    mass_sum: &[f32],
    config: &FlowConfig,
) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
    let len = grad_u_x.len();
    let mut flow_x = vec![0.0f32; len];
    let mut flow_y = vec![0.0f32; len];
    let mut flow_z = vec![0.0f32; len];
    compute_flow_field_3d_into(
        grad_u_x,
        grad_u_y,
        grad_u_z,
        grad_a_x,
        grad_a_y,
        grad_a_z,
        mass_sum,
        config,
        &mut flow_x,
        &mut flow_y,
        &mut flow_z,
    );
    (flow_x, flow_y, flow_z)
}

/// Compute 3D flow field into pre-allocated buffers.
/// This is the allocation-free version for use with pre-allocated buffers.
#[inline]
#[allow(clippy::too_many_arguments)]
pub fn compute_flow_field_3d_into(
    grad_u_x: &[f32],
    grad_u_y: &[f32],
    grad_u_z: &[f32],
    grad_a_x: &[f32],
    grad_a_y: &[f32],
    grad_a_z: &[f32],
    mass_sum: &[f32],
    config: &FlowConfig,
    flow_x: &mut [f32],
    flow_y: &mut [f32],
    flow_z: &mut [f32],
) {
    let len = grad_u_x.len();
    for i in 0..len {
        let alpha = compute_alpha(mass_sum[i], config.beta_a, config.n);
        let one_minus_alpha = 1.0 - alpha;

        // F = (1 - alpha) * grad_U - alpha * grad_A
        flow_x[i] = one_minus_alpha * grad_u_x[i] - alpha * grad_a_x[i];
        flow_y[i] = one_minus_alpha * grad_u_y[i] - alpha * grad_a_y[i];
        flow_z[i] = one_minus_alpha * grad_u_z[i] - alpha * grad_a_z[i];
    }
}

/// Compute 3D flow field per channel (when channels have separate affinities).
pub fn compute_flow_field_3d_per_channel(
    affinity_grads: &[(Vec<f32>, Vec<f32>, Vec<f32>)], // Per-channel (grad_x, grad_y, grad_z)
    grad_a_x: &[f32],                                  // Total mass gradient
    grad_a_y: &[f32],
    grad_a_z: &[f32],
    mass_sum: &[f32],
    config: &FlowConfig,
) -> Vec<(Vec<f32>, Vec<f32>, Vec<f32>)> {
    affinity_grads
        .iter()
        .map(|(gux, guy, guz)| {
            compute_flow_field_3d(
                gux, guy, guz, grad_a_x, grad_a_y, grad_a_z, mass_sum, config,
            )
        })
        .collect()
}

/// 3D flow field with magnitude limiting for stability.
///
/// Limits flow magnitude to prevent mass from moving more than one cell per step.
pub fn limit_flow_magnitude_3d(
    flow_x: &mut [f32],
    flow_y: &mut [f32],
    flow_z: &mut [f32],
    max_magnitude: f32,
) {
    for i in 0..flow_x.len() {
        let mag = (flow_x[i] * flow_x[i] + flow_y[i] * flow_y[i] + flow_z[i] * flow_z[i]).sqrt();
        if mag > max_magnitude {
            let scale = max_magnitude / mag;
            flow_x[i] *= scale;
            flow_y[i] *= scale;
            flow_z[i] *= scale;
        }
    }
}

/// Compute 3D flow field statistics for debugging/monitoring.
pub struct FlowStats3D {
    pub mean_magnitude: f32,
    pub max_magnitude: f32,
    pub mean_alpha: f32,
}

impl FlowStats3D {
    pub fn compute(
        flow_x: &[f32],
        flow_y: &[f32],
        flow_z: &[f32],
        mass_sum: &[f32],
        config: &FlowConfig,
    ) -> Self {
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
            let mag =
                (flow_x[i] * flow_x[i] + flow_y[i] * flow_y[i] + flow_z[i] * flow_z[i]).sqrt();
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
    fn test_flow_3d_zero_mass() {
        // With zero mass (alpha=0), flow should follow affinity gradient
        let grad_u_x = vec![1.0, 2.0, 3.0];
        let grad_u_y = vec![0.5, 1.0, 1.5];
        let grad_u_z = vec![0.25, 0.5, 0.75];
        let grad_a_x = vec![-1.0, -2.0, -3.0];
        let grad_a_y = vec![-0.5, -1.0, -1.5];
        let grad_a_z = vec![-0.25, -0.5, -0.75];
        let mass_sum = vec![0.0, 0.0, 0.0];
        let config = FlowConfig::default();

        let (fx, fy, fz) = compute_flow_field_3d(
            &grad_u_x, &grad_u_y, &grad_u_z, &grad_a_x, &grad_a_y, &grad_a_z, &mass_sum, &config,
        );

        // Should equal grad_U since alpha = 0
        for i in 0..3 {
            assert!((fx[i] - grad_u_x[i]).abs() < 1e-6);
            assert!((fy[i] - grad_u_y[i]).abs() < 1e-6);
            assert!((fz[i] - grad_u_z[i]).abs() < 1e-6);
        }
    }

    #[test]
    fn test_flow_3d_high_mass() {
        // With high mass (alpha=1), flow should follow negative mass gradient
        let grad_u_x = vec![1.0, 2.0, 3.0];
        let grad_u_y = vec![0.5, 1.0, 1.5];
        let grad_u_z = vec![0.25, 0.5, 0.75];
        let grad_a_x = vec![-1.0, -2.0, -3.0];
        let grad_a_y = vec![-0.5, -1.0, -1.5];
        let grad_a_z = vec![-0.25, -0.5, -0.75];
        let config = FlowConfig::default();
        let mass_sum = vec![config.beta_a * 10.0; 3]; // Very high mass

        let (fx, fy, fz) = compute_flow_field_3d(
            &grad_u_x, &grad_u_y, &grad_u_z, &grad_a_x, &grad_a_y, &grad_a_z, &mass_sum, &config,
        );

        // Should equal -grad_A since alpha = 1
        for i in 0..3 {
            assert!((fx[i] - (-grad_a_x[i])).abs() < 1e-6);
            assert!((fy[i] - (-grad_a_y[i])).abs() < 1e-6);
            assert!((fz[i] - (-grad_a_z[i])).abs() < 1e-6);
        }
    }

    #[test]
    fn test_limit_flow_magnitude_3d() {
        let mut flow_x = vec![3.0, 0.0];
        let mut flow_y = vec![4.0, 0.0];
        let mut flow_z = vec![0.0, 10.0];
        // Magnitudes: 5.0, 10.0

        let max_mag = 6.0;
        limit_flow_magnitude_3d(&mut flow_x, &mut flow_y, &mut flow_z, max_mag);

        // First should be unchanged (mag=5 < 6)
        assert!((flow_x[0] - 3.0).abs() < 1e-6);
        assert!((flow_y[0] - 4.0).abs() < 1e-6);
        assert!((flow_z[0] - 0.0).abs() < 1e-6);

        // Second should be scaled down (mag=10 > 6)
        let final_mag =
            (flow_x[1] * flow_x[1] + flow_y[1] * flow_y[1] + flow_z[1] * flow_z[1]).sqrt();
        assert!(
            (final_mag - max_mag).abs() < 1e-5,
            "Magnitude should be limited to {}, got {}",
            max_mag,
            final_mag
        );
    }

    #[test]
    fn test_flow_stats_3d() {
        let flow_x = vec![3.0, 0.0];
        let flow_y = vec![4.0, 0.0];
        let flow_z = vec![0.0, 5.0];
        // Magnitudes: 5.0, 5.0
        let mass_sum = vec![0.0, 1.0];
        let config = FlowConfig {
            beta_a: 1.0,
            n: 2.0,
            distribution_size: 1.0,
        };

        let stats = FlowStats3D::compute(&flow_x, &flow_y, &flow_z, &mass_sum, &config);

        assert!(
            (stats.mean_magnitude - 5.0).abs() < 1e-5,
            "Mean magnitude should be 5.0"
        );
        assert!(
            (stats.max_magnitude - 5.0).abs() < 1e-5,
            "Max magnitude should be 5.0"
        );

        // Alpha values: 0, 1.0 -> mean = 0.5
        assert!(
            (stats.mean_alpha - 0.5).abs() < 1e-5,
            "Mean alpha should be 0.5, got {}",
            stats.mean_alpha
        );
    }
}
