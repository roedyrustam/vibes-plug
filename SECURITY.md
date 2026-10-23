# Security Policy

## Supported Versions

Only the latest minor release series of **Vibes-Plug** receives active security patches and hardening updates.

| Version | Supported          |
| ------- | ------------------ |
| 4.4.x   | :white_check_mark: |
| 4.3.x   | :white_check_mark: |
| < 4.3.0 | :x:                |

## Security Scope

Vibes-Plug enforces strict local execution boundaries across:
- **CLI Scaffolding (`bin/vibes.mjs`)**: Parameterized child process execution (`execFileSync`) and strict `kebab-case` identifier validation to prevent command injection and path traversal.
- **Native & Remote MCP Server (`bin/mcp-server.mjs`)**: Strict localhost loopback binding (`127.0.0.1`), origin verification, request payload size caps (1 MB), and directory confinement on skill read/inject operations.
- **Studio Cockpit (`scripts/studio-server.mjs`)**: Enforced loopback binding (`127.0.0.1`), strict cross-origin rejection (blocking DNS rebinding), and authorized command allowlisting.
- **Self-Healing Runner (`scripts/self-healer.mjs`)**: Strict test runner allowlist (`validateTestCommand`), prohibition of shell metacharacters (`; & | \` $ > < \\ !`), and sanitized process execution.

## Reporting a Vulnerability

If you discover a security vulnerability within Vibes-Plug:
1. **Do not open a public GitHub issue.**
2. Report the vulnerability privately via [GitHub Security Advisories](https://github.com/roedyrustam/vibes-plug/security/advisories/new) or contact the maintainer directly through the repository profile.
3. Include a minimal reproduction case, affected CLI command or MCP tool name, and environment details. You can expect an initial maintainer response within 48 hours.
