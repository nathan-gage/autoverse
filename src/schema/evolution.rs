//! Evolution configuration types for automated pattern discovery.
//!
//! This module provides types for configuring evolutionary search algorithms
//! that discover interesting Flow Lenia patterns (gliders, oscillators, solitons).

use serde::{Deserialize, Serialize};

use super::{FlowConfig, KernelConfig, Pattern, RingConfig, Seed, SimulationConfig};

/// Top-level configuration for evolutionary pattern search.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionConfig {
    /// Base simulation configuration (grid size, dt, etc.).
    /// Kernel and flow parameters will be evolved.
    pub base_config: SimulationConfig,
    /// Search algorithm to use.
    pub algorithm: SearchAlgorithm,
    /// Fitness metrics and their weights.
    pub fitness: FitnessConfig,
    /// Population and generation settings.
    pub population: PopulationConfig,
    /// Evaluation settings (steps per candidate, etc.).
    pub evaluation: EvaluationConfig,
    /// Genome constraints (parameter bounds).
    #[serde(default)]
    pub constraints: GenomeConstraints,
    /// Archive configuration for storing discovered patterns.
    #[serde(default)]
    pub archive: ArchiveConfig,
    /// Random seed for reproducibility.
    #[serde(default)]
    pub random_seed: Option<u64>,
}

impl Default for EvolutionConfig {
    fn default() -> Self {
        Self {
            base_config: SimulationConfig {
                width: 128,
                height: 128,
                channels: 1,
                dt: 0.2,
                kernel_radius: 13,
                kernels: vec![KernelConfig::default()],
                flow: FlowConfig::default(),
                embedding: Default::default(),
            },
            algorithm: SearchAlgorithm::default(),
            fitness: FitnessConfig::default(),
            population: PopulationConfig::default(),
            evaluation: EvaluationConfig::default(),
            constraints: GenomeConstraints::default(),
            archive: ArchiveConfig::default(),
            random_seed: None,
        }
    }
}

/// Search algorithm selection.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SearchAlgorithm {
    /// Standard genetic algorithm with crossover and mutation.
    GeneticAlgorithm(GeneticAlgorithmConfig),
    /// CMA-ES: Covariance Matrix Adaptation Evolution Strategy.
    /// Better for continuous optimization in high-dimensional spaces.
    CmaEs(CmaEsConfig),
    /// Novelty search: rewards behavioral diversity over fitness.
    NoveltySearch(NoveltySearchConfig),
    /// MAP-Elites: maintains archive of diverse solutions.
    MapElites(MapElitesConfig),
}

impl Default for SearchAlgorithm {
    fn default() -> Self {
        Self::GeneticAlgorithm(GeneticAlgorithmConfig::default())
    }
}

/// Genetic Algorithm configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneticAlgorithmConfig {
    /// Selection method.
    #[serde(default)]
    pub selection: SelectionMethod,
    /// Crossover probability (0.0-1.0).
    #[serde(default = "default_crossover_rate")]
    pub crossover_rate: f32,
    /// Mutation probability per gene (0.0-1.0).
    #[serde(default = "default_mutation_rate")]
    pub mutation_rate: f32,
    /// Mutation strength (standard deviation for Gaussian mutation).
    #[serde(default = "default_mutation_strength")]
    pub mutation_strength: f32,
    /// Elitism: number of best individuals to preserve unchanged.
    #[serde(default = "default_elitism")]
    pub elitism: usize,
}

impl Default for GeneticAlgorithmConfig {
    fn default() -> Self {
        Self {
            selection: SelectionMethod::default(),
            crossover_rate: default_crossover_rate(),
            mutation_rate: default_mutation_rate(),
            mutation_strength: default_mutation_strength(),
            elitism: default_elitism(),
        }
    }
}

fn default_crossover_rate() -> f32 {
    0.8
}
fn default_mutation_rate() -> f32 {
    0.1
}
fn default_mutation_strength() -> f32 {
    0.1
}
fn default_elitism() -> usize {
    2
}

/// Selection method for genetic algorithm.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "method")]
pub enum SelectionMethod {
    /// Tournament selection with configurable size.
    Tournament {
        #[serde(default = "default_tournament_size")]
        size: usize,
    },
    /// Rank-based selection.
    RankBased,
    /// Roulette wheel (fitness-proportionate) selection.
    RouletteWheel,
}

