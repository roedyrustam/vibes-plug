---
name: graph-rag-knowledge-expert
description: "Expert guide for Knowledge Graphs, GraphRAG, Microsoft GraphRAG, Neo4j Text2Cypher, multi-hop relational retrieval, and hybrid vector-graph search / Panduan ahli Knowledge Graph, GraphRAG, dan pencarian relasional multi-hop."
author: "Roedy Rustam"
version: "4.4.2"

---

# GraphRAG & Knowledge Graph Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Vector & Hybrid Engines**: `vector-db-rag-expert`, `search-engine-expert`, `xerj-search-expert`
- **Relational & Graph Storage**: `database-orm-expert`, `living-codebase-ast-graph`
- **LLM Reasoning & Pipelines**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `context-window-engineer`
- **Security & Hallucination Guardrails**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Expert guide for implementing Knowledge Graph-augmented Retrieval (GraphRAG), solving the fatal weaknesses of vector search: multi-hop reasoning, relationship discovery, and global corpus understanding. Covers Microsoft GraphRAG, Neo4j Text2Cypher, FalkorDB, and hybrid Vector + Graph retrieval pipelines.

### Trigger Conditions
- Complex multi-hop queries where entities are linked through multiple intermediate nodes.
- High hallucination rate using standard vector RAG on interconnected data.
- Global corpus queries requiring domain-wide thematic summarization across thousands of documents.
- Enterprise knowledge bases containing explicitly structured relational entities (e.g., organizations, code dependencies, regulatory rules).

---

## 1. Why GraphRAG Over Pure Vector Search?

| Capability | Pure Vector Search (RAG) | GraphRAG (Graph + Vector) |
| :--- | :--- | :--- |
| **Direct Similarity ("What is X?")** | 🟢 Fast, accurate | 🟢 High accuracy |
| **Multi-Hop Traversal ("How does X affect Z via Y?")** | 🔴 Blind (returns fragmented chunks) | 🟢 Explores interconnected graph edges |
| **Global Corpus Query ("What are the main themes across all documents?")** | 🔴 Fails (limited to Top-K chunks) | 🟢 Hierarchical Community Summaries |
| **Hallucination Rate on Complex Queries** | 🔴 Moderate to High (context stitching) | 🟢 Grounded in explicit knowledge edges |

---

## 2. Production Recipe: Text2Cypher Knowledge Graph Querying (TypeScript)

Using Neo4j with deterministic schema introspection, preventing arbitrary syntax hallucinations.

```typescript
// text2cypher.ts - Safe Neo4j Query Generation & Execution
import neo4j, { Driver } from 'neo4j-driver';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export class GraphRAGService {
  private driver: Driver;

  constructor(uri: string, user: string, pass: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));
  }

  // 1. Fetch live Graph Schema to ground the LLM
  private async getGraphSchema(): Promise<string> {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        CALL apoc.meta.schema() YIELD value
        RETURN value
      `);
      return JSON.stringify(result.records[0]?.get('value') || {});
    } finally {
      await session.close();
    }
  }

  // 2. Synthesize strict read-only Cypher query
  public async queryGraph(userQuestion: string): Promise<any[]> {
    const schema = await this.getGraphSchema();

    // Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
    const getModel = () => {
      try {
        return google('gemini-4-argon');
      } catch {
        return google('gemini-3.8-flash');
      }
    };

    const { text: cypherQuery } = await generateText({
      model: getModel(),
      system: `
        You are an expert Neo4j Cypher generator.
        Generate ONLY valid, read-only CYPHER queries based on this schema:
        ${schema}

        Rules:
        - Never generate CREATE, MERGE, DELETE, or SET statements.
        - Always use parameterization where appropriate.
        - Output ONLY the raw Cypher query, without markdown or backticks.
      `,
      prompt: `Translate this question into Cypher: ${userQuestion}`,
    });

    const sanitizedCypher = cypherQuery.trim().replace(/^```cypher|```$/g, '');

    // 3. Execute with read-only transaction
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    try {
      const res = await session.run(sanitizedCypher);
      return res.records.map((r) => r.toObject());
    } finally {
      await session.close();
    }
  }

  public async close(): Promise<void> {
    await this.driver.close();
  }
}
```

---

## 3. Production Recipe: Entity & Relation Extraction (Python)

```python
# graph_extractor.py - Structured Entity & Relation Extraction
from typing import List
from pydantic import BaseModel, Field
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI())

class Entity(BaseModel):
    name: str = Field(description="Normalized entity name, uppercase")
    type: str = Field(description="ORGANIZATION, PERSON, TECHNOLOGY, CONCEPT, LOCATION")
    description: str = Field(description="Summary of entity role")

class Relationship(BaseModel):
    source_entity: str
    target_entity: str
    relation_type: str = Field(description="USES, DEVELOPS, OWNS, LOCATED_IN, DEPENDS_ON")
    weight: float = Field(default=1.0, ge=0.0, le=1.0)
    description: str

