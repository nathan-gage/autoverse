//! Seed types for initializing Flow Lenia simulations.
//!
//! Supports both 2D and 3D patterns. 2D patterns work in 3D by placing
//! the pattern at z=depth/2 (middle slice).

use serde::{Deserialize, Serialize};

/// Complete seed specification for simulation initialization.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Seed {
    /// Pattern to use for seeding.
    pub pattern: Pattern,
}

impl Default for Seed {
    fn default() -> Self {
        Self {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.1,
                amplitude: 1.0,
                channel: 0,
            },
        }
    }
}

/// Predefined patterns for initialization.
///
/// 2D patterns (GaussianBlob, Ring, etc.) are placed at the middle Z slice
/// when used in 3D simulations. 3D patterns (GaussianSphere, Torus3D, etc.)
/// naturally fill the volume.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Pattern {
    // ===== 2D Patterns =====
    /// Single 2D Gaussian blob (placed at middle Z in 3D).
    GaussianBlob {
        /// Center position as fraction of grid size (0.0-1.0).
        center: (f32, f32),
        /// Radius as fraction of grid size.
        radius: f32,
        /// Peak amplitude.
        amplitude: f32,
        /// Target channel.
        channel: usize,
    },
    /// Multiple 2D Gaussian blobs.
    MultiBlob {
        /// List of blob specifications.
        blobs: Vec<BlobSpec>,
    },
    /// 2D Ring pattern (placed at middle Z in 3D).
    Ring {
        /// Center position as fraction of grid size.
        center: (f32, f32),
        /// Inner radius as fraction.
        inner_radius: f32,
        /// Outer radius as fraction.
        outer_radius: f32,
        /// Amplitude.
        amplitude: f32,
        /// Target channel.
        channel: usize,
    },

    // ===== 3D Patterns =====
    /// 3D Gaussian sphere.
    GaussianSphere {
        /// Center position as fraction of grid size (0.0-1.0) for (x, y, z).
        center: (f32, f32, f32),
        /// Radius as fraction of minimum grid dimension.
        radius: f32,
        /// Peak amplitude.
        amplitude: f32,
        /// Target channel.
        channel: usize,
    },
    /// Multiple 3D Gaussian spheres.
    MultiSphere {
        /// List of sphere specifications.
        spheres: Vec<SphereSpec>,
    },
    /// 3D Spherical shell (hollow sphere).
    Shell {
        /// Center position as fraction of grid size.
        center: (f32, f32, f32),
        /// Inner radius as fraction.
        inner_radius: f32,
        /// Outer radius as fraction.
        outer_radius: f32,
        /// Amplitude.
        amplitude: f32,
        /// Target channel.
        channel: usize,
    },
    /// 3D Torus (donut shape).
    Torus3D {
        /// Center position as fraction of grid size.
        center: (f32, f32, f32),
        /// Major radius (distance from center to tube center) as fraction.
        major_radius: f32,
        /// Minor radius (tube radius) as fraction.
        minor_radius: f32,
        /// Amplitude.
        amplitude: f32,
        /// Target channel.
        channel: usize,
    },

    // ===== General Patterns (work in any dimension) =====
    /// Uniform random noise.
    Noise {
        /// Noise amplitude range [0, amplitude].
        amplitude: f32,
        /// Optional channel (None = all channels).
        channel: Option<usize>,
        /// Random seed.
        seed: u64,
    },
    /// Custom grid values (sparse representation).
    /// For 3D, use Custom3D instead.
    Custom {
        /// List of (x, y, channel, value) entries.
        values: Vec<(usize, usize, usize, f32)>,
    },
    /// Custom 3D grid values (sparse representation).
    Custom3D {
        /// List of (x, y, z, channel, value) entries.
        values: Vec<(usize, usize, usize, usize, f32)>,
    },
}

/// Specification for a single 2D blob in MultiBlob pattern.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlobSpec {
    pub center: (f32, f32),
    pub radius: f32,
    pub amplitude: f32,
    pub channel: usize,
}

/// Specification for a single 3D sphere in MultiSphere pattern.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SphereSpec {
    pub center: (f32, f32, f32),
    pub radius: f32,
    pub amplitude: f32,
    pub channel: usize,
}

