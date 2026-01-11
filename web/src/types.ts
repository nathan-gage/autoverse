// Flow Lenia Viewer Type Definitions

// ============================================================================
// Parameter Embedding Types
// ============================================================================

export interface EmbeddingConfig {
	enabled: boolean;
	mixing_temperature: number;
	linear_mixing: boolean;
}

export interface CellParams {
	mu: number;
	sigma: number;
	weight: number;
	beta_a: number;
	n: number;
}

export interface SpeciesConfig {
	name: string;
	params: CellParams;
	initial_region?: [number, number, number]; // [center_x, center_y, radius]
}

// ============================================================================
// Simulation Configuration
// ============================================================================

export interface SimulationConfig {
	width: number;
	height: number;
	channels: number;
	dt: number;
	kernel_radius: number;
	kernels: KernelConfig[];
	flow: FlowConfig;
	embedding?: EmbeddingConfig;
}

export interface KernelConfig {
	radius: number;
	rings: RingConfig[];
	weight: number;
	mu: number;
	sigma: number;
	source_channel: number;
	target_channel: number;
}

export interface RingConfig {
	amplitude: number;
	distance: number;
	width: number;
}

export interface FlowConfig {
	beta_a: number;
	n: number;
	distribution_size: number;
}

export interface Seed {
	pattern: Pattern;
}

export type Pattern =
	| GaussianBlobPattern
	| MultiBlobPattern
	| NoisePattern
	| RingPattern
	| CustomPattern;

export interface GaussianBlobPattern {
	type: "GaussianBlob";
	center: [number, number];
	radius: number;
	amplitude: number;
	channel: number;
}

export interface MultiBlobPattern {
	type: "MultiBlob";
	blobs: Array<{
		center: [number, number];
		radius: number;
		amplitude: number;
		channel: number;
	}>;
}

export interface NoisePattern {
	type: "Noise";
	seed: number;
	amplitude: number;
	channel: number;
}

export interface RingPattern {
	type: "Ring";
	center: [number, number];
	inner_radius: number;
	outer_radius: number;
	amplitude: number;
	channel: number;
}

export interface CustomPattern {
	type: "Custom";
	// Rust expects tuples: (x, y, channel, value)
	values: Array<[number, number, number, number]>;
}

export interface SimulationState {
	channels: number[][];
	width: number;
	height: number;
	time: number;
	step: number;
}

export interface Preset {
	id: string;
	name: string;
	description?: string;
	thumbnail?: string;
	region: PresetRegion;
	createdAt: number;
}

export interface PresetRegion {
	width: number;
	height: number;
	channels: number[][];
	sourceX: number;
	sourceY: number;
}

export interface SelectionRect {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}

export interface DraggedCreature {
	preset: Preset;
	offsetX: number;
	offsetY: number;
}

export type InteractionMode = "view" | "select" | "draw" | "erase";

export type BackendType = "cpu" | "gpu";

export type VisualizationMode = "mass" | "mu" | "sigma" | "weight" | "beta_a" | "n";

export interface ViewerSettings {
	colorScheme: "grayscale" | "thermal" | "viridis";
	showGrid: boolean;
	showSelection: boolean;
	brushSize: number;
	brushIntensity: number;
	backend: BackendType;
	visualizationMode: VisualizationMode;
}

export interface EmbeddedSimulationState extends SimulationState {
	paramFields?: {
		mu: number[];
		sigma: number[];
		weight: number[];
		beta_a: number[];
		n: number[];
	};
}
