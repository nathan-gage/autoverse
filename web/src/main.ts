// Flow Lenia Interactive Web Viewer - Main Entry Point

import { EvolutionManager } from "./evolution";
import { EvolutionPanel } from "./evolution-panel";
import { InteractionHandler } from "./interaction";
import { PresetManager } from "./presets";
import { Renderer } from "./renderer";
import { SimulationManager } from "./simulation";
import type {
	BackendType,
	BestCandidateState,
	EvolutionConfig,
	InteractionMode,
	Preset,
	Seed,
	SimulationConfig,
	ViewerSettings,
} from "./types";
import { UI } from "./ui";

// Default configuration
const DEFAULT_CONFIG: SimulationConfig = {
	width: 128,
	height: 128,
	channels: 1,
	dt: 0.05,
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
		beta_a: 2.0,
		n: 4.0,
		distribution_size: 0.5,
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
	private evolutionManager: EvolutionManager;
	private evolutionPanel!: EvolutionPanel;
	private ui!: UI;

	private settings: ViewerSettings = {
		colorScheme: "grayscale",
		showGrid: false,
		showSelection: true,
		brushSize: 3,
		brushIntensity: 0.5,
		backend: "cpu",
	};

	private isPlaying = false;
	private stepsPerSecond = 60;
	private animationFrameId: number | null = null;
	private frameCount = 0;
	private fpsUpdateTime = 0;
	private currentFps = 0;
	private lastFrameTime = 0;
	private stepAccumulator = 0;
	private lastEvolutionState: BestCandidateState | null = null;

	constructor() {
		this.simulation = new SimulationManager(DEFAULT_CONFIG, DEFAULT_SEED);
		this.presetManager = new PresetManager();
		this.evolutionManager = new EvolutionManager(DEFAULT_CONFIG);
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
					this.stepsPerSecond = speed;
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
				onBackendChange: (backend) => this.switchBackend(backend),
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
					// Re-render to show selection rectangle
					this.render();
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
				onModeChange: (mode) => {
					// Sync UI buttons when mode changes via keyboard shortcuts
					// Use updateModeDisplay to avoid triggering callback loop
					this.ui.updateModeDisplay(mode);
				},
				onBrushSizeChange: (size) => {
					// Sync UI slider when brush size changes via keyboard shortcuts
					this.settings.brushSize = size;
					this.ui.updateBrushSize(size);
				},
			});

			// Subscribe to preset changes
			this.presetManager.subscribe((presets) => {
				this.ui.renderPresets(presets);
			});

			// Set up backend toggle based on GPU availability
			this.ui.setGpuAvailable(this.simulation.isGpuAvailable());
			this.ui.updateBackend(this.simulation.getBackend());
			this.settings.backend = this.simulation.getBackend();

			// Initialize evolution manager and panel
			await this.evolutionManager.initialize();
			const evolutionContainer = document.getElementById("evolutionPanelContainer");
			if (evolutionContainer) {
				this.evolutionPanel = new EvolutionPanel(
					evolutionContainer,
					{
						onStart: (config) => this.startEvolution(config),
						onCancel: () => this.cancelEvolution(),
						onLoadBest: () => this.loadBestCandidate(),
					},
					this.evolutionManager,
					DEFAULT_CONFIG,
				);

				// Subscribe to evolution state updates for loading
				this.evolutionManager.subscribe((event) => {
					if (event.type === "stateUpdate" && event.state) {
						this.lastEvolutionState = event.state;
					}
				});
			}

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
		const now = performance.now();
		this.fpsUpdateTime = now;
		this.lastFrameTime = now;
		this.stepAccumulator = 0;
		this.frameCount = 0;
		this.animate(now);
	}

	private pause(): void {
		this.isPlaying = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private async step(): Promise<void> {
		await this.simulation.step();
		this.render();
		this.updateStats();
	}

	private reset(seed?: Seed): void {
		this.simulation.reset(seed);
		this.render();
		this.updateStats();
	}

	private async animate(currentTime: number): Promise<void> {
		if (!this.isPlaying) return;

		// Calculate time-based steps
		const deltaTime = (currentTime - this.lastFrameTime) / 1000; // in seconds
		this.lastFrameTime = currentTime;

		// Accumulate fractional steps and run integer steps
		this.stepAccumulator += this.stepsPerSecond * deltaTime;
		const stepsToRun = Math.floor(this.stepAccumulator);
		this.stepAccumulator -= stepsToRun;

		if (stepsToRun > 0) {
			await this.simulation.run(stepsToRun);
			this.render();
			this.updateStats();
		}

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

	private async switchBackend(backend: BackendType): Promise<void> {
		const success = await this.simulation.switchBackend(backend);
		if (success) {
			this.settings.backend = backend;
			this.ui.updateBackend(backend);
			console.log(`Switched to ${backend.toUpperCase()} backend`);
		} else {
			// Revert toggle if switch failed
			this.ui.updateBackend(this.simulation.getBackend());
			console.warn(`Failed to switch to ${backend} backend`);
		}
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

	// Evolution methods
	private async startEvolution(config: EvolutionConfig): Promise<void> {
		// Pause main simulation while evolution runs
		if (this.isPlaying) {
			this.pause();
			this.ui.setPlaying(false);
		}

		try {
			await this.evolutionManager.start(config);
		} catch (error) {
			console.error("Failed to start evolution:", error);
		}
	}

	private cancelEvolution(): void {
		this.evolutionManager.cancel();
	}

	private loadBestCandidate(): void {
		if (!this.lastEvolutionState) {
			console.warn("No evolution state to load");
			return;
		}

		const { width, height, data } = this.lastEvolutionState;

		// Convert the evolution state to a Custom seed pattern
		const values: Array<[number, number, number, number]> = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = y * width + x;
				const value = data[idx];
				if (value > 0.001) {
					values.push([x, y, 0, value]);
				}
			}
		}

		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				values,
			},
		};

		// Reset simulation with the evolved pattern
		this.simulation.reset(customSeed);
		this.render();
		this.updateStats();

		console.log("Loaded best evolved candidate into simulation");
	}
}

// Start the application
const viewer = new FlowLeniaViewer();
viewer.initialize().catch(console.error);
