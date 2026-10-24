---
name: autonomous-api-drift-healer
description: "Expert guide for autonomous API schema drift detection, OpenAPI / gRPC breaking change monitoring, self-healing SDK adapter generation, and zero-downtime client-server synchronization / Panduan ahli deteksi drift skema API otonom, pemantauan breaking change OpenAPI / gRPC, pembuatan adapter SDK self-healing, dan sinkronisasi client-server tanpa downtime."
author: "Roedy Rustam"
version: "4.4.2"

---

# autonomous-api-drift-healer — vibes-plug Skill

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Specs & Contract SSoT**: `api-design-expert`, `spec-driven-development-expert`, `prd-architect`
- **Client & SDK Codegen**: `openapi-swagger-codegen-expert`, `typescript-expert`, `tanstack-query-expert`
- **Testing & Verification Sandbox**: `e2e-testing-expert`, `ephemeral-wasm-sandbox-executor`, `autonomous-tdd-debugger`
- **Debt Auditing & Cleanup**: `zero-tech-debt-auditor`, `anti-slop`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`

### Description
Production guide for architecting autonomous API drift detection and self-healing pipelines across microservices and fullstack applications. Continuously analyzes schema differences across OpenAPI 3.1 specifications, gRPC Protocol Buffers, and GraphQL schemas, automatically synthesizing backward-compatible adapter layers, updating frontend Zod schemas, and issuing self-healing pull requests to eliminate client-server desynchronization.

### Trigger Conditions
Activate this skill when:
- Backend API endpoints or payload schemas are updated and frontend client calls risk desynchronization.
- Migrating between major API versions while requiring zero downtime for existing mobile and web clients.
- Auditing microservice contracts for breaking changes prior to deployment.
- Generating automated backward-compatibility shims when deprecating legacy fields.

---

### Core Concepts & Patterns

#### 1. API Drift Classification Taxonomy

| Drift Type | Severity | Impact | Self-Healing Strategy |
| :--- | :--- | :--- | :--- |
| **Field Renaming** | High (Breaking) | Old clients crash on `undefined` property | Synthesize getter shim translating old field name to new name |
| **New Required Param** | High (Breaking) | Old client requests rejected with 400 Bad Request | Introduce server-side default fallback in middleware |
| **Type Broadening** (e.g. `string` $\to$ `string \| string[]`) | Medium | Downstream callers may fail on single-item assumptions | Synthesize client normalizer normalizing to array |
| **Field Addition (Optional)** | Low (Additive) | Non-breaking | Regenerate TypeScript types and Zod schemas automatically |

#### 2. Autonomous Schema Drift Detector (TypeScript Implementation)

```typescript
export interface SchemaProperty {
  type: string;
  required?: boolean;
}

export interface EndpointContract {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  properties: Record<string, SchemaProperty>;
}

export interface DriftReport {
  breakingChanges: string[];
  additiveChanges: string[];
  hasDrift: boolean;
}

export class AutonomousApiDriftHealer {
  public static compareContracts(
    baseline: EndpointContract,
    updated: EndpointContract
  ): DriftReport {
    const breakingChanges: string[] = [];
    const additiveChanges: string[] = [];

    // Check for removed properties
    for (const [key, baseProp] of Object.entries(baseline.properties)) {
      if (!updated.properties[key]) {
        breakingChanges.push(`Property "${key}" of type "${baseProp.type}" was removed.`);
      } else if (baseProp.type !== updated.properties[key].type) {
        breakingChanges.push(
          `Property "${key}" changed type from "${baseProp.type}" to "${updated.properties[key].type}".`
        );
      }
    }

    // Check for newly introduced required properties
    for (const [key, updatedProp] of Object.entries(updated.properties)) {
      if (!baseline.properties[key]) {
        if (updatedProp.required) {
          breakingChanges.push(`New required property "${key}" was added.`);
        } else {
          additiveChanges.push(`New optional property "${key}" added.`);
        }
      }
    }

    return {
      breakingChanges,
      additiveChanges,
      hasDrift: breakingChanges.length > 0 || additiveChanges.length > 0
    };
  }

  public static generateBackwardCompatibleShim(
    oldField: string,
    newField: string
  ): string {
    return [
      `// Auto-generated backward compatibility adapter`,
      `export function adaptLegacyPayload<T extends Record<string, unknown>>(data: T): T & Record<string, unknown> {`,
      `  if (data && typeof data === 'object') {`,
      `    if (data['${newField}'] !== undefined && data['${oldField}'] === undefined) {`,
      `      return { ...data, ['${oldField}']: data['${newField}'] };`,
      `    }`,
      `  }`,
      `  return data;`,
      `}`
    ].join('\n');
  }
}
```

#### 3. Continuous Self-Healing Loop

```
[Git Commit: Backend Schema Edit]
               │
               ▼
[Drift Detection Sentinel]
  ├── Compares Staging OpenAPI against Production Spec
  └── Generates Drift Classification Report
               │
         Is Breaking?
        ┌──────┴──────┐
        ▼             ▼
      (Yes)          (No)
        │             │
        │             ▼
        │     Update Frontend Types
        ▼
[Synthesize Compatibility Layer]
  ├── Inject Middleware Default Mappings
  ├── Update Zod Client Validation Schemas
  └── Run E2E Test Suite via Ephemeral Sandbox
               │
               ▼
