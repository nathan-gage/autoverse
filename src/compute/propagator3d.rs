//! 3D CPU Propagator - Main simulation driver for 3D Flow Lenia.
//!
//! Orchestrates all computation stages for each time step in 3D.

use crate::schema::SimulationConfig;

#[cfg(not(target_arch = "wasm32"))]
use rayon::prelude::*;

use super::{
    CachedConvolver3D, Fft3DScratch, FrequencyKernel3D, Kernel3D, SimulationState,
    advect_mass_3d_into, compute_flow_field_3d_into, growth_accumulate, sobel_gradient_3d_into,
};

/// Per-channel scratch buffers for 3D gradient and flow computation.
struct ChannelScratch3D {
    grad_u_x: Vec<f32>,
    grad_u_y: Vec<f32>,
    grad_u_z: Vec<f32>,
    flow_x: Vec<f32>,
    flow_y: Vec<f32>,
    flow_z: Vec<f32>,
}

/// CPU-based 3D Flow Lenia propagator.
pub struct CpuPropagator3D {
    config: SimulationConfig,
    convolver: CachedConvolver3D,
    /// Scratch buffer for affinity field.
    affinity: Vec<Vec<f32>>,
    /// Pre-allocated buffer for next state channels.
    next_channels: Vec<Vec<f32>>,
    /// Pre-allocated buffer for channel sum.
    channel_sum_buffer: Vec<f32>,
    /// Pre-allocated buffers for mass gradient.
    grad_a_x: Vec<f32>,
    grad_a_y: Vec<f32>,
    grad_a_z: Vec<f32>,
    /// Pre-allocated buffers for per-channel computations.
    per_channel_scratch: Vec<ChannelScratch3D>,
    /// Pre-allocated FFT scratch buffers per kernel.
    fft_scratch: Vec<Fft3DScratch>,
    /// Pre-allocated convolution output buffers per kernel.
    conv_outputs: Vec<Vec<f32>>,
}

impl CpuPropagator3D {
    /// Create new 3D propagator from configuration.
    pub fn new(config: SimulationConfig) -> Self {
        config.validate().expect("Invalid configuration");
        assert!(config.is_3d(), "CpuPropagator3D requires depth > 1");

        let width = config.width;
        let height = config.height;
        let depth = config.depth;
        let channels = config.channels;
        let grid_size = width * height * depth;

        // Precompute frequency-domain 3D kernels
        let freq_kernels: Vec<FrequencyKernel3D> = config
            .kernels
            .iter()
            .map(|kc| {
                let kernel = Kernel3D::from_config(kc, config.kernel_radius);
                FrequencyKernel3D::from_kernel(&kernel, width, height, depth)
            })
            .collect();

        let convolver = CachedConvolver3D::new(width, height, depth, freq_kernels);

        // Allocate scratch buffers
        let affinity = vec![vec![0.0f32; grid_size]; channels];
        let next_channels = vec![vec![0.0f32; grid_size]; channels];
        let channel_sum_buffer = vec![0.0f32; grid_size];
        let grad_a_x = vec![0.0f32; grid_size];
        let grad_a_y = vec![0.0f32; grid_size];
        let grad_a_z = vec![0.0f32; grid_size];

        let per_channel_scratch = (0..channels)
            .map(|_| ChannelScratch3D {
                grad_u_x: vec![0.0f32; grid_size],
                grad_u_y: vec![0.0f32; grid_size],
                grad_u_z: vec![0.0f32; grid_size],
                flow_x: vec![0.0f32; grid_size],
                flow_y: vec![0.0f32; grid_size],
                flow_z: vec![0.0f32; grid_size],
            })
            .collect();

        let num_kernels = convolver.kernels().len();

        #[cfg(not(target_arch = "wasm32"))]
        let fft_scratch: Vec<Fft3DScratch> = (0..num_kernels)
            .map(|_| Fft3DScratch::new(&convolver))
            .collect();

        #[cfg(target_arch = "wasm32")]
        let fft_scratch: Vec<Fft3DScratch> = vec![Fft3DScratch::new(&convolver)];

        let conv_outputs: Vec<Vec<f32>> =
            (0..num_kernels).map(|_| vec![0.0f32; grid_size]).collect();

        Self {
            config,
            convolver,
            affinity,
            next_channels,
            channel_sum_buffer,
            grad_a_x,
            grad_a_y,
            grad_a_z,
            per_channel_scratch,
            fft_scratch,
            conv_outputs,
        }
    }

