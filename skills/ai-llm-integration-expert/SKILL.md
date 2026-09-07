---
name: ai-llm-integration-expert
description: "Expert guide for integrating Large Language Models (LLMs), Model Context Protocol (MCP v1.x), hybrid reasoning models, RAG architecture, vector databases, and AI agents / Panduan ahli untuk integrasi LLM, Model Context Protocol (MCP), model hybrid reasoning, arsitektur RAG, vector database, dan agen AI."
author: "vibes-plug-swarm"
---

# AI & LLM Integration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidelines for integrating AI, Model Context Protocol (MCP), hybrid reasoning models, and Large Language Models (LLMs) into modern software architectures. Covers hybrid reasoning token streaming, Streamable HTTP MCP transports, agentic memory architectures, native context caching, RAG pipelines, and multi-model orchestration.

### Trigger Conditions
- Integrating frontier reasoning models: Anthropic Claude 3.7 Sonnet (Hybrid/Extended Thinking), Google Gemini 3.8 Flash / 3.1 Pro (Thinking Mode), OpenAI o1 / o3 / o3-mini / GPT-4.5 / GPT-4o, DeepSeek-R1 / V3, or open-source weights (Llama 4, Qwen 2.5/3 Coder).
- Implementing Model Context Protocol (MCP) server or client integrations with Streamable HTTP transport or MCP Sampling.
- Building AI chatbots, copilots, or autonomous AI agent workflows (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 5.x/6.x).
- Managing streaming reasoning tokens (`<think>` chunks) separately from final output in user interfaces.
- Implementing hybrid RAG with vector databases (Supabase pgvector HNSW, Qdrant, Pinecone) and cross-encoder rerankers.
- Building agentic memory systems (short-term, long-term semantic, episodic) using Mem0 or vector stores.
- Implementing cost optimization with provider-native Context Caching (Gemini `cachedContent`, Anthropic ephemeral prompt cache, OpenAI prefix cache).

### Model Capability Matrix (2026)

| Provider | Model | Context | Reasoning Type | Primary Strength |
|---|---|---|---|---|
| Anthropic | Claude 3.7 Sonnet | 200K | Hybrid Thinking (Standard + Extended) | Code generation, complex reasoning, Computer Use |
| Anthropic | Claude 3.5 / 4 Opus | 200K | Deep Deliberation | Deep architectural synthesis, policy analysis |
| Google | Gemini 3.8 Flash | 1M–2M | Flash Thinking (Configurable Budget) | Ultra-low latency, multimodal live, high-frequency loops |
| Google | Gemini 3.1 / 3.5 Pro | 2M | Extended Reasoning | Needle-in-a-haystack, long-context repos, deep research |
| OpenAI | o3 / o3-mini | 200K | Native Test-Time Reasoning | Math, competitive coding, formal logic verification |
| OpenAI | GPT-4.5 / GPT-4o | 128K | Direct Instruction & Fast Tooling | Low-latency voice, structured JSON, tool-calling |
| DeepSeek | DeepSeek-R1 | 128K | Open Reasoning (Distill & MoE) | State-of-the-art open weights reasoning, math, coding |
| DeepSeek | DeepSeek-V3 | 128K | General Multimodal / Text | High throughput, extremely cost-efficient coding |
| Qwen | Qwen 2.5 / 3 Coder | 128K | Open Source Code Specialist | Self-hosted coding agent, local copilot integration |

### Core Architecture Guidelines

#### 1. Hybrid Reasoning & Streaming Token Handling
Modern frontier models emit internal thinking/reasoning tokens during test-time compute:
- **Thinking Token Separation**: Separate internal `<think>` or reasoning chunks from conversational output. Stream reasoning into collapsible UI accordion blocks while presenting clean output to the user.
- **Vercel AI SDK 5.x/6.x Integration**:
  ```typescript
  import { streamText } from 'ai';
  import { anthropic } from '@ai-sdk/anthropic';

  const result = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 4096 },
      },
    },
    prompt: 'Refactor this distributed consensus engine...',
  });

  // Access reasoning stream alongside main text
  for await (const part of result.fullStream) {
    if (part.type === 'reasoning') {
      process.stdout.write(`[Thinking]: ${part.textDelta}`);
    } else if (part.type === 'text-delta') {
      process.stdout.write(part.textDelta);
    }
  }
  ```

