---
name: senior-fullstack
description: "Complete toolkit for senior fullstack with modern tools and best practices."
author: "Roedy Rustam"
github: "https://github.com/roedyrustam/vibes-plug"
risk: critical
source: community
date_added: "2026-02-27"
---

# Senior Fullstack

A comprehensive blueprint and toolkit for senior fullstack engineers, covering production-grade architecture, database optimization, advanced state management, micro-interactions, robust CI/CD, and system security.

## Quick Start

### Main Capabilities

This skill provides three core capabilities supported by automated pipeline scripts inside `scripts/`:

```bash
# Script 1: Scaffold a production-grade fullstack workspace
python scripts/fullstack_scaffolder.py <project-path> [options]

# Script 2: Analyze codebase for performance bottlenecks and ORM anti-patterns
python scripts/project_scaffolder.py <target-path> [--verbose]

# Script 3: Perform advanced code quality, security header, and CSP validations
python scripts/code_quality_analyzer.py [arguments] [options]
```

---

## Core Capabilities

### 1. Fullstack Scaffolder
Automated scaffolder that spins up highly structured workspaces with absolute consistency:
- **Zero-Config Structure**: Enforces robust, modular directory trees (Next.js App Router, modular API routes).
- **Embedded Security Defaults**: Generates standard security headers, CSP configs, and strict env-var checking.
- **ORM Scaffolding**: Proactively sets up Drizzle and Prisma database clients with automatic migration folders.

### 2. Project Scaffolder
Performs static analysis on active fullstack codebases to flag scaling risks:
- Identifies N+1 query patterns in prisma/drizzle statements.
- Scans react client bundle sizes and flags non-dynamic component imports.
- Recommends indexing strategies for tables showing high load profiles.

### 3. Code Quality Analyzer
Automated linter and formatter validation pipeline script:
- Verifies comprehensive test coverage criteria are satisfied.
- Flags insecure CORS policies (`Access-Control-Allow-Origin: *` in production).
- Checks for hardcoded secrets and credentials.

---

## Reference Documentation

### [Tech Stack Guide](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/tech_stack_guide.md)
Detailed patterns and production guides:
- React 19 & Next.js 15 Server-First Architectures.
- Type-Safe Contracts via API Routes and Server Actions.
- Connection Pooling and High-Concurrency Postgres scaling.

### [Architecture Patterns](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/architecture_patterns.md)
Advanced architectural solutions:
- High-Performance Caching Layer using Redis.
- Relational Database Partitioning & Advanced Indexing.
- Event-Driven Webhooks & Resilient Background Workers.

### [Development Workflows](file:///c:/Users/roedy/.gemini/config/plugins/vibes-plug/skills/senior-fullstack/references/development_workflows.md)
Automation and operational pipelines:
- Automated CI/CD (GitHub Actions) with test orchestration.
- High-Fidelity Test Matrix (Vitest Unit tests + Playwright E2E tests).
- Production-Grade Docker/Kubernetes deployments.

---

## Modern Tech Stack (2026)

- **Languages:** TypeScript, JavaScript, SQL, Python, Go
- **Frontend Frameworks:** React 19, Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui
- **State Management & Fetching:** TanStack Query (React Query) v5, React Server Actions, Zustand
- **Database & ORMs:** PostgreSQL, Drizzle ORM, Prisma, Redis, Supabase, Neon
- **Operations & Security:** Docker, GitHub Actions, AWS/Vercel, Sentry, Snyk

---

## Senior Core Best Practices

### Code Quality & Typings
- ✅ Enforce `strict: true` in `tsconfig.json` and avoid using `any` typings.
- ✅ Structure components using React Server Components (RSC) by default; only use `'use client'` at leaf nodes.
- ✅ Enforce comprehensive runtime schema validation with Zod for all API request payloads.

### Database Scaling
- ✅ Always use database connection pooling (e.g. Supabase Supavisor or Neon serverless connection poolers).
- ✅ Add indexes on columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses; continuously profile query times with `EXPLAIN ANALYZE`.
- ✅ Enforce Row-Level Security (RLS) policies on all tables holding tenant-specific details.

### Security
- ✅ Enforce secure security headers (e.g. strict Content Security Policy, HSTS, X-Content-Type-Options).
- ✅ Validate and sanitize all external webhooks (e.g. verify Stripe webhook signatures before updating database rows).
- ✅ Implement aggressive rate limiting on public endpoints to mitigate DDoS and brute-force risks.

---

## Troubleshooting

**Problem:** Hydration mismatch errors in Next.js 15  
**Solution:** Avoid using client-only browser state (e.g., `window.localStorage` or system timestamps) during the initial React render. Wrap unstable blocks in `useEffect` or utilize `next/dynamic` with `{ ssr: false }`.

**Problem:** PostgreSQL connection spikes under peak serverless invocation  
**Solution:** Reduce maximum pool sizes in your connection string and utilize a transaction connection pooler (e.g., pgBouncer / Supavisor) with a `pool_mode=transaction` suffix.

**Problem:** Stale UI data after running Next.js Server Actions  
**Solution:** Call `revalidatePath()` or `revalidateTag()` inside the Server Action immediately after database transactions succeed to purge Next.js's router and data caches.

---

## Limitations
- This skill must only be utilized for high-performance multi-tier software projects.
- Avoid using custom server solutions (e.g., custom Express server on Next.js) unless explicitly requested; use native Next.js server routing for optimal Vercel deployment.
- When running code quality or scaffolding scripts, always verify file access permissions before initiating massive system writes.
