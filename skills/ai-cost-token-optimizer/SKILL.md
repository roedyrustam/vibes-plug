---
name: ai-cost-token-optimizer
description: "Expert guide for LLM API cost optimization, Prompt Caching, model routing (Flash/Pro/Opus), semantic caching, and token budgeting / Panduan ahli optimasi biaya API LLM, Prompt Caching, model routing, dan semantic caching."
author: vibes-plug-swarm
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


## Orchestration & Integration
- Integrates with `ai-llm-integration-expert`, `token-saver`, `llm-cost-arbitrage-router`, and `zero-to-prod-orchestrator`.

## Integrasi Orkestrasi
- Terintegrasi dengan `ai-llm-integration-expert`, `token-saver`, `llm-cost-arbitrage-router`, dan `zero-to-prod-orchestrator`.
