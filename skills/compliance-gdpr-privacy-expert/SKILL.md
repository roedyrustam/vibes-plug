---
name: compliance-gdpr-privacy-expert
description: "Data privacy compliance: GDPR, CCPA, PDPA, and privacy-by-design / Kepatuhan privasi data: GDPR, CCPA, PDPA, dan audit trail privasi."
author: "Roedy Rustam"
version: "4.8.0"
---

# Data Privacy & Compliance Expert (GDPR, CCPA & UU PDP 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Database & Data Retention**: `database-orm-expert`, `double-entry-ledger-fintech-expert`, `saas-multi-tenant`, `saas-billing`
- **Identity & Access Revocation**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `fga-rebac-authorization-expert`, `zero-trust-secret-vault`
- **Logging & Error Redaction**: `logging-error-tracking-expert`, `data-telemetry-expert`
- **Security & Red Teaming**: `autonomous-red-teamer`, `prompt-injection-firewall`, `rate-limit-abuse-prevention`
- **Lifecycle & Governance**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production engineering guide for regulatory data privacy and compliance across **GDPR (EU)**, **CCPA/CPRA (California)**, and **UU PDP No. 27/2022 (Indonesia)**. Covers cryptographic PII protection (crypto-shredding & blind indexing), cascading data anonymization (*Right to be Forgotten* while preserving immutable tax/financial ledgers), granular consent state machines, and automated logger redaction.

### 1. Regulatory Privacy Controls Matrix (GDPR / CCPA / UU PDP)

| Regulatory Requirement | Naïve Anti-Pattern (Illegal / Risky) | 2026 Engineering Pattern |
| :--- | :--- | :--- |
| **Right to Erasure (Art. 17 GDPR / Pasal 43 UU PDP)** | `DELETE FROM users CASCADE` (destroys tax invoices & breaks ledger integrity) | **Crypto-Shredding + PII Tombstoning**: Scrub PII columns & destroy per-user DEK while retaining immutable ledger amounts |
| **Searchable Encrypted PII (NIK / SSN / Email)** | Storing plaintext PII to allow `WHERE nik = $1` | **AES-256-GCM Ciphertext + HMAC-SHA256 Blind Index** (`nik_bidx`) |
| **Analytics & Marketing Tracking** | Firing trackers on page load before banner interaction | **Default-Deny Consent Gate**: Block third-party scripts until explicit opt-in record is persisted |
| **Observability & Error Logs** | Dumping `req.body` or `user` objects into stdout/Sentry | **Path-Based Structured Redaction** (`pino` `redact` + custom PII regex scrubbers) |

### 2. Cascading PII Anonymization & Crypto-Shredding Routine (TypeScript / PostgreSQL)
Erases personal identity irreversibly while preserving aggregate transaction integrity for tax and accounting audits:

```typescript
// src/services/privacy-compliance.ts
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import crypto from 'node:crypto';

export async function processRightToBeForgotten(
  userId: string,
  pepperSecret: string
): Promise<{ pseudoId: string; executedAt: string }> {
  if (!pepperSecret || pepperSecret.length < 32) {
    throw new Error('PRIVACY_CONFIG_ERROR: PEPPER_SECRET must be at least 32 characters.');
  }

  return db.transaction(async (tx) => {
    const pseudoHash = crypto
      .createHmac('sha256', pepperSecret)
      .update(userId)
      .digest('hex')
      .slice(0, 20);
    const anonymizedEmail = `erased-${pseudoHash}@anonymized.invalid`;
    const executedAt = new Date().toISOString();

    // 1. Scrub PII columns on user record while preserving foreign key integrity for financial ledgers
    await tx.execute(sql`
      UPDATE users
      SET
        name = 'Anonymized Subject',
        email = ${anonymizedEmail},
        phone_number = NULL,
        national_id_ciphertext = NULL,
        national_id_bidx = NULL,
        billing_address = NULL,
        ip_address = '0.0.0.0',
        is_anonymized = TRUE,
        anonymized_at = NOW()
      WHERE id = ${userId}
    `);

    // 2. Destroy per-subject encryption keys (Crypto-Shredding for historical backups)
    await tx.execute(sql`DELETE FROM subject_encryption_keys WHERE user_id = ${userId}`);

    // 3. Revoke active sessions, WebAuthn credentials, and OAuth tokens
    await tx.execute(sql`DELETE FROM user_sessions WHERE user_id = ${userId}`);
    await tx.execute(sql`DELETE FROM oauth_accounts WHERE user_id = ${userId}`);

    // 4. Write immutable compliance audit log (stores only HMAC pseudo-identifier, zero plaintext PII)
    await tx.execute(sql`
      INSERT INTO privacy_audit_logs (id, action, target_pseudo_id, executed_at)
      VALUES (gen_random_uuid(), 'RIGHT_TO_BE_FORGOTTEN_EXECUTED', ${pseudoHash}, NOW())
    `);

    return { pseudoId: pseudoHash, executedAt };
  });
}
```

