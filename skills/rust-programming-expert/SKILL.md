---
name: rust-programming-expert
description: "Expert-level skill for Rust programming (Rust 2024 / v1.85+). Covers memory safety (ownership/lifetimes), async programming (Tokio, async closures), API backends (Axum, SQLx), CLI development (Clap, Serde), unsafe safety, optimization, and Cargo profiling."
author: "Roedy Rustam"
---

# Rust Programming Expert

## Deskripsi
Expert-level guidance for writing high-performance, robust, and memory-safe systems applications using **Rust 2024 (v1.85+)**. This skill outlines advanced practices in ownership, lifetimes, error design, async architectures, backend development, performance tuning, and idiomatic ecosystem patterns.

---

## Kondisi Pemicu

- Use when bootstrapping or maintaining a production Rust crate, application, or workspace.
- Use when designing data models involving complex lifetimes, smart pointers (`Arc`, `Rc`, `RefCell`), or zero-copy abstractions (`Cow`).
- Use when building high-concurrency async services with **Tokio** and **Axum**.
- Use when interacting with databases safely using compile-time checked SQL with **SQLx**.
- Use when crafting modern CLI utilities using **Clap** and **Serde**.
- Use when migrating or upgrading an existing Rust codebase to the **Rust 2024 Edition**.
- Use when profiling, optimizing, or debugging compile times, memory footprints, or runtime performance.

---

## Core Architecture & Rust 2024 Edition

Rust 2024 (stabilized in Rust v1.85) enhances language ergonomics, strengthens safety invariants, and introduces native async enhancements:

| Feature Area | Rust 2024 Upgrade | Best Practice / Modern Pattern |
|---|---|---|
| **Async Closures** | Stable `async || {}` & `AsyncFn` traits | Use for async stream adapters or direct closure-based async event handlers. |
| **RPIT Lifetimes** | RPIT (`impl Trait` in return position) captures all in-scope lifetimes by default | Use explicit `use<'a, T>` syntax if you want to restrict lifetime capturing. |
| **Unsafe Extern** | `extern` blocks and specific attributes (`no_mangle`) now require the `unsafe` keyword | Explicitly document safety invariants of external dynamic library interfaces. |
| **Prelude Additions** | `Future` and `IntoFuture` are now imported automatically | Stop importing `std::future::Future` manually. |
| **Temporary Scopes** | Improved scopes for temporaries in `if let` blocks | Avoid manual block bindings to extend temporary value lifetimes. |

---

## Language Essentials & Memory Safety

Memory safety in Rust is guaranteed at compile time through the ownership system. Implement these structural guidelines:

### 1. The Ownership & Borrowing Mental Model
- **Ownership**: Each value has a single owner. When the owner goes out of scope, the value is dropped.
- **Borrowing**:
  - You can have any number of immutable references (`&T`) *OR*
  - Exactly one active mutable reference (`&mut T`) to a value at any given time.
- **Lifetimes**: Ensure that references do not outlive the data they point to.

### 2. Lifetimes & Smart Pointers
- Avoid placing references (`&T`) in struct definitions unless the struct is a short-lived view or helper. Prefer owned types (`String`, `Vec<T>`) or smart pointers (`Arc<T>`) for shared ownership.
- Use `Arc<T>` (Thread-Safe Shared Reference) and `Mutex<T>` (Mutual Exclusion) or `RwLock<T>` (Read-Write Lock) for multi-threaded state sharing.
- Use `Rc<T>` and `RefCell<T>` only for single-threaded graph nodes or interior mutability where thread safety is not required.

#### Example: Idiomatic Safe State Management
```rust
use std::sync::{Arc, RwLock};

#[derive(Debug, Clone)]
pub struct AppState {
    inner: Arc<RwLock<SharedData>>,
}

#[derive(Debug)]
struct SharedData {
    pub connections_count: u32,
    pub active_users: Vec<String>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(SharedData {
                connections_count: 0,
                active_users: Vec::new(),
            })),
        }
    }

    pub fn add_user(&self, username: String) -> Result<(), &'static str> {
        let mut data = self.inner.write().map_err(|_| "poisoned_lock")?;
        data.connections_count += 1;
        data.active_users.push(username);
        Ok(())
    }

    pub fn get_user_count(&self) -> Result<u32, &'static str> {
        let data = self.inner.read().map_err(|_| "poisoned_lock")?;
        Ok(data.connections_count)
    }
}
```

