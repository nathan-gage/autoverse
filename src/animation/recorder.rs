//! Animation recorder for capturing simulation frames.

use std::fs::File;
use std::io::{self, BufWriter, Seek, SeekFrom, Write};
use std::path::Path;

use super::format::{
    AnimationFlags, AnimationHeader, CompressionType, FrameIndex, compress_lz4, encode_frame,
};
use crate::compute::SimulationState;
use crate::schema::SimulationConfig;

/// Configuration for animation recording.
#[derive(Debug, Clone)]
pub struct RecorderConfig {
    /// Compression type to use.
    pub compression: CompressionType,
    /// Record every Nth frame (1 = every frame).
    pub frame_skip: u32,
    /// Maximum frames to record (0 = unlimited).
    pub max_frames: u64,
}

impl Default for RecorderConfig {
    fn default() -> Self {
        Self {
            compression: CompressionType::None,
            frame_skip: 1,
            max_frames: 0,
        }
    }
}

/// Animation recorder that captures simulation frames to a file.
///
/// Usage:
/// ```ignore
/// let mut recorder = AnimationRecorder::new("output.flwa", &config, Default::default())?;
/// for step in 0..1000 {
///     propagator.step(&mut state);
///     recorder.record_frame(&state)?;
/// }
/// recorder.finalize()?;
/// ```
pub struct AnimationRecorder {
    writer: BufWriter<File>,
    header: AnimationHeader,
    frame_indices: Vec<FrameIndex>,
    config: RecorderConfig,
    frames_written: u64,
    step_counter: u32,
    /// Pre-allocated buffer for frame encoding.
    encode_buffer: Vec<u8>,
}

impl AnimationRecorder {
    /// Create a new animation recorder.
    pub fn new<P: AsRef<Path>>(
        path: P,
        sim_config: &SimulationConfig,
        config: RecorderConfig,
    ) -> io::Result<Self> {
        let file = File::create(path)?;
        let mut writer = BufWriter::new(file);

        let header = AnimationHeader {
            width: sim_config.width as u32,
            height: sim_config.height as u32,
            depth: sim_config.depth as u32,
            channels: sim_config.channels as u32,
            frame_count: 0, // Will be updated on finalize
            dt: sim_config.dt,
            flags: AnimationFlags {
                compression: config.compression,
                delta_encoding: false,
            },
        };

        // Write placeholder header
        header.write_to(&mut writer)?;

        // Reserve space for frame index table (will be written at finalize)
        // We don't know frame count yet, so we'll write indices at the end

        let frame_size = header.frame_size();

        Ok(Self {
            writer,
            header,
            frame_indices: Vec::new(),
            config,
            frames_written: 0,
            step_counter: 0,
            encode_buffer: vec![0u8; frame_size],
        })
    }

    /// Record a simulation frame.
    ///
    /// Returns true if frame was actually recorded (may skip frames based on config).
    pub fn record_frame(&mut self, state: &SimulationState) -> io::Result<bool> {
        self.step_counter += 1;

        // Check frame skip
        if self.step_counter < self.config.frame_skip {
            return Ok(false);
        }
        self.step_counter = 0;

        // Check max frames
        if self.config.max_frames > 0 && self.frames_written >= self.config.max_frames {
            return Ok(false);
        }

        // Get current offset
        let offset = self.writer.stream_position()?;

        // Flatten all channels into contiguous data
        let total_size = state.channels.iter().map(|c| c.len()).sum::<usize>();
        if self.encode_buffer.len() != total_size * 4 {
            self.encode_buffer.resize(total_size * 4, 0);
        }

        let mut pos = 0;
        for channel in &state.channels {
            let bytes = encode_frame(channel);
            self.encode_buffer[pos..pos + bytes.len()].copy_from_slice(&bytes);
            pos += bytes.len();
        }

        // Apply compression if configured
        let data = match self.header.flags.compression {
            CompressionType::None => &self.encode_buffer[..],
            CompressionType::Lz4 => {
                let compressed = compress_lz4(&self.encode_buffer);
                self.writer.write_all(&compressed)?;
                self.frame_indices.push(FrameIndex {
                    offset,
                    size: compressed.len() as u64,
                });
                self.frames_written += 1;
                return Ok(true);
            }
        };

        self.writer.write_all(data)?;
        self.frame_indices.push(FrameIndex {
            offset,
            size: data.len() as u64,
        });
        self.frames_written += 1;

        Ok(true)
    }

