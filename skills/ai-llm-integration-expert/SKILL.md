---
name: ai-llm-integration-expert
description: "LLM integration, MCP v1.x protocols, hybrid reasoning, and RAG / Integrasi LLM, protokol MCP v1.x, hybrid reasoning, dan RAG."
author: "Roedy Rustam"
version: "4.4.2"

---

# AI & LLM Integration Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Frontier Models & Providers**: `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`, `pydantic-ai-expert`
- **MCP Ecosystem**: `mcp-server-architect`, `mcp-sampling-critic`, `doku-mcp-server`
- **Multi-Agent & Tooling**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `speculative-multi-draft-synthesizer`, `synthetic-data-finetuning-expert` (QLoRA/DPO domain fine-tuning & distillation)
- **Memory & Retrieval**: `agentic-memory-architect`, `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `local-slm-edge-ai-expert`
- **Optimization & FinOps**: `kv-cache-prefix-optimizer`, `thinking-budget-orchestrator`, `llm-finops-router`, `context-window-engineer`
- **Safety, Governance & Quality**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `ai-prompt-engineering-expert`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production-grade guidelines for integrating AI, Model Context Protocol (MCP), hybrid reasoning models, and Large Language Models (LLMs) into modern software architectures. Covers hybrid reasoning token streaming, Streamable HTTP MCP transports, agentic memory architectures, native context caching, RAG pipelines, and multi-model orchestration.

### Trigger Conditions
- Integrating frontier reasoning models: xAI Grok 4.7 High Fast / Grok 4.6, Cursor Composer 2.5 Fast, Anthropic Claude Opus 5.5 Medium / Claude Sonnet 5.5 High / Claude Fable 5.1, Google Gemini 4 Argon Medium / Gemini 4 Pro / Project Astra, OpenAI GPT-5.6 Sol Medium / GPT-5 / o3, Muse Wonder High, or DeepSeek-R1 / Pro / V3.
- Implementing Model Context Protocol (MCP) server or client integrations with Streamable HTTP transport or MCP Sampling.
- Building AI chatbots, copilots, or autonomous AI agent workflows (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 5.x/6.x).
- Managing streaming reasoning tokens (`<think>` chunks) separately from final output in user interfaces.
- Implementing hybrid RAG with vector databases (Supabase pgvector HNSW, Qdrant, Pinecone) and cross-encoder rerankers.
- Building agentic memory systems (short-term, long-term semantic, episodic) using Mem0 or vector stores.
- Implementing cost optimization with provider-native Context Caching (Gemini `cachedContent`, Anthropic ephemeral prompt cache, OpenAI prefix cache).

### Model Capability Matrix (Late-2026 Frontier Edition)

| Provider | Model | Tier | Context | Reasoning Type | Primary Strength |
|---|---|---|---|---|---|
| xAI | Grok 4.7 High Fast | High Fast | 256K | Sub-second Real-Time Compute | Lightning TTFT, live web search, rapid test-debug loops |
| xAI | Grok 4.6 High Fast | High Fast | 128K | High-Throughput Reasoning | Fast unit testing, code linting, micro-benchmark verification |
| Cursor | Composer 2.5 Fast | Fast | 200K | Native AST Diff Engine | Multi-file synchronized refactoring, zero-breakage diff generation |
| Google | Gemini 4 Argon | Medium | 2M+ | Monolithic Balanced Reasoning | 2M+ whole-repo context, native caching, fullstack feature synthesis |
| Google | Gemini 3.8 Flash (Fallback) | Fast/Medium | 1M+ | Flash Thinking (Dynamic Budget) | Fallback for Gemini 4; ultra-low latency (<100ms TTFT), subagent swarms |
| OpenAI | GPT-5.6 Sol | Medium | 500K | Strict Schema & Contract Enforcement | Flawless tool-calling, OpenAPI validation, PRM verification |
| Anthropic | Claude Opus 5.5 | Medium | 500K | Balanced Deep Comprehension | High-level architectural analysis, complex domain modeling |
| Anthropic | Claude Opus 4.6 (Fallback) | Medium | 200K | Hybrid Deep Reasoning | Fallback for Claude Opus 5.5; deep architectural comprehension |
| Anthropic | Claude Sonnet 5.5 | High | 500K | Extended Thinking (64K) | Flagship fullstack craftsmanship, zero-slop code, formal verification |
| Anthropic | Claude Fable 5.1 | High | 500K | Terminal-Bench SOTA & Cache-Pinning | Agentic terminal execution, 45% cheaper cache reads, VPC safety |
| Muse | Muse Wonder | High | 300K | Exploratory & Generative Design | Creative architecture synthesis, innovative generative UI layouts |
| Google | Gemini 4 Pro | High | 2M–10M | Monolithic Multimodal Live | Long-context deep research, spatial audio/video, massive repo audits |
| DeepSeek | DeepSeek-R1 / Pro | High | 128K | Open Weights Reasoning | High-power mathematical algorithms, complex AST transformation |

### Core Architecture Guidelines

#### 1. Hybrid Reasoning & Streaming Token Handling
Modern frontier models emit internal thinking/reasoning tokens during test-time compute:
- **Thinking Token Separation**: Separate internal `<think>` or reasoning chunks from conversational output. Stream reasoning into collapsible UI accordion blocks while presenting clean output to the user.
- **Vercel AI SDK 5.x/6.x Integration**:
  ```typescript
  import { streamText } from 'ai';
  import { anthropic } from '@ai-sdk/anthropic';

  // Availability Fallback Invariant: Claude Sonnet 5.5 / Opus 5.5 -> Claude Opus 4.6
  const getThinkingModel = () => {
    try {
      return anthropic('claude-sonnet-5.5');
    } catch {
      return anthropic('claude-opus-4.6');
    }
  };

  const result = streamText({
    model: getThinkingModel(),
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
- **Thinking Token Overflow Handling**: If `max_tokens` cuts off reasoning before output generation (e.g., `<think>` block doesn't close), detect missing closing tags and dynamically increase budget/retry or append a forceful closing prompt block.
- **Multi-Provider Thinking Configuration**: Use Anthropic `thinking` parameter (`budgetTokens`), Google `thinkingConfig` (set to `true` with budget logic), and OpenAI reasoning tokens (via `reasoning_effort: "high"`).

#### 2. Model Context Protocol (MCP) — Streamable HTTP & Sampling
Standardize all agent-tool and agent-host communications using MCP specifications:
- **Streamable HTTP Transport**: Modern cloud deployments use Streamable HTTP (bidirectional JSON-RPC streaming over HTTP POST/SSE hybrid) instead of fragile stdio connections.
- **MCP Sampling**: Allow MCP servers to request LLM completions back from the host client, enabling nested agentic tools without distributing API keys to tool servers.
- **Authorization & Security**: Enforce OAuth 2.1 scoped bearer tokens on remote MCP endpoints. Validate all incoming tool inputs using strict Zod schemas.

#### 3. Agentic Memory Architecture
Production AI agents require multi-layered memory:
- **In-Context Working Memory**: Pass recent turn messages within the prompt window.
- **Long-Term Semantic Memory**: Embed user preferences and facts using pgvector (HNSW index) or Qdrant; perform cosine similarity searches.
- **Episodic Memory (Mem0 / Letta (formerly MemGPT))**: Automatically synthesize session checkpoints and index past user decisions for human-like recall.
- **Knowledge Graph Memory**: Maintain structured entity-relationship triples (using Graph DB or relational junction tables) for multi-hop relationship retrieval.

#### 4. Advanced RAG & Late Chunking Pipeline
Build high-precision RAG pipelines:
1. **Document Ingestion**: Chunk semantically (500–1000 tokens) with 10% overlap, or apply *Late Chunking* (chunking after full document contextual embedding).
2. **Embeddings**: Utilize `text-embedding-3-large`, `gemini-embedding-004`, or local `bge-large-en-v1.5`.
3. **Hybrid Search**: Combine dense vector cosine similarity with sparse BM25 / PostgreSQL `tsvector` queries.
4. **Cross-Encoder Reranking**: Reorder top-K candidates using Cohere Rerank 3 or FlashRank before feeding into the prompt.
5. **Context Window vs RAG Decision**: If document sets fit comfortably under 200k tokens and are queried repeatedly, prefer **Native Context Caching** over RAG chunking to eliminate retrieval boundary errors.

#### 5. Continuous Multimodal Streaming (Astra Paradigm)
- **Real-Time Bidirectional Streaming**: Use WebSocket or WebRTC to stream audio and video frames continuously.
- **Gemini Multimodal Live API**: Implement bidirectional audio streams utilizing `BidiGenerateContent` with `setup`, `clientContent`, and `serverContent` events.
- **OpenAI Realtime API**: Connect to `wss://api.openai.com/v1/realtime`, manage session configuration, and process audio delta events.
- **Low Latency Target**: Optimize network and processing paths to maintain sub-200ms response latency.
- **Live Perception Loop Architecture**: Continuously ingest frames, perform reasoning, execute actions, and loop back.
  ```typescript
  // Basic Gemini Multimodal Live streaming setup
  const ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent');
  ws.onopen = () => {
    // Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
    const liveModel = process.env.GEMINI_FALLBACK === 'true' ? 'models/gemini-3.8-flash' : 'models/gemini-4-argon';
    ws.send(JSON.stringify({ setup: { model: liveModel } }));
  };
  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    if (response.serverContent) {
      console.log('Received audio/text delta:', response.serverContent);
    }
  };
  ```

#### 6. Computer-Using Agents (CUA)
- **CUA Architectural Pattern**: Screen capture → Vision model analysis → Action execution (mouse/keyboard) → Verification loop.
- **GUI Automation (OpenAI Operator style)**: Use vision-language models to drive complete OS or browser sessions autonomously.
- **Screen Grounding**: Output exact coordinates (`click at x,y`) based on visual element detection instead of DOM parsing.
- **Multi-Hour Execution**: Ensure robust checkpoint and resume states for tasks spanning hours.
- **Safety Guardrails**: Implement confirmation gates for destructive actions, run in sandboxed execution environments, and build rollback capabilities.
  ```typescript
  // CUA action loop with Playwright + Vision model
  const screenshot = await page.screenshot();
  const action = await getVisionModelAction(screenshot); // Returns { action: 'click', x: 100, y: 200 }
  if (action.action === 'click') {
    await page.mouse.click(action.x, action.y);
  }
  ```

#### 7. Episodic & Spatio-Temporal Memory
- **Memory Hierarchy**: Working memory (context window) → Semantic memory (vector DB) → Episodic memory (temporal event store) → Knowledge graph memory.
- **Spatio-Temporal Awareness**: Track object locations across video frames and sequence temporal events accurately.
- **Persistent Episodic Memory**: Integrate with Letta (formerly MemGPT) to simulate infinite context through paging episodic records.
- **Mem0 Integration**: Automatically extract memory snippets and retrieve relevant past context based on user queries.
- **Memory Consolidation**: Periodically compress short-term observations into long-term summary memories.
  ```typescript
  // Episodic memory storage using Mem0
  import { Mem0 } from 'mem0';
  const mem0 = new Mem0({ apiKey: 'YOUR_API_KEY' });
  await mem0.add("User prefers dark mode and uses VSCode.", { user_id: "u123" });
  const context = await mem0.search("IDE preferences", { user_id: "u123" });
  ```

#### 8. Narrative Simulation & Character AI (Fable Paradigm)
- **Multi-Agent Narrative Simulation**: Build architectures inspired by Fable Studio's Showrunner/SHOW-1 for emergent storylines.
- **Character Personality Encoding**: Encode Big Five personality traits and emotional valence vectors into the system prompt.
- **State Management**: Persist character states across sessions to maintain long-term memory and relationship development.
- **World-State Consistency**: Enforce consistency using a shared state graph that all agents read and write to.
- **Episodic Generation**: Utilize an autonomous pipeline to generate coherent narrative episodes.
- **Dialogue Coherence**: Constrain inter-agent dialogue to align with narrative constraints and personality logic.
  ```typescript
  // Character agent with personality state
  const characterState = {
    name: 'Elara',
    traits: { openness: 0.8, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.7, neuroticism: 0.2 },
    mood: 'contemplative'
  };
  const prompt = `You are ${characterState.name}. Traits: ${JSON.stringify(characterState.traits)}. Current mood: ${characterState.mood}. Respond to the user.`;
  ```

#### 9. FinOps, Context Caching & Dynamic Model Routing
- **Native Context Caching**: Store static system prompts or large codebases in cache (>32k tokens) to reduce costs by up to 90% (Anthropic ephemeral cache, OpenAI prefix cache, Gemini `cachedContent`).
- **Dynamic Model Router**: Route queries based on complexity scoring (prompt length, required schema, reasoning requirements):
  ```typescript
  export function selectOptimalModel(promptLength: number, taskType: 'classification' | 'reasoning' | 'summary') {
    if (taskType === 'classification' || promptLength < 500) {
      return 'gemini-3.8-flash'; // High speed, minimal cost
    }
    return 'gemini-3.1-pro'; // Deep reasoning
  }
  ```
- **Semantic Caching**: Hash query vector embeddings into Redis / vector DB to return cached completions for semantically identical questions before calling LLM APIs.
- **Tenant Token Quotas**: Implement per-tenant token budgeting and alert thresholds to prevent cost overruns.

#### 10. Structured Output & Guardrails
- Utilize native Structured Outputs (`response_format: { type: "json_schema" }`) guaranteed by model token-level grammar masks.
- Use Zod schemas to define tool parameters and final structured entities.
- Implement rate limiting, circuit breakers, and semantic caching (Redis / Upstash vector cache) to prevent runaway recursive tool loops.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec ai-llm-integration-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Model Frontier & Provider**: `frontier-ai-models-expert`, `gemini-agent-booster`, `vercel-ai-sdk-expert`, `pydantic-ai-expert`
- **Ekosistem MCP**: `mcp-server-architect`, `mcp-sampling-critic`, `doku-mcp-server`
- **Multi-Agen & Tooling**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `speculative-multi-draft-synthesizer`
- **Memori & Retrieval**: `agentic-memory-architect`, `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `local-slm-edge-ai-expert`
- **Optimasi & FinOps**: `kv-cache-prefix-optimizer`, `thinking-budget-orchestrator`, `llm-finops-router`, `context-window-engineer`
- **Keamanan, Tata Kelola & Kualitas**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `ai-prompt-engineering-expert`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan AI, Model Context Protocol (MCP), model hybrid reasoning, dan Large Language Models (LLM) ke dalam arsitektur perangkat lunak modern. Mencakup penanganan streaming token penalaran, transport MCP Streamable HTTP, arsitektur memori agentik, context caching native, pipeline RAG, dan orkestrasi multi-model.

### Kondisi Pemicu
- Mengintegrasikan model frontier reasoning: xAI Grok 4.7 High Fast / Grok 4.6, Cursor Composer 2.5 Fast, Anthropic Claude Opus 5.5 Medium / Claude Sonnet 5.5 High / Claude Fable 5.1, Google Gemini 4 Argon Medium / Gemini 4 Pro / Project Astra, OpenAI GPT-5.6 Sol Medium / GPT-5 / o3, Muse Wonder High, atau DeepSeek-R1 / Pro / V3.
- Mengimplementasikan server atau klien Model Context Protocol (MCP) dengan transport Streamable HTTP atau MCP Sampling.
- Membangun chatbot AI, copilot, atau workflow agen otonom (LangGraph, OpenAI Agents SDK, Google ADK, Mastra.ai, Vercel AI SDK 5.x/6.x).
- Mengelola streaming token penalaran (`<think>`) secara terpisah dari output akhir pada tampilan antarmuka pengguna.
- Mengimplementasikan RAG hibrida dengan database vektor (Supabase pgvector HNSW, Qdrant, Pinecone) dan reranker cross-encoder.
- Membangun sistem memori agentik (jangka pendek, semantik jangka panjang, episodik) menggunakan Mem0 atau vector store.
- Menerapkan optimasi biaya dengan Context Caching native provider (Gemini `cachedContent`, Anthropic ephemeral prompt cache, OpenAI prefix cache).

### Matriks Kapabilitas Model (Edisi Frontier Akhir-2026)

| Provider | Model | Tier | Konteks | Tipe Penalaran | Keunggulan Utama |
|---|---|---|---|---|---|
| xAI | Grok 4.7 High Fast | High Fast | 256K | Komputasi Real-Time Sub-Detik | TTFT kilat, pencarian web langsung, loop uji-debug cepat |
| xAI | Grok 4.6 High Fast | High Fast | 128K | Penalaran Throughput Tinggi | Pengujian unit cepat, linting kode, verifikasi micro-benchmark |
| Cursor | Composer 2.5 Fast | Fast | 200K | Mesin Diff AST Native | Refactoring multi-berkas tersinkronisasi, generasi patch aman |
| Google | Gemini 4 Argon | Medium | 2M+ | Penalaran Seimbang Monolitik | Konteks 2M+ seluruh repo, caching native, sintesis fitur fullstack |
| Google | Gemini 3.8 Flash (Fallback) | Fast/Medium | 1M+ | Flash Thinking (Budget Dinamis) | Pengalihan jika Gemini 4 belum tersedia; latensi ultra-rendah (<100ms TTFT) |
| OpenAI | GPT-5.6 Sol | Medium | 500K | Penegakan Skema & Kontrak Ketat | Tool-calling sempurna, validasi OpenAPI, verifikasi PRM |
| Anthropic | Claude Opus 5.5 | Medium | 500K | Pemahaman Arsitektur Mendalam | Analisis arsitektur tingkat tinggi, pemodelan domain kompleks |
| Anthropic | Claude Opus 4.6 (Fallback) | Medium | 200K | Penalaran Hibrida Mendalam | Pengalihan jika Claude Opus 5.5 belum tersedia; pemahaman arsitektur formal |
| Anthropic | Claude Sonnet 5.5 | High | 500K | Extended Thinking (64K) | Keahlian fullstack unggulan, kode anti-slop, verifikasi formal |
| Anthropic | Claude Fable 5.1 | High | 500K | Terminal-Bench SOTA & Cache-Pinning | Eksekusi terminal agentic, pembacaan cache 45% lebih hemat |
| Muse | Muse Wonder | High | 300K | Desain Eksploratif & Generatif | Sintesis arsitektur kreatif, layout UI generatif inovatif |
| Google | Gemini 4 Pro | High | 2M–10M | Multimodal Live Monolitik | Riset mendalam long-context, audio/video spasial, audit repo raksasa |
| DeepSeek | DeepSeek-R1 / Pro | High | 128K | Penalaran Open Weights | Algoritma matematika tinggi, transformasi AST kompleks |

### Panduan Arsitektur Inti

#### 1. Hybrid Reasoning & Penanganan Token Streaming
Model frontier modern menghasilkan token pemikiran (*thinking tokens*) selama proses penalaran:
- **Pemisahan Token Pemikiran**: Pisahkan blok `<think>` dari output teks akhir. Alirkan proses pemikiran ke dalam accordion UI yang dapat dibuka/tutup, sementara output utama disajikan dengan bersih kepada user.
- **Integrasi Vercel AI SDK 5.x/6.x**: Gunakan event listener `reasoning` pada stream untuk menangkap proses pemikiran model secara terpisah dari `text-delta`.
- **Penanganan Overflow Token Pemikiran**: Jika `max_tokens` memotong proses penalaran sebelum teks output dimulai (blok `<think>` belum tertutup), deteksi tag yang hilang dan secara dinamis tingkatkan anggaran token atau tambahkan blok prompt penutup paksa.
- **Konfigurasi Thinking Multi-Provider**: Gunakan parameter `thinking` Anthropic (`budgetTokens`), `thinkingConfig` Google (diaktifkan dengan logika anggaran), dan reasoning token OpenAI (via `reasoning_effort: "high"`).

#### 2. Model Context Protocol (MCP) — Streamable HTTP & Sampling
Standarisasi seluruh komunikasi agen-ke-tool dan agen-ke-host menggunakan spesifikasi MCP:
- **Streamable HTTP Transport**: Standar cloud modern yang mendukung streaming dua arah JSON-RPC via HTTP POST/SSE hybrid tanpa ketergantungan koneksi stdio lokal.
- **MCP Sampling**: Memberikan izin kepada server MCP untuk meminta inferensi LLM kembali ke klien host, memungkinkan alat agentik modular tanpa membagikan API key sensitif.
- **Keamanan & Otorisasi**: Wajibkan bearer token berbasis OAuth 2.1 pada endpoint MCP publik dan validasi skema input dengan Zod.

#### 3. Arsitektur Memori Agentik
- **Memori Kerja In-Context**: Teruskan histori interaksi terbaru di jendela konteks.
- **Memori Semantik Jangka Panjang**: Simpan fakta dan preferensi pengguna di pgvector (indeks HNSW) atau Qdrant dengan pencarian kesamaan kosinus.
- **Memori Episodik (Mem0 / Letta (formerly MemGPT))**: Sintesiskan ringkasan sesi secara berkala agar agen memiliki daya ingat historis jangka panjang.
- **Memori Graph Pengetahuan**: Hubungkan entitas relasional dalam basis data graf untuk kueri multi-langkah (*multi-hop reasoning*).

#### 4. Pipeline RAG Lanjutan & Late Chunking
1. **Ingesti Dokumen**: Bagi dokumen secara semantik (500–1000 token, 10% overlap) atau gunakan metode *Late Chunking*.
2. **Embedding**: Gunakan `text-embedding-3-large` atau `gemini-embedding-004`.
3. **Pencarian Hibrida**: Kombinasikan dense vector cosine similarity dengan sparse keyword BM25 / PostgreSQL full-text search.
4. **Cross-Encoder Reranking**: Susun ulang kandidat terbaik menggunakan Cohere Rerank 3 atau FlashRank sebelum diteruskan ke system prompt.
5. **Keputusan Cache vs RAG**: Jika dokumen stabil dan berada di bawah 200k token, utamakan **Context Caching Native** daripada RAG chunking untuk menghindari hilangnya konteks di perbatasan potongan teks.

#### 5. Streaming Multimodal Berkelanjutan (Paradigma Astra)
- **Streaming Real-Time Dua Arah**: Gunakan WebSocket atau WebRTC untuk melakukan streaming audio dan frame video secara berkelanjutan.
- **Gemini Multimodal Live API**: Implementasikan stream audio dua arah memanfaatkan `BidiGenerateContent` dengan event `setup`, `clientContent`, dan `serverContent`.
- **OpenAI Realtime API**: Hubungkan ke `wss://api.openai.com/v1/realtime`, kelola konfigurasi sesi, dan proses event delta audio.
- **Target Latensi Rendah**: Optimasi jaringan dan jalur pemrosesan untuk mempertahankan latensi respons di bawah 200ms.
- **Arsitektur Loop Persepsi Langsung (Live Perception Loop)**: Ingesti frame terus-menerus, lakukan penalaran, eksekusi aksi, dan loop kembali.
  ```typescript
  // Setup dasar streaming Gemini Multimodal Live
  const ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent');
  ws.onopen = () => {
    // Invarian Pengalihan Ketersediaan: Gemini 4 Argon -> Gemini 3.8 Flash
    const liveModel = process.env.GEMINI_FALLBACK === 'true' ? 'models/gemini-3.8-flash' : 'models/gemini-4-argon';
    ws.send(JSON.stringify({ setup: { model: liveModel } }));
  };
  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    if (response.serverContent) {
      console.log('Menerima delta teks/audio:', response.serverContent);
    }
  };
  ```

#### 6. Agen Pengguna Komputer (Computer-Using Agents / CUA)
- **Pola Arsitektural CUA**: Tangkapan layar (Screen capture) → Analisis model vision → Eksekusi aksi (mouse/keyboard) → Loop verifikasi.
- **Otomatisasi GUI (Gaya OpenAI Operator)**: Gunakan model vision-language untuk menggerakkan seluruh sesi OS atau browser secara otonom.
- **Screen Grounding**: Hasilkan koordinat pasti (`click at x,y`) berdasarkan deteksi elemen visual daripada parsing DOM.
- **Eksekusi Multi-Jam**: Pastikan adanya status checkpoint dan resume yang kuat untuk tugas yang berlangsung berjam-jam.
- **Guardrails Keselamatan**: Implementasikan gerbang konfirmasi untuk tindakan destruktif, jalankan di lingkungan sandbox, dan bangun kemampuan rollback.
  ```typescript
  // Loop aksi CUA dengan Playwright + Vision model
  const screenshot = await page.screenshot();
  const action = await getVisionModelAction(screenshot); // Mengembalikan { action: 'click', x: 100, y: 200 }
  if (action.action === 'click') {
    await page.mouse.click(action.x, action.y);
  }
  ```

#### 7. Memori Episodik & Spasio-Temporal
- **Hierarki Memori**: Memori kerja (context window) → Memori semantik (vector DB) → Memori episodik (penyimpanan event temporal) → Memori knowledge graph.
- **Kesadaran Spasio-Temporal (Spatio-Temporal Awareness)**: Lacak lokasi objek di seluruh frame video dan urutkan event temporal dengan akurat.
- **Memori Episodik Persisten**: Integrasikan dengan Letta (sebelumnya MemGPT) untuk mensimulasikan konteks tak terbatas melalui paging catatan episodik.
- **Integrasi Mem0**: Ekstrak cuplikan memori secara otomatis dan ambil konteks masa lalu yang relevan berdasarkan kueri pengguna.
- **Konsolidasi Memori**: Kompres observasi jangka pendek secara berkala menjadi memori ringkasan jangka panjang.
  ```typescript
  // Penyimpanan memori episodik menggunakan Mem0
  import { Mem0 } from 'mem0';
  const mem0 = new Mem0({ apiKey: 'YOUR_API_KEY' });
  await mem0.add("Pengguna lebih suka dark mode dan menggunakan VSCode.", { user_id: "u123" });
  const context = await mem0.search("Preferensi IDE", { user_id: "u123" });
  ```

#### 8. Simulasi Naratif & Character AI (Paradigma Fable)
- **Simulasi Naratif Multi-Agen**: Bangun arsitektur yang terinspirasi dari Showrunner/SHOW-1 karya Fable Studio untuk alur cerita emergen.
- **Enkode Kepribadian Karakter**: Enkode sifat kepribadian Big Five dan vektor valensi emosional ke dalam system prompt.
- **Manajemen State**: Pertahankan state karakter di seluruh sesi untuk mempertahankan memori jangka panjang dan pengembangan hubungan.
- **Konsistensi World-State**: Tegakkan konsistensi menggunakan shared state graph yang dibaca dan ditulis oleh semua agen.
- **Generasi Episodik**: Gunakan pipeline otonom untuk menghasilkan episode naratif yang koheren.
- **Koherensi Dialog**: Batasi dialog antar-agen agar selaras dengan batasan naratif dan logika kepribadian.
  ```typescript
  // Agen karakter dengan state kepribadian
  const characterState = {
    name: 'Elara',
    traits: { openness: 0.8, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.7, neuroticism: 0.2 },
    mood: 'kontemplatif'
  };
  const prompt = `Anda adalah ${characterState.name}. Sifat: ${JSON.stringify(characterState.traits)}. Suasana hati saat ini: ${characterState.mood}. Tanggapi pengguna.`;
  ```

#### 9. FinOps, Context Caching & Routing Model Dinamis
- **Context Caching Native**: Simpan prompt sistem atau repositori besar di cache (>32k token) via API `cachedContent` Gemini, ephemeral cache Anthropic, atau prefix cache OpenAI untuk menghemat hingga 90% biaya.
- **Router Model Dinamis**: Arahkan kueri secara cerdas (tugas klasifikasi/parsing ke Flash, penalaran mendalam ke Pro/Opus).
- **Semantic Caching**: Simpan embedding kueri di Redis / Vector DB untuk menyajikan jawaban cache pada pertanyaan identik tanpa memanggil ulang API LLM.
- **Kuota & Anggaran Token**: Terapkan batas konsumsi token harian per pengguna/penyewa guna mencegah pembengkakan biaya.

#### 10. Output Terstruktur & Guardrails
- Manfaatkan mode Structured Outputs native model dengan skema Zod untuk menjamin integritas JSON.
- Terapkan rate limiting, circuit breaker, dan semantic caching (Redis / Upstash) untuk mencegah pemanggilan tool secara rekursif tak berujung.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec ai-llm-integration-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
