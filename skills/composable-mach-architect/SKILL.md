---
name: composable-mach-architect
description: "Expert guide for Composable MACH Architecture (Microservices, API-first, Cloud-native, Headless) — dynamic UI composition, federated API mesh, Backend-for-Frontend patterns, plugin/extension architectures, event-driven composition, and composable AI routing / Panduan ahli Arsitektur MACH Komposabel — komposisi UI dinamis, API mesh federasi, pola Backend-for-Frontend, arsitektur plugin/ekstensi, komposisi event-driven, dan routing AI komposabel."
author: "Roedy Rustam"
version: "4.4.2"

---

# Composable MACH Architecture / Arsitektur MACH Komposabel

## 1. MACH Alliance Principles / Prinsip-prinsip Aliansi MACH

### English
MACH architecture is a set of technology principles emphasizing best-of-breed, composable enterprise technology ecosystems.
- **Microservices**: Independently deployable, single-responsibility services. Decoupled and scalable.
- **API-first**: Every capability is exposed via versioned APIs (REST/GraphQL/gRPC). The API is the primary interface, not an afterthought.
- **Cloud-native**: SaaS-first, leveraging auto-scaling, multi-region deployment, and edge computing for resilience and global performance.
- **Headless**: Total separation of the presentation layer (frontend) from the business logic layer (backend).
- **Decision Matrix**: 
  - *MACH*: Large scale, highly customizable, best-of-breed requirement, multiple frontends.
  - *Modular Monolith*: Medium scale, unified team, standard requirements, lower operational complexity.
  - *Monolith*: Small scale, rapid MVP, single deployment unit.

### Indonesian (Bahasa Indonesia)
Arsitektur MACH adalah seperangkat prinsip teknologi yang menekankan ekosistem teknologi enterprise yang komposabel dan best-of-breed.
- **Microservices**: Layanan dengan tanggung jawab tunggal yang dapat di-deploy secara independen. Terdekopel dan dapat diskalakan.
- **API-first**: Setiap kemampuan diekspos melalui API berversi (REST/GraphQL/gRPC). API adalah antarmuka utama, bukan tambahan.
- **Cloud-native**: Mengutamakan SaaS, memanfaatkan auto-scaling, deployment multi-region, dan komputasi edge.
- **Headless**: Pemisahan total lapisan presentasi (frontend) dari lapisan logika bisnis (backend).
- **Matriks Keputusan**: 
  - *MACH*: Skala besar, sangat dapat dikustomisasi, butuh best-of-breed, banyak frontend.
  - *Monolit Modular*: Skala menengah, tim terpadu, standar.
  - *Monolit*: Skala kecil, MVP cepat.

## 2. Dynamic UI Composition / Komposisi UI Dinamis

### English
Dynamic UI composition allows building runtime-composed dashboards and applications from independent micro-frontends. Use Module Federation v2 (Webpack/Vite) for dynamic remote loading and Server-Driven UI (SDUI) where the backend defines the layout payload. The Shell application acts as the host for remote modules.

### Indonesian (Bahasa Indonesia)
Komposisi UI dinamis memungkinkan pembuatan dashboard dan aplikasi yang dikomposisi saat runtime dari micro-frontend independen. Gunakan Module Federation v2 untuk pemuatan remote dinamis dan Server-Driven UI di mana backend menentukan payload layout. Aplikasi Shell bertindak sebagai host.

```javascript
// Vite Module Federation dynamic import setup (vite.config.js - Host App)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        // Dynamic loading syntax for Vite federation
        inventory_app: 'http://localhost:5001/assets/remoteEntry.js',
        analytics_app: 'http://localhost:5002/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
});

// React Component importing remote dynamically
import React, { Suspense } from 'react';
const InventoryWidget = React.lazy(() => import('inventory_app/Widget'));

export const Dashboard = () => (
  <div>
    <h1>Composable Dashboard</h1>
    <Suspense fallback={<div>Loading Widget...</div>}>
      <InventoryWidget />
    </Suspense>
  </div>
);
```

## 3. Federated API Layer / Lapisan API Federasi

### English
Apollo Federation v2 allows composing distributed GraphQL schemas into a single unified supergraph. This creates an API mesh for service-to-service communication. Gateways (e.g., Kong, Traefik, Cloudflare) manage routing. Federation differs from schema stitching by pushing composition logic to the subgraphs via directives.

### Indonesian (Bahasa Indonesia)
Apollo Federation v2 memungkinkan komposisi skema GraphQL terdistribusi menjadi satu supergraph terpadu. Ini menciptakan API mesh. Gateway mengatur routing. Federasi berbeda dari schema stitching dengan mendorong logika komposisi ke subgraph melalui direktif.

```javascript
// Apollo Federation v2 Subgraph setup (Node.js)
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type User @key(fields: "id") {
    id: ID!
    purchaseHistory: [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String! @shareable
  }
`;

