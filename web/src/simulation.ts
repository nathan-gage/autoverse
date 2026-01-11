// Simulation Manager - WASM wrapper with enhanced state management

import type { BackendType, PresetRegion, Seed, SimulationConfig, SimulationState } from "./types";

// WASM module types
interface WasmModule {
	default: () => Promise<void>;
	WasmPropagator: new (configJson: string, seedJson: string) => WasmPropagator;
	WasmGpuPropagator: new (configJson: string, seedJson: string) => Promise<WasmGpuPropagator>;
}

interface WasmPropagator {
	step(): void;
	run(steps: bigint): void;
	getState(): SimulationState;
	getStats(): unknown;
	reset(seedJson: string): void;
	totalMass(): number;
	getTime(): number;
	getStep(): number;
	getWidth(): number;
	getHeight(): number;
}

interface WasmGpuPropagator {
	step(): Promise<void>;
	run(steps: bigint): Promise<void>;
	getState(): SimulationState;
	getStats(): unknown;
	reset(seedJson: string): void;
	totalMass(): number;
	getTime(): number;
	getStep(): number;
	getWidth(): number;
	getHeight(): number;
}

type Propagator = WasmPropagator | WasmGpuPropagator;

export class SimulationManager {
	private propagator: Propagator | null = null;
	private config: SimulationConfig;
	private currentSeed: Seed;
	private isInitialized = false;
	private wasmModule: WasmModule | null = null;
	private currentBackend: BackendType = "cpu";
	private gpuAvailable = false;

	constructor(config: SimulationConfig, seed: Seed) {
		this.config = config;
		this.currentSeed = seed;
	}

	async initialize(backend: BackendType = "cpu"): Promise<void> {
		try {
			// Use Vite's BASE_URL to correctly resolve WASM path in all deployment contexts
			const baseUrl = import.meta.env.BASE_URL || "/";
			const wasmUrl = `${baseUrl}pkg/flow_lenia.js`;
			this.wasmModule = (await import(/* webpackIgnore: true */ /* @vite-ignore */ wasmUrl)) as WasmModule;
			await this.wasmModule.default();

			// Check WebGPU availability
			this.gpuAvailable = await this.checkWebGPU();

			// Create propagator with requested backend (fallback to CPU if GPU unavailable)
			const useBackend = backend === "gpu" && this.gpuAvailable ? "gpu" : "cpu";
			await this.createPropagator(useBackend);

			this.isInitialized = true;
		} catch (error) {
			throw new Error(`Failed to initialize WASM: ${error}`);
		}
	}

	private async checkWebGPU(): Promise<boolean> {
		if (typeof navigator === "undefined" || !("gpu" in navigator)) {
			return false;
		}
		try {
			const adapter = await navigator.gpu.requestAdapter();
			return adapter !== null;
		} catch {
			return false;
		}
	}

	private async createPropagator(backend: BackendType): Promise<void> {
		if (!this.wasmModule) {
			throw new Error("WASM module not loaded");
		}

		const configJson = JSON.stringify(this.config);
		const seedJson = JSON.stringify(this.currentSeed);

		if (backend === "gpu" && this.gpuAvailable) {
			// GPU propagator constructor returns a Promise
			this.propagator = await new this.wasmModule.WasmGpuPropagator(configJson, seedJson);
			this.currentBackend = "gpu";
		} else {
			this.propagator = new this.wasmModule.WasmPropagator(configJson, seedJson);
			this.currentBackend = "cpu";
		}
	}

	async switchBackend(backend: BackendType): Promise<boolean> {
		if (!this.isInitialized) {
			throw new Error("Simulation not initialized");
		}

		if (backend === "gpu" && !this.gpuAvailable) {
			return false;
		}

		if (backend === this.currentBackend) {
			return true;
		}

		await this.createPropagator(backend);
		return true;
	}

	isGpuAvailable(): boolean {
		return this.gpuAvailable;
	}

	getBackend(): BackendType {
		return this.currentBackend;
	}

	async step(): Promise<void> {
		this.ensureInitialized();
		if (this.currentBackend === "gpu") {
			await (this.propagator as WasmGpuPropagator).step();
		} else {
			(this.propagator as WasmPropagator).step();
		}
	}

	async run(steps: number): Promise<void> {
		this.ensureInitialized();
		if (this.currentBackend === "gpu") {
			await (this.propagator as WasmGpuPropagator).run(BigInt(steps));
		} else {
			(this.propagator as WasmPropagator).run(BigInt(steps));
		}
	}

	getState(): SimulationState {
		this.ensureInitialized();
		return this.propagator!.getState();
	}

	reset(seed?: Seed): void {
		this.ensureInitialized();
		if (seed) {
			this.currentSeed = seed;
		}
		this.propagator!.reset(JSON.stringify(this.currentSeed));
	}

	totalMass(): number {
		this.ensureInitialized();
		return this.propagator!.totalMass();
	}

