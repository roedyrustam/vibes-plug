---
name: saas-mvp-launcher
description: "Structured roadmap and design to plan and launch a SaaS MVP from scratch / Panduan terstruktur untuk merencanakan dan meluncurkan SaaS MVP dari nol."
author: "vibes-plug-swarm"
---

# SaaS MVP Launcher

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

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

#### 3. Architecture & Database Schema
- **Architecture (`multiple-entry-points`)**: Apply the `multiple-entry-points` pattern to logically separate the public landing page, the authenticated tenant dashboard, and the administrative backend. This ensures the public site loads blazingly fast without bootstrapping heavy application logic.
  - **Super Admin Dashboard**: A critical requirement for application management. The Super Admin panel must be explicitly separated and deployed on a dedicated subdomain (e.g., `admin.example.com`). This isolates administrative capabilities (user moderation, global metrics, tenant management) from the main application.
- **Schema (Multi-tenant SaaS)**: Choose between **Shared Schema** (tenant_id on every table, simpler) or **Isolated Schema** (schema-per-tenant, stricter isolation). Please refer to the code examples below for Shared Schema database configurations in Prisma and Drizzle. Ensure the User schema includes a role or flag (e.g., `isSuperAdmin`) to restrict access to the admin subdomain.

#### 4. Pre-Launch Checklist
- **Technical**: Authentication works, Payments work end-to-end, Error monitoring configured (Sentry), Database backups active, Rate limiting on API routes, Input validation with Zod.
- **Session Management Optimization**: Use Edge-compatible JWTs combined with Redis (e.g., Upstash) for high-performance session validation. Avoid blocking relational database queries on every authenticated request.
- **Authentication & Auth Provider Checklist**:
  - **Clerk**: Ensure webhook secrets are configured in production to sync user creations/deletions, set `ClerkProvider` dynamic flags, and lock down middleware matching routes so API folders are protected.
  - **NextAuth.js (Auth.js)**: Verify `NEXTAUTH_SECRET` is set with a strong generated value, session driver is correctly configured (JWT or database sessions), and token expiration rules are set appropriately.
- **Product**: Landing page with clear value prop, Pricing page with 2-3 tiers, Onboarding flow (< 5 minutes to first value), ToS and Privacy Policy, **Super Admin Dashboard** deployed on a subdomain for app management.
- **Marketing**: Domain configured, SEO meta tags on all pages, Analytics active.


### Best Practices & Troubleshooting
- **Build Fast**: Ship a working MVP in 4-6 weeks maximum, then iterate based on feedback.
- **Charge from Day 1**: Paying users validate product-market fit.
- **Stripe Webhooks**: Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

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

#### 3. Arsitektur & Database Schema
- **Arsitektur (`multiple-entry-points`)**: Terapkan pola `multiple-entry-points` untuk memisahkan secara logis halaman *landing page* publik, *dashboard* tenant yang diautentikasi, dan *backend* administratif. Ini memastikan situs publik memuat dengan sangat cepat tanpa memuat logika aplikasi yang berat.
  - **Dashboard Super Admin**: Fitur wajib untuk manajemen aplikasi. Panel Super Admin harus dipisahkan secara eksplisit dan di-deploy pada subdomain khusus (contoh: `admin.example.com`). Hal ini mengisolasi akses administratif (moderasi user, metrik sistem, manajemen tenant) dari aplikasi utama.
- **Schema (Multi-tenant SaaS)**: Pilih antara **Shared Schema** (tenant_id di setiap tabel, lebih sederhana) atau **Isolated Schema** (schema-per-tenant, isolasi lebih ketat). Skema database multi-tenant Shared Schema menyediakan struktur relasi antara `User`, `Workspace`, `WorkspaceMember`, dan `Subscription` (lihat acuan kode di bawah). Pastikan skema User memiliki flag atau role (contoh: `isSuperAdmin`) untuk membatasi akses ke subdomain admin.

#### 4. Checklist Peluncuran (Pre-Launch Checklist)
- **Teknis**: Autentikasi bekerja dengan baik, Pembayaran bekerja end-to-end (subscribe, cancel), Pemantauan error terkonfigurasi (Sentry), Database backup aktif, Rate limiting pada API routes, Validasi input dengan Zod pada semua form.
- **Optimasi Session Management**: Gunakan JWT (Edge-compatible) yang dikombinasikan dengan Redis (contoh: Upstash) untuk validasi sesi berkinerja tinggi. Hindari query database relasional yang memblokir pada setiap request yang terautentikasi.
- **Checklist Autentikasi & Auth Provider**:
  - **Clerk**: Pastikan webhook secret dikonfigurasi di produksi untuk sinkronisasi pembuatan/penghapusan user, atur dynamic flags pada `ClerkProvider`, dan kunci middleware agar seluruh endpoint API terproteksi.
  - **NextAuth.js (Auth.js)**: Pastikan `NEXTAUTH_SECRET` diatur dengan nilai acak yang kuat di environment production, adapter session terhubung dengan benar (JWT atau database session), dan atur waktu kedaluwarsa token secara aman.
- **Produk**: Landing page dengan proposisi nilai yang jelas, Halaman harga (pricing) dengan 2-3 tier, Alur onboarding (< 5 menit), Dokumen Terms of Service dan Kebijakan Privasi, **Dashboard Super Admin** yang di-deploy di subdomain untuk manajemen aplikasi.
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
  isSuperAdmin  Boolean   @default(false)
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
import { pgTable, text, timestamp, pgEnum, unique, boolean } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['FREE', 'PRO', 'ENTERPRISE']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
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

---
### 🎨 Automatic Visual Assets Generation Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, scaffolding a project, or finalizing the initial UI/UX, you MUST automatically use the `generate_image` tool to create a custom logo that perfectly matches the application's core concept and aesthetic. 
This generated image MUST be explicitly used as:
1. The primary application logo (e.g., in the header/navbar).
2. The website favicon (`favicon.ico` or equivalent).
3. The Open Graph (OG) image for SEO metadata (`og:image`).

Do not use placeholders for these assets. Generate and integrate them automatically.

---
### 📄 Standard Pages Mandate (CRITICAL)
**MANDATORY**: Whenever you are building a new application, landing page, or website, you MUST automatically create the following standard pages:
1. **About Page** (`/about`)
2. **Profile Page** (`/profile`)
3. **Contact Page** (`/contact`)
4. **Terms of Reference / Terms of Service** (`/terms`)
5. **Privacy Policy** (`/privacy-policy`)

These pages must be generated with standard boilerplate content that can later be customized to fit the specific application. Do not wait for the user to ask for them; they are a strict requirement for all web projects. / **WAJIB**: Otomatis buatkan halaman standar (About, Profile, Contact, Terms, Privacy Policy) pada setiap pembuatan aplikasi/website baru dengan konten boilerplate yang bisa disesuaikan nanti.
