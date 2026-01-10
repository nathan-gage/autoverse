# Flow Lenia WebAssembly Example

This directory contains a minimal browser-based visualization of Flow Lenia running in WebAssembly.

## Building

First, build the WASM package from the repository root:

```bash
# Install wasm-pack if needed
cargo install wasm-pack

# Build for web target
wasm-pack build --target web --release
```

This generates the `pkg/` directory with:
- `flow_lenia_bg.wasm` - Compiled WASM binary
- `flow_lenia.js` - JavaScript bindings
- `flow_lenia.d.ts` - TypeScript definitions

## Running

Since browsers require WASM to be served over HTTP (not `file://`), start a local server:

```bash
# From repository root
cd examples/web

# Python 3
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js (install with: npm install -g http-server)
http-server -p 8000
```

Then open http://localhost:8000 in your browser.

## Controls

- **Play**: Start continuous simulation
- **Pause**: Stop simulation
- **Step**: Advance one time step
- **Reset**: Reinitialize with seed pattern
- **Speed Up**: Double simulation steps per frame (faster, choppier)
- **Slow Down**: Halve simulation steps per frame (slower, smoother)

## How It Works

The demo:
1. Loads the WASM module (`flow_lenia_bg.wasm`)
2. Creates a `WasmPropagator` with configuration and seed
3. Runs simulation steps in an animation loop
4. Renders the first channel to an HTML canvas
5. Displays statistics (step count, time, mass, FPS)

The canvas shows mass distribution as grayscale intensity (darker = less mass, brighter = more mass).

## Customization

Edit `index.html` to modify:

- **Grid size**: Change `config.width` and `config.height`
- **Time step**: Adjust `config.dt`
- **Kernel**: Modify `config.kernels` for different growth patterns
- **Seed**: Change `seed.pattern` (GaussianBlob, Ring, Noise, etc.)
- **Flow**: Tune `config.flow` parameters

See [WASM.md](../../WASM.md) for full API documentation.

## Performance

Expected performance on modern browsers:
- 128x128 grid: 60+ FPS
- 256x256 grid: 30-60 FPS
- 512x512 grid: 10-30 FPS

For larger grids, reduce steps per frame or increase canvas size without increasing simulation resolution.

## Browser Compatibility

Requires WebAssembly support:
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

All modern browsers support WASM. For best performance, use latest Chrome or Firefox.
