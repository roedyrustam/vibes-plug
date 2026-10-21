---
name: vue-frontend-expert
description: "Expert guide for Vue 3 (Composition API), Nuxt 3, and Pinia. Covers advanced reactive state management, `<script setup>` syntax, Vue Router, VueUse, and SPA/SSR architectural patterns in English and Indonesian."
author: "Roedy Rustam"
version: "4.4.2"

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

### Best Practices
1. **Ref vs Reactive:** Prefer `ref` for primitive values and `reactive` for deeply nested objects. When in doubt, default to `ref`.
2. **Define Macros:** Use `defineProps` and `defineEmits` in `<script setup>` for typed props and events.
3. **Avoid Watchers when possible:** Rely on `computed` properties instead of `watch` to derive state. Use `watch` only for side-effects (e.g., API calls, DOM manipulation).
4. **V-Model:** Use the updated `v-model` binding in Vue 3.4+ with `defineModel()` for cleaner two-way data binding between components.

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