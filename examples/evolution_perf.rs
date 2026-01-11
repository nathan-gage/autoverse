//! Quick evolution performance test

use flow_lenia::{
    EvolutionConfig, EvolutionEngine,
    schema::{
        EvaluationConfig, GeneticAlgorithmConfig, PopulationConfig, SearchAlgorithm,
        SelectionMethod, SimulationConfig,
    },
};
use std::time::Instant;

fn main() {
    println!("=== Evolution Performance Test ===\n");

    // Test different grid sizes
    for grid_size in [32, 64, 128] {
        println!("Grid size: {}x{}", grid_size, grid_size);

        let config = EvolutionConfig {
            population: PopulationConfig {
                size: 20,
                max_generations: 10,
                ..Default::default()
            },
            evaluation: EvaluationConfig {
                steps: 50,
                sample_interval: 10,
                ..Default::default()
            },
            base_config: SimulationConfig {
                width: grid_size,
                height: grid_size,
                ..Default::default()
            },
            algorithm: SearchAlgorithm::GeneticAlgorithm(GeneticAlgorithmConfig {
                mutation_rate: 0.2,
                mutation_strength: 0.3,
                crossover_rate: 0.8,
                elitism: 2,
                selection: SelectionMethod::Tournament { size: 3 },
            }),
            random_seed: Some(42),
            ..Default::default()
        };

        let start = Instant::now();
        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();
        let elapsed = start.elapsed();

        let total_evals = result.stats.total_evaluations;
        let evals_per_sec = total_evals as f64 / elapsed.as_secs_f64();

        println!("  Generations:    {}", result.stats.generations);
        println!("  Evaluations:    {}", total_evals);
        println!("  Elapsed:        {:.2}s", elapsed.as_secs_f64());
        println!("  Evals/sec:      {:.1}", evals_per_sec);
        println!("  Best fitness:   {:.4}", result.stats.best_fitness);
        println!();
    }

    println!("=== Scalability Test (fixed 64x64 grid) ===\n");

    // Test different population sizes
    for pop_size in [10, 20, 40, 80] {
        let config = EvolutionConfig {
            population: PopulationConfig {
                size: pop_size,
                max_generations: 5,
                ..Default::default()
            },
            evaluation: EvaluationConfig {
                steps: 30,
                sample_interval: 10,
                ..Default::default()
            },
            base_config: SimulationConfig {
                width: 64,
                height: 64,
                ..Default::default()
            },
            random_seed: Some(42),
            ..Default::default()
        };

        let start = Instant::now();
        let mut engine = EvolutionEngine::new(config);
        let result = engine.run();
        let elapsed = start.elapsed();

        let total_evals = result.stats.total_evaluations;
        let evals_per_sec = total_evals as f64 / elapsed.as_secs_f64();

        println!(
            "Population {}: {} evals in {:.2}s ({:.1} evals/sec)",
            pop_size,
            total_evals,
            elapsed.as_secs_f64(),
            evals_per_sec
        );
    }
}
