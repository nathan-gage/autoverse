//! Flow Lenia CLI - Run simulations and manage animations.

#[cfg(feature = "dhat-heap")]
#[global_allocator]
static ALLOC: dhat::Alloc = dhat::Alloc;

use std::fs;
use std::path::PathBuf;
use std::time::Instant;

use flow_lenia::{
    animation::{AnimationPlayer, AnimationRecorder, RecorderConfig},
    compute::{CpuPropagator, CpuPropagator3D, SimulationState, SimulationStats},
    schema::{Seed, SimulationConfig},
};

fn main() {
    #[cfg(feature = "dhat-heap")]
    let _profiler = dhat::Profiler::new_heap();

    env_logger::init();

    let args: Vec<String> = std::env::args().collect();

    if args.len() < 2 {
        print_usage(&args[0]);
        std::process::exit(1);
    }

    match args[1].as_str() {
        "run" => cmd_run(&args[2..]),
        "compile" => cmd_compile(&args[2..]),
        "info" => cmd_info(&args[2..]),
        "export" => cmd_export(&args[2..]),
        "--example" => print_example_config(),
        "--help" | "-h" => print_usage(&args[0]),
        // Legacy: treat first arg as config path for backward compatibility
        _ => {
            if args[1].ends_with(".json") {
                // Legacy mode: flow-lenia config.json [steps]
                cmd_run_legacy(&args[1..]);
            } else {
                eprintln!("Unknown command: {}", args[1]);
                print_usage(&args[0]);
                std::process::exit(1);
            }
        }
    }
}

fn print_usage(program: &str) {
    eprintln!("Flow Lenia - Mass Conservative Cellular Automata");
    eprintln!();
    eprintln!("Usage: {} <command> [options]", program);
    eprintln!();
    eprintln!("Commands:");
    eprintln!("  run <config.json> [steps]       Run simulation (live)");
    eprintln!("  compile <config.json> <output.flwa> [steps]");
    eprintln!("                                  Compile simulation to animation file");
    eprintln!("  info <animation.flwa>           Show animation file information");
    eprintln!("  export <animation.flwa> <output_dir> [start] [end]");
    eprintln!("                                  Export frames to individual files");
    eprintln!();
    eprintln!("Options:");
    eprintln!("  --example                       Print example configuration");
    eprintln!("  --help, -h                      Show this help message");
    eprintln!();
    eprintln!("Legacy mode:");
    eprintln!(
        "  {} <config.json> [steps]        Same as 'run' command",
        program
    );
}

fn cmd_run(args: &[String]) {
    if args.is_empty() {
        eprintln!("Usage: flow-lenia run <config.json> [steps]");
        std::process::exit(1);
    }
    cmd_run_legacy(args);
}

fn cmd_run_legacy(args: &[String]) {
    let config_path = PathBuf::from(&args[0]);
    let steps: u64 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(100);

    let (config, seed) = load_config_and_seed(&config_path);

    println!("Flow Lenia Simulation");
    println!("=====================");
    print_config_info(&config);
    println!("Steps: {}", steps);
    println!();

    // Initialize
    let mut state = SimulationState::from_seed(&seed, &config);
    let initial_stats = SimulationStats::from_state(&state);

    print_state_stats("Initial state", &initial_stats);
    println!();

    // Run simulation
    println!("Running simulation...");
    let start = Instant::now();

    if config.is_3d() {
        let mut propagator = CpuPropagator3D::new(config);
        run_simulation_loop(&mut propagator, &mut state, steps, &start, &initial_stats);
    } else {
        let mut propagator = CpuPropagator::new(config);
        run_simulation_loop(&mut propagator, &mut state, steps, &start, &initial_stats);
    }
}

trait Propagator {
    fn step(&mut self, state: &mut SimulationState);
}

impl Propagator for CpuPropagator {
    fn step(&mut self, state: &mut SimulationState) {
        CpuPropagator::step(self, state);
    }
}

impl Propagator for CpuPropagator3D {
    fn step(&mut self, state: &mut SimulationState) {
        CpuPropagator3D::step(self, state);
    }
}

