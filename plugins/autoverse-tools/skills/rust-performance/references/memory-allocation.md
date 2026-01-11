# Performance-Minded Memory Allocation

## Core Principles

1. **Avoid allocations in hot paths** — Pre-allocate or reuse
2. **Minimize allocation count** — Batch operations when possible
3. **Right-size allocations** — Use `with_capacity` when size is known
4. **Pool frequently used objects** — Amortize allocation costs
5. **Choose appropriate types** — SmallVec, ArrayVec, Cow, etc.

## Pre-allocation Patterns

### Vec Pre-allocation

```rust
// BAD: Multiple reallocations
let mut v = Vec::new();
for i in 0..1000 {
    v.push(i);  // Reallocates at 4, 8, 16, 32, 64, 128, 256, 512
}

// GOOD: Single allocation
let mut v = Vec::with_capacity(1000);
for i in 0..1000 {
    v.push(i);  // No reallocations
}

// GOOD: From iterator with size hint
let v: Vec<_> = (0..1000).collect();  // Allocates once
```

### HashMap Pre-allocation

```rust
use std::collections::HashMap;

// GOOD: Pre-size the hash map
let mut map = HashMap::with_capacity(expected_entries);

// Even better: use a faster hasher
use rustc_hash::FxHashMap;
let mut map: FxHashMap<K, V> = FxHashMap::with_capacity_and_hasher(
    expected_entries,
    Default::default()
);
```

### String Pre-allocation

```rust
// BAD: Multiple reallocations
let mut s = String::new();
for word in words {
    s.push_str(word);
    s.push(' ');
}

// GOOD: Estimate size
let total_len: usize = words.iter().map(|w| w.len() + 1).sum();
let mut s = String::with_capacity(total_len);
for word in words {
    s.push_str(word);
    s.push(' ');
}
```

## Reuse Patterns

### Buffer Reuse

```rust
struct Processor {
    // Reusable buffers
    input_buffer: Vec<u8>,
    output_buffer: Vec<u8>,
    temp_storage: Vec<f64>,
}

impl Processor {
    fn process(&mut self, data: &[u8]) -> &[u8] {
        // Clear but keep capacity
        self.input_buffer.clear();
        self.output_buffer.clear();
        self.temp_storage.clear();
        
        self.input_buffer.extend_from_slice(data);
        // ... processing ...
        &self.output_buffer
    }
}
```

### Thread-Local Buffers

```rust
use std::cell::RefCell;

thread_local! {
    static SCRATCH: RefCell<Vec<u8>> = RefCell::new(Vec::with_capacity(64 * 1024));
}

fn process_with_scratch<F, R>(f: F) -> R
where
    F: FnOnce(&mut Vec<u8>) -> R,
{
    SCRATCH.with(|scratch| {
        let mut scratch = scratch.borrow_mut();
        scratch.clear();
        f(&mut scratch)
    })
}
```

### Object Pooling

```rust
use parking_lot::Mutex;

struct Pool<T> {
    items: Mutex<Vec<T>>,
    create: fn() -> T,
}

impl<T> Pool<T> {
    fn new(create: fn() -> T, initial_size: usize) -> Self {
        let items: Vec<T> = (0..initial_size).map(|_| create()).collect();
        Pool {
            items: Mutex::new(items),
            create,
        }
    }
    
    fn acquire(&self) -> PoolGuard<T> {
        let item = self.items.lock().pop().unwrap_or_else(|| (self.create)());
        PoolGuard { pool: self, item: Some(item) }
    }
}

struct PoolGuard<'a, T> {
    pool: &'a Pool<T>,
    item: Option<T>,
}

impl<'a, T> Drop for PoolGuard<'a, T> {
    fn drop(&mut self) {
        if let Some(item) = self.item.take() {
            self.pool.items.lock().push(item);
        }
    }
}
```

## Stack Allocation

### SmallVec for Usually-Small Collections

```rust
use smallvec::{smallvec, SmallVec};

// Stack-allocates up to 8 elements, heap-allocates if more
type SmallVec8<T> = SmallVec<[T; 8]>;

fn process(items: &[Item]) -> SmallVec8<Result> {
    let mut results: SmallVec8<Result> = SmallVec::new();
    for item in items.iter().take(8) {
        results.push(process_item(item));
    }
    results
}
```

### ArrayVec for Fixed-Size

```rust
use arrayvec::ArrayVec;

// Never heap allocates, panics if exceeds capacity
fn parse_header(data: &[u8]) -> ArrayVec<Header, 16> {
    let mut headers = ArrayVec::new();
    // Parse up to 16 headers...
    headers
}
```

### tinyvec for no_std

```rust
use tinyvec::{array_vec, ArrayVec, TinyVec};

// Stack-only, no heap fallback
let mut stack_only: ArrayVec<[u8; 32]> = array_vec![];

// Stack with heap fallback (like SmallVec)
let mut with_fallback: TinyVec<[u8; 32]> = TinyVec::new();
```

## Copy-on-Write (Cow)

