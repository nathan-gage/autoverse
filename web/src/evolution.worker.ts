// Evolution Web Worker - Runs evolutionary search in background thread
// This prevents UI lockup during compute-intensive evolution steps

import type { BestCandidateState, EvolutionProgress, EvolutionResult } from "./types";

// Messages from main thread to worker
export type WorkerRequest =
	| { type: "init"; wasmUrl: string }
	| { type: "start"; configJson: string; seedJson?: string }
	| { type: "cancel" }
	| { type: "getPreview" };

// Messages from worker to main thread
export type WorkerResponse =
	| { type: "ready" }
	| { type: "progress"; data: EvolutionProgress; bestState: BestCandidateState | null }
	| { type: "complete"; result: EvolutionResult; bestState: BestCandidateState | null }
	| { type: "preview"; state: BestCandidateState }
	| { type: "error"; message: string };

// WASM types - methods return JS objects via serde_wasm_bindgen (not JSON strings)
// Result<T, JsValue> in Rust means: returns T on success, throws on error
interface WasmModule {
	default: () => Promise<void>;
	WasmEvolutionEngine: new (configJson: string) => WasmEvolutionEngine;
}

interface WasmEvolutionEngine {
	setDefaultSeed(seedJson: string): void;
	step(): EvolutionProgress; // Returns JS object, throws on error
	isComplete(): boolean;
	getResult(): EvolutionResult; // Returns JS object, throws on error
	cancel(): void;
	getBestCandidateState(): BestCandidateState; // Returns JS object, throws on error (e.g., "No candidates")
	free(): void;
}

let wasmModule: WasmModule | null = null;
let engine: WasmEvolutionEngine | null = null;
let isRunning = false;

// Helper to safely get best candidate state (may throw if population empty)
function tryGetBestState(eng: WasmEvolutionEngine): BestCandidateState | null {
	try {
		return eng.getBestCandidateState();
	} catch {
		// Population might be empty during initialization
		return null;
	}
}

function post(msg: WorkerResponse) {
	self.postMessage(msg);
}

async function initWasm(wasmUrl: string): Promise<void> {
	console.log("[Worker] initWasm called with:", wasmUrl);

	if (wasmModule) {
		console.log("[Worker] WASM already loaded");
		post({ type: "ready" });
		return;
	}

	try {
		// Dynamically import the WASM module
		console.log("[Worker] Importing WASM module...");
		wasmModule = (await import(/* @vite-ignore */ wasmUrl)) as WasmModule;
		console.log("[Worker] WASM module imported, keys:", Object.keys(wasmModule));

		// Initialize WASM - let the glue code resolve the binary path via import.meta.url
		// This works because Vite processes the dynamic import and sets up the correct URL
		console.log("[Worker] Initializing WASM...");
		await wasmModule.default();
		console.log("[Worker] WASM initialized successfully");

		post({ type: "ready" });
	} catch (error) {
		console.error("[Worker] Failed to load WASM:", error);
		post({ type: "error", message: `Failed to load WASM: ${error}` });
	}
}

async function runEvolution(configJson: string, seedJson?: string): Promise<void> {
	console.log("[Worker] runEvolution called");

	if (!wasmModule) {
		console.error("[Worker] WASM not initialized");
		post({ type: "error", message: "WASM not initialized" });
		return;
	}

	if (isRunning) {
		console.error("[Worker] Evolution already running");
		post({ type: "error", message: "Evolution already running" });
		return;
	}

	try {
		console.log("[Worker] Creating evolution engine...");

		// Clean up any existing engine
		if (engine) {
			engine.free();
			engine = null;
		}

		engine = new wasmModule.WasmEvolutionEngine(configJson);
		console.log("[Worker] Engine created successfully");

		if (seedJson) {
			engine.setDefaultSeed(seedJson);
		}

		isRunning = true;
		let stepCount = 0;

		// Evolution loop with yielding to allow message processing
		while (isRunning && engine && !engine.isComplete()) {
			stepCount++;
			console.log(`[Worker] Evolution step ${stepCount}, isComplete=${engine.isComplete()}`);

			// Run one evolution step - returns JS object directly
			const progress = engine.step();
			console.log(
				`[Worker] Step complete: gen=${progress.generation}/${progress.total_generations}, best=${progress.best_fitness.toFixed(4)}`,
			);

			// Get best candidate state for preview (may fail if population empty)
			const bestState = tryGetBestState(engine);

			post({ type: "progress", data: progress, bestState });

			// Yield to allow cancel messages to be processed
			await new Promise((resolve) => setTimeout(resolve, 0));
		}

		console.log(
			`[Worker] Loop exited: isRunning=${isRunning}, hasEngine=${!!engine}, isComplete=${engine?.isComplete()}`,
		);

		// Get final result if we completed normally
		if (isRunning && engine) {
			console.log("[Worker] Getting final result...");
			const result = engine.getResult();
			const bestState = tryGetBestState(engine);

			post({ type: "complete", result, bestState });
			console.log("[Worker] Evolution complete, result posted");
		}
	} catch (error) {
		console.error("[Worker] Evolution error:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		post({ type: "error", message: `Evolution error: ${errorMessage}` });
	} finally {
		console.log("[Worker] Evolution finished, cleaning up");
		if (engine) {
			engine.free();
			engine = null;
		}
		isRunning = false;
	}
}

function cancelEvolution(): void {
	if (engine) {
		engine.cancel();
	}
	isRunning = false;
}

function getPreview(): void {
	if (!engine) {
		post({ type: "error", message: "No evolution engine" });
		return;
	}

	const state = tryGetBestState(engine);
	if (state) {
		post({ type: "preview", state });
	}
}

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const request = event.data;
	console.log("[Worker] Received message:", request.type);

	switch (request.type) {
		case "init":
			await initWasm(request.wasmUrl);
			break;

		case "start":
			console.log("[Worker] Starting evolution with config length:", request.configJson.length);
			await runEvolution(request.configJson, request.seedJson);
			break;

		case "cancel":
			cancelEvolution();
			break;

		case "getPreview":
			getPreview();
			break;
	}
};
