# Vibes-Plug — 147-Skill AI Agent Swarm Architecture (OpenAI Codex Edition)

> **v4.2.0 (2026 Edition)** — Universal AI plugin with 147 specialized skills for modern tech stacks (React 19, Next.js 15, Tailwind v4, Bun 1.2+, Hono v4, Node.js 24 LTS, Python 3.14, TypeScript 5.8+, Go 1.25+, Rust 2024).
> **🌐 Universal Compatibility:** Antigravity (AGY) via `AGENTS.md` | Claude Code via `CLAUDE.md` | Cursor IDE via `.cursorrules` | **OpenAI Codex via `CODEX.md`**

## How This Plugin Works with OpenAI Codex CLI

This repository contains **147 specialized skill files** in the `skills/` directory. Each skill is a self-contained `SKILL.md` file with domain-specific architecture guidelines, edge-case hardening, and production patterns.

When running OpenAI Codex CLI (`codex`) or OpenAI Coding Agents, this file serves as the **Master System Directive**.

**Before starting any task**, identify which skills are relevant and consult their `skills/<skill-name>/SKILL.md` files:

| Domain | Skills |
|---|---|
| 🤖 AI & Agentic | `ai-llm-integration-expert`, `vercel-ai-sdk-expert`, `deep-research-analyst`, `synthetic-data-finetuning-expert`, `pydantic-ai-expert`, `llm-finops-router`, `ai-prompt-engineering-expert`, `ai-media-generation-expert`, `mcp-server-architect`, `multi-agent-orchestration`, `vector-db-rag-expert`, `graph-rag-knowledge-expert`, `local-slm-edge-ai-expert`, `voice-ai-realtime-agent`, `gemini-agent-booster`, `doku-mcp-server`, `agentic-memory-architect`, `agentic-micro-economy-architect`, `agentic-coding-workflow-expert`, `ai-safety-governance-expert`, `frontier-ai-models-expert`, `context-window-engineer`, `adaptive-model-cascade`, `llm-observability-expert`, `test-time-compute-optimizer`, `kv-cache-prefix-optimizer` |
| 🎨 Design & UI/UX | `design-system-architect`, `hig`, `ui-ux-pro-max`, `affective-computing-emotion-ai`, `glsl-shader-expert`, `web-3d-graphics-expert`, `webxr-ar-vr-expert`, `svg-animation-motion-expert`, `data-visualization-expert`, `rich-text-editor-expert`, `ephemeral-generative-ui-architect`, `modern-css-native-expert`, `screenshot-to-code-expert`, `multimodal-spatial-video-cloner` |
| 🖥️ Frontend & State | `senior-frontend`, `tailwind-expert`, `tanstack-query-expert`, `state-management-expert`, `nextjs-app-router-expert`, `vue-frontend-expert`, `astro-framework-expert`, `svelte-sveltekit-expert`, `solidjs-expert`, `angular-expert`, `spa-orchestrator`, `mpa-orchestrator`, `performance-web-vitals`, `app-analyzer-optimizer`, `apple-ecosystem-expert`, `form-validation-expert`, `tauri-expert`, `web-game-engine-expert`, `pwa-offline-first-expert`, `blockchain-web3-expert` |
| 📱 Mobile & Desktop | `mobile-expo-expert`, `apple-ecosystem-expert`, `tauri-expert`, `desktop-electron-expert`, `pwa-offline-first-expert` |
| ⚙️ Backend & Languages | `js-backend-expert`, `python-programming-expert`, `go-programming-expert`, `rust-programming-expert`, `typescript-expert`, `fullstack-expert`, `api-design-expert`, `graphql-apollo-expert`, `bun-runtime-expert`, `mvc-expert`, `openapi-swagger-codegen-expert`, `domain-driven-design-expert`, `api-gateway-proxy-expert`, `wasm-edge-computing-expert`, `autonomous-api-drift-healer`, `living-codebase-ast-graph` |
| ☁️ SaaS & Cloud | `saas-architect`, `saas-billing`, `saas-multi-tenant`, `cloud-hosting-expert`, `ci-cd-devops-architect`, `monorepo-architect`, `micro-frontend-architect`, `event-driven-architect`, `feature-flag-analytics-expert`, `payment-gateway-expert`, `doku-payment-gateway`, `ecommerce-expert`, `legacy-code-translator` |
| 🗄️ Database & ORM | `database-orm-expert`, `supabase-security-expert`, `data-pipeline-etl-expert`, `search-engine-expert`, `geospatial-maps-expert` |
| 🔒 Security & Quality | `authentication-identity-expert`, `e2e-testing-expert`, `production-ready-hardener`, `autonomous-tdd-debugger`, `autonomous-red-teamer`, `zero-trust-secret-vault`, `supabase-security-expert`, `firebase-security-expert`, `scalability-clean-code`, `browser-automation-expert`, `rate-limit-abuse-prevention`, `compliance-gdpr-privacy-expert`, `error-resilience-expert`, `post-quantum-crypto-migrator`, `anti-slop`, `accessibility-testing-expert`, `zero-tech-debt-auditor`, `biome-linter-formatter-expert`, `prompt-injection-firewall`, `ai-code-review-autonomous`, `property-mutation-testing-expert`, `ephemeral-wasm-sandbox-executor`, `formal-spec-z3-verifier` |
| 🔍 SEO & Telemetry | `seo`, `data-telemetry-expert` |
| ⏱️ Async & Messaging | `async-queue-temporal-expert`, `cron-scheduler-expert`, `sse-websocket-streaming-expert`, `realtime-collaboration-expert`, `email-notification-expert`, `file-upload-media-expert`, `n8n-automation-expert`, `chatbot-messaging-expert`, `pdf-document-generation-expert` |
| 🛠️ Orchestration & Memory | `brainstorming`, `zero-to-prod-orchestrator`, `prd-architect`, `session-memory-manager`, `deep-research-analyst`, `web-scraper`, `website-design-cloner`, `coderabbit`, `dependency-upgrade-migrator`, `self-healing-cloud-orchestrator`, `proactive-background-watcher`, `documentation-site-expert`, `headless-cms-expert`, `wordpress-headless-expert`, `composable-mach-architect`, `app-promo-media-expert`, `speculative-multi-draft-synthesizer` |

