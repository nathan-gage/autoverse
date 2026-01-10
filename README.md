# Flow Lenia

A high-performance Rust implementation of Flow Lenia, a mass-conservative continuous cellular automaton.

## Overview

Flow Lenia extends the original Lenia system with mass conservation through flow-based dynamics and reintegration tracking. This enables:

- **Mass Conservation**: Total mass is strictly preserved through advection
- **Multi-species Simulations**: Multiple channels with independent or coupled dynamics
- **Emergent Behaviors**: Complex self-organizing patterns ("creatures") emerge from simple rules

## Architecture

```
src/
├── lib.rs              # Library root
├── main.rs             # CLI entry point
├── wasm.rs             # WebAssembly bindings (wasm32 only)
├── schema/             # Configuration & seeding
│   ├── config.rs       # Simulation parameters
│   └── seed.rs         # Initial state patterns
└── compute/            # Numerical computation
    ├── kernel.rs       # Gaussian ring kernels
    ├── fft.rs          # FFT convolution
    ├── growth.rs       # Growth function
    ├── gradient.rs     # Sobel gradients
    ├── flow.rs         # Flow field computation
    ├── reintegration.rs # Mass advection
    └── propagator.rs   # Main simulation driver
```

The codebase supports both **native** and **WebAssembly** targets through compile-time feature selection. The core compute pipeline is platform-independent, with conditional compilation for platform-specific dependencies (rayon for native, wasm-bindgen for web).

## Quick Start

### Native Build

```bash
# Build
cargo build --release

# Run with example configuration
cargo run --release -- examples/glider.json 100

# Generate example config
cargo run --release -- --example
```

### WebAssembly Build

```bash
# Install wasm-pack
cargo install wasm-pack

# Build for web
wasm-pack build --target web --release

# Run web demo
cd examples/web
python3 -m http.server 8000
# Open http://localhost:8000
```

See [WASM.md](WASM.md) for detailed WebAssembly documentation.

## Configuration

Simulation is configured via JSON:

```json
{
  "width": 256,
  "height": 256,
  "channels": 1,
  "dt": 0.2,
  "kernel_radius": 13,
  "kernels": [{
    "radius": 1.0,
    "rings": [{"amplitude": 1.0, "distance": 0.5, "width": 0.15}],
    "weight": 1.0,
    "mu": 0.15,
    "sigma": 0.015,
    "source_channel": 0,
    "target_channel": 0
  }],
  "flow": {
    "beta_a": 1.0,
    "n": 2.0,
    "distribution_size": 1.0
  }
}
```

Seeds specify initial patterns:

```json
{
  "pattern": {
    "type": "GaussianBlob",
    "center": [0.5, 0.5],
    "radius": 0.1,
    "amplitude": 1.0,
    "channel": 0
  }
}
```

## Library Usage

```rust
use flow_lenia::{CpuPropagator, SimulationState, SimulationConfig, Seed, Pattern};

let config = SimulationConfig::default();
let seed = Seed {
    pattern: Pattern::GaussianBlob {
        center: (0.5, 0.5),
        radius: 0.1,
        amplitude: 1.0,
        channel: 0,
    },
};

let mut state = SimulationState::from_seed(&seed, &config);
let mut propagator = CpuPropagator::new(config);

// Run 100 steps
propagator.run(&mut state, 100);

println!("Total mass: {}", state.total_mass());
```

## Compute Pipeline

Each time step executes:

1. **Convolution**: FFT-based kernel application to state channels
2. **Growth**: Gaussian growth function G(u; mu, sigma) → [-1, 1]
3. **Gradient**: Sobel filters compute spatial gradients of affinity and mass
4. **Flow**: Combine gradients with alpha weighting based on local density
5. **Reintegration**: Mass-conservative advection via square kernel distribution

All operations use periodic (torus) boundaries. Mass is strictly conserved.

## Mathematical Background

See [docs/math.md](docs/math.md) for the complete mathematical formulation.

## Performance

The CPU backend uses:
- **FFT convolution**: O(N log N) kernel application
- **Parallel iteration**: via rayon
- **Cache-optimized memory access**: row-major processing

Benchmarks:
```bash
cargo bench
```

## Roadmap

See [open issues](https://github.com/nathan-gage/autoverse/issues) for planned features.

## References

- [Flow-Lenia: Emergent Evolutionary Dynamics in Mass Conservative Continuous Cellular Automata](https://arxiv.org/abs/2506.08569)
- [Original Lenia](https://github.com/Chakazul/Lenia)

## License

MIT
