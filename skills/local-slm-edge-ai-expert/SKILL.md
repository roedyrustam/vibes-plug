---
name: local-slm-edge-ai-expert
description: "Expert guide for Local Small Language Models (SLMs) and Edge AI execution — WebLLM, Transformers.js v3, ONNX Runtime Web, WebGPU, and zero-latency local embeddings / Panduan ahli SLM lokal dan AI edge di browser."
author: "Roedy Rustam"
version: "4.4.2"

---

# Local SLM & Edge AI Expert (WebGPU & In-Browser Intelligence)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Model Routing & Cost Optimization**: `llm-finops-router`, `adaptive-model-cascade`, `frontier-ai-models-expert`
- **Edge Runtimes & Frontend**: `senior-frontend`, `pwa-offline-first-expert`, `wasm-edge-computing-expert`
- **Local Vectors & RAG**: `vector-db-rag-expert`, `agentic-memory-architect`, `session-memory-manager`
- **Privacy & Safety Guardrails**: `compliance-gdpr-privacy-expert`, `ai-safety-governance-expert`, `zero-trust-secret-vault`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `anti-slop`

### Purpose & Overview
Production-grade architectural guide for running **Small Language Models (SLMs)** and embedding models directly inside client browsers and edge runtimes. Eliminates cloud API costs, guarantees 100% data privacy (zero cloud data leakage), and enables instant, offline-capable AI features using **WebGPU**, **Transformers.js v3**, **WebLLM**, and **ONNX Runtime Web**.

### Key Capabilities
1. **Client-Side Model Execution**: Running quantized 1B–4B SLMs (Llama 3.2 1B/3B, Gemma 2 2B, Phi-3.5 Mini, Qwen 2.5 1.5B/3B) entirely inside the user's browser via WebGPU.
2. **In-Browser Embeddings**: Fast client-side vector embeddings with models like `all-MiniLM-L6-v2` or `bge-small-en-v1.5` using Transformers.js v3.
3. **Hybrid Edge-Cloud Fallback**: Gracefully falling back to server-side LLMs when client hardware lacks WebGPU or sufficient VRAM.
4. **Zero-Latency PII Masking**: Anonymizing sensitive user data locally on the client before sending queries to external LLMs.

---

### Production Implementation Recipes

#### Recipe 1: In-Browser Semantic Embedding Generation with Transformers.js v3
```typescript
import { pipeline, env } from '@huggingface/transformers';

// Configure cache and worker settings
env.allowLocalModels = false;
env.useBrowserCache = true;

let embedder: any = null;

export async function getLocalEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32',
      device: 'webgpu', // Accelerate via WebGPU if supported
    });
  }

  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}
```

#### Recipe 2: WebLLM In-Browser Chat Assistant with WebGPU
```typescript
import * as webllm from '@mlc-ai/web-llm';

export async function createLocalChatEngine(onProgress?: (report: webllm.InitProgressReport) => void) {
  // Check WebGPU compatibility
  if (!('gpu' in navigator)) {
    throw new Error('WebGPU is not supported in this browser. Fallback to cloud API.');
  }

  const selectedModel = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';

  const engine = await webllm.CreateMLCEngine(selectedModel, {
    initProgressCallback: onProgress,
  });

  return {
    generateResponse: async (prompt: string): Promise<string> => {
      const reply = await engine.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });
      return reply.choices[0]?.message.content || '';
    },
  };
}
```

---

### Implementation Checklist
- [ ] Implement browser feature detection (`'gpu' in navigator`) before initiating WebGPU model loads.
- [ ] Provide a transparent download progress bar when fetching model weights on initial visit.
- [ ] Cache model shards in IndexedDB or Cache API to ensure instant subsequent launches.
- [ ] Provide automatic fallback to lightweight serverless APIs when client device VRAM is constrained.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec local-slm-edge-ai-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Perutean Model & Optimasi Biaya**: `llm-finops-router`, `adaptive-model-cascade`, `frontier-ai-models-expert`
- **Runtime Edge & Frontend**: `senior-frontend`, `pwa-offline-first-expert`, `wasm-edge-computing-expert`
- **Vektor Lokal & RAG**: `vector-db-rag-expert`, `agentic-memory-architect`, `session-memory-manager`
- **Privasi & Guardrail Keamanan**: `compliance-gdpr-privacy-expert`, `ai-safety-governance-expert`, `zero-trust-secret-vault`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `anti-slop`

### Tujuan & Gambaran Umum
Panduan arsitektur tingkat produksi untuk menjalankan **Small Language Models (SLM)** dan model *embedding* langsung di dalam browser pengguna dan runtime edge. Menghilangkan biaya API cloud, menjamin privasi data 100% (tidak ada data yang keluar ke server pihak ketiga), dan mengaktifkan fitur AI instan yang dapat bekerja secara *offline* menggunakan **WebGPU**, **Transformers.js v3**, **WebLLM**, dan **ONNX Runtime Web**.

### Kemampuan Utama
1. **Eksekusi Model di Sisi Klien**: Menjalankan SLM terkuantisasi 1B–4B (Llama 3.2 1B/3B, Gemma 2 2B, Phi-3.5 Mini, Qwen 2.5) sepenuhnya di dalam browser pengguna dengan akselerasi WebGPU.
2. **Embedding Vektor di Browser**: Pembuatan vektor semantik secepat kilat menggunakan Transformers.js v3 (`all-MiniLM-L6-v2` atau `bge-small`).
3. **Fallback Hibrida Klien-Cloud**: Mengalihkan tugas ke server secara otomatis jika perangkat klien tidak mendukung WebGPU atau memiliki VRAM terbatas.
4. **Penyensoran PII Tanpa Latensi**: Mengaburkan data pribadi sensitif secara lokal di perangkat klien sebelum diteruskan ke cloud.

---

### Resep Implementasi Produksi

#### Resep 1: Pembuatan Embedding Vektor di Browser dengan Transformers.js v3
```typescript
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

let modelEmbedding: any = null;

export async function buatEmbeddingLokal(teks: string): Promise<number[]> {
  if (!modelEmbedding) {
    modelEmbedding = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32',
      device: 'webgpu',
    });
  }

  const hasil = await modelEmbedding(teks, { pooling: 'mean', normalize: true });
  return Array.from(hasil.data);
}
```

#### Resep 2: Asisten AI di Browser dengan WebLLM & WebGPU
```typescript
import * as webllm from '@mlc-ai/web-llm';

export async function inisialisasiMesinLokal(laporanProgres?: (laporan: webllm.InitProgressReport) => void) {
  if (!('gpu' in navigator)) {
    throw new Error('WebGPU tidak didukung pada browser ini. Alihkan ke API cloud.');
  }

  const modelTerpilih = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';

  const mesin = await webllm.CreateMLCEngine(modelTerpilih, {
    initProgressCallback: laporanProgres,
  });

  return {
    kirimPesan: async (pertanyaan: string): Promise<string> => {
      const balasan = await mesin.chat.completions.create({
        messages: [{ role: 'user', content: pertanyaan }],
        temperature: 0.2,
      });
      return balasan.choices[0]?.message.content || '';
    },
  };
}
```

---

### Checklist Implementasi
- [ ] Deteksi ketersediaan WebGPU (`'gpu' in navigator`) sebelum memuat model.
- [ ] Tampilkan indikator progres unduhan bobot model saat pertama kali diakses.
- [ ] Simpan bobot model di Cache API atau IndexedDB agar kunjungan berikutnya instan tanpa unduh ulang.
- [ ] Siapkan jalur fallback ke API cloud jika memori klien tidak mencukupi.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec local-slm-edge-ai-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
