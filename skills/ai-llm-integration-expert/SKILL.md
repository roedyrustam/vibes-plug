---
name: ai-llm-integration-expert
description: "Expert guide for integrating Large Language Models (LLMs), Model Context Protocol (MCP), RAG architecture, vector databases, and AI agents / Panduan ahli untuk integrasi LLM, Model Context Protocol (MCP), arsitektur RAG, vector database, dan agen AI."
author: "vibes-plug-swarm"
---

# AI & LLM Integration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidelines for integrating AI, Model Context Protocol (MCP), and Large Language Models (LLMs) into modern applications. Covers RAG pipelines, vector embeddings, real-time token streaming, agentic tool execution, memory architectures, prompt caching, and multi-model orchestration.

### Trigger Conditions
- Integrating frontier models: OpenAI GPT-4o / GPT-4.1 / GPT-5, Anthropic Claude 3.7 / Claude 4 Sonnet/Opus, Google Gemini 3.1 Pro/Flash/Ultra, or open-source models (DeepSeek-V3/R2, Llama 4, Qwen 3).
- Implementing Model Context Protocol (MCP) server or client integrations (MCP 1.9+).
- Building AI chatbots, copilots, or autonomous AI agent workflows (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 4.x/5.x).
- Building agentic memory systems (short-term, long-term, episodic) using Mem0, MemGPT, or Supabase-backed memory stores.
- Implementing RAG with vector databases (Supabase pgvector HNSW, Qdrant, Pinecone, Weaviate).
- Handling real-time AI token streaming via SSE, Web Streams, or WebSockets.
- Designing AI agents with tool-calling, computer use (browser/OS automation), or code interpreter capabilities.

### Model Capability Matrix (2026)
| Provider | Model | Context | Strengths |
|---|---|---|---|
| OpenAI | GPT-4o / GPT-4.1 | 128K | Multimodal, tool-calling, speed |
| OpenAI | GPT-5 | 1M+ | Reasoning, agentic tasks |
| Anthropic | Claude 4 Sonnet | 200K | Coding, long documents, Computer Use |
| Anthropic | Claude 4 Opus | 200K | Complex reasoning, deep analysis |
| Google | Gemini 3.1 Flash | 2M | Speed, cost efficiency, multimodal |
| Google | Gemini 3.1 Pro | 2M | Code, reasoning, deep research |
| Meta | Llama 4 Scout/Maverick | 512K | Open-source, self-hosted |
| DeepSeek | V3 / R2 | 128K | Code, math, cost-efficient |

### Core Architecture Guidelines

#### 1. Model Context Protocol (MCP) Integration (v1.9+)
Standardize agent-tool interactions using MCP. The 2026 standard adds Streamable HTTP transport alongside stdio/SSE:
- MCP Servers: Expose tools, resources, and prompt templates over JSON-RPC 2.0.
- Streamable HTTP: New default transport for cloud-hosted MCP servers — supports bidirectional streaming without long-polling.
- Security & Scope: Validate all incoming parameters with Zod schemas. Enforce strict authorization boundaries before executing tool calls.
- Tool namespacing: Use `domain/action` naming (`files/read`, `db/query`) to avoid collisions in multi-server environments.

#### 2. AI Agents SDK Landscape (2026)
Choose the right agentic framework based on your needs:
- OpenAI Agents SDK: GPT-5 native agents. Handoffs, guardrails, tracing built-in.
- Google ADK: Gemini-powered agents. Multi-agent, streaming, Vertex AI integration.
- LangGraph: Complex stateful workflows. Graph-based, human-in-the-loop, any LLM.
- Mastra.ai: TypeScript-first agents. Built-in memory, evals, RAG.
- Vercel AI SDK 5.x: Streaming UI + agents. RSC streaming, multi-provider, tool-calling.

#### 3. Agentic Memory Architecture
Production AI agents require persistent memory across sessions:
- Short-term (In-context): Pass recent conversation turns in the prompt window.
- Long-term (Vector Store): Store user preferences and past interactions as embeddings in pgvector or Qdrant; retrieve with semantic similarity.
- Episodic (Episodic Memory): Use Mem0 or MemGPT to give agents human-like recall — automatically summarizes and indexes past interactions.
- Structured (Knowledge Graph): Use a graph DB (Neo4j, Kuzu) for entity relationships and factual memory.

