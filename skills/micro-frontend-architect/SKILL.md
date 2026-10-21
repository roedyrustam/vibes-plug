---
name: micro-frontend-architect
description: "Expert guide for designing Micro-Frontend architectures using Webpack Module Federation, Vite Federation, and Single-SPA for large scale Vue and React applications."
author: "Roedy Rustam"
version: "4.4.2"

---

# Micro-Frontend Architect

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `design-system-architect` — Shared versioned design systems, design tokens, and UI component libraries across host and remotes.
- `ui-ux-pro-max` — Seamless navigation consistency, layout coherence, and style harmonization across micro-apps.
- `visual-ui-auditor` — Multimodal vision auditing of cross-MFE visual integration and CSS encapsulation leaks.
- `anti-slop` — Anti-slop MFE architecture, strict singleton dependency contracts, and zero styling bleed.
- `senior-frontend` — React 19 and Next.js host/remote implementations.
- `vue-frontend-expert` — Vue 3 and Nuxt host/remote implementations.
- `monorepo-architect` — Managing multiple MFEs within a unified Turborepo/pnpm workspace.

### Description
Production-grade guidance for breaking down monolithic frontend applications into scalable, independently deployable **Micro-Frontends (MFE)**. Covers integration via **Webpack Module Federation**, **Vite Federation**, and run-time container orchestration using patterns suitable for massive Enterprise applications in Vue or React.

### Trigger Conditions
Activate this skill when the user is:
- Splitting a large frontend codebase into multiple smaller apps (Host and Remotes).
- Configuring Webpack Module Federation (`ModuleFederationPlugin`).
- Setting up Vite with `@originjs/vite-plugin-federation`.
- Asking about sharing dependencies (e.g., sharing a single instance of Vue, React, or Pinia across apps).
- Designing a cross-team frontend deployment strategy.

### Core Concepts

#### 1. Module Federation Concept
Module federation allows a JavaScript application to dynamically load code from another application at runtime.
- **Host (Shell):** The main container application that loads remote modules.
- **Remote:** The micro-frontend application exposing components or logic.

#### 2. Vite Federation Example
```javascript
// vite.config.js (Remote App)
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.vue',
      },
      shared: ['vue', 'pinia'] // Critical: Share core dependencies!
    })
  ]
}

// vite.config.js (Host App)
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'host_app',
      remotes: {
        remote_app: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['vue', 'pinia']
    })
  ]
}
```

#### 3. State Management Across MFEs
- **Avoid Global State if Possible:** Micro-frontends should ideally not share business state. Communicate via custom DOM events, URL parameters, or a thin Event Bus.
- **Shared Store (Pinia/Zustand):** If state sharing is absolutely required, the Host app should instantiate the store and share the dependency instance via Federation.

### Best Practices
- **Strict Dependency Sharing:** Always mark core libraries (`react`, `react-dom`, `vue`, `vue-router`) as `singleton: true` and `shared` to prevent the browser from downloading and running multiple instances of the framework.
- **CSS Isolation:** Ensure CSS from one Micro-Frontend does not bleed into another. Use CSS Modules, scoped CSS, or Shadow DOM.
- **Independent Deployments:** The core value of MFE is that Team A can deploy the Remote App without requiring Team B to rebuild the Host App.

---



<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `design-system-architect` — Sistem desain terversi bersama, token desain, dan pustaka komponen UI lintas host dan remote.
- `ui-ux-pro-max` — Konsistensi navigasi mulus, koherensi tata letak, dan harmonisasi gaya antar aplikasi mikro.
- `visual-ui-auditor` — Audit visual multimodal untuk integrasi visual lintas MFE dan kebocoran enkapsulasi CSS.
- `anti-slop` — Arsitektur MFE anti-slop, kontrak dependensi singleton yang ketat, dan nol kebocoran styling.
- `senior-frontend` — Implementasi host/remote React 19 dan Next.js.
- `vue-frontend-expert` — Implementasi host/remote Vue 3 dan Nuxt.
- `monorepo-architect` — Pengelolaan multi-MFE dalam workspace Turborepo/pnpm terpadu.

### Deskripsi
Panduan arsitektur untuk memecah aplikasi frontend raksasa menjadi **Micro-Frontends (MFE)** yang terukur dan dapat di-deploy secara independen. Mencakup **Webpack Module Federation** dan **Vite Federation**.

### Kondisi Pemicu
- Memecah aplikasi (monolith) Vue atau React menjadi beberapa sub-aplikasi.
- Mengkonfigurasi plugin *Module Federation*.
- Mencari cara untuk membagi *dependency* (seperti Vue atau React) agar tidak di-download dua kali oleh browser.

### Panduan Singkat
- **Host vs Remote:** *Host* adalah cangkang (shell) utama aplikasi Anda, *Remote* adalah aplikasi kecil (fitur) yang dimuat oleh Host secara dinamis di runtime.
- **Berbagi Dependensi (Shared):** Sangat krusial! Pastikan framework utama (`vue`, `react`, `pinia`, `vue-router`) ditandai sebagai `shared` (dan seringkali `singleton`). Jika tidak, aplikasi akan error karena ada 2 instance Vue/React yang berjalan bersamaan.
- **Isolasi CSS:** Pastikan gaya CSS dari MFE A tidak merusak MFE B. Gunakan *CSS Modules* atau kapsulasi *Scoped CSS*.
- **Komunikasi Data:** Hindari penggunaan Global State (Redux/Pinia) lintas MFE jika memungkinkan. Gunakan *Custom Event Listener* di `window` atau passing props/URL untuk menjaga tiap MFE tetap independen.