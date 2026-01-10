//! Kernel generation for Flow Lenia.
//!
//! Kernels are composed of sums of concentric Gaussian rings (bumps).

use crate::schema::KernelConfig;

/// Precomputed kernel grid ready for convolution.
#[derive(Debug, Clone)]
pub struct Kernel {
    /// 2D kernel values, row-major.
    pub data: Vec<f32>,
    /// Kernel size (diameter).
    pub size: usize,
    /// Source channel index.
    pub source_channel: usize,
    /// Target channel index.
    pub target_channel: usize,
    /// Growth weight.
    pub weight: f32,
    /// Growth mu parameter.
    pub mu: f32,
    /// Growth sigma parameter.
    pub sigma: f32,
}

impl Kernel {
    /// Generate a kernel from configuration.
    ///
    /// # Arguments
    /// * `config` - Kernel configuration
    /// * `max_radius` - Maximum kernel radius in cells
    pub fn from_config(config: &KernelConfig, max_radius: usize) -> Self {
        let actual_radius = (config.radius * max_radius as f32).round() as usize;
        let size = actual_radius * 2 + 1;
        let center = actual_radius as f32;

        let mut data = vec![0.0f32; size * size];
        let mut sum = 0.0f32;

        // Generate kernel values
        for y in 0..size {
            for x in 0..size {
                let dx = x as f32 - center;
                let dy = y as f32 - center;
                let dist = (dx * dx + dy * dy).sqrt();

                // Normalized distance (0 at center, 1 at max radius)
                let norm_dist = dist / actual_radius as f32;

                // Skip if outside kernel radius
                if norm_dist > 1.0 {
                    continue;
                }

                // Sum of Gaussian rings
                let mut value = 0.0f32;
                for ring in &config.rings {
                    let ring_dist = (norm_dist - ring.distance).abs();
                    let bump = ring.amplitude
                        * (-ring_dist * ring_dist / (2.0 * ring.width * ring.width)).exp();
                    value += bump;
                }

                data[y * size + x] = value;
                sum += value;
            }
        }

        // Normalize so kernel sums to 1
        if sum > 0.0 {
            let inv_sum = 1.0 / sum;
            for v in &mut data {
                *v *= inv_sum;
            }
        }

        Self {
            data,
            size,
            source_channel: config.source_channel,
            target_channel: config.target_channel,
            weight: config.weight,
            mu: config.mu,
            sigma: config.sigma,
        }
    }

    /// Get kernel value at (x, y) position.
    #[inline]
    pub fn get(&self, x: usize, y: usize) -> f32 {
        self.data[y * self.size + x]
    }

    /// Pad kernel to target size for FFT (zero-padded, centered).
    pub fn pad_to_size(&self, target_width: usize, target_height: usize) -> Vec<f32> {
        let mut padded = vec![0.0f32; target_width * target_height];
        let half_size = self.size / 2;

        for ky in 0..self.size {
            for kx in 0..self.size {
                // Wrap kernel around for circular convolution
                let tx = if kx <= half_size {
                    kx
                } else {
                    target_width - (self.size - kx)
                };
                let ty = if ky <= half_size {
                    ky
                } else {
                    target_height - (self.size - ky)
                };

                if tx < target_width && ty < target_height {
                    padded[ty * target_width + tx] = self.data[ky * self.size + kx];
                }
            }
        }

        padded
    }
}

/// Collection of precomputed kernels.
#[derive(Debug, Clone)]
pub struct KernelSet {
    pub kernels: Vec<Kernel>,
}

impl KernelSet {
    /// Create kernel set from configuration.
    pub fn from_configs(configs: &[KernelConfig], max_radius: usize) -> Self {
        let kernels = configs
            .iter()
            .map(|c| Kernel::from_config(c, max_radius))
            .collect();
        Self { kernels }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::RingConfig;

    #[test]
    fn test_kernel_normalization() {
        let config = KernelConfig {
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
        };

        let kernel = Kernel::from_config(&config, 10);
        let sum: f32 = kernel.data.iter().sum();

        // Should sum to approximately 1
        assert!((sum - 1.0).abs() < 1e-5, "Kernel sum: {}", sum);
    }

    #[test]
    fn test_kernel_symmetry() {
        let config = KernelConfig::default();
        let kernel = Kernel::from_config(&config, 10);

        // Check radial symmetry
        let center = kernel.size / 2;
        for d in 1..center {
            let v1 = kernel.get(center + d, center);
            let v2 = kernel.get(center - d, center);
            let v3 = kernel.get(center, center + d);
            let v4 = kernel.get(center, center - d);

            assert!((v1 - v2).abs() < 1e-6);
            assert!((v1 - v3).abs() < 1e-6);
            assert!((v1 - v4).abs() < 1e-6);
        }
    }
}
