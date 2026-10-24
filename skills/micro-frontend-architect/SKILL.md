---
name: micro-frontend-architect
description: "Expert guide for designing Micro-Frontend architectures using Webpack Module Federation, Vite Federation, and Single-SPA for large scale Vue and React applications."
author: "Roedy Rustam"
version: "4.4.2"

---

# Micro-Frontend Architect (Module Federation 2.0 & Islands Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `design-system-architect` — Shared versioned design systems, design tokens, and UI component libraries across host and remotes.
- `composable-mach-architect` — Composable enterprise frontend shell orchestration and Backend-for-Frontend (BFF) routing.
- `ui-ux-pro-max` — Seamless navigation consistency, layout coherence, and style harmonization across micro-apps.
- `visual-ui-auditor` — Multimodal vision auditing of cross-MFE visual integration and CSS encapsulation leaks.
- `anti-slop` — Anti-slop MFE architecture, strict singleton dependency contracts, and zero styling bleed.
- `senior-frontend` & `vue-frontend-expert` — React 19 and Vue 3 host/remote implementations.
- `monorepo-architect` — Managing multiple MFEs within a unified Turborepo/pnpm workspace.

### Description
Production-grade guidance for decomposing large enterprise frontend monoliths into independently deployable **Micro-Frontends (MFE)**. Covers **Module Federation 2.0 (`@module-federation/enhanced` & Vite plugin)** with dynamic TypeScript remote types, isolated **Error & Suspense Boundaries** per remote, typed cross-MFE communication via the browser `CustomEvent` bus, and CSS Cascade Layers (`@layer`) isolation.

### Trigger Conditions
- Splitting a large frontend codebase into independent domain verticals (Host Shell + Checkout/Analytics/Admin Remotes).
- Configuring Module Federation 2.0 in Vite, Rspack, or Webpack.
- Enforcing singleton framework sharing (`react`, `react-dom`, `vue`, `pinia`, `@tanstack/react-query`).
- Preventing a crashed remote micro-app from taking down the entire host application shell.

---

### Micro-Frontend Composition Matrix

| Composition Pattern | Integration Layer | Framework Agnostic | Best For |
| :--- | :--- | :---: | :--- |
| **Module Federation 2.0** | Client/SSR Runtime (`mf-manifest.json`) | ✅ | Dynamic runtime composition with shared singleton libraries |
| **Astro Server Islands** | HTML Edge / Server Assembly | ✅ | Mixing React, Vue, and Svelte islands with zero client baseline JS |
| **Multi-Zone Routing** | Reverse Proxy / Edge Path Rewrite | ✅ | Hard isolation between `/app/*`, `/docs/*`, and `/checkout/*` |
| **Web Components (Shadow DOM)** | Custom Elements (`customElements.define`) | ✅ | Strict CSS & DOM encapsulation for embedded widgets |

---

### Core Implementation Patterns

#### 1. Vite / Module Federation 2.0 Config with Strict Singletons
Always configure `singleton: true` on stateful libraries (`react`, `react-dom`, `react-router`, `@tanstack/react-query`) so two runtime copies never collide:

```typescript
// apps/host-shell/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_shell',
      remotes: {
        billing_remote: {
          type: 'module',
          name: 'billing_remote',
          entry: process.env.VITE_BILLING_REMOTE_URL ?? 'http://localhost:5001/mf-manifest.json',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@tanstack/react-query': { singleton: true, requiredVersion: '^5.0.0' },
      },
    }),
  ],
  build: {
    target: 'chrome115',
  },
});
```

---

#### 2. Resilient Remote Loader with Fault-Isolated Error Boundary
A remote micro-frontend deployment or CDN outage must never crash the Host Shell. Wrap every remote import in a dedicated Error Boundary + Suspense fallback:

```tsx
// apps/host-shell/src/components/RemoteSlot.tsx
import React, { Component, Suspense, type ReactNode } from 'react';

interface RemoteSlotProps {
  remoteName: string;
  children: ReactNode;
}

interface RemoteSlotState {
  hasError: boolean;
  errorMessage: string | null;
}

export class RemoteSlot extends Component<RemoteSlotProps, RemoteSlotState> {
  state: RemoteSlotState = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): RemoteSlotState {
    return { hasError: true, errorMessage: error.message };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-200"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Module Unavailable: {this.props.remoteName}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            This micro-application failed to load ({this.state.errorMessage}). Other workspace modules remain active.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-100 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Reload Module
          </button>
        </section>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="h-48 w-full animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50" />
        }
      >
        {this.props.children}
      </Suspense>
    );
  }
}
```

