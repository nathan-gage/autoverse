//! Parameter embedding types for Flow Lenia.
//!
//! This module provides types for storing and managing per-cell simulation parameters
//! that can be advected alongside mass, enabling multi-species simulations.
//!
//! # Background
//!
//! In standard Flow Lenia, parameters like mu, sigma, and kernel weights are global.
//! Parameter embedding stores these values at each grid cell, allowing them to flow
//! with mass and mix stochastically when mass from different sources collides.

use serde::{Deserialize, Serialize};

/// Per-cell parameters that can be embedded and advected with mass.
///
/// These parameters control the local growth function response and flow behavior.
/// When mass moves, these parameters move with it, enabling emergent multi-species
/// dynamics.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub struct CellParams {
    /// Growth function optimal activation center.
    pub mu: f32,
    /// Growth function activation width.
    pub sigma: f32,
    /// Kernel weight multiplier for growth output.
    pub weight: f32,
    /// Critical mass threshold for diffusion priority (alpha computation).
    pub beta_a: f32,
    /// Power parameter for alpha transition curve.
    pub n: f32,
}

impl Default for CellParams {
    fn default() -> Self {
        Self {
            mu: 0.15,
            sigma: 0.015,
            weight: 1.0,
            beta_a: 1.0,
            n: 2.0,
        }
    }
}

impl CellParams {
    /// Create new cell parameters with specified values.
    pub fn new(mu: f32, sigma: f32, weight: f32, beta_a: f32, n: f32) -> Self {
        Self {
            mu,
            sigma,
            weight,
            beta_a,
            n,
        }
    }

    /// Mix parameters from multiple sources using softmax weighting.
    ///
    /// This implements stochastic parameter mixing when mass from different
    /// cells collides. The temperature parameter controls mixing sharpness:
    /// - Low temperature: winner-take-all (highest mass source dominates)
    /// - High temperature: more uniform mixing
    ///
    /// # Arguments
    /// * `sources` - Slice of (CellParams, mass) tuples from contributing cells
    /// * `temperature` - Softmax temperature for mixing (default: 1.0)
    ///
    /// # Returns
    /// Mixed parameters weighted by softmax of incoming mass
    pub fn mix_softmax(sources: &[(CellParams, f32)], temperature: f32) -> Self {
        if sources.is_empty() {
            return CellParams::default();
        }

        if sources.len() == 1 {
            return sources[0].0;
        }

        // Compute softmax weights
        let max_mass = sources
            .iter()
            .map(|(_, m)| *m)
            .fold(f32::NEG_INFINITY, f32::max);

        let mut weights = Vec::with_capacity(sources.len());
        let mut weight_sum = 0.0f32;

        for (_, mass) in sources {
            let w = ((mass - max_mass) / temperature).exp();
            weights.push(w);
            weight_sum += w;
        }

        // Normalize weights
        if weight_sum > 0.0 {
            for w in &mut weights {
                *w /= weight_sum;
            }
        } else {
            // Fallback to uniform weights
            let uniform = 1.0 / sources.len() as f32;
            weights.fill(uniform);
        }

        // Weighted average of parameters
        let mut mu = 0.0;
        let mut sigma = 0.0;
        let mut weight = 0.0;
        let mut beta_a = 0.0;
        let mut n = 0.0;

        for ((params, _), w) in sources.iter().zip(weights.iter()) {
            mu += params.mu * w;
            sigma += params.sigma * w;
            weight += params.weight * w;
            beta_a += params.beta_a * w;
            n += params.n * w;
        }

        CellParams {
            mu,
            sigma,
            weight,
            beta_a,
            n,
        }
    }

    /// Mix parameters using mass-weighted average (simpler than softmax).
    ///
    /// This is a simpler mixing strategy that uses direct mass-proportional weighting.
    pub fn mix_linear(sources: &[(CellParams, f32)]) -> Self {
        if sources.is_empty() {
            return CellParams::default();
        }

        if sources.len() == 1 {
            return sources[0].0;
        }

        let total_mass: f32 = sources.iter().map(|(_, m)| *m).sum();

        if total_mass <= 0.0 {
            return CellParams::default();
        }

        let mut mu = 0.0;
        let mut sigma = 0.0;
        let mut weight = 0.0;
        let mut beta_a = 0.0;
        let mut n = 0.0;

        for (params, mass) in sources {
            let w = mass / total_mass;
            mu += params.mu * w;
            sigma += params.sigma * w;
            weight += params.weight * w;
            beta_a += params.beta_a * w;
            n += params.n * w;
        }

        CellParams {
            mu,
            sigma,
            weight,
            beta_a,
            n,
        }
    }
}

/// Grid storing per-cell parameters for parameter embedding.
///
/// This structure maintains spatially-varying parameters that are advected
/// alongside mass during simulation, enabling multi-species dynamics.
#[derive(Debug, Clone)]
pub struct ParameterGrid {
    /// Per-cell parameters stored in row-major order.
    data: Vec<CellParams>,
    /// Grid width.
    width: usize,
    /// Grid height.
    height: usize,
}

