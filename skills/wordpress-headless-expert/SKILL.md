---
name: wordpress-headless-expert
description: "Headless WordPress architecture with WPGraphQL, ACF, and Next.js / Arsitektur headless WordPress dengan WPGraphQL, ACF, dan Next.js."
author: "Roedy Rustam"
version: "4.8.0"

---

# WordPress Headless Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Frontend & Design System**: `senior-frontend`, `design-system-architect`, `ui-ux-pro-max`, `modern-web-guidance`, and `anti-slop` for headless frontend rendering (Next.js 15 / Astro 5), Faust.js template components, typography tokens, and responsive layouts.
- **Visual Auditing**: `visual-ui-auditor` for verifying WordPress preview iframe fidelity, responsive breakpoints, and 1px crisp borders.
- **CMS & Backend**: `headless-cms-expert` (CMS comparison and migration) and `nextjs-app-router-expert` (Next.js App Router with WPGraphQL).
- **SEO & Performance**: `seo` (Yoast/RankMath metadata syncing) and `performance-web-vitals` (ISR caching and edge SSR).
- **Orchestration**: `brainstorming` and `zero-to-prod-orchestrator` for decoupled web architecture.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `astro-framework-expert`, `documentation-site-expert`

### Description
Production guide for architecting, deploying, and maintaining headless WordPress systems. Covers decoupled WordPress backends with WPGraphQL and Advanced Custom Fields (ACF Pro), frontend rendering with Next.js 15 or Astro 5, Faust.js framework integration, webhook-triggered on-demand revalidation, authentication (JWT / Application Passwords), and WooCommerce headless setups.

### Hard Guardrails (Declarative Invariants)
- **Authenticated Mutation Endpoint Invariant**: Headless mutations, preview routes, and draft content revisions must authenticate with cryptographic signatures (JWT / Application Passwords / Webhook secret verification); exposing unauthenticated mutation or draft endpoints is strictly prohibited.
- **On-Demand Tagged ISR Revalidation**: Content updates from WordPress publish webhooks must trigger on-demand revalidation using specific cache tags (`revalidateTag('wordpress')` or `res.revalidate()`); polling WordPress REST API on every request or blanket cache purging is banned.
- **Typed WPGraphQL Schema Contract**: All frontend data fetching must use typed GraphQL queries (`gql` / TypedDocumentNode); raw SQL injection into WP endpoints or untyped REST querying is prohibited.
- **Zero Exposed Admin Credentials**: WordPress administrative secrets, application passwords, and secret webhook keys must never be exposed to public frontend bundles (must reside strictly in server-only environment variables).

### Non-Functional Requirements (NFR Contract)
- **Edge Cache TTFB**: Edge-cached TTFB $< 100\text{ ms}$ (p95) for content pages.
- **Webhook Revalidation Propagation**: Content update propagation from WordPress publish event to edge cache invalidation $< 1.5\text{ s}$.

### Trigger Conditions
- Decoupling an existing WordPress site into a headless architecture with Next.js/Astro.
- Querying WordPress content using WPGraphQL and ACF Pro field groups.
- Synchronizing SEO metadata (Yoast / RankMath) with modern frontend metadata APIs.
- Setting up on-demand ISR revalidation hooks from WordPress publish events.

---

### Core Architecture & Patterns

