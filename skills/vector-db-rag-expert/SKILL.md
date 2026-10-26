---
name: vector-db-rag-expert
description: "High-performance Vector DBs, Deep RAG, pgvector HNSW, and re-ranking / Vector DB performa tinggi, Deep RAG, pgvector HNSW, dan re-ranking."
author: "Roedy Rustam"
version: "4.4.2"

---

# Vector DB & Deep RAG Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream AI Models & Embeddings**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `vercel-ai-sdk-expert`
- **Database & Storage Engines**: `database-orm-expert`, `graph-rag-knowledge-expert`, `search-engine-expert`
- **Retrieval & Pipeline Tooling**: `xerj-search-expert`, `llm-finops-router`, `context-window-engineer`
- **Security & Quality**: `prompt-injection-firewall`, `ai-safety-governance-expert`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Purpose & Overview
Production-grade architectural guide for Vector Databases (PostgreSQL `pgvector 0.8+`, Qdrant, LanceDB, Pinecone), Deep RAG indexing strategies, HNSW iterative search, **Contextual Retrieval** (Anthropic 2026 standard), **Reciprocal Rank Fusion (RRF)** hybrid retrieval, **Cross-Encoder Re-ranking** (FlashRank, BGE-Reranker-v2), and **Late Chunking** to eliminate context fragmentation.

### Key Capabilities
1. **pgvector 0.8+ & Halfvec / Sparsevec**: High-dimensional vector storage with 50% RAM savings using `halfvec`, native BM25 sparse vectors via `sparsevec`, and iterative HNSW index scans with metadata filtering.
2. **Contextual Retrieval (Anthropic 2026 Standard)**: Prepend 50-100 token LLM-generated document context to each chunk before embedding and BM25 indexing, reducing failed retrieval rates by up to 67%.
3. **Reciprocal Rank Fusion (RRF)**: Combining sparse keyword BM25 ranks with dense semantic vector ranks using $RRF(d) = \sum \frac{1}{k + rank(d)}$ ($k = 60$).
4. **Cross-Encoder Re-ranking**: Two-stage retrieval pipeline: retrieve Top-50 candidates via fast hybrid search, then re-rank down to Top-5 using a cross-encoder model to maximize NDCG@10.
5. **Late Chunking**: Embed long-context documents in full before pooling token embeddings into individual chunks, preserving document-level semantics across boundaries.

---

### Production Implementation Recipes

#### Recipe 1: Contextual Chunk Prepending before Vector Indexing
```typescript
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export interface ChunkWithContext {
  id: string;
  originalText: string;
  contextualizedText: string;
  contextSummary: string;
}

/**
 * Generates chunk-specific context using a fast model (Gemini 4 Argon / Gemini 3.8 Flash)
 * following the Anthropic Contextual Retrieval methodology
 */
export async function generateContextualChunk(
  documentText: string,
  chunkText: string,
  chunkId: string
): Promise<ChunkWithContext> {
  const prompt = `
<document>
${documentText}
</document>

Here is the chunk we want to situate within the whole document:
<chunk>
${chunkText}
</chunk>

Please give a short, succinct context (1-2 sentences) to situate this chunk within the overall document for search retrieval. Answer only with the context.`;

  // Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
  let contextSummary = '';
  try {
    const res = await generateText({
      model: google('gemini-4-argon'),
      prompt,
    });
    contextSummary = res.text;
  } catch {
    const res = await generateText({
      model: google('gemini-3.8-flash'),
      prompt,
    });
    contextSummary = res.text;
  }

  const contextualizedText = `${contextSummary.trim()}\n\n${chunkText}`;

  return {
    id: chunkId,
    originalText: chunkText,
    contextualizedText,
    contextSummary: contextSummary.trim(),
  };
}
```

#### Recipe 2: Reciprocal Rank Fusion (RRF) Hybrid Search with Drizzle ORM
```typescript
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

export interface SearchResult {
  id: string;
  content: string;
  rrfScore: number;
}

/**
 * Executes Reciprocal Rank Fusion (RRF) combining BM25 keyword search and pgvector HNSW
 * k = 60 is the industry standard constant
 */
export async function reciprocalRankFusionSearch(
  queryVector: number[],
  queryText: string,
  limit = 10,
  k = 60
): Promise<SearchResult[]> {
  const formattedVector = JSON.stringify(queryVector);

  const results = await db.execute(sql`
    WITH vector_matches AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> ${formattedVector}::halfvec) AS rank
      FROM documents
      WHERE status = 'published'
      ORDER BY embedding <=> ${formattedVector}::halfvec
      LIMIT 50
    ),
    text_matches AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(fts, websearch_to_tsquery('english', ${queryText})) DESC) AS rank
      FROM documents
      WHERE fts @@ websearch_to_tsquery('english', ${queryText})
      LIMIT 50
    )
    SELECT
      d.id,
      d.content,
      COALESCE(1.0 / (${k} + v.rank), 0.0) +
      COALESCE(1.0 / (${k} + t.rank), 0.0) AS rrf_score
    FROM documents d
    LEFT JOIN vector_matches v ON d.id = v.id
    LEFT JOIN text_matches t ON d.id = t.id
    WHERE v.id IS NOT NULL OR t.id IS NOT NULL
    ORDER BY rrf_score DESC
    LIMIT ${limit};
  `);

  return (results.rows as any[]).map(row => ({
    id: row.id,
    content: row.content,
    rrfScore: Number(row.rrf_score),
  }));
}
```

