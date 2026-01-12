# Web Viewer - Claude Code Instructions

This is the interactive web viewer for Flow Lenia, built with **Svelte 5**, TypeScript, and Bun.

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

The web viewer uses **Svelte 5** with reactive stores for state management.

```
web/
├── src/
│   ├── main.ts                    # Svelte mount point
│   ├── App.svelte                 # Root application component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.svelte      # Top navigation bar
│   │   │   ├── Footer.svelte      # Status bar and debug console
│   │   │   ├── LeftSidebar.svelte # Simulation controls
│   │   │   └── RightSidebar.svelte# Settings and presets
│   │   ├── canvas/
│   │   │   └── SimulationView.svelte  # Canvas rendering wrapper
│   │   └── ui/
│   │       ├── TUIBox.svelte      # Terminal-style container
│   │       ├── Slider.svelte      # Custom slider control
│   │       ├── LEDDisplay.svelte  # Numeric LED-style display
│   │       └── GlitchText.svelte  # Glitch text effect
│   ├── stores/
│   │   ├── simulation.ts          # Simulation state and WASM control
│   │   ├── settings.ts            # UI preferences (mode, brush, zoom)
│   │   ├── themes.ts              # Color scheme management
│   │   ├── interaction.ts         # Canvas/interaction state
│   │   └── presets.ts             # Preset persistence
│   ├── styles/
│   │   └── global.css             # Global styles and CSS variables
│   ├── simulation.ts              # WASM wrapper for Flow Lenia
│   ├── renderer.ts                # Canvas rendering with color schemes
│   ├── interaction.ts             # Mouse/keyboard input handling
│   ├── presets.ts                 # Preset save/load with localStorage
│   └── types.ts                   # TypeScript type definitions
├── build.ts                       # Bun build script
├── dev-server.ts                  # Development server with HMR
├── biome.json                     # Linter/formatter config
└── index.html                     # HTML entry point
```

## Key Patterns

### Svelte 5 Reactive Stores

State is managed via Svelte stores in `stores/`. Components subscribe to stores using `$storeName` syntax:

- **`simulationStore`**: Core simulation state (playing, step, mass, fps, backend)
- **`settings`**: UI preferences (interaction mode, brush size, visualization options)
- **`currentScheme`**: Active color theme with CSS variable integration
- **`simulationCanvas`**: Reference to the canvas element for glow effects

### WASM Integration

The `SimulationManager` class (`simulation.ts`) wraps the WASM bindings. The `simulationStore` provides reactive access:

```typescript
import { simulationStore, play, pause, step } from "./stores/simulation";
// Subscribe with $simulationStore in .svelte files
```

### Component Architecture

- **Layout components** (`Header`, `Footer`, `LeftSidebar`, `RightSidebar`) define the app structure
- **UI components** (`TUIBox`, `Slider`, `LEDDisplay`) are reusable building blocks
- **Canvas component** (`SimulationView`) manages the WebGL/Canvas rendering

### Theming System

Color schemes are defined in `stores/themes.ts` and applied via CSS custom properties:

```typescript
import { setScheme, nextScheme } from "./stores/themes";
setScheme("neon-tokyo"); // Apply a theme
```

Themes automatically update `--color-primary`, `--color-secondary`, etc.

### Interaction Modes

Four modes controlled via `settings.mode`: `view`, `select`, `draw`, `erase`. The `InteractionHandler` class responds to each mode differently.

## Style Guide

Biome enforces:
- Tabs for indentation
- Double quotes for strings
- Semicolons required
- 100 character line width
- Imports organized automatically

### Svelte Guidelines

- Use `$:` reactive statements for derived values
- Prefer stores over component props for shared state
- Keep component logic minimal; complex logic goes in stores or utility modules
