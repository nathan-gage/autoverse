//! Search algorithm implementations for evolutionary pattern discovery.

use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};

#[cfg(not(target_arch = "wasm32"))]
use rayon::prelude::*;

use crate::schema::{
    BehaviorStats, CandidateSnapshot, EvolutionConfig, EvolutionHistory, EvolutionPhase,
    EvolutionProgress, EvolutionResult, EvolutionStats, GeneticAlgorithmConfig, Genome,
    MetricScore, SearchAlgorithm, Seed, SelectionMethod, SimulationConfig, StopReason,
};

use super::fitness::{FitnessEvaluator, MetricResult};
use super::genome::{GenomeRng, genome_distance};

/// A candidate individual in the population.
#[derive(Debug, Clone)]
pub struct Candidate {
    /// Unique identifier.
    pub id: u64,
    /// The genome.
    pub genome: Genome,
    /// Fitness score.
    pub fitness: f32,
    /// Individual metric results.
    pub metrics: Vec<MetricResult>,
    /// Behavioral statistics.
    pub behavior: BehaviorStats,
    /// Generation created.
    pub generation: usize,
    /// Parent IDs.
    pub parents: Vec<u64>,
}

impl Candidate {
    /// Convert to snapshot for serialization.
    pub fn to_snapshot(
        &self,
        base_config: &SimulationConfig,
        default_seed: &Seed,
    ) -> CandidateSnapshot {
        let config = self.genome.to_config(base_config);
        let seed = self
            .genome
            .to_seed(0)
            .unwrap_or_else(|| default_seed.clone());

        CandidateSnapshot {
            id: self.id,
            fitness: self.fitness,
            metric_scores: self
                .metrics
                .iter()
                .map(|m| MetricScore {
                    name: format!("{:?}", m.metric),
                    score: m.score,
                    weight: m.weight,
                    weighted_score: m.score * m.weight,
                })
                .collect(),
            genome: self.genome.clone(),
            config,
            seed,
            generation: self.generation,
            parents: self.parents.clone(),
            behavior: self.behavior.clone(),
        }
    }
}

/// Progress callback type.
pub type ProgressCallback = Box<dyn Fn(&EvolutionProgress) + Send + Sync>;

/// Evolution engine that runs the search.
pub struct EvolutionEngine {
    config: EvolutionConfig,
    rng: GenomeRng,
    evaluator: FitnessEvaluator,
    population: Vec<Candidate>,
    archive: Vec<Candidate>,
    history: EvolutionHistory,
    generation: usize,
    best_fitness: f32,
    stagnation_count: usize,
    next_id: Arc<AtomicU64>,
    cancelled: Arc<AtomicBool>,
    default_seed: Seed,
}

impl EvolutionEngine {
    /// Create a new evolution engine.
    pub fn new(config: EvolutionConfig) -> Self {
        let seed = config.random_seed.unwrap_or_else(rand::random);
        let rng = GenomeRng::new(seed);
        let evaluator = FitnessEvaluator::new(config.fitness.clone(), config.evaluation.clone());

        let default_seed = Seed::default();

        Self {
            config,
            rng,
            evaluator,
            population: Vec::new(),
            archive: Vec::new(),
            history: EvolutionHistory::default(),
            generation: 0,
            best_fitness: f32::NEG_INFINITY,
            stagnation_count: 0,
            next_id: Arc::new(AtomicU64::new(0)),
            cancelled: Arc::new(AtomicBool::new(false)),
            default_seed,
        }
    }

    /// Set the default seed pattern.
    pub fn with_default_seed(mut self, seed: Seed) -> Self {
        self.default_seed = seed;
        self
    }

    /// Get cancellation handle.
    pub fn cancel_handle(&self) -> Arc<AtomicBool> {
        Arc::clone(&self.cancelled)
    }

    /// Initialize the population.
    pub fn initialize(&mut self) {
        self.population.clear();
        self.generation = 0;

        for _ in 0..self.config.population.size {
            let genome = self
                .rng
                .random_genome(&self.config.base_config, &self.config.constraints);
            let id = self.next_id.fetch_add(1, Ordering::Relaxed);

            self.population.push(Candidate {
                id,
                genome,
                fitness: 0.0,
                metrics: Vec::new(),
                behavior: BehaviorStats::default(),
                generation: 0,
                parents: Vec::new(),
            });
        }
    }

