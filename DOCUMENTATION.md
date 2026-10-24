# 📚 System Architecture & Component Documentation
**System**: `vibes-plug` Skill-as-a-Tool (SaaT) Engine  
**Release**: 4.5.0  

---

## 1. System Topology & Component Boundaries

The architecture operates across three synchronized execution tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IDE & AGENT CLIENTS                             │
│   (Antigravity AGY / Claude Code / Cursor / Windsurf / Codex / Trae)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        [1. FastMCP Interface]              [2. CLI Tool Engine]
         (bin/mcp-server.mjs)                 (bin/vibes.mjs)
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             Universal Skill Action Dispatcher           │
       │              (scripts/skill-dispatcher.mjs)             │
       └────────────────────────────┬────────────────────────────┘
                                    │
      ┌─────────────────────────────┼────────────────────────────┐
      ▼                             ▼                            ▼
[Core Engines P1-P5]      [Domain Tool Adapters]       [Verification Loops]
• ast-query.mjs           • db-adapter.mjs (Prisma/RLS) • check-anti-slop.js
• eval-migration.mjs      • ui-adapter.mjs (Tokens/CSS) • verify-invariants.mjs
• speculative-arbiter.mjs • api-adapter.mjs (OpenAPI)   • test-runner (TDD)
• memory-daemon.mjs       • sec-adapter.mjs (OWASP)     • benchmark-suite.mjs
```

---

## 2. Directory Layout & Module Responsibilities

```
vibes-plug/
├── bin/
│   ├── mcp-server.mjs              # FastMCP server exposing vibes_* tools & vibes_skill_dispatch
│   └── vibes.mjs                   # CLI interface (init, doctor, skill exec/chain/slice, test, guard)
├── scripts/
│   ├── skill-dispatcher.mjs        # Universal SaaT runtime & Autonomous Skill Composition Chains
│   ├── supercharge-all-skills.mjs  # Sovereign Skill Supercharger across all 171 skills
│   ├── compile-skill-slices.mjs    # Pre-compiles <350-token micro-slices to .skill-slices.json
│   ├── verify-skill-snippets.mjs   # Executable code-block smoke tester across 994+ blueprints
│   ├── ast-query.mjs               # Surgical symbol extraction & blast-radius calculation
│   ├── eval-migration.mjs          # In-memory SQL DDL, RLS, and index verification
│   ├── speculative-arbiter.mjs     # PRM multi-draft candidate scoring engine
│   ├── verify-invariants.mjs       # Neuro-symbolic state machine invariant checker
│   ├── memory-daemon.mjs           # Episodic session checkpoint and retrieval store
│   ├── check-anti-slop.js          # 7-Pillar Anti-Slop AST & visual syntax auditor
│   └── adapters/                   # 8 Specialized Domain Adapters (1:1 with native subagents)
│       ├── database.mjs            # Schema generators, migration evaluators, RLS audits
│       ├── frontend.mjs            # OKLCH tokens, @theme generators, WCAG a11y & Pillar 7 linter
│       ├── api.mjs                 # OpenAPI 3.1, TypeSpec, Hono RPC, & RFC 9457 verification
│       ├── security.mjs            # OWASP Top 10 fuzzing, secret entropy, & SNAP BI checks
│       ├── tdd.mjs                 # Ephemeral micro-sandbox & Critic-in-the-Loop quality gate
│       ├── ai-mcp.mjs              # FastMCP schemas, A2A Agent Cards, & KV-cache prefix checks
│       ├── cloud-devops.mjs        # Rootless/distroless Dockerfiles, K8s GitOps, & CycloneDX SBOM
│       └── mobile-spatial.mjs      # Expo SDK 53, Tauri v2 capabilities, & Zero-GC 60fps loops
├── .skill-slices.json              # Pre-compiled <350-token skill slices (80%+ fan-out token savings)
├── skills/                         # 171 Specialized Skill behavioral specifications (SKILL.md)
├── PRD.md                          # Product Requirements Document
├── ERD.md                          # Database Entity Schemas & RLS DDL
├── DOCUMENTATION.md                # Topology, component boundaries & module guide
└── CONTEXT_MAP.md                  # Subagent downstream contract slice
```

---

## 3. Communication & Execution Lifecycle

1. **Invocation**: Agent receives request (e.g. "Validate database migration") and calls `vibes_skill_dispatch({ skill: 'database-orm-expert', action: 'eval', payload: { sql: "..." } })` or CLI `vibes db eval`.
2. **Dispatch & Validation**: `scripts/skill-dispatcher.mjs` validates inputs against typed schema contracts.
3. **Engine Execution**: Adapter performs in-memory analysis without writing intermediate temporary junk files.
4. **Invariant Gate**: Output is evaluated against strict Anti-Slop criteria (no dummy mocks, complete solutions).
5. **Output**: Ultra-compact JSON returned to the agent or formatted table to user terminal.