    /// Perform one simulation step.
    pub fn step(&mut self, state: &mut SimulationState) {
        let width = self.config.width;
        let height = self.config.height;
        let depth = self.config.depth;
        let dt = self.config.dt;

        // Clear affinity buffers
        for aff in &mut self.affinity {
            aff.fill(0.0);
        }

        // 1. Convolution and Growth Stage
        #[cfg(not(target_arch = "wasm32"))]
        {
            let convolver = &self.convolver;
            let state_channels = &state.channels;

            // Parallel convolution
            self.fft_scratch
                .par_iter_mut()
                .zip(self.conv_outputs.par_iter_mut())
                .enumerate()
                .for_each(|(kernel_idx, (scratch, output))| {
                    let kernel = &convolver.kernels()[kernel_idx];
                    let source = &state_channels[kernel.source_channel];
                    convolver.convolve_with_kernel_scratch(source, kernel_idx, scratch, output);
                });

            // Accumulate results sequentially
            for (kernel_idx, conv_result) in self.conv_outputs.iter().enumerate() {
                let kernel = &self.convolver.kernels()[kernel_idx];
                growth_accumulate(
                    conv_result,
                    &mut self.affinity[kernel.target_channel],
                    kernel.weight,
                    kernel.mu,
                    kernel.sigma,
                );
            }
        }

        #[cfg(target_arch = "wasm32")]
        {
            for (kernel_idx, kernel) in self.convolver.kernels().iter().enumerate() {
                let source = &state.channels[kernel.source_channel];
                self.convolver.convolve_with_kernel_scratch(
                    source,
                    kernel_idx,
                    &mut self.fft_scratch[0],
                    &mut self.conv_outputs[kernel_idx],
                );

                growth_accumulate(
                    &self.conv_outputs[kernel_idx],
                    &mut self.affinity[kernel.target_channel],
                    kernel.weight,
                    kernel.mu,
                    kernel.sigma,
                );
            }
        }

        // 2. Compute Total Mass Sum
        self.channel_sum_buffer.fill(0.0);
        for channel in &state.channels {
            for (sum, &val) in self.channel_sum_buffer.iter_mut().zip(channel.iter()) {
                *sum += val;
            }
        }

        // 3. Gradient Stage - compute 3D mass gradient
        sobel_gradient_3d_into(
            &self.channel_sum_buffer,
            &mut self.grad_a_x,
            &mut self.grad_a_y,
            &mut self.grad_a_z,
            width,
            height,
            depth,
        );

        // 4. Flow Stage - compute per-channel 3D flow fields and advect
        let flow_config = &self.config.flow;
        let channel_sum = &self.channel_sum_buffer;
        let distribution_size = flow_config.distribution_size;
        let grad_a_x = &self.grad_a_x;
        let grad_a_y = &self.grad_a_y;
        let grad_a_z = &self.grad_a_z;

        #[cfg(not(target_arch = "wasm32"))]
        {
            self.affinity
                .par_iter()
                .zip(state.channels.par_iter())
                .zip(self.next_channels.par_iter_mut())
                .zip(self.per_channel_scratch.par_iter_mut())
                .for_each(|(((affinity, current), next), scratch)| {
                    // 3D gradient of affinity
                    sobel_gradient_3d_into(
                        affinity,
                        &mut scratch.grad_u_x,
                        &mut scratch.grad_u_y,
                        &mut scratch.grad_u_z,
                        width,
                        height,
                        depth,
                    );

                    // Compute 3D flow field
                    compute_flow_field_3d_into(
                        &scratch.grad_u_x,
                        &scratch.grad_u_y,
                        &scratch.grad_u_z,
                        grad_a_x,
                        grad_a_y,
                        grad_a_z,
                        channel_sum,
                        flow_config,
                        &mut scratch.flow_x,
                        &mut scratch.flow_y,
                        &mut scratch.flow_z,
                    );

                    // 5. Reintegration Stage - 3D advection
                    next.fill(0.0);
                    advect_mass_3d_into(
                        current,
                        &scratch.flow_x,
                        &scratch.flow_y,
                        &scratch.flow_z,
                        next,
                        width,
                        height,
                        depth,
                        dt,
                        distribution_size,
                    );
                });
        }

        #[cfg(target_arch = "wasm32")]
        {
            for c in 0..self.config.channels {
                let scratch = &mut self.per_channel_scratch[c];

                sobel_gradient_3d_into(
                    &self.affinity[c],
                    &mut scratch.grad_u_x,
                    &mut scratch.grad_u_y,
                    &mut scratch.grad_u_z,
                    width,
                    height,
                    depth,
                );

                compute_flow_field_3d_into(
                    &scratch.grad_u_x,
                    &scratch.grad_u_y,
                    &scratch.grad_u_z,
                    grad_a_x,
                    grad_a_y,
                    grad_a_z,
                    channel_sum,
                    flow_config,
                    &mut scratch.flow_x,
                    &mut scratch.flow_y,
                    &mut scratch.flow_z,
                );

                self.next_channels[c].fill(0.0);
                advect_mass_3d_into(
                    &state.channels[c],
                    &scratch.flow_x,
                    &scratch.flow_y,
                    &scratch.flow_z,
                    &mut self.next_channels[c],
                    width,
                    height,
                    depth,
                    dt,
                    distribution_size,
                );
            }
        }

        // Swap channels
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

/// 3D simulation statistics for monitoring.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SimulationStats3D {
    pub total_mass: f32,
    pub max_value: f32,
    pub min_value: f32,
    pub mean_value: f32,
    pub active_cells: usize,
}

impl SimulationStats3D {
    /// Compute statistics from 3D state.
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
    use crate::schema::{FlowConfig, KernelConfig, Pattern, RingConfig, Seed};

