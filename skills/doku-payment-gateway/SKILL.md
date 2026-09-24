---
name: doku-payment-gateway
description: "Expert guide for integrating DOKU Payment Gateway (SNAP BI Standard). Covers B2B Access Token, HMAC-SHA512 signature calculation, SNAP API integrations (VA, QRIS, E-Wallet, Credit Card), webhook notification verification, and sandbox/production setup / Panduan ahli integrasi DOKU Payment Gateway (Standar SNAP BI)."
author: "Roedy Rustam"
version: "4.0.0"
---

# DOKU Payment Gateway Integration / Integrasi Payment Gateway DOKU

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `session-memory-manager` to ensure cohesive execution.

### Description
Expert guide for implementing DOKU Payment Gateway integrations based on official [DOKU Developers Documentation](https://developers.doku.com/). As of the mandate, all integrations MUST use the SNAP API v1.0 standard (Standard Nasional Open API Pembayaran) instead of the legacy Jokul API v2.
Covers B2B Access Token generation, SHA-256 Body hashing, HMAC-SHA512 request signature construction, Webhook notification verification, Payment implementations (Virtual Account, QRIS, E-Wallet, Credit Card), error handling, and sandbox/production deployment.

### Trigger Conditions
Activate this skill when the user is:
- Building or refactoring DOKU Payment Gateway integration in Node.js, TypeScript, Python, Go, PHP, or Java.
- Implementing SNAP BI B2B Access Token and HMAC-SHA512 signature calculations (`X-SIGNATURE`).
- Setting up DOKU SNAP APIs for Virtual Account, QRIS, E-Wallet, or Credit Card.
- Debugging DOKU API authorization errors (e.g., `Unauthorized`, invalid signature, incorrect timestamp format).

---

### Core Architecture & Credentials

#### Environment Gateways
| Environment | Base URL | Dashboard Portal | Simulator |
|---|---|---|---|
| **Sandbox** | `https://api-sandbox.doku.com` | `https://sandbox.doku.com` | `https://sandbox.doku.com/gtw-config-v2/simulator` |
| **Production** | `https://api.doku.com` | `https://dashboard.doku.com` | N/A |

#### Mandatory Headers (SNAP BI Standard)
For B2B Access Token Generation (`/api/v1.0/access-token/b2b`):
- `X-CLIENT-KEY`: Merchant Client ID from DOKU Back Office.
- `X-TIMESTAMP`: ISO8601 timestamp string (e.g., `2026-08-07T13:00:00+07:00`).
- `X-SIGNATURE`: RSA-SHA256 signature (Base64) - *Note: The token generation uses Asymmetric RSA, but subsequent transactional APIs use Symmetric HMAC-SHA512.*

For Transactional Endpoints (e.g., `/bi-snap-va/v1/transfer-va/create-va`):
- `Authorization`: Format `Bearer <B2B_ACCESS_TOKEN>`.
- `X-TIMESTAMP`: ISO8601 timestamp string (e.g., `2026-08-07T13:00:00+07:00`).
- `X-SIGNATURE`: HMAC-SHA512 signature (Base64 encoded string).
- `X-PARTNER-ID`: Client ID.
- `X-EXTERNAL-ID`: Unique string (e.g. UUID) for the request.

---

### Signature Calculation Formula (SNAP Transactional API)

#### 1. Body Hash (POST / PUT / PATCH)
```text
Minified JSON Body -> SHA-256 Hash -> Hex Encode -> Lowercase
```

#### 2. String to Sign Component
The components MUST be concatenated with `:` without extra whitespace:
```text
HTTPMethod:EndpointURL:AccessToken:LowercaseHexBodyHash:Timestamp
```
*Example:* `POST:/bi-snap-va/v1/transfer-va/create-va:eyJhb...:a1b2c3d4...:2026-08-07T13:00:00+07:00`

#### 3. HMAC-SHA512 Signing
```text
String to Sign + Client Secret -> HMAC-SHA512 Hash -> Base64 Encode -> X-SIGNATURE
```

---

### TypeScript / Node.js Implementation Example

```typescript
import crypto from 'crypto';

interface DokuSnapConfig {
  clientId: string;
  clientSecret: string;
  isProduction: boolean;
}

export class DokuSnapService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor(config: DokuSnapConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = config.isProduction
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com';
  }

  private generateBodyHash(body: object): string {
    const minifiedBody = JSON.stringify(body);
    return crypto.createHash('sha256').update(minifiedBody, 'utf8').digest('hex').toLowerCase();
  }

  public generateSignature(
    method: string,
    targetPath: string,
    accessToken: string,
    timestamp: string,
    body?: object
  ): string {
    let bodyHash = '';
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      bodyHash = this.generateBodyHash(body);
    }

    const stringToSign = `${method.toUpperCase()}:${targetPath}:${accessToken}:${bodyHash}:${timestamp}`;
    
    return crypto
      .createHmac('sha512', this.clientSecret)
      .update(stringToSign, 'utf8')
      .digest('base64');
  }

  public async createVirtualAccount(accessToken: string, payload: any) {
    const targetPath = '/bi-snap-va/v1/transfer-va/create-va';
    const externalId = crypto.randomUUID();
    // Example format: 2026-09-24T19:30:00+07:00
    const timestamp = new Date().toISOString(); 
    
    const signature = this.generateSignature('POST', targetPath, accessToken, timestamp, payload);

    const response = await fetch(`${this.baseUrl}${targetPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'X-PARTNER-ID': this.clientId,
        'X-EXTERNAL-ID': externalId,
        'CHANNEL-ID': 'SDK'
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  }
}
```

---

### Webhook / Notification Signature Verification

When DOKU sends a webhook/notification in SNAP format, you MUST verify its signature.
The process is identical to generating the signature: recreate the `stringToSign` using the incoming headers, the minified raw body, and your `Client Secret`, then compare the resulting HMAC-SHA512 Base64 string with the `X-SIGNATURE` header.

```typescript
import crypto from 'crypto';
import { Request, Response } from 'express';

