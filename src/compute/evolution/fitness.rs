//! Fitness function implementations for evolutionary pattern search.
//!
//! Provides pluggable fitness metrics for evaluating Flow Lenia patterns.

use crate::compute::{CpuPropagator, SimulationState};
use crate::schema::{
    BehaviorStats, EvaluationConfig, FitnessConfig, FitnessMetric, Seed, SimulationConfig,
};

/// Evaluates a candidate and returns fitness scores.
pub struct FitnessEvaluator {
    config: FitnessConfig,
    eval_config: EvaluationConfig,
}

impl FitnessEvaluator {
    /// Create a new fitness evaluator.
    pub fn new(config: FitnessConfig, eval_config: EvaluationConfig) -> Self {
        Self {
            config,
            eval_config,
        }
    }

    /// Evaluate a candidate and return combined fitness and individual scores.
    pub fn evaluate(
        &self,
        sim_config: &SimulationConfig,
        seed: &Seed,
    ) -> (f32, Vec<MetricResult>, BehaviorStats) {
        // Create propagator and state
        let mut propagator = CpuPropagator::new(sim_config.clone());
        let mut state = SimulationState::from_seed(seed, sim_config);

        // Collect trajectory data for metrics
        let mut trajectory = EvaluationTrajectory::new(&state);

        // Run warmup steps
        for _ in 0..self.eval_config.warmup_steps {
            propagator.step(&mut state);
        }

        // Sample initial state after warmup
        trajectory.record_sample(&state, 0);

        // Run evaluation steps
        let sample_interval = self.eval_config.sample_interval.max(1);
        for step in 1..=self.eval_config.steps {
            propagator.step(&mut state);

            if step % sample_interval == 0 {
                trajectory.record_sample(&state, step);
            }
        }

        // Compute individual metric scores
        let mut results = Vec::with_capacity(self.config.metrics.len());
        for weighted in &self.config.metrics {
            let score = compute_metric(&weighted.metric, &trajectory, &state);
            results.push(MetricResult {
                metric: weighted.metric.clone(),
                score,
                weight: weighted.weight,
            });
        }

        // Normalize if requested
        let scores: Vec<f32> = if self.config.normalize {
            normalize_scores(&results)
        } else {
            results.iter().map(|r| r.score).collect()
        };

        // Compute weighted sum
        let total_weight: f32 = self.config.metrics.iter().map(|m| m.weight).sum();
        let combined: f32 = scores
            .iter()
            .zip(&self.config.metrics)
            .map(|(s, m)| s * m.weight)
            .sum::<f32>()
            / total_weight.max(1e-6);

        // Extract behavior stats
        let behavior = trajectory.to_behavior_stats();

        (combined, results, behavior)
    }
}

/// Result of evaluating a single metric.
#[derive(Debug, Clone)]
pub struct MetricResult {
    pub metric: FitnessMetric,
    pub score: f32,
    pub weight: f32,
}

/// Trajectory data collected during evaluation.
pub struct EvaluationTrajectory {
    /// Initial total mass.
    pub initial_mass: f32,
    /// Initial center of mass.
    pub initial_center: (f32, f32),
    /// Initial pattern radius.
    pub initial_radius: f32,
    /// Initial state snapshot (for periodicity).
    pub initial_snapshot: Vec<f32>,
    /// Sampled centers of mass.
    pub center_samples: Vec<(f32, f32)>,
    /// Sampled radii.
    pub radius_samples: Vec<f32>,
    /// Sampled masses.
    pub mass_samples: Vec<f32>,
    /// Sampled max activations.
    pub max_samples: Vec<f32>,
    /// Sampled active cell counts.
    pub active_cell_samples: Vec<usize>,
    /// State snapshots at intervals (for periodicity).
    pub state_snapshots: Vec<(u64, Vec<f32>)>,
    /// Grid dimensions.
    width: usize,
    height: usize,
}

