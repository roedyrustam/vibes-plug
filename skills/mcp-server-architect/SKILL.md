---
name: mcp-server-architect
description: "Expert guide for designing, building, and security-hardening Model Context Protocol (MCP) servers and tool integrations in TypeScript, Python, and Go / Panduan ahli merancang, membangun, dan mengamankan server Model Context Protocol (MCP) dan integrasi tool dalam TypeScript, Python, dan Go."
author: "Roedy Rustam"
---

# MCP Server Architect (v1.9+ Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for designing, building, and security-hardening **Model Context Protocol (MCP)** servers and client integrations. Covers MCP v1.9+ specification (including the new Streamable HTTP transport), tool/resource/prompt design, Zod validation, OAuth 2.1 authorization, and multi-server orchestration patterns for production AI applications.

### Trigger Conditions
- Building an MCP server to expose tools, resources, or prompt templates to AI agents.
- Integrating third-party APIs or databases as MCP tools for LLM consumption.
- Implementing MCP client logic in an AI agent or chatbot.
- Securing MCP servers with OAuth 2.1 and permission scoping.
- Deploying MCP servers to edge/serverless environments.

### MCP v1.9+ Specification Overview

MCP standardizes how AI models interact with external tools and data. The 2026 specification (v1.9) introduces:

| Feature | Description |
|---|---|
| **Streamable HTTP** | New bidirectional transport via HTTP streaming — replaces SSE for cloud deployments |
| **stdio** | Original transport for local/CLI tools — still recommended for local MCP |
| **OAuth 2.1** | Standard authorization flow for MCP servers requiring user consent |
| **Tool Annotations** | `readOnlyHint`, `destructiveHint`, `idempotentHint` for safer agent decisions |
| **Audio Content** | Support for audio data in tool responses |
| **Resource Links** | Resources can now link to external URIs |

### Core MCP Concepts

| Primitive | What It Is | Example |
|---|---|---|
| **Tool** | Executable function the LLM can call | `search_database`, `send_email` |
| **Resource** | Read-only data the LLM can read | File contents, DB records |
| **Prompt** | Reusable prompt templates | `code_review_prompt` |
| **Sampling** | Server requests LLM completion | Agent asks LLM to classify |

### Building an MCP Server (TypeScript)

#### 1. Setup with `@modelcontextprotocol/sdk`
```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-api-server',
  version: '1.0.0',
});
```

#### 2. Define Tools with Zod Validation
```typescript
server.tool(
  'search_products',
  'Search the product catalog by query and category',
  {
    query: z.string().min(1).describe('Search query string'),
    category: z.enum(['electronics', 'clothing', 'books']).optional(),
    limit: z.number().int().min(1).max(50).default(10),
  },
  {
    readOnlyHint: true,     // v1.9 annotation: this tool does not modify state
    idempotentHint: true,   // safe to call multiple times
  },
  async ({ query, category, limit }) => {
    const results = await productDB.search({ query, category, limit });
    return {
      content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
    };
  }
);
```

#### 3. Expose Resources
```typescript
server.resource(
  'company-docs',
  'docs://{path}',
  { mimeType: 'text/markdown' },
  async (uri) => {
    const path = uri.pathname;
    const content = await fs.readFile(`./docs${path}`, 'utf-8');
    return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: content }] };
  }
);
```

#### 4. Streamable HTTP Transport (v1.9 — Production Deployment)
```typescript
import express from 'express';

const app = express();
app.use(express.json());

app.all('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000, () => console.log('MCP Server running on :3000'));
```

