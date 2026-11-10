---
name: fga-rebac-authorization-expert
description: "Fine-grained ReBAC authorization (OpenFGA, SpiceDB) and permissions / Otorisasi granular ReBAC (OpenFGA, SpiceDB) dan kontrol izin."
author: "Roedy Rustam"
version: "4.7.2"

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

### Hard Guardrails (Declarative Invariants)
- **Pin `authorizationModelId` in Production**: Always configure `OpenFgaClient` with an explicit immutable `authorizationModelId` in production so schema edits never alter live permission evaluations without a controlled rollout.
- **Eliminate N+1 Check Loops**: Never call `.check()` inside a `for` loop or `.map()`; use `batchCheck` for known object sets or `listObjects` for collection filtering in a single round-trip.
- **Never Grant Privileged Relations to `user:*`**: Restrict public wildcard subjects (`user:*`) strictly to read-only relations (`viewer`); never bind `user:*` to `owner`, `admin`, `editor`, or `can_write`.
- **Pre-Filter Vector RAG Queries**: Resolve accessible document IDs via `listObjects` before querying `pgvector` (`WHERE document_id = ANY($1)`); never filter top-K embeddings post-search.
- **Transactional Outbox for Tuple Sync**: Write relationship tuple changes to a PostgreSQL transactional outbox table inside the same ACID transaction as the domain mutation, then relay idempotently to OpenFGA/SpiceDB.
- **Propagate Consistency Tokens on Write-to-Read Paths**: Pass `ZedToken` (SpiceDB) or `ConsistencyPreference.HigherConsistency` (OpenFGA) immediately after permission revocations to prevent the "New Enemy" stale-cache vulnerability.

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

#### 3. SpiceDB Zanzibar Client with ZedToken Consistency Routing (TypeScript)
Prevent the classic "New Enemy" problem (stale read allowing revoked access) by propagating `ZedToken` across write-to-read causal boundaries:

```typescript
// src/authz/spicedb-rebac-router.ts
export interface ZanzibarCheckRequest {
  resourceType: 'workspace' | 'project' | 'document';
  resourceId: string;
  relation: 'viewer' | 'editor' | 'admin';
  subjectType: 'user';
  subjectId: string;
  atZedToken?: string;
}

export interface ZanzibarWriteTuple {
  resourceType: 'workspace' | 'project' | 'document';
  resourceId: string;
  relation: string;
  subjectType: 'user' | 'team';
  subjectId: string;
}

export class SpiceDbZanzibarRouter {
  private readonly endpoint: string;
  private readonly presharedKey: string;

  constructor(endpoint: string, presharedKey: string) {
    this.endpoint = endpoint;
    this.presharedKey = presharedKey;
  }

  public async checkPermission(req: ZanzibarCheckRequest): Promise<{ allowed: boolean; zedToken: string }> {
    const payload = {
      resource: {
        objectType: req.resourceType,
        objectId: req.resourceId,
      },
      permission: req.relation,
      subject: {
        object: {
          objectType: req.subjectType,
          objectId: req.subjectId,
        },
      },
      consistency: req.atZedToken
        ? { atExactSnapshot: { token: req.atZedToken } }
        : { minimizeLatency: true },
    };

    const res = await fetch(`${this.endpoint}/v1/permissions/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.presharedKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`[SpiceDB] CheckPermission failed HTTP ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as {
      permissionship: 'PERMISSIONSHIP_HAS_PERMISSION' | 'PERMISSIONSHIP_NO_PERMISSION';
      checkedAt: { token: string };
    };

    return {
      allowed: data.permissionship === 'PERMISSIONSHIP_HAS_PERMISSION',
      zedToken: data.checkedAt?.token ?? '',
    };
  }

  public async writeRelationshipTuples(
    tenantId: string,
    tuples: readonly ZanzibarWriteTuple[]
  ): Promise<string> {
    const updates = tuples.map((t) => ({
      operation: 'OPERATION_TOUCH',
      tuple: {
        resource: {
          objectType: `${tenantId}/${t.resourceType}`,
          objectId: t.resourceId,
        },
        relation: t.relation,
        subject: {
          object: {
            objectType: t.subjectType,
            objectId: t.subjectId,
          },
        },
      },
    }));

    const res = await fetch(`${this.endpoint}/v1/relationships/write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.presharedKey}`,
      },
      body: JSON.stringify({ updates }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`[SpiceDB] WriteTuples failed HTTP ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as { writtenAt: { token: string } };
    return data.writtenAt.token;
  }
}
```

---

#### 4. OpenFGA ABAC Conditions (CEL Time-Bound & IP-Restricted Grants)
Combine Zanzibar relationship graphs with Google CEL attribute conditions for expiring contractor access or corporate CIDR restrictions:

```dsl
model
  schema 1.1

type user

type document
  relations
    define owner: [user]
    define viewer: [user, user with non_expired_grant] or owner

condition non_expired_grant(current_time: timestamp, expires_at: timestamp) {
  current_time < expires_at
}
```

---

#### 5. BatchCheck & HigherConsistency Evaluation (`@openfga/sdk`)
Evaluate dozens of object permissions in a single network call using `batchCheck` and bypass read caches with `ConsistencyPreference.HigherConsistency` right after ACL mutations:

```typescript
// src/authz/fga-batch-checker.ts
import { OpenFgaClient, ConsistencyPreference } from '@openfga/sdk';

export interface BatchPermissionQuery {
  userId: string;
  relation: 'can_read' | 'can_write';
  documentIds: readonly string[];
  requireFreshRead?: boolean;
}

