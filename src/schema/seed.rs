//! Seed types for initializing Flow Lenia simulations.

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
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Pattern {
    /// Single Gaussian blob.
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
    /// Multiple Gaussian blobs.
    MultiBlob {
        /// List of blob specifications.
        blobs: Vec<BlobSpec>,
    },
    /// Uniform random noise.
    Noise {
        /// Noise amplitude range [0, amplitude].
        amplitude: f32,
        /// Optional channel (None = all channels).
        channel: Option<usize>,
        /// Random seed.
        seed: u64,
    },
    /// Ring pattern.
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
    /// Custom grid values (sparse representation).
    Custom {
        /// List of (x, y, channel, value) entries.
        values: Vec<(usize, usize, usize, f32)>,
    },
}

/// Specification for a single blob in MultiBlob pattern.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlobSpec {
    pub center: (f32, f32),
    pub radius: f32,
    pub amplitude: f32,
    pub channel: usize,
}

impl Seed {
    /// Generate initial grid state from seed.
    pub fn generate(&self, width: usize, height: usize, channels: usize) -> Vec<Vec<Vec<f32>>> {
        let mut grid = vec![vec![vec![0.0f32; width]; height]; channels];

        match &self.pattern {
            Pattern::GaussianBlob {
                center,
                radius,
                amplitude,
                channel,
            } => {
                let cx = center.0 * width as f32;
                let cy = center.1 * height as f32;
                let r = radius * width.min(height) as f32;
                apply_gaussian(&mut grid, *channel, cx, cy, r, *amplitude);
            }
            Pattern::MultiBlob { blobs } => {
                for blob in blobs {
                    let cx = blob.center.0 * width as f32;
                    let cy = blob.center.1 * height as f32;
                    let r = blob.radius * width.min(height) as f32;
                    apply_gaussian(&mut grid, blob.channel, cx, cy, r, blob.amplitude);
                }
            }
            Pattern::Noise {
                amplitude,
                channel,
                seed,
            } => {
                apply_noise(
                    &mut grid, *channel, *amplitude, *seed, width, height, channels,
                );
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
                let min_dim = width.min(height) as f32;
                let r_in = inner_radius * min_dim;
                let r_out = outer_radius * min_dim;
                apply_ring(&mut grid, *channel, cx, cy, r_in, r_out, *amplitude);
            }
            Pattern::Custom { values } => {
                for &(x, y, c, v) in values {
                    if c < channels && y < height && x < width {
                        grid[c][y][x] = v;
                    }
                }
            }
        }

        grid
    }
}

fn apply_gaussian(
    grid: &mut [Vec<Vec<f32>>],
    channel: usize,
    cx: f32,
    cy: f32,
    radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() {
        return;
    }
    let height = grid[channel].len();
    let width = grid[channel][0].len();
    let sigma_sq = (radius / 2.0).powi(2);

    for (y, row) in grid[channel].iter_mut().enumerate().take(height) {
        for (x, cell) in row.iter_mut().enumerate().take(width) {
            let dx = x as f32 - cx;
            let dy = y as f32 - cy;
            let dist_sq = dx * dx + dy * dy;
            let value = amplitude * (-dist_sq / (2.0 * sigma_sq)).exp();
            *cell += value;
        }
    }
}

fn apply_noise(
    grid: &mut [Vec<Vec<f32>>],
    channel: Option<usize>,
    amplitude: f32,
    seed: u64,
    width: usize,
    height: usize,
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
        for row in grid[c].iter_mut().take(height) {
            for cell in row.iter_mut().take(width) {
                *cell += amplitude * lcg_next(&mut state);
            }
        }
    }
}

fn apply_ring(
    grid: &mut [Vec<Vec<f32>>],
    channel: usize,
    cx: f32,
    cy: f32,
    inner_radius: f32,
    outer_radius: f32,
    amplitude: f32,
) {
    if channel >= grid.len() {
        return;
    }
    let height = grid[channel].len();
    let width = grid[channel][0].len();

    for (y, row) in grid[channel].iter_mut().enumerate().take(height) {
        for (x, cell) in row.iter_mut().enumerate().take(width) {
            let dx = x as f32 - cx;
            let dy = y as f32 - cy;
            let dist = (dx * dx + dy * dy).sqrt();
            if dist >= inner_radius && dist <= outer_radius {
                // Smooth falloff at edges
                let edge_width = (outer_radius - inner_radius) * 0.2;
                let inner_falloff = ((dist - inner_radius) / edge_width).min(1.0);
                let outer_falloff = ((outer_radius - dist) / edge_width).min(1.0);
                let falloff = inner_falloff.min(outer_falloff);
                *cell += amplitude * falloff;
            }
        }
    }
}
