---
name: llm-cost-arbitrage-router
description: "Dynamically routes LLM calls based on cost/latency and builds semantic caching layers to reduce token burn / Mengarahkan pemanggilan LLM secara dinamis berdasarkan biaya/latensi dan membangun lapisan semantic cache untuk menekan pengeluaran token."
author: vibes-plug-swarm
---

# Predictive LLM Cost Arbitrage Router (FinOps AI Agent)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
An advanced FinOps architectural skill designed to prevent API cost overruns in AI applications. Instead of hardcoding a single model (e.g., GPT-4 or Claude 3.5 Sonnet) for every task, this agent builds an intelligent routing layer. It evaluates incoming prompts for complexity and dynamically routes simple queries to cheaper, faster models (e.g., Llama 3 8B, Gemini Flash) and complex reasoning tasks to frontier models. Additionally, it implements Semantic Caching (e.g., with Redis or Upstash) to serve identical or semantically similar queries without hitting the LLM provider, slashing token costs by up to 90%.

### Trigger Conditions
- When building AI-native applications, chatbots, or RAG systems.
- During Phase 4 (Backend Architecture) when implementing external API layers.
- When explicitly requested by the user to "optimize AI costs" or "reduce token usage."

### Operating Protocol
1. **Model Fallback & Routing**: Sets up an abstraction layer (like LiteLLM or Vercel AI SDK Core) to support multiple providers.
2. **Complexity Scoring**: Implements heuristics (prompt length, required JSON schema, keyword analysis) to route to the cheapest capable model.
3. **Semantic Caching Integration**: Implements a Vector DB or Redis caching layer. Before routing to an LLM, it embeddings the user prompt and checks if a semantically similar query was answered recently.
4. **Token Budgeting**: Sets hard limits and alerts for daily API consumption per tenant/user.

## Orchestration & Integration
- Enhances `ai-llm-integration-expert` with enterprise-grade cost controls.
- Connects to `edge-serverless-db-expert` (Upstash/Redis) for fast semantic caching.
- Collaborates with `vector-db-rag-expert` for similarity scoring during cache retrieval.
- Feeds billing metrics into `saas-billing` for usage-based AI pricing models.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Keterampilan arsitektur *FinOps* canggih yang dirancang untuk mencegah pembengkakan biaya API pada aplikasi berbasis AI. Alih-alih menetapkan satu model secara kaku (misalnya GPT-4 atau Claude 3.5 Sonnet) untuk semua tugas, agen ini membangun lapisan *routing* yang cerdas. Agen akan mengevaluasi tingkat kerumitan setiap prompt yang masuk dan mengarahkan *query* sederhana ke model yang lebih murah dan cepat (mis. Llama 3 8B, Gemini Flash), sementara tugas penalaran kompleks diarahkan ke model raksasa (*frontier*). Selain itu, agen ini mengimplementasikan *Semantic Caching* (misal dengan Redis atau Upstash) untuk menyajikan jawaban pada *query* yang identik atau mirip secara semantik tanpa harus menghubungi penyedia LLM, memangkas biaya token hingga 90%.

### Kondisi Pemicu
- Saat membangun aplikasi AI-native, chatbot, atau sistem RAG.
- Selama Fase 4 (Arsitektur Backend) saat mengimplementasikan lapisan API eksternal.
- Ketika diminta secara eksplisit oleh pengguna untuk "mengoptimalkan biaya AI" atau "mengurangi penggunaan token".

### Protokol Operasi
1. **Routing & Fallback Model**: Menyiapkan lapisan abstraksi (seperti LiteLLM atau Vercel AI SDK Core) untuk mendukung berbagai penyedia model.
2. **Penilaian Kompleksitas**: Mengimplementasikan heuristik (panjang prompt, kebutuhan skema JSON, analisis kata kunci) untuk mengarahkan prompt ke model termurah yang mampu menyelesaikannya.
3. **Integrasi Semantic Caching**: Mengimplementasikan lapisan *cache* Vector DB atau Redis. Sebelum mengirim ke LLM, prompt pengguna diubah menjadi vektor (*embedding*) untuk mengecek apakah pertanyaan serupa pernah dijawab baru-baru ini.
4. **Penganggaran Token**: Menetapkan batas maksimal dan notifikasi untuk konsumsi API harian per pengguna/tenant.

## Integrasi Orkestrasi
- Memperkuat `ai-llm-integration-expert` dengan kontrol biaya skala *enterprise*.
- Terhubung dengan `edge-serverless-db-expert` (Upstash/Redis) untuk *semantic caching* secepat kilat.
- Berkolaborasi dengan `vector-db-rag-expert` untuk perhitungan kemiripan saat pencarian *cache*.
- Memasok metrik penagihan ke `saas-billing` untuk model bisnis AI berbasis penggunaan (*usage-based pricing*).