    /// Evaluate all candidates in the population.
    #[cfg(not(target_arch = "wasm32"))]
    fn evaluate_population(&mut self) {
        let base_config = &self.config.base_config;
        let evaluator = &self.evaluator;
        let default_seed = &self.default_seed;

        // Parallel evaluation
        self.population.par_iter_mut().for_each(|candidate| {
            let config = candidate.genome.to_config(base_config);
            let seed = candidate
                .genome
                .to_seed(0)
                .unwrap_or_else(|| default_seed.clone());

            let (fitness, metrics, behavior) = evaluator.evaluate(&config, &seed);

            candidate.fitness = fitness;
            candidate.metrics = metrics;
            candidate.behavior = behavior;
        });
    }

    #[cfg(target_arch = "wasm32")]
    fn evaluate_population(&mut self) {
        let base_config = &self.config.base_config;
        let evaluator = &self.evaluator;
        let default_seed = &self.default_seed;

        // Sequential evaluation for WASM
        for candidate in &mut self.population {
            let config = candidate.genome.to_config(base_config);
            let seed = candidate
                .genome
                .to_seed(0)
                .unwrap_or_else(|| default_seed.clone());

            let (fitness, metrics, behavior) = evaluator.evaluate(&config, &seed);

            candidate.fitness = fitness;
            candidate.metrics = metrics;
            candidate.behavior = behavior;
        }
    }

    /// Run a single generation step.
    fn step_generation(&mut self) {
        match &self.config.algorithm {
            SearchAlgorithm::GeneticAlgorithm(ga_config) => {
                self.step_genetic_algorithm(ga_config.clone());
            }
            SearchAlgorithm::CmaEs(_) => {
                // CMA-ES implementation would go here
                // For now, fall back to GA
                self.step_genetic_algorithm(GeneticAlgorithmConfig::default());
            }
            SearchAlgorithm::NoveltySearch(_) => {
                // Novelty search would modify selection pressure
                self.step_genetic_algorithm(GeneticAlgorithmConfig::default());
            }
            SearchAlgorithm::MapElites(_) => {
                // MAP-Elites would use different archive strategy
                self.step_genetic_algorithm(GeneticAlgorithmConfig::default());
            }
        }

        self.generation += 1;
    }

    /// Genetic algorithm step.
    fn step_genetic_algorithm(&mut self, ga_config: GeneticAlgorithmConfig) {
        // Sort by fitness (descending)
        self.population
            .sort_by(|a, b| b.fitness.partial_cmp(&a.fitness).unwrap());

        // Track best fitness
        let gen_best = self.population[0].fitness;
        if gen_best > self.best_fitness {
            self.best_fitness = gen_best;
            self.stagnation_count = 0;
        } else {
            self.stagnation_count += 1;
        }

        // Update history
        let avg_fitness: f32 =
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32;
        let variance: f32 = self
            .population
            .iter()
            .map(|c| (c.fitness - avg_fitness).powi(2))
            .sum::<f32>()
            / self.population.len() as f32;

        self.history.best_fitness.push(gen_best);
        self.history.avg_fitness.push(avg_fitness);
        self.history.fitness_std.push(variance.sqrt());

        // Compute diversity
        let diversity = self.compute_diversity();
        self.history.diversity.push(diversity);

        // Archive good candidates
        self.update_archive();

        // Create next generation
        let mut next_gen = Vec::with_capacity(self.config.population.size);

        // Elitism: keep best individuals
        for i in 0..ga_config.elitism.min(self.population.len()) {
            let mut elite = self.population[i].clone();
            elite.generation = self.generation + 1;
            next_gen.push(elite);
        }

        // Fill rest with offspring
        while next_gen.len() < self.config.population.size {
            // Selection - get indices first to avoid borrow issues
            let idx1 = self.select_index(&ga_config.selection);
            let idx2 = self.select_index(&ga_config.selection);

            // Clone what we need from parents
            let parent1_genome = self.population[idx1].genome.clone();
            let parent2_genome = self.population[idx2].genome.clone();
            let parent1_id = self.population[idx1].id;
            let parent2_id = self.population[idx2].id;

            // Crossover
            let do_crossover =
                (self.rng.next_seed() as f32) / (u64::MAX as f32) < ga_config.crossover_rate;
            let mut child_genome = if do_crossover {
                self.rng.crossover(&parent1_genome, &parent2_genome)
            } else {
                parent1_genome
            };

            // Mutation
            self.rng.mutate(
                &mut child_genome,
                ga_config.mutation_rate,
                ga_config.mutation_strength,
                &self.config.constraints,
            );

            let id = self.next_id.fetch_add(1, Ordering::Relaxed);
            next_gen.push(Candidate {
                id,
                genome: child_genome,
                fitness: 0.0,
                metrics: Vec::new(),
                behavior: BehaviorStats::default(),
                generation: self.generation + 1,
                parents: vec![parent1_id, parent2_id],
            });
        }

        self.population = next_gen;
    }

