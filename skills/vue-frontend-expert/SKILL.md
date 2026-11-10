---
name: vue-frontend-expert
description: "Vue 3 Composition API, Nuxt 3, Pinia, and reactive architecture / Pengembangan Vue 3 Composition API, Nuxt 3, Pinia, dan arsitektur SPA/SSR."
author: "Roedy Rustam"
version: "4.7.2"

---

# Vue Frontend Expert (Vue 3 / Nuxt 3)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `modern-web-guidance` — HTML5/CSS standards, modern browser APIs, and accessibility guidelines.
- `design-system-architect` — Building headless UI components using Radix Vue or VueUse components.
- `modern-css-native-expert` — Native CSS anchor positioning, View Transitions, container queries, and `@starting-style`.
- `tailwind-expert` — Styling Vue/Nuxt components with Tailwind CSS v4.
- `ui-ux-pro-max` — Design intelligence, layout hierarchies, and Vue component tokens.
- `visual-ui-auditor` — Multimodal vision auditing of rendered Vue/Nuxt views.
- `anti-slop` — Anti-slop component craft, zero placeholder stubs, complete reactivity implementations.
- `performance-web-vitals` — Optimizing Nuxt 3 SSR metrics (LCP, INP, CLS).
- **Cross-Domain Synergy & Subagent Swarm Integration**: `senior-frontend`, `state-management-expert`, `tanstack-query-expert`, `pwa-offline-first-expert`

### Description
Production-grade guidance for building highly reactive and scalable frontend applications using **Vue 3 (Composition API)** and **Nuxt 3**. Covers the latest ecosystem tools including **Pinia** for state management, **VueUse** for composables, and **Tailwind CSS v4** integration.

### Trigger Conditions
Activate this skill when the user is:
- Scaffolding a new Vue 3 or Nuxt 3 project.
- Writing or refactoring Vue components using `<script setup>` and Composition API.
- Managing global state with Pinia.
- Handling client-side routing with Vue Router or Nuxt's file-based routing.
- Implementing SSR (Server-Side Rendering) or SSG (Static Site Generation) using Nuxt 3.

---

### Core Concepts

#### 1. Vue 3 Composition API & `<script setup>`
Use the `<script setup>` syntax by default. It provides better type inference, less boilerplate, and superior performance compared to the Options API.

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('Component is mounted!')
})
</script>

<template>
  <button @click="increment">Count is: {{ count }} (Double: {{ doubleCount }})</button>
</template>
```

#### 2. Global State Management (Pinia)
Pinia is the official state management library for Vue. Avoid Vuex in modern applications.

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

#### 3. Nuxt 3 Architecture
For SSR, SEO optimization, and file-based routing, use Nuxt 3.
- Data fetching: Use `useAsyncData` or `useFetch` to prevent hydration mismatches.
- Server API: Utilize the `server/api/` directory for Nitro API routes.

#### 4. The VueUse Collection
Always leverage [VueUse](https://vueuse.org/) for common composables (e.g., `useWindowSize`, `onClickOutside`, `useStorage`) instead of writing custom composables from scratch.

---

### Production Blueprints (Vue 3.5+ & Nuxt 3.15+)

#### Blueprint 1: Vue 3.5+ Typed Component with Reactive Props Destructure & `defineModel<T>()` (`AdaptiveMetricCard.vue`)
```vue
<script setup lang="ts">
import { computed, useTemplateRef, onMounted } from 'vue';

interface MetricCardProps {
  label: string;
  value: number;
  threshold?: number;
  precision?: number;
}

// Vue 3.5+ Reactive Props Destructuring (no toRefs required)
const { label, value, threshold = 100, precision = 2 } = defineProps<MetricCardProps>();

// Vue 3.4+ Two-way Model Binding macro
const isActive = defineModel<boolean>('active', { default: false });

// Vue 3.5+ Type-safe template ref
const containerRef = useTemplateRef<HTMLDivElement>('container');

const isElevated = computed(() => value >= threshold);
const formattedValue = computed(() => value.toFixed(precision));

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.setAttribute('data-hydrated', 'true');
  }
});
</script>

