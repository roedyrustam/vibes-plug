# Billing & Payment Gateway Integration Guide

A comprehensive guide to setting up subscription billing, payment gateways, and Merchant of Record (MoR) systems. This guide covers Stripe, Midtrans, PayPal, Paddle, and FastSpring, detailing database structures and webhook verification in a multi-tenant SaaS application.

---

## 1. Gateway Type: Payment Gateway vs. Merchant of Record (MoR)

Before choosing a billing system, it is vital to understand the two main categories of billing platforms:

| Feature | Payment Gateway (Stripe, Midtrans, PayPal) | Merchant of Record (Paddle, FastSpring) |
|---|---|---|
| **Definition** | Processes payments but places legal/financial responsibilities on you. | Acts as the reseller of your software; handles transactions and compliance. |
| **Sales Tax / VAT** | You must calculate, collect, and file taxes globally (using tools like Stripe Tax). | Automatically handles global taxes, compliance, and invoicing. |
| **Chargeback Liability**| You manage chargeback disputes directly. | The MoR platform handles chargeback disputes. |
| **Integration Complexity**| Highly customizable APIs, but requires more backend logic for compliance. | Simple to configure; checkout UI is managed by the MoR. |

---

## 2. Generic Multi-Gateway Database Schema

To support multiple payment gateways, use a generic subscription schema.

### Prisma Schema (`prisma/schema.prisma`)
```prisma
model Subscription {
  id                 String   @id @default(cuid())
  workspaceId        String   @unique
  workspace          Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  gateway            String   // "stripe", "midtrans", "paypal", "paddle", "fastspring"
  gatewayCustomerId  String?  @unique
  gatewaySubscriptionId String? @unique
  gatewayPriceId     String?
  status             String   // "active", "trialing", "past_due", "canceled", "unpaid"
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

### Drizzle ORM Schema (`lib/db/schema.ts`)
```typescript
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().unique(),
  gateway: text('gateway').notNull(), // "stripe", "midtrans", "paypal", "paddle", "fastspring"
  gatewayCustomerId: text('gateway_customer_id').unique(),
  gatewaySubscriptionId: text('gateway_subscription_id').unique(),
  gatewayPriceId: text('gateway_price_id'),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 3. Webhook Implementations

Webhooks are crucial to keep your SaaS database in sync with payment updates. Below are the implementation templates for Next.js 15 (App Router).

