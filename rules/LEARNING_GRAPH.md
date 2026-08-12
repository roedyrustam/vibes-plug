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
