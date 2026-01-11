// Evolution Panel UI Component

import type { EvolutionManager } from "./evolution";
import type {
	BestCandidateState,
	EvolutionConfig,
	EvolutionProgress,
	EvolutionResult,
	SimulationConfig,
} from "./types";

export interface EvolutionPanelCallbacks {
	onStart: (config: EvolutionConfig) => void;
	onCancel: () => void;
	onLoadBest: () => void;
}

export class EvolutionPanel {
	private container: HTMLElement;
	private callbacks: EvolutionPanelCallbacks;
	private evolutionManager: EvolutionManager;
	private previewCanvas: HTMLCanvasElement | null = null;
	private previewCtx: CanvasRenderingContext2D | null = null;
	private isRunning = false;
	private baseConfig: SimulationConfig;

	constructor(
		container: HTMLElement,
		callbacks: EvolutionPanelCallbacks,
		evolutionManager: EvolutionManager,
		baseConfig: SimulationConfig,
	) {
		this.container = container;
		this.callbacks = callbacks;
		this.evolutionManager = evolutionManager;
		this.baseConfig = baseConfig;
		this.buildPanel();
		this.setupEventListeners();
	}

	private buildPanel(): void {
		this.container.innerHTML = `
			<div class="panel evolution-panel">
				<h3>Evolution</h3>

				<div id="evolutionPreview" class="evolution-preview">
					<canvas id="evolutionCanvas" width="64" height="64"></canvas>
					<div class="preview-label">Best Candidate</div>
				</div>

				<div id="evolutionStatus" class="evolution-status">
					<p class="muted">Configure and start evolution</p>
				</div>

				<div id="evolutionProgress" class="evolution-progress hidden">
					<div class="progress-row">
						<span>Generation:</span>
						<strong id="evoGeneration">0</strong> / <span id="evoMaxGen">50</span>
					</div>
					<div class="progress-row">
						<span>Best Fitness:</span>
						<strong id="evoBestFitness">0.000</strong>
					</div>
					<div class="progress-row">
						<span>Mean Fitness:</span>
						<span id="evoMeanFitness">0.000</span>
					</div>
					<div class="progress-bar-container">
						<div id="evoProgressBar" class="progress-bar" style="width: 0%"></div>
					</div>
				</div>

				<div class="evolution-controls">
					<button id="evoStartBtn" class="btn btn-primary">
						<span class="icon">&#9654;</span> Start Evolution
					</button>
					<button id="evoCancelBtn" class="btn btn-danger hidden">
						<span class="icon">&#9632;</span> Stop
					</button>
					<button id="evoLoadBtn" class="btn btn-success hidden">
						<span class="icon">&#10003;</span> Load Best
					</button>
				</div>

				<details class="evolution-settings">
					<summary>Settings</summary>

					<div class="setting-group">
						<label>Population Size</label>
						<input type="number" id="evoPopSize" value="20" min="4" max="100" step="2">
					</div>

					<div class="setting-group">
						<label>Max Generations</label>
						<input type="number" id="evoMaxGens" value="50" min="5" max="500" step="5">
					</div>

					<div class="setting-group">
						<label>Target Fitness</label>
						<input type="number" id="evoTargetFitness" value="0.95" min="0.1" max="1.0" step="0.05">
					</div>

					<div class="setting-group">
						<label>Mutation Rate</label>
						<input type="range" id="evoMutationRate" value="15" min="1" max="50">
						<span id="evoMutationValue">15%</span>
					</div>

					<div class="setting-group">
						<label>Eval Steps</label>
						<input type="number" id="evoEvalSteps" value="200" min="50" max="1000" step="50">
					</div>

					<div class="setting-group">
						<label>Fitness Goal</label>
						<select id="evoFitnessGoal">
							<option value="survival">Survival (persistence + compactness)</option>
							<option value="glider">Glider (movement + survival)</option>
							<option value="oscillator">Oscillator (periodic patterns)</option>
							<option value="complex">Complexity (interesting structures)</option>
						</select>
					</div>
				</details>
			</div>
		`;
	}

