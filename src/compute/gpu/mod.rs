//! GPU Compute Backend for Flow Lenia
//!
//! Provides GPU-accelerated simulation using WebGPU (wgpu).

mod propagator;

pub use propagator::GpuPropagator;

/// Error type for GPU operations.
#[derive(Debug, thiserror::Error)]
pub enum GpuError {
    #[error("No suitable GPU adapter found")]
    NoAdapter,

    #[error("Failed to request GPU device: {0}")]
    DeviceRequest(#[from] wgpu::RequestDeviceError),

    #[error("Buffer mapping failed: {0}")]
    BufferMap(#[from] wgpu::BufferAsyncError),
}
