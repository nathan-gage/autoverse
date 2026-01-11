//! Benchmarks for Flow Lenia propagator.

use criterion::{BenchmarkId, Criterion, black_box, criterion_group, criterion_main};

use flow_lenia::{
    compute::{CpuPropagator, SimulationState},
    schema::{
        EmbeddingConfig, FlowConfig, KernelConfig, Pattern, RingConfig, Seed, SimulationConfig,
    },
};

fn bench_propagator_step(c: &mut Criterion) {
    let mut group = c.benchmark_group("propagator_step");

    for size in [64, 128, 256, 512, 1024] {
        let config = SimulationConfig {
            width: size,
            height: size,
            channels: 1,
            dt: 0.2,
            kernel_radius: 13,
            kernels: vec![KernelConfig {
                radius: 1.0,
                rings: vec![RingConfig {
                    amplitude: 1.0,
                    distance: 0.5,
                    width: 0.15,
                }],
                weight: 1.0,
                mu: 0.15,
                sigma: 0.015,
                source_channel: 0,
                target_channel: 0,
            }],
            flow: FlowConfig::default(),
            embedding: EmbeddingConfig::default(),
        };

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.1,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut propagator = CpuPropagator::new(config.clone());
        let mut state = SimulationState::from_seed(&seed, &config);

        group.bench_with_input(
            BenchmarkId::from_parameter(format!("{}x{}", size, size)),
            &size,
            |b, _| {
                b.iter(|| {
                    propagator.step(black_box(&mut state));
                });
            },
        );
    }

    group.finish();
}

fn bench_multichannel(c: &mut Criterion) {
    let mut group = c.benchmark_group("multichannel");

    for channels in [1, 2, 4] {
        let config = SimulationConfig {
            width: 128,
            height: 128,
            channels,
            dt: 0.2,
            kernel_radius: 13,
            kernels: (0..channels)
                .map(|c| KernelConfig {
                    radius: 1.0,
                    rings: vec![RingConfig {
                        amplitude: 1.0,
                        distance: 0.5,
                        width: 0.15,
                    }],
                    weight: 1.0,
                    mu: 0.15,
                    sigma: 0.015,
                    source_channel: c,
                    target_channel: c,
                })
                .collect(),
            flow: FlowConfig::default(),
            embedding: EmbeddingConfig::default(),
        };

        let seed = Seed {
            pattern: Pattern::GaussianBlob {
                center: (0.5, 0.5),
                radius: 0.1,
                amplitude: 1.0,
                channel: 0,
            },
        };

        let mut propagator = CpuPropagator::new(config.clone());
        let mut state = SimulationState::from_seed(&seed, &config);

        group.bench_with_input(
            BenchmarkId::from_parameter(format!("{}_channels", channels)),
            &channels,
            |b, _| {
                b.iter(|| {
                    propagator.step(black_box(&mut state));
                });
            },
        );
    }

    group.finish();
}

criterion_group!(benches, bench_propagator_step, bench_multichannel);
criterion_main!(benches);
