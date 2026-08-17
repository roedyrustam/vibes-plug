---
name: ai-cost-token-optimizer
description: "Expert guide for LLM API cost optimization, Prompt Caching, model routing (Flash/Pro/Opus), semantic caching, and token budgeting / Panduan ahli optimasi biaya API LLM, Prompt Caching, model routing, dan semantic caching."
author: "vibes-plug-swarm"
---

# AI Cost & Token Optimizer

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade guidelines for FinOps in AI engineering — prompt caching (Anthropic Prompt Caching, Gemini Context Caching), dynamic model routing (routing lightweight queries to Flash/Haiku and complex reasoning to Pro/Opus), semantic caching with Redis/GPTCache, and real-time token expenditure tracking.

### Key Capabilities
- **Prompt & Context Caching**: Storing static system prompts, long-context documents, and schemas in cache to reduce token costs by up to 90%.
- **Model Router**: Heuristic and classifier-based routing between ultra-fast Flash models and high-reasoning Pro models.
- **Semantic Caching**: Hashing query vector embeddings to serve cached responses for semantically identical user queries.

```typescript
// Model Routing Strategy Example
export function selectOptimalModel(promptLength: number, taskType: 'classification' | 'reasoning' | 'summary') {
  if (taskType === 'classification' || promptLength < 500) {
    return 'gemini-3.5-flash'; // High speed, ultra low cost
  }
  return 'gemini-3.1-pro'; // Complex reasoning
}
```

### Implementation Checklist
- [ ] Enable Context Caching for static system prompts or documents larger than 32k tokens.
- [ ] Implement a router heuristic: use `gemini-3.5-flash` for simple parsing and `gemini-3.1-pro` for deep reasoning.
- [ ] Set up semantic caching (e.g., Redis + Vector Search) for frequently asked identical queries.
- [ ] Monitor token usage and set hard budgeting limits per user/tenant to prevent abuse.

### Operating Protocol
1. **Model Fallback & Routing**: Sets up an abstraction layer (like LiteLLM or Vercel AI SDK Core) to support multiple providers.
2. **Complexity Scoring**: Implements heuristics (prompt length, required JSON schema, keyword analysis) to route to the cheapest capable model.
3. **Semantic Caching Integration**: Implements a Vector DB or Redis caching layer. Before routing to an LLM, it embeddings the user prompt and checks if a semantically similar query was answered recently.
4. **Token Budgeting**: Sets hard limits and alerts for daily API consumption per tenant/user.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk FinOps dalam rekayasa AI — prompt caching (Anthropic Prompt Caching & Gemini Context Caching), routing model dinamis (mengarahkan tugas ringan ke Flash/Haiku dan tugas penalaran ke Pro/Opus), semantic caching dengan Redis, dan pelacakan anggaran token real-time.

### Fitur Utama
- **Prompt & Context Caching**: Menyimpan prompt sistem dan dokumen konteks panjang di cache untuk menghemat hingga 90% biaya token.
- **Model Router**: Routing otomatis berdasarkan heuristik antara model ultra-cepat Flash dan model penalaran Pro.
- **Semantic Caching**: Memanfaatkan embedding vector query untuk menyajikan respon cache pada pertanyaan pengguna yang serupa secara semantik.

### Checklist Implementasi
- [ ] Aktifkan Context Caching untuk prompt sistem statis atau dokumen yang lebih besar dari 32k token.
- [ ] Terapkan heuristik router: gunakan `gemini-3.5-flash` untuk parsing sederhana dan `gemini-3.1-pro` untuk penalaran mendalam.
- [ ] Siapkan semantic caching (misal: Redis + Vector Search) untuk pertanyaan identik yang sering diajukan.
- [ ] Pantau penggunaan token dan tetapkan batas anggaran yang ketat per pengguna/tenant untuk mencegah penyalahgunaan.

### Protokol Operasi
1. **Routing & Fallback Model**: Menyiapkan lapisan abstraksi (seperti LiteLLM atau Vercel AI SDK Core) untuk mendukung berbagai penyedia model.
2. **Penilaian Kompleksitas**: Mengimplementasikan heuristik (panjang prompt, kebutuhan skema JSON, analisis kata kunci) untuk mengarahkan prompt ke model termurah yang mampu menyelesaikannya.
3. **Integrasi Semantic Caching**: Mengimplementasikan lapisan *cache* Vector DB atau Redis. Sebelum mengirim ke LLM, prompt pengguna diubah menjadi vektor (*embedding*) untuk mengecek apakah pertanyaan serupa pernah dijawab baru-baru ini.
4. **Penganggaran Token**: Menetapkan batas maksimal dan notifikasi untuk konsumsi API harian per pengguna/tenant.


## Orchestration & Integration
- Integrates with `ai-llm-integration-expert`, `token-saver`, and `zero-to-prod-orchestrator`.
- Connects to `edge-serverless-db-expert` (Upstash/Redis) for fast semantic caching.
- Collaborates with `vector-db-rag-expert` for similarity scoring during cache retrieval.
- Feeds billing metrics into `saas-billing` for usage-based AI pricing models.

## Integrasi Orkestrasi
- Terintegrasi dengan `ai-llm-integration-expert`, `token-saver`, dan `zero-to-prod-orchestrator`.
- Terhubung dengan `edge-serverless-db-expert` (Upstash/Redis) untuk *semantic caching* secepat kilat.
- Berkolaborasi dengan `vector-db-rag-expert` untuk perhitungan kemiripan saat pencarian *cache*.
- Memasok metrik penagihan ke `saas-billing` untuk model bisnis AI berbasis penggunaan (*usage-based pricing*).
