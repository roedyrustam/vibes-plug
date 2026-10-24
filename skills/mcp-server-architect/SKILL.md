---
name: mcp-server-architect
description: "Ultimate guide for designing, building, and security-hardening modern AI Tools/Bots via Model Context Protocol (MCP v1.x) in TypeScript and Python / Panduan utama merancang, membangun, dan mengamankan AI Tools/Bots modern melalui Model Context Protocol (MCP) dalam TypeScript dan Python."
author: "Roedy Rustam"
version: "4.4.2"

---

# MCP Server Architect (Modern AI Tools & Agentic Protocol)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream AI Models & Protocol**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `mcp-sampling-critic`
- **Agent Clients & Swarms**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `gemini-agent-booster`
- **Domain Server Implementations**: `doku-mcp-server`, `xerj-search-expert`, `database-orm-expert`
- **Security & Authorization**: `zero-trust-secret-vault`, `authentication-identity-expert`, `prompt-injection-firewall`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Description
Ultimate architectural guide for engineering high-performance, production-ready AI Tools/Bots via the **Model Context Protocol (MCP v1.x)**. Enforces the use of `FastMCP` (Python) and `@modelcontextprotocol/sdk` (TypeScript). Mandates strict security guardrails, schema validation, stateful resource streaming, and support for both Standard Stdio and Streamable HTTP / Server-Sent Events (SSE) transports.

### Trigger Conditions
- Building an MCP server to expose tools, resources, or prompt templates to AI agents.
- Integrating backend APIs, file systems, or databases as MCP agent tools.
- Implementing stateful, real-time MCP servers (resource subscriptions, log tailing, live metrics).
- Securing and auditing MCP servers exposing sensitive financial or production data.

---

### SDK Selection (Mandatory Standard)
1. **Python**: `FastMCP` (FastAPI-like high-level DX for MCP tools, resources, and prompt templates).
2. **TypeScript**: `@modelcontextprotocol/sdk` (official SDK using the `McpServer` high-level abstraction with `zod`).

---

### Production Implementation Recipes

#### Recipe 1: Production TypeScript MCP Server (Streamable HTTP / SSE)
```typescript
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { z } from 'zod';

// Initialize the high-level MCP Server
const server = new McpServer({
  name: 'enterprise-analytics-mcp',
  version: '1.0.0',
});

// Register a type-safe Tool with Zod validation
server.tool(
  'calculate_metrics',
  'Calculates business analytics metrics across timeframes',
  {
    metricName: z.enum(['arr', 'churn', 'cac', 'ltv']).describe('The metric to compute'),
    quarter: z.string().regex(/^Q[1-4]-202[0-9]$/).describe('Target quarter, e.g., Q1-2026'),
  },
  async ({ metricName, quarter }) => {
    // Implement business logic with database access
    const mockData = { arr: '$2.4M', churn: '1.2%', cac: '$450', ltv: '$9,200' };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ metric: metricName, quarter, value: mockData[metricName] }),
        },
      ],
    };
  }
);

// Register a Resource Template with dynamic URI
server.resource(
  'system_health',
  new ResourceTemplate('system://health/{service}', { list: undefined }),
  async (uri, { service }) => {
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ service, status: 'HEALTHY', latencyMs: 14, timestamp: new Date().toISOString() }),
        },
      ],
    };
  }
);

// Expose via Express with SSE Transport
const app = express();
let transport: SSEServerTransport | null = null;

app.get('/sse', async (req, res) => {
  transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('Transport not established');
  }
});

app.listen(3001, () => {
  console.log('MCP Server listening on http://localhost:3001/sse');
});
```

#### Recipe 2: Production FastMCP Server (Python)
```python
from fastmcp import FastMCP, Context
from pydantic import BaseModel, Field
from typing import Literal

mcp = FastMCP("enterprise-vault-mcp", dependencies=["pydantic"])

class QueryParams(BaseModel):
    account_id: str = Field(..., description="UUID of customer account")
    status_filter: Literal["active", "suspended", "all"] = Field("active", description="Status filter")

@mcp.tool(name="fetch_account_summary", description="Retrieves account telemetry and balance")
async def fetch_account_summary(params: QueryParams, ctx: Context) -> str:
    ctx.info(f"Auditing request for account: {params.account_id}")
    
    # Secure business logic with RLS validation
    result = {
        "account_id": params.account_id,
        "balance_usd": 125430.50,
        "tier": "enterprise",
        "status": params.status_filter
    }
    return str(result)

@mcp.resource("config://app-settings")
def get_app_settings() -> str:
    """Provides application configuration context to the agent."""
    return '{"environment": "production", "rate_limit_rpm": 600, "region": "ap-southeast-1"}'

if __name__ == "__main__":
    # Runs standard Stdio transport or streamable HTTP
    mcp.run(transport="stdio")
```

---