impl EvaluationTrajectory {
    /// Create new trajectory tracker.
    pub fn new(state: &SimulationState) -> Self {
        let initial_snapshot = state.channel_sum();
        let (cx, cy) = compute_center_of_mass(&initial_snapshot, state.width, state.height);
        let radius = compute_radius(&initial_snapshot, cx, cy, state.width, state.height);
        let initial_mass = state.total_mass();

        Self {
            initial_mass,
            initial_center: (cx, cy),
            initial_radius: radius,
            initial_snapshot,
            center_samples: Vec::new(),
            radius_samples: Vec::new(),
            mass_samples: Vec::new(),
            max_samples: Vec::new(),
            active_cell_samples: Vec::new(),
            state_snapshots: Vec::new(),
            width: state.width,
            height: state.height,
        }
    }

    /// Record a sample point.
    pub fn record_sample(&mut self, state: &SimulationState, step: u64) {
        let sum = state.channel_sum();
        let (cx, cy) = compute_center_of_mass(&sum, state.width, state.height);
        let radius = compute_radius(&sum, cx, cy, state.width, state.height);
        let mass: f32 = sum.iter().sum();
        let max = sum.iter().cloned().fold(0.0f32, f32::max);
        let active = sum.iter().filter(|&&v| v > 1e-6).count();

        self.center_samples.push((cx, cy));
        self.radius_samples.push(radius);
        self.mass_samples.push(mass);
        self.max_samples.push(max);
        self.active_cell_samples.push(active);
        self.state_snapshots.push((step, sum));
    }

    /// Convert to behavior stats.
    pub fn to_behavior_stats(&self) -> BehaviorStats {
        let final_mass = self.mass_samples.last().copied().unwrap_or(0.0);
        let final_radius = self.radius_samples.last().copied().unwrap_or(0.0);
        let active_cells = self.active_cell_samples.last().copied().unwrap_or(0);
        let max_activation = self.max_samples.iter().cloned().fold(0.0f32, f32::max);

        // Compute total displacement
        let total_displacement = if self.center_samples.len() >= 2 {
            let (start_x, start_y) = self.center_samples[0];
            let (end_x, end_y) = self.center_samples.last().unwrap();
            ((end_x - start_x).powi(2) + (end_y - start_y).powi(2)).sqrt()
        } else {
            0.0
        };

        BehaviorStats {
            final_mass,
            initial_mass: self.initial_mass,
            center_of_mass_trajectory: self.center_samples.clone(),
            total_displacement,
            radius_over_time: self.radius_samples.clone(),
            final_radius,
            active_cells,
            max_activation,
        }
    }
}

/// Compute center of mass for a grid.
fn compute_center_of_mass(grid: &[f32], width: usize, height: usize) -> (f32, f32) {
    let mut total_mass = 0.0f32;
    let mut cx = 0.0f32;
    let mut cy = 0.0f32;

    for y in 0..height {
        for x in 0..width {
            let m = grid[y * width + x];
            if m > 0.0 {
                total_mass += m;
                cx += x as f32 * m;
                cy += y as f32 * m;
            }
        }
    }

    if total_mass > 1e-6 {
        (cx / total_mass, cy / total_mass)
    } else {
        (width as f32 / 2.0, height as f32 / 2.0)
    }
}

/// Compute radius (second moment) around center of mass.
fn compute_radius(grid: &[f32], cx: f32, cy: f32, width: usize, height: usize) -> f32 {
    let mut total_mass = 0.0f32;
    let mut moment = 0.0f32;

    for y in 0..height {
        for x in 0..width {
            let m = grid[y * width + x];
            if m > 0.0 {
                let dx = x as f32 - cx;
                let dy = y as f32 - cy;
                total_mass += m;
                moment += m * (dx * dx + dy * dy);
            }
        }
    }

    if total_mass > 1e-6 {
        (moment / total_mass).sqrt()
    } else {
        0.0
    }
}

