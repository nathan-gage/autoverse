//! WebAssembly bindings for Flow Lenia.
//!
//! Provides a thin wrapper around `CpuPropagator` for browser environments.

use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::{
    compute::{CpuPropagator, SimulationState, SimulationStats},
    schema::{Seed, SimulationConfig},
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
