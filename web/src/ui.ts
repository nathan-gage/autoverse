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

// Detect if we're on a mobile device
function isMobileDevice(): boolean {
	return (
		window.matchMedia("(max-width: 900px)").matches ||
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0
	);
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
	private isMobile = false;
	private currentMobilePanel = 0;
	private swipeStartX = 0;
	private swipeCurrentX = 0;
	private isSwiping = false;
	private readonly MOBILE_PANELS = ["controls", "display", "presets", "patterns"];

	constructor(container: HTMLElement, callbacks: UICallbacks) {
		this.container = container;
		this.callbacks = callbacks;
		this.isMobile = isMobileDevice();
		this.buildUI();

		// Listen for resize to switch between mobile and desktop
		window.addEventListener("resize", () => {
			const wasMobile = this.isMobile;
			this.isMobile = isMobileDevice();
			if (wasMobile !== this.isMobile) {
				this.buildUI();
			}
		});
	}

	private buildUI(): void {
		if (this.isMobile) {
			this.buildMobileUI();
		} else {
			this.buildDesktopUI();
		}
	}

	private buildDesktopUI(): void {
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

	private buildMobileUI(): void {
		this.container.innerHTML = `
      <div class="viewer-layout mobile-layout">
        <main class="canvas-container">
          <canvas id="simulationCanvas" width="512" height="512"></canvas>
        </main>

        <div class="mobile-bottom-sheet">
          <div class="mobile-stats">
            <div class="mobile-stats-group">
              <span>Step: <strong id="stepCount">0</strong></span>
              <span>Mass: <strong id="totalMass">0.00</strong></span>
              <span>FPS: <strong id="fpsDisplay">0</strong></span>
            </div>
            <div class="mobile-backend-toggle">
              <span class="backend-label cpu active" id="cpuLabel">CPU</span>
              <label class="toggle-switch">
                <input type="checkbox" id="backendToggle" disabled>
                <span class="toggle-slider"></span>
              </label>
              <span class="backend-label gpu" id="gpuLabel">GPU</span>
            </div>
          </div>

          <div class="mobile-tabs">
            <button class="mobile-tab active" data-panel="0">Controls</button>
            <button class="mobile-tab" data-panel="1">Display</button>
            <button class="mobile-tab" data-panel="2">Presets</button>
            <button class="mobile-tab" data-panel="3">Patterns</button>
          </div>

          <div class="mobile-panels-container">
            <div class="mobile-panels-wrapper" id="mobilePanelsWrapper">
              <!-- Panel 0: Controls -->
              <div class="mobile-panel" data-panel="0">
                <div class="mobile-playback">
                  <button id="playBtn" class="btn btn-primary btn-icon" title="Play">
                    <span class="icon">▶</span>
                  </button>
                  <button id="pauseBtn" class="btn btn-icon" disabled title="Pause">
                    <span class="icon">⏸</span>
                  </button>
                  <button id="stepBtn" class="btn btn-icon" title="Step">
                    <span class="icon">⏭</span>
                  </button>
                  <button id="resetBtn" class="btn btn-icon" title="Reset">
                    <span class="icon">↺</span>
                  </button>
                  <div class="mobile-speed">
                    <button id="slowDownBtn" class="btn">−</button>
                    <strong id="speedValue">60</strong>
                    <button id="speedUpBtn" class="btn">+</button>
                  </div>
                </div>

                <div class="mobile-tools">
                  <button id="viewModeBtn" class="btn tool-btn active" title="View">
                    <span class="icon">👁</span>
                    View
                  </button>
                  <button id="selectModeBtn" class="btn tool-btn" title="Select">
                    <span class="icon">⬚</span>
                    Select
                  </button>
                  <button id="drawModeBtn" class="btn tool-btn" title="Draw">
                    <span class="icon">✎</span>
                    Draw
                  </button>
                  <button id="eraseModeBtn" class="btn tool-btn" title="Erase">
                    <span class="icon">⌫</span>
                    Erase
                  </button>
                </div>

                <div id="brushSettings" class="mobile-brush-settings hidden">
                  <div class="mobile-brush-row">
                    <label>Brush Size</label>
                    <input type="range" id="brushSizeSlider" min="1" max="20" value="3">
                    <span id="brushSizeValue">3</span>
                  </div>
                  <div class="mobile-brush-row">
                    <label>Intensity</label>
                    <input type="range" id="brushIntensitySlider" min="0" max="100" value="50">
                    <span id="brushIntensityValue">50</span>%
                  </div>
                </div>

                <div id="selectionInfo" class="mobile-selection-info">
                  <p class="muted">Use Select tool to capture regions</p>
                </div>
                <div id="saveSelectionForm" class="mobile-save-form hidden">
                  <input type="text" id="presetName" placeholder="Preset name..." maxlength="30">
                  <button id="savePresetBtn" class="btn btn-primary" disabled>Save</button>
                </div>
              </div>

              <!-- Panel 1: Display -->
              <div class="mobile-panel" data-panel="1">
                <div class="mobile-display-row">
                  <label>Color Scheme</label>
                  <select id="colorScheme">
                    <option value="grayscale">Grayscale</option>
                    <option value="thermal">Thermal</option>
                    <option value="viridis">Viridis</option>
                  </select>
                </div>
                <div class="mobile-display-row">
                  <label>
                    <input type="checkbox" id="showGrid"> Show Grid
                  </label>
                </div>
              </div>

              <!-- Panel 2: Presets -->
              <div class="mobile-panel" data-panel="2">
                <div class="mobile-preset-actions">
                  <button id="importPresetsBtn" class="btn btn-sm">Import</button>
                  <button id="exportPresetsBtn" class="btn btn-sm">Export</button>
                </div>
                <div id="presetLibrary" class="mobile-preset-grid">
                  <!-- Presets will be rendered here -->
                </div>
                <input type="file" id="importFileInput" accept=".json" hidden>
              </div>

              <!-- Panel 3: Built-in Patterns -->
              <div class="mobile-panel" data-panel="3">
                <div id="builtinPatterns" class="mobile-builtin-grid">
                  <!-- Built-in patterns will be rendered here -->
                </div>
              </div>
            </div>
          </div>

          <div class="mobile-swipe-indicator">
            <div class="swipe-dot active" data-panel="0"></div>
            <div class="swipe-dot" data-panel="1"></div>
            <div class="swipe-dot" data-panel="2"></div>
            <div class="swipe-dot" data-panel="3"></div>
          </div>
        </div>
      </div>
    `;

		this.setupMobileEventListeners();
		this.renderBuiltinPatterns();
	}

	private setupMobileEventListeners(): void {
		// Playback controls (same IDs as desktop)
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

		// Mobile tab navigation
		const tabs = this.container.querySelectorAll(".mobile-tab");
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const panelIndex = parseInt(tab.getAttribute("data-panel") || "0", 10);
				this.switchMobilePanel(panelIndex);
			});
		});

		// Swipe indicator dots
		const dots = this.container.querySelectorAll(".swipe-dot");
		dots.forEach((dot) => {
			dot.addEventListener("click", () => {
				const panelIndex = parseInt(dot.getAttribute("data-panel") || "0", 10);
				this.switchMobilePanel(panelIndex);
			});
		});

		// Panel swipe handling
		this.setupMobileSwipe();
	}

	private setupMobileSwipe(): void {
		const container = this.container.querySelector(".mobile-panels-container");
		const wrapper = this.get("mobilePanelsWrapper");

		if (!container || !wrapper) return;

		container.addEventListener(
			"touchstart",
			(e) => {
				const touch = (e as TouchEvent).touches[0];
				this.swipeStartX = touch.clientX;
				this.swipeCurrentX = touch.clientX;
				this.isSwiping = true;
				wrapper.classList.add("swiping");
			},
			{ passive: true },
		);

		container.addEventListener(
			"touchmove",
			(e) => {
				if (!this.isSwiping) return;

				const touch = (e as TouchEvent).touches[0];
				this.swipeCurrentX = touch.clientX;

				const diff = this.swipeCurrentX - this.swipeStartX;
				const baseOffset = -this.currentMobilePanel * 100;
				const swipeOffset = (diff / container.clientWidth) * 100;

				// Limit swipe at edges
				let offset = baseOffset + swipeOffset;
				const maxOffset = 0;
				const minOffset = -(this.MOBILE_PANELS.length - 1) * 100;
				offset = Math.max(minOffset - 10, Math.min(maxOffset + 10, offset));

				wrapper.style.transform = `translateX(${offset}%)`;
			},
			{ passive: true },
		);

		const endSwipe = () => {
			if (!this.isSwiping) return;
			this.isSwiping = false;
			wrapper.classList.remove("swiping");

			const diff = this.swipeCurrentX - this.swipeStartX;
			const threshold = container.clientWidth * 0.2; // 20% threshold

			if (Math.abs(diff) > threshold) {
				if (diff > 0 && this.currentMobilePanel > 0) {
					this.switchMobilePanel(this.currentMobilePanel - 1);
				} else if (diff < 0 && this.currentMobilePanel < this.MOBILE_PANELS.length - 1) {
					this.switchMobilePanel(this.currentMobilePanel + 1);
				} else {
					this.switchMobilePanel(this.currentMobilePanel); // Snap back
				}
			} else {
				this.switchMobilePanel(this.currentMobilePanel); // Snap back
			}
		};

		container.addEventListener("touchend", endSwipe, { passive: true });
		container.addEventListener("touchcancel", endSwipe, { passive: true });
	}

	private switchMobilePanel(index: number): void {
		this.currentMobilePanel = index;

		// Update tabs
		const tabs = this.container.querySelectorAll(".mobile-tab");
		tabs.forEach((tab, i) => {
			tab.classList.toggle("active", i === index);
		});

		// Update dots
		const dots = this.container.querySelectorAll(".swipe-dot");
		dots.forEach((dot, i) => {
			dot.classList.toggle("active", i === index);
		});

		// Update panel position
		const wrapper = document.getElementById("mobilePanelsWrapper");
		if (wrapper) {
			wrapper.style.transform = `translateX(-${index * 100}%)`;
		}
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
		const itemClass = this.isMobile ? "mobile-builtin-item" : "builtin-pattern";
		container.innerHTML = BUILTIN_PRESETS.map(
			(pattern) => `
      <div class="${itemClass}" data-name="${pattern.name}">
        <span class="pattern-name">${pattern.name}</span>
        <span class="pattern-desc">${pattern.description}</span>
      </div>
    `,
		).join("");

		container.querySelectorAll(`.${itemClass}`).forEach((el) => {
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
		// simTime not present in mobile layout
		const simTimeEl = document.getElementById("simTime");
		if (simTimeEl) {
			simTimeEl.textContent = time.toFixed(2);
		}
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

		if (this.isMobile) {
			// Mobile layout - grid of cards
			library.innerHTML = presets
				.map(
					(preset) => `
        <div class="mobile-preset-item" data-id="${escapeHtml(preset.id)}">
          <img src="${escapeHtml(preset.thumbnail)}" alt="${escapeHtml(preset.name)}">
          <span class="preset-name">${escapeHtml(preset.name)}</span>
          <span class="preset-size">${preset.region.width}x${preset.region.height}</span>
        </div>
      `,
				)
				.join("");

			// Set up event listeners for mobile
			library.querySelectorAll(".mobile-preset-item").forEach((el) => {
				const id = el.getAttribute("data-id")!;
				const preset = presets.find((p) => p.id === id)!;

				// Tap to place
				el.addEventListener("click", () => {
					this.callbacks.onPresetSelect(preset);
				});

				// Long press to delete (mobile alternative to hover delete button)
				let pressTimer: ReturnType<typeof setTimeout> | null = null;
				el.addEventListener("touchstart", () => {
					pressTimer = setTimeout(() => {
						if (confirm(`Delete preset "${preset.name}"?`)) {
							this.callbacks.onPresetDelete(id);
						}
					}, 500);
				});
				el.addEventListener("touchend", () => {
					if (pressTimer) {
						clearTimeout(pressTimer);
						pressTimer = null;
					}
				});
				el.addEventListener("touchmove", () => {
					if (pressTimer) {
						clearTimeout(pressTimer);
						pressTimer = null;
					}
				});
			});
		} else {
			// Desktop layout - list with drag and delete buttons
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

			// Set up event listeners for desktop
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
