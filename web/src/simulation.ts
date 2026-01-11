// Simulation Manager - WASM wrapper with enhanced state management

import type { PresetRegion, Seed, SimulationConfig, SimulationState } from "./types";

// WASM module types
interface WasmModule {
	default: () => Promise<void>;
	WasmPropagator: new (configJson: string, seedJson: string) => WasmPropagator;
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

export class SimulationManager {
	private propagator: WasmPropagator | null = null;
	private config: SimulationConfig;
	private currentSeed: Seed;
	private isInitialized = false;
	private wasmModule: WasmModule | null = null;

	constructor(config: SimulationConfig, seed: Seed) {
		this.config = config;
		this.currentSeed = seed;
	}

	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		try {
			// Dynamic import of WASM module from the pkg directory
			// Works in both dev server (serves from ../pkg) and production (copied to dist/pkg)
			this.wasmModule = (await import("/pkg/flow_lenia.js")) as WasmModule;
			await this.wasmModule.default();

			this.propagator = new this.wasmModule.WasmPropagator(
				JSON.stringify(this.config),
				JSON.stringify(this.currentSeed),
			);

			this.isInitialized = true;
		} catch (error) {
			throw new Error(`Failed to initialize WASM: ${error}`);
		}
	}

	step(): void {
		this.ensureInitialized();
		this.propagator!.step();
	}

	run(steps: number): void {
		this.ensureInitialized();
		this.propagator!.run(BigInt(steps));
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
		const points: Array<{ x: number; y: number; channel: number; value: number }> = [];

		// First, add all existing points
		for (let ch = 0; ch < state.channels.length; ch++) {
			for (let y = 0; y < state.height; y++) {
				for (let x = 0; x < state.width; x++) {
					const idx = y * state.width + x;
					const value = state.channels[ch][idx];
					if (value > 0.001) {
						points.push({ x, y, channel: ch, value });
					}
				}
			}
		}

		// Then overlay the region
		for (let ch = 0; ch < region.channels.length; ch++) {
			for (let dy = 0; dy < region.height; dy++) {
				for (let dx = 0; dx < region.width; dx++) {
					const x = (targetX + dx) % this.config.width;
					const y = (targetY + dy) % this.config.height;
					const idx = dy * region.width + dx;
					const value = region.channels[ch][idx];

					if (value > 0.001) {
						// Remove existing point at this location if any
						const existingIdx = points.findIndex((p) => p.x === x && p.y === y && p.channel === ch);
						if (existingIdx >= 0) {
							points.splice(existingIdx, 1);
						}
						points.push({ x, y, channel: ch, value });
					}
				}
			}
		}

		// Reset with custom pattern
		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				points,
			},
		};

		this.reset(customSeed);
	}

	// Draw at a specific location
	drawAt(x: number, y: number, radius: number, intensity: number, channel = 0): void {
		this.ensureInitialized();
		const state = this.getState();
		const points: Array<{ x: number; y: number; channel: number; value: number }> = [];

		// Copy existing state
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
						points.push({ x: px, y: py, channel: ch, value });
					}
				}
			}
		}

		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				points,
			},
		};

		this.reset(customSeed);
	}

	// Erase at a specific location
	eraseAt(x: number, y: number, radius: number, channel = 0): void {
		this.ensureInitialized();
		const state = this.getState();
		const points: Array<{ x: number; y: number; channel: number; value: number }> = [];

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
						points.push({ x: px, y: py, channel: ch, value });
					}
				}
			}
		}

		const customSeed: Seed = {
			pattern: {
				type: "Custom",
				points,
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
