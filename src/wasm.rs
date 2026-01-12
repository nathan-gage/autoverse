//! WebAssembly bindings for Flow Lenia.
//!
//! Provides thin wrappers around `CpuPropagator` and evolution engine for browser environments.

use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::{
    compute::{CpuPropagator, CpuPropagator3D, SimulationState, SimulationStats},
    schema::{Seed, SimulationConfig},
};

// Evolution-related imports
use crate::schema::{
    BehaviorStats, BlobGenome, CandidateSnapshot, EvolutionConfig, EvolutionHistory,
    EvolutionPhase, EvolutionProgress, EvolutionResult, EvolutionStats, FlowGenome,
    GeneticAlgorithmConfig, Genome, GenomeConstraints, KernelGenome, MetricScore, RingGenome,
    SearchAlgorithm, SeedGenome, SeedPatternType, SelectionMethod, StopReason,
};

/// Initialize WASM module with panic hook and logging.
#[wasm_bindgen(start)]
pub fn init() {
    // Set panic hook for better error messages in browser
    console_error_panic_hook::set_once();

    // Initialize WASM logger
    wasm_logger::init(wasm_logger::Config::default());
}

/// WebAssembly wrapper for Flow Lenia propagator.
#[wasm_bindgen]
pub struct WasmPropagator {
    propagator: CpuPropagator,
    state: SimulationState,
}

#[wasm_bindgen]
impl WasmPropagator {
    /// Create new propagator from JSON configuration.
    ///
    /// # Arguments
    /// * `config_json` - JSON string containing SimulationConfig
    /// * `seed_json` - JSON string containing Seed
    ///
    /// # Panics
    /// Panics if JSON is invalid or configuration is invalid.
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str, seed_json: &str) -> Result<WasmPropagator, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let propagator = CpuPropagator::new(config.clone());
        let state = SimulationState::from_seed(&seed, &config);

        Ok(WasmPropagator { propagator, state })
    }

    /// Perform one simulation step.
    #[wasm_bindgen]
    pub fn step(&mut self) {
        self.propagator.step(&mut self.state);
    }

    /// Run multiple simulation steps.
    #[wasm_bindgen]
    pub fn run(&mut self, steps: u64) {
        self.propagator.run(&mut self.state, steps);
    }

    /// Get current simulation state as JSON.
    #[wasm_bindgen(js_name = getState)]
    pub fn get_state(&self) -> Result<JsValue, JsValue> {
        // Create serializable state snapshot
        let snapshot = StateSnapshot {
            channels: &self.state.channels,
            width: self.state.width,
            height: self.state.height,
            time: self.state.time,
            step: self.state.step,
        };

        serde_wasm_bindgen::to_value(&snapshot)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }

    /// Get simulation statistics as JSON.
    #[wasm_bindgen(js_name = getStats)]
    pub fn get_stats(&self) -> Result<JsValue, JsValue> {
        let stats = SimulationStats::from_state(&self.state);
        serde_wasm_bindgen::to_value(&stats)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }

    /// Reset simulation with new seed.
    #[wasm_bindgen]
    pub fn reset(&mut self, seed_json: &str) -> Result<(), JsValue> {
        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let config = self.propagator.config();
        self.state = SimulationState::from_seed(&seed, config);

        Ok(())
    }

    /// Get total mass across all channels.
    #[wasm_bindgen(js_name = totalMass)]
    pub fn total_mass(&self) -> f32 {
        self.state.total_mass()
    }

    /// Get current simulation time.
    #[wasm_bindgen(js_name = getTime)]
    pub fn get_time(&self) -> f32 {
        self.state.time
    }

    /// Get current step count.
    #[wasm_bindgen(js_name = getStep)]
    pub fn get_step(&self) -> u64 {
        self.state.step
    }

    /// Get grid width.
    #[wasm_bindgen(js_name = getWidth)]
    pub fn get_width(&self) -> usize {
        self.state.width
    }

    /// Get grid height.
    #[wasm_bindgen(js_name = getHeight)]
    pub fn get_height(&self) -> usize {
        self.state.height
    }
}

/// Serializable snapshot of simulation state.
#[derive(Serialize)]
struct StateSnapshot<'a> {
    channels: &'a [Vec<f32>],
    width: usize,
    height: usize,
    time: f32,
    step: u64,
}

// ============================================================================
// GPU Propagator (WebGPU)
// ============================================================================

use crate::compute::gpu::GpuPropagator;

/// WebAssembly wrapper for GPU-accelerated Flow Lenia propagator.
#[wasm_bindgen]
pub struct WasmGpuPropagator {
    propagator: GpuPropagator,
    state: SimulationState,
}

#[wasm_bindgen]
impl WasmGpuPropagator {
    /// Create new GPU propagator from JSON configuration.
    ///
    /// This is async because GPU initialization requires async adapter/device requests.
    #[wasm_bindgen(constructor)]
    pub async fn new(config_json: &str, seed_json: &str) -> Result<WasmGpuPropagator, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let propagator = GpuPropagator::new(config.clone())
            .await
            .map_err(|e| JsValue::from_str(&format!("GPU initialization failed: {e}")))?;

        let state = SimulationState::from_seed(&seed, &config);

        Ok(WasmGpuPropagator { propagator, state })
    }

    /// Perform one simulation step (async to allow GPU readback).
    #[wasm_bindgen]
    pub async fn step(&mut self) {
        self.propagator.step(&mut self.state);
        // Async readback to sync GPU state to CPU
        self.propagator.read_state_async(&mut self.state).await;
    }

    /// Run multiple simulation steps (async to allow GPU readback).
    #[wasm_bindgen]
    pub async fn run(&mut self, steps: u64) {
        self.propagator.run(&mut self.state, steps);
        // Async readback to sync GPU state to CPU after all steps
        self.propagator.read_state_async(&mut self.state).await;
    }

    /// Get current simulation state as JSON.
    #[wasm_bindgen(js_name = getState)]
    pub fn get_state(&self) -> Result<JsValue, JsValue> {
        let snapshot = StateSnapshot {
            channels: &self.state.channels,
            width: self.state.width,
            height: self.state.height,
            time: self.state.time,
            step: self.state.step,
        };

        serde_wasm_bindgen::to_value(&snapshot)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }

    /// Get simulation statistics as JSON.
    #[wasm_bindgen(js_name = getStats)]
    pub fn get_stats(&self) -> Result<JsValue, JsValue> {
        let stats = SimulationStats::from_state(&self.state);
        serde_wasm_bindgen::to_value(&stats)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }

    /// Reset simulation with new seed.
    #[wasm_bindgen]
    pub fn reset(&mut self, seed_json: &str) -> Result<(), JsValue> {
        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let config = self.propagator.config();
        self.state = SimulationState::from_seed(&seed, config);

        Ok(())
    }

    /// Get total mass across all channels.
    #[wasm_bindgen(js_name = totalMass)]
    pub fn total_mass(&self) -> f32 {
        self.state.total_mass()
    }

    /// Get current simulation time.
    #[wasm_bindgen(js_name = getTime)]
    pub fn get_time(&self) -> f32 {
        self.state.time
    }

    /// Get current step count.
    #[wasm_bindgen(js_name = getStep)]
    pub fn get_step(&self) -> u64 {
        self.state.step
    }

    /// Get grid width.
    #[wasm_bindgen(js_name = getWidth)]
    pub fn get_width(&self) -> usize {
        self.state.width
    }

    /// Get grid height.
    #[wasm_bindgen(js_name = getHeight)]
    pub fn get_height(&self) -> usize {
        self.state.height
    }
}

