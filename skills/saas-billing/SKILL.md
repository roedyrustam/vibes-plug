---
name: saas-billing
description: "Implement and audit SaaS billing systems, subscription state machines, secure webhooks, and local database synchronization / Implementasi dan audit sistem billing SaaS, state machine langganan, webhook aman, dan sinkronisasi database lokal."
author: "Roedy Rustam"
---

# SaaS Billing Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for implementing and auditing SaaS billing systems. Covers subscription state machines, secure webhook handling, database synchronization, and the 2026 billing landscape including Stripe, **Polar.sh** (open-source, developer-first), **LemonSqueezy**, PayPal, and Midtrans (for Southeast Asia).

### Trigger Conditions
- Integrating any payment gateway (Stripe, Polar.sh, LemonSqueezy, Midtrans, PayPal) into a SaaS application.
- Implementing subscription state machines (active → past_due → canceled → reactivated).
- Building secure webhook handlers with signature verification and idempotency.
- Syncing external subscription status to a local database.
- Implementing usage-based billing or metered API pricing.
- Building the customer billing portal (manage subscription, download invoices).
- Auditing an existing billing system for security gaps.

### 2026 Billing Provider Landscape

| Provider | Best For | Open Source | Merchant of Record |
|---|---|---|---|
| **Stripe** | Enterprise, global, complex billing | ❌ | ❌ |
| **Polar.sh** | Developer-first, open-source products | ✅ | ✅ (optional) |
| **LemonSqueezy** | Indie hackers, simple pricing, global | ❌ | ✅ |
| **Paddle** | B2B SaaS, EU VAT compliance | ❌ | ✅ |
| **Midtrans** | Southeast Asia / Indonesia | ❌ | ❌ |
| **PayPal** | Global, consumer trust | ❌ | ❌ |

> **Merchant of Record (MoR)**: The provider handles tax compliance (VAT, GST), chargebacks, and legal liability — ideal for small teams without a finance department.

### Polar.sh — Developer-First Billing (2026 Rising Star)
Polar.sh is the modern, open-source alternative to Gumroad/LemonSqueezy, purpose-built for developers and open-source projects:
```typescript
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN });

// Create a checkout session
const checkout = await polar.checkouts.custom.create({
  productId: "prod_xxxx",
  successUrl: "https://myapp.com/success?checkout={CHECKOUT_ID}",
  customerEmail: user.email,
  metadata: { userId: user.id },
});

// Redirect to checkout
return redirect(checkout.url);
```

```typescript
// Webhook handler (Next.js App Router)
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("webhook-signature") ?? "";
  
  try {
    const event = validateEvent(body, req.headers, process.env.POLAR_WEBHOOK_SECRET!);
    
    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
        await syncSubscription(event.data);
        break;
      case "subscription.canceled":
        await cancelSubscription(event.data.id);
        break;
    }
    return new Response(null, { status: 200 });
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      return new Response("Invalid signature", { status: 403 });
    }
    throw e;
  }
}
```

### Stripe — Production Patterns

#### Subscription State Machine
```
FREE ──subscribe──> TRIALING ──trial_ends──> ACTIVE
                                              │
                              ┌───────────────┤
                              │               │
                         payment fails    cancel
                              │               │
                          PAST_DUE        CANCELED
                              │
                         3 failed retries
                              │
                          CANCELED
```

#### Idempotent Webhook Handler
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotency: skip already-processed events
  const processed = await db.webhookEvent.findUnique({ where: { stripeEventId: event.id } });
  if (processed) return new Response(null, { status: 200 });

  // Process event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await db.subscription.upsert({
        where: { stripeSubId: sub.id },
        create: { stripeSubId: sub.id, status: sub.status, userId: sub.metadata.userId },
        update: { status: sub.status, currentPeriodEnd: new Date(sub.current_period_end * 1000) },
      });
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await sendDunningEmail(invoice.customer_email!);
      break;
    }
  }

  // Mark as processed
  await db.webhookEvent.create({ data: { stripeEventId: event.id } });
  return new Response(null, { status: 200 });
}
```

#### Usage-Based Billing (Metered)
```typescript
// Report usage at end of billing period
await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
  quantity: apiCallsThisMonth,
  timestamp: Math.floor(Date.now() / 1000),
  action: 'set', // 'set' or 'increment'
});
```

### Database Schema for Multi-Provider Billing
```typescript
// Drizzle ORM — supports Stripe, Polar, LemonSqueezy
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id).notNull(),
  provider: text('provider').$type<'stripe' | 'polar' | 'lemonsqueezy'>().notNull(),
  externalCustomerId: text('external_customer_id').notNull(),
  externalSubId: text('external_sub_id').notNull().unique(),
  status: text('status').$type<'active' | 'trialing' | 'past_due' | 'canceled' | 'paused'>().notNull(),
  plan: text('plan').$type<'free' | 'pro' | 'enterprise'>().default('free').notNull(),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Billing Security Checklist
