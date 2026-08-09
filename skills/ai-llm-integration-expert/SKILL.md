---
name: ai-llm-integration-expert
description: "Expert guide for integrating Large Language Models (LLMs), Model Context Protocol (MCP), RAG architecture, vector databases, and AI agents / Panduan ahli untuk integrasi LLM, Model Context Protocol (MCP), arsitektur RAG, vector database, dan agen AI."
author: "Roedy Rustam"
---

# AI & LLM Integration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidelines for integrating AI, Model Context Protocol (MCP), and Large Language Models (LLMs) into modern applications. Covers RAG pipelines, vector embeddings, real-time token streaming, agentic tool execution, memory architectures, prompt caching, and multi-model orchestration.

### Trigger Conditions
- Integrating frontier models: **OpenAI GPT-4o / GPT-4.1 / GPT-5**, **Anthropic Claude 3.7 / Claude 4 Sonnet/Opus**, **Google Gemini 3.1 Pro/Flash/Ultra**, or open-source models (DeepSeek-V3/R2, Llama 4, Qwen 3).
- Implementing **Model Context Protocol (MCP)** server or client integrations (MCP 1.9+).
- Building AI chatbots, copilots, or **autonomous AI agent workflows** (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 4.x/5.x).
- Building **agentic memory** systems (short-term, long-term, episodic) using Mem0, MemGPT, or Supabase-backed memory stores.
- Implementing RAG with vector databases (Supabase `pgvector` HNSW, Qdrant, Pinecone, Weaviate).
- Handling real-time AI token streaming via **SSE**, **Web Streams**, or **WebSockets**.
- Designing AI agents with **tool-calling**, **computer use** (browser/OS automation), or **code interpreter** capabilities.

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
Standardize agent-tool interactions using MCP. The 2026 standard adds **Streamable HTTP transport** alongside stdio/SSE:
- **MCP Servers**: Expose tools, resources, and prompt templates over JSON-RPC 2.0.
- **Streamable HTTP**: New default transport for cloud-hosted MCP servers — supports bidirectional streaming without long-polling.
- **Security & Scope**: Validate all incoming parameters with Zod schemas. Enforce strict authorization boundaries before executing tool calls.
- **Tool namespacing**: Use `domain/action` naming (`files/read`, `db/query`) to avoid collisions in multi-server environments.

#### 2. AI Agents SDK Landscape (2026)
Choose the right agentic framework based on your needs:

| Framework | Best For | Key Feature |
|---|---|---|
| **OpenAI Agents SDK** | GPT-5 native agents | Handoffs, guardrails, tracing built-in |
| **Google ADK** | Gemini-powered agents | Multi-agent, streaming, Vertex AI integration |
| **LangGraph** | Complex stateful workflows | Graph-based, human-in-the-loop, any LLM |
| **Mastra.ai** | TypeScript-first agents | Built-in memory, evals, RAG |
| **Vercel AI SDK 5.x** | Streaming UI + agents | RSC streaming, multi-provider, tool-calling |

#### 3. Agentic Memory Architecture
Production AI agents require persistent memory across sessions:
- **Short-term (In-context)**: Pass recent conversation turns in the prompt window.
- **Long-term (Vector Store)**: Store user preferences and past interactions as embeddings in `pgvector` or Qdrant; retrieve with semantic similarity.
- **Episodic (Episodic Memory)**: Use **Mem0** or **MemGPT** to give agents human-like recall — automatically summarizes and indexes past interactions.
- **Structured (Knowledge Graph)**: Use a graph DB (Neo4j, Kuzu) for entity relationships and factual memory.

#### 4. Advanced RAG (Retrieval-Augmented Generation) Pipeline
Build a production-grade RAG pipeline with hybrid search:
1. **Ingestion**: Chunk documents (500-1000 tokens, 10% overlap, respect semantic headings).
2. **Embedding**: Use `text-embedding-3-large` (OpenAI), `gemini-embedding-004` (Google), or `nomic-embed-text` (open-source).
3. **Storage & Hybrid Search**: PostgreSQL `pgvector` (HNSW index) or Qdrant. Combine vector cosine similarity with BM25 full-text search for hybrid retrieval.
4. **Reranking**: Apply cross-encoder reranker (Cohere Rerank 3, FlashRank) on top-K results.
5. **Generation**: Inject top contextual snippets into the system prompt with source citations.

