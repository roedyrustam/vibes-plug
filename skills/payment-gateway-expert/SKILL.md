---
name: payment-gateway-expert
description: "Expert guide for integrating payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) and secure webhooks into SaaS platforms / Panduan ahli integrasi payment gateway dan webhook aman."
author: "Roedy Rustam"
version: "4.0.0"
---

# Payment Gateway Expert / Ahli Payment Gateway

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for integrating major payment gateways (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) into modern SaaS platforms. Covers checkout flows, secure raw-body webhook handling, atomic idempotency to prevent race conditions, subscription state machines, and local database synchronization.

### Core Principles
- **Security First**: Always validate webhook signatures using the raw, unparsed request body before processing any payment event. Never trust client-side data for prices or payment status. For Indonesian gateways (DOKU, Midtrans, Xendit), strictly enforce the **SNAP BI standard (HMAC-SHA512)** and ISO8601 UTC/WIB timestamps.
- **Idempotency & Race Condition Prevention**: Implement idempotency keys for all payment creation requests. For webhook ingestion, **DO NOT rely solely on `findUnique` checks**, as concurrent webhook retries cause race conditions. Always use **Atomic Updates** (`UPDATE ... WHERE status = 'PENDING'`) or database pessimistic locks (`SELECT ... FOR UPDATE`).
- **Raw Body Ingestion**: Webhook signature verification fails if JSON is parsed or re-serialized with modified key ordering. Extract the exact raw string buffer (`req.text()` in Fetch API or `express.raw({ type: 'application/json' })` in Express).
- **Early 200 OK Acknowledgment**: If a webhook event is verified but already processed, immediately return `200 OK` so the payment gateway halts retries.
- **State Synchronization**: Ensure the local database (e.g., PostgreSQL, Supabase via Drizzle/Prisma) is updated transactionally upon receiving successful webhook events.
- **Subscription Management**: Map provider subscription statuses (`trialing`, `active`, `past_due`, `canceled`) accurately to internal SaaS state machines.

### Implementation Checklist
- [ ] Create dedicated raw Webhook endpoint (e.g., `/api/webhooks/stripe`, `/api/webhooks/doku`).
- [ ] Use raw request body string for signature verification (never parsed JSON).
- [ ] Verify signature using proper algorithm (HMAC-SHA256 for Stripe/PayPal; HMAC-SHA512 for SNAP BI).
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

## Orchestration & Integration
- Integrates with: `saas-billing`, `doku-payment-gateway`, `doku-mcp-server`, `async-queue-temporal-expert`, `database-orm-expert`.

### Trigger Conditions
Active whenever the user is working on billing integration, payment checkout, webhook handling, or integrating platforms like PayPal, Stripe, Xendit, Midtrans, or DOKU SNAP BI.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengintegrasikan payment gateway utama (Stripe, PayPal, Xendit, Midtrans, DOKU SNAP BI) ke platform SaaS modern. Mencakup alur checkout, penanganan webhook raw-body aman, pencegahan race condition melalui atomic update, state machine langganan, dan sinkronisasi database lokal.

### Prinsip Utama
- **Keamanan Utama**: Selalu validasi signature webhook menggunakan *raw request body* murni sebelum memproses event pembayaran. Jangan pernah mempercayai data dari sisi klien untuk harga atau status pembayaran. Untuk gateway Indonesia (DOKU, Midtrans, Xendit), terapkan **standar SNAP BI (HMAC-SHA512)** dan format timestamp ISO8601.
- **Idempotensi & Pencegahan Race Condition**: Implementasikan kunci idempotensi untuk semua pembuatan pembayaran. Pada penerimaan webhook, **JANGAN hanya mengandalkan pengecekan `findUnique`**, karena panggilan webhook paralel dari gateway dapat memicu race condition. Selalu gunakan **Atomic Update** (`UPDATE ... WHERE status = 'PENDING'`) atau database lock (`SELECT ... FOR UPDATE`).
- **Raw Body Webhook**: Verifikasi tanda tangan akan gagal jika JSON di-parse atau di-serialize ulang karena perubahan urutan key atau spasi. Ambil buffer teks mentah (`req.text()` pada Fetch API atau `express.raw({ type: 'application/json' })` di Express).
- **Balasan Cepat 200 OK**: Jika signature valid namun transaksi sudah berstatus lunas (webhook duplikat/retry), segera kembalikan HTTP `200 OK` agar payment gateway berhenti mengirimkan retry.
- **Sinkronisasi State**: Pastikan database lokal (PostgreSQL/Supabase via Drizzle/Prisma) diperbarui secara transaksional saat menerima webhook sukses.
- **Manajemen Langganan**: Petakan status langganan dari provider (`trialing`, `active`, `past_due`, `canceled`) secara akurat ke state machine internal SaaS.

### Checklist Implementasi
- [ ] Buat endpoint Webhook raw khusus (misal: `/api/webhooks/stripe`, `/api/webhooks/doku`).
- [ ] Gunakan raw request body string untuk verifikasi signature (jangan parse JSON sebelum verifikasi).
- [ ] Verifikasi signature dengan algoritma yang tepat (HMAC-SHA256 untuk Stripe/PayPal; HMAC-SHA512 untuk SNAP BI).
- [ ] Terapkan Atomic Update (`WHERE status = 'PENDING'`) untuk mematikan peluang race condition.
- [ ] Balas webhook duplikat secara instan dengan HTTP `200 OK`.
- [ ] Lemparkan proses berat pasca-bayar (pembuatan invoice PDF, email, push notification) ke antrean latar belakang (BullMQ/Temporal).

## Integrasi Orkestrasi
- Terintegrasi dengan: `saas-billing`, `doku-payment-gateway`, `doku-mcp-server`, `async-queue-temporal-expert`, `database-orm-expert`.

### Kondisi Pemicu
Aktif setiap kali pengguna sedang mengerjakan integrasi billing, checkout pembayaran, penanganan webhook, atau mengintegrasikan platform seperti PayPal, Stripe, Xendit, Midtrans, atau DOKU SNAP BI.