- [ ] Webhook signature verified on every request — reject without valid signature.
- [ ] Webhook idempotency implemented — never process the same event twice.
- [ ] Use Stripe CLI / Polar.sh test webhooks for local development.
- [ ] All billing API calls use server-side code only — never expose secret keys to frontend.
- [ ] Plan limits enforced on every protected route (not just at checkout).
- [ ] Failed payment dunning flow configured (email sequence, grace period).
- [ ] Customer portal link available from within the app.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengimplementasikan dan mengaudit sistem billing SaaS. Mencakup state machine langganan, penanganan webhook aman, sinkronisasi database, dan lanskap billing 2026 termasuk Stripe, **Polar.sh** (open-source, developer-first), **LemonSqueezy**, PayPal, dan Midtrans (untuk Asia Tenggara).

### Kondisi Pemicu
- Mengintegrasikan payment gateway (Stripe, Polar.sh, LemonSqueezy, Midtrans, PayPal) ke aplikasi SaaS.
- Mengimplementasikan state machine langganan.
- Membangun webhook handler aman dengan verifikasi tanda tangan dan idempotency.
- Menyinkronkan status langganan eksternal ke database lokal.
- Mengimplementasikan billing berbasis penggunaan (metered pricing).
- Membangun portal billing pelanggan.
- Mengaudit sistem billing yang ada untuk celah keamanan.

### Lanskap Provider Billing 2026

| Provider | Terbaik Untuk | Open Source | Merchant of Record |
|---|---|---|---|
| **Stripe** | Enterprise, global, billing kompleks | ❌ | ❌ |
| **Polar.sh** | Developer-first, produk open-source | ✅ | ✅ (opsional) |
| **LemonSqueezy** | Indie hackers, harga sederhana | ❌ | ✅ |
| **Paddle** | B2B SaaS, kepatuhan PPN EU | ❌ | ✅ |
| **Midtrans** | Asia Tenggara / Indonesia | ❌ | ❌ |

> **Merchant of Record (MoR)**: Provider menangani kepatuhan pajak (PPN, GST), chargeback, dan tanggung jawab hukum — ideal untuk tim kecil tanpa departemen keuangan.

### Polar.sh — Billing Developer-First
Polar.sh adalah alternatif open-source modern untuk Gumroad/LemonSqueezy, dirancang khusus untuk developer dan proyek open-source. Mendukung checkout, webhook, dan manajemen langganan dengan SDK TypeScript yang bersih.

### Stripe — Pola Produksi

#### State Machine Langganan
Kelola transisi status: `FREE → TRIALING → ACTIVE → PAST_DUE → CANCELED → (reaktivasi)`.

#### Webhook Handler Idempoten
Selalu verifikasi tanda tangan webhook, tandai event sebagai diproses di database untuk mencegah duplikasi.

#### Billing Berbasis Penggunaan (Metered)
Laporkan penggunaan API dengan `stripe.subscriptionItems.createUsageRecord()` di akhir periode billing.

### Skema Database Multi-Provider
Rancang tabel `subscriptions` yang mendukung beberapa provider (`stripe`, `polar`, `lemonsqueezy`) dengan kolom `provider` dan ID eksternal yang terpisah.

### Checklist Keamanan Billing
- [ ] Tanda tangan webhook diverifikasi pada setiap permintaan.
- [ ] Idempotency webhook diimplementasikan.
- [ ] Semua panggilan API billing menggunakan kode sisi server saja.
- [ ] Batas plan diterapkan pada setiap rute yang dilindungi.
- [ ] Alur dunning pembayaran gagal dikonfigurasi.
- [ ] Tautan portal pelanggan tersedia dari dalam aplikasi.