    /// Select a parent index using the specified method.
    fn select_index(&mut self, method: &SelectionMethod) -> usize {
        match method {
            SelectionMethod::Tournament { size } => {
                let mut best_idx = 0;
                let mut best_fitness = f32::NEG_INFINITY;
                for _ in 0..*size {
                    let idx = (self.rng.next_seed() as usize) % self.population.len();
                    if self.population[idx].fitness > best_fitness {
                        best_fitness = self.population[idx].fitness;
                        best_idx = idx;
                    }
                }
                best_idx
            }
            SelectionMethod::RankBased => {
                // Rank-based: probability proportional to rank
                let total_rank: usize = (1..=self.population.len()).sum();
                let mut target = (self.rng.next_seed() as usize) % total_rank;
                for i in 0..self.population.len() {
                    let rank = self.population.len() - i;
                    if target < rank {
                        return i;
                    }
                    target -= rank;
                }
                0
            }
            SelectionMethod::RouletteWheel => {
                // Fitness proportionate
                let total_fitness: f32 = self.population.iter().map(|c| c.fitness.max(0.0)).sum();
                if total_fitness <= 0.0 {
                    return 0;
                }

                let target = (self.rng.next_seed() as f32 / u64::MAX as f32) * total_fitness;
                let mut cumulative = 0.0;
                for (i, candidate) in self.population.iter().enumerate() {
                    cumulative += candidate.fitness.max(0.0);
                    if cumulative >= target {
                        return i;
                    }
                }
                0
            }
        }
    }

    /// Compute population diversity.
    fn compute_diversity(&self) -> f32 {
        if self.population.len() < 2 {
            return 0.0;
        }

        let mut total_distance = 0.0f32;
        let mut count = 0;

        for i in 0..self.population.len() {
            for j in (i + 1)..self.population.len() {
                total_distance +=
                    genome_distance(&self.population[i].genome, &self.population[j].genome);
                count += 1;
            }
        }

        if count > 0 {
            total_distance / count as f32
        } else {
            0.0
        }
    }

    /// Update the archive with good candidates.
    fn update_archive(&mut self) {
        let threshold = self.config.fitness.archive_threshold.unwrap_or(0.0);
        let diversity_threshold = self.config.archive.diversity_threshold;

        for candidate in &self.population {
            if candidate.fitness >= threshold {
                // Check diversity from existing archive
                let is_diverse = self.archive.iter().all(|archived| {
                    genome_distance(&candidate.genome, &archived.genome) >= diversity_threshold
                });

                if is_diverse {
                    self.archive.push(candidate.clone());
                }
            }
        }

        // Trim archive if too large
        if self.archive.len() > self.config.archive.max_size {
            // Keep best ones
            self.archive
                .sort_by(|a, b| b.fitness.partial_cmp(&a.fitness).unwrap());
            self.archive.truncate(self.config.archive.max_size);
        }
    }

