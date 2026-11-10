---
name: svg-animation-motion-expert
description: "Web animations: Framer Motion 12+, GSAP 3, and CSS scroll animations / Animasi web: Framer Motion 12+, GSAP 3, dan animasi scroll CSS."
author: "Roedy Rustam"
version: "4.7.2"
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

#### 5. Material Design 3 (M3) Motion Architecture (https://m3.material.io/styles/motion/overview)
M3 motion establishes physical purpose, directing user focus through spatial continuity:

**M3 Easing & Duration Tokens:**
```css
:root {
  /* M3 Easing Curves */
  --md-sys-motion-easing-emphasized:             cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-easing-emphasized-decelerate:  cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --md-sys-motion-easing-emphasized-accelerate:  cubic-bezier(0.3, 0.0, 0.8, 0.15);
  --md-sys-motion-easing-standard:               cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-easing-standard-decelerate:     cubic-bezier(0, 0, 0.2, 1.0);

  /* M3 Durations */
  --md-sys-motion-duration-short-4:  200ms;
  --md-sys-motion-duration-medium-2: 300ms;
  --md-sys-motion-duration-medium-4: 400ms;
  --md-sys-motion-duration-long-2:   600ms;
}
```

**M3 Container Transform Pattern (Framer Motion `layoutId`):**
Morphing a card into a modal detail view with shared geometry:
```tsx
import { motion, AnimatePresence } from 'framer-motion';

// M3 Container Transform with Emphasized Decelerate Easing
const m3Transition = {
  duration: 0.4,
  ease: [0.05, 0.7, 0.1, 1.0], // M3 Emphasized Decelerate
};

export function M3CardToDetail({ selectedId, onSelect, item }: any) {
  return (
    <>
      <motion.div
        layoutId={`m3-container-${item.id}`}
        onClick={() => onSelect(item.id)}
        className="bg-surface-container rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        transition={m3Transition}
      >
        <motion.h3 layoutId={`m3-title-${item.id}`} className="text-lg font-medium text-on-surface">
          {item.title}
        </motion.h3>
        <p className="text-sm text-on-surface-variant mt-1">{item.subtitle}</p>
      </motion.div>

      <AnimatePresence>
        {selectedId === item.id && (
          <motion.div
            layoutId={`m3-container-${item.id}`}
            className="fixed inset-4 md:inset-20 z-50 bg-surface-container-high rounded-3xl p-8 shadow-2xl flex flex-col"
            transition={m3Transition}
          >
            <motion.h3 layoutId={`m3-title-${item.id}`} className="text-2xl font-bold text-on-surface">
              {item.title}
            </motion.h3>
            <div className="mt-4 flex-1 overflow-y-auto text-on-surface-variant">
              {item.fullContent}
            </div>
            <button
              onClick={() => onSelect(null)}
              className="mt-4 self-end bg-primary text-on-primary rounded-full px-6 py-2.5 font-medium"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

#### 6. Sovereign Anti-Slop Motion Directives
Zero-tolerance principles for intentional, high-performance web motion:
- **Strict `prefers-reduced-motion` Enforcement**: Every animation MUST respect user accessibility settings. In Framer Motion, check `useReducedMotion()`; in CSS, provide `@media (prefers-reduced-motion: reduce) { animation: none !important; transition: none !important; }`.
- **Compositor-Only Animations (Zero Layout Thrashing)**: Only animate `transform` and `opacity`. Strictly ban animating layout triggers (`top`, `left`, `width`, `height`, `margin`, `padding`).
- **Ban Bouncy Slop & Excessive Springs**: Avoid cartoonish, excessive spring bounces (`damping: 5, stiffness: 500`) on UI controls. Interactive components must use subtle, purposeful easings (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **No Orphan Infinite Animations**: Eliminate infinite CSS/JS loops that run off-screen, eating CPU and mobile battery. Use `IntersectionObserver` or CSS `content-visibility` to halt animations when not in viewport.

---

#### 7. Framework-Agnostic Single-Clock Motion Engine (`gsap.ticker` + Lenis + ScrollTrigger)

For Awwwards-grade sites across Astro, Next.js App Router, Vite, or SvelteKit, isolate all choreography inside `src/engine/` governed by **Two Architectural Invariants**:
1. **The Single-Clock Invariant**: Every animation—Lenis smooth scrolling, GSAP timelines, ScrollTrigger, WebGL shaders, and idle hero breathing—ticks on **`gsap.ticker`**. Never spawn separate `requestAnimationFrame` loops or raw `window.addEventListener('scroll')` handlers.
2. **The 4-Hook Router Lifecycle**: Every page transition executes `boot(setup)` (once) -> `leave()` (overlaps in parallel with route prefetch/fetch!) -> `cleanup()` (`ctx.revert()` + `unmountGL()`) -> `enter({ transition, scrollTop })`.

##### Pre-Paint Progressive Enhancement Guard (`<head>`)
Never set `opacity: 0` in static CSS where a JS failure or `prefers-reduced-motion: reduce` leaves a blank screen:
```html
<script>
  document.documentElement.classList.add('js');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion');
  }
