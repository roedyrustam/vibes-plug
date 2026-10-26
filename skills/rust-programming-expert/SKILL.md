---
name: rust-programming-expert
description: "Rust 2024 / v1.88+ memory safety, async Axum, and zero-cost patterns / Pemrograman Rust modern: async Axum, SQLx, dan performa tinggi."
author: "Roedy Rustam"
version: "4.4.2"

---

# Rust Programming Expert (2024 Edition / v1.88+)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Systems, Desktop & WASM**: `tauri-expert` (desktop native IPC), `wasm-edge-computing-expert`, and `ephemeral-wasm-sandbox-executor` for safe in-memory sandboxing and edge execution.
- **Backend & APIs**: `api-design-expert` (Axum 0.8 REST & tonic gRPC), `database-orm-expert` (async SQLx & SeaORM), and `fullstack-expert` for polyglot services.
- **Quality & Testing**: `autonomous-tdd-debugger`, `e2e-testing-expert`, and `anti-slop` for executing `cargo test`, compile-time SQL verification, and zero-panic error handling (`Result<T, E>` without lazy `.unwrap()`).
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 4: Backend & APIs).

### Description
Expert-level Rust development for building memory-safe, high-performance systems, APIs, CLI tools, and WebAssembly. Covers the **Rust 2024 edition**, the **Grounded Permissions Model of Ownership (Brown University Framework)**, async/await with Tokio, Axum 0.8 web framework, SQLx for async database access, and modern Rust idioms.

### Trigger Conditions
- Writing systems-level code requiring memory safety and zero-cost abstractions.
- Solving borrow-checker, lifetime, or aliasing conflicts using flow-sensitive permissions.
- Building high-performance HTTP APIs with **Axum 0.8**.
- Implementing async services with **Tokio** runtime.
- Interacting with databases using **SQLx** or **SeaORM**.
- Building CLI tools with **Clap v4**.
- Compiling to **WebAssembly (WASM)** for browser or edge deployment.
- Writing Rust for **Tauri v2** desktop application backends.

---

### 1. The Grounded Ownership & Permissions Model (Brown University Framework)

Based on empirical cognitive research by Brown University's Cognitive Engineering Lab (*OOPSLA 2023/2024: "A Grounded Conceptual Model for Ownership Types in Rust"*), Rust's borrow checker evaluates programs through **flow-sensitive permissions on paths ($\pi$)**:

```
Path (π) Permissions:
├── Read  (R): Permission to read or copy data from a path
├── Write (W): Permission to mutate data in-place
├── Own   (O): Permission to move data or drop the allocation
└── Flow  (F): Permission to return a reference or pass it out of scope
```

#### Permission Transitions Across Lifecycles:
| Operation | Path `x` (Lender) | Reference `y` (Borrower) | Dereference `*y` |
| :--- | :--- | :--- | :--- |
| `let mut x = ...;` | Initialized: `{R, W, O}` | — | — |
| `let y = &x;` | Loses `W, O` ➔ `{R}` | `{R, O}` | `{R}` |
| `let y = &mut x;` | Loses `R, W, O` ➔ `{}` (Quarantined) | `{R, O}` | `{R, W}` |
| Last use of `y` (NLL) | Restores `{R, W, O}` | Dropped | Inactive |

#### The 4 Grounded Strategies for Resolving Borrow-Check Errors:
1. **Copy vs Clone vs Borrow**: Distinguish stack-only `Copy` types from heap types. Pass borrowed slices (`&str`, `&[T]`) rather than calling `.clone()` unless independent ownership is semantically required.
2. **Mutate In-Place vs Reassignment**: Avoid passing and returning owned values (`fn process(s: String) -> String`) when passing `&mut String` preserves caller permissions without reallocation.
3. **Disjoint Splitting (`split_at_mut`)**: The compiler treats `slice[0]` and `slice[1]` as sharing the root path `slice`. Use safe abstractions like `slice.split_at_mut(mid)` to borrow distinct halves mutably in parallel.
4. **Controlled Interior Mutability**:
   - Single-threaded: `Cell<T>` (for `Copy` types) or `RefCell<T>` (dynamic runtime borrow checks).
   - Multi-threaded: `Arc<RwLock<T>>` for read-heavy shared data, or `Arc<Mutex<T>>` for mutual exclusion.

