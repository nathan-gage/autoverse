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
	algorithm: SearchAlgorithm;
	fitness: FitnessConfig;
	population: PopulationConfig;
	evaluation: EvaluationConfig;
	constraints?: GenomeConstraints;
	archive?: ArchiveConfig;
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
	max_generations: number;
	target_fitness?: number;
	stagnation_limit?: number;
}

export interface SearchAlgorithm {
	type: "GeneticAlgorithm";
	config: GeneticAlgorithmConfig;
}

export interface GeneticAlgorithmConfig {
	mutation_rate: number;
	crossover_rate: number;
	mutation_strength?: number;
	elitism?: number;
	selection: SelectionMethod;
}

export type SelectionMethod =
	| { method: "Tournament"; size?: number }
	| { method: "RankBased" }
	| { method: "RouletteWheel" };

export interface ArchiveConfig {
	enabled: boolean;
	max_size: number;
	diversity_threshold: number;
}

export interface EvolutionProgress {
	generation: number;
	total_generations: number;
	evaluations_completed: number;
	evaluations_total: number;
	best_fitness: number;
	avg_fitness: number;
	generation_best: number;
	stagnation_count: number;
	best_candidate?: CandidateSnapshot;
	top_candidates: CandidateSnapshot[];
	history: EvolutionHistory;
	phase: EvolutionPhase;
}

export type EvolutionPhase =
	| "Initializing"
	| "Evaluating"
	| "Selecting"
	| "Reproducing"
	| "Complete"
	| "Stopped";

export interface CandidateSnapshot {
	id: number;
	fitness: number;
	metric_scores: MetricScore[];
	genome: Genome;
	config: SimulationConfig;
	seed: Seed;
	generation: number;
	parents: number[];
	behavior: BehaviorStats;
}

export interface MetricScore {
	name: string;
	score: number;
	weight: number;
	weighted_score: number;
}

export interface BehaviorStats {
	final_mass: number;
	initial_mass: number;
	center_of_mass_trajectory: [number, number][];
	total_displacement: number;
	radius_over_time: number[];
	final_radius: number;
	active_cells: number;
	max_activation: number;
}

export interface Genome {
	kernels: KernelGenome[];
	flow: FlowGenome;
	seed?: SeedGenome;
}

export interface KernelGenome {
	radius: number;
	rings: RingGenome[];
	weight: number;
	mu: number;
	sigma: number;
	source_channel: number;
	target_channel: number;
}

export interface RingGenome {
	amplitude: number;
	distance: number;
	width: number;
}

export interface FlowGenome {
	beta_a: number;
	n: number;
	distribution_size: number;
}

export type SeedGenome =
	| { type: "GaussianBlob"; center: [number, number]; radius: number; amplitude: number }
	| {
			type: "Ring";
			center: [number, number];
			inner_radius: number;
			outer_radius: number;
			amplitude: number;
	  }
	| { type: "MultiBlob"; blobs: BlobGenome[] };

export interface BlobGenome {
	center: [number, number];
	radius: number;
	amplitude: number;
}

export interface EvolutionResult {
	best: CandidateSnapshot;
	archive: CandidateSnapshot[];
	stats: EvolutionStats;
	history: EvolutionHistory;
}

export interface EvolutionStats {
	generations: number;
	total_evaluations: number;
	best_fitness: number;
	final_avg_fitness: number;
	elapsed_seconds: number;
	evaluations_per_second: number;
	stop_reason: "TargetReached" | "MaxGenerations" | "Stagnation" | "Cancelled";
}

export interface EvolutionHistory {
	best_fitness: number[];
	avg_fitness: number[];
	fitness_std: number[];
	diversity: number[];
}

export interface BestCandidateState {
	channels: number[][];
	width: number;
	height: number;
	time: number;
	step: number;
}