const resolvers = {
  User: {
    __resolveReference(userRepresentation) {
      return fetchUserById(userRepresentation.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});
```

## 4. Backend-for-Frontend (BFF) Pattern / Pola Backend-for-Frontend

### English
BFFs aggregate, transform, and optimize data for specific client types (Web, Mobile, Admin). This reduces payload size and over-fetching. Deploy Edge BFFs using Cloudflare Workers or Vercel Edge Middleware for lowest latency.

### Indonesian (Bahasa Indonesia)
BFF mengagregasi, mentransformasi, dan mengoptimalkan data untuk jenis klien tertentu. Ini mengurangi ukuran payload dan over-fetching. Deploy Edge BFF menggunakan Cloudflare Workers atau Vercel Edge Middleware.

```javascript
// Edge BFF using Cloudflare Workers aggregating microservices
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/mobile-dashboard') {
      // Parallel requests to internal microservices
      const [userResponse, productsResponse] = await Promise.all([
        fetch('https://api.internal.com/users/me', { headers: request.headers }),
        fetch('https://api.internal.com/products/featured')
      ]);

      const user = await userResponse.json();
      const products = await productsResponse.json();

      // Transform and subset data for mobile client
      const bffResponse = {
        greeting: `Hello, ${user.firstName}`,
        quickBuy: products.map(p => ({ id: p.id, name: p.name, price: p.price })) // Strip heavy descriptions
      };

      return new Response(JSON.stringify(bffResponse), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};
```

## 5. Headless Commerce & CMS Stack / Stack Headless Commerce & CMS

### English
Leverage platforms like commercetools, Medusa.js, or Saleor for headless commerce. Combine with composable content platforms (Sanity, Contentful). Orchestrate integrations using webhooks, event buses, and CDC to maintain synchronization across best-of-breed tools.

### Indonesian (Bahasa Indonesia)
Manfaatkan platform seperti commercetools, Medusa.js, atau Saleor. Kombinasikan dengan platform konten (Sanity, Contentful). Orkestrasi integrasi menggunakan webhook, event bus, dan CDC.

```javascript
// Composable product page fetching from Commerce and CMS
async function getProductPageData(productSlug) {
  // 1. Fetch CMS content (Rich text, marketing imagery) from Sanity
  const cmsQuery = `*[_type == "product" && slug.current == $slug][0]{ title, marketingCopy, gallery }`;
  const cmsPromise = sanityClient.fetch(cmsQuery, { slug: productSlug });

  // 2. Fetch Commerce data (Pricing, availability) from Medusa.js / commercetools
  const commercePromise = fetch(`https://api.commerce.com/store/products?handle=${productSlug}`)
    .then(res => res.json());

  const [cmsData, commerceData] = await Promise.all([cmsPromise, commercePromise]);
  const product = commerceData.products[0];

  // 3. Compose response
  return {
    id: product.id,
    title: cmsData.title || product.title,
    description: cmsData.marketingCopy,
    images: cmsData.gallery,
    price: product.variants[0].prices[0].amount,
    inStock: product.variants[0].inventory_quantity > 0
  };
}
```

## 6. Plugin & Extension Architecture / Arsitektur Plugin & Ekstensi

### English
Design extensible systems using plugin registries. The lifecycle involves discover → load → initialize → execute → teardown. Secure execution by sandboxing (iframe or Web Worker). Provide hook/event systems for integration points.

### Indonesian (Bahasa Indonesia)
Desain sistem ekstensibel menggunakan registri plugin. Siklus hidup: temukan → muat → inisialisasi → eksekusi → teardown. Amankan eksekusi dengan sandboxing. Sediakan sistem hook/event.

```typescript
// Plugin registry with lifecycle management
interface Plugin {
  name: string;
  init: (context: PluginContext) => Promise<void>;
  execute: (payload: any) => Promise<any>;
  teardown: () => Promise<void>;
}

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  async register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) throw new Error("Plugin exists");
    
    // Sandbox or pass restricted context
    const context = { logger: console, api: restrictedApiObject };
    await plugin.init(context);
    
    this.plugins.set(plugin.name, plugin);
  }

  async runHook(hookName: string, payload: any) {
    const results = [];
    for (const plugin of this.plugins.values()) {
      // Execute plugins in parallel or sequentially based on hook semantics
      results.push(await plugin.execute({ hook: hookName, data: payload }));
    }
    return results;
  }
}
```

## 7. Event-Driven Composition / Komposisi Event-Driven

### English
Achieve loose coupling via async event buses (Redis Streams, Kafka). Use Change Data Capture (CDC) like Debezium for real-time data sync. Understand choreography (decentralized) vs orchestration (centralized) and employ eventual consistency and saga patterns for distributed transactions.

### Indonesian (Bahasa Indonesia)
Capai loose coupling melalui event bus asinkron. Gunakan CDC (Debezium) untuk sinkronisasi data real-time. Pahami koreografi vs orkestrasi dan terapkan eventual consistency serta saga pattern untuk transaksi terdistribusi.

```javascript
// Event-driven service composition with Redis Streams (Node.js)
import { createClient } from 'redis';