// ============================================================================
// 3D CPU Propagator
// ============================================================================

/// WebAssembly wrapper for 3D Flow Lenia CPU propagator.
#[wasm_bindgen]
pub struct WasmPropagator3D {
    propagator: CpuPropagator3D,
    state: SimulationState,
    width: usize,
    height: usize,
    depth: usize,
}

#[wasm_bindgen]
impl WasmPropagator3D {
    /// Create new 3D propagator from JSON configuration.
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str, seed_json: &str) -> Result<WasmPropagator3D, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        if !config.is_3d() {
            return Err(JsValue::from_str("Configuration must be 3D (depth > 1)"));
        }

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let width = config.width;
        let height = config.height;
        let depth = config.depth;

        let propagator = CpuPropagator3D::new(config.clone());
        let state = SimulationState::from_seed(&seed, &config);

        Ok(WasmPropagator3D {
            propagator,
            state,
            width,
            height,
            depth,
        })
    }

    /// Perform one simulation step.
    #[wasm_bindgen]
    pub fn step(&mut self) {
        self.propagator.step(&mut self.state);
    }

    /// Run multiple simulation steps.
    #[wasm_bindgen]
    pub fn run(&mut self, steps: u64) {
        self.propagator.run(&mut self.state, steps);
    }

    /// Get flat channel data for a specific channel.
    /// Returns flattened array in z-major order: data[z * height * width + y * width + x]
    #[wasm_bindgen(js_name = getChannelData)]
    pub fn get_channel_data(&self, channel: usize) -> Vec<f32> {
        if channel < self.state.channels.len() {
            self.state.channels[channel].clone()
        } else {
            vec![]
        }
    }

    /// Get total mass across all channels.
    #[wasm_bindgen(js_name = totalMass)]
    pub fn total_mass(&self) -> f32 {
        self.state.total_mass()
    }

    /// Get current simulation time.
    #[wasm_bindgen(js_name = getTime)]
    pub fn get_time(&self) -> f32 {
        self.state.time
    }

    /// Get current step count.
    #[wasm_bindgen(js_name = getStep)]
    pub fn get_step(&self) -> u64 {
        self.state.step
    }

    /// Get grid width.
    #[wasm_bindgen(js_name = getWidth)]
    pub fn get_width(&self) -> usize {
        self.width
    }

    /// Get grid height.
    #[wasm_bindgen(js_name = getHeight)]
    pub fn get_height(&self) -> usize {
        self.height
    }

    /// Get grid depth.
    #[wasm_bindgen(js_name = getDepth)]
    pub fn get_depth(&self) -> usize {
        self.depth
    }

    /// Get number of channels.
    #[wasm_bindgen(js_name = getChannels)]
    pub fn get_channels(&self) -> usize {
        self.state.channels.len()
    }
}

// ============================================================================
// 3D GPU Propagator
// ============================================================================

use crate::compute::gpu::GpuPropagator3D;

/// WebAssembly wrapper for 3D GPU-accelerated Flow Lenia propagator.
#[wasm_bindgen]
pub struct WasmGpuPropagator3D {
    propagator: GpuPropagator3D,
    state: SimulationState,
    width: usize,
    height: usize,
    depth: usize,
}

#[wasm_bindgen]
impl WasmGpuPropagator3D {
    /// Create new 3D GPU propagator from JSON configuration.
    #[wasm_bindgen(constructor)]
    pub async fn new(config_json: &str, seed_json: &str) -> Result<WasmGpuPropagator3D, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        if !config.is_3d() {
            return Err(JsValue::from_str("Configuration must be 3D (depth > 1)"));
        }

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let width = config.width;
        let height = config.height;
        let depth = config.depth;

        let propagator = GpuPropagator3D::new(config.clone())
            .await
            .map_err(|e| JsValue::from_str(&format!("GPU initialization failed: {e}")))?;

        let state = SimulationState::from_seed(&seed, &config);

        Ok(WasmGpuPropagator3D {
            propagator,
            state,
            width,
            height,
            depth,
        })
    }

    /// Perform one simulation step.
    #[wasm_bindgen]
    pub async fn step(&mut self) {
        self.propagator.step(&mut self.state);
        self.propagator.read_state_async(&mut self.state).await;
    }

    /// Run multiple simulation steps.
    #[wasm_bindgen]
    pub async fn run(&mut self, steps: u64) {
        self.propagator.run(&mut self.state, steps);
        self.propagator.read_state_async(&mut self.state).await;
    }

    /// Get flat channel data for a specific channel.
    #[wasm_bindgen(js_name = getChannelData)]
    pub fn get_channel_data(&self, channel: usize) -> Vec<f32> {
        if channel < self.state.channels.len() {
            self.state.channels[channel].clone()
        } else {
            vec![]
        }
    }

    /// Get total mass across all channels.
    #[wasm_bindgen(js_name = totalMass)]
    pub fn total_mass(&self) -> f32 {
        self.state.total_mass()
    }

    /// Get current simulation time.
    #[wasm_bindgen(js_name = getTime)]
    pub fn get_time(&self) -> f32 {
        self.state.time
    }

    /// Get current step count.
    #[wasm_bindgen(js_name = getStep)]
    pub fn get_step(&self) -> u64 {
        self.state.step
    }

    /// Get grid width.
    #[wasm_bindgen(js_name = getWidth)]
    pub fn get_width(&self) -> usize {
        self.width
    }

    /// Get grid height.
    #[wasm_bindgen(js_name = getHeight)]
    pub fn get_height(&self) -> usize {
        self.height
    }

    /// Get grid depth.
    #[wasm_bindgen(js_name = getDepth)]
    pub fn get_depth(&self) -> usize {
        self.depth
    }

    /// Get number of channels.
    #[wasm_bindgen(js_name = getChannels)]
    pub fn get_channels(&self) -> usize {
        self.state.channels.len()
    }
}

