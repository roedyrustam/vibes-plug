---
name: ecommerce-expert
description: "E-commerce architecture, product catalogs, cart, and checkout UX / Arsitektur e-commerce, katalog produk, keranjang, dan checkout UX."
author: "Roedy Rustam"
version: "4.4.4"

---

# E-Commerce Architecture & Modern Storefront Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production guide for high-converting e-commerce architectures, headless storefronts (Medusa.js v2, Shopify Storefront API, Saleor), inventory atomicity, and multi-rail payment integrations (DOKU Checkout, SNAP BI, Stripe). Covers atomic stock reservations to prevent race-condition overselling during flash sales, cart session state machines, structured schema markup (`Product`, `Offer`, `BreadcrumbList`), and localized checkout workflows.

### Trigger Conditions
- Designing or developing an e-commerce platform, marketplace, or custom storefront.
- Integrating headless commerce engines (Medusa.js v2, Shopify Storefront API).
- Preventing inventory race conditions during high-concurrency checkout traffic.
- Integrating localized Indonesian payment methods (DOKU Virtual Account, QRIS, Direct Debit).
- Optimizing product page Core Web Vitals and SEO schema.

### Atomic Inventory Reservation Pattern (PostgreSQL / Drizzle)
Prevents overselling during high-concurrency flash sales using row-level pessimistic locking (`FOR UPDATE`):

```typescript
// src/services/inventory.service.ts
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export interface ReserveStockResult {
  success: boolean;
  orderId?: string;
  errorMessage?: string;
}

export async function reserveProductStockAtomic(
  productId: string,
  requestedQuantity: number,
  orderId: string
): Promise<ReserveStockResult> {
  return await db.transaction(async (tx) => {
    // 1. Lock the inventory row strictly for update
    const [product] = await tx.execute(sql`
      SELECT id, stock_quantity, price_cents, is_active
      FROM products
      WHERE id = ${productId}
      FOR UPDATE
    `);

    if (!product || !product.is_active) {
      return { success: false, errorMessage: 'Product is unavailable.' };
    }

    if (product.stock_quantity < requestedQuantity) {
      return { success: false, errorMessage: 'Insufficient stock remaining.' };
    }

    // 2. Decrement available inventory atomically
    await tx.execute(sql`
      UPDATE products
      SET stock_quantity = stock_quantity - ${requestedQuantity},
          updated_at = NOW()
      WHERE id = ${productId}
    `);

    // 3. Create provisional stock reservation record (15-minute TTL)
    await tx.execute(sql`
      INSERT INTO stock_reservations (order_id, product_id, quantity, expires_at)
      VALUES (${orderId}, ${productId}, ${requestedQuantity}, NOW() + INTERVAL '15 minutes')
    `);

    return { success: true, orderId };
  });
}
```

### Medusa.js v2 Workflow Engine Integration

```typescript
// src/workflows/create-order-workflow.ts
import { createWorkflow, WorkflowResponse, StepResponse, createStep } from '@medusajs/framework/workflows-sdk';

const reserveInventoryStep = createStep(
  'reserve-inventory-step',
  async ({ orderId, items }: { orderId: string; items: any[] }, { container }) => {
    // Execute atomic reservation
    return new StepResponse({ status: 'reserved', orderId }, { orderId, items });
  },
  async (compensatingData, { container }) => {
    // Compensation logic if downstream payment fails: roll back reserved stock
    console.log(`[Compensation] Releasing reserved stock for order ${compensatingData.orderId}`);
  }
);

export const placeAtomicOrderWorkflow = createWorkflow(
  'place-atomic-order',
  function (input: { orderId: string; items: any[]; paymentDetails: any }) {
    const reservation = reserveInventoryStep(input);
    return new WorkflowResponse(reservation);
  }
);
```

### E-Commerce SEO Schema Markup (JSON-LD)

```tsx
// src/components/seo/ProductSchema.tsx
export function ProductSchema({ product }: { product: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.thumbnailUrl,
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: 'IDR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://vibesstore.internal/products/${product.handle}`,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

