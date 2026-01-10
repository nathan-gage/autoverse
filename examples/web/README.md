# Flow Lenia Web Demo

Interactive browser visualization of Flow Lenia using WebAssembly.

## Quick Start

```bash
# From repository root
wasm-pack build --target web --release
python3 -m http.server 8000
# Open http://localhost:8000/examples/web/
```

## Controls

- **Play/Pause**: Start/stop continuous simulation
- **Step**: Advance one time step
- **Reset**: Reinitialize with seed pattern
- **Speed Up/Down**: Adjust simulation steps per frame
