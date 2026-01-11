//! 3D GPU Propagator - GPU-accelerated 3D Flow Lenia simulation.

use super::GpuError;
use crate::compute::{Kernel3D, SimulationState};
use crate::schema::SimulationConfig;

// Embed 3D shader sources at compile time
const CONVOLUTION_GROWTH_3D_SHADER: &str = include_str!("shaders/convolution_growth_3d.wgsl");
const GRADIENT_3D_SHADER: &str = include_str!("shaders/gradient_3d.wgsl");
const FLOW_3D_SHADER: &str = include_str!("shaders/flow_3d.wgsl");
const ADVECTION_3D_SHADER: &str = include_str!("shaders/advection_3d.wgsl");
const MASS_SUM_3D_SHADER: &str = include_str!("shaders/mass_sum_3d.wgsl");

/// Uniform buffer struct for 3D convolution shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct ConvParams3D {
    width: u32,
    height: u32,
    depth: u32,
    kernel_radius: u32,
    mu: f32,
    sigma: f32,
    weight: f32,
    _pad: f32,
}

/// Uniform buffer struct for 3D gradient shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct GradientParams3D {
    width: u32,
    height: u32,
    depth: u32,
    _pad: u32,
}

/// Uniform buffer struct for 3D flow shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct FlowParams3D {
    width: u32,
    height: u32,
    depth: u32,
    _pad: u32,
    beta_a: f32,
    n: f32,
    _pad2: f32,
    _pad3: f32,
}

/// Uniform buffer struct for 3D advection shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct AdvectParams3D {
    width: u32,
    height: u32,
    depth: u32,
    _pad: u32,
    dt: f32,
    distribution_size: f32,
    _pad2: f32,
    _pad3: f32,
}

/// Uniform buffer struct for 3D mass sum shader.
#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
struct MassSumParams3D {
    width: u32,
    height: u32,
    depth: u32,
    num_channels: u32,
}

/// GPU-based 3D Flow Lenia propagator using WebGPU compute shaders.
pub struct GpuPropagator3D {
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
    grad_u_z_buffer: wgpu::Buffer,
    grad_a_x_buffer: wgpu::Buffer,
    grad_a_y_buffer: wgpu::Buffer,
    grad_a_z_buffer: wgpu::Buffer,
    flow_x_buffer: wgpu::Buffer,
    flow_y_buffer: wgpu::Buffer,
    flow_z_buffer: wgpu::Buffer,
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

impl GpuPropagator3D {
    /// Create a new 3D GPU propagator.
    pub async fn new(config: SimulationConfig) -> Result<Self, GpuError> {
        config.validate().expect("Invalid configuration");
        assert!(config.is_3d(), "GpuPropagator3D requires depth > 1");

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
                label: Some("Flow Lenia 3D GPU"),
                required_features: wgpu::Features::empty(),
                required_limits: wgpu::Limits::default(),
                ..Default::default()
            })
            .await?;