impl Default for SelectionMethod {
    fn default() -> Self {
        Self::Tournament {
            size: default_tournament_size(),
        }
    }
}

fn default_tournament_size() -> usize {
    3
}

/// CMA-ES configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CmaEsConfig {
    /// Initial step size (sigma).
    #[serde(default = "default_cma_sigma")]
    pub initial_sigma: f32,
    /// Population size multiplier (lambda = multiplier * n).
    /// If None, uses CMA-ES default formula.
    pub lambda_multiplier: Option<f32>,
}

impl Default for CmaEsConfig {
    fn default() -> Self {
        Self {
            initial_sigma: default_cma_sigma(),
            lambda_multiplier: None,
        }
    }
}

fn default_cma_sigma() -> f32 {
    0.3
}

/// Novelty search configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoveltySearchConfig {
    /// Archive threshold for adding individuals.
    #[serde(default = "default_novelty_threshold")]
    pub novelty_threshold: f32,
    /// Number of nearest neighbors for novelty calculation.
    #[serde(default = "default_k_nearest")]
    pub k_nearest: usize,
    /// Behavior descriptor to use.
    #[serde(default)]
    pub behavior_descriptor: BehaviorDescriptor,
}

impl Default for NoveltySearchConfig {
    fn default() -> Self {
        Self {
            novelty_threshold: default_novelty_threshold(),
            k_nearest: default_k_nearest(),
            behavior_descriptor: BehaviorDescriptor::default(),
        }
    }
}

fn default_novelty_threshold() -> f32 {
    0.1
}
fn default_k_nearest() -> usize {
    15
}

/// MAP-Elites configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MapElitesConfig {
    /// First behavioral dimension.
    pub dimension_x: BehaviorDimension,
    /// Second behavioral dimension.
    pub dimension_y: BehaviorDimension,
    /// Number of bins per dimension.
    #[serde(default = "default_map_bins")]
    pub bins_per_dimension: usize,
}

impl Default for MapElitesConfig {
    fn default() -> Self {
        Self {
            dimension_x: BehaviorDimension::Compactness,
            dimension_y: BehaviorDimension::Locomotion,
            bins_per_dimension: default_map_bins(),
        }
    }
}

fn default_map_bins() -> usize {
    50
}

/// Behavioral dimension for MAP-Elites.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum BehaviorDimension {
    /// Pattern compactness (inverse of spread).
    Compactness,
    /// Pattern locomotion (displacement of center of mass).
    Locomotion,
    /// Pattern periodicity (similarity to initial state).
    Periodicity,
    /// Pattern complexity (variance in structure).
    Complexity,
    /// Mass concentration (peak-to-average ratio).
    MassConcentration,
    /// Pattern size (number of active cells).
    PatternSize,
}

/// Behavior descriptor for novelty search.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(tag = "type")]
pub enum BehaviorDescriptor {
    /// Use final mass distribution moments.
    #[default]
    MassDistribution,
    /// Use trajectory of center of mass.
    CenterOfMassTrajectory {
        /// Number of trajectory samples.
        samples: usize,
    },
    /// Use final pattern image (downsampled).
    PatternImage {
        /// Downsampled resolution.
        resolution: usize,
    },
}

/// Fitness configuration with weighted metrics.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FitnessConfig {
    /// Fitness metrics and their weights.
    pub metrics: Vec<WeightedMetric>,
    /// Minimum fitness threshold for archiving.
    #[serde(default)]
    pub archive_threshold: Option<f32>,
    /// Whether to normalize metrics before combining.
    #[serde(default = "default_normalize")]
    pub normalize: bool,
}

impl Default for FitnessConfig {
    fn default() -> Self {
        Self {
            metrics: vec![
                WeightedMetric {
                    metric: FitnessMetric::Persistence,
                    weight: 1.0,
                },
                WeightedMetric {
                    metric: FitnessMetric::Compactness,
                    weight: 0.5,
                },
            ],
            archive_threshold: None,
            normalize: default_normalize(),
        }
    }
}

