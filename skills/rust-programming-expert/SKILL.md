---
name: rust-programming-expert
description: "Rust 2024 / v1.88+ memory safety, Brown Grounded Ownership & Permissions, async Axum, and zero-cost patterns / Pemrograman Rust modern: sistem izin kepemilikan Brown, async Axum, dan performa tinggi."
author: "Roedy Rustam"
version: "4.7.0"

---

# Rust Programming Expert (2024 Edition / v1.88+)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Systems, Desktop & WASM**: `tauri-expert` (desktop native IPC & asynchronous command handlers), `wasm-edge-computing-expert`, and `ephemeral-wasm-sandbox-executor` for safe in-memory sandboxing and zero-copy linear memory boundaries.
- **Backend & APIs**: `api-design-expert` (Axum 0.8 REST & tonic gRPC), `database-orm-expert` (async SQLx & SeaORM), and `fullstack-expert` for polyglot systems.
- **Quality & Testing**: `autonomous-tdd-debugger`, `property-mutation-testing-expert`, `e2e-testing-expert`, and `anti-slop` for executing `cargo test`, compile-time SQL verification, and zero-panic error handling (`Result<T, E>` without lazy `.unwrap()`).
- **Formal Verification**: `formal-spec-z3-verifier` and `formal-theorem-verifier-lean4` for proving state invariants, type-state machine completeness, and boundary safety.
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` (Phase 4: Backend & APIs).

### Description
Expert-level Rust development for building memory-safe, ultra-high-performance systems, CLI tools, async microservices, and WebAssembly modules. Synthesizes the complete canonical foundation of **The Rust Programming Language (The Book)** with the empirical cognitive research of the **Brown University Interactive Rust Book (Grounded Conceptual Model of Ownership & Flow-Sensitive Permissions)**, the **Rust 2024 Edition (v1.88+)**, the **Tokio async runtime**, the **Axum 0.8 web framework**, and compile-time verified **SQLx**.

### Trigger Conditions
- Writing systems-level or network services requiring memory safety and zero-cost abstractions.
- Diagnosing and resolving borrow-checker, lifetime, or aliasing conflicts using Brown University's flow-sensitive permission model.
- Implementing compile-time verified state transitions using the **Type-State Pattern**.
- Building high-performance, asynchronous REST or WebSocket HTTP services with **Axum 0.8**.
- Architecting async multithreaded pipelines with the **Tokio** runtime without deadlocks.
- Designing type-safe database access layers with compile-time verified SQL using **SQLx**.
- Developing production CLI utilities using declarative derive macros in **Clap v4**.
- Writing native desktop backend commands for **Tauri v2** or compiling portable modules to **WebAssembly (WASM)**.

---

### 1. The Grounded Ownership & Permissions Model (Brown University Framework)

Based on empirical cognitive research by Brown University's Cognitive Engineering Lab (*OOPSLA: "A Grounded Conceptual Model for Ownership Types in Rust"*), Rust's borrow checker evaluates programs through **flow-sensitive permissions on paths ($\pi$)**:

```
Path (π) Memory Expression Hierarchy:
├── Variable Path:       x
├── Dereference Path:   *ptr
├── Struct Field Path:  record.field
└── Slice/Array Path:   slice[i]

