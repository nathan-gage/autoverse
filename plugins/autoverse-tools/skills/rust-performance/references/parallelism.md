# High-Performance Parallelism Patterns

## Rayon: Data Parallelism

Rayon provides work-stealing parallelism for data-parallel operations.

### Basic Parallel Iteration

```rust
use rayon::prelude::*;

// Sequential
let sum: i64 = (0..1_000_000).map(|x| x * x).sum();

// Parallel (often 4-8x faster on multi-core)
let sum: i64 = (0..1_000_000).into_par_iter().map(|x| x * x).sum();
```

### Parallel Collection Operations

```rust
use rayon::prelude::*;

// Parallel sort
let mut data: Vec<i32> = generate_data();
data.par_sort();

// Parallel sort with custom comparator
data.par_sort_by(|a, b| b.cmp(a));

// Parallel sort by key
data.par_sort_by_key(|x| x.abs());
```

### Chunked Parallelism

For better cache locality with large datasets:

```rust
use rayon::prelude::*;

let data: Vec<f64> = vec![0.0; 10_000_000];
let chunk_size = 10_000;

let results: Vec<f64> = data
    .par_chunks(chunk_size)
    .map(|chunk| {
        // Process each chunk sequentially for cache efficiency
        chunk.iter().map(|x| x.sin()).sum::<f64>()
    })
    .collect();
```

### Parallel Fold/Reduce

```rust
use rayon::prelude::*;

// Parallel reduction with identity and combine
let sum = (0..1_000_000)
    .into_par_iter()
    .fold(|| 0i64, |acc, x| acc + x)      // Per-thread fold
    .reduce(|| 0i64, |a, b| a + b);        // Combine results
```

### Custom Thread Pool

```rust
use rayon::ThreadPoolBuilder;

let pool = ThreadPoolBuilder::new()
    .num_threads(4)
    .stack_size(8 * 1024 * 1024)  // 8MB stack per thread
    .build()
    .unwrap();

pool.install(|| {
    // All parallel operations here use this pool
    data.par_iter().for_each(|x| process(x));
});
```

## Crossbeam: Fine-Grained Concurrency

### Scoped Threads

Safely borrow data across threads:

```rust
use crossbeam::scope;

let data = vec![1, 2, 3, 4, 5];
let mut results = vec![0; 5];

scope(|s| {
    for (i, (input, output)) in data.iter().zip(results.iter_mut()).enumerate() {
        s.spawn(move |_| {
            *output = input * input;
        });
    }
}).unwrap();
```

### Lock-Free Channels

```rust
use crossbeam::channel::{bounded, unbounded};

// Bounded channel (backpressure)
let (tx, rx) = bounded::<i32>(1000);

// Unbounded channel (no backpressure)
let (tx, rx) = unbounded::<i32>();

// Producer
std::thread::spawn(move || {
    for i in 0..1000 {
        tx.send(i).unwrap();
    }
});

// Consumer
for value in rx {
    process(value);
}
```

### Lock-Free Data Structures

```rust
use crossbeam::queue::ArrayQueue;

// Fixed-size lock-free queue
let queue = ArrayQueue::new(1000);

// Multiple producers/consumers can use safely
queue.push(42).unwrap();
let value = queue.pop();
```

## Work Stealing Pattern

```rust
use rayon::prelude::*;
use std::sync::atomic::{AtomicUsize, Ordering};

struct WorkItem {
    data: Vec<u8>,
    priority: u32,
}

fn process_work_stealing(items: Vec<WorkItem>) -> Vec<Result<(), Error>> {
    let counter = AtomicUsize::new(0);
    
    items
        .into_par_iter()
        .map(|item| {
            let processed = counter.fetch_add(1, Ordering::Relaxed);
            if processed % 1000 == 0 {
                eprintln!("Processed {} items", processed);
            }
            process_item(item)
        })
        .collect()
}
```

## SIMD Parallelism

### Auto-Vectorization Hints

