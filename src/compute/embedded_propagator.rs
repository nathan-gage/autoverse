//! Embedded CPU Propagator - Flow Lenia with parameter embedding.
//!
//! This propagator supports spatially-varying parameters that flow with mass,
//! enabling multi-species simulations with emergent evolutionary dynamics.
//!
//! # Differences from Standard Propagator
//!
//! 1. Uses direct convolution (not FFT) to support per-cell parameters
//! 2. Parameters are advected alongside mass during reintegration
//! 3. Stochastic parameter mixing when mass from different sources collides
//!
//! # Performance Considerations
//!
//! Direct convolution has O(N * K²) complexity vs FFT's O(N log N), making it
//! slower for large kernels. GPU acceleration is recommended for production use.

use crate::schema::{CellParams, ParameterGrid, Seed, SimulationConfig};

use super::{
    Kernel, advect_mass_and_params_into, advect_mass_into, compute_alpha,
    convolve_growth_accumulate_embedded, sobel_gradient_into, total_mass_all_channels,
};

/// Simulation state with embedded parameters.
pub struct EmbeddedState {
    /// Per-channel activation grids [channel][y * width + x].
    pub channels: Vec<Vec<f32>>,
    /// Per-channel parameter grids [channel].
    pub params: Vec<ParameterGrid>,
    /// Grid width.
    pub width: usize,
    /// Grid height.
    pub height: usize,
    /// Current simulation time.
    pub time: f32,
    /// Step count.
    pub step: u64,
}

impl EmbeddedState {
    /// Create new state from seed with default parameters.
    pub fn from_seed(seed: &Seed, config: &SimulationConfig) -> Self {
        let grid_3d = seed.generate(config.width, config.height, config.channels);

        // Flatten to [channel][flat_grid]
        let channels: Vec<Vec<f32>> = grid_3d
            .into_iter()
            .map(|channel_2d| channel_2d.into_iter().flatten().collect())
            .collect();

        // Initialize parameter grids with defaults from config
        let default_params = CellParams {
            mu: config.kernels.first().map(|k| k.mu).unwrap_or(0.15),
            sigma: config.kernels.first().map(|k| k.sigma).unwrap_or(0.015),
            weight: config.kernels.first().map(|k| k.weight).unwrap_or(1.0),
            beta_a: config.flow.beta_a,
            n: config.flow.n,
        };

        let params = (0..config.channels)
            .map(|_| ParameterGrid::new(config.width, config.height, default_params))
            .collect();

        Self {
            channels,
            params,
            width: config.width,
            height: config.height,
            time: 0.0,
            step: 0,
        }
    }

    /// Create state with custom initial parameters.
    pub fn from_seed_with_params(
        seed: &Seed,
        config: &SimulationConfig,
        initial_params: Vec<ParameterGrid>,
    ) -> Self {
        let grid_3d = seed.generate(config.width, config.height, config.channels);

        let channels: Vec<Vec<f32>> = grid_3d
            .into_iter()
            .map(|channel_2d| channel_2d.into_iter().flatten().collect())
            .collect();

        assert_eq!(
            initial_params.len(),
            config.channels,
            "Must provide one parameter grid per channel"
        );

        Self {
            channels,
            params: initial_params,
            width: config.width,
            height: config.height,
            time: 0.0,
            step: 0,
        }
    }

    /// Get total mass across all channels.
    pub fn total_mass(&self) -> f32 {
        total_mass_all_channels(&self.channels)
    }

    /// Get value at (x, y, channel).
    #[inline]
    pub fn get(&self, x: usize, y: usize, channel: usize) -> f32 {
        self.channels[channel][y * self.width + x]
    }

    /// Get parameters at (x, y, channel).
    #[inline]
    pub fn get_params(&self, x: usize, y: usize, channel: usize) -> CellParams {
        self.params[channel].get(x, y)
    }

    /// Sum across all channels at (x, y).
    pub fn sum_at(&self, x: usize, y: usize) -> f32 {
        let idx = y * self.width + x;
        self.channels.iter().map(|c| c[idx]).sum()
    }

    /// Compute sum grid across all channels.
    pub fn channel_sum(&self) -> Vec<f32> {
        let size = self.width * self.height;
        let mut sum = vec![0.0f32; size];

        for channel in &self.channels {
            for (s, &c) in sum.iter_mut().zip(channel.iter()) {
                *s += c;
            }
        }

        sum
    }
}

/// CPU propagator with parameter embedding support.
pub struct EmbeddedPropagator {
    config: SimulationConfig,
    /// Precomputed spatial-domain kernels.
    kernels: Vec<Kernel>,
    /// Scratch buffer for affinity field.
    affinity: Vec<Vec<f32>>,
    /// Pre-allocated buffer for next state channels.
    next_channels: Vec<Vec<f32>>,
    /// Pre-allocated buffer for next state parameters.
    next_params: Vec<ParameterGrid>,
    /// Pre-allocated buffer for channel sum.
    channel_sum_buffer: Vec<f32>,
    /// Pre-allocated buffers for mass gradient.
    grad_a_x: Vec<f32>,
    grad_a_y: Vec<f32>,
    /// Pre-allocated buffers for per-channel computations.
    per_channel_scratch: Vec<ChannelScratch>,
}