---

#### 3. Typed Cross-MFE Event Bus (Zero Coupled State)
Avoid sharing global Redux/Zustand stores across team boundaries. Use a typed contract over native DOM `CustomEvent`:

```typescript
// packages/mfe-contracts/src/event-bus.ts
export interface MfeEventMap {
  'mfe:cart:item-added': { sku: string; quantity: number; priceMinor: number };
  'mfe:auth:tenant-switched': { tenantId: string; role: 'admin' | 'member' };
}

export function emitMfeEvent<K extends keyof MfeEventMap>(
  eventName: K,
  payload: MfeEventMap[K]
): void {
  window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
}

export function onMfeEvent<K extends keyof MfeEventMap>(
  eventName: K,
  handler: (payload: MfeEventMap[K]) => void
): () => void {
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<MfeEventMap[K]>;
    handler(customEvent.detail);
  };
  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
}
```

---

### Verification Checklist
- [ ] Core framework packages (`react`, `react-dom`, `vue`) are configured with `singleton: true` in Module Federation.
- [ ] Every remote MFE mount point is wrapped in a fault-isolated `ErrorBoundary` and `<Suspense>` skeleton.
- [ ] Cross-MFE communication uses URL search params or a typed `CustomEvent` contract rather than coupled global state.
- [ ] CSS rules are scoped via CSS Modules, Tailwind prefix/layers (`@layer mfe-billing`), or Shadow DOM to prevent style bleed.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec micro-frontend-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `design-system-architect` — Sistem desain terversi bersama, token desain, dan pustaka komponen UI lintas host dan remote.
- `composable-mach-architect` — Orkestrasi shell frontend enterprise komposabel dan routing BFF.
- `ui-ux-pro-max` — Konsistensi navigasi mulus, koherensi tata letak, dan harmonisasi gaya antar aplikasi mikro.
- `visual-ui-auditor` — Audit visual multimodal untuk integrasi visual lintas MFE dan kebocoran enkapsulasi CSS.
- `anti-slop` — Arsitektur MFE anti-slop, kontrak dependensi singleton yang ketat, dan nol kebocoran styling.
- `senior-frontend` & `vue-frontend-expert` — Implementasi host/remote React 19 dan Vue 3.
- `monorepo-architect` — Pengelolaan multi-MFE dalam workspace Turborepo/pnpm terpadu.

### Deskripsi
Panduan kelas produksi untuk memecah aplikasi frontend monolitik berskala besar menjadi **Micro-Frontends (MFE)** yang dapat di-deploy secara independen menggunakan **Module Federation 2.0**, lengkap dengan isolasi *Error Boundary* per modul, *Event Bus* bertipe kuat, dan enkapsulasi CSS.

### Panduan Arsitektur Inti
1. **Singleton Dependency Sharing**: Wajib tandai `react`, `react-dom`, `vue`, dan `@tanstack/react-query` dengan `singleton: true` agar browser tidak memuat dua instance runtime yang saling bertabrakan.
2. **Isolasi Kegagalan (Fault Isolation)**: Bungkus setiap komponen Remote di dalam `ErrorBoundary` dan `<Suspense>` khusus agar gangguan pada satu MFE tidak mematikan Host Shell utama.
3. **Komunikasi Terdekopel**: Gunakan kontrak `CustomEvent` bertipe di `window` atau parameter URL, hindari berbagi global store secara langsung antar tim.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Pustaka utama (`react`, `react-dom`, `vue`) ditandai sebagai `singleton: true`.
- [ ] Setiap titik muat Remote dibungkus dengan `ErrorBoundary` dan skeleton `<Suspense>`.
- [ ] Komunikasi lintas MFE menggunakan `CustomEvent` bertipe kuat.
- [ ] CSS dienkapsulasi dengan CSS `@layer` atau CSS Modules agar tidak bocor antar aplikasi.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec micro-frontend-architect <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
