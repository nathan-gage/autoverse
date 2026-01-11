# wgpu 28.0.0 WebGPU Compute Shader Implementation Specification

## Document Overview

This specification provides detailed information for implementing WebGPU compute shaders in Rust using wgpu 28.0.0, extracted from the official documentation. All types, methods, and patterns are taken directly from the wgpu API.

---

## 1. Initialization Pattern

### Instance Creation

```rust
pub fn Instance::new(desc: &InstanceDescriptor) -> Self
```

The `Instance` is the entry point for interacting with GPUs. It does not need to be kept alive after creating adapters.

**Fields**:
```rust
pub struct InstanceDescriptor {
    pub backends: Backends,          // Backends to enable
    pub flags: InstanceFlags,         // Validation/debug flags
    pub dx12_shader_compiler: Dx12Compiler,
    pub gles_minor_version: Gles3MinorVersion,
}
```

**Example**:
```rust
let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
    backends: wgpu::Backends::all(),  // or Backends::PRIMARY
    ..Default::default()
});
```

### Adapter Selection

```rust
pub fn Instance::request_adapter(
    &self,
    options: &RequestAdapterOptions<'_, '_>,
) -> impl Future<Output = Result<Adapter, RequestAdapterError>> + WasmNotSend
```

**Options**:
```rust
pub type RequestAdapterOptions<'a, 'b> = RequestAdapterOptionsBase<&'a Surface<'b>>;

pub struct RequestAdapterOptionsBase<S> {
    pub power_preference: PowerPreference,       // LowPower, HighPerformance, None
    pub compatible_surface: Option<S>,           // For rendering (None for compute-only)
    pub force_fallback_adapter: bool,
}
```

**Example**:
```rust
let adapter = instance.request_adapter(&wgpu::RequestAdapterOptions {
    power_preference: wgpu::PowerPreference::HighPerformance,
    compatible_surface: None,  // Compute-only
    force_fallback_adapter: false,
}).await.unwrap();
```

### Device and Queue Creation

```rust
pub fn Adapter::request_device(
    &self,
    desc: &DeviceDescriptor,
    trace_path: Option<&Path>,
) -> impl Future<Output = Result<(Device, Queue), RequestDeviceError>>
```

**DeviceDescriptor**:
```rust
pub struct DeviceDescriptor<'a> {
    pub label: Label<'a>,                    // Debug label
    pub required_features: Features,          // Required features
    pub required_limits: Limits,              // Required limits
    pub memory_hints: MemoryHints,
}
```

**Example**:
```rust
let (device, queue) = adapter.request_device(
    &wgpu::DeviceDescriptor {
        label: Some("Compute Device"),
        required_features: wgpu::Features::empty(),
        required_limits: wgpu::Limits::default(),
        ..Default::default()
    },
    None,
).await.unwrap();
```

### Async Handling

- **Native**: Returns standard Rust futures, use `block_on` or async runtime
- **WASM**: Returns `WasmNotSend` futures, use `wasm_bindgen_futures::spawn_local`

---

## 2. Buffer Management

### BufferDescriptor

```rust
pub struct BufferDescriptor<'a> {
    pub label: Label<'a>,
    pub size: BufferAddress,          // u64
    pub usage: BufferUsages,           // Bitflags
    pub mapped_at_creation: bool,
}
```

### BufferUsages Flags (for Compute)

```rust
impl BufferUsages {
    pub const STORAGE: BufferUsages;       // For read/write in shaders
    pub const COPY_SRC: BufferUsages;      // Can copy from
    pub const COPY_DST: BufferUsages;      // Can copy to
    pub const MAP_READ: BufferUsages;      // Can map for CPU read
    pub const MAP_WRITE: BufferUsages;     // Can map for CPU write
    pub const UNIFORM: BufferUsages;       // Uniform buffer
}
```

Flags are combined with bitwise OR: `BufferUsages::STORAGE | BufferUsages::COPY_SRC`

### Buffer Creation

```rust
pub fn Device::create_buffer(&self, desc: &BufferDescriptor) -> Buffer
```

**Example** (Storage buffer for compute):
```rust
let buffer = device.create_buffer(&wgpu::BufferDescriptor {
    label: Some("Storage Buffer"),
    size: 1024,
    usage: wgpu::BufferUsages::STORAGE
         | wgpu::BufferUsages::COPY_DST
         | wgpu::BufferUsages::COPY_SRC,
    mapped_at_creation: false,
});
```

### Uploading Data

```rust
pub fn Queue::write_buffer(&self, buffer: &Buffer, offset: BufferAddress, data: &[u8])
```

