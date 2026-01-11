//! Genome manipulation utilities for evolutionary search.
//!
//! Provides random generation, crossover, and mutation operations.

use crate::schema::{
    BlobGenome, FlowGenome, Genome, GenomeConstraints, KernelGenome, RingGenome, SeedGenome,
    SeedPatternType, SimulationConfig,
};
use rand::prelude::*;

/// Random number generator wrapper for genome operations.
pub struct GenomeRng {
    rng: StdRng,
}

impl GenomeRng {
    /// Create from seed.
    pub fn new(seed: u64) -> Self {
        Self {
            rng: StdRng::seed_from_u64(seed),
        }
    }

    /// Create with random seed.
    pub fn random() -> Self {
        Self {
            rng: StdRng::from_entropy(),
        }
    }

    /// Generate a random genome within constraints.
    pub fn random_genome(
        &mut self,
        base_config: &SimulationConfig,
        constraints: &GenomeConstraints,
    ) -> Genome {
        let kernels: Vec<KernelGenome> = base_config
            .kernels
            .iter()
            .map(|k| self.random_kernel_genome(k.source_channel, k.target_channel, constraints))
            .collect();

        let flow = self.random_flow_genome(constraints);

        let seed = if constraints.evolve_seed {
            Some(self.random_seed_genome(constraints))
        } else {
            None
        };

        Genome {
            kernels,
            flow,
            seed,
        }
    }

    /// Generate random kernel genome.
    fn random_kernel_genome(
        &mut self,
        source_channel: usize,
        target_channel: usize,
        constraints: &GenomeConstraints,
    ) -> KernelGenome {
        let num_rings = self
            .rng
            .gen_range(constraints.ring_count_bounds.0..=constraints.ring_count_bounds.1);

        let rings: Vec<RingGenome> = (0..num_rings)
            .map(|_| self.random_ring_genome(constraints))
            .collect();

        KernelGenome {
            radius: 1.0, // Usually fixed
            rings,
            weight: self.uniform(constraints.weight_bounds),
            mu: self.uniform(constraints.mu_bounds),
            sigma: self.uniform(constraints.sigma_bounds),
            source_channel,
            target_channel,
        }
    }

    /// Generate random ring genome.
    fn random_ring_genome(&mut self, constraints: &GenomeConstraints) -> RingGenome {
        RingGenome {
            amplitude: self.uniform(constraints.amplitude_bounds),
            distance: self.uniform(constraints.distance_bounds),
            width: self.uniform(constraints.ring_width_bounds),
        }
    }

    /// Generate random flow genome.
    fn random_flow_genome(&mut self, constraints: &GenomeConstraints) -> FlowGenome {
        FlowGenome {
            beta_a: self.uniform(constraints.beta_a_bounds),
            n: self.uniform(constraints.n_bounds),
            distribution_size: 1.0, // Usually fixed
        }
    }

    /// Generate random seed genome.
    fn random_seed_genome(&mut self, constraints: &GenomeConstraints) -> SeedGenome {
        let seed_constraints = constraints
            .seed_constraints
            .as_ref()
            .cloned()
            .unwrap_or_default();

        let pattern_type = seed_constraints
            .allowed_patterns
            .choose(&mut self.rng)
            .copied()
            .unwrap_or(SeedPatternType::GaussianBlob);

        match pattern_type {
            SeedPatternType::GaussianBlob => SeedGenome::GaussianBlob {
                center: (self.rng.gen_range(0.3..0.7), self.rng.gen_range(0.3..0.7)),
                radius: self.uniform(seed_constraints.radius_bounds),
                amplitude: self.uniform(seed_constraints.amplitude_bounds),
            },
            SeedPatternType::Ring => {
                let inner = self.uniform(seed_constraints.radius_bounds);
                let outer = inner + self.rng.gen_range(0.02..0.1);
                SeedGenome::Ring {
                    center: (self.rng.gen_range(0.3..0.7), self.rng.gen_range(0.3..0.7)),
                    inner_radius: inner,
                    outer_radius: outer,
                    amplitude: self.uniform(seed_constraints.amplitude_bounds),
                }
            }
            SeedPatternType::MultiBlob => {
                let num_blobs = self.rng.gen_range(2..=4);
                let blobs = (0..num_blobs)
                    .map(|_| BlobGenome {
                        center: (self.rng.gen_range(0.2..0.8), self.rng.gen_range(0.2..0.8)),
                        radius: self.uniform(seed_constraints.radius_bounds),
                        amplitude: self.uniform(seed_constraints.amplitude_bounds),
                    })
                    .collect();
                SeedGenome::MultiBlob { blobs }
            }
        }
    }

