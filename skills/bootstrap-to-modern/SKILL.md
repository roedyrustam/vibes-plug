---
name: bootstrap-to-modern
description: "Expert skill to refactor and migrate legacy Bootstrap CSS applications to modern stacks using Tailwind CSS v4 and Alpine.js / Skill ahli untuk melakukan refaktor dan migrasi aplikasi Bootstrap CSS lama ke stack modern menggunakan Tailwind CSS v4 dan Alpine.js."
author: "vibes-plug-swarm"
---

# Bootstrap to Modern (Tailwind + Alpine.js) / Refaktor Bootstrap ke Modern

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill transforms legacy web applications styled with Bootstrap (jQuery-dependent or pure CSS) into a modern, utility-first architecture using **Tailwind CSS v4** for styling and **Alpine.js** for lightweight reactive behavior.

### Instructions
1. **Analyze the Legacy Structure**:
   - Identify the version of Bootstrap being used.
   - Locate custom CSS files that override Bootstrap defaults.
   - Identify interactive components (modals, dropdowns, tooltips, tabs, carousels) that rely on Bootstrap's JavaScript or jQuery.
2. **Setup Modern Tools**:
   - Ensure **Tailwind CSS v4** is properly set up in the project (e.g., via CDN for simple projects, or PostCSS/Vite for build steps).
   - Inject **Alpine.js** via CDN or module bundler to handle interactivity.
3. **Migration Strategy**:
   - **Grid & Layout**: Convert Bootstrap grids (`container`, `row`, `col-*`) to Tailwind flexbox (`flex`, `flex-col`, `gap-*`) or CSS Grid (`grid`, `grid-cols-*`).
   - **Spacing & Typography**: Map Bootstrap spacing (`m-3`, `p-4`) to Tailwind spacing (`m-4`, `p-6`—noting scale differences). Map typography utilities (`text-center`, `font-weight-bold`) to Tailwind equivalents (`text-center`, `font-bold`).
   - **Colors**: Update Bootstrap semantic colors (`primary`, `success`, `danger`) to Tailwind color palettes (e.g., `blue-600`, `green-500`, `red-500`) or define custom themes in CSS variables for Tailwind v4.
   - **Components**: Rebuild Bootstrap components (cards, buttons, alerts, navbars) using Tailwind utility classes to match or improve the original design.
4. **Interactivity with Alpine.js**:
   - Remove jQuery and Bootstrap JS dependencies.
   - Replace interactive Bootstrap components with Alpine.js data and directives.
   - **Dropdowns**: Use `x-data="{ open: false }"` and `@click="open = !open"`.
   - **Modals**: Use Alpine.js to manage the open state and handle background overlays and click-away events (`@click.outside`).
   - **Tabs**: Manage active tab state with `x-data="{ tab: 'home' }"`.
5. **UI/UX Modernization & Skill Integration**:
   - Do NOT just do a 1:1 translation of Bootstrap classes. The goal is to elevate the design.
   - You MUST orchestrate and apply guidelines from other UI/UX skills (`ui-ux-expert`, `ui-ux-pro-max`, and `hig`).
   - Implement Human Interface Guidelines (HIG) principles: Hierarchy, Harmony, and Consistency.
   - Use vibrant colors, smooth micro-animations, glassmorphism (if appropriate), and modern typography to "WOW" the user.
6. **Quality Assurance**:
   - Verify that responsive design behaves correctly across breakpoints (`sm:`, `md:`, `lg:`).
   - Ensure interactive components (modals, dropdowns) feel premium with Alpine.js transitions (`x-transition`).

### Trigger Conditions
Active whenever the user asks to migrate, refactor, or update a Bootstrap project to Tailwind CSS, or modernize legacy CSS/JS.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Skill ini mengubah aplikasi web lama yang di-style dengan Bootstrap (baik yang bergantung pada jQuery maupun murni CSS) menjadi arsitektur modern berbasis utility menggunakan **Tailwind CSS v4** untuk styling dan **Alpine.js** untuk behavior reaktif yang ringan.

### Instruksi
1. **Analisis Struktur Lama**:
   - Identifikasi versi Bootstrap yang digunakan.
   - Temukan file CSS kustom yang menimpa (override) default Bootstrap.
   - Identifikasi komponen interaktif (modal, dropdown, tooltip, tab, carousel) yang mengandalkan JavaScript Bootstrap atau jQuery.
2. **Setup Tools Modern**:
   - Pastikan **Tailwind CSS v4** disiapkan dengan benar di proyek (misalnya, melalui CDN untuk proyek sederhana, atau PostCSS/Vite jika ada build step).
   - Masukkan **Alpine.js** melalui CDN atau module bundler untuk menangani interaktivitas.
3. **Strategi Migrasi**:
   - **Grid & Layout**: Ubah grid Bootstrap (`container`, `row`, `col-*`) menjadi flexbox Tailwind (`flex`, `flex-col`, `gap-*`) atau CSS Grid (`grid`, `grid-cols-*`).
   - **Spacing & Tipografi**: Petakan spasi Bootstrap (`m-3`, `p-4`) ke Tailwind (`m-4`, `p-6`—perhatikan perbedaan skala). Petakan utilitas teks (`text-center`, `font-weight-bold`) ke padanan Tailwind (`text-center`, `font-bold`).
   - **Warna**: Perbarui warna semantik Bootstrap (`primary`, `success`, `danger`) ke palet warna Tailwind (misal: `blue-600`, `green-500`, `red-500`) atau definisikan tema kustom di variabel CSS untuk Tailwind v4.
   - **Komponen**: Bangun ulang komponen Bootstrap (card, button, alert, navbar) menggunakan kelas utilitas Tailwind untuk mencocokkan atau memperbaiki desain aslinya.
4. **Interaktivitas dengan Alpine.js**:
   - Hapus dependensi jQuery dan Bootstrap JS.
   - Ganti komponen interaktif Bootstrap dengan data dan direktif Alpine.js.
   - **Dropdown**: Gunakan `x-data="{ open: false }"` dan `@click="open = !open"`.
   - **Modal**: Gunakan Alpine.js untuk mengelola state terbuka, overlay latar belakang, dan event klik di luar (`@click.outside`).
   - **Tab**: Kelola state tab aktif dengan `x-data="{ tab: 'home' }"`.
5. **Modernisasi UI/UX & Integrasi Skill**:
   - JANGAN hanya menerjemahkan kelas Bootstrap 1:1. Tujuannya adalah meningkatkan kualitas desain.
   - Anda WAJIB mengorkestrasi dan menerapkan pedoman dari skill UI/UX lainnya (`ui-ux-expert`, `ui-ux-pro-max`, dan `hig`).
   - Terapkan prinsip Human Interface Guidelines (HIG): Hierarchy, Harmony, dan Consistency.
   - Gunakan warna cerah, mikro-animasi halus, glassmorphism (jika sesuai), dan tipografi modern untuk memberikan kesan "WOW" pada pengguna.
6. **Quality Assurance**:
   - Verifikasi bahwa desain responsif berfungsi dengan benar di semua breakpoint (`sm:`, `md:`, `lg:`).
   - Pastikan komponen interaktif (modal, dropdown) terasa premium dengan transisi Alpine.js (`x-transition`).

### Kondisi Pemicu
Aktif setiap kali pengguna meminta untuk memigrasi, merefaktor, atau memperbarui proyek Bootstrap ke Tailwind CSS, atau memodernisasi CSS/JS lama.


## Orchestration & Integration
- Integrates with: `ui-ux-expert`, `ui-ux-pro-max`, `hig`.
