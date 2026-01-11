//! Flow Lenia CLI - Run simulations from JSON configuration.

#[cfg(feature = "dhat-heap")]
#[global_allocator]
static ALLOC: dhat::Alloc = dhat::Alloc;

use std::fs;
use std::path::PathBuf;
use std::time::Instant;

use flow_lenia::{
    compute::{CpuPropagator, SimulationState, SimulationStats},
    schema::{Seed, SimulationConfig},
};

fn main() {
    #[cfg(feature = "dhat-heap")]
    let _profiler = dhat::Profiler::new_heap();

    env_logger::init();

    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <config.json> [steps]", args[0]);
        eprintln!();
        eprintln!("Run Flow Lenia simulation from JSON configuration.");
        eprintln!();
        eprintln!("Arguments:");
        eprintln!("  config.json  Path to simulation configuration file");
        eprintln!("  steps        Number of simulation steps (default: 100)");
        eprintln!();
        eprintln!("Example configuration is generated with --example flag.");

        if args.len() > 1 && args[1] == "--example" {
            print_example_config();
        }

        std::process::exit(1);
    }

    if args[1] == "--example" {
        print_example_config();
        return;
    }

    let config_path = PathBuf::from(&args[1]);
    let steps: u64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(100);

    // Load configuration
    let config_str = fs::read_to_string(&config_path).unwrap_or_else(|e| {
        eprintln!("Error reading config file: {}", e);
        std::process::exit(1);
    });

    let config: SimulationConfig = serde_json::from_str(&config_str).unwrap_or_else(|e| {
        eprintln!("Error parsing config: {}", e);
        std::process::exit(1);
    });

    // Load or create seed
    let seed_path = config_path.with_extension("seed.json");
    let seed: Seed = if seed_path.exists() {
        let seed_str = fs::read_to_string(&seed_path).unwrap_or_else(|e| {
            eprintln!("Error reading seed file: {}", e);
            std::process::exit(1);
        });
        serde_json::from_str(&seed_str).unwrap_or_else(|e| {
            eprintln!("Error parsing seed: {}", e);
            std::process::exit(1);
        })
    } else {
        Seed::default()
    };

    println!("Flow Lenia Simulation");
    println!("=====================");
    println!(
        "Grid: {}x{} ({} channels)",
        config.width, config.height, config.channels
    );
    println!("Kernels: {}", config.kernels.len());
    println!("dt: {}", config.dt);
    println!("Steps: {}", steps);
    println!();

    // Initialize
    let mut state = SimulationState::from_seed(&seed, &config);
    let initial_stats = SimulationStats::from_state(&state);

    println!("Initial state:");
    println!("  Total mass: {:.6}", initial_stats.total_mass);
    println!("  Active cells: {}", initial_stats.active_cells);
    println!(
        "  Value range: [{:.6}, {:.6}]",
        initial_stats.min_value, initial_stats.max_value
    );
    println!();

    // Create propagator
    let mut propagator = CpuPropagator::new(config);

    // Run simulation
    println!("Running simulation...");
    let start = Instant::now();

    for i in 0..steps {
        propagator.step(&mut state);

        // Print progress every 10%
        if (i + 1) % (steps / 10).max(1) == 0 {
            let stats = SimulationStats::from_state(&state);
            let elapsed = start.elapsed().as_secs_f32();
            let steps_per_sec = (i + 1) as f32 / elapsed;
            println!(
                "  Step {}/{}: mass={:.6}, active={}, {:.1} steps/s",
                i + 1,
                steps,
                stats.total_mass,
                stats.active_cells,
                steps_per_sec
            );
        }
    }

    let elapsed = start.elapsed();
    let final_stats = SimulationStats::from_state(&state);

    println!();
    println!("Final state:");
    println!("  Total mass: {:.6}", final_stats.total_mass);
    println!("  Active cells: {}", final_stats.active_cells);
    println!(
        "  Value range: [{:.6}, {:.6}]",
        final_stats.min_value, final_stats.max_value
    );
    println!();
    println!(
        "Mass conservation: {:.4}%",
        (1.0 - (final_stats.total_mass - initial_stats.total_mass).abs()
            / initial_stats.total_mass)
            * 100.0
    );
    println!(
        "Time: {:.2}s ({:.1} steps/s)",
        elapsed.as_secs_f32(),
        steps as f32 / elapsed.as_secs_f32()
    );
}

fn print_example_config() {
    let config = SimulationConfig::default();
    let seed = Seed::default();

    println!("Example configuration (config.json):");
    println!("{}", serde_json::to_string_pretty(&config).unwrap());
    println!();
    println!("Example seed (config.seed.json):");
    println!("{}", serde_json::to_string_pretty(&seed).unwrap());
}
