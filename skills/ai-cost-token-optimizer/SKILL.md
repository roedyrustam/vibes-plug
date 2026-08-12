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

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk FinOps dalam rekayasa AI — prompt caching (Anthropic Prompt Caching & Gemini Context Caching), routing model dinamis (mengarahkan tugas ringan ke Flash/Haiku dan tugas penalaran ke Pro/Opus), semantic caching dengan Redis, dan pelacakan anggaran token real-time.

### Fitur Utama
- **Prompt & Context Caching**: Menyimpan prompt sistem dan dokumen konteks panjang di cache untuk menghemat hingga 90% biaya token.
- **Model Router**: Routing otomatis berdasarkan heuristik antara model ultra-cepat Flash dan model penalaran Pro.
- **Semantic Caching**: Memanfaatkan embedding vector query untuk menyajikan respon cache pada pertanyaan pengguna yang serupa secara semantik.


## Orchestration & Integration
- Integrates with ai-llm-integration-expert and zero-to-prod-orchestrator.
