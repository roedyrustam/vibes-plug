---
name: mcp-server-architect
description: "Expert guide for designing, building, and security-hardening Model Context Protocol (MCP) servers and tool integrations in TypeScript, Python, and Go / Panduan ahli merancang, membangun, dan mengamankan server Model Context Protocol (MCP) dan integrasi tool dalam TypeScript, Python, dan Go."
author: "Roedy Rustam"
---

# Model Context Protocol (MCP) Server Architect

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade architecture guide for designing, building, testing, and securing **Model Context Protocol (MCP)** servers. MCP is the open protocol standardizing how Artificial Intelligence (AI) agents (such as Claude Desktop, Antigravity, Cursor, Windsurf, and custom LLM applications) discover and execute tools, read structured resources, and load prompt templates over JSON-RPC 2.0.

### Trigger Conditions
- Designing or implementing a custom MCP Server in **TypeScript**, **Python**, or **Go**.
- Exposing databases, APIs, local CLI tools, or cloud infrastructure to AI agents.
- Configuring MCP transports (`stdio` for local desktop tools, `SSE` over HTTP for remote microservices).
- Hardening MCP tool security (input validation via Zod/Pydantic, permission scoping, prompt injection mitigation).
- Debugging MCP JSON-RPC protocol messages or tool execution failures.

### Core Protocol Architecture (MCP Primitives)

```
+-------------------+      JSON-RPC 2.0 (stdio / SSE)      +-------------------+
|     MCP Client    | <=================================> |     MCP Server    |
| (AI Agent / IDE)  |                                      | (Tools/Resources) |
+-------------------+                                      +-------------------+
```

1. **Tools**: Executable functions exposed to the AI agent (`tools/list`, `tools/call`). Must return structured content arrays (text, images, embedded resources).
2. **Resources**: Passive data sources read by the LLM (`resources/list`, `resources/read`). Identified by URIs (e.g., `postgres://db/users`, `file:///logs/app.log`).
3. **Prompts**: Reusable prompt templates with parameter substitution (`prompts/list`, `prompts/get`).
4. **Transports**:
   - **`stdio`**: Standard Input/Output transport for local CLI scripts and desktop apps (zero network overhead).
   - **`SSE` (Server-Sent Events)**: HTTP-based transport for remote services, microservices, and containerized deployments.

---

### Implementation Examples

#### TypeScript (`@modelcontextprotocol/sdk`)
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-database-mcp',
  version: '1.0.0',
});

// Register an executable tool with strict Zod schema validation
server.tool(
  'query-users',
  {
    role: z.enum(['admin', 'user']),
    limit: z.number().min(1).max(100).default(10),
  },
  async ({ role, limit }) => {
    const users = await db.query(`SELECT id, email FROM users WHERE role = $1 LIMIT $2`, [role, limit]);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(users, null, 2),
        },
      ],
    };
  }
);

// Connect via stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
```

#### Python (`mcp` / `FastMCP`)
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-service")

@mcp.tool()
def get_temperature(city: str) -> str:
    """Fetch current temperature for a given city."""
    # Input parameter city is automatically validated
    return f"The current temperature in {city} is 24°C."

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

### Security Guardrails & Best Practices
- **Least Privilege**: Grant MCP tools access only to specific paths or read-only database roles.
- **Never Execute Arbitrary Shell/SQL**: Avoid exposing wildcard shell commands (`exec(cmd)`) or raw unparameterized SQL (`db.query(raw_string)`).
- **Sanitize Input**: Validate all tool inputs against strict Zod/Pydantic schemas to prevent prompt injection payload execution.
- **User Confirmation**: Require explicit human approval for destructive operations (`DELETE`, `DROP`, external payment triggers).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan arsitektur tingkat produksi untuk merancang, membangun, menguji, dan mengamankan server **Model Context Protocol (MCP)**. MCP adalah standar protokol terbuka yang menyelaraskan cara agen Kecerdasan Buatan (AI) (seperti Claude Desktop, Antigravity, Cursor, Windsurf, dan aplikasi LLM kustom) menemukan dan mengeksekusi *tools*, membaca *resources* terstruktur, dan memuat *prompt templates* melalui transport JSON-RPC 2.0.

### Kondisi Pemicu
- Merancang atau mengimplementasikan MCP Server kustom dalam **TypeScript**, **Python**, atau **Go**.
- Mengekspos database, API, alat CLI lokal, atau infrastruktur cloud ke agen AI.
- Mengonfigurasi transport MCP (`stdio` untuk alat desktop lokal, `SSE` melalui HTTP untuk microservice remote).
- Mengamankan alat MCP (validasi input via Zod/Pydantic, pembatasan hak akses, mitigasi *prompt injection*).
- Men-debug pesan protokol JSON-RPC MCP atau kegagalan eksekusi alat.

### Arsitektur Inti Protokol (MCP Primitives)

1. **Tools**: Fungsi eksekusi yang diekspos ke agen AI (`tools/list`, `tools/call`). Wajib mengembalikan array konten terstruktur (teks, gambar, resource tersemat).
2. **Resources**: Sumber data pasif yang dibaca oleh LLM (`resources/list`, `resources/read`). Diidentifikasi melalui URI (misal: `postgres://db/users`, `file:///logs/app.log`).
3. **Prompts**: Template prompt yang dapat digunakan kembali dengan substitusi parameter (`prompts/list`, `prompts/get`).
4. **Transports**:
   - **`stdio`**: Transport Standard Input/Output untuk skrip CLI dan aplikasi desktop lokal (tanpa overhead jaringan).
   - **`SSE` (Server-Sent Events)**: Transport berbasis HTTP untuk layanan remote dan deployment dalam container.

---

### Panduan Keamanan & Praktik Terbaik
- **Hak Akses Minimum (Least Privilege)**: Berikan akses alat MCP hanya ke direktori yang spesifik atau role database *read-only*.
- **Jangan Pernah Eksekusi Shell/SQL Bebas**: Hindari mengekspos perintah shell bebas (`exec(cmd)`) atau kueri SQL mentah tanpa parameterization.
- **Sanitasi Input**: Validasi semua parameter masuk menggunakan skema Zod/Pydantic yang ketat untuk mencegah serangan *prompt injection*.
- **Konfirmasi Pengguna**: Wajibkan persetujuan manusia secara eksplisit untuk operasi destruktif (`DELETE`, `DROP`, pemicu pembayaran eksternal).
