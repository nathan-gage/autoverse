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

// WASM types
interface WasmModule {
	default: (input?: string | URL | RequestInfo) => Promise<unknown>;
	WasmEvolutionEngine: new (configJson: string) => WasmEvolutionEngine;
}

interface WasmEvolutionEngine {
	setDefaultSeed(seedJson: string): void;
	step(): EvolutionProgress | string;
	isComplete(): boolean;
	getResult(): EvolutionResult | string;
	cancel(): void;
	getBestCandidateState(): BestCandidateState | string | null;
	free(): void;
}

let wasmModule: WasmModule | null = null;
let engine: WasmEvolutionEngine | null = null;
let isRunning = false;

function parseJson<T>(value: T | string | null): T | null {
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

function post(msg: WorkerResponse) {
	self.postMessage(msg);
}

async function initWasm(wasmUrl: string): Promise<void> {
	if (wasmModule) {
		post({ type: "ready" });
		return;
	}

	try {
		// Dynamically import the WASM module
		wasmModule = (await import(/* @vite-ignore */ wasmUrl)) as WasmModule;

		// Initialize WASM - pass the full URL to the .wasm binary
		// The WASM loader needs an absolute URL since import.meta.url in workers doesn't work correctly
		const wasmBinaryUrl = new URL(wasmUrl.replace(/\.js$/, "_bg.wasm"), self.location.href);
		await wasmModule.default(wasmBinaryUrl);

		post({ type: "ready" });
	} catch (error) {
		post({ type: "error", message: `Failed to load WASM: ${error}` });
	}
}

async function runEvolution(configJson: string, seedJson?: string): Promise<void> {
	if (!wasmModule) {
		post({ type: "error", message: "WASM not initialized" });
		return;
	}

	if (isRunning) {
		post({ type: "error", message: "Evolution already running" });
		return;
	}

	try {
		// Clean up any existing engine
		if (engine) {
			engine.free();
			engine = null;
		}

		engine = new wasmModule.WasmEvolutionEngine(configJson);

		if (seedJson) {
			engine.setDefaultSeed(seedJson);
		}

		isRunning = true;

		// Evolution loop with yielding to allow message processing
		while (isRunning && engine && !engine.isComplete()) {
			// Run one evolution step
			const progressRaw = engine.step();
			const progress = parseJson<EvolutionProgress>(progressRaw);

			if (!progress) {
				post({ type: "error", message: "Failed to parse evolution progress" });
				break;
			}

			// Get best candidate state for preview
			const bestStateRaw = engine.getBestCandidateState();
			const bestState = parseJson<BestCandidateState>(bestStateRaw);

			post({ type: "progress", data: progress, bestState });

			// Yield to allow cancel messages to be processed
			await new Promise((resolve) => setTimeout(resolve, 0));
		}

		// Get final result if we completed normally
		if (isRunning && engine) {
			const resultRaw = engine.getResult();
			const result = parseJson<EvolutionResult>(resultRaw);
			const bestStateRaw = engine.getBestCandidateState();
			const bestState = parseJson<BestCandidateState>(bestStateRaw);

			if (result) {
				post({ type: "complete", result, bestState });
			} else {
				post({ type: "error", message: "Failed to get evolution result" });
			}
		}
	} catch (error) {
		post({ type: "error", message: `Evolution error: ${error}` });
	} finally {
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

	try {
		const stateRaw = engine.getBestCandidateState();
		const state = parseJson<BestCandidateState>(stateRaw);
		if (state) {
			post({ type: "preview", state });
		}
	} catch (error) {
		post({ type: "error", message: `Preview error: ${error}` });
	}
}

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const request = event.data;

	switch (request.type) {
		case "init":
			await initWasm(request.wasmUrl);
			break;

		case "start":
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
