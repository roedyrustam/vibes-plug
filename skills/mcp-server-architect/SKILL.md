---
name: mcp-server-architect
description: "Ultimate guide for designing, building, and security-hardening modern AI Tools/Bots via Model Context Protocol (MCP) in TypeScript and Python / Panduan utama merancang, membangun, dan mengamankan AI Tools/Bots modern melalui Model Context Protocol (MCP) dalam TypeScript dan Python."
author: vibes-plug-swarm
---

# MCP Server Architect (Modern AI Tools)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills: `ai-llm-integration-expert` for core LLM routing and RAG pipelines, and `doku-mcp-server` for payments integration examples. Ensure cohesive execution when spawning subagents.

### Description
Ultimate guide for building modern AI Tools/Bots via Model Context Protocol (MCP). Enforces the use of `FastMCP` (Python) and `@modelcontextprotocol/sdk` (TypeScript). Mandates strict security guardrails and guidelines for stateful, real-time MCP servers.

### Trigger Conditions
- Building an MCP server to expose tools, resources, or prompt templates to AI agents.
- Integrating APIs or Databases as MCP tools.
- Implementing stateful, real-time MCP servers (streaming, tailing logs, live dashboarding).
- Securing MCP servers exposing sensitive endpoints.

### SDK Selection (Mandatory)
Use only the following official modern SDKs to build MCP servers:
1. **Python**: `FastMCP` (provides FastAPI-like developer experience for MCP).
2. **TypeScript**: `@modelcontextprotocol/sdk` (standard JS/TS implementation).

### Building Stateful, Real-Time MCP Servers
Modern agents demand real-time telemetry and stateful context.
- **Streaming Data**: Use MCP's streamable transports (like Streamable HTTP) or push-based resource updates to stream continuous data chunks to the client.
- **Tailing Logs**: Implement resources with dynamic URIs (e.g., `logs://{service}/{tail}`) and utilize resource subscriptions. When new logs append, emit resource update notifications to the client.
- **Live Dashboarding**: Expose live metrics via resources. Use background workers to poll system state and push updates to the LLM UI or client agent via MCP notifications, keeping dashboard contexts fresh without manual polling.

### Security Guardrails
Enforce these security mechanisms for any MCP server exposing sensitive APIs or Databases:
- **OAuth Integration**: Implement standard OAuth 2.0 / 2.1 authorization flows. Bind session tokens to the MCP transport layer. Never accept raw API keys over unencrypted channels.
- **Strict Rate-Limiting**: Apply token bucket or leaky bucket rate limiting per session/user. Prevent LLM looping from executing denial-of-service on upstream APIs.
- **Row-Level Security (RLS)**: When querying databases directly, pass the authenticated user's identity to the database driver and enforce RLS at the database level. Never fetch all rows and filter in-memory.
- **Input Validation**: Use `zod` (TS) or `pydantic` (Python) to strictly validate all tool arguments. Sanitize all LLM inputs to prevent prompt injection or SQL injection.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi dengan skill domain relevan: `ai-llm-integration-expert` untuk perutean LLM inti dan pipeline RAG, serta `doku-mcp-server` untuk contoh integrasi pembayaran. Pastikan eksekusi yang padu saat menjalankan subagent.

### Deskripsi
Panduan utama untuk membangun AI Tools/Bots modern via Model Context Protocol (MCP). Memaksakan penggunaan `FastMCP` (Python) dan `@modelcontextprotocol/sdk` (TypeScript). Mewajibkan pengamanan ketat dan panduan untuk server MCP stateful dan real-time.

### Kondisi Pemicu
- Membangun server MCP untuk mengekspos alat, resource, atau prompt ke agen AI.
- Mengintegrasikan API atau Database sebagai alat MCP.
- Mengimplementasikan server MCP stateful dan real-time (streaming, tailing log, dashboard langsung).
- Mengamankan server MCP yang mengekspos endpoint sensitif.

### Pemilihan SDK (Wajib)
Gunakan hanya SDK modern resmi berikut untuk membangun server MCP:
1. **Python**: `FastMCP` (memberikan pengalaman developer ala FastAPI untuk MCP).
2. **TypeScript**: `@modelcontextprotocol/sdk` (implementasi standar JS/TS).

### Membangun Server MCP Stateful & Real-Time
Agen modern membutuhkan telemetri real-time dan konteks stateful.
- **Streaming Data**: Gunakan transport streamable MCP (seperti Streamable HTTP) atau pembaruan resource berbasis push untuk mengirim data berkelanjutan ke klien.
- **Tailing Logs**: Implementasikan resource dengan URI dinamis (mis. `logs://{service}/{tail}`) dan manfaatkan langganan resource (subscriptions). Saat log baru masuk, pancarkan notifikasi pembaruan resource ke klien.
- **Live Dashboarding**: Ekspos metrik langsung melalui resource. Gunakan pekerja latar belakang untuk memantau status sistem dan mendorong pembaruan ke agen klien melalui notifikasi MCP, menjaga konteks dashboard tetap segar.

### Keamanan (Guardrails)
Terapkan mekanisme keamanan ini untuk setiap server MCP yang mengekspos API atau Database sensitif:
- **Integrasi OAuth**: Implementasikan alur otorisasi OAuth 2.0 / 2.1 standar. Ikat token sesi ke lapisan transport MCP. Jangan pernah menerima API key mentah melalui saluran yang tidak dienkripsi.
- **Rate-Limiting Ketat**: Terapkan pembatasan rate per sesi/pengguna. Cegah agen LLM melakukan denial-of-service pada API hulu karena looping.
- **Row-Level Security (RLS)**: Saat melakukan kueri ke database secara langsung, teruskan identitas pengguna yang diautentikasi ke driver database dan berlakukan RLS di tingkat database.
- **Validasi Input**: Gunakan `zod` (TS) atau `pydantic` (Python) untuk memvalidasi semua argumen tool secara ketat. Bersihkan semua input dari LLM untuk mencegah injeksi prompt atau SQL.
