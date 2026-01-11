# The Rust Performance Book

**Source:** https://nnethercote.github.io/perf-book/print.html
**First published:** November 2020
**Written by:** Nicholas Nethercote and others

## Table of Contents

1. [Introduction](#introduction)
2. [Benchmarking](#benchmarking)
3. [Build Configuration](#build-configuration)
4. [Linting](#linting)
5. [Profiling](#profiling)
6. [Inlining](#inlining)
7. [Hashing](#hashing)
8. [Heap Allocations](#heap-allocations)
9. [Type Sizes](#type-sizes)
10. [Standard Library Types](#standard-library-types)
11. [Iterators](#iterators)
12. [Bounds Checks](#bounds-checks)
13. [I/O](#io)
14. [Logging and Debugging](#logging-and-debugging)
15. [Wrapper Types](#wrapper-types)
16. [Machine Code](#machine-code)
17. [Parallelism](#parallelism)
18. [General Tips](#general-tips)
19. [Compile Times](#compile-times)

---

## Introduction

Performance is important for many Rust programs.

This book contains techniques that can improve the performance-related
characteristics of Rust programs, such as runtime speed, memory usage, and
binary size. The Compile Times section also contains techniques that will
improve the compile times of Rust programs.

This book focuses on techniques that are practical and proven: many are
accompanied by links to pull requests or other resources that show how the
technique was used on a real-world Rust program.

---

## Benchmarking

Benchmarking typically involves comparing the performance of two or more
programs that do the same thing.

### Tools

- Rust's built-in benchmark tests (unstable, nightly only)
- **Criterion** and **Divan** are more sophisticated alternatives
- **Hyperfine** is an excellent general-purpose benchmarking tool
- **Bencher** can do continuous benchmarking on CI
- Custom benchmarking harnesses (e.g., rustc-perf)

### Metrics

Wall-time is obvious but can suffer from high variance. Other metrics with lower 
variance (such as cycles or instruction counts) may be a reasonable alternative.

---

## Build Configuration

### Release Builds

The single most important build configuration choice: use `--release` flag.
10-100x speedups over dev builds are common!

```bash
cargo build --release
cargo run --release
```

### Maximizing Runtime Speed

#### Codegen Units

Reduce to one for better optimization at the cost of compile times:

```toml
[profile.release]
codegen-units = 1
```

#### Link-time Optimization (LTO)

Can improve runtime speed by 10-20% or more:

```toml
[profile.release]
lto = "fat"      # Most aggressive
# lto = "thin"   # Less aggressive, faster compile
```

#### Alternative Allocators

**jemalloc** (Linux/Mac):

```toml
[dependencies]
tikv-jemallocator = "0.5"
```

```rust
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
```

**mimalloc** (cross-platform):

```toml
[dependencies]
mimalloc = "0.1"
```

```rust
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;
```

#### CPU-Specific Instructions

```bash
RUSTFLAGS="-C target-cpu=native" cargo build --release
```

Or in `config.toml`:

```toml
[build]
rustflags = ["-C", "target-cpu=native"]
```

#### Profile-guided Optimization (PGO)

Use `cargo-pgo` for easier PGO and BOLT optimization of Rust binaries.

### Minimizing Binary Size

```toml
[profile.release]
opt-level = "z"       # Optimize for size
panic = "abort"       # Don't include unwinding code
strip = "symbols"     # Strip debug symbols
```

### Summary for Maximum Speed

```toml
[profile.release]
codegen-units = 1
lto = "fat"
panic = "abort"
```

Plus: alternative allocator, `-C target-cpu=native`, and PGO if possible.

---

## Linting

Use **Clippy** for performance lints:

```bash
cargo clippy
```

### Disallowing Types

Prevent accidental use of slow types:

```toml
# clippy.toml
disallowed-types = ["std::collections::HashMap", "std::collections::HashSet"]
```

---

## Profiling

### Profilers

- **perf** (Linux) with Hotspot or Firefox Profiler for viewing
- **Instruments** (macOS)
- **Intel VTune Profiler** (cross-platform)
- **samply** (cross-platform sampling profiler)
- **flamegraph** (Cargo command)
- **Cachegrind & Callgrind** (instruction counts, cache simulation)
- **DHAT** (heap profiling) and **dhat-rs**
- **heaptrack** and **bytehound** (heap profiling)

### Debug Info for Profiling

```toml
[profile.release]
debug = "line-tables-only"
```

### Frame Pointers

```bash
RUSTFLAGS="-C force-frame-pointers=yes" cargo build --release
```

---

## Inlining

### Inline Attributes

- **None**: Compiler decides
- **`#[inline]`**: Suggests inlining
- **`#[inline(always)]`**: Strongly suggests inlining
- **`#[inline(never)]`**: Strongly suggests no inlining

### Split Hot/Cold Paths

```rust
// Use at hot call site
#[inline(always)]
fn inlined_my_function() {
    one();
    two();
    three();
}

// Use at cold call sites
#[inline(never)]
fn uninlined_my_function() {
    inlined_my_function();
}
```

### Outlining

Use `#[cold]` for rarely executed code:

```rust
#[cold]
fn handle_error() {
    // Error handling code
}
```

---

## Hashing

### Alternative Hashers

The default SipHash 1-3 is secure but slow for short keys.

**rustc-hash** (fastest, used in rustc):

```rust
use rustc_hash::{FxHashMap, FxHashSet};
```

**ahash** (can use AES instructions):

```rust
use ahash::{AHashMap, AHashSet};
```

**fnv** (higher quality than fx, slightly slower):

```rust
use fnv::{FnvHashMap, FnvHashSet};
```

### No-hash for Random Integers

```rust
use nohash_hasher::IntMap;
let map: IntMap<u64, String> = IntMap::default();
```

---

## Heap Allocations

### Profiling Allocations

Use **DHAT** or **dhat-rs** to identify hot allocation sites.

### Vec

#### Avoid Reallocations

```rust
// Pre-allocate if you know the size
let mut v = Vec::with_capacity(expected_size);
```

#### SmallVec for Short Vectors

```rust
use smallvec::{smallvec, SmallVec};
let v: SmallVec<[u32; 8]> = smallvec![1, 2, 3];
```

#### ArrayVec for Fixed Maximum

```rust
use arrayvec::ArrayVec;
let mut v: ArrayVec<u32, 8> = ArrayVec::new();
```

### String

**smartstring** for short strings (< 24 bytes on 64-bit):

```rust
use smartstring::alias::String;
```

### Avoid format! When Possible

`format!` always allocates. Use string literals or `std::format_args` when possible.

### clone_from for Reuse

```rust
// Reuses allocation if possible
destination.clone_from(&source);
```

### Cow for Mixed Borrowed/Owned

```rust
use std::borrow::Cow;

fn process(input: Cow<str>) {
    // Only clones if modification needed
}
```

### Reusing Collections

```rust
let mut workhorse = Vec::new();
for item in items {
    workhorse.clear();  // Keeps capacity
    // Use workhorse...
}
```

### Reading Lines Efficiently

```rust
// Avoid: allocates for every line
for line in reader.lines() {
    process(&line?);
}

// Better: reuse buffer
let mut line = String::new();
while reader.read_line(&mut line)? != 0 {
    process(&line);
    line.clear();
}
```

---

## Type Sizes

### Measuring

```bash
RUSTFLAGS=-Zprint-type-sizes cargo +nightly build --release
```

Or use `top-type-sizes` crate.

### Boxing Large Enum Variants

```rust
// Before: enum is 104 bytes
enum A {
    X,
    Y(i32),
    Z(i32, [u8; 100]),
}

// After: enum is 16 bytes
enum A {
    X,
    Y(i32),
    Z(Box<(i32, [u8; 100])>),
}
```

### Use Smaller Integers

Store indices as `u32`, `u16`, or `u8` when possible.

### Boxed Slices

```rust
// Vec: 3 words (len, capacity, ptr)
let v: Vec<u32> = vec![1, 2, 3];

// Box<[T]>: 2 words (len, ptr)
let bs: Box<[u32]> = v.into_boxed_slice();
```

### ThinVec

```rust
use thin_vec::ThinVec;
// size_of::<ThinVec<T>>() == 1 word
```

### Static Assertions

```rust
#[cfg(target_arch = "x86_64")]
static_assertions::assert_eq_size!(HotType, [u8; 64]);
```

---

## Standard Library Types

### Vec

- `vec![0; n]` for zero-filled vectors
- `swap_remove` is O(1) vs `remove` O(n)
- `retain` for efficient multi-removal

### Option and Result

Use lazy versions for expensive computations:

```rust
// Eager (always evaluates expensive())
let r = option.ok_or(expensive());

// Lazy (only evaluates if None)
let r = option.ok_or_else(|| expensive());
```

Same for: `map_or`/`map_or_else`, `unwrap_or`/`unwrap_or_else`.

### Rc/Arc::make_mut

Clone-on-write semantics:

```rust
let mut data = Arc::new(vec![1, 2, 3]);
Arc::make_mut(&mut data).push(4);  // Clones only if refcount > 1
```

### parking_lot

Alternative Mutex, RwLock, Condvar with better performance on some platforms.

---

## Iterators

### Avoid collect When Possible

Return `impl Iterator<Item=T>` instead of `Vec<T>`.

### extend vs collect + append

```rust
// Better
existing_vec.extend(iterator);

// Worse
let new_vec: Vec<_> = iterator.collect();
existing_vec.append(&mut new_vec);
```

### Implement size_hint

Helps `collect` and `extend` pre-allocate.

### Avoid chain in Hot Paths

`chain` adds overhead. Consider manual iteration.

### Use filter_map

```rust
// Potentially faster
iter.filter_map(|x| transform(x))

// Than
iter.filter(|x| predicate(x)).map(|x| transform(x))
```

### chunks_exact

Faster than `chunks` when size divides evenly.

### copied for Small Types

```rust
// May generate better code for integers
iter.copied()
```

---

## Bounds Checks

### Safe Elimination

- Use iteration instead of indexing
- Slice before loop, index into slice
- Add assertions on index ranges

```rust
assert!(index < slice.len());
// Compiler may eliminate bounds check below
let value = slice[index];
```

### Unsafe (Last Resort)

```rust
let value = unsafe { *slice.get_unchecked(index) };
```

---

## I/O

### Stdout Locking

```rust
use std::io::Write;
let mut stdout = std::io::stdout().lock();
for line in lines {
    writeln!(stdout, "{}", line)?;
}
```

### Buffering

```rust
use std::io::{BufReader, BufWriter};

let reader = BufReader::new(file);
let writer = BufWriter::new(file);
```

---

## Logging and Debugging

Ensure logging/debugging code doesn't run when disabled:

```rust
// Bad: always formats
log::debug!("{}", expensive_format());

// Good: only formats when enabled
if log::log_enabled!(log::Level::Debug) {
    log::debug!("{}", expensive_format());
}
```

Use `debug_assert!` for hot assertions that aren't safety-critical.

---

## Wrapper Types

Combine frequently accessed values in single wrapper:

```rust
// Before: two lock acquisitions
struct S {
    x: Arc<Mutex<u32>>,
    y: Arc<Mutex<u32>>,
}

// After: one lock acquisition
struct S {
    xy: Arc<Mutex<(u32, u32)>>,
}
```

---

## Parallelism

### Thread-based

- **rayon** for data parallelism
- **crossbeam** for concurrent data structures

### SIMD

- `core::arch` for architecture-specific intrinsics
- Portable SIMD (experimental)

---

## General Tips

1. Only optimize hot code
2. Algorithm/data structure changes beat micro-optimizations
3. Minimize cache misses and branch mispredictions
4. Lazy computation often wins
5. Optimize for common cases first
6. Handle 0, 1, 2 element cases specially when sizes are small
7. Use compression for repetitive data
8. Measure case frequencies, handle common ones first
9. Consider small caches for high-locality lookups
10. Document non-obvious optimizations with profiling data

---

## Compile Times

### Visualization

```bash
cargo build --timings
```

### Faster Linkers

- **lld** (default on Linux since Rust 1.90)
- **mold** (often faster than lld)
- **wild** (experimental, possibly fastest)

### Disable Debug Info

```toml
[profile.dev]
debug = false
# Or keep line info only:
debug = "line-tables-only"
```

### Reduce Generated Code

Use `cargo llvm-lines` to find IR bloat from generics.

Split generic functions:

```rust
pub fn read<P: AsRef<Path>>(path: P) -> io::Result<Vec<u8>> {
    fn inner(path: &Path) -> io::Result<Vec<u8>> {
        // Non-generic implementation
    }
    inner(path.as_ref())
}
```