        // 4. Create shader modules
        let conv_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("3D Convolution Shader"),
            source: wgpu::ShaderSource::Wgsl(CONVOLUTION_GROWTH_3D_SHADER.into()),
        });
        let gradient_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("3D Gradient Shader"),
            source: wgpu::ShaderSource::Wgsl(GRADIENT_3D_SHADER.into()),
        });
        let flow_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("3D Flow Shader"),
            source: wgpu::ShaderSource::Wgsl(FLOW_3D_SHADER.into()),
        });
        let advection_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("3D Advection Shader"),
            source: wgpu::ShaderSource::Wgsl(ADVECTION_3D_SHADER.into()),
        });
        let mass_sum_shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("3D Mass Sum Shader"),
            source: wgpu::ShaderSource::Wgsl(MASS_SUM_3D_SHADER.into()),
        });

        // 5. Create bind group layouts
        let conv_bind_group_layout = create_conv_bind_group_layout_3d(&device);
        let gradient_bind_group_layout = create_gradient_bind_group_layout_3d(&device);
        let flow_bind_group_layout = create_flow_bind_group_layout_3d(&device);
        let advection_bind_group_layout = create_advection_bind_group_layout_3d(&device);
        let mass_sum_bind_group_layout = create_mass_sum_bind_group_layout_3d(&device);

        // 6. Create pipeline layouts
        let conv_pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("3D Convolution Pipeline Layout"),
            bind_group_layouts: &[&conv_bind_group_layout],
            ..Default::default()
        });
        let gradient_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("3D Gradient Pipeline Layout"),
                bind_group_layouts: &[&gradient_bind_group_layout],
                ..Default::default()
            });
        let flow_pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("3D Flow Pipeline Layout"),
            bind_group_layouts: &[&flow_bind_group_layout],
            ..Default::default()
        });
        let advection_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("3D Advection Pipeline Layout"),
                bind_group_layouts: &[&advection_bind_group_layout],
                ..Default::default()
            });
        let mass_sum_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("3D Mass Sum Pipeline Layout"),
                bind_group_layouts: &[&mass_sum_bind_group_layout],
                ..Default::default()
            });

        // 7. Create compute pipelines
        let convolution_pipeline =
            device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
                label: Some("3D Convolution Pipeline"),
                layout: Some(&conv_pipeline_layout),
                module: &conv_shader,
                entry_point: Some("main"),
                compilation_options: Default::default(),
                cache: None,
            });
        let gradient_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("3D Gradient Pipeline"),
            layout: Some(&gradient_pipeline_layout),
            module: &gradient_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let flow_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("3D Flow Pipeline"),
            layout: Some(&flow_pipeline_layout),
            module: &flow_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let advection_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("3D Advection Pipeline"),
            layout: Some(&advection_pipeline_layout),
            module: &advection_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });
        let mass_sum_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
            label: Some("3D Mass Sum Pipeline"),
            layout: Some(&mass_sum_pipeline_layout),
            module: &mass_sum_shader,
            entry_point: Some("main"),
            compilation_options: Default::default(),
            cache: None,
        });

        // 8. Calculate buffer sizes (3D)
        let grid_size = config.width * config.height * config.depth;
        let channel_buffer_size = (grid_size * std::mem::size_of::<f32>()) as u64;
        let state_buffer_size = channel_buffer_size * config.channels as u64;

        // 9. Create GPU buffers
        let state_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D State Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE
                | wgpu::BufferUsages::COPY_DST
                | wgpu::BufferUsages::COPY_SRC,
            mapped_at_creation: false,
        });
        let next_state_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Next State Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE
                | wgpu::BufferUsages::COPY_DST
                | wgpu::BufferUsages::COPY_SRC,
            mapped_at_creation: false,
        });
        let affinity_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Affinity Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        let mass_sum_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Mass Sum Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        let grad_u_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad U X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_u_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad U Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_u_z_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad U Z Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_a_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad A X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_a_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad A Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let grad_a_z_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Grad A Z Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let flow_x_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Flow X Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let flow_y_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Flow Y Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let flow_z_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Flow Z Buffer"),
            size: channel_buffer_size,
            usage: wgpu::BufferUsages::STORAGE,
            mapped_at_creation: false,
        });
        let staging_buffer = device.create_buffer(&wgpu::BufferDescriptor {
            label: Some("3D Staging Buffer"),
            size: state_buffer_size,
            usage: wgpu::BufferUsages::MAP_READ | wgpu::BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });

        // 10. Create 3D kernel buffers
        let kernel_buffers: Vec<wgpu::Buffer> = config
            .kernels
            .iter()
            .map(|kc| {
                let kernel = Kernel3D::from_config(kc, config.kernel_radius);
                let kernel_data = &kernel.data;
                let kernel_size = (kernel_data.len() * std::mem::size_of::<f32>()) as u64;

                let buffer = device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("3D Kernel Buffer"),
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
            grad_u_z_buffer,
            grad_a_x_buffer,
            grad_a_y_buffer,
            grad_a_z_buffer,
            flow_x_buffer,
            flow_y_buffer,
            flow_z_buffer,
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
        let depth = self.config.depth as u32;
        let grid_size = (width * height * depth) as usize;

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
                label: Some("3D Step Encoder"),
            });

        // 3D workgroup dispatch (8x8x4 workgroup size)
        let workgroups_x = width.div_ceil(8);
        let workgroups_y = height.div_ceil(8);
        let workgroups_z = depth.div_ceil(4);

        // Stage 1: Convolution + Growth for each kernel
        for (kernel_idx, kernel_config) in self.config.kernels.iter().enumerate() {
            let actual_radius =
                (kernel_config.radius * self.config.kernel_radius as f32).round() as u32;

            let params = ConvParams3D {
                width,
                height,
                depth,
                kernel_radius: actual_radius,
                mu: kernel_config.mu,
                sigma: kernel_config.sigma,
                weight: kernel_config.weight,
                _pad: 0.0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("3D Conv Params"),
                size: std::mem::size_of::<ConvParams3D>() as u64,
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
                label: Some("3D Conv Bind Group"),
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
                    label: Some("3D Convolution Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.convolution_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }
        }

        // Stage 2: Compute mass sum
        {
            let params = MassSumParams3D {
                width,
                height,
                depth,
                num_channels: self.config.channels as u32,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("3D Mass Sum Params"),
                size: std::mem::size_of::<MassSumParams3D>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("3D Mass Sum Bind Group"),
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
                    label: Some("3D Mass Sum Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.mass_sum_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }
        }

        // Stage 3: Compute mass gradient (3D)
        {
            let params = GradientParams3D {
                width,
                height,
                depth,
                _pad: 0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("3D Gradient Params"),
                size: std::mem::size_of::<GradientParams3D>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                label: Some("3D Gradient Bind Group (Mass)"),
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
                    wgpu::BindGroupEntry {
                        binding: 4,
                        resource: self.grad_a_z_buffer.as_entire_binding(),
                    },
                ],
            });

            {
                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("3D Gradient Pass (Mass)"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.gradient_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }
        }

        // Per-channel processing
        let channel_size = (grid_size * std::mem::size_of::<f32>()) as u64;
        for c in 0..self.config.channels {
            let channel_offset = (c * grid_size * std::mem::size_of::<f32>()) as u64;

            // Compute affinity gradient (3D)
            {
                let params = GradientParams3D {
                    width,
                    height,
                    depth,
                    _pad: 0,
                };

                let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("3D Gradient Params"),
                    size: std::mem::size_of::<GradientParams3D>() as u64,
                    usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });
                self.queue
                    .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("3D Gradient Bind Group (Affinity)"),
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
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: self.grad_u_z_buffer.as_entire_binding(),
                        },
                    ],
                });

                {
                    let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                        label: Some("3D Gradient Pass (Affinity)"),
                        timestamp_writes: None,
                    });
                    pass.set_pipeline(&self.gradient_pipeline);
                    pass.set_bind_group(0, &bind_group, &[]);
                    pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
                }
            }

            // Compute flow field (3D) - run 3 passes, one for each component
            // to stay within the 8 storage buffer limit per shader stage
            let params = FlowParams3D {
                width,
                height,
                depth,
                _pad: 0,
                beta_a: self.config.flow.beta_a,
                n: self.config.flow.n,
                _pad2: 0.0,
                _pad3: 0.0,
            };

            let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                label: Some("3D Flow Params"),
                size: std::mem::size_of::<FlowParams3D>() as u64,
                usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                mapped_at_creation: false,
            });
            self.queue
                .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

            // Flow X pass
            {
                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("3D Flow X Bind Group"),
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
                            resource: self.grad_a_x_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.mass_sum_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: self.flow_x_buffer.as_entire_binding(),
                        },
                    ],
                });

                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("3D Flow X Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.flow_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }

            // Flow Y pass
            {
                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("3D Flow Y Bind Group"),
                    layout: &self.flow_bind_group_layout,
                    entries: &[
                        wgpu::BindGroupEntry {
                            binding: 0,
                            resource: params_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 1,
                            resource: self.grad_u_y_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 2,
                            resource: self.grad_a_y_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.mass_sum_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: self.flow_y_buffer.as_entire_binding(),
                        },
                    ],
                });

                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("3D Flow Y Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.flow_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }

            // Flow Z pass
            {
                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("3D Flow Z Bind Group"),
                    layout: &self.flow_bind_group_layout,
                    entries: &[
                        wgpu::BindGroupEntry {
                            binding: 0,
                            resource: params_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 1,
                            resource: self.grad_u_z_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 2,
                            resource: self.grad_a_z_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 3,
                            resource: self.mass_sum_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 4,
                            resource: self.flow_z_buffer.as_entire_binding(),
                        },
                    ],
                });

                let mut pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                    label: Some("3D Flow Z Pass"),
                    timestamp_writes: None,
                });
                pass.set_pipeline(&self.flow_pipeline);
                pass.set_bind_group(0, &bind_group, &[]);
                pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
            }

            // Advection (3D)
            {
                let params = AdvectParams3D {
                    width,
                    height,
                    depth,
                    _pad: 0,
                    dt: self.config.dt,
                    distribution_size: self.config.flow.distribution_size,
                    _pad2: 0.0,
                    _pad3: 0.0,
                };

                let params_buffer = self.device.create_buffer(&wgpu::BufferDescriptor {
                    label: Some("3D Advect Params"),
                    size: std::mem::size_of::<AdvectParams3D>() as u64,
                    usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    mapped_at_creation: false,
                });
                self.queue
                    .write_buffer(&params_buffer, 0, bytemuck::bytes_of(&params));

                let bind_group = self.device.create_bind_group(&wgpu::BindGroupDescriptor {
                    label: Some("3D Advection Bind Group"),
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
                            resource: self.flow_z_buffer.as_entire_binding(),
                        },
                        wgpu::BindGroupEntry {
                            binding: 5,
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
                        label: Some("3D Advection Pass"),
                        timestamp_writes: None,
                    });
                    pass.set_pipeline(&self.advection_pipeline);
                    pass.set_bind_group(0, &bind_group, &[]);
                    pass.dispatch_workgroups(workgroups_x, workgroups_y, workgroups_z);
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
        let grid_size = self.config.width * self.config.height * self.config.depth;

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
        let grid_size = self.config.width * self.config.height * self.config.depth;
        let buffer_slice = self.staging_buffer.slice(..);

        let (sender, receiver) = futures_channel::oneshot::channel();
        buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
            let _ = sender.send(result);
        });

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