---

## Idiomatic Error Handling

Rust does not have traditional exceptions. Instead, it utilizes the `Result<T, E>` and `Option<T>` monads.

### Guidelines for Error Design
1. **Application-level Errors**: Use `anyhow` for rapid scripting or high-level application contexts where stack traces and arbitrary error wrapping are needed.
2. **Library-level Errors**: Use `thiserror` to define precise, structured, and descriptive domain error enums that users can match against.
3. **The `?` Operator**: Use the `?` operator to propagate errors up the call stack.

#### Example: library-level errors with `thiserror`
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("Database connection failed: {0}")]
    ConnectionFailed(String),

    #[error("Entity '{0}' not found with ID: {1}")]
    NotFound(String, i64),

    #[error("Unique constraint violation on field: {0}")]
    ConstraintViolation(String),

    #[error("Unknown database error occurred")]
    Unknown(#[from] sqlx::Error),
}
```

#### Example: application-level errors with `anyhow`
```rust
use anyhow::{Context, Result};
use std::fs::File;
use std::io::Read;

fn read_config_file(path: &str) -> Result<String> {
    let mut file = File::open(path)
        .with_context(|| format!("Failed to open config file at: {}", path))?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .with_context(|| "Failed to read config file contents into memory")?;
        
    Ok(contents)
}
```

---

## Asynchronous Programming (Rust 2024 + Tokio)

Asynchronous Rust is powered by external runtimes. The production standard is **Tokio**.

### Best Practices in Async Rust
- **Prefer Tokio Tasks for I/O**: Use `tokio::spawn` to run light, concurrent tasks that perform asynchronous I/O.
- **Do NOT Block the Async Runtime**: Never run CPU-bound work or synchronous block-I/O (like `std::fs::File` or synchronous locks) directly inside an async worker thread.
  - For long CPU-heavy processing, use `tokio::task::spawn_blocking`.
- **Use Async Closures (Rust 2024)**: Define dynamic async mappings cleanly using the native `async ||` closure syntax.

#### Example: Non-Blocking Task Spawning
```rust
use tokio::task;

async fn process_incoming_job(job_id: u64) {
    // 1. Asynchronous I/O (safe for the reactor thread)
    tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;

    // 2. Heavy CPU calculation (must offload to avoid starving the executor)
    let computation_result = task::spawn_blocking(move || {
        // Perform heavy cryptography or matrix math here
        let mut sum: u64 = 0;
        for i in 0..10_000_000 {
            sum = sum.wrapping_add(i ^ job_id);
        }
        sum
    })
    .await
    .expect("Worker thread panicked");

    println!("Job {} computed result: {}", job_id, computation_result);
}
```

---

## Production Ecosystem Integrations

### 1. Axum + SQLx (Web API Stack)
**Axum** is the leading async web framework from the Tokio team. Combined with **SQLx**, it provides a type-safe, compile-time checked database interaction layer.

#### Example: Production API Core (`src/main.rs`)
```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::net::SocketAddr;
use std::sync::Arc;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: i32,
    username: String,
    email: String,
}

#[derive(Deserialize)]
pub struct CreateUserDto {
    username: String,
    email: String,
}

pub struct ApiState {
    db_pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // Connect to PostgreSQL database using SQLx pooler
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost/my_db".to_string());
    
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(&db_url)
        .await?;

    let state = Arc::new(ApiState { db_pool: pool });

    // Scaffolding standard router with state
    let app = Router::new()
        .route("/users/:id", get(get_user_handler))
        .route("/users", post(create_user_handler))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Axum server running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

// Extractor Pattern
async fn get_user_handler(
    State(state): State<Arc<ApiState>>,
    Path(id): Path<i32>,
) -> Result<Json<User>, (StatusCode, String)> {
    // Compile-time verified query!
    let user = sqlx::query_as!(
        User,
        "SELECT id, username, email FROM users WHERE id = $1",
        id
    )
    .fetch_optional(&state.db_pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or_else(|| (StatusCode::NOT_FOUND, "User not found".to_string()))?;

    Ok(Json(user))
}

async fn create_user_handler(
    State(state): State<Arc<ApiState>>,
    Json(payload): Json<CreateUserDto>,
) -> Result<(StatusCode, Json<User>), (StatusCode, String)> {
    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, username, email",
        payload.username,
        payload.email
    )
    .fetch_one(&state.db_pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(user)))
}
```

---

### 2. Clap + Serde (CLI Stack)
**Clap v4** provides a declarative macro-based parser for command-line arguments. **Serde** handles seamless serialization/deserialization.

#### Example: CLI Setup
```rust
use clap::{Parser, Subcommand};
use serde::{Deserialize, Serialize};

