---
name: payment-gateway-expert
description: "Expert guide for integrating payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) and secure webhooks into SaaS platforms / Panduan ahli integrasi payment gateway dan webhook aman."
author: "Roedy Rustam"
version: "4.4.2"

---

# Payment Gateway Expert / Ahli Payment Gateway

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Gateways & Payment Integrations**: `doku-payment-gateway`, `saas-billing`, `agentic-m2m-settlement`, `agentic-micro-economy-architect`
- **AI Agentic Commerce & MCP**: `doku-mcp-server`, `mcp-server-architect`, `ai-llm-integration-expert`
- **Database & Atomic Idempotency**: `database-orm-expert`, `saas-multi-tenant`
- **Security & Post-Quantum Crypto**: `post-quantum-crypto-migrator`, `zero-trust-secret-vault`, `autonomous-red-teamer`
- **Background Jobs & Observability**: `async-queue-temporal-expert`, `data-telemetry-expert`
- **Lifecycle & Governance**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Description
Expert guide for integrating major payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) into modern SaaS platforms. Covers checkout flows, secure raw-body webhook handling, atomic idempotency to prevent race conditions, subscription state machines, and local database synchronization.

### Core Principles
- **Security First**: Always validate webhook signatures using the raw, unparsed request body before processing any payment event. Never trust client-side data for prices or payment status. For Indonesian gateways (DOKU, Midtrans, Xendit), accurately apply the required signature protocol: **DOKU Checkout** uses **HMAC-SHA256 with body Digest**, while **SNAP BI Direct APIs** enforce **HMAC-SHA512** with ISO8601 timestamps.
- **Idempotency & Race Condition Prevention**: Implement idempotency keys for all payment creation requests. For webhook ingestion, **DO NOT rely solely on `findUnique` checks**, as concurrent webhook retries cause race conditions. Always use **Atomic Updates** (`UPDATE ... WHERE status = 'PENDING'`) or database pessimistic locks (`SELECT ... FOR UPDATE`).
- **Raw Body Ingestion**: Webhook signature verification fails if JSON is parsed or re-serialized with modified key ordering. Extract the exact raw string buffer (`req.text()` in Fetch API or `express.raw({ type: 'application/json' })` in Express).
- **Early 200 OK Acknowledgment**: If a webhook event is verified but already processed, immediately return `200 OK` so the payment gateway halts retries.
- **State Synchronization**: Ensure the local database (e.g., PostgreSQL, Supabase via Drizzle/Prisma) is updated transactionally upon receiving successful webhook events.
- **Subscription Management**: Map provider subscription statuses (`trialing`, `active`, `past_due`, `canceled`) accurately to internal SaaS state machines.

### Implementation Checklist
- [ ] Create dedicated raw Webhook endpoint (e.g., `/api/webhooks/stripe`, `/api/webhooks/doku/checkout`).
- [ ] Use raw request body string for signature verification (never parsed JSON).
- [ ] Verify signature using proper algorithm (HMAC-SHA256 + Digest for DOKU Checkout, Stripe, PayPal; HMAC-SHA512 for SNAP BI Direct API).
- [ ] Implement Atomic Update idempotency (`WHERE status = 'PENDING'`) to eliminate race conditions.
- [ ] Acknowledge duplicate webhooks immediately with HTTP `200 OK`.
- [ ] Offload heavy post-payment operations (invoicing, emails, webhooks) to background job queues (BullMQ/Temporal).

### Example: SNAP BI Webhook & Atomic Idempotency (Next.js App Router)
```typescript
import { headers } from 'next/headers';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const rawBody = await req.text(); // Raw body is mandatory
  const headerList = await headers();
  
  const timestamp = headerList.get('x-timestamp') || '';
  const receivedSig = headerList.get('x-signature') || '';
  const authHeader = headerList.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const path = new URL(req.url).pathname;

  // 1. SNAP BI Body Hash & Signature Verification (HMAC-SHA512)
  const bodyHash = crypto.createHash('sha256').update(rawBody, 'utf8').digest('hex').toLowerCase();
  const stringToSign = `POST:${path}:${token}:${bodyHash}:${timestamp}`;
  const calculatedSig = crypto
    .createHmac('sha512', process.env.DOKU_SECRET_KEY!)
    .update(stringToSign, 'utf8')
    .digest('base64');

  const isValid = crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(calculatedSig));
  if (!isValid) {
    return new Response('Invalid Signature', { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const invoiceNumber = payload.order?.invoice_number;

  // 2. Atomic Update: Eliminates Race Conditions by locking on 'PENDING' status
  const updated = await db.transaction.updateMany({
    where: {
      invoiceNumber: invoiceNumber,
      status: 'PENDING', // Key race condition prevention gate
    },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      externalReference: payload.transaction?.original_reference_no,
    },
  });

  // 3. Duplicate Webhook Handling (Idempotency)
  if (updated.count === 0) {
    // Already processed or invalid invoice — return 200 to halt gateway retry spam
    return new Response(JSON.stringify({ status: 'ALREADY_PROCESSED' }), { status: 200 });
  }

  // 4. Fulfillment (Execute only once)
  await grantUserSubscription(invoiceNumber);

  return new Response(JSON.stringify({ status: 'SUCCESS' }), { status: 200 });
}

async function grantUserSubscription(invoiceNumber: string) {
  // Safe business logic execution
}
```

