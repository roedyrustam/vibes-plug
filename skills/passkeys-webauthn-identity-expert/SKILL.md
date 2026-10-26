---
name: passkeys-webauthn-identity-expert
description: "FIDO2 / WebAuthn Passkeys, SimpleWebAuthn, and passwordless auth / Autentikasi tanpa kata sandi Passkeys FIDO2 dan SimpleWebAuthn."
author: "Roedy Rustam"
version: "4.4.4"

---

# Passkeys, WebAuthn Level 3 & Cryptographic Identity Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Identity & Access Control**: `authentication-identity-expert`, `fga-rebac-authorization-expert`, `zero-trust-secret-vault`
- **FinTech & High-Value Step-Up Auth**: `doku-payment-gateway`, `saas-billing`, `double-entry-ledger-fintech-expert`
- **Frontend & Apple/Mobile Ecosystems**: `senior-frontend`, `apple-ecosystem-expert`, `mobile-expo-expert`, `anti-slop`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Production security guide for phishing-resistant **FIDO2 / WebAuthn Level 3 Passkeys** (`@simplewebauthn/server` & `@simplewebauthn/browser`), **Conditional UI** browser autofill (`autocomplete="username webauthn"`), **Related Origin Requests (ROR)** for multi-domain SaaS apps, cryptographic **Step-Up Authentication** for high-value financial payouts, and **RFC 9449 DPoP (Demonstrating Proof-of-Possession)** sender-constrained tokens.

### Trigger Conditions
- Implementing passwordless sign-up/sign-in with FaceID, TouchID, Windows Hello, or hardware YubiKeys.
- Requiring biometric cryptographic confirmation before executing high-risk actions (API key reveal, wire transfer, role elevation).
- Sharing Passkeys across web (`app.example.com`), regional domains, and native iOS (`apple-app-site-association`) / Android (`assetlinks.json`) apps.
- Preventing replay attacks on stolen OAuth/session tokens using DPoP.

---

### Core Security Invariants

| Invariant | Vulnerability Prevented | Implementation Requirement |
| :--- | :--- | :--- |
| **Single-Use Challenge** | Replay Attacks | Generate 32-byte CSPRNG challenge, store in Redis with 5-minute TTL, and delete atomically on verification. |
| **Strict RP ID & Origin Verification** | Phishing / MITM | Verify `expectedOrigin` and `expectedRPID` strictly against allowlisted production origins. |
| **User Verification (`uv`)** | Unattended Device Abuse | Enforce `userVerification: 'required'` for financial step-up and admin authentication. |
| **Sign Count Anomaly Detection** | Cloned Hardware Authenticators | Compare `authenticationInfo.newCounter` when `> 0` against stored `counter` to detect cloned keys. |

---

### Core Implementation Patterns

#### 1. Passkey Registration & Verification Server (`@simplewebauthn/server`)
```typescript
// src/auth/passkey-service.ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RP_NAME = 'Vibes Sovereign Platform';
const RP_ID = process.env.WEBAUTHN_RP_ID ?? 'localhost';
const EXPECTED_ORIGIN = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:3000';

export async function beginPasskeyRegistration(user: {
  id: string;
  email: string;
  existingCredentialIdsB64Url: string[];
}) {
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: user.email,
    userID: new TextEncoder().encode(user.id),
    attestationType: 'none',
    excludeCredentials: user.existingCredentialIdsB64Url.map((id) => ({ id })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'required',
    },
  });

  // Persist challenge with strict 300-second expiration
  await redis.set(`webauthn:reg:${user.id}`, options.challenge, { ex: 300 });
  return options;
}

export async function completePasskeyRegistration(
  userId: string,
  responseBody: unknown
): Promise<VerifiedRegistrationResponse> {
  const challengeKey = `webauthn:reg:${userId}`;
  const expectedChallenge = await redis.get<string>(challengeKey);
  if (!expectedChallenge) {
    throw new Error('Passkey registration challenge expired or already consumed');
  }
  // Delete challenge immediately (single-use invariant)
  await redis.del(challengeKey);

  const verification = await verifyRegistrationResponse({
    response: responseBody as Parameters<typeof verifyRegistrationResponse>[0]['response'],
    expectedChallenge,
    expectedOrigin: EXPECTED_ORIGIN,
    expectedRPID: RP_ID,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Passkey cryptographic verification failed');
  }

  return verification;
}
```

---

#### 2. WebAuthn Level 3 Client Capability Detection & Conditional UI
```typescript
// src/client/passkey-capabilities.ts
export interface ClientPasskeySupport {
  conditionalMediation: boolean;
  platformAuthenticator: boolean;
}

export async function detectPasskeyCapabilities(): Promise<ClientPasskeySupport> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return { conditionalMediation: false, platformAuthenticator: false };
  }

  const [conditionalMediation, platformAuthenticator] = await Promise.all([
    PublicKeyCredential.isConditionalMediationAvailable?.() ?? Promise.resolve(false),
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.() ?? Promise.resolve(false),
  ]);

  return { conditionalMediation, platformAuthenticator };
}
```