#### Recipe 3: Cross-Encoder Re-Ranking Pipeline with FlashRank
```typescript
import { FlashRankRegistry } from 'flashrank';

const ranker = new FlashRankRegistry();

export async function rerankCandidates(
  query: string,
  candidates: { id: string; text: string }[],
  topN = 5
) {
  const passages = candidates.map(c => ({ id: c.id, text: c.text }));

  // Ultra-fast client/server cross-encoder re-ranking (<5ms)
  const reranked = await ranker.rerank({
    query,
    passages,
    model: 'ms-marco-TinyBERT-L-2-v2',
  });

  return reranked.slice(0, topN);
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec vector-db-rag-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Model AI & Embedding Hulu**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `vercel-ai-sdk-expert`
- **Engine Database & Penyimpanan**: `database-orm-expert`, `graph-rag-knowledge-expert`, `search-engine-expert`
- **Tooling Retrieval & Pipeline**: `xerj-search-expert`, `llm-finops-router`, `context-window-engineer`
- **Keamanan & Kualitas**: `prompt-injection-firewall`, `ai-safety-governance-expert`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan arsitektur tingkat produksi untuk Vector Database (PostgreSQL `pgvector 0.8+`, Qdrant, LanceDB, Pinecone), arsitektur Deep RAG modern, pencarian HNSW iteratif, **Contextual Retrieval** (standar Anthropic 2026), **Reciprocal Rank Fusion (RRF)** hybrid retrieval, **Cross-Encoder Re-ranking** (FlashRank, BGE-Reranker-v2), dan **Late Chunking** untuk mencegah fragmentasi konteks.

### Fitur Utama
1. **pgvector 0.8+ & Halfvec / Sparsevec**: Penyimpanan vektor dimensi tinggi dengan efisiensi RAM 50% via `halfvec`, dukungan native vektor renggang BM25 via `sparsevec`, dan pemindaian HNSW iteratif.
2. **Contextual Retrieval (Metodologi Anthropic 2026)**: Menyematkan konteks ringkas (50-100 token) yang di-generate model LLM pada setiap chunk sebelum proses embedding dan indeks BM25, memangkas kegagalan retrieval hingga 67%.
3. **Reciprocal Rank Fusion (RRF)**: Menggabungkan peringkat kata kunci BM25 dengan peringkat semantik vektor menggunakan rumus $RRF(d) = \sum \frac{1}{k + rank(d)}$ ($k = 60$).
4. **Cross-Encoder Re-ranking**: Pipeline retrieval 2 tahap: ambil 50 kandidat teratas melalui pencarian hybrid, lalu urutkan ulang menjadi 5 dokumen paling relevan menggunakan model cross-encoder berlatensi rendah.
5. **Late Chunking**: Melakukan embedding dokumen secara utuh dalam transformer sebelum memecahnya menjadi chunk-chunk terpisah, mempertahankan makna global dokumen.

---

### Resep Implementasi Produksi

#### Resep 1: Pembuatan Contextual Chunk Sebelum Indeks Vektor
```typescript
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function buatChunkKontekstual(
  teksDokumen: string,
  teksChunk: string,
  chunkId: string
) {
  const prompt = `
<document>
${teksDokumen}
</document>

Berikut adalah potongan (chunk) yang ingin ditempatkan dalam dokumen:
<chunk>
${teksChunk}
</chunk>

Berikan konteks singkat (1-2 kalimat) untuk menempatkan chunk ini dalam dokumen secara utuh demi akurasi pencarian. Jawab hanya dengan kalimat konteks.`;

  // Invarian Pengalihan Ketersediaan: Gemini 4 Argon -> Gemini 3.8 Flash
  let ringkasanKonteks = '';
  try {
    const res = await generateText({
      model: google('gemini-4-argon'),
      prompt,
    });
    ringkasanKonteks = res.text;
  } catch {
    const res = await generateText({
      model: google('gemini-3.8-flash'),
      prompt,
    });
    ringkasanKonteks = res.text;
  }

  const teksKontekstual = `${ringkasanKonteks.trim()}\n\n${teksChunk}`;

  return {
    id: chunkId,
    teksAsli: teksChunk,
    teksKontekstual,
    ringkasanKonteks: ringkasanKonteks.trim(),
  };
}
```

#### Resep 2: Pencarian Hybrid RRF dengan Drizzle ORM
```typescript
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';

export async function cariDokumenRRF(
  queryVector: number[],
  queryText: string,
  limit = 10,
  k = 60
) {
  const vectorStr = JSON.stringify(queryVector);

  const hasil = await db.execute(sql`
    WITH vector_matches AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> ${vectorStr}::halfvec) AS rank
      FROM documents
      WHERE status = 'published'
      ORDER BY embedding <=> ${vectorStr}::halfvec
      LIMIT 50
    ),
    text_matches AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(fts, websearch_to_tsquery('english', ${queryText})) DESC) AS rank
      FROM documents
      WHERE fts @@ websearch_to_tsquery('english', ${queryText})
      LIMIT 50
    )
    SELECT
      d.id,
      d.content,
      COALESCE(1.0 / (${k} + v.rank), 0.0) +
      COALESCE(1.0 / (${k} + t.rank), 0.0) AS skor_rrf
    FROM documents d
    LEFT JOIN vector_matches v ON d.id = v.id
    LEFT JOIN text_matches t ON d.id = t.id
    WHERE v.id IS NOT NULL OR t.id IS NOT NULL
    ORDER BY skor_rrf DESC
    LIMIT ${limit};
  `);

  return hasil.rows;
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec vector-db-rag-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