	getTime(): number {
		this.ensureInitialized();
		return this.propagator!.getTime();
	}

	getStep(): number {
		this.ensureInitialized();
		return this.propagator!.getStep();
	}

	getWidth(): number {
		return this.config.width;
	}

	getHeight(): number {
		return this.config.height;
	}

	getConfig(): SimulationConfig {
		return { ...this.config };
	}

	// Extract a region from the current state
	extractRegion(x: number, y: number, width: number, height: number): PresetRegion {
		this.ensureInitialized();
		const state = this.getState();
		const channels: number[][] = [];

		for (let ch = 0; ch < state.channels.length; ch++) {
			const regionData: number[] = [];
			for (let dy = 0; dy < height; dy++) {
				for (let dx = 0; dx < width; dx++) {
					const srcX = (x + dx) % state.width;
					const srcY = (y + dy) % state.height;
					const idx = srcY * state.width + srcX;
					regionData.push(state.channels[ch][idx]);
				}
			}
			channels.push(regionData);
		}

		return {
			width,
			height,
			channels,
			sourceX: x,
			sourceY: y,
		};
	}

	// Place a region into the simulation (requires custom seed)
	placeRegion(region: PresetRegion, targetX: number, targetY: number): void {
		this.ensureInitialized();
		const state = this.getState();

		// Build custom pattern from current state + placed region
		// Use Map for efficient lookups: key = "x,y,ch"
		const valueMap = new Map<string, number>();

		// First, add all existing values
		for (let ch = 0; ch < state.channels.length; ch++) {
			for (let y = 0; y < state.height; y++) {
				for (let x = 0; x < state.width; x++) {
					const idx = y * state.width + x;
					const value = state.channels[ch][idx];
					if (value > 0.001) {
						valueMap.set(`${x},${y},${ch}`, value);
					}
				}
			}
		}

		// Then overlay the region (overwrites existing values at same location)
		for (let ch = 0; ch < region.channels.length; ch++) {
			for (let dy = 0; dy < region.height; dy++) {
				for (let dx = 0; dx < region.width; dx++) {
					const x = (targetX + dx) % this.config.width;
					const y = (targetY + dy) % this.config.height;
					const idx = dy * region.width + dx;
					const value = region.channels[ch][idx];

					if (value > 0.001) {
						valueMap.set(`${x},${y},${ch}`, value);
					}
				}
			}
		}

		// Convert map to tuple array: [x, y, channel, value]
		const values: Array<[number, number, number, number]> = [];
		for (const [key, value] of valueMap) {
			const [x, y, ch] = key.split(",").map(Number);
			values.push([x, y, ch, value]);
		}

		// Reset with custom pattern
		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				values,
			},
		};

		this.reset(customSeed);
	}

	// Draw at a specific location
	drawAt(x: number, y: number, radius: number, intensity: number, channel = 0): void {
		this.ensureInitialized();
		const state = this.getState();
		const values: Array<[number, number, number, number]> = [];

		// Copy existing state with brush contribution
		for (let ch = 0; ch < state.channels.length; ch++) {
			for (let py = 0; py < state.height; py++) {
				for (let px = 0; px < state.width; px++) {
					const idx = py * state.width + px;
					let value = state.channels[ch][idx];

					// Add brush contribution
					if (ch === channel) {
						const dx = px - x;
						const dy = py - y;
						const dist = Math.sqrt(dx * dx + dy * dy);
						if (dist <= radius) {
							const falloff = 1 - dist / radius;
							value = Math.min(1, value + intensity * falloff * falloff);
						}
					}

					if (value > 0.001) {
						values.push([px, py, ch, value]);
					}
				}
			}
		}

		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				values,
			},
		};

		this.reset(customSeed);
	}

	// Erase at a specific location
	eraseAt(x: number, y: number, radius: number, channel = 0): void {
		this.ensureInitialized();
		const state = this.getState();
		const values: Array<[number, number, number, number]> = [];

		// Copy existing state, erasing within radius
		for (let ch = 0; ch < state.channels.length; ch++) {
			for (let py = 0; py < state.height; py++) {
				for (let px = 0; px < state.width; px++) {
					const idx = py * state.width + px;
					let value = state.channels[ch][idx];

					// Erase within radius
					if (ch === channel) {
						const dx = px - x;
						const dy = py - y;
						const dist = Math.sqrt(dx * dx + dy * dy);
						if (dist <= radius) {
							const falloff = 1 - dist / radius;
							value = Math.max(0, value * (1 - falloff * falloff));
						}
					}

					if (value > 0.001) {
						values.push([px, py, ch, value]);
					}
				}
			}
		}

		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				values,
			},
		};

		this.reset(customSeed);
	}

	private ensureInitialized(): void {
		if (!this.isInitialized || !this.propagator) {
			throw new Error("Simulation not initialized. Call initialize() first.");
		}
	}
}