export function verifyDokuSnapWebhook(req: Request, clientSecret: string): boolean {
  const method = req.method.toUpperCase();
  const targetPath = req.originalUrl || req.url; // e.g., /api/webhook
  const timestamp = req.headers['x-timestamp'] as string;
  const receivedSignature = req.headers['x-signature'] as string;
  // B2B token in Authorization header, remove 'Bearer '
  const authHeader = req.headers['authorization'] as string;
  const accessToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : '';

  // Use raw body for exact minification match
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const bodyHash = crypto.createHash('sha256').update(rawBody, 'utf8').digest('hex').toLowerCase();

  const stringToSign = `${method}:${targetPath}:${accessToken}:${bodyHash}:${timestamp}`;
  
  const expectedSignature = crypto
    .createHmac('sha512', clientSecret)
    .update(stringToSign, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );
}
```

---

### Webhook Idempotency & Race Condition Prevention

When processing DOKU webhooks, you MUST implement Idempotency and prevent Race Conditions. DOKU may retry sending the same webhook if your server takes too long to respond.

**Best Practices:**
1. **Raw Body Parser**: Always use a raw body parser (e.g., `express.raw({ type: 'application/json' })`) for the webhook route. `JSON.stringify(req.body)` can alter spacing/key order, causing signature validation to fail.
2. **Atomic Updates**: Use database-level locks or atomic updates to ensure a transaction is only processed once. Update the database record `WHERE invoice_number = 'X' AND status = 'PENDING'`. If the update affects 0 rows, the webhook was already processed.
3. **Return 200 OK Early**: If the signature is valid but the transaction is already processed (duplicate), immediately return `200 OK` to DOKU so they stop retrying.
4. **B2B Token Caching**: Generating the B2B Access Token requires an RSA signature and network request. Cache this token (e.g., in Redis or Memory) until its expiry to reduce latency on transactional endpoints.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Issue | Solution |
|---|---|---|
| Non-minified JSON body | Signature validation fails (`Invalid Signature`) | Always stringify JSON without extra spaces before hashing. For webhooks, use the raw unparsed request body. |
| Using HMAC-SHA256 | Signature validation fails | SNAP BI transactional signature uses **HMAC-SHA512** (Note: B2B Access Token uses RSA-SHA256). |
| Capitalized Hex Hash | Signature mismatch | Ensure the SHA-256 body hash hex string is converted to lowercase before appending to `stringToSign`. |
| Missing `Bearer` in Authorization | Unauthorized error | The `Authorization` header must include `Bearer <Token>`, but the `stringToSign` component must **only** be the token. |
| Processing webhook twice | Double balance top-up (Race Condition) | Use Atomic Updates (`UPDATE ... WHERE status = 'PENDING'`) and return 200 OK for duplicates. |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `session-memory-manager` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan ahli untuk mengintegrasikan DOKU Payment Gateway dengan standar dokumentasi resmi [DOKU Developers Portal](https://developers.doku.com/). Berdasarkan mandat, seluruh integrasi WAJIB menggunakan standar SNAP API v1.0 (Standard Nasional Open API Pembayaran) sebagai pengganti Jokul API v2.
Mencakup pembuatan B2B Access Token, Hash Body SHA-256, pembuatan Signature HMAC-SHA512, verifikasi Webhook/Notifikasi, dan implementasi API (Virtual Account, QRIS, E-Wallet, Kartu Kredit).

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Membangun atau merefaktor integrasi DOKU Payment Gateway di Node.js, TypeScript, Python, Go, PHP, atau Java.
- Mengimplementasikan kalkulasi signature HMAC-SHA512 (`X-SIGNATURE`) standar SNAP BI.
- Mengatur API SNAP untuk Virtual Account, QRIS, E-Wallet, atau Kartu Kredit.
- Melakukan debugging error otorisasi DOKU API (`Invalid Signature`, token kedaluwarsa).

### Ringkasan Langkah Integrasi (SNAP BI)
1. **Dapatkan Kredensial**: Ambil `Client-Id` dan `Secret-Key` dari DOKU Sandbox.
2. **Generate B2B Access Token**: Hitung signature Asimetrik RSA-SHA256 dan panggil `/api/v1.0/access-token/b2b`.
3. **Hitung Body Hash**: Untuk request transaksional `POST`, minify body JSON lalu hash menggunakan SHA-256, ubah ke Hex, dan format ke huruf kecil (lowercase).
4. **Format String to Sign**: Gabungkan `HTTPMethod`, `EndpointURL`, `AccessToken`, `BodyHash`, dan `Timestamp` dipisahkan dengan titik dua `:`.
5. **Sign HMAC-SHA512**: Hash string komponen menggunakan `Secret-Key` dengan algoritma HMAC-SHA512, ubah ke Base64, jadikan header `X-SIGNATURE`.

### Integrasi dengan Skill Lain
- `payment-gateway-expert` — Untuk arsitektur billing SaaS umum dan state machine langganan.
- `doku-mcp-server` — Untuk mengintegrasikan API DOKU ke Model Context Protocol AI Agent.
- `database-orm-expert` — Untuk menyimpan transaksi pembayaran dan log webhook secara type-safe.

---
### 🚨 SNAP Integration Mandate (CRITICAL)
**MANDATORY**: The AI Agent MUST automatically apply the SNAP API v1.0 standard (Standard Nasional Open API Pembayaran) for all DOKU integrations, instead of the legacy Jokul API v2, unless the user explicitly requests otherwise. All generated signatures, headers, and endpoints MUST follow the SNAP BI standard.

### 🧪 DOKU Sandbox Simulator
**MANDATORY**: When testing in Sandbox mode and needing to access the Payment Simulator, the AI Agent MUST use this exact URL: `https://sandbox.doku.com/gtw-config-v2/simulator`.