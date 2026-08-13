# Core Rule for Vibes-Plug Agents

## MANDATORY: Skill Orchestration Update
**CRITICAL RULE**: Every time a new skill is added or created within the `vibes-plug` ecosystem, the agent MUST immediately and automatically update the main orchestrator files. 

Failure to do so breaks the entire architectural orchestration flow.

Whenever a new skill `SKILL.md` is generated, you must:
1. **Update `brainstorming/SKILL.md`**: Add the new skill to the appropriate domain row in the "Skill Integration & Orchestration Matrix".
2. **Update `zero-to-prod-orchestrator/SKILL.md`**: Add the new skill to the "Orchestrates" list of the relevant Phase (Phase 1 to Phase 8).
3. **Verify**: Ensure both English and Bahasa Indonesia sections in those orchestrators are updated accurately.

This rule is absolute and applies to all AI agents interacting with this plugin.

## MANDATORY: Multi-Agent Orchestration & Swarm Cooperation
**CRITICAL RULE**: When dealing with complex, multi-step tasks, the AI Agent MUST function as a Swarm Director and orchestrate multiple subagents concurrently.

**AUTOMATIC TRIGGER**: You MUST automatically initiate this Swarm Director behavior whenever a task involves more than one domain (e.g., Frontend + Backend), requires extensive research across multiple files, or consists of more than three independent steps. Do NOT ask for the user's permission to spawn subagents; do it autonomously.

1. **Decompose and Delegate**: Break down complex tasks into independent sub-tasks and delegate them to specialized subagents using `invoke_subagent`. Assign clear, specific roles to each subagent based on the specialized skills in `vibes-plug`.
2. **Parallel Execution**: Invoke multiple subagents simultaneously whenever tasks can be performed in parallel (e.g., one subagent researches frontend UI, another analyzes backend DB schema).
3. **Context Sharing**: Ensure subagents are given precise instructions and the necessary context (e.g., passing `CONTEXT_MAP.md`, PRD, or specific file paths). Communicate with active subagents via `send_message`.
4. **Agent Synergy**: Rely on the `vibes-plug` skills ecosystem. For example, if a task needs UI design, spawn a subagent guided by `ui-components-expert`; if it needs backend logic, spawn one with `js-backend-expert` or `go-programming-expert`.
5. **Proactive Monitoring**: Track subagent progress. Do not let subagents hang indefinitely. If waiting on multiple subagents, use the `schedule` tool to set up check-ins or timers.
6. **Unified Assembly**: Once subagents report back, the main orchestrator agent MUST review, synthesize, and seamlessly assemble their work into a cohesive final output before presenting it to the user.
7. **Mandatory Documentation**: Whenever initiating a new project from scratch, the Swarm Director MUST ensure the automatic generation of a Product Requirements Document (`PRD.md`), Entity Relationship Diagram (`ERD.md`), and general Documentation (`DOKUMENTASI.md`) before any code is generated.

## MANDATORY: Deep Reasoning (o1-Style Thinking)
**CRITICAL RULE**: Do not act impulsively. Before writing any code, modifying files, or making architectural decisions, the AI Agent MUST engage in a mandatory "Internal Monologue" or deep reasoning phase (e.g., using `<thought>` tags or explicitly generating an execution plan). 
1. **Analyze**: Evaluate constraints, edge cases, and implications.
2. **Critique**: Question your own initial assumptions. Is there a more scalable or modern way?
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
