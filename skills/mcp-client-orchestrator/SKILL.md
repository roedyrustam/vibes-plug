---
name: mcp-client-orchestrator
description: "Expert guide for the AI Agent to dynamically orchestrate and consume external MCP (Model Context Protocol) servers, giving it real-time superpowers over databases, GitHub, Slack, and local files."
author: "vibes-plug-swarm"
---

# MCP Client Orchestrator

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
While `mcp-server-architect` teaches the agent how to *build* servers, this skill teaches the agent how to **consume** them as an MCP Client. This grants the agent "superpowers" by securely interacting with local PostgreSQL databases, GitHub repos, Figma APIs, and Slack channels in real-time, autonomously, using available MCP tool sets.

### Trigger Conditions
Activate this skill when:
- The user asks the agent to query the database, but the agent doesn't have a direct SQL tool.
- The user needs real-time context from an external system (e.g., "Read the latest Slack messages about this bug").
- The user wants the agent to orchestrate multiple tools across different domains simultaneously.

### Core Concepts

#### 1. MCP Resource & Tool Discovery
Before assuming a capability doesn't exist, the agent should dynamically inspect available tools.
- Use `list_resources` or check `mcp_config.json` to see what servers are running.
- Understand that MCP tools proxy capabilities securely. If there's a `postgres_mcp`, the agent can execute `execute_sql` through it.

#### 2. Workflow Orchestration
Example: "Find the bug reported on GitHub and fix it."
1. Use the GitHub MCP to `search_issues`.
2. Extract the stack trace from the issue comment.
3. Use `grep_search` to find the failing code.
4. Use `autonomous-tdd-debugger` to fix and test it.
5. Use the GitHub MCP to `create_pull_request`.

### Best Practices
- **Never guess schema:** Always use MCP tools like `list_tables` or `get_schema` before writing a query.
- **Respect Rate Limits:** If calling external APIs via MCP, avoid looping rapidly without timeouts.

---

### Integration with Other Skills (MANDATORY)
- `doku-mcp-server` — An example of a specific MCP server the agent can orchestrate.
- `ai-llm-integration-expert` — Provides context on how MCP fits into the broader LangGraph/AI landscape.
- `multi-agent-orchestration` — Used when delegating different MCP tool calls to specialized subagents.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "AI & LLM Integration".
- `zero-to-prod-orchestrator` — Phase 4 (AI Agents).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Skill yang memandu Agen AI tentang cara menggunakan (consume) server Model Context Protocol (MCP) eksternal, memberikan kekuatan *real-time* untuk berinteraksi dengan Database, GitHub, Slack, dan sistem lainnya secara otonom.

### Kondisi Pemicu
- Saat Anda (sebagai agen) perlu mengeksekusi SQL ke database lokal/remote namun tidak memiliki akses terminal langsung.
- Saat Anda perlu membaca data *live* dari platform eksternal (Figma, GitHub, dll).

### Panduan Singkat
- **Eksplorasi Tool:** Selalu periksa tool MCP yang tersedia di sistem (misal `list_tables` atau `read_issue`). Jangan berasumsi Anda buta terhadap dunia luar jika server MCP-nya aktif.
- **Orkestrasi Lintas Platform:** Anda dapat membaca pesan error di Slack via MCP, mencari kode yang relevan di *file system*, memperbaikinya, dan membuat Pull Request di GitHub via MCP secara otomatis. Ini adalah definisi sebenarnya dari Agen Otonom.
- **Validasi Skema:** Jangan pernah menebak nama tabel. Selalu gunakan tool MCP untuk mengambil skema database terlebih dahulu sebelum menjalankan kueri `execute_sql`.
