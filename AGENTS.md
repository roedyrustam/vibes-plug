# Core Rule for Vibes-Plug Agents

> **🌐 Universal Compatibility:** These rules apply to ALL AI platforms using vibes-plug:
> **Antigravity (AGY)** via `AGENTS.md` | **Claude Code** via `CLAUDE.md` + `.claude/rules/` | **Cursor IDE** via `.cursorrules` + `.cursor/rules/`
> Each platform has its own entry point, but the core rules and 134+ skills are shared.

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
1. **Decompose and Delegate**: Break down complex tasks into independent sub-tasks and delegate them to specialized subagents using `invoke_subagent`. Assign clear, specific roles to each subagent based on the 134+ specialized skills in `vibes-plug`.
2. **Parallel Execution**: Invoke multiple subagents simultaneously whenever tasks can be performed in parallel (e.g., one subagent researches frontend UI, another analyzes backend DB schema).
3. **Context Sharing**: Ensure subagents are given precise instructions and the necessary context (e.g., passing `CONTEXT_MAP.md`, PRD, or specific file paths). Communicate with active subagents via `send_message`.
4. **Agent Synergy**: Rely on the `vibes-plug` skills ecosystem:
   - For UI/Frontend: Delegate to subagents guided by `senior-frontend`, `ui-components-expert`, `tailwind-expert`, `data-visualization-expert`.
   - For Backend/APIs: Delegate to `js-backend-expert`, `go-programming-expert`, `fastapi`, `api-design-expert`.
   - For AI/MCP: Delegate to `ai-llm-integration-expert`, `ai-media-generation-expert`, `mcp-server-architect`.
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

# LEARNING GRAPH: Skill Ecosystem Gold Standard

This document serves as the persistent memory and standard operating procedure for the `vibes-plug` AI ecosystem. Any AI agent modifying or creating a skill must adhere strictly to these standards.

## 1. File Structure & Frontmatter
Every `SKILL.md` MUST begin with YAML frontmatter:
```yaml
---
name: skill-name
description: Brief description in English / Deskripsi singkat dalam Bahasa Indonesia
author: vibes-plug-swarm
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

## 5. Prohibition of AI Slop
No generic "As an AI language model..." or overly verbose fluff. Instructions must be imperative, direct, and token-efficient. Use `token-saver` guidelines.

> **Memory Graph Update:** 2026-08-12 - Initialized Gold Standard for Swarm Auditors.
