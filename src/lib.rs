//! Flow Lenia - Mass conservative continuous cellular automata.
//!
//! This crate provides a high-performance implementation of Flow Lenia,
//! a variant of Lenia that introduces mass conservation through flow-based
//! dynamics and reintegration tracking.
//!
//! # Architecture
//!
//! The crate is split into two main modules:
//!
//! - `schema`: Configuration types and seeding for simulations
//! - `compute`: Numerical computation (kernels, FFT, flow, propagator)
//!
//! # Example
//!
//! ```rust,no_run
//! use flow_lenia::{
//!     schema::{SimulationConfig, Seed, Pattern},
//!     compute::{CpuPropagator, SimulationState},
//! };
//!
//! // Create configuration
//! let config = SimulationConfig::default();
//!
//! // Create initial state from seed
//! let seed = Seed {
//!     pattern: Pattern::GaussianBlob {
//!         center: (0.5, 0.5),
//!         radius: 0.1,
//!         amplitude: 1.0,
//!         channel: 0,
//!     },
//! };
//! let mut state = SimulationState::from_seed(&seed, &config);
//!
//! // Create propagator and run simulation
//! let mut propagator = CpuPropagator::new(config);
//! propagator.run(&mut state, 100);
//!
//! println!("Total mass after 100 steps: {}", state.total_mass());
//! ```

pub mod compute;
pub mod schema;

// WebAssembly bindings (only for wasm32 target)
#[cfg(target_arch = "wasm32")]
pub mod wasm;

// Re-export commonly used types
pub use compute::{CpuPropagator, SimulationState, SimulationStats};
pub use schema::{Pattern, Seed, SimulationConfig};
