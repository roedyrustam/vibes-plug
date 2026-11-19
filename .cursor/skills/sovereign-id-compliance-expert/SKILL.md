---
name: sovereign-id-compliance-expert
description: "Indonesian & SEA digital compliance: UU PDP No. 27/2022, PSE Komdigi, BI SNAP, consent ledgers, and data residency / Kepatuhan digital Indonesia & SEA: UU PDP No. 27/2022, PSE Komdigi, BI SNAP, consent ledger, dan residensi data."
author: "Roedy Rustam"
version: "4.9.0"

---

# Sovereign Indonesia & SEA Digital Compliance Expert (UU PDP / PSE / BI SNAP)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Blue-Ocean technical compliance blueprint engineered for Indonesian and Southeast Asian digital systems. Translates **UU No. 27 Tahun 2022 (UU PDP)**, **PSE Lingkup Privat (Komdigi)**, **POJK / Bank Indonesia SNAP**, and **72-hour breach notification SLAs** directly into enforceable PostgreSQL DDL, immutable consent ledgers, automated right-to-erasure workflows (`/delete-account`), and cross-border transfer guards.

### Trigger Conditions
- Building SaaS, FinTech, HealthTech, or e-commerce applications serving Indonesian users under **UU PDP No. 27/2022**.
- Implementing verifiable consent capture, withdrawal, and 3x24-hour (72-hour) data breach reporting workflows.
- Enforcing local data residency (`ap-southeast-3` / Jakarta region) and cross-border transfer adequacy checks (Pasal 56 UU PDP).
- Implementing the mandatory legal trio (`/privacy`, `/terms`, `/delete-account`) with cryptographic audit trails.

### Blueprint 1: UU PDP Immutable Consent Ledger & Breach SLA Schema (PostgreSQL)

```sql
CREATE TABLE IF NOT EXISTS pdp_consent_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  subject_user_id UUID NOT NULL,
  purpose_code TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  consent_status TEXT NOT NULL CHECK (consent_status IN ('GRANTED', 'WITHDRAWN')),
  lawful_basis TEXT NOT NULL CHECK (lawful_basis IN ('CONSENT', 'CONTRACT', 'LEGAL_OBLIGATION', 'VITAL_INTEREST', 'PUBLIC_INTEREST', 'LEGITIMATE_INTEREST')),
  captured_ip INET NOT NULL,
  proof_sha256 TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pdp_consent_subject ON pdp_consent_ledger (tenant_id, subject_user_id, purpose_code, recorded_at DESC);
ALTER TABLE pdp_consent_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY pdp_consent_tenant_isolation ON pdp_consent_ledger
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pdp_breach_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  discovered_at TIMESTAMPTZ NOT NULL,
  notification_deadline_at TIMESTAMPTZ GENERATED ALWAYS AS (discovered_at + INTERVAL '72 hours') STORED,
  affected_records_count INTEGER NOT NULL DEFAULT 0,
  notified_authority_at TIMESTAMPTZ,
  notified_subjects_at TIMESTAMPTZ,
  summary TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pdp_breach_deadline ON pdp_breach_incidents (tenant_id, notification_deadline_at);
ALTER TABLE pdp_breach_incidents ENABLE ROW LEVEL SECURITY;
```

### Blueprint 2: UU PDP Pasal 44 Erasure & Data-Residency Guard (TypeScript)

