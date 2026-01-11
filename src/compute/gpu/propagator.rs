//! GPU Propagator - GPU-accelerated Flow Lenia simulation.

use super::GpuError;
use crate::compute::{Kernel, SimulationState};
use crate::schema::SimulationConfig;

// Embed shader sources at compile time
const CONVOLUTION_GROWTH_SHADER: &str = include_str!("shaders/convolution_growth.wgsl");
const GRADIENT_SHADER: &str = include_str!("shaders/gradient.wgsl");
const FLOW_SHADER: &str = include_str!("shaders/flow.wgsl");
const ADVECTION_SHADER: &str = include_str!("shaders/advection.wgsl");
const MASS_SUM_SHADER: &str = include_str!("shaders/mass_sum.wgsl");

/// Uniform buffer struct for convolution shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct ConvParams {
    width: u32,
    height: u32,
    kernel_radius: u32,
    _pad: u32,
    mu: f32,
    sigma: f32,
    weight: f32,
    _pad2: f32,
}

/// Uniform buffer struct for gradient shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct GradientParams {
    width: u32,
    height: u32,
    _pad0: u32,
    _pad1: u32,
}

/// Uniform buffer struct for flow shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct FlowParams {
    width: u32,
    height: u32,
    beta_a: f32,
    n: f32,
}

/// Uniform buffer struct for advection shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct AdvectParams {
    width: u32,
    height: u32,
    dt: f32,
    distribution_size: f32,
}

/// Uniform buffer struct for mass sum shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct MassSumParams {
    width: u32,
    height: u32,
    num_channels: u32,
    _pad: u32,
}

/// GPU-based Flow Lenia propagator using WebGPU compute shaders.
pub struct GpuPropagator {
    device: wgpu::Device,
    queue: wgpu::Queue,
    config: SimulationConfig,

    // Compute pipelines
    convolution_pipeline: wgpu::ComputePipeline,
    gradient_pipeline: wgpu::ComputePipeline,
    flow_pipeline: wgpu::ComputePipeline,
    advection_pipeline: wgpu::ComputePipeline,
    mass_sum_pipeline: wgpu::ComputePipeline,

    // GPU buffers
    state_buffer: wgpu::Buffer,
    next_state_buffer: wgpu::Buffer,
    affinity_buffer: wgpu::Buffer,
    mass_sum_buffer: wgpu::Buffer,
    grad_u_x_buffer: wgpu::Buffer,
    grad_u_y_buffer: wgpu::Buffer,
    grad_a_x_buffer: wgpu::Buffer,
    grad_a_y_buffer: wgpu::Buffer,
    flow_x_buffer: wgpu::Buffer,
    flow_y_buffer: wgpu::Buffer,
    staging_buffer: wgpu::Buffer,

    // Kernel buffers
    kernel_buffers: Vec<wgpu::Buffer>,

    // Bind group layouts
    conv_bind_group_layout: wgpu::BindGroupLayout,
    gradient_bind_group_layout: wgpu::BindGroupLayout,
    flow_bind_group_layout: wgpu::BindGroupLayout,
    advection_bind_group_layout: wgpu::BindGroupLayout,
    mass_sum_bind_group_layout: wgpu::BindGroupLayout,
}