const redis = createClient();
await redis.connect();

// Service A: Producer (e.g., Order Service)
async function placeOrder(orderData) {
  const orderId = generateId();
  // Save to local DB first...
  
  // Emit event to stream
  await redis.xAdd('events:orders', '*', {
    eventType: 'OrderCreated',
    orderId: orderId,
    payload: JSON.stringify(orderData)
  });
}

// Service B: Consumer (e.g., Inventory Service)
async function listenForOrders() {
  let lastId = '$'; // Listen for new messages
  while (true) {
    const response = await redis.xRead(
      { key: 'events:orders', id: lastId },
      { BLOCK: 5000, COUNT: 1 }
    );
    if (response) {
      const stream = response[0];
      const message = stream.messages[0];
      lastId = message.id;
      
      const event = message.message;
      if (event.eventType === 'OrderCreated') {
        const order = JSON.parse(event.payload);
        // Reserve inventory based on order...
      }
    }
  }
}
```

## 8. Composable AI Routing / Routing AI Komposabel

### English
Implement dynamic AI model routing based on request context (complexity, cost, latency). Chain specialized models for complex tasks. Build fallback chains (Primary → Secondary → Local SLM: e.g., Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6) for resilience. Manage model rollouts with feature flags.

### Indonesian (Bahasa Indonesia)
Terapkan routing model AI dinamis berdasarkan konteks permintaan (kompleksitas, biaya, latensi). Rangkai model spesialis untuk tugas kompleks. Buat rantai fallback (Primer → Sekunder → SLM Lokal: misal Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6) untuk ketahanan sistem. Kelola peluncuran model dengan feature flag.

```javascript
// Dynamic AI model router with cost and latency optimization
async function routePrompt(prompt, context) {
  const complexityScore = evaluateComplexity(prompt); // Fast heuristic check

  if (complexityScore < 0.3) {
    // Simple task: Route to fast, cheap model (e.g., Grok 4.7 High Fast / Grok 4.6 / Composer 2.5 Fast)
    return await callModel('fast-cheap-model', prompt);
  } 
  
  if (context.requiresReasoning) {
    // Complex reasoning: Route to advanced model (e.g., Claude Sonnet 5.5 High / Gemini 4 Argon / Claude Opus 5.5 / GPT-5.6 Sol)
    try {
      return await callModel('advanced-reasoning-model', prompt);
    } catch (error) {
      // Invariant fallback chain: Gemini 4 -> Gemini 3.8 Flash, Claude Opus 5.5 -> Claude Opus 4.6
      console.warn("Primary model unavailable, falling back to secondary (e.g., Gemini 3.8 Flash / Claude Opus 4.6)...", error);
      return await callModel('graceful-secondary-model', prompt);
    }
  }

  // Feature-flag controlled routing for A/B testing new models
  if (featureFlags.get('use_experimental_model_v2')) {
    return await callModel('experimental-model', prompt);
  }

  return await callModel('default-balanced-model', prompt);
}
```

## 9. Orchestration & Integration

- **Upstream & System Architecture**: `zero-to-prod-orchestrator` (Phase 1 discovery & Phase 3 architecture), `brainstorming`, `saas-architect`.
- **Frontend & Composition**: `micro-frontend-architect` (runtime module federation & SDUI), `headless-cms-expert` (content APIs), `ecommerce-expert` (composable checkout).
- **APIs, Gateways & BFF**: `api-design-expert` (OpenAPI contracts), `api-gateway-proxy-expert` (federated mesh & proxies), `event-driven-architect` (Kafka/RabbitMQ event choreography).
- **Cloud Runtime & AI Routing**: `cloud-hosting-expert` (multi-region edge deployment), `adaptive-model-cascade` (composable AI model routing).

## Integrasi Orkestrasi

- **Hulu & Arsitektur Sistem**: `zero-to-prod-orchestrator` (Penemuan Fase 1 & arsitektur Fase 3), `brainstorming`, `saas-architect`.
- **Frontend & Komposisi**: `micro-frontend-architect` (federasi modul runtime & SDUI), `headless-cms-expert` (API konten), `ecommerce-expert` (checkout komposabel).
- **API, Gateway & BFF**: `api-design-expert` (kontrak OpenAPI), `api-gateway-proxy-expert` (mesh terfederasi & proxy), `event-driven-architect` (koreografi event Kafka/RabbitMQ).
- **Runtime Cloud & Routing AI**: `cloud-hosting-expert` (deployment edge multi-region), `adaptive-model-cascade` (routing model AI komposabel).

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec composable-mach-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec composable-mach-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
