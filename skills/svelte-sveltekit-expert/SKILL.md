---
name: svelte-sveltekit-expert
description: "Expert guide for Svelte 5 (Runes) and SvelteKit 2+ — fine-grained reactivity, snippets, server-first architecture, form actions, and SSR/SSG / Panduan ahli Svelte 5 (Runes) dan SvelteKit 2+ — reaktivitas fine-grained, snippets, arsitektur server-first, form actions, dan SSR/SSG."
author: "Roedy Rustam"
version: "4.4.2"

---

# Svelte 5 & SvelteKit 2 Expert (Runes Standard 2026)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream System Design**: `brainstorming`, `zero-to-prod-orchestrator` (Phase 3 & Phase 4).
- **Styling & Web Standards**: `modern-web-guidance`, `tailwind-expert`, `modern-css-native-expert`, `design-system-architect`.
- **Quality & Performance**: `performance-web-vitals`, `e2e-testing-expert`, `anti-slop`, `visual-ui-auditor`.
- **Backend & APIs**: `js-backend-expert`, `database-orm-expert`, `typescript-expert`.

### Description
Production-grade guide for building high-performance web applications using **Svelte 5** and **SvelteKit 2+**. Covers the complete Runes reactivity paradigm (`$state`, `$derived`, `$derived.by`, `$effect`, `$props`, `$bindable`), snippet composition replacing legacy slots, progressive enhancement form actions (`use:enhance`), streaming server promises in `+page.server.ts`, and shallow routing (`pushState`) for modal overlays.

### Trigger Conditions
- Scaffolding new applications with Svelte 5 and SvelteKit 2.
- Refactoring legacy Svelte 3/4 reactive declarations (`let x = 0; $: doubled = x * 2;`) to Svelte 5 Runes.
- Composing modular UI components using Svelte 5 Snippets instead of legacy `<slot>`.
- Implementing form submissions with atomic server actions and zero-JS progressive enhancement.
- Streaming large asynchronous datasets to the client without blocking the initial SSR HTML payload.

---

### Core Architectural Patterns

#### 1. Complete Svelte 5 Runes Reference

| Rune | Purpose | Svelte 4 Legacy Syntax |
|---|---|---|
| `$state(val)` | Deeply reactive state proxy | `let val = ...` |
| `$state.raw(val)` | Shallow reactive state (ideal for immutable/large payloads) | N/A |
| `$derived(expr)` | Cached reactive derivation | `$: val = expr` |
| `$derived.by(() => {})` | Complex multi-line derived computation | `$: { ... }` |
| `$effect(() => {})` | Post-DOM mount & update side-effect with cleanup | `onMount`, `afterUpdate`, `$: { ... }` |
| `$effect.pre(() => {})` | Pre-DOM update effect (e.g. scroll position capture) | `beforeUpdate` |
| `$props()` | Type-safe destructured component props | `export let prop` |
| `$bindable()` | Explicit two-way prop binding allowance | Direct two-way binding |
| `$inspect(val)` | Automatic dev-mode deep state inspector | `console.log(val)` in `$:` |

#### 2. Component Composition with Svelte 5 Snippets (No Slots)
In Svelte 5, `<slot>` is deprecated. Components accept Snippets as typed functions:
```svelte
<!-- src/lib/components/DataTable.svelte -->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Props {
    items: T[];
    header: Snippet;
    row: Snippet<[T]>;
    empty?: Snippet;
  }

  let { items, header, row, empty }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-border bg-card">
  <table class="w-full text-left text-sm">
    <thead class="border-b border-border bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
      {@render header()}
    </thead>
    <tbody class="divide-y divide-border">
      {#each items as item}
        <tr class="hover:bg-muted/30 transition-colors">
          {@render row(item)}
        </tr>
      {:else}
        {#if empty}
          <tr>
            <td colspan="100%" class="p-8 text-center text-muted-foreground">
              {@render empty()}
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
```

```svelte
<!-- Usage in consumer page -->
<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  let users = $state<User[]>([
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'Developer' },
  ]);
</script>

{#snippet tableHeader()}
  <tr>
    <th class="p-3">Name</th>
    <th class="p-3">Email</th>
    <th class="p-3">Role</th>
  </tr>
{/snippet}

{#snippet tableRow(user: User)}
  <td class="p-3 font-medium">{user.name}</td>
  <td class="p-3 text-muted-foreground font-mono">{user.email}</td>
  <td class="p-3"><span class="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{user.role}</span></td>
{/snippet}

<DataTable items={users} header={tableHeader} row={tableRow} />
```

#### 3. Two-Way Binding with `$bindable()`
```svelte
<!-- src/lib/components/SearchInput.svelte -->
<script lang="ts">
  interface Props {
    value: string;
    placeholder?: string;
  }

  let { value = $bindable(''), placeholder = 'Search...' }: Props = $props();
</script>

<input
  type="text"
  bind:value
  {placeholder}
  class="px-3 py-2 border rounded-md bg-background text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
/>
```

