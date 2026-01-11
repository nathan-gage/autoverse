// UI Components - Controls, panels, and preset library

import { BUILTIN_PRESETS } from "./presets";
import type { BackendType, InteractionMode, Preset, Seed, ViewerSettings } from "./types";

// Escape HTML to prevent XSS attacks from imported presets
function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export interface UICallbacks {
	onPlay: () => void;
	onPause: () => void;
	onStep: () => void;
	onReset: (seed?: Seed) => void;
	onSpeedChange: (stepsPerSecond: number) => void;
	onModeChange: (mode: InteractionMode) => void;
	onSettingsChange: (settings: Partial<ViewerSettings>) => void;
	onSaveSelection: (name: string) => void;
	onPresetSelect: (preset: Preset) => void;
	onPresetDelete: (id: string) => void;
	onPresetDragStart: (preset: Preset, event: DragEvent) => void;
	onExportPresets: () => void;
	onImportPresets: (json: string) => void;
	onBrushSizeChange: (size: number) => void;
	onBrushIntensityChange: (intensity: number) => void;
	onBackendChange: (backend: BackendType) => void;
}

export class UI {
	private container: HTMLElement;
	private callbacks: UICallbacks;
	private isPlaying = false;
	private stepsPerSecond = 60;
	private hasSelection = false;

	constructor(container: HTMLElement, callbacks: UICallbacks) {
		this.container = container;
		this.callbacks = callbacks;
		this.buildUI();
	}

	private buildUI(): void {
		this.container.innerHTML = `
      <div class="viewer-layout">
        <aside class="sidebar left-sidebar">
          <div class="panel">
            <h3>Playback</h3>
            <div class="button-group">
              <button id="playBtn" class="btn btn-primary" title="Play (Space)">
                <span class="icon">▶</span> Play
              </button>
              <button id="pauseBtn" class="btn" disabled title="Pause (Space)">
                <span class="icon">⏸</span> Pause
              </button>
            </div>
            <div class="button-group">
              <button id="stepBtn" class="btn" title="Step (.)">
                <span class="icon">⏭</span> Step
              </button>
              <button id="resetBtn" class="btn" title="Reset (R)">
                <span class="icon">↺</span> Reset
              </button>
            </div>
            <div class="speed-control">
              <label>Speed: <span id="speedValue">60</span> steps/sec</label>
              <div class="button-group">
                <button id="slowDownBtn" class="btn btn-sm">−</button>
                <button id="speedUpBtn" class="btn btn-sm">+</button>
              </div>
            </div>
          </div>

          <div class="panel">
            <h3>Tools</h3>
            <div class="tool-buttons">
              <button id="viewModeBtn" class="btn tool-btn active" title="View Mode (V)">
                <span class="icon">👁</span> View
              </button>
              <button id="selectModeBtn" class="btn tool-btn" title="Select Mode (S)">
                <span class="icon">⬚</span> Select
              </button>
              <button id="drawModeBtn" class="btn tool-btn" title="Draw Mode (D)">
                <span class="icon">✎</span> Draw
              </button>
              <button id="eraseModeBtn" class="btn tool-btn" title="Erase Mode (E)">
                <span class="icon">⌫</span> Erase
              </button>
            </div>
            <div id="brushSettings" class="brush-settings hidden">
              <label>Brush Size: <span id="brushSizeValue">3</span></label>
              <input type="range" id="brushSizeSlider" min="1" max="20" value="3">
              <label>Intensity: <span id="brushIntensityValue">50</span>%</label>
              <input type="range" id="brushIntensitySlider" min="0" max="100" value="50">
            </div>
          </div>

          <div class="panel">
            <h3>Display</h3>
            <div class="setting-row">
              <label>Color Scheme</label>
              <select id="colorScheme">
                <option value="grayscale">Grayscale</option>
                <option value="thermal">Thermal</option>
                <option value="viridis">Viridis</option>
              </select>
            </div>
            <div class="setting-row">
              <label>
                <input type="checkbox" id="showGrid"> Show Grid
              </label>
            </div>
          </div>
        </aside>

        <main class="canvas-container">
          <canvas id="simulationCanvas" width="512" height="512"></canvas>
          <div class="stats-bar">
            <span>Step: <strong id="stepCount">0</strong></span>
            <span>Time: <strong id="simTime">0.00</strong></span>
            <span>Mass: <strong id="totalMass">0.00</strong></span>
            <span>FPS: <strong id="fpsDisplay">0</strong></span>
            <div class="backend-toggle">
              <span class="backend-label cpu active" id="cpuLabel">CPU</span>
              <label class="toggle-switch">
                <input type="checkbox" id="backendToggle" disabled>
                <span class="toggle-slider"></span>
              </label>
              <span class="backend-label gpu" id="gpuLabel">GPU</span>
            </div>
          </div>
        </main>

        <aside class="sidebar right-sidebar">
          <div class="panel">
            <h3>Selection</h3>
            <div id="selectionInfo" class="selection-info">
              <p class="muted">Use Select tool to capture regions</p>
            </div>
            <div id="saveSelectionForm" class="save-form hidden">
              <input type="text" id="presetName" placeholder="Preset name..." maxlength="30">
              <button id="savePresetBtn" class="btn btn-primary" disabled>Save as Preset</button>
            </div>
          </div>

          <div class="panel">
            <h3>Presets</h3>
            <div class="preset-actions">
              <button id="importPresetsBtn" class="btn btn-sm">Import</button>
              <button id="exportPresetsBtn" class="btn btn-sm">Export</button>
            </div>
            <div id="presetLibrary" class="preset-library">
              <!-- Presets will be rendered here -->
            </div>
            <input type="file" id="importFileInput" accept=".json" hidden>
          </div>

          <div class="panel">
            <h3>Built-in Patterns</h3>
            <div id="builtinPatterns" class="builtin-patterns">
              <!-- Built-in patterns will be rendered here -->
            </div>
          </div>
        </aside>
      </div>
    `;

		this.setupEventListeners();
		this.renderBuiltinPatterns();
	}

