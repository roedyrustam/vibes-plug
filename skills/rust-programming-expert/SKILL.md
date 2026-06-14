---
name: rust-programming-expert
description: "Expert-level skill for Rust programming (Rust 2024 / v1.85+). Covers memory safety, async, Axum/SQLx, CLI, and optimization in English and Indonesian."
author: "Roedy Rustam"
---

# Rust Programming Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert-level guidance for writing high-performance, robust, and memory-safe systems applications using **Rust 2024 (v1.85+)**. This skill outlines advanced practices in ownership, lifetimes, error design, async architectures, backend development, performance tuning, and idiomatic ecosystem patterns.

### Trigger Conditions
- Use when bootstrapping or maintaining a production Rust crate, application, or workspace.
- Use when designing data models involving complex lifetimes, smart pointers (`Arc`, `Rc`, `RefCell`), or zero-copy abstractions (`Cow`).
- Use when building high-concurrency async services with **Tokio** and **Axum**.
- Use when interacting with databases safely using compile-time checked SQL with **SQLx**.
- Use when crafting modern CLI utilities using **Clap** and **Serde**.
- Use when migrating or upgrading an existing Rust codebase to the **Rust 2024 Edition**.
- Use when profiling, optimizing, or debugging compile times, memory footprints, or runtime performance.

### Rust 2024 Edition & Core Architecture
Rust 2024 (stabilized in Rust v1.85) enhances language ergonomics, strengthens safety invariants, and introduces native async enhancements:
- **Async Closures**: Stable `async || {}` & `AsyncFn` traits.
- **RPIT Lifetimes**: RPIT (`impl Trait` in return position) captures all in-scope lifetimes by default. Use explicit `use<'a, T>` syntax if you want to restrict lifetime capturing.
- **Unsafe Extern**: `extern` blocks and specific attributes (`no_mangle`) now require the `unsafe` keyword.
- **Prelude Additions**: `Future` and `IntoFuture` are now imported automatically.

### Language Essentials & Memory Safety
Memory safety in Rust is guaranteed at compile time through the ownership system:
1. **Ownership & Borrowing**: Each value has a single owner. You can have any number of immutable references (`&T`) *OR* exactly one active mutable reference (`&mut T`) to a value at any given time.
2. **Lifetimes & Smart Pointers**: Avoid references (`&T`) in struct definitions unless short-lived. Use `Arc<T>` and `Mutex<T>` or `RwLock<T>` for thread-safe state sharing.

### Idiomatic Error Handling
Rust utilizes the `Result<T, E>` and `Option<T>` monads:
- **Application-level Errors**: Use `anyhow` for high-level application contexts where stack traces and arbitrary error wrapping are needed.
- **Library-level Errors**: Use `thiserror` to define precise, structured, and descriptive domain error enums.

### Asynchronous Programming (Rust 2024 + Tokio)
- **Prefer Tokio Tasks for I/O**: Use `tokio::spawn` to run light, concurrent tasks that perform asynchronous I/O.
- **Do NOT Block the Async Runtime**: Never run CPU-bound work or synchronous block-I/O directly inside an async worker thread. Use `tokio::task::spawn_blocking` to offload heavy calculations.

### Production Ecosystem Integrations
- **Axum + SQLx**: High performance async routing combined with compile-time checked PostgreSQL database queries.
- **Clap + Serde**: Declarative command-line argument parser and serialization/deserialization.

### Optimization & Unsafe Code
- **Avoid Heap Allocations**: Use slices `&[T]` and zero-copy `Cow<'a, str>` wrappers where possible.
- **Release Profile (`Cargo.toml`)**: Use `opt-level = 3`, `lto = true`, and `codegen-units = 1` for production.
- **Sound Unsafe**: Only use `unsafe` when absolutely required. Always document with a `// SAFETY:` block.

---

### Troubleshooting & Common Gotchas / Pemecahan Masalah
- **Lifetimes Mismatch**: Ensure returned references don't point to local variables. Use owned types or bind output lifetimes to input lifetimes.
- **Send / Sync Boundary Failures**: Async block elements across `.await` must implement `Send`. Avoid holding synchronous mutex guards across `.await` points.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat ahli untuk menulis aplikasi sistem yang berkinerja tinggi, tangguh, dan aman secara memori menggunakan **Rust 2024 (v1.85+)**. Skill ini menguraikan praktik-praktik lanjutan dalam kepemilikan (ownership), masa hidup (lifetimes), desain error, arsitektur asinkron, pengembangan backend, optimasi performa, dan pola ekosistem yang idiomatis.

