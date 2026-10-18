## 📋 Description
<!-- Provide a concise description of the changes introduced in this pull request. -->

## 🎯 Type of Change
- [ ] 🌟 New Skill (`skills/<skill-name>`)
- [ ] ⚡ Enhancement to an existing Skill
- [ ] 🤖 Subagent / Swarm Orchestrator update
- [ ] 🛠️ CLI (`bin/vibes.mjs`), MCP Server, or Studio Cockpit tooling
- [ ] 📚 Documentation, Catalog, or Rules update
- [ ] 🐛 Bug fix / CI / Test remediation

---

## 🔍 Skill Contribution Checklist
*(Complete this section only if adding or updating a skill)*

- [ ] Folder uses valid **kebab-case** under `skills/` (e.g. `skills/trpc-expert`)
- [ ] Contains a valid `SKILL.md` with complete YAML frontmatter (`name`, `description`, `author`, `version`)
- [ ] Document includes required headings: `# Skill Name`, `## Description`, `## Instructions`
- [ ] **Mandatory Orchestration Section**: Includes `## Orchestration & Integration` listing cooperating skills
- [ ] **Trigger Conditions**: Includes `## Trigger Conditions`
- [ ] Registered in [`README.md`](file:///README.md) under the appropriate category
- [ ] Registered in [`CATALOG.md`](file:///CATALOG.md) and [`CATALOG.json`](file:///CATALOG.json)
- [ ] Registered in [`skills/brainstorming/SKILL.md`](file:///skills/brainstorming/SKILL.md) (*Skill Integration & Orchestration Matrix*)
- [ ] Registered in [`skills/zero-to-prod-orchestrator/SKILL.md`](file:///skills/zero-to-prod-orchestrator/SKILL.md) (*Phase Execution*)
- [ ] Bilingual support included (English and Bahasa Indonesia context)

---

## 🛡️ Sovereign Anti-Slop Directive (Zero-Tolerance)
- [ ] **No Lazy Placeholders**: Zero `// TODO`, `// ...rest of code`, or fake mocks. Code is 100% complete and working.
- [ ] **5-State UI Contract**: Interactive UI components implement all 5 states (`default`, `hover`, `focus-visible`, `active`, `disabled`).
- [ ] **Hyper-YAGNI**: No speculative abstractions, endless factory boilerplate, or empty try-catch blocks.
- [ ] **Syntax Narration Free**: Comments explain business/architectural *why*, not obvious syntax mechanics.

---

## 🧪 Local Verification & Tests
Before submitting, please ensure you have executed:
- [ ] `node scripts/update_skills.mjs` (Standardize skill markdown and frontmatter)
- [ ] `npm test` (Runs validation, strict anti-slop check, and CLI test suite — **100% Green / Zero Errors**)