```typescript
import crypto from 'node:crypto';

export interface ErasureRequest {
  tenantId: string;
  userId: string;
  requestedAtIso: string;
  targetRegion: string;
}

export interface ErasureReceipt {
  receiptId: string;
  status: 'SCHEDULED_WITHIN_72H';
  residencyVerified: boolean;
  retentionHoldApplied: boolean;
  proofHash: string;
}

const ALLOWED_ID_REGIONS = new Set(['ap-southeast-3', 'asia-southeast2', 'id-jakarta-1']);

export function processUupdpErasureRequest(req: ErasureRequest, hasTaxRetentionObligation: boolean): ErasureReceipt {
  const residencyVerified = ALLOWED_ID_REGIONS.has(req.targetRegion);
  if (!residencyVerified) {
    throw new Error(`UU PDP Pasal 56 violation: region "${req.targetRegion}" requires adequacy verification before processing.`);
  }

  const receiptId = `PDP-DEL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const proofHash = crypto
    .createHash('sha256')
    .update(`${req.tenantId}:${req.userId}:${req.requestedAtIso}:${receiptId}`)
    .digest('hex');

  return {
    receiptId,
    status: 'SCHEDULED_WITHIN_72H',
    residencyVerified,
    retentionHoldApplied: hasTaxRetentionObligation,
    proofHash
  };
}
```

## Orchestration & Integration
- **`compliance-gdpr-privacy-expert`**: Bridges UU PDP No. 27/2022 with GDPR Art. 17, Apple App Store 5.1.1(v), and Google Play Data Safety.
- **`doku-payment-gateway`**: Aligns financial transaction retention and BI SNAP security headers with Indonesian banking regulations.
- **`database-orm-expert`**: Enforces Row Level Security (RLS), indexed audit tables, and deterministic migrations.
- **`fga-rebac-authorization-expert`**: Controls granular DPO (*Data Protection Officer*) and admin access to PII records.
- **`zero-trust-secret-vault`**: Manages envelope encryption keys for PII-at-rest and automated key rotation.
- **`anti-slop`**: Ensures legal pages (`/privacy`, `/terms`, `/delete-account`) and erasure endpoints are 100% functional without placeholders.
- **Lifecycle & Swarm Hubs**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / Medium / High (`Gemini 4 Carbon`, `Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Claude Opus 5.5 Medium`) |
| **Availability Fallback** | `Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec sovereign-id-compliance-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | 100% RLS coverage on PII/consent tables, deterministic 72-hour breach SLA tracking, local region guard (`ap-southeast-3` / `asia-southeast2`), verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Blueprint kepatuhan teknis **Blue-Ocean** khusus sistem digital Indonesia dan Asia Tenggara. Menerjemahkan **UU No. 27 Tahun 2022 (UU PDP)**, **PSE Lingkup Privat (Komdigi)**, **POJK / Bank Indonesia SNAP**, dan SLA notifikasi kebocoran data **3x24 jam (72 jam)** secara langsung menjadi skema PostgreSQL RLS, *consent ledger* permanen, alur penghapusan data (`/delete-account`), dan penjaga residensi data lokal.

### Kondisi Pemicu
- Membangun aplikasi SaaS, FinTech, HealthTech, atau e-commerce bagi pengguna Indonesia di bawah **UU PDP No. 27/2022**.
- Mengimplementasikan pencatatan persetujuan (*consent ledger*), penarikan persetujuan, dan pelaporan insiden kebocoran data <= 72 jam.
- Menegakkan residensi data lokal (`ap-southeast-3` / Jakarta) dan validasi transfer data lintas batas (Pasal 56 UU PDP).
- Menerapkan trio hukum wajib (`/privacy`, `/terms`, `/delete-account`) dengan jejak audit kriptografis.

### 3 Prinsip Kepatuhan UU PDP di Produksi
1. **Consent Ledger Bersifat Append-Only**: Jangan menimpa status persetujuan lama; catat setiap perubahan (`GRANTED` / `WITHDRAWN`) sebagai baris baru lengkap dengan hash bukti SHA-256 dan versi kebijakan.
2. **SLA Kebocoran Data 3x24 Jam**: Gunakan kolom `GENERATED ALWAYS AS (discovered_at + INTERVAL '72 hours')` di database agar tenggat pelaporan ke otoritas dan subjek data selalu terukur otomatis.
3. **Pemisahan Penghapusan PII vs Retensi Pajak/FinTech**: Saat pengguna meminta penghapusan akun (`/delete-account`), anonimkan PII non-finansial dalam 72 jam sambil mempertahankan catatan transaksi yang diwajibkan hukum perpajakan/perbankan.

## Integrasi Orkestrasi
- **`compliance-gdpr-privacy-expert`**: Menjembatani UU PDP No. 27/2022 dengan GDPR Pasal 17, Apple App Store 5.1.1(v), dan Google Play Data Safety.
- **`doku-payment-gateway`**: Menyelaraskan retensi transaksi finansial dan standar keamanan BI SNAP.
- **`database-orm-expert`**: Menegakkan Row Level Security (RLS), indeks audit, dan migrasi deterministik.
- **`fga-rebac-authorization-expert`**: Mengontrol akses granular DPO (*Data Protection Officer*) terhadap data PII.
- **`zero-trust-secret-vault`**: Mengelola kunci enkripsi PII-at-rest dan rotasi kunci otomatis.
- **`anti-slop`**: Memastikan halaman hukum dan endpoint hapus data 100% fungsional tanpa placeholder.
- **Hub Orkestrasi**: `zero-to-prod-orchestrator`, `brainstorming`, `session-memory-manager`.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / Medium / High (`Gemini 4 Carbon`, `Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Claude Opus 5.5 Medium`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec sovereign-id-compliance-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Cakupan RLS 100% pada tabel PII/consent, pelacakan SLA kebocoran 72 jam deterministik, penjaga region lokal (`ap-southeast-3` / `asia-southeast2`), diverifikasi via `node scripts/check-anti-slop.js --strict` |