```rust
// Practical Demonstration of Flow-Sensitive Permissions & Disjoint Borrowing
pub fn demonstrate_grounded_ownership() {
    // 1. Initial Path has {R, W, O}
    let mut numbers = vec![10, 20, 30, 40, 50];

    // 2. Disjoint Mutable Slicing (avoiding whole-collection borrow quarantine)
    let (left, right) = numbers.split_at_mut(2);
    // left: &mut [10, 20], right: &mut [30, 40, 50]
    left[0] += 5;
    right[0] *= 2;

    // 3. After last use of left/right, numbers restores {R, W, O}
    println!("Updated numbers: {:?}", numbers);

    // 4. Safe Thread-Safe Interior Mutability
    use std::sync::Arc;
    use tokio::sync::RwLock;

    let shared_state = Arc::new(RwLock::new(vec!["rust".to_string()]));
    let state_clone = Arc::clone(&shared_state);

    tokio::spawn(async move {
        let mut lock = state_clone.write().await;
        lock.push("permissions".to_string());
    });
}
```

---

### 2. Rust 2024 Edition Highlights
The Rust 2024 edition (stabilized in 1.85) introduces:
- **`gen` blocks**: Generators for lazy sequence production.
- **Lifetime capture rules**: More precise lifetime inference in `impl Trait`.
- **Unsafe extern blocks**: Clearer unsafe boundary declarations.
- **`if let` chains**: `if let Some(x) = opt && x > 0` now works cleanly.
- **`async fn` in traits**: Now stable — no more `async-trait` macro needed.

#### Async `fn` in Traits (Stable in Rust 2024)
```rust
// No longer need #[async_trait] macro!
trait DataStore {
    async fn get(&self, id: &str) -> Result<Data, Error>;
    async fn set(&self, id: &str, data: Data) -> Result<(), Error>;
}

impl DataStore for PostgresStore {
    async fn get(&self, id: &str) -> Result<Data, Error> {
        sqlx::query_as("SELECT * FROM data WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(Into::into)
    }
    async fn set(&self, id: &str, data: Data) -> Result<(), Error> {
        sqlx::query("INSERT INTO data (id, value) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET value = $2")
            .bind(id)
            .bind(&data.value)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
```

---

### 3. Axum 0.8 — HTTP API Framework
```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use sqlx::PgPool;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[derive(Serialize, Deserialize)]
struct User {
    id: String,
    name: String,
    email: String,
}

async fn get_user(
    Path(user_id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<User>, StatusCode> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", user_id)
        .fetch_optional(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    Ok(Json(user))
}

#[tokio::main]
async fn main() {
    let db = PgPool::connect(&std::env::var("DATABASE_URL").unwrap())
        .await
        .expect("Failed to connect to database");

    let state = AppState { db };

    let app = Router::new()
        .route("/users/:id", get(get_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Listening on :8080");
    axum::serve(listener, app).await.unwrap();
}
```

---

### 4. SQLx — Compile-Time Verified SQL
```rust
// Compile-time SQL checking (requires DATABASE_URL at build time)
let users = sqlx::query_as!(
    User,
    r#"SELECT id, name, email FROM users WHERE created_at > $1 ORDER BY created_at DESC LIMIT $2"#,
    since,
    limit as i64
)
.fetch_all(&pool)
.await?;
```

---

### 5. Error Handling — thiserror + anyhow
```rust
use thiserror::Error;

// Library errors: use thiserror for typed errors
#[derive(Debug, Error)]
pub enum AppError {
    #[error("User not found: {id}")]
    UserNotFound { id: String },
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Validation failed: {message}")]
    Validation { message: String },
}

// Application code: use anyhow for ergonomic error propagation
use anyhow::{Context, Result};

fn process() -> Result<()> {
    let config = load_config().context("Failed to load configuration")?;
    let db = connect_db(&config).context("Failed to connect to database")?;
    Ok(())
}
```

---

