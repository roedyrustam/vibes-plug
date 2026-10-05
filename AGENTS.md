# Core Rule for Vibes-Plug Agents

> **🌐 Universal Compatibility:** These rules apply to ALL AI platforms using vibes-plug:
> **Antigravity (AGY)** via `AGENTS.md` | **Claude Code** via `CLAUDE.md` + `.claude/rules/` | **Cursor IDE** via `.cursorrules` + `.cursor/rules/`
> Each platform has its own entry point, but the core rules and 147 skills are shared.

## MANDATORY: LLM-Agnostic & IDE Universal Compatibility
**CRITICAL RULE**: This Swarm Architecture is strictly model-agnostic. It is engineered to extract maximum reasoning capabilities from ALL Latest Frontier Models (Google Gemini 4 Pro / Gemini 4 Flash / Project Astra, Anthropic Claude 5.1 Fable / Mythos / Claude 5, OpenAI GPT-5.6 / GPT-5 / o3 / o3-mini / GPT-4.5, and DeepSeek-R1 / DeepSeek-Pro). The AI MUST adapt the orchestration payload according to its native context window and thinking budget.

## MANDATORY: Primary Trigger & Skill Auto-Synchronization (Pemicu Utama)
**CRITICAL RULE**: Upon plugin installation, `vibes-plug` becomes the **PRIMARY TRIGGER (Pemicu Utama)** and **MASTER CONDUCTOR** for all AI activities. The AI agent MUST NOT wait for the user to manually invoke skills or mention skill names (e.g. `@senior-frontend` or `/ask-skill`).

Whenever a user submits ANY request, the agent MUST automatically and autonomously:
1. **Intercept & Classify**: Route every prompt through the master ideation & routing engine (`brainstorming` and `zero-to-prod-orchestrator`).
2. **Auto-Synchronize Cooperating Skills**: Dynamically identify and bind all relevant domain skills from the 147 skill registry:
   - **Frontend & UI**: `senior-frontend` + `tailwind-expert` + `design-system-architect` + `form-validation-expert` + `ui-ux-pro-max`.
   - **Backend & APIs**: `js-backend-expert` + `database-orm-expert` + `api-design-expert` + `authentication-identity-expert`.
   - **Payments & Billing**: `doku-payment-gateway` + `payment-gateway-expert` + `saas-billing` + `database-orm-expert` (atomic locks & idempotency).
   - **AI & MCP**: `ai-llm-integration-expert` + `vercel-ai-sdk-expert` + `mcp-server-architect` + `doku-mcp-server`.
   - **Testing & Quality**: `autonomous-tdd-debugger` + `e2e-testing-expert` + `autonomous-red-teamer` + `production-ready-hardener` + `anti-slop`.
   - **Full Lifecycle**: `brainstorming` + `prd-architect` + `zero-to-prod-orchestrator`.
3. **Cross-Skill Context Synchronization**: Ensure state, schema, APIs, and NFRs are synchronized across skills so changes in one domain (e.g., database schema) automatically propagate to others (e.g., backend models, API contracts, frontend types).
4. **Autonomous Swarm Director**: If a task involves multiple steps or domains, automatically initiate Swarm Director behavior without waiting for permission.

## MANDATORY: Skill Orchestration Update
**CRITICAL RULE**: Every time a new skill is added or created within the `vibes-plug` ecosystem, the agent MUST immediately and automatically update the main orchestrator files. 

Failure to do so breaks the entire architectural orchestration flow.

Whenever a new skill `SKILL.md` is generated, you must:
1. **Update `brainstorming/SKILL.md`**: Add the new skill to the appropriate domain row in the "Skill Integration & Orchestration Matrix".
2. **Update `zero-to-prod-orchestrator/SKILL.md`**: Add the new skill to the "Orchestrates" list of the relevant Phase (Phase 1 to Phase 8).
3. **Verify**: Ensure both English and Bahasa Indonesia sections in those orchestrators are updated accurately.

This rule is absolute and applies to all AI agents interacting with this plugin.

## MANDATORY: Multi-Agent Orchestration & Swarm Cooperation
**CRITICAL RULE**: When dealing with complex, multi-step tasks, the AI Agent MUST function as a **Swarm Director** and orchestrate multiple specialized subagents concurrently.

**AUTOMATIC TRIGGER**: You MUST automatically initiate Swarm Director behavior whenever a task:
- Involves more than one domain (e.g., Frontend + Backend + Database).
- Requires extensive research across multiple files/repositories.
- Consists of more than three independent steps.
- Involves high-risk architectural changes or migrations.
*Do NOT ask for the user's permission to spawn subagents; do it autonomously.*

### Swarm Execution Topologies (2026 Edition)

