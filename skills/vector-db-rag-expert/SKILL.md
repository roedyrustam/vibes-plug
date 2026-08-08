---
name: vector-db-rag-expert
description: "Expert guide for high-performance Vector Databases, RAG architectures, pgvector HNSW indexing, hybrid search (Dense + BM25), and semantic chunking / Panduan ahli Vector DB, arsitektur RAG, pgvector HNSW, dan hybrid search."
author: "Roedy Rustam"
---

# Vector DB & Deep RAG Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Purpose & Overview
Production-grade guidelines for Vector Databases (pgvector, Qdrant, Pinecone, Milvus), RAG indexing strategies, HNSW vector search, hybrid retrieval (dense vector embeddings + BM25 sparse keyword ranking), semantic document chunking, and RAG evaluation frameworks.

### Key Capabilities
- **pgvector & Hybrid Search**: PostgreSQL `pgvector` HNSW indexing, cosine/L2 distance metric tuning, and BM25 hybrid re-ranking.
- **RAG Architecture**: Parent-Document retrieval, Hypothetical Document Embeddings (HyDE), and contextual compression.
- **RAG Evaluation**: Automated retrieval quality scoring using Ragas and TruLens.

```typescript
import { sql } from 'drizzle-orm';

// Hybrid Search: Vector Cosine Similarity + Full Text Search
export async function hybridSearch(queryVector: number[], queryText: string, limit = 10) {
  const result = await db.execute(sql`
    SELECT id, title, content,
           (1 - (embedding <=> ${JSON.stringify(queryVector)}::vector)) * 0.7 +
           ts_rank(fts, websearch_to_tsquery('english', ${queryText})) * 0.3 AS score
    FROM documents
    ORDER BY score DESC
    LIMIT ${limit};
  `);
  return result;
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan tingkat produksi untuk Vector Database (pgvector, Qdrant, Pinecone, Milvus), arsitektur RAG, indeks pgvector HNSW, hybrid search (dense + BM25 sparse re-ranking), semantic chunking, dan evaluasi RAG.

### Fitur Utama
- **pgvector & Hybrid Search**: PostgreSQL `pgvector` HNSW indexing, tuning jarak cosine/L2, dan re-ranking BM25.
- **Arsitektur RAG**: Retrieval Parent-Document, HyDE (Hypothetical Document Embeddings), dan kompresi kontekstual.
- **Evaluasi RAG**: Scoring kualitas retrieval otomatis menggunakan Ragas dan TruLens.
