---
name: saas-transformer
description: "Transforms regular applications into complete SaaS platforms with multi-tenancy, billing, team management, and feature gating — orchestrating all relevant vibes-plug skills / Mentransformasi aplikasi biasa menjadi platform SaaS lengkap dengan multi-tenancy, billing, manajemen tim, dan feature gating — mengorkestrasi semua skill vibes-plug yang relevan."
author: "Roedy Rustam"
---

# SaaS Transformer

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
The **SaaS Transformer** is a master orchestrator skill that guides the complete transformation of an existing regular application into a fully-featured SaaS platform. Unlike `saas-mvp-launcher` (which builds from scratch) or `saas-multi-tenant` (which only handles data isolation), this skill takes an **already working application** and systematically adds every layer needed to make it a commercial SaaS product.

This skill does NOT replace individual skills — it **coordinates** them into a structured, 8-phase transformation workflow.

### Orchestrated Skills Map

```
┌──────────────────────────────────────────────────────────────────┐
│                     SAAS-TRANSFORMER                              │
│              (Master Orchestrator — 8 Phases)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─── PHASE 1: Discovery & Analysis ─────────────────────────┐  │
│  │  • app-analyzer-optimizer (Audit architecture & codebase)  │  │
│  │  • prd-architect (Generate PRD for SaaS features)         │  │
│  │  • brainstorming (Validate transformation strategy)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 2: Multi-Tenancy Foundation ──────────────────────┐  │
│  │  • saas-multi-tenant (RLS, tenant_id, data isolation)     │  │
│  │  • supabase-migration (Database migrations)               │  │
│  │  • supabase-security-expert (Audit RLS & RBAC)            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 3: Authentication & Authorization ────────────────┐  │
│  │  • fullstack-expert (OAuth 2.0 / OIDC setup)              │  │
│  │  • supabase-security-expert (RBAC, Custom Claims)         │  │
│  │  • firebase-security-expert (if Firebase Auth)            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 4: Billing & Subscription ────────────────────────┐  │
│  │  • saas-mvp-launcher (Stripe integration, pricing tiers)  │  │
│  │  • fullstack-expert (Webhook handling, idempotency)       │  │
│  │  • senior-frontend (Pricing page, customer portal UI)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 5: Workspace & Team Management ───────────────────┐  │
│  │  • saas-multi-tenant (Workspace model, member roles)      │  │
│  │  • senior-frontend (Invite flow, settings UI)             │  │
│  │  • ui-ux-pro-max (Dashboard, onboarding UX)              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 6: SaaS Frontend & Landing ───────────────────────┐  │
│  │  • senior-frontend (App shell, dashboard, settings)       │  │
│  │  • tailwind-expert (Design system, responsive)            │  │
│  │  • seo-aeo-landing-page-writer (Conversion landing page)  │  │
│  │  • seo / seo-geo (SEO & AI search readiness)              │  │
│  │  • hig (Human Interface Guidelines consistency)           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 7: API Layer & Feature Gating ────────────────────┐  │
│  │  • fullstack-expert (API versioning, rate limiting)       │  │
│  │  • scalability-clean-code (Clean arch, SOLID)             │  │
│  │  • senior-fullstack (Usage metering, feature flags)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─── PHASE 8: Production Hardening & Launch ─────────────────┐  │
│  │  • production-ready-hardener (Full 7-phase hardening)      │  │
│  │  • auto-doc-updater (CHANGELOG, BLUEPRINT)                │  │
│  │  • saas-mvp-launcher (Pre-launch checklist)               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Trigger Conditions
Activate this skill when the user:
1. Has an existing application and wants to convert it into a SaaS product.
2. Asks to "add multi-tenancy", "add billing/subscriptions", "make this a SaaS", "add team management", or similar requests that imply SaaS transformation.
3. Wants to add workspace/organization-based isolation to an existing app.
4. Needs to add pricing tiers, usage limits, or feature gating to an existing product.
5. Asks for a "SaaS audit" or "SaaS readiness check" on an existing application.

### Execution Protocol

When this skill is triggered, execute the following **8-phase transformation process in order**. Each phase produces findings and code changes. At the end, compile a **SaaS Transformation Report**.

> **Important:** Before starting, run the `saas_transformation_scanner.py` script to assess the current state of the application and determine which phases need the most work.

---

#### PHASE 1: Discovery & Analysis
**Orchestrates:** `app-analyzer-optimizer`, `prd-architect`, `brainstorming`

**Goal:** Understand the existing application and plan the transformation.

**Steps:**
1. **Audit the existing codebase** using `app-analyzer-optimizer`:
   - Map all database tables/models and their relationships
   - Identify authentication mechanism (if any)
   - List all API endpoints and their access patterns
   - Detect existing payment/billing code (if any)
   - Assess frontend architecture (SSR/CSR/SSG, routing, state management)

2. **Generate a SaaS PRD** using `prd-architect`:
   - Define target customer segments
   - Outline pricing tiers (Free, Pro, Enterprise)
   - List features per tier
   - Define workspace/team structure
   - Establish usage limits per plan

3. **Validate the transformation strategy** using `brainstorming`:
   - Choose tenancy model (shared-schema is default)
   - Decide on auth provider (Clerk, NextAuth, Supabase Auth)
   - Select billing provider (Stripe is default)
   - Plan workspace hierarchy (User → Workspace → Members)

**Deliverable:** SaaS Transformation Plan document.

**Checklist:**
- [ ] All existing database tables mapped
- [ ] All API endpoints documented
- [ ] Auth mechanism identified (or marked as "needs implementation")
- [ ] Target pricing tiers defined (at least Free + 1 paid tier)
- [ ] Tenancy model decided (shared-schema / schema-per-tenant)
- [ ] Auth provider selected
- [ ] Billing provider selected

---

#### PHASE 2: Multi-Tenancy Foundation
**Orchestrates:** `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert`

**Goal:** Add tenant isolation to the database layer.

**Steps:**
1. **Add `tenant_id` (or `workspace_id`) to every data table**:
   - Create migration to add `UUID NOT NULL` column
   - Add `tenant_id` to all composite indexes
   - Backfill existing data with a default tenant ID

2. **Create core SaaS tables**:
   ```sql
   -- Organizations / Workspaces
   CREATE TABLE workspaces (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     slug TEXT NOT NULL UNIQUE,
     plan TEXT NOT NULL DEFAULT 'free',
     owner_id UUID NOT NULL REFERENCES auth.users(id),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   -- Workspace Memberships
   CREATE TABLE workspace_members (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member, viewer
     invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     accepted_at TIMESTAMPTZ,
     UNIQUE(workspace_id, user_id)
   );

   -- Workspace Invitations
   CREATE TABLE workspace_invitations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     role TEXT NOT NULL DEFAULT 'member',
     token TEXT NOT NULL UNIQUE,
     invited_by UUID NOT NULL REFERENCES auth.users(id),
     expires_at TIMESTAMPTZ NOT NULL,
     accepted_at TIMESTAMPTZ,
     UNIQUE(workspace_id, email)
   );
   ```

3. **Configure Row-Level Security (RLS)**:
   - Enable RLS on ALL tenant-scoped tables
   - Create policies using `current_setting('app.current_tenant_id')`
   - Workspace members can only access their workspace's data
   - Cross-tenant admin access uses dedicated bypass role

4. **Build tenant-aware middleware**:
   - Extract workspace context from URL path, subdomain, or session
   - Set `tenant_id` on each database connection in a transaction
   - Reset context on connection cleanup

**Checklist:**
- [ ] `tenant_id` / `workspace_id` column added to ALL data tables
- [ ] Core SaaS tables created (workspaces, workspace_members, workspace_invitations)
- [ ] RLS enabled and policies created on ALL tenant-scoped tables
- [ ] Tenant-aware middleware implemented
- [ ] ORM queries automatically scoped to current tenant
- [ ] Existing data backfilled with default tenant
- [ ] Cross-tenant admin bypass configured
- [ ] Migration tested with rollback

---

#### PHASE 3: Authentication & Authorization
**Orchestrates:** `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`

**Goal:** Implement production-grade auth with role-based access.

**Steps:**
1. **Set up authentication provider**:
   - **Supabase Auth**: Enable email/password + OAuth providers (Google, GitHub)
   - **Clerk**: Install SDK, configure middleware, set up webhooks
   - **NextAuth (Auth.js)**: Configure providers, session strategy, JWT callbacks

2. **Implement RBAC (Role-Based Access Control)**:
   - Define roles: `owner`, `admin`, `member`, `viewer`
   - Store roles in `workspace_members.role`
   - Create authorization middleware that checks role before every action
   - Permission matrix:

   | Action | Owner | Admin | Member | Viewer |
   |--------|-------|-------|--------|--------|
   | View data | ✅ | ✅ | ✅ | ✅ |
   | Create/Edit data | ✅ | ✅ | ✅ | ❌ |
   | Manage members | ✅ | ✅ | ❌ | ❌ |
   | Billing & Plan | ✅ | ❌ | ❌ | ❌ |
   | Delete workspace | ✅ | ❌ | ❌ | ❌ |

3. **Add JWT custom claims** for efficient authorization:
   - Include `workspace_id` and `role` in JWT
   - Use claims in RLS policies instead of additional queries

**Checklist:**
- [ ] Auth provider configured with email + at least 1 OAuth provider
- [ ] Login, signup, logout, and password reset flows working
- [ ] RBAC roles defined (owner, admin, member, viewer)
- [ ] Authorization middleware protects all routes/endpoints
- [ ] JWT custom claims include workspace_id and role
- [ ] Session management secure (HTTPOnly cookies, SameSite, Secure)
- [ ] Password policy enforced (min length, complexity)
- [ ] Rate limiting on auth endpoints (login, signup, password reset)

---

#### PHASE 4: Billing & Subscription
**Orchestrates:** `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`

**Goal:** Integrate payment processing and subscription management.

**Steps:**
1. **Define pricing tiers**:
   ```
   FREE:       $0/mo  — Limited features, usage limits
   PRO:        $29/mo — Full features, higher limits
   ENTERPRISE: $99/mo — Unlimited, priority support, SSO
   ```

2. **Create subscription tables**:
   ```sql
   CREATE TABLE subscriptions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id),
     stripe_customer_id TEXT NOT NULL UNIQUE,
     stripe_subscription_id TEXT UNIQUE,
     stripe_price_id TEXT,
     status TEXT NOT NULL DEFAULT 'trialing',
     -- active, trialing, past_due, canceled, unpaid
     trial_ends_at TIMESTAMPTZ,
     current_period_start TIMESTAMPTZ,
     current_period_end TIMESTAMPTZ,
     cancel_at_period_end BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   CREATE TABLE usage_records (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id UUID NOT NULL REFERENCES workspaces(id),
     metric TEXT NOT NULL, -- 'api_calls', 'storage_bytes', 'members'
     quantity BIGINT NOT NULL DEFAULT 0,
     period_start TIMESTAMPTZ NOT NULL,
     period_end TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ```

3. **Integrate Payment Provider**:
   - Select provider based on target market/tax requirements (Stripe, Midtrans, PayPal, Paddle, FastSpring).
   - Create products and pricing plans in the provider dashboard.
   - Implement checkout flow (hosted checkout session, inline widget, or payment link).
   - Handle webhooks with signature verification, payloads, and idempotency (see [billing_integration_guide.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/billing_integration_guide.md)).
   - Build customer portal or self-service billing page for plan updates/cancellations.

4. **Implement trial management**:
   - 14-day free trial on signup (configurable)
   - Trial expiry notifications (7 days, 3 days, 1 day before)
   - Graceful downgrade to free plan after trial expires

**Checklist:**
- [ ] Pricing tiers defined with Stripe products/prices
- [ ] Subscription table created with proper schema
- [ ] Stripe Checkout integration working (subscribe flow)
- [ ] All critical webhooks handled with idempotency
- [ ] Webhook signatures verified on every request
- [ ] Customer portal accessible (manage subscription, invoices)
- [ ] Trial period implemented with expiry notifications
- [ ] Plan changes (upgrade/downgrade) handled correctly
- [ ] Dunning management for failed payments
- [ ] Usage metering table ready for feature gating (Phase 7)

---

#### PHASE 5: Workspace & Team Management
**Orchestrates:** `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max`

**Goal:** Build workspace creation, team invitations, and settings management.

**Steps:**
1. **Workspace lifecycle**:
   - Create workspace on signup (auto-create personal workspace)
   - Workspace settings page (name, slug, logo, timezone)
   - Workspace deletion with cascading cleanup (data, members, subscription)
   - Workspace switching UI (dropdown in navbar)

2. **Team invitation system**:
   - Invite by email with unique token link
   - Invitation expiry (7 days default)
   - Accept/decline flow for invitees
   - Re-invite and cancel invitation
   - Role assignment during invitation
   - Limit team size by plan (Free: 1, Pro: 10, Enterprise: unlimited)

3. **Member management**:
   - List all members with roles
   - Change member roles (only owner/admin can)
   - Remove members (with confirmation)
   - Transfer ownership
   - Activity log of member changes

4. **Onboarding flow**:
   - First-time user onboarding wizard (< 5 minutes to first value)
   - Workspace setup guide
   - Template selection (if applicable)
   - Feature tour / interactive walkthrough

**Checklist:**
- [ ] Workspace CRUD operations working
- [ ] Workspace switching UI in navbar
- [ ] Email invitation with unique token link
- [ ] Invitation accept/decline flow
- [ ] Member role management (view, change, remove)
- [ ] Ownership transfer mechanism
- [ ] Team size limits enforced by plan
- [ ] Onboarding wizard for first-time users
- [ ] Workspace settings page (name, slug, logo)
- [ ] Cascading deletion handles all workspace data

---

#### PHASE 6: SaaS Frontend & Landing
**Orchestrates:** `senior-frontend`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo`, `seo-geo`, `hig`

**Goal:** Build the SaaS frontend: app shell, dashboard, and marketing pages.

**Steps:**
1. **App shell / Layout**:
   - Authenticated layout with sidebar navigation
   - Workspace context in header (workspace name, switcher)
   - User menu (profile, settings, logout)
   - Responsive layout (collapsible sidebar on mobile)
   - Breadcrumb navigation

2. **Dashboard**:
   - Overview with key metrics (usage, team size, plan status)
   - Quick actions (invite member, upgrade plan, etc.)
   - Recent activity feed
   - Usage visualization (charts)

3. **Settings pages**:
   - Account settings (profile, email, password, 2FA)
   - Workspace settings (name, slug, logo)
   - Team settings (members, invitations, roles)
   - Billing settings (plan, payment method, invoices)
   - API settings (keys, webhooks, if applicable)

4. **Marketing / Landing page**:
   - Hero section with clear value proposition
   - Feature grid with plan comparison
   - Pricing table (Free / Pro / Enterprise)
   - Social proof (testimonials, logos, stats)
   - FAQ section
   - CTA to signup / start free trial
   - SEO optimized (meta tags, structured data, sitemap)
   - AI search ready (semantic HTML, llms.txt)

**Checklist:**
- [ ] App shell with sidebar, header, workspace switcher
- [ ] Dashboard with key metrics and usage charts
- [ ] Account settings page
- [ ] Workspace settings page
- [ ] Team management page
- [ ] Billing / Subscription management page
- [ ] Landing page with pricing and social proof
- [ ] Mobile-responsive design (320px+)
- [ ] SEO meta tags on all pages
- [ ] Structured data (Schema.org Product/SoftwareApplication)
- [ ] Consistent design system (colors, typography, spacing)

---

#### PHASE 7: API Layer & Feature Gating
**Orchestrates:** `fullstack-expert`, `scalability-clean-code`, `senior-fullstack`

**Goal:** Add API versioning, rate limiting, and plan-based feature restrictions.

**Steps:**
1. **API versioning**:
   - URL-based versioning (`/api/v1/...`)
   - Versioned API routes with backward compatibility
   - API documentation (OpenAPI spec or similar)

2. **Rate limiting per plan**:
   ```
   FREE:       100 requests / minute
   PRO:        1,000 requests / minute
   ENTERPRISE: 10,000 requests / minute
   ```
   - Token bucket or sliding window algorithm
   - Return `429 Too Many Requests` with `Retry-After` header
   - Rate limit headers on every response (`X-RateLimit-Limit`, `X-RateLimit-Remaining`)

3. **Feature gating**:
   - Define features per plan in a configuration map:
     ```typescript
     const PLAN_LIMITS = {
       free:       { members: 1,   storage_gb: 1,  api_calls_daily: 100,   features: ['basic'] },
       pro:        { members: 10,  storage_gb: 50, api_calls_daily: 10000, features: ['basic', 'advanced', 'export', 'integrations'] },
       enterprise: { members: -1,  storage_gb: -1, api_calls_daily: -1,    features: ['basic', 'advanced', 'export', 'integrations', 'sso', 'audit_log', 'custom_branding'] },
     };
     ```
   - Middleware that checks plan limits before executing actions
   - Graceful degradation when limits reached (show upgrade prompt, not errors)
   - Usage metering: track API calls, storage, members, and other billable metrics

4. **Usage tracking & enforcement**:
   - Increment usage counters on each tracked action
   - Daily/monthly usage reset based on billing cycle
   - Usage dashboard for workspace admins
   - Warning notifications at 80% and 100% of limits
   - Hard limits prevent exceeding (with upgrade CTA)

**Checklist:**
- [ ] API versioning implemented (/api/v1/)
- [ ] Rate limiting configured per plan
- [ ] Rate limit headers on every API response
- [ ] Feature flags/gating system operational
- [ ] Plan limits configuration map defined
- [ ] Feature-check middleware on gated routes
- [ ] Upgrade prompt when limits reached (not error pages)
- [ ] Usage metering tracking API calls, storage, members
- [ ] Usage reset aligned with billing cycle
- [ ] Usage dashboard visible to workspace admins
- [ ] Warning notifications at 80% and 100% usage

---

#### PHASE 8: Production Hardening & Launch
**Orchestrates:** `production-ready-hardener`, `auto-doc-updater`, `saas-mvp-launcher`

**Goal:** Harden the transformed application for production and prepare for launch.

**Steps:**
1. **Delegate to `production-ready-hardener`**:
   - Run the full 7-phase production hardening audit
   - Fix all critical and high-severity findings
   - Target overall readiness score ≥ 85

2. **SaaS-specific hardening**:
   - [ ] Stripe webhook endpoint has signature verification
   - [ ] All tenant-scoped queries are verified (no cross-tenant leaks)
   - [ ] Subscription status is checked before accessing paid features
   - [ ] Rate limiter is deployed and tested under load
   - [ ] Feature flags are tested for each plan tier
   - [ ] Invitation tokens are cryptographically random and expire
   - [ ] Workspace deletion cascades correctly (no orphaned data)
   - [ ] Billing edge cases handled (double charges, race conditions)

3. **Pre-launch checklist** (extends `saas-mvp-launcher`):
   - [ ] Landing page live with pricing
   - [ ] Stripe in live mode (not test mode)
   - [ ] Transactional emails configured (welcome, invoice, trial expiry)
   - [ ] Legal pages ready (Terms of Service, Privacy Policy, Cookie Policy)
   - [ ] Support channel set up (Intercom, Crisp, email)
   - [ ] Error monitoring active (Sentry)
   - [ ] Analytics active (PostHog / Mixpanel / GA4)
   - [ ] Database backups verified
   - [ ] Status page configured (Betterstack, Instatus)

4. **Update documentation** via `auto-doc-updater`:
   - CHANGELOG.md with SaaS transformation entries
   - BLUEPRINT.md with new architecture diagram
   - README.md with setup instructions for new SaaS features

**Checklist:**
- [ ] Production-ready-hardener audit score ≥ 85
- [ ] All critical security findings resolved
- [ ] Stripe live mode configured and tested
- [ ] Transactional emails working (welcome, invoice, trial)
- [ ] Legal pages published (ToS, Privacy Policy)
- [ ] Error monitoring and analytics active
- [ ] Database backup strategy verified
- [ ] Documentation updated (CHANGELOG, BLUEPRINT, README)
- [ ] Pre-launch checklist 100% complete

---

### SaaS Transformation Report Format

After completing all 8 phases, compile a **SaaS Transformation Report**:

```markdown
# SaaS Transformation Report

## Executive Summary
Overall transformation completeness (0-100%) with readiness grade (A/B/C/D/F).
Brief description of what was transformed.

## Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Tenancy | Single-tenant | Multi-tenant (shared-schema, RLS) |
| Auth | [None/Basic] | OAuth 2.0 + RBAC (4 roles) |
| Billing | None | Stripe (Free/Pro/Enterprise) |
| Teams | None | Workspace-based (invite, roles) |
| Feature Gating | None | Plan-based limits + usage metering |
| API | [Unversioned] | Versioned (/v1/) + rate limited |
| Landing Page | None | SEO-optimized with pricing |

## Phase Scores
| Phase | Score | Status |
|-------|-------|--------|
| 1. Discovery & Analysis | XX/100 | ✅/⚠️/🔴 |
| 2. Multi-Tenancy Foundation | XX/100 | ✅/⚠️/🔴 |
| 3. Authentication & Authorization | XX/100 | ✅/⚠️/🔴 |
| 4. Billing & Subscription | XX/100 | ✅/⚠️/🔴 |
| 5. Workspace & Team Management | XX/100 | ✅/⚠️/🔴 |
| 6. SaaS Frontend & Landing | XX/100 | ✅/⚠️/🔴 |
| 7. API Layer & Feature Gating | XX/100 | ✅/⚠️/🔴 |
| 8. Production Hardening | XX/100 | ✅/⚠️/🔴 |

## 🔴 Remaining Issues
List of items that still need attention.

## 📋 Recommended Next Steps
Prioritized action items for post-launch iteration.
```

### Scoring Methodology

Each phase is scored 0-100 based on checklist completion:
- **95-100**: Complete ✅
- **80-94**: Mostly complete, minor gaps ⚠️
- **60-79**: Significant items missing 🟡
- **Below 60**: Phase not implemented 🔴

**Overall Score** = Weighted average:
- Discovery (5%) + Multi-Tenancy (**20%**) + Auth (15%) + Billing (**20%**) + Teams (10%) + Frontend (10%) + API & Gating (10%) + Production (10%)

> **Note:** Multi-Tenancy and Billing are weighted highest because they are the core differentiators between a regular app and a SaaS product. A SaaS without proper tenant isolation or billing is not a SaaS.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
**SaaS Transformer** adalah skill orkestrator utama yang memandu transformasi lengkap aplikasi biasa menjadi platform SaaS berfitur lengkap. Berbeda dengan `saas-mvp-launcher` (yang membangun dari nol) atau `saas-multi-tenant` (yang hanya menangani isolasi data), skill ini mengambil **aplikasi yang sudah berjalan** dan secara sistematis menambahkan setiap lapisan yang diperlukan untuk menjadikannya produk SaaS komersial.

Skill ini TIDAK menggantikan skill individual — ia **mengoordinasikan** mereka ke dalam alur kerja transformasi terstruktur 8 fase.

### Peta Skill yang Diorkestrasi

| Fase | Skill yang Digunakan | Fokus |
|------|---------------------|-------|
| 1. Discovery & Analisis | `app-analyzer-optimizer`, `prd-architect`, `brainstorming` | Audit codebase, PRD, strategi transformasi |
| 2. Fondasi Multi-Tenancy | `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert` | tenant_id, RLS, isolasi data |
| 3. Autentikasi & Otorisasi | `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert` | OAuth/OIDC, RBAC, JWT claims |
| 4. Billing & Langganan | `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend` | Stripe, pricing, webhook, dunning |
| 5. Workspace & Tim | `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max` | Invite, roles, onboarding |
| 6. Frontend SaaS & Landing | `senior-frontend`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo`, `hig` | App shell, dashboard, marketing |
| 7. API & Feature Gating | `fullstack-expert`, `scalability-clean-code`, `senior-fullstack` | Versioning, rate limit, usage metering |
| 8. Pengerasan & Peluncuran | `production-ready-hardener`, `auto-doc-updater`, `saas-mvp-launcher` | Audit produksi, checklist, dokumentasi |

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna:
1. Memiliki aplikasi yang sudah ada dan ingin mengkonversinya menjadi produk SaaS.
2. Meminta untuk "menambahkan multi-tenancy", "menambahkan billing/langganan", "jadikan ini SaaS", "tambahkan manajemen tim", atau permintaan serupa.
3. Ingin menambahkan isolasi berbasis workspace/organisasi ke aplikasi yang sudah ada.
4. Perlu menambahkan tier harga, batas penggunaan, atau pembatasan fitur ke produk yang sudah ada.
5. Meminta "audit SaaS" atau "pemeriksaan kesiapan SaaS" pada aplikasi yang sudah ada.

### Protokol Eksekusi

Ketika skill ini dipicu, jalankan **8 fase transformasi secara berurutan**. Setiap fase menghasilkan temuan dan perubahan kode. Di akhir, compile sebuah **Laporan Transformasi SaaS**.

> **Penting:** Sebelum memulai, jalankan script `saas_transformation_scanner.py` untuk menilai kondisi aplikasi saat ini dan menentukan fase mana yang membutuhkan paling banyak pekerjaan.

---

#### FASE 1: Discovery & Analisis
**Mengorkestrasi:** `app-analyzer-optimizer`, `prd-architect`, `brainstorming`

- [ ] Semua tabel/model database dipetakan
- [ ] Semua endpoint API didokumentasikan
- [ ] Mekanisme autentikasi diidentifikasi
- [ ] Tier harga target ditentukan (minimal Free + 1 berbayar)
- [ ] Model tenancy diputuskan
- [ ] Provider autentikasi dipilih
- [ ] Provider billing dipilih

#### FASE 2: Fondasi Multi-Tenancy
**Mengorkestrasi:** `saas-multi-tenant`, `supabase-migration`, `supabase-security-expert`

- [ ] Kolom `tenant_id` / `workspace_id` ditambahkan ke SEMUA tabel data
- [ ] Tabel inti SaaS dibuat (workspaces, workspace_members, workspace_invitations)
- [ ] RLS diaktifkan dan policy dibuat di SEMUA tabel bertingkat tenant
- [ ] Middleware tenant-aware diimplementasikan
- [ ] Query ORM secara otomatis dibatasi ke tenant saat ini
- [ ] Data existing di-backfill dengan tenant default
- [ ] Bypass admin lintas tenant dikonfigurasi
- [ ] Migrasi diuji dengan rollback

#### FASE 3: Autentikasi & Otorisasi
**Mengorkestrasi:** `fullstack-expert`, `supabase-security-expert`, `firebase-security-expert`

- [ ] Provider auth dikonfigurasi (email + minimal 1 OAuth)
- [ ] Flow login, signup, logout, reset password berfungsi
- [ ] Role RBAC didefinisikan (owner, admin, member, viewer)
- [ ] Middleware otorisasi melindungi semua route/endpoint
- [ ] JWT custom claims mencakup workspace_id dan role
- [ ] Manajemen sesi aman (HTTPOnly, SameSite, Secure)
- [ ] Rate limiting pada endpoint auth

#### FASE 4: Billing & Langganan
**Mengorkestrasi:** `saas-mvp-launcher`, `fullstack-expert`, `senior-frontend`

- [ ] Tier harga didefinisikan dengan produk/harga pada dashboard provider pembayaran (Stripe, Midtrans, PayPal, Paddle, FastSpring)
- [ ] Tabel subscription dibuat dengan schema multi-gateway
- [ ] Integrasi Checkout (hosted session/widget) berfungsi
- [ ] Semua webhook kritis ditangani dengan idempotency (lihat [billing_integration_guide.md](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/billing_integration_guide.md))
- [ ] Tanda tangan/signature webhook diverifikasi pada setiap request
- [ ] Customer billing portal dapat diakses
- [ ] Periode trial diimplementasikan dengan notifikasi expiry
- [ ] Perubahan plan (upgrade/downgrade) ditangani secara aman
- [ ] Penanganan pembayaran gagal (dunning management) dikonfigurasi

#### FASE 5: Workspace & Manajemen Tim
**Mengorkestrasi:** `saas-multi-tenant`, `senior-frontend`, `ui-ux-pro-max`

- [ ] Operasi CRUD workspace berfungsi
- [ ] UI workspace switching di navbar
- [ ] Undangan email dengan link token unik
- [ ] Flow terima/tolak undangan
- [ ] Manajemen role anggota (lihat, ubah, hapus)
- [ ] Mekanisme transfer kepemilikan
- [ ] Batas ukuran tim berdasarkan plan
- [ ] Wizard onboarding untuk pengguna baru
- [ ] Halaman pengaturan workspace

#### FASE 6: Frontend SaaS & Landing
**Mengorkestrasi:** `senior-frontend`, `tailwind-expert`, `seo-aeo-landing-page-writer`, `seo`, `hig`

- [ ] App shell dengan sidebar, header, workspace switcher
- [ ] Dashboard dengan metrik dan grafik penggunaan
- [ ] Halaman pengaturan akun, workspace, tim, billing
- [ ] Landing page dengan pricing dan social proof
- [ ] Desain mobile-responsive (320px+)
- [ ] SEO meta tags di semua halaman
- [ ] Structured data (Schema.org)
- [ ] Design system konsisten

#### FASE 7: API & Feature Gating
**Mengorkestrasi:** `fullstack-expert`, `scalability-clean-code`, `senior-fullstack`

- [ ] API versioning diimplementasikan (/api/v1/)
- [ ] Rate limiting dikonfigurasi per plan
- [ ] Sistem feature flags/gating operasional
- [ ] Peta konfigurasi batas plan didefinisikan
- [ ] Middleware pengecekan fitur pada route yang dibatasi
- [ ] Prompt upgrade saat batas tercapai
- [ ] Usage metering melacak API calls, storage, members
- [ ] Dashboard penggunaan terlihat oleh admin workspace

#### FASE 8: Pengerasan Produksi & Peluncuran
**Mengorkestrasi:** `production-ready-hardener`, `auto-doc-updater`, `saas-mvp-launcher`

- [ ] Skor audit production-ready-hardener ≥ 85
- [ ] Semua temuan keamanan kritis diselesaikan
- [ ] Stripe mode live dikonfigurasi dan diuji
- [ ] Email transaksional berfungsi
- [ ] Halaman legal diterbitkan (ToS, Privacy Policy)
- [ ] Monitoring error dan analytics aktif
- [ ] Strategi backup database diverifikasi
- [ ] Dokumentasi diperbarui (CHANGELOG, BLUEPRINT, README)

---

### Metodologi Penilaian

Setiap fase dinilai 0-100 berdasarkan penyelesaian checklist:
- **95-100**: Selesai ✅
- **80-94**: Hampir selesai, gap minor ⚠️
- **60-79**: Item signifikan hilang 🟡
- **Di bawah 60**: Fase belum diimplementasikan 🔴

**Skor Keseluruhan** = Rata-rata berbobot:
- Discovery (5%) + Multi-Tenancy (**20%**) + Auth (15%) + Billing (**20%**) + Teams (10%) + Frontend (10%) + API & Gating (10%) + Produksi (10%)

> **Catatan:** Multi-Tenancy dan Billing diberi bobot tertinggi karena keduanya adalah pembeda inti antara aplikasi biasa dan produk SaaS. SaaS tanpa isolasi tenant atau billing yang tepat bukanlah SaaS.

### Referensi Dokumentasi
- [SaaS Transformation Checklist](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/saas_transformation_checklist.md)
- [Billing Integration Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/billing_integration_guide.md)
- [Feature Gating Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/saas-transformer/references/feature_gating_patterns.md)
