---
name: search-engine-expert
description: "Full-text search engines: Typesense, Meilisearch, and Elasticsearch / Mesin pencarian full-text: Typesense, Meilisearch, Elasticsearch."
author: "Roedy Rustam"
version: "4.4.2"

---

# Search Engine & Full-Text Retrieval Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Data & Schemas**: `database-orm-expert`, `data-pipeline-etl-expert`
- **Vector & Hybrid Search**: `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `xerj-search-expert`
- **Domain Applications**: `ecommerce-expert`, `headless-cms-expert`
- **Frontend & Performance**: `senior-frontend`, `performance-web-vitals`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production guide for high-performance search engines, typo-tolerant autocomplete, faceted navigation, and hybrid retrieval. Covers native PostgreSQL Full-Text Search (`tsvector`, GIN index, `pg_trgm`), dedicated search engines (Typesense, Meilisearch), enterprise distributed clusters (OpenSearch/Elasticsearch), and hybrid search using Reciprocal Rank Fusion (RRF) to merge keyword matching with semantic vector embeddings.

### Trigger Conditions
- Implementing instant autocomplete or search-as-you-type beyond simple SQL `LIKE %query%` filters.
- Setting up faceted e-commerce product navigation (filtering by category, price ranges, ratings).
- Choosing between PostgreSQL built-in FTS vs dedicated clusters (Typesense/Meilisearch).
- Achieving sub-50ms search latency across millions of records.
- Implementing hybrid search combining dense vectors with sparse BM25 / full-text scores.

### Level 1: Native PostgreSQL Full-Text Search (Zero Extra Infrastructure)

```sql
-- Enable trigram extension for typo tolerance and fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create articles table with an automated tsvector generated column
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  search_tokens TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED
);

-- Crucial: GIN index for full-text queries & Trigram index for typos
CREATE INDEX IF NOT EXISTS idx_articles_fts ON articles USING GIN (search_tokens);
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING GIN (title gin_trgm_ops);

-- Fast ranked query with typo fallback
SELECT 
  id, 
  title, 
  ts_rank_cd(search_tokens, websearch_to_tsquery('english', :query)) AS rank,
  similarity(title, :query) AS sim_score
FROM articles
WHERE search_tokens @@ websearch_to_tsquery('english', :query)
   OR title % :query
ORDER BY rank DESC, sim_score DESC
LIMIT 20;
```

### Level 2: Dedicated Typo-Tolerant Engine (Typesense 2026)

```typescript
// src/lib/search/typesense-client.ts
import Typesense from 'typesense';

export const typesenseClient = new Typesense.Client({
  nodes: [{ host: process.env.TYPESENSE_HOST || 'localhost', port: 8108, protocol: 'http' }],
  apiKey: process.env.TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 2,
});

export async function searchProducts(searchTerm: string, selectedCategory?: string, maxPrice?: number) {
  const filterConditions: string[] = [];
  if (selectedCategory) filterConditions.push(`category:=${selectedCategory}`);
  if (maxPrice) filterConditions.push(`price:<=${maxPrice}`);

  const searchParams = {
    q: searchTerm || '*',
    query_by: 'name,description,brand',
    query_by_weights: '3,2,1',
    filter_by: filterConditions.join(' && '),
    facet_by: 'category,brand,price',
    sort_by: '_text_match:desc,rating:desc',
    num_typos: 2,
    per_page: 24,
  };

  const results = await typesenseClient.collections('products').documents().search(searchParams);
  return {
    hits: results.hits?.map((h: any) => h.document) || [],
    facets: results.facet_counts || [],
    found: results.found,
  };
}
```

### Reciprocal Rank Fusion (RRF) Hybrid Formula
When blending keyword search with vector semantic search, apply RRF to avoid score calibration drift:
$$\text{RRF Score}(d) = \sum_{m \in M} \frac{1}{60 + r_m(d)}$$
Where $r_m(d)$ is the 1-based rank of document $d$ in system $m$ (BM25 or Dense Vector).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec search-engine-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Data & Skema Hulu**: `database-orm-expert`, `data-pipeline-etl-expert`
- **Pencarian Vektor & Hibrida**: `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `xerj-search-expert`
- **Aplikasi Domain**: `ecommerce-expert`, `headless-cms-expert`
- **Frontend & Performa**: `senior-frontend`, `performance-web-vitals`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk mesin pencarian berkecepatan tinggi, autocomplete toleran salah ketik (*typo-tolerant*), navigasi berfaset (*faceted search*), dan pencarian hibrida (*hybrid search*). Mencakup Full-Text Search bawaan PostgreSQL (`tsvector`, GIN index, `pg_trgm`), mesin pencari khusus (Typesense, Meilisearch), kluster enterprise (OpenSearch/Elasticsearch), serta penggabungan skor kata kunci dan vektor semantik menggunakan formula *Reciprocal Rank Fusion* (RRF).

### Kondisi Pemicu
- Mengimplementasikan pencarian instan dan autocomplete di luar query dasar SQL `LIKE %kata%`.
- Membangun filter produk e-commerce berdasarkan kategori, kisaran harga, dan rating.
- Memilih antara FTS native PostgreSQL vs mesin pencari terdedikasi (Typesense/Meilisearch).
- Menargetkan latensi pencarian di bawah 50 milidetik pada jutaan baris data.
- Menggabungkan pencarian teks biasa dengan pencarian semantik AI (*Hybrid Search*).

### Pola Integrasi Pencarian Instan di Next.js

```typescript
// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/search/typesense-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

  try {
    const data = await searchProducts(q, category, maxPrice);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal melakukan pencarian' }, { status: 500 });
  }
}
```

### Kapan Menggunakan PostgreSQL vs Typesense?
- **Gunakan PostgreSQL FTS**: Jika data di bawah 1 juta baris dan Anda ingin menghindari biaya/kompleksitas infrastruktur tambahan.
- **Gunakan Typesense / Meilisearch**: Jika membutuhkan koreksi saltik otomatis yang instan (*instant typo-tolerance*), pencarian saat mengetik (*search-as-you-type* <10ms), dan filter faset kompleks tanpa membebani database utama.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec search-engine-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