### Example 2: Multi-Provider Timing-Safe Webhook Signature Verifier (Stripe + DOKU Checkout + Midtrans)
```typescript
import crypto from 'node:crypto';

export type PaymentProvider = 'stripe' | 'doku-checkout' | 'midtrans';

export function verifyGatewayWebhookSignature(params: {
  readonly provider: PaymentProvider;
  readonly rawBody: string;
  readonly signatureHeader: string;
  readonly secret: string;
  readonly clientId?: string;
  readonly requestId?: string;
  readonly requestTimestamp?: string;
  readonly requestTarget?: string;
}): boolean {
  let expected = '';

  if (params.provider === 'stripe') {
    expected = crypto.createHmac('sha256', params.secret).update(params.rawBody, 'utf8').digest('hex');
  } else if (params.provider === 'doku-checkout') {
    const digest = crypto.createHash('sha256').update(params.rawBody, 'utf8').digest('base64');
    const component = [
      `Client-Id:${params.clientId ?? ''}`,
      `Request-Id:${params.requestId ?? ''}`,
      `Request-Timestamp:${params.requestTimestamp ?? ''}`,
      `Request-Target:${params.requestTarget ?? ''}`,
      `Digest:${digest}`
    ].join('\n');
    const hmac = crypto.createHmac('sha256', params.secret).update(component, 'utf8').digest('base64');
    expected = `HMACSHA256=${hmac}`;
  } else {
    expected = crypto.createHash('sha512').update(params.rawBody + params.secret, 'utf8').digest('hex');
  }

  const a = Buffer.from(params.signatureHeader, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
```

### Example 3: PostgreSQL Atomic Webhook Inbox & Outbox Locking DDL (`SKIP LOCKED`)
```sql
CREATE TABLE IF NOT EXISTS payment_webhook_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  provider VARCHAR(32) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  raw_payload JSONB NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_inbox_pending
  ON payment_webhook_inbox (status, created_at)
  WHERE status = 'PENDING';

ALTER TABLE payment_webhook_inbox ENABLE ROW LEVEL SECURITY;
```

### Trigger Conditions
Active whenever the user is working on billing integration, payment checkout, webhook handling, or integrating platforms like PayPal, Stripe, Xendit, Midtrans, or DOKU SNAP BI.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec payment-gateway-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Gateway & Integrasi Pembayaran**: `doku-payment-gateway`, `saas-billing`, `agentic-m2m-settlement`, `agentic-micro-economy-architect`
- **AI Agentic Commerce & MCP**: `doku-mcp-server`, `mcp-server-architect`, `ai-llm-integration-expert`
- **Database & Idempotensi Atomik**: `database-orm-expert`, `saas-multi-tenant`
- **Keamanan & Kriptografi Pasca-Kuantum**: `post-quantum-crypto-migrator`, `zero-trust-secret-vault`, `autonomous-red-teamer`
- **Antrean Latar Belakang & Observabilitas**: `async-queue-temporal-expert`, `data-telemetry-expert`
- **Siklus Hidup & Tata Kelola**: `brainstorming`, `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Deskripsi
Panduan ahli untuk mengintegrasikan payment gateway utama (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) ke platform SaaS modern. Mencakup alur checkout, penanganan webhook raw-body aman, pencegahan race condition melalui atomic update, state machine langganan, dan sinkronisasi database lokal.

### Kondisi Pemicu
Aktif setiap kali pengguna sedang mengerjakan integrasi billing, checkout pembayaran, penanganan webhook, atau mengintegrasikan platform seperti PayPal, Stripe, Xendit, Midtrans, atau DOKU SNAP BI.

---

### Prinsip Utama & Kode Implementasi Webhook Idempoten (TypeScript)

```typescript
import { headers } from 'next/headers';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const rawBody = await req.text(); // Wajib membaca raw body mentah sebelum diparse
  const headerList = await headers();

  const timestamp = headerList.get('x-timestamp') || '';
  const signatureDiterima = headerList.get('x-signature') || '';
  const authHeader = headerList.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const path = new URL(req.url).pathname;

  // 1. Verifikasi Signature HMAC-SHA512 SNAP BI
  const bodyHash = crypto.createHash('sha256').update(rawBody, 'utf8').digest('hex').toLowerCase();
  const stringToSign = `POST:${path}:${token}:${bodyHash}:${timestamp}`;
  const signatureDihitung = crypto
    .createHmac('sha512', process.env.DOKU_SECRET_KEY!)
    .update(stringToSign, 'utf8')
    .digest('base64');

  if (!crypto.timingSafeEqual(Buffer.from(signatureDiterima), Buffer.from(signatureDihitung))) {
    return new Response('Tanda Tangan Tidak Valid', { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const nomorInvoice = payload.order?.invoice_number;

  // 2. Atomic Update: Kunci hanya baris dengan status 'PENDING' untuk mencegah race condition
  const diperbarui = await db.transaksi.updateMany({
    where: { nomorInvoice, status: 'PENDING' },
    data: { status: 'PAID', dibayarPada: new Date() },
  });

  // 3. Penanganan Webhook Duplikat (Idempotensi)
  if (diperbarui.count === 0) {
    return new Response(JSON.stringify({ status: 'SUDAH_DIPROSES' }), { status: 200 });
  }

  // 4. Aktivasi Layanan Pengguna (Hanya dieksekusi 1 kali)
  await aktifkanLangganan(nomorInvoice);
  return new Response(JSON.stringify({ status: 'BERHASIL' }), { status: 200 });
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec payment-gateway-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
