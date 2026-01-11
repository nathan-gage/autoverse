# Flow Lenia justfile
# Run `just --list` to see available commands

# Default recipe
default:
    @just --list

# WGSL Shader Commands

# Format all WGSL shaders in-place
fmt-wgsl:
    wgslfmt src/compute/gpu/shaders/*.wgsl

# Check WGSL formatting without modifying (for CI)
check-wgsl:
    wgslfmt --check src/compute/gpu/shaders/*.wgsl

# Validate all WGSL shaders with naga
lint-wgsl:
    #!/usr/bin/env bash
    set -e
    for shader in src/compute/gpu/shaders/*.wgsl; do
        echo "Validating $shader..."
        naga "$shader" || exit 1
    done
    echo "All shaders valid."

# Combined WGSL check (format + lint)
check-shaders: check-wgsl lint-wgsl

# Rust Commands

# Format Rust code
fmt:
    cargo fmt

# Lint Rust code
lint:
    cargo clippy

# Run all tests
test:
    cargo test

# Build in release mode
build:
    cargo build --release

# Full pre-push check (Rust + WGSL)
pre-push: fmt fmt-wgsl lint lint-wgsl test
    @echo "All checks passed!"