</script>
```

##### Complete Single-Clock Engine Blueprint (`src/engine/index.ts`)
```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);

export const EASE = {
  expo: CustomEase.create('expo-out', '0.16, 1, 0.3, 1'),
  quart: CustomEase.create('quart-out', '0.25, 1, 0.5, 1'),
  curtain: CustomEase.create('curtain', '0.76, 0, 0.24, 1'),
};

export interface EngineEnv {
  reduced: boolean;
  coarse: boolean;
  fine: boolean;
  lenis: Lenis | null;
  velocity: number;
  scroll: number;
  progress: number;
}

export const env: EngineEnv = {
  reduced: false,
  coarse: false,
  fine: true,
  lenis: null,
  velocity: 0,
  scroll: 0,
  progress: 0,
};

let ctx: gsap.Context | null = null;
let pageCleanups: Array<() => void> = [];
let glTick: ((time: number, velocity: number, scroll: number, progress: number) => void) | null = null;

export function registerGLTick(fn: typeof glTick): void {
  glTick = fn;
}

export function onPage(setup: () => void | (() => void)): void {
  const teardown = setup();
  if (typeof teardown === 'function') pageCleanups.push(teardown);
}

/**
 * Real-progress loader with 1.1s minimum floor and 2.6s hard cap (loaderMs <= 2600).
 * Waits for document.fonts.ready and visible <img> decoding.
 */
export async function runLoader(onProgress?: (val: number) => void): Promise<void> {
  const start = performance.now();
  const minMs = 1100;
  const maxMs = 2400;

  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="eager"], header img, main img')).slice(0, 8);
  const tasks: Promise<unknown>[] = [document.fonts?.ready ?? Promise.resolve()];
  for (const img of imgs) {
    if (!img.complete) tasks.push(img.decode().catch(() => undefined));
  }

  let loaded = 0;
  const total = tasks.length;
  tasks.forEach((p) =>
    p.finally(() => {
      loaded += 1;
      onProgress?.(Math.min(0.95, loaded / total));
    })
  );

  await Promise.race([
    Promise.allSettled(tasks),
    new Promise((resolve) => setTimeout(resolve, maxMs)),
  ]);

  const elapsed = performance.now() - start;
  if (elapsed < minMs && !env.reduced) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed));
  }
  onProgress?.(1);
}

/**
 * Mounts declarative attributes: data-split, data-reveal, data-parallax, data-magnetic
 */
function mountDeclarativeReveals(scope: Element | Document = document): void {
  if (env.reduced) return;

  // 1. AutoSplit-safe SplitText with revealed guard so late font swaps never re-hide lines
  scope.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const mode = el.dataset.split || 'lines';
    let revealed = false;
    SplitText.create(el, {
      type: mode === 'chars' ? 'lines,words,chars' : 'lines,words',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        const targets = mode === 'chars' ? self.chars : mode === 'words' ? self.words : self.lines;
        if (revealed) {
          gsap.set(targets, { yPercent: 0, autoAlpha: 1 });
          return;
        }
        gsap.set(targets, { yPercent: 108 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            revealed = true;
            gsap.to(targets, {
              yPercent: 0,
              duration: 1.05,
              stagger: mode === 'chars' ? 0.018 : 0.065,
              ease: EASE.expo,
            });
          },
        });
      },
    });
  });

  // 2. Standard Reveals (up | fade | clip | scale)
  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const kind = el.dataset.reveal || 'up';
    const fromVars: gsap.TweenVars =
      kind === 'clip'
        ? { clipPath: 'inset(100% 0% 0% 0%)' }
        : kind === 'scale'
          ? { scale: 0.94, autoAlpha: 0 }
          : kind === 'fade'
            ? { autoAlpha: 0 }
            : { y: 36, autoAlpha: 0 };
    const toVars: gsap.TweenVars =
      kind === 'clip'
        ? { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: EASE.expo }
        : { y: 0, scale: 1, autoAlpha: 1, duration: 0.95, ease: EASE.expo };

    gsap.fromTo(el, fromVars, {
      ...toVars,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // 3. Fine-pointer Magnetic Pull
  if (env.fine) {
    scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic || '0.28');
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      pageCleanups.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      });
    });
  }
}

/**
 * Starts continuous subtle idle breathing so the hero is alive when the user stops scrolling.
 * Satisfies shoot.mjs `idleMotion: true` check and pauses automatically off-screen.
 */