#### 1. WPGraphQL Query Integration (Next.js 15 Server Component)
```typescript
const WP_GRAPHQL_ENDPOINT = process.env.WORDPRESS_API_URL || 'https://cms.example.com/graphql';

interface PostPreview {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

export async function fetchWordPressPosts(): Promise<PostPreview[]> {
  const query = `
    query GetLatestPosts {
      posts(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { tags: ['wordpress:posts'], revalidate: 3600 },
  });

  const { data } = await res.json();
  return data?.posts?.nodes ?? [];
}
```

#### 2. Yoast / RankMath SEO Metadata Extraction
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const query = `
    query GetPostSEO($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug: params.slug } }),
  });

  const { data } = await res.json();
  const seo = data?.post?.seo;

  return {
    title: seo?.title || data?.post?.title,
    description: seo?.metaDesc,
    openGraph: {
      title: seo?.opengraphTitle,
      description: seo?.opengraphDescription,
      images: seo?.opengraphImage ? [{ url: seo.opengraphImage.sourceUrl }] : [],
    },
  };
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec wordpress-headless-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Frontend & Design System**: `senior-frontend`, `design-system-architect`, `ui-ux-pro-max`, `modern-web-guidance`, dan `anti-slop` untuk perenderan frontend headless (Next.js 15 / Astro 5), komponen template Faust.js, token tipografi, dan tata letak responsif.
- **Audit Visual**: `visual-ui-auditor` untuk memverifikasi fidelitas iframe pratinjau WordPress, breakpoint responsif, dan border tajam 1px.
- **CMS & Backend**: `headless-cms-expert` (perbandingan dan migrasi CMS) dan `nextjs-app-router-expert` (Next.js App Router dengan WPGraphQL).
- **SEO & Performa**: `seo` (sinkronisasi metadata Yoast/RankMath) dan `performance-web-vitals` (caching ISR dan edge SSR).
- **Orkestrasi**: `brainstorming` dan `zero-to-prod-orchestrator` untuk arsitektur web decoupled.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `astro-framework-expert`, `documentation-site-expert`

### Deskripsi
Panduan produksi untuk membangun dan memelihara arsitektur WordPress headless. Menggunakan WPGraphQL, ACF Pro, Faust.js, Next.js 15, atau Astro 5, revalidasi ISR instan via webhook, autentikasi aman, dan integrasi WooCommerce decoupled.

### Hard Guardrails (Invarian Deklaratif - Bahasa Indonesia)
- **Invarian Endpoint Mutasi Terautentikasi**: Mutasi headless, rute pratinjau, dan revisi draft konten wajib terautentikasi dengan tanda tangan kriptografis (JWT / Application Passwords / verifikasi webhook secret); membuka akses mutasi atau draf tanpa autentikasi dilarang keras.
- **Revalidasi ISR Berbasis Tag On-Demand**: Pembaruan konten dari webhook publikasi WordPress wajib memicu revalidasi on-demand menggunakan tag cache spesifik (`revalidateTag('wordpress')` atau `res.revalidate()`); melakukan polling REST API WordPress di setiap permintaan dilarang.
- **Kontrak Skema WPGraphQL Bertipe**: Seluruh pengambilan data frontend wajib menggunakan query GraphQL bertipe (`gql` / TypedDocumentNode); injeksi raw SQL ke endpoint WordPress atau query REST tanpa tipe dilarang.
- **Nol Kredensial Admin Terekspos**: Rahasia administratif WordPress, Application Passwords, dan secret key webhook tidak boleh bocor ke bundle frontend publik (wajib berada di server-only environment variables).

### Non-Functional Requirements (Kontrak NFR - Bahasa Indonesia)
- **TTFB Cache Edge**: TTFB halaman konten ter-cache di edge $< 100\text{ ms}$ (p95).
- **Propagasi Revalidasi Webhook**: Propagasi pembaruan dari penerbitan konten di WordPress hingga invalidasi cache di edge $< 1.5\text{ s}$.

### Kondisi Pemicu
- Memisahkan frontend WordPress ke arsitektur decoupled (Next.js/Astro).
- Mengambil konten WordPress via WPGraphQL dan grup field ACF Pro.
- Mengonfigurasi revalidasi instan saat konten diterbitkan di WordPress.

---

### Implementasi Pola Kunci (TypeScript & Next.js 15)

```typescript
const WP_GRAPHQL_ENDPOINT = process.env.WORDPRESS_API_URL || 'https://cms.example.com/graphql';

export async function ambilArtikelWordPress() {
  const query = `
    query DapatkanArtikelTerbaru {
      posts(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { tags: ['wordpress:artikel'], revalidate: 3600 },
  });

  const { data } = await res.json();
  return data?.posts?.nodes ?? [];
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec wordpress-headless-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
