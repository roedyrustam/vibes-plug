# Vibes-Plug — 109+ Skills Ecosystem for AI-Powered Development

> **v2.5.0 (2026 Edition)** — Universal AI plugin with 109+ specialized skills for modern tech stacks (React 19, Next.js 15, Tailwind v4, Bun 1.2+, Hono v4, Node.js 24 LTS, Python 3.14, TypeScript 5.8+, Go 1.25+, Rust 2024).

## How This Plugin Works

This repository contains **109+ specialized skill files** in the `skills/` directory. Each skill is a `SKILL.md` file with domain-specific instructions, best practices, and code patterns.

**Before starting any task**, identify which skills are relevant and read their `SKILL.md` files. Skills are organized by domain:

| Domain | Skills |
|--------|--------|
| 🤖 AI & Agentic | `ai-llm-integration-expert`, `ai-cost-token-optimizer`, `ai-prompt-engineering-expert`, `mcp-server-architect`, `mcp-client-orchestrator`, `multi-agent-orchestration`, `vector-db-rag-expert`, `gemini-agent-booster`, `doku-mcp-server` |
| 🎨 Design & UI/UX | `design-system-architect`, `hig`, `monday-design-aesthetic`, `ui-components-expert`, `ui-ux-pro-max`, `visual-qa-vision-agent`, `glsl-shader-expert`, `web-3d-graphics-expert`, `webxr-ar-vr-expert`, `svg-animation-motion-expert` |
| 🖥️ Frontend & State | `senior-frontend`, `tailwind-expert`, `tanstack-query-expert`, `state-management-expert`, `nextjs-app-router-expert`, `vue-frontend-expert`, `spa-orchestrator`, `mpa-orchestrator`, `multiple-entry-points`, `performance-web-vitals`, `app-analyzer-optimizer`, `apple-ecosystem-expert`, `bootstrap-to-modern`, `form-validation-expert`, `project-context-mapper`, `tauri-expert`, `web-game-engine-expert` |
| 📱 Mobile | `mobile-expo-expert`, `mobile-push-notification-expert` |
| ⚙️ Backend & Languages | `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`, `typescript-expert`, `fullstack-expert`, `api-design-expert`, `graphql-apollo-expert`, `bun-runtime-expert`, `mvc-expert`, `openapi-swagger-codegen-expert` |
| ☁️ SaaS & Cloud | `saas-transformer`, `saas-mvp-launcher`, `saas-billing`, `saas-multi-tenant`, `cloud-hosting-expert`, `ci-cd-devops-architect`, `monorepo-architect`, `micro-frontend-architect`, `event-driven-architect`, `feature-flag-analytics-expert`, `payment-gateway-expert`, `doku-payment-gateway`, `legacy-code-translator` |
| 🗄️ Database & ORM | `database-orm-expert`, `edge-serverless-db-expert`, `supabase-migration`, `database-migration-versioning-expert` |
| 🔒 Security & Quality | `authentication-identity-expert`, `e2e-testing-expert`, `production-ready-hardener`, `autonomous-tdd-debugger`, `autonomous-red-teamer`, `autonomous-chaos-monkey`, `zero-trust-secret-vault`, `supabase-security-expert`, `firebase-security-expert`, `secure-fuzz-testing`, `scalability-clean-code`, `browser-automation-expert`, `rate-limit-abuse-prevention`, `compliance-gdpr-privacy-expert`, `error-resilience-expert`, `post-quantum-crypto-migrator` |
| 🔍 SEO | `seo` |
| ⏱️ Async & Scheduling | `async-queue-temporal-expert`, `background-jobs-queue-expert`, `cron-scheduler-expert`, `sse-websocket-streaming-expert`, `realtime-collaboration-expert` |
| 📊 Data & Observability | `data-telemetry-expert`, `data-pipeline-etl-expert`, `logging-error-tracking-expert`, `email-notification-expert`, `file-upload-media-expert` |
| 🛠️ Utilities | `brainstorming`, `prd-architect`, `auto-doc-updater`, `token-saver`, `session-context-loader`, `session-handoff-resume`, `project-context-mapper`, `vibe-code-gardener`, `web-scraper`, `website-design-cloner`, `coderabbit`, `asisten-ramah`, `skill-baru`, `dependency-upgrade-migrator`, `self-evolving-memory-graph`, `self-healing-cloud-orchestrator`, `proactive-background-watcher`, `domain-driven-design-expert`, `api-gateway-proxy-expert`, `wasm-edge-computing-expert`, `global-a11y-i18n-expert`, `zero-to-prod-orchestrator` |

---

## Core Rules

### 1. Deep Reasoning Before Action
Do not act impulsively. Before writing code, modifying files, or making architectural decisions, engage in a mandatory reasoning phase:
1. **Analyze** constraints, edge cases, and implications.
2. **Critique** your initial assumptions — is there a more scalable or modern approach?
3. **Validate** the solution against best practices and non-functional requirements.
4. **Execute** only after the reasoning chain is complete.

### 2. Skill Orchestration Protocol
When a new skill `SKILL.md` is created or modified:
1. Update `skills/brainstorming/SKILL.md` — add to the Skill Integration & Orchestration Matrix.
2. Update `skills/zero-to-prod-orchestrator/SKILL.md` — add to the relevant Phase.
3. Verify both English and Bahasa Indonesia sections are accurate.

### 3. Bilingual Ecosystem
This ecosystem serves English and Indonesian developers. Every `SKILL.md` must provide bilingual context for critical concepts. Headings can be in either language.

### 4. Anti-Slop
No generic filler text ("As an AI language model..."). Instructions must be imperative, direct, and token-efficient.

### 5. Mandatory Documentation for New Projects
When initiating a new project from scratch, ensure the automatic generation of:
- Product Requirements Document (`PRD.md`)
- Entity Relationship Diagram (`ERD.md`)
- General Documentation (`DOKUMENTASI.md`)

### 6. SKILL.md File Standard
Every `SKILL.md` MUST have:
- YAML frontmatter (`name`, `description`, `author`)
- A section named `## Orchestration & Integration` or `## Integrasi Orkestrasi`
- Registration in `brainstorming/SKILL.md` and `zero-to-prod-orchestrator/SKILL.md`

---

## Orchestration Workflow

1. **Ideation & Planning:** `brainstorming` → `prd-architect` → `gemini-agent-booster`
2. **Design & Frontend:** `design-system-architect` → `ui-ux-pro-max` → `senior-frontend` + `ui-components-expert`
3. **Backend & Architecture:** `js-backend-expert` / `go-programming-expert` / `rust-programming-expert` → `event-driven-architect` → `autonomous-tdd-debugger`
4. **AI Integration:** `ai-llm-integration-expert` → `mcp-server-architect` → `multi-agent-orchestration`
5. **SaaS Transformation:** `saas-transformer` / `saas-mvp-launcher` → auto-coordinates billing, tenancy, payments
6. **Quality & Launch:** `e2e-testing-expert` → `vibe-code-gardener` → `seo` → `production-ready-hardener`