Flow-Sensitive Permissions:
├── Read  (R): Permission to read or copy data from a path
├── Write (W): Permission to mutate data in-place
├── Own   (O): Permission to move data or drop the allocation
└── Flow  (F): Permission to return a reference or pass it out of function scope
```

#### Memory Pointer Topology & Stack/Heap Layout:
```
STACK FRAME (Local Variables)                    HEAP ALLOCATION
┌─────────────────────────────────┐             ┌─────────────────────────┐
│ Path 's': String                │             │ Index: 0  1  2  3  4    │
│ ├── ptr: 0x55aa ───────────────┼────────────►│ Bytes: [h, e, l, l, o]  │
│ ├── len: 5                      │             │ Capacity: 8             │
│ └── cap: 8                      │             └─────────────────────────┘
├─────────────────────────────────┤
│ Path 'r1': &String (Shared)     │
│ └── ptr: points to stack 's'    │ ───► Lender 's' loses {W, O}, retains {R}
└─────────────────────────────────┘
```

#### Permission Transitions Across Lifecycles:
| Operation | Path `x` (Lender) | Reference `y` (Borrower) | Dereference `*y` |
| :--- | :--- | :--- | :--- |
| `let mut x = ...;` | Initialized: `{R, W, O}` | — | — |
| `let y = &x;` (Shared Borrow) | Loses `W, O` ➔ `{R}` | `{R, O}` | `{R}` |
| `let y = &mut x;` (Mutable Borrow) | Loses `R, W, O` ➔ `{}` (Quarantined) | `{R, O}` | `{R, W}` |
| `let z = &mut *y;` (Reborrow) | Remains `{}` | Loses `R, W, O` ➔ `{}` | Loses `{R, W}` ➔ `{}` |
| Last use of `z` / `y` (NLL) | Restores `{R, W, O}` | Dropped | Inactive |

---

### 2. Brown's 4-Way Decision Matrix for Borrow-Checker Diagnostics

When the Rust compiler flags an ownership or borrow conflict, empirical research shows that guessing fixes leads to spaghetti lifetimes or unnecessary heap cloning. Apply this systematic 4-tier decision matrix:

```
                      Borrow Checker Error Detected
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   Case 1: Quarantined       Case 2: Mutation           Case 3: Disjoint
   Path Access               During Traversal           Path Splitting
   (Accessing x while        (vec.push while            (v[0] & v[1]
    borrowed)                 iterating &vec)            borrow conflict)
          │                         │                         │
          ▼                         ▼                         ▼
   Shorten borrow live       Two-phase execution:       Use slice.split_at_mut
   range or clone if         collect indices/keys       or field-level struct
   independent lifecycle     first, then mutate         destructuring
```

#### Detailed Remediation Strategies:
1. **Case 1: Reading/Writing a Quarantined Path**:
   - *Problem*: Calling a method on `x` while an active borrow `y = &x` or `y = &mut x` is still live.
   - *Fix*: Move the operation on `x` after the last usage of `y` (leveraging Non-Lexical Lifetimes), or clone the needed field before borrowing if concurrent mutation is necessary.
2. **Case 2: Mutating During Collection Traversal (Iterator Invalidation)**:
   - *Problem*: Adding or removing elements from a vector while looping over its references (`for item in &vec { vec.push(...) }`).
   - *Fix*: Decouple into two phases. Phase A: collect indices or filtered values into a local buffer. Phase B: iterate over the buffer to perform modifications, or use `retain()` / `retain_mut()`.
3. **Case 3: Disjoint Path Splitting**:
   - *Problem*: The borrow checker tracks struct fields as disjoint paths (`&mut s.field_a` and `&mut s.field_b` are valid simultaneously), but treats collection indexing (`v[0]` and `v[1]`) as the shared root path `v[*]`.
   - *Fix*: Use safe std abstractions: `slice.split_at_mut(mid)`, `chunks_exact_mut(n)`, or temporary value extraction using `std::mem::take(&mut val)` or `Option::take()`.
4. **Case 4: Flow Permissions & Dangling References**:
   - *Problem*: Attempting to return a reference to a local stack-allocated variable (`fn get_data() -> &str`).
   - *Fix*: Return an owned type (`String`, `Vec<T>`) to transfer ownership, or accept an input reference with an explicit lifetime `'a` that outlives the function call.

---

### 3. The 5 Common Rust Misconceptions (Brown Empirical Studies)

1. **Misconception: Lifetimes alter how long values live.**
   - *Reality*: Lifetimes are purely compile-time static type annotations. They inform the compiler of relationship constraints; they never extend or alter when a variable's destructor (`Drop`) runs.
2. **Misconception: Ownership belongs to variable identifiers.**
   - *Reality*: Ownership belongs to *paths* pointing to specific memory allocations. Multiple variables can point to parts of an allocation, but ownership governs the root lifecycle.
3. **Misconception: Mutation requires complete exclusivity across the whole application.**
   - *Reality*: The *Interior Mutability Pattern* allows controlled mutation behind shared `&T` references using runtime checks (`RefCell<T>`) or thread-safe atomic primitives (`Mutex<T>`, `RwLock<T>`).
4. **Misconception: The `unsafe` keyword disables the borrow checker.**
   - *Reality*: `unsafe` only unlocks five specific superpowers (e.g., dereferencing raw pointers, calling foreign C functions). The borrow checker remains fully active for all safe Rust code surrounding the unsafe block.
