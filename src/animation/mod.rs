//! Animation recording and playback for Flow Lenia simulations.
//!
//! This module provides efficient storage and playback of pre-computed
//! simulation states, enabling "compiled" mode for heavy 3D simulations.
//!
//! # File Format
//!
//! The `.flwa` (Flow Lenia Animation) format stores simulation frames
//! with optional compression:
//!
//! ```text
//! Header (48+ bytes):
//!   Magic: "FLWA" (4 bytes)
//!   Version: u16
//!   Flags: u16 (compression, etc.)
//!   Width: u32
//!   Height: u32
//!   Depth: u32
//!   Channels: u32
//!   Frame count: u64
//!   Frame rate: f32
//!   Reserved: 16 bytes
//!
//! Frame index table (frame_count * 16 bytes):
//!   Offset: u64
//!   Compressed size: u64
//!
//! Frame data (variable):
//!   Each frame is channels * depth * height * width * 4 bytes (f32)
//!   Optionally LZ4/zstd compressed
//! ```

mod format;
mod player;
mod recorder;

pub use format::{
    ANIMATION_MAGIC, ANIMATION_VERSION, AnimationFlags, AnimationHeader, CompressionType,
    FrameIndex,
};
pub use player::{AnimationPlayer, FrameIterator};
pub use recorder::{AnimationRecorder, RecorderConfig};