impl ParameterGrid {
    /// Create a new parameter grid with uniform initial parameters.
    pub fn new(width: usize, height: usize, initial: CellParams) -> Self {
        let data = vec![initial; width * height];
        Self {
            data,
            width,
            height,
        }
    }

    /// Create a parameter grid from configuration defaults.
    pub fn from_defaults(width: usize, height: usize) -> Self {
        Self::new(width, height, CellParams::default())
    }

    /// Create a parameter grid initialized with multiple species regions.
    ///
    /// Each species is defined by its parameters and a predicate that determines
    /// which cells belong to that species.
    pub fn from_species<F>(
        width: usize,
        height: usize,
        species: &[(CellParams, F)],
        default: CellParams,
    ) -> Self
    where
        F: Fn(usize, usize) -> bool,
    {
        let mut grid = Self::new(width, height, default);

        for y in 0..height {
            for x in 0..width {
                for (params, predicate) in species {
                    if predicate(x, y) {
                        grid.set(x, y, *params);
                        break;
                    }
                }
            }
        }

        grid
    }

    /// Get grid dimensions.
    pub fn dimensions(&self) -> (usize, usize) {
        (self.width, self.height)
    }

    /// Get grid width.
    pub fn width(&self) -> usize {
        self.width
    }

    /// Get grid height.
    pub fn height(&self) -> usize {
        self.height
    }

    /// Get parameters at (x, y).
    #[inline]
    pub fn get(&self, x: usize, y: usize) -> CellParams {
        self.data[y * self.width + x]
    }

    /// Get parameters at index.
    #[inline]
    pub fn get_idx(&self, idx: usize) -> CellParams {
        self.data[idx]
    }

    /// Set parameters at (x, y).
    #[inline]
    pub fn set(&mut self, x: usize, y: usize, params: CellParams) {
        self.data[y * self.width + x] = params;
    }

    /// Set parameters at index.
    #[inline]
    pub fn set_idx(&mut self, idx: usize, params: CellParams) {
        self.data[idx] = params;
    }

    /// Get mutable reference to parameters at (x, y).
    #[inline]
    pub fn get_mut(&mut self, x: usize, y: usize) -> &mut CellParams {
        &mut self.data[y * self.width + x]
    }

    /// Get raw data slice.
    pub fn data(&self) -> &[CellParams] {
        &self.data
    }

    /// Get mutable raw data slice.
    pub fn data_mut(&mut self) -> &mut [CellParams] {
        &mut self.data
    }

    /// Fill entire grid with parameters.
    pub fn fill(&mut self, params: CellParams) {
        self.data.fill(params);
    }

    /// Get parameters at wrapped coordinates (periodic boundary).
    #[inline]
    pub fn get_wrapped(&self, x: i32, y: i32) -> CellParams {
        let wx = ((x % self.width as i32) + self.width as i32) as usize % self.width;
        let wy = ((y % self.height as i32) + self.height as i32) as usize % self.height;
        self.get(wx, wy)
    }

    /// Extract a single parameter field as a flat vector.
    pub fn extract_mu(&self) -> Vec<f32> {
        self.data.iter().map(|p| p.mu).collect()
    }

    /// Extract sigma field as a flat vector.
    pub fn extract_sigma(&self) -> Vec<f32> {
        self.data.iter().map(|p| p.sigma).collect()
    }

    /// Extract weight field as a flat vector.
    pub fn extract_weight(&self) -> Vec<f32> {
        self.data.iter().map(|p| p.weight).collect()
    }

    /// Extract beta_a field as a flat vector.
    pub fn extract_beta_a(&self) -> Vec<f32> {
        self.data.iter().map(|p| p.beta_a).collect()
    }

    /// Extract n field as a flat vector.
    pub fn extract_n(&self) -> Vec<f32> {
        self.data.iter().map(|p| p.n).collect()
    }
}

/// Configuration for parameter embedding mode.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmbeddingConfig {
    /// Enable parameter embedding (per-cell varying parameters).
    pub enabled: bool,
    /// Softmax temperature for stochastic mixing (1.0 = standard softmax).
    /// Lower values make mixing more winner-take-all.
    pub mixing_temperature: f32,
    /// Use linear mixing instead of softmax (simpler, faster).
    pub linear_mixing: bool,
}

impl Default for EmbeddingConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            mixing_temperature: 1.0,
            linear_mixing: false,
        }
    }
}

impl EmbeddingConfig {
    /// Create config with embedding enabled.
    pub fn enabled() -> Self {
        Self {
            enabled: true,
            mixing_temperature: 1.0,
            linear_mixing: false,
        }
    }

