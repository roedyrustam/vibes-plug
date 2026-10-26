---
name: doku-mcp-server
description: "DOKU MCP server: AI agentic commerce, checkout, and payment tools / DOKU MCP server: commerce berbasis agen AI, checkout, dan pembayaran."
author: "Roedy Rustam"
version: "4.4.2"

---

# DOKU MCP Server / Server Model Context Protocol DOKU

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Payment Engine & SNAP BI**: `doku-payment-gateway`, `payment-gateway-expert`, `saas-billing`
- **MCP Protocol & Tools**: `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`
- **Agent Swarms & Commerce**: `multi-agent-orchestration`, `ai-llm-integration-expert`, `agentic-m2m-settlement`
- **Security & Secret Vault**: `zero-trust-secret-vault`, `authentication-identity-expert`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Expert guide for integrating and building Model Context Protocol (MCP) servers with DOKU Payment Gateway based on the [DOKU Developers Documentation](https://developers.doku.com/). Enables AI Agents (Claude Desktop, Antigravity, Cursor, n8n, LangChain) to execute payment tasks autonomously using Agentic Commerce capabilities (generating DOKU Checkout links, issuing Virtual Account numbers, generating QRIS codes, and querying order-level transaction statuses).

### Trigger Conditions
Activate this skill when the user is:
- Setting up or configuring DOKU MCP server for Claude Desktop, Antigravity (AGY), Cursor, or LLM agents.
- Implementing AI Agentic Commerce or autonomous AI-driven checkout workflows using DOKU Checkout.
- Building a custom TypeScript or Python MCP server wrapping DOKU Checkout (`/checkout/v1/payment`) or SNAP BI APIs.
- Defining MCP tools and resources for payment generation and status verification.

---

### Key Capabilities & Tools

| MCP Tool Name | Description | Key Input Parameters |
|---|---|---|
| `create_checkout_payment` | Generates a DOKU Checkout URL supporting all payment methods (VA, CC, QRIS, E-Wallet, etc.) | `amount`, `invoice_number`, `customer_name`, `customer_email`, `customer_phone`, `callback_url`, `payment_method_types`, `payment_due_date` |
| `check_transaction_status` | Queries real-time order and transaction status from DOKU (`/orders/v1/status/{invoice_number}`) | `invoice_number` |
| `create_virtual_account` | Generates a direct bank Virtual Account number via Direct SNAP BI API | `bank_code`, `amount`, `invoice_number`, `customer_name` |
| `create_qris_payment` | Generates a dynamic QRIS string/image for instant wallet payments | `amount`, `invoice_number`, `store_name` |

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

---

### Building a Production TypeScript MCP Server for DOKU

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

function generateNonSnapHeaders(targetPath: string, payload?: object) {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  let component = `Client-Id:${CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${targetPath}`;

  const headers: Record<string, string> = {
    'Client-Id': CLIENT_ID,
    'Request-Id': requestId,
    'Request-Timestamp': timestamp,
    'Request-Target': targetPath,
  };

  if (payload) {
    const jsonBody = JSON.stringify(payload);
    const digest = crypto.createHash('sha256').update(jsonBody, 'utf8').digest('base64');
    headers['Digest'] = digest;
    headers['Content-Type'] = 'application/json';
    component += `\nDigest:${digest}`;
  }

  const signature = 'HMACSHA256=' + crypto.createHmac('sha256', SECRET_KEY).update(component, 'utf8').digest('base64');
  headers['Signature'] = signature;

  return headers;
}

const server = new Server(
  { name: 'doku-mcp-server', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_checkout_payment',
      description: 'Generate a DOKU Checkout URL allowing customers to pay with all supported payment methods (VA, CC, QRIS, E-Wallet, Paylater)',
      inputSchema: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Total payment amount in IDR (integer without decimals)' },
          invoice_number: { type: 'string', description: 'Unique order invoice number' },
          customer_name: { type: 'string', description: 'Customer full name' },
          customer_email: { type: 'string', description: 'Customer email address' },
          customer_phone: { type: 'string', description: 'Customer phone number in international format (e.g. 6281234567890)' },
          callback_url: { type: 'string', description: 'Merchant redirect URL upon transaction completion' },
          payment_method_types: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional filter for payment channels (e.g. ["VIRTUAL_ACCOUNT_BCA", "CREDIT_CARD", "QRIS", "EMONEY_SHOPEEPAY"]). Omit to show all.'
          },
          payment_due_date: { type: 'number', description: 'Payment expiration time in minutes (default 60)' }
        },
        required: ['amount', 'invoice_number', 'customer_name', 'customer_email']
      }
    },
    {
      name: 'check_transaction_status',
      description: 'Check real-time order and transaction payment status using DOKU Check Status API',
      inputSchema: {
        type: 'object',
        properties: {
          invoice_number: { type: 'string', description: 'Merchant invoice number to query' }
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
      order: {
        amount: args?.amount,
        invoice_number: args?.invoice_number,
        currency: 'IDR',
        callback_url: args?.callback_url,
        auto_redirect: true
      },
      payment: {
        payment_due_date: args?.payment_due_date || 60,
        ...(args?.payment_method_types ? { payment_method_types: args.payment_method_types } : {})
      },
      customer: {
        id: args?.customer_email,
        name: args?.customer_name,
        email: args?.customer_email,
        phone: args?.customer_phone || '6281234567890'
      }
    };

    const response = await fetch(`${BASE_URL}${targetPath}`, {
      method: 'POST',
      headers: generateNonSnapHeaders(targetPath, body),
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }

  if (name === 'check_transaction_status') {
    const invoiceNumber = args?.invoice_number;
    const targetPath = `/orders/v1/status/${invoiceNumber}`;

    const response = await fetch(`${BASE_URL}${targetPath}`, {
      method: 'GET',
      headers: generateNonSnapHeaders(targetPath)
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
| Hardcoding Merchant Secrets | Security leak | Always read `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY` from environment variables. |
| Incomplete Tool Schema Descriptions | AI Agent misinterprets tool usage | Provide clear parameter descriptions and strict `required` fields in JSON schema. |
| Omitting Digest on POST | 401 Unauthorized / Signature Mismatch | For DOKU Checkout (`/checkout/v1/payment`), calculate Base64 SHA-256 Digest of minified body and include it in component string. |
| Including Digest on GET Check Status | 401 Signature Mismatch | For GET requests (`/orders/v1/status/...`), do NOT include `Digest` in headers or signature component string. |

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Availability Fallback** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec doku-mcp-server <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **NFR & Anti-Slop Invariants** | Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Mesin Pembayaran & SNAP BI**: `doku-payment-gateway`, `payment-gateway-expert`, `saas-billing`
- **Protokol MCP & Tools**: `mcp-server-architect`, `mcp-sampling-critic`, `parallel-tool-orchestrator`
- **Swarm Agen & Commerce**: `multi-agent-orchestration`, `ai-llm-integration-expert`, `agentic-m2m-settlement`
- **Keamanan & Secret Vault**: `zero-trust-secret-vault`, `authentication-identity-expert`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan ahli untuk mengintegrasikan dan membuat server Model Context Protocol (MCP) dengan DOKU Payment Gateway berdasarkan dokumentasi resmi [DOKU Developers Documentation](https://developers.doku.com/). Memungkinkan Agen AI (Claude Desktop, Antigravity, Cursor, n8n, LangChain) menjalankan transaksi pembayaran secara otonom dalam alur Agentic Commerce (membuat URL DOKU Checkout, memeriksa status pembayaran order, dan mengelola invoice).

### Kondisi Pemicu
- Mengonfigurasi server DOKU MCP untuk Claude Desktop, Antigravity (AGY), atau Cursor IDE.
- Membangun alur belanja otonom (*Agentic Commerce*) di mana agen AI dapat membuat tautan pembayaran.
- Membungkus endpoint API DOKU Checkout (`/checkout/v1/payment`) ke dalam tool MCP standar.
- Melakukan verifikasi status pembayaran transaksi secara otomatis melalui query invoice.

---

### Konfigurasi Klien MCP

#### 1. Konfigurasi Antigravity & Gemini (`mcp.json`)
Lokasi file: `~/.gemini/config/mcp.json` (Global) atau `.agents/mcp.json` (Workspace):
```json
{
  "mcpServers": {
    "doku-payment": {
      "command": "node",
      "args": ["/path/to/doku-mcp-server/dist/index.js"],
      "env": {
        "DOKU_CLIENT_ID": "CLIENT_ID_MERCHANT",
        "DOKU_SECRET_KEY": "SECRET_KEY_MERCHANT",
        "DOKU_IS_PRODUCTION": "false"
      }
    }
  }
}
```

#### 2. Konfigurasi Claude Desktop (`claude_desktop_config.json`)
Lokasi file pada Windows: `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "doku-payment": {
      "command": "node",
      "args": ["/path/to/doku-mcp-server/dist/index.js"],
      "env": {
        "DOKU_CLIENT_ID": "CLIENT_ID_MERCHANT",
        "DOKU_SECRET_KEY": "SECRET_KEY_MERCHANT",
        "DOKU_IS_PRODUCTION": "false"
      }
    }
  }
}
```

---

### Implementasi Server MCP DOKU Berbasis TypeScript

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

function buatHeaderNonSnap(pathTarget: string, payload?: object) {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  let komponen = `Client-Id:${CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${pathTarget}`;

  const headers: Record<string, string> = {
    'Client-Id': CLIENT_ID,
    'Request-Id': requestId,
    'Request-Timestamp': timestamp,
    'Request-Target': pathTarget,
  };

  if (payload) {
    const jsonBody = JSON.stringify(payload);
    const digest = crypto.createHash('sha256').update(jsonBody, 'utf8').digest('base64');
    headers['Digest'] = digest;
    headers['Content-Type'] = 'application/json';
    komponen += `\nDigest:${digest}`;
  }

  const signature = 'HMACSHA256=' + crypto.createHmac('sha256', SECRET_KEY).update(komponen, 'utf8').digest('base64');
  headers['Signature'] = signature;
  return headers;
}

const server = new Server(
  { name: 'doku-mcp-server', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_checkout_payment',
      description: 'Menghasilkan URL pembayaran DOKU Checkout untuk seluruh metode pembayaran',
      inputSchema: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Total pembayaran dalam IDR' },
          invoice_number: { type: 'string', description: 'Nomor invoice unik' },
          customer_name: { type: 'string', description: 'Nama lengkap pelanggan' },
          customer_email: { type: 'string', description: 'Email pelanggan' },
        },
        required: ['amount', 'invoice_number', 'customer_name', 'customer_email']
      }
    },
    {
      name: 'check_transaction_status',
      description: 'Memeriksa status pembayaran transaksi secara real-time via nomor invoice',
      inputSchema: {
        type: 'object',
        properties: {
          invoice_number: { type: 'string', description: 'Nomor invoice yang ingin diperiksa' }
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
      order: {
        amount: args?.amount,
        invoice_number: args?.invoice_number,
        currency: 'IDR',
        auto_redirect: true
      },
      payment: { payment_due_date: 60 },
      customer: {
        name: args?.customer_name,
        email: args?.customer_email
      }
    };

    const res = await fetch(`${BASE_URL}${targetPath}`, {
      method: 'POST',
      headers: buatHeaderNonSnap(targetPath, body),
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  if (name === 'check_transaction_status') {
    const invoiceNumber = args?.invoice_number;
    const targetPath = `/orders/v1/status/${invoiceNumber}`;

    const res = await fetch(`${BASE_URL}${targetPath}`, {
      method: 'GET',
      headers: buatHeaderNonSnap(targetPath)
    });

    const data = await res.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  throw new Error(`Tool tidak ditemukan: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### Jebakan Umum yang Wajib Dihindari
- **Hardcoding Secret Key**: Jangan pernah menaruh Secret Key di file kodingan. Gunakan variabel lingkungan.
- **Menyertakan Header Digest pada Request GET**: Header `Digest` hanya dihitung pada request POST yang memiliki body JSON. Menyertakan Digest pada GET menghasilkan error 401 Signature Mismatch.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | High Fast / High (`Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec doku-mcp-server <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants` |
| **Invarian NFR & Anti-Slop** | Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