**Example**:
```rust
let data: Vec<f32> = vec![1.0, 2.0, 3.0, 4.0];
queue.write_buffer(&buffer, 0, bytemuck::cast_slice(&data));
```

### Reading Results Back (Mapping)

**Step 1**: Create staging buffer with MAP_READ:
```rust
let staging_buffer = device.create_buffer(&wgpu::BufferDescriptor {
    label: Some("Staging Buffer"),
    size: 1024,
    usage: wgpu::BufferUsages::MAP_READ | wgpu::BufferUsages::COPY_DST,
    mapped_at_creation: false,
});
```

**Step 2**: Copy from storage to staging:
```rust
encoder.copy_buffer_to_buffer(&storage_buffer, 0, &staging_buffer, 0, 1024);
```

**Step 3**: Map and read:
```rust
let buffer_slice = staging_buffer.slice(..);
let (tx, rx) = futures::channel::oneshot::channel();
buffer_slice.map_async(wgpu::MapMode::Read, move |result| {
    tx.send(result).unwrap();
});
device.poll(wgpu::Maintain::Wait);
rx.await.unwrap().unwrap();

{
    let data = buffer_slice.get_mapped_range();
    let result: &[f32] = bytemuck::cast_slice(&data);
    // Use result...
}
staging_buffer.unmap();
```

---

## 3. Compute Pipeline Setup

### Shader Module Creation

```rust
pub struct ShaderModuleDescriptor<'a> {
    pub label: Label<'a>,
    pub source: ShaderSource<'a>,
}

pub enum ShaderSource<'a> {
    Wgsl(Cow<'a, str>),
    // Other variants for SPIR-V, Naga IR...
}
```

**Creation**:
```rust
pub fn Device::create_shader_module(&self, desc: &ShaderModuleDescriptor) -> ShaderModule
```

**Example**:
```rust
let shader = device.create_shader_module(&wgpu::ShaderModuleDescriptor {
    label: Some("Compute Shader"),
    source: wgpu::ShaderSource::Wgsl(include_str!("shader.wgsl").into()),
});
```

### Bind Group Layout

```rust
pub struct BindGroupLayoutDescriptor<'a> {
    pub label: Label<'a>,
    pub entries: &'a [BindGroupLayoutEntry],
}

pub struct BindGroupLayoutEntry {
    pub binding: u32,                    // Binding index
    pub visibility: ShaderStages,        // VERTEX | FRAGMENT | COMPUTE
    pub ty: BindingType,                 // Type of binding
    pub count: Option<NonZeroU32>,       // For binding arrays
}

pub enum BindingType {
    Buffer {
        ty: BufferBindingType,           // Uniform, Storage, ReadOnlyStorage
        has_dynamic_offset: bool,
        min_binding_size: Option<BufferSize>,
    },
    Sampler(SamplerBindingType),
    Texture {
        sample_type: TextureSampleType,
        view_dimension: TextureViewDimension,
        multisampled: bool,
    },
    StorageTexture {
        access: StorageTextureAccess,
        format: TextureFormat,
        view_dimension: TextureViewDimension,
    },
}

pub enum BufferBindingType {
    Uniform,
    Storage { read_only: bool },
    // ReadOnlyStorage is deprecated, use Storage { read_only: true }
}
```

**Example** (Two storage buffers):
```rust
let bind_group_layout = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
    label: Some("Compute Bind Group Layout"),
    entries: &[
        wgpu::BindGroupLayoutEntry {
            binding: 0,
            visibility: wgpu::ShaderStages::COMPUTE,
            ty: wgpu::BindingType::Buffer {
                ty: wgpu::BufferBindingType::Storage { read_only: false },
                has_dynamic_offset: false,
                min_binding_size: None,
            },
            count: None,
        },
        wgpu::BindGroupLayoutEntry {
            binding: 1,
            visibility: wgpu::ShaderStages::COMPUTE,
            ty: wgpu::BindingType::Buffer {
                ty: wgpu::BufferBindingType::Storage { read_only: false },
                has_dynamic_offset: false,
                min_binding_size: None,
            },
            count: None,
        },
    ],
});
```

### Pipeline Layout

```rust
pub struct PipelineLayoutDescriptor<'a> {
    pub label: Label<'a>,
    pub bind_group_layouts: &'a [&'a BindGroupLayout],
    pub immediate_size: u32,             // For immediate data (requires feature)
}
```

**Creation**:
```rust
let pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
    label: Some("Compute Pipeline Layout"),
    bind_group_layouts: &[&bind_group_layout],
    immediate_size: 0,
});
```

