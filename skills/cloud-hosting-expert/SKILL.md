---
name: cloud-hosting-expert
description: "Expert guide for deploying SaaS applications with multiple entry points on modern edge and serverless platforms like Vercel and Cloudflare / Panduan ahli untuk mendeploy aplikasi SaaS dengan multiple entry points di platform edge dan serverless modern seperti Vercel dan Cloudflare."
author: "Antigravity"
---

# Cloud Hosting & Edge Deployment Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill provides expertise on deploying modern SaaS architectures—especially those using Multiple Entry Points—on advanced cloud hosting platforms like Vercel and Cloudflare. It covers edge caching, serverless functions, routing configurations, and custom domains.

### Core Strategies for Multiple Entry Points

#### 1. Vercel: Rewrites and Edge Middleware
When deploying a Multi-Page Application or an app with multiple entry points on Vercel, you can use `vercel.json` rewrites or Vercel Edge Middleware to route traffic intelligently without hitting a heavy monolithic router.
- **Rewrites (`vercel.json`)**: Map `/api/*` to an `api/index.js` or `api/webhook.ts` entry point, map `/admin/*` to an `admin/index.js` entry, and route everything else to the public landing page entry.
- **Edge Middleware**: Use `middleware.ts` to inspect the host header (for multi-tenant subdomains) or paths, and rewrite the request to the correct entry point transparently (e.g., rewriting `tenant1.myapp.com` to `/tenant-entry?tenant=tenant1`).

#### 2. Cloudflare: Workers and Custom Domains
Cloudflare provides powerful edge routing via Cloudflare Workers and Cloudflare for SaaS.
- **Workers**: Deploy a Cloudflare Worker that acts as a global edge router. It can inspect incoming requests, check authentication at the edge, and route `/webhook` directly to the webhook entry point, bypassing the main application overhead.
- **Cloudflare for SaaS**: Configure SSL and routing for hundreds of tenant custom domains, pointing them all to your `tenant` entry point seamlessly while keeping marketing traffic on the primary domain entry point.

#### 3. Caching and Performance
By separating entry points, you can define aggressive caching rules tailored to each:
- **Public Landing Entry**: Cache heavily at the Edge (CDN) with stale-while-revalidate.
- **Webhook Entry**: No caching, ensure direct execution.
- **Tenant Dashboard Entry**: Cache static assets but never cache the HTML/JSON data for authenticated routes.

### Orchestrating with Other Skills
- **With `multiple-entry-points`**: Leverage `vercel.json` or Cloudflare Workers to physically enforce the logical separation of your entry points at the network layer.
- **With `saas-multi-tenant`**: Use Vercel Middleware or Cloudflare Workers to parse `tenant_id` from custom domains or subdomains before the request even hits your database.

### Trigger Conditions
- The user is deploying a web application to Vercel, Cloudflare, or similar edge platforms.
- The user needs to configure routing for an app with multiple entry points (e.g., separating API, admin, and public traffic).
- The user is setting up custom domains or subdomains for a multi-tenant SaaS.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini memberikan keahlian dalam men-deploy arsitektur SaaS modern—khususnya yang menggunakan *Multiple Entry Points*—pada platform cloud hosting canggih seperti Vercel dan Cloudflare. Panduan ini mencakup *edge caching*, *serverless functions*, konfigurasi routing, dan custom domain.

### Strategi Inti untuk Multiple Entry Points

#### 1. Vercel: Rewrites dan Edge Middleware
Saat men-deploy Multi-Page Application atau aplikasi dengan beberapa *entry point* di Vercel, Anda dapat menggunakan `rewrites` di `vercel.json` atau *Vercel Edge Middleware* untuk merutekan lalu lintas secara cerdas tanpa melalui router monolitik yang berat.
- **Rewrites (`vercel.json`)**: Arahkan `/api/*` ke *entry point* `api/index.js` atau `api/webhook.ts`, arahkan `/admin/*` ke *entry point* `admin/index.js`, dan sisa lalu lintas ke *entry point* landing page publik.
- **Edge Middleware**: Gunakan `middleware.ts` untuk memeriksa *host header* (untuk subdomain multi-tenant) atau path, dan secara transparan merutekan permintaan ke *entry point* yang benar (misalnya, mengarahkan `tenant1.myapp.com` ke `/tenant-entry?tenant=tenant1`).

#### 2. Cloudflare: Workers dan Custom Domains
Cloudflare menyediakan perutean edge yang sangat tangguh melalui Cloudflare Workers dan Cloudflare for SaaS.
- **Workers**: Deploy Cloudflare Worker yang bertindak sebagai router edge global. Worker dapat memeriksa permintaan masuk, dan merutekan `/webhook` langsung ke *entry point* webhook dengan melewatkan *overhead* aplikasi utama.
- **Cloudflare for SaaS**: Konfigurasikan SSL dan routing untuk ratusan domain khusus (custom domain) tenant, dan arahkan semuanya ke *entry point* `tenant` Anda dengan mulus sambil menjaga *traffic* marketing tetap pada *entry point* domain utama.

#### 3. Caching dan Performa
Dengan memisahkan *entry points*, Anda dapat menentukan aturan caching agresif yang disesuaikan untuk masing-masing jalur:
- **Entry Point Publik (Landing Page)**: Lakukan cache secara besar-besaran di Edge (CDN) dengan mekanisme stale-while-revalidate.
- **Entry Point Webhook**: Tanpa cache, pastikan dieksekusi secara langsung.
- **Entry Point Dashboard Tenant**: Lakukan cache pada aset statis tetapi jangan pernah melakukan cache pada HTML/JSON untuk rute yang diautentikasi.

### Orkestrasi dengan Skill Lain
- **Dengan `multiple-entry-points`**: Manfaatkan `vercel.json` atau Cloudflare Workers untuk memaksakan pemisahan logis *entry points* Anda secara fisik di lapisan jaringan (Network Layer).
- **Dengan `saas-multi-tenant`**: Gunakan Vercel Middleware atau Cloudflare Workers untuk mengekstrak `tenant_id` dari custom domain atau subdomain sebelum permintaan mencapai database Anda.

### Kondisi Pemicu
- Pengguna sedang men-deploy aplikasi web ke Vercel, Cloudflare, atau platform edge serupa.
- Pengguna perlu mengonfigurasi routing untuk aplikasi dengan beberapa *entry point* (misal: memisahkan traffic API, admin, dan publik).
- Pengguna sedang menyiapkan custom domain atau subdomain untuk SaaS multi-tenant.