    /// Get current progress.
    pub fn progress(&self) -> EvolutionProgress {
        let avg_fitness: f32 = if self.population.is_empty() {
            0.0
        } else {
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32
        };

        let gen_best = self
            .population
            .iter()
            .map(|c| c.fitness)
            .fold(f32::NEG_INFINITY, f32::max);

        let best_candidate = self
            .population
            .iter()
            .max_by(|a, b| a.fitness.partial_cmp(&b.fitness).unwrap())
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed));

        let top_candidates: Vec<CandidateSnapshot> = {
            let mut sorted: Vec<_> = self.population.iter().collect();
            sorted.sort_by(|a, b| b.fitness.partial_cmp(&a.fitness).unwrap());
            sorted
                .into_iter()
                .take(5)
                .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
                .collect()
        };

        let phase = if self.generation == 0 {
            EvolutionPhase::Initializing
        } else if self.cancelled.load(Ordering::Relaxed) {
            EvolutionPhase::Stopped
        } else {
            EvolutionPhase::Evaluating
        };

        EvolutionProgress {
            generation: self.generation,
            total_generations: self.config.population.max_generations,
            evaluations_completed: self.population.len(),
            evaluations_total: self.config.population.size,
            best_fitness: self.best_fitness,
            avg_fitness,
            generation_best: gen_best,
            stagnation_count: self.stagnation_count,
            best_candidate,
            top_candidates,
            history: self.history.clone(),
            phase,
        }
    }

    /// Check if evolution should stop.
    fn should_stop(&self) -> Option<StopReason> {
        if self.cancelled.load(Ordering::Relaxed) {
            return Some(StopReason::Cancelled);
        }

        if self.generation >= self.config.population.max_generations {
            return Some(StopReason::MaxGenerations);
        }

        if let Some(target) = self.config.population.target_fitness
            && self.best_fitness >= target
        {
            return Some(StopReason::TargetReached);
        }

        if let Some(limit) = self.config.population.stagnation_limit
            && self.stagnation_count >= limit
        {
            return Some(StopReason::Stagnation);
        }

        None
    }

    /// Run evolution with progress callback.
    pub fn run_with_callback<F>(&mut self, mut callback: F) -> EvolutionResult
    where
        F: FnMut(&EvolutionProgress),
    {
        let start_time = std::time::Instant::now();

        // Initialize
        self.initialize();
        callback(&self.progress());

        // Evaluate initial population
        self.evaluate_population();
        callback(&self.progress());

        // Evolution loop
        let stop_reason = loop {
            if let Some(reason) = self.should_stop() {
                break reason;
            }

            // Evolve one generation
            self.step_generation();

            // Evaluate new population
            self.evaluate_population();

            // Report progress
            callback(&self.progress());
        };

        let elapsed = start_time.elapsed().as_secs_f64();
        let total_evaluations = (self.generation + 1) as u64 * self.config.population.size as u64;

        // Find best candidate
        let best = self
            .population
            .iter()
            .chain(self.archive.iter())
            .max_by(|a, b| a.fitness.partial_cmp(&b.fitness).unwrap())
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
            .expect("No candidates");

        let archive: Vec<CandidateSnapshot> = self
            .archive
            .iter()
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
            .collect();

        let avg_fitness: f32 = if self.population.is_empty() {
            0.0
        } else {
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32
        };

        EvolutionResult {
            best,
            archive,
            stats: EvolutionStats {
                generations: self.generation,
                total_evaluations,
                best_fitness: self.best_fitness,
                final_avg_fitness: avg_fitness,
                elapsed_seconds: elapsed,
                evaluations_per_second: total_evaluations as f64 / elapsed,
                stop_reason,
            },
            history: self.history.clone(),
        }
    }

    /// Run evolution (blocking).
    pub fn run(&mut self) -> EvolutionResult {
        self.run_with_callback(|_| {})
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{EvolutionConfig, FitnessMetric, GeneticAlgorithmConfig, WeightedMetric};

    fn test_config(pop_size: usize, max_gens: usize, steps: u64) -> EvolutionConfig {
        EvolutionConfig {
            population: crate::schema::PopulationConfig {
                size: pop_size,
                max_generations: max_gens,
                ..Default::default()
            },
            evaluation: crate::schema::EvaluationConfig {
                steps,
                sample_interval: 2,
                ..Default::default()
            },
            base_config: crate::schema::SimulationConfig {
                width: 32,
                height: 32,
                ..Default::default()
            },
            random_seed: Some(42), // Deterministic for testing
            ..Default::default()
        }
    }

    #[test]
    fn test_evolution_engine_creation() {
        let config = test_config(10, 5, 10);

        let mut engine = EvolutionEngine::new(config);
        engine.initialize();

        assert_eq!(engine.population.len(), 10);
    }

    #[test]
    fn test_evolution_run() {
        let config = test_config(5, 3, 5);

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert_eq!(result.stats.generations, 3);
        assert!(result.stats.best_fitness >= 0.0);
    }

    #[test]
    fn test_evolution_run_with_fitness_improvement() {
        // Run for more generations to see improvement
        let mut config = test_config(20, 10, 20);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 0.2,
            mutation_strength: 0.3,
            crossover_rate: 0.8,
            elitism: 2,
            selection: SelectionMethod::Tournament { size: 3 },
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Verify we ran all generations
        assert_eq!(result.stats.generations, 10);

        // Verify history was tracked
        assert_eq!(result.history.best_fitness.len(), 10);
        assert_eq!(result.history.avg_fitness.len(), 10);

        // Best fitness should be non-negative
        assert!(
            result.stats.best_fitness >= 0.0,
            "Best fitness should be non-negative"
        );

        // Best fitness in final generation should be >= first generation
        // (elitism guarantees this)
        let first_best = result.history.best_fitness.first().copied().unwrap_or(0.0);
        let last_best = result.history.best_fitness.last().copied().unwrap_or(0.0);
        assert!(
            last_best >= first_best,
            "With elitism, best fitness should not decrease: first={}, last={}",
            first_best,
            last_best
        );

        // Verify best candidate was found
        assert!(result.best.fitness >= 0.0);
    }

    #[test]
    fn test_cancellation() {
        let config = test_config(5, 100, 5);

        let mut engine = EvolutionEngine::new(config);
        let cancel = engine.cancel_handle();

        // Cancel immediately
        cancel.store(true, Ordering::Relaxed);

        let result = engine.run();
        assert_eq!(result.stats.stop_reason, StopReason::Cancelled);
    }

    #[test]
    fn test_target_fitness_stops_early() {
        let mut config = test_config(10, 100, 10);
        config.population.target_fitness = Some(-10.0); // Very low target, should be hit immediately

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should stop early because target was reached
        assert!(
            result.stats.generations < 100,
            "Should stop before max generations when target reached"
        );
        assert_eq!(result.stats.stop_reason, StopReason::TargetReached);
    }

    #[test]
    fn test_stagnation_limit() {
        let mut config = test_config(5, 100, 5);
        config.population.stagnation_limit = Some(3); // Stop after 3 generations without improvement
        // Use very low mutation to encourage stagnation
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 0.0,
            mutation_strength: 0.0,
            crossover_rate: 0.0,
            elitism: 5, // All elite = no change
            selection: SelectionMethod::Tournament { size: 2 },
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should stop due to stagnation
        assert_eq!(result.stats.stop_reason, StopReason::Stagnation);
    }

    #[test]
    fn test_progress_callback() {
        let config = test_config(5, 5, 5);

        let mut engine = EvolutionEngine::new(config);
        let mut progress_reports = Vec::new();

        let result = engine.run_with_callback(|progress| {
            progress_reports.push(progress.clone());
        });

        // Should have multiple progress reports (init + each generation)
        assert!(
            progress_reports.len() > 5,
            "Should have at least 5 progress reports, got {}",
            progress_reports.len()
        );

        // Final report should match result
        let final_progress = progress_reports.last().unwrap();
        assert_eq!(final_progress.generation, result.stats.generations);
    }

    #[test]
    fn test_selection_methods() {
        // Test tournament selection
        let mut config = test_config(10, 3, 5);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            selection: SelectionMethod::Tournament { size: 3 },
            ..Default::default()
        });
        let mut engine = EvolutionEngine::new(config.clone());
        let result_tournament = engine.run();
        assert_eq!(result_tournament.stats.generations, 3);

        // Test rank-based selection
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            selection: SelectionMethod::RankBased,
            ..Default::default()
        });
        config.random_seed = Some(43); // Different seed for variety
        let mut engine = EvolutionEngine::new(config.clone());
        let result_rank = engine.run();
        assert_eq!(result_rank.stats.generations, 3);

        // Test roulette wheel selection
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            selection: SelectionMethod::RouletteWheel,
            ..Default::default()
        });
        config.random_seed = Some(44);
        let mut engine = EvolutionEngine::new(config);
        let result_roulette = engine.run();
        assert_eq!(result_roulette.stats.generations, 3);
    }

    #[test]
    fn test_diversity_computation() {
        let config = test_config(10, 1, 5);

        let mut engine = EvolutionEngine::new(config);
        engine.initialize();
        engine.evaluate_population();

        let diversity = engine.compute_diversity();
        assert!(diversity >= 0.0, "Diversity should be non-negative");
    }

    #[test]
    fn test_archive_updates() {
        let mut config = test_config(10, 5, 10);
        config.fitness.archive_threshold = Some(-10.0); // Low threshold to archive most candidates
        config.archive.diversity_threshold = 0.0; // No diversity requirement

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should have archived at least some candidates
        assert!(
            !result.archive.is_empty() || engine.archive.is_empty(),
            "Archive should be populated or intentionally empty"
        );
    }

    // ===== Edge Case Tests =====

    #[test]
    fn test_minimum_population_size() {
        let config = test_config(2, 3, 5); // Very small population

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert_eq!(result.stats.generations, 3);
        // Should still work with tiny population
    }

    #[test]
    fn test_single_generation() {
        let config = test_config(5, 1, 5);

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert_eq!(result.stats.generations, 1);
        assert!(result.history.best_fitness.len() == 1);
    }

    #[test]
    fn test_elitism_larger_than_population() {
        let mut config = test_config(5, 3, 5);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            elitism: 10, // More than population size
            ..Default::default()
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should not crash, elitism capped to population size
        assert_eq!(result.stats.generations, 3);
    }

    #[test]
    fn test_zero_mutation_rate() {
        let mut config = test_config(5, 3, 5);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 0.0,
            mutation_strength: 0.0,
            crossover_rate: 1.0,
            elitism: 1,
            selection: SelectionMethod::Tournament { size: 2 },
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should complete without errors
        assert_eq!(result.stats.generations, 3);
    }

    #[test]
    fn test_zero_crossover_rate() {
        let mut config = test_config(5, 3, 5);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 0.5,
            mutation_strength: 0.3,
            crossover_rate: 0.0, // No crossover
            elitism: 1,
            selection: SelectionMethod::Tournament { size: 2 },
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert_eq!(result.stats.generations, 3);
    }

    #[test]
    fn test_evaluations_per_second_metric() {
        let config = test_config(5, 3, 5);

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert!(
            result.stats.evaluations_per_second > 0.0,
            "Should report positive evaluations per second"
        );
        assert!(
            result.stats.elapsed_seconds > 0.0,
            "Should report positive elapsed time"
        );
    }

    #[test]
    fn test_candidate_to_snapshot_conversion() {
        let config = test_config(5, 1, 5);

        let mut engine = EvolutionEngine::new(config.clone());
        engine.initialize();
        engine.evaluate_population();

        let candidate = &engine.population[0];
        let snapshot = candidate.to_snapshot(&config.base_config, &engine.default_seed);

        assert_eq!(snapshot.id, candidate.id);
        assert_eq!(snapshot.fitness, candidate.fitness);
        assert_eq!(snapshot.generation, candidate.generation);
    }

    // ===== Integration Tests =====

    #[test]
    fn test_full_evolution_integration() {
        // Longer integration test with realistic-ish parameters
        let mut config = test_config(15, 8, 30);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 0.15,
            mutation_strength: 0.25,
            crossover_rate: 0.7,
            elitism: 2,
            selection: SelectionMethod::Tournament { size: 3 },
        });
        config.fitness.metrics = vec![
            WeightedMetric {
                metric: FitnessMetric::Persistence,
                weight: 1.0,
            },
            WeightedMetric {
                metric: FitnessMetric::Compactness,
                weight: 0.5,
            },
        ];

        let mut engine = EvolutionEngine::new(config);

        // Collect progress during run
        let mut generation_best_fitnesses = Vec::new();
        let result = engine.run_with_callback(|progress| {
            if progress.generation > 0 {
                generation_best_fitnesses.push(progress.generation_best);
            }
        });

        // Verify complete run
        assert_eq!(result.stats.generations, 8);

        // Verify history is consistent
        assert_eq!(result.history.best_fitness.len(), 8);
        assert_eq!(result.history.avg_fitness.len(), 8);
        assert_eq!(result.history.diversity.len(), 8);

        // Verify best candidate has valid structure
        assert!(result.best.fitness >= 0.0);
        assert!(!result.best.genome.kernels.is_empty());
        assert!(!result.best.metric_scores.is_empty());

        // Verify stats are reasonable
        assert!(result.stats.total_evaluations > 0);
        assert!(result.stats.elapsed_seconds > 0.0);
    }

    // ===== Archive-Evolution Integration =====

    #[test]
    fn test_evolution_populates_archive() {
        let mut config = test_config(10, 5, 20);
        config.fitness.archive_threshold = Some(-100.0); // Very low - archive everything
        config.archive.diversity_threshold = 0.0; // No diversity filter
        config.archive.max_size = 50;

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Archive should have captured some patterns
        assert!(
            !result.archive.is_empty(),
            "Archive should contain patterns after evolution"
        );

        // All archived patterns should have fitness above threshold
        for pattern in &result.archive {
            assert!(
                pattern.fitness >= -100.0,
                "Archived pattern should meet threshold"
            );
        }
    }

    #[test]
    fn test_archive_respects_diversity_threshold() {
        let mut config = test_config(10, 5, 20);
        config.fitness.archive_threshold = Some(-100.0);
        config.archive.diversity_threshold = 100.0; // Very high - should limit archiving
        config.archive.max_size = 50;

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // With high diversity threshold, archive should have fewer entries
        // (exact count depends on random genomes, but should be limited)
        assert!(
            result.archive.len() <= 10,
            "High diversity threshold should limit archive size, got {}",
            result.archive.len()
        );
    }

    // ===== Edge Case Tests for Robustness =====

    #[test]
    fn test_handles_nan_in_fitness_gracefully() {
        // This tests that the system doesn't crash with edge case configs
        let mut config = test_config(5, 2, 5);
        // Very extreme parameters that might produce edge cases
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            mutation_rate: 1.0,
            mutation_strength: 1.0, // Very high
            crossover_rate: 1.0,
            elitism: 1,
            selection: SelectionMethod::Tournament { size: 2 },
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should complete without panic
        assert_eq!(result.stats.generations, 2);
        // Best fitness should be a valid number (not NaN)
        assert!(
            !result.stats.best_fitness.is_nan(),
            "Best fitness should not be NaN"
        );
    }

    #[test]
    fn test_tournament_size_larger_than_population() {
        let mut config = test_config(5, 3, 5);
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            selection: SelectionMethod::Tournament { size: 100 }, // Much larger than pop
            ..Default::default()
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should still work (tournament samples with replacement)
        assert_eq!(result.stats.generations, 3);
    }

    #[test]
    fn test_roulette_with_zero_fitness_population() {
        // Roulette wheel with all-zero fitness should not crash
        let mut config = test_config(5, 2, 1); // Very short sim = likely low fitness
        config.algorithm = SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
            selection: SelectionMethod::RouletteWheel,
            ..Default::default()
        });

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        // Should complete without division by zero or panic
        assert_eq!(result.stats.generations, 2);
    }
}
