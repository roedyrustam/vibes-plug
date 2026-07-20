---
name: ai-llm-integration-expert
description: "Expert guide for integrating Large Language Models (LLMs), RAG architecture, vector databases, and AI agents / Panduan ahli untuk integrasi LLM, arsitektur RAG, vector database, dan agen AI."
author: "Roedy Rustam"
---

# AI & LLM Integration Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides production-grade guidelines for integrating Artificial Intelligence (AI) and Large Language Models (LLMs) into modern applications. It covers Retrieval-Augmented Generation (RAG), vector embeddings, token streaming for real-time UI, and AI agent orchestration.

### Trigger Conditions
- Integrating OpenAI, Anthropic (Claude), Gemini, or open-source models (Llama).
- Building AI chatbots, copilots, or text-summarization features.
- Implementing RAG with vector databases (Pinecone, Supabase `pgvector`, Qdrant).
- Handling long-running AI generation via Server-Sent Events (SSE) or WebSockets.
- Designing AI agents with tool-calling capabilities.

### Core Architecture Guidelines

#### 1. RAG (Retrieval-Augmented Generation) Pipeline
Do not rely on the LLM's internal knowledge for domain-specific tasks. Build a RAG pipeline:
1. **Ingestion**: Chunk long documents (e.g., 500 tokens/chunk with 50-token overlap).
2. **Embedding**: Convert chunks to vectors using `text-embedding-3-small` or `nomic-embed-text`.
3. **Storage**: Store vectors + metadata in a Vector DB (`pgvector` via Supabase is highly recommended if already using PostgreSQL).
4. **Retrieval**: Perform cosine similarity search on the user query's embedding.
5. **Generation**: Inject top-K retrieved chunks into the LLM prompt as context.

#### 2. Streaming Responses (Crucial for UX)
LLM generation is slow. Always stream responses to the frontend to reduce perceived latency.
- **Backend (Next.js/Node/Bun)**: Use the Web Streams API to pipe the LLM stream directly to the response object.
- **Frontend (React)**: Use libraries like `ai` (Vercel AI SDK) or handle Server-Sent Events (SSE) natively. Show partial text and markdown rendering dynamically.

#### 3. Structured Output & Tool Calling
When you need the LLM to return data (JSON) or take actions:
- **Do not parse raw text**. Use the LLM provider's native "Tool Calling" or "Function Calling" APIs.
- Provide strict JSON schemas (using Zod) to enforce the shape of the output.
- For open-source models, use libraries like `instructor` or `outlines`.

#### 4. Cost & Rate Limit Management
- Track token usage in a database on every request.
- Implement aggressive rate-limiting per user (e.g., 10 AI requests/minute for Pro tier, 2 for Free tier).
- Implement semantic caching (caching responses for similar queries) using Redis + Vector similarity to save API costs.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan panduan tingkat produksi untuk mengintegrasikan Kecerdasan Buatan (AI) dan Large Language Models (LLMs) ke dalam aplikasi modern. Panduan ini mencakup RAG (*Retrieval-Augmented Generation*), *vector embeddings*, *streaming* token untuk UI *real-time*, dan orkestrasi agen AI.

### Kondisi Pemicu
- Mengintegrasikan OpenAI, Anthropic (Claude), Gemini, atau model open-source (Llama).
- Membangun chatbot AI, *copilot*, atau fitur peringkasan teks.
- Mengimplementasikan RAG dengan *vector database* (Pinecone, Supabase `pgvector`, Qdrant).
- Menangani generasi AI berdurasi panjang melalui Server-Sent Events (SSE) atau WebSocket.
- Merancang agen AI yang memiliki kemampuan memanggil alat (*tool-calling*).

### Panduan Arsitektur Inti

#### 1. Pipa RAG (*Retrieval-Augmented Generation*)
Jangan mengandalkan pengetahuan internal LLM untuk tugas spesifik domain. Bangun pipa RAG:
1. **Ingesti**: Pecah dokumen panjang menjadi potongan-potongan (*chunk*) (mis. 500 token/chunk dengan *overlap* 50 token).
2. **Embedding**: Ubah potongan tersebut menjadi vektor (menggunakan `text-embedding-3-small`).
3. **Penyimpanan**: Simpan vektor beserta metadatanya di Vector DB (Sangat disarankan menggunakan `pgvector` di Supabase jika sudah memakai PostgreSQL).
4. **Pencarian (Retrieval)**: Lakukan pencarian *cosine similarity* terhadap *embedding* dari *query* pengguna.
5. **Generasi**: Suntikkan potongan teratas (Top-K) ke dalam *prompt* LLM sebagai konteks.

#### 2. Streaming Respons (Sangat Penting untuk UX)
Pembuatan teks oleh LLM membutuhkan waktu. Selalu gunakan metode *streaming* ke frontend untuk mengurangi *perceived latency* (rasa lambat).
- **Backend (Next.js/Node/Bun)**: Gunakan Web Streams API untuk mengalirkan *stream* LLM langsung ke objek respons.
- **Frontend (React)**: Gunakan library seperti `ai` (Vercel AI SDK) atau tangani Server-Sent Events (SSE) secara *native*. Tampilkan teks parsial secara dinamis.

#### 3. Output Terstruktur & Tool Calling
Jika LLM perlu mengembalikan data (JSON) atau melakukan tindakan:
- **Jangan mem-parsing teks mentah**. Gunakan API "Tool Calling" atau "Function Calling" bawaan dari penyedia LLM.
- Berikan skema JSON yang ketat (menggunakan Zod) untuk memaksa format *output*.

#### 4. Manajemen Biaya & Rate Limit
- Lacak penggunaan token (Token Usage) dalam database pada setiap permintaan.
- Terapkan *rate-limiting* yang ketat per pengguna (misalnya, 10 permintaan AI/menit untuk tier Pro, 2 untuk tier Free).
- Implementasikan *semantic caching* (menyimpan respons untuk *query* yang mirip secara semantik) menggunakan Redis + Vector similarity untuk menghemat biaya API.