### Compute Pipeline

```rust
pub struct ComputePipelineDescriptor<'a> {
    pub label: Label<'a>,
    pub layout: Option<&'a PipelineLayout>,
    pub module: &'a ShaderModule,
    pub entry_point: Option<&'a str>,
    pub compilation_options: PipelineCompilationOptions<'a>,
    pub cache: Option<&'a PipelineCache>,
}
```

**Creation**:
```rust
let compute_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
    label: Some("Compute Pipeline"),
    layout: Some(&pipeline_layout),
    module: &shader,
    entry_point: Some("main"),  // or None if shader has one entry point
    compilation_options: Default::default(),
    cache: None,
});
```

**Note**: If `layout` is `None`, wgpu creates a default layout from the shader. You can retrieve it with `pipeline.get_bind_group_layout(0)`.

---

## 4. Bind Group Creation

### BindGroupDescriptor

```rust
pub struct BindGroupDescriptor<'a> {
    pub label: Label<'a>,
    pub layout: &'a BindGroupLayout,
    pub entries: &'a [BindGroupEntry<'a>],
}

pub struct BindGroupEntry<'a> {
    pub binding: u32,
    pub resource: BindingResource<'a>,
}

pub enum BindingResource<'a> {
    Buffer(BufferBinding<'a>),
    BufferArray(&'a [BufferBinding<'a>]),
    Sampler(&'a Sampler),
    SamplerArray(&'a [&'a Sampler]),
    TextureView(&'a TextureView),
    TextureViewArray(&'a [&'a TextureView]),
}

pub struct BufferBinding<'a> {
    pub buffer: &'a Buffer,
    pub offset: BufferAddress,
    pub size: Option<BufferSize>,
}
```

**Example**:
```rust
let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
    label: Some("Compute Bind Group"),
    layout: &bind_group_layout,
    entries: &[
        wgpu::BindGroupEntry {
            binding: 0,
            resource: buffer_a.as_entire_binding(),
        },
        wgpu::BindGroupEntry {
            binding: 1,
            resource: buffer_b.as_entire_binding(),
        },
    ],
});
```

**Helper method**:
```rust
impl Buffer {
    pub fn as_entire_binding(&self) -> BindingResource<'_>
}
```

---

## 5. Command Encoding & Dispatch

### Command Encoder

```rust
pub struct CommandEncoderDescriptor<'a> {
    pub label: Label<'a>,
}

pub fn Device::create_command_encoder(&self, desc: &CommandEncoderDescriptor) -> CommandEncoder
```

**Example**:
```rust
let mut encoder = device.create_command_encoder(&wgpu::CommandEncoderDescriptor {
    label: Some("Compute Encoder"),
});
```

### Compute Pass

```rust
pub fn CommandEncoder::begin_compute_pass(
    &mut self,
    desc: &ComputePassDescriptor,
) -> ComputePass<'_>

pub struct ComputePassDescriptor<'a> {
    pub label: Label<'a>,
    pub timestamp_writes: Option<ComputePassTimestampWrites<'a>>,
}
```

**Methods on ComputePass**:
```rust
impl<'a> ComputePass<'a> {
    pub fn set_pipeline(&mut self, pipeline: &'a ComputePipeline);

    pub fn set_bind_group(
        &mut self,
        index: u32,                      // Bind group index (0, 1, 2...)
        bind_group: &'a BindGroup,
        offsets: &[DynamicOffset],       // Usually &[]
    );

    pub fn dispatch_workgroups(&mut self, x: u32, y: u32, z: u32);

    pub fn dispatch_workgroups_indirect(
        &mut self,
        indirect_buffer: &'a Buffer,
        indirect_offset: BufferAddress,
    );
}
```

**Example**:
```rust
{
    let mut compute_pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
        label: Some("Compute Pass"),
        timestamp_writes: None,
    });

    compute_pass.set_pipeline(&compute_pipeline);
    compute_pass.set_bind_group(0, &bind_group, &[]);
    compute_pass.dispatch_workgroups(64, 1, 1);  // Dispatch 64 workgroups in x
}
// compute_pass dropped here, ending the pass
```

**Important**: The `ComputePass` must be dropped before calling `encoder.finish()`.

### Submit Commands

```rust
pub fn CommandEncoder::finish(self) -> CommandBuffer

pub fn Queue::submit<I: IntoIterator<Item = CommandBuffer>>(&self, command_buffers: I) -> SubmissionIndex
```

**Example**:
```rust
let command_buffer = encoder.finish();
queue.submit(std::iter::once(command_buffer));
```

---

