---
name: zero-trust-secret-vault
description: "Expert guide for Zero-Trust Secret Management (Infisical, HashiCorp Vault, Doppler), automated API key rotation, and environment security / Panduan ahli manajemen rahasia Zero-Trust, rotasi kunci API, dan keamanan variabel lingkungan."
author: "Roedy Rustam"
version: "4.4.2"

---

# Zero-Trust Secret Vault & Credential Security Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Threat Defense & Red Teaming**: `autonomous-red-teamer`, `prompt-injection-firewall`, `post-quantum-crypto-migrator`
- **Identity & Access Management**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `fga-rebac-authorization-expert`, `rate-limit-abuse-prevention`, `compliance-gdpr-privacy-expert`
- **Cloud Infrastructure & CI/CD**: `ci-cd-devops-architect`, `github-actions-expert`, `sbom-supply-chain-security-expert`, `cloud-hosting-expert`, `docker-container-expert`
- **Database & FinTech Security**: `database-orm-expert`, `supabase-security-expert`, `doku-payment-gateway`, `saas-billing`
- **Lifecycle & Hardening**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production security engineering guide for **Zero-Trust Secret Management**, envelope encryption, and runtime environment validation across microservices, edge workers, and CI/CD pipelines. Eliminates plain-text `.env` files in git repositories and container images using **Infisical**, **HashiCorp Vault**, and **Doppler**. Covers strict startup schema validation (`Zod`), dual-key zero-downtime webhook secret rotation, envelope encryption (`AES-256-GCM` with KMS Data Encryption Keys), and Gitleaks pre-commit gates.

### Trigger Conditions
- Storing high-privilege credentials (database URLs, DOKU/Stripe signing keys, private JWT keys, LLM API keys).
- Validating environment variables at application boot time to fail fast on misconfiguration.
- Implementing zero-downtime secret rotation (dual active key verification window).
- Encrypting tenant-specific API keys or PII columns in PostgreSQL using Envelope Encryption.

---

### Secret Management Architecture Matrix

| Layer | Mechanism | Tool / Standard | Rotation Policy |
| :--- | :--- | :--- | :--- |
| **Build / CI Pipeline** | Federated OIDC Short-Lived Token | GitHub Actions OIDC $\rightarrow$ AWS/GCP/Vault | Per-job ephemeral (15 min TTL) |
| **Runtime Config Injection** | Machine Identity Universal Auth | Infisical SDK / Doppler / Vault Agent | Dynamic lease (1–24 hr TTL) |
| **Boot-Time Contract** | Strict Runtime Schema Validation | Zod + `@t3-oss/env-core` | Verified on process startup |
| **Tenant BYOK Secrets** | Envelope Encryption (KEK + DEK) | Node `crypto` `aes-256-gcm` + Cloud KMS | Annual KEK / Per-record DEK |

---

### Core Implementation Patterns

#### 1. Fail-Fast Boot-Time Environment Contract (TypeScript + Zod)
Never access raw `process.env.SOME_KEY` scattered across business files, and never leak server secrets into client bundles:

```typescript
// src/config/env.ts
import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().startsWith('postgres'),
  DOKU_CLIENT_ID: z.string().min(8),
  DOKU_SECRET_KEY_CURRENT: z.string().min(32),
  DOKU_SECRET_KEY_PREVIOUS: z.string().min(32).optional(),
  ENVELOPE_MASTER_KEY_HEX: z.string().regex(/^[0-9a-fA-F]{64}$/, 'Must be 32-byte hex key (64 chars)'),
  UPSTASH_REDIS_REST_URL: z.string().url(),
});

function validateServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('[Zero-Trust] Server environment module imported inside browser client bundle!');
  }
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`[Zero-Trust] Invalid or missing environment variables: ${missing}`);
  }
  return Object.freeze(parsed.data);
}

export const env = validateServerEnv();
```

---

#### 2. Envelope Encryption (`AES-256-GCM`) for Tenant API Keys in Database
When storing third-party API keys or OAuth tokens on behalf of tenants (BYOK), never store plain text or use unauthenticated `AES-CBC`. Generate a unique 12-byte IV and verify the 16-byte authentication tag:

```typescript
// src/lib/vault/envelope-crypto.ts
import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export interface EncryptedSecretRecord {
  ciphertextB64: string;
  ivB64: string;
  authTagB64: string;
  keyVersion: number;
}

export function encryptTenantSecret(
  plaintext: string,
  masterKeyHex: string,
  tenantId: string,
  keyVersion = 1
): EncryptedSecretRecord {
  const key = Buffer.from(masterKeyHex, 'hex');
  if (key.byteLength !== 32) {
    throw new Error('Master key must be exactly 32 bytes (256 bits)');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  // Bind ciphertext to tenantId via Additional Authenticated Data (AAD) to prevent cross-tenant replay
  cipher.setAAD(Buffer.from(tenantId, 'utf8'));

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertextB64: encrypted.toString('base64'),
    ivB64: iv.toString('base64'),
    authTagB64: authTag.toString('base64'),
    keyVersion,
  };
}

export function decryptTenantSecret(
  record: EncryptedSecretRecord,
  masterKeyHex: string,
  tenantId: string
): string {
  const key = Buffer.from(masterKeyHex, 'hex');
  const iv = Buffer.from(record.ivB64, 'base64');
  const authTag = Buffer.from(record.authTagB64, 'base64');
  const ciphertext = Buffer.from(record.ciphertextB64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAAD(Buffer.from(tenantId, 'utf8'));
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}
```