impl GpuPropagator {
    /// Create a new GPU propagator.
    pub async fn new(config: SimulationConfig) -> Result<Self, GpuError> {
        config.validate().expect("Invalid configuration");

        // 1. Create wgpu instance
        let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
            backends: wgpu::Backends::all(),
            ..Default::default()
        });

        // 2. Request adapter
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                compatible_surface: None,
                force_fallback_adapter: false,
            })
            .await
            .map_err(|_| GpuError::NoAdapter)?;

        // 3. Request device and queue
        let (device, queue): (wgpu::Device, wgpu::Queue) = adapter
            .request_device(&wgpu::DeviceDescriptor {
                label: Some("Flow Lenia GPU"),
                required_features: wgpu::Features::empty(),
                required_limits: wgpu::Limits::default(),
                ..Default::default()
            })
            .await?;

        // 4. Create shader modules
        let conv_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Convolution Shader"),
            source: wgpu::ShaderSource::Wgsl(CONVOLUTION_GROWTH_SHADER.into()),
        });
        let gradient_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Gradient Shader"),
            source: wgpu::ShaderSource::Wgsl(GRADIENT_SHADER.into()),
        });
        let flow_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Flow Shader"),
            source: wgpu::ShaderSource::Wgsl(FLOW_SHADER.into()),
        });
        let advection_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Advection Shader"),
            source: wgpu::ShaderSource::Wgsl(ADVECTION_SHADER.into()),
        });
        let mass_sum_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Mass Sum Shader"),
            source: wgpu::ShaderSource::Wgsl(MASS_SUM_SHADER.into()),
        });

        // 5. Create bind group layouts
        let conv_bind_group_layout = create_conv_bind_group_layout(&device);
        let gradient_bind_group_layout = create_gradient_bind_group_layout(&device);
        let flow_bind_group_layout = create_flow_bind_group_layout(&device);
        let advection_bind_group_layout = create_advection_bind_group_layout(&device);
        let mass_sum_bind_group_layout = create_mass_sum_bind_group_layout(&device);

        // 6. Create pipeline layouts
        let conv_pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Convolution Pipeline Layout"),
            bind_group_layouts: &[&conv_bind_group_layout],
            ..Default::default()
        });
        let gradient_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("Gradient Pipeline Layout"),
                bind_group_layouts: &[&gradient_bind_group_layout],
                ..Default::default()
            });
        let flow_pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Flow Pipeline Layout"),
            bind_group_layouts: &[&flow_bind_group_layout],
            ..Default::default()
        });
        let advection_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("Advection Pipeline Layout"),
                bind_group_layouts: &[&advection_bind_group_layout],
                ..Default::default()
            });
        let mass_sum_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("Mass Sum Pipeline Layout"),
                bind_group_layouts: &[&mass_sum_bind_group_layout],
                ..Default::default()
            });

        // 7. Create compute pipelines
        let convolution_pipeline =
            device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
                label: Some("Convolution Pipeline"),
                layout: Some(&conv_pipeline_layout),
                module: &conv_shader,
                entry_point: Some("main"),
                compilation_options: Default::default(),
                cache: None,
            });
        let gradient_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("Gradient Pipeline"),
            layout: Some(&gradient_pipeline_layout),
            module: &gradient_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let flow_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("Flow Pipeline"),
            layout: Some(&flow_pipeline_layout),
            module: &flow_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let advection_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("Advection Pipeline"),
            layout: Some(&advection_pipeline_layout),
            module: &advection_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let mass_sum_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("Mass Sum Pipeline"),
            layout: Some(&mass_sum_pipeline_layout),
            module: &mass_sum_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });

        // 8. Calculate buffer sizes
        let grid_size = config.width * config.height;
        let channel_buffer_size = (grid_size * std::mem::size_of::<f32>()) as u64;
        let state_buffer_size = channel_buffer_size * config.channels as u64;

        // 9. Create GPU buffers
        let state_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("State Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE
                | wgpu::BufferUsages::COPY_DST
                | wgpu::BufferUsages::COPY_SRC,
            mapped_at_creation: false,
        });
        let next_state_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Next State Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE
                | wgpu::BufferUsages::COPY_DST
                | wgpu::BufferUsages::COPY_SRC,
            mapped_at_creation: false,
        });
        let affinity_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Affinity Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        let mass_sum_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Mass Sum Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        let grad_u_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Grad U X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_u_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Grad U Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_a_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Grad A X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_a_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Grad A Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let flow_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Flow X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let flow_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Flow Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let staging_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("Staging Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::MAP_READ | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        // 10. Create kernel buffers
        let kernel_buffers: Vec<wgpu::Buffer> = config
            .kernels
            .iter()
            .map(|kc| {
                let kernel = Kernel::from_config(kc, config.kernel_radius);
                let kernel_data = &kernel.data;
                let kernel_size = (kernel_data.len() * std::mem::size_of::<f32>()) as u64;

                let buffer = device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("Kernel Buffer"),
                    size: kernel_size,
                    usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });

                queue.write_buffer(&buffer, 0, bytemuck::cast_slice(kernel_data));
                buffer
            })
            .collect();

        Ok(Self {
            device,
            queue,
            config,
            convolution_pipeline,
            gradient_pipeline,
            flow_pipeline,
            advection_pipeline,
            mass_sum_pipeline,
            state_buffer,
            next_state_buffer,
            affinity_buffer,
            mass_sum_buffer,
            grad_u_x_buffer,
            grad_u_y_buffer,
            grad_a_x_buffer,
            grad_a_y_buffer,
            flow_x_buffer,
            flow_y_buffer,
            staging_buffer,
            kernel_buffers,
            conv_bind_group_layout,
            gradient_bind_group_layout,
            flow_bind_group_layout,
            advection_bind_group_layout,
            mass_sum_bind_group_layout,
        })
    }

    /// Perform one simulation step.
    pub fn step(&mut self, state: &mut SimulationState) {
        let width = self.config.width as u32;
        let height = self.config.height as u32;
        let grid_size = (width * height) as usize;

        // Upload current state to GPU
        let state_data: Vec<f32> = state.channels.iter().flatten().copied().collect();
        self.queue
            .write_buffer(&self.state_buffer, 0, bytemuck::cast_slice(&state_data));

        // Clear affinity buffer
        let zeros = vec![0.0f32; grid_size * self.config.channels];
        self.queue
            .write_buffer(&self.affinity_buffer, 0, bytemuck::cast_slice(&zeros));

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("Step Encoder"),
            });

        let workgroups_x = (width + 15) / 16;
        let workgroups_y = (height + 15) / 16;

        // Stage 1: Convolution + Growth for each kernel
        for (kernel_idx, kernel_config) in self.config.kernels.iter().enumerate() {
            // Compute actual kernel radius (same formula as kernel.rs)
            let actual_radius =
                (kernel_config.radius * self.config.kernel_radius as f32).round() as u32;

            let params = ConvParams {
                width,
                height,
                kernel_radius: actual_radius,
                _pad: 0,
                mu: kernel_config.mu,
                sigma: kernel_config.sigma,
                weight: kernel_config.weight,
                _pad2: 0.0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("Conv Params"),
                size: std::mem::size_of::<ConvParams>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            let source_offset =
                (kernel_config.source_channel * grid_size * std::mem::size_of::<f32>()) as u64;
            let target_offset =
                (kernel_config.target_channel * grid_size * std::mem::size_of::<f32>()) as u64;
            let channel_size = (grid_size * std::mem::size_of::<f32>()) as u64;

            let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("Conv Bind Group"),
                layout: &self.conv_bind_group_layout,
                entries: &[
                    wgpu::BindGroupEntry {
                        binding: 0,
                        resource: params_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 1,
                        resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                            buffer: &self.state_buffer,
                            offset: source_offset,
                            size: Some(std::num::NonZeroU64::new(channel_size).unwrap()),
                        }),
                    },
                    wgpu::BindGroupEntry {
                        binding: 2,
                        resource: self.kernel_buffers[kernel_idx].as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 3,
                        resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                            buffer: &self.affinity_buffer,
                            offset: target_offset,
                            size: Some(std::num::NonZeroU64::new(channel_size).unwrap()),
                        }),
                    },
                ],
            });

            {
                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("Convolution Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.convolution_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
            }
        }

        // Stage 2: Compute mass sum
        {
            let params = MassSumParams {
                width,
                height,
                num_channels: self.config.channels as u32,
                _pad: 0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("Mass Sum Params"),
                size: std::mem::size_of::<MassSumParams>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("Mass Sum Bind Group"),
                layout: &self.mass_sum_bind_group_layout,
                entries: &[
                    wgpu::BindGroupEntry {
                        binding: 0,
                        resource: params_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 1,
                        resource: self.state_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 2,
                        resource: self.mass_sum_buffer.as_entire_binding(),
                    },
                ],
            });

            {
                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("Mass Sum Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.mass_sum_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
            }
        }

        // Stage 3: Compute mass gradient
        {
            let params = GradientParams {
                width,
                height,
                _pad0: 0,
                _pad1: 0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("Gradient Params"),
                size: std::mem::size_of::<GradientParams>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("Gradient Bind Group (Mass)"),
                layout: &self.gradient_bind_group_layout,
                entries: &[
                    wgpu::BindGroupEntry {
                        binding: 0,
                        resource: params_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 1,
                        resource: self.mass_sum_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 2,
                        resource: self.grad_a_x_buffer.as_entire_binding(),
                    },
                    wgpu::BindGroupEntry {
                        binding: 3,
                        resource: self.grad_a_y_buffer.as_entire_binding(),
                    },
                ],
            });

            {
                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("Gradient Pass (Mass)"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.gradient_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
            }
        }

        // Per-channel processing
        let channel_size = (grid_size * std::mem::size_of::<f32>()) as u64;
        for c in 0..self.config.channels {
            let channel_offset = (c * grid_size * std::mem::size_of::<f32>()) as u64;

            // Compute affinity gradient
            {
                let params = GradientParams {
                    width,
                    height,
                    _pad0: 0,
                    _pad1: 0,
                };

                let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("Gradient Params"),
                    size: std::mem::size_of::<GradientParams>() as u64,
                    usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });
                self.queue
                    .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("Gradient Bind Group (Affinity)"),
                    layout: &self.gradient_bind_group_layout,
                    entries: &[
                        wgpu::BindGroupEntry {
                            binding: 0,
                            resource: params_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 1,
                            resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                                buffer: &self.affinity_buffer,
                                offset: channel_offset,
                                size: Some(std::num::NonZeroU64::new(channel_size).unwrap()),
                            }),
                        },
                        wgpu::BindGroupEntry {
                            binding: 2,
                            resource: self.grad_u_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.grad_u_y_buffer.as_entire_binding(),
                        },
                    ],
                });

                {
                    let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                        label: Some("Gradient Pass (Affinity)"),
                        timestamp_writes: None,
                    });
                    pass.set_pipeline(&self.gradient_pipeline);
                    pass.set_bind_group(0, &bind_group, &[]);
                    pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
                }
            }

            // Compute flow field
            {
                let params = FlowParams {
                    width,
                    height,
                    beta_a: self.config.flow.beta_a,
                    n: self.config.flow.n,
                };

                let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("Flow Params"),
                    size: std::mem::size_of::<FlowParams>() as u64,
                    usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });
                self.queue
                    .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("Flow Bind Group"),
                    layout: &self.flow_bind_group_layout,
                    entries: &[
                        wgpu::BindGroupEntry {
                            binding: 0,
                            resource: params_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 1,
                            resource: self.grad_u_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 2,
                            resource: self.grad_u_y_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.grad_a_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: self.grad_a_y_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 5,
                            resource: self.mass_sum_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 6,
                            resource: self.flow_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 7,
                            resource: self.flow_y_buffer.as_entire_binding(),
                        },
                    ],
                });

                {
                    let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                        label: Some("Flow Pass"),
                        timestamp_writes: None,
                    });
                    pass.set_pipeline(&self.flow_pipeline);
                    pass.set_bind_group(0, &bind_group, &[]);
                    pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
                }
            }

            // Advection
            {
                let params = AdvectParams {
                    width,
                    height,
                    dt: self.config.dt,
                    distribution_size: self.config.flow.distribution_size,
                };

                let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("Advect Params"),
                    size: std::mem::size_of::<AdvectParams>() as u64,
                    usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });
                self.queue
                    .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("Advection Bind Group"),
                    layout: &self.advection_bind_group_layout,
                    entries: &[
                        wgpu::BindGroupEntry {
                            binding: 0,
                            resource: params_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 1,
                            resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                                buffer: &self.state_buffer,
                                offset: channel_offset,
                                size: Some(std::num::NonZeroU64::new(channel_size).unwrap()),
                            }),
                        },
                        wgpu::BindGroupEntry {
                            binding: 2,
                            resource: self.flow_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.flow_y_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: wgpu::BindingResource::Buffer(wgpu::BufferBinding {
                                buffer: &self.next_state_buffer,
                                offset: channel_offset,
                                size: Some(std::num::NonZeroU64::new(channel_size).unwrap()),
                            }),
                        },
                    ],
                });

                {
                    let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                        label: Some("Advection Pass"),
                        timestamp_writes: None,
                    });
                    pass.set_pipeline(&self.advection_pipeline);
                    pass.set_bind_group(0, &bind_group, &[]);
                    pass.dispatch_workgroups(workgroups_x, workgroups_y, 1);
                }
            }
        }

        // Copy result to staging buffer
        let state_size = (grid_size * self.config.channels * std::mem::size_of::<f32>()) as u64;
        encoder.copy_buffer_to_buffer(
            &self.next_state_buffer,
            0,
            &self.staging_buffer,
            0,
            state_size,
        );
        encoder.copy_buffer_to_buffer(
            &self.next_state_buffer,
            0,
            &self.state_buffer,
            0,
            state_size,
        );

        self.queue.submit(std::iter::once(encoder.finish()));

        // Read back results
        self.read_state_back(state);

        state.time += self.config.dt;
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

    /// Synchronous readback for native targets.
    #[cfg(not(target_arch = "wasm32"))]
    fn read_state_back(&self, state: &mut SimulationState) {
        let grid_size = self.config.width * self.config.height;

        let buffer_slice = self.staging_buffer.slice(..);

        let (tx, rx) = std::sync::mpsc::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            tx.send(result).unwrap();
        });

        self.device.poll(wgpu::PollType::wait_indefinitely()).ok();
        rx.recv().unwrap().unwrap();

        {
            let data = buffer_slice.get_mapped_range();
            let result: &[f32] = bytemuck::cast_slice(&data);

            for c in 0..self.config.channels {
                let start = c * grid_size;
                let end = start + grid_size;
                state.channels[c].copy_from_slice(&result[start..end]);
            }
        }

        self.staging_buffer.unmap();
    }

    /// WASM-compatible readback - skips readback in sync step.
    #[cfg(target_arch = "wasm32")]
    fn read_state_back(&self, _state: &mut SimulationState) {
        // On WASM, we cannot block for buffer mapping in a sync function.
        // Use read_state_async() instead for WASM.
    }

    /// Async readback for WASM - properly awaits buffer mapping.
    #[cfg(target_arch = "wasm32")]
    pub async fn read_state_async(&self, state: &mut SimulationState) {
        let grid_size = self.config.width * self.config.height;
        let buffer_slice = self.staging_buffer.slice(..);

        // Create a future that resolves when mapping is complete
        let (sender, receiver) = futures_channel::oneshot::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            let _ = sender.send(result);
        });

        // Yield to let the browser process the GPU work
        // The browser automatically polls WebGPU
        receiver
            .await
            .expect("Channel closed")
            .expect("Buffer mapping failed");

        {
            let data = buffer_slice.get_mapped_range();
            let result: &[f32] = bytemuck::cast_slice(&data);

            for c in 0..self.config.channels {
                let start = c * grid_size;
                let end = start + grid_size;
                state.channels[c].copy_from_slice(&result[start..end]);
            }
        }

        self.staging_buffer.unmap();
    }
}