    /// Create config with embedding enabled and linear mixing.
    pub fn enabled_linear() -> Self {
        Self {
            enabled: true,
            mixing_temperature: 1.0,
            linear_mixing: true,
        }
    }
}

/// Species definition for multi-species simulations.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpeciesConfig {
    /// Human-readable name for this species.
    pub name: String,
    /// Cell parameters for this species.
    pub params: CellParams,
    /// Initial pattern for this species (center x, center y, radius).
    /// All values are relative (0.0-1.0).
    pub initial_region: Option<(f32, f32, f32)>,
}

impl SpeciesConfig {
    /// Create a new species configuration.
    pub fn new(name: impl Into<String>, params: CellParams) -> Self {
        Self {
            name: name.into(),
            params,
            initial_region: None,
        }
    }

    /// Add an initial circular region for this species.
    pub fn with_region(mut self, center_x: f32, center_y: f32, radius: f32) -> Self {
        self.initial_region = Some((center_x, center_y, radius));
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cell_params_default() {
        let params = CellParams::default();
        assert!((params.mu - 0.15).abs() < 1e-6);
        assert!((params.sigma - 0.015).abs() < 1e-6);
        assert!((params.weight - 1.0).abs() < 1e-6);
    }

    #[test]
    fn test_mix_softmax_single_source() {
        let params = CellParams::new(0.2, 0.02, 1.5, 1.0, 2.0);
        let sources = vec![(params, 1.0)];
        let mixed = CellParams::mix_softmax(&sources, 1.0);
        assert_eq!(mixed, params);
    }

    #[test]
    fn test_mix_softmax_equal_masses() {
        let p1 = CellParams::new(0.1, 0.01, 1.0, 1.0, 2.0);
        let p2 = CellParams::new(0.2, 0.02, 2.0, 2.0, 4.0);
        let sources = vec![(p1, 1.0), (p2, 1.0)];
        let mixed = CellParams::mix_softmax(&sources, 1.0);

        // With equal masses and temperature=1, should be close to average
        assert!((mixed.mu - 0.15).abs() < 1e-5);
        assert!((mixed.sigma - 0.015).abs() < 1e-5);
    }

    #[test]
    fn test_mix_linear_proportional() {
        let p1 = CellParams::new(0.1, 0.01, 1.0, 1.0, 2.0);
        let p2 = CellParams::new(0.3, 0.03, 3.0, 3.0, 6.0);
        let sources = vec![(p1, 3.0), (p2, 1.0)]; // 3:1 ratio
        let mixed = CellParams::mix_linear(&sources);

        // 3/4 * p1 + 1/4 * p2
        let expected_mu = 0.75 * 0.1 + 0.25 * 0.3;
        assert!((mixed.mu - expected_mu).abs() < 1e-5);
    }

    #[test]
    fn test_parameter_grid_creation() {
        let grid = ParameterGrid::from_defaults(16, 16);
        assert_eq!(grid.width(), 16);
        assert_eq!(grid.height(), 16);

        let params = grid.get(8, 8);
        assert_eq!(params, CellParams::default());
    }

    #[test]
    fn test_parameter_grid_set_get() {
        let mut grid = ParameterGrid::from_defaults(16, 16);
        let custom = CellParams::new(0.3, 0.03, 2.0, 1.5, 3.0);

        grid.set(5, 10, custom);
        let retrieved = grid.get(5, 10);

        assert_eq!(retrieved, custom);
    }

    #[test]
    fn test_parameter_grid_wrapped() {
        let mut grid = ParameterGrid::from_defaults(16, 16);
        let custom = CellParams::new(0.3, 0.03, 2.0, 1.5, 3.0);

        grid.set(0, 0, custom);

        // Should wrap around
        let wrapped = grid.get_wrapped(-16, -16);
        assert_eq!(wrapped, custom);

        let wrapped2 = grid.get_wrapped(16, 16);
        assert_eq!(wrapped2, custom);
    }

    #[test]
    fn test_parameter_grid_extract() {
        let mut grid = ParameterGrid::from_defaults(4, 4);
        grid.set(0, 0, CellParams::new(0.5, 0.05, 1.0, 1.0, 2.0));

        let mu_field = grid.extract_mu();
        assert_eq!(mu_field.len(), 16);
        assert!((mu_field[0] - 0.5).abs() < 1e-6);
        assert!((mu_field[1] - 0.15).abs() < 1e-6); // Default
    }

    #[test]
    fn test_species_config() {
        let species = SpeciesConfig::new("glider", CellParams::new(0.15, 0.015, 1.0, 1.0, 2.0))
            .with_region(0.25, 0.5, 0.1);

        assert_eq!(species.name, "glider");
        assert!(species.initial_region.is_some());
        let (cx, cy, r) = species.initial_region.unwrap();
        assert!((cx - 0.25).abs() < 1e-6);
        assert!((cy - 0.5).abs() < 1e-6);
        assert!((r - 0.1).abs() < 1e-6);
    }
}
