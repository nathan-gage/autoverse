// Flow Lenia Viewer Type Definitions

export interface SimulationConfig {
	width: number;
	height: number;
	channels: number;
	dt: number;
	kernel_radius: number;
	kernels: KernelConfig[];
	flow: FlowConfig;
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

export type ColorScheme = "grayscale" | "thermal" | "viridis" | "theme";

export interface ViewerSettings {
	colorScheme: ColorScheme;
	showGrid: boolean;
	showSelection: boolean;
	brushSize: number;
	brushIntensity: number;
	backend: BackendType;
}

// Evolution Types
export interface EvolutionConfig {
	base_config: SimulationConfig;
	seed_pattern_type: "Blob" | "Ring" | "MultiBlob";
	constraints: GenomeConstraints;
	fitness: FitnessConfig;
	evaluation: EvaluationConfig;
	population: PopulationConfig;
	algorithm: SearchAlgorithm;
	archive: ArchiveConfig;
	max_generations: number;
	target_fitness?: number;
	stagnation_limit?: number;
	random_seed?: number;
}

export interface GenomeConstraints {
	radius?: { min: number; max: number };
	amplitude?: { min: number; max: number };
	x?: { min: number; max: number };
	y?: { min: number; max: number };
	mu?: { min: number; max: number };
	sigma?: { min: number; max: number };
	beta_a?: { min: number; max: number };
}

export interface FitnessConfig {
	metrics: FitnessMetricWeight[];
	aggregation: "WeightedSum" | "Product" | "Min";
}

export interface FitnessMetricWeight {
	metric: FitnessMetric;
	weight: number;
}

export type FitnessMetric =
	| "Persistence"
	| "Compactness"
	| "Locomotion"
	| "Complexity"
	| "MassConcentration"
	| "Stability"
	| { Periodicity: { period: number; tolerance: number } }
	| { GliderScore: { min_displacement: number } }
	| { OscillatorScore: { max_period: number; threshold: number } };

export interface EvaluationConfig {
	steps: number;
	sample_interval: number;
	warmup_steps: number;
}

export interface PopulationConfig {
	size: number;
	elitism: number;
}

export interface SearchAlgorithm {
	type: "GeneticAlgorithm";
	config: GeneticAlgorithmConfig;
}

export interface GeneticAlgorithmConfig {
	mutation_rate: number;
	crossover_rate: number;
	selection_method: "Tournament" | "RankBased" | "Roulette";
	tournament_size?: number;
}

export interface ArchiveConfig {
	enabled: boolean;
	max_size: number;
	diversity_threshold: number;
}

export interface EvolutionProgress {
	generation: number;
	best_fitness: number;
	mean_fitness: number;
	phase: "Initializing" | "Evaluating" | "Selecting" | "Complete";
	evaluations: number;
	time_elapsed_secs: number;
	best_candidate?: CandidateSnapshot;
	top_candidates?: CandidateSnapshot[];
}

export interface CandidateSnapshot {
	id: number;
	fitness: number;
	generation: number;
}

export interface EvolutionResult {
	best_fitness: number;
	generations: number;
	total_evaluations: number;
	time_elapsed_secs: number;
	stop_reason: "TargetReached" | "MaxGenerations" | "Stagnation" | "Cancelled";
}

export interface BestCandidateState {
	width: number;
	height: number;
	data: Float32Array;
}
