---
name: wasm-edge-computing-expert
description: "Expert guide for WebAssembly (WASM) and Edge Computing. Covers WASI preview 2, Spin/Fermyon, Cloudflare Workers WASM, and high-performance browser computing / Panduan ahli untuk WebAssembly (WASM) dan Edge Computing. Mencakup WASI preview 2, Spin/Fermyon, Cloudflare Workers WASM, dan komputasi performa tinggi di browser."
author: "Roedy Rustam"
version: "4.4.2"

---

# WASM & Edge Computing Expert (2026 WASI 0.2 Component Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Languages & Toolchains**: `rust-programming-expert`, `go-programming-expert`, `bun-runtime-expert`
- **Edge Deployment Targets**: `cloudflare-workers-expert`, `cloud-hosting-expert`, `api-gateway-proxy-expert`
- **Sandbox & Execution**: `ephemeral-wasm-sandbox-executor`, `local-slm-edge-ai-expert`
- **Client Performance**: `performance-web-vitals`, `web-3d-graphics-expert`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Specialized engineering guide for writing, compiling, and deploying **WebAssembly (WASM)** components across Edge runtimes and browser worker threads. Covers the **WASI 0.2 (Preview 2) Component Model** (`WIT` interface types, `cargo-component`), sub-millisecond serverless execution (**Cloudflare Workers WASM**, **Fermyon Spin**, **Fastly Compute**), zero-copy linear memory transfers between JavaScript and Rust (`wasm-bindgen`), and multi-threaded `SharedArrayBuffer` compute pools.

### Trigger Conditions
- Offloading CPU-intensive workloads (cryptographic hashing, image/PDF rasterization, AST parsing, physics simulation, vector quantization) from JavaScript to Rust/Go WASM.
- Deploying sub-millisecond cold-start edge functions using WASI 0.2 components.
- Designing capability-based isolated plugin systems using Wasmtime or Extism.
- Optimizing browser main-thread responsiveness (INP < 50ms) by running WASM inside dedicated Web Workers.

---

### Toolchain & Target Selection Matrix

| Target Environment | Recommended Toolchain | Interface Standard | Typical Cold Start | Binary Budget |
| :--- | :--- | :--- | :---: | :---: |
| **Browser / Web Worker** | Rust + `wasm-pack` (`wasm32-unknown-unknown`) | `wasm-bindgen` | ~2–5 ms | < 300 KB (Brotli) |
| **Cloudflare Workers** | Rust `workers-rs` or imported `.wasm` | JS Host Bindings | < 1 ms | < 10 MB |
| **Fermyon Spin / Wasmtime** | Rust `cargo component` (`wasm32-wasip2`) | WASI 0.2 (`wasi:http/proxy`) | < 0.5 ms | < 2 MB |
| **Polyglot Host Plugins** | Rust / Go / Zig + **Extism** | Host PDK /Shared Linear Memory | < 1 ms | < 1 MB |

---

### Core Implementation Patterns

#### 1. WASI 0.2 Component Model (`WIT` Interface Contract)
WASI 0.2 replaces raw pointer ABI hacks with strongly-typed **WebAssembly Interface Types (WIT)**:

```wit
// wit/world.wit
package vibes:crypto-engine@1.0.0;

interface payload-signer {
  record signature-result {
    algorithm: string,
    digest-hex: string,
    verified: bool,
  }

  sign-payload: func(payload: list<u8>, secret-key: string) -> result<signature-result, string>;
}

world edge-signer {
  export payload-signer;
}
```

#### 2. High-Performance Rust WASM Module with Zero-Copy Slice Access
Minimize boundary crossings between JS and WASM. Allocate buffers once or pass `Uint8Array` views directly into linear memory, and optimize binary size with `lto = true` and `opt-level = "z"`:

```toml
# Cargo.toml
[package]
name = "vibes-wasm-kernel"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
sha2 = "0.10"
hex = "0.4"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

```rust
// src/lib.rs
use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct BatchHashResult {
    digest_hex: String,
    bytes_processed: usize,
}