### A. Stripe Integration
Processes subscriptions and invoices. Verified via the Stripe SDK.

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-01' as any });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const workspaceId = session.metadata?.workspaceId;
      if (!workspaceId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await db.insert(subscriptions).values({
        id: subscription.id,
        workspaceId,
        gateway: 'stripe',
        gatewayCustomerId: session.customer as string,
        gatewaySubscriptionId: subscription.id,
        gatewayPriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.subscription) break;
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      await db.update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        })
        .where(eq(subscriptions.gatewaySubscriptionId, subscription.id));
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await db.update(subscriptions)
        .set({ status: 'canceled' })
        .where(eq(subscriptions.gatewaySubscriptionId, subscription.id));
      break;
    }
  }
  return NextResponse.json({ received: true });
}
```

### B. Midtrans Integration
Southeast Asia's popular payment gateway. Verified via SHA512 signature key matching.

```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.json();
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  // Verify signature key: sha512(order_id + status_code + gross_amount + server_key)
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const hashed = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex');

  if (hashed !== signature_key) {
    return NextResponse.json({ error: 'Invalid Midtrans signature' }, { status: 400 });
  }

  // Update subscription/payment state based on transaction_status
  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (fraud_status === 'challenge') {
      await db.update(subscriptions).set({ status: 'unpaid' }).where(eq(subscriptions.id, order_id));
    } else {
      await db.update(subscriptions)
        .set({ status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
        .where(eq(subscriptions.id, order_id));
    }
  } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
    await db.update(subscriptions).set({ status: 'canceled' }).where(eq(subscriptions.id, order_id));
  } else if (transaction_status === 'pending') {
    await db.update(subscriptions).set({ status: 'unpaid' }).where(eq(subscriptions.id, order_id));
  }

  return NextResponse.json({ success: true });
}
```

### C. PayPal Integration
Global subscription billing. Verified via PayPal API request validation.

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function verifyPayPalSignature(headers: Headers, rawBody: string, webhookId: string) {
  // Call PayPal API to verify signature authenticity
  const endpoint = process.env.PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  const authHeader = headers.get('authorization');
  if (!authHeader) return false;

  const response = await fetch(`${endpoint}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });

  const verification = await response.json();
  return verification.verification_status === 'SUCCESS';
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

  const isValid = await verifyPayPalSignature(req.headers, rawBody, webhookId);
  if (!isValid) {
    return NextResponse.json({ error: 'PayPal signature invalid' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event_type) {
    case 'BILLING.SUBSCRIPTION.CREATED': {
      const sub = event.resource;
      const workspaceId = sub.custom_id; // Pass workspace ID in custom_id
      if (!workspaceId) break;

      await db.insert(subscriptions).values({
        id: sub.id,
        workspaceId,
        gateway: 'paypal',
        gatewayCustomerId: sub.subscriber.payer_id,
        gatewaySubscriptionId: sub.id,
        gatewayPriceId: sub.plan_id,
        status: 'active',
        currentPeriodEnd: new Date(sub.billing_info.next_billing_time),
      });
      break;
    }
    case 'BILLING.SUBSCRIPTION.CANCELLED': {
      const sub = event.resource;
      await db.update(subscriptions)
        .set({ status: 'canceled' })
        .where(eq(subscriptions.gatewaySubscriptionId, sub.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### D. Paddle Integration (Paddle Billing v2)
Merchant of Record. Verified locally using an HMAC-SHA256 signature key verification.

```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function verifyPaddleSignature(body: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(';');
  const tsPart = parts.find(p => p.startsWith('ts='));
  const h1Part = parts.find(p => p.startsWith('h1='));
  if (!tsPart || !h1Part) return false;

  const ts = tsPart.split('=')[1];
  const h1 = h1Part.split('=')[1];

  const payload = `${ts}:${body}`;
  const computedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return computedHash === h1;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('Paddle-Signature')!;
  const secret = process.env.PADDLE_WEBHOOK_SECRET!;

  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid Paddle signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event_type;
  const data = event.data;

  switch (eventType) {
    case 'subscription.created':
    case 'subscription.updated': {
      const workspaceId = data.custom_data?.workspaceId;
      if (!workspaceId) break;

      await db.insert(subscriptions).values({
        id: data.id,
        workspaceId,
        gateway: 'paddle',
        gatewayCustomerId: data.customer_id,
        gatewaySubscriptionId: data.id,
        gatewayPriceId: data.items[0].price.id,
        status: data.status, // active, trialing, paused
        currentPeriodEnd: new Date(data.current_billing_period.ends_at),
      }).onConflictDoUpdate({
        target: subscriptions.workspaceId,
        set: {
          status: data.status,
          currentPeriodEnd: new Date(data.current_billing_period.ends_at),
          gatewayPriceId: data.items[0].price.id,
        }
      });
      break;
    }
    case 'subscription.canceled': {
      await db.update(subscriptions)
        .set({ status: 'canceled' })
        .where(eq(subscriptions.gatewaySubscriptionId, data.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### E. FastSpring Integration
Merchant of Record. Verified via an HMAC-SHA256 signature key verification.

```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function verifyFastSpringSignature(body: string, signature: string, secretKey: string): boolean {
  const hash = crypto.createHmac('sha256', secretKey).update(body).digest('base64');
  return hash === signature;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('X-FS-Signature')!;
  const secretKey = process.env.FASTSPRING_SHARED_SECRET!;

  if (!verifyFastSpringSignature(rawBody, signature, secretKey)) {
    return NextResponse.json({ error: 'Invalid FastSpring signature' }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);

  for (const event of payload.events) {
    switch (event.type) {
      case 'subscription.activated': {
        const sub = event.data;
        const workspaceId = sub.tags?.workspaceId;
        if (!workspaceId) break;

        await db.insert(subscriptions).values({
          id: sub.id,
          workspaceId,
          gateway: 'fastspring',
          gatewayCustomerId: sub.account,
          gatewaySubscriptionId: sub.id,
          gatewayPriceId: sub.product,
          status: 'active',
          currentPeriodEnd: new Date(sub.nextSession),
        });
        break;
      }
      case 'subscription.canceled': {
        const sub = event.data;
        await db.update(subscriptions)
          .set({ status: 'canceled' })
          .where(eq(subscriptions.gatewaySubscriptionId, sub.id));
        break;
      }
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 4. Best Practices for Webhook Handlers

1. **Webhook Idempotency**: Payment gateways can redeliver webhooks. Always store a list of processed event IDs in your database to prevent duplicate actions:
   ```typescript
   const processed = await db.query.processedEvents.findFirst({ where: eq(processedEvents.id, eventId) });
   if (processed) return NextResponse.json({ received: true });
   ```
2. **Handle Async Work Gracefully**: Send a fast response (`200 OK`) back to the gateway first, then process any heavy logic asynchronously (or via queue systems like BullMQ) if necessary, to avoid gateway timeouts.
3. **Database Locks**: Run your update queries inside clean transactions to avoid concurrency anomalies.