### 6. CLI Tools with Clap v4
```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "myapp", version, about = "My CLI tool")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the server
    Serve {
        #[arg(short, long, default_value = "8080")]
        port: u16,
    },
    /// Run migrations
    Migrate,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Serve { port } => serve(port).await,
        Commands::Migrate => run_migrations().await,
    }
}
```

---

### 7. Performance Best Practices
- **Zero-cost abstractions**: Use iterators (`map`, `filter`, `collect`) — compiled to the same code as hand-written loops.
- **Avoid unnecessary cloning**: Use references (`&T`) and lifetimes where possible.
- **`Arc<T>` for shared state**: Use `Arc<Mutex<T>>` or `Arc<RwLock<T>>` for shared mutable state across threads.
- **SIMD**: Use `std::simd` (stable in 1.88) for data-parallel operations.
- **Profile before optimizing**: Use `cargo flamegraph` or `perf` to find actual bottlenecks.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rust-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Sistem, Desktop & WASM**: `tauri-expert` (IPC aplikasi desktop native), `wasm-edge-computing-expert`, dan `ephemeral-wasm-sandbox-executor` untuk eksekusi WASM efemeral dan komputasi edge.
- **Backend & API**: `api-design-expert` (Axum 0.8 REST & tonic gRPC), `database-orm-expert` (async SQLx & SeaORM), dan `fullstack-expert` untuk arsitektur polyglot.
- **Kualitas & Pengujian**: `autonomous-tdd-debugger`, `e2e-testing-expert`, dan `anti-slop` untuk eksekusi `cargo test`, verifikasi SQL saat kompilasi, dan penanganan error tanpa panic (`Result<T, E>` tanpa unwrap ceroboh).
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4: Backend & APIs).

### Deskripsi
Pengembangan Rust tingkat ahli untuk membangun sistem, API, CLI tool, dan WebAssembly yang aman di memori dan berkinerja tinggi. Mencakup **edisi Rust 2024**, **Model Konseptual Ownership & Permissions (Framework Brown University)**, async/await dengan Tokio, framework web Axum 0.8, SQLx untuk akses database async, dan idiom Rust modern.

### Kondisi Pemicu
- Menulis kode sistem yang membutuhkan keamanan memori dan zero-cost abstraction.
- Memecahkan konflik borrow-checker, lifetime, atau aliasing menggunakan izin sensitif-alur (*flow-sensitive permissions*).
- Membangun HTTP API berkinerja tinggi dengan **Axum 0.8**.
- Mengimplementasikan layanan async dengan runtime **Tokio**.
- Berinteraksi dengan database menggunakan **SQLx** atau SeaORM.
- Membangun CLI tool dengan **Clap v4**.
- Mengkompilasi ke **WebAssembly (WASM)** untuk browser atau edge.
- Menulis backend Rust untuk aplikasi desktop **Tauri v2**.

---

### 1. Model Konseptual Ownership & Permissions (Framework Brown University)

Mengadopsi riset kognitif empiris dari *Cognitive Engineering Lab* Brown University (*OOPSLA 2023/2024: "A Grounded Conceptual Model for Ownership Types in Rust"*), sistem *borrow checker* Rust dievaluasi melalui **izin sensitif-alur (flow-sensitive permissions) pada setiap path memori ($\pi$)**:

```
Izin Path (π):
├── Read  (R): Izin membaca atau menyalin data dari path
├── Write (W): Izin memutasi data langsung di tempat
├── Own   (O): Izin memindahkan (move) data atau menghapus alokasi (drop)
└── Flow  (F): Izin mengembalikan referensi atau meloloskannya ke luar scope
```

#### Transisi Izin Sepanjang Siklus Peminjaman:
| Operasi | Path `x` (Pemberi Pinjaman) | Referensi `y` (Peminjam) | Dereferensi `*y` |
| :--- | :--- | :--- | :--- |
| `let mut x = ...;` | Terinisialisasi: `{R, W, O}` | — | — |
| `let y = &x;` | Kehilangan `W, O` ➔ `{R}` | `{R, O}` | `{R}` |
| `let y = &mut x;` | Kehilangan `R, W, O` ➔ `{}` (Karantina total) | `{R, O}` | `{R, W}` |
| Penggunaan akhir `y` (NLL) | Mengembalikan `{R, W, O}` | Dihapus | Nonaktif |

