// Flow Lenia Interactive Web Viewer - Main Entry Point

import { InteractionHandler } from "./interaction";
import { PresetManager } from "./presets";
import { Renderer } from "./renderer";
import { SimulationManager } from "./simulation";
import type { InteractionMode, Preset, Seed, SimulationConfig, ViewerSettings } from "./types";
import { UI } from "./ui";

// Default configuration
const DEFAULT_CONFIG: SimulationConfig = {
	width: 128,
	height: 128,
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
			target_channel: 0,
		},
	],
	flow: {
		beta_a: 1.0,
		n: 2.0,
		distribution_size: 1.0,
	},
};

const DEFAULT_SEED: Seed = {
	pattern: {
		type: "GaussianBlob",
		center: [0.5, 0.5],
		radius: 0.1,
		amplitude: 1.0,
		channel: 0,
	},
};

class FlowLeniaViewer {
	private simulation: SimulationManager;
	private renderer!: Renderer;
	private interaction!: InteractionHandler;
	private presetManager: PresetManager;
	private ui!: UI;

	private settings: ViewerSettings = {
		colorScheme: "grayscale",
		showGrid: false,
		showSelection: true,
		brushSize: 3,
		brushIntensity: 0.5,
	};

	private isPlaying = false;
	private stepsPerFrame = 1;
	private animationFrameId: number | null = null;
	private frameCount = 0;
	private fpsUpdateTime = 0;
	private currentFps = 0;

	constructor() {
		this.simulation = new SimulationManager(DEFAULT_CONFIG, DEFAULT_SEED);
		this.presetManager = new PresetManager();
	}

	async initialize(): Promise<void> {
		const container = document.getElementById("app");
		if (!container) throw new Error("App container not found");

		// Show loading state
		container.innerHTML = '<div class="loading">Loading WebAssembly module...</div>';

		try {
			// Initialize WASM
			await this.simulation.initialize();

			// Build UI
			this.ui = new UI(container, {
				onPlay: () => this.play(),
				onPause: () => this.pause(),
				onStep: () => this.step(),
				onReset: (seed) => this.reset(seed),
				onSpeedChange: (speed) => {
					this.stepsPerFrame = speed;
				},
				onModeChange: (mode) => this.setMode(mode),
				onSettingsChange: (settings) => this.updateSettings(settings),
				onSaveSelection: (name) => this.saveSelection(name),
				onPresetSelect: (preset) => this.selectPreset(preset),
				onPresetDelete: (id) => this.deletePreset(id),
				onPresetDragStart: (preset, event) => this.startPresetDrag(preset, event),
				onExportPresets: () => this.exportPresets(),
				onImportPresets: (json) => this.importPresets(json),
				onBrushSizeChange: (size) => {
					this.settings.brushSize = size;
					this.interaction.setBrushSize(size);
				},
				onBrushIntensityChange: (intensity) => {
					this.settings.brushIntensity = intensity;
					this.interaction.setBrushIntensity(intensity);
				},
			});

			// Initialize renderer
			const canvas = this.ui.getCanvas();
			this.renderer = new Renderer(canvas, this.settings);

			// Initialize interaction handler
			this.interaction = new InteractionHandler(canvas, this.simulation, this.renderer, {
				onSelectionChange: (selection) => {
					if (selection) {
						const width = Math.abs(selection.endX - selection.startX);
						const height = Math.abs(selection.endY - selection.startY);
						this.ui.updateSelection(width > 0 && height > 0, width, height);
					} else {
						this.ui.updateSelection(false);
					}
				},
				onSelectionComplete: (_selection) => {
					// Selection is complete, user can now save it
				},
				onDrop: (preset, x, y) => {
					this.simulation.placeRegion(preset.region, x, y);
					this.render();
				},
				onDraw: (x, y) => {
					this.simulation.drawAt(x, y, this.settings.brushSize, this.settings.brushIntensity);
					this.render();
				},
				onErase: (x, y) => {
					this.simulation.eraseAt(x, y, this.settings.brushSize);
					this.render();
				},
			});

			// Subscribe to preset changes
			this.presetManager.subscribe((presets) => {
				this.ui.renderPresets(presets);
			});

			// Initial render
			this.ui.renderPresets(this.presetManager.getAllPresets());
			this.render();
			this.updateStats();

			console.log("Flow Lenia Viewer initialized successfully");
		} catch (error) {
			container.innerHTML = `
        <div class="error">
          <h2>Initialization Error</h2>
          <p>${error}</p>
          <p>Make sure WASM is built: <code>wasm-pack build --target web --release</code></p>
        </div>
      `;
			throw error;
		}
	}