// ============================================================================
// WASM-Compatible Random Number Generator
// ============================================================================

/// WASM-compatible random number generator using xorshift64*.
struct WasmRng {
    state: u64,
}

impl WasmRng {
    fn new(seed: u64) -> Self {
        let state = if seed == 0 { 0xDEADBEEF } else { seed };
        Self { state }
    }

    #[allow(dead_code)]
    fn from_js_random() -> Self {
        let r1 = js_sys::Math::random();
        let r2 = js_sys::Math::random();
        let seed = ((r1 * u32::MAX as f64) as u64) << 32 | (r2 * u32::MAX as f64) as u64;
        Self::new(seed)
    }

    fn next_u64(&mut self) -> u64 {
        let mut x = self.state;
        x ^= x >> 12;
        x ^= x << 25;
        x ^= x >> 27;
        self.state = x;
        x.wrapping_mul(0x2545F4914F6CDD1D)
    }

    fn next_f32(&mut self) -> f32 {
        (self.next_u64() >> 40) as f32 / (1u64 << 24) as f32
    }

    fn uniform(&mut self, min: f32, max: f32) -> f32 {
        min + self.next_f32() * (max - min)
    }

    fn next_usize(&mut self, max: usize) -> usize {
        if max == 0 {
            return 0;
        }
        (self.next_u64() as usize) % max
    }

    fn gen_bool(&mut self, probability: f32) -> bool {
        self.next_f32() < probability
    }

    fn gaussian_mutate(&mut self, value: f32, strength: f32, bounds: (f32, f32)) -> f32 {
        let u1 = self.next_f32().max(1e-10);
        let u2 = self.next_f32();
        let normal = (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos();
        let mutated = value + normal * strength * (bounds.1 - bounds.0);
        mutated.clamp(bounds.0, bounds.1)
    }
}

// ============================================================================
// WASM Genome Operations
// ============================================================================

struct WasmGenomeRng {
    rng: WasmRng,
}

impl WasmGenomeRng {
    fn new(seed: u64) -> Self {
        Self {
            rng: WasmRng::new(seed),
        }
    }