#### 4 Strategi Menyelesaikan Error Borrow-Checker:
1. **Copy vs Clone vs Borrow**: Bedakan tipe `Copy` (hanya di stack) dari tipe heap. Lewatkan referensi (`&str`, `&[T]`) alih-alih memanggil `.clone()` sembarangan kecuali transfer kepemilikan memang dibutuhkan.
2. **Mutasi di Tempat vs Reasigment**: Hindari pola oper-kembali kepemilikan (`fn proses(s: String) -> String`) jika meminjam `&mut String` mempertahankan izin pemanggil tanpa alokasi ulang memori.
3. **Pemisahan Terputus (*Disjoint Splitting*)**: Kompiler memandang elemen array berbagi path induk yang sama. Gunakan abstraksi aman seperti `slice.split_at_mut(mid)` untuk memutasi dua bagian irisan secara terpisah.
4. **Interior Mutability Terkendali**:
   - Single-thread: Gunakan `Cell<T>` atau `RefCell<T>` (pemeriksaan peminjaman dinamis saat runtime).
   - Multi-thread: Gunakan `Arc<RwLock<T>>` untuk beban dominan baca, atau `Arc<Mutex<T>>` untuk proteksi mutasi bersama.

```rust
// Contoh Nyata Penerapan Permissions & Disjoint Borrowing
pub fn demonstrasi_ownership_brown() {
    let mut angka = vec![10, 20, 30, 40, 50];

    // Pemisahan irisan mutabel terputus (mencegah karantina koleksi total)
    let (kiri, kanan) = angka.split_at_mut(2);
    kiri[0] += 5;
    kanan[0] *= 2;

    // Setelah scope peminjaman selesai (NLL), path angka memulihkan izin {R, W, O}
    println!("Angka terupdate: {:?}", angka);

    // Interior mutability aman multi-thread
    use std::sync::Arc;
    use tokio::sync::RwLock;

    let state_bersama = Arc::new(RwLock::new(vec!["rust".to_string()]));
    let clone_state = Arc::clone(&state_bersama);

    tokio::spawn(async move {
        let mut kunci = clone_state.write().await;
        kunci.push("permissions".to_string());
    });
}
```

---

### 2. Sorotan Edisi Rust 2024
- **`async fn` dalam trait**: Kini stabil — tidak perlu lagi macro `#[async_trait]`.
- **`if let` chains**: `if let Some(x) = opt && x > 0` kini berfungsi secara bersih.
- **`gen` blocks**: Generator untuk produksi urutan yang malas.
- **Aturan lifetime capture**: Inferensi lifetime yang lebih presisi di `impl Trait`.

### 3. Axum 0.8 — Framework HTTP API
Gunakan Axum untuk HTTP API yang idiomatis dan berkinerja tinggi dibangun di atas Tokio. Manfaatkan extractor (`Path`, `State`, `Json`, `Query`) untuk parameter handler yang type-safe.

### 4. SQLx — SQL Terverifikasi Waktu Kompilasi
SQLx memverifikasi query SQL Anda terhadap database nyata saat kompilasi — menghilangkan seluruh kelas bug runtime.

### 5. Penanganan Error — thiserror + anyhow
- Gunakan `thiserror` untuk error bertipe di library code.
- Gunakan `anyhow` untuk propagasi error yang ergonomis di application code.

### 6. CLI Tool dengan Clap v4
Clap v4 menggunakan derive macro untuk mendefinisikan antarmuka CLI secara deklaratif — perintah, subperintah, argumen, dan flag dengan parsing bawaan.

### 7. Praktik Terbaik Performa
- Gunakan iterator (`map`, `filter`, `collect`) — dikompilasi setara dengan loop manual.
- Hindari cloning yang tidak perlu — gunakan referensi dan lifetime.
- Gunakan `Arc<Mutex<T>>` untuk state bersama yang dapat dimutasi di antara thread.
- Profiling terlebih dahulu dengan `cargo flamegraph` sebelum mengoptimalkan.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rust-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
