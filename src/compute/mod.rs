//! Compute module - Numerical computation for Flow Lenia.
//!
//! Supports both 2D and 3D simulations. 3D modules are suffixed with `3d`.

mod direct_convolution;
mod embedded_propagator;
mod fft;
mod fft3d;
mod flow;
mod flow3d;
mod gradient;
mod gradient3d;
mod growth;
mod kernel;
mod kernel3d;
mod param_advection;
mod propagator;
mod propagator3d;
mod reintegration;
mod reintegration3d;

#[cfg(not(target_arch = "wasm32"))]
pub mod evolution;
pub mod gpu;

pub use direct_convolution::*;
pub use embedded_propagator::*;
pub use fft::*;
pub use fft3d::*;
pub use flow::*;
pub use flow3d::*;
pub use gradient::*;
pub use gradient3d::*;
pub use growth::*;
pub use kernel::*;
pub use kernel3d::*;
pub use param_advection::*;
pub use propagator::*;
pub use propagator3d::*;
pub use reintegration::*;
pub use reintegration3d::*;
