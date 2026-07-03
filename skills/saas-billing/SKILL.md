---
name: saas-billing
description: "Implement and audit SaaS billing systems, subscription state machines, secure webhooks, and local database synchronization / Implementasi dan audit sistem billing SaaS, state machine langganan, webhook aman, dan sinkronisasi database lokal."
author: "Roedy Rustam"
---

# SaaS Billing & Subscription Management

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides complete guidelines for implementing and auditing SaaS billing systems, subscription state machines, secure webhook architectures, and local database synchronization using Stripe, Midtrans, or Paddle.

### Trigger Conditions
Use this skill when:
- Designing or auditing SaaS billing flows (pricing pages, checkout sessions, customer portals).
- Setting up webhook endpoints and signature verification.
- Designing database schemas or state machines to track subscription statuses (active, past_due, trialing, canceled).
- Implementing multi-tier pricing strategies (per-seat, tiered, usage-based billing).
- Handling subscription lifecycle transitions, failures (dunning), and upgrades/downgrades.

### Core Architecture

#### 1. Database Subscription State Machine
Your database must act as the source of truth for authorization, but synchronize with the payment provider. Ensure the following subscription states are tracked:
- `trialing`: User has access to trial features. Track `trial_end` timestamp.
- `active`: Current billing cycle paid. Access fully granted.
- `past_due`: Payment failed. Do not immediately revoke access; trigger dunning emails and display grace period warning in UI.
- `canceled`: Subscription ended. Revoke premium features and prompt for reactivation.

#### 2. Secure Webhook Implementation
- **Signature Verification**: Always verify webhook signatures using the gateway's official SDK and webhook secret. Never trust raw request bodies.
- **Idempotency**: Webhook events might be delivered multiple times. Save handled `event_id`s to a database table to avoid duplicate processing.
- **Async Processing**: Return a `200 OK` status immediately to the gateway, then process the webhook body asynchronously (e.g., via background queues) to avoid gateway timeout.

#### 3. Code Example: Drizzle Schema
```typescript
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  customerId: text("customer_id").notNull(), // Stripe/Midtrans customer reference
  subscriptionId: text("subscription_id").primaryKey(), // Gateway subscription reference
  status: text("status").notNull(), // trialing, active, past_due, canceled
  priceId: text("price_id").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan pedoman lengkap untuk mengimplementasikan dan mengaudit sistem billing SaaS, state machine langganan, arsitektur webhook yang aman, dan sinkronisasi database lokal menggunakan Stripe, Midtrans, atau Paddle.

### Kondisi Pemicu
Gunakan skill ini ketika:
- Merancang atau mengaudit alur billing SaaS (halaman harga, checkout, portal pelanggan).
- Menyiapkan endpoint webhook dan verifikasi tanda tangan (signature verification).
- Merancang skema database atau state machine untuk melacak status langganan (active, past_due, trialing, canceled).
- Mengimplementasikan strategi penagihan multi-tier (per-seat, berjenjang, usage-based).
- Menangani transisi siklus hidup langganan, kegagalan pembayaran (dunning), serta upgrade/downgrade.

### Arsitektur Inti

#### 1. State Machine Database Langganan
Database Anda harus bertindak sebagai sumber kebenaran (source of truth) untuk otorisasi, tetapi tersinkronisasi dengan penyedia pembayaran. Pastikan status langganan berikut dilacak:
- `trialing`: Pengguna memiliki akses ke fitur uji coba. Lacak timestamp `trial_end`.
- `active`: Siklus penagihan saat ini lunas. Akses diberikan penuh.
- `past_due`: Pembayaran gagal. Jangan langsung mencabut akses; kirim email penagihan ulang (dunning) dan tampilkan peringatan masa tenggang di UI.
- `canceled`: Langganan berakhir. Cabut fitur premium dan tawarkan reaktivasi.

#### 2. Implementasi Webhook Aman
- **Verifikasi Tanda Tangan**: Selalu verifikasi signature webhook menggunakan SDK resmi gateway dan webhook secret. Jangan pernah mempercayai body request mentah.
- **Idempotensi**: Event webhook dapat dikirim lebih dari sekali. Simpan `event_id` yang telah diproses ke dalam tabel database untuk menghindari pemrosesan ganda.
- **Pemrosesan Asinkron**: Kembalikan status `200 OK` segera ke payment gateway, lalu proses webhook di background queue agar koneksi tidak mengalami timeout.

#### 3. Contoh Kode: Handler Webhook Next.js 15
```typescript
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle Event
  switch (event.type) {
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      await db.update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })
        .where(eq(subscriptions.subscriptionId, subscription.id));
      break;
  }

  return NextResponse.json({ received: true });
}
```
