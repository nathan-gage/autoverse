// Evolution Manager - WASM wrapper for evolutionary pattern search

import type {
	BestCandidateState,
	EvolutionConfig,
	EvolutionProgress,
	EvolutionResult,
	SimulationConfig,
} from "./types";

// WASM module types for evolution
interface WasmEvolutionModule {
	default: () => Promise<void>;
	WasmEvolutionEngine: new (configJson: string) => WasmEvolutionEngine;
}

interface WasmEvolutionEngine {
	step(): string; // Returns JSON EvolutionProgress
	isComplete(): boolean;
	getResult(): string; // Returns JSON EvolutionResult
	cancel(): void;
	getBestCandidateState(): BestCandidateState | null;
	setDefaultSeed(seedJson: string): void;
	free(): void;
}

export type EvolutionEventType = "progress" | "complete" | "error" | "stateUpdate";

export interface EvolutionEvent {
	type: EvolutionEventType;
	progress?: EvolutionProgress;
	result?: EvolutionResult;
	state?: BestCandidateState;
	error?: string;
}

export type EvolutionListener = (event: EvolutionEvent) => void;

export class EvolutionManager {
	private wasmModule: WasmEvolutionModule | null = null;
	private engine: WasmEvolutionEngine | null = null;
	private isRunning = false;
	private animationFrameId: number | null = null;
	private listeners: Set<EvolutionListener> = new Set();
	private currentProgress: EvolutionProgress | null = null;
	private baseConfig: SimulationConfig;

	constructor(baseConfig: SimulationConfig) {
		this.baseConfig = baseConfig;
	}

	async initialize(): Promise<void> {
		try {
			const wasmUrl = new URL("./pkg/flow_lenia.js", import.meta.url).href;
			this.wasmModule = (await import(
				/* webpackIgnore: true */ wasmUrl
			)) as WasmEvolutionModule;
			await this.wasmModule.default();
		} catch (error) {
			throw new Error(`Failed to initialize evolution WASM: ${error}`);
		}
	}

	subscribe(listener: EvolutionListener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private emit(event: EvolutionEvent): void {
		for (const listener of this.listeners) {
			listener(event);
		}
	}

	getDefaultConfig(): EvolutionConfig {
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
				metrics: [
					{ metric: "Persistence", weight: 1.0 },
					{ metric: "Compactness", weight: 0.5 },
					{ metric: "Locomotion", weight: 0.3 },
				],
				aggregation: "WeightedSum",
			},
			evaluation: {
				steps: 200,
				sample_interval: 10,
				warmup_steps: 20,
			},
			population: {
				size: 20,
				elitism: 2,
			},
			algorithm: {
				type: "GeneticAlgorithm",
				config: {
					mutation_rate: 0.15,
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
			max_generations: 50,
			target_fitness: 0.95,
			stagnation_limit: 15,
		};
	}

	async start(config: EvolutionConfig): Promise<void> {
		if (!this.wasmModule) {
			throw new Error("Evolution module not initialized");
		}

		if (this.isRunning) {
			this.cancel();
		}

		try {
			// Free previous engine if exists
			if (this.engine) {
				this.engine.free();
			}

			// Create new engine
			this.engine = new this.wasmModule.WasmEvolutionEngine(JSON.stringify(config));
			this.isRunning = true;
			this.currentProgress = null;

			// Start the evolution loop
			this.runEvolutionLoop();
		} catch (error) {
			this.emit({ type: "error", error: String(error) });
			throw error;
		}
	}

	private runEvolutionLoop(): void {
		if (!this.isRunning || !this.engine) {
			return;
		}

		try {
			// Perform one evolution step
			const progressJson = this.engine.step();
			const progress: EvolutionProgress = JSON.parse(progressJson);
			this.currentProgress = progress;

			// Emit progress event
			this.emit({ type: "progress", progress });

			// Get best candidate state for visualization
			const state = this.engine.getBestCandidateState();
			if (state) {
				this.emit({ type: "stateUpdate", state });
			}

			// Check if complete
			if (this.engine.isComplete()) {
				const resultJson = this.engine.getResult();
				const result: EvolutionResult = JSON.parse(resultJson);
				this.isRunning = false;
				this.emit({ type: "complete", result });
				return;
			}

			// Schedule next step
			this.animationFrameId = requestAnimationFrame(() => this.runEvolutionLoop());
		} catch (error) {
			this.isRunning = false;
			this.emit({ type: "error", error: String(error) });
		}
	}

	cancel(): void {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		if (this.engine && this.isRunning) {
			this.engine.cancel();
			// Get final result
			try {
				const resultJson = this.engine.getResult();
				const result: EvolutionResult = JSON.parse(resultJson);
				this.emit({ type: "complete", result });
			} catch {
				// Ignore errors getting result after cancel
			}
		}

		this.isRunning = false;
	}

	isEvolutionRunning(): boolean {
		return this.isRunning;
	}

	getProgress(): EvolutionProgress | null {
		return this.currentProgress;
	}

	getBestCandidateState(): BestCandidateState | null {
		if (!this.engine) return null;
		return this.engine.getBestCandidateState();
	}

	updateBaseConfig(config: SimulationConfig): void {
		this.baseConfig = config;
	}
}