#[wasm_bindgen]
impl BatchHashResult {
    #[wasm_bindgen(getter)]
    pub fn digest_hex(&self) -> String {
        self.digest_hex.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn bytes_processed(&self) -> usize {
        self.bytes_processed
    }
}

#[wasm_bindgen]
pub fn compute_sha256_batch(input: &[u8], iterations: u32) -> Result<BatchHashResult, JsError> {
    if input.is_empty() {
        return Err(JsError::new("Input byte buffer cannot be empty"));
    }
    let rounds = iterations.clamp(1, 100_000);
    let mut current = input.to_vec();

    for _ in 0..rounds {
        let mut hasher = Sha256::new();
        hasher.update(&current);
        current = hasher.finalize().to_vec();
    }

    Ok(BatchHashResult {
        digest_hex: hex::encode(current),
        bytes_processed: input.len() * (rounds as usize),
    })
}
```

---

#### 3. Non-Blocking Browser Web Worker WASM Bridge (TypeScript)
Never execute heavy synchronous WASM compute on the main UI thread; always wrap WASM initialization inside a dedicated Web Worker with `WebAssembly.instantiateStreaming`:

```typescript
// src/workers/wasm-compute.worker.ts
import initWasm, { compute_sha256_batch } from '../pkg/vibes_wasm_kernel.js';

let initialized = false;

self.onmessage = async (event: MessageEvent<{ id: string; payload: Uint8Array; rounds: number }>) => {
  const { id, payload, rounds } = event.data;
  try {
    if (!initialized) {
      await initWasm();
      initialized = true;
    }

    const result = compute_sha256_batch(payload, rounds);
    self.postMessage({
      id,
      ok: true,
      digestHex: result.digest_hex,
      bytesProcessed: result.bytes_processed,
    });
    result.free();
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
```

---

### Verification Checklist
- [ ] `Cargo.toml` release profile enables `lto = true`, `panic = "abort"`, and `wasm-opt -Oz` post-processing.
- [ ] Heavy WASM functions execute inside Web Workers or Edge isolates, never blocking the browser main UI thread.
- [ ] Explicitly call `.free()` on heap-allocated `wasm-bindgen` structs in JavaScript or use `FinalizationRegistry` to prevent linear memory leaks.
- [ ] Multi-threaded `SharedArrayBuffer` deployments configure `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Bahasa & Toolchain Hulu**: `rust-programming-expert`, `go-programming-expert`, `bun-runtime-expert`
- **Target Deployment Edge**: `cloudflare-workers-expert`, `cloud-hosting-expert`, `api-gateway-proxy-expert`
- **Sandbox & Eksekusi**: `ephemeral-wasm-sandbox-executor`, `local-slm-edge-ai-expert`
- **Performa Klien**: `performance-web-vitals`, `web-3d-graphics-expert`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa khusus untuk menulis, mengompilasi, dan men-deploy komponen **WebAssembly (WASM)** di runtime Edge maupun Web Worker browser. Mencakup **WASI 0.2 (Preview 2) Component Model** (`WIT`), eksekusi serverless sub-milidetik (**Cloudflare Workers**, **Fermyon Spin**), pertukaran memori linear tanpa salinan (*zero-copy*) dengan `wasm-bindgen`, serta pemrosesan paralel `SharedArrayBuffer`.

### Panduan Arsitektur Inti
1. **Minimalkan Boundary Crossing**: Kirim buffer biner (`Uint8Array`) sekali ke dalam memori linear WASM, jalankan seluruh komputasi di dalam Rust, dan kembalikan hasil akhirnya.
2. **Optimasi Ukuran Biner**: Aktifkan `opt-level = "z"`, `lto = true`, dan `panic = "abort"` pada `Cargo.toml` agar ukuran `.wasm` di bawah 300 KB setelah kompresi Brotli.
3. **Isolasi Web Worker**: Jangan pernah menjalankan komputasi sinkron WASM yang berat di *main thread* UI browser; jalankan di dalam Web Worker dan panggil `.free()` pada objek struct WASM untuk mencegah kebocoran memori linear.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Profil rilis `Cargo.toml` mengaktifkan `lto = true` dan `panic = "abort"`.
- [ ] Komputasi WASM di sisi klien berjalan di dalam Web Worker tanpa memblokir INP.
- [ ] Objek struct `wasm-bindgen` dibebaskan dengan `.free()` setelah selesai digunakan.
- [ ] Penggunaan `SharedArrayBuffer` menyertakan header COOP (`same-origin`) dan COEP (`require-corp`).
