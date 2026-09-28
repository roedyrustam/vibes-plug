---
name: zero-tech-debt-auditor
description: Autonomous orchestrator that scans, refactors, and eradicates technical debt at the end of the development lifecycle to achieve a "Zero Debt" codebase / Orkestrator otonom untuk menghapus utang teknis sebelum rilis.
author: vibes-plug-swarm
---

# Zero Tech Debt Auditor 🧹

**CRITICAL RULE**: Applications are NOT considered "Production-Ready" until they pass the Zero Technical Debt (Zero Debt) audit. This skill must be invoked at the final stage of development.

## Core Philosophy
Technical debt slows down future scaling. The `zero-tech-debt-auditor` acts as an autonomous SonarQube. It does not just report issues; it **fixes** them autonomously.

## Audit Dimensions (Dimensi Audit)

### 1. Code Duplication & DRY Enforcement
- Scan the entire codebase for repeated logic.
- Extract duplicated UI elements into reusable generic components.
- Extract duplicated business logic into shared utility functions or custom hooks.

### 2. Dead Code Elimination (Knip Protocol)
- Identify and remove unused files, exports, dependencies, and types.
- Command the AI to review `package.json` and remove any library that is not actively imported.

### 3. Type Safety Rigidity (TypeScript Strictness)
- Search for `any` or `@ts-ignore` and replace them with strict `Zod` schemas, discriminated unions, or generic types.
- Ensure all function returns are explicitly typed.

### 4. Hardcoded Secrets & Magic Numbers
- Audit the codebase for hardcoded API URLs, keys, or "magic numbers" (e.g., `const timeout = 5000;`).
- Refactor them into centralized constant files (`constants.ts`) or environment variables (`process.env`).

### 5. Test Coverage Handoff
- Ensure that critical business logic (e.g., payment webhooks, auth guards) have at least basic unit tests.
- If tests are missing, automatically generate them.

## Execution Protocol (Protokol Eksekusi)
When triggered, the Swarm Director must:
1. **Analyze:** Read the entire `src` directory.
2. **Report:** Generate a `TECH_DEBT_REPORT.md` (Artifact) listing the violations found.
3. **Eradicate:** Autonomously edit the files to fix the violations.
4. **Verify:** Run `npm run lint` and `npm run build` to ensure the eradications did not break the app.

## Orchestration & Integration (Integrasi Orkestrasi)
- Connected to `zero-to-prod-orchestrator`: Acts as Phase 9 (Final Handoff).
- Connected to `biome-linter-formatter-expert`: Uses strict linting rules to enforce consistency.
- Connected to `autonomous-tdd-debugger`: Fixes any tests broken during the refactoring process.