<template>
  <div
    ref="container"
    class="rounded-xl border border-neutral-800 bg-neutral-900/90 p-4 transition-all duration-200"
    :class="{ 'ring-1 ring-emerald-500/50 border-emerald-500/40': isElevated }"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-neutral-400">{{ label }}</span>
      <button
        type="button"
        @click="isActive = !isActive"
        class="cursor-pointer text-[11px] font-semibold rounded px-2 py-0.5 border transition"
        :class="isActive ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-neutral-800 text-neutral-500'"
      >
        {{ isActive ? 'Monitored' : 'Muted' }}
      </button>
    </div>
    <div class="mt-2 flex items-baseline gap-2">
      <span class="text-2xl font-bold text-white tabular-nums">{{ formattedValue }}</span>
      <span v-if="isElevated" class="text-[10px] font-bold uppercase text-emerald-400">Optimal</span>
    </div>
  </div>
</template>
```

#### Blueprint 2: Nuxt 3 SSR Hydration-Safe `useAsyncData` & Nitro Server Route
```typescript
// server/api/metrics.get.ts — Typed Nitro Server Route
import { defineEventHandler, getQuery, createError } from 'h3';
import { z } from 'zod';

const querySchema = z.object({
  clusterId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const queryResult = querySchema.safeParse(getQuery(event));
  if (!queryResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid clusterId parameter',
    });
  }

  const { clusterId } = queryResult.data;

  return {
    clusterId,
    timestamp: new Date().toISOString(),
    metrics: {
      p99LatencyMs: 14.2,
      throughputReqSec: 38400,
      healthyNodes: 12,
    },
  };
});
```

```vue
<!-- pages/dashboard.vue — Hydration-Safe Nuxt 3 Page Component -->
<script setup lang="ts">
import { computed } from 'vue';
import { useAsyncData, useRoute } from '#imports';

interface ClusterMetricsResponse {
  clusterId: string;
  timestamp: string;
  metrics: {
    p99LatencyMs: number;
    throughputReqSec: number;
    healthyNodes: number;
  };
}

const route = useRoute();
const clusterId = computed(() => (route.query.cluster as string) || 'primary-prod');

// Hydration-safe SSR fetch with deterministic key
const { data, status, error, refresh } = await useAsyncData<ClusterMetricsResponse>(
  `metrics-${clusterId.value}`,
  () => $fetch('/api/metrics', { query: { clusterId: clusterId.value } }),
  {
    watch: [clusterId],
    lazy: false,
    transform: (res) => ({
      ...res,
      formattedThroughput: res.metrics.throughputReqSec.toLocaleString(),
    }),
  }
);
</script>

<template>
  <main class="max-w-4xl mx-auto p-6 space-y-4">
    <header class="flex items-center justify-between border-b border-neutral-800 pb-4">
      <h1 class="text-xl font-bold text-white">Cluster Telemetry</h1>
      <button
        type="button"
        @click="() => refresh()"
        class="cursor-pointer text-xs rounded-lg bg-neutral-800 px-3 py-1.5 text-neutral-200 hover:bg-neutral-700 transition"
      >
        Refresh
      </button>
    </header>

    <div v-if="status === 'pending'" class="text-sm text-neutral-400 animate-pulse">
      Loading telemetry data...
    </div>

    <div v-else-if="error" class="p-4 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 text-sm">
      Failed to load telemetry: {{ error.message }}
    </div>

    <div v-else-if="data" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <span class="text-xs text-neutral-400">P99 Latency</span>
        <p class="text-2xl font-bold text-white tabular-nums mt-1">{{ data.metrics.p99LatencyMs }}ms</p>
      </div>
      <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <span class="text-xs text-neutral-400">Throughput</span>
        <p class="text-2xl font-bold text-white tabular-nums mt-1">{{ data.formattedThroughput }} req/s</p>
      </div>
      <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <span class="text-xs text-neutral-400">Healthy Nodes</span>
        <p class="text-2xl font-bold text-white tabular-nums mt-1">{{ data.metrics.healthyNodes }} / 12</p>
      </div>
    </div>
  </main>
</template>
```

#### Blueprint 3: Vue 3.5+ Composable with `onWatcherCleanup()` Resource Teardown
```typescript
// composables/useEventFeed.ts
import { ref, watch, type Ref } from 'vue';
import { onWatcherCleanup } from 'vue';