---

#### 3. Cryptographic Step-Up Authentication & RFC 9449 DPoP Proof Validator (TypeScript)
Protect financial transfers and admin actions with biometric step-up and sender-constrained DPoP proofs:

```typescript
// src/auth/dpop-validator.ts
import { createHash } from 'node:crypto';

export interface DPoPProofHeader {
  typ: 'dpop+jwt';
  alg: 'ES256' | 'RS256';
  jwk: { kty: string; crv?: string; x?: string; y?: string; n?: string; e?: string };
}

export interface DPoPClaims {
  jti: string;
  htm: string;
  htu: string;
  iat: number;
  ath?: string;
}

export function computeAccessTokenHash(accessToken: string): string {
  return createHash('sha256').update(accessToken, 'ascii').digest('base64url');
}

export function validateDPoPProof(
  proofJwt: string,
  expectedMethod: string,
  expectedUri: string,
  accessToken?: string
): { valid: boolean; jti: string; clientPublicKeyJwk: unknown } {
  const parts = proofJwt.split('.');
  if (parts.length !== 3) {
    throw new Error('[DPoP] Invalid JWT format');
  }

  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as DPoPProofHeader;
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as DPoPClaims;

  if (header.typ !== 'dpop+jwt') {
    throw new Error(`[DPoP] Header typ must be "dpop+jwt", got: ${header.typ}`);
  }

  // Validate HTTP method and URL parity
  if (claims.htm.toUpperCase() !== expectedMethod.toUpperCase()) {
    throw new Error(`[DPoP] Method mismatch: expected ${expectedMethod}, got ${claims.htm}`);
  }

  const cleanExpectedUri = expectedUri.split('?')[0];
  const cleanProofUri = claims.htu.split('?')[0];
  if (cleanExpectedUri !== cleanProofUri) {
    throw new Error(`[DPoP] URI mismatch: expected ${cleanExpectedUri}, got ${cleanProofUri}`);
  }

  // Clock skew: proof must be within +/- 60 seconds
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - claims.iat) > 60) {
    throw new Error('[DPoP] Proof timestamp expired or out of allowed window');
  }

  // Access token binding check
  if (accessToken) {
    const expectedAth = computeAccessTokenHash(accessToken);
    if (claims.ath !== expectedAth) {
      throw new Error('[DPoP] Access token hash mismatch');
    }
  }

  return {
    valid: true,
    jti: claims.jti,
    clientPublicKeyJwk: header.jwk,
  };
}
```

---

### Verification Checklist
- [ ] WebAuthn challenges are ≥32 random bytes, bound to the user/session in Redis with a ≤300s TTL, and deleted immediately upon first verification attempt.
- [ ] Login input fields include `autoComplete="username webauthn"` to enable seamless Conditional UI Passkey autofill.
- [ ] Multi-domain deployments publish `/.well-known/webauthn` (Related Origin Requests) and mobile `apple-app-site-association` / `assetlinks.json`.
- [ ] Users can register multiple passkeys and have a verified account recovery flow.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec passkeys-webauthn-identity-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Identitas & Kontrol Akses**: `authentication-identity-expert`, `fga-rebac-authorization-expert`, `zero-trust-secret-vault`
- **FinTech & Step-Up Auth**: `doku-payment-gateway`, `saas-billing`, `double-entry-ledger-fintech-expert`
- **Ekosistem Frontend & Mobile**: `senior-frontend`, `apple-ecosystem-expert`, `mobile-expo-expert`, `anti-slop`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan keamanan produksi untuk autentikasi tanpa kata sandi tahan-phishing menggunakan **FIDO2 / WebAuthn Level 3 Passkeys** (`@simplewebauthn/server`), **Conditional UI autofill**, **Step-Up Authentication** biometrik untuk transaksi bernilai tinggi, dan pengikatan token **DPoP (RFC 9449)**.

### Panduan Arsitektur Inti
1. **Challenge Sekali Pakai**: Simpan `challenge` di Redis dengan TTL maksimal 5 menit dan segera hapus (`DEL`) saat permintaan verifikasi diterima untuk mencegah *replay attack*.
2. **Verifikasi Origin & RP ID Ketat**: Selalu validasi `expectedOrigin` dan `expectedRPID` di sisi server.
3. **Step-Up Biometrik**: Wajibkan `userVerification: 'required'` sebelum mengeksekusi penarikan dana atau perubahan hak akses admin.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Challenge disimpan di Redis dengan TTL $\le 300$ detik dan dihapus pada percobaan verifikasi pertama.
- [ ] Input login menyertakan atribut `autoComplete="username webauthn"`.
- [ ] File `/.well-known/webauthn` dan `apple-app-site-association` dikonfigurasi untuk dukungan lintas domain/aplikasi.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec passkeys-webauthn-identity-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