export function startIdle(targetSelector = '[data-idle]'): () => void {
  if (env.reduced) return () => undefined;
  const targets = gsap.utils.toArray<HTMLElement>(targetSelector);
  if (targets.length === 0) return () => undefined;

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  });
  io.observe(targets[0]);

  const tick = (time: number) => {
    if (!visible) return;
    targets.forEach((el, i) => {
      const y = Math.sin(time * 1.1 + i * 0.9) * 4.5;
      const rot = Math.cos(time * 0.8 + i) * 0.6;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    });
  };
  gsap.ticker.add(tick);
  return () => {
    io.disconnect();
    gsap.ticker.remove(tick);
  };
}

export async function boot(setup?: () => void): Promise<void> {
  env.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  env.coarse = window.matchMedia('(pointer: coarse)').matches;
  env.fine = window.matchMedia('(pointer: fine)').matches;

  if (!env.reduced) {
    env.lenis = new Lenis({ lerp: 0.095, smoothWheel: true });
    env.lenis.on('scroll', (e: { scroll: number; velocity: number; progress: number }) => {
      env.scroll = e.scroll;
      env.velocity = e.velocity;
      env.progress = e.progress;
      ScrollTrigger.update();
    });
  }

  gsap.ticker.add((time) => {
    env.lenis?.raf(time * 1000);
    glTick?.(time, env.velocity, env.scroll, env.progress);
  });
  gsap.ticker.lagSmoothing(0);

  await runLoader();
  enter({ transition: false, scrollTop: false });
  setup?.();
}

export async function leave(): Promise<void> {
  const curtain = document.querySelector<HTMLElement>('#curtain');
  if (!curtain || env.reduced) return;
  await gsap.fromTo(
    curtain,
    { scaleY: 0, transformOrigin: 'bottom' },
    { scaleY: 1, duration: 0.48, ease: EASE.curtain }
  );
}

export function cleanup(): void {
  pageCleanups.forEach((fn) => fn());
  pageCleanups = [];
  ctx?.revert();
  ctx = null;
}

