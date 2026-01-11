//! Binary format definitions for Flow Lenia Animation files.

use std::io::{self, Read, Write};

/// Magic bytes identifying a Flow Lenia Animation file.
pub const ANIMATION_MAGIC: &[u8; 4] = b"FLWA";

/// Current format version.
pub const ANIMATION_VERSION: u16 = 1;

/// Compression type for frame data.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[repr(u8)]
pub enum CompressionType {
    /// No compression (raw f32 data).
    #[default]
    None = 0,
    /// LZ4 fast compression.
    Lz4 = 1,
}

impl CompressionType {
    pub fn from_u8(v: u8) -> Option<Self> {
        match v {
            0 => Some(CompressionType::None),
            1 => Some(CompressionType::Lz4),
            _ => None,
        }
    }
}

/// Animation file header flags.
#[derive(Debug, Clone, Copy, Default)]
pub struct AnimationFlags {
    /// Compression type (lower 4 bits).
    pub compression: CompressionType,
    /// If true, frames store delta from previous frame.
    pub delta_encoding: bool,
}

impl AnimationFlags {
    pub fn to_u16(self) -> u16 {
        let mut flags = self.compression as u16;
        if self.delta_encoding {
            flags |= 1 << 4;
        }
        flags
    }

    pub fn from_u16(v: u16) -> Self {
        Self {
            compression: CompressionType::from_u8((v & 0x0F) as u8).unwrap_or_default(),
            delta_encoding: (v & (1 << 4)) != 0,
        }
    }
}

/// File header for Flow Lenia Animation format.
#[derive(Debug, Clone)]
pub struct AnimationHeader {
    /// Grid width.
    pub width: u32,
    /// Grid height.
    pub height: u32,
    /// Grid depth (1 for 2D).
    pub depth: u32,
    /// Number of channels.
    pub channels: u32,
    /// Total number of frames.
    pub frame_count: u64,
    /// Simulation time step (dt) per frame.
    pub dt: f32,
    /// Animation flags.
    pub flags: AnimationFlags,
}

impl AnimationHeader {
    /// Size of header in bytes.
    /// Magic(4) + Version(2) + Flags(2) + Width(4) + Height(4) + Depth(4) +
    /// Channels(4) + FrameCount(8) + dt(4) + Reserved(16) = 52
    pub const SIZE: usize = 52;

    /// Compute size of one uncompressed frame in bytes.
    pub fn frame_size(&self) -> usize {
        self.width as usize
            * self.height as usize
            * self.depth as usize
            * self.channels as usize
            * 4
    }

    /// Check if this is a 3D animation.
    pub fn is_3d(&self) -> bool {
        self.depth > 1
    }

    /// Write header to output.
    pub fn write_to<W: Write>(&self, w: &mut W) -> io::Result<()> {
        w.write_all(ANIMATION_MAGIC)?;
        w.write_all(&ANIMATION_VERSION.to_le_bytes())?;
        w.write_all(&self.flags.to_u16().to_le_bytes())?;
        w.write_all(&self.width.to_le_bytes())?;
        w.write_all(&self.height.to_le_bytes())?;
        w.write_all(&self.depth.to_le_bytes())?;
        w.write_all(&self.channels.to_le_bytes())?;
        w.write_all(&self.frame_count.to_le_bytes())?;
        w.write_all(&self.dt.to_le_bytes())?;
        // Reserved bytes
        w.write_all(&[0u8; 16])?;
        Ok(())
    }

    /// Read header from input.
    pub fn read_from<R: Read>(r: &mut R) -> io::Result<Self> {
        let mut magic = [0u8; 4];
        r.read_exact(&mut magic)?;
        if &magic != ANIMATION_MAGIC {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "Invalid FLWA magic bytes",
            ));
        }

        let mut buf2 = [0u8; 2];
        let mut buf4 = [0u8; 4];
        let mut buf8 = [0u8; 8];

        r.read_exact(&mut buf2)?;
        let version = u16::from_le_bytes(buf2);
        if version != ANIMATION_VERSION {
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                format!("Unsupported FLWA version: {}", version),
            ));
        }

        r.read_exact(&mut buf2)?;
        let flags = AnimationFlags::from_u16(u16::from_le_bytes(buf2));

        r.read_exact(&mut buf4)?;
        let width = u32::from_le_bytes(buf4);

        r.read_exact(&mut buf4)?;
        let height = u32::from_le_bytes(buf4);

        r.read_exact(&mut buf4)?;
        let depth = u32::from_le_bytes(buf4);

        r.read_exact(&mut buf4)?;
        let channels = u32::from_le_bytes(buf4);

        r.read_exact(&mut buf8)?;
        let frame_count = u64::from_le_bytes(buf8);

        r.read_exact(&mut buf4)?;
        let dt = f32::from_le_bytes(buf4);

        // Skip reserved bytes
        let mut reserved = [0u8; 16];
        r.read_exact(&mut reserved)?;

        Ok(Self {
            width,
            height,
            depth,
            channels,
            frame_count,
            dt,
            flags,
        })
    }
}

