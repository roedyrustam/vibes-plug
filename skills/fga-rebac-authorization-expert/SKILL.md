---
name: fga-rebac-authorization-expert
description: "Expert guide for Fine-Grained Authorization (FGA), Google Zanzibar Relationship-Based Access Control (OpenFGA, SpiceDB, Permify), Cedar policy engines, and permission-aware RAG retrieval / Panduan ahli otorisasi granular ReBAC (OpenFGA, SpiceDB) dan retrieval RAG sadar-izin."
author: "Roedy Rustam"
version: "4.4.2"

---

# Fine-Grained Authorization (FGA) & ReBAC Expert (2026 Zanzibar Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Identity & Authentication**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `zero-trust-secret-vault`
- **Multi-Tenant SaaS & Database**: `saas-multi-tenant`, `database-orm-expert`, `supabase-security-expert`
- **Permission-Aware AI & RAG**: `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `ai-safety-governance-expert`
- **Formal Verification & Lifecycle**: `formal-spec-z3-verifier`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Enterprise authorization engineering guide for **Relationship-Based Access Control (ReBAC)** modeled on **Google Zanzibar** (**OpenFGA**, **SpiceDB**, **Permify**) and attribute/policy engines (**AWS Cedar**, **Cerbos**). Moves beyond flat `user.role === 'admin'` checks to model nested organizational hierarchies (`Organization -> Team -> Folder -> Document`), sub-millisecond permission checks (`Check(user, relation, object)`), and **Permission-Aware Vector RAG** so AI agents never leak unauthorized documents across users.

### Trigger Conditions
- Designing B2B SaaS permissions with nested inheritance (Workspace $\rightarrow$ Project $\rightarrow$ Document sharing).
- Integrating OpenFGA, SpiceDB, or AWS Cedar into API middlewares.
- Enforcing document-level access control on pgvector / RAG knowledge retrieval pipelines.
- Replacing brittle, deeply nested SQL permission joins with relationship tuples.

---

### Authorization Paradigm Selection Matrix

| Paradigm | Engine Examples | Granularity | Best Use Case |
| :--- | :--- | :---: | :--- |
| **RBAC (Role-Based)** | Custom JWT claims, Clerk Org Roles | Coarse | Simple tenant roles (`owner`, `admin`, `member`) |
| **ABAC (Attribute-Based)** | AWS Cedar, Cerbos, OPA | Medium-High | Context rules (IP range, time window, department, spend limit) |
| **ReBAC (Relationship-Based)** | OpenFGA, SpiceDB (Zanzibar) | Ultra-Fine | Google Drive / Notion / Linear nested resource sharing & graphs |

---

### Core Implementation Patterns

#### 1. OpenFGA Authorization Model DSL (Nested Inheritance)
```dsl
model
  schema 1.1

type user

type organization
  relations
    define admin: [user]
    define member: [user] or admin

type folder
  relations
    define org: [organization]
    define owner: [user]
    define editor: [user] or owner or admin from org
    define viewer: [user] or editor or member from org

type document
  relations
    define parent_folder: [folder]
    define owner: [user]
    define can_write: [user] or owner or editor from parent_folder
    define can_read: [user] or can_write or viewer from parent_folder
```

---

#### 2. Type-Safe ReBAC Enforcement & Permission-Aware RAG Pre-Filter (TypeScript)
Never perform vector similarity search first and filter unauthorized chunks in memory afterward (which starves top-K results). Always resolve authorized object IDs or security principals first and push them into the vector query filter:

```typescript
// src/authz/fga-client.ts
import { OpenFgaClient } from '@openfga/sdk';

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL ?? 'http://localhost:8080',
  storeId: process.env.FGA_STORE_ID!,
  authorizationModelId: process.env.FGA_MODEL_ID!,
});

export async function assertDocumentPermission(params: {
  userId: string;
  documentId: string;
  relation: 'can_read' | 'can_write';
}): Promise<void> {
  const { allowed } = await fgaClient.check({
    user: `user:${params.userId}`,
    relation: params.relation,
    object: `document:${params.documentId}`,
  });

  if (!allowed) {
    throw new Error(`Forbidden: user:${params.userId} lacks ${params.relation} on document:${params.documentId}`);
  }
}

export async function listAccessibleDocumentIds(userId: string): Promise<string[]> {
  const response = await fgaClient.listObjects({
    user: `user:${userId}`,
    relation: 'can_read',
    type: 'document',
  });

  return (response.objects ?? []).map((obj) => obj.replace(/^document:/, ''));
}
```

---

### Verification Checklist
- [ ] Every resource mutation endpoint verifies object-level authorization (`Check(user, can_write, object)`) to prevent IDOR vulnerabilities.
- [ ] Vector RAG pipelines filter embeddings by authorized document IDs (`WHERE document_id = ANY($1)`) prior to LLM context injection.
- [ ] Relationship tuples are deleted atomically within the same saga/outbox flow when underlying database entities are deleted.
- [ ] Zanzibar consistency tokens (`ZedToken` / `consistency: HIGHER_CONSISTENCY`) are passed after permission mutations to prevent New-Enemy stale reads.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Identitas & Autentikasi**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `zero-trust-secret-vault`
- **SaaS Multi-Tenant & Database**: `saas-multi-tenant`, `database-orm-expert`, `supabase-security-expert`
- **AI & RAG Sadar-Izin**: `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `ai-safety-governance-expert`
- **Verifikasi Formal & Siklus Hidup**: `formal-spec-z3-verifier`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa otorisasi enterprise untuk **Relationship-Based Access Control (ReBAC)** berbasis **Google Zanzibar** (**OpenFGA**, **SpiceDB**, **Permify**) serta mesin kebijakan atribut (**AWS Cedar**, **Cerbos**). Mencakup pewarisan izin bertingkat (`Organisasi -> Folder -> Dokumen`) dan **Permission-Aware Vector RAG** agar agen AI tidak pernah membocorkan dokumen lintas pengguna.

### Panduan Arsitektur Inti
1. ** melampaui RBAC Statis**: Gunakan tuple relasi `(user, relation, object)` untuk memodelkan berbagi dokumen kolaboratif ala Google Drive atau Linear.
2. **RAG Sadar-Otorisasi**: Selalu evaluasi daftar dokumen yang diizinkan (`listObjects`) dan pasang filter `WHERE document_id = ANY(...)` pada kueri pgvector sebelum potongan teks dikirim ke prompt LLM.
3. **Pencegahan Masalah New-Enemy**: Gunakan token konsistensi (`ZedToken`) saat pencabutan akses agar cache otorisasi langsung diperbarui.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Setiap endpoint memeriksa izin tingkat objek untuk mencegah celah IDOR.
- [ ] Pipeline RAG memfilter dokumen berdasarkan izin akses pengguna sebelum masuk ke konteks LLM.
- [ ] Tuple relasi dihapus secara sinkron ketika entitas di database utama dihapus.