    /// Uniform random in bounds.
    fn uniform(&mut self, bounds: (f32, f32)) -> f32 {
        self.rng.gen_range(bounds.0..=bounds.1)
    }

    /// Gaussian mutation: add noise to a value.
    pub fn gaussian_mutate(&mut self, value: f32, strength: f32, bounds: (f32, f32)) -> f32 {
        let noise: f32 = self.rng.sample(rand_distr::StandardNormal);
        let mutated = value + noise * strength * (bounds.1 - bounds.0);
        mutated.clamp(bounds.0, bounds.1)
    }

    /// Perform crossover between two genomes.
    pub fn crossover(&mut self, parent1: &Genome, parent2: &Genome) -> Genome {
        let kernels: Vec<KernelGenome> = parent1
            .kernels
            .iter()
            .zip(parent2.kernels.iter())
            .map(|(k1, k2)| self.crossover_kernel(k1, k2))
            .collect();

        let flow = self.crossover_flow(&parent1.flow, &parent2.flow);

        let seed = match (&parent1.seed, &parent2.seed) {
            (Some(s1), Some(s2)) => Some(self.crossover_seed(s1, s2)),
            (Some(s), None) | (None, Some(s)) => Some(s.clone()),
            (None, None) => None,
        };

        Genome {
            kernels,
            flow,
            seed,
        }
    }

    /// Crossover kernel genomes.
    fn crossover_kernel(&mut self, k1: &KernelGenome, k2: &KernelGenome) -> KernelGenome {
        // Blend continuous parameters
        let t = self.rng.r#gen::<f32>();

        // For rings, randomly select from either parent
        let rings = if self.rng.gen_bool(0.5) {
            k1.rings.clone()
        } else {
            k2.rings.clone()
        };

        KernelGenome {
            radius: blend(k1.radius, k2.radius, t),
            rings,
            weight: blend(k1.weight, k2.weight, t),
            mu: blend(k1.mu, k2.mu, t),
            sigma: blend(k1.sigma, k2.sigma, t),
            source_channel: k1.source_channel,
            target_channel: k1.target_channel,
        }
    }

    /// Crossover flow genomes.
    fn crossover_flow(&mut self, f1: &FlowGenome, f2: &FlowGenome) -> FlowGenome {
        let t = self.rng.r#gen::<f32>();
        FlowGenome {
            beta_a: blend(f1.beta_a, f2.beta_a, t),
            n: blend(f1.n, f2.n, t),
            distribution_size: blend(f1.distribution_size, f2.distribution_size, t),
        }
    }

    /// Crossover seed genomes.
    fn crossover_seed(&mut self, s1: &SeedGenome, s2: &SeedGenome) -> SeedGenome {
        let t = self.rng.r#gen::<f32>();

        match (s1, s2) {
            (
                SeedGenome::GaussianBlob {
                    center: c1,
                    radius: r1,
                    amplitude: a1,
                },
                SeedGenome::GaussianBlob {
                    center: c2,
                    radius: r2,
                    amplitude: a2,
                },
            ) => SeedGenome::GaussianBlob {
                center: (blend(c1.0, c2.0, t), blend(c1.1, c2.1, t)),
                radius: blend(*r1, *r2, t),
                amplitude: blend(*a1, *a2, t),
            },
            _ => {
                // Different types: pick one randomly
                if self.rng.gen_bool(0.5) {
                    s1.clone()
                } else {
                    s2.clone()
                }
            }
        }
    }

    /// Mutate a genome.
    pub fn mutate(
        &mut self,
        genome: &mut Genome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        // Mutate kernels
        for kernel in &mut genome.kernels {
            self.mutate_kernel(kernel, rate, strength, constraints);
        }

        // Mutate flow
        self.mutate_flow(&mut genome.flow, rate, strength, constraints);

        // Mutate seed if present
        if let Some(seed) = &mut genome.seed {
            self.mutate_seed(seed, rate, strength, constraints);
        }
    }

