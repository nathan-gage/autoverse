//! 3D Kernel generation for Flow Lenia.
//!
//! Kernels are composed of sums of concentric Gaussian spherical shells.

use crate::schema::KernelConfig;

/// Precomputed 3D kernel grid ready for convolution.
#[derive(Debug, Clone)]
pub struct Kernel3D {
    /// 3D kernel values, stored as flat array [z * size * size + y * size + x].
    pub data: Vec<f32>,
    /// Kernel size (diameter) in each dimension.
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

impl Kernel3D {
    /// Generate a 3D kernel from configuration.
    ///
    /// # Arguments
    /// * `config` - Kernel configuration
    /// * `max_radius` - Maximum kernel radius in cells
    pub fn from_config(config: &KernelConfig, max_radius: usize) -> Self {
        let actual_radius = (config.radius * max_radius as f32).round() as usize;
        let size = actual_radius * 2 + 1;
        let center = actual_radius as f32;

        let mut data = vec![0.0f32; size * size * size];
        let mut sum = 0.0f32;

        // Generate kernel values
        for z in 0..size {
            for y in 0..size {
                for x in 0..size {
                    let dx = x as f32 - center;
                    let dy = y as f32 - center;
                    let dz = z as f32 - center;
                    let dist = (dx * dx + dy * dy + dz * dz).sqrt();

                    // Normalized distance (0 at center, 1 at max radius)
                    let norm_dist = dist / actual_radius as f32;

                    // Skip if outside kernel radius
                    if norm_dist > 1.0 {
                        continue;
                    }

                    // Sum of Gaussian spherical shells
                    let mut value = 0.0f32;
                    for ring in &config.rings {
                        let ring_dist = (norm_dist - ring.distance).abs();
                        let bump = ring.amplitude
                            * (-ring_dist * ring_dist / (2.0 * ring.width * ring.width)).exp();
                        value += bump;
                    }

                    let idx = z * size * size + y * size + x;
                    data[idx] = value;
                    sum += value;
                }
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

    /// Get kernel value at (x, y, z) position.
    #[inline]
    pub fn get(&self, x: usize, y: usize, z: usize) -> f32 {
        self.data[z * self.size * self.size + y * self.size + x]
    }

    /// Pad kernel to target size for FFT (zero-padded, wrapped for circular convolution).
    ///
    /// For FFT circular convolution, the kernel center must be at position [0,0,0].
    /// Elements at offset (dx, dy, dz) from center go to position
    /// ((dx + W) mod W, (dy + H) mod H, (dz + D) mod D).
    pub fn pad_to_size(
        &self,
        target_width: usize,
        target_height: usize,
        target_depth: usize,
    ) -> Vec<f32> {
        let mut padded = vec![0.0f32; target_width * target_height * target_depth];
        let center = self.size / 2;

        for kz in 0..self.size {
            for ky in 0..self.size {
                for kx in 0..self.size {
                    // Offset from kernel center
                    let dx = kx as i32 - center as i32;
                    let dy = ky as i32 - center as i32;
                    let dz = kz as i32 - center as i32;

                    // Wrap to padded array (center goes to [0,0,0])
                    let tx = ((dx + target_width as i32) % target_width as i32) as usize;
                    let ty = ((dy + target_height as i32) % target_height as i32) as usize;
                    let tz = ((dz + target_depth as i32) % target_depth as i32) as usize;

                    let src_idx = kz * self.size * self.size + ky * self.size + kx;
                    let dst_idx = tz * target_height * target_width + ty * target_width + tx;
                    padded[dst_idx] = self.data[src_idx];
                }
            }
        }

        padded
    }
}

/// Collection of precomputed 3D kernels.
#[derive(Debug, Clone)]
pub struct Kernel3DSet {
    pub kernels: Vec<Kernel3D>,
}

impl Kernel3DSet {
    /// Create kernel set from configuration.
    pub fn from_configs(configs: &[KernelConfig], max_radius: usize) -> Self {
        let kernels = configs
            .iter()
            .map(|c| Kernel3D::from_config(c, max_radius))
            .collect();
        Self { kernels }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::RingConfig;

    #[test]
    fn test_kernel3d_normalization() {
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

        let kernel = Kernel3D::from_config(&config, 8);
        let sum: f32 = kernel.data.iter().sum();

        // Should sum to approximately 1
        assert!((sum - 1.0).abs() < 1e-5, "Kernel sum: {}", sum);
    }

    #[test]
    fn test_kernel3d_symmetry() {
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

        let kernel = Kernel3D::from_config(&config, 8);
        let center = kernel.size / 2;

        // Check spherical symmetry - all points at same distance should have same value
        for d in 1..center {
            let v_px = kernel.get(center + d, center, center);
            let v_mx = kernel.get(center - d, center, center);
            let v_py = kernel.get(center, center + d, center);
            let v_my = kernel.get(center, center - d, center);
            let v_pz = kernel.get(center, center, center + d);
            let v_mz = kernel.get(center, center, center - d);

            assert!((v_px - v_mx).abs() < 1e-6, "X symmetry broken");
            assert!((v_px - v_py).abs() < 1e-6, "XY symmetry broken");
            assert!((v_px - v_my).abs() < 1e-6, "XY- symmetry broken");
            assert!((v_px - v_pz).abs() < 1e-6, "XZ symmetry broken");
            assert!((v_px - v_mz).abs() < 1e-6, "XZ- symmetry broken");
        }
    }

    #[test]
    fn test_kernel3d_padding() {
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

        let kernel = Kernel3D::from_config(&config, 4);
        let padded = kernel.pad_to_size(16, 16, 16);

        // Sum should be preserved
        let original_sum: f32 = kernel.data.iter().sum();
        let padded_sum: f32 = padded.iter().sum();

        assert!(
            (original_sum - padded_sum).abs() < 1e-5,
            "Padding changed sum: {} -> {}",
            original_sum,
            padded_sum
        );
    }
}
