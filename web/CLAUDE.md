# Web Viewer - Claude Code Instructions

This is the interactive web viewer for Flow Lenia, built with TypeScript and Bun.

## Before Pushing Changes

Always lint and format before committing:

```bash
bun run check
```

This runs Biome to fix formatting and lint issues automatically.

## Build Commands

```bash
bun install              # Install dependencies
bun run dev              # Start dev server at localhost:3000
bun run build            # Production build to dist/
bun run preview          # Preview production build
bun run build:wasm       # Build WASM (from project root)
```

## Linting & Formatting

```bash
bun run lint             # Check for lint errors
bun run format           # Format all files
bun run check            # Lint + format with auto-fix
bun run ci               # CI mode (fails on any issue)
```

## Architecture

```
web/
├── src/
│   ├── main.ts          # Application entry point
│   ├── simulation.ts    # WASM wrapper for Flow Lenia
│   ├── renderer.ts      # Canvas rendering with color schemes
│   ├── interaction.ts   # Mouse/keyboard input handling
│   ├── presets.ts       # Preset save/load with localStorage
│   ├── ui.ts            # UI components and controls
│   ├── types.ts         # TypeScript type definitions
│   └── styles.css       # Application styles
├── build.ts             # Bun build script
├── dev-server.ts        # Development server with HMR
├── biome.json           # Linter/formatter config
└── index.html           # HTML entry point
```

## Key Patterns

- **WASM Integration**: The simulation runs via WebAssembly. The `SimulationManager` class wraps the WASM bindings with a TypeScript-friendly API.

- **State Management**: Presets are stored in localStorage. The `PresetManager` handles persistence and notifies subscribers of changes.

- **Canvas Rendering**: The `Renderer` class handles all canvas operations including color mapping, selection overlays, and ghost previews for drag-and-drop.

- **Interaction Modes**: Four modes (view, select, draw, erase) controlled by `InteractionHandler`. Each mode has different mouse behavior.

## Style Guide

Biome enforces:
- Tabs for indentation
- Double quotes for strings
- Semicolons required
- 100 character line width
- Imports organized automatically