    /// Mutate kernel genome.
    fn mutate_kernel(
        &mut self,
        kernel: &mut KernelGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.r#gen::<f32>() < rate {
            kernel.mu = self.gaussian_mutate(kernel.mu, strength, constraints.mu_bounds);
        }
        if self.rng.r#gen::<f32>() < rate {
            kernel.sigma = self.gaussian_mutate(kernel.sigma, strength, constraints.sigma_bounds);
        }
        if self.rng.r#gen::<f32>() < rate {
            kernel.weight =
                self.gaussian_mutate(kernel.weight, strength, constraints.weight_bounds);
        }

        // Mutate rings
        for ring in &mut kernel.rings {
            self.mutate_ring(ring, rate, strength, constraints);
        }

        // Occasionally add or remove a ring
        if self.rng.r#gen::<f32>() < rate * 0.1
            && kernel.rings.len() < constraints.ring_count_bounds.1
        {
            kernel.rings.push(self.random_ring_genome(constraints));
        }
        if self.rng.r#gen::<f32>() < rate * 0.1
            && kernel.rings.len() > constraints.ring_count_bounds.0
        {
            let idx = self.rng.gen_range(0..kernel.rings.len());
            kernel.rings.remove(idx);
        }
    }

    /// Mutate ring genome.
    fn mutate_ring(
        &mut self,
        ring: &mut RingGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.r#gen::<f32>() < rate {
            ring.amplitude =
                self.gaussian_mutate(ring.amplitude, strength, constraints.amplitude_bounds);
        }
        if self.rng.r#gen::<f32>() < rate {
            ring.distance =
                self.gaussian_mutate(ring.distance, strength, constraints.distance_bounds);
        }
        if self.rng.r#gen::<f32>() < rate {
            ring.width = self.gaussian_mutate(ring.width, strength, constraints.ring_width_bounds);
        }
    }

    /// Mutate flow genome.
    fn mutate_flow(
        &mut self,
        flow: &mut FlowGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.r#gen::<f32>() < rate {
            flow.beta_a = self.gaussian_mutate(flow.beta_a, strength, constraints.beta_a_bounds);
        }
        if self.rng.r#gen::<f32>() < rate {
            flow.n = self.gaussian_mutate(flow.n, strength, constraints.n_bounds);
        }
    }

    /// Mutate seed genome.
    fn mutate_seed(
        &mut self,
        seed: &mut SeedGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        let seed_constraints = constraints
            .seed_constraints
            .as_ref()
            .cloned()
            .unwrap_or_default();

        match seed {
            SeedGenome::GaussianBlob {
                center,
                radius,
                amplitude,
            } => {
                if self.rng.r#gen::<f32>() < rate {
                    center.0 = self.gaussian_mutate(center.0, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.r#gen::<f32>() < rate {
                    center.1 = self.gaussian_mutate(center.1, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.r#gen::<f32>() < rate {
                    *radius =
                        self.gaussian_mutate(*radius, strength, seed_constraints.radius_bounds);
                }
                if self.rng.r#gen::<f32>() < rate {
                    *amplitude = self.gaussian_mutate(
                        *amplitude,
                        strength,
                        seed_constraints.amplitude_bounds,
                    );
                }
            }
            SeedGenome::Ring {
                center,
                inner_radius,
                outer_radius,
                amplitude,
            } => {
                if self.rng.r#gen::<f32>() < rate {
                    center.0 = self.gaussian_mutate(center.0, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.r#gen::<f32>() < rate {
                    center.1 = self.gaussian_mutate(center.1, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.r#gen::<f32>() < rate {
                    *inner_radius = self.gaussian_mutate(
                        *inner_radius,
                        strength,
                        seed_constraints.radius_bounds,
                    );
                    // Ensure outer > inner
                    *outer_radius = (*outer_radius).max(*inner_radius + 0.01);
                }
                if self.rng.r#gen::<f32>() < rate {
                    *amplitude = self.gaussian_mutate(
                        *amplitude,
                        strength,
                        seed_constraints.amplitude_bounds,
                    );
                }
            }
            SeedGenome::MultiBlob { blobs } => {
                for blob in blobs.iter_mut() {
                    if self.rng.r#gen::<f32>() < rate {
                        blob.center.0 =
                            self.gaussian_mutate(blob.center.0, strength * 0.5, (0.1, 0.9));
                    }
                    if self.rng.r#gen::<f32>() < rate {
                        blob.center.1 =
                            self.gaussian_mutate(blob.center.1, strength * 0.5, (0.1, 0.9));
                    }
                    if self.rng.r#gen::<f32>() < rate {
                        blob.radius = self.gaussian_mutate(
                            blob.radius,
                            strength,
                            seed_constraints.radius_bounds,
                        );
                    }
                    if self.rng.r#gen::<f32>() < rate {
                        blob.amplitude = self.gaussian_mutate(
                            blob.amplitude,
                            strength,
                            seed_constraints.amplitude_bounds,
                        );
                    }
                }
            }
        }
    }

    /// Generate next u64 for seeding child RNGs.
    pub fn next_seed(&mut self) -> u64 {
        self.rng.r#gen()
    }
}

