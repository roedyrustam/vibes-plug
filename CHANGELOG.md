# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.5] - 2026-05-24

### Added
- Created a new `bun-runtime-expert` skill module for Bun runtime (v1.3+):
  - Added comprehensive guidance for `Bun.serve()`, `Bun.sql`, and `Bun.s3` APIs.
  - Added modern `bun test` and `bun build` configuration patterns.
  - Included step-by-step Node.js to Bun migration strategies and performance optimization.

## [1.2.4] - 2026-05-24

### Changed
- Updated the `brainstorming` skill with 2026 modern web architecture guidance:
  - Added React Server Components (RSC), Partial Prerendering (PPR), and Islands Architecture as first-class paradigm options.
  - Added Server Actions vs REST vs tRPC vs GraphQL as explicit data mutation strategy decisions.
  - Added AI/LLM integration and infrastructure cost analysis as mandatory non-functional requirement pillars.
  - Upgraded security guidance to include Passkeys, modern CSP headers, and rate limiting.
  - Upgraded accessibility guidance to WCAG 2.2 with focus management and container queries.
  - Updated testing strategy to Vitest + Playwright (replacing Jest/Cypress references).
  - Added structured Design Document output template with 8 sections for consistent handoff.
  - Added "Server-First by Default" as a non-negotiable key principle.

## [1.2.3] - 2026-05-24

### Changed
- Updated the `senior-frontend` skill to target React 19 / Next.js 15 / Tailwind CSS v4:
  - Modernized scaffolder options table: Turbopack, Auth.js/Clerk, TanStack Query v5, Playwright, and Vercel AI SDK.
  - Updated project structure to reflect CSS-first Tailwind v4 config, Server Actions folder, and `next.config.ts`.
  - Replaced `Next.js Optimization` section with `Next.js 15 Optimization` featuring async `params` patterns.
  - Added full `React 19 Patterns` section with `useActionState`, `useOptimistic`, and `useFormStatus` examples.
  - Added Tailwind CSS v4 `@theme` directive example with oklch color space tokens.
  - Added targeted Troubleshooting section for Next.js 15 async params, Tailwind v4 config, and `useFormStatus` gotchas.
  - Updated `nextjs_optimization_guide.md` header to target Next.js 15.

## [1.2.2] - 2026-05-24

### Changed
- Comprehensively updated the `senior-fullstack` skill with professional, production-grade architectural guidance and code:
  - Rewrote the main `SKILL.md` to map out scaffolder, project, and code quality analyzer automated scripting capabilities.
  - Rewrote `tech_stack_guide.md` to feature server-first Next.js 15 routing layout patterns, dynamic parallel loading, database transaction pooler settings (Prisma & Drizzle), and Zod request/response contract validation.
  - Rewrote `architecture_patterns.md` to detail Cache-Aside Redis layers, PostgreSQL compound/partial indexing, and BullMQ background worker thread decoupled queues.
  - Rewrote `development_workflows.md` to integrate automated GitHub Actions CI/CD workflows, Vitest unit tests, Playwright E2E customer flow tests, and multi-stage Docker environment stacks.

## [1.2.1] - 2026-05-24

### Changed
- Updated the `saas-mvp-launcher` skill file with state-of-the-art 2026 patterns:
  - Upgraded to Next.js 15, Tailwind CSS v4, and integrated Server Actions.
  - Added full side-by-side support for Drizzle ORM schemas alongside Prisma schemas.
  - Added robust Next.js App Router Stripe webhook endpoint implementation.
  - Added structured Next.js 15 Server Actions implementation with auth and Zod validation.
  - Added Vercel AI SDK integration example for core AI features in SaaS MVPs.