## 6. Workgroup Dispatch

The `dispatch_workgroups(x, y, z)` call launches compute shader invocations:

- **Workgroups**: `x * y * z` workgroups are dispatched
- **Invocations**: Each workgroup contains the number of invocations specified in the shader `@workgroup_size()`

**Example shader**:
```wgsl
@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    // Process element at index
}
```

**Dispatch**:
```rust
let num_elements = 16384u32;
let workgroup_size = 256u32;
let num_workgroups = (num_elements + workgroup_size - 1) / workgroup_size;  // Ceiling division
compute_pass.dispatch_workgroups(num_workgroups, 1, 1);
```

**Total invocations**: `num_workgroups * workgroup_size = 64 * 256 = 16384`

---

## 7. Complete Example

```rust
use wgpu::util::DeviceExt;

async fn run_compute() {
    // 1. Initialize
    let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor::default());
    let adapter = instance.request_adapter(&wgpu::RequestAdapterOptions::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&wgpu::DeviceDescriptor::default(), None).await.unwrap();

    // 2. Create shader
    let shader = device.create_shader_module(&wgpu::ShaderModuleDescriptor {
        label: Some("Shader"),
        source: wgpu::ShaderSource::Wgsl(r#"
            @group(0) @binding(0) var<storage, read_write> data: array<f32>;

            @compute @workgroup_size(64)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                data[global_id.x] = data[global_id.x] * 2.0;
            }
        "#.into()),
    });

    // 3. Create buffers
    let input_data: Vec<f32> = (0..256).map(|i| i as f32).collect();
    let storage_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("Storage Buffer"),
        contents: bytemuck::cast_slice(&input_data),
        usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::COPY_SRC,
    });

    let staging_buffer = device.create_buffer(&wgpu::BufferDescriptor {
        label: Some("Staging Buffer"),
        size: (input_data.len() * std::mem::size_of::<f32>()) as u64,
        usage: wgpu::BufferUsages::MAP_READ | wgpu::BufferUsages::COPY_DST,
        mapped_at_creation: false,
    });

    // 4. Create bind group layout
    let bind_group_layout = device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
        label: None,
        entries: &[
            wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            },
        ],
    });

    // 5. Create pipeline
    let pipeline_layout = device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
        label: None,
        bind_group_layouts: &[&bind_group_layout],
        immediate_size: 0,
    });

    let compute_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
        label: None,
        layout: Some(&pipeline_layout),
        module: &shader,
        entry_point: Some("main"),
        compilation_options: Default::default(),
        cache: None,
    });

    // 6. Create bind group
    let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
        label: None,
        layout: &bind_group_layout,
        entries: &[
            wgpu::BindGroupEntry {
                binding: 0,
                resource: storage_buffer.as_entire_binding(),
            },
        ],
    });

    // 7. Encode and submit
    let mut encoder = device.create_command_encoder(&wgpu::CommandEncoderDescriptor { label: None });

    {
        let mut compute_pass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
            label: None,
            timestamp_writes: None,
        });
        compute_pass.set_pipeline(&compute_pipeline);
        compute_pass.set_bind_group(0, &bind_group, &[]);
        compute_pass.dispatch_workgroups(4, 1, 1);  // 4 * 64 = 256 elements
    }

    encoder.copy_buffer_to_buffer(&storage_buffer, 0, &staging_buffer, 0, staging_buffer.size());
    queue.submit(Some(encoder.finish()));

    // 8. Read results
    let buffer_slice = staging_buffer.slice(..);
    let (tx, rx) = futures::channel::oneshot::channel();
    buffer_slice.map_async(wgpu::MapMode::Read, move |r| tx.send(r).unwrap());
    device.poll(wgpu::Maintain::Wait);
    rx.await.unwrap().unwrap();

    {
        let data = buffer_slice.get_mapped_range();
        let result: &[f32] = bytemuck::cast_slice(&data);
        println!("Result: {:?}", &result[..10]);
    }
    staging_buffer.unmap();
}
```

---

## 8. WASM-Specific Considerations

### Async Differences

On WASM, futures are `WasmNotSend` (not `Send`). Use:

```rust
#[cfg(target_arch = "wasm32")]
wasm_bindgen_futures::spawn_local(async {
    run_compute().await;
});

#[cfg(not(target_arch = "wasm32"))]
pollster::block_on(run_compute());
```

### Instance Creation

For WASM/WebGPU, you typically need:

```rust
let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
    backends: wgpu::Backends::BROWSER_WEBGPU,  // or Backends::GL for WebGL
    ..Default::default()
});
```

### Surface Requirements

