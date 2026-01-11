//! WebAssembly bindings for Flow Lenia.
//!
//! Provides a thin wrapper around `CpuPropagator` for browser environments.

use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::{
    compute::{CpuPropagator, EmbeddedPropagator, EmbeddedState, SimulationState, SimulationStats},
    schema::{CellParams, ParameterGrid, Seed, SimulationConfig, SpeciesConfig},
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
// Embedded Propagator (CPU with parameter embedding)
// ============================================================================

/// WebAssembly wrapper for embedded Flow Lenia propagator with parameter support.
#[wasm_bindgen]
pub struct WasmEmbeddedPropagator {
    propagator: EmbeddedPropagator,
    state: EmbeddedState,
    config: SimulationConfig,
}

#[wasm_bindgen]
impl WasmEmbeddedPropagator {
    /// Create new embedded propagator from JSON configuration.
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str, seed_json: &str) -> Result<WasmEmbeddedPropagator, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let propagator = EmbeddedPropagator::new(config.clone());
        let state = EmbeddedState::from_seed(&seed, &config);

        Ok(WasmEmbeddedPropagator {
            propagator,
            state,
            config,
        })
    }

    /// Create embedded propagator with species configurations.
    #[wasm_bindgen(js_name = newWithSpecies)]
    pub fn new_with_species(
        config_json: &str,
        seed_json: &str,
        species_json: &str,
    ) -> Result<WasmEmbeddedPropagator, JsValue> {
        let config: SimulationConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid config JSON: {e}")))?;

        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let species: Vec<SpeciesConfig> = serde_json::from_str(species_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid species JSON: {e}")))?;

        let propagator = EmbeddedPropagator::new(config.clone());

        // Build parameter grids from species configurations
        let params = Self::build_parameter_grids(&config, &species);
        let state = EmbeddedState::from_seed_with_params(&seed, &config, params);

        Ok(WasmEmbeddedPropagator {
            propagator,
            state,
            config,
        })
    }

    /// Build parameter grids from species configurations
    fn build_parameter_grids(
        config: &SimulationConfig,
        species: &[SpeciesConfig],
    ) -> Vec<ParameterGrid> {
        let width = config.width;
        let height = config.height;

        // Create default parameters from config
        let default_params = CellParams {
            mu: config.kernels.first().map(|k| k.mu).unwrap_or(0.15),
            sigma: config.kernels.first().map(|k| k.sigma).unwrap_or(0.015),
            weight: config.kernels.first().map(|k| k.weight).unwrap_or(1.0),
            beta_a: config.flow.beta_a,
            n: config.flow.n,
        };

        (0..config.channels)
            .map(|_| {
                let mut grid = ParameterGrid::new(width, height, default_params);

                // Apply species regions
                for species_config in species {
                    if let Some((cx, cy, radius)) = species_config.initial_region {
                        // Convert relative coordinates to absolute
                        let center_x = (cx * width as f32) as i32;
                        let center_y = (cy * height as f32) as i32;
                        let abs_radius = (radius * width.min(height) as f32) as i32;

                        // Fill circular region with species parameters
                        for dy in -abs_radius..=abs_radius {
                            for dx in -abs_radius..=abs_radius {
                                if dx * dx + dy * dy <= abs_radius * abs_radius {
                                    let x = ((center_x + dx) % width as i32 + width as i32)
                                        as usize
                                        % width;
                                    let y = ((center_y + dy) % height as i32 + height as i32)
                                        as usize
                                        % height;
                                    grid.set(x, y, species_config.params);
                                }
                            }
                        }
                    }
                }

                grid
            })
            .collect()
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

    /// Get current simulation state as JSON (mass only).
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

    /// Get current simulation state with parameter fields.
    #[wasm_bindgen(js_name = getStateWithParams)]
    pub fn get_state_with_params(&self) -> Result<JsValue, JsValue> {
        // For channel 0 (primary), extract all parameter fields
        let params = &self.state.params[0];

        let snapshot = EmbeddedStateSnapshot {
            channels: &self.state.channels,
            width: self.state.width,
            height: self.state.height,
            time: self.state.time,
            step: self.state.step,
            mu: params.extract_mu(),
            sigma: params.extract_sigma(),
            weight: params.extract_weight(),
            beta_a: params.extract_beta_a(),
            n: params.extract_n(),
        };

        serde_wasm_bindgen::to_value(&snapshot)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {e}")))
    }

    /// Get parameter field as Float32Array.
    #[wasm_bindgen(js_name = getParamField)]
    pub fn get_param_field(&self, field: &str, channel: usize) -> Result<Vec<f32>, JsValue> {
        if channel >= self.state.params.len() {
            return Err(JsValue::from_str("Invalid channel index"));
        }

        let params = &self.state.params[channel];
        let data = match field {
            "mu" => params.extract_mu(),
            "sigma" => params.extract_sigma(),
            "weight" => params.extract_weight(),
            "beta_a" => params.extract_beta_a(),
            "n" => params.extract_n(),
            _ => return Err(JsValue::from_str("Invalid field name")),
        };

        Ok(data)
    }

    /// Check if embedding is enabled.
    #[wasm_bindgen(js_name = isEmbedded)]
    pub fn is_embedded(&self) -> bool {
        self.config.embedding.enabled
    }

    /// Reset simulation with new seed.
    #[wasm_bindgen]
    pub fn reset(&mut self, seed_json: &str) -> Result<(), JsValue> {
        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        self.state = EmbeddedState::from_seed(&seed, &self.config);
        Ok(())
    }

    /// Reset with species configurations.
    #[wasm_bindgen(js_name = resetWithSpecies)]
    pub fn reset_with_species(
        &mut self,
        seed_json: &str,
        species_json: &str,
    ) -> Result<(), JsValue> {
        let seed: Seed = serde_json::from_str(seed_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid seed JSON: {e}")))?;

        let species: Vec<SpeciesConfig> = serde_json::from_str(species_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid species JSON: {e}")))?;

        let params = Self::build_parameter_grids(&self.config, &species);
        self.state = EmbeddedState::from_seed_with_params(&seed, &self.config, params);

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

/// Serializable snapshot of embedded simulation state.
#[derive(Serialize)]
struct EmbeddedStateSnapshot<'a> {
    channels: &'a [Vec<f32>],
    width: usize,
    height: usize,
    time: f32,
    step: u64,
    mu: Vec<f32>,
    sigma: Vec<f32>,
    weight: Vec<f32>,
    beta_a: Vec<f32>,
    n: Vec<f32>,
}