#[derive(Parser, Debug)]
#[command(name = "vibes-cli", author = "Roedy", version = "1.0", about = "CLI Tool")]
pub struct Cli {
    #[arg(short, long, global = true, help = "Path to config file")]
    pub config: Option<String>,

    #[arg(short, long, action = clap::ArgAction::SetTrue, help = "Enable verbose logs")]
    pub verbose: bool,

    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    #[command(about = "Analyze code file for bugs")]
    Analyze {
        #[arg(short, long, help = "Absolute target path")]
        path: String,
        
        #[arg(long, default_value = "json")]
        format: String,
    },
    #[command(about = "Initialize workspace config")]
    Init,
}
```

---

## Optimization & Unsafe Code

Rust is chosen for predictable, raw hardware performance. Ensure you implement performance best practices:

### 1. Avoid Heap Allocations where possible
- Use `&str` instead of `String` for read-only variables.
- Use `Cow<'a, str>` (Copy-On-Write) when a variable is occasionally mutated but is usually read-only.
- Use slices `&[T]` instead of vectors `&Vec<T>` as function arguments to enable the compiler to perform bounds-check optimizations.

### 2. Configure Cargo Release Profile (`Cargo.toml`)
Optimize compilation artifacts for production deployment:
```toml
[profile.release]
opt-level = 3          # Max optimization
lto = true             # Enable Link-Time Optimization
codegen-units = 1      # Maximize compiler optimization passes
panic = "abort"        # Strip panic unwinding machinery to reduce binary size
strip = true           # Automatically strip symbols/debug info
```

### 3. Sound Unsafe Practices
- **Rules of Unsafe**: Only use `unsafe` to call C bindings, write custom lockless data structures, or interact directly with raw pointers.
- Always include a `// SAFETY:` block explaining exactly why the invariant is soundly guaranteed.

```rust
// SAFETY: We must guarantee that `ptr` points to a valid, initialized u32
// memory address and is aligned properly.
unsafe {
    let value = std::ptr::read_volatile(ptr);
    // ...
}
```

---

## Testing & Quality Control

Verify code validity using Rust's integrated test runner.

### 1. Structure Tests Correctly
- Keep **unit tests** in the same file as the production code using the `#[cfg(test)]` module pattern.
- Keep **integration tests** in the `/tests` root subdirectory, referencing only public crate APIs.

#### Example: Idiomatic Test Block
```rust
pub fn calculate_sum(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_sum() {
        assert_eq!(calculate_sum(2, 2), 4);
    }
}
```

### 2. Linting & Formatting Quality Checks
Run these tools routinely before staging code:
```bash
# Verify formatting consistency
cargo fmt --all -- --check

# Run rigorous compiler linting with Clippy
cargo clippy --all-targets --all-features -- -D warnings
```

---

## Troubleshooting & Common Gotchas

### 1. Lifetimes Mismatch (Borrow Checker)
- **Problem**: Compiler complains that "borrowed value does not live long enough".
- **Solution**: Check if you are returning a reference to a local variable created inside the function. Always return owned data (`String`, `Vec<T>`) or adjust the function bounds so the output lifetime matches the input borrow lifetime (`fn parse<'a>(&'a self) -> &'a str`).

### 2. Send / Sync Boundary Failures
- **Problem**: In async functions, compiler throws `std::marker::Send` or `std::marker::Sync` compile errors on a spawn block.
- **Solution**: An async block across an `.await` boundary must be thread-safe. Ensure that all variables alive across `.await` points are `Send`. Avoid holding standard `std::sync::MutexGuard` across an `.await` call; use `tokio::sync::Mutex` instead, or drop the guard beforehand.

### 3. Cargo Workspace Locking
- **Problem**: `blocking waiting for file lock on package cache` or target directory lock.
- **Solution**: Make sure no parallel build or IDE task is locked. Run `rm -f target/.rustc_info.json` or clear lock files if a zombie task was terminated abruptly.
