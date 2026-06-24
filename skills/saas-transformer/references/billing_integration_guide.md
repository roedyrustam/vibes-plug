# Billing Integration Guide (Stripe Focus)

Comprehensive guide to setting up subscription billing, handling webhooks, and ensuring state consistency in a multi-tenant SaaS application.

---

## 1. Product & Price Structure

Maintain a clean mapping between your system's Plan levels (`free`, `pro`, `enterprise`) and Stripe's Price IDs.

```typescript
export const PLAN_PRICES = {
  free: {
    monthly: null,
    yearly: null,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID!,
  }
};
```

---

## 2. Stripe Webhook Handler (Node.js/Next.js Route)

Ensure webhook signature verification is strictly enforced, and handle processing idempotently.

```typescript
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 1. Check event idempotency
  const alreadyProcessed = await db.query.processedEvents.findFirst({
    where: (table, { eq }) => eq(table.id, event.id)
  });
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // 2. Handle specific subscription events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const workspaceId = session.metadata?.workspaceId;
      if (!workspaceId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      await db.insert(subscriptions).values({
        workspaceId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      if (!invoice.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      await db.update(subscriptions)
        .set({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          stripePriceId: subscription.items.data[0].price.id,
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await db.update(subscriptions)
        .set({ status: 'canceled' })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }
  }

  // 3. Mark event as processed
  await db.insert(processedEvents).values({ id: event.id });

  return NextResponse.json({ received: true });
}
```

---

## 3. Subscription Verification Hook

Expose helper functions to query subscription status efficiently on the server or client side.

```typescript
export async function getWorkspaceSubscription(workspaceId: string) {
  const sub = await db.query.subscriptions.findFirst({
    where: (table, { eq }) => eq(table.workspaceId, workspaceId)
  });

  if (!sub) {
    return { plan: 'free', isActive: true }; // Free plan by default
  }

  const isActive = ['active', 'trialing'].includes(sub.status);
  
  // Resolve plan type based on price ID mapping
  let plan = 'free';
  if (sub.stripePriceId === PLAN_PRICES.pro.monthly || sub.stripePriceId === PLAN_PRICES.pro.yearly) {
    plan = 'pro';
  } else if (sub.stripePriceId === PLAN_PRICES.enterprise.monthly || sub.stripePriceId === PLAN_PRICES.enterprise.yearly) {
    plan = 'enterprise';
  }

  return {
    plan,
    isActive,
    currentPeriodEnd: sub.currentPeriodEnd,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd
  };
}
```
