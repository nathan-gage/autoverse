// Evolution state store - wraps WASM evolution engine with reactive Svelte state
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
let animationFrameId: number | null = null;
let bestStateTask: IdleTaskHandle | null = null;
let resultTask: IdleTaskHandle | null = null;
let lastBestStateUpdate = 0;
const BEST_STATE_THROTTLE_MS = 750;

type IdleTaskType = "idle" | "timeout";
type IdleTaskHandle = { id: number; type: IdleTaskType };

function parseWasmJson<T>(value: T | string): T {
	if (typeof value === "string") {
		return JSON.parse(value) as T;
	}
	return value;
}

function scheduleIdleTask(callback: () => void, timeoutMs = 0): IdleTaskHandle {
	if ("requestIdleCallback" in window) {
		const { requestIdleCallback } = window as Window & {
			requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
		};
		return {
			id: requestIdleCallback(callback, { timeout: timeoutMs }),
			type: "idle",
		};
	}

	return {
		id: window.setTimeout(callback, timeoutMs),
		type: "timeout",
	};
}

function cancelIdleTask(task: IdleTaskHandle | null): void {
	if (!task) return;
	if (task.type === "idle" && "cancelIdleCallback" in window) {
		const { cancelIdleCallback } = window as Window & {
			cancelIdleCallback: (id: number) => void;
		};
		cancelIdleCallback(task.id);
	} else {
		clearTimeout(task.id);
	}
}

function scheduleBestStateUpdate(): void {
	if (!engine || bestStateTask) return;
	const now = performance.now();
	if (now - lastBestStateUpdate < BEST_STATE_THROTTLE_MS) {
		return;
	}
	const currentEngine = engine;
	bestStateTask = scheduleIdleTask(() => {
		bestStateTask = null;
		if (!engine || engine !== currentEngine) return;
		try {
			const bestState = parseWasmJson(engine.getBestCandidateState());
			lastBestStateUpdate = performance.now();
			evolutionStore.update((s) => ({
				...s,
				bestState,
			}));
		} catch (error) {
			log(`Failed to update best candidate preview: ${error}`, "warn");
		}
	}, 200);
}

function scheduleResultUpdate(): void {
	if (!engine || resultTask) return;
	const currentEngine = engine;
	resultTask = scheduleIdleTask(() => {
		resultTask = null;
		if (!engine || engine !== currentEngine) return;
		try {
			const result = parseWasmJson(engine.getResult());
			evolutionStore.update((s) => ({
				...s,
				result,
			}));
			log(
				`Evolution complete: fitness=${result.best_fitness.toFixed(3)}, reason=${result.stop_reason}`,
				"success",
			);
		} catch (error) {
			evolutionStore.update((s) => ({ ...s, error: String(error) }));
			log(`Evolution error: ${error}`, "error");
		}
	}, 200);
}

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
		cancelIdleTask(bestStateTask);
		cancelIdleTask(resultTask);
		bestStateTask = null;
		resultTask = null;
		lastBestStateUpdate = 0;

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
		const progress = parseWasmJson(engine.step());

		evolutionStore.update((s) => ({
			...s,
			progress,
		}));

		scheduleBestStateUpdate();

		if (engine.isComplete()) {
			evolutionStore.update((s) => ({
				...s,
				running: false,
			}));
			scheduleResultUpdate();
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
	cancelIdleTask(bestStateTask);
	cancelIdleTask(resultTask);
	bestStateTask = null;
	resultTask = null;

	const state = get(evolutionStore);
	if (engine && state.running) {
		engine.cancel();
		scheduleResultUpdate();
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