#### 5. OAuth 2.1 Authorization (Secure MCP)
For MCP servers requiring user consent (e.g., accessing user's GitHub repos):
```typescript
import { ProxyOAuthServerProvider } from '@modelcontextprotocol/sdk/server/auth/providers/proxyOAuth.js';

const authProvider = new ProxyOAuthServerProvider({
  endpoints: {
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
  },
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  scopes: ['repo', 'read:user'],
});

server.setAuthProvider(authProvider);
```

### Security Hardening

- **Validate ALL inputs**: Every tool parameter must be validated with Zod before execution. Never trust LLM-generated inputs directly.
- **Principle of Least Privilege**: Each tool should only request the minimum permissions needed.
- **Rate Limiting**: Implement per-session rate limits to prevent prompt injection loops.
- **Sanitize Outputs**: Never return raw database records with sensitive fields (passwords, API keys). Always filter/select only what's needed.
- **Audit Logging**: Log every tool call with session ID, tool name, parameters, and result status.
- **Tool Annotations**: Use `destructiveHint: true` for tools that modify or delete data — agents should ask for human confirmation before calling these.

### Multi-Server Orchestration
When building AI apps with multiple MCP servers:
```typescript
// Client connecting to multiple MCP servers
const client = new McpClient({ name: 'my-agent', version: '1.0.0' });

// Connect to multiple specialized servers
await client.connect(new StdioTransport({ command: 'node', args: ['file-server.js'] }));
await client.connect(new StreamableHTTPTransport({ url: 'https://api.mydb.com/mcp' }));

// List all available tools across servers
const { tools } = await client.listTools();
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk merancang, membangun, dan mengamankan server **Model Context Protocol (MCP)** dan integrasi klien. Mencakup spesifikasi MCP v1.9+ (termasuk transport Streamable HTTP baru), desain tool/resource/prompt, validasi Zod, otorisasi OAuth 2.1, dan pola orkestrasi multi-server untuk aplikasi AI produksi.

### Kondisi Pemicu
- Membangun MCP server untuk mengekspos tool, resource, atau prompt template ke agen AI.
- Mengintegrasikan API pihak ketiga atau database sebagai MCP tool untuk konsumsi LLM.
- Mengimplementasikan logika klien MCP dalam agen AI atau chatbot.
- Mengamankan MCP server dengan OAuth 2.1 dan pembatasan izin.
- Men-deploy MCP server ke lingkungan edge/serverless.

### Ringkasan Spesifikasi MCP v1.9+

MCP menstandarisasi cara model AI berinteraksi dengan tool dan data eksternal. Spesifikasi 2026 (v1.9) memperkenalkan:
- **Streamable HTTP**: Transport dua arah baru via HTTP streaming — menggantikan SSE untuk deployment cloud.
- **Tool Annotations**: `readOnlyHint`, `destructiveHint`, `idempotentHint` untuk keputusan agen yang lebih aman.
- **OAuth 2.1**: Alur otorisasi standar untuk MCP server yang memerlukan izin pengguna.

### Membangun MCP Server (TypeScript)

Gunakan `@modelcontextprotocol/sdk` untuk TypeScript. Definisikan tool dengan validasi Zod yang ketat, tambahkan anotasi v1.9 (`readOnlyHint`, `destructiveHint`), dan gunakan Streamable HTTP transport untuk deployment cloud produksi.

### Keamanan MCP

- **Validasi SEMUA input**: Setiap parameter tool harus divalidasi dengan Zod sebelum eksekusi.
- **Prinsip Least Privilege**: Setiap tool hanya boleh meminta izin minimum yang diperlukan.
- **Rate Limiting**: Batasi panggilan per sesi untuk mencegah loop prompt injection.
- **Sanitasi Output**: Jangan pernah mengembalikan field sensitif (password, API key).
- **Audit Logging**: Catat setiap panggilan tool dengan session ID, nama tool, parameter, dan status hasil.
- **Anotasi Tool**: Gunakan `destructiveHint: true` untuk tool yang memodifikasi/menghapus data — agen harus meminta konfirmasi manusia sebelum memanggilnya.

### Orkestrasi Multi-Server
Klien MCP dapat terhubung ke beberapa server sekaligus, menyatukan semua tool dari server yang berbeda menjadi satu daftar yang tersedia untuk agen.
