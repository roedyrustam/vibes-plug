---
name: ecommerce-expert
description: "Expert guide for e-commerce architecture (Shopify Storefront, Medusa.js, Saleor), product catalogs, cart/checkout UX, and order management / Panduan ahli arsitektur e-commerce (Shopify, Medusa.js, Saleor), katalog produk, UX keranjang/checkout, dan manajemen pesanan."
author: "vibes-plug-swarm"
---

# E-Commerce Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`payment-gateway-expert`**: Stripe, Xendit, Midtrans payment integration.
- **`nextjs-app-router-expert`**: SSR product pages and cart functionality.
- **`seo`**: Product schema markup, sitemaps, and SEO optimization.
- **`saas-billing`**: Subscription-based e-commerce models.
- **`headless-cms-expert`**: Content management for product descriptions and pages.

### Description
Expert guide for building modern e-commerce applications. Covers Shopify Storefront API (headless commerce), Medusa.js v2 (open-source, self-hosted), Saleor (GraphQL-first), product catalog design, cart state management, checkout flows, inventory management, order fulfillment, and SEO for product pages.

### Trigger Conditions
- Building an online store or e-commerce platform.
- Integrating Shopify Storefront API with custom frontend.
- Setting up Medusa.js or Saleor for headless commerce.
- Designing product catalog schemas and cart/checkout UX.

---

### Platform Selection

| Platform | Type | API | Self-Hosted | Best For |
|----------|------|-----|-------------|----------|
| Shopify Storefront | SaaS + Headless | GraphQL | ❌ | Quick launch, large catalog |
| Medusa.js v2 | Open-source | REST + JS SDK | ✅ | Full control, customization |
| Saleor | Open-source | GraphQL | ✅ | Enterprise, multi-channel |
| WooCommerce | Plugin (WordPress) | REST | ✅ | WordPress ecosystem |

### Core Patterns

```typescript
// Shopify Storefront API — Fetch products
const SHOPIFY_QUERY = `{
  products(first: 12, sortKey: BEST_SELLING) {
    edges {
      node {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 1) { edges { node { url altText } } }
        variants(first: 5) { edges { node { id title availableForSale price { amount } } } }
      }
    }
  }
}`;

async function getProducts() {
  const res = await fetch(process.env.SHOPIFY_STOREFRONT_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_TOKEN!,
    },
    body: JSON.stringify({ query: SHOPIFY_QUERY }),
  });
  return (await res.json()).data.products.edges.map((e) => e.node);
}
```

## Orchestration & Integration
- `payment-gateway-expert`, `nextjs-app-router-expert`, `seo`, `saas-billing`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun aplikasi e-commerce modern. Mencakup Shopify Storefront API, Medusa.js v2, Saleor, desain katalog produk, manajemen keranjang, alur checkout, manajemen inventaris, dan SEO halaman produk.

### Kondisi Pemicu
- Membangun toko online atau platform e-commerce.
- Mengintegrasikan Shopify Storefront API dengan frontend kustom.
- Menyiapkan Medusa.js atau Saleor untuk headless commerce.
