// Simulation state store - wraps WASM propagator with reactive Svelte state
import { derived, get, writable } from "svelte/store";
import { SimulationManager } from "../simulation";
import type { BackendType, Seed, SimulationConfig, SimulationState } from "../types";

// Default configuration
const DEFAULT_CONFIG: SimulationConfig = {
	width: 128,
	height: 128,
	channels: 1,
	dt: 0.1,
	kernel_radius: 13,
	kernels: [
		{
			radius: 1.0,
			rings: [{ amplitude: 1.0, distance: 0.5, width: 0.15 }],
			weight: 1.0,
			mu: 0.15,
			sigma: 0.015,
			source_channel: 0,
			target_channel: 0,
		},
	],
	flow: {
		beta_a: 1.0,
		n: 2.0,
		distribution_size: 1.0,
	},
};

const DEFAULT_SEED: Seed = {
	pattern: {
		type: "GaussianBlob",
		center: [0.5, 0.5],
		radius: 0.1,
		amplitude: 1.0,
		channel: 0,
	},
};

// Simulation state
export interface SimulationStoreState {
	initialized: boolean;
	playing: boolean;
	step: number;
	time: number;
	totalMass: number;
	fps: number;
	frameTime: number;
	backend: BackendType;
	gpuAvailable: boolean;
	config: SimulationConfig;
	state: SimulationState | null;
}

const initialState: SimulationStoreState = {
	initialized: false,
	playing: false,
	step: 0,
	time: 0,
	totalMass: 0,
	fps: 0,
	frameTime: 0,
	backend: "cpu",
	gpuAvailable: false,
	config: DEFAULT_CONFIG,
	state: null,
};

export const simulationStore = writable<SimulationStoreState>(initialState);

// System log for debug console
export interface LogEntry {
	message: string;
	level: "info" | "warn" | "error" | "success";
	timestamp: number;
}

export const systemLog = writable<LogEntry[]>([]);

export function log(message: string, level: LogEntry["level"] = "info"): void {
	systemLog.update((entries) => [
		...entries.slice(-100), // Keep last 100 entries
		{ message, level, timestamp: Date.now() },
	]);
}

// Simulation manager instance (not reactive, just a reference)
let manager: SimulationManager | null = null;
let animationFrameId: number | null = null;
let lastFrameTime = 0;
let frameCount = 0;
let fpsUpdateTime = 0;
let stepsPerFrame = 1;

export function getManager(): SimulationManager | null {
	return manager;
}

export function setStepsPerFrame(steps: number): void {
	stepsPerFrame = Math.max(1, Math.min(10, steps));
}

export async function initializeSimulation(): Promise<void> {
	manager = new SimulationManager(DEFAULT_CONFIG, DEFAULT_SEED);
	await manager.initialize();

	const state = manager.getState();
	simulationStore.update((s) => ({
		...s,
		initialized: true,
		step: manager!.getStep(),
		time: manager!.getTime(),
		totalMass: manager!.totalMass(),
		backend: manager!.getBackend(),
		gpuAvailable: manager!.isGpuAvailable(),
		config: DEFAULT_CONFIG,
		state,
	}));
}

export function play(): void {
	if (!manager) return;
	const current = get(simulationStore);
	if (current.playing) return;

	simulationStore.update((s) => ({ ...s, playing: true }));
	lastFrameTime = performance.now();
	fpsUpdateTime = lastFrameTime;
	frameCount = 0;
	animate(lastFrameTime);
	log("Simulation started", "info");
}

export function pause(): void {
	simulationStore.update((s) => ({ ...s, playing: false }));
	if (animationFrameId !== null) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
	log("Simulation paused", "info");
}

export async function step(): Promise<void> {
	if (!manager) return;
	await manager.step();
	updateState();
}

export function reset(seed?: Seed): void {
	if (!manager) return;
	manager.reset(seed);
	updateState();
	log("Simulation reset", "info");
}

export async function switchBackend(backend: BackendType): Promise<boolean> {
	if (!manager) return false;
	const success = await manager.switchBackend(backend);
	if (success) {
		simulationStore.update((s) => ({ ...s, backend }));
		log(`Switched to ${backend.toUpperCase()} backend`, "success");
	} else {
		log(`Failed to switch to ${backend} backend`, "error");
	}
	return success;
}

async function animate(currentTime: number): Promise<void> {
	const current = get(simulationStore);
	if (!current.playing || !manager) return;

	const frameTime = currentTime - lastFrameTime;
	lastFrameTime = currentTime;

	await manager.run(stepsPerFrame);
	updateState();

	// FPS calculation
	frameCount++;
	if (currentTime - fpsUpdateTime >= 1000) {
		simulationStore.update((s) => ({
			...s,
			fps: frameCount,
			frameTime: frameTime,
		}));
		frameCount = 0;
		fpsUpdateTime = currentTime;
	}

	animationFrameId = requestAnimationFrame((t) => animate(t));
}

function updateState(): void {
	if (!manager) return;
	const state = manager.getState();
	simulationStore.update((s) => ({
		...s,
		step: manager!.getStep(),
		time: manager!.getTime(),
		totalMass: manager!.totalMass(),
		state,
	}));
}

// Drawing operations
export function drawAt(x: number, y: number, size: number, intensity: number): void {
	if (!manager) return;
	manager.drawAt(x, y, size, intensity);
	updateState();
}

export function eraseAt(x: number, y: number, size: number): void {
	if (!manager) return;
	manager.eraseAt(x, y, size);
	updateState();
}

// Derived stores for computed values
export const formattedTime = derived(simulationStore, ($s) => $s.time.toFixed(2));
export const formattedMass = derived(simulationStore, ($s) =>
	$s.totalMass.toLocaleString(undefined, { maximumFractionDigits: 0 }),
);
export const formattedStep = derived(simulationStore, ($s) => $s.step.toString().padStart(8, "0"));
