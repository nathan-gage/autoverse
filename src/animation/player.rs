//! Animation player for reading back recorded simulations.

use std::fs::File;
use std::io::{self, BufReader, Read, Seek, SeekFrom};
use std::path::Path;

use super::format::{AnimationHeader, CompressionType, FrameIndex, decode_frame, decompress_lz4};
use crate::compute::SimulationState;

/// Animation player for reading recorded simulation files.
///
/// Usage:
/// ```ignore
/// let mut player = AnimationPlayer::open("animation.flwa")?;
/// println!("Animation has {} frames", player.frame_count());
///
/// // Read specific frame
/// let state = player.read_frame(100)?;
///
/// // Or iterate through all frames
/// for frame_result in player.frames() {
///     let state = frame_result?;
///     // Use state...
/// }
/// ```
pub struct AnimationPlayer {
    reader: BufReader<File>,
    header: AnimationHeader,
    frame_indices: Vec<FrameIndex>,
    /// Pre-allocated decompression buffer.
    decompress_buffer: Vec<u8>,
}

impl AnimationPlayer {
    /// Open an animation file for playback.
    pub fn open<P: AsRef<Path>>(path: P) -> io::Result<Self> {
        let file = File::open(path)?;
        let mut reader = BufReader::new(file);

        // Read header
        let header = AnimationHeader::read_from(&mut reader)?;

        // Seek to end to find index table
        let frame_data_size: u64 = header.frame_count * FrameIndex::SIZE as u64;
        let file_len = reader.seek(SeekFrom::End(0))?;
        let index_start = file_len - frame_data_size;

        reader.seek(SeekFrom::Start(index_start))?;

        // Read frame indices
        let mut frame_indices = Vec::with_capacity(header.frame_count as usize);
        for _ in 0..header.frame_count {
            frame_indices.push(FrameIndex::read_from(&mut reader)?);
        }

        let frame_size = header.frame_size();

        Ok(Self {
            reader,
            header,
            frame_indices,
            decompress_buffer: vec![0u8; frame_size],
        })
    }

    /// Get animation header.
    pub fn header(&self) -> &AnimationHeader {
        &self.header
    }

    /// Get total number of frames.
    pub fn frame_count(&self) -> u64 {
        self.header.frame_count
    }

    /// Get grid dimensions.
    pub fn dimensions(&self) -> (usize, usize, usize) {
        (
            self.header.width as usize,
            self.header.height as usize,
            self.header.depth as usize,
        )
    }

    /// Get number of channels.
    pub fn channels(&self) -> usize {
        self.header.channels as usize
    }

    /// Check if animation is 3D.
    pub fn is_3d(&self) -> bool {
        self.header.is_3d()
    }

    /// Get time step per frame.
    pub fn dt(&self) -> f32 {
        self.header.dt
    }

    /// Read a specific frame by index.
    pub fn read_frame(&mut self, frame_index: u64) -> io::Result<SimulationState> {
        if frame_index >= self.header.frame_count {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                format!(
                    "Frame index {} out of range (max {})",
                    frame_index,
                    self.header.frame_count - 1
                ),
            ));
        }

        let index = &self.frame_indices[frame_index as usize];
        self.reader.seek(SeekFrom::Start(index.offset))?;

        // Read compressed/raw data
        let mut data = vec![0u8; index.size as usize];
        self.reader.read_exact(&mut data)?;

        // Decompress if needed
        let raw_data = match self.header.flags.compression {
            CompressionType::None => data,
            CompressionType::Lz4 => decompress_lz4(&data)?,
        };

        // Decode into state
        self.decode_to_state(&raw_data)
    }

    /// Read frame data directly into pre-allocated buffers.
    pub fn read_frame_into(
        &mut self,
        frame_index: u64,
        channels: &mut [Vec<f32>],
    ) -> io::Result<()> {
        if frame_index >= self.header.frame_count {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                format!(
                    "Frame index {} out of range (max {})",
                    frame_index,
                    self.header.frame_count - 1
                ),
            ));
        }

        let index = &self.frame_indices[frame_index as usize];
        self.reader.seek(SeekFrom::Start(index.offset))?;

        // Read compressed/raw data
        if self.decompress_buffer.len() < index.size as usize {
            self.decompress_buffer.resize(index.size as usize, 0);
        }
        self.reader
            .read_exact(&mut self.decompress_buffer[..index.size as usize])?;

        // Decompress if needed
        let raw_data = match self.header.flags.compression {
            CompressionType::None => &self.decompress_buffer[..index.size as usize],
            CompressionType::Lz4 => {
                let decompressed = decompress_lz4(&self.decompress_buffer[..index.size as usize])?;
                // This is a bit inefficient, but we need the data to live long enough
                self.decompress_buffer = decompressed;
                &self.decompress_buffer[..]
            }
        };

        // Decode into channels
        let grid_size =
            self.header.width as usize * self.header.height as usize * self.header.depth as usize;

        for (c, channel) in channels.iter_mut().enumerate() {
            let start = c * grid_size * 4;
            let end = start + grid_size * 4;
            decode_frame(&raw_data[start..end], channel)?;
        }

        Ok(())
    }

    /// Decode raw bytes into a SimulationState.
    fn decode_to_state(&self, raw_data: &[u8]) -> io::Result<SimulationState> {
        let grid_size =
            self.header.width as usize * self.header.height as usize * self.header.depth as usize;

        let mut channels = Vec::with_capacity(self.header.channels as usize);
        for c in 0..self.header.channels as usize {
            let mut channel = vec![0.0f32; grid_size];
            let start = c * grid_size * 4;
            let end = start + grid_size * 4;
            decode_frame(&raw_data[start..end], &mut channel)?;
            channels.push(channel);
        }

        Ok(SimulationState {
            channels,
            width: self.header.width as usize,
            height: self.header.height as usize,
            depth: self.header.depth as usize,
            time: 0.0,
            step: 0,
        })
    }

    /// Create an iterator over all frames.
    pub fn frames(&mut self) -> FrameIterator<'_> {
        FrameIterator {
            player: self,
            current: 0,
        }
    }
}