/// Compute a single fitness metric.
fn compute_metric(
    metric: &FitnessMetric,
    trajectory: &EvaluationTrajectory,
    state: &SimulationState,
) -> f32 {
    match metric {
        FitnessMetric::Persistence => compute_persistence(trajectory),
        FitnessMetric::Compactness => compute_compactness(trajectory, state),
        FitnessMetric::Locomotion => compute_locomotion(trajectory),
        FitnessMetric::Periodicity { period, tolerance } => {
            compute_periodicity(trajectory, *period, *tolerance)
        }
        FitnessMetric::Complexity => compute_complexity(state),
        FitnessMetric::MassConcentration => compute_mass_concentration(state),
        FitnessMetric::GliderScore { min_displacement } => {
            compute_glider_score(trajectory, state, *min_displacement)
        }
        FitnessMetric::OscillatorScore {
            max_period,
            threshold,
        } => compute_oscillator_score(trajectory, *max_period, *threshold),
        FitnessMetric::Stability => compute_stability(trajectory, state),
        FitnessMetric::Custom { .. } => 0.0, // Custom metrics handled externally
    }
}

/// Persistence: pattern survives without dissipating.
fn compute_persistence(trajectory: &EvaluationTrajectory) -> f32 {
    if trajectory.initial_mass < 1e-6 {
        return 0.0;
    }

    // Score based on how much of the original mass remains concentrated
    let final_mass = trajectory.mass_samples.last().copied().unwrap_or(0.0);
    let mass_ratio = final_mass / trajectory.initial_mass;

    // Also consider if pattern is still localized (not diffused everywhere)
    let final_max = trajectory.max_samples.last().copied().unwrap_or(0.0);
    let concentration = if final_mass > 1e-6 {
        final_max
            / (final_mass / trajectory.active_cell_samples.last().copied().unwrap_or(1) as f32)
    } else {
        0.0
    };

    // Combined score: mass conservation * concentration
    (mass_ratio * concentration.min(10.0) / 10.0).clamp(0.0, 1.0)
}

/// Compactness: pattern maintains spatial localization.
fn compute_compactness(trajectory: &EvaluationTrajectory, state: &SimulationState) -> f32 {
    let final_radius = trajectory
        .radius_samples
        .last()
        .copied()
        .unwrap_or(f32::MAX);
    let max_radius = (state.width.min(state.height) as f32) / 2.0;

    // Score is inverse of normalized radius
    // Small radius = high compactness
    let normalized_radius = final_radius / max_radius;
    (1.0 - normalized_radius).clamp(0.0, 1.0)
}

/// Locomotion: center of mass moves over time.
fn compute_locomotion(trajectory: &EvaluationTrajectory) -> f32 {
    if trajectory.center_samples.len() < 2 {
        return 0.0;
    }

    let (start_x, start_y) = trajectory.center_samples[0];
    let (end_x, end_y) = trajectory.center_samples.last().unwrap();

    // Total displacement
    let displacement = ((end_x - start_x).powi(2) + (end_y - start_y).powi(2)).sqrt();

    // Normalize by grid size
    let max_displacement = (trajectory.width.pow(2) + trajectory.height.pow(2)) as f32;
    let max_displacement = max_displacement.sqrt();

    (displacement / max_displacement).clamp(0.0, 1.0)
}

/// Periodicity: state returns to near-initial configuration.
fn compute_periodicity(trajectory: &EvaluationTrajectory, period: u64, tolerance: f32) -> f32 {
    // Find snapshots that match the target period
    for (step, snapshot) in &trajectory.state_snapshots {
        if *step == period {
            // Compare to initial state
            let similarity = compute_state_similarity(&trajectory.initial_snapshot, snapshot);
            if similarity > (1.0 - tolerance) {
                return similarity;
            }
        }
    }

    // Check if any snapshot is similar to initial
    let mut best_similarity = 0.0f32;
    for (step, snapshot) in &trajectory.state_snapshots {
        if *step > 0 {
            let similarity = compute_state_similarity(&trajectory.initial_snapshot, snapshot);
            best_similarity = best_similarity.max(similarity);
        }
    }

    best_similarity
}