```rust
// Help the compiler vectorize
#[inline]
fn process_slice(data: &mut [f32]) {
    // Process in chunks that match SIMD width
    for chunk in data.chunks_exact_mut(8) {
        for x in chunk {
            *x = (*x).sqrt();
        }
    }
    // Handle remainder
    for x in data.chunks_exact_mut(8).into_remainder() {
        *x = (*x).sqrt();
    }
}
```

### Explicit SIMD with std::simd (Nightly)

```rust
#![feature(portable_simd)]
use std::simd::f32x8;

fn add_simd(a: &[f32], b: &[f32], result: &mut [f32]) {
    let chunks = a.len() / 8;
    
    for i in 0..chunks {
        let va = f32x8::from_slice(&a[i*8..]);
        let vb = f32x8::from_slice(&b[i*8..]);
        let vr = va + vb;
        vr.copy_to_slice(&mut result[i*8..]);
    }
    
    // Scalar remainder
    for i in (chunks * 8)..a.len() {
        result[i] = a[i] + b[i];
    }
}
```

## Parallel I/O Patterns

### Parallel File Processing

```rust
use rayon::prelude::*;
use std::fs;
use std::path::PathBuf;

fn process_files_parallel(paths: Vec<PathBuf>) -> Vec<Result<Stats, Error>> {
    paths
        .into_par_iter()
        .map(|path| {
            let content = fs::read(&path)?;
            Ok(compute_stats(&content))
        })
        .collect()
}
```

### Pipeline Parallelism

```rust
use crossbeam::channel::{bounded, Sender, Receiver};
use std::thread;

fn pipeline<T, U, V>(
    input: Vec<T>,
    stage1: impl Fn(T) -> U + Send + Sync + 'static,
    stage2: impl Fn(U) -> V + Send + Sync + 'static,
) -> Vec<V>
where
    T: Send + 'static,
    U: Send + 'static,
    V: Send + 'static,
{
    let (tx1, rx1) = bounded::<U>(100);
    let (tx2, rx2) = bounded::<V>(100);
    
    // Stage 1 workers
    let s1 = thread::spawn(move || {
        input.into_par_iter().for_each(|item| {
            let result = stage1(item);
            tx1.send(result).unwrap();
        });
    });
    
    // Stage 2 workers
    let s2 = thread::spawn(move || {
        for item in rx1 {
            let result = stage2(item);
            tx2.send(result).unwrap();
        }
    });
    
    // Collect results
    let results: Vec<V> = rx2.iter().collect();
    
    s1.join().unwrap();
    s2.join().unwrap();
    
    results
}
```

## Avoiding Parallelism Pitfalls

### False Sharing

```rust
use std::sync::atomic::{AtomicU64, Ordering};

// BAD: Cache line contention
struct BadCounters {
    counter1: AtomicU64,
    counter2: AtomicU64,
}

// GOOD: Padded to avoid false sharing
#[repr(C)]
struct GoodCounters {
    counter1: AtomicU64,
    _pad1: [u8; 56],  // Pad to 64 bytes (cache line)
    counter2: AtomicU64,
    _pad2: [u8; 56],
}
```

### Minimize Lock Contention

```rust
use parking_lot::RwLock;
use std::collections::HashMap;

// BAD: Single lock for everything
struct BadCache {
    data: RwLock<HashMap<String, Vec<u8>>>,
}

// GOOD: Sharded locks
struct ShardedCache {
    shards: [RwLock<HashMap<String, Vec<u8>>>; 16],
}

impl ShardedCache {
    fn get_shard(&self, key: &str) -> &RwLock<HashMap<String, Vec<u8>>> {
        let hash = fxhash::hash(key);
        &self.shards[hash as usize % 16]
    }
}
```

### Thread-Local Accumulation

```rust
use rayon::prelude::*;
use std::cell::RefCell;

thread_local! {
    static LOCAL_BUFFER: RefCell<Vec<u8>> = RefCell::new(Vec::with_capacity(4096));
}

fn process_with_thread_local(items: &[Item]) -> Vec<Result> {
    items
        .par_iter()
        .map(|item| {
            LOCAL_BUFFER.with(|buf| {
                let mut buf = buf.borrow_mut();
                buf.clear();
                // Reuse buffer for this item
                process_into_buffer(item, &mut buf)
            })
        })
        .collect()
}
```