impl Seed {
    /// Generate initial grid state from seed.
    ///
    /// Returns a 4D grid: [channel][z][y][x] for 3D, or [channel][0][y][x] for 2D.
    /// The outer Vec has `channels` elements, each containing a 3D grid.
    pub fn generate(
        &self,
        width: usize,
        height: usize,
        depth: usize,
        channels: usize,
    ) -> Vec<Vec<Vec<Vec<f32>>>> {
        let mut grid = vec![vec![vec![vec![0.0f32; width]; height]; depth]; channels];
        let min_dim = width.min(height).min(depth) as f32;
        let mid_z = depth / 2;

        match &self.pattern {
            // 2D patterns - place at middle Z
            Pattern::GaussianBlob {
                center,
                radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let r = radius * width.min(height) as f32;
                if depth == 1 {
                    apply_gaussian_2d(&mut grid, *channel, 0, cx, cy, r, *amplitude);
                } else {
                    // In 3D, create a sphere at middle Z instead
                    let cz = 0.5 * depth as f32;
                    apply_gaussian_3d(&mut grid, *channel, cx, cy, cz, r, *amplitude);
                }
            }
            Pattern::MultiBlob { blobs } => {
                for blob in blobs {
                    let cx = blob.center.0 * width as f32;
                    let cy = blob.center.1 * height as f32;
                    let r = blob.radius * width.min(height) as f32;
                    if depth == 1 {
                        apply_gaussian_2d(&mut grid, blob.channel, 0, cx, cy, r, blob.amplitude);
                    } else {
                        let cz = 0.5 * depth as f32;
                        apply_gaussian_3d(&mut grid, blob.channel, cx, cy, cz, r, blob.amplitude);
                    }
                }
            }
            Pattern::Ring {
                center,
                inner_radius,
                outer_radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let min_xy = width.min(height) as f32;
                let r_in = inner_radius * min_xy;
                let r_out = outer_radius * min_xy;
                if depth == 1 {
                    apply_ring_2d(&mut grid, *channel, 0, cx, cy, r_in, r_out, *amplitude);
                } else {
                    // In 3D, create a shell at middle Z
                    let cz = 0.5 * depth as f32;
                    apply_shell_3d(&mut grid, *channel, cx, cy, cz, r_in, r_out, *amplitude);
                }
            }

            // 3D patterns
            Pattern::GaussianSphere {
                center,
                radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let cz = center.2 * depth as f32;
                let r = radius * min_dim;
                apply_gaussian_3d(&mut grid, *channel, cx, cy, cz, r, *amplitude);
            }
            Pattern::MultiSphere { spheres } => {
                for sphere in spheres {
                    let cx = sphere.center.0 * width as f32;
                    let cy = sphere.center.1 * height as f32;
                    let cz = sphere.center.2 * depth as f32;
                    let r = sphere.radius * min_dim;
                    apply_gaussian_3d(&mut grid, sphere.channel, cx, cy, cz, r, sphere.amplitude);
                }
            }
            Pattern::Shell {
                center,
                inner_radius,
                outer_radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let cz = center.2 * depth as f32;
                let r_in = inner_radius * min_dim;
                let r_out = outer_radius * min_dim;
                apply_shell_3d(&mut grid, *channel, cx, cy, cz, r_in, r_out, *amplitude);
            }
            Pattern::Torus3D {
                center,
                major_radius,
                minor_radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let cz = center.2 * depth as f32;
                let r_major = major_radius * min_dim;
                let r_minor = minor_radius * min_dim;
                apply_torus_3d(
                    &mut grid, *channel, cx, cy, cz, r_major, r_minor, *amplitude,
                );
            }

            // General patterns
            Pattern::Noise {
                amplitude,
                channel,
                seed,
            } => {
                apply_noise(
                    &mut grid, *channel, *amplitude, *seed, width, height, depth, channels,
                );
            }
            Pattern::Custom { values } => {
                for &(x, y, c, v) in values {
                    if c < channels && y < height && x < width {
                        grid[c][mid_z][y][x] = v;
                    }
                }
            }
            Pattern::Custom3D { values } => {
                for &(x, y, z, c, v) in values {
                    if c < channels && z < depth && y < height && x < width {
                        grid[c][z][y][x] = v;
                    }
                }
            }
        }

        grid
    }

    /// Generate initial grid state (legacy 2D interface).
    /// Returns [channel][y][x] format for backward compatibility.
    pub fn generate_2d(&self, width: usize, height: usize, channels: usize) -> Vec<Vec<Vec<f32>>> {
        let grid_4d = self.generate(width, height, 1, channels);
        // Extract z=0 slice from each channel
        grid_4d
            .into_iter()
            .map(|channel| channel.into_iter().next().unwrap())
            .collect()
    }
}

// ===== 2D Helper Functions =====

fn apply_gaussian_2d(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: usize,
    z: usize,
    cx: f32,
    cy: f32,
    radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() || z >= grid[channel].len() {
        return;
    }
    let height = grid[channel][z].len();
    let width = grid[channel][z][0].len();
    let sigma_sq = (radius / 2.0).powi(2);

    for y in 0..height {
        for x in 0..width {
            let dx = x as f32 - cx;
            let dy = y as f32 - cy;
            let dist_sq = dx * dx + dy * dy;
            let value = amplitude * (-dist_sq / (2.0 * sigma_sq)).exp();
            grid[channel][z][y][x] += value;
        }
    }
}

