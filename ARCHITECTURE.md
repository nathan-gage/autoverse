# Flow Lenia Architecture

This document describes the mathematical formulation and implementation architecture for Flow Lenia, a mass-conservative continuous cellular automaton.

## Mathematical Formulation

### 1. State Representation

The system state at time `t` is a continuous activation map:

```
A^t: L -> [0, inf)^C
```

Where:
- `L` is the 2D lattice (grid) with periodic boundary conditions (torus topology)
- `C` is the number of channels
- Values are non-negative (unbounded in Flow Lenia, unlike standard Lenia's [0,1])

### 2. Kernel Function K

Kernels are composed of sums of concentric Gaussian rings (bumps):

```
K_i(x) = (1/Z) * sum_j[ b_j * exp(-(||x||/(R*r_i) - a_j)^2 / (2*w_j^2)) ]
```

Parameters:
- `R`: Maximum neighborhood radius (common to all kernels)
- `r_i`: Relative radius for kernel `i` (in [0,1])
- `b_j`: Amplitude of ring `j`
- `a_j`: Relative distance of ring `j` from center (in [0,1])
- `w_j`: Width of ring `j`
- `Z`: Normalization factor ensuring `integral(K) = 1`

### 3. Growth Function G

The growth function determines reaction to local neighborhood density:

```
G(u; mu, sigma) = 2 * exp(-(u - mu)^2 / (2*sigma^2)) - 1
```

Parameters:
- `mu`: Optimal growth center (peak activation)
- `sigma`: Growth width (sensitivity)

Output range: `[-1, 1]`

### 4. Affinity/Growth Field U

The growth field is computed via convolution:

```
U^t_c1(x) = sum_i[ h_i * G(K_i * A^t_c0(x); mu_i, sigma_i) ]
```

Where:
- `K_i * A^t_c0`: Convolution of kernel `i` with source channel `c0`
- `h_i`: Weight for kernel `i`
- `c0, c1`: Source and target channel indices

### 5. Flow Field F (Mass Conservation)

The flow vector field drives mass transport:

```
F^t(x) = (1 - alpha(x)) * grad(U^t(x)) - alpha(x) * grad(A^t_sum(x))
```

Where:
- `grad(U^t)`: Gradient of affinity map (attraction toward high affinity)
- `grad(A^t_sum)`: Gradient of total mass (diffusion/repulsion)
- `A^t_sum(x) = sum_c[A^t_c(x)]`: Total mass across all channels
- `alpha(x)`: Balancing term for diffusion priority

### 6. Alpha (Diffusion Priority)

```
alpha(x) = clamp((A_sum(x) / beta_A)^n, 0, 1)
```

Parameters:
- `beta_A`: Critical mass threshold
- `n`: Power parameter controlling transition sharpness

When mass approaches `beta_A`, diffusion dominates to prevent infinite density.

### 7. Reintegration Tracking (State Update)

Mass is advected using reintegration tracking for strict conservation:

```
A^{t+dt}(x) = integral[ A^t(x') * I(x', x) dx' ]
```

Where `I(x', x)` is the proportion of mass moving from `x'` to `x`:

1. Compute destination: `x'' = x' + dt * F(x')`
2. Distribute mass from `x'` using a uniform square kernel `D(x'', s)` of size `2s`
3. The fraction arriving at `x` is proportional to overlap of `D(x'', s)` with cell `x`

```
I(x', x) = integral_x[ D(x'' - y, s) dy ] / integral[ D(x'' - y, s) dy ]
```

## Implementation Architecture

```
flow-lenia/
├── src/
│   ├── lib.rs              # Library root, re-exports
│   ├── main.rs             # CLI entry point
│   ├── schema/
│   │   ├── mod.rs          # Schema module
│   │   ├── config.rs       # Simulation configuration types
│   │   └── seed.rs         # Initial state seeding
│   └── compute/
│       ├── mod.rs          # Compute module
│       ├── kernel.rs       # Kernel generation
│       ├── fft.rs          # FFT-based convolution
│       ├── growth.rs       # Growth function
│       ├── flow.rs         # Flow field computation
│       ├── gradient.rs     # Sobel gradient filters
│       ├── reintegration.rs # Mass redistribution
│       └── propagator.rs   # Main simulation stepper
├── benches/
│   └── propagator.rs       # Performance benchmarks
└── examples/
    └── glider.json         # Example seed configuration
```

### Module Responsibilities

#### `schema/` - Data Types & Serialization

**config.rs**: Simulation parameters
- `SimulationConfig`: Top-level configuration (grid size, dt, channels)
- `KernelConfig`: Individual kernel parameters (R, r, bumps, growth params)
- `FlowConfig`: Mass conservation parameters (beta_A, n, s)

**seed.rs**: Initial state specification
- `Seed`: Complete initial state (grid values, optional parameter fields)
- `Pattern`: Predefined patterns (gaussian blob, noise, custom)

#### `compute/` - Numerical Computation

**kernel.rs**: Precompute kernel grids
- Generate normalized kernel matrices from `KernelConfig`
- Cache FFT-transformed kernels for efficient convolution

**fft.rs**: FFT-based 2D convolution
- Real-to-complex FFT for input grids
- Pointwise multiplication in frequency domain
- Inverse FFT for result
- Handles periodic boundaries naturally

**growth.rs**: Growth function evaluation
- Vectorized Gaussian computation
- Applied element-wise to convolution results

**gradient.rs**: Spatial gradients
- Sobel filter implementation (3x3)
- Returns (dx, dy) gradient components
- Handles periodic boundaries

**flow.rs**: Flow field computation
- Combines affinity gradient and mass gradient
- Computes alpha weighting
- Returns velocity field (Fx, Fy)

**reintegration.rs**: Mass-conservative update
- Advects mass to new positions
- Distributes using square kernel
- Accumulates contributions to new grid
- Guarantees total mass conservation

**propagator.rs**: Main simulation driver
- `CpuPropagator`: Orchestrates one time step
- Manages double-buffering of state
- Coordinates all compute stages

### Compute Pipeline (per time step)

```
1. Convolution Stage
   for each kernel k:
       conv[k] = FFT_convolve(A[c0[k]], K[k])

2. Growth Stage
   for each kernel k:
       U[c1[k]] += h[k] * G(conv[k]; mu[k], sigma[k])

3. Gradient Stage
   grad_U = sobel(U)           # Per channel
   A_sum = sum(A, axis=channels)
   grad_A = sobel(A_sum)

4. Flow Stage
   for each cell x:
       alpha = clamp((A_sum[x] / beta_A)^n, 0, 1)
       F[x] = (1 - alpha) * grad_U[x] - alpha * grad_A[x]

5. Reintegration Stage
   A_new = zeros_like(A)
   for each cell x:
       dest = x + dt * F[x]
       distribute(A[x], dest, s) -> A_new
   A = A_new
```

### Performance Considerations

1. **FFT Convolution**: O(N log N) vs O(N * K^2) for direct convolution
2. **SIMD**: Use `rayon` for parallel iteration over cells
3. **Cache Locality**: Process data in row-major order
4. **Memory Reuse**: Pre-allocate all buffers, avoid allocations in hot loop
5. **Future WebGPU**: Architecture separates compute from rendering for easy GPU port

### Boundary Conditions

All operations use **periodic (torus) boundaries**:
- FFT convolution handles this naturally via circular convolution
- Gradient filters wrap at edges
- Reintegration wraps destination coordinates modulo grid size

### Numerical Stability

- Use `f32` for performance (sufficient precision for CA dynamics)
- Clamp alpha to [0, 1] to prevent numerical issues
- Small `dt` values (typically 0.1-0.5) for stability
- Mass is strictly conserved by construction (reintegration tracking)
