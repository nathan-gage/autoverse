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
    pub fn run_with_callback<F>(&mut self, callback: F) -> EvolutionResult
    where
        F: Fn(&EvolutionProgress),
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
    use crate::schema::EvolutionConfig;

    #[test]
    fn test_evolution_engine_creation() {
        let config = EvolutionConfig {
            population: crate::schema::PopulationConfig {
                size: 10,
                max_generations: 5,
                ..Default::default()
            },
            evaluation: crate::schema::EvaluationConfig {
                steps: 10,
                ..Default::default()
            },
            base_config: crate::schema::SimulationConfig {
                width: 32,
                height: 32,
                ..Default::default()
            },
            ..Default::default()
        };

        let mut engine = EvolutionEngine::new(config);
        engine.initialize();

        assert_eq!(engine.population.len(), 10);
    }

    #[test]
    fn test_evolution_run() {
        let config = EvolutionConfig {
            population: crate::schema::PopulationConfig {
                size: 5,
                max_generations: 3,
                ..Default::default()
            },
            evaluation: crate::schema::EvaluationConfig {
                steps: 5,
                sample_interval: 2,
                ..Default::default()
            },
            base_config: crate::schema::SimulationConfig {
                width: 32,
                height: 32,
                ..Default::default()
            },
            ..Default::default()
        };

        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();

        assert_eq!(result.stats.generations, 3);
        assert!(result.stats.best_fitness >= 0.0);
    }

    #[test]
    fn test_cancellation() {
        let config = EvolutionConfig {
            population: crate::schema::PopulationConfig {
                size: 5,
                max_generations: 100,
                ..Default::default()
            },
            evaluation: crate::schema::EvaluationConfig {
                steps: 5,
                ..Default::default()
            },
            base_config: crate::schema::SimulationConfig {
                width: 32,
                height: 32,
                ..Default::default()
            },
            ..Default::default()
        };

        let mut engine = EvolutionEngine::new(config);
        let cancel = engine.cancel_handle();

        // Cancel immediately
        cancel.store(true, Ordering::Relaxed);

        let result = engine.run();
        assert_eq!(result.stats.stop_reason, StopReason::Cancelled);
    }
}
