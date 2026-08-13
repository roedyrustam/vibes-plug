---
name: svg-animation-motion-expert
description: "Expert guide for web animations: SVG manipulation, Framer Motion 12+, GSAP 3, CSS Scroll-Driven Animations, and View Transitions API / Panduan ahli animasi web."
author: vibes-plug-swarm
---

# SVG & Web Animation Motion Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A dedicated skill for crafting fluid, high-performance web animations and micro-interactions. Covers direct SVG manipulation (paths, masks, clip-paths), React-based animations using Framer Motion 12+, advanced timeline choreography with GSAP 3, native CSS Scroll-Driven Animations, and the View Transitions API for seamless page navigations.

### Trigger Conditions
- When building complex landing page animations or scroll reveals.
- When creating interactive SVG graphics, charts, or diagrams.
- When the user asks for "buttery smooth", "apple-like", or "dynamic" interactions.
- When implementing page transitions using the native View Transitions API.

### Core Architecture & Guidelines

#### 1. Framer Motion 12+ (React/Next.js)
Use Framer Motion for declarative component animations, layout animations, and gesture-driven interactions.
- **Layout Animations**: Use the `layout` prop to automatically animate between flexbox/grid state changes.
- **Performance**: Use `style={{ x, y }}` with `useTransform` and `useScroll` instead of triggering React state updates on every frame.

```tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['0 1', '1 1'] })
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  )
}
```

#### 2. GSAP 3 (Complex Choreography)
Use GSAP when you need highly coordinated timeline sequences, path tracing, or when working outside of React (Vanilla JS).
- **ScrollTrigger**: The industry standard for complex scroll-based animations.
- **DrawSVG / MorphSVG**: Use for advanced SVG path drawing and morphing (requires Club GreenSock, use open-source alternatives if unavailable).

#### 3. Native CSS Scroll-Driven Animations
Where possible, leverage modern native CSS to tie animations to scroll position on the compositor thread for zero-JS performance.
```css
@keyframes slide-in {
  from { opacity: 0; transform: translateY(100px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-on-scroll {
  animation: slide-in linear both;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}
```

#### 4. SVG Optimization & Manipulation
- Always run SVGs through SVGO to strip bloat before animating.
- Keep `viewBox` responsive.
- Target `<path>`, `<circle>`, and `<mask/>` elements via CSS vars or inline Framer Motion logic.

## Orchestration & Integration
- Works hand-in-hand with `ui-ux-pro-max` and `monday-design-aesthetic` to bring designs to life.
- Complements `senior-frontend` by handling the motion layer of the UI.
- Integrates with `seo-aeo-landing-page-writer` to build visually stunning landing pages.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Skill khusus untuk membuat animasi web dan interaksi mikro yang lancar dan berkinerja tinggi. Mencakup manipulasi SVG langsung, animasi berbasis React menggunakan Framer Motion 12+, koreografi timeline lanjutan dengan GSAP 3, CSS Scroll-Driven Animations native, dan View Transitions API.

### Kondisi Pemicu
- Saat membangun animasi landing page yang kompleks.
- Saat membuat grafik, chart, atau diagram SVG interaktif.
- Saat pengguna meminta interaksi yang "sangat mulus", "mirip Apple", atau "dinamis".
- Saat mengimplementasikan transisi halaman menggunakan View Transitions API native.

### Panduan Arsitektur Inti

#### 1. Framer Motion 12+ (React/Next.js)
Gunakan Framer Motion untuk animasi komponen deklaratif, animasi layout, dan interaksi gestur.
- Hindari memicu pembaruan state React pada setiap frame animasi. Gunakan `useTransform` dan `useScroll` yang beroperasi di luar siklus render React untuk performa 60fps.

#### 2. GSAP 3
Gunakan GSAP untuk urutan timeline yang sangat terkoordinasi atau saat bekerja di luar ekosistem React. Plugin `ScrollTrigger` sangat berguna untuk merangkai aksi kompleks berdasarkan posisi scroll.

#### 3. CSS Scroll-Driven Animations Native
Manfaatkan CSS modern (`animation-timeline: view()`) untuk mengikat animasi ke posisi scroll langsung di compositor thread tanpa JavaScript sama sekali. Ini memberikan performa terbaik untuk efek paralaks dan reveal.

#### 4. Manipulasi SVG
- Selalu optimasi SVG (buang tag tidak perlu) sebelum dianimasikan.
- Gunakan `<clipPath>` dan `<mask>` untuk transisi transisi pengungkapan gambar yang dramatis.

## Integrasi Orkestrasi
- Bekerja sama dengan `ui-ux-pro-max` dan `monday-design-aesthetic` untuk menghidupkan desain statis.
- Melengkapi `senior-frontend` dengan menangani lapisan pergerakan (motion layer) UI.
- Terintegrasi dengan `seo-aeo-landing-page-writer` untuk merancang landing page yang memukau secara visual.
