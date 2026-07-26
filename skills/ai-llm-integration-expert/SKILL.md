---
name: ai-llm-integration-expert
description: "Expert guide for integrating Large Language Models (LLMs), Model Context Protocol (MCP), RAG architecture, vector databases, and AI agents / Panduan ahli untuk integrasi LLM, Model Context Protocol (MCP), arsitektur RAG, vector database, dan agen AI."
author: "Roedy Rustam"
---

# AI & LLM Integration Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidelines for integrating Artificial Intelligence (AI), Model Context Protocol (MCP), and Large Language Models (LLMs) into modern applications. Covers Retrieval-Augmented Generation (RAG), vector embeddings, token streaming for real-time UI, agentic tool execution, and MCP architecture.

### Trigger Conditions
- Integrating OpenAI (GPT-4o/o3), Anthropic (Claude 3.7/Sonnet), Gemini (3.5/3.6 Pro/Flash), or open-source reasoning models (DeepSeek-R1/V3, Llama 3.3).
- Implementing Model Context Protocol (MCP) server or client integrations.
- Building AI chatbots, copilots, or autonomous AI agent workflows (LangGraph, Vercel AI SDK 4.x/5.x).
- Implementing RAG with vector databases (Supabase `pgvector` with HNSW indexes, Qdrant, Pinecone).
- Handling real-time AI token generation via Server-Sent Events (SSE), Web Streams, or WebSockets.
- Designing AI agents with tool-calling capabilities and strict Zod schema validations.

### Core Architecture Guidelines

#### 1. Model Context Protocol (MCP) Integration
Standardize agent-tool interactions using the Model Context Protocol (MCP):
- **MCP Servers**: Expose tools, resources, and prompt templates over JSON-RPC 2.0 (stdio or SSE transports).
- **Security & Scope**: Validate all incoming parameters with Zod schemas. Enforce strict authorization boundaries before executing tool calls.

#### 2. Advanced RAG (Retrieval-Augmented Generation) Pipeline
Do not rely solely on internal model weights for domain knowledge. Build a production-grade RAG pipeline:
1. **Ingestion**: Chunk long documents (e.g., 500-1000 tokens with 10% overlap, respecting semantic boundary headings).
2. **Embedding**: Convert chunks to vectors using `text-embedding-3-small` or `nomic-embed-text`.
3. **Storage & Hybrid Search**: Store vectors in PostgreSQL using `pgvector` (with HNSW vector index) or Qdrant. Combine vector cosine similarity with full-text keyword search (BM25 / tsvector) for hybrid search retrieval.
4. **Reranking**: Use a cross-encoder reranker (e.g., Cohere Rerank) on top-K results to increase precision.
5. **Generation**: Inject top contextual snippets into the system prompt.

#### 3. Streaming Responses & Vercel AI SDK
- **Backend (Next.js/Bun/FastAPI)**: Pipe stream chunks directly via Web Streams API or SSE.
- **Frontend (React)**: Use Vercel AI SDK (`useChat`, `useCompletion`) or native ReadableStream readers for zero perceived latency.

#### 4. Structured Output & Tool Calling
- Use native Tool/Function Calling APIs with strict JSON schemas via Zod (`zodResponseFormat`).
- Support reasoning/thinking models (e.g., DeepSeek-R1, Gemini 3.5 Thought) by separating internal reasoning tokens `<think>` from client-facing output.

#### 5. Cost & Rate Limit Management
- Monitor token consumption per session and store metrics in telemetry/analytics tables.
- Implement semantic caching using Redis + vector similarity to skip redundant model queries.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan Kecerdasan Buatan (AI), Model Context Protocol (MCP), dan Large Language Models (LLMs) ke dalam aplikasi modern. Panduan ini mencakup RAG (*Retrieval-Augmented Generation*), *vector embeddings*, *streaming* token UI *real-time*, eksekusi *tool* agen AI, dan arsitektur MCP.

### Kondisi Pemicu
- Mengintegrasikan OpenAI (GPT-4o/o3), Anthropic (Claude 3.7), Gemini (3.5/3.6), atau model penalaran open-source (DeepSeek-R1/V3, Llama 3.3).
- Mengimplementasikan integrasi server atau klien Model Context Protocol (MCP).
- Membangun chatbot AI, *copilot*, atau alur kerja agen AI otonom (LangGraph, Vercel AI SDK 4.x/5.x).
- Mengimplementasikan RAG dengan *vector database* (Supabase `pgvector` indeks HNSW, Qdrant, Pinecone).
- Menangani generasi token AI *real-time* via Server-Sent Events (SSE), Web Streams, atau WebSocket.
- Merancang agen AI yang memiliki kemampuan *tool-calling* dengan validasi skema Zod yang ketat.

### Panduan Arsitektur Inti

#### 1. Integrasi Model Context Protocol (MCP)
Strukturkan interaksi antara agen dan alat menggunakan standar MCP:
- **Server MCP**: Sediakan alat (*tools*), sumber daya (*resources*), dan *prompt templates* melalui transport JSON-RPC 2.0 (stdio atau SSE).
- **Keamanan**: Validasi semua parameter masuk menggunakan skema Zod dan berlakukan otorisasi sebelum mengeksekusi fungsi.

#### 2. Pipa RAG Lanjutan (*Retrieval-Augmented Generation*)
1. **Ingesti**: Pecah dokumen (500-1000 token dengan *overlap* 10% berbasis struktur judul semantik).
2. **Embedding**: Ubah teks menjadi vektor (`text-embedding-3-small`).
3. **Penyimpanan & Pencarian Hibrida**: Gunakan Supabase `pgvector` (indeks HNSW) atau Qdrant. Gabungkan pencarian vektor (*cosine similarity*) dengan pencarian teks (*full-text search*) untuk hasil yang lebih akurat.
4. **Reranking**: Terapkan model reranker (misalnya Cohere Rerank) pada hasil pencarian teratas.
5. **Generasi**: Suntikkan potongan konteks terbaik ke dalam *system prompt* LLM.

#### 3. Streaming Respons & Vercel AI SDK
- **Backend**: Alirkan *stream* token menggunakan Web Streams API atau SSE.
- **Frontend**: Gunakan Vercel AI SDK (`useChat`) untuk memberikan pengalaman pengguna yang responsif tanpa jeda.

#### 4. Output Terstruktur & Tool Calling
- Gunakan API Tool Calling bawaan penyedia LLM dengan validasi Zod yang ketat (`zodResponseFormat`).
- Untuk model penalaran (*reasoning models* seperti DeepSeek-R1 atau Gemini 3.5 Thought), pisahkan blok `<think>` internal dari keluaran teks publik.

#### 5. Manajemen Biaya & Rate Limit
- Pantau konsumsi token per sesi dan simpan di tabel telemetri.
- Terapkan *semantic caching* menggunakan Redis + perbandingan vektor untuk menghemat biaya panggilan API.