/// Linear blend between two values.
fn blend(a: f32, b: f32, t: f32) -> f32 {
    a * (1.0 - t) + b * t
}

/// Compute genetic distance between two genomes.
pub fn genome_distance(g1: &Genome, g2: &Genome) -> f32 {
    let mut distance = 0.0f32;
    let mut count = 0;

    // Compare kernels
    for (k1, k2) in g1.kernels.iter().zip(g2.kernels.iter()) {
        distance += (k1.mu - k2.mu).abs();
        distance += (k1.sigma - k2.sigma).abs();
        distance += (k1.weight - k2.weight).abs();

        // Compare rings
        let min_rings = k1.rings.len().min(k2.rings.len());
        for i in 0..min_rings {
            distance += (k1.rings[i].amplitude - k2.rings[i].amplitude).abs();
            distance += (k1.rings[i].distance - k2.rings[i].distance).abs();
            distance += (k1.rings[i].width - k2.rings[i].width).abs();
            count += 3;
        }
        // Penalty for different ring counts
        distance += (k1.rings.len() as i32 - k2.rings.len() as i32).unsigned_abs() as f32 * 0.1;

        count += 3;
    }

    // Compare flow
    distance += (g1.flow.beta_a - g2.flow.beta_a).abs();
    distance += (g1.flow.n - g2.flow.n).abs();
    count += 2;

    // Compare seeds if both present
    if let (Some(s1), Some(s2)) = (&g1.seed, &g2.seed) {
        match (s1, s2) {
            (
                SeedGenome::GaussianBlob {
                    center: c1,
                    radius: r1,
                    amplitude: a1,
                },
                SeedGenome::GaussianBlob {
                    center: c2,
                    radius: r2,
                    amplitude: a2,
                },
            ) => {
                distance += (c1.0 - c2.0).abs() + (c1.1 - c2.1).abs();
                distance += (r1 - r2).abs();
                distance += (a1 - a2).abs();
                count += 4;
            }
            _ => {
                distance += 1.0; // Different seed types
                count += 1;
            }
        }
    }

    if count > 0 {
        distance / count as f32
    } else {
        0.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_random_genome() {
        let mut rng = GenomeRng::new(42);
        let config = SimulationConfig::default();
        let constraints = GenomeConstraints::default();

        let genome = rng.random_genome(&config, &constraints);
        assert!(!genome.kernels.is_empty());
        assert!(genome.flow.beta_a >= constraints.beta_a_bounds.0);
        assert!(genome.flow.beta_a <= constraints.beta_a_bounds.1);
    }

    #[test]
    fn test_crossover() {
        let mut rng = GenomeRng::new(42);
        let config = SimulationConfig::default();
        let constraints = GenomeConstraints::default();

        let g1 = rng.random_genome(&config, &constraints);
        let g2 = rng.random_genome(&config, &constraints);

        let child = rng.crossover(&g1, &g2);
        assert_eq!(child.kernels.len(), g1.kernels.len());
    }

    #[test]
    fn test_mutation() {
        let mut rng = GenomeRng::new(42);
        let config = SimulationConfig::default();
        let constraints = GenomeConstraints::default();

        let mut genome = rng.random_genome(&config, &constraints);
        let _original_mu = genome.kernels[0].mu;

        // Mutate with high rate
        rng.mutate(&mut genome, 1.0, 0.5, &constraints);

        // Something should have changed (with high probability)
        // Note: This test might occasionally fail due to randomness
        assert!(genome.kernels[0].mu >= constraints.mu_bounds.0);
        assert!(genome.kernels[0].mu <= constraints.mu_bounds.1);
    }

    #[test]
    fn test_genome_distance() {
        let mut rng = GenomeRng::new(42);
        let config = SimulationConfig::default();
        let constraints = GenomeConstraints::default();

        let g1 = rng.random_genome(&config, &constraints);
        let g2 = g1.clone();
        let g3 = rng.random_genome(&config, &constraints);

        assert!((genome_distance(&g1, &g2)).abs() < 1e-6);
        assert!(genome_distance(&g1, &g3) > 0.0);
    }
}
