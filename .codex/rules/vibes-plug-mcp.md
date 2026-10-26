# Vibes-Plug & XERJ MCP Tools Guide for Codex

Codex connects to the MCP servers configured in `.codex/mcp.json`.

## Active MCP Tools
- `vibes_critic_validate`: Run deep Critic-in-the-Loop audits on files against anti-slop rules before committing.
- `vibes_eval_sql`: Safely simulate, parse, and dry-run PostgreSQL DDL migrations in-memory.
- `vibes_ast_query`: Query symbol definitions, call graphs, and blast-radius across TypeScript and JavaScript.
- `vibes_verify_invariants`: Verify state machine invariants (e.g. billing statuses, order transitions).
- `vibes_visual_audit`: Audit rendered UI elements against Pillar 7 rules (borders, padding, contrast, 5-state contract).
- `vibes_get_skill` / `vibes_list_skills`: Fetch full skill instructions dynamically during active coding.
- `vibes_tool_profile`: Dynamically mask and select tool profiles (core, frontend, backend, security, ai-mcp, full) to slash context tokens.