	private play(): void {
		if (this.isPlaying) return;
		this.isPlaying = true;
		this.fpsUpdateTime = performance.now();
		this.frameCount = 0;
		this.animate(this.fpsUpdateTime);
	}

	private pause(): void {
		this.isPlaying = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private step(): void {
		this.simulation.step();
		this.render();
		this.updateStats();
	}

	private reset(seed?: Seed): void {
		this.simulation.reset(seed);
		this.render();
		this.updateStats();
	}

	private animate(currentTime: number): void {
		if (!this.isPlaying) return;

		this.simulation.run(this.stepsPerFrame);
		this.render();
		this.updateStats();

		// FPS calculation
		this.frameCount++;
		if (currentTime - this.fpsUpdateTime >= 1000) {
			this.currentFps = this.frameCount;
			this.frameCount = 0;
			this.fpsUpdateTime = currentTime;
		}

		this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
	}

	private render(): void {
		const state = this.simulation.getState();
		const selection = this.interaction.getSelection();
		const ghostPreview = this.interaction.getGhostPreview();
		this.renderer.render(state, selection, ghostPreview);
	}

	private updateStats(): void {
		this.ui.updateStats(
			this.simulation.getStep(),
			this.simulation.getTime(),
			this.simulation.totalMass(),
			this.currentFps,
		);
	}

	private setMode(mode: InteractionMode): void {
		this.interaction.setMode(mode);
		if (mode !== "select") {
			this.interaction.clearSelection();
			this.ui.updateSelection(false);
		}
	}

	private updateSettings(settings: Partial<ViewerSettings>): void {
		this.settings = { ...this.settings, ...settings };
		this.renderer.updateSettings(settings);
		this.render();
	}

	private saveSelection(name: string): void {
		const selection = this.interaction.getSelection();
		if (!selection) return;

		const x = Math.min(selection.startX, selection.endX);
		const y = Math.min(selection.startY, selection.endY);
		const width = Math.abs(selection.endX - selection.startX);
		const height = Math.abs(selection.endY - selection.startY);

		if (width <= 0 || height <= 0) return;

		const region = this.simulation.extractRegion(x, y, width, height);
		this.presetManager.savePreset(name, region);

		// Clear selection after saving
		this.interaction.clearSelection();
		this.ui.updateSelection(false);
	}

	private selectPreset(preset: Preset): void {
		// Place preset at center of simulation
		const centerX = Math.floor((this.simulation.getWidth() - preset.region.width) / 2);
		const centerY = Math.floor((this.simulation.getHeight() - preset.region.height) / 2);
		this.simulation.placeRegion(preset.region, centerX, centerY);
		this.render();
	}

	private deletePreset(id: string): void {
		this.presetManager.deletePreset(id);
	}

	private startPresetDrag(preset: Preset, event: DragEvent): void {
		event.dataTransfer!.effectAllowed = "copy";
		event.dataTransfer!.setData("text/plain", preset.id);
		this.interaction.startDragFromLibrary(preset, event);
	}

	private exportPresets(): void {
		const json = this.presetManager.exportPresets();
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "flow-lenia-presets.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	private importPresets(json: string): void {
		try {
			const count = this.presetManager.importPresets(json);
			alert(`Imported ${count} preset(s)`);
		} catch (error) {
			alert(`Failed to import presets: ${error}`);
		}
	}
}

// Start the application
const viewer = new FlowLeniaViewer();
viewer.initialize().catch(console.error);