```rust
use std::borrow::Cow;

// Avoid cloning when not needed
fn process_text(input: &str) -> Cow<str> {
    if input.contains("bad_word") {
        // Only allocate if modification needed
        Cow::Owned(input.replace("bad_word", "***"))
    } else {
        // Return borrowed reference
        Cow::Borrowed(input)
    }
}

// Useful for mixed borrowed/owned collections
fn collect_strings<'a>(sources: &'a [String], literals: &[&'static str]) -> Vec<Cow<'a, str>> {
    let mut result = Vec::with_capacity(sources.len() + literals.len());
    result.extend(sources.iter().map(|s| Cow::Borrowed(s.as_str())));
    result.extend(literals.iter().map(|&s| Cow::Borrowed(s)));
    result
}
```

## Inline Storage Strings

### smartstring

```rust
use smartstring::alias::String as SmartString;

// Stores up to 23 bytes inline (on 64-bit), no heap allocation
let s: SmartString = "short string".into();  // No allocation

let long: SmartString = "this is a much longer string that exceeds inline capacity".into();
// Only this one allocates
```

### compact_str

```rust
use compact_str::CompactString;

// Similar to smartstring, 24-byte inline storage
let s: CompactString = CompactString::from("inline!");
```

## Arena Allocation

### bumpalo for Bulk Allocations

```rust
use bumpalo::Bump;

fn process_batch(items: &[Item]) -> Vec<Result> {
    // Arena for temporary allocations
    let arena = Bump::new();
    
    // All allocations from arena are freed together when arena drops
    let temp_data: &mut [u8] = arena.alloc_slice_fill_default(1024);
    let temp_nodes: &mut Node = arena.alloc(Node::default());
    
    // Process using arena-allocated temporaries...
    
    // Arena automatically freed here, all at once (fast!)
}
```

### typed-arena for Homogeneous Allocations

```rust
use typed_arena::Arena;

struct Node<'a> {
    value: i32,
    children: Vec<&'a Node<'a>>,
}

fn build_tree(data: &[i32]) -> &Node {
    let arena = Arena::new();
    
    // All nodes allocated from same arena
    let root = arena.alloc(Node { value: data[0], children: vec![] });
    // Build tree...
    
    root
}
```

## Avoiding Allocations

### Return References When Possible

```rust
// BAD: Always allocates
fn get_name(&self) -> String {
    self.name.clone()
}

// GOOD: No allocation
fn get_name(&self) -> &str {
    &self.name
}

// GOOD: Conditional allocation
fn get_display_name(&self) -> Cow<str> {
    if self.nickname.is_some() {
        Cow::Borrowed(self.nickname.as_ref().unwrap())
    } else {
        Cow::Owned(format!("{} {}", self.first, self.last))
    }
}
```

### Use Slices Instead of Owned Collections

```rust
// BAD: Caller must allocate
fn process(data: Vec<u8>) -> Vec<u8>

// GOOD: Works with any contiguous data
fn process(data: &[u8]) -> Vec<u8>

// BETTER: If output size is known or bounded
fn process_into(data: &[u8], output: &mut Vec<u8>)
```

### Avoid format! in Hot Paths

```rust
// BAD: Always allocates
fn log_value(x: i32) {
    println!("{}", format!("Value: {}", x));
}

// GOOD: No intermediate allocation
fn log_value(x: i32) {
    println!("Value: {}", x);
}

// GOOD: Use write! for building strings
use std::fmt::Write;
fn build_output(items: &[Item], buf: &mut String) {
    for item in items {
        write!(buf, "{}: {}\n", item.name, item.value).unwrap();
    }
}
```

## Measuring Allocations

### dhat-rs for Heap Profiling

```rust
#[cfg(feature = "dhat-heap")]
#[global_allocator]
static ALLOC: dhat::Alloc = dhat::Alloc;

fn main() {
    #[cfg(feature = "dhat-heap")]
    let _profiler = dhat::Profiler::new_heap();
    
    // Your code here...
    
    // On drop, prints allocation statistics
}
```

### Custom Counting Allocator

```rust
use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering};

static ALLOC_COUNT: AtomicUsize = AtomicUsize::new(0);
static ALLOC_BYTES: AtomicUsize = AtomicUsize::new(0);

struct CountingAlloc;

unsafe impl GlobalAlloc for CountingAlloc {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        ALLOC_COUNT.fetch_add(1, Ordering::Relaxed);
        ALLOC_BYTES.fetch_add(layout.size(), Ordering::Relaxed);
        System.alloc(layout)
    }
    
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        System.dealloc(ptr, layout)
    }
}

#[global_allocator]
static GLOBAL: CountingAlloc = CountingAlloc;
```

## Alternative Allocators

### jemalloc (Linux/macOS)

```toml
[dependencies]
tikv-jemallocator = "0.5"
```

```rust
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
```

### mimalloc (Cross-platform)

```toml
[dependencies]
mimalloc = "0.1"
```

```rust
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;
```

### Choosing an Allocator

| Allocator | Best For | Notes |
|-----------|----------|-------|
| System | Default, compatibility | Platform-dependent performance |
| jemalloc | Multi-threaded, large allocs | Linux/macOS only, larger binary |
| mimalloc | General purpose | Good balance, cross-platform |
| snmalloc | Security-critical | Memory safety features |