	private setupEventListeners(): void {
		const startBtn = this.get<HTMLButtonElement>("evoStartBtn");
		const cancelBtn = this.get<HTMLButtonElement>("evoCancelBtn");
		const loadBtn = this.get<HTMLButtonElement>("evoLoadBtn");
		const mutationSlider = this.get<HTMLInputElement>("evoMutationRate");

		startBtn.addEventListener("click", () => this.handleStart());
		cancelBtn.addEventListener("click", () => this.handleCancel());
		loadBtn.addEventListener("click", () => this.callbacks.onLoadBest());

		mutationSlider.addEventListener("input", () => {
			this.get("evoMutationValue").textContent = `${mutationSlider.value}%`;
		});

		// Set up preview canvas
		this.previewCanvas = this.get<HTMLCanvasElement>("evolutionCanvas");
		this.previewCtx = this.previewCanvas.getContext("2d");

		// Subscribe to evolution events
		this.evolutionManager.subscribe((event) => {
			switch (event.type) {
				case "progress":
					if (event.progress) this.updateProgress(event.progress);
					break;
				case "stateUpdate":
					if (event.state) this.renderPreview(event.state);
					break;
				case "complete":
					if (event.result) this.handleComplete(event.result);
					break;
				case "error":
					this.handleError(event.error || "Unknown error");
					break;
			}
		});
	}

	private handleStart(): void {
		const config = this.buildConfig();
		this.setRunning(true);
		this.callbacks.onStart(config);
	}

	private handleCancel(): void {
		this.callbacks.onCancel();
		this.setRunning(false);
	}

	private buildConfig(): EvolutionConfig {
		const popSize = parseInt(this.get<HTMLInputElement>("evoPopSize").value, 10);
		const maxGens = parseInt(this.get<HTMLInputElement>("evoMaxGens").value, 10);
		const targetFitness = parseFloat(this.get<HTMLInputElement>("evoTargetFitness").value);
		const mutationRate = parseInt(this.get<HTMLInputElement>("evoMutationRate").value, 10) / 100;
		const evalSteps = parseInt(this.get<HTMLInputElement>("evoEvalSteps").value, 10);
		const fitnessGoal = this.get<HTMLSelectElement>("evoFitnessGoal").value;

		// Update max gen display
		this.get("evoMaxGen").textContent = maxGens.toString();

		const metrics = this.getFitnessMetrics(fitnessGoal);

		return {
			base_config: this.baseConfig,
			seed_pattern_type: "Blob",
			constraints: {
				radius: { min: 0.05, max: 0.25 },
				amplitude: { min: 0.5, max: 2.0 },
				x: { min: 0.3, max: 0.7 },
				y: { min: 0.3, max: 0.7 },
			},
			fitness: {
				metrics,
				aggregation: "WeightedSum",
			},
			evaluation: {
				steps: evalSteps,
				sample_interval: Math.max(1, Math.floor(evalSteps / 20)),
				warmup_steps: Math.floor(evalSteps / 10),
			},
			population: {
				size: popSize,
				elitism: Math.max(1, Math.floor(popSize / 10)),
			},
			algorithm: {
				type: "GeneticAlgorithm",
				config: {
					mutation_rate: mutationRate,
					crossover_rate: 0.7,
					selection_method: "Tournament",
					tournament_size: 3,
				},
			},
			archive: {
				enabled: true,
				max_size: 50,
				diversity_threshold: 0.1,
			},
			max_generations: maxGens,
			target_fitness: targetFitness,
			stagnation_limit: Math.max(5, Math.floor(maxGens / 3)),
		};
	}

	private getFitnessMetrics(goal: string): Array<{ metric: string; weight: number }> {
		switch (goal) {
			case "glider":
				return [
					{ metric: "Persistence", weight: 1.0 },
					{ metric: "Locomotion", weight: 1.5 },
					{ metric: "Compactness", weight: 0.5 },
				];
			case "oscillator":
				return [
					{ metric: "Persistence", weight: 1.0 },
					{ metric: "Stability", weight: 0.8 },
					{ metric: "Compactness", weight: 0.5 },
				];
			case "complex":
				return [
					{ metric: "Persistence", weight: 1.0 },
					{ metric: "Complexity", weight: 1.2 },
					{ metric: "MassConcentration", weight: 0.3 },
				];
			case "survival":
			default:
				return [
					{ metric: "Persistence", weight: 1.0 },
					{ metric: "Compactness", weight: 0.5 },
					{ metric: "Stability", weight: 0.3 },
				];
		}
	}