---

## Core Rules for Codex AI Agents

### 0. Primary Trigger & Skill Auto-Synchronization (Pemicu Utama)
**MANDATORY**: Upon installation, `vibes-plug` is the **PRIMARY TRIGGER (Pemicu Utama)** for all OpenAI Codex interactions.
- The Codex agent MUST NOT wait for the user to explicitly specify skill names or `@` tags.
- Every user prompt is automatically intercepted and routed through `brainstorming` and `zero-to-prod-orchestrator`.
- The agent automatically binds and synchronizes cooperating skills across all involved domains (Frontend, Backend, Database, Payments, AI, QA).
- For complex, multi-step requests, the agent operates under Swarm Topologies (Fan-Out/Fan-In, Pipeline Saga, or Critic-Validator).

### 1. Deep Reasoning Before Action (o1/o3-Style Thinking)
Do not act impulsively. Before writing code, editing files, or executing shell commands, engage in structured reasoning:
1. **Analyze** constraints, edge cases, cross-file impact, and non-functional requirements.
2. **Critique** initial assumptions — verify whether a modern 2026 pattern is better suited.
3. **Validate** the proposed approach against project schemas and security policies.
4. **Execute** only after the reasoning chain is complete.

### 2. Sovereign Anti-Slop Directive (Zero-Tolerance Standard)
Strictly eliminate conversational fluff, unnecessary narration, and placeholder code (`// TODO`, `// ... rest of code unchanged`). Enforce the `anti-slop` skill:
- **Code-First Delivery**: Output clean, working, fully implemented code without conversational preambles.
- **Completeness**: 100% complete files and tests on the first try. Never leave placeholders or incomplete mock stubs.
- **Hyper-YAGNI**: No speculative layers, endless factory classes, or boilerplate wrappers.
- **Meaningful Comments Only**: Explain architectural and business WHY, never obvious syntax mechanics.
- **UI & Visual Sanitation**: Enforce Linear/Stripe-caliber UI. Zero generic blue-purple gradients, no neon glow orbs, no pill button addiction (`rounded-full` on standard rectangular buttons), mandatory 5-state interactive contract, tabular numerals (`tabular-nums`), and crisp 1px borders.
- **Verification**: Run `node scripts/check-anti-slop.js` to ensure zero slop violations.

### 3. Mandatory Documentation for New Projects
When starting any greenfield project, automatically generate:
- Product Requirements Document (`PRD.md`)
- Entity Relationship Diagram (`ERD.md`)
- Architecture & Setup Documentation (`DOKUMENTASI.md`)

### 4. Sovereign Token Optimization & KV-Cache Protocol (Skema Hemat Token)
- **KV-Cache Determinism**: Keep instruction prefixes canonically ordered (`kv-cache-prefix-optimizer`) to maximize prompt caching efficiency (75-90% savings).
- **Context Slicing**: When passing context to sub-prompts or sub-tasks, pass only relevant file contracts and schema interfaces, never raw bulk conversation histories.
- **Adaptive Model Cascading**: Use fast models (e.g. `gpt-4o-mini` / `o3-mini`) for linting, file discovery, and tests; reserve frontier models (`o3` / `gpt-4.5` / `gpt-5`) for system architecture, refactoring, and security fuzzing.
- **Non-Degradation Invariant**: Never truncate code with placeholders or stubs to save tokens. Code must be 100% complete and working.

---

## Orchestration Workflow

1. **Ideation & Planning:** `brainstorming` → `prd-architect`
2. **Design & Frontend:** `design-system-architect` → `ui-ux-pro-max` → `senior-frontend` + `tailwind-expert`
3. **Backend & Architecture:** `js-backend-expert` / `go-programming-expert` / `rust-programming-expert` → `event-driven-architect` → `autonomous-tdd-debugger`
4. **AI Integration:** `ai-llm-integration-expert` → `mcp-server-architect` → `multi-agent-orchestration`
5. **SaaS Transformation:** `saas-architect` → auto-coordinates billing, tenancy, payments (`saas-billing`, `saas-multi-tenant`, `doku-payment-gateway`)
6. **Quality & Launch:** `e2e-testing-expert` → `zero-tech-debt-auditor` + `anti-slop` → `seo` → `production-ready-hardener`