5. **Misconception: Calling `.clone()` is always bad and must be avoided at all costs.**
   - *Reality*: Fighting the borrow checker with tangled lifetime parameters across dozens of structs creates rigid, unmaintainable architecture. If profiling shows an allocation is negligible, cloning an identifier or handle is often the superior architectural trade-off.

---

### 4. Canonical Rust Book Principles (Chapters 1–20 Mastery)

#### Memory Layout & Zero-Cost Abstractions
Rust achieves C/C++ speed with memory safety by compiling abstractions into identical machine code:
- **`Copy` vs `Clone`**: Types implementing `Copy` undergo a bitwise stack copy with zero heap overhead (integers, floats, booleans, fixed-size arrays of `Copy`). Types implementing `Clone` require explicit, potentially heap-allocating duplication.
- **Fat Pointers**: Slices (`&str`, `&[T]`) consist of two `usize` words: pointer to data + element count. Trait objects (`&dyn Trait`, `Box<dyn Trait>`) consist of pointer to instance + pointer to virtual method table (vtable).
- **Zero-Sized Types (ZSTs)**: Marker types like unit structs `struct Empty;` consume zero bytes of memory at runtime, enabling compile-time validation without memory overhead.

#### The Type-State Pattern (Compile-Time Finite State Machine)
Encode program states into Rust's type system to make illegal state transitions physically impossible to compile:

```rust
// Type-State Pattern for an E-Commerce Order Lifecycle
pub struct Draft;
pub struct Placed {
    pub payment_reference: String,
}
pub struct Shipped {
    pub tracking_number: String,
}

pub struct Order<State> {
    pub order_id: String,
    pub items: Vec<String>,
    pub total_cents: u64,
    pub state: State,
}

impl Order<Draft> {
    pub fn new(order_id: String) -> Self {
        Order {
            order_id,
            items: Vec::new(),
            total_cents: 0,
            state: Draft,
        }
    }

    pub fn add_item(mut self, item: String, price_cents: u64) -> Self {
        self.items.push(item);
        self.total_cents += price_cents;
        self
    }

    // State Transition: Consumes Draft and returns Placed
    pub fn place_order(self, payment_reference: String) -> Order<Placed> {
        Order {
            order_id: self.order_id,
            items: self.items,
            total_cents: self.total_cents,
            state: Placed { payment_reference },
        }
    }
}

impl Order<Placed> {
    // Only a Placed order can transition to Shipped
    pub fn ship(self, tracking_number: String) -> Order<Shipped> {
        Order {
            order_id: self.order_id,
            items: self.items,
            total_cents: self.total_cents,
            state: Shipped { tracking_number },
        }
    }
}
```

#### Smart Pointers & Interior Mutability Strategy
| Pointer Type | Allocation | Ownership | Thread-Safety | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `Box<T>` | Heap | Single Owner | Safe (`Send`/`Sync` if `T` is) | Recursive types, large stack data transfer |
| `Rc<T>` | Heap | Shared (Ref-Count) | Non-Thread-Safe | Graph structures, single-threaded shared nodes |
| `Arc<T>` | Heap | Shared (Atomic Ref-Count) | Thread-Safe | Shared state across Tokio tasks / OS threads |
| `RefCell<T>` | Stack/Heap | Borrow at runtime | Non-Thread-Safe | Single-threaded interior mutability |
| `Mutex<T>` | Stack/Heap | Mutual exclusion | Thread-Safe | Shared mutable state across threads |
| `RwLock<T>` | Stack/Heap | Multiple read / single write | Thread-Safe | Read-heavy concurrent caches |

#### Concurrency & The Tokio Await Rule:
> [!CRITICAL]
> **Never hold a standard `std::sync::MutexGuard` across a Tokio `.await` point!**
> Holding a non-async mutex guard across an `.await` suspends the task while keeping the OS thread locked, leading to worker starvation and deadlock. Use `tokio::sync::Mutex` or scope the lock into an isolated block that drops the guard before `.await`.

```rust
// Safe Concurrent Cache with tokio::sync::RwLock
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct ConcurrentCache {
    storage: Arc<RwLock<HashMap<String, String>>>,
}

impl ConcurrentCache {
    pub fn new() -> Self {
        Self {
            storage: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn get(&self, key: &str) -> Option<String> {
        let read_guard = self.storage.read().await;
        read_guard.get(key).cloned()
    }

    pub async fn insert(&self, key: String, value: String) {
        let mut write_guard = self.storage.write().await;
        write_guard.insert(key, value);
    }
}
```