fn create_conv_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("Convolution Bind Group Layout"),
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 1,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 2,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 3,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

fn create_gradient_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("Gradient Bind Group Layout"),
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 1,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 2,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 3,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

fn create_flow_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("Flow Bind Group Layout"),
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 1,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 2,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 3,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 4,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 5,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 6,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 7,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

fn create_advection_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("Advection Bind Group Layout"),
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 1,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 2,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 3,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 4,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

fn create_mass_sum_bind_group_layout(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("Mass Sum Bind Group Layout"),
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Uniform,
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 1,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
            wgpu::BindGroupLayoutEntry {
                binding: 2,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::compute::CpuPropagator;
    use crate::schema::{FlowConfig, KernelConfig, RingConfig, Seed};

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 64,
            height: 64,
            channels: 1,
            dt: 0.1,
            kernel_radius: 7,
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

    /// Config with kernel_config.radius < 1.0 to test actual vs max radius handling.
    /// This is critical: the bug only manifests when radius != 1.0.
    fn test_config_fractional_radius() -> SimulationConfig {
        SimulationConfig {
            width: 64,
            height: 64,
            channels: 1,
            dt: 0.1,
            kernel_radius: 13, // Max radius
            kernels: vec![KernelConfig {
                radius: 0.5, // Actual radius will be 0.5 * 13 = 7 (not 13!)
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
    fn test_gpu_propagator_creation() {
        let config = test_config();
        let result = pollster::block_on(GpuPropagator::new(config));

        // Skip test if no GPU available
        if let Err(GpuError::NoAdapter) = &result {
            eprintln!("Skipping GPU test: no adapter available");
            return;
        }

        assert!(result.is_ok(), "Failed to create GPU propagator");
    }

    #[test]
    fn test_gpu_mass_conservation() {
        let config = test_config();
        let propagator = pollster::block_on(GpuPropagator::new(config.clone()));

        // Skip test if no GPU available
        let mut propagator = match propagator {
            Ok(p) => p,
            Err(GpuError::NoAdapter) => {
                eprintln!("Skipping GPU test: no adapter available");
                return;
            }
            Err(e) => panic!("Failed to create GPU propagator: {:?}", e),
        };

        let seed = Seed::default();
        let mut state = SimulationState::from_seed(&seed, &config);

        let initial_mass = state.total_mass();

        // Run a few steps
        for _ in 0..5 {
            propagator.step(&mut state);
        }

        let final_mass = state.total_mass();
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;

        assert!(
            relative_error < 0.01,
            "Mass not conserved: {} -> {} ({:.4}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    /// Test that GPU produces approximately the same output as CPU.
    /// This is THE critical test that would have caught the kernel radius bug.
    #[test]
    fn test_gpu_cpu_equivalence() {
        // Use fractional radius config - this exposes bugs where actual vs max radius differs
        let config = test_config_fractional_radius();
        let seed = Seed::default();

        // Create CPU propagator
        let mut cpu_propagator = CpuPropagator::new(config.clone());
        let mut cpu_state = SimulationState::from_seed(&seed, &config);

        // Create GPU propagator
        let gpu_propagator = pollster::block_on(GpuPropagator::new(config.clone()));
        let mut gpu_propagator = match gpu_propagator {
            Ok(p) => p,
            Err(GpuError::NoAdapter) => {
                eprintln!("Skipping GPU test: no adapter available");
                return;
            }
            Err(e) => panic!("Failed to create GPU propagator: {:?}", e),
        };
        let mut gpu_state = SimulationState::from_seed(&seed, &config);

        // Run both for several steps and compare
        for step in 0..5 {
            cpu_propagator.step(&mut cpu_state);
            gpu_propagator.step(&mut gpu_state);

            // Compare channel outputs
            for c in 0..config.channels {
                let cpu_channel = &cpu_state.channels[c];
                let gpu_channel = &gpu_state.channels[c];

                // Compute max absolute difference
                let max_diff: f32 = cpu_channel
                    .iter()
                    .zip(gpu_channel.iter())
                    .map(|(a, b)| (a - b).abs())
                    .fold(0.0f32, f32::max);

                // Compute relative error (using L2 norm)
                let cpu_norm: f32 = cpu_channel.iter().map(|x| x * x).sum::<f32>().sqrt();
                let diff_norm: f32 = cpu_channel
                    .iter()
                    .zip(gpu_channel.iter())
                    .map(|(a, b)| (a - b) * (a - b))
                    .sum::<f32>()
                    .sqrt();
                let relative_error = if cpu_norm > 1e-10 {
                    diff_norm / cpu_norm
                } else {
                    diff_norm
                };

                // Allow some tolerance for GPU/CPU floating point differences
                // Direct convolution vs FFT will have small numerical differences
                assert!(
                    relative_error < 0.1,
                    "Step {}, channel {}: GPU/CPU mismatch - relative error {:.4}, max diff {:.6}",
                    step,
                    c,
                    relative_error,
                    max_diff
                );
            }
        }
    }

    /// Test equivalence with radius=1.0 (where bug was hidden).
    #[test]
    fn test_gpu_cpu_equivalence_full_radius() {
        let config = test_config(); // radius = 1.0
        let seed = Seed::default();

        let mut cpu_propagator = CpuPropagator::new(config.clone());
        let mut cpu_state = SimulationState::from_seed(&seed, &config);

        let gpu_propagator = pollster::block_on(GpuPropagator::new(config.clone()));
        let mut gpu_propagator = match gpu_propagator {
            Ok(p) => p,
            Err(GpuError::NoAdapter) => {
                eprintln!("Skipping GPU test: no adapter available");
                return;
            }
            Err(e) => panic!("Failed to create GPU propagator: {:?}", e),
        };
        let mut gpu_state = SimulationState::from_seed(&seed, &config);

        // Run both for several steps
        for _ in 0..5 {
            cpu_propagator.step(&mut cpu_state);
            gpu_propagator.step(&mut gpu_state);
        }

        // Compare final states
        for c in 0..config.channels {
            let cpu_norm: f32 = cpu_state.channels[c]
                .iter()
                .map(|x| x * x)
                .sum::<f32>()
                .sqrt();
            let diff_norm: f32 = cpu_state.channels[c]
                .iter()
                .zip(gpu_state.channels[c].iter())
                .map(|(a, b)| (a - b) * (a - b))
                .sum::<f32>()
                .sqrt();
            let relative_error = if cpu_norm > 1e-10 {
                diff_norm / cpu_norm
            } else {
                diff_norm
            };

            assert!(
                relative_error < 0.1,
                "Channel {}: GPU/CPU mismatch after 5 steps - relative error {:.4}",
                c,
                relative_error
            );
        }
    }
}