/// Index entry for a single frame.
#[derive(Debug, Clone, Copy)]
pub struct FrameIndex {
    /// Byte offset from start of file.
    pub offset: u64,
    /// Compressed size in bytes (equals uncompressed if no compression).
    pub size: u64,
}

impl FrameIndex {
    /// Size of one index entry in bytes.
    pub const SIZE: usize = 16;

    pub fn write_to<W: Write>(&self, w: &mut W) -> io::Result<()> {
        w.write_all(&self.offset.to_le_bytes())?;
        w.write_all(&self.size.to_le_bytes())?;
        Ok(())
    }

    pub fn read_from<R: Read>(r: &mut R) -> io::Result<Self> {
        let mut buf8 = [0u8; 8];

        r.read_exact(&mut buf8)?;
        let offset = u64::from_le_bytes(buf8);

        r.read_exact(&mut buf8)?;
        let size = u64::from_le_bytes(buf8);

        Ok(Self { offset, size })
    }
}

/// Encode f32 slice to bytes.
pub fn encode_frame(data: &[f32]) -> Vec<u8> {
    let mut bytes = vec![0u8; data.len() * 4];
    for (i, &v) in data.iter().enumerate() {
        bytes[i * 4..(i + 1) * 4].copy_from_slice(&v.to_le_bytes());
    }
    bytes
}

/// Decode bytes to f32 slice.
pub fn decode_frame(bytes: &[u8], output: &mut [f32]) -> io::Result<()> {
    if bytes.len() != output.len() * 4 {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            format!(
                "Frame size mismatch: {} bytes vs {} floats",
                bytes.len(),
                output.len()
            ),
        ));
    }
    for (i, v) in output.iter_mut().enumerate() {
        let b = &bytes[i * 4..(i + 1) * 4];
        *v = f32::from_le_bytes([b[0], b[1], b[2], b[3]]);
    }
    Ok(())
}

/// Compress data using LZ4.
#[cfg(feature = "lz4")]
pub fn compress_lz4(data: &[u8]) -> Vec<u8> {
    lz4_flex::compress_prepend_size(data)
}

/// Decompress LZ4 data.
#[cfg(feature = "lz4")]
pub fn decompress_lz4(data: &[u8]) -> io::Result<Vec<u8>> {
    lz4_flex::decompress_size_prepended(data)
        .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

/// Fallback when LZ4 is not available.
#[cfg(not(feature = "lz4"))]
pub fn compress_lz4(data: &[u8]) -> Vec<u8> {
    data.to_vec()
}

#[cfg(not(feature = "lz4"))]
pub fn decompress_lz4(data: &[u8]) -> io::Result<Vec<u8>> {
    Ok(data.to_vec())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Cursor;

    #[test]
    fn test_header_roundtrip() {
        let header = AnimationHeader {
            width: 64,
            height: 48,
            depth: 32,
            channels: 2,
            frame_count: 1000,
            dt: 0.1,
            flags: AnimationFlags {
                compression: CompressionType::Lz4,
                delta_encoding: false,
            },
        };

        let mut buf = Vec::new();
        header.write_to(&mut buf).unwrap();
        assert_eq!(buf.len(), AnimationHeader::SIZE);

        let mut cursor = Cursor::new(&buf);
        let decoded = AnimationHeader::read_from(&mut cursor).unwrap();

        assert_eq!(decoded.width, 64);
        assert_eq!(decoded.height, 48);
        assert_eq!(decoded.depth, 32);
        assert_eq!(decoded.channels, 2);
        assert_eq!(decoded.frame_count, 1000);
        assert!((decoded.dt - 0.1).abs() < 1e-6);
        assert_eq!(decoded.flags.compression, CompressionType::Lz4);
    }

    #[test]
    fn test_frame_encode_decode() {
        let data: Vec<f32> = (0..100).map(|i| i as f32 * 0.1).collect();
        let encoded = encode_frame(&data);
        assert_eq!(encoded.len(), data.len() * 4);

        let mut decoded = vec![0.0f32; 100];
        decode_frame(&encoded, &mut decoded).unwrap();

        for (a, b) in data.iter().zip(decoded.iter()) {
            assert!((a - b).abs() < 1e-9);
        }
    }

    #[test]
    fn test_frame_index_roundtrip() {
        let index = FrameIndex {
            offset: 12345678,
            size: 8192,
        };

        let mut buf = Vec::new();
        index.write_to(&mut buf).unwrap();
        assert_eq!(buf.len(), FrameIndex::SIZE);

        let mut cursor = Cursor::new(&buf);
        let decoded = FrameIndex::read_from(&mut cursor).unwrap();

        assert_eq!(decoded.offset, 12345678);
        assert_eq!(decoded.size, 8192);
    }
}
