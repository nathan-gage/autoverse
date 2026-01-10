# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Before Starting Work

Always consult the `@issue-tracker` agent before beginning any task. This ensures work is linked to existing GitHub issues or new issues are created for tracking.

## Build Commands

```bash
cargo build              # Debug build
cargo build --release    # Release build (with LTO)
cargo test               # Run all tests
cargo test <test_name>   # Run specific test
cargo bench              # Run benchmarks
cargo run --release -- examples/glider.json 100  # Run simulation
```

## Architecture

Flow Lenia is a mass-conservative continuous cellular automaton. The codebase separates concerns into two main modules:

### `schema/` - Configuration & Data Types
- `SimulationConfig`: Grid dimensions, time step, kernel parameters
- `Seed` + `Pattern`: Initial state specification (GaussianBlob, Ring, Noise, Custom)
- All types are serde-serializable for JSON config files

### `compute/` - Numerical Computation
The compute pipeline runs per time step:

1. **Convolution** (`fft.rs`): FFT-based 2D convolution applies kernels to state
2. **Growth** (`growth.rs`): Gaussian growth function G(u; mu, sigma) → [-1, 1]
3. **Gradient** (`gradient.rs`): Sobel filters compute spatial gradients
4. **Flow** (`flow.rs`): Combines affinity gradient and mass gradient with alpha weighting
5. **Reintegration** (`reintegration.rs`): Mass-conservative advection via square kernel distribution

`CpuPropagator` in `propagator.rs` orchestrates the full pipeline.

### Key Invariant
**Mass conservation**: Total mass must remain constant (within floating-point tolerance). The reintegration tracking algorithm guarantees this by redistributing mass rather than adding/removing it.

### Periodic Boundaries
All operations use torus topology - coordinates wrap at grid edges. FFT convolution handles this naturally.

## JSON Configuration

Simulations load from paired files:
- `config.json`: SimulationConfig (grid size, kernels, flow params)
- `config.seed.json`: Seed (initial pattern)

Generate example configs: `cargo run --release -- --example`