fn run_simulation_loop<P: Propagator>(
    propagator: &mut P,
    state: &mut SimulationState,
    steps: u64,
    start: &Instant,
    initial_stats: &SimulationStats,
) {
    for i in 0..steps {
        propagator.step(state);

        // Print progress every 10%
        if (i + 1) % (steps / 10).max(1) == 0 {
            let stats = SimulationStats::from_state(state);
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
    let final_stats = SimulationStats::from_state(state);

    println!();
    print_state_stats("Final state", &final_stats);
    println!();
    println!(
        "Mass conservation: {:.4}%",
        (1.0 - (final_stats.total_mass - initial_stats.total_mass).abs()
            / initial_stats.total_mass.max(1e-10))
            * 100.0
    );
    println!(
        "Time: {:.2}s ({:.1} steps/s)",
        elapsed.as_secs_f32(),
        steps as f32 / elapsed.as_secs_f32()
    );
}

fn cmd_compile(args: &[String]) {
    if args.len() < 2 {
        eprintln!("Usage: flow-lenia compile <config.json> <output.flwa> [steps]");
        std::process::exit(1);
    }

    let config_path = PathBuf::from(&args[0]);
    let output_path = PathBuf::from(&args[1]);
    let steps: u64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(1000);

    let (config, seed) = load_config_and_seed(&config_path);

    println!("Compiling Flow Lenia Animation");
    println!("==============================");
    print_config_info(&config);
    println!("Steps: {}", steps);
    println!("Output: {}", output_path.display());
    println!();

    // Initialize
    let mut state = SimulationState::from_seed(&seed, &config);
    let initial_stats = SimulationStats::from_state(&state);

    print_state_stats("Initial state", &initial_stats);
    println!();

    // Create recorder
    let recorder_config = RecorderConfig::default();
    let mut recorder = AnimationRecorder::new(&output_path, &config, recorder_config)
        .unwrap_or_else(|e| {
            eprintln!("Error creating animation file: {}", e);
            std::process::exit(1);
        });

    // Record initial frame
    recorder.record_frame(&state).unwrap();

    // Run simulation and record
    println!("Compiling...");
    let start = Instant::now();

    if config.is_3d() {
        let mut propagator = CpuPropagator3D::new(config);
        compile_simulation_loop(&mut propagator, &mut state, &mut recorder, steps, &start);
    } else {
        let mut propagator = CpuPropagator::new(config);
        compile_simulation_loop(&mut propagator, &mut state, &mut recorder, steps, &start);
    }

    // Finalize
    let stats = recorder.finalize().unwrap_or_else(|e| {
        eprintln!("Error finalizing animation: {}", e);
        std::process::exit(1);
    });

    let elapsed = start.elapsed();
    let final_state_stats = SimulationStats::from_state(&state);

    println!();
    print_state_stats("Final state", &final_state_stats);
    println!();
    println!(
        "Mass conservation: {:.4}%",
        (1.0 - (final_state_stats.total_mass - initial_stats.total_mass).abs()
            / initial_stats.total_mass.max(1e-10))
            * 100.0
    );
    println!();
    println!("Animation saved: {}", stats);
    println!(
        "Compilation time: {:.2}s ({:.1} steps/s)",
        elapsed.as_secs_f32(),
        steps as f32 / elapsed.as_secs_f32()
    );
}

fn compile_simulation_loop<P: Propagator>(
    propagator: &mut P,
    state: &mut SimulationState,
    recorder: &mut AnimationRecorder,
    steps: u64,
    start: &Instant,
) {
    for i in 0..steps {
        propagator.step(state);
        recorder.record_frame(state).unwrap();

        // Print progress every 10%
        if (i + 1) % (steps / 10).max(1) == 0 {
            let elapsed = start.elapsed().as_secs_f32();
            let steps_per_sec = (i + 1) as f32 / elapsed;
            println!(
                "  Step {}/{}: {} frames, {:.1} steps/s",
                i + 1,
                steps,
                recorder.frames_written(),
                steps_per_sec
            );
        }
    }
}

fn cmd_info(args: &[String]) {
    if args.is_empty() {
        eprintln!("Usage: flow-lenia info <animation.flwa>");
        std::process::exit(1);
    }

    let animation_path = PathBuf::from(&args[0]);

    let player = AnimationPlayer::open(&animation_path).unwrap_or_else(|e| {
        eprintln!("Error opening animation: {}", e);
        std::process::exit(1);
    });

    let header = player.header();
    let (width, height, depth) = player.dimensions();

    println!("Animation Information");
    println!("====================");
    println!("File: {}", animation_path.display());
    println!();
    if player.is_3d() {
        println!("Grid: {}x{}x{} (3D)", width, height, depth);
    } else {
        println!("Grid: {}x{} (2D)", width, height);
    }
    println!("Channels: {}", player.channels());
    println!("Frames: {}", player.frame_count());
    println!("Time step (dt): {}", player.dt());
    println!("Compression: {:?}", header.flags.compression);
    println!();

    let frame_size = header.frame_size();
    let total_uncompressed = frame_size * player.frame_count() as usize;
    println!(
        "Frame size: {} bytes ({:.2} KB)",
        frame_size,
        frame_size as f64 / 1024.0
    );
    println!(
        "Total uncompressed: {} bytes ({:.2} MB)",
        total_uncompressed,
        total_uncompressed as f64 / (1024.0 * 1024.0)
    );
    println!(
        "Simulation duration: {:.2}s",
        player.frame_count() as f32 * player.dt()
    );
}

fn cmd_export(args: &[String]) {
    if args.len() < 2 {
        eprintln!("Usage: flow-lenia export <animation.flwa> <output_dir> [start] [end]");
        std::process::exit(1);
    }

    let animation_path = PathBuf::from(&args[0]);
    let output_dir = PathBuf::from(&args[1]);
    let start_frame: u64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(0);

    let mut player = AnimationPlayer::open(&animation_path).unwrap_or_else(|e| {
        eprintln!("Error opening animation: {}", e);
        std::process::exit(1);
    });

    let end_frame: u64 = args
        .get(3)
        .and_then(|s| s.parse().ok())
        .unwrap_or(player.frame_count());

    // Create output directory
    fs::create_dir_all(&output_dir).unwrap_or_else(|e| {
        eprintln!("Error creating output directory: {}", e);
        std::process::exit(1);
    });

    println!("Exporting Animation Frames");
    println!("==========================");
    println!("Animation: {}", animation_path.display());
    println!("Output: {}", output_dir.display());
    println!("Frames: {} to {}", start_frame, end_frame);
    println!();

    let start = Instant::now();
    let total_frames = end_frame - start_frame;

    for i in start_frame..end_frame {
        let state = player.read_frame(i).unwrap_or_else(|e| {
            eprintln!("Error reading frame {}: {}", i, e);
            std::process::exit(1);
        });

        // Export as JSON (simple format)
        let frame_path = output_dir.join(format!("frame_{:06}.json", i));
        let frame_data = serde_json::json!({
            "frame": i,
            "time": i as f32 * player.dt(),
            "width": state.width,
            "height": state.height,
            "depth": state.depth,
            "channels": state.channels.len(),
            "data": state.channels,
        });

        fs::write(&frame_path, serde_json::to_string(&frame_data).unwrap()).unwrap_or_else(|e| {
            eprintln!("Error writing frame {}: {}", i, e);
            std::process::exit(1);
        });

        // Print progress every 10%
        let progress = i - start_frame + 1;
        if progress % (total_frames / 10).max(1) == 0 {
            let elapsed = start.elapsed().as_secs_f32();
            let fps = progress as f32 / elapsed;
            println!(
                "  Exported {}/{} frames ({:.1} fps)",
                progress, total_frames, fps
            );
        }
    }

    let elapsed = start.elapsed();
    println!();
    println!(
        "Exported {} frames in {:.2}s ({:.1} fps)",
        total_frames,
        elapsed.as_secs_f32(),
        total_frames as f32 / elapsed.as_secs_f32()
    );
}

fn load_config_and_seed(config_path: &PathBuf) -> (SimulationConfig, Seed) {
    let config_str = fs::read_to_string(config_path).unwrap_or_else(|e| {
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

    (config, seed)
}

fn print_config_info(config: &SimulationConfig) {
    if config.is_3d() {
        println!(
            "Grid: {}x{}x{} ({} channels)",
            config.width, config.height, config.depth, config.channels
        );
    } else {
        println!(
            "Grid: {}x{} ({} channels)",
            config.width, config.height, config.channels
        );
    }
    println!("Kernels: {}", config.kernels.len());
    println!("dt: {}", config.dt);
}

fn print_state_stats(label: &str, stats: &SimulationStats) {
    println!("{}:", label);
    println!("  Total mass: {:.6}", stats.total_mass);
    println!("  Active cells: {}", stats.active_cells);
    println!(
        "  Value range: [{:.6}, {:.6}]",
        stats.min_value, stats.max_value
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
