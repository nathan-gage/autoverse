---
name: rust-performance
description: Write high-performance, computational Rust code that parallelizes well and allocates memory efficiently. Use when writing performance-critical Rust code, optimizing existing Rust code for speed or memory, implementing parallel/concurrent algorithms, working with SIMD, or when the user mentions performance, optimization, allocation, or parallelism in a Rust context. Covers build configuration, profiling, memory allocation patterns, parallelism with rayon/crossbeam, and micro-optimization techniques.
---

# High-Performance Rust

This skill covers writing Rust code optimized for computational performance, parallelism, and memory efficiency.

## Build Configuration for Performance

Always use release builds with optimizations:

```toml
[profile.release]
codegen-units = 1     # Better optimization, slower compile
lto = "fat"           # Link-time optimization
panic = "abort"       # Smaller binary, no unwinding
```

For maximum speed, also add:
```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

Consider alternative allocators for allocation-heavy workloads:
```rust
// jemalloc (Linux/macOS) or mimalloc (cross-platform)
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
```

## Error Handling: Avoid unwrap()

**Never use `.unwrap()` in performance-critical code paths.** Beyond the panic risk, `unwrap()` inserts panic-handling code that can inhibit optimizations.

Prefer these patterns:

```rust
// GOOD: let-else for early return
let Some(value) = maybe_value else {
    return Err("Value not found".into());
};

// GOOD: ok_or_else with lazy error creation
let value = maybe_value.ok_or_else(|| Error::NotFound)?;

// GOOD: match for complex handling
let value = match maybe_value {
    Some(v) => v,
    None => return default_value,
};
```

For fallback values, use `unwrap_or` or `unwrap_or_else`:
```rust
let value = maybe_value.unwrap_or(0);
let value = maybe_value.unwrap_or_else(|| compute_default());
```

See: https://corrode.dev/blog/rust-option-handling-best-practices/

## Memory Allocation Best Practices

### Pre-allocate When Size is Known

```rust
// BAD: Multiple reallocations
let mut v = Vec::new();
for i in 0..1000 { v.push(i); }

// GOOD: Single allocation
let mut v = Vec::with_capacity(1000);
for i in 0..1000 { v.push(i); }
```

### Reuse Buffers

```rust
let mut buffer = Vec::with_capacity(4096);
for item in items {
    buffer.clear();  // Keeps capacity
    process_into(&mut buffer, item);
}
```

### Use Stack Allocation for Small Collections

```rust
use smallvec::{smallvec, SmallVec};

// Stack-allocates up to 8 elements
let mut v: SmallVec<[u32; 8]> = SmallVec::new();
```

### Avoid Cloning in Hot Paths

```rust
// BAD: Always clones
fn process(data: Vec<u8>) -> Result<()>

// GOOD: Borrows when possible
fn process(data: &[u8]) -> Result<()>

// GOOD: Copy-on-write for conditional mutation
use std::borrow::Cow;
fn process(data: Cow<[u8]>) -> Result<()>
```

For detailed memory patterns, see: `references/memory-allocation.md`

## Parallelism

### Rayon for Data Parallelism

```rust
use rayon::prelude::*;

// Parallel iteration
let results: Vec<_> = data
    .par_iter()
    .map(|x| expensive_computation(x))
    .collect();

// Parallel sort
data.par_sort();
```

### Chunked Processing for Cache Efficiency

```rust
data.par_chunks(1024)
    .map(|chunk| {
        // Sequential within chunk for cache locality
        chunk.iter().map(process).sum::<f64>()
    })
    .sum::<f64>()
```

### Crossbeam for Fine-Grained Concurrency

```rust
use crossbeam::scope;

scope(|s| {
    for item in &mut items {
        s.spawn(move |_| process(item));
    }
}).unwrap();
```

For detailed parallelism patterns, see: `references/parallelism.md`

## Micro-Optimizations

### Bounds Check Elimination

```rust
// Help compiler eliminate bounds checks
assert!(index < slice.len());
let value = slice[index];

// Or use iteration instead of indexing
for value in &slice[start..end] {
    // No bounds checks in loop
}
```

### Inlining Hot Functions

```rust
#[inline(always)]
fn hot_inner_loop_fn() { /* ... */ }

#[inline(never)]
fn cold_error_handling() { /* ... */ }

#[cold]
fn rarely_called() { /* ... */ }
```

### Faster Hashing

```rust
use rustc_hash::FxHashMap;  // Faster than std HashMap

let mut map: FxHashMap<K, V> = FxHashMap::default();
```

### Avoid Iterator Chain Overhead in Hot Loops

```rust
// May be slower due to chain overhead
iter.filter(pred).map(f).collect()

// Consider manual loop for hot paths
let mut result = Vec::with_capacity(hint);
for item in iter {
    if pred(&item) {
        result.push(f(item));
    }
}
```

## Profiling

Before optimizing, profile to find actual bottlenecks:

```bash
# Compile with debug info for profiling
RUSTFLAGS="-C force-frame-pointers=yes" cargo build --release

# Linux: Use perf + flamegraph
cargo install flamegraph
cargo flamegraph

# Cross-platform: Use samply
cargo install samply
samply record ./target/release/myapp
```

For heap profiling, use DHAT:
```rust
#[cfg(feature = "dhat-heap")]
#[global_allocator]
static ALLOC: dhat::Alloc = dhat::Alloc;
```

## Reference Material

- For specific topics, run: `scripts/extract_section.py "<section>"`
  - Available: Benchmarking, Build Configuration, Profiling, Inlining, Hashing, Heap Allocations, Type Sizes, Iterators, Parallelism, etc.
- Parallelism patterns: `references/parallelism.md`
- Memory allocation patterns: `references/memory-allocation.md`
- Full performance book: `assets/perf-book.md`

## Quick Checklist

Before shipping performance-critical code:

- [ ] Release build with `codegen-units = 1` and `lto = "fat"`
- [ ] No `unwrap()` in hot paths (use `let-else` or `ok_or_else`)
- [ ] Pre-allocated collections where size is known
- [ ] Buffers reused instead of reallocated
- [ ] Hot functions marked `#[inline]` or `#[inline(always)]`
- [ ] Cold/error paths marked `#[cold]` or `#[inline(never)]`
- [ ] FxHashMap/FxHashSet instead of std HashMap/HashSet
- [ ] Profiled with real workloads to confirm optimizations help
- [ ] Parallel iteration with rayon where appropriate
- [ ] No unnecessary cloning in hot paths