### Kondisi Pemicu
- Gunakan saat merancang atau memelihara crate, aplikasi, atau workspace Rust tingkat produksi.
- Gunakan saat mendesain model data dengan lifetime yang kompleks, smart pointers (`Arc`, `Rc`, `RefCell`), atau abstraksi zero-copy (`Cow`).
- Gunakan saat membangun layanan asinkron konkurensi tinggi dengan **Tokio** dan **Axum**.
- Gunakan saat berinteraksi dengan database secara aman menggunakan SQL yang diverifikasi saat kompilasi dengan **SQLx**.
- Gunakan saat merancang utilitas CLI modern menggunakan **Clap** dan **Serde**.
- Gunakan saat memigrasikan atau meningkatkan codebase Rust yang ada ke **Edisi Rust 2024**.
- Gunakan saat melakukan profiling, mengoptimalkan, atau men-debug waktu kompilasi, penggunaan memori, atau kinerja runtime.

### Edisi Rust 2024 & Arsitektur Inti
Edisi Rust 2024 meningkatkan ergonomi bahasa, memperkuat invariant keamanan, dan memperkenalkan peningkatan asinkron bawaan:
- **Async Closures**: Traits `AsyncFn` dan penulisan closure `async || {}` sekarang stabil. Gunakan untuk adapter stream asinkron atau event handler langsung.
- **RPIT Lifetimes**: RPIT (`impl Trait` pada posisi return) menangkap semua lifetime dalam scope secara default. Gunakan sintaksis eksplisit `use<'a, T>` untuk membatasi penangkapan lifetime.
- **Unsafe Extern**: Blok `extern` dan atribut tertentu (`no_mangle`) sekarang memerlukan kata kunci `unsafe`.
- **Tambahan Prelude**: `Future` dan `IntoFuture` sekarang diimpor secara otomatis.

### Dasar Bahasa & Keamanan Memori
Keamanan memori dijamin saat kompilasi melalui sistem kepemilikan (ownership). Ikuti panduan berikut:
1. **Kepemilikan & Peminjaman**: Setiap nilai memiliki satu pemilik. Ketika pemilik keluar dari scope, nilai tersebut dihapus. Anda dapat memiliki banyak referensi immutable (`&T`) *ATAU* tepat satu referensi mutable (`&mut T`) aktif pada satu waktu.
2. **Lifetimes & Smart Pointers**: Hindari meletakkan referensi (`&T`) di dalam definisi struct kecuali untuk struct pembantu berumur pendek. Gunakan `Arc<T>` (Thread-Safe Shared Reference) dan `Mutex<T>` (Mutual Exclusion) untuk berbagi state antar thread.

### Penanganan Error yang Idiomatis
Rust menggunakan monad `Result<T, E>` and `Option<T>` alih-alih exception tradisional.
- **Tingkat Aplikasi**: Gunakan `anyhow` untuk pembuatan skrip cepat atau konteks aplikasi tingkat tinggi di mana pelacakan stack dan pembungkusan error acak diperlukan.
- **Tingkat Library**: Gunakan `thiserror` untuk mendefinisikan enum error domain yang tepat, terstruktur, dan deskriptif.

### Pemrograman Asinkron (Rust 2024 + Tokio)
- **Gunakan Tugas Tokio untuk I/O**: Gunakan `tokio::spawn` untuk menjalankan tugas-tugas ringan dan konkuren.
- **JANGAN Blokir Runtime Asinkron**: Jangan pernah menjalankan pekerjaan berat CPU atau I/O sinkron secara langsung di dalam thread pekerja asinkron. Gunakan `tokio::task::spawn_blocking` jika diperlukan.

### Integrasi Ekosistem Produksi
- **Axum + SQLx (Web API Stack)**: Axum menyediakan framework web asinkron terkemuka, sementara SQLx menyediakan lapisan interaksi database dengan pemeriksaan keamanan SQL pada saat kompilasi.
- **Clap + Serde (CLI Stack)**: Clap v4 menyediakan parser argumen baris perintah deklaratif berbasis makro. Serde menangani serialisasi/deserialisasi dengan lancar.

### Optimasi & Kode Unsafe
- **Hindari Alokasi Heap**: Gunakan `&str` alih-alih `String` untuk variabel read-only. Gunakan `Cow<'a, str>` ketika variabel hanya sesekali dimutasi.
- **Konfigurasi Profil Release (`Cargo.toml`)**: Gunakan `opt-level = 3`, `lto = true`, dan `codegen-units = 1` untuk kinerja maksimal.
- **Kode Unsafe yang Aman**: Hanya gunakan `unsafe` untuk memanggil binding C atau struktur data lockless kustom. Selalu sertakan blok `// SAFETY:` untuk menjelaskan validitas invariant.