export function enter(opts: { transition: boolean; scrollTop: boolean } = { transition: true, scrollTop: true }): void {
  if (opts.scrollTop) {
    env.lenis ? env.lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }
  ctx = gsap.context(() => {
    mountDeclarativeReveals(document);
    pageCleanups.push(startIdle());
  });
  ScrollTrigger.refresh();

  const curtain = document.querySelector<HTMLElement>('#curtain');
  if (opts.transition && curtain && !env.reduced) {
    gsap.to(curtain, { scaleY: 0, transformOrigin: 'top', duration: 0.55, ease: EASE.curtain });
  }
}
```

##### Micro-Interaction Role Contract (Never `colorOnly` on Primary Targets)
Every primary interactive element (CTAs, nav links, project rows, work cards) must respond with a spatial/structural verb—never a bare CSS `color` swap (`colorOnly: true` in `shoot.mjs` is an automatic deduction):
- **Letter Roll (`.roll`)**: Two stacked `.roll__line` spans inside `overflow: hidden; height: 1.15em`; hover translates both `-100%` with per-character stagger.
- **Pointer-Side Fill (`[data-fill]`)**: Reads entry coordinates `(e.offsetX, e.offsetY)` on `pointerenter` to expand a background `.fill` layer from the exact side the cursor entered.
- **Underline Draw (`.draw`)**: `scaleX(0)` with `transform-origin: right` at rest; on `:hover`, flips to `transform-origin: left; transform: scaleX(1)`.

## Orchestration & Integration
- **`modern-web-guidance`**: Evaluates modern web animation specifications and scroll-driven APIs before implementation.
- **`modern-css-native-expert`**: Bridges CSS Scroll-Driven Animations and native View Transitions Level 2.
- **`ui-ux-pro-max`** and **`design-system-architect`**: Brings static UI/UX designs to life with harmonious timing.
- **`senior-frontend`**: Integrates declarative motion layers into React 19 / Next.js 15 architectures.
- **`seo`**: Balances rich visual landing page transitions with Core Web Vitals (INP/CLS).
- **`anti-slop`**: Enforces zero-bouncy slop, strict prefers-reduced-motion fallbacks, and compositor-only transforms.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `glsl-shader-expert`, `webxr-ar-vr-expert`, `multimodal-spatial-video-cloner`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec svg-animation-motion-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


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

#### 5. Arsitektur Gerak Material Design 3 (M3 Motion) (https://m3.material.io/styles/motion/overview)
Gerak dalam M3 memberikan kontinuitas spasial dan mengarahkan fokus pengguna:
- **Kurva Easing M3**:
  - `emphasized-decelerate` (`cubic-bezier(0.05, 0.7, 0.1, 1.0)`): Digunakan untuk elemen yang masuk ke layar (modal, drawer, sheet) dengan durasi 400ms.
  - `emphasized-accelerate` (`cubic-bezier(0.3, 0.0, 0.8, 0.15)`): Digunakan untuk elemen yang meninggalkan layar dengan durasi 200ms.
  - `standard` (`cubic-bezier(0.2, 0.0, 0, 1.0)`): Digunakan untuk transformasi bentuk dan pergeseran posisi dalam layar dengan durasi 300ms.
- **Pola Transisi M3**:
  - **Container Transform**: Transformasi morphing mulus dari kartu/chip kecil menjadi tampilan detail layar penuh menggunakan `layoutId` pada Framer Motion.
  - **Shared Axis**: Transisi geser sepanjang sumbu X (alur wizard maju/mundur), sumbu Y (pindah level atas/bawah), atau sumbu Z (zoom in/out).
  - **Fade Through**: Penggantian tampilan saat beralih antar destinasi navigasi utama (Bottom Navigation Bar atau Navigation Rail).

#### 6. Arahan Anti-Slop Gerakan & Animasi
Prinsip nol toleransi untuk gerakan web yang fungsional dan berkinerja tinggi:
- **Kepatuhan Mutlak `prefers-reduced-motion`**: Semua animasi WAJIB menghormati preferensi aksesibilitas pengguna (`useReducedMotion()` di Framer Motion, atau `@media (prefers-reduced-motion: reduce)` di CSS).
- **Animasi Khusus Compositor (Bebas Layout Thrashing)**: Hanya animasikan `transform` dan `opacity`. Dilarang menganimasikan `top`, `left`, `width`, `height`, atau `margin` yang memicu re-layout dan lag.
- **Larangan Bouncy Slop Berlebihan**: Hindari efek pegas memantul ekstrem dan kekanak-kanakan pada kontrol tombol/menu. Gunakan kurva easing profesional (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Larangan Loop Tanpa Batas di Luar Layar**: Matikan animasi yang tidak terlihat di viewport menggunakan `IntersectionObserver` untuk mencegah boros baterai dan beban CPU.

#### 7. Mesin Gerak Satu-Jam (*Single-Clock Motion Engine*) Lintas Framework (`gsap.ticker` + Lenis + ScrollTrigger)
Untuk situs berstandar Awwwards pada Next.js, Astro, Vite, maupun SvelteKit, satukan seluruh koreografi di dalam `src/engine/` dengan mematuhi dua invarian mutlak:
1. **Invarian Satu Jam (*One Clock*)**: Lenis smooth scroll, GSAP timeline, ScrollTrigger, shader WebGL, dan napas idle hero semuanya berjalan di atas satu detak **`gsap.ticker`**. Dilarang membuat loop `requestAnimationFrame` terpisah.
2. **Siklus Hidup Router 4-Hook**: `boot(setup)` (sekali saat muat awal dengan loader progres nyata `1.1s–2.6s` yang menunggu `document.fonts.ready` + `img.decode()`) -> `leave()` (berjalan paralel bersama prefetch rute!) -> `cleanup()` (`ctx.revert()` + lepas plane WebGL) -> `enter({ transition, scrollTop })`.
3. **Kontrak Peran Mikro-Interaksi & Napas Idle (`startIdle`)**: Elemen utama (CTA, navigasi, baris indeks proyek) wajib merespons dengan gerakan spasial (*letter roll* `.roll`, *directional pointer fill* `[data-fill]`, *underline draw* `.draw`)—dilarang hanya mengganti warna teks (`colorOnly`). Aktifkan `startIdle()` pada hero agar halaman tetap hidup saat pengguna berhenti melakukan scroll (`idleMotion: true`).

## Integrasi Orkestrasi
- **`modern-web-guidance`**: Mengevaluasi spesifikasi animasi web modern dan API scroll-driven sebelum implementasi.
- **`modern-css-native-expert`**: Menjembatani CSS Scroll-Driven Animations dan native View Transitions Level 2.
- **`ui-ux-pro-max`** dan **`design-system-architect`**: Menghidupkan desain statis dengan ritme waktu yang harmonis.
- **`senior-frontend`**: Mengintegrasikan lapisan animasi deklaratif ke dalam arsitektur React 19 / Next.js 15.
- **`seo`**: Menyeimbangkan transisi landing page yang memukau dengan performa Core Web Vitals (INP/CLS).
- **`anti-slop`**: Menegakkan larangan animasi memantul berlebihan (bouncy slop), kewajiban fallback prefers-reduced-motion, dan animasi khusus compositor.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `glsl-shader-expert`, `webxr-ar-vr-expert`, `multimodal-spatial-video-cloner`

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec svg-animation-motion-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
