# Parameter Embedding in Flow Lenia

This document describes the mathematical foundations and implementation of parameter embedding in Flow Lenia, which enables multi-species simulations with emergent evolutionary properties.

## Overview

In standard Flow Lenia, simulation parameters (kernel, growth settings) are global—they apply uniformly across the entire grid. Parameter embedding changes this by storing parameters individually at each cell position, allowing them to be transported alongside mass dynamics.

This approach, described in the original Flow Lenia paper, "allows for multispecies simulations" where different regions can exhibit different behaviors, and these behaviors can spread, mix, and evolve as mass flows.

## Mathematical Formulation

### Standard Flow Lenia

In standard Flow Lenia, the affinity field is computed as:

```
U(x) = Σₖ wₖ · G(Kₖ * A(x); μₖ, σₖ)
```

Where:
- `U(x)` is the affinity at position x
- `Kₖ` is the k-th convolution kernel
- `A(x)` is the activation (mass) field
- `G(u; μ, σ) = 2·exp(-(u-μ)²/(2σ²)) - 1` is the growth function
- `wₖ, μₖ, σₖ` are **global** parameters

### Parameter Embedded Flow Lenia

With parameter embedding, parameters become position-dependent:

```
U(x) = Σₖ w(x) · G(Kₖ * A(x); μ(x), σ(x))
```

Where `w(x)`, `μ(x)`, `σ(x)` are now **per-cell parameter fields**.

Similarly, the alpha weighting for flow computation becomes:

```
α(x) = clamp((Σc Ac(x) / βₐ(x))^n(x), 0, 1)
```

Where `βₐ(x)` and `n(x)` are also spatially-varying.

## Parameter Advection

The key innovation is that parameters are advected alongside mass. When mass flows from source to destination, its associated parameters flow with it.

### Flow Field

The flow field remains:
```
F(x) = (1 - α(x)) · ∇U(x) - α(x) · ∇A(x)
```

### Mass Transport

Mass at position x moves to position x' = x + dt · F(x).

### Parameter Transport

When computing the new parameters at position x', we must consider all source cells whose mass flows into x':

```
P(x')ₜ₊₁ = Mix({(Pₛ, mₛ) : s contributes to x'})
```

Where:
- `Pₛ` is the parameter vector at source s
- `mₛ` is the mass contribution from source s

## Stochastic Mixing

When mass from multiple sources collides at a destination, their parameters are mixed. We implement two mixing strategies:

### Softmax Mixing (Default)

Parameters are weighted using softmax of incoming mass:

```
wᵢ = exp((mᵢ - mₘₐₓ) / T) / Σⱼ exp((mⱼ - mₘₐₓ) / T)
```

Where T is the temperature parameter:
- Low T: Winner-take-all (dominant mass source determines parameters)
- High T: More uniform mixing

Final mixed parameters:
```
P' = Σᵢ wᵢ · Pᵢ
```

### Linear Mixing

Simple mass-weighted average:
```
P' = Σᵢ (mᵢ / Σⱼmⱼ) · Pᵢ
```

## Implementation Details

### Per-Cell Parameter Vector

Each cell stores 5 parameters:
```rust
struct CellParams {
    mu: f32,      // Growth function center
    sigma: f32,   // Growth function width
    weight: f32,  // Kernel weight
    beta_a: f32,  // Critical mass threshold
    n: f32,       // Alpha power parameter
}
```

### Direct Convolution

With spatially-varying parameters, FFT-based convolution cannot be used (FFT applies the same kernel everywhere). Instead, we use direct convolution:

```
U(x) = Σ_{k} w(x) · G(Σ_{y∈N(x)} K(x-y)·A(y); μ(x), σ(x))
```

This has O(N·K²) complexity vs FFT's O(N log N), making GPU acceleration important for larger kernels.

### Gather-Based Advection

The advection step uses a gather approach:
1. For each destination cell x'
2. Search for all source cells s that could contribute mass
3. For each source: compute where its mass lands and overlap with x'
4. Gather mass contributions and mix parameters

## Performance Considerations

| Aspect | Standard Mode | Embedded Mode |
|--------|--------------|---------------|
| Convolution | O(N log N) FFT | O(N·K²) Direct |
| Parameter Storage | ~0 | 5 floats/cell |
| Advection | Mass only | Mass + params |
| GPU Recommended | Optional | Strongly recommended |

## Multi-Species Simulation

To run a multi-species simulation:

1. Enable parameter embedding in config:
```json
{
  "embedding": {
    "enabled": true,
    "mixing_temperature": 1.0,
    "linear_mixing": false
  }
}
```

2. Initialize different species regions with different parameters:
```rust
let species_a = CellParams::new(0.1, 0.01, 1.0, 0.8, 2.0);
let species_b = CellParams::new(0.2, 0.02, 1.5, 1.2, 3.0);

// Set up initial parameter grid
let mut params = ParameterGrid::from_defaults(width, height);
for y in 0..height {
    for x in 0..width {
        if is_species_a_region(x, y) {
            params.set(x, y, species_a);
        } else if is_species_b_region(x, y) {
            params.set(x, y, species_b);
        }
    }
}
```

3. Run simulation - species will interact, mix, and potentially evolve through parameter drift.

## Emergent Properties

Parameter embedding enables several emergent behaviors:

1. **Species Boundaries**: Different parameter regions create distinct behavioral zones
2. **Parameter Mixing**: When species collide, their parameters blend
3. **Selection Pressure**: Parameters that lead to better growth/survival may dominate
4. **Spatial Segregation**: Species with incompatible parameters may separate

## References

- Plantec, E., et al. "Flow Lenia: Mass-conserving continuous cellular automata." (2023)
- Original implementation inspiration from the Flow Lenia paper's discussion of parameter embedding for multi-species dynamics.