[Generate Automated Self-Healing PR]
```

---

### Best Practices

1. **Enforce Contract Verification in CI**: Block merge requests that introduce unannounced breaking schema changes without adapters.
2. **Auto-Generate Compatibility Shims**: When deprecating fields, keep them active for at least one minor release cycle via transformation adapters.
3. **Keep Zod Schemas Synchronized**: Automatically run code generation from OpenAPI specs so frontend types and runtime validators stay in lockstep.
4. **Log Adapter Usage**: Track telemetry on how often legacy adapters are triggered to safely decommission them when usage reaches zero.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Operational Risk | Engineering Remedy |
| :--- | :--- | :--- |
| Deleting an API field without client audit | Instant client crashes on mobile apps where updates are delayed | Mark field `@deprecated` and synthesize compatibility getter |
| Silently ignoring unmapped fields | Data loss and corrupted downstream state | Validate payloads strictly using Zod `.strict()` or `.passthrough()` |
| Manual manual updating of API types | Drift builds up, leading to painful quarterly migrations | Automate codegen via `openapi-typescript` on every commit |

---

#### Runtime Schema Drift Detector & Adapter Coercer (TypeScript)
```typescript
export interface FieldMigrationRule {
  legacyField: string;
  modernField: string;
}

export function healPayloadDrift(
  rawPayload: Record<string, unknown>,
  rules: readonly FieldMigrationRule[]
): { normalized: Record<string, unknown>; driftedFields: string[] } {
  const normalized: Record<string, unknown> = { ...rawPayload };
  const driftedFields: string[] = [];

  for (const rule of rules) {
    if (rule.legacyField in normalized && !(rule.modernField in normalized)) {
      normalized[rule.modernField] = normalized[rule.legacyField];
      delete normalized[rule.legacyField];
      driftedFields.push(rule.legacyField);
    }
  }

  return { normalized, driftedFields };
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec autonomous-api-drift-healer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Spesifikasi Hulu & SSoT Kontrak**: `api-design-expert`, `spec-driven-development-expert`, `prd-architect`
- **Codegen SDK & Klien**: `openapi-swagger-codegen-expert`, `typescript-expert`, `tanstack-query-expert`
- **Sandbox Pengujian & Verifikasi**: `e2e-testing-expert`, `ephemeral-wasm-sandbox-executor`, `autonomous-tdd-debugger`
- **Audit Utang Teknis & Pembersihan**: `zero-tech-debt-auditor`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`

### Deskripsi
Panduan produksi untuk merancang pipeline deteksi drift skema API dan penyembuhan mandiri (*self-healing*) pada aplikasi fullstack dan microservices. Menganalisis perbedaan skema secara berkesinambungan pada spesifikasi OpenAPI 3.1, gRPC Protocol Buffers, dan GraphQL, menghasilkan adapter kompatibilitas mundur (*backward-compatible*), memperbarui skema Zod pada frontend, serta membuat pull request otomatis untuk mencegah desinkronisasi client-server.

### Kondisi Pemicu
Aktifkan skill ini ketika:
- Endpoint API backend atau skema payload diubah dan panggilan frontend berisiko mengalami desinkronisasi.
- Melakukan migrasi antar versi API utama dengan target nol *downtime* pada aplikasi web dan mobile.
- Mengaudit kontrak microservices sebelum proses deploy ke produksi.
- Menghasilkan shim kompatibilitas mundur saat menghapus atau mengubah nama properti lawas.

---

### Konsep Inti & Pola Praktik

#### 1. Klasifikasi Perubahan Skema (*Drift Classification*)
- **Perubahan Merusak (*Breaking*)**: Menghapus field yang sudah ada, mengubah tipe data (misal dari string ke number), atau menambahkan parameter wajib (*required*) baru. Solusi: Buat adapter transformasi atau nilai default di middleware.
- **Perubahan Tambahan (*Additive*)**: Menambahkan field opsional baru. Solusi: Perbarui tipe TypeScript dan skema Zod secara otomatis.

#### 2. Pipeline Penyembuhan Mandiri (*Self-Healing Loop*)
1. **Deteksi Perubahan**: Bandingkan spesifikasi OpenAPI backend terkini dengan skema klien yang ada.
2. **Pembuatan Adapter**: Jika ditemukan penggantian nama field, buat adapter getter untuk menerjemahkan field lama ke field baru.
3. **Pembaruan Tipe Klien**: Jalankan generator tipe TypeScript dan skema validasi runtime Zod.
4. **Verifikasi Pengujian**: Uji integrasi dalam sandbox untuk memastikan klien lama tetap berfungsi.
5. **Pull Request Otomatis**: Buat cabang git dan PR dengan deskripsi perubahan yang jelas.

---

### Praktik Terbaik

1. **Jadikan Pengecekan Kontrak Sebagai Gerbang CI**: Gagalkan proses merge jika terdapat *breaking change* yang belum dilengkapi adapter kompatibilitas.
2. **Pertahankan Field Lawas Selama Masa Transisi**: Jangan langsung menghapus properti; tandai sebagai `@deprecated` dan gunakan adapter minimal selama satu siklus rilis.
3. **Sinkronkan Skema Zod**: Pastikan validator frontend selalu diperbarui langsung dari kontrak OpenAPI.
4. **Pantau Penggunaan Adapter**: Catat metrik penggunaan adapter untuk mengetahui kapan modul lawas aman dihapus sepenuhnya.

---

### Jebakan Umum yang Harus Dihindari

| Praktik Buruk | Dampak Buruk | Solusi Rekayasa |
| :--- | :--- | :--- |
| Menghapus field API tanpa memeriksa versi aplikasi mobile | Aplikasi versi lama langsung crash saat dibuka pengguna | Gunakan adapter kompatibilitas mundur pada middleware |
| Mengabaikan properti tambahan secara diam-diam | Terjadi kehilangan data saat payload disimpan kembali | Gunakan validasi eksplisit dengan skema Zod |
| Mengetik ulang interface API secara manual di frontend | Terjadi akumulasi desinkronisasi tipe data | Gunakan otomatisasi codegen dari OpenAPI pada setiap commit |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec autonomous-api-drift-healer <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
