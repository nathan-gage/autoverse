# Flow Lenia Mathematical Formulation

This document describes the mathematical formulation for Flow Lenia, a mass-conservative continuous cellular automaton.

## State Representation

The system state at time `t` is a continuous activation map:

```
A^t: L -> [0, inf)^C
```

Where:
- `L` is the 2D lattice (grid) with periodic boundary conditions (torus topology)
- `C` is the number of channels
- Values are non-negative (unbounded in Flow Lenia, unlike standard Lenia's [0,1])

## Kernel Function K

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

## Growth Function G

The growth function determines reaction to local neighborhood density:

```
G(u; mu, sigma) = 2 * exp(-(u - mu)^2 / (2*sigma^2)) - 1
```

Parameters:
- `mu`: Optimal growth center (peak activation)
- `sigma`: Growth width (sensitivity)

Output range: `[-1, 1]`

## Affinity/Growth Field U

The growth field is computed via convolution:

```
U^t_c1(x) = sum_i[ h_i * G(K_i * A^t_c0(x); mu_i, sigma_i) ]
```

Where:
- `K_i * A^t_c0`: Convolution of kernel `i` with source channel `c0`
- `h_i`: Weight for kernel `i`
- `c0, c1`: Source and target channel indices

## Flow Field F (Mass Conservation)

The flow vector field drives mass transport:

```
F^t(x) = (1 - alpha(x)) * grad(U^t(x)) - alpha(x) * grad(A^t_sum(x))
```

Where:
- `grad(U^t)`: Gradient of affinity map (attraction toward high affinity)
- `grad(A^t_sum)`: Gradient of total mass (diffusion/repulsion)
- `A^t_sum(x) = sum_c[A^t_c(x)]`: Total mass across all channels
- `alpha(x)`: Balancing term for diffusion priority

## Alpha (Diffusion Priority)

```
alpha(x) = clamp((A_sum(x) / beta_A)^n, 0, 1)
```

Parameters:
- `beta_A`: Critical mass threshold
- `n`: Power parameter controlling transition sharpness

When mass approaches `beta_A`, diffusion dominates to prevent infinite density.

## Reintegration Tracking (State Update)

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

## References

- [Flow-Lenia: Emergent Evolutionary Dynamics in Mass Conservative Continuous Cellular Automata](https://arxiv.org/abs/2506.08569)
- [Original Lenia](https://github.com/Chakazul/Lenia)