/// Compute similarity between two states (normalized dot product).
fn compute_state_similarity(a: &[f32], b: &[f32]) -> f32 {
    if a.len() != b.len() {
        return 0.0;
    }

    let dot: f32 = a.iter().zip(b.iter()).map(|(x, y)| x * y).sum();
    let norm_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let norm_b: f32 = b.iter().map(|x| x * x).sum::<f32>().sqrt();

    if norm_a > 1e-6 && norm_b > 1e-6 {
        dot / (norm_a * norm_b)
    } else {
        0.0
    }
}

/// Complexity: high variance in local structure.
fn compute_complexity(state: &SimulationState) -> f32 {
    let sum = state.channel_sum();
    let mean: f32 = sum.iter().sum::<f32>() / sum.len() as f32;

    if mean < 1e-6 {
        return 0.0;
    }

    // Compute variance
    let variance: f32 = sum.iter().map(|&x| (x - mean).powi(2)).sum::<f32>() / sum.len() as f32;

    // Also consider spatial variation (local gradients)
    let mut gradient_sum = 0.0f32;
    for y in 0..state.height {
        for x in 0..state.width {
            let idx = y * state.width + x;
            let v = sum[idx];

            // Compare to neighbors
            if x > 0 {
                gradient_sum += (v - sum[idx - 1]).abs();
            }
            if y > 0 {
                gradient_sum += (v - sum[idx - state.width]).abs();
            }
        }
    }
    let gradient_mean = gradient_sum / (2 * sum.len()) as f32;

    // Combine variance and gradient measures
    let complexity = (variance.sqrt() + gradient_mean) / 2.0;
    complexity.min(1.0)
}

/// Mass concentration: high peak-to-average ratio.
fn compute_mass_concentration(state: &SimulationState) -> f32 {
    let sum = state.channel_sum();
    let mean: f32 = sum.iter().sum::<f32>() / sum.len() as f32;
    let max = sum.iter().cloned().fold(0.0f32, f32::max);

    if mean < 1e-6 {
        return 0.0;
    }

    // Peak-to-average ratio, normalized
    let ratio = max / mean;
    (ratio / 100.0).min(1.0) // Normalize assuming max ratio ~100
}

/// Glider score: combines locomotion with shape consistency.
fn compute_glider_score(
    trajectory: &EvaluationTrajectory,
    state: &SimulationState,
    min_displacement: f32,
) -> f32 {
    let locomotion = compute_locomotion(trajectory);
    let compactness = compute_compactness(trajectory, state);

    // Check if displacement exceeds minimum
    let displacement = if trajectory.center_samples.len() >= 2 {
        let (start_x, start_y) = trajectory.center_samples[0];
        let (end_x, end_y) = trajectory.center_samples.last().unwrap();
        ((end_x - start_x).powi(2) + (end_y - start_y).powi(2)).sqrt()
    } else {
        0.0
    };

    if displacement < min_displacement {
        return 0.0;
    }

    // Check shape consistency over time
    let radius_consistency = if trajectory.radius_samples.len() >= 2 {
        let mean_radius: f32 =
            trajectory.radius_samples.iter().sum::<f32>() / trajectory.radius_samples.len() as f32;
        let variance: f32 = trajectory
            .radius_samples
            .iter()
            .map(|&r| (r - mean_radius).powi(2))
            .sum::<f32>()
            / trajectory.radius_samples.len() as f32;
        let cv = variance.sqrt() / mean_radius.max(1e-6); // Coefficient of variation
        (1.0 - cv).clamp(0.0, 1.0)
    } else {
        0.5
    };

    // Combine scores: must be moving AND compact AND consistent
    locomotion * compactness * radius_consistency * compute_persistence(trajectory)
}