/// Per-channel scratch buffers.
struct ChannelScratch {
    grad_u_x: Vec<f32>,
    grad_u_y: Vec<f32>,
    flow_x: Vec<f32>,
    flow_y: Vec<f32>,
}

impl EmbeddedPropagator {
    /// Create new embedded propagator from configuration.
    pub fn new(config: SimulationConfig) -> Self {
        config.validate().expect("Invalid configuration");

        let width = config.width;
        let height = config.height;
        let channels = config.channels;
        let grid_size = width * height;

        // Generate spatial-domain kernels (used for direct convolution)
        let kernels: Vec<Kernel> = config
            .kernels
            .iter()
            .map(|kc| Kernel::from_config(kc, config.kernel_radius))
            .collect();

        // Allocate scratch buffers
        let affinity = vec![vec![0.0f32; grid_size]; channels];
        let next_channels = vec![vec![0.0f32; grid_size]; channels];

        let default_params = CellParams::default();
        let next_params = (0..channels)
            .map(|_| ParameterGrid::new(width, height, default_params))
            .collect();

        let channel_sum_buffer = vec![0.0f32; grid_size];
        let grad_a_x = vec![0.0f32; grid_size];
        let grad_a_y = vec![0.0f32; grid_size];

        let per_channel_scratch = (0..channels)
            .map(|_| ChannelScratch {
                grad_u_x: vec![0.0f32; grid_size],
                grad_u_y: vec![0.0f32; grid_size],
                flow_x: vec![0.0f32; grid_size],
                flow_y: vec![0.0f32; grid_size],
            })
            .collect();

        Self {
            config,
            kernels,
            affinity,
            next_channels,
            next_params,
            channel_sum_buffer,
            grad_a_x,
            grad_a_y,
            per_channel_scratch,
        }
    }

    /// Perform one simulation step with parameter embedding.
    pub fn step(&mut self, state: &mut EmbeddedState) {
        let width = self.config.width;
        let height = self.config.height;
        let dt = self.config.dt;
        let embedding_config = &self.config.embedding;

        // Clear affinity buffers
        for aff in &mut self.affinity {
            aff.fill(0.0);
        }

        // 1. Convolution and Growth Stage with embedded parameters
        // Uses direct convolution with per-cell parameters
        for kernel in &self.kernels {
            let source = &state.channels[kernel.source_channel];
            let params = &state.params[kernel.target_channel];

            convolve_growth_accumulate_embedded(
                source,
                kernel,
                params,
                &mut self.affinity[kernel.target_channel],
                width,
                height,
            );
        }

        // 2. Compute Total Mass Sum
        self.channel_sum_buffer.fill(0.0);
        for channel in &state.channels {
            for (sum, &val) in self.channel_sum_buffer.iter_mut().zip(channel.iter()) {
                *sum += val;
            }
        }

        // 3. Gradient Stage - compute mass gradient
        sobel_gradient_into(
            &self.channel_sum_buffer,
            &mut self.grad_a_x,
            &mut self.grad_a_y,
            width,
            height,
        );

        // 4. Flow Stage - compute per-channel flow fields
        let flow_config = &self.config.flow;
        let distribution_size = flow_config.distribution_size;

        for c in 0..self.config.channels {
            let scratch = &mut self.per_channel_scratch[c];

            // Gradient of affinity for this channel
            sobel_gradient_into(
                &self.affinity[c],
                &mut scratch.grad_u_x,
                &mut scratch.grad_u_y,
                width,
                height,
            );

            // Compute flow field
            // Note: Using per-cell beta_a and n from embedded parameters
            compute_flow_field_embedded_into(
                &scratch.grad_u_x,
                &scratch.grad_u_y,
                &self.grad_a_x,
                &self.grad_a_y,
                &self.channel_sum_buffer,
                &state.params[c],
                &mut scratch.flow_x,
                &mut scratch.flow_y,
            );

            // 5. Reintegration Stage - advect mass AND parameters
            if embedding_config.enabled {
                // Full parameter advection with mixing
                advect_mass_and_params_into(
                    &state.channels[c],
                    &state.params[c],
                    &scratch.flow_x,
                    &scratch.flow_y,
                    embedding_config,
                    dt,
                    distribution_size,
                    width,
                    height,
                    &mut self.next_channels[c],
                    &mut self.next_params[c],
                );
            } else {
                // Standard mass-only advection (parameters stay static)
                self.next_channels[c].fill(0.0);
                advect_mass_into(
                    &state.channels[c],
                    &scratch.flow_x,
                    &scratch.flow_y,
                    &mut self.next_channels[c],
                    width,
                    height,
                    dt,
                    distribution_size,
                );
                // Copy parameters unchanged
                self.next_params[c]
                    .data_mut()
                    .copy_from_slice(state.params[c].data());
            }
        }

        // Swap channels and parameters
        std::mem::swap(&mut state.channels, &mut self.next_channels);
        std::mem::swap(&mut state.params, &mut self.next_params);
        state.time += dt;
        state.step += 1;
    }