fn default_normalize() -> bool {
    true
}

/// A fitness metric with associated weight.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeightedMetric {
    /// The fitness metric.
    pub metric: FitnessMetric,
    /// Weight for this metric in combined fitness.
    pub weight: f32,
}

/// Individual fitness metrics for evaluating patterns.
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum FitnessMetric {
    /// Pattern survives many timesteps without dissipating.
    /// Score: proportion of initial mass that remains concentrated.
    Persistence,

    /// Pattern maintains spatial localization (low spread).
    /// Score: inverse of pattern radius (second moment of mass distribution).
    Compactness,

    /// Center of mass moves over time.
    /// Score: total displacement of center of mass.
    Locomotion,

    /// State returns to near-initial configuration after N steps.
    /// Score: similarity between state at step 0 and step N.
    Periodicity {
        /// Period to check for.
        period: u64,
        /// Tolerance for similarity.
        tolerance: f32,
    },

    /// High variance in local structure (not uniform).
    /// Score: spatial variance of activation values.
    Complexity,

    /// High peak-to-average ratio (concentrated mass).
    /// Score: max activation / mean activation.
    MassConcentration,

    /// Pattern maintains consistent shape while moving.
    /// Combines locomotion with shape consistency.
    GliderScore {
        /// Minimum displacement to count as a glider.
        min_displacement: f32,
    },

    /// Pattern returns to similar state (oscillator detection).
    /// Checks multiple potential periods.
    OscillatorScore {
        /// Maximum period to check.
        max_period: u64,
        /// Similarity threshold.
        threshold: f32,
    },

    /// Mass remains positive and bounded.
    /// Penalizes negative values and extreme peaks.
    Stability,

    /// Custom fitness from external function.
    /// Score provided by user-defined callback.
    Custom {
        /// Name identifier for the custom metric.
        name: String,
    },
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
enum FitnessMetricTagged {
    Persistence,
    Compactness,
    Locomotion,
    Periodicity { period: u64, tolerance: f32 },
    Complexity,
    MassConcentration,
    GliderScore { min_displacement: f32 },
    OscillatorScore { max_period: u64, threshold: f32 },
    Stability,
    Custom { name: String },
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum FitnessMetricRepr {
    String(String),
    Tagged(FitnessMetricTagged),
}

impl<'de> Deserialize<'de> for FitnessMetric {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let repr = FitnessMetricRepr::deserialize(deserializer)?;
        match repr {
            FitnessMetricRepr::String(value) => match value.as_str() {
                "Persistence" => Ok(FitnessMetric::Persistence),
                "Compactness" => Ok(FitnessMetric::Compactness),
                "Locomotion" => Ok(FitnessMetric::Locomotion),
                "Complexity" => Ok(FitnessMetric::Complexity),
                "MassConcentration" => Ok(FitnessMetric::MassConcentration),
                "Stability" => Ok(FitnessMetric::Stability),
                other => Err(serde::de::Error::custom(format!(
                    "Unknown fitness metric string: {other}"
                ))),
            },
            FitnessMetricRepr::Tagged(tagged) => Ok(match tagged {
                FitnessMetricTagged::Persistence => FitnessMetric::Persistence,
                FitnessMetricTagged::Compactness => FitnessMetric::Compactness,
                FitnessMetricTagged::Locomotion => FitnessMetric::Locomotion,
                FitnessMetricTagged::Periodicity { period, tolerance } => {
                    FitnessMetric::Periodicity { period, tolerance }
                }
                FitnessMetricTagged::Complexity => FitnessMetric::Complexity,
                FitnessMetricTagged::MassConcentration => FitnessMetric::MassConcentration,
                FitnessMetricTagged::GliderScore { min_displacement } => {
                    FitnessMetric::GliderScore { min_displacement }
                }
                FitnessMetricTagged::OscillatorScore {
                    max_period,
                    threshold,
                } => FitnessMetric::OscillatorScore {
                    max_period,
                    threshold,
                },
                FitnessMetricTagged::Stability => FitnessMetric::Stability,
                FitnessMetricTagged::Custom { name } => FitnessMetric::Custom { name },
            }),
        }
    }
}

/// Population and generation settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PopulationConfig {
    /// Number of individuals in population.
    #[serde(default = "default_population_size")]
    pub size: usize,
    /// Maximum number of generations.
    #[serde(default = "default_max_generations")]
    pub max_generations: usize,
    /// Target fitness to stop early.
    pub target_fitness: Option<f32>,
    /// Stagnation limit: stop if no improvement for N generations.
    #[serde(default)]
    pub stagnation_limit: Option<usize>,
}

