# 3D Flow Lenia Upgrade Evaluation

This document evaluates the feasibility and implementation strategy for upgrading the Flow Lenia simulation from 2D to full 3D support, plus adding a "compiled" animation export mode.

## Executive Summary

**3D Support**: Mathematically straightforward (Flow Lenia is N-dimensional), but computationally expensive (~O(N³) memory/compute vs O(N²)). A 128³ grid = 2M cells vs 16K for 128². Real-time 3D is infeasible for large grids; pre-computed animation export is essential.

**Animation Export**: Required for 3D. Serialize state per frame to disk, then render offline or export as video/volumetric format.

---

## Part 1: 3D Simulation Backend

### 1.1 Mathematical Foundation

Flow Lenia's formulation is dimension-agnostic. From `docs/math.md`:

- **Kernel**: `K(x) = f(||x||)` — uses Euclidean norm, works in any dimension
- **Gradient**: `∇U(x)` — N-dimensional gradient vector
- **Flow**: `F(x) = (1-α)∇U - α∇A_sum` — vector field in N dimensions
- **Reintegration**: Volume integral over distribution region

The 2D constraint is purely implementation-specific.

### 1.2 Required Code Changes

#### Schema (`src/schema/config.rs`)

```rust
pub struct SimulationConfig {
    pub width: usize,
    pub height: usize,
    pub depth: usize,        // NEW: Z dimension (1 = 2D mode)
    pub channels: usize,
    // ... rest unchanged
}
```

Backward compatibility: `depth: 1` defaults to 2D behavior.

#### State Representation (`src/compute/propagator.rs`)

```rust
pub struct SimulationState {
    pub channels: Vec<Vec<f32>>,  // [channel][z*H*W + y*W + x]
    pub width: usize,
    pub height: usize,
    pub depth: usize,            // NEW
    // ...
}

// Indexing helper
#[inline]
fn idx_3d(x: usize, y: usize, z: usize, w: usize, h: usize) -> usize {
    z * h * w + y * w + x
}
```

#### Kernel Generation (`src/compute/kernel.rs`)

3D spherical kernels with Gaussian rings (shells):

```rust
impl Kernel3D {
    pub fn from_config(config: &KernelConfig, max_radius: usize) -> Self {
        let size = max_radius * 2 + 1;
        let center = max_radius as f32;
        let mut data = vec![0.0f32; size * size * size];

        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    let dx = x as f32 - center;
                    let dy = y as f32 - center;
                    let dz = z as f32 - center;
                    let dist = (dx*dx + dy*dy + dz*dz).sqrt();
                    // ... same ring logic, spherical
                }
            }
        }
        // ...
    }
}
```

**Complexity**: Kernel size grows from O(R²) to O(R³). A radius-13 kernel: 27² = 729 → 27³ = 19,683 elements.

#### Gradient Computation (`src/compute/gradient.rs`)

3D Sobel requires 3×3×3 kernels for each axis:

```rust
// 3D Sobel kernels (each is 3x3x3 = 27 values)
const SOBEL_X_3D: [[[f32; 3]; 3]; 3] = /* derivative in X */;
const SOBEL_Y_3D: [[[f32; 3]; 3]; 3] = /* derivative in Y */;
const SOBEL_Z_3D: [[[f32; 3]; 3]; 3] = /* derivative in Z */;

pub fn sobel_gradient_3d(
    grid: &[f32],
    width: usize, height: usize, depth: usize,
) -> (Vec<f32>, Vec<f32>, Vec<f32>) {
    // Returns (grad_x, grad_y, grad_z)
}
```

**Operations**: 3× more gradient components, each requiring 27 neighbor reads (vs 9 for 2D).

#### Flow Field (`src/compute/flow.rs`)

```rust
pub fn compute_flow_field_3d_into(
    grad_u_x: &[f32], grad_u_y: &[f32], grad_u_z: &[f32],  // Affinity gradient
    grad_a_x: &[f32], grad_a_y: &[f32], grad_a_z: &[f32],  // Mass gradient
    channel_sum: &[f32],
    config: &FlowConfig,
    flow_x: &mut [f32], flow_y: &mut [f32], flow_z: &mut [f32],
) {
    // F = (1-α)∇U - α∇A_sum, in 3D
}
```

#### Reintegration Tracking (`src/compute/reintegration.rs`)

3D cube distribution instead of 2D square:

```rust
fn distribute_mass_3d(
    grid: &mut [f32],
    mass: f32,
    dest_x: f32, dest_y: f32, dest_z: f32,
    width: usize, height: usize, depth: usize,
    s: f32,  // cube half-size
) {
    // Compute cube bounds
    let x_min = dest_x - s;
    let x_max = dest_x + s;
    // ... y, z bounds

    // Volume instead of area
    let total_volume = (2.0 * s).powi(3);

    // Triple-nested loop over overlapping cells
    for iz in iz_min..=iz_max {
        for iy in iy_min..=iy_max {
            for ix in ix_min..=ix_max {
                // Compute box-box intersection volume
                let overlap_volume = /* ... */;
                let fraction = overlap_volume / total_volume;
                // ...
            }
        }
    }
}
```