	private setRunning(running: boolean): void {
		this.isRunning = running;
		const startBtn = this.get("evoStartBtn");
		const cancelBtn = this.get("evoCancelBtn");
		const loadBtn = this.get("evoLoadBtn");
		const progress = this.get("evolutionProgress");
		const status = this.get("evolutionStatus");

		startBtn.classList.toggle("hidden", running);
		cancelBtn.classList.toggle("hidden", !running);
		loadBtn.classList.add("hidden");
		progress.classList.toggle("hidden", !running);

		if (running) {
			status.innerHTML = '<p class="running">Evolution in progress...</p>';
		}
	}

	private updateProgress(progress: EvolutionProgress): void {
		this.get("evoGeneration").textContent = progress.generation.toString();
		this.get("evoBestFitness").textContent = progress.best_fitness.toFixed(3);
		this.get("evoMeanFitness").textContent = progress.mean_fitness.toFixed(3);

		const maxGens = parseInt(this.get<HTMLInputElement>("evoMaxGens").value, 10);
		const percent = (progress.generation / maxGens) * 100;
		this.get("evoProgressBar").style.width = `${Math.min(100, percent)}%`;
	}

	private renderPreview(state: BestCandidateState): void {
		if (!this.previewCtx || !this.previewCanvas) return;

		const { width, height, data } = state;
		const canvasWidth = this.previewCanvas.width;
		const canvasHeight = this.previewCanvas.height;

		// Create ImageData for the state
		const imageData = this.previewCtx.createImageData(width, height);

		for (let i = 0; i < data.length; i++) {
			const value = Math.floor(Math.min(1, Math.max(0, data[i])) * 255);
			imageData.data[i * 4] = value; // R
			imageData.data[i * 4 + 1] = value; // G
			imageData.data[i * 4 + 2] = value; // B
			imageData.data[i * 4 + 3] = 255; // A
		}

		// Create offscreen canvas for scaling
		const offscreen = new OffscreenCanvas(width, height);
		const offCtx = offscreen.getContext("2d");
		if (offCtx) {
			offCtx.putImageData(imageData, 0, 0);
			this.previewCtx.imageSmoothingEnabled = false;
			this.previewCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			this.previewCtx.drawImage(offscreen, 0, 0, canvasWidth, canvasHeight);
		}
	}

	private handleComplete(result: EvolutionResult): void {
		this.isRunning = false;
		const startBtn = this.get("evoStartBtn");
		const cancelBtn = this.get("evoCancelBtn");
		const loadBtn = this.get("evoLoadBtn");
		const status = this.get("evolutionStatus");

		startBtn.classList.remove("hidden");
		cancelBtn.classList.add("hidden");
		loadBtn.classList.remove("hidden");

		const reasonText = this.getStopReasonText(result.stop_reason);
		status.innerHTML = `
			<p class="complete">Evolution complete!</p>
			<p class="result-info">
				<span>Best: <strong>${result.best_fitness.toFixed(3)}</strong></span>
				<span>Gens: ${result.generations}</span>
			</p>
			<p class="result-reason">${reasonText}</p>
		`;
	}

	private getStopReasonText(reason: string): string {
		switch (reason) {
			case "TargetReached":
				return "Target fitness reached!";
			case "MaxGenerations":
				return "Max generations reached";
			case "Stagnation":
				return "Stopped due to stagnation";
			case "Cancelled":
				return "Cancelled by user";
			default:
				return reason;
		}
	}

	private handleError(error: string): void {
		this.setRunning(false);
		const status = this.get("evolutionStatus");
		status.innerHTML = `<p class="error">Error: ${error}</p>`;
	}

	private get<T extends HTMLElement = HTMLElement>(id: string): T {
		const el = document.getElementById(id);
		if (!el) throw new Error(`Element #${id} not found`);
		return el as T;
	}

	updateBaseConfig(config: SimulationConfig): void {
		this.baseConfig = config;
	}
}