---

#### 3. Zero-Downtime Dual-Key Webhook Rotation Verifier
During secret rotation, accept signatures signed by either `CURRENT` or `PREVIOUS` secret key within the rotation grace window using constant-time comparison (`crypto.timingSafeEqual`):

```typescript
// src/lib/vault/dual-key-verifier.ts
import crypto from 'node:crypto';

export function verifyWebhookHmacDualKey(
  rawBody: string,
  providedSignatureHex: string,
  activeSecrets: readonly string[]
): { verified: boolean; matchedKeyIndex: number } {
  const providedBuf = Buffer.from(providedSignatureHex, 'hex');

  for (let i = 0; i < activeSecrets.length; i++) {
    const secret = activeSecrets[i];
    if (!secret) continue;

    const expectedHex = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
    const expectedBuf = Buffer.from(expectedHex, 'hex');

    if (
      providedBuf.byteLength === expectedBuf.byteLength &&
      crypto.timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return { verified: true, matchedKeyIndex: i };
    }
  }

  return { verified: false, matchedKeyIndex: -1 };
}
```

---

### Verification Checklist
- [ ] `.env*` files (except `.env.example`) are blocked in `.gitignore`, `.dockerignore`, and `.gitleaks.toml`.
- [ ] Application startup validates all required environment variables via a strict Zod schema and throws immediately if invalid.
- [ ] Tenant-stored credentials use `aes-256-gcm` with unique 12-byte IVs and tenant-bound AAD (`cipher.setAAD`).
- [ ] Webhook and API key rotations support a dual-key (`CURRENT` + `PREVIOUS`) verification grace window with `crypto.timingSafeEqual`.
- [ ] Structured loggers redact `authorization`, `cookie`, `secret`, `password`, and `apiKey` fields.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec zero-trust-secret-vault <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Pertahanan Ancaman & Red Teaming**: `autonomous-red-teamer`, `prompt-injection-firewall`, `post-quantum-crypto-migrator`
- **Manajemen Akses & Identitas**: `authentication-identity-expert`, `passkeys-webauthn-identity-expert`, `fga-rebac-authorization-expert`, `rate-limit-abuse-prevention`, `compliance-gdpr-privacy-expert`
- **Infrastruktur Cloud & CI/CD**: `ci-cd-devops-architect`, `github-actions-expert`, `sbom-supply-chain-security-expert`, `cloud-hosting-expert`, `docker-container-expert`
- **Keamanan Database & FinTech**: `database-orm-expert`, `supabase-security-expert`, `doku-payment-gateway`, `saas-billing`
- **Siklus Hidup & Pengerasan**: `production-ready-hardener`, `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan rekayasa keamanan produksi untuk **Manajemen Rahasia Zero-Trust**, enkripsi amplop (*Envelope Encryption* `AES-256-GCM`), rotasi kunci tanpa downtime (*Dual-Key Rotation*), dan validasi variabel lingkungan saat aplikasi menyala (*Fail-Fast Zod Validation*) menggunakan **Infisical**, **HashiCorp Vault**, dan **Doppler**.

### 4 Aturan Mutlak Zero-Trust
1. **Validasi Skema Saat Startup**: Validasi seluruh variabel `process.env` menggunakan skema Zod terpusat saat boot dan blokir akses dari bundle sisi klien (`typeof window !== 'undefined'`).
2. **Enkripsi Terikat Tenant (`AES-256-GCM` + AAD)**: Saat menyimpan API key milik tenant di database, gunakan `aes-256-gcm` dengan IV unik 12-byte dan ikat `tenantId` melalui `cipher.setAAD` agar ciphertext tidak dapat dipindah antar-tenant.
3. **Rotasi Kunci Ganda Tanpa Downtime**: Dukung verifikasi kunci `CURRENT` dan `PREVIOUS` secara bersamaan dengan `crypto.timingSafeEqual` selama masa transisi rotasi kunci.
4. **Dilarang Komit File `.env` & Sensor Log**: Wajib pasang aturan Gitleaks pada pre-commit dan pastikan logger menyensor field sensitif.

### Daftar Periksa Verifikasi (Checklist)
- [ ] File `.env*` diblokir di `.gitignore`, `.dockerignore`, dan dipindai oleh Gitleaks.
- [ ] Seluruh variabel lingkungan divalidasi dengan skema Zod saat proses startup.
- [ ] Penyimpanan rahasia di database menggunakan `aes-256-gcm` dengan AAD terikat `tenantId`.
- [ ] Verifikasi signature menggunakan `crypto.timingSafeEqual` dengan dukungan rotasi kunci ganda.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec zero-trust-secret-vault <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
