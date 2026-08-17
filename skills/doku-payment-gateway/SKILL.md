---
name: doku-payment-gateway
description: "Expert guide for integrating DOKU Payment Gateway (Jokul API v2). Covers HMAC-SHA256 header signature calculation, Checkout & Direct APIs (VA, QRIS, E-Wallet, Credit Card), webhook notification verification, and sandbox/production setup / Panduan ahli integrasi DOKU Payment Gateway."
author: "vibes-plug-swarm"
---

# DOKU Payment Gateway Integration / Integrasi Payment Gateway DOKU

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Expert guide for implementing DOKU Payment Gateway (Jokul API v2) integrations based on official [DOKU Developers Documentation](https://developers.doku.com/). Covers authentication headers, SHA-256 Digest generation, HMAC-SHA256 request signature construction, Webhook notification verification, Checkout Payment Links, Direct Payments (Virtual Account, QRIS, E-Wallet, Credit Card), error handling, and sandbox/production deployment.

### Trigger Conditions
Activate this skill when the user is:
- Building or refactoring DOKU Payment Gateway integration in Node.js, TypeScript, Python, Go, PHP, or Java.
- Implementing HMAC-SHA256 signature calculations or notification signature verification for DOKU API.
- Setting up DOKU Virtual Account (BCA, Mandiri, BRI, BNI, Permata, DOKU VA), QRIS, E-Wallet (OVO, ShopeePay, DANA, LinkAja), or Credit Card APIs.
- Debugging DOKU API authorization errors (e.g., `Authorization Failed`, invalid signature, incorrect timestamp format).

---

### Core Architecture & Credentials

#### Environment Gateways
| Environment | Base URL | Dashboard Portal |
|---|---|---|
| **Sandbox** | `https://api-sandbox.doku.com` | `https://sandbox.doku.com` |
| **Production** | `https://api.doku.com` | `https://dashboard.doku.com` |

#### Mandatory Headers
Every request sent to DOKU API requires the following headers:
- `Client-Id`: Merchant Client ID from DOKU Back Office.
- `Request-Id`: Unique random string generated for each request (e.g., UUID v4).
- `Request-Timestamp`: UTC ISO8601 timestamp string (e.g., `2026-08-07T13:00:00Z`).
- `Request-Target`: Target API endpoint path (e.g., `/checkout/v1/payment` or `/doku-virtual-account/v2/payment-code`).
- `Digest`: Base64 encoded SHA-256 hash of the JSON payload string (Omitted for `GET` requests).
- `Signature`: Format `HMACSHA256=<base64-signature>`.

---

### Signature Calculation Formula

#### 1. Digest Calculation (POST / PUT / PATCH)
```text
Raw Body -> SHA-256 Hash -> Base64 Encode -> Digest String
```

#### 2. Signature Component String
The components MUST be concatenated with newline `\n` without extra whitespace:
```text
Client-Id:<CLIENT_ID>\nRequest-Id:<REQUEST_ID>\nRequest-Timestamp:<TIMESTAMP>\nRequest-Target:<TARGET_PATH>\nDigest:<DIGEST_STRING>
```
*Note: For GET requests, omit `\nDigest:<DIGEST_STRING>`.*

#### 3. HMAC-SHA256 Signing
```text
Raw String + Secret Key -> HMAC-SHA256 Hash -> Base64 Encode -> Prepend "HMACSHA256="
```

---

### TypeScript / Node.js Implementation Example

```typescript
import crypto from 'crypto';

interface DokuConfig {
  clientId: string;
  secretKey: string;
  isProduction: boolean;
}

export class DokuService {
  private clientId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(config: DokuConfig) {
    this.clientId = config.clientId;
    this.secretKey = config.secretKey;
    this.baseUrl = config.isProduction
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com';
  }

  private generateDigest(body: object): string {
    const jsonBody = JSON.stringify(body);
    return crypto.createHash('sha256').update(jsonBody, 'utf8').digest('base64');
  }

  private generateSignature(
    requestId: string,
    timestamp: string,
    targetPath: string,
    digest?: string
  ): string {
    let rawComponent = `Client-Id:${this.clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}`;
    
    if (digest) {
      rawComponent += `\nDigest:${digest}`;
    }

    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(rawComponent);
    const base64Hmac = hmac.digest('base64');

    return `HMACSHA256=${base64Hmac}`;
  }

  public async createCheckoutPayment(payload: {
    order: { amount: number; invoice_number: string };
    payment: { payment_due_date?: number };
    customer: { name: string; email: string };
  }) {
    const targetPath = '/checkout/v1/payment';
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const digest = this.generateDigest(payload);
    const signature = this.generateSignature(requestId, timestamp, targetPath, digest);

    const response = await fetch(`${this.baseUrl}${targetPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': this.clientId,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        'Request-Target': targetPath,
        'Digest': digest,
        'Signature': signature,
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  }
}
```

---

### Webhook / Notification Signature Verification

When DOKU sends a payment status notification to your webhook URL, you MUST verify its signature before processing.

```typescript
import crypto from 'crypto';
import { Request, Response } from 'express';

