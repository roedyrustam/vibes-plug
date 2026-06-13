---
name: saas-mvp-launcher
description: "Use when planning or building a SaaS MVP from scratch. Provides a structured roadmap covering tech stack, architecture, auth, payments, and launch checklist."
author: "Roedy Rustam"
---

# SaaS MVP Launcher

## Overview

This skill guides you through building a production-ready SaaS MVP in the shortest time possible. It covers everything from idea validation and tech stack selection to authentication, payments, database design, deployment, and launch — using modern, battle-tested tools.

## When to Use This Skill

- Use when starting a new SaaS product from scratch
- Use when you need to choose a tech stack for a web application
- Use when setting up authentication, billing, or database for a SaaS
- Use when you want a structured launch checklist before going live
- Use when designing the architecture of a multi-tenant application
- Use when doing a technical review of an existing early-stage SaaS

## Step-by-Step Guide

### 1. Validate Before You Build

Before writing any code, validate the idea:

```
Validation checklist:
- [ ] Can you describe the problem in one sentence?
- [ ] Who is the exact customer? (not "everyone")
- [ ] What do they pay for today to solve this?
- [ ] Have you talked to 5+ potential customers?
- [ ] Will they pay $X/month for your solution?
```

**Rule:** If you can't get 3 people to pre-pay or sign a letter of intent, don't build yet.

### 2. Choose Your Tech Stack

Recommended modern SaaS stack (2026):

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 15 + TypeScript | App Router, React Server Components, fast hydration |
| Styling | Tailwind CSS v4 + shadcn/ui | Native cascade layers, CSS-first config, superb aesthetics |
| Backend | Next.js Server Actions | Standard 2026 pattern, co-located types, direct DB integration |
| Database | PostgreSQL (Supabase or Neon) | High performance, serverless branching, robust RLS |
| ORM | Drizzle ORM or Prisma | Drizzle for edge compatibility/SQL-like feel; Prisma for rich DX |
| Auth | Clerk or NextAuth.js (Auth.js) | Secure sessions, social logins, middleware support |
| Payments | Stripe | Complete subscription lifecycles, customer portal, robust SDK |
| Email | Resend + React Email | High deliverability, template composability, fast setup |
| Deployment | Vercel | Seamless Next.js deployment, edge network, zero-config CI/CD |
| Monitoring | Sentry + PostHog | Real-time crash reporting, visual replay, and user funnels |

### 3. Project Structure

```
my-saas/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (login, signup)
│   ├── (dashboard)/        # Protected app routes
│   ├── (marketing)/        # Public landing pages
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── [feature]/          # Feature-specific components
├── lib/
│   ├── db.ts               # Database client (Prisma/Drizzle)
│   ├── stripe.ts           # Stripe client
│   └── email.ts            # Email client (Resend)
├── prisma/
│   └── schema.prisma       # Database schema
├── .env.local              # Environment variables
└── middleware.ts           # Auth middleware
```

### 4. Core Database Schema (Multi-tenant SaaS)

#### Prisma Schema (`prisma/schema.prisma`)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  subscription  Subscription?
  workspaces    WorkspaceMember[]
}

model Workspace {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  plan      Plan      @default(FREE)
  members   WorkspaceMember[]
  createdAt DateTime  @default(now())
}

model WorkspaceMember {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  role        String    // ADMIN, MEMBER
  createdAt   DateTime  @default(now())

  @@unique([workspaceId, userId])
}

model Subscription {
  id                 String   @id @default(cuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id])
  stripeCustomerId   String   @unique
  stripePriceId      String
  stripeSubId        String   @unique
  status             String   # active, canceled, past_due
  currentPeriodEnd   DateTime
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}
```

#### Drizzle ORM Schema (`lib/db/schema.ts`)

```typescript
import { pgTable, text, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['FREE', 'PRO', 'ENTERPRISE']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: planEnum('plan').default('FREE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').$type<'ADMIN' | 'MEMBER'>().default('MEMBER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.workspaceId, t.userId),
}));

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeSubId: text('stripe_sub_id').notNull().unique(),
  status: text('status').notNull(), // 'active', 'canceled', etc.
  currentPeriodEnd: timestamp('current_period_end').notNull(),
});
```

### 5. Authentication Setup (Clerk)

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/blog(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 7. Next.js 15 Server Action (With Auth & Zod)

Server Actions provide a secure, type-safe way to handle form submissions and data mutations directly from React Server Components.

```typescript
// app/actions/workspace.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { workspaces, workspaceMembers } from '@/lib/db/schema';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(32),
  slug: z.string().min(2).max(32).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric & hyphens only'),
});