impl Default for PopulationConfig {
    fn default() -> Self {
        Self {
            size: default_population_size(),
            max_generations: default_max_generations(),
            target_fitness: None,
            stagnation_limit: None,
        }
    }
}

fn default_population_size() -> usize {
    50
}
fn default_max_generations() -> usize {
    100
}

/// Evaluation settings for fitness computation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvaluationConfig {
    /// Number of simulation steps per candidate.
    #[serde(default = "default_steps_per_eval")]
    pub steps: u64,
    /// Warmup steps before measuring fitness.
    #[serde(default)]
    pub warmup_steps: u64,
    /// Sample interval for trajectory-based metrics.
    #[serde(default = "default_sample_interval")]
    pub sample_interval: u64,
    /// Whether to use GPU acceleration when available.
    #[serde(default = "default_use_gpu")]
    pub use_gpu: bool,
    /// Number of parallel evaluations (0 = auto-detect).
    #[serde(default)]
    pub parallel_workers: usize,
}

impl Default for EvaluationConfig {
    fn default() -> Self {
        Self {
            steps: default_steps_per_eval(),
            warmup_steps: 0,
            sample_interval: default_sample_interval(),
            use_gpu: default_use_gpu(),
            parallel_workers: 0,
        }
    }
}

fn default_steps_per_eval() -> u64 {
    200
}
fn default_sample_interval() -> u64 {
    10
}
fn default_use_gpu() -> bool {
    false
}

/// Genome constraints (parameter bounds).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenomeConstraints {
    /// Bounds for kernel mu parameter.
    #[serde(default = "default_mu_bounds")]
    pub mu_bounds: (f32, f32),
    /// Bounds for kernel sigma parameter.
    #[serde(default = "default_sigma_bounds")]
    pub sigma_bounds: (f32, f32),
    /// Bounds for kernel weight.
    #[serde(default = "default_weight_bounds")]
    pub weight_bounds: (f32, f32),
    /// Bounds for ring amplitude.
    #[serde(default = "default_amplitude_bounds")]
    pub amplitude_bounds: (f32, f32),
    /// Bounds for ring distance.
    #[serde(default = "default_distance_bounds")]
    pub distance_bounds: (f32, f32),
    /// Bounds for ring width.
    #[serde(default = "default_ring_width_bounds")]
    pub ring_width_bounds: (f32, f32),
    /// Bounds for flow beta_a parameter.
    #[serde(default = "default_beta_a_bounds")]
    pub beta_a_bounds: (f32, f32),
    /// Bounds for flow n parameter.
    #[serde(default = "default_n_bounds")]
    pub n_bounds: (f32, f32),
    /// Minimum and maximum number of rings per kernel.
    #[serde(default = "default_ring_count")]
    pub ring_count_bounds: (usize, usize),
    /// Whether to evolve the initial seed pattern.
    #[serde(default)]
    pub evolve_seed: bool,
    /// Seed pattern constraints (if evolving seed).
    #[serde(default)]
    pub seed_constraints: Option<SeedConstraints>,
}

impl Default for GenomeConstraints {
    fn default() -> Self {
        Self {
            mu_bounds: default_mu_bounds(),
            sigma_bounds: default_sigma_bounds(),
            weight_bounds: default_weight_bounds(),
            amplitude_bounds: default_amplitude_bounds(),
            distance_bounds: default_distance_bounds(),
            ring_width_bounds: default_ring_width_bounds(),
            beta_a_bounds: default_beta_a_bounds(),
            n_bounds: default_n_bounds(),
            ring_count_bounds: default_ring_count(),
            evolve_seed: false,
            seed_constraints: None,
        }
    }
}

