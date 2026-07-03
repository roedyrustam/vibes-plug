---
name: saas-mvp-launcher
description: "Structured roadmap and design to plan and launch a SaaS MVP from scratch / Panduan terstruktur untuk merencanakan dan meluncurkan SaaS MVP dari nol."
author: "Roedy Rustam"
---

# SaaS MVP Launcher

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview
This skill guides you through building a production-ready SaaS MVP in the shortest time possible. It covers everything from idea validation and tech stack selection to authentication, payments, database design, deployment, and launch — using modern, battle-tested tools.

### Trigger Conditions
Use this skill when:
- Starting a new SaaS product from scratch.
- Choosing a tech stack for a web application.
- Setting up authentication, billing, or database for a SaaS.
- Requiring a structured launch checklist before going live.
- Designing the architecture of a multi-tenant application.
- Conducting a technical review of an existing early-stage SaaS.

### Step-by-Step Guide

#### 1. Validate Before You Build
Before writing any code, validate the idea:
- [ ] Can you describe the problem in one sentence?
- [ ] Who is the exact customer? (not "everyone")
- [ ] What do they pay for today to solve this?
- [ ] Have you talked to 5+ potential customers?
- [ ] Will they pay $X/month for your solution?

*Rule:* If you can't get 3 people to pre-pay or sign a letter of intent, don't build yet.

#### 2. Choose Your Tech Stack
Recommended modern SaaS stack (2026):
- **Frontend**: Next.js 15 + TypeScript (App Router, React Server Components).
- **Styling**: Tailwind CSS v4 + shadcn/ui.
- **Backend**: Next.js Server Actions (type-safe, direct database integration).
- **Database**: PostgreSQL (Supabase or Neon) with RLS.
- **ORM**: Drizzle ORM or Prisma.
- **Auth**: Clerk or NextAuth.js (Auth.js).
- **Payments**: Choice of Stripe, Midtrans (for SE Asia), PayPal, Paddle, or FastSpring (including subscriptions and customer portals).
- **Email**: Resend + React Email.
- **Deployment**: Vercel (seamless deployment, edge network, zero-config CI/CD).
- **Monitoring**: Sentry + PostHog (crash reporting, user analytics).

#### 3. Core Database Schema (Multi-tenant SaaS)
Please refer to the code examples below for database schema configurations in Prisma and Drizzle.

#### 4. Pre-Launch Checklist
- **Technical**: Authentication works, Payments work end-to-end, Error monitoring configured (Sentry), Database backups active, Rate limiting on API routes, Input validation with Zod.
- **Authentication & Auth Provider Checklist**:
  - **Clerk**: Ensure webhook secrets are configured in production to sync user creations/deletions, set `ClerkProvider` dynamic flags, and lock down middleware matching routes so API folders are protected.
  - **NextAuth.js (Auth.js)**: Verify `NEXTAUTH_SECRET` is set with a strong generated value, session driver is correctly configured (JWT or database sessions), and token expiration rules are set appropriately.
- **Product**: Landing page with clear value prop, Pricing page with 2-3 tiers, Onboarding flow (< 5 minutes to first value), ToS and Privacy Policy.
- **Marketing**: Domain configured, SEO meta tags on all pages, Analytics active.


### Best Practices & Troubleshooting
- **Build Fast**: Ship a working MVP in 4-6 weeks maximum, then iterate based on feedback.
- **Charge from Day 1**: Paying users validate product-market fit.
- **Stripe Webhooks**: Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ringkasan
Skill ini memandu Anda membangun SaaS MVP tingkat produksi dalam waktu sesingkat mungkin. Panduan ini mencakup validasi ide, pemilihan stack teknologi, autentikasi, pembayaran, desain database, deployment, hingga checklist peluncuran menggunakan teknologi modern yang teruji.

### Kondisi Pemicu
Gunakan skill ini ketika:
- Memulai produk SaaS baru dari awal.
- Memilih stack teknologi untuk aplikasi web SaaS.
- Mengatur autentikasi, penagihan (billing), atau database untuk SaaS.
- Memerlukan checklist peluncuran terstruktur sebelum rilis ke publik.
- Merancang arsitektur aplikasi multi-tenant.
- Melakukan tinjauan teknis (audit) terhadap SaaS tahap awal.