export function verifyDokuWebhook(req: Request, secretKey: string): boolean {
  const clientId = req.headers['client-id'] as string;
  const requestId = req.headers['request-id'] as string;
  const timestamp = req.headers['request-timestamp'] as string;
  const targetPath = req.originalUrl || req.url;
  const receivedSignature = req.headers['signature'] as string;

  const rawBody = JSON.stringify(req.body);
  const digest = crypto.createHash('sha256').update(rawBody, 'utf8').digest('base64');

  const component = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
  
  const calculatedHmac = crypto
    .createHmac('sha256', secretKey)
    .update(component)
    .digest('base64');
  
  const expectedSignature = `HMACSHA256=${calculatedHmac}`;

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );
}
```


---

### Common Pitfalls to Avoid

| Anti-Pattern | Issue | Solution |
|---|---|---|
| Extra trailing newline in component string | Signature validation fails (`Authorization Failed`) | Do not add `\n` at the end of the raw component string. |
| Non-UTC ISO8601 timestamp | Timestamp mismatch error | Always format timestamp with UTC Z timezone (e.g. `2026-08-07T13:00:00Z`). |
| Including Digest on `GET` requests | Signature mismatch | Omit `Digest` line completely when calculating signature for `GET` endpoints. |
| Unsorted JSON body in digest calculation | Body hash mismatch | Pass exact raw stringified JSON body used in HTTP POST. |
| Missing Idempotency Check | Duplicate processing on webhooks | Save `invoice_number` / `transaction_id` status in DB before executing state changes. |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan ahli untuk mengintegrasikan DOKU Payment Gateway (Jokul API v2) sesuai standar dokumentasi resmi [DOKU Developers Portal](https://developers.doku.com/). Mencakup header autentikasi, pembuatan Digest SHA-256, pembuatan Signature HMAC-SHA256, verifikasi Webhook/Notifikasi, Checkout Payment Link, Direct Payment (Virtual Account, QRIS, E-Wallet, Kartu Kredit), penanganan error, dan migrasi Sandbox ke Production.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Membangun atau merefaktor integrasi DOKU Payment Gateway di Node.js, TypeScript, Python, Go, PHP, atau Java.
- Mengimplementasikan kalkulasi signature HMAC-SHA256 atau verifikasi signature notifikasi webhook DOKU.
- Mengatur API Virtual Account (BCA, Mandiri, BRI, BNI, Permata, DOKU VA), QRIS, E-Wallet (OVO, ShopeePay, DANA, LinkAja), atau Kartu Kredit.
- Melakukan debugging error otorisasi DOKU API (`Authorization Failed`, signature tidak valid, timestamp tidak sesuai format).

### Ringkasan Langkah Integrasi
1. **Dapatkan Kredensial**: Buat akun di DOKU Sandbox untuk mendapatkan `Client-Id` dan `Secret-Key`.
2. **Hitung Digest**: Untuk request `POST`, hash body JSON dengan SHA-256 lalu Base64.
3. **Format Signature String**: Gabungkan `Client-Id`, `Request-Id`, `Request-Timestamp`, `Request-Target`, dan `Digest` dipisahkan dengan `\n`.
4. **Sign HMAC-SHA256**: Hash string komponen menggunakan `Secret-Key` dengan algoritma HMAC-SHA256, ubah ke Base64, tambahkan awalan `HMACSHA256=`.
5. **Verifikasi Webhook**: Gunakan formula yang sama pada header notifikasi masuk untuk memastikan pesan valid berasal dari DOKU.

### Integrasi dengan Skill Lain
- `payment-gateway-expert` — Untuk arsitektur billing SaaS umum dan state machine langganan.
- `doku-mcp-server` — Untuk mengintegrasikan API DOKU ke Model Context Protocol AI Agent.
- `database-orm-expert` — Untuk menyimpan transaksi pembayaran dan log webhook secara type-safe.

---
### 🚨 SNAP Integration Mandate (CRITICAL)
**MANDATORY**: The AI Agent MUST automatically apply the SNAP API v1.0 standard (Standard Nasional Open API Pembayaran) for all DOKU integrations, instead of the legacy Jokul API v2, unless the user explicitly requests otherwise. All generated signatures, headers, and endpoints MUST follow the SNAP BI standard.

### 🧪 DOKU Sandbox Simulator
**MANDATORY**: When testing in Sandbox mode and needing to access the Payment Simulator, the AI Agent MUST use this exact URL: `https://sandbox.doku.com/gtw-config-v2/simulator`.