fn apply_ring_2d(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: usize,
    z: usize,
    cx: f32,
    cy: f32,
    inner_radius: f32,
    outer_radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() || z >= grid[channel].len() {
        return;
    }
    let height = grid[channel][z].len();
    let width = grid[channel][z][0].len();

    for y in 0..height {
        for x in 0..width {
            let dx = x as f32 - cx;
            let dy = y as f32 - cy;
            let dist = (dx * dx + dy * dy).sqrt();
            if dist >= inner_radius && dist <= outer_radius {
                let edge_width = (outer_radius - inner_radius) * 0.2;
                let inner_falloff = ((dist - inner_radius) / edge_width).min(1.0);
                let outer_falloff = ((outer_radius - dist) / edge_width).min(1.0);
                let falloff = inner_falloff.min(outer_falloff);
                grid[channel][z][y][x] += amplitude * falloff;
            }
        }
    }
}

// ===== 3D Helper Functions =====

fn apply_gaussian_3d(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: usize,
    cx: f32,
    cy: f32,
    cz: f32,
    radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() {
        return;
    }
    let depth = grid[channel].len();
    let height = grid[channel][0].len();
    let width = grid[channel][0][0].len();
    let sigma_sq = (radius / 2.0).powi(2);

    for z in 0..depth {
        for y in 0..height {
            for x in 0..width {
                let dx = x as f32 - cx;
                let dy = y as f32 - cy;
                let dz = z as f32 - cz;
                let dist_sq = dx * dx + dy * dy + dz * dz;
                let value = amplitude * (-dist_sq / (2.0 * sigma_sq)).exp();
                grid[channel][z][y][x] += value;
            }
        }
    }
}

fn apply_shell_3d(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: usize,
    cx: f32,
    cy: f32,
    cz: f32,
    inner_radius: f32,
    outer_radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() {
        return;
    }
    let depth = grid[channel].len();
    let height = grid[channel][0].len();
    let width = grid[channel][0][0].len();

    for z in 0..depth {
        for y in 0..height {
            for x in 0..width {
                let dx = x as f32 - cx;
                let dy = y as f32 - cy;
                let dz = z as f32 - cz;
                let dist = (dx * dx + dy * dy + dz * dz).sqrt();
                if dist >= inner_radius && dist <= outer_radius {
                    let edge_width = (outer_radius - inner_radius) * 0.2;
                    let inner_falloff = ((dist - inner_radius) / edge_width).min(1.0);
                    let outer_falloff = ((outer_radius - dist) / edge_width).min(1.0);
                    let falloff = inner_falloff.min(outer_falloff);
                    grid[channel][z][y][x] += amplitude * falloff;
                }
            }
        }
    }
}

fn apply_torus_3d(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: usize,
    cx: f32,
    cy: f32,
    cz: f32,
    major_radius: f32,
    minor_radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() {
        return;
    }
    let depth = grid[channel].len();
    let height = grid[channel][0].len();
    let width = grid[channel][0][0].len();
    let sigma_sq = (minor_radius / 2.0).powi(2);

    for z in 0..depth {
        for y in 0..height {
            for x in 0..width {
                let dx = x as f32 - cx;
                let dy = y as f32 - cy;
                let dz = z as f32 - cz;

                // Distance from point to ring in XY plane
                let dist_xy = (dx * dx + dy * dy).sqrt();
                let ring_dx = dist_xy - major_radius;

                // Distance from ring to point (in the plane containing the ring and point)
                let dist_to_tube = (ring_dx * ring_dx + dz * dz).sqrt();

                // Gaussian falloff based on distance to tube center
                let value = amplitude * (-dist_to_tube * dist_to_tube / (2.0 * sigma_sq)).exp();
                if value > 1e-6 {
                    grid[channel][z][y][x] += value;
                }
            }
        }
    }
}

fn apply_noise(
    grid: &mut [Vec<Vec<Vec<f32>>>],
    channel: Option<usize>,
    amplitude: f32,
    seed: u64,
    width: usize,
    height: usize,
    depth: usize,
    channels: usize,
) {
    // Simple LCG PRNG for deterministic noise
    let mut state = seed;
    let lcg_next = |s: &mut u64| -> f32 {
        *s = s.wrapping_mul(6364136223846793005).wrapping_add(1);
        (*s >> 33) as f32 / (1u64 << 31) as f32
    };

    let channel_range = match channel {
        Some(c) => c..c + 1,
        None => 0..channels,
    };

    for c in channel_range {
        if c >= grid.len() {
            continue;
        }
        for z in 0..depth {
            for y in 0..height {
                for x in 0..width {
                    grid[c][z][y][x] += amplitude * lcg_next(&mut state);
                }
            }
        }
    }
}