fn default_mu_bounds() -> (f32, f32) {
    (0.05, 0.5)
}
fn default_sigma_bounds() -> (f32, f32) {
    (0.005, 0.1)
}
fn default_weight_bounds() -> (f32, f32) {
    (0.1, 2.0)
}
fn default_amplitude_bounds() -> (f32, f32) {
    (0.1, 2.0)
}
fn default_distance_bounds() -> (f32, f32) {
    (0.1, 0.9)
}
fn default_ring_width_bounds() -> (f32, f32) {
    (0.05, 0.4)
}
fn default_beta_a_bounds() -> (f32, f32) {
    (0.1, 2.0)
}
fn default_n_bounds() -> (f32, f32) {
    (1.0, 4.0)
}
fn default_ring_count() -> (usize, usize) {
    (1, 4)
}

/// Constraints for seed pattern evolution.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SeedConstraints {
    /// Allowed seed pattern types.
    pub allowed_patterns: Vec<SeedPatternType>,
    /// Bounds for pattern radius.
    #[serde(default = "default_seed_radius_bounds")]
    pub radius_bounds: (f32, f32),
    /// Bounds for pattern amplitude.
    #[serde(default = "default_seed_amplitude_bounds")]
    pub amplitude_bounds: (f32, f32),
}

impl Default for SeedConstraints {
    fn default() -> Self {
        Self {
            allowed_patterns: vec![SeedPatternType::GaussianBlob],
            radius_bounds: default_seed_radius_bounds(),
            amplitude_bounds: default_seed_amplitude_bounds(),
        }
    }
}

fn default_seed_radius_bounds() -> (f32, f32) {
    (0.05, 0.2)
}
fn default_seed_amplitude_bounds() -> (f32, f32) {
    (0.5, 2.0)
}

/// Seed pattern types that can be evolved.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum SeedPatternType {
    GaussianBlob,
    Ring,
    MultiBlob,
}

/// Archive configuration for storing discovered patterns.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchiveConfig {
    /// Maximum patterns to keep in archive.
    #[serde(default = "default_archive_size")]
    pub max_size: usize,
    /// Output directory for saved patterns.
    #[serde(default)]
    pub output_dir: Option<String>,
    /// Save patterns as JSON files.
    #[serde(default = "default_save_json")]
    pub save_json: bool,
    /// Diversity threshold for adding to archive.
    /// Patterns must be at least this different from existing archive entries.
    #[serde(default = "default_diversity_threshold")]
    pub diversity_threshold: f32,
}

impl Default for ArchiveConfig {
    fn default() -> Self {
        Self {
            max_size: default_archive_size(),
            output_dir: None,
            save_json: default_save_json(),
            diversity_threshold: default_diversity_threshold(),
        }
    }
}

fn default_archive_size() -> usize {
    100
}
fn default_save_json() -> bool {
    true
}
fn default_diversity_threshold() -> f32 {
    0.1
}

// ============================================================================
// Genome Representation
// ============================================================================

/// Genome representing evolvable parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Genome {
    /// Kernel configurations (one per kernel).
    pub kernels: Vec<KernelGenome>,
    /// Flow configuration.
    pub flow: FlowGenome,
    /// Optional seed pattern (if evolving seeds).
    pub seed: Option<SeedGenome>,
}

/// Kernel genome (evolvable kernel parameters).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KernelGenome {
    /// Relative radius.
    pub radius: f32,
    /// Ring parameters.
    pub rings: Vec<RingGenome>,
    /// Weight for growth output.
    pub weight: f32,
    /// Growth mu parameter.
    pub mu: f32,
    /// Growth sigma parameter.
    pub sigma: f32,
    /// Source channel.
    pub source_channel: usize,
    /// Target channel.
    pub target_channel: usize,
}

/// Ring genome (evolvable ring parameters).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RingGenome {
    pub amplitude: f32,
    pub distance: f32,
    pub width: f32,
}

/// Flow genome (evolvable flow parameters).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlowGenome {
    pub beta_a: f32,
    pub n: f32,
    pub distribution_size: f32,
}

/// Seed genome (evolvable seed parameters).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SeedGenome {
    GaussianBlob {
        center: (f32, f32),
        radius: f32,
        amplitude: f32,
    },
    Ring {
        center: (f32, f32),
        inner_radius: f32,
        outer_radius: f32,
        amplitude: f32,
    },
    MultiBlob {
        blobs: Vec<BlobGenome>,
    },
}