export async function filterAuthorizedDocumentsBatch(
  fga: OpenFgaClient,
  query: BatchPermissionQuery
): Promise<string[]> {
  if (query.documentIds.length === 0) return [];

  const checks = query.documentIds.map((docId, idx) => ({
    user: `user:${query.userId}`,
    relation: query.relation,
    object: `document:${docId}`,
    correlationId: `chk_${idx}_${docId}`,
  }));

  const response = await fga.batchCheck(
    { checks },
    {
      consistency: query.requireFreshRead
        ? ConsistencyPreference.HigherConsistency
        : ConsistencyPreference.MinimizeLatency,
    }
  );

  const allowedIds: string[] = [];
  for (const item of response.result ?? []) {
    if (item.allowed && item.request?.object) {
      allowedIds.push(item.request.object.replace(/^document:/, ''));
    }
  }
  return allowedIds;
}
```

---

#### 6. PostgreSQL Transactional Outbox for Atomic ReBAC Tuple Synchronization
Never dual-write to PostgreSQL and OpenFGA in separate non-transactional network calls. Persist tuple mutations in a PostgreSQL outbox table within the same ACID transaction and relay with `FOR UPDATE SKIP LOCKED`:

```sql
-- migrations/002_fga_tuple_outbox.sql
CREATE TABLE IF NOT EXISTS public.fga_tuple_outbox (
    outbox_id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('WRITE', 'DELETE')),
    user_key TEXT NOT NULL,
    relation TEXT NOT NULL,
    object_key TEXT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fga_tuple_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_fga_outbox ON public.fga_tuple_outbox
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE INDEX idx_fga_outbox_unprocessed
    ON public.fga_tuple_outbox (created_at)
    WHERE processed_at IS NULL;
```

---

#### 7. Automated OpenFGA Model Regression Test Suite (`fga/tests/document-model.fga.yaml`)
Run `fga model test --tests fga/tests/document-model.fga.yaml` in CI on every PR to prove inheritance rules and prevent accidental privilege escalation:

```yaml
# fga/tests/document-model.fga.yaml
name: Document Hierarchy ReBAC Regression Suite
model_file: ../model.fga
tuples:
  - user: user:alice
    relation: admin
    object: organization:acme
  - user: organization:acme
    relation: org
    object: folder:engineering
  - user: folder:engineering
    relation: parent_folder
    object: document:spec-2026
tests:
  - name: Org admin inherits write and read on nested folder documents
    check:
      - user: user:alice
        object: document:spec-2026
        assertions:
          can_write: true
          can_read: true
      - user: user:intruder
        object: document:spec-2026
        assertions:
          can_write: false
          can_read: false
```

---

### Verification Checklist
- [ ] Every resource mutation endpoint verifies object-level authorization (`Check(user, can_write, object)`) to prevent IDOR vulnerabilities.
- [ ] Vector RAG pipelines filter embeddings by authorized document IDs (`WHERE document_id = ANY($1)`) prior to LLM context injection.
- [ ] Relationship tuples are deleted atomically within the same saga/outbox flow when underlying database entities are deleted.
- [ ] Zanzibar consistency tokens (`ZedToken` / `consistency: HIGHER_CONSISTENCY`) are passed after permission mutations to prevent New-Enemy stale reads.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec fga-rebac-authorization-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


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

### Guardrail Wajib (Invarian Deklaratif)
- **Pinning `authorizationModelId` di Produksi**: Selalu kunci `authorizationModelId` pada `OpenFgaClient` di produksi agar perubahan model tidak mengubah evaluasi izin secara diam-diam.
- **Eliminasi Loop N+1 Check**: Dilarang memanggil `.check()` di dalam perulangan `for` atau `.map()`; gunakan `batchCheck` atau `listObjects` dalam satu panggilan jaringan.
- **Larangan Wildcard `user:*` pada Relasi Istimewa**: Batasi `user:*` hanya untuk relasi baca publik (`viewer`); jangan pernah memberikan `owner`, `admin`, atau `editor` ke `user:*`.
- **Pra-Filter Kueri Vector RAG**: Evaluasi ID dokumen yang diizinkan melalui `listObjects` sebelum menjalankan kueri `pgvector` (`WHERE document_id = ANY($1)`).
- **Transactional Outbox untuk Sinkronisasi Tuple**: Simpan perubahan tuple relasi ke tabel outbox PostgreSQL dalam satu transaksi ACID bersama perubahan data utama.
- **Propagasi Token Konsistensi**: Kirim `ZedToken` atau `ConsistencyPreference.HigherConsistency` setelah pencabutan izin guna mencegah celah *New Enemy*.

### Panduan Arsitektur Inti
1. ** melampaui RBAC Statis**: Gunakan tuple relasi `(user, relation, object)` untuk memodelkan berbagi dokumen kolaboratif ala Google Drive atau Linear.
2. **RAG Sadar-Otorisasi**: Selalu evaluasi daftar dokumen yang diizinkan (`listObjects`) dan pasang filter `WHERE document_id = ANY(...)` pada kueri pgvector sebelum potongan teks dikirim ke prompt LLM.
3. **Pencegahan Masalah New-Enemy**: Gunakan token konsistensi (`ZedToken`) saat pencabutan akses agar cache otorisasi langsung diperbarui.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Setiap endpoint memeriksa izin tingkat objek untuk mencegah celah IDOR.
- [ ] Pipeline RAG memfilter dokumen berdasarkan izin akses pengguna sebelum masuk ke konteks LLM.
- [ ] Tuple relasi dihapus secara sinkron ketika entitas di database utama dihapus.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec fga-rebac-authorization-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