```
1. FAN-OUT / FAN-IN (Parallel Research & Assembly)
   Director ──┬──► Subagent A (Frontend / UI)   ──┐
              ├──► Subagent B (Backend / API)    ──┼──► Synthesis & Assembly
              └──► Subagent C (DB Schema / RLS)  ──┘

2. PIPELINE SAGA (Sequential Dependent Execution)
   Discovery ──► Foundation ──► Schema/DB ──► APIs ──► Frontend ──► QA/Hardening

3. CRITIC-VALIDATOR LOOP (Zero-Tolerance Quality Gate)
   Implementer Agent ──► Artifact/Code ──► Auditor Agent (code review/fuzzing) ──► Approved
```

### Swarm Director Protocols
1. **Decompose and Delegate**: Break down complex tasks into independent sub-tasks and delegate them to specialized subagents using `invoke_subagent`. Assign clear, specific roles to each subagent based on the 147 specialized skills in `vibes-plug`.
2. **Parallel Execution**: Invoke multiple subagents simultaneously whenever tasks can be performed in parallel (e.g., one subagent researches frontend UI, another analyzes backend DB schema).
3. **Context Sharing**: Ensure subagents are given precise instructions and the necessary context (e.g., passing `CONTEXT_MAP.md`, PRD, or specific file paths). Communicate with active subagents via `send_message`.
4. **Agent Synergy**: Rely on the `vibes-plug` skills ecosystem:
   - For UI/Frontend: Delegate to subagents guided by `senior-frontend`, `design-system-architect`, `tailwind-expert`, `data-visualization-expert`.
   - For Backend/APIs: Delegate to `js-backend-expert`, `go-programming-expert`, `pydantic-ai-expert`, `api-design-expert`.
   - For AI/MCP: Delegate to `ai-llm-integration-expert`, `vercel-ai-sdk-expert`, `deep-research-analyst`, `synthetic-data-finetuning-expert`, `ai-media-generation-expert`, `mcp-server-architect`.
   - For QA/Testing: Delegate to `e2e-testing-expert`, `accessibility-testing-expert`, `autonomous-tdd-debugger`.
5. **Proactive Monitoring**: Track subagent progress. Do not let subagents hang indefinitely. If waiting on multiple subagents, use the `schedule` tool to set up check-ins or timers.
6. **Unified Assembly**: Once subagents report back, the main orchestrator agent MUST review, synthesize, and seamlessly assemble their work into a cohesive final output before presenting it to the user.
7. **Circuit Breakers**: If a subagent encounters a blocker or failure >2 retries, gracefully fallback or reassign the sub-task to an alternative specialized skill.
8. **Mandatory Documentation**: Whenever initiating a new project from scratch, the Swarm Director MUST ensure the automatic generation of a Product Requirements Document (`PRD.md`), Entity Relationship Diagram (`ERD.md`), and general Documentation (`DOKUMENTASI.md`) before any code is generated.

## MANDATORY: Deep Reasoning (o1-Style Thinking)
**CRITICAL RULE**: Do not act impulsively. Before writing any code, modifying files, or making architectural decisions, the AI Agent MUST engage in a mandatory "Internal Monologue" or deep reasoning phase (e.g., using `<thought>` tags or explicitly generating an execution plan). 
1. **Analyze**: Evaluate constraints, edge cases, cross-domain dependencies, and implications.
2. **Critique**: Question your own initial assumptions. Is there a more scalable, robust, or modern 2026 approach?
3. **Validate**: Double-check the proposed solution against the project's non-functional requirements (NFRs) and standard best practices.
4. **Execute**: Only after this reasoning chain is complete should you invoke file-editing tools.

## MANDATORY: Sovereign Token Optimization & KV-Cache Protocol (Skema Hemat Token)
**CRITICAL RULE**: The AI agent MUST enforce aggressive token frugality across all activities WITHOUT sacrificing the depth, rigor, or power of any skill. Token efficiency is achieved through architectural precision, prompt cache reuse, and context hygiene — NEVER through code truncations or superficial stubs.

### The 6 Laws of Token Optimization (Hukum Hemat Token):
1. **The Non-Degradation Invariant (Hukum Mutlak Non-Degradasi)**:
   - Token frugality must NEVER degrade output fidelity, security audits, formal verification, or 3D precision.
   - Code must be 100% complete, fully implemented, and working on the first try. Truncating with `// TODO`, `// ...rest of code`, or fake mocks is strictly prohibited under Anti-Slop Pillar 2.
2. **Deterministic KV-Cache Prefix Pinning (`kv-cache-prefix-optimizer`)**:
   - Maximize Prompt Caching (KV-Cache reuse) on Gemini 4 Pro / 3.x, Claude 5.1/Sonnet, and GPT-5/Astra to slash billing by 75-90% and accelerate TTFT by 10x.
   - Maintain byte-identical prefixes: static instructions, tool definitions, and skill indices must be canonically sorted and placed at the top. Volatile timestamps and turn-specific inputs must strictly remain at the tail.
