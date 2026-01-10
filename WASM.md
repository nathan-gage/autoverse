# WebAssembly Support

Flow Lenia supports compilation to WebAssembly (WASM) for browser-based deployment while maintaining native performance on desktop platforms.

## Architecture

The WASM implementation uses **compile-time feature selection** to ensure zero runtime overhead on native builds:

- **Conditional dependencies**: Platform-specific crates are only included for their target architecture
- **No runtime branches**: All WASM-specific code is behind `#[cfg(target_arch = "wasm32")]`
- **Shared core**: The compute pipeline (`CpuPropagator`, FFT, flow, reintegration) is identical across platforms
- **Thin bindings**: `WasmPropagator` is a minimal wrapper exposing the native API to JavaScript

### Feature Flags

- `native` (default): Includes native-specific dependencies (rayon, env_logger)
- `wasm`: Marker feature for WASM builds (no additional code, just for clarity)

## Building for WebAssembly

### Prerequisites

```bash
# Install wasm32 target
rustup target add wasm32-unknown-unknown

# Install wasm-pack (recommended)
cargo install wasm-pack
```

### Build Commands

#### Using wasm-pack (Recommended)

```bash
# For vanilla JS / ES modules
wasm-pack build --target web --release

# For webpack/rollup/bundlers
wasm-pack build --target bundler --release

# For Node.js
wasm-pack build --target nodejs --release
```

This generates:
- `pkg/flow_lenia_bg.wasm` - The compiled WASM binary
- `pkg/flow_lenia.js` - JavaScript glue code
- `pkg/flow_lenia.d.ts` - TypeScript definitions
- `pkg/package.json` - NPM package metadata

#### Manual Build (Advanced)

```bash
cargo build --target wasm32-unknown-unknown --release

# Optional: Optimize with wasm-opt
wasm-opt -O3 -o output.wasm target/wasm32-unknown-unknown/release/flow_lenia.wasm
```

## JavaScript API

### Initialization

```javascript
import init, { WasmPropagator } from './pkg/flow_lenia.js';

// Initialize WASM module
await init();

// Create configuration
const config = {
  width: 256,
  height: 256,
  channels: 1,
  dt: 0.1,
  kernel_radius: 13,
  kernels: [
    {
      radius: 1.0,
      rings: [{ amplitude: 1.0, distance: 0.5, width: 0.15 }],
      weight: 1.0,
      mu: 0.15,
      sigma: 0.015,
      source_channel: 0,
      target_channel: 0
    }
  ],
  flow: {
    beta_a: 1.0,
    n: 2.0,
    distribution_size: 1.0
  }
};

const seed = {
  pattern: {
    GaussianBlob: {
      center: [0.5, 0.5],
      radius: 0.1,
      amplitude: 1.0,
      channel: 0
    }
  }
};

// Create propagator
const propagator = new WasmPropagator(
  JSON.stringify(config),
  JSON.stringify(seed)
);
```

### Running Simulation

```javascript
// Single step
propagator.step();

// Multiple steps
propagator.run(10);

// Get current state
const state = propagator.getState();
console.log(`Time: ${state.time}, Step: ${state.step}`);
console.log(`Grid: ${state.width}x${state.height}, Channels: ${state.channels.length}`);

// Get statistics
const stats = propagator.getStats();
console.log(`Mass: ${stats.total_mass}, Active cells: ${stats.active_cells}`);

// Get specific values
const mass = propagator.totalMass();
const time = propagator.getTime();
const step = propagator.getStep();
```

### Resetting Simulation

```javascript
const newSeed = {
  pattern: {
    Ring: {
      center: [0.5, 0.5],
      radius: 0.2,
      width: 0.05,
      amplitude: 1.0,
      channel: 0
    }
  }
};

propagator.reset(JSON.stringify(newSeed));
```

### Memory Management

```javascript
// WASM memory is managed automatically
// No manual cleanup needed for WasmPropagator
```

## Example Web Application

See `examples/web/` for a minimal HTML+Canvas visualization:

```bash
cd examples/web
python3 -m http.server 8000
# Open http://localhost:8000
```

## Performance Characteristics

### Native vs WASM

| Aspect | Native | WASM |
|--------|--------|------|
| FFT Performance | 100% | ~80-90% |
| Memory Overhead | Minimal | +16KB runtime |
| Startup Time | <1ms | ~50ms (download + compile) |
| Parallel Execution | Yes (rayon) | No (single-threaded) |
| Binary Size | ~2MB | ~500KB (compressed) |

### Optimization Tips

1. **Use `wasm-opt`**: Post-process with Binaryen for 20-30% size reduction
2. **Enable compression**: Serve `.wasm` with gzip/brotli (2-3x smaller)
3. **Batch steps**: Call `run(N)` instead of N `step()` calls to reduce JS/WASM boundary crossings
4. **Minimize state serialization**: Only call `getState()` when needed for rendering

### Future: WebGPU Backend

WASM support enables browser deployment of the future WebGPU compute backend (issue #2). WebGPU shaders work natively in browsers without modification.

## Bundling with Build Tools

### Webpack

```javascript
// webpack.config.js
module.exports = {
  experiments: {
    asyncWebAssembly: true
  }
};
```

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()]
});
```

### Rollup

```javascript
// rollup.config.js
import wasm from '@rollup/plugin-wasm';

export default {
  plugins: [wasm({ sync: ['**/*.wasm'] })]
};
```

## Testing WASM Builds

```bash
# Install wasm-pack test runner
cargo install wasm-pack

# Run tests in browser (requires Chrome/Firefox)
wasm-pack test --headless --chrome
wasm-pack test --headless --firefox

# Run tests in Node.js
wasm-pack test --node
```

## Deployment

### CDN Hosting

```html
<script type="module">
  import init, { WasmPropagator } from 'https://cdn.example.com/flow-lenia/pkg/flow_lenia.js';
  await init();
  // Use WasmPropagator...
</script>
```

### NPM Package

```bash
cd pkg
npm publish
```

```javascript
// Users can install
npm install flow-lenia

// And import
import init, { WasmPropagator } from 'flow-lenia';
```

## Invariants

The WASM build preserves all native guarantees:

- **Mass conservation**: Exact same numerical tolerance as native
- **Periodic boundaries**: Torus topology works identically
- **Deterministic**: Same input produces same output (floating-point ordering)

## Troubleshooting

### "wasm-pack not found"

```bash
cargo install wasm-pack
```

### "rustc target not found"

```bash
rustup target add wasm32-unknown-unknown
```

### WASM binary too large

```bash
# Use wasm-opt for aggressive optimization
wasm-opt -O4 -o output.wasm input.wasm

# Enable link-time optimization
wasm-pack build --release -- -Z build-std=std,panic_abort -Z build-std-features=panic_immediate_abort
```

### Performance slower than expected

- Ensure using `--release` build
- Check browser WASM implementation (Chrome/Firefox have best performance)
- Profile with browser DevTools to identify bottlenecks
- Consider batching multiple steps per frame

## Limitations

Current WASM build is **single-threaded**:
- Native builds use `rayon` for parallel computation
- WASM doesn't support rayon yet (no std::thread in wasm32-unknown-unknown)
- Future: Explore Web Workers + SharedArrayBuffer for parallelism

## References

- [wasm-pack documentation](https://rustwasm.github.io/wasm-pack/)
- [wasm-bindgen guide](https://rustwasm.github.io/wasm-bindgen/)
- [Rust WASM book](https://rustwasm.github.io/book/)
