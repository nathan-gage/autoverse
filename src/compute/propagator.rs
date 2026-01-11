//! CPU Propagator - Main simulation driver for Flow Lenia.
//!
//! Orchestrates all computation stages for each time step.

use crate::schema::{Seed, SimulationConfig};

#[cfg(not(target_arch = "wasm32"))]
use rayon::prelude::*;

use super::{
    CachedConvolver, FrequencyKernel, Kernel, advect_mass_into, compute_flow_field,
    growth_accumulate, sobel_gradient_fast, total_mass_all_channels,
};

/// Simulation state container.
pub struct SimulationState {
    /// Per-channel activation grids [channel][y * width + x].
    pub channels: Vec<Vec<f32>>,
    /// Grid width.
    pub width: usize,
    /// Grid height.
    pub height: usize,
    /// Current simulation time.
    pub time: f32,
    /// Step count.
    pub step: u64,
}

impl SimulationState {
    /// Create new state from seed.
    pub fn from_seed(seed: &Seed, config: &SimulationConfig) -> Self {
        let grid_3d = seed.generate(config.width, config.height, config.channels);

        // Flatten to [channel][flat_grid]
        let channels: Vec<Vec<f32>> = grid_3d
            .into_iter()
            .map(|channel_2d| channel_2d.into_iter().flatten().collect())
            .collect();

        Self {
            channels,
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

/// CPU-based Flow Lenia propagator.
pub struct CpuPropagator {
    config: SimulationConfig,
    convolver: CachedConvolver,
    /// Scratch buffer for affinity field.
    affinity: Vec<Vec<f32>>,
    /// Pre-allocated buffer for next state channels (reused each step).
    next_channels: Vec<Vec<f32>>,
    /// Pre-allocated buffer for channel sum.
    channel_sum_buffer: Vec<f32>,
}

impl CpuPropagator {
    /// Create new propagator from configuration.
    pub fn new(config: SimulationConfig) -> Self {
        config.validate().expect("Invalid configuration");

        let width = config.width;
        let height = config.height;
        let channels = config.channels;

        // Precompute frequency-domain kernels
        let freq_kernels: Vec<FrequencyKernel> = config
            .kernels
            .iter()
            .map(|kc| {
                let kernel = Kernel::from_config(kc, config.kernel_radius);
                let padded = kernel.pad_to_size(width, height);
                FrequencyKernel::from_spatial(
                    &padded,
                    width,
                    height,
                    kernel.source_channel,
                    kernel.target_channel,
                    kernel.weight,
                    kernel.mu,
                    kernel.sigma,
                )
            })
            .collect();

        let convolver = CachedConvolver::new(width, height, freq_kernels);

        let grid_size = width * height;

        // Allocate scratch buffers
        let affinity = vec![vec![0.0f32; grid_size]; channels];

        // Pre-allocate output buffers (reused each step)
        let next_channels = vec![vec![0.0f32; grid_size]; channels];
        let channel_sum_buffer = vec![0.0f32; grid_size];

        Self {
            config,
            convolver,
            affinity,
            next_channels,
            channel_sum_buffer,
        }
    }

    /// Perform one simulation step.
    pub fn step(&mut self, state: &mut SimulationState) {
        let width = self.config.width;
        let height = self.config.height;
        let dt = self.config.dt;

        // Clear affinity buffers
        for aff in &mut self.affinity {
            aff.fill(0.0);
        }

        // 1. Convolution and Growth Stage
        // For each kernel: convolve source channel, apply growth, accumulate to target

        #[cfg(not(target_arch = "wasm32"))]
        {
            // Native: Parallel convolutions, then sequential accumulation
            let conv_results: Vec<_> = self
                .convolver
                .kernels()
                .par_iter()
                .enumerate()
                .map(|(kernel_idx, kernel)| {
                    let source = &state.channels[kernel.source_channel];
                    let conv_result = self.convolver.convolve_with_kernel(source, kernel_idx);
                    (
                        kernel.target_channel,
                        kernel.weight,
                        kernel.mu,
                        kernel.sigma,
                        conv_result,
                    )
                })
                .collect();

            // Accumulate results sequentially (writes to shared buffers)
            for (target_channel, weight, mu, sigma, conv_result) in conv_results {
                growth_accumulate(
                    &conv_result,
                    &mut self.affinity[target_channel],
                    weight,
                    mu,
                    sigma,
                );
            }
        }

        #[cfg(target_arch = "wasm32")]
        {
            // WASM: Sequential processing
            for (kernel_idx, kernel) in self.convolver.kernels().iter().enumerate() {
                let source = &state.channels[kernel.source_channel];
                let conv_result = self.convolver.convolve_with_kernel(source, kernel_idx);

                growth_accumulate(
                    &conv_result,
                    &mut self.affinity[kernel.target_channel],
                    kernel.weight,
                    kernel.mu,
                    kernel.sigma,
                );
            }
        }

        // 2. Compute Total Mass Sum (reusing pre-allocated buffer)
        self.channel_sum_buffer.fill(0.0);
        for channel in &state.channels {
            for (sum, &val) in self.channel_sum_buffer.iter_mut().zip(channel.iter()) {
                *sum += val;
            }
        }

        // 3. Gradient Stage
        let (grad_a_x, grad_a_y) = sobel_gradient_fast(&self.channel_sum_buffer, width, height);

        // 4. Flow Stage - compute per-channel flow fields and advect
        let flow_config = &self.config.flow;
        let channel_sum = &self.channel_sum_buffer;
        let distribution_size = flow_config.distribution_size;

        #[cfg(not(target_arch = "wasm32"))]
        {
            // Native: Parallel channel processing
            // Each channel is processed independently with its own affinity and output buffer
            self.affinity
                .par_iter()
                .zip(state.channels.par_iter())
                .zip(self.next_channels.par_iter_mut())
                .for_each(|((affinity, current), next)| {
                    // Gradient of affinity for this channel
                    let (grad_u_x, grad_u_y) = sobel_gradient_fast(affinity, width, height);

                    // Compute flow field
                    let (fx, fy) = compute_flow_field(
                        &grad_u_x,
                        &grad_u_y,
                        &grad_a_x,
                        &grad_a_y,
                        channel_sum,
                        flow_config,
                    );

                    // 5. Reintegration Stage - advect mass into pre-allocated buffer
                    next.fill(0.0);
                    advect_mass_into(
                        current,
                        &fx,
                        &fy,
                        next,
                        width,
                        height,
                        dt,
                        distribution_size,
                    );
                });
        }

        #[cfg(target_arch = "wasm32")]
        {
            // WASM: Sequential processing
            for c in 0..self.config.channels {
                let (grad_u_x, grad_u_y) = sobel_gradient_fast(&self.affinity[c], width, height);

                let (fx, fy) = compute_flow_field(
                    &grad_u_x,
                    &grad_u_y,
                    &grad_a_x,
                    &grad_a_y,
                    channel_sum,
                    flow_config,
                );

                self.next_channels[c].fill(0.0);
                advect_mass_into(
                    &state.channels[c],
                    &fx,
                    &fy,
                    &mut self.next_channels[c],
                    width,
                    height,
                    dt,
                    distribution_size,
                );
            }
        }

        // Swap channels (no allocation, just pointer swap)
        std::mem::swap(&mut state.channels, &mut self.next_channels);
        state.time += dt;
        state.step += 1;
    }

    /// Run simulation for specified number of steps.
    pub fn run(&mut self, state: &mut SimulationState, steps: u64) {
        for _ in 0..steps {
            self.step(state);
        }
    }

    /// Get configuration reference.
    pub fn config(&self) -> &SimulationConfig {
        &self.config
    }
}

/// Simulation statistics for monitoring.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SimulationStats {
    pub total_mass: f32,
    pub max_value: f32,
    pub min_value: f32,
    pub mean_value: f32,
    pub active_cells: usize,
}

impl SimulationStats {
    /// Compute statistics from state.
    pub fn from_state(state: &SimulationState) -> Self {
        let mut total_mass = 0.0f32;
        let mut max_value = f32::NEG_INFINITY;
        let mut min_value = f32::INFINITY;
        let mut active_cells = 0usize;
        let mut count = 0usize;

        for channel in &state.channels {
            for &v in channel {
                total_mass += v;
                max_value = max_value.max(v);
                min_value = min_value.min(v);
                if v > 1e-6 {
                    active_cells += 1;
                }
                count += 1;
            }
        }

        Self {
            total_mass,
            max_value,
            min_value,
            mean_value: total_mass / count as f32,
            active_cells,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{FlowConfig, KernelConfig, Pattern, RingConfig};

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 64,
            height: 64,
            channels: 1,
            dt: 0.2,
            kernel_radius: 10,
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
        }
    }

    #[test]
    fn test_propagator_creation() {
        let config = test_config();
        let _propagator = CpuPropagator::new(config);
    }

    #[test]
    fn test_mass_conservation() {
        let config = test_config();
        let mut propagator = CpuPropagator::new(config.clone());

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.15,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut state = SimulationState::from_seed(&seed, &config);
        let initial_mass = state.total_mass();

        // Run several steps
        propagator.run(&mut state, 10);

        let final_mass = state.total_mass();

        // Mass should be conserved within numerical tolerance
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;
        assert!(
            relative_error < 0.01,
            "Mass not conserved: {} -> {} ({}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    #[test]
    fn test_state_from_seed() {
        let config = test_config();
        let seed = Seed::default();
        let state = SimulationState::from_seed(&seed, &config);

        assert_eq!(state.channels.len(), config.channels);
        assert_eq!(state.channels[0].len(), config.width * config.height);
        assert!(state.total_mass() > 0.0);
    }

    #[test]
    fn test_mass_conservation_long_run() {
        // Run many iterations to catch numerical drift
        let config = test_config();
        let mut propagator = CpuPropagator::new(config.clone());

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.15,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut state = SimulationState::from_seed(&seed, &config);
        let initial_mass = state.total_mass();

        // Run 100 steps - should catch drift issues
        propagator.run(&mut state, 100);

        let final_mass = state.total_mass();
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;

        assert!(
            relative_error < 0.001,
            "Mass drift over 100 steps: {} -> {} ({:.4}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    #[test]
    fn test_multichannel_mass_conservation() {
        // Test that each channel conserves mass independently
        let mut config = test_config();
        config.channels = 2;
        config.kernels = vec![
            KernelConfig {
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
            },
            KernelConfig {
                radius: 1.0,
                rings: vec![RingConfig {
                    amplitude: 1.0,
                    distance: 0.5,
                    width: 0.15,
                }],
                weight: 1.0,
                mu: 0.15,
                sigma: 0.015,
                source_channel: 1,
                target_channel: 1,
            },
        ];

        let mut propagator = CpuPropagator::new(config.clone());

        // Create state with different mass in each channel
        let seed = Seed {
            pattern: Pattern::MultiBlob {
                blobs: vec![
                    crate::schema::BlobSpec {
                        center: (0.3, 0.5),
                        radius: 0.1,
                        amplitude: 1.0,
                        channel: 0,
                    },
                    crate::schema::BlobSpec {
                        center: (0.7, 0.5),
                        radius: 0.1,
                        amplitude: 2.0,
                        channel: 1,
                    },
                ],
            },
        };

        let mut state = SimulationState::from_seed(&seed, &config);
        let initial_mass_ch0: f32 = state.channels[0].iter().sum();
        let initial_mass_ch1: f32 = state.channels[1].iter().sum();

        propagator.run(&mut state, 20);

        let final_mass_ch0: f32 = state.channels[0].iter().sum();
        let final_mass_ch1: f32 = state.channels[1].iter().sum();

        let error_ch0 = (final_mass_ch0 - initial_mass_ch0).abs() / initial_mass_ch0;
        let error_ch1 = (final_mass_ch1 - initial_mass_ch1).abs() / initial_mass_ch1;

        assert!(
            error_ch0 < 0.01,
            "Channel 0 mass not conserved: {} -> {} ({:.2}% error)",
            initial_mass_ch0,
            final_mass_ch0,
            error_ch0 * 100.0
        );
        assert!(
            error_ch1 < 0.01,
            "Channel 1 mass not conserved: {} -> {} ({:.2}% error)",
            initial_mass_ch1,
            final_mass_ch1,
            error_ch1 * 100.0
        );
    }
}
