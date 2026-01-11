// Settings store - UI preferences and interaction state
import { writable } from "svelte/store";
import type { ColorScheme, InteractionMode } from "../types";

// Visualization modes - includes future parameter embedding fields
export type VisualizationMode = "mass" | "mu" | "sigma" | "weight" | "beta_a" | "n";

export interface SettingsState {
	// Interaction
	mode: InteractionMode;
	brushSize: number;
	brushIntensity: number;

	// Visualization
	colorScheme: ColorScheme;
	visualizationMode: VisualizationMode;
	showGrid: boolean;
	showScanlines: boolean;
	showSelection: boolean;

	// Canvas
	zoom: number;
	panX: number;
	panY: number;

	// Layout
	showPanels: boolean;
}

const initialSettings: SettingsState = {
	mode: "view",
	brushSize: 5,
	brushIntensity: 0.8,
	colorScheme: "theme",
	visualizationMode: "mass",
	showGrid: false,
	showScanlines: true,
	showSelection: true,
	zoom: 1,
	panX: 0,
	panY: 0,
	showPanels: true,
};

export const settings = writable<SettingsState>(initialSettings);

// Helper functions for updating settings
export function setMode(mode: InteractionMode): void {
	settings.update((s) => ({ ...s, mode }));
}

export function setBrushSize(size: number): void {
	settings.update((s) => ({ ...s, brushSize: Math.max(1, Math.min(50, size)) }));
}

export function setBrushIntensity(intensity: number): void {
	settings.update((s) => ({ ...s, brushIntensity: Math.max(0, Math.min(1, intensity)) }));
}

export function setColorScheme(scheme: ColorScheme): void {
	settings.update((s) => ({ ...s, colorScheme: scheme }));
}

export function setVisualizationMode(mode: VisualizationMode): void {
	settings.update((s) => ({ ...s, visualizationMode: mode }));
}

export function toggleScanlines(): void {
	settings.update((s) => ({ ...s, showScanlines: !s.showScanlines }));
}

export function toggleGrid(): void {
	settings.update((s) => ({ ...s, showGrid: !s.showGrid }));
}

export function togglePanels(): void {
	settings.update((s) => ({ ...s, showPanels: !s.showPanels }));
}

// Future: Parameter embedding settings (PR #28)
export interface EmbeddingConfig {
	enabled: boolean;
	mixingTemperature: number;
	linearMixing: boolean;
}

export interface SpeciesConfig {
	name: string;
	params: {
		mu: number;
		sigma: number;
		weight: number;
		beta_a: number;
		n: number;
	};
	initialRegion?: [number, number, number]; // x, y, radius
}

export const embeddingConfig = writable<EmbeddingConfig>({
	enabled: false,
	mixingTemperature: 1.0,
	linearMixing: false,
});

export const species = writable<SpeciesConfig[]>([]);

// Future: Evolution state (Issue #5)
export interface FitnessMetrics {
	compactness: number;
	persistence: number;
	locomotion: number;
	periodicity: number;
	complexity: number;
}

export interface SearchCandidate {
	id: string;
	fitness: FitnessMetrics;
	generation: number;
}

export const evolutionState = writable({
	running: false,
	generation: 0,
	candidates: [] as SearchCandidate[],
	bestFitness: 0,
	archive: [] as SearchCandidate[],
});