    fn test_config_3d() -> SimulationConfig {
        SimulationConfig {
            width: 16,
            height: 16,
            depth: 16,
            channels: 1,
            dt: 0.2,
            kernel_radius: 4,
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
            embedding: Default::default(),
        }
    }

    #[test]
    fn test_propagator3d_creation() {
        let config = test_config_3d();
        let _propagator = CpuPropagator3D::new(config);
    }

    #[test]
    fn test_mass_conservation_3d() {
        let config = test_config_3d();
        let mut propagator = CpuPropagator3D::new(config.clone());

        let seed = Seed {
            pattern: Pattern::GaussianSphere {
                center: (0.5, 0.5, 0.5),
                radius: 0.2,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut state = SimulationState::from_seed(&seed, &config);
        let initial_mass = state.total_mass();

        // Run several steps
        propagator.run(&mut state, 5);

        let final_mass = state.total_mass();

        // Mass should be conserved within numerical tolerance
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;
        assert!(
            relative_error < 0.02,
            "Mass not conserved: {} -> {} ({}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    #[test]
    fn test_state_from_3d_seed() {
        let config = test_config_3d();
        let seed = Seed {
            pattern: Pattern::GaussianSphere {
                center: (0.5, 0.5, 0.5),
                radius: 0.2,
                amplitude: 1.0,
                channel: 0,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        assert_eq!(state.channels.len(), config.channels);
        assert_eq!(
            state.channels[0].len(),
            config.width * config.height * config.depth
        );
        assert!(state.total_mass() > 0.0);
        assert!(state.is_3d());
    }
}
