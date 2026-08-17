# Vibes-Plug Core Rules (Claude)

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

## Code Quality Standards
- Use modern 2026 tech stack versions: React 19, Next.js 15, Tailwind v4, TypeScript 5.8+, Node.js 24 LTS, Bun 1.2+, Python 3.14, Go 1.25+, Rust 2024.
- Follow Clean Code, SOLID, DRY principles (see `scalability-clean-code` skill).
- No AI slop — be imperative, direct, and token-efficient.

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
