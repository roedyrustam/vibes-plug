---
name: svelte-sveltekit-expert
description: "Expert guide for Svelte 5 (Runes) and SvelteKit 2+ — fine-grained reactivity, server-first architecture, form actions, and SSR/SSG / Panduan ahli Svelte 5 (Runes) dan SvelteKit 2+ — reaktivitas fine-grained, arsitektur server-first, form actions, dan SSR/SSG."
author: "vibes-plug-swarm"
---

# Svelte & SvelteKit Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`tailwind-expert`**: Tailwind CSS v4 integration with SvelteKit.
- **`performance-web-vitals`**: Svelte's compile-time optimizations and zero-overhead reactivity.
- **`e2e-testing-expert`**: Playwright testing for SvelteKit applications.
- **`typescript-expert`**: TypeScript integration with Svelte 5 Runes.

### Description
Expert guide for building high-performance applications with Svelte 5 and SvelteKit 2+. Covers Runes (`$state`, `$derived`, `$effect`, `$props`), server-first architecture, form actions, load functions, streaming, SSR/SSG/ISR rendering modes, and migration from Svelte 4.

### Trigger Conditions
- Building applications with Svelte or SvelteKit.
- Migrating from Svelte 4 to Svelte 5 Runes.
- Choosing between Svelte and React/Vue for a new project.
- Implementing server-side rendering with SvelteKit.

---

### Svelte 5 Runes

```svelte
<script lang="ts">
  // Svelte 5 Runes — fine-grained reactivity
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log(`Count changed to ${count}`);
  });

  // Props with Runes
  let { title, onSubmit }: { title: string; onSubmit: (v: number) => void } = $props();
</script>

<h1>{title}</h1>
<button onclick={() => count++}>Count: {count} (doubled: {doubled})</button>
<button onclick={() => onSubmit(count)}>Submit</button>
```

### SvelteKit Server Patterns

```typescript
// src/routes/posts/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
  const posts = await fetch('/api/posts').then((r) => r.json());
  return { posts };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title');
    if (!title) return fail(400, { error: 'Title required' });
    // Create post...
    return { success: true };
  },
};
```

## Orchestration & Integration
- `tailwind-expert`, `performance-web-vitals`, `e2e-testing-expert`, `typescript-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun aplikasi berperforma tinggi dengan Svelte 5 dan SvelteKit 2+. Mencakup Runes, arsitektur server-first, form actions, load functions, streaming, dan mode rendering SSR/SSG/ISR.

### Kondisi Pemicu
- Membangun aplikasi dengan Svelte atau SvelteKit.
- Migrasi dari Svelte 4 ke Svelte 5 Runes.
- Memilih antara Svelte dan React/Vue untuk proyek baru.
