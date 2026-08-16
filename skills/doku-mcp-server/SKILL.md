---
name: doku-mcp-server
description: "Expert guide for DOKU Model Context Protocol (MCP) Server integration. Enables AI Agentic Commerce with tools for payment links, Virtual Accounts, QRIS, transaction status checks, and client configuration (Claude Desktop, Cursor, AGY) / Panduan ahli DOKU MCP Server untuk AI Agentic Commerce."
author: "vibes-plug-swarm"
---

# DOKU MCP Server / Server Model Context Protocol DOKU

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Expert guide for integrating and building Model Context Protocol (MCP) servers with DOKU Payment Gateway based on [DOKU Developers Documentation](https://developers.doku.com/). Enables AI Agents (Claude Desktop, Antigravity, Cursor, n8n, LangChain) to execute payment tasks autonomously using Agentic Commerce capabilities (generating payment links, issuing Virtual Account numbers, generating QRIS codes, querying transaction statuses).

### Trigger Conditions
Activate this skill when the user is:
- Setting up or configuring DOKU MCP server for Claude Desktop, Antigravity (AGY), Cursor, or LLM agents.
- Implementing AI Agentic Commerce or autonomous AI-driven checkout workflows using DOKU.
- Building a custom TypeScript or Python MCP server wrapping DOKU Jokul API.
- Defining MCP tools and resources for payment generation and status verification.

---

### Key Capabilities & Tools

| MCP Tool Name | Description | Key Input Parameters |
|---|---|---|
| `create_checkout_payment` | Generates a DOKU Checkout URL / Payment Link for host-managed payment page | `amount`, `invoice_number`, `customer_name`, `customer_email` |
| `create_virtual_account` | Generates a specific bank Virtual Account number (BCA, Mandiri, BRI, BNI, Permata, DOKU) | `bank_code`, `amount`, `invoice_number`, `customer_name` |
| `create_qris_payment` | Generates a dynamic QRIS string/image for instant wallet payments | `amount`, `invoice_number`, `store_name` |
| `check_transaction_status` | Queries real-time transaction payment status | `invoice_number` or `transaction_id` |

---

### Client Configuration

#### 1. Antigravity & Gemini Configuration (`mcp.json`)

**Location:**
- **Global:** `~/.gemini/config/mcp.json` (Windows: `%USERPROFILE%\.gemini\config\mcp.json`)
- **Workspace:** `.agents/mcp.json` (in your project root)

```json
{
  "mcpServers": {
    "doku-payment": {
      "command": "node",
      "args": ["/path/to/doku-mcp-server/dist/index.js"],
      "env": {
        "DOKU_CLIENT_ID": "YOUR_SANDBOX_OR_PROD_CLIENT_ID",
        "DOKU_SECRET_KEY": "YOUR_SANDBOX_OR_PROD_SECRET_KEY",
        "DOKU_IS_PRODUCTION": "false"
      }
    }
  }
}
```

#### 2. Claude Desktop Configuration (`claude_desktop_config.json`)

**Location:**
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "doku-payment": {
      "command": "node",
      "args": ["/path/to/doku-mcp-server/dist/index.js"],
      "env": {
        "DOKU_CLIENT_ID": "YOUR_SANDBOX_OR_PROD_CLIENT_ID",
        "DOKU_SECRET_KEY": "YOUR_SANDBOX_OR_PROD_SECRET_KEY",
        "DOKU_IS_PRODUCTION": "false"
      }
    }
  }
}
```

#### 3. Environment Variables & Authentication
DOKU API authentication requires API Key credentials. When using standard HTTP header authentication:
- API Keys are configured in your environment or encoded as Base64 for the MCP `Authorization` header.
- Use Sandbox (`https://api-sandbox.doku.com`) during development and testing.

---

### Building a Custom TypeScript MCP Server for DOKU

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import crypto from 'crypto';

const CLIENT_ID = process.env.DOKU_CLIENT_ID || '';
const SECRET_KEY = process.env.DOKU_SECRET_KEY || '';
const BASE_URL = process.env.DOKU_IS_PRODUCTION === 'true' 
  ? 'https://api.doku.com' 
  : 'https://api-sandbox.doku.com';

function generateHeaders(targetPath: string, payload: object) {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const jsonBody = JSON.stringify(payload);
  const digest = crypto.createHash('sha256').update(jsonBody, 'utf8').digest('base64');

  const component = `Client-Id:${CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}\nDigest:${digest}`;
  const signature = 'HMACSHA256=' + crypto.createHmac('sha256', SECRET_KEY).update(component).digest('base64');

  return {
    'Content-Type': 'application/json',
    'Client-Id': CLIENT_ID,
    'Request-Id': requestId,
    'Request-Timestamp': timestamp,
    'Request-Target': targetPath,
    'Digest': digest,
    'Signature': signature
  };
}