export async function createWorkspace(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const validatedFields = CreateWorkspaceSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, slug } = validatedFields.data;

  try {
    await db.transaction(async (tx) => {
      const workspaceId = `ws_${crypto.randomUUID()}`;
      
      // Create workspace
      await tx.insert(workspaces).values({
        id: workspaceId,
        name,
        slug,
        plan: 'FREE',
      });

      // Assign current user as admin
      await tx.insert(workspaceMembers).values({
        id: `wsm_${crypto.randomUUID()}`,
        workspaceId,
        userId,
        role: 'ADMIN',
      });
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Database error occurred' };
  }
}
```

### 8. Vercel AI SDK Integration (Core Feature)

Integrate AI capabilities effortlessly using the Vercel AI SDK. This pattern features structured JSON outputs and streaming support.

```typescript
// app/api/chat/route.ts
import { google } from '@ai-sdk/google'; // Or openai, anthropic, etc.
import { streamText } from 'ai';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-2.5-flash'),
    system: 'You are an intelligent assistant embedded inside a premium B2B SaaS MVP dashboard.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 9. Stripe Webhook Handler (Next.js App Router)

A robust webhook endpoint is essential for keeping subscription states synchronized when events occur in Stripe (e.g., successful renewal, cancellation, or failed payments).

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const userId = session.metadata?.userId;

    if (userId) {
      await db.insert(subscriptions).values({
        id: subscription.id,
        userId,
        stripeCustomerId: session.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await db
      .update(subscriptions)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(subscriptions.stripeSubId, subscription.id));
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    await db
      .update(subscriptions)
      .set({ status: 'canceled' })
      .where(eq(subscriptions.stripeSubId, subscription.id));
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 10. Pre-Launch Checklist

**Technical:**
- [ ] Authentication works (signup, login, logout, password reset)
- [ ] Payments work end-to-end (subscribe, cancel, upgrade)
- [ ] Error monitoring configured (Sentry)
- [ ] Environment variables documented
- [ ] Database backups configured
- [ ] Rate limiting on API routes
- [ ] Input validation with Zod on all forms
- [ ] HTTPS enforced, security headers set

**Product:**
- [ ] Landing page with clear value proposition
- [ ] Pricing page with 2-3 tiers
- [ ] Onboarding flow (first value in < 5 minutes)
- [ ] Email sequences (welcome, trial ending, payment failed)
- [ ] Terms of Service and Privacy Policy pages
- [ ] Support channel (email / chat)

**Marketing:**
- [ ] Domain purchased and configured
- [ ] SEO meta tags on all pages
- [ ] Google Analytics or PostHog installed
- [ ] Social media accounts created
- [ ] Product Hunt draft ready

## Best Practices

- ✅ **Do:** Ship a working MVP in 4-6 weeks maximum, then iterate based on feedback
- ✅ **Do:** Charge from day 1 — free users don't validate product-market fit
- ✅ **Do:** Build the "happy path" first, handle edge cases later
- ✅ **Do:** Use feature flags for gradual rollouts (e.g., Vercel Edge Config)
- ✅ **Do:** Monitor user behavior from launch day — not after problems arise
- ❌ **Don't:** Build every feature before talking to customers
- ❌ **Don't:** Optimize for scale before reaching $10k MRR
- ❌ **Don't:** Build a custom auth system — use Clerk, Auth.js, or Supabase Auth
- ❌ **Don't:** Skip the onboarding flow — it's where most SaaS lose users

## Troubleshooting

**Problem:** Users sign up but don't activate (don't use core feature)
**Solution:** Reduce steps to first value. Track with PostHog where users drop off in onboarding.

**Problem:** High churn after trial
**Solution:** Add an exit survey. Most churn is due to lack of perceived value, not price.

**Problem:** Stripe webhook events not received locally
**Solution:** Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Problem:** Database migrations failing in production
**Solution:** Always run `prisma migrate deploy` (not `prisma migrate dev`) in production environments.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