---

### 5. Rust 2024 Edition (v1.88+) Modern Idioms

1. **`async fn` in Traits (RPITIT)**: Stable native support without the `#[async_trait]` macro box overhead.
2. **`let-else` Guard Clauses**: Eliminates deep nesting when extracting values or early returning:
   ```rust
   let Some(token) = request.headers().get("authorization") else {
       return Err(AppError::Unauthorized);
   };
   ```
3. **`if let` Chains**: Clean logical AND combinations in pattern matching:
   ```rust
   if let Some(user) = maybe_user && user.is_active && user.role == Role::Admin {
       grant_access();
   }
   ```
4. **`gen` Blocks**: Native lazy generator iterators for streaming sequences.

---

### 6. Production Blueprint: Axum 0.8 REST Service with SQLx & thiserror

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use thiserror::Error;

// 1. Structured Domain Error with thiserror
#[derive(Debug, Error)]
pub enum AppError {
    #[error("Resource not found: {0}")]
    NotFound(String),
    #[error("Database constraint violation: {0}")]
    Conflict(String),
    #[error("Internal database failure: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Invalid client request: {0}")]
    BadRequest(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg.clone()),
            AppError::Database(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error occurred".to_string(),
            ),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
        };

        let body = Json(serde_json::json!({
            "error": {
                "message": message,
                "code": status.as_u16()
            }
        }));

        (status, body).into_response()
    }
}

// 2. Data Models with Strict Serde Validation
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Account {
    pub id: String,
    pub username: String,
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateAccountPayload {
    pub username: String,
    pub email: String,
}

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

// 3. Extractor Handlers with Type Safety
pub async fn get_account_handler(
    Path(account_id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<Account>, AppError> {
    let account = sqlx::query_as!(
        Account,
        "SELECT id, username, email FROM accounts WHERE id = $1",
        account_id
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Account {} does not exist", account_id)))?;

    Ok(Json(account))
}

pub async fn create_account_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateAccountPayload>,
) -> Result<(StatusCode, Json<Account>), AppError> {
    if payload.username.trim().is_empty() {
        return Err(AppError::BadRequest("Username cannot be empty".to_string()));
    }

    let new_id = uuid::Uuid::new_v4().to_string();
    let created = sqlx::query_as!(
        Account,
        "INSERT INTO accounts (id, username, email) VALUES ($1, $2, $3) RETURNING id, username, email",
        new_id,
        payload.username,
        payload.email
    )
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(created)))
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/api/v1/accounts/:id", get(get_account_handler))
        .route("/api/v1/accounts", post(create_account_handler))
        .with_state(state)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "postgres://postgres:postgres@localhost:5432/vibe_production".to_string()
    });

    let pool = PgPoolOptions::new()
        .max_connections(25)
        .connect(&database_url)
        .await?;

    let app_state = AppState { db: pool };
    let app = create_router(app_state);

    let address = SocketAddr::from(([0, 0, 0, 0], 8080));
    let listener = tokio::net::TcpListener::bind(address).await?;
    println!("Axum 0.8 service running on http://{}", address);
    axum::serve(listener, app).await?;

    Ok(())
}
```

---

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec rust-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 65ms, zero unwrap/expect in production paths, compile-time verified SQL queries, explicit Type-State verification, zero AI slop verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Sistem, Desktop & WASM**: `tauri-expert` (IPC aplikasi desktop native & handler perintah asinkron), `wasm-edge-computing-expert`, dan `ephemeral-wasm-sandbox-executor` untuk isolasi sandbox in-memory berlatensi rendah serta batas memori linear zero-copy.
- **Backend & API**: `api-design-expert` (Axum 0.8 REST & tonic gRPC), `database-orm-expert` (async SQLx & SeaORM), dan `fullstack-expert` untuk arsitektur sistem polyglot.
- **Kualitas & Pengujian**: `autonomous-tdd-debugger`, `property-mutation-testing-expert`, `e2e-testing-expert`, dan `anti-slop` untuk eksekusi `cargo test`, verifikasi SQL saat kompilasi, dan penanganan error tanpa panic (`Result<T, E>` tanpa `.unwrap()` sembrono).
- **Verifikasi Formal**: `formal-spec-z3-verifier` dan `formal-theorem-verifier-lean4` untuk pembuktian invarian state, kelengkapan mesin type-state, dan keamanan batas memori.
- **Orkestrator Utama**: `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4: Backend & APIs).