const server = new Server(
  { name: 'doku-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_checkout_payment',
      description: 'Generate a DOKU payment checkout URL for customer order',
      inputSchema: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Total payment amount in IDR' },
          invoice_number: { type: 'string', description: 'Unique order invoice number' },
          customer_name: { type: 'string', description: 'Customer full name' },
          customer_email: { type: 'string', description: 'Customer email address' }
        },
        required: ['amount', 'invoice_number', 'customer_name', 'customer_email']
      }
    },
    {
      name: 'check_transaction_status',
      description: 'Check payment status of a transaction',
      inputSchema: {
        type: 'object',
        properties: {
          invoice_number: { type: 'string', description: 'Invoice number to query' }
        },
        required: ['invoice_number']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'create_checkout_payment') {
    const targetPath = '/checkout/v1/payment';
    const body = {
      order: { amount: args?.amount, invoice_number: args?.invoice_number },
      customer: { name: args?.customer_name, email: args?.customer_email }
    };

    const response = await fetch(`${BASE_URL}${targetPath}`, {
      method: 'POST',
      headers: generateHeaders(targetPath, body),
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

---

### Common Pitfalls to Avoid

| Anti-Pattern | Issue | Solution |
|---|---|---|
| Hardcoding Merchant Secrets | Security vulnerability | Always load `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY` from environment variables. |
| Incomplete Tool Schema Descriptions | AI Agent misinterprets tool usage | Provide clear parameter descriptions and strict `required` fields in JSON schema. |
| Returning Raw Errors | Unfriendly LLM agent experience | Catch API errors and return structured error JSON response in MCP tool text output. |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan ahli untuk mengintegrasikan dan membuat server Model Context Protocol (MCP) dengan DOKU Payment Gateway berdasarkan dokumentasi resmi [DOKU Developers Documentation](https://developers.doku.com/). Memungkinkan Agen AI (Claude Desktop, Antigravity, Cursor, n8n, LangChain) menjalankan transaksi pembayaran secara otonom dalam alur Agentic Commerce (membuat link pembayaran, membuat nomor Virtual Account, membuat kode QRIS, dan memeriksa status transaksi).

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Mengatur atau mengonfigurasi server DOKU MCP untuk Claude Desktop, Antigravity (AGY), Cursor, atau agen LLM.
- Mengimplementasikan alur kerja checkout otonom berbasis AI (AI Agentic Commerce) menggunakan DOKU.
- Membangun server MCP TypeScript atau Python kustom yang membungkus DOKU Jokul API.
- Mendefinisikan tool dan resource MCP untuk pembuatan dan verifikasi status pembayaran.

### Konfigurasi Client untuk Antigravity & Gemini

**Lokasi File Konfigurasi (`mcp.json`):**
- **Global:** `~/.gemini/config/mcp.json` (Windows: `%USERPROFILE%\.gemini\config\mcp.json`)
- **Workspace:** `.agents/mcp.json` (di dalam folder proyek)

```json
{
  "mcpServers": {
    "doku-payment": {
      "command": "node",
      "args": ["/path/to/doku-mcp-server/dist/index.js"],
      "env": {
        "DOKU_CLIENT_ID": "CLIENT_ID_SANDBOX_ATAU_PROD",
        "DOKU_SECRET_KEY": "SECRET_KEY_SANDBOX_ATAU_PROD",
        "DOKU_IS_PRODUCTION": "false"
      }
    }
  }
}
```

### Integrasi dengan Skill Lain
- `mcp-server-architect` — Untuk arsitektur dan pengamanan server MCP tingkat lanjut.
- `doku-payment-gateway` — Untuk rumus signature HMAC-SHA256 dan API spesifik DOKU.
- `multi-agent-orchestration` — Untuk mengaitkan DOKU MCP Server dengan swarm agen AI otonom.

---
### 🚨 SNAP Integration Mandate (CRITICAL)
**MANDATORY**: The AI Agent MUST automatically apply the SNAP API v1.0 standard (Standard Nasional Open API Pembayaran) for all DOKU integrations, instead of the legacy Jokul API v2, unless the user explicitly requests otherwise. All generated signatures, headers, and endpoints MUST follow the SNAP BI standard.

### 🧪 DOKU Sandbox Simulator
**MANDATORY**: When testing in Sandbox mode and needing to access the Payment Simulator, the AI Agent MUST use this exact URL: `https://sandbox.doku.com/gtw-config-v2/simulator`.