/// Blob genome for MultiBlob patterns.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlobGenome {
    pub center: (f32, f32),
    pub radius: f32,
    pub amplitude: f32,
}

impl Genome {
    /// Create genome from simulation config and seed.
    pub fn from_config(config: &SimulationConfig, seed: Option<&Seed>) -> Self {
        let kernels = config
            .kernels
            .iter()
            .map(|k| KernelGenome {
                radius: k.radius,
                rings: k
                    .rings
                    .iter()
                    .map(|r| RingGenome {
                        amplitude: r.amplitude,
                        distance: r.distance,
                        width: r.width,
                    })
                    .collect(),
                weight: k.weight,
                mu: k.mu,
                sigma: k.sigma,
                source_channel: k.source_channel,
                target_channel: k.target_channel,
            })
            .collect();

        let flow = FlowGenome {
            beta_a: config.flow.beta_a,
            n: config.flow.n,
            distribution_size: config.flow.distribution_size,
        };

        let seed_genome = seed.map(|s| match &s.pattern {
            Pattern::GaussianBlob {
                center,
                radius,
                amplitude,
                ..
            } => SeedGenome::GaussianBlob {
                center: *center,
                radius: *radius,
                amplitude: *amplitude,
            },
            Pattern::Ring {
                center,
                inner_radius,
                outer_radius,
                amplitude,
                ..
            } => SeedGenome::Ring {
                center: *center,
                inner_radius: *inner_radius,
                outer_radius: *outer_radius,
                amplitude: *amplitude,
            },
            Pattern::MultiBlob { blobs } => SeedGenome::MultiBlob {
                blobs: blobs
                    .iter()
                    .map(|b| BlobGenome {
                        center: b.center,
                        radius: b.radius,
                        amplitude: b.amplitude,
                    })
                    .collect(),
            },
            _ => SeedGenome::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.1,
                amplitude: 1.0,
            },
        });

        Self {
            kernels,
            flow,
            seed: seed_genome,
        }
    }

    /// Convert genome to simulation config.
    pub fn to_config(&self, base: &SimulationConfig) -> SimulationConfig {
        let kernels = self
            .kernels
            .iter()
            .map(|k| KernelConfig {
                radius: k.radius,
                rings: k
                    .rings
                    .iter()
                    .map(|r| RingConfig {
                        amplitude: r.amplitude,
                        distance: r.distance,
                        width: r.width,
                    })
                    .collect(),
                weight: k.weight,
                mu: k.mu,
                sigma: k.sigma,
                source_channel: k.source_channel,
                target_channel: k.target_channel,
            })
            .collect();

        let flow = FlowConfig {
            beta_a: self.flow.beta_a,
            n: self.flow.n,
            distribution_size: self.flow.distribution_size,
        };

        SimulationConfig {
            width: base.width,
            height: base.height,
            channels: base.channels,
            dt: base.dt,
            kernel_radius: base.kernel_radius,
            kernels,
            flow,
            embedding: base.embedding.clone(),
        }
    }

    /// Convert genome to seed.
    pub fn to_seed(&self, channel: usize) -> Option<Seed> {
        self.seed.as_ref().map(|s| Seed {
            pattern: match s {
                SeedGenome::GaussianBlob {
                    center,
                    radius,
                    amplitude,
                } => Pattern::GaussianBlob {
                    center: *center,
                    radius: *radius,
                    amplitude: *amplitude,
                    channel,
                },
                SeedGenome::Ring {
                    center,
                    inner_radius,
                    outer_radius,
                    amplitude,
                } => Pattern::Ring {
                    center: *center,
                    inner_radius: *inner_radius,
                    outer_radius: *outer_radius,
                    amplitude: *amplitude,
                    channel,
                },
                SeedGenome::MultiBlob { blobs } => Pattern::MultiBlob {
                    blobs: blobs
                        .iter()
                        .map(|b| super::BlobSpec {
                            center: b.center,
                            radius: b.radius,
                            amplitude: b.amplitude,
                            channel,
                        })
                        .collect(),
                },
            },
        })
    }

    /// Get the total number of evolvable parameters.
    pub fn parameter_count(&self) -> usize {
        let kernel_params: usize = self
            .kernels
            .iter()
            .map(|k| {
                4 // radius, weight, mu, sigma
                + k.rings.len() * 3 // amplitude, distance, width per ring
            })
            .sum();

        let flow_params = 3; // beta_a, n, distribution_size

        let seed_params = match &self.seed {
            Some(SeedGenome::GaussianBlob { .. }) => 4, // center(2), radius, amplitude
            Some(SeedGenome::Ring { .. }) => 5,         // center(2), inner, outer, amplitude
            Some(SeedGenome::MultiBlob { blobs }) => blobs.len() * 4,
            None => 0,
        };

        kernel_params + flow_params + seed_params
    }
}