/// Iterator over animation frames.
pub struct FrameIterator<'a> {
    player: &'a mut AnimationPlayer,
    current: u64,
}

impl<'a> Iterator for FrameIterator<'a> {
    type Item = io::Result<SimulationState>;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current >= self.player.frame_count() {
            return None;
        }

        let result = self.player.read_frame(self.current);
        self.current += 1;
        Some(result)
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let remaining = (self.player.frame_count() - self.current) as usize;
        (remaining, Some(remaining))
    }
}

impl<'a> ExactSizeIterator for FrameIterator<'a> {}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::animation::{AnimationRecorder, RecorderConfig};
    use crate::schema::{Pattern, Seed, SimulationConfig};
    use tempfile::tempdir;

    fn test_config() -> SimulationConfig {
        SimulationConfig {
            width: 16,
            height: 16,
            depth: 1,
            channels: 2,
            dt: 0.1,
            kernel_radius: 4,
            kernels: vec![],
            flow: Default::default(),
            embedding: Default::default(),
        }
    }

    #[test]
    fn test_player_roundtrip() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("roundtrip.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        // Record
        {
            let mut recorder =
                AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();
            recorder.record_frame(&state).unwrap();
            recorder.finalize().unwrap();
        }

        // Playback
        let mut player = AnimationPlayer::open(&path).unwrap();
        assert_eq!(player.frame_count(), 1);
        assert_eq!(player.dimensions(), (16, 16, 1));
        assert_eq!(player.channels(), 2);

        let loaded = player.read_frame(0).unwrap();
        assert_eq!(loaded.channels.len(), 2);
        assert_eq!(loaded.channels[0].len(), 16 * 16);

        // Verify data matches
        for (orig, loaded) in state.channels[0].iter().zip(loaded.channels[0].iter()) {
            assert!((orig - loaded).abs() < 1e-6);
        }
    }

    #[test]
    fn test_player_multiple_frames() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("multi.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };

        // Create states with different values
        let mut states = Vec::new();
        for i in 0..5 {
            let mut state = SimulationState::from_seed(&seed, &config);
            // Modify to make each frame unique
            for v in &mut state.channels[0] {
                *v *= (i + 1) as f32;
            }
            states.push(state);
        }

        // Record
        {
            let mut recorder =
                AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();
            for state in &states {
                recorder.record_frame(state).unwrap();
            }
            recorder.finalize().unwrap();
        }

        // Playback and verify
        let mut player = AnimationPlayer::open(&path).unwrap();
        assert_eq!(player.frame_count(), 5);

        for (i, state) in states.iter().enumerate() {
            let loaded = player.read_frame(i as u64).unwrap();
            for (orig, loaded) in state.channels[0].iter().zip(loaded.channels[0].iter()) {
                assert!(
                    (orig - loaded).abs() < 1e-6,
                    "Mismatch at frame {}: {} vs {}",
                    i,
                    orig,
                    loaded
                );
            }
        }
    }

    #[test]
    fn test_player_3d_roundtrip() {
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

        // Record
        {
            let mut recorder =
                AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();
            recorder.record_frame(&state).unwrap();
            recorder.finalize().unwrap();
        }

        // Playback
        let mut player = AnimationPlayer::open(&path).unwrap();
        assert!(player.is_3d());
        assert_eq!(player.dimensions(), (16, 16, 8));

        let loaded = player.read_frame(0).unwrap();
        assert_eq!(loaded.channels[0].len(), 16 * 16 * 8);

        // Verify data matches
        for (orig, loaded) in state.channels[0].iter().zip(loaded.channels[0].iter()) {
            assert!((orig - loaded).abs() < 1e-6);
        }
    }

    #[test]
    fn test_player_iterator() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("iter.flwa");

        let config = test_config();
        let seed = Seed {
            pattern: Pattern::Noise {
                channel: Some(0),
                amplitude: 0.5,
                seed: 42,
            },
        };
        let state = SimulationState::from_seed(&seed, &config);

        // Record 3 frames
        {
            let mut recorder =
                AnimationRecorder::new(&path, &config, RecorderConfig::default()).unwrap();
            for _ in 0..3 {
                recorder.record_frame(&state).unwrap();
            }
            recorder.finalize().unwrap();
        }

        // Use iterator
        let mut player = AnimationPlayer::open(&path).unwrap();
        let frames: Vec<_> = player.frames().collect();
        assert_eq!(frames.len(), 3);

        for frame in frames {
            assert!(frame.is_ok());
        }
    }
}