export function useEventFeed(streamUrl: Ref<string>) {
  const events = ref<string[]>([]);
  const isConnected = ref(false);

  watch(streamUrl, (newUrl) => {
    const sse = new EventSource(newUrl);
    isConnected.value = true;

    sse.onmessage = (event) => {
      events.value = [event.data, ...events.value.slice(0, 49)];
    };

    sse.onerror = () => {
      isConnected.value = false;
    };

    // Vue 3.5+ onWatcherCleanup registers cleanup before next watch run or component unmount
    onWatcherCleanup(() => {
      sse.close();
      isConnected.value = false;
    });
  }, { immediate: true });

  return { events, isConnected };
}
```

### Hard Guardrails (Declarative Invariants)
1. **Zero Direct Props Mutation**:
   - Props in Vue 3 `<script setup>` are strictly read-only. Never assign to props (`props.foo = bar`). Use `defineModel()` or emit events via `defineEmits()`.
2. **Deterministic SSR Hydration Keying in Nuxt 3**:
   - Every `useAsyncData` invocation MUST provide a deterministic, unique cache key string as its first argument to prevent hydration mismatch errors between server and client.
3. **Mandatory Tabular Numerals on Numerical Indicators**:
   - All counters, timestamps, latency metrics, and prices in Vue templates MUST declare `tabular-nums`.

### Best Practices
1. **Ref vs Reactive:** Prefer `ref` for primitive values and `reactive` for deeply nested objects. When in doubt, default to `ref`.
2. **Define Macros:** Use `defineProps` and `defineEmits` in `<script setup>` for typed props and events.
3. **Avoid Watchers when possible:** Rely on `computed` properties instead of `watch` to derive state. Use `watch` only for side-effects (e.g., API calls, DOM manipulation).
4. **V-Model:** Use the updated `v-model` binding in Vue 3.4+ with `defineModel()` for cleaner two-way data binding between components.

---

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec vue-frontend-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `modern-web-guidance` — Standar HTML5/CSS, API browser modern, dan pedoman aksesibilitas.
- `design-system-architect` — Komponen headless UI menggunakan Radix Vue atau VueUse.
- `modern-css-native-expert` — CSS anchor positioning native, View Transitions, container queries, dan `@starting-style`.
- `tailwind-expert` — Penataan gaya komponen Vue/Nuxt dengan Tailwind CSS v4.
- `ui-ux-pro-max` — Kecerdasan desain UI/UX, hierarki tata letak, dan token komponen Vue.
- `visual-ui-auditor` — Audit visual multimodal untuk tampilan antarmuka Vue/Nuxt yang dirender.
- `anti-slop` — Penegakan anti-slop, nol stub atau placeholder, implementasi reaktivitas penuh.
- `performance-web-vitals` — Optimasi metrik SSR Nuxt 3 (LCP, INP, CLS).
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `senior-frontend`, `state-management-expert`, `tanstack-query-expert`, `pwa-offline-first-expert`

### Deskripsi
Panduan tingkat produksi untuk membangun aplikasi frontend reaktif dan terukur menggunakan **Vue 3 (Composition API)** dan **Nuxt 3**. Mencakup pengelolaan state dengan **Pinia**, utilitas **VueUse**, dan integrasi **Tailwind CSS v4**.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Memulai proyek Vue 3 atau Nuxt 3 baru.
- Menulis ulang (refactoring) komponen ke `<script setup>` dan Composition API.
- Mengelola state global dengan Pinia (bukan Vuex).
- Menerapkan SSR (Server-Side Rendering) dengan Nuxt 3.

---

### Implementasi Pola Kunci (Vue 3 & Nuxt 3)

#### 1. Komponen Reaktif Modern dengan `<script setup lang="ts">`
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const jumlah = ref(0)
const kelipatanDua = computed(() => jumlah.value * 2)

function tambah() {
  jumlah.value++
}

onMounted(() => {
  console.log('Komponen Vue 3 berhasil dimuat!')
})
</script>

<template>
  <button 
    @click="tambah"
    class="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded font-medium"
  >
    Jumlah: {{ jumlah }} (Kelipatan: {{ kelipatanDua }})
  </button>
</template>
```

#### 2. Store Global Pinia dengan Pola Setup Store
```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec vue-frontend-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