fn create_conv_bind_group_layout_3d(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("3D Convolution Bind Group Layout"),
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

fn create_gradient_bind_group_layout_3d(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("3D Gradient Bind Group Layout"),
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

fn create_flow_bind_group_layout_3d(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    // Single-component flow shader: params, grad_u, grad_a, mass_sum, flow_output
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("3D Flow Bind Group Layout"),
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

fn create_advection_bind_group_layout_3d(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("3D Advection Bind Group Layout"),
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
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    })
}

fn create_mass_sum_bind_group_layout_3d(device: &wgpu::Device) -> wgpu::BindGroupLayout {
    device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: Some("3D Mass Sum Bind Group Layout"),
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
    use crate::compute::CpuPropagator3D;
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
    fn test_gpu_propagator3d_creation() {
        let config = test_config_3d();
        let result = pollster::block_on(GpuPropagator3D::new(config));

        // Skip test if no GPU available
        if let Err(GpuError::NoAdapter) = &result {
            eprintln!("Skipping 3D GPU test: no adapter available");
            return;
        }

        assert!(result.is_ok(), "Failed to create 3D GPU propagator");
    }

    #[test]
    fn test_gpu_3d_mass_conservation() {
        let config = test_config_3d();
        let propagator = pollster::block_on(GpuPropagator3D::new(config.clone()));

        let mut propagator = match propagator {
            Ok(p) => p,
            Err(GpuError::NoAdapter) => {
                eprintln!("Skipping 3D GPU test: no adapter available");
                return;
            }
            Err(e) => panic!("Failed to create 3D GPU propagator: {:?}", e),
        };

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

        // Run a few steps
        for _ in 0..3 {
            propagator.step(&mut state);
        }

        let final_mass = state.total_mass();
        let relative_error = (final_mass - initial_mass).abs() / initial_mass;

        assert!(
            relative_error < 0.02,
            "3D mass not conserved: {} -> {} ({:.4}% error)",
            initial_mass,
            final_mass,
            relative_error * 100.0
        );
    }

    #[test]
    fn test_gpu_cpu_3d_equivalence() {
        let config = test_config_3d();
        let seed = Seed {
            pattern: Pattern::GaussianSphere {
                center: (0.5, 0.5, 0.5),
                radius: 0.2,
                amplitude: 1.0,
                channel: 0,
            },
        };

        // Create CPU propagator
        let mut cpu_propagator = CpuPropagator3D::new(config.clone());
        let mut cpu_state = SimulationState::from_seed(&seed, &config);

        // Create GPU propagator
        let gpu_propagator = pollster::block_on(GpuPropagator3D::new(config.clone()));
        let mut gpu_propagator = match gpu_propagator {
            Ok(p) => p,
            Err(GpuError::NoAdapter) => {
                eprintln!("Skipping 3D GPU test: no adapter available");
                return;
            }
            Err(e) => panic!("Failed to create 3D GPU propagator: {:?}", e),
        };
        let mut gpu_state = SimulationState::from_seed(&seed, &config);

        // Run both for several steps and compare
        for step in 0..3 {
            cpu_propagator.step(&mut cpu_state);
            gpu_propagator.step(&mut gpu_state);

            // Compare channel outputs
            for c in 0..config.channels {
                let cpu_channel = &cpu_state.channels[c];
                let gpu_channel = &gpu_state.channels[c];

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

                // Allow tolerance for GPU/CPU floating point differences
                // Direct convolution vs FFT will have numerical differences
                assert!(
                    relative_error < 0.15,
                    "Step {}, channel {}: 3D GPU/CPU mismatch - relative error {:.4}",
                    step,
                    c,
                    relative_error
                );
            }
        }
    }
}