### Deskripsi
Panduan teknis mendalam pengembangan Rust tingkat ahli untuk membangun sistem, perkakas CLI, layanan mikro asinkron, dan modul WebAssembly yang aman memori serta berkinerja tinggi. Mengintegrasikan secara komprehensif buku panduan resmi **The Rust Programming Language (The Book)** dengan riset kognitif empiris dari **Brown University Interactive Rust Book (Model Konseptual Kepemilikan & Izin Sensitif-Alur)**, edisi modern **Rust 2024 (v1.88+)**, runtime asinkron **Tokio**, framework web **Axum 0.8**, serta akses database terverifikasi waktu kompilasi **SQLx**.

### Kondisi Pemicu
- Menulis kode tingkat sistem atau layanan jaringan yang menuntut keamanan memori mutlak dan abstraksi tanpa biaya (*zero-cost abstractions*).
- Menganalisis dan menuntaskan konflik peminjaman (*borrow-checker*), masa hidup (*lifetimes*), atau aliasing menggunakan model izin Brown University.
- Menerapkan transisi state terverifikasi waktu kompilasi menggunakan **Pola Type-State**.
- Membangun layanan HTTP REST atau WebSocket berkecepatan tinggi dengan **Axum 0.8**.
- Merancang alur konkuren multithread asinkron dengan runtime **Tokio** tanpa resiko deadlock.
- Merancang lapisan akses basis data type-safe dengan SQL terverifikasi waktu kompilasi memakai **SQLx**.
- Membangun utilitas CLI produksi menggunakan derive macro deklaratif pada **Clap v4**.
- Mengembangkan backend desktop **Tauri v2** atau mengkompilasi pustaka ke **WebAssembly (WASM)**.

---

### 1. Model Konseptual Ownership & Izin (Framework Brown University)

Mengadopsi riset kognitif empiris dari Laboratorium Rekayasa Kognitif Brown University (*OOPSLA: "A Grounded Conceptual Model for Ownership Types in Rust"*), sistem pemeriksa peminjaman (*borrow checker*) Rust bekerja dengan mengevaluasi **izin sensitif-alur (flow-sensitive permissions) pada setiap path memori ($\pi$)**:

```
Hierarki Ekspresi Path Memori (π):
├── Path Variabel:       x
├── Path Dereferensi:   *ptr
├── Path Field Struct:  record.field
└── Path Irisan/Array:  slice[i]

Empat Izin Sensitif-Alur (Permissions):
├── Read  (R): Izin membaca atau menyalin data dari path
├── Write (W): Izin memutasi nilai data langsung di tempat
├── Own   (O): Izin memindahkan (move) data atau menghapus alokasi (drop)
└── Flow  (F): Izin mengembalikan referensi atau meloloskannya ke luar scope fungsi
```

#### Transisi Izin Sepanjang Siklus Hidup Peminjaman:
| Operasi | Path `x` (Pemberi Pinjaman) | Referensi `y` (Peminjam) | Dereferensi `*y` |
| :--- | :--- | :--- | :--- |
| `let mut x = ...;` | Terinisialisasi: `{R, W, O}` | — | — |
| `let y = &x;` (Pinjam Bersama) | Kehilangan `W, O` ➔ `{R}` | `{R, O}` | `{R}` |
| `let y = &mut x;` (Pinjam Eksklusif) | Kehilangan `R, W, O` ➔ `{}` (Karantina Total) | `{R, O}` | `{R, W}` |
| `let z = &mut *y;` (Reborrow) | Tetap terisolasi `{}` | Kehilangan `R, W, O` ➔ `{}` | Kehilangan `{R, W}` ➔ `{}` |
| Penggunaan Terakhir `y`/`z` (NLL) | Pulih `{R, W, O}` | Dihapus | Nonaktif |

---

### 2. Matriks Keputusan 4 Langkah Diagnostik Borrow-Checker Brown

Ketika kompiler memunculkan galat peminjaman memori, riset membuktikan bahwa mencoba-coba perubahan secara acak hanya melahirkan arsitektur kode yang rapuh. Terapkan matriks keputusan 4 cabang sistematis ini:

1. **Kasus 1: Mengakses Path yang Sedang Dikarantina**:
   - *Masalah*: Membaca atau menulis ke variabel `x` saat referensi aktif `y = &x` atau `y = &mut x` masih digunakan.
   - *Solusi*: Geser operasi pada `x` ke baris setelah pemakaian terakhir `y` (memanfaatkan Non-Lexical Lifetimes), atau salin nilai independen melalui kloning jika kedua data harus hidup bersamaan.
2. **Kasus 2: Mutasi Koleksi Saat Melakukan Penelusuran (Iterator Invalidation)**:
   - *Masalah*: Menambahkan atau menghapus elemen vektor saat sedang melakukan iterasi referensi elemennya (`for item in &vec { vec.push(...) }`).
   - *Solusi*: Pisahkan menjadi dua tahap. Tahap A: kumpulkan indeks atau nilai filter ke dalam buffer lokal. Tahap B: lakukan pembaruan pada koleksi berdasarkan isi buffer, atau gunakan metode bawaan `retain()` / `retain_mut()`.
3. **Kasus 3: Pemisahan Path Terputus (*Disjoint Path Splitting*)**:
   - *Masalah*: Borrow checker memahami bahwa field struct berbeda merupakan path independen (`&mut s.field_a` dan `&mut s.field_b` sah bersamaan), namun menganggap pengindeksan array/vektor (`v[0]` dan `v[1]`) berasal dari satu path induk bersama `v[*]`.
   - *Solusi*: Gunakan fungsi pemisah standar seperti `slice.split_at_mut(mid)`, iterator potongan `chunks_exact_mut(n)`, atau cabut nilai sementara menggunakan `std::mem::take(&mut val)` atau `Option::take()`.
4. **Kasus 4: Pelanggaran Izin Flow & Referensi Menggantung (*Dangling References*)**:
   - *Masalah*: Mencoba mengembalikan referensi dari variabel lokal yang dialokasikan di call stack fungsi.
   - *Solusi*: Kembalikan tipe owned (`String`, `Vec<T>`) agar kepemilikan dialihkan ke pemanggil, atau terima referensi input dengan parameter lifetime eksplisit `'a`.

---

### 3. Lima Miskonsepsi Utama Rust (Temuan Empiris Brown)

1. **Miskonsepsi: Lifetime memperpanjang waktu hidup variabel.**
   - *Fakta*: Lifetime hanyalah anotasi tipe saat kompilasi. Lifetime tidak pernah mengubah urutan pemanggilan destructor runtime (`Drop`).
2. **Miskonsepsi: Kepemilikan melekat pada nama variabel.**
   - *Fakta*: Kepemilikan melekat pada *path alokasi memori*. Beberapa variabel dapat merujuk ke bagian dari suatu alokasi, namun siklus hidup diatur oleh path induk.
3. **Miskonsepsi: Mutasi mengharuskan ketiadaan referensi bersama di seluruh aplikasi.**
   - *Fakta*: *Pola Interior Mutability* memungkinkan mutasi terkontrol di balik referensi bersama `&T` menggunakan pemeriksaan runtime (`RefCell<T>`) atau proteksi thread (`Mutex<T>`, `RwLock<T>`).
4. **Miskonsepsi: Blok `unsafe` menonaktifkan borrow checker.**
   - *Fakta*: Blok `unsafe` hanya membuka lima kemampuan khusus (seperti mendereferensi raw pointer). Pemeriksa peminjaman tetap aktif sepenuhnya pada seluruh kode di sekitarnya.
5. **Miskonsepsi: Memanggil `.clone()` adalah kesalahan desain yang tabu.**
   - *Fakta*: Menghindari alokasi kecil dengan memaksakan lifetime rumit pada puluhan struct menghasilkan kode yang sulit dirawat. Jika profiling membuktikan alokasi memori berada di luar jalur kritis performa, penggunaan `.clone()` sering kali merupakan keputusan arsitektur yang bijak dan terbaca.

---

### 4. Penguasaan Prinsip Utama Buku Resmi Rust (Bab 1–20)

#### Pola Type-State (Mesin State Finite Waktu Kompilasi)
Cegah kemungkinan eksekusi alur data yang tidak valid dengan menyematkan state ke dalam sistem tipe Rust:

```rust
// Pola Type-State untuk Siklus Transaksi Pembayaran
pub struct Baru;
pub struct Terotorisasi {
    pub token_verifikasi: String,
}
pub struct Selesai {
    pub nomor_resi: String,
}

pub struct Transaksi<State> {
    pub id_transaksi: String,
    pub nominal_idr: u64,
    pub state: State,
}

impl Transaksi<Baru> {
    pub fn buat(id_transaksi: String, nominal_idr: u64) -> Self {
        Transaksi {
            id_transaksi,
            nominal_idr,
            state: Baru,
        }
    }

    // Transisi State: Mengonsumsi Baru dan menghasilkan Terotorisasi
    pub fn otorisasi(self, token_verifikasi: String) -> Transaksi<Terotorisasi> {
        Transaksi {
            id_transaksi: self.id_transaksi,
            nominal_idr: self.nominal_idr,
            state: Terotorisasi { token_verifikasi },
        }
    }
}

impl Transaksi<Terotorisasi> {
    // Hanya transaksi yang telah Terotorisasi yang dapat diselesaikan
    pub fn selesaikan(self, nomor_resi: String) -> Transaksi<Selesai> {
        Transaksi {
            id_transaksi: self.id_transaksi,
            nominal_idr: self.nominal_idr,
            state: Selesai { nomor_resi },
        }
    }
}
```

#### Aturan Emas Mutex & Concurrency Tokio:
> [!CRITICAL]
> **Dilarang menahan `std::sync::MutexGuard` melintasi titik `.await` pada runtime Tokio!**
> Menahan lock non-asinkron saat task disuspensi akan mengunci thread pekerja sistem operasi dan memicu deadlock instan. Gunakan `tokio::sync::Mutex` atau batasi cakupan lock dalam scope kurung kurawal terpisah agar guard terlepas sebelum `.await`.

---

### 5. Idiom Modern Edisi Rust 2024 (v1.88+)

- **`async fn` dalam Trait (RPITIT)**: Deklarasi trait asinkron langsung tanpa pembungkus macro eksternal.
- **Klausul Pengawal `let-else`**: Menghilangkan struktur if-else bertingkat saat mengekstrak nilai:
  ```rust
  let Some(sesi) = token_opsional else {
      return Err(AppError::Unauthorized);
  };
  ```
- **Rantai Pola `if let`**: Menggabungkan pemeriksaan pola dengan operator logika `&&`:
  ```rust
  if let Some(profil) = data_pengguna && profil.terverifikasi && profil.saldo > 0 {
      proses_pembayaran();
  }
  ```

---

### 6. Blueprint Produksi: Layanan API Axum 0.8 & SQLx

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Data tidak ditemukan: {0}")]
    NotFound(String),
    #[error("Kesalahan internal basis data: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Permintaan klien tidak valid: {0}")]
    BadRequest(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, pesan) = match &self {
            AppError::NotFound(m) => (StatusCode::NOT_FOUND, m.clone()),
            AppError::Database(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Terjadi kendala pada server basis data".to_string(),
            ),
            AppError::BadRequest(m) => (StatusCode::BAD_REQUEST, m.clone()),
        };

        let response_body = Json(serde_json::json!({
            "status": "error",
            "pesan": pesan,
            "kode_http": status.as_u16()
        }));

        (status, response_body).into_response()
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ProfilPengguna {
    pub id: String,
    pub nama: String,
    pub surel: String,
}

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

pub async fn ambil_pengguna_handler(
    Path(id_pengguna): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<ProfilPengguna>, AppError> {
    let pengguna = sqlx::query_as!(
        ProfilPengguna,
        "SELECT id, nama, surel FROM pengguna WHERE id = $1",
        id_pengguna
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Pengguna {} tidak ditemukan", id_pengguna)))?;

    Ok(Json(pengguna))
}

pub fn bangun_router(state: AppState) -> Router {
    Router::new()
        .route("/api/v1/pengguna/:id", get(ambil_pengguna_handler))
        .with_state(state)
}
```

---

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec rust-programming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 65ms, zero unwrap/expect pada jalur produksi, query SQL terverifikasi waktu kompilasi, verifikasi eksplisit Pola Type-State; bebas AI slop diverifikasi via `node scripts/check-anti-slop.js --strict` |