// ============================================================================
// Progress and Result Types (for real-time visualization)
// ============================================================================

/// Progress update for real-time visualization.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionProgress {
    /// Current generation number.
    pub generation: usize,
    /// Total generations planned.
    pub total_generations: usize,
    /// Number of evaluations completed this generation.
    pub evaluations_completed: usize,
    /// Total evaluations this generation.
    pub evaluations_total: usize,
    /// Best fitness seen so far.
    pub best_fitness: f32,
    /// Average fitness of current population.
    pub avg_fitness: f32,
    /// Best fitness this generation.
    pub generation_best: f32,
    /// Generations since last improvement.
    pub stagnation_count: usize,
    /// Current best candidate (for visualization).
    pub best_candidate: Option<CandidateSnapshot>,
    /// Top N candidates for display.
    pub top_candidates: Vec<CandidateSnapshot>,
    /// Statistics history for plotting.
    pub history: EvolutionHistory,
    /// Current phase of the algorithm.
    pub phase: EvolutionPhase,
}

/// Snapshot of a candidate for visualization.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CandidateSnapshot {
    /// Unique identifier.
    pub id: u64,
    /// Fitness score.
    pub fitness: f32,
    /// Individual metric scores.
    pub metric_scores: Vec<MetricScore>,
    /// Genome parameters.
    pub genome: Genome,
    /// Simulation config derived from genome.
    pub config: SimulationConfig,
    /// Seed pattern.
    pub seed: Seed,
    /// Generation this candidate was created.
    pub generation: usize,
    /// Parent IDs (for genealogy).
    pub parents: Vec<u64>,
    /// Behavioral characteristics.
    pub behavior: BehaviorStats,
}

/// Score for an individual metric.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricScore {
    /// Metric name.
    pub name: String,
    /// Raw score.
    pub score: f32,
    /// Weight used.
    pub weight: f32,
    /// Weighted contribution.
    pub weighted_score: f32,
}

/// Behavioral statistics for a pattern.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BehaviorStats {
    /// Final mass (should be ~initial mass).
    pub final_mass: f32,
    /// Mass at start.
    pub initial_mass: f32,
    /// Center of mass trajectory (sampled points).
    pub center_of_mass_trajectory: Vec<(f32, f32)>,
    /// Total displacement.
    pub total_displacement: f32,
    /// Pattern radius over time.
    pub radius_over_time: Vec<f32>,
    /// Final pattern radius.
    pub final_radius: f32,
    /// Number of active cells at end.
    pub active_cells: usize,
    /// Maximum activation value.
    pub max_activation: f32,
}

/// Evolution history for plotting.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct EvolutionHistory {
    /// Best fitness per generation.
    pub best_fitness: Vec<f32>,
    /// Average fitness per generation.
    pub avg_fitness: Vec<f32>,
    /// Standard deviation per generation.
    pub fitness_std: Vec<f32>,
    /// Diversity metric per generation.
    pub diversity: Vec<f32>,
}

/// Current phase of evolution.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub enum EvolutionPhase {
    /// Initializing population.
    #[default]
    Initializing,
    /// Evaluating candidates.
    Evaluating,
    /// Performing selection.
    Selecting,
    /// Creating offspring.
    Reproducing,
    /// Evolution complete.
    Complete,
    /// Evolution stopped early.
    Stopped,
}