#### 4. Advanced RAG (Retrieval-Augmented Generation) Pipeline
Build a production-grade RAG pipeline with hybrid search:
1. Ingestion: Chunk documents (500-1000 tokens, 10% overlap, respect semantic headings).
2. Embedding: Use `text-embedding-3-large` (OpenAI), `gemini-embedding-004` (Google), or `nomic-embed-text` (open-source).
3. Storage & Hybrid Search: PostgreSQL pgvector (HNSW index) or Qdrant. Combine vector cosine similarity with BM25 full-text search for hybrid retrieval.
4. Reranking: Apply cross-encoder reranker (Cohere Rerank 3, FlashRank) on top-K results.
5. Generation: Inject top contextual snippets into the system prompt with source citations.

#### 5. Prompt Caching (Cost Optimization)
Reduce costs by 80-90% on repeated long prompts using provider-native caching:
- Anthropic: Automatic prompt caching for prompts > 1024 tokens (marked with `cache_control: {"type": "ephemeral"}`).
- OpenAI: Automatic prefix caching for prompts > 1024 tokens in GPT-4o and later models.
- Google: Context caching in Gemini API via `cachedContent` for large system prompts or documents.

#### 6. Streaming Responses & Vercel AI SDK 5.x
- Backend (Next.js/Bun/FastAPI): Pipe stream chunks via Web Streams API or SSE.
- Frontend (React): Use Vercel AI SDK `useChat` / `useCompletion` for zero perceived latency.
- RSC Streaming: Use AI SDK 5.x `streamUI` to stream React components from the server — agent-rendered UI.

#### 7. Computer Use & Browser Agents
Modern agents can control browsers and operating systems:
- Anthropic Computer Use: Claude 4 can take screenshots and control mouse/keyboard.
- Browser-Use: Open-source library for browser-controlling agents with any LLM.
- Playwright MCP Server: Expose a full browser to AI agents via MCP tools (`navigate`, `click`, `screenshot`).

#### 8. Structured Output & Tool Calling
- Use native Tool/Function Calling APIs with strict JSON schemas via Zod (`zodResponseFormat`).
- Prefer structured output mode over prompt engineering for JSON — guaranteed schema conformance.
- Support reasoning models (DeepSeek-R2, Gemini 3.1 Pro Thinking, Claude 4 extended thinking) by separating internal `<think>` tokens from client-facing output.

#### 9. Cost & Rate Limit Management
- Monitor token consumption per session; store metrics in telemetry tables.
- Implement semantic caching using Redis + vector similarity to skip redundant model queries.
- Use batch APIs (OpenAI Batch, Anthropic Message Batches) for async, high-volume workloads at 50% cost reduction.

## Orchestration & Integration
- **`mcp-server-architect`**: Delegate custom MCP server creation and architecture.
- **`multi-agent-orchestration`**: Delegate complex agent state graphs and swarm workflows.
- **`ai-prompt-engineering-expert`**: Delegate advanced prompt design and evals.
- **`ai-cost-token-optimizer`**: Delegate API cost optimization and prompt caching strategies.
- **`vector-db-rag-expert`**: Delegate pgvector indexing and hybrid search tuning.
- **`doku-mcp-server`**: Delegate payment integration tools via MCP.
- **`gemini-agent-booster`**: Delegate Gemini long-context optimization.
- **`zero-to-prod-orchestrator`**: Executes this skill during Phase 4 or after AI decision lock in `brainstorming`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan AI, Model Context Protocol (MCP), dan LLM ke dalam aplikasi modern. Mencakup pipeline RAG, streaming token real-time, eksekusi tool agen AI, arsitektur memori, prompt caching, dan orkestrasi multi-model.

### Kondisi Pemicu
- Mengintegrasikan model frontier: GPT-4o / GPT-4.1 / GPT-5, Claude 3.7 / Claude 4 Sonnet/Opus, Gemini 3.1 Pro/Flash/Ultra, atau model open-source (DeepSeek-V3/R2, Llama 4, Qwen 3).
- Mengimplementasikan server/klien MCP (v1.9+ dengan Streamable HTTP transport).
- Membangun chatbot AI, copilot, atau alur kerja agen otonom (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 4.x/5.x).
- Membangun sistem memori agentik (jangka pendek, jangka panjang, episodik) menggunakan Mem0, MemGPT, atau pgvector.
- Mengimplementasikan RAG dengan vector database (Supabase pgvector HNSW, Qdrant, Pinecone).
- Menangani streaming token AI real-time via SSE, Web Streams, atau WebSockets.
- Merancang agen AI dengan tool-calling, Computer Use (otomatisasi browser/OS), atau code interpreter.

### Panduan Arsitektur Inti

#### 1. Integrasi MCP (v1.9+)
Standarisasi interaksi agen-tool menggunakan MCP. Standar 2026 menambahkan Streamable HTTP transport — transport default baru untuk MCP server yang di-host di cloud, mendukung streaming dua arah tanpa long-polling. Validasi parameter masuk dengan skema Zod dan tegakkan batas otorisasi ketat.