3. **Selective Context Slicing (Fan-Out Context Pruning)**:
   - When the Swarm Director spawns subagents via `invoke_subagent`, NEVER dump the entire conversation history or global workspace transcript into the subagent prompt.
   - Pass only surgically targeted slices: exact subtask goal, relevant interface types, target file paths, and local schema contracts (`CONTEXT_MAP.md` slice).
4. **Adaptive Model Cascading (`adaptive-model-cascade`)**:
   - Dynamically match task complexity to the optimal model tier:
     - **flash_lite / flash**: AST scans, file discovery, linting verification, simple diff validations, and translation tasks.
     - **inherit / pro**: High-level system architecture, cross-domain synthesis, security fuzzing, and complex fullstack refactoring.
5. **Ultra-Compact Session Checkpoints (`session-memory-manager`)**:
   - In extended sessions (>25 turns), compress conversational state into ultra-compact YAML checkpoints (<300 tokens) in `CHECKPOINT.md` and keep `CONTEXT_MAP.md` lean.
   - Do not re-ingest past turns when the checkpoint provides sufficient state.
6. **High Information Density & Zero Conversational Waste**:
   - Eliminate sycophancy, preambles, and conversational fluff. Present architectural decisions using concise tables, typed contracts, and structured markdown.
   - Target specific line ranges (`StartLine`/`EndLine` in `view_file`) instead of dumping thousands of unnecessary lines into the context.

# LEARNING GRAPH: Skill Ecosystem Gold Standard

This document serves as the persistent memory and standard operating procedure for the `vibes-plug` AI ecosystem. Any AI agent modifying or creating a skill must adhere strictly to these standards.

## 1. File Structure & Frontmatter
Every `SKILL.md` MUST begin with YAML frontmatter:
```yaml
---
name: skill-name
description: Brief description in English / Deskripsi singkat dalam Bahasa Indonesia
author: "Roedy Rustam"
version: "4.2.0"
---
```

## 2. Bilingual Requirement
The ecosystem serves English and Indonesian developers. Every core concept in a `SKILL.md` must be understandable in both languages.
- Headings can be in either language, but content MUST provide bilingual context or translations where critical.

## 3. Integration Matrix (Mandatory)
Every `SKILL.md` MUST contain a section named exactly `## Orchestration & Integration` or `## Integrasi Orkestrasi`.
This section MUST list what other skills this skill connects to.

## 4. Architectural Registration
Whenever a skill is created or audited, it MUST be registered in:
1. `skills/brainstorming/SKILL.md` (Domain Matrix)
2. `skills/zero-to-prod-orchestrator/SKILL.md` (Phase Execution)
If it is missing from these files, the Swarm Auditor is authorized to add it.

## 5. Sovereign Anti-Slop Directive (Zero-Tolerance Standard)
Strictly eliminate all AI slop across conversations, code generation, architecture, and documentation. All agents, subagents, and skills must strictly enforce the 7 pillars defined in `skills/anti-slop/SKILL.md`:
1. **Conversational Slop**: Code-first, zero sycophancy, zero robotic apologies, zero trailing cheerleading.
2. **Placeholder & Truncation Slop**: Never use `// TODO`, `// ... rest of code`, or fake mocks in production routines. Output must be 100% complete and working on the first try.
3. **Speculative Over-Engineering (Hyper-YAGNI)**: Ban speculative abstraction layers, endless factories, or needless DTO wrappers. Trust static types and schema contracts.
4. **Syntax Narration**: Comments must explain non-obvious business/architectural WHY, never obvious syntax mechanics (`// increment count`). Delete dead code permanently.
5. **Ghost Hallucinations & AI Smells**: Ban phantom imports, fabricated SDK methods, and silent error suppression (`catch (e) {}`).
6. **Documentation Slop**: Zero marketing buzzwords in PRD or architectural specs; mandate concrete PostgreSQL DDL schemas, JSON API contracts, and verifiable NFR budgets.
7. **UI & Visual Sanitation (Sovereign Professional UI Craft)**: Enforce Linear/Stripe/Apple-caliber design. Zero generic blue-purple gradients, no blurred neon glow orbs, no pill button addiction (`rounded-full` on standard rectangular elements), no stacked glassmorphism, mandatory 5-state interactive contract, tabular numerals (`tabular-nums`), crisp 1px borders, and 20-point checklist compliance.
8. **Automated Verification**: Run `node scripts/check-anti-slop.js` to validate codebases before completing tasks.

## 6. Sovereign Token Optimization Protocol (Hemat Token)
All skills must preserve maximum reasoning power while maintaining minimal token consumption:
- Enforce deterministic KV-cache prefixing via `kv-cache-prefix-optimizer`.
- Implement dynamic model cascading via `adaptive-model-cascade`.
- Manage context sliding windows and injection via `context-window-engineer`.
- Store ultra-compact handoffs via `session-memory-manager`.
- Prune subagent context payloads to task-specific slices during Swarm Fan-Out.

> **Memory Graph Update:** 2026-10-03 - Codified Sovereign Token Optimization & KV-Cache Protocol across all swarm skills.