/// Final result of evolution run.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionResult {
    /// Best candidate found.
    pub best: CandidateSnapshot,
    /// Complete archive of discovered patterns.
    pub archive: Vec<CandidateSnapshot>,
    /// Statistics from the run.
    pub stats: EvolutionStats,
    /// Full history for analysis.
    pub history: EvolutionHistory,
}

/// Statistics from evolution run.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionStats {
    /// Total generations run.
    pub generations: usize,
    /// Total evaluations performed.
    pub total_evaluations: u64,
    /// Best fitness achieved.
    pub best_fitness: f32,
    /// Average fitness of final population.
    pub final_avg_fitness: f32,
    /// Time taken (in seconds).
    pub elapsed_seconds: f64,
    /// Evaluations per second.
    pub evaluations_per_second: f64,
    /// Reason for stopping.
    pub stop_reason: StopReason,
}

/// Reason evolution stopped.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum StopReason {
    /// Reached maximum generations.
    MaxGenerations,
    /// Reached target fitness.
    TargetReached,
    /// Stagnation limit hit.
    Stagnation,
    /// User cancelled.
    Cancelled,
    /// Error occurred.
    Error(String),
}

// ============================================================================
// Validation
// ============================================================================

/// Evolution configuration validation errors.
#[derive(Debug, thiserror::Error)]
pub enum EvolutionConfigError {
    #[error("Population size must be at least 2")]
    PopulationTooSmall,
    #[error("No fitness metrics specified")]
    NoMetrics,
    #[error("Invalid metric weight: {0}")]
    InvalidWeight(String),
    #[error("Evaluation steps must be positive")]
    InvalidSteps,
    #[error("Invalid parameter bounds: {0}")]
    InvalidBounds(String),
    #[error("Base config validation failed: {0}")]
    BaseConfigError(#[from] super::ConfigError),
}

impl EvolutionConfig {
    /// Validate evolution configuration.
    pub fn validate(&self) -> Result<(), EvolutionConfigError> {
        // Validate base config
        self.base_config.validate()?;

        // Check population size
        if self.population.size < 2 {
            return Err(EvolutionConfigError::PopulationTooSmall);
        }

        // Check fitness metrics
        if self.fitness.metrics.is_empty() {
            return Err(EvolutionConfigError::NoMetrics);
        }

        for m in &self.fitness.metrics {
            if m.weight < 0.0 {
                return Err(EvolutionConfigError::InvalidWeight(format!(
                    "Weight {} must be non-negative",
                    m.weight
                )));
            }
        }

        // Check evaluation steps
        if self.evaluation.steps == 0 {
            return Err(EvolutionConfigError::InvalidSteps);
        }

        // Validate bounds
        let check_bounds = |bounds: (f32, f32), name: &str| {
            if bounds.0 > bounds.1 {
                Err(EvolutionConfigError::InvalidBounds(format!(
                    "{} min ({}) > max ({})",
                    name, bounds.0, bounds.1
                )))
            } else {
                Ok(())
            }
        };

        check_bounds(self.constraints.mu_bounds, "mu")?;
        check_bounds(self.constraints.sigma_bounds, "sigma")?;
        check_bounds(self.constraints.weight_bounds, "weight")?;
        check_bounds(self.constraints.amplitude_bounds, "amplitude")?;
        check_bounds(self.constraints.distance_bounds, "distance")?;
        check_bounds(self.constraints.ring_width_bounds, "ring_width")?;
        check_bounds(self.constraints.beta_a_bounds, "beta_a")?;
        check_bounds(self.constraints.n_bounds, "n")?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config_valid() {
        let config = EvolutionConfig::default();
        assert!(config.validate().is_ok());
    }

    #[test]
    fn test_genome_roundtrip() {
        let config = SimulationConfig::default();
        let seed = Seed::default();
        let genome = Genome::from_config(&config, Some(&seed));

        let new_config = genome.to_config(&config);
        assert_eq!(new_config.kernels.len(), config.kernels.len());
        assert_eq!(new_config.flow.beta_a, config.flow.beta_a);
    }

    #[test]
    fn test_serialization() {
        let config = EvolutionConfig::default();
        let json = serde_json::to_string(&config).unwrap();
        let parsed: EvolutionConfig = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed.population.size, config.population.size);
    }
}