	private setupEventListeners(): void {
		// Playback controls
		const playBtn = this.get<HTMLButtonElement>("playBtn");
		const pauseBtn = this.get<HTMLButtonElement>("pauseBtn");
		const stepBtn = this.get<HTMLButtonElement>("stepBtn");
		const resetBtn = this.get<HTMLButtonElement>("resetBtn");
		const speedUpBtn = this.get<HTMLButtonElement>("speedUpBtn");
		const slowDownBtn = this.get<HTMLButtonElement>("slowDownBtn");

		playBtn.addEventListener("click", () => {
			this.callbacks.onPlay();
			this.setPlaying(true);
		});

		pauseBtn.addEventListener("click", () => {
			this.callbacks.onPause();
			this.setPlaying(false);
		});

		stepBtn.addEventListener("click", () => this.callbacks.onStep());
		resetBtn.addEventListener("click", () => this.callbacks.onReset());

		speedUpBtn.addEventListener("click", () => {
			this.stepsPerSecond = Math.min(this.stepsPerSecond * 2, 480);
			this.updateSpeedDisplay();
			this.callbacks.onSpeedChange(this.stepsPerSecond);
		});

		slowDownBtn.addEventListener("click", () => {
			this.stepsPerSecond = Math.max(Math.floor(this.stepsPerSecond / 2), 15);
			this.updateSpeedDisplay();
			this.callbacks.onSpeedChange(this.stepsPerSecond);
		});

		// Tool modes
		const viewBtn = this.get<HTMLButtonElement>("viewModeBtn");
		const selectBtn = this.get<HTMLButtonElement>("selectModeBtn");
		const drawBtn = this.get<HTMLButtonElement>("drawModeBtn");
		const eraseBtn = this.get<HTMLButtonElement>("eraseModeBtn");

		viewBtn.addEventListener("click", () => this.setMode("view"));
		selectBtn.addEventListener("click", () => this.setMode("select"));
		drawBtn.addEventListener("click", () => this.setMode("draw"));
		eraseBtn.addEventListener("click", () => this.setMode("erase"));

		// Brush settings
		const brushSizeSlider = this.get<HTMLInputElement>("brushSizeSlider");
		const brushIntensitySlider = this.get<HTMLInputElement>("brushIntensitySlider");

		brushSizeSlider.addEventListener("input", () => {
			const size = parseInt(brushSizeSlider.value, 10);
			this.get("brushSizeValue").textContent = size.toString();
			this.callbacks.onBrushSizeChange(size);
		});

		brushIntensitySlider.addEventListener("input", () => {
			const intensity = parseInt(brushIntensitySlider.value, 10);
			this.get("brushIntensityValue").textContent = intensity.toString();
			this.callbacks.onBrushIntensityChange(intensity / 100);
		});

		// Display settings
		const colorScheme = this.get<HTMLSelectElement>("colorScheme");
		const showGrid = this.get<HTMLInputElement>("showGrid");

		colorScheme.addEventListener("change", () => {
			this.callbacks.onSettingsChange({
				colorScheme: colorScheme.value as ViewerSettings["colorScheme"],
			});
		});

		showGrid.addEventListener("change", () => {
			this.callbacks.onSettingsChange({ showGrid: showGrid.checked });
		});

		// Save preset
		const presetName = this.get<HTMLInputElement>("presetName");
		const savePresetBtn = this.get<HTMLButtonElement>("savePresetBtn");

		presetName.addEventListener("input", () => {
			savePresetBtn.disabled = !presetName.value.trim() || !this.hasSelection;
		});

		savePresetBtn.addEventListener("click", () => {
			const name = presetName.value.trim();
			if (name) {
				this.callbacks.onSaveSelection(name);
				presetName.value = "";
				savePresetBtn.disabled = true;
			}
		});

		// Import/Export
		const importBtn = this.get<HTMLButtonElement>("importPresetsBtn");
		const exportBtn = this.get<HTMLButtonElement>("exportPresetsBtn");
		const importInput = this.get<HTMLInputElement>("importFileInput");

		importBtn.addEventListener("click", () => importInput.click());

		importInput.addEventListener("change", () => {
			const file = importInput.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					this.callbacks.onImportPresets(reader.result as string);
				};
				reader.readAsText(file);
				importInput.value = "";
			}
		});

		exportBtn.addEventListener("click", () => this.callbacks.onExportPresets());

		// Backend toggle
		const backendToggle = this.get<HTMLInputElement>("backendToggle");
		backendToggle.addEventListener("change", () => {
			const backend = backendToggle.checked ? "gpu" : "cpu";
			this.callbacks.onBackendChange(backend);
		});

		// Keyboard shortcuts
		document.addEventListener("keydown", (e) => {
			// Ignore if typing in input
			if ((e.target as HTMLElement).tagName === "INPUT") return;

			if (e.key === " ") {
				e.preventDefault();
				if (this.isPlaying) {
					this.callbacks.onPause();
					this.setPlaying(false);
				} else {
					this.callbacks.onPlay();
					this.setPlaying(true);
				}
			} else if (e.key === ".") {
				this.callbacks.onStep();
			} else if (e.key === "r" || e.key === "R") {
				this.callbacks.onReset();
			}
		});
	}

	private renderBuiltinPatterns(): void {
		const container = this.get("builtinPatterns");
		container.innerHTML = BUILTIN_PRESETS.map(
			(pattern) => `
      <div class="builtin-pattern" data-name="${pattern.name}">
        <span class="pattern-name">${pattern.name}</span>
        <span class="pattern-desc">${pattern.description}</span>
      </div>
    `,
		).join("");

		container.querySelectorAll(".builtin-pattern").forEach((el) => {
			el.addEventListener("click", () => {
				const name = el.getAttribute("data-name")!;
				const pattern = BUILTIN_PRESETS.find((p) => p.name === name);
				if (pattern) {
					this.callbacks.onReset(pattern.seed as Seed);
				}
			});
		});
	}

	// Update UI display only, without triggering callback (used when syncing from InteractionHandler)
	updateModeDisplay(mode: InteractionMode): void {
		const buttons = {
			view: this.get("viewModeBtn"),
			select: this.get("selectModeBtn"),
			draw: this.get("drawModeBtn"),
			erase: this.get("eraseModeBtn"),
		};

		for (const [m, btn] of Object.entries(buttons)) {
			btn.classList.toggle("active", m === mode);
		}

		// Show/hide brush settings
		const brushSettings = this.get("brushSettings");
		brushSettings.classList.toggle("hidden", mode !== "draw" && mode !== "erase");
	}

	// Called by UI button clicks - updates display and notifies main
	setMode(mode: InteractionMode): void {
		this.updateModeDisplay(mode);
		this.callbacks.onModeChange(mode);
	}

	setPlaying(playing: boolean): void {
		this.isPlaying = playing;
		const playBtn = this.get<HTMLButtonElement>("playBtn");
		const pauseBtn = this.get<HTMLButtonElement>("pauseBtn");

		playBtn.disabled = playing;
		pauseBtn.disabled = !playing;
	}

	updateStats(step: number, time: number, mass: number, fps: number): void {
		this.get("stepCount").textContent = step.toString();
		this.get("simTime").textContent = time.toFixed(2);
		this.get("totalMass").textContent = mass.toFixed(2);
		this.get("fpsDisplay").textContent = fps.toString();
	}

	updateSelection(hasSelection: boolean, width?: number, height?: number): void {
		this.hasSelection = hasSelection;
		const info = this.get("selectionInfo");
		const form = this.get("saveSelectionForm");
		const saveBtn = this.get<HTMLButtonElement>("savePresetBtn");
		const nameInput = this.get<HTMLInputElement>("presetName");

		if (hasSelection && width && height) {
			info.innerHTML = `<p>Selection: <strong>${width} x ${height}</strong> cells</p>`;
			form.classList.remove("hidden");
			saveBtn.disabled = !nameInput.value.trim();
		} else {
			info.innerHTML = `<p class="muted">Use Select tool to capture regions</p>`;
			form.classList.add("hidden");
		}
	}

	renderPresets(presets: Preset[]): void {
		const library = this.get("presetLibrary");

		if (presets.length === 0) {
			library.innerHTML = '<p class="muted">No saved presets</p>';
			return;
		}

		library.innerHTML = presets
			.map(
				(preset) => `
      <div class="preset-item" data-id="${escapeHtml(preset.id)}" draggable="true">
        <img src="${escapeHtml(preset.thumbnail)}" alt="${escapeHtml(preset.name)}" class="preset-thumbnail">
        <div class="preset-info">
          <span class="preset-name">${escapeHtml(preset.name)}</span>
          <span class="preset-size">${preset.region.width}x${preset.region.height}</span>
        </div>
        <button class="btn btn-sm btn-danger delete-preset" title="Delete">×</button>
      </div>
    `,
			)
			.join("");

		// Set up event listeners
		library.querySelectorAll(".preset-item").forEach((el) => {
			const id = el.getAttribute("data-id")!;
			const preset = presets.find((p) => p.id === id)!;

			// Click to select/place
			el.addEventListener("click", (e) => {
				if (!(e.target as HTMLElement).classList.contains("delete-preset")) {
					this.callbacks.onPresetSelect(preset);
				}
			});

			// Drag to place
			el.addEventListener("dragstart", (e) => {
				this.callbacks.onPresetDragStart(preset, e as DragEvent);
			});

			// Delete button
			el.querySelector(".delete-preset")?.addEventListener("click", (e) => {
				e.stopPropagation();
				if (confirm(`Delete preset "${preset.name}"?`)) {
					this.callbacks.onPresetDelete(id);
				}
			});
		});
	}

	private updateSpeedDisplay(): void {
		this.get("speedValue").textContent = this.stepsPerSecond.toString();
	}

	private get<T extends HTMLElement = HTMLElement>(id: string): T {
		const el = document.getElementById(id);
		if (!el) throw new Error(`Element #${id} not found`);
		return el as T;
	}

	getCanvas(): HTMLCanvasElement {
		return this.get<HTMLCanvasElement>("simulationCanvas");
	}

	setGpuAvailable(available: boolean): void {
		const toggle = this.get<HTMLInputElement>("backendToggle");
		const gpuLabel = this.get("gpuLabel");

		toggle.disabled = !available;
		gpuLabel.classList.toggle("unavailable", !available);
		gpuLabel.title = available ? "GPU backend" : "GPU not available";
	}

	updateBackend(backend: BackendType): void {
		const toggle = this.get<HTMLInputElement>("backendToggle");
		const cpuLabel = this.get("cpuLabel");
		const gpuLabel = this.get("gpuLabel");

		toggle.checked = backend === "gpu";
		cpuLabel.classList.toggle("active", backend === "cpu");
		gpuLabel.classList.toggle("active", backend === "gpu");
	}

	updateBrushSize(size: number): void {
		const slider = this.get<HTMLInputElement>("brushSizeSlider");
		const label = this.get("brushSizeValue");
		slider.value = size.toString();
		label.textContent = size.toString();
	}
}
