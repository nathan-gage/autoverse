# Using WasmEvolutionEngine in a Web Worker

This example demonstrates how to run evolutionary pattern search in a Web Worker for non-blocking UI updates.

## Overview

The `WasmEvolutionEngine` provides step-by-step execution that yields control after each generation, making it suitable for cooperative scheduling in a Web Worker context.

## Files

### `evolution-worker.js`

```javascript
// Web Worker for running evolution in the background
import init, { WasmEvolutionEngine } from './pkg/flow_lenia.js';

let engine = null;
let running = false;

self.onmessage = async function(e) {
  const { type, config } = e.data;

  switch (type) {
    case 'init':
      await init();
      self.postMessage({ type: 'ready' });
      break;

    case 'start':
      if (engine) {
        engine.free();
      }
      engine = WasmEvolutionEngine.new(JSON.stringify(config));
      running = true;
      runEvolution();
      break;

    case 'cancel':
      if (engine) {
        engine.cancel();
        running = false;
      }
      break;

    case 'get_state':
      if (engine) {
        const state = engine.get_best_candidate_state();
        self.postMessage({ type: 'state', state });
      }
      break;
  }
};

async function runEvolution() {
  while (running && engine && !engine.is_complete()) {
    // Perform one evolution step
    const progressJson = engine.step();
    const progress = JSON.parse(progressJson);

    // Send progress update to main thread
    self.postMessage({ type: 'progress', progress });

    // Yield to allow message processing
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  if (engine && engine.is_complete()) {
    const resultJson = engine.get_result();
    const result = JSON.parse(resultJson);
    self.postMessage({ type: 'complete', result });
  }

  running = false;
}
```

### `main.js`

```javascript
// Main thread code
const worker = new Worker('./evolution-worker.js', { type: 'module' });

// Configuration for evolution
const evolutionConfig = {
  simulation: {
    width: 64,
    height: 64,
    channels: 1,
    dt: 0.1,
    kernels: [{
      radius: 10,
      mu: 0.15,
      sigma: 0.016,
      source_channel: 0,
      target_channel: 0
    }],
    flow_alpha: 1.0,
    reintegration_strength: 1.0
  },
  seed_pattern_type: "Blob",
  genome_constraints: {
    radius: { min: 0.05, max: 0.2 },
    amplitude: { min: 0.5, max: 2.0 }
  },
  fitness: {
    metrics: [
      { metric: "Persistence", weight: 1.0 },
      { metric: "Locomotion", weight: 0.5 },
      { metric: "Compactness", weight: 0.3 }
    ],
    evaluation_steps: 200,
    aggregation: "WeightedSum"
  },
  algorithm: {
    type: "GeneticAlgorithm",
    config: {
      population_size: 20,
      mutation_rate: 0.1,
      crossover_rate: 0.7,
      elitism: 2,
      selection_method: "Tournament",
      tournament_size: 3
    }
  },
  max_generations: 100,
  target_fitness: 0.9,
  stagnation_limit: 20
};

// Progress display element
const progressEl = document.getElementById('progress');
const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext('2d');

// Handle messages from worker
worker.onmessage = function(e) {
  const { type, progress, result, state } = e.data;

  switch (type) {
    case 'ready':
      console.log('Worker ready');
      break;

    case 'progress':
      updateProgressUI(progress);
      // Request current best state for visualization
      worker.postMessage({ type: 'get_state' });
      break;

    case 'state':
      if (state) {
        renderState(state);
      }
      break;

    case 'complete':
      handleComplete(result);
      break;
  }
};

function updateProgressUI(progress) {
  progressEl.innerHTML = `
    <div>Generation: ${progress.generation} / ${evolutionConfig.max_generations}</div>
    <div>Best Fitness: ${progress.best_fitness.toFixed(4)}</div>
    <div>Mean Fitness: ${progress.mean_fitness.toFixed(4)}</div>
    <div>Phase: ${progress.phase}</div>
  `;
}

function renderState(state) {
  const { width, height, data } = state;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < data.length; i++) {
    const value = Math.floor(Math.min(1, Math.max(0, data[i])) * 255);
    imageData.data[i * 4] = value;     // R
    imageData.data[i * 4 + 1] = value; // G
    imageData.data[i * 4 + 2] = value; // B
    imageData.data[i * 4 + 3] = 255;   // A
  }

  ctx.putImageData(imageData, 0, 0);
}

function handleComplete(result) {
  console.log('Evolution complete!', result);
  progressEl.innerHTML += `
    <div>Evolution Complete!</div>
    <div>Final Fitness: ${result.best_fitness.toFixed(4)}</div>
    <div>Generations: ${result.generations}</div>
    <div>Stop Reason: ${result.stop_reason}</div>
  `;
}

// Initialize and start
worker.postMessage({ type: 'init' });
document.getElementById('start').onclick = () => {
  worker.postMessage({ type: 'start', config: evolutionConfig });
};
document.getElementById('cancel').onclick = () => {
  worker.postMessage({ type: 'cancel' });
};
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flow Lenia Evolution</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    #progress { margin: 20px 0; padding: 10px; background: #f0f0f0; }
    canvas { border: 1px solid #ccc; image-rendering: pixelated; }
    button { margin-right: 10px; padding: 8px 16px; }
  </style>
</head>
<body>
  <h1>Flow Lenia Evolutionary Search</h1>

  <div>
    <button id="start">Start Evolution</button>
    <button id="cancel">Cancel</button>
  </div>

  <div id="progress">Click Start to begin evolution...</div>

  <canvas id="canvas" width="64" height="64" style="width: 256px; height: 256px;"></canvas>

  <script type="module" src="main.js"></script>
</body>
</html>
```

## Building

1. Build the WASM package:
   ```bash
   wasm-pack build --target web --release
   ```

2. Serve the files with a local HTTP server (required for ES modules):
   ```bash
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser.

## API Reference

### `WasmEvolutionEngine`

#### Constructor
- `new(config_json: string)`: Create a new evolution engine from JSON configuration.

#### Methods
- `step()`: Perform one evolution step. Returns JSON-serialized `EvolutionProgress`.
- `is_complete()`: Returns `true` if evolution should stop (target reached, max generations, or cancelled).
- `get_result()`: Returns JSON-serialized `EvolutionResult` with final statistics.
- `cancel()`: Request cancellation of the evolution.
- `get_best_candidate_state()`: Returns the grid state of the best candidate for visualization. Returns `{ width, height, data: Float32Array }`.

### Progress Object

```typescript
interface EvolutionProgress {
  generation: number;
  best_fitness: number;
  mean_fitness: number;
  phase: string;  // "Initializing" | "Evaluating" | "Selecting" | "Complete"
  evaluations: number;
  time_elapsed_secs: number;
}
```

### Result Object

```typescript
interface EvolutionResult {
  best_genome: Genome;
  best_fitness: number;
  generations: number;
  total_evaluations: number;
  time_elapsed_secs: number;
  stop_reason: string;  // "TargetReached" | "MaxGenerations" | "Stagnation" | "Cancelled"
  history: EvolutionHistory;
}
```

## Notes

- Evolution is single-threaded in WASM (no parallel candidate evaluation).
- Each `step()` call evaluates all candidates in the current generation and advances to the next.
- Use `get_best_candidate_state()` periodically to visualize the current best pattern.
- Cancel with `cancel()` and check `is_complete()` to stop gracefully.