When using WebGL backend, you may need a compatible surface even for compute:

```rust
let adapter = instance.request_adapter(&wgpu::RequestAdapterOptions {
    compatible_surface: Some(&surface),  // Required for WebGL2
    ..Default::default()
}).await.unwrap();
```

### Memory Mapping

WASM has the same mapping API, but polling works differently:

```rust
// WASM: device.poll() is usually automatic via browser event loop
// Native: Must call device.poll(Maintain::Wait) explicitly
```

### Feature Availability

Check adapter features before using:

```rust
let features = adapter.features();
if !features.contains(wgpu::Features::TIMESTAMP_QUERY) {
    // Timestamp queries not available
}
```

---

## 9. Important Types Summary

### Core Objects

| Type | Description | Lifetime |
|------|-------------|----------|
| `Instance` | GPU instance, entry point | Can drop after adapter creation |
| `Adapter` | Physical device | Can drop after device creation |
| `Device` | Logical device | Keep alive |
| `Queue` | Command queue | Keep alive |
| `Buffer` | GPU buffer | Keep alive while in use |
| `ShaderModule` | Compiled shader | Keep alive while in use |
| `BindGroupLayout` | Bind group layout | Keep alive while in use |
| `PipelineLayout` | Pipeline layout | Keep alive while in use |
| `ComputePipeline` | Compute pipeline | Keep alive while in use |
| `BindGroup` | Resource bindings | Keep alive while in use |
| `CommandEncoder` | Command recorder | Consumed by `finish()` |
| `ComputePass` | Compute pass | Scoped lifetime |

### Key Enums

```rust
pub enum wgpu::Backends {
    VULKAN, METAL, DX12, GL, BROWSER_WEBGPU
}

pub enum wgpu::PowerPreference {
    LowPower,
    HighPerformance,
    None,
}

pub enum wgpu::ShaderStages {
    VERTEX, FRAGMENT, COMPUTE
}

pub enum wgpu::MapMode {
    Read,
    Write,
}
```

---

## 10. Common Patterns

### Pattern 1: Simple Compute Kernel

1. Create instance, adapter, device
2. Create shader module
3. Create storage buffer(s)
4. Create bind group layout matching shader
5. Create pipeline with layout and shader
6. Create bind group with actual buffers
7. Encode: begin pass, set pipeline, set bind group, dispatch
8. Submit and read results

### Pattern 2: Multi-Buffer Compute

Use multiple bind group entries for input/output separation:

```rust
// Layout
entries: &[
    BindGroupLayoutEntry { binding: 0, ... },  // Input
    BindGroupLayoutEntry { binding: 1, ... },  // Output
]

// Bind group
entries: &[
    BindGroupEntry { binding: 0, resource: input_buffer.as_entire_binding() },
    BindGroupEntry { binding: 1, resource: output_buffer.as_entire_binding() },
]
```

### Pattern 3: Uniform + Storage

```rust
// Layout
entries: &[
    BindGroupLayoutEntry {
        binding: 0,
        ty: BindingType::Buffer {
            ty: BufferBindingType::Uniform,
            ...
        },
        ...
    },
    BindGroupLayoutEntry {
        binding: 1,
        ty: BindingType::Buffer {
            ty: BufferBindingType::Storage { read_only: false },
            ...
        },
        ...
    },
]
```

---

## 11. Performance Notes

- **Buffer Alignment**: Storage buffers should be aligned to `STORAGE_BUFFER_OFFSET_ALIGNMENT` (typically 256 bytes)
- **Workgroup Size**: Choose workgroup sizes that are multiples of 32 or 64 for GPU efficiency
- **Memory Mapping**: Minimize map/unmap operations; use staging buffers for readback
- **Pipeline Reuse**: Create pipelines once and reuse them
- **Async Operations**: Use `device.poll(Maintain::Wait)` to wait for operations to complete

---

## 12. Error Handling

Most wgpu operations return `Result` types:

```rust
pub enum RequestAdapterError { /* ... */ }
pub enum RequestDeviceError { /* ... */ }
pub enum BufferAsyncError { /* ... */ }
```

Handle errors appropriately:

```rust
let adapter = instance.request_adapter(&options).await
    .ok_or("No suitable adapter found")?;
```

Use validation layers during development:

```rust
let instance = wgpu::Instance::new(&wgpu::InstanceDescriptor {
    flags: wgpu::InstanceFlags::validation(),
    ..Default::default()
});
```

---

## Document Version

- **wgpu version**: 28.0.0
- **Documentation source**: docs.rs
- **Date extracted**: 2026-01-10
