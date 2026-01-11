// Evolution state store - wraps WASM evolution engine with reactive Svelte state
import { get, writable, derived } from "svelte/store";
import type {
	BestCandidateState,
	EvolutionConfig,
	EvolutionProgress,
	EvolutionResult,
} from "../types";
import { simulationStore, pause, reset, log } from "./simulation";

// WASM module types for evolution
interface WasmEvolutionModule {
	default: () => Promise<void>;
	WasmEvolutionEngine: new (configJson: string) => WasmEvolutionEngine;
}

interface WasmEvolutionEngine {
	step(): string;
	isComplete(): boolean;
	getResult(): string;
	cancel(): void;
	getBestCandidateState(): BestCandidateState | null;
	setDefaultSeed(seedJson: string): void;
	free(): void;
}

export interface EvolutionStoreState {
	initialized: boolean;
	running: boolean;
	progress: EvolutionProgress | null;
	result: EvolutionResult | null;
	bestState: BestCandidateState | null;
	error: string | null;
}

const initialState: EvolutionStoreState = {
	initialized: false,
	running: false,
	progress: null,
	result: null,
	bestState: null,
	error: null,
};

export const evolutionStore = writable<EvolutionStoreState>(initialState);

// Derived stores
export const isEvolutionRunning = derived(evolutionStore, ($s) => $s.running);
export const evolutionProgress = derived(evolutionStore, ($s) => $s.progress);
export const bestCandidateState = derived(evolutionStore, ($s) => $s.bestState);

// Module state
let wasmModule: WasmEvolutionModule | null = null;
let engine: WasmEvolutionEngine | null = null;
let animationFrameId: number | null = null;

export async function initializeEvolution(): Promise<void> {
	try {
		const baseUrl = import.meta.env.BASE_URL || "/";
		const wasmUrl = `${baseUrl}pkg/flow_lenia.js`;
		wasmModule = (await import(/* @vite-ignore */ wasmUrl)) as WasmEvolutionModule;
		await wasmModule.default();
		evolutionStore.update((s) => ({ ...s, initialized: true }));
		log("Evolution engine initialized", "success");
	} catch (error) {
		log(`Failed to initialize evolution: ${error}`, "error");
		throw error;
	}
}

export function getDefaultEvolutionConfig(): EvolutionConfig {
	const simState = get(simulationStore);
	return {
		base_config: simState.config,
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

export async function startEvolution(config: EvolutionConfig): Promise<void> {
	if (!wasmModule) {
		throw new Error("Evolution module not initialized");
	}

	// Pause main simulation
	pause();

	// Cancel any existing evolution
	cancelEvolution();

	try {
		if (engine) {
			engine.free();
		}

		engine = new wasmModule.WasmEvolutionEngine(JSON.stringify(config));
		evolutionStore.update((s) => ({
			...s,
			running: true,
			progress: null,
			result: null,
			error: null,
		}));

		log(`Evolution started: pop=${config.population.size}, gens=${config.max_generations}`, "info");
		runEvolutionLoop();
	} catch (error) {
		evolutionStore.update((s) => ({ ...s, error: String(error) }));
		log(`Evolution error: ${error}`, "error");
		throw error;
	}
}

function runEvolutionLoop(): void {
	const state = get(evolutionStore);
	if (!state.running || !engine) {
		return;
	}

	try {
		const progressJson = engine.step();
		const progress: EvolutionProgress = JSON.parse(progressJson);

		const bestState = engine.getBestCandidateState();

		evolutionStore.update((s) => ({
			...s,
			progress,
			bestState,
		}));

		if (engine.isComplete()) {
			const resultJson = engine.getResult();
			const result: EvolutionResult = JSON.parse(resultJson);

			evolutionStore.update((s) => ({
				...s,
				running: false,
				result,
			}));

			log(
				`Evolution complete: fitness=${result.best_fitness.toFixed(3)}, reason=${result.stop_reason}`,
				"success",
			);
			return;
		}

		animationFrameId = requestAnimationFrame(() => runEvolutionLoop());
	} catch (error) {
		evolutionStore.update((s) => ({
			...s,
			running: false,
			error: String(error),
		}));
		log(`Evolution error: ${error}`, "error");
	}
}

export function cancelEvolution(): void {
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}

	const state = get(evolutionStore);
	if (engine && state.running) {
		engine.cancel();
		try {
			const resultJson = engine.getResult();
			const result: EvolutionResult = JSON.parse(resultJson);
			evolutionStore.update((s) => ({ ...s, result }));
		} catch {
			// Ignore errors getting result after cancel
		}
		log("Evolution cancelled", "warn");
	}

	evolutionStore.update((s) => ({ ...s, running: false }));
}

export function loadBestCandidate(): void {
	const state = get(evolutionStore);
	if (!state.bestState) {
		log("No evolved pattern to load", "warn");
		return;
	}

	const { width, height, data } = state.bestState;

	// Convert to Custom seed pattern
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

	reset({
		pattern: {
			type: "Custom",
			values,
		},
	});

	log("Loaded evolved pattern into simulation", "success");
}