#### 5. Prompt Caching (Cost Optimization)
Reduce costs by 80-90% on repeated long prompts using provider-native caching:
- **Anthropic**: Automatic prompt caching for prompts > 1024 tokens (marked with `cache_control: {"type": "ephemeral"}`).
- **OpenAI**: Automatic prefix caching for prompts > 1024 tokens in GPT-4o and later models.
- **Google**: Context caching in Gemini API via `cachedContent` for large system prompts or documents.

#### 6. Streaming Responses & Vercel AI SDK 5.x
- **Backend (Next.js/Bun/FastAPI)**: Pipe stream chunks via Web Streams API or SSE.
- **Frontend (React)**: Use Vercel AI SDK `useChat` / `useCompletion` for zero perceived latency.
- **RSC Streaming**: Use AI SDK 5.x `streamUI` to stream React components from the server — agent-rendered UI.

#### 7. Computer Use & Browser Agents
Modern agents can control browsers and operating systems:
- **Anthropic Computer Use**: Claude 4 can take screenshots and control mouse/keyboard (ideal for browser automation).
- **Browser-Use**: Open-source library for browser-controlling agents with any LLM.
- **Playwright MCP Server**: Expose a full browser to AI agents via MCP tools (`navigate`, `click`, `screenshot`).

#### 8. Structured Output & Tool Calling
- Use native Tool/Function Calling APIs with strict JSON schemas via Zod (`zodResponseFormat`).
- Prefer **structured output mode** over prompt engineering for JSON — guaranteed schema conformance.
- Support reasoning models (DeepSeek-R2, Gemini 3.1 Pro Thinking, Claude 4 extended thinking) by separating internal `<think>` tokens from client-facing output.

#### 9. Cost & Rate Limit Management
- Monitor token consumption per session; store metrics in telemetry tables.
- Implement **semantic caching** using Redis + vector similarity to skip redundant model queries.
- Use **batch APIs** (OpenAI Batch, Anthropic Message Batches) for async, high-volume workloads at 50% cost reduction.

#### 10. Skill Orchestration & Handoff
- **Upstream Orchestrator**: Executes during **Phase 4** of `zero-to-prod-orchestrator` or after AI decision lock in `brainstorming`.
- **MCP Server Architecture**: Delegate custom MCP server creation to `mcp-server-architect` and payment tools to `doku-mcp-server`.
- **Multi-Agent & Swarm Workflows**: Delegate complex agent state graphs to `multi-agent-orchestration` and Gemini long-context optimization to `gemini-agent-booster`.
- **Vector DB & Hybrid Search**: Delegate pgvector indexing and hybrid search tuning to `vector-db-rag-expert`.
- **Token Budget & FinOps**: Delegate API cost optimization and prompt caching strategies to `ai-cost-token-optimizer`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan AI, Model Context Protocol (MCP), dan LLM ke dalam aplikasi modern. Mencakup pipeline RAG, streaming token real-time, eksekusi tool agen AI, arsitektur memori, prompt caching, dan orkestrasi multi-model.

### Kondisi Pemicu
- Mengintegrasikan model frontier: GPT-4.1 / GPT-5, Claude 4 Sonnet/Opus, Gemini 3.1 Pro/Flash, atau model open-source (Llama 4, DeepSeek-V3/R2).
- Mengimplementasikan server/klien MCP (v1.9+ dengan Streamable HTTP transport).
- Membangun chatbot AI, copilot, atau alur kerja agen otonom (OpenAI Agents SDK, Google ADK, LangGraph, Mastra.ai).
- Membangun sistem **memori agentik** (jangka pendek, jangka panjang, episodik) menggunakan Mem0 atau pgvector.
- Mengimplementasikan RAG dengan vector database.
- Merancang agen AI dengan tool-calling, Computer Use, atau code interpreter.

### Panduan Arsitektur Inti

