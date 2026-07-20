---
name: monorepo-architect
description: "Expert guide for designing and managing scalable monorepos using Turborepo, pnpm workspaces, and shared packages / Panduan ahli untuk merancang dan mengelola monorepo skalabel menggunakan Turborepo dan pnpm workspaces."
author: "Antigravity"
---

# Monorepo & Workspace Architect

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Overview
The **Monorepo & Workspace Architect** skill provides best practices for setting up, managing, and scaling a monorepo architecture. It focuses on using modern tooling like **Turborepo** and **pnpm workspaces** to handle multiple applications and shared packages within a single Git repository.

### Trigger Conditions
Use this skill when:
- The user wants to split a monolithic application into multiple apps (e.g., public site, admin dashboard, API).
- The user needs to share UI components, TypeScript types, or utility functions across different projects.
- The user is setting up `turbo.json` or `pnpm-workspace.yaml`.
- The user is facing dependency issues or slow build times in a large repository.

### Core Architecture Guidelines

#### 1. Folder Structure
Maintain a strict separation between deployable applications (`apps/`) and shared libraries (`packages/`).

```text
.
├── apps/
│   ├── web/           # Main public-facing application (Next.js)
│   ├── admin/         # Internal admin dashboard (Vite/React)
│   └── api/           # Backend API services (Node/Bun/Rust)
├── packages/
│   ├── ui/            # Shared React components (Tailwind, shadcn)
│   ├── types/         # Shared TypeScript interfaces & DTOs
│   ├── config-eslint/ # Shared ESLint configurations
│   ├── config-ts/     # Shared tsconfig.json bases
│   └── db/            # Database schema and ORM client (Prisma/Drizzle)
├── turbo.json         # Turborepo configuration
├── pnpm-workspace.yaml
└── package.json
```

#### 2. Workspace Management (pnpm)
Always prefer `pnpm` for monorepos due to its strict dependency resolution and speed.
- Define `pnpm-workspace.yaml` explicitly:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- Use the `workspace:*` protocol when linking internal packages to ensure the latest local version is always used.

#### 3. Turborepo Configuration (`turbo.json`)
Maximize build cache and parallel execution. Ensure inputs and outputs are correctly defined.
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 4. The Shared UI Package (`@repo/ui`)
When sharing UI components (e.g., Tailwind CSS + React):
- Do not transpile the UI package locally; let the consumer apps (Next.js/Vite) transpile it. This avoids complex build steps in the `packages/ui` folder.
- Ensure the consumer app's `tailwind.config.ts` includes the UI package in its `content` path to scan for classes.
- Use `transpilePackages: ["@repo/ui"]` in Next.js `next.config.mjs`.

#### 5. CI/CD & Remote Caching
- Utilize Vercel Remote Cache or GitHub Actions cache to drastically reduce CI build times.
- Only run tests and deployments on packages that have changed by using `turbo run build --filter=...[origin/main]`.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Ringkasan
Skill **Monorepo & Workspace Architect** memberikan praktik terbaik untuk menyiapkan, mengelola, dan menskalakan arsitektur monorepo. Skill ini berfokus pada penggunaan alat modern seperti **Turborepo** dan **pnpm workspaces** untuk mengelola beberapa aplikasi dan paket (library) yang digunakan bersama dalam satu repositori Git.

### Kondisi Pemicu
Gunakan skill ini ketika:
- Pengguna ingin memecah aplikasi monolitik menjadi beberapa aplikasi terpisah (misalnya: situs publik, dasbor admin, API).
- Pengguna perlu membagikan komponen UI, tipe TypeScript, atau fungsi utilitas ke berbagai proyek berbeda.
- Pengguna sedang mengonfigurasi `turbo.json` atau `pnpm-workspace.yaml`.
- Pengguna menghadapi masalah dependensi atau waktu *build* yang lambat di repositori yang besar.

### Panduan Arsitektur Inti

#### 1. Struktur Folder
Pertahankan pemisahan yang ketat antara aplikasi yang dapat di-deploy (`apps/`) dan library yang dibagikan (`packages/`).

```text
.
├── apps/
│   ├── web/           # Aplikasi utama untuk publik (Next.js)
│   ├── admin/         # Dasbor admin internal (Vite/React)
│   └── api/           # Layanan backend API (Node/Bun/Rust)
├── packages/
│   ├── ui/            # Komponen React bersama (Tailwind, shadcn)
│   ├── types/         # Interface & DTO TypeScript bersama
│   ├── config-eslint/ # Konfigurasi ESLint bersama
│   ├── config-ts/     # Base tsconfig.json bersama
│   └── db/            # Skema database dan ORM client (Prisma/Drizzle)
├── turbo.json         # Konfigurasi Turborepo
├── pnpm-workspace.yaml
└── package.json
```

#### 2. Manajemen Workspace (pnpm)
Selalu prioritaskan `pnpm` untuk monorepo karena kecepatan dan resolusi dependensinya yang ketat.
- Definisikan `pnpm-workspace.yaml` secara eksplisit:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- Gunakan protokol `workspace:*` (misal: `"@repo/ui": "workspace:*"`) saat menautkan paket internal agar versi lokal terbaru selalu digunakan.

#### 3. Konfigurasi Turborepo (`turbo.json`)
Maksimalkan penggunaan *cache* dan eksekusi paralel. Pastikan `inputs` dan `outputs` terdefinisi dengan benar untuk menghindari *cache miss*.
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 4. Paket UI Bersama (`@repo/ui`)
Saat berbagi komponen UI (misal: Tailwind CSS + React):
- Jangan lakukan proses *transpile* (build) pada paket UI secara lokal; biarkan aplikasi konsumen (Next.js/Vite) yang melakukan *transpile*. Ini menghindari kerumitan konfigurasi *build* di dalam folder `packages/ui`.
- Pastikan `tailwind.config.ts` di aplikasi konsumen menyertakan path paket UI di bagian `content` agar Tailwind bisa memindai *utility classes*-nya.
- Gunakan konfigurasi `transpilePackages: ["@repo/ui"]` di `next.config.mjs` Next.js.

#### 5. CI/CD & Remote Caching
- Manfaatkan *Vercel Remote Cache* atau *GitHub Actions cache* untuk memangkas waktu *build* di CI secara drastis.
- Hanya jalankan pengujian dan *deployment* pada paket yang mengalami perubahan dengan menggunakan perintah `turbo run build --filter=...[origin/main]`.