#### FFT Convolution (`src/compute/fft.rs`)

rustfft supports 3D via composition:
1. FFT along X for each (Y,Z) slice
2. FFT along Y for each (X,Z) slice
3. FFT along Z for each (X,Y) slice

```rust
pub struct FrequencyKernel3D {
    freq_data: Vec<Complex<f32>>,  // 3D frequency domain
    width: usize,
    height: usize,
    depth: usize,
    // ...
}

impl CachedConvolver3D {
    pub fn convolve_3d(&self, input: &[f32], output: &mut [f32]) {
        // 3D FFT → multiply → 3D IFFT
    }
}
```

**Complexity**: O(N³ log N) vs O(N² log N). For 128³: ~2.8M operations vs ~110K for 128².

### 1.3 GPU Shaders (`src/compute/gpu/shaders/`)

3D workgroups require restructuring:

```wgsl
// Before (2D)
@workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let idx = y * width + x;
    // ...
}

// After (3D)
@workgroup_size(8, 8, 8)  // 512 threads per workgroup
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let x = gid.x;
    let y = gid.y;
    let z = gid.z;
    let idx = z * height * width + y * width + x;
    // ...
}
```

**GPU Constraints**:
- Workgroup size limit: 256-1024 threads (varies by GPU)
- 8×8×8 = 512 threads is reasonable
- Shared memory limits affect local convolution tiles

### 1.4 Seed Patterns (`src/schema/seed.rs`)

Add 3D pattern variants:

```rust
pub enum Pattern {
    // Existing 2D patterns (remain valid for depth=1)
    GaussianBlob { center: (f32, f32), ... },

    // New 3D patterns
    GaussianSphere {
        center: (f32, f32, f32),
        radius: f32,
        amplitude: f32,
        channel: usize,
    },
    Torus3D {
        center: (f32, f32, f32),
        major_radius: f32,
        minor_radius: f32,
        // ...
    },
    // ...
}
```

### 1.5 Performance Implications

| Metric | 2D (128²) | 3D (128³) | 3D (64³) |
|--------|-----------|-----------|----------|
| Grid cells | 16,384 | 2,097,152 | 262,144 |
| Memory per channel | 64 KB | 8 MB | 1 MB |
| Kernel ops (R=13) | ~12M | ~40B | ~5B |
| Estimated step time (CPU) | ~10ms | ~10s+ | ~1s |
| Estimated step time (GPU) | ~1ms | ~100ms+ | ~10ms |

**Conclusion**: Real-time 3D is not feasible for interactive use at reasonable resolutions. Pre-computed animation is essential.

---

## Part 2: Compiled Animation Export

### 2.1 Design Goals

1. **Pre-compute** N steps of simulation
2. **Serialize** state snapshots to disk (efficiently)
3. **Export** as playable animation format
4. Enable **offline rendering** with quality visualization

### 2.2 Animation File Format

#### Option A: Custom Binary Format (Recommended for development)

```rust
pub struct AnimationHeader {
    pub magic: [u8; 4],           // "FLWA" (Flow Lenia Animation)
    pub version: u32,
    pub width: u32,
    pub height: u32,
    pub depth: u32,
    pub channels: u32,
    pub frame_count: u32,
    pub dt: f32,
    pub compression: CompressionType,
}

pub enum CompressionType {
    None,
    Lz4,
    Zstd,
}

// File structure:
// [Header] [Frame 0] [Frame 1] ... [Frame N-1]
// Each frame: [channel 0 data] [channel 1 data] ...
```

**Advantages**: Simple, streamable, random access by frame index.

#### Option B: VDB/OpenVDB (Industry standard for volumetric data)

- Used by Houdini, Blender, major VFX studios
- Sparse representation (efficient for mostly-empty grids)
- Requires C++ library bindings

#### Option C: NumPy/NPZ (Python interop)

- Easy export: `np.savez_compressed("anim.npz", frames=data)`
- Direct Python visualization with matplotlib/vispy
- Good for research/analysis

### 2.3 Animation Recorder API

```rust
pub struct AnimationRecorder {
    config: SimulationConfig,
    frames: Vec<CompressedFrame>,
    compression: CompressionType,
}

impl AnimationRecorder {
    pub fn new(config: SimulationConfig) -> Self { /* ... */ }

    /// Record a single frame
    pub fn record_frame(&mut self, state: &SimulationState) {
        let compressed = self.compress_state(state);
        self.frames.push(compressed);
    }

    /// Run simulation and record N frames
    pub fn record_simulation(
        &mut self,
        propagator: &mut CpuPropagator,
        state: &mut SimulationState,
        num_frames: u64,
        steps_per_frame: u64,
    ) {
        for _ in 0..num_frames {
            self.record_frame(state);
            propagator.run(state, steps_per_frame);
        }
        self.record_frame(state); // Final frame
    }

    /// Save to file
    pub fn save(&self, path: &Path) -> Result<(), AnimationError> { /* ... */ }
}
```

### 2.4 Animation Player API