#### 1. Integrasi MCP (v1.9+)
Standarisasi interaksi agen-tool menggunakan MCP. Standar 2026 menambahkan **Streamable HTTP transport** — transport default baru untuk MCP server yang di-host di cloud, mendukung streaming dua arah tanpa long-polling.

#### 2. Ekosistem Agents SDK (2026)
- **OpenAI Agents SDK**: Handoffs, guardrails, dan tracing bawaan untuk agen berbasis GPT-5.
- **Google ADK**: Multi-agen, streaming, integrasi Vertex AI untuk agen Gemini.
- **LangGraph**: Alur kerja stateful berbasis graph dengan dukungan human-in-the-loop.
- **Mastra.ai**: Framework TypeScript-first dengan memori, evaluasi, dan RAG bawaan.
- **Vercel AI SDK 5.x**: Streaming UI + agen dengan dukungan multi-provider dan RSC.

#### 3. Arsitektur Memori Agentik
- **Jangka Pendek**: Riwayat percakapan recent dalam context window.
- **Jangka Panjang (Vector Store)**: Preferensi dan interaksi masa lalu sebagai embedding di pgvector atau Qdrant.
- **Episodik**: Gunakan Mem0 atau MemGPT untuk recall mirip manusia — otomatis merangkum dan mengindeks interaksi lalu.
- **Terstruktur (Knowledge Graph)**: Gunakan graph DB (Neo4j, Kuzu) untuk relasi entitas dan memori faktual.

#### 4. Pipeline RAG Lanjutan
1. Chunking dokumen (500-1000 token, 10% overlap).
2. Embedding dengan `text-embedding-3-large` atau `gemini-embedding-004`.
3. Penyimpanan & pencarian hibrida: pgvector (HNSW) + BM25.
4. Reranking dengan Cohere Rerank 3 atau FlashRank.
5. Injeksi konteks terbaik ke system prompt.

#### 5. Prompt Caching (Optimasi Biaya)
Kurangi biaya 80-90% dengan caching prompt panjang:
- **Anthropic**: Caching otomatis untuk prompt > 1024 token.
- **OpenAI**: Prefix caching otomatis di GPT-4o ke atas.
- **Google**: Context caching di Gemini API via `cachedContent`.

#### 6. Streaming & Vercel AI SDK 5.x
Gunakan `useChat` / `useCompletion` untuk zero perceived latency di sisi klien. Gunakan `streamUI` di AI SDK 5.x untuk stream komponen React dari server (agent-rendered UI).

#### 7. Computer Use & Browser Agents
Claude 4 dapat mengambil screenshot dan mengontrol mouse/keyboard. Gunakan **Browser-Use** atau **Playwright MCP Server** untuk memberi agen kontrol atas browser.

#### 8. Output Terstruktur & Tool Calling
Gunakan mode structured output (bukan prompt engineering) untuk jaminan kesesuaian skema JSON. Gunakan Zod (`zodResponseFormat`) untuk validasi type-safe.

#### 9. Manajemen Biaya
- Pantau konsumsi token per sesi di tabel telemetri.
- Terapkan semantic caching dengan Redis + vektor.
- Gunakan Batch API (OpenAI / Anthropic) untuk workload async volume tinggi dengan biaya 50% lebih hemat.

#### 10. Orkestrasi Skill & Serah Terima
- **Orkestrator Utama**: Dieksekusi pada **Fase 4** dari `zero-to-prod-orchestrator` atau setelah finalisasi arsitektur AI di `brainstorming`.
- **Arsitektur MCP Server**: Delegasikan pembuatan MCP server ke `mcp-server-architect` dan integrasi pembayaran ke `doku-mcp-server`.
- **Multi-Agent & Swarm Workflows**: Delegasikan alur state graph kompleks ke `multi-agent-orchestration` dan optimasi long-context Gemini ke `gemini-agent-booster`.
- **Vector DB & Hybrid Search**: Delegasikan indeks pgvector dan pencarian hibrida ke `vector-db-rag-expert`.
- **Token Budget & FinOps**: Delegasikan optimasi biaya API dan caching prompt ke `ai-cost-token-optimizer`.