### Panduan Langkah demi Langkah

#### 1. Validasi Sebelum Membangun
Sebelum menulis kode, lakukan validasi ide:
- [ ] Apakah Anda dapat menjelaskan masalah dalam satu kalimat?
- [ ] Siapa target pelanggan yang tepat? (bukan "semua orang")
- [ ] Apa alternatif berbayar yang mereka gunakan saat ini?
- [ ] Apakah Anda sudah berbicara dengan 5+ calon pelanggan?
- [ ] Apakah mereka bersedia membayar sebesar $X/bulan untuk solusi Anda?

*Aturan:* Jika Anda tidak bisa mendapatkan 3 orang yang bersedia melakukan pre-pay atau menandatangani letter of intent, jangan mulai menulis kode terlebih dahulu.

#### 2. Pilih Stack Teknologi Anda
Rekomendasi stack SaaS modern (2026):
- **Frontend**: Next.js 15 + TypeScript (App Router, Server Components).
- **Styling**: Tailwind CSS v4 + shadcn/ui.
- **Backend**: Next.js Server Actions (integrasi DB langsung, type-safe).
- **Database**: PostgreSQL (Supabase atau Neon) dengan RLS.
- **ORM**: Drizzle ORM atau Prisma.
- **Auth**: Clerk atau NextAuth.js (Auth.js).
- **Payments**: Pilihan Stripe, Midtrans (untuk Asia Tenggara/Indonesia), PayPal, Paddle, atau FastSpring (termasuk fitur langganan, customer portal, dan kepatuhan pajak otomatis).
- **Email**: Resend + React Email.
- **Deployment**: Vercel (CI/CD otomatis, edge network).
- **Monitoring**: Sentry + PostHog (crash reporting, user analytics).

#### 3. Database Schema (Multi-tenant SaaS)
Skema database multi-tenant menyediakan struktur relasi antara `User`, `Workspace`, `WorkspaceMember`, dan `Subscription` (lihat acuan kode di bawah).

#### 4. Checklist Peluncuran (Pre-Launch Checklist)
- **Teknis**: Autentikasi bekerja dengan baik, Pembayaran bekerja end-to-end (subscribe, cancel), Pemantauan error terkonfigurasi (Sentry), Database backup aktif, Rate limiting pada API routes, Validasi input dengan Zod pada semua form.
- **Checklist Autentikasi & Auth Provider**:
  - **Clerk**: Pastikan webhook secret dikonfigurasi di produksi untuk sinkronisasi pembuatan/penghapusan user, atur dynamic flags pada `ClerkProvider`, dan kunci middleware agar seluruh endpoint API terproteksi.
  - **NextAuth.js (Auth.js)**: Pastikan `NEXTAUTH_SECRET` diatur dengan nilai acak yang kuat di environment production, adapter session terhubung dengan benar (JWT atau database session), dan atur waktu kedaluwarsa token secara aman.
- **Produk**: Landing page dengan proposisi nilai yang jelas, Halaman harga (pricing) dengan 2-3 tier, Alur onboarding (< 5 menit), Dokumen Terms of Service dan Kebijakan Privasi.
- **Pemasaran**: Domain terkonfigurasi, Tag meta SEO pada semua halaman, Google Analytics/PostHog aktif, Akun media sosial siap.


### Praktik Terbaik & Pemecahan Masalah
- **Iterasi Cepat**: Luncurkan MVP dalam waktu maksimal 4-6 minggu, lalu lakukan iterasi berdasarkan masukan pengguna.
- **Tarik Biaya sejak Hari Ke-1**: Pengguna berbayar memvalidasi keselarasan produk dengan kebutuhan pasar secara nyata.
- **Webhook Stripe**: Gunakan Stripe CLI untuk pengujian webhook lokal: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

---

## Code References / Acuan Kode

### Prisma Schema (`prisma/schema.prisma`)
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

### Drizzle ORM Schema (`lib/db/schema.ts`)
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
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
});
```