#### 2. Model Context Protocol (MCP) — Streamable HTTP & Sampling
Standardize all agent-tool and agent-host communications using MCP specifications:
- **Streamable HTTP Transport**: Modern cloud deployments use Streamable HTTP (bidirectional JSON-RPC streaming over HTTP POST/SSE hybrid) instead of fragile stdio connections.
- **MCP Sampling**: Allow MCP servers to request LLM completions back from the host client, enabling nested agentic tools without distributing API keys to tool servers.
- **Authorization & Security**: Enforce OAuth 2.1 scoped bearer tokens on remote MCP endpoints. Validate all incoming tool inputs using strict Zod schemas.

#### 3. Agentic Memory Architecture
Production AI agents require multi-layered memory:
- **In-Context Working Memory**: Pass recent turn messages within the prompt window.
- **Long-Term Semantic Memory**: Embed user preferences and facts using pgvector (HNSW index) or Qdrant; perform cosine similarity searches.
- **Episodic Memory (Mem0 / MemGPT)**: Automatically synthesize session checkpoints and index past user decisions for human-like recall.
- **Knowledge Graph Memory**: Maintain structured entity-relationship triples (using Graph DB or relational junction tables) for multi-hop relationship retrieval.

#### 4. Advanced RAG & Late Chunking Pipeline
Build high-precision RAG pipelines:
1. **Document Ingestion**: Chunk semantically (500–1000 tokens) with 10% overlap, or apply *Late Chunking* (chunking after full document contextual embedding).
2. **Embeddings**: Utilize `text-embedding-3-large`, `gemini-embedding-004`, or local `bge-large-en-v1.5`.
3. **Hybrid Search**: Combine dense vector cosine similarity with sparse BM25 / PostgreSQL `tsvector` queries.
4. **Cross-Encoder Reranking**: Reorder top-K candidates using Cohere Rerank 3 or FlashRank before feeding into the prompt.
5. **Context Window vs RAG Decision**: If document sets fit comfortably under 200k tokens and are queried repeatedly, prefer **Native Context Caching** over RAG chunking to eliminate retrieval boundary errors.

#### 5. Native Context Caching (Cost & Latency Optimization)
Leverage provider-native context caching for large, repeated context (>32k tokens):
- **Anthropic**: Use ephemeral prompt caching with `cache_control: { type: "ephemeral" }` on system prompts and tools.
- **OpenAI**: Take advantage of automatic prefix caching for matching prompt prefixes >1024 tokens.
- **Google Gemini**: Explicitly create and reuse cached content via `cachedContent` API for huge repositories, reducing costs up to 90%.

#### 6. Structured Output & Guardrails
- Utilize native Structured Outputs (`response_format: { type: "json_schema" }`) guaranteed by model token-level grammar masks.
- Use Zod schemas to define tool parameters and final structured entities.
- Implement rate limiting, circuit breakers, and semantic caching (Redis / Upstash vector cache) to prevent runaway recursive tool loops.

## Orchestration & Integration
- **`mcp-server-architect`**: Delegate custom MCP server implementation, schema definitions, and transport adapters.
- **`multi-agent-orchestration`**: Delegate complex multi-agent state graphs, swarm workflows, and supervisor patterns.
- **`gemini-agent-booster`**: Delegate Gemini 3.x long-context optimization, Multimodal Live API, and thinking budget controls.
- **`ai-prompt-engineering-expert`**: Delegate advanced prompt design, few-shot calibration, and system prompt evals.
- **`ai-cost-token-optimizer`**: Delegate API cost optimization, model routing, and token budget management.
- **`vector-db-rag-expert`**: Delegate pgvector HNSW indexing and hybrid retrieval fine-tuning.
- **`zero-to-prod-orchestrator`**: Executes this skill during Phase 4 architecture and implementation.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan AI, Model Context Protocol (MCP), model hybrid reasoning, dan Large Language Models (LLM) ke dalam arsitektur perangkat lunak modern. Mencakup penanganan streaming token penalaran, transport MCP Streamable HTTP, arsitektur memori agentik, context caching native, pipeline RAG, dan orkestrasi multi-model.

