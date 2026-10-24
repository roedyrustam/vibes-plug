# Show HN: VibesPlug – A 176-Skill AI Agent Swarm for Vibe Coding (Antigravity, Cursor, Claude Code)

Hey HN! I'm Roedy. Over the past 9 months of building with frontier LLMs (Claude 3.7/Sonnet, Gemini 2.0/Pro, GPT-4o), I hit the same wall every developer faces: **AI code slop, context drift, and fragmented reasoning**.

When you ask an AI to "build a SaaS billing platform", a raw LLM tries to be an architect, database admin, frontend designer, and security auditor all in one prompt. It inevitably hallucinates packages, leaves `// TODO: implement later` stubs, mixes up React 18 and 19 APIs, and degrades into unmaintainable spaghetti.

To solve this, I built **VibesPlug** (MIT licensed): an autonomous swarm architecture with **176 specialized skills**, 5 native subagents, and an in-memory substrate that turns any IDE into a complete software engineering studio.

- **GitHub Repository**: https://github.com/roedyrustam/vibes-plug
- **Live Interactive Showcase**: https://vibes-plug.vercel.app/
- **NPM Package**: `npx vibes-plug init`

---

## What Makes This Different from Just Another `.cursorrules`?

1. **Autonomous Swarm Director vs Single-Model Confusion**:
   Instead of one model doing everything, the primary trigger intercepts user prompts and delegates them across specialized domain skills via a Fan-Out / Pipeline Saga topology. For instance, creating a checkout flow binds `senior-frontend` + `tailwind-expert` + `doku-payment-gateway` + `saas-billing` + `database-orm-expert` + `formal-spec-z3-verifier`.

2. **The Sovereign Anti-Slop Directive**:
   We built an automated pre-disk scanner (`scripts/check-anti-slop.js --strict`) and micro-sandbox (`vibes verify-gate`) enforcing 8 pillars:
   - Absolute ban on `// TODO`, `// ... rest of code`, and mock data in production routines.
   - Elimination of phantom imports and fabricated SDK signatures.
   - Enforcing strict 5-state interactive UI contracts (default, hover, focus-visible, active, disabled), 1px crisp borders, and tabular numerals.

3. **Deterministic KV-Cache Prefix Pinning (90%+ Cache Hit Rate)**:
   By compiling canonically sorted static system instructions, schemas, and skill indexes at the head of the context window (`vibes compile-cache`), prompt caching on Gemini 2.0/Flash and Claude 3.5/3.7 accelerates Time-To-First-Token (TTFT) by up to 10x and cuts API billing by 75-90%.

4. **100% Graph Dependency Centrality**:
   All 176 skills form a closed, mathematically validated directed graph verified by `scripts/audit-graph.mjs`. There are zero dangling cross-references across frontend, backend, AI/MCP, FinTech, data engineering, and devops.

5. **Universal Multi-IDE Portability**:
   Works natively out of the box across Google Antigravity (`AGENTS.md`), Anthropic Claude Code (`CLAUDE.md`), Cursor IDE (`.cursorrules`), OpenAI Codex (`CODEX.md`), Windsurf, and Trae.

---

## Quick Benchmarks (Empirical SLA)

From our automated test suite across 42 integration tests and 340 scanned files:
- **Ephemeral Micro-Sandbox Execution**: 1.49 ms (budget < 25 ms)
- **Pre-Disk Verification Gate**: 3.35 ms (budget < 50 ms)
- **AST Symbol Indexing**: 2,259 symbols/sec (budget > 300 sym/s)
- **Hybrid GraphRAG Search (BM25 + TF-IDF Vector)**: 8.48 ms (budget < 60 ms)
- **Deterministic KV-Cache Prefix Compilation**: 109 ms (budget < 500 ms)

---

## Try It in 30 Seconds

```bash
# Super-scaffold a project with bound skills:
npx vibes bootstrap saas my-new-saas
# or
npx vibes bootstrap ai-agent my-agent-swarm

# Launch the visual Studio Cockpit & skill explorer:
npx vibes studio
```

The code is 100% open source under MIT. I'd love to hear your thoughts, feedback, and how your team handles agentic code quality!