#### 2. Ekosistem Agents SDK (2026)
Pilih framework agentik yang tepat:
- OpenAI Agents SDK: Agen berbasis GPT-5. Handoffs, guardrails, tracing bawaan.
- Google ADK: Agen bertenaga Gemini. Multi-agen, streaming, integrasi Vertex AI.
- LangGraph: Alur kerja stateful kompleks. Berbasis graph, human-in-the-loop, LLM apa saja.
- Mastra.ai: Agen TypeScript-first. Memori bawaan, evaluasi, RAG.
- Vercel AI SDK 5.x: Streaming UI + agen. RSC streaming, multi-provider, tool-calling.

#### 3. Arsitektur Memori Agentik
- Jangka Pendek (In-context): Teruskan riwayat percakapan terbaru di prompt window.
- Jangka Panjang (Vector Store): Simpan preferensi pengguna dan interaksi lampau sebagai embedding di pgvector atau Qdrant.
- Episodik (Episodic Memory): Gunakan Mem0 atau MemGPT untuk recall mirip manusia — merangkum dan mengindeks interaksi otomatis.
- Terstruktur (Knowledge Graph): Gunakan graph DB (Neo4j, Kuzu) untuk relasi entitas.

#### 4. Pipeline RAG Lanjutan
Bangun pipeline RAG tingkat produksi:
1. Ingestion: Chunking dokumen (500-1000 token, 10% overlap).
2. Embedding: Gunakan `text-embedding-3-large`, `gemini-embedding-004`, atau `nomic-embed-text`.
3. Penyimpanan & Pencarian Hibrida: pgvector (HNSW) atau Qdrant. Gabungkan kesamaan kosinus vektor dengan pencarian teks penuh BM25.
4. Reranking: Terapkan cross-encoder reranker (Cohere Rerank 3, FlashRank).
5. Generation: Injeksi snippet konteks terbaik ke system prompt dengan sitasi sumber.

#### 5. Prompt Caching (Optimasi Biaya)
Kurangi biaya 80-90% dengan caching prompt panjang:
- Anthropic: Caching otomatis untuk prompt > 1024 token.
- OpenAI: Prefix caching otomatis di GPT-4o ke atas.
- Google: Context caching di Gemini API via `cachedContent`.

#### 6. Streaming & Vercel AI SDK 5.x
- Backend: Alirkan chunk via Web Streams API atau SSE.
- Frontend: Gunakan `useChat` / `useCompletion` untuk latensi nol yang dirasakan.
- RSC Streaming: Gunakan `streamUI` di AI SDK 5.x untuk stream komponen React dari server.

#### 7. Computer Use & Browser Agents
Agen modern dapat mengontrol browser dan OS:
- Anthropic Computer Use: Claude 4 dapat mengambil screenshot dan mengontrol mouse/keyboard.
- Browser-Use: Pustaka open-source untuk kontrol browser dengan LLM apa saja.
- Playwright MCP Server: Beri agen kontrol atas browser melalui tool MCP.

#### 8. Output Terstruktur & Tool Calling
- Gunakan API Tool/Function Calling native dengan skema JSON ketat via Zod (`zodResponseFormat`).
- Utamakan mode structured output untuk jaminan kesesuaian skema JSON.
- Dukung model reasoning (DeepSeek-R2, Gemini 3.1 Pro Thinking, Claude 4) dengan memisahkan token internal `<think>` dari output klien.

#### 9. Manajemen Biaya & Rate Limit
- Pantau konsumsi token per sesi di tabel telemetri.
- Terapkan semantic caching dengan Redis + vektor untuk melewati query duplikat.
- Gunakan Batch API untuk workload async bervolume tinggi dengan pengurangan biaya 50%.

## Integrasi Orkestrasi
- **`mcp-server-architect`**: Delegasikan pembuatan dan arsitektur custom MCP server.
- **`multi-agent-orchestration`**: Delegasikan alur state graph agen kompleks dan swarm workflows.
- **`ai-prompt-engineering-expert`**: Delegasikan desain prompt lanjutan dan evaluasi.
- **`ai-cost-token-optimizer`**: Delegasikan optimasi biaya API dan strategi prompt caching.
- **`vector-db-rag-expert`**: Delegasikan indexing pgvector dan tuning pencarian hibrida.
- **`doku-mcp-server`**: Delegasikan integrasi tool pembayaran via MCP.
- **`gemini-agent-booster`**: Delegasikan optimasi long-context Gemini.
- **`zero-to-prod-orchestrator`**: Mengeksekusi skill ini pada Fase 4 atau setelah finalisasi keputusan AI di `brainstorming`.