### Kondisi Pemicu
- Mengintegrasikan model frontier reasoning: Anthropic Claude 3.7 Sonnet (Hybrid/Extended Thinking), Google Gemini 3.8 Flash / 3.1 Pro (Thinking Mode), OpenAI o1 / o3 / o3-mini / GPT-4.5 / GPT-4o, DeepSeek-R1 / V3, atau bobot open-source (Llama 4, Qwen 2.5/3 Coder).
- Mengimplementasikan server atau klien Model Context Protocol (MCP) dengan transport Streamable HTTP atau MCP Sampling.
- Membangun chatbot AI, copilot, atau workflow agen otonom (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 5.x/6.x).
- Mengelola streaming token penalaran (`<think>`) secara terpisah dari output akhir pada tampilan antarmuka pengguna.
- Mengimplementasikan RAG hibrida dengan database vektor (Supabase pgvector HNSW, Qdrant, Pinecone) dan reranker cross-encoder.
- Membangun sistem memori agentik (jangka pendek, semantik jangka panjang, episodik) menggunakan Mem0 atau vector store.
- Menerapkan optimasi biaya dengan Context Caching native provider (Gemini `cachedContent`, Anthropic ephemeral prompt cache, OpenAI prefix cache).

### Matriks Kapabilitas Model (2026)

| Provider | Model | Konteks | Tipe Penalaran | Keunggulan Utama |
|---|---|---|---|---|
| Anthropic | Claude 3.7 Sonnet | 200K | Hybrid Thinking (Standar + Diperpanjang) | Generasi kode, penalaran kompleks, Computer Use |
| Anthropic | Claude 3.5 / 4 Opus | 200K | Deliberasi Mendalam | Sintesis arsitektur mendalam, analisis kebijakan |
| Google | Gemini 3.8 Flash | 1M–2M | Flash Thinking (Budget Terkonfigurasi) | Latensi ultra-rendah, multimodal live, loop cepat |
| Google | Gemini 3.1 / 3.5 Pro | 2M | Extended Reasoning | Needle-in-a-haystack, repo konteks panjang, riset |
| OpenAI | o3 / o3-mini | 200K | Test-Time Reasoning Native | Matematika, competitive coding, verifikasi logika |
| OpenAI | GPT-4.5 / GPT-4o | 128K | Instruksi Langsung & Tooling Cepat | Suara latensi rendah, JSON terstruktur, tool calling |
| DeepSeek | DeepSeek-R1 | 128K | Open Reasoning (Distill & MoE) | Penalaran open weights terdepan, matematika, koding |
| DeepSeek | DeepSeek-V3 | 128K | Teks & Multimodal Umum | Throughput tinggi, sangat hemat biaya untuk coding |
| Qwen | Qwen 2.5 / 3 Coder | 128K | Spesialis Kode Open Source | Agen coding mandiri / self-hosted, copilot lokal |

### Panduan Arsitektur Inti

#### 1. Hybrid Reasoning & Penanganan Token Streaming
Model frontier modern menghasilkan token pemikiran (*thinking tokens*) selama proses penalaran:
- **Pemisahan Token Pemikiran**: Pisahkan blok `<think>` dari output teks akhir. Alirkan proses pemikiran ke dalam accordion UI yang dapat dibuka/tutup, sementara output utama disajikan dengan bersih kepada user.
- **Integrasi Vercel AI SDK 5.x/6.x**: Gunakan event listener `reasoning` pada stream untuk menangkap proses pemikiran model secara terpisah dari `text-delta`.