/// Oscillator score: pattern returns to similar state.
fn compute_oscillator_score(
    trajectory: &EvaluationTrajectory,
    max_period: u64,
    threshold: f32,
) -> f32 {
    let mut best_score = 0.0f32;

    // Check various periods
    for period in 1..=max_period {
        for (i, (step_i, snapshot_i)) in trajectory.state_snapshots.iter().enumerate() {
            for (step_j, snapshot_j) in trajectory.state_snapshots.iter().skip(i + 1) {
                if step_j - step_i == period {
                    let similarity = compute_state_similarity(snapshot_i, snapshot_j);
                    if similarity > threshold {
                        // Found a period! Score based on similarity and how early we found it
                        let period_score =
                            similarity * (1.0 - period as f32 / max_period as f32 * 0.5);
                        best_score = best_score.max(period_score);
                    }
                }
            }
        }
    }

    best_score
}

/// Stability: mass remains positive and bounded.
fn compute_stability(trajectory: &EvaluationTrajectory, state: &SimulationState) -> f32 {
    let sum = state.channel_sum();

    // Check for negative values (bad)
    let negative_count = sum.iter().filter(|&&v| v < 0.0).count();
    let negative_penalty = (negative_count as f32 / sum.len() as f32).min(1.0);

    // Check for extreme values (bad)
    let max = sum.iter().cloned().fold(0.0f32, f32::max);
    let extreme_penalty = if max > 10.0 { (max - 10.0) / max } else { 0.0 };

    // Check mass conservation
    let final_mass = trajectory.mass_samples.last().copied().unwrap_or(0.0);
    let mass_error = if trajectory.initial_mass > 1e-6 {
        ((final_mass - trajectory.initial_mass) / trajectory.initial_mass).abs()
    } else {
        0.0
    };

    // Combined stability score
    let stability = 1.0 - negative_penalty - extreme_penalty - mass_error;
    stability.clamp(0.0, 1.0)
}

/// Normalize scores to [0, 1] range based on observed distribution.
fn normalize_scores(results: &[MetricResult]) -> Vec<f32> {
    // For now, just clamp to [0, 1]
    // TODO: Track running statistics for proper normalization
    results.iter().map(|r| r.score.clamp(0.0, 1.0)).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{Pattern, Seed};

    fn test_seed() -> Seed {
        Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.1,
                amplitude: 1.0,
                channel: 0,
            },
        }
    }

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 64,
            height: 64,
            ..Default::default()
        }
    }

    #[test]
    fn test_fitness_evaluator() {
        let config = FitnessConfig::default();
        let eval_config = EvaluationConfig {
            steps: 10,
            sample_interval: 5,
            ..Default::default()
        };

        let evaluator = FitnessEvaluator::new(config, eval_config);
        let (fitness, results, behavior) = evaluator.evaluate(&test_config(), &test_seed());

        assert!(fitness >= 0.0);
        assert!(!results.is_empty());
        assert!(behavior.initial_mass > 0.0);
    }

    #[test]
    fn test_center_of_mass() {
        let grid = vec![0.0, 0.0, 1.0, 0.0]; // 2x2, mass at (0, 1)
        let (cx, cy) = compute_center_of_mass(&grid, 2, 2);
        assert!((cx - 0.0).abs() < 1e-6);
        assert!((cy - 1.0).abs() < 1e-6);
    }

    #[test]
    fn test_state_similarity() {
        let a = vec![1.0, 0.0, 0.0, 1.0];
        let b = vec![1.0, 0.0, 0.0, 1.0];
        let c = vec![0.0, 1.0, 1.0, 0.0];

        assert!((compute_state_similarity(&a, &b) - 1.0).abs() < 1e-6);
        assert!((compute_state_similarity(&a, &c)).abs() < 1e-6);
    }
}
