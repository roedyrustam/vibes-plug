---
name: wasm-edge-computing-expert
description: "Expert guide for WebAssembly (WASM) and Edge Computing. Covers WASI preview 2, Spin/Fermyon, Cloudflare Workers WASM, and high-performance browser computing / Panduan ahli untuk WebAssembly (WASM) dan Edge Computing. Mencakup WASI preview 2, Spin/Fermyon, Cloudflare Workers WASM, dan komputasi performa tinggi di browser."
author: "Roedy Rustam"
---

# WebAssembly & Edge Computing Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for WebAssembly (WASM) and Edge Computing. Covers WASI (WebAssembly System Interface) Preview 2, Spin/Fermyon framework for serverless WASM, Cloudflare Workers WASM integration, and offloading heavy computational tasks to the browser. Targets Rust and Go compilation to WASM for high-performance execution.

### Trigger Conditions
Activate this skill when the user is:
- Porting heavy computational logic (image processing, cryptography, physics) to the browser.
- Deploying ultra-fast, cold-start-free serverless functions at the edge (Cloudflare Workers, Fastly Compute).
- Building portable, language-agnostic microservices using WASI (WebAssembly System Interface).
- Writing Rust or Go code intended to run within a JavaScript/TypeScript environment.

---

### Core Concepts

#### 1. Architecture Overview: WASM at the Edge vs Browser
WASM is a binary instruction format. In the browser, it runs alongside JavaScript to accelerate compute-heavy tasks. At the edge (serverless), it provides a secure, lightweight runtime with near-zero cold starts compared to traditional Docker containers.

```rust
// Rust — Example: A simple WASM function (lib.rs)
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn heavy_computation(n: i32) -> i32 {
    (1..=n).fold(0, |acc, x| acc + x)
}
```

#### 2. Selection Guide: Where to run WASM?

| Environment | Use Case | Recommended Tooling |
|---|---|---|
| **Browser (Client-side)** | Video/audio processing, 3D games, crypto | `wasm-pack` (Rust), Emscripten (C/C++) |
| **Edge Network** | Global low-latency APIs, A/B testing, auth | Cloudflare Workers, Fastly Compute |
| **Serverless/Cloud** | Microservices, plugin systems | Fermyon Spin, Wasmtime, Wasmer |

**Recommendation:** Use Rust with `wasm-pack` for browser integration. For edge APIs, use Fermyon Spin or Cloudflare Workers for the best developer experience.

---

### WASI Preview 2 & The Component Model

WASI (WebAssembly System Interface) Preview 2 introduces the Component Model, allowing WASM modules written in different languages to communicate seamlessly without glue code.

```toml
# Example: spin.toml for a Fermyon Spin application
spin_manifest_version = 2

[application]
name = "hello-wasm"
version = "0.1.0"
authors = ["Admin"]

[[trigger.http]]
route = "/..."
component = "hello-wasm"

[component.hello-wasm]
source = "target/wasm32-wasi/release/hello_wasm.wasm"
```

---

### Best Practices

1. **Minimize JS <-> WASM Boundary Crossing:** Crossing the JavaScript and WebAssembly boundary carries overhead. Batch your data or pass memory pointers rather than calling simple WASM functions in a tight JS loop.
2. **Optimize Binary Size:** Use `wasm-opt` (from Binaryen) and configure your Rust `Cargo.toml` with `opt-level = "z"` and `lto = true` to produce the smallest possible WASM binary.
3. **Use WASI for Portability:** For backend applications, build against WASI rather than standard targets. This ensures your module can run anywhere—from edge networks to local Wasmtime runtimes—without OS-specific dependencies.
4. **Leverage SIMD:** Enable WebAssembly SIMD (Single Instruction, Multiple Data) if your target environments support it (most modern browsers and edge runtimes do) for massive parallel processing speedups.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| **String copying across boundary** | High memory allocation overhead | Pass memory offsets/pointers and decode strings via `TextDecoder` in JS. |
| **Ignoring dead code elimination** | Massive `.wasm` files affecting load times | Use `wasm-snip`, `wasm-opt`, and enable Link Time Optimization (LTO). |
| **Assuming multi-threading is default** | WASM runs single-threaded by default | Use Web Workers in the browser and enable SharedArrayBuffer for WASM threads. |

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `rust-programming-expert` — Rust is the premier language for compiling to WASM. Combine these skills for memory-safe edge logic.
- `cloud-hosting-expert` — For deploying WASM modules to Cloudflare Workers or Vercel Edge.
- `go-programming-expert` — For compiling Go (or TinyGo) backend services to WASM/WASI formats.

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "Backend & Infrastructure" and "Frontend & UI" rows.
- `zero-to-prod-orchestrator` — Phase 3 (Architecture) and Phase 6 (Performance Optimization).
- `production-ready-hardener` — Phase 5 (Performance & Core Web Vitals) for checking WASM bundle sizes.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk WebAssembly (WASM) dan Edge Computing. Mencakup WASI (WebAssembly System Interface) Preview 2, framework Spin/Fermyon untuk serverless WASM, integrasi Cloudflare Workers WASM, dan pemindahan beban komputasi berat ke browser. Menargetkan kompilasi Rust dan Go ke WASM untuk eksekusi berkinerja tinggi.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Memindahkan logika komputasi berat (pemrosesan gambar, kriptografi, fisika) ke browser.
- Mendeploy fungsi serverless yang super cepat dan tanpa *cold-start* di edge (Cloudflare Workers).
- Membangun microservices yang portabel dan *language-agnostic* menggunakan WASI.
- Menulis kode Rust atau Go yang dimaksudkan untuk berjalan di dalam lingkungan JavaScript/TypeScript.

### Panduan Singkat

- **Minimalisir Perpindahan JS <-> WASM:** Melintasi batas antara JS dan WASM memiliki *overhead*. Proses data dalam batch daripada memanggil fungsi WASM dalam *loop* JS yang ketat.
- **Optimasi Ukuran Binary:** Gunakan `wasm-opt` dan atur profil rilis Rust (`opt-level = "z"`, `lto = true`) untuk meminimalkan ukuran file `.wasm` agar tidak memperlambat *page load*.
- **Gunakan WASI di Backend:** Kompilasi dengan target WASI agar modul Anda portabel dan dapat berjalan di berbagai *runtime* (Wasmtime, Wasmer, Cloudflare) tanpa terikat pada sistem operasi tertentu.
- **Waspadai Alokasi Memori:** Hindari menyalin string atau array besar secara berulang melintasi batas WASM; gunakan *memory pointer* dan `SharedArrayBuffer` jika diperlukan.

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `rust-programming-expert` — Rust adalah bahasa utama untuk WASM. Kombinasikan untuk logika edge yang aman dari kebocoran memori.
- `cloud-hosting-expert` — Untuk mendeploy modul WASM ke jaringan edge seperti Cloudflare Workers.
- `go-programming-expert` — Untuk mengkompilasi layanan backend Go (atau TinyGo) ke format WASM/WASI.

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke baris "Backend & Infrastructure" dan "Frontend & UI".
- `zero-to-prod-orchestrator` — Fase 3 (Arsitektur) dan Fase 6 (Optimasi Performa).
- `production-ready-hardener` — Fase 5 (Performa & CWV) untuk memeriksa ukuran bundle WASM.