#### 4. SvelteKit 2 Server Actions with Progressive Enhancement
Atomic server mutation with optimistic state and zero-JS fallback:
```typescript
// src/routes/tasks/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  // Non-blocking streaming promise: do not await slow telemetry data
  return {
    tasks: await db.tasks.findMany({ orderBy: { createdAt: 'desc' } }),
    streamedMetrics: fetchLiveMetrics(), // Streamed as Promise without blocking HTML
  };
};

export const actions: Actions = {
  createTask: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.toString().trim();

    if (!title || title.length < 3) {
      return fail(400, { title, error: 'Title must contain at least 3 characters.' });
    }

    const newTask = await db.tasks.create({ data: { title, completed: false } });
    return { success: true, task: newTask };
  },
};

async function fetchLiveMetrics() {
  await new Promise((r) => setTimeout(r, 400));
  return { activeNodes: 12, uptime: '99.99%' };
}
```

```svelte
<!-- src/routes/tasks/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  let isSubmitting = $state(false);
  let optimisticTasks = $state([...data.tasks]);

  $effect(() => {
    optimisticTasks = [...data.tasks];
  });
</script>

<div class="max-w-xl mx-auto py-8 space-y-6">
  <h1 class="text-2xl font-bold">Project Tasks</h1>

  <form
    method="POST"
    action="?/createTask"
    use:enhance={({ formData, cancel }) => {
      const title = formData.get('title')?.toString().trim();
      if (!title) {
        cancel();
        return;
      }

      isSubmitting = true;
      // Optimistic update
      optimisticTasks = [{ id: `temp-${Date.now()}`, title, completed: false }, ...optimisticTasks];

      return async ({ update }) => {
        isSubmitting = false;
        await update();
      };
    }}
    class="flex gap-2"
  >
    <input
      name="title"
      type="text"
      placeholder="What needs to be done?"
      required
      class="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
    />
    <button
      type="submit"
      disabled={isSubmitting}
      class="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md disabled:opacity-50 text-sm"
    >
      {isSubmitting ? 'Saving...' : 'Add Task'}
    </button>
  </form>

  {#if form?.error}
    <p class="text-sm font-semibold text-destructive">{form.error}</p>
  {/if}

  <ul class="divide-y divide-border border rounded-xl bg-card">
    {#each optimisticTasks as task (task.id)}
      <li class="p-3 text-sm flex items-center justify-between">
        <span>{task.title}</span>
        {#if task.id.startsWith('temp-')}
          <span class="text-xs text-muted-foreground font-mono">Syncing...</span>
        {/if}
      </li>
    {/each}
  </ul>

  <!-- Await streamed non-blocking metrics -->
  {#await data.streamedMetrics}
    <div class="p-4 border rounded-lg bg-muted/40 text-xs animate-pulse text-muted-foreground">
      Loading cluster metrics...
    </div>
  {:then metrics}
    <div class="p-4 border rounded-lg bg-card text-xs flex justify-between font-mono">
      <span>Active Nodes: {metrics.activeNodes}</span>
      <span>Uptime: {metrics.uptime}</span>
    </div>
  {/await}
</div>
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec svelte-sveltekit-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Ideasi & Desain Sistem**: `brainstorming`, `zero-to-prod-orchestrator` (Fase 3 & Fase 4).
- **Styling & Standar Web**: `modern-web-guidance`, `tailwind-expert`, `modern-css-native-expert`, `design-system-architect`.
- **Kualitas & Performa**: `performance-web-vitals`, `e2e-testing-expert`, `anti-slop`, `visual-ui-auditor`.
- **Backend & APIs**: `js-backend-expert`, `database-orm-expert`, `typescript-expert`.

### Deskripsi
Panduan produksi untuk membangun aplikasi web performa tinggi menggunakan **Svelte 5** dan **SvelteKit 2+**. Berfokus pada paradigma reaktivitas Runes secara menyeluruh (`$state`, `$derived`, `$derived.by`, `$effect`, `$props`, `$bindable`), komposisi Snippets pengganti slot lawas, progressive enhancement form actions (`use:enhance`), streaming promise server pada `+page.server.ts`, dan routing shallow (`pushState`) untuk modal URL-preserving.

### Kondisi Pemicu
- Membangun aplikasi baru menggunakan Svelte 5 dan SvelteKit 2.
- Merefaktor kode lama Svelte 3/4 (`let x = 0; $: doubled = x * 2;`) ke sistem Runes Svelte 5.
- Menggubah komponen UI modular menggunakan Snippets Svelte 5 alih-alih `<slot>` lawas.
- Mengimplementasikan pengiriman data formulir atomik via Server Actions dengan fallback zero-JS.
- Mengalirkan (*streaming*) data asinkron lambat ke klien tanpa memblokir rendering HTML SSR awal.

---

### Implementasi Pola Kunci

#### 1. Referensi Lengkap Runes Svelte 5

| Rune | Fungsi & Tujuan | Sintaks Lama Svelte 4 |
|---|---|---|
| `$state(nilai)` | State reaktif mendalam (*deep reactive proxy*) | `let nilai = ...` |
| `$state.raw(nilai)` | State reaktif dangkal (*shallow* untuk objek besar/imutable) | Tidak tersedia |
| `$derived(ekspresi)` | Nilai turunan ter-cache otomatis | `$: nilai = ekspresi` |
| `$derived.by(() => {})` | Kalkulasi turunan kompleks multi-baris | `$: { ... }` |
| `$effect(() => {})` | Efek samping pasca render DOM dengan siklus cleanup | `onMount`, `afterUpdate`, `$: { ... }` |
| `$effect.pre(() => {})` | Efek samping sebelum DOM di-update | `beforeUpdate` |
| `$props()` | Menerima props komponen secara terstruktur & type-safe | `export let prop` |
| `$bindable()` | Memberi izin binding dua arah eksplisit | Binding dua arah otomatis |
| `$inspect(nilai)` | Inspeksi state mendalam saat mode pengembangan | `console.log(nilai)` di `$:` |

#### 2. Komposisi Komponen dengan Svelte 5 Snippets (Tanpa Slot)
Pada Svelte 5, `<slot>` digantikan oleh Snippets bertipe (*typed snippets*):
```svelte
<!-- src/lib/components/TabelData.svelte -->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Props {
    data: T[];
    kepala: Snippet;
    baris: Snippet<[T]>;
    kosong?: Snippet;
  }

  let { data, kepala, baris, kosong }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
  <table class="w-full text-left text-sm">
    <thead class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
      {@render kepala()}
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
      {#each data as item}
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
          {@render baris(item)}
        </tr>
      {:else}
        {#if kosong}
          <tr>
            <td colspan="100%" class="p-8 text-center text-slate-400">
              {@render kosong()}
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
```

#### 3. Form Action SvelteKit 2 dengan Progressive Enhancement & State Optimistik
```typescript
// src/routes/tugas/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  return {
    daftarTugas: await db.tasks.findMany({ orderBy: { createdAt: 'desc' } }),
    metrikServer: ambilMetrikServer(), // Streamed Promise tanpa menunda payload HTML awal
  };
};