### Security & Operational Guardrails
1. **OAuth 2.1 & Bearer Authentication**: Bind session tokens to transport connections. Validate claims before executing any tool logic.
2. **Schema Strictness**: Never use untyped payloads. Every argument must have explicit types, range constraints, and descriptions to guide LLM tool-calling accuracy.
3. **Row-Level Security (RLS)**: Enforce tenant and user context propagation to the database layer.
4. **Circuit Breakers & Rate Limits**: Cap consecutive tool executions per agent turn to prevent endless agentic recursive loops.
5. **Idempotency**: All destructive or state-mutating tools must require an `idempotency_key` argument.

### Agent MCP Client Consumption & Tool Discovery
When acting as an AI Agent consuming external MCP servers:
1. **Dynamic Tool Discovery**: Check `list_resources` or `mcp_config.json` before assuming external capabilities do not exist.
2. **Defensive Schema Querying**: Never guess database schema or table names. Always execute `list_tables` or `get_schema` before generating SQL queries (`execute_sql`).
3. **Cross-System Workflow Loop**: Dynamically chain tools across domains: GitHub MCP (find issue) -> `grep_search` (locate file) -> `autonomous-tdd-debugger` (test & fix) -> GitHub MCP (create PR).
4. **Rate Limit Awareness**: Avoid rapid unthrottled loops against external MCP servers.

### High-Throughput / Batched MCP Tool Execution (Gemini 4 Pro Readiness & Fallback)
- Ensure your MCP endpoints can handle **Massive Parallel Tool Execution** as models shift towards Agentic MoE architectures (Gemini 4 Pro / Gemini 4 Argon, Claude Opus 5.5).
- **Availability Fallback Invariant**: When orchestrating multi-tool agent loops:
  - Automatically and seamlessly degrade tasks from **Gemini 4** (`Argon` & `Pro`) to **`Gemini 3.8 Flash`** if Gemini 4 is unprovisioned, rate-limited, or unavailable (preserving native parallel tool call execution, sub-100ms TTFT, and 1M+ context window).
  - Automatically and seamlessly degrade tasks from **Claude Opus 5.5** to **`Claude Opus 4.6`** if unprovisioned or rate-limited.
  - Zero disruption: MCP tool dispatchers must execute immediately through fallback paths without throwing unhandled missing-model errors.
- Implement parallel sub-processing in tools that expect to be called concurrently (e.g., using `Promise.all` or `asyncio.gather` for batch database queries instead of blocking sequentially).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec mcp-server-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Model AI & Protokol Hulu**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `mcp-sampling-critic`
- **Klien Agen & Swarm**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `gemini-agent-booster`
- **Implementasi Server Domain**: `doku-mcp-server`, `xerj-search-expert`, `database-orm-expert`
- **Keamanan & Otorisasi**: `zero-trust-secret-vault`, `authentication-identity-expert`, `prompt-injection-firewall`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Deskripsi
Panduan arsitektur utama untuk membangun AI Tools/Bots modern dan siap produksi via **Model Context Protocol (MCP v1.x)**. Mewajibkan penggunaan `FastMCP` (Python) dan `@modelcontextprotocol/sdk` (TypeScript). Menerapkan pengamanan ketat, validasi skema, streaming resource stateful, serta dukungan transport Standar Stdio maupun Streamable HTTP / SSE.

### Kondisi Pemicu
- Membangun server MCP untuk mengekspos alat (*tools*), resource, atau template prompt ke agen AI.
- Mengintegrasikan API backend, sistem file, atau database sebagai alat agen AI.
- Mengimplementasikan server MCP stateful dan real-time (langganan resource, tailing log, metrik langsung).
- Mengamankan server MCP yang mengekspos data finansial atau produksi yang sensitif.

---

### Standar Pemilihan SDK (Wajib)
1. **Python**: `FastMCP` (pengalaman developer tingkat tinggi ala FastAPI untuk tools, resource, dan template prompt).
2. **TypeScript**: `@modelcontextprotocol/sdk` (SDK resmi menggunakan abstraksi `McpServer` dengan `zod`).

---

### Resep Implementasi Produksi

#### Resep 1: Server MCP TypeScript Produksi (Streamable HTTP / SSE)
```typescript
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { z } from 'zod';

const server = new McpServer({
  name: 'enterprise-analytics-mcp',
  version: '1.0.0',
});

// Pendaftaran Tool dengan validasi ketat Zod
server.tool(
  'calculate_metrics',
  'Menghitung metrik analitik bisnis untuk kuartal tertentu',
  {
    metricName: z.enum(['arr', 'churn', 'cac', 'ltv']).describe('Metrik yang ingin dihitung'),
    quarter: z.string().regex(/^Q[1-4]-202[0-9]$/).describe('Target kuartal, misal: Q1-2026'),
  },
  async ({ metricName, quarter }) => {
    const data = { arr: '$2.4M', churn: '1.2%', cac: '$450', ltv: '$9,200' };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ metrik: metricName, kuartal: quarter, nilai: data[metricName] }),
        },
      ],
    };
  }
);

// Pendaftaran Template Resource dengan URI Dinamis
server.resource(
  'system_health',
  new ResourceTemplate('system://health/{service}', { list: undefined }),
  async (uri, { service }) => {
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ layanan: service, status: 'HEALTHY', latensiMs: 14, waktu: new Date().toISOString() }),
        },
      ],
    };
  }
);

const app = express();
let transport: SSEServerTransport | null = null;

app.get('/sse', async (req, res) => {
  transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('Transport belum terhubung');
  }
});

app.listen(3001, () => {
  console.log('Server MCP berjalan pada http://localhost:3001/sse');
});
```

