---
name: graph-rag-knowledge-expert
description: "Expert guide for Knowledge Graphs, GraphRAG, Microsoft GraphRAG, Neo4j Text2Cypher, multi-hop relational retrieval, and hybrid vector-graph search / Panduan ahli Knowledge Graph, GraphRAG, dan pencarian relasional multi-hop."
author: "Roedy Rustam"
---

# GraphRAG & Knowledge Graph Expert (2026 Edition)

Expert guide for implementing Knowledge Graph-augmented Retrieval (GraphRAG), solving the fatal weaknesses of vector search: multi-hop reasoning, relationship discovery, and global corpus understanding. Covers Microsoft GraphRAG, Neo4j Text2Cypher, FalkorDB, and hybrid Vector + Graph retrieval pipelines.

*Panduan ahli untuk implementasi Knowledge Graph dan GraphRAG untuk mengatasi kelemahan mendasar vector search murni dalam pemikiran multi-hop, deteksi relasi entitas tersembunyi, dan ringkasan global korpus.*

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
import { openai } from '@ai-sdk/openai';

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

    const { text: cypherQuery } = await generateText({
      model: openai('gpt-4o-mini'),
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
    return client.chat.completions.create(
        model="gpt-4o-mini",
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

---

## Orchestration & Integration

- **`vector-db-rag-expert`**: For hybrid dense-vector similarity search combined with graph path discovery.
- **`database-orm-expert`**: For maintaining transactional relational mappings alongside graph stores.
- **`ai-llm-integration-expert`**: Connects reasoning models to multi-hop graph context.
- **`search-engine-expert`**: For keyword lexical indexing of graph node attributes.