```rust
pub struct AnimationPlayer {
    header: AnimationHeader,
    reader: BufReader<File>,
    frame_offsets: Vec<u64>,  // For random access
}

impl AnimationPlayer {
    pub fn open(path: &Path) -> Result<Self, AnimationError> { /* ... */ }

    pub fn frame_count(&self) -> u32 { self.header.frame_count }

    /// Get frame by index
    pub fn get_frame(&mut self, index: u32) -> Result<SimulationState, AnimationError> { /* ... */ }

    /// Stream frames sequentially (efficient)
    pub fn iter_frames(&mut self) -> impl Iterator<Item = SimulationState> { /* ... */ }
}
```

### 2.5 CLI Interface

```bash
# Compile animation (pre-compute N steps)
cargo run --release -- compile examples/glider3d.json \
    --frames 1000 \
    --steps-per-frame 5 \
    --output animation.flwa \
    --compression zstd

# Play/export animation
cargo run --release -- play animation.flwa \
    --output-dir frames/ \
    --format png

# Export to video (requires ffmpeg)
cargo run --release -- export animation.flwa \
    --output simulation.mp4 \
    --fps 30 \
    --codec h264
```

### 2.6 Storage Estimates

| Resolution | Channels | Frames | Raw Size | Compressed (~10:1) |
|------------|----------|--------|----------|-------------------|
| 64³ | 1 | 1000 | 1 GB | 100 MB |
| 128³ | 1 | 1000 | 8 GB | 800 MB |
| 128³ | 3 | 1000 | 24 GB | 2.4 GB |
| 256³ | 1 | 1000 | 64 GB | 6.4 GB |

**Mitigation strategies**:
- Delta compression (store differences between frames)
- Sparse representation (skip near-zero cells)
- Temporal compression (keyframes + interpolation)
- Lower precision (f16 or u8 instead of f32)

---

## Part 3: Implementation Plan

### Phase 1: Foundation (Core 3D Support)

1. **Schema updates**: Add `depth` to config, validation
2. **State structure**: Update `SimulationState` with depth, indexing helpers
3. **Kernel 3D**: Implement `Kernel3D::from_config` with spherical shells
4. **Gradient 3D**: Implement 3D Sobel filters
5. **Flow 3D**: Update flow computation for 3 components
6. **Reintegration 3D**: Implement 3D cube distribution
7. **Unit tests**: Verify mass conservation in 3D

### Phase 2: Convolution Backend

1. **FFT 3D**: Implement 3D FFT convolution (CPU)
2. **Direct 3D**: Fallback direct convolution for embedded mode
3. **GPU shaders**: Port all shaders to 3D workgroups
4. **Benchmarks**: Performance comparison 2D vs 3D at various resolutions

### Phase 3: Animation System

1. **Binary format**: Define and implement `.flwa` format
2. **Recorder API**: Implement `AnimationRecorder`
3. **Player API**: Implement `AnimationPlayer` with random access
4. **Compression**: Add LZ4/Zstd support
5. **CLI commands**: `compile`, `play`, `export`

### Phase 4: Visualization

1. **2D slice viewer**: Show XY, XZ, YZ slices of 3D data
2. **Web viewer update**: Support animation playback
3. **3D renderer**: Optional Three.js/WebGL volume rendering
4. **Export formats**: PNG sequences, MP4, VDB

### Phase 5: Optimization

1. **Sparse representation**: Skip empty regions
2. **Delta compression**: Temporal redundancy
3. **Streaming**: Process large animations without full memory load
4. **Parallel I/O**: Async frame writing during simulation

---

## Part 4: Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory explosion | High | Sparse storage, lower precision, streaming |
| Slow simulation | High | GPU acceleration, smaller grids, pre-compute |
| Large file sizes | Medium | Aggressive compression, delta encoding |
| GPU compatibility | Medium | Fallback to CPU, WebGPU subset |
| Breaking changes | Medium | Version field in format, 2D backward compat |

---

## Part 5: Alternatives Considered

### Alternative A: Slice-based pseudo-3D

Run multiple 2D simulations on parallel slices with inter-slice coupling. Simpler but loses true 3D dynamics.

**Rejected**: Not true 3D, loses emergent volumetric behavior.

### Alternative B: Octree/sparse voxels

Only store non-empty regions. Complex but memory-efficient for sparse patterns.

**Deferred**: Add as optimization in Phase 5 if needed.

### Alternative C: External simulation engine

Use existing volumetric simulation tools (OpenVDB, Mantaflow).

**Rejected**: Loses custom Flow Lenia dynamics, external dependencies.

---

## Conclusion

3D Flow Lenia is mathematically sound and implementable with the current architecture. The main challenges are computational cost (requiring pre-computed animations) and storage (requiring efficient compression).

**Recommended approach**:
1. Implement 3D backend with 2D backward compatibility
2. Build animation recording/playback system first (needed for any 3D work)
3. Start with small grids (32³-64³) for iteration
4. Add GPU acceleration as needed for larger grids
5. Optimize storage with compression and sparse representation

The animation system benefits 2D as well (for sharing, archiving, offline rendering) and should be prioritized.