#### 2. Model Context Protocol (MCP) — Streamable HTTP & Sampling
Standarisasi seluruh komunikasi agen-ke-tool dan agen-ke-host menggunakan spesifikasi MCP:
- **Streamable HTTP Transport**: Standar cloud modern yang mendukung streaming dua arah JSON-RPC via HTTP POST/SSE hybrid tanpa ketergantungan koneksi stdio lokal.
- **MCP Sampling**: Memberikan izin kepada server MCP untuk meminta inferensi LLM kembali ke klien host, memungkinkan alat agentik modular tanpa membagikan API key sensitif.
- **Keamanan & Otorisasi**: Wajibkan bearer token berbasis OAuth 2.1 pada endpoint MCP publik dan validasi skema input dengan Zod.

#### 3. Arsitektur Memori Agentik
- **Memori Kerja In-Context**: Teruskan histori interaksi terbaru di jendela konteks.
- **Memori Semantik Jangka Panjang**: Simpan fakta dan preferensi pengguna di pgvector (indeks HNSW) atau Qdrant dengan pencarian kesamaan kosinus.
- **Memori Episodik (Mem0 / MemGPT)**: Sintesiskan ringkasan sesi secara berkala agar agen memiliki daya ingat historis jangka panjang.
- **Memori Graph Pengetahuan**: Hubungkan entitas relasional dalam basis data graf untuk kueri multi-langkah (*multi-hop reasoning*).

#### 4. Pipeline RAG Lanjutan & Late Chunking
1. **Ingesti Dokumen**: Bagi dokumen secara semantik (500–1000 token, 10% overlap) atau gunakan metode *Late Chunking*.
2. **Embedding**: Gunakan `text-embedding-3-large` atau `gemini-embedding-004`.
3. **Pencarian Hibrida**: Kombinasikan dense vector cosine similarity dengan sparse keyword BM25 / PostgreSQL full-text search.
4. **Cross-Encoder Reranking**: Susun ulang kandidat terbaik menggunakan Cohere Rerank 3 atau FlashRank sebelum diteruskan ke system prompt.
5. **Keputusan Cache vs RAG**: Jika dokumen stabil dan berada di bawah 200k token, utamakan **Context Caching Native** daripada RAG chunking untuk menghindari hilangnya konteks di perbatasan potongan teks.

#### 5. Context Caching Native (Optimasi Biaya & Latensi)
- **Anthropic**: Terapkan prompt caching ephemeral dengan `cache_control: { type: "ephemeral" }`.
- **OpenAI**: Manfaatkan prefix caching otomatis untuk teks berulang >1024 token.
- **Google Gemini**: Buat objek cache eksplisit via API `cachedContent` untuk repositori kode besar guna menghemat hingga 90% biaya input token.

#### 6. Output Terstruktur & Guardrails
- Manfaatkan mode Structured Outputs native model dengan skema Zod untuk menjamin integritas JSON.
- Terapkan rate limiting, circuit breaker, dan semantic caching (Redis / Upstash) untuk mencegah pemanggilan tool secara rekursif tak berujung.

## Integrasi Orkestrasi
- **`mcp-server-architect`**: Delegasikan pembuatan server MCP kustom, definisi skema, dan transport adapter.
- **`multi-agent-orchestration`**: Delegasikan alur kerja graph multi-agen, topologi swarm, dan pattern supervisor.
- **`gemini-agent-booster`**: Delegasikan optimasi long-context Gemini 3.x, Multimodal Live API, dan kontrol thinking budget.
- **`ai-prompt-engineering-expert`**: Delegasikan desain prompt lanjutan, kalibrasi few-shot, dan evaluasi prompt.
- **`ai-cost-token-optimizer`**: Delegasikan optimasi biaya API, routing model cerdas, dan token budget.
- **`vector-db-rag-expert`**: Delegasikan tuning indeks HNSW pgvector dan pencarian hibrida.
- **`zero-to-prod-orchestrator`**: Mengeksekusi skill ini pada Fase 4 perancangan arsitektur dan implementasi.
