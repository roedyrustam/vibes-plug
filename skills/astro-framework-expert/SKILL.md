---
name: astro-framework-expert
description: "Expert guide for Astro 5+ framework — Content Collections, Islands Architecture, View Transitions, partial hydration, and MDX integration / Panduan ahli framework Astro 5+ — Content Collections, Islands Architecture, View Transitions, partial hydration, dan integrasi MDX."
author: "vibes-plug-swarm"
---

# Astro Framework Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`seo`**: Astro's built-in SEO capabilities, sitemaps, and structured data.
- **`performance-web-vitals`**: Astro's zero-JS-by-default performance optimization.
- **`tailwind-expert`**: Tailwind CSS v4 integration with Astro.
- **`headless-cms-expert`**: Content fetching from Sanity/Payload/Strapi in Astro.
- **`ci-cd-devops-architect`**: Deploying Astro to Vercel, Cloudflare Pages, or Netlify.

### Description
Expert guide for building high-performance, content-first websites with Astro 5+. Covers Content Collections (type-safe content), Islands Architecture (partial hydration), View Transitions, server-side rendering, hybrid rendering, MDX integration, Astro DB, and multi-framework component support (React, Vue, Svelte in one project).

### Trigger Conditions
- Building content-heavy websites (blogs, docs, marketing pages, portfolios).
- Choosing between Astro and Next.js for a content-first project.
- Implementing partial hydration or Islands Architecture.
- Creating documentation sites or landing pages optimized for performance.
- Using multiple UI frameworks (React + Vue + Svelte) in one project.

---

### Core Concepts

#### Astro vs Next.js Decision Guide

| Criteria | Astro 5 | Next.js 15 |
|----------|---------|------------|
| Primary Focus | Content sites | Full-stack apps |
| Default JS Shipped | 0 KB | React runtime |
| Rendering | Static-first, opt-in SSR | SSR-first, opt-in static |
| Multi-framework | ✅ React, Vue, Svelte, Solid | React only |
| Content Collections | ✅ Built-in, type-safe | Manual with MDX |
| Server Islands | ✅ Deferred rendering | PPR (similar) |
| **Choose When** | Content, SEO, speed critical | Complex interactivity |

**Recommendation:** Choose **Astro** for content-driven sites where performance and SEO are top priorities. Choose **Next.js** for interactive web applications with complex state.

#### 1. Project Setup

```bash
# Create new Astro project
npm create astro@latest ./my-site -- --template blog --typescript strict

# Add integrations
npx astro add tailwind react mdx sitemap
```

#### 2. Content Collections (Type-Safe Content)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content', // Markdown/MDX files
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  type: 'data', // JSON/YAML files
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    bio: z.string(),
  }),
});

export const collections = { blog, authors };
```

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <time>{post.data.pubDate.toLocaleDateString()}</time>
  <Content />
</article>
```

#### 3. Islands Architecture (Partial Hydration)

```astro
---
// Only hydrate interactive components — rest ships as 0 JS
import Newsletter from '../components/Newsletter.tsx';
import Counter from '../components/Counter.vue';
import Chart from '../components/Chart.svelte';
---

<!-- Static by default — no JS shipped -->
<h1>My Blog Post</h1>
<p>This is static HTML with zero JavaScript.</p>

<!-- Hydrate only when visible (lazy loading) -->
<Newsletter client:visible />

<!-- Hydrate on page load -->
<Counter client:load />

<!-- Hydrate only on interaction (click, hover) -->
<Chart client:idle />

<!-- Hydrate only on specific media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

#### 4. View Transitions

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <nav transition:persist><!-- Persists across pages --></nav>
    <main transition:animate="slide">
      <slot />
    </main>
  </body>
</html>
```

#### 5. Server Islands (Deferred Rendering)

```astro
---
// Renders on the server, deferred from the initial page load
// Great for personalized content in otherwise static pages
---
<UserGreeting server:defer>
  <p slot="fallback">Loading...</p>
</UserGreeting>
```

### Production Checklist
- [ ] Content Collections with strict Zod schemas.
- [ ] Sitemap integration enabled (`@astrojs/sitemap`).
- [ ] Image optimization with `astro:assets`.
- [ ] View Transitions for smooth page navigation.
- [ ] Hybrid rendering (static + SSR where needed).
- [ ] Deploy adapter configured (Vercel, Cloudflare, Node).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`seo`**: Kemampuan SEO bawaan Astro, sitemap, dan data terstruktur.
- **`performance-web-vitals`**: Optimasi performa zero-JS-by-default Astro.
- **`tailwind-expert`**: Integrasi Tailwind CSS v4 dengan Astro.
- **`headless-cms-expert`**: Pengambilan konten dari Sanity/Payload/Strapi di Astro.

### Deskripsi
Panduan ahli untuk membangun website berperforma tinggi dan berfokus konten dengan Astro 5+. Mencakup Content Collections, Islands Architecture (partial hydration), View Transitions, rendering hybrid, integrasi MDX, Astro DB, dan dukungan multi-framework (React, Vue, Svelte dalam satu proyek).

### Kondisi Pemicu
- Membangun website berat konten (blog, docs, halaman marketing, portfolio).
- Memilih antara Astro dan Next.js untuk proyek konten.
- Mengimplementasikan partial hydration atau Islands Architecture.
- Membuat situs dokumentasi atau landing page yang dioptimalkan untuk performa.
