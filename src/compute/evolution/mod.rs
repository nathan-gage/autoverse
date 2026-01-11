//! Evolutionary search module for discovering interesting Flow Lenia patterns.
//!
//! This module provides algorithms and utilities for automated pattern discovery
//! using evolutionary optimization techniques.
//!
//! # Overview
//!
//! The evolutionary search system consists of:
//!
//! - **Fitness Functions** (`fitness`): Pluggable metrics for evaluating patterns
//! - **Genome Operations** (`genome`): Random generation, crossover, and mutation
//! - **Search Algorithms** (`search`): Genetic algorithm and other optimizers
//! - **Pattern Archive** (`archive`): Storage and export of discovered patterns
//!
//! # Example
//!
//! ```rust,no_run
//! use flow_lenia::schema::{EvolutionConfig, FitnessMetric, WeightedMetric};
//! use flow_lenia::compute::evolution::{EvolutionEngine, PatternArchive};
//!
//! // Create evolution configuration
//! let config = EvolutionConfig::default();
//!
//! // Create and run the evolution engine
//! let mut engine = EvolutionEngine::new(config);
//! let result = engine.run_with_callback(|progress| {
//!     println!("Generation {}: best fitness = {:.3}",
//!         progress.generation, progress.best_fitness);
//! });
//!
//! // Access discovered patterns
//! println!("Best pattern fitness: {:.3}", result.best.fitness);
//! println!("Archive size: {}", result.archive.len());
//! ```
//!
//! # Fitness Metrics
//!
//! Available fitness metrics include:
//!
//! - `Persistence`: Pattern survives without dissipating
//! - `Compactness`: Pattern maintains spatial localization
//! - `Locomotion`: Center of mass moves over time (glider detection)
//! - `Periodicity`: State returns to near-initial configuration
//! - `Complexity`: High variance in local structure
//! - `MassConcentration`: High peak-to-average ratio
//! - `GliderScore`: Combined locomotion and shape consistency
//! - `OscillatorScore`: Pattern returns to similar state
//! - `Stability`: Mass remains positive and bounded
//!
//! # Search Algorithms
//!
//! - `GeneticAlgorithm`: Standard GA with tournament selection
//! - `CmaEs`: Covariance Matrix Adaptation (TODO)
//! - `NoveltySearch`: Behavioral diversity optimization (TODO)
//! - `MapElites`: Quality-diversity archive (TODO)

mod archive;
mod fitness;
mod genome;
mod search;

pub use archive::{
    ArchivedPattern, BehaviorSummary, PatternArchive, PatternExport, PatternMetadata,
    auto_categorize,
};
pub use fitness::{EvaluationTrajectory, FitnessEvaluator, MetricResult};
pub use genome::{GenomeRng, genome_distance};
pub use search::{Candidate, EvolutionEngine, ProgressCallback};
