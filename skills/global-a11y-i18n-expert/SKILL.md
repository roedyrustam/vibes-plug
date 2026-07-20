---
name: global-a11y-i18n-expert
description: "Expert guide for Web Accessibility (WCAG a11y) and Internationalization (i18n) / Panduan ahli untuk Aksesibilitas Web dan Internasionalisasi."
author: "Roedy Rustam"
---

# Global Accessibility (a11y) & i18n Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
This skill focuses on making enterprise web applications universally accessible and globally adaptable. It covers Web Content Accessibility Guidelines (WCAG) compliance and Internationalization (i18n) patterns for multi-language, multi-timezone software.

### Trigger Conditions
- Selling software to government, education, or large enterprise sectors (where WCAG AA compliance is legally required).
- Implementing multi-language support (i18n).
- Designing UIs that must support RTL (Right-to-Left) languages like Arabic or Hebrew.
- Fixing "tab trap" or screen reader issues.
- Handling complex timezone/date calculations across global users.

### Core Architecture Guidelines

#### 1. Web Accessibility (a11y)
Do not treat accessibility as an afterthought. It is a core engineering requirement.
- **Semantic HTML**: Always prefer native HTML elements (`<button>`, `<nav>`, `<dialog>`) over building custom ones with `<div>`. Native elements come with free accessibility baked in by the browser.
- **ARIA Attributes**: If you must build custom UI, use WAI-ARIA roles (`role="tablist"`, `aria-expanded="true"`) to tell screen readers what the component is doing.
- **Keyboard Navigation**: The entire app MUST be usable without a mouse. Ensure interactive elements are focusable (`tabindex="0"`) and visual focus outlines are distinct (do not use `outline: none` without providing an alternative styling).
- **Color Contrast**: Ensure text has a minimum contrast ratio of 4.5:1 against its background (WCAG AA standard).

#### 2. Internationalization (i18n)
Handling multiple languages requires structural foresight.
- **Locale Routing**: Use URL structures like `/en/pricing` or `/id/pricing`.
- **String Externalization**: Never hardcode UI text. Use translation files (`en.json`, `id.json`) and a library like `next-intl` or `react-i18next`.
- **RTL Support**: Use CSS logical properties (e.g., `margin-inline-start` instead of `margin-left`) so your UI automatically flips when rendering RTL languages.

#### 3. Timezones and Dates
Time is incredibly difficult to manage globally.
- **Storage**: ALWAYS store dates in the database as UTC (`TIMESTAMPTZ` in PostgreSQL). Never store local time.
- **Transport**: Send dates across APIs in ISO 8601 format (e.g., `2024-03-15T12:00:00Z`).
- **Display**: Convert UTC to the user's local timezone only at the UI layer just before rendering (using native `Intl.DateTimeFormat` or libraries like `date-fns-tz`).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill ini berfokus pada pembuatan aplikasi web skala *enterprise* yang dapat diakses secara universal dan diadaptasi secara global. Panduan ini mencakup kepatuhan pedoman Aksesibilitas Web (WCAG) serta pola Internasionalisasi (i18n) untuk perangkat lunak multi-bahasa dan multi-zona-waktu.

### Kondisi Pemicu
- Menjual perangkat lunak ke sektor pemerintah, pendidikan, atau perusahaan besar (di mana kepatuhan WCAG AA diwajibkan secara hukum).
- Menerapkan dukungan multi-bahasa (i18n).
- Merancang UI yang harus mendukung bahasa yang dibaca dari Kanan ke Kiri (RTL) seperti Arab atau Ibrani.
- Memperbaiki masalah navigasi *keyboard* (*tab trap*) atau dukungan *screen reader* (pembaca layar).
- Menangani kalkulasi tanggal dan zona waktu yang kompleks untuk pengguna global.

### Panduan Arsitektur Inti

#### 1. Aksesibilitas Web (a11y)
Jangan anggap aksesibilitas sebagai fitur tambahan. Ini adalah syarat mutlak *engineering*.
- **HTML Semantik**: Selalu utamakan elemen HTML bawaan (`<button>`, `<nav>`, `<dialog>`) daripada membuat elemen kustom menggunakan `<div>`. Elemen bawaan sudah memiliki fitur aksesibilitas yang ditangani langsung oleh browser.
- **Atribut ARIA**: Jika Anda terpaksa membuat komponen UI kustom, gunakan peran WAI-ARIA (`role="tablist"`, `aria-expanded="true"`) untuk memberi tahu *screen reader* apa fungsi komponen tersebut.
- **Navigasi Keyboard**: Seluruh aplikasi HARUS bisa digunakan tanpa *mouse*. Pastikan elemen interaktif bisa difokuskan (`tabindex="0"`) dan garis tepi fokus (*focus ring*) terlihat jelas (jangan gunakan `outline: none` tanpa memberikan gaya alternatif).
- **Kontras Warna**: Pastikan teks memiliki rasio kontras minimal 4.5:1 terhadap warna latar belakangnya (standar WCAG AA).

#### 2. Internasionalisasi (i18n)
Menangani berbagai bahasa memerlukan perencanaan struktural.
- **Routing Lokal (Locale Routing)**: Gunakan struktur URL seperti `/en/pricing` atau `/id/pricing`.
- **Eksternalisasi Teks**: Jangan pernah menulis teks UI langsung (*hardcode*) di dalam kode. Gunakan berkas terjemahan (`en.json`, `id.json`) dan pustaka seperti `next-intl` atau `react-i18next`.
- **Dukungan RTL**: Gunakan properti logika CSS (*CSS logical properties*, mis. `margin-inline-start` alih-alih `margin-left`) agar tata letak UI Anda secara otomatis berbalik saat merender bahasa RTL.

#### 3. Zona Waktu dan Tanggal
Mengelola waktu secara global sangatlah rumit.
- **Penyimpanan**: SELALU simpan tanggal di dalam database dalam format UTC (`TIMESTAMPTZ` pada PostgreSQL). Jangan pernah menyimpan waktu lokal komputer.
- **Transportasi**: Kirimkan tanggal melalui API dalam format ISO 8601 (mis., `2024-03-15T12:00:00Z`).
- **Tampilan UI**: Konversikan waktu UTC ke zona waktu lokal pengguna *hanya di lapisan UI* sesaat sebelum dirender (menggunakan `Intl.DateTimeFormat` bawaan browser atau pustaka seperti `date-fns-tz`).