    fn random_genome(
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

    fn random_kernel_genome(
        &mut self,
        source_channel: usize,
        target_channel: usize,
        constraints: &GenomeConstraints,
    ) -> KernelGenome {
        let num_rings = constraints.ring_count_bounds.0
            + self
                .rng
                .next_usize(constraints.ring_count_bounds.1 - constraints.ring_count_bounds.0 + 1);
        let rings: Vec<RingGenome> = (0..num_rings)
            .map(|_| self.random_ring_genome(constraints))
            .collect();
        KernelGenome {
            radius: 1.0,
            rings,
            weight: self
                .rng
                .uniform(constraints.weight_bounds.0, constraints.weight_bounds.1),
            mu: self
                .rng
                .uniform(constraints.mu_bounds.0, constraints.mu_bounds.1),
            sigma: self
                .rng
                .uniform(constraints.sigma_bounds.0, constraints.sigma_bounds.1),
            source_channel,
            target_channel,
        }
    }

    fn random_ring_genome(&mut self, constraints: &GenomeConstraints) -> RingGenome {
        RingGenome {
            amplitude: self.rng.uniform(
                constraints.amplitude_bounds.0,
                constraints.amplitude_bounds.1,
            ),
            distance: self
                .rng
                .uniform(constraints.distance_bounds.0, constraints.distance_bounds.1),
            width: self.rng.uniform(
                constraints.ring_width_bounds.0,
                constraints.ring_width_bounds.1,
            ),
        }
    }

    fn random_flow_genome(&mut self, constraints: &GenomeConstraints) -> FlowGenome {
        FlowGenome {
            beta_a: self
                .rng
                .uniform(constraints.beta_a_bounds.0, constraints.beta_a_bounds.1),
            n: self
                .rng
                .uniform(constraints.n_bounds.0, constraints.n_bounds.1),
            distribution_size: 1.0,
        }
    }

    fn random_seed_genome(&mut self, constraints: &GenomeConstraints) -> SeedGenome {
        let seed_constraints = constraints
            .seed_constraints
            .as_ref()
            .cloned()
            .unwrap_or_default();
        let pattern_types = &seed_constraints.allowed_patterns;
        let pattern_type = if pattern_types.is_empty() {
            SeedPatternType::GaussianBlob
        } else {
            pattern_types[self.rng.next_usize(pattern_types.len())]
        };
        match pattern_type {
            SeedPatternType::GaussianBlob => SeedGenome::GaussianBlob {
                center: (self.rng.uniform(0.3, 0.7), self.rng.uniform(0.3, 0.7)),
                radius: self.rng.uniform(
                    seed_constraints.radius_bounds.0,
                    seed_constraints.radius_bounds.1,
                ),
                amplitude: self.rng.uniform(
                    seed_constraints.amplitude_bounds.0,
                    seed_constraints.amplitude_bounds.1,
                ),
            },
            SeedPatternType::Ring => {
                let inner = self.rng.uniform(
                    seed_constraints.radius_bounds.0,
                    seed_constraints.radius_bounds.1,
                );
                SeedGenome::Ring {
                    center: (self.rng.uniform(0.3, 0.7), self.rng.uniform(0.3, 0.7)),
                    inner_radius: inner,
                    outer_radius: inner + self.rng.uniform(0.02, 0.1),
                    amplitude: self.rng.uniform(
                        seed_constraints.amplitude_bounds.0,
                        seed_constraints.amplitude_bounds.1,
                    ),
                }
            }
            SeedPatternType::MultiBlob => {
                let num_blobs = 2 + self.rng.next_usize(3);
                SeedGenome::MultiBlob {
                    blobs: (0..num_blobs)
                        .map(|_| BlobGenome {
                            center: (self.rng.uniform(0.2, 0.8), self.rng.uniform(0.2, 0.8)),
                            radius: self.rng.uniform(
                                seed_constraints.radius_bounds.0,
                                seed_constraints.radius_bounds.1,
                            ),
                            amplitude: self.rng.uniform(
                                seed_constraints.amplitude_bounds.0,
                                seed_constraints.amplitude_bounds.1,
                            ),
                        })
                        .collect(),
                }
            }
        }
    }

    fn crossover(&mut self, parent1: &Genome, parent2: &Genome) -> Genome {
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

    fn crossover_kernel(&mut self, k1: &KernelGenome, k2: &KernelGenome) -> KernelGenome {
        let t = self.rng.next_f32();
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

    fn crossover_flow(&mut self, f1: &FlowGenome, f2: &FlowGenome) -> FlowGenome {
        let t = self.rng.next_f32();
        FlowGenome {
            beta_a: blend(f1.beta_a, f2.beta_a, t),
            n: blend(f1.n, f2.n, t),
            distribution_size: blend(f1.distribution_size, f2.distribution_size, t),
        }
    }

    fn crossover_seed(&mut self, s1: &SeedGenome, s2: &SeedGenome) -> SeedGenome {
        let t = self.rng.next_f32();
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
                if self.rng.gen_bool(0.5) {
                    s1.clone()
                } else {
                    s2.clone()
                }
            }
        }
    }

    fn mutate(
        &mut self,
        genome: &mut Genome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        for kernel in &mut genome.kernels {
            self.mutate_kernel(kernel, rate, strength, constraints);
        }
        self.mutate_flow(&mut genome.flow, rate, strength, constraints);
        if let Some(seed) = &mut genome.seed {
            self.mutate_seed(seed, rate, strength, constraints);
        }
    }

    fn mutate_kernel(
        &mut self,
        kernel: &mut KernelGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.gen_bool(rate) {
            kernel.mu = self
                .rng
                .gaussian_mutate(kernel.mu, strength, constraints.mu_bounds);
        }
        if self.rng.gen_bool(rate) {
            kernel.sigma =
                self.rng
                    .gaussian_mutate(kernel.sigma, strength, constraints.sigma_bounds);
        }
        if self.rng.gen_bool(rate) {
            kernel.weight =
                self.rng
                    .gaussian_mutate(kernel.weight, strength, constraints.weight_bounds);
        }
        for ring in &mut kernel.rings {
            self.mutate_ring(ring, rate, strength, constraints);
        }
        if self.rng.gen_bool(rate * 0.1) && kernel.rings.len() < constraints.ring_count_bounds.1 {
            kernel.rings.push(self.random_ring_genome(constraints));
        }
        if self.rng.gen_bool(rate * 0.1) && kernel.rings.len() > constraints.ring_count_bounds.0 {
            kernel.rings.remove(self.rng.next_usize(kernel.rings.len()));
        }
    }

    fn mutate_ring(
        &mut self,
        ring: &mut RingGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.gen_bool(rate) {
            ring.amplitude =
                self.rng
                    .gaussian_mutate(ring.amplitude, strength, constraints.amplitude_bounds);
        }
        if self.rng.gen_bool(rate) {
            ring.distance =
                self.rng
                    .gaussian_mutate(ring.distance, strength, constraints.distance_bounds);
        }
        if self.rng.gen_bool(rate) {
            ring.width =
                self.rng
                    .gaussian_mutate(ring.width, strength, constraints.ring_width_bounds);
        }
    }

    fn mutate_flow(
        &mut self,
        flow: &mut FlowGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        if self.rng.gen_bool(rate) {
            flow.beta_a =
                self.rng
                    .gaussian_mutate(flow.beta_a, strength, constraints.beta_a_bounds);
        }
        if self.rng.gen_bool(rate) {
            flow.n = self
                .rng
                .gaussian_mutate(flow.n, strength, constraints.n_bounds);
        }
    }

    fn mutate_seed(
        &mut self,
        seed: &mut SeedGenome,
        rate: f32,
        strength: f32,
        constraints: &GenomeConstraints,
    ) {
        let sc = constraints
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
                if self.rng.gen_bool(rate) {
                    center.0 = self
                        .rng
                        .gaussian_mutate(center.0, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.gen_bool(rate) {
                    center.1 = self
                        .rng
                        .gaussian_mutate(center.1, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.gen_bool(rate) {
                    *radius = self
                        .rng
                        .gaussian_mutate(*radius, strength, sc.radius_bounds);
                }
                if self.rng.gen_bool(rate) {
                    *amplitude =
                        self.rng
                            .gaussian_mutate(*amplitude, strength, sc.amplitude_bounds);
                }
            }
            SeedGenome::Ring {
                center,
                inner_radius,
                outer_radius,
                amplitude,
            } => {
                if self.rng.gen_bool(rate) {
                    center.0 = self
                        .rng
                        .gaussian_mutate(center.0, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.gen_bool(rate) {
                    center.1 = self
                        .rng
                        .gaussian_mutate(center.1, strength * 0.5, (0.1, 0.9));
                }
                if self.rng.gen_bool(rate) {
                    *inner_radius =
                        self.rng
                            .gaussian_mutate(*inner_radius, strength, sc.radius_bounds);
                    *outer_radius = (*outer_radius).max(*inner_radius + 0.01);
                }
                if self.rng.gen_bool(rate) {
                    *amplitude =
                        self.rng
                            .gaussian_mutate(*amplitude, strength, sc.amplitude_bounds);
                }
            }
            SeedGenome::MultiBlob { blobs } => {
                for blob in blobs.iter_mut() {
                    if self.rng.gen_bool(rate) {
                        blob.center.0 =
                            self.rng
                                .gaussian_mutate(blob.center.0, strength * 0.5, (0.1, 0.9));
                    }
                    if self.rng.gen_bool(rate) {
                        blob.center.1 =
                            self.rng
                                .gaussian_mutate(blob.center.1, strength * 0.5, (0.1, 0.9));
                    }
                    if self.rng.gen_bool(rate) {
                        blob.radius =
                            self.rng
                                .gaussian_mutate(blob.radius, strength, sc.radius_bounds);
                    }
                    if self.rng.gen_bool(rate) {
                        blob.amplitude =
                            self.rng
                                .gaussian_mutate(blob.amplitude, strength, sc.amplitude_bounds);
                    }
                }
            }
        }
    }
}

fn blend(a: f32, b: f32, t: f32) -> f32 {
    a * (1.0 - t) + b * t
}

fn genome_distance(g1: &Genome, g2: &Genome) -> f32 {
    let mut distance = 0.0f32;
    let mut count = 0;
    for (k1, k2) in g1.kernels.iter().zip(g2.kernels.iter()) {
        distance +=
            (k1.mu - k2.mu).abs() + (k1.sigma - k2.sigma).abs() + (k1.weight - k2.weight).abs();
        count += 3;
        for i in 0..k1.rings.len().min(k2.rings.len()) {
            distance += (k1.rings[i].amplitude - k2.rings[i].amplitude).abs();
            distance += (k1.rings[i].distance - k2.rings[i].distance).abs();
            distance += (k1.rings[i].width - k2.rings[i].width).abs();
            count += 3;
        }
        distance += (k1.rings.len() as i32 - k2.rings.len() as i32).unsigned_abs() as f32 * 0.1;
    }
    distance += (g1.flow.beta_a - g2.flow.beta_a).abs() + (g1.flow.n - g2.flow.n).abs();
    count += 2;
    if count > 0 {
        distance / count as f32
    } else {
        0.0
    }
}

// ============================================================================
// WASM Fitness Evaluator
// ============================================================================

use crate::schema::{EvaluationConfig, FitnessConfig, FitnessMetric};

#[derive(Debug, Clone)]
struct WasmMetricResult {
    metric: FitnessMetric,
    score: f32,
    weight: f32,
}

struct WasmEvaluationTrajectory {
    initial_mass: f32,
    initial_snapshot: Vec<f32>,
    center_samples: Vec<(f32, f32)>,
    radius_samples: Vec<f32>,
    mass_samples: Vec<f32>,
    max_samples: Vec<f32>,
    active_cell_samples: Vec<usize>,
    state_snapshots: Vec<(u64, Vec<f32>)>,
    width: usize,
    height: usize,
}

impl WasmEvaluationTrajectory {
    fn new(state: &SimulationState) -> Self {
        let initial_snapshot = state.channel_sum();
        let (cx, cy) = compute_center_of_mass(&initial_snapshot, state.width, state.height);
        let _ = compute_radius(&initial_snapshot, cx, cy, state.width, state.height);
        Self {
            initial_mass: state.total_mass(),
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
    fn record_sample(&mut self, state: &SimulationState, step: u64) {
        let sum = state.channel_sum();
        let (cx, cy) = compute_center_of_mass(&sum, state.width, state.height);
        self.center_samples.push((cx, cy));
        self.radius_samples
            .push(compute_radius(&sum, cx, cy, state.width, state.height));
        self.mass_samples.push(sum.iter().sum());
        self.max_samples
            .push(sum.iter().cloned().fold(0.0f32, f32::max));
        self.active_cell_samples
            .push(sum.iter().filter(|&&v| v > 1e-6).count());
        self.state_snapshots.push((step, sum));
    }
    fn to_behavior_stats(&self) -> BehaviorStats {
        let disp = if self.center_samples.len() >= 2 {
            let (sx, sy) = self.center_samples[0];
            let (ex, ey) = *self.center_samples.last().unwrap();
            ((ex - sx).powi(2) + (ey - sy).powi(2)).sqrt()
        } else {
            0.0
        };
        BehaviorStats {
            final_mass: self.mass_samples.last().copied().unwrap_or(0.0),
            initial_mass: self.initial_mass,
            center_of_mass_trajectory: self.center_samples.clone(),
            total_displacement: disp,
            radius_over_time: self.radius_samples.clone(),
            final_radius: self.radius_samples.last().copied().unwrap_or(0.0),
            active_cells: self.active_cell_samples.last().copied().unwrap_or(0),
            max_activation: self.max_samples.iter().cloned().fold(0.0f32, f32::max),
        }
    }
}

fn compute_center_of_mass(grid: &[f32], width: usize, height: usize) -> (f32, f32) {
    let (mut total, mut cx, mut cy) = (0.0f32, 0.0f32, 0.0f32);
    for y in 0..height {
        for x in 0..width {
            let m = grid[y * width + x];
            if m > 0.0 {
                total += m;
                cx += x as f32 * m;
                cy += y as f32 * m;
            }
        }
    }
    if total > 1e-6 {
        (cx / total, cy / total)
    } else {
        (width as f32 / 2.0, height as f32 / 2.0)
    }
}

fn compute_radius(grid: &[f32], cx: f32, cy: f32, width: usize, height: usize) -> f32 {
    let (mut total, mut moment) = (0.0f32, 0.0f32);
    for y in 0..height {
        for x in 0..width {
            let m = grid[y * width + x];
            if m > 0.0 {
                let (dx, dy) = (x as f32 - cx, y as f32 - cy);
                total += m;
                moment += m * (dx * dx + dy * dy);
            }
        }
    }
    if total > 1e-6 {
        (moment / total).sqrt()
    } else {
        0.0
    }
}

struct WasmFitnessEvaluator {
    config: FitnessConfig,
    eval_config: EvaluationConfig,
}

impl WasmFitnessEvaluator {
    fn new(config: FitnessConfig, eval_config: EvaluationConfig) -> Self {
        Self {
            config,
            eval_config,
        }
    }
    fn evaluate(
        &self,
        sim_config: &SimulationConfig,
        seed: &Seed,
    ) -> (f32, Vec<WasmMetricResult>, BehaviorStats) {
        let mut propagator = CpuPropagator::new(sim_config.clone());
        let mut state = SimulationState::from_seed(seed, sim_config);
        let mut trajectory = WasmEvaluationTrajectory::new(&state);
        for _ in 0..self.eval_config.warmup_steps {
            propagator.step(&mut state);
        }
        trajectory.record_sample(&state, 0);
        let interval = self.eval_config.sample_interval.max(1);
        for step in 1..=self.eval_config.steps {
            propagator.step(&mut state);
            if step % interval == 0 {
                trajectory.record_sample(&state, step);
            }
        }
        let results: Vec<WasmMetricResult> = self
            .config
            .metrics
            .iter()
            .map(|w| WasmMetricResult {
                metric: w.metric.clone(),
                score: self.compute_metric(&w.metric, &trajectory, &state),
                weight: w.weight,
            })
            .collect();
        let scores: Vec<f32> = if self.config.normalize {
            results.iter().map(|r| r.score.clamp(0.0, 1.0)).collect()
        } else {
            results.iter().map(|r| r.score).collect()
        };
        let tw: f32 = self.config.metrics.iter().map(|m| m.weight).sum();
        (
            scores
                .iter()
                .zip(&self.config.metrics)
                .map(|(s, m)| s * m.weight)
                .sum::<f32>()
                / tw.max(1e-6),
            results,
            trajectory.to_behavior_stats(),
        )
    }
    fn compute_metric(
        &self,
        metric: &FitnessMetric,
        t: &WasmEvaluationTrajectory,
        state: &SimulationState,
    ) -> f32 {
        match metric {
            FitnessMetric::Persistence => {
                if t.initial_mass < 1e-6 {
                    0.0
                } else {
                    let fm = t.mass_samples.last().copied().unwrap_or(0.0);
                    let c = if fm > 1e-6 {
                        t.max_samples.last().copied().unwrap_or(0.0)
                            / (fm / t.active_cell_samples.last().copied().unwrap_or(1) as f32)
                    } else {
                        0.0
                    };
                    (fm / t.initial_mass * c.min(10.0) / 10.0).clamp(0.0, 1.0)
                }
            }
            FitnessMetric::Compactness => (1.0
                - t.radius_samples.last().copied().unwrap_or(f32::MAX)
                    / ((state.width.min(state.height) as f32) / 2.0))
                .clamp(0.0, 1.0),
            FitnessMetric::Locomotion => {
                if t.center_samples.len() < 2 {
                    0.0
                } else {
                    let (sx, sy) = t.center_samples[0];
                    let (ex, ey) = *t.center_samples.last().unwrap();
                    (((ex - sx).powi(2) + (ey - sy).powi(2)).sqrt()
                        / ((t.width.pow(2) + t.height.pow(2)) as f32).sqrt())
                    .clamp(0.0, 1.0)
                }
            }
            FitnessMetric::Periodicity {
                period,
                tolerance: _,
            } => t
                .state_snapshots
                .iter()
                .filter(|(s, _)| *s == *period || *s > 0)
                .map(|(_, snap)| {
                    let d: f32 = t
                        .initial_snapshot
                        .iter()
                        .zip(snap.iter())
                        .map(|(a, b)| a * b)
                        .sum();
                    let na: f32 = t.initial_snapshot.iter().map(|x| x * x).sum::<f32>().sqrt();
                    let nb: f32 = snap.iter().map(|x| x * x).sum::<f32>().sqrt();
                    if na > 1e-6 && nb > 1e-6 {
                        d / (na * nb)
                    } else {
                        0.0
                    }
                })
                .fold(0.0f32, f32::max),
            FitnessMetric::Complexity => {
                let sum = state.channel_sum();
                let mean: f32 = sum.iter().sum::<f32>() / sum.len() as f32;
                if mean < 1e-6 {
                    0.0
                } else {
                    let var: f32 =
                        sum.iter().map(|&x| (x - mean).powi(2)).sum::<f32>() / sum.len() as f32;
                    let mut gs = 0.0f32;
                    for y in 0..state.height {
                        for x in 0..state.width {
                            let idx = y * state.width + x;
                            if x > 0 {
                                gs += (sum[idx] - sum[idx - 1]).abs();
                            }
                            if y > 0 {
                                gs += (sum[idx] - sum[idx - state.width]).abs();
                            }
                        }
                    }
                    ((var.sqrt() + gs / (2 * sum.len()) as f32) / 2.0).min(1.0)
                }
            }
            FitnessMetric::MassConcentration => {
                let sum = state.channel_sum();
                let mean: f32 = sum.iter().sum::<f32>() / sum.len() as f32;
                if mean < 1e-6 {
                    0.0
                } else {
                    (sum.iter().cloned().fold(0.0f32, f32::max) / mean / 100.0).min(1.0)
                }
            }
            FitnessMetric::GliderScore { min_displacement } => {
                let d = if t.center_samples.len() >= 2 {
                    let (sx, sy) = t.center_samples[0];
                    let (ex, ey) = *t.center_samples.last().unwrap();
                    ((ex - sx).powi(2) + (ey - sy).powi(2)).sqrt()
                } else {
                    0.0
                };
                if d < *min_displacement {
                    0.0
                } else {
                    self.compute_metric(&FitnessMetric::Locomotion, t, state)
                        * self.compute_metric(&FitnessMetric::Compactness, t, state)
                        * self.compute_metric(&FitnessMetric::Persistence, t, state)
                }
            }
            FitnessMetric::OscillatorScore {
                max_period,
                threshold,
            } => {
                let mut best = 0.0f32;
                for p in 1..=*max_period {
                    for (i, (si, snapi)) in t.state_snapshots.iter().enumerate() {
                        for (sj, snapj) in t.state_snapshots.iter().skip(i + 1) {
                            if sj - si == p {
                                let d: f32 =
                                    snapi.iter().zip(snapj.iter()).map(|(a, b)| a * b).sum();
                                let na: f32 = snapi.iter().map(|x| x * x).sum::<f32>().sqrt();
                                let nb: f32 = snapj.iter().map(|x| x * x).sum::<f32>().sqrt();
                                let sim = if na > 1e-6 && nb > 1e-6 {
                                    d / (na * nb)
                                } else {
                                    0.0
                                };
                                if sim > *threshold {
                                    best =
                                        best.max(sim * (1.0 - p as f32 / *max_period as f32 * 0.5));
                                }
                            }
                        }
                    }
                }
                best
            }
            FitnessMetric::Stability => {
                let sum = state.channel_sum();
                let np =
                    (sum.iter().filter(|&&v| v < 0.0).count() as f32 / sum.len() as f32).min(1.0);
                let max = sum.iter().cloned().fold(0.0f32, f32::max);
                let ep = if max > 10.0 { (max - 10.0) / max } else { 0.0 };
                let me = if t.initial_mass > 1e-6 {
                    ((t.mass_samples.last().copied().unwrap_or(0.0) - t.initial_mass)
                        / t.initial_mass)
                        .abs()
                } else {
                    0.0
                };
                (1.0 - np - ep - me).clamp(0.0, 1.0)
            }
            FitnessMetric::Custom { .. } => 0.0,
        }
    }
}

// ============================================================================
// WASM Evolution Candidate
// ============================================================================

#[derive(Debug, Clone)]
struct WasmCandidate {
    id: u64,
    genome: Genome,
    fitness: f32,
    metrics: Vec<WasmMetricResult>,
    behavior: BehaviorStats,
    generation: usize,
    parents: Vec<u64>,
}

impl WasmCandidate {
    fn to_snapshot(
        &self,
        base_config: &SimulationConfig,
        default_seed: &Seed,
    ) -> CandidateSnapshot {
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
            config: self.genome.to_config(base_config),
            seed: self
                .genome
                .to_seed(0)
                .unwrap_or_else(|| default_seed.clone()),
            generation: self.generation,
            parents: self.parents.clone(),
            behavior: self.behavior.clone(),
        }
    }
}

// ============================================================================
// WASM Evolution Engine (Exported)
// ============================================================================

/// WebAssembly wrapper for evolutionary pattern search.
#[wasm_bindgen]
pub struct WasmEvolutionEngine {
    config: EvolutionConfig,
    rng: WasmGenomeRng,
    evaluator: WasmFitnessEvaluator,
    population: Vec<WasmCandidate>,
    archive: Vec<WasmCandidate>,
    history: EvolutionHistory,
    generation: usize,
    best_fitness: f32,
    stagnation_count: usize,
    next_id: u64,
    cancelled: bool,
    default_seed: Seed,
    initialized: bool,
    initial_evaluation_done: bool,
}

#[wasm_bindgen]
impl WasmEvolutionEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str) -> Result<WasmEvolutionEngine, JsValue> {
        let config: EvolutionConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;
        config
            .validate()
            .map_err(|e| JsValue::from_str(&format!("Invalid config: {e:?}")))?;
        let seed = config
            .random_seed
            .unwrap_or_else(|| (js_sys::Math::random() * u64::MAX as f64) as u64);
        Ok(WasmEvolutionEngine {
            config: config.clone(),
            rng: WasmGenomeRng::new(seed),
            evaluator: WasmFitnessEvaluator::new(config.fitness.clone(), config.evaluation.clone()),
            population: Vec::new(),
            archive: Vec::new(),
            history: EvolutionHistory::default(),
            generation: 0,
            best_fitness: f32::NEG_INFINITY,
            stagnation_count: 0,
            next_id: 0,
            cancelled: false,
            default_seed: Seed::default(),
            initialized: false,
            initial_evaluation_done: false,
        })
    }
    #[wasm_bindgen(js_name = setDefaultSeed)]
    pub fn set_default_seed(&mut self, seed_json: &str) -> Result<(), JsValue> {
        self.default_seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;
        Ok(())
    }
    #[wasm_bindgen]
    pub fn step(&mut self) -> Result<JsValue, JsValue> {
        if self.cancelled {
            return self.get_progress();
        }
        if !self.initialized {
            self.initialize();
            self.initialized = true;
            return self.get_progress();
        }
        if !self.initial_evaluation_done {
            self.evaluate_population();
            self.initial_evaluation_done = true;
            // Update best_fitness and history after initial evaluation
            self.update_best_fitness_and_history();
            self.update_archive();
            return self.get_progress();
        }
        if self.should_stop().is_some() {
            return self.get_progress();
        }
        self.step_generation();
        self.evaluate_population();
        self.get_progress()
    }
    #[wasm_bindgen(js_name = isComplete)]
    pub fn is_complete(&self) -> bool {
        self.initialized && self.initial_evaluation_done && self.should_stop().is_some()
    }
    #[wasm_bindgen(js_name = getResult)]
    pub fn get_result(&self) -> Result<JsValue, JsValue> {
        let sr = self.should_stop().unwrap_or(StopReason::MaxGenerations);
        let best = self
            .population
            .iter()
            .chain(self.archive.iter())
            .max_by(|a, b| {
                a.fitness
                    .partial_cmp(&b.fitness)
                    .unwrap_or(std::cmp::Ordering::Less)
            })
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
            .ok_or_else(|| JsValue::from_str("No candidates found"))?;
        let archive: Vec<CandidateSnapshot> = self
            .archive
            .iter()
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
            .collect();
        let avg = if self.population.is_empty() {
            0.0
        } else {
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32
        };
        serde_wasm_bindgen::to_value(&EvolutionResult {
            best,
            archive,
            stats: EvolutionStats {
                generations: self.generation,
                total_evaluations: (self.generation + 1) as u64
                    * self.config.population.size as u64,
                best_fitness: self.best_fitness,
                final_avg_fitness: avg,
                elapsed_seconds: 0.0,
                evaluations_per_second: 0.0,
                stop_reason: sr,
            },
            history: self.history.clone(),
        })
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }
    #[wasm_bindgen]
    pub fn cancel(&mut self) {
        self.cancelled = true;
    }
    #[wasm_bindgen(js_name = getBestCandidateState)]
    pub fn get_best_candidate_state(&self) -> Result<JsValue, JsValue> {
        let best = self
            .population
            .iter()
            .max_by(|a, b| {
                a.fitness
                    .partial_cmp(&b.fitness)
                    .unwrap_or(std::cmp::Ordering::Less)
            })
            .ok_or_else(|| JsValue::from_str("No candidates"))?;
        let config = best.genome.to_config(&self.config.base_config);
        let seed = best
            .genome
            .to_seed(0)
            .unwrap_or_else(|| self.default_seed.clone());
        let mut propagator = CpuPropagator::new(config.clone());
        let mut state = SimulationState::from_seed(&seed, &config);
        for _ in 0..self.config.evaluation.steps / 2 {
            propagator.step(&mut state);
        }
        serde_wasm_bindgen::to_value(&StateSnapshot {
            channels: &state.channels,
            width: state.width,
            height: state.height,
            time: state.time,
            step: state.step,
        })
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }
    #[wasm_bindgen(js_name = getGeneration)]
    pub fn get_generation(&self) -> usize {
        self.generation
    }
    #[wasm_bindgen(js_name = getBestFitness)]
    pub fn get_best_fitness(&self) -> f32 {
        self.best_fitness
    }
    #[wasm_bindgen(js_name = getPopulationSize)]
    pub fn get_population_size(&self) -> usize {
        self.population.len()
    }
    #[wasm_bindgen(js_name = getArchiveSize)]
    pub fn get_archive_size(&self) -> usize {
        self.archive.len()
    }
}

impl WasmEvolutionEngine {
    fn initialize(&mut self) {
        self.population.clear();
        self.generation = 0;
        for _ in 0..self.config.population.size {
            let genome = self
                .rng
                .random_genome(&self.config.base_config, &self.config.constraints);
            self.population.push(WasmCandidate {
                id: self.next_id,
                genome,
                fitness: 0.0,
                metrics: Vec::new(),
                behavior: BehaviorStats::default(),
                generation: 0,
                parents: Vec::new(),
            });
            self.next_id += 1;
        }
    }
    fn evaluate_population(&mut self) {
        for c in &mut self.population {
            let cfg = c.genome.to_config(&self.config.base_config);
            let s = c
                .genome
                .to_seed(0)
                .unwrap_or_else(|| self.default_seed.clone());
            let (f, m, b) = self.evaluator.evaluate(&cfg, &s);
            c.fitness = f;
            c.metrics = m;
            c.behavior = b;
        }
    }
    fn update_best_fitness_and_history(&mut self) {
        // Sort population by fitness to get current best
        self.population.sort_by(|a, b| {
            b.fitness
                .partial_cmp(&a.fitness)
                .unwrap_or(std::cmp::Ordering::Less)
        });
        let generation_best = self.population[0].fitness;

        // Update best_fitness if we found a better candidate
        if generation_best > self.best_fitness {
            self.best_fitness = generation_best;
            self.stagnation_count = 0;
        } else {
            self.stagnation_count += 1;
        }

        // Update history
        let avg =
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32;
        self.history.best_fitness.push(generation_best);
        self.history.avg_fitness.push(avg);
        self.history.fitness_std.push(
            (self
                .population
                .iter()
                .map(|c| (c.fitness - avg).powi(2))
                .sum::<f32>()
                / self.population.len() as f32)
                .sqrt(),
        );
        self.history.diversity.push(self.compute_diversity());
    }
    fn step_generation(&mut self) {
        let ga = match &self.config.algorithm {
            SearchAlgorithm::GeneticAlgorithm(c) => c.clone(),
            _ => GeneticAlgorithmConfig::default(),
        };
        // Update best fitness, history, and archive
        self.update_best_fitness_and_history();
        self.update_archive();
        let mut ng = Vec::with_capacity(self.config.population.size);
        for i in 0..ga.elitism.min(self.population.len()) {
            let mut e = self.population[i].clone();
            e.generation = self.generation + 1;
            ng.push(e);
        }
        while ng.len() < self.config.population.size {
            let (i1, i2) = (
                self.select_index(&ga.selection),
                self.select_index(&ga.selection),
            );
            let (p1, p2, id1, id2) = (
                self.population[i1].genome.clone(),
                self.population[i2].genome.clone(),
                self.population[i1].id,
                self.population[i2].id,
            );
            let mut child = if self.rng.rng.next_f32() < ga.crossover_rate {
                self.rng.crossover(&p1, &p2)
            } else {
                p1
            };
            self.rng.mutate(
                &mut child,
                ga.mutation_rate,
                ga.mutation_strength,
                &self.config.constraints,
            );
            ng.push(WasmCandidate {
                id: self.next_id,
                genome: child,
                fitness: 0.0,
                metrics: Vec::new(),
                behavior: BehaviorStats::default(),
                generation: self.generation + 1,
                parents: vec![id1, id2],
            });
            self.next_id += 1;
        }
        self.population = ng;
        self.generation += 1;
    }
    fn select_index(&mut self, m: &SelectionMethod) -> usize {
        match m {
            SelectionMethod::Tournament { size } => {
                let (mut bi, mut bf) = (0, f32::NEG_INFINITY);
                for _ in 0..*size {
                    let i = self.rng.rng.next_usize(self.population.len());
                    if self.population[i].fitness > bf {
                        bf = self.population[i].fitness;
                        bi = i;
                    }
                }
                bi
            }
            SelectionMethod::RankBased => {
                let tr: usize = (1..=self.population.len()).sum();
                let mut t = self.rng.rng.next_usize(tr);
                for i in 0..self.population.len() {
                    let r = self.population.len() - i;
                    if t < r {
                        return i;
                    }
                    t -= r;
                }
                0
            }
            SelectionMethod::RouletteWheel => {
                let tot: f32 = self.population.iter().map(|c| c.fitness.max(0.0)).sum();
                if tot <= 0.0 {
                    0
                } else {
                    let tgt = self.rng.rng.next_f32() * tot;
                    let mut cum = 0.0;
                    for (i, c) in self.population.iter().enumerate() {
                        cum += c.fitness.max(0.0);
                        if cum >= tgt {
                            return i;
                        }
                    }
                    0
                }
            }
        }
    }
    fn compute_diversity(&self) -> f32 {
        if self.population.len() < 2 {
            0.0
        } else {
            let (mut t, mut c) = (0.0f32, 0);
            for i in 0..self.population.len() {
                for j in (i + 1)..self.population.len() {
                    t += genome_distance(&self.population[i].genome, &self.population[j].genome);
                    c += 1;
                }
            }
            if c > 0 { t / c as f32 } else { 0.0 }
        }
    }
    fn update_archive(&mut self) {
        let th = self.config.fitness.archive_threshold.unwrap_or(0.0);
        let dt = self.config.archive.diversity_threshold;
        for c in &self.population {
            if c.fitness >= th
                && self
                    .archive
                    .iter()
                    .all(|a| genome_distance(&c.genome, &a.genome) >= dt)
            {
                self.archive.push(c.clone());
            }
        }
        if self.archive.len() > self.config.archive.max_size {
            self.archive.sort_by(|a, b| {
                b.fitness
                    .partial_cmp(&a.fitness)
                    .unwrap_or(std::cmp::Ordering::Less)
            });
            self.archive.truncate(self.config.archive.max_size);
        }
    }
    fn get_progress(&self) -> Result<JsValue, JsValue> {
        let avg = if self.population.is_empty() {
            0.0
        } else {
            self.population.iter().map(|c| c.fitness).sum::<f32>() / self.population.len() as f32
        };
        let gb = self
            .population
            .iter()
            .map(|c| c.fitness)
            .fold(f32::NEG_INFINITY, f32::max);
        let bc = self
            .population
            .iter()
            .max_by(|a, b| {
                a.fitness
                    .partial_cmp(&b.fitness)
                    .unwrap_or(std::cmp::Ordering::Less)
            })
            .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed));
        let tc: Vec<CandidateSnapshot> = {
            let mut s: Vec<_> = self.population.iter().collect();
            s.sort_by(|a, b| {
                b.fitness
                    .partial_cmp(&a.fitness)
                    .unwrap_or(std::cmp::Ordering::Less)
            });
            s.into_iter()
                .take(5)
                .map(|c| c.to_snapshot(&self.config.base_config, &self.default_seed))
                .collect()
        };
        let ph = if !self.initialized {
            EvolutionPhase::Initializing
        } else if self.cancelled {
            EvolutionPhase::Stopped
        } else if self.should_stop().is_some() {
            EvolutionPhase::Complete
        } else {
            EvolutionPhase::Evaluating
        };
        serde_wasm_bindgen::to_value(&EvolutionProgress {
            generation: self.generation,
            total_generations: self.config.population.max_generations,
            evaluations_completed: self.population.len(),
            evaluations_total: self.config.population.size,
            best_fitness: self.best_fitness,
            avg_fitness: avg,
            generation_best: gb,
            stagnation_count: self.stagnation_count,
            best_candidate: bc,
            top_candidates: tc,
            history: self.history.clone(),
            phase: ph,
        })
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }
    fn should_stop(&self) -> Option<StopReason> {
        if self.cancelled {
            Some(StopReason::Cancelled)
        } else if self.generation >= self.config.population.max_generations {
            Some(StopReason::MaxGenerations)
        } else if self
            .config
            .population
            .target_fitness
            .map_or(false, |t| self.best_fitness >= t)
        {
            Some(StopReason::TargetReached)
        } else if self
            .config
            .population
            .stagnation_limit
            .map_or(false, |l| self.stagnation_count >= l)
        {
            Some(StopReason::Stagnation)
        } else {
            None
        }
    }
}