    /// Finalize the animation file.
    ///
    /// Writes frame index table and updates header with final frame count.
    pub fn finalize(mut self) -> io::Result<AnimationStats> {
        // Write frame index table at current position
        let index_offset = self.writer.stream_position()?;
        for index in &self.frame_indices {
            index.write_to(&mut self.writer)?;
        }

        // Update header with final frame count
        self.header.frame_count = self.frames_written;

        // Seek back and rewrite header
        self.writer.seek(SeekFrom::Start(0))?;
        self.header.write_to(&mut self.writer)?;

        // Flush and close
        self.writer.flush()?;

        let total_size = index_offset
            + (self.frame_indices.len() as u64 * FrameIndex::SIZE as u64)
            + AnimationHeader::SIZE as u64;

        Ok(AnimationStats {
            frame_count: self.frames_written,
            total_bytes: total_size,
            average_frame_size: if self.frames_written > 0 {
                index_offset.saturating_sub(AnimationHeader::SIZE as u64) / self.frames_written
            } else {
                0
            },
            compression: self.header.flags.compression,
        })
    }

    /// Get number of frames recorded so far.
    pub fn frames_written(&self) -> u64 {
        self.frames_written
    }
}

/// Statistics from recording session.
#[derive(Debug, Clone)]
pub struct AnimationStats {
    /// Total frames recorded.
    pub frame_count: u64,
    /// Total file size in bytes.
    pub total_bytes: u64,
    /// Average compressed frame size.
    pub average_frame_size: u64,
    /// Compression used.
    pub compression: CompressionType,
}

impl std::fmt::Display for AnimationStats {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{} frames, {} bytes total, {} bytes/frame avg ({:?} compression)",
            self.frame_count, self.total_bytes, self.average_frame_size, self.compression
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::{Pattern, Seed};
    use std::fs;
    use tempfile::tempdir;

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 16,
            height: 16,
            depth: 1,
            channels: 1,
            dt: 0.1,
            kernel_radius: 4,
            kernels: vec![],
            flow: Default::default(),
            embedding: Default::default(),
        }
    }

    #[test]
    fn test_recorder_basic() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("test.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        let mut recorder =
            AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();

        for _ in 0..10 {
            recorder.record_frame(&state).unwrap();
        }

        let stats = recorder.finalize().unwrap();
        assert_eq!(stats.frame_count, 10);
        assert!(stats.total_bytes > 0);

        // Verify file exists
        assert!(path.exists());
        let metadata = fs::metadata(&path).unwrap();
        assert!(metadata.len() > AnimationHeader::SIZE as u64);
    }

    #[test]
    fn test_recorder_frame_skip() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("skip.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        let rec_config = RecorderConfig {
            frame_skip: 5,
            ..Default::default()
        };

        let mut recorder = AnimationRecorder::new(&path, &config, rec_config).unwrap();

        // Record 20 steps, should get 4 frames (at steps 5, 10, 15, 20)
        for _ in 0..20 {
            recorder.record_frame(&state).unwrap();
        }

        let stats = recorder.finalize().unwrap();
        assert_eq!(stats.frame_count, 4);
    }

    #[test]
    fn test_recorder_max_frames() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("max.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        let rec_config = RecorderConfig {
            max_frames: 5,
            ..Default::default()
        };

        let mut recorder = AnimationRecorder::new(&path, &config, rec_config).unwrap();

        // Try to record 100 frames, should stop at 5
        for _ in 0..100 {
            recorder.record_frame(&state).unwrap();
        }

        let stats = recorder.finalize().unwrap();
        assert_eq!(stats.frame_count, 5);
    }

    #[test]
    fn test_recorder_3d() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("3d.flwa");

        let mut config = test_config();
        config.depth = 8;

        let seed = Seed {
            pattern: Pattern::GaussianSphere {
                center: (0.5, 0.5, 0.5),
                radius: 0.2,
                amplitude: 1.0,
                channel: 0,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        let mut recorder =
            AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();

        recorder.record_frame(&state).unwrap();
        let stats = recorder.finalize().unwrap();

        assert_eq!(stats.frame_count, 1);
        // 3D frame should be 8x larger than 2D
        assert!(stats.average_frame_size >= (16 * 16 * 8 * 4) as u64);
    }
}
