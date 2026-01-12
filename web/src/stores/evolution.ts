// Evolution state store - runs evolution with cooperative yielding to prevent UI lockup
import { derived, get, writable } from "svelte/store";
import type {
	BestCandidateState,
	EvolutionConfig,
	EvolutionProgress,
	EvolutionResult,
} from "../types";
import { log, pause, reset, simulationStore } from "./simulation";

// WASM module types for evolution
interface WasmEvolutionModule {
	default: () => Promise<void>;
	WasmEvolutionEngine: new (configJson: string) => WasmEvolutionEngine;
}

interface WasmEvolutionEngine {
	step(): EvolutionProgress | string;
	isComplete(): boolean;
	getResult(): EvolutionResult | string;
	cancel(): void;
	getBestCandidateState(): BestCandidateState | string | null;
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
let evolutionTimeoutId: number | null = null;

function parseWasmJson<T>(value: T | string | null): T | null {
	if (value === null) return null;
	if (typeof value === "string") {
		try {
			return JSON.parse(value) as T;
		} catch {
			return null;
		}
	}
	return value;
}

export async function initializeEvolution(): Promise<void> {
	if (wasmModule) {
		evolutionStore.update((s) => ({ ...s, initialized: true }));
		return;
	}

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
		algorithm: {
			type: "GeneticAlgorithm",
			config: {
				mutation_rate: 0.15,
				crossover_rate: 0.7,
				mutation_strength: 0.1,
				elitism: 2,
				selection: { method: "Tournament", size: 3 },
			},
		},
		fitness: {
			metrics: [
				{ metric: "Persistence", weight: 1.0 },
				{ metric: "Compactness", weight: 0.5 },
				{ metric: "Locomotion", weight: 0.3 },
			],
			aggregation: "WeightedSum",
		},
		population: {
			size: 20,
			max_generations: 50,
			target_fitness: 0.95,
			stagnation_limit: 15,
		},
		evaluation: {
			steps: 200,
			sample_interval: 10,
			warmup_steps: 20,
		},
		constraints: {
			radius: { min: 0.05, max: 0.25 },
			amplitude: { min: 0.5, max: 2.0 },
			x: { min: 0.3, max: 0.7 },
			y: { min: 0.3, max: 0.7 },
		},
		archive: {
			enabled: true,
			max_size: 50,
			diversity_threshold: 0.1,
		},
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

		log(
			`Evolution started: pop=${config.population.size}, gens=${config.population.max_generations}`,
			"info",
		);

		// Start evolution loop with cooperative yielding
		runEvolutionStep();
	} catch (error) {
		evolutionStore.update((s) => ({ ...s, error: String(error) }));
		log(`Evolution error: ${error}`, "error");
		throw error;
	}
}

function runEvolutionStep(): void {
	const state = get(evolutionStore);
	if (!state.running || !engine) {
		return;
	}

	try {
		// Run one evolution step
		const progressRaw = engine.step();
		const progress = parseWasmJson<EvolutionProgress>(progressRaw);

		// Get best candidate state for preview
		const bestStateRaw = engine.getBestCandidateState();
		const bestState = parseWasmJson<BestCandidateState>(bestStateRaw);

		evolutionStore.update((s) => ({
			...s,
			progress,
			bestState: bestState ?? s.bestState,
		}));

		if (engine.isComplete()) {
			const resultRaw = engine.getResult();
			const result = parseWasmJson<EvolutionResult>(resultRaw);

			evolutionStore.update((s) => ({
				...s,
				running: false,
				result,
			}));

			if (result) {
				log(
					`Evolution complete: fitness=${result.stats.best_fitness.toFixed(3)}, reason=${result.stats.stop_reason}`,
					"success",
				);
			}
			return;
		}

		// Schedule next step with setTimeout to yield to UI
		// Using setTimeout(0) allows the browser to process UI updates between steps
		evolutionTimeoutId = window.setTimeout(() => runEvolutionStep(), 0);
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
	if (evolutionTimeoutId !== null) {
		clearTimeout(evolutionTimeoutId);
		evolutionTimeoutId = null;
	}

	const state = get(evolutionStore);
	if (engine && state.running) {
		engine.cancel();
		try {
			const resultRaw = engine.getResult();
			const result = parseWasmJson<EvolutionResult>(resultRaw);
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

	const { width, height, channels } = state.bestState;
	if (!channels || channels.length === 0) {
		log("No channel data in evolved pattern", "warn");
		return;
	}

	// Use first channel
	const data = channels[0];

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

// Cleanup function
export function destroyEvolution(): void {
	cancelEvolution();
	if (engine) {
		engine.free();
		engine = null;
	}
	evolutionStore.set(initialState);
}