### 3. Pino Logger Automated PII Redaction Configuration

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'email',
      'password',
      'token',
      'creditCard',
      'nationalId',
      'nik',
      'authorization',
      '*.email',
      '*.password',
      '*.phone_number',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED_PII]',
  },
});
```

### 4. Production Verification Checklist
- [ ] **Never Hard-Delete Financial Ledgers**: Tax laws require retaining invoice and ledger amounts for 5–10 years; anonymize the subject's PII while keeping ledger entries intact.
- [ ] **Searchable PII Uses Blind Indexing**: Sensitive identifiers (NIK/KTP, SSN, Passport) are encrypted with AES-256-GCM and queried via a keyed `HMAC-SHA256` blind index column.
- [ ] **Explicit Opt-In Consent Audit Trail**: Marketing and analytics scripts remain blocked until a signed row in `user_privacy_consents` records `policy_version` and `granted_at`.
- [ ] **Zero Plaintext PII in Logs or LLMs**: Logger redaction (`[REDACTED_PII]`) is active across all microservices and AI prompt pipelines.
- [ ] **Mandatory Legal & Privacy Trio Deployed**: Public routes for Privacy Policy (`/privacy`), Terms & Conditions (`/terms`), and User Data Deletion (`/delete-account` or `/data-deletion`) are live and operational.

### 5. Mandatory Web & Mobile Legal Trio (Privacy Policy, Terms, Data Deletion)
Every new application MUST automatically instantiate the **Legal & Privacy Trio**:

1. **Privacy Policy (`/privacy` or `/privacy-policy`)**:
   - Comprehensive statement of PII collected, legal bases, cookies, subprocessors, and data subject rights under UU No. 27/2022 (UU PDP) & GDPR.
2. **Terms & Conditions (`/terms` or `/terms-and-conditions`)**:
   - Binding agreement detailing acceptable use, account liabilities, billing terms, and governing law (e.g. Laws of the Republic of Indonesia).
3. **Public Data Deletion Request Page & In-App Flow (`/delete-account` or `/data-deletion`)**:
   - Meets **Google Play Data Safety** & **Apple App Store Guideline 5.1.1(v)**:
     - Public URL where users can request account and data deletion without re-installing the mobile app.
     - In-app Account Settings deletion button with secondary confirmation.
     - Wired to `POST /api/privacy/data-deletion` (initiating crypto-shredding and cascading anonymization).

```typescript
// app/api/privacy/data-deletion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const deletionRequestSchema = z.object({
  email: z.string().email(),
  confirmationCode: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = deletionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_REQUEST', details: parsed.error.issues }, { status: 400 });
  }

  return NextResponse.json({
    status: 'DELETION_INITIATED',
    message: 'User data anonymization and crypto-shredding scheduled successfully.',
  });
}
```

### 6. Searchable Encrypted PII with `AES-256-GCM` & Keyed `HMAC-SHA256` Blind Index (TypeScript)
To query sensitive PII columns (`WHERE national_id_bidx = $1`) without storing plaintext NIK/SSN/Email in the database, compute a deterministic HMAC-SHA256 blind index alongside a randomized-IV `AES-256-GCM` ciphertext:

```typescript
// src/lib/privacy/blind-index-pii.ts
import crypto from 'node:crypto';

export interface ProtectedPiiEnvelope {
  readonly ciphertextB64: string;
  readonly ivB64: string;
  readonly authTagB64: string;
  readonly blindIndexHex: string;
}

export function normalizePiiForBlindIndex(rawValue: string): string {
  return rawValue.trim().toLowerCase().replace(/[\s-]/g, '');
}

export function computePiiBlindIndex(rawValue: string, blindIndexKeyHex: string): string {
  const key = Buffer.from(blindIndexKeyHex, 'hex');
  if (key.byteLength < 32) {
    throw new Error('BLIND_INDEX_KEY_ERROR: Key must be at least 32 bytes (64 hex chars).');
  }
  const canonical = normalizePiiForBlindIndex(rawValue);
  return crypto.createHmac('sha256', key).update(canonical, 'utf8').digest('hex');
}

