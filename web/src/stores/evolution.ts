// Evolution state store - runs evolution in a web worker to prevent UI lockup
import { derived, get, writable } from "svelte/store";
import type { WorkerRequest, WorkerResponse } from "../evolution.worker";
import type {
	BestCandidateState,
	EvolutionConfig,
	EvolutionProgress,
	EvolutionResult,
} from "../types";
import { log, pause, reset, simulationStore } from "./simulation";

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

// Worker instance
let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;

function postToWorker(msg: WorkerRequest): void {
	if (worker) {
		worker.postMessage(msg);
	}
}

function handleWorkerMessage(event: MessageEvent<WorkerResponse>): void {
	const msg = event.data;

	switch (msg.type) {
		case "ready":
			evolutionStore.update((s) => ({ ...s, initialized: true }));
			log("Evolution engine initialized (worker)", "success");
			break;

		case "progress":
			evolutionStore.update((s) => ({
				...s,
				progress: msg.data,
				bestState: msg.bestState ?? s.bestState,
			}));
			break;

		case "complete":
			evolutionStore.update((s) => ({
				...s,
				running: false,
				result: msg.result,
				bestState: msg.bestState ?? s.bestState,
			}));
			if (msg.result) {
				log(
					`Evolution complete: fitness=${msg.result.stats.best_fitness.toFixed(3)}, reason=${msg.result.stats.stop_reason}`,
					"success",
				);
			}
			break;

		case "preview":
			evolutionStore.update((s) => ({ ...s, bestState: msg.state }));
			break;

		case "error":
			evolutionStore.update((s) => ({
				...s,
				running: false,
				error: msg.message,
			}));
			log(`Evolution error: ${msg.message}`, "error");
			break;
	}
}

export async function initializeEvolution(): Promise<void> {
	if (worker) {
		evolutionStore.update((s) => ({ ...s, initialized: true }));
		return;
	}

	// Return existing promise if already initializing
	if (initPromise) {
		return initPromise;
	}

	initPromise = new Promise<void>((resolve, reject) => {
		try {
			// Create worker - Vite will bundle this properly
			worker = new Worker(new URL("../evolution.worker.ts", import.meta.url), {
				type: "module",
			});

			// Set up message handler
			worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
				handleWorkerMessage(event);

				// Resolve init promise when ready
				if (event.data.type === "ready") {
					resolve();
				} else if (event.data.type === "error" && !get(evolutionStore).initialized) {
					reject(new Error(event.data.message));
				}
			};

			worker.onerror = (error) => {
				log(`Worker error: ${error.message}`, "error");
				reject(error);
			};

			// Initialize WASM in worker
			const baseUrl = import.meta.env.BASE_URL || "/";
			const wasmUrl = `${baseUrl}pkg/flow_lenia.js`;
			postToWorker({ type: "init", wasmUrl });
		} catch (error) {
			log(`Failed to create evolution worker: ${error}`, "error");
			reject(error);
		}
	});

	return initPromise;
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
	if (!worker) {
		throw new Error("Evolution worker not initialized");
	}

	// Pause main simulation
	pause();

	// Cancel any existing evolution
	cancelEvolution();

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

	// Send start command to worker
	postToWorker({
		type: "start",
		configJson: JSON.stringify(config),
	});
}

export function cancelEvolution(): void {
	const state = get(evolutionStore);
	if (worker && state.running) {
		postToWorker({ type: "cancel" });
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
	if (worker) {
		worker.terminate();
		worker = null;
	}
	initPromise = null;
	evolutionStore.set(initialState);
}
