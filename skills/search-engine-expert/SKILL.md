---
name: search-engine-expert
description: "Expert guide for full-text search engines (Typesense, Meilisearch, Elasticsearch), faceted search, and autocomplete / Panduan ahli mesin pencarian full-text (Typesense, Meilisearch, Elasticsearch), pencarian berfaset, dan autocomplete."
author: "vibes-plug-swarm"
---

# Search Engine Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`database-orm-expert`**: Database indexing strategies alongside search.
- **`vector-db-rag-expert`**: Hybrid search (semantic + full-text).
- **`performance-web-vitals`**: Search latency optimization.
- **`ecommerce-expert`**: Product search and faceted navigation.

### Description
Expert guide for implementing full-text search in web applications. Covers Typesense (typo-tolerant, easy setup), Meilisearch (Rust-based, instant search), Elasticsearch/OpenSearch (enterprise-grade), faceted search, autocomplete, search-as-you-type, relevance tuning, index optimization, and geo-search.

### Trigger Conditions
- Implementing search functionality beyond basic SQL LIKE queries.
- Building autocomplete or search-as-you-type features.
- Choosing a search engine for an application.
- Implementing faceted search for e-commerce product filtering.

---

### Search Engine Selection

| Engine | Speed | Setup | Typo Tolerance | Facets | Best For |
|--------|-------|-------|----------------|--------|----------|
| Typesense | ★★★★★ | Easy | ✅ Built-in | ✅ | Small-medium apps |
| Meilisearch | ★★★★★ | Easy | ✅ Built-in | ✅ | Developer experience |
| Elasticsearch | ★★★★ | Complex | Plugin | ✅ | Enterprise, analytics |
| Algolia | ★★★★★ | SaaS | ✅ Built-in | ✅ | Quick integration |

```typescript
// Typesense — Setup and search
import Typesense from 'typesense';

const client = new Typesense.Client({
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  apiKey: process.env.TYPESENSE_API_KEY!,
});

// Create collection
await client.collections().create({
  name: 'products',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'price', type: 'float', facet: true },
    { name: 'category', type: 'string', facet: true },
    { name: 'rating', type: 'float', sort: true },
  ],
  default_sorting_field: 'rating',
});

// Search with facets
const results = await client.collections('products').documents().search({
  q: 'wireless headphones',
  query_by: 'name,description',
  filter_by: 'price:<100 && category:=Electronics',
  facet_by: 'category,price',
  sort_by: 'rating:desc',
  per_page: 20,
});
```

## Orchestration & Integration
- `database-orm-expert`, `vector-db-rag-expert`, `ecommerce-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengimplementasikan pencarian full-text di aplikasi web. Mencakup Typesense, Meilisearch, Elasticsearch, pencarian berfaset, autocomplete, dan optimasi relevansi.

### Kondisi Pemicu
- Mengimplementasikan fungsionalitas pencarian di luar query SQL LIKE.
- Membangun fitur autocomplete atau search-as-you-type.
- Memilih mesin pencarian untuk aplikasi.