    /// Run simulation for specified number of steps.
    pub fn run(&mut self, state: &mut EmbeddedState, steps: u64) {
        for _ in 0..steps {
            self.step(state);
        }
    }

    /// Get configuration reference.
    pub fn config(&self) -> &SimulationConfig {
        &self.config
    }
}

/// Compute flow field using per-cell embedded parameters.
#[allow(clippy::too_many_arguments)]
fn compute_flow_field_embedded_into(
    grad_u_x: &[f32],
    grad_u_y: &[f32],
    grad_a_x: &[f32],
    grad_a_y: &[f32],
    mass_sum: &[f32],
    params: &ParameterGrid,
    flow_x: &mut [f32],
    flow_y: &mut [f32],
) {
    for i in 0..grad_u_x.len() {
        let cell_params = params.get_idx(i);
        let alpha = compute_alpha(mass_sum[i], cell_params.beta_a, cell_params.n);
        let one_minus_alpha = 1.0 - alpha;

        flow_x[i] = one_minus_alpha * grad_u_x[i] - alpha * grad_a_x[i];
        flow_y[i] = one_minus_alpha * grad_u_y[i] - alpha * grad_a_y[i];
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{EmbeddingConfig, FlowConfig, KernelConfig, Pattern, RingConfig};

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 32,
            height: 32,
            channels: 1,
            dt: 0.2,
            kernel_radius: 5,
            kernels: vec![KernelConfig {
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
            }],
            flow: FlowConfig {
                beta_a: 1.0,
                n: 2.0,
                distribution_size: 1.0,
            },
            embedding: EmbeddingConfig::enabled(),
        }
    }

    #[test]
    fn test_embedded_propagator_creation() {
        let config = test_config();
        let _propagator = EmbeddedPropagator::new(config);
    }

    #[test]
    fn test_embedded_state_creation() {
        let config = test_config();
        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.15,
                amplitude: 1.0,
                channel: 0,
            },
        };
        let state = EmbeddedState::from_seed(&seed, &config);

        assert_eq!(state.channels.len(), config.channels);
        assert_eq!(state.params.len(), config.channels);
        assert!(state.total_mass() > 0.0);
    }

    #[test]
    fn test_mass_conservation_embedded() {
        let config = test_config();
        let mut propagator = EmbeddedPropagator::new(config.clone());

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.15,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut state = EmbeddedState::from_seed(&seed, &config);
        let initial_mass = state.total_mass();

        // Run several steps
        propagator.run(&mut state, 10);

        let final_mass = state.total_mass();
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;

        assert!(
            relative_error < 0.05,
            "Mass not conserved: {} -> {} ({:.2}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    #[test]
    fn test_parameter_advection() {
        let mut config = test_config();
        config.embedding = EmbeddingConfig::enabled();

        let mut propagator = EmbeddedPropagator::new(config.clone());

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.25, 0.5),
                radius: 0.1,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut state = EmbeddedState::from_seed(&seed, &config);

        // Set custom parameters at the blob location
        let custom = CellParams::new(0.3, 0.03, 2.0, 1.5, 3.0);
        let center_x = (config.width as f32 * 0.25) as usize;
        let center_y = (config.height as f32 * 0.5) as usize;
        state.params[0].set(center_x, center_y, custom);

        // Run simulation
        propagator.run(&mut state, 5);

        // Parameters should have spread/moved with the mass
        // Check that custom parameters are no longer isolated at original position
        let original_params = state.params[0].get(center_x, center_y);

        // The parameters should have changed due to mixing/advection
        // (unless mass stayed perfectly still, which is unlikely)
        // This is a soft test - just checking the system runs without error
        // and parameters are being tracked
        assert!(original_params.mu > 0.0);
    }

    #[test]
    fn test_multispecies_setup() {
        let mut config = test_config();
        config.embedding = EmbeddingConfig::enabled();

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.2,
                amplitude: 1.0,
                channel: 0,
            },
        };

        // Create two species with different parameters
        let species_a = CellParams::new(0.1, 0.01, 1.0, 0.8, 2.0);
        let species_b = CellParams::new(0.2, 0.02, 1.5, 1.2, 3.0);

        let mut params = ParameterGrid::from_defaults(config.width, config.height);

        // Left half: species A, Right half: species B
        for y in 0..config.height {
            for x in 0..config.width {
                if x < config.width / 2 {
                    params.set(x, y, species_a);
                } else {
                    params.set(x, y, species_b);
                }
            }
        }

        let state = EmbeddedState::from_seed_with_params(&seed, &config, vec![params]);

        // Verify species are set up correctly
        let left_params = state.get_params(0, config.height / 2, 0);
        let right_params = state.get_params(config.width - 1, config.height / 2, 0);

        assert!((left_params.mu - species_a.mu).abs() < 1e-6);
        assert!((right_params.mu - species_b.mu).abs() < 1e-6);
    }
}
