//! Configuration types for Flow Lenia simulation parameters.

use serde::{Deserialize, Serialize};

use super::EmbeddingConfig;

/// Default depth for backward compatibility (2D mode).
fn default_depth() -> usize {
    1
}

/// Top-level simulation configuration.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationConfig {
    /// Grid width in cells (X dimension).
    pub width: usize,
    /// Grid height in cells (Y dimension).
    pub height: usize,
    /// Grid depth in cells (Z dimension). Use 1 for 2D simulations.
    #[serde(default = "default_depth")]
    pub depth: usize,
    /// Number of channels (species).
    pub channels: usize,
    /// Time step size (typically 0.1-0.5).
    pub dt: f32,
    /// Maximum kernel radius in cells.
    pub kernel_radius: usize,
    /// Kernel configurations.
    pub kernels: Vec<KernelConfig>,
    /// Flow/mass conservation parameters.
    pub flow: FlowConfig,
    /// Parameter embedding configuration (for multi-species dynamics).
    #[serde(default)]
    pub embedding: EmbeddingConfig,
}

impl Default for SimulationConfig {
    fn default() -> Self {
        Self {
            width: 256,
            height: 256,
            depth: 1,
            channels: 1,
            dt: 0.05,
            kernel_radius: 13,
            kernels: vec![KernelConfig::default()],
            flow: FlowConfig::default(),
            embedding: EmbeddingConfig::default(),
        }
    }
}

/// Configuration for a single kernel.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KernelConfig {
    /// Relative radius (0.0-1.0) scaled by global kernel_radius.
    pub radius: f32,
    /// Ring (bump) parameters defining kernel shape.
    pub rings: Vec<RingConfig>,
    /// Weight applied to growth output.
    pub weight: f32,
    /// Growth function: optimal activation center.
    pub mu: f32,
    /// Growth function: activation width.
    pub sigma: f32,
    /// Source channel index.
    pub source_channel: usize,
    /// Target channel index.
    pub target_channel: usize,
}

impl Default for KernelConfig {
    fn default() -> Self {
        Self {
            radius: 1.0,
            rings: vec![RingConfig {
                amplitude: 1.0,
                distance: 0.5,
                width: 0.15,
            }],
            weight: 1.0,
            mu: 0.15,
            sigma: 0.015,
            source_channel: 0,
            target_channel: 0,
        }
    }
}

/// Configuration for a single ring (bump) in the kernel.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RingConfig {
    /// Amplitude of this ring.
    pub amplitude: f32,
    /// Relative distance from center (0.0-1.0).
    pub distance: f32,
    /// Width of the Gaussian bump.
    pub width: f32,
}

/// Flow field and mass conservation parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlowConfig {
    /// Critical mass threshold for diffusion priority.
    pub beta_a: f32,
    /// Power parameter for alpha transition.
    pub n: f32,
    /// Distribution kernel size (half-width).
    pub distribution_size: f32,
}

impl Default for FlowConfig {
    fn default() -> Self {
        Self {
            beta_a: 2.0,
            n: 4.0,
            distribution_size: 0.5,
        }
    }
}

impl SimulationConfig {
    /// Check if this is a 3D simulation (depth > 1).
    #[inline]
    pub fn is_3d(&self) -> bool {
        self.depth > 1
    }

    /// Get total grid size (width * height * depth).
    #[inline]
    pub fn grid_size(&self) -> usize {
        self.width * self.height * self.depth
    }

    /// Validate configuration parameters.
    pub fn validate(&self) -> Result<(), ConfigError> {
        if self.width == 0 || self.height == 0 || self.depth == 0 {
            return Err(ConfigError::InvalidDimensions);
        }
        if self.channels == 0 {
            return Err(ConfigError::InvalidChannels);
        }
        if self.dt <= 0.0 {
            return Err(ConfigError::InvalidTimeStep);
        }
        if self.kernel_radius == 0 {
            return Err(ConfigError::InvalidKernelRadius);
        }
        for (i, kernel) in self.kernels.iter().enumerate() {
            if kernel.source_channel >= self.channels {
                return Err(ConfigError::InvalidChannelIndex {
                    kernel: i,
                    channel: kernel.source_channel,
                });
            }
            if kernel.target_channel >= self.channels {
                return Err(ConfigError::InvalidChannelIndex {
                    kernel: i,
                    channel: kernel.target_channel,
                });
            }
        }
        Ok(())
    }
}

/// Configuration validation errors.
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("Grid dimensions (width, height, depth) must be non-zero")]
    InvalidDimensions,
    #[error("Channel count must be non-zero")]
    InvalidChannels,
    #[error("Time step must be positive")]
    InvalidTimeStep,
    #[error("Kernel radius must be non-zero")]
    InvalidKernelRadius,
    #[error("Kernel {kernel} references invalid channel {channel}")]
    InvalidChannelIndex { kernel: usize, channel: usize },
}
