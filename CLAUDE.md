# Vibes-Plug — 147-Skill AI Agent Swarm Architecture

> **v4.2.0 (2026 Edition)** — Universal AI plugin with 147 specialized skills for modern tech stacks (React 19, Next.js 15, Tailwind v4, Bun 1.2+, Hono v4, Node.js 24 LTS, Python 3.14, TypeScript 5.8+, Go 1.25+, Rust 2024).

## How This Plugin Works

This repository contains **147 specialized skill files** in the `skills/` directory. Each skill is a `SKILL.md` file with domain-specific instructions, best practices, and code patterns.

**Before starting any task**, identify which skills are relevant and read their `SKILL.md` files. Skills are organized by domain:

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

## Core Rules

### 0. Primary Trigger & Skill Auto-Synchronization (Pemicu Utama)
**MANDATORY**: Upon installation, `vibes-plug` is the **PRIMARY TRIGGER (Pemicu Utama)** for all interactions.
- The AI agent MUST NOT wait for the user to specify skill names or `@` tags.
- Every user prompt is automatically intercepted and routed through `brainstorming` and `zero-to-prod-orchestrator`.
- The agent automatically binds and synchronizes cooperating skills across all involved domains (Frontend, Backend, Database, Payments, AI, QA).
- For complex, multi-step requests, the agent automatically acts as a Swarm Director (Fan-Out/Fan-In, Pipeline Saga, or Critic-Validator).

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

### 4. Sovereign Anti-Slop Directive (Zero-Tolerance Standard)
Strictly eliminate conversational pleasantries, prompt repeating, syntax-narrating comments, and placeholder code (`// TODO`, `// ... rest of code unchanged`). Always enforce the `anti-slop` skill and verify clean code:
- **Code-First**: Deliver fully functional code immediately without conversational preambles or cheerleading.
- **Completeness**: 100% complete files, functions, and tests on the first try. No lazy stubs or fake mocks in production routines.
- **Hyper-YAGNI**: No speculative layers, factory bloat, or unnecessary DTO wrappers.
- **Meaningful Comments Only**: Explain non-obvious business/architectural WHY, never syntax mechanics.
- **UI & Visual Sanitation**: Enforce Sovereign Professional UI Craft (Linear/Stripe caliber). No generic blue-purple gradients, no blurred neon orbs, no pill button addiction (`rounded-full` on standard rectangular elements), no stacked glassmorphism, mandatory 5-state interactive contract, tabular numerals (`tabular-nums`), and crisp 1px borders.
- **Automated Verification**: Use `node scripts/check-anti-slop.js` to ensure zero slop violations.

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

### 7. Sovereign Token Optimization Protocol (Hemat Token)
- **KV-Cache Determinism**: Maintain static prompt prefix order (`kv-cache-prefix-optimizer`) to maximize prompt caching hit rates (75-90% discount).
- **Subagent Context Pruning**: During Swarm Fan-Out, pass only targeted `CONTEXT_MAP.md` slices and relevant file interfaces, not global chat history.
- **Adaptive Model Cascading**: Use lightweight models (`flash` / `haiku`) for searches and validations, reserving frontier models for architecture and security audits (`adaptive-model-cascade`).
- **Compact Handoffs**: Store concise checkpoints (<300 tokens) via `session-memory-manager`.
- **Non-Degradation Invariant**: Never truncate code with placeholders or stubs to save tokens. Code must be 100% complete and working.

---

## Orchestration Workflow

1. **Ideation & Planning:** `brainstorming` → `prd-architect` → `gemini-agent-booster`
2. **Design & Frontend:** `design-system-architect` → `ui-ux-pro-max` → `senior-frontend` + `tailwind-expert`
3. **Backend & Architecture:** `js-backend-expert` / `go-programming-expert` / `rust-programming-expert` → `event-driven-architect` → `autonomous-tdd-debugger`
4. **AI Integration:** `ai-llm-integration-expert` → `mcp-server-architect` → `multi-agent-orchestration`
5. **SaaS Transformation:** `saas-architect` → auto-coordinates billing, tenancy, payments (`saas-billing`, `saas-multi-tenant`, `doku-payment-gateway`)
6. **Quality & Launch:** `e2e-testing-expert` → `zero-tech-debt-auditor` + `anti-slop` → `seo` → `production-ready-hardener`