## Orchestration & Integration
- **`modern-web-guidance`**: HTML5/CSS standards, modern checkout forms, and web payment APIs.
- **`design-system-architect`**: Storefront design tokens, product cards, pricing badges, and cart drawers.
- **`tailwind-expert`**: Responsive e-commerce grid layouts, gallery carousels, and checkout steps.
- **`ui-ux-pro-max`**: High-converting cart/checkout UX, tabular prices (`tabular-nums`), and 5-state interactive buttons.
- **`visual-ui-auditor`**: Multimodal vision auditing of product storefronts, checkout flows, and mobile responsiveness.
- **`anti-slop`**: Anti-slop e-commerce UI craft, eliminating fake placeholder items and broken cart drawers.
- **`doku-payment-gateway`**: Manages DOKU Checkout modals, QRIS generation, and SNAP BI webhooks.
- **`search-engine-expert`**: Implements full-text and faceted search for catalogs.
- **`nextjs-app-router-expert`**: Fast Server Components for product detail pages with instant SSR.
- **`seo`**: Validates JSON-LD schema markup and Core Web Vitals compliance.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec ecommerce-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan produksi untuk arsitektur e-commerce tingkat lanjut, *headless storefront* (Medusa.js v2, Shopify Storefront API, Saleor), atomisitas inventaris, dan integrasi pembayaran multi-jalur (DOKU Checkout, SNAP BI, Stripe). Mencakup reservasi stok atomik untuk mencegah *overselling* saat *flash sale*, mesin state keranjang belanja, markup skema terstruktur (`Product`, `Offer`), dan alur checkout terlokalisasi.

### Kondisi Pemicu
- Merancang atau membangun platform toko online, marketplace, atau toko headless kustom.
- Mengintegrasikan engine headless commerce seperti Medusa.js v2 atau Shopify Storefront API.
- Mencegah *race condition* stok saat terjadi lonjakan pembelian bersamaan (*flash sale*).
- Menghubungkan metode pembayaran lokal Indonesia (DOKU QRIS, Virtual Account BCA/Mandiri/BRI, Direct Debit).
- Optimasi Core Web Vitals dan SEO halaman detail produk.

### Pola Integrasi Pembayaran Lokal DOKU SNAP BI

```typescript
// src/lib/payments/doku-checkout.ts
export async function createDokuPaymentLink(order: { id: string; amount: number; customer: any }) {
  const response = await fetch('https://api.doku.com/checkout/v1/payment', {
    method: 'POST',
    headers: {
      'Client-Id': process.env.DOKU_CLIENT_ID!,
      'Request-Id': order.id,
      'Request-Timestamp': new Date().toISOString(),
      'Signature': generateDokuHmacSignature(order),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order: {
        invoice_number: order.id,
        amount: order.amount,
        currency: 'IDR',
      },
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
    }),
  });

  return await response.json();
}
```

### 3 Prinsip E-Commerce Skala Tinggi
1. **Pessimistic Locking untuk Stok Kritis**: Gunakan `SELECT ... FOR UPDATE` di dalam transaksi database saat mengurangi stok agar dua pengguna tidak dapat membeli unit barang terakhir secara bersamaan.
2. **Kompensasi SAGA Otomatis**: Jika pembayaran gagal atau kedaluwarsa setelah 15 menit, sistem wajib membatalkan reservasi dan mengembalikan stok secara otomatis.
3. **Data Terstruktur JSON-LD**: Selalu sertakan schema `Product` dan `Offer` agar informasi harga dan ketersediaan stok muncul langsung di hasil pencarian Google.

## Integrasi Orkestrasi
- **`modern-web-guidance`**: Standar HTML5/CSS, form checkout modern, dan API pembayaran web.
- **`design-system-architect`**: Token desain etalase, kartu produk, badge harga, dan drawer keranjang.
- **`tailwind-expert`**: Tata letak grid e-commerce responsif, carousel galeri, dan langkah checkout.
- **`ui-ux-pro-max`**: UX keranjang/checkout berkonversi tinggi, harga tabular (`tabular-nums`), dan tombol 5-state.
- **`visual-ui-auditor`**: Audit visual multimodal untuk etalase produk, alur checkout, dan responsivitas mobile.
- **`anti-slop`**: Desain UI e-commerce anti-slop, mengeliminasi barang dummy palsu dan drawer keranjang rusak.
- **`doku-payment-gateway`**: Menangani otentikasi webhook SNAP BI dan verifikasi pembayaran.
- **`search-engine-expert`**: Menyediakan fitur pencarian faset (filter merk, kategori, harga).
- **`nextjs-app-router-expert`**: Menyajikan halaman produk dengan waktu muat ultra-cepat melalui streaming SSR.
- **`seo`**: Mengoptimalkan indeks pencarian dan struktur metadata produk.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec ecommerce-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
