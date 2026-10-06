# Vibes-Plug Core Rules (OpenAI Codex)

## Primary Trigger & Skill Auto-Synchronization (Pemicu Utama)
**MANDATORY**: Upon installation, `vibes-plug` acts as the PRIMARY TRIGGER and master conductor for OpenAI Codex.
- Codex automatically intercepts every request, evaluates user intent against the 147 skills, and activates cooperating skills without waiting for manual invocation.
- Multiple domains automatically synchronize: Frontend (`senior-frontend`), Backend (`js-backend-expert`), Database (`database-orm-expert`), Payments (`doku-payment-gateway`, `saas-billing`), QA (`autonomous-tdd-debugger`), Hardening (`production-ready-hardener`, `anti-slop`).

## Skill Resolution Protocol
1. Before any task, identify relevant skills from `skills/` directory.
2. Read the `SKILL.md` file of each relevant skill before writing code.
3. Skills contain domain-specific patterns, best practices, and code templates — always prioritize these over generic knowledge.

## Deep Reasoning (Mandatory)
Before writing code or making architectural decisions:
1. Analyze constraints and edge cases.
2. Question your own assumptions — is there a more modern approach?
3. Validate against project NFRs and best practices.
4. Only then execute.

## Code Quality Standards & Sovereign Anti-Slop Directive
- Use modern 2026 tech stack versions: React 19, Next.js 15, Tailwind v4, TypeScript 5.8+, Node.js 24 LTS, Bun 1.2+, Python 3.14, Go 1.25+, Rust 2024.
- Follow Clean Code, SOLID, DRY principles (see `scalability-clean-code` skill).
- **Sovereign Anti-Slop Standard (`anti-slop` skill)**:
  * Zero-tolerance for lazy stubs (`// TODO`, `// ...`), mock data left in prod, and syntax narration comments.
  * Output 100% complete, fully working implementations on first attempt.
  * No swallowed errors (`catch (e) {}` prohibited).
  * UI & Visual Sanitation: Enforce Linear/Stripe caliber design. Tabular numerals (`tabular-nums`), crisp 1px borders, mandatory 5-state interaction contracts.
  * Run `node scripts/check-anti-slop.js` to ensure clean code.

## Sovereign Token Optimization Protocol (Hemat Token)
- Enforce deterministic KV-cache prefixing via `kv-cache-prefix-optimizer` (75-90% prompt cache hit rates).
- Prune subagent context payloads: pass only targeted `CONTEXT_MAP.md` slices and relevant file interfaces, not global chat history.
- Use dynamic model cascading (`adaptive-model-cascade`): fast models (`gpt-4o-mini`, `o3-mini`) for searches and lint checks, frontier reasoning models (`o3`, `gpt-4.5`, `gpt-5`) for architecture and security audits.
- Ultra-compact session checkpoints (<300 tokens) via `session-memory-manager`.
- Non-Degradation Invariant: Never truncate code with placeholders or stubs to save tokens. Code must be 100% complete.

## New Project Protocol
When creating a new project from scratch, MUST auto-generate before any code:
1. `PRD.md` — Product Requirements Document
2. `ERD.md` — Entity Relationship Diagram
3. `DOKUMENTASI.md` — Technical Documentation

## Skill Registration (When Creating Skills)
Every new `SKILL.md` must be registered in:
1. `skills/brainstorming/SKILL.md` (Domain Matrix)
2. `skills/zero-to-prod-orchestrator/SKILL.md` (Phase Execution)

## Bilingual Support
Skills serve English and Indonesian developers. Provide bilingual context for critical concepts.
