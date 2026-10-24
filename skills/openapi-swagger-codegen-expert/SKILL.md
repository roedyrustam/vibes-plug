---
name: openapi-swagger-codegen-expert
description: "OpenAPI 3.1 spec authoring, Swagger UI, automatic client/server code generation (openapi-typescript, Orval, Kiota), contract testing / Penulisan spesifikasi OpenAPI 3.1, Swagger UI, pembuatan kode klien/server otomatis, dan pengujian kontrak."
author: "Roedy Rustam"
version: "4.4.2"

---

# OpenAPI & Swagger Codegen Expert (Contract-First 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Specs & Design**: `api-design-expert`, `spec-driven-development-expert`, `prd-architect`
- **Frontend Consuming**: `tanstack-query-expert`, `senior-frontend`, `form-validation-expert`
- **Backend & Drifts**: `js-backend-expert`, `autonomous-api-drift-healer`, `api-gateway-proxy-expert`
- **CI/CD Quality & Security**: `ci-cd-devops-architect`, `e2e-testing-expert`, `anti-slop`
- **Lifecycle**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Description
Dedicated expert guide for API contract-first development using OpenAPI 3.1 (with full JSON Schema 2020-12 alignment), interactive documentation (Scalar, Swagger UI, Redoc), and automated end-to-end client code generation. Covers generating strictly typed SDKs using `openapi-typescript` and `openapi-fetch`, creating automatic TanStack Query v5 hooks with `Orval`, scaffolding multi-language SDKs with Microsoft `Kiota`, and enforcing API design governance via `Spectral` in CI/CD pipelines.

### Trigger Conditions
- Scaffolding modern RESTful API contracts before writing server code (Phase 1/4).
- Generating type-safe frontend API clients and TanStack Query hooks.
- Configuring interactive API documentation with Scalar or Swagger UI.
- Setting up automated contract testing with Prism or Pact.
- Migrating manual, unvalidated `fetch()` calls to auto-generated typed clients.

### Production OpenAPI 3.1 Specification Example

```yaml
# specs/openapi.yaml
openapi: 3.1.0
info:
  title: Vibes Core Service API
  version: 1.0.0
  description: High-scale contract-first API with strict schema validation.
servers:
  - url: https://api.vibesplug.internal/v1
    description: Production Cluster
paths:
  /orders:
    post:
      operationId: createOrder
      summary: Place an atomic order
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '201':
          description: Order created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
        '400':
          $ref: '#/components/responses/ValidationError'

components:
  schemas:
    CreateOrderRequest:
      type: object
      required: [customerId, items, totalCents]
      properties:
        customerId:
          type: string
          format: uuid
        items:
          type: array
          items:
            type: object
            required: [productId, quantity]
            properties:
              productId: { type: string }
              quantity: { type: integer, minimum: 1 }
        totalCents:
          type: integer
          minimum: 1
    OrderResponse:
      type: object
      required: [id, status, createdAt]
      properties:
        id: { type: string, format: uuid }
        status: { type: string, enum: [PENDING, PAID, FULFILLED] }
        createdAt: { type: string, format: date-time }
```

### Orval Configuration for TanStack Query v5

```typescript
// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './specs/openapi.yaml',
    output: {
      mode: 'tags-split',
      target: './src/api/generated/endpoints',
      schemas: './src/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
        mutator: {
          path: './src/api/custom-fetch-instance.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
```

### Type-Safe Client Invocation (`openapi-fetch`)

```typescript
// src/api/client.ts
import createClient from 'openapi-fetch';
import type { paths } from './generated/schema';

export const apiClient = createClient<paths>({ baseUrl: 'https://api.vibesplug.internal/v1' });

// Fully type-checked: parameters, request body, and responses are verified at compile-time
export async function submitOrder(customerId: string, productId: string, quantity: number, totalCents: number) {
  const { data, error } = await apiClient.POST('/orders', {
    body: { customerId, items: [{ productId, quantity }], totalCents }
  });
  if (error) throw new Error(`Order placement failed: ${error}`);
  return data; // Type: OrderResponse
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec openapi-swagger-codegen-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Ideasi & Desain Spesifikasi**: `api-design-expert`, `spec-driven-development-expert`, `prd-architect`
- **Konsumsi Frontend**: `tanstack-query-expert`, `senior-frontend`, `form-validation-expert`
- **Backend & Drifts**: `js-backend-expert`, `autonomous-api-drift-healer`, `api-gateway-proxy-expert`
- **Kualitas & Keamanan CI/CD**: `ci-cd-devops-architect`, `e2e-testing-expert`, `anti-slop`
- **Siklus Hidup**: `zero-to-prod-orchestrator`, `session-memory-manager`

### Deskripsi
Panduan ahli khusus untuk pengembangan API dengan pendekatan *contract-first* menggunakan OpenAPI 3.1 (dengan dukungan penuh JSON Schema 2020-12), dokumentasi interaktif modern (Scalar, Swagger UI, Redoc), dan otomatisasi pembuatan klien SDK. Mencakup pembuatan SDK tipe ketat (*strictly typed*) menggunakan `openapi-typescript` dan `openapi-fetch`, pembuatan hooks TanStack Query v5 otomatis via `Orval`, *scaffolding* SDK multi-bahasa dengan Microsoft `Kiota`, serta penegakan standar desain API menggunakan `Spectral` pada pipeline CI/CD.

### Kondisi Pemicu
- Merancang spesifikasi API REST sebelum menulis kode backend (Fase 1/4).
- Menghasilkan klien API frontend dan hooks React Query yang bebas kesalahan tipe secara otomatis.
- Menyiapkan halaman dokumentasi API interaktif menggunakan Scalar atau Swagger UI.
- Menguji keselarasan kontrak backend vs frontend menggunakan mock server (Prism).
- Menggantikan pemanggilan `fetch()` manual tanpa tipe dengan klien otomatis yang terverifikasi.

### Pola Integrasi Orval & React Query di Frontend

```typescript
// Penggunaan hooks otomatis hasil generate Orval di komponen React 19
import { useCreateOrder } from '@/api/generated/endpoints/orders';

export function CheckoutButton({ customerId, productId, quantity, totalCents }: Props) {
  const { mutate, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        console.log(`Pesanan berhasil dibuat: ${order.id}`);
      },
      onError: (err) => {
        console.error('Gagal membuat pesanan:', err);
      }
    }
  });

  return (
    <button 
      onClick={() => mutate({ data: { customerId, items: [{ productId, quantity }], totalCents } })}
      disabled={isPending}
      className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-500"
    >
      {isPending ? 'Memproses...' : 'Bayar Sekarang'}
    </button>
  );
}
```

### Validasi Spectral di Pipeline CI/CD

```yaml
# .spectral.yaml
extends: ["spectral:oas"]
rules:
  operation-operationId-valid-in-url: error
  operation-description: warn
  no-eval-in-markdown: error
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec openapi-swagger-codegen-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