#### Resep 2: Server FastMCP Produksi (Python)
```python
from fastmcp import FastMCP, Context
from pydantic import BaseModel, Field
from typing import Literal

mcp = FastMCP("enterprise-vault-mcp", dependencies=["pydantic"])

class ParameterAkun(BaseModel):
    account_id: str = Field(..., description="UUID akun pengguna")
    status_filter: Literal["active", "suspended", "all"] = Field("active", description="Filter status")

@mcp.tool(name="ambil_ringkasan_akun", description="Mengambil telemetri dan saldo akun")
async def ambil_ringkasan_akun(params: ParameterAkun, ctx: Context) -> str:
    ctx.info(f"Memproses permintaan untuk akun: {params.account_id}")
    hasil = {
        "account_id": params.account_id,
        "saldo_usd": 125430.50,
        "tier": "enterprise",
        "status": params.status_filter
    }
    return str(hasil)

@mcp.resource("config://app-settings")
def ambil_pengaturan_aplikasi() -> str:
    """Menyediakan konteks konfigurasi aplikasi ke agen AI."""
    return '{"environment": "production", "rate_limit_rpm": 600, "region": "ap-southeast-1"}'

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

### Keamanan & Batasan Operasional
1. **Otentikasi OAuth 2.1 & Bearer**: Ikat token sesi ke koneksi transport. Validasi hak akses sebelum mengeksekusi logika alat.
2. **Validasi Skema Ketat**: Hindari penggunaan parameter tanpa tipe data yang jelas. Setiap argumen wajib memiliki tipe data, batas nilai, dan deskripsi.
3. **Row-Level Security (RLS)**: Teruskan identitas pengguna dan penyewa (tenant) ke lapisan database driver.
4. **Circuit Breakers & Rate Limits**: Batasi pemanggilan tool berulang dalam satu giliran respon untuk mencegah perulangan tak terkontrol (*infinite loops*).
5. **Idempotency**: Semua tool yang memodifikasi data wajib mendukung argumen `idempotency_key`.
 
### Konsumsi Klien MCP & Eksplorasi Tool oleh Agen
Ketika agen bertindak sebagai Klien MCP:
1. **Eksplorasi Tool Dinamis**: Periksa `list_resources` atau konfigurasi MCP sebelum menyimpulkan kapabilitas tidak tersedia.
2. **Kueri Skema Defensif**: Jangan pernah menebak nama tabel/skema. Selalu gunakan `list_tables` atau `get_schema` sebelum membuat kueri SQL.
3. **Alur Kerja Lintas Sistem**: Rangkaikan pemanggilan tool antar-domain: GitHub MCP -> pencarian kode lokal -> perbaikan otonom -> Pull Request GitHub.
4. **Kesadaran Batas Frekuensi**: Hindari loop pemanggilan berulang tanpa jeda waktu saat memanggil server MCP eksternal.

### Eksekusi Tool MCP Batch / Throughput Tinggi (Kesiapan Gemini 4 Pro & Fallback)
- Pastikan endpoint MCP Anda mampu menangani **Eksekusi Tool Paralel Masif** seiring transisi model menuju arsitektur Agentic MoE (Gemini 4 Pro / Gemini 4 Argon, Claude Opus 5.5).
- **Invarian Pengalihan Ketersediaan (Availability Fallback Invariant)**: Ketika mengorkestrasi loop agen multi-tool:
  - Alihkan tugas dari **Gemini 4** (`Argon` & `Pro`) secara otomatis ke **`Gemini 3.8 Flash`** jika Gemini 4 belum provisioned, terkena batas kuota, atau tidak tersedia (mempertahankan eksekusi tool paralel native, latensi sub-100ms TTFT, dan jendela konteks 1M+).
  - Alihkan tugas dari **Claude Opus 5.5** secara otomatis ke **`Claude Opus 4.6`** jika belum provisioned atau terbatas kuota.
  - Tanpa interupsi: Dispatcher tool MCP harus segera dieksekusi melalui jalur fallback tanpa galat model tidak ditemukan yang tidak tertangani.
- Terapkan pemrosesan sub-tugas paralel pada tools yang mungkin dipanggil secara bersamaan (misal: gunakan `Promise.all` atau `asyncio.gather` untuk query batch, alih-alih mengeblok secara berurutan).

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec mcp-server-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
