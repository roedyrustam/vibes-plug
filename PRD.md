# 📋 Product Requirements Document (PRD): Skill-as-a-Tool (SaaT) Engine
**Product**: `vibes-plug` Skill Supercharger & Tool Execution Engine  
**Version**: 4.5.0  
**Status**: APPROVED ARCHITECTURE  
**Target Release**: Q4 2026  

---

## 1. Executive Summary & Problem Definition
`vibes-plug` maintains 176 high-caliber skills (including the 5-skill REA Reverse Engineering suite). To ensure skills do not remain only passive markdown documentation relying solely on LLM context ingestion, the Universal Skill-as-a-Tool (SaaT) engine turns all 176 skills and 1,000 code blueprints into deterministic runtime tools, eliminating:
1. Context window bloat (~5k–15k tokens per loaded skill).
2. Non-deterministic execution and hallucinated command flags.
3. Inability to run automated verification loops, TDD self-healing, or AST inspections without manual intervention.

The **Skill-as-a-Tool (SaaT) Engine** bridges declarative skill knowledge with deterministic runtime execution. Every skill domain is endowed with executable actions accessible via CLI (`vibes skill exec`) and FastMCP protocol (`vibes_skill_dispatch`).

---

## 2. Core Functional Requirements (User Stories & Acceptance Criteria)

### FR-01: Universal Skill Action Dispatcher
- **User Story**: As an AI Agent or Developer, I want to execute domain-specific skill operations directly through a typed command interface without manually writing temporary scripts.
- **Acceptance Criteria**:
  - `vibes skill exec <skill-name> <action> [flags]` parses and executes registered domain actions.
  - Returns structured JSON to stdout for agent consumption.
  - Supports `--format=json|table|pretty`.
  - Exit code `0` on success, non-zero with structured error payload on failure.

### FR-02: Native MCP Skill Bridge (`vibes_skill_dispatch`)
- **User Story**: As a Frontier LLM (Gemini 4 / Claude Sonnet 5.5 / Grok 4.7), I want to invoke skill actions directly via FastMCP with strict JSON schema validation.
- **Acceptance Criteria**:
  - Exposed via `bin/mcp-server.mjs`.
  - Dynamically routes to domain execution engines (SQL validator, AST queries, security scans, token generators, TDD debugger).
  - Completes within <250ms for local AST/in-memory tasks.

### FR-03: Domain Tool Implementations
- **FR-03.1 (Database & ORM)**: `database-orm-expert` gains in-memory schema migration evaluator, RLS validator, and Prisma/Drizzle schema generator.
- **FR-03.2 (API & Spec)**: `api-design-expert` & `spec-driven-development-expert` gain OpenAPI 3.1 & TypeSpec linter and contract compliance checker.
- **FR-03.3 (UI & Frontend)**: `tailwind-expert` & `visual-ui-auditor` gain OKLCH palette generator, CSS token extractor, and Anti-Slop Pillar 7 visual auditor.
- **FR-03.4 (Testing & QA)**: `autonomous-tdd-debugger` & `autonomous-red-teamer` gain automated test execution, stack trace analyzer, and OWASP security fuzzer.
- **FR-03.5 (AI & FinOps)**: `adaptive-model-cascade` & `kv-cache-prefix-optimizer` gain token budget calculator and prompt prefix compiler.

### FR-04: Non-Functional Requirements (NFR Budgets)
| Metric | Budget | Invariant Enforcement |
| :--- | :--- | :--- |
| **P99 Execution Latency** | < 300ms (Local AST/Memory) | Ephemeral in-memory execution; zero network bottlenecks |
| **Token Overhead** | < 250 tokens per tool call | Strict JSON Schema parameters; zero conversational slop |
| **Availability Fallback** | 100% Graceful Degradation | Gemini 4 Pro/Argon → Gemini 3.8 Flash; Claude Opus 5.5 → Claude Opus 4.6 |
| **Quality Gate** | 100% Anti-Slop Compliance | Enforces 7 Pillars: no `// TODO`, no fake stubs, no syntax narration |
| **Test Coverage** | > 90% Branch Coverage | Vitest / Node test runner verification for all skill action adapters |

---

## 3. API Contract Specification

### Endpoint / MCP Tool: `vibes_skill_dispatch`
```json
{
  "name": "vibes_skill_dispatch",
  "description": "Executes a deterministic tool action provided by a specialized vibes-plug skill.",
  "parameters": {
    "type": "object",
    "properties": {
      "skill": {
        "type": "string",
        "description": "The exact name of the skill (e.g., 'database-orm-expert', 'tailwind-expert', 'autonomous-tdd-debugger')"
      },
      "action": {
        "type": "string",
        "description": "Action to execute (e.g., 'audit', 'eval', 'generate', 'verify', 'fuzz')"
      },
      "payload": {
        "type": "object",
        "description": "Action-specific parameters (e.g. target path, code snippet, DDL statement)"
      }
    },
    "required": ["skill", "action"]
  }
}
```

#### Success Response Contract:
```json
{
  "status": "success",
  "skill": "database-orm-expert",
  "action": "eval",
  "durationMs": 42,
  "result": {
    "tablesChecked": 4,
    "rlsEnabled": true,
    "missingIndexes": [],
    "findings": []
  }
}
```