export const actions: Actions = {
  tambahTugas: async ({ request }) => {
    const data = await request.formData();
    const judul = data.get('judul')?.toString().trim();

    if (!judul || judul.length < 3) {
      return fail(400, { judul, error: 'Judul tugas minimal terdiri dari 3 karakter.' });
    }

    const tugasBaru = await db.tasks.create({ data: { title: judul, completed: false } });
    return { success: true, tugas: tugasBaru };
  },
};

async function ambilMetrikServer() {
  await new Promise((r) => setTimeout(r, 400));
  return { nodeAktif: 12, uptime: '99.99%' };
}
```

```svelte
<!-- src/routes/tugas/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  let sedangMenyimpan = $state(false);
  let daftarTugasOptimistik = $state([...data.daftarTugas]);

  $effect(() => {
    daftarTugasOptimistik = [...data.daftarTugas];
  });
</script>

<div class="max-w-xl mx-auto py-8 space-y-6">
  <h1 class="text-2xl font-bold">Daftar Tugas Proyek</h1>

  <form
    method="POST"
    action="?/tambahTugas"
    use:enhance={({ formData, cancel }) => {
      const judul = formData.get('judul')?.toString().trim();
      if (!judul) {
        cancel();
        return;
      }

      sedangMenyimpan = true;
      // Pembaruan UI Optimistik instan
      daftarTugasOptimistik = [{ id: `temp-${Date.now()}`, title: judul, completed: false }, ...daftarTugasOptimistik];

      return async ({ update }) => {
        sedangMenyimpan = false;
        await update();
      };
    }}
    class="flex gap-2"
  >
    <input
      name="judul"
      type="text"
      placeholder="Apa yang perlu dikerjakan?"
      required
      class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-sm"
    />
    <button
      type="submit"
      disabled={sedangMenyimpan}
      class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md disabled:opacity-50 text-sm hover:bg-emerald-500 transition"
    >
      {sedangMenyimpan ? 'Menyimpan...' : 'Tambah Tugas'}
    </button>
  </form>

  {#if form?.error}
    <p class="text-sm font-semibold text-rose-600">{form.error}</p>
  {/if}

  <ul class="divide-y divide-slate-200 dark:divide-slate-800 border rounded-xl bg-white dark:bg-slate-900">
    {#each daftarTugasOptimistik as tugas (tugas.id)}
      <li class="p-3 text-sm flex items-center justify-between">
        <span>{tugas.title}</span>
        {#if tugas.id.startsWith('temp-')}
          <span class="text-xs text-slate-400 font-mono">Menyinkronkan...</span>
        {/if}
      </li>
    {/each}
  </ul>

  <!-- Menunggu data streaming metrik asinkron -->
  {#await data.metrikServer}
    <div class="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs animate-pulse text-slate-400">
      Memuat telemetri klaster server...
    </div>
  {:then metrik}
    <div class="p-4 border rounded-lg bg-white dark:bg-slate-900 text-xs flex justify-between font-mono">
      <span>Node Aktif: {metrik.nodeAktif}</span>
      <span>Tingkat Uptime: {metrik.uptime}</span>
    </div>
  {/await}
</div>
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec svelte-sveltekit-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
