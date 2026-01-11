# WebAssembly Support

Flow Lenia compiles to WebAssembly for browser-based deployment. The core compute pipeline is identical across native and WASM targets.

## Building

```bash
# Prerequisites
rustup target add wasm32-unknown-unknown
cargo install wasm-pack

# Build for web
wasm-pack build --target web --release
```

This generates `pkg/` with the WASM binary and JavaScript bindings.

## JavaScript API

```javascript
import init, { WasmPropagator } from './pkg/flow_lenia.js';

await init();

const config = {
  width: 128,
  height: 128,
  channels: 1,
  dt: 0.1,
  kernel_radius: 13,
  kernels: [{
    radius: 1.0,
    rings: [{ amplitude: 1.0, distance: 0.5, width: 0.15 }],
    weight: 1.0,
    mu: 0.15,
    sigma: 0.015,
    source_channel: 0,
    target_channel: 0
  }],
  flow: { beta_a: 1.0, n: 2.0, distribution_size: 1.0 }
};

const seed = {
  pattern: {
    type: "GaussianBlob",
    center: [0.5, 0.5],
    radius: 0.1,
    amplitude: 1.0,
    channel: 0
  }
};

const propagator = new WasmPropagator(
  JSON.stringify(config),
  JSON.stringify(seed)
);

// Run simulation
propagator.step();           // Single step
propagator.run(BigInt(10));  // Multiple steps (requires BigInt)

// Get state
const state = propagator.getState();  // { channels, width, height, time, step }
const mass = propagator.totalMass();

// Reset
propagator.reset(JSON.stringify(seed));
```

## Web Viewer

See `web/` for the interactive web viewer with drag-and-drop creatures, presets, and more:

```bash
cd web
bun install
bun run dev
# Open http://localhost:3000
```

For production builds:

```bash
cd web
bun run build
bun run preview
```

## Limitations

- **Single-threaded**: No rayon support in WASM (native builds use parallel computation)
- **BigInt required**: The `run()` method takes `u64`, which requires `BigInt` in JavaScript