export function encryptSearchablePii(
  rawValue: string,
  encryptionKeyHex: string,
  blindIndexKeyHex: string,
  subjectId: string
): ProtectedPiiEnvelope {
  const encKey = Buffer.from(encryptionKeyHex, 'hex');
  if (encKey.byteLength !== 32) {
    throw new Error('PII_ENC_KEY_ERROR: Encryption key must be 32 bytes.');
  }
  if (encryptionKeyHex === blindIndexKeyHex) {
    throw new Error('PII_KEY_SEPARATION_ERROR: Encryption key and blind-index key must be distinct.');
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encKey, iv);
  cipher.setAAD(Buffer.from(subjectId, 'utf8'));

  const encrypted = Buffer.concat([cipher.update(rawValue, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertextB64: encrypted.toString('base64'),
    ivB64: iv.toString('base64'),
    authTagB64: authTag.toString('base64'),
    blindIndexHex: computePiiBlindIndex(rawValue, blindIndexKeyHex),
  };
}
```

### Hard Guardrails (Declarative Invariants)
- **Never Hard-Delete Financial Ledger Rows on Erasure Requests**: Execute Crypto-Shredding and PII column tombstoning (`UPDATE users SET email = 'erased-...@anonymized.invalid', national_id_ciphertext = NULL`) instead of `DELETE FROM users CASCADE` so tax and double-entry ledger audits remain intact.
- **Distinct Keys for Encryption vs Blind Indexing**: Never reuse the `AES-256-GCM` encryption key as the `HMAC-SHA256` blind-index key, and never use unsalted `SHA-256` (`createHash('sha256')`) for PII blind indexes (which is vulnerable to rainbow-table reversal on 16-digit NIK / 9-digit SSN spaces).
- **Default-Deny Analytics & Marketing Consent**: Third-party tracking pixels and session replay SDKs must not initialize until an explicit opt-in consent record with `policy_version` is verified.
- **Mandatory Legal & Privacy Trio Routes**: Every production web/mobile app must serve live `/privacy`, `/terms`, and `/delete-account` (`/data-deletion`) endpoints compliant with UU PDP No. 27/2022, GDPR Art. 17, and Apple/Google store mandates.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec compliance-gdpr-privacy-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Database & Retensi Data**: `database-orm-expert`, `double-entry-ledger-fintech-expert`, `saas-multi-tenant`, `saas-billing`
- **Identitas & Pencabutan Akses**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `fga-rebac-authorization-expert`, `zero-trust-secret-vault`
- **Logging & Redaksi Error**: `logging-error-tracking-expert`, `data-telemetry-expert`
- **Keamanan & Red Teaming**: `autonomous-red-teamer`, `prompt-injection-firewall`, `rate-limit-abuse-prevention`
- **Siklus Hidup & Tata Kelola**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa produksi untuk kepatuhan regulasi privasi data global dan nasional, termasuk **GDPR (Uni Eropa)**, **CCPA (California)**, dan **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP Indonesia)**. Mencakup perlindungan PII kriptografis (*crypto-shredding* & *blind indexing*), anonimisasi berjenjang (*Hak untuk Dilupakan*) tanpa merusak pembukuan pajak, pencatatan persetujuan (*consent*), serta redaksi log otomatis.

### Skema Database Persetujuan Pengguna (UU PDP Compliant)

```sql
CREATE TABLE IF NOT EXISTS user_privacy_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type VARCHAR(64) NOT NULL, -- 'MARKETING', 'ANALYTICS', 'TERMS_OF_SERVICE'
  is_granted BOOLEAN NOT NULL DEFAULT FALSE,
  policy_version VARCHAR(16) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_consents ON user_privacy_consents (user_id, consent_type);
```

### Checklist Verifikasi Produksi
- [ ] **Pemisahan Data Transaksi & Identitas**: Saat menjalankan *Right to be Forgotten*, hapus/anonimkan identitas PII dan kunci enkripsi subjek (*crypto-shredding*), namun pertahankan nominal jurnal buku besar keuangan untuk kepatuhan pajak.
- [ ] **Enkripsi & Blind Index**: Enkripsi kolom sensitif (NIK/KTP/No. HP) menggunakan AES-256-GCM dan gunakan *HMAC-SHA256 blind index* untuk pencarian cepat.
- [ ] **Opt-In Sebelum Pelacakan**: Blokir seluruh skrip pelacak analitik pihak ketiga sebelum pengguna memberikan persetujuan eksplisit.
- [ ] **Sensor Log Otomatis**: Aktifkan redaksi otomatis (`[REDACTED_PII]`) pada logger Pino/Winston.
- [ ] **Trio Hukum & Privasi Aktif**: Rute publik untuk Kebijakan Privasi (`/privacy`), Syarat & Ketentuan (`/terms`), dan Hapus Data (`/delete-account` atau `/data-deletion`) aktif dan terhubung ke backend.

### Mandat Wajib Trio Hukum & Privasi (Kebijakan Privasi, Syarat & Ketentuan, Hapus Data)
Setiap aplikasi baru WAJIB menyertakan implementasi tuntas dari:
1. **Kebijakan Privasi (`/privacy` atau `/privacy-policy`)**: Rincian pemrosesan data pribadi sesuai amanat UU No. 27 Tahun 2022 (UU PDP).
2. **Syarat & Ketentuan (`/terms`)**: Aturan main, hak kekayaan intelektual, dan batasan tanggung jawab hukum.
3. **Hapus Data Pengguna (`/delete-account` atau `/data-deletion`)**: URL publik & tombol aksi di profil pengguna untuk permohonan hapus data mandiri (kewajiban Apple HIG 5.1.1(v) & Google Play Data Safety) yang memicu alur *crypto-shredding* tanpa merusak integritas pembukuan pajak.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec compliance-gdpr-privacy-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