class KnowledgeGraph(BaseModel):
    entities: List[Entity]
    relationships: List[Relationship]

def extract_knowledge_graph(document_text: str) -> KnowledgeGraph:
    """Extracts entities and relationships from raw text into structured schema."""
    # Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
    try:
        return client.chat.completions.create(
            model="gemini-4-argon",
            response_model=KnowledgeGraph,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract all named entities and factual relationships between them. "
                        "Ensure entity names are canonicalized and relationships are directed."
                    ),
                },
                {"role": "user", "content": document_text},
            ],
            temperature=0.0,
        )
    except Exception:
        return client.chat.completions.create(
            model="gemini-3.8-flash",
            response_model=KnowledgeGraph,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract all named entities and factual relationships between them. "
                        "Ensure entity names are canonicalized and relationships are directed."
                    ),
                },
                {"role": "user", "content": document_text},
            ],
            temperature=0.0,
        )
```

---

## 4. Microsoft GraphRAG: Hierarchical Communities

For high-level summaries ("Summarize all technical debts reported across the system"):
1. **Extraction**: Chunk documents ➔ Extract Entities & Relationships.
2. **Clustering**: Apply **Leiden Algorithm** to detect hierarchical communities (Level 0: Micro, Level 1: Sub-domain, Level 2: Macro domain).
3. **Summarization**: LLM generates pre-computed summaries for each community cluster.
4. **Global Search**: Query runs across pre-computed community summaries in parallel, eliminating the need to read millions of tokens at inference time.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec graph-rag-knowledge-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Engine Vektor & Hybrid Hulu**: `vector-db-rag-expert`, `search-engine-expert`, `xerj-search-expert`
- **Penyimpanan Relasional & Graf**: `database-orm-expert`, `living-codebase-ast-graph`
- **Penalaran LLM & Pipeline**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `context-window-engineer`
- **Keamanan & Mitigasi Halusinasi**: `ai-safety-governance-expert`, `prompt-injection-firewall`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan ahli untuk mengimplementasikan Knowledge Graph-augmented Retrieval (GraphRAG), memecahkan kelemahan fatal pencarian vektor konvensional: penalaran multi-langkah (*multi-hop reasoning*), penemuan relasi antar-entitas, dan pemahaman korpus global. Mencakup Microsoft GraphRAG, Neo4j Text2Cypher, FalkorDB, dan pipeline hybrid Vector + Graph.

### Kondisi Pemicu
- Kueri multi-hop kompleks di mana entitas terhubung melalui banyak simpul perantara.
- Tingkat halusinasi tinggi saat menggunakan RAG vektor standar pada data yang saling terhubung erat.
- Kueri korpus global yang membutuhkan ringkasan tematis di seluruh dokumen enterprise.
- Basis pengetahuan perusahaan yang mengandung relasi eksplisit (struktur organisasi, dependensi kode, kepatuhan regulasi).

---

### Implementasi Pola Kunci (TypeScript & Neo4j)

#### 1. Query Text2Cypher Aman dengan Introspeksi Skema
```typescript
import neo4j, { Driver } from 'neo4j-driver';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export class LayananGraphRAG {
  private driver: Driver;

  constructor(uri: string, user: string, pass: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));
  }

  // Ambil skema graf langsung untuk grounding LLM
  private async ambilSkemaGraf(): Promise<string> {
    const session = this.driver.session();
    try {
      const hasil = await session.run('CALL apoc.meta.schema() YIELD value RETURN value');
      return JSON.stringify(hasil.records[0]?.get('value') || {});
    } finally {
      await session.close();
    }
  }

  // Sintesis query Cypher read-only yang aman
  public async tanyaGraf(pertanyaanPengguna: string): Promise<any[]> {
    const skema = await this.ambilSkemaGraf();

    // Invarian Pengalihan Ketersediaan: Gemini 4 Argon -> Gemini 3.8 Flash
    const ambilModel = () => {
      try {
        return google('gemini-4-argon');
      } catch {
        return google('gemini-3.8-flash');
      }
    };

    const { text: queryCypher } = await generateText({
      model: ambilModel(),
      system: `Anda adalah ahli pembuat query Neo4j Cypher. Buat HANYA query Cypher read-only berdasarkan skema:\n${skema}\nAturan: Dilarang membuat perintah mutasi CREATE/DELETE.`,
      prompt: `Terjemahkan pertanyaan berikut ke Cypher: ${pertanyaanPengguna}`,
    });

    const cypherBersih = queryCypher.trim().replace(/^\`\`\`cypher|\`\`\`$/g, '');
    const session = this.driver.session({ defaultAccessMode: neo4j.session.READ });
    try {
      const hasil = await session.run(cypherBersih);
      return hasil.records.map((r) => r.toObject());
    } finally {
      await session.close();
    }
  }
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec graph-rag-knowledge-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
