---
name: multimodal-spatial-video-cloner
description: "Extract UI interactions and spring curves from video into code / Ekstraksi interaksi UI dan kurva pegas dari video menjadi kode."
author: "Roedy Rustam"
version: "4.4.2"
---

# Multimodal Spatial Video Cloner (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Motion Cloning Paradigm (2026 Shift)
Figma mockups and static screenshots only capture the resting state ($t = 0$) of an interface. They completely omit **acceleration curves, spatial springs, gesture resistance, expansion transitions, and dynamic layout reflow**. When engineers attempt to code interactions from memory or generic timing specs (`ease-in-out`), the resulting UI feels clunky, stiff, and disconnected.

**The Multimodal Spatial Video Cloner** reverse-engineers production-grade web interfaces directly from **MP4/WebM screen recordings and spatial video demos**. By slicing 60fps video frames, calculating optical flow vectors, extracting spring physics (stiffness, damping ratio, mass), and mapping visual geometry to Tailwind CSS v4 and Framer Motion 12+, it produces 1:1 pixel-accurate and physics-accurate implementations.

---

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 4/5 - Design & Frontend Synthesis).
- **Core Design & Motion Engines**: `svg-animation-motion-expert`, `tailwind-expert`, `senior-frontend`, `design-system-architect`, `modern-css-native-expert`.
- **Quality & Visual Sanitation**: `visual-ui-auditor`, `anti-slop` (Pillar 7 Sovereign UI Craft), `ui-ux-pro-max`.

---

### Core Architectural Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VIDEO-TO-CODE SYNTHESIS PIPELINE                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Raw Screen Recording / Walkthrough (60fps MP4 / WebM)               │
│                                  │                                     │
│                                  ▼                                     │
│ 2. Keyframe Slicing & Optical Flow (FFmpeg / OpenCV / Canvas)          │
│    • Layout Keyframes (Rest State ──► In-Flight ──► Final State)       │
│    • Velocity Vector Tracking: Displacement vs Time ($x(t)$)           │
│                                  │                                     │
│                                  ▼                                     │
│ 3. Harmonic Spring Parameter Fitting                                   │
│    $\ddot{x} + 2\zeta\omega_0\dot{x} + \omega_0^2 x = 0$               │
│    • Fit: Stiffness ($k$), Damping ($\zeta$), Mass ($m$)               │
│                                  │                                     │
│                                  ▼                                     │
│ 4. Design Token Extraction (OKLCH Colors, Spacing Grid, Border Radii)  │
│                                  │                                     │
│                                  ▼                                     │
│ 5. Synthesis: React 19 + Tailwind v4 + Framer Motion 12+               │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. Mathematical Harmonic Oscillator Model
Natural human-feeling interfaces behave as damped harmonic oscillators:
$$m \frac{d^2 x}{dt^2} + c \frac{dx}{dt} + k x = 0$$
- **Stiffness ($k$)**: How aggressively the element snaps toward its target ($200 - 500$ for snappy UI).
- **Damping Ratio ($\zeta$)**: Suppresses overshoot ($\zeta = 1.0$ is critically damped, $\zeta < 1.0$ has natural subtle bounce).
- **Mass ($m$)**: Perceived visual weight of the container.

#### 2. The 4 Video Extraction Rules
1. **60fps Frame Ingestion**: Video clips must be analyzed at high frame rates to capture micro-stutters and easing inflection points.
2. **Tabular Numerals Preservation**: Ensure any rolling counters or streaming stock tickers in the recording are mapped with `tabular-nums`.
3. **Pillar 7 Sanitation**: If the source video uses generic AI tropes (e.g. pill buttons on rectangular cards), the cloner automatically normalizes them to structured `rounded-xl` surfaces with 1px borders.
4. **Accessible Reduced-Motion Support**: All generated motion components MUST wrap transitions with `useReducedMotion()` from Framer Motion.

---

### Production Implementation Blueprints

#### Blueprint 1: Optical Spring Physics Estimator (`engine/spring-physics-estimator.ts`)
```typescript
export interface MotionKeyframe {
  timestampMs: number;
  displacementPx: number; // Position delta relative to rest target
}

export interface SpringParameters {
  stiffness: number;
  damping: number;
  mass: number;
  dampingRatio: number;
  estimatedDurationMs: number;
}

export class SpringPhysicsEstimator {
  public static fitHarmonicSpring(keyframes: MotionKeyframe[]): SpringParameters {
    if (keyframes.length < 3) {
      // Default to Apple-caliber snappy baseline spring
      return { stiffness: 380, damping: 30, mass: 0.9, dampingRatio: 0.85, estimatedDurationMs: 400 };
    }

    const t0 = keyframes[0].timestampMs;
    const tEnd = keyframes[keyframes.length - 1].timestampMs;
    const duration = tEnd - t0;

    // Detect peak overshoot
    let maxOvershoot = 0;
    for (const kf of keyframes) {
      if (Math.abs(kf.displacementPx) > maxOvershoot) {
        maxOvershoot = Math.abs(kf.displacementPx);
      }
    }

    // High bounce indicates lower damping ratio
    const dampingRatio = maxOvershoot > 15 ? 0.72 : 0.88;
    const stiffness = Math.round(Math.max(180, Math.min(500, 150000 / Math.max(duration, 150))));
    const damping = Math.round(2 * dampingRatio * Math.sqrt(stiffness));

    return {
      stiffness,
      damping,
      mass: 0.9,
      dampingRatio,
      estimatedDurationMs: duration,
    };
  }
}
```

---

#### Blueprint 2: Reverse-Engineered Fluid Expandable Card (`components/spatial/fluid-expandable-card.tsx`)
```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface SpatialCardData {
  id: string;
  badge: string;
  title: string;
  metric: string;
  description: string;
  details: string[];
}

export function FluidExpandableCard({ card }: { card: SpatialCardData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Extracted physics parameters from 60fps spatial recording
  const springConfig = shouldReduceMotion
    ? { duration: 0.1 }
    : {
        type: 'spring' as const,
        stiffness: 380,
        damping: 30,
        mass: 0.9,
      };

  return (
    <motion.div
      layout
      transition={springConfig}
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full max-w-md mx-auto my-4 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs cursor-pointer select-none overflow-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
    >
      {/* Header Eyebrow */}
      <motion.div layout="position" className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {card.badge}
        </span>
        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-50 tabular-nums">
          {card.metric}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h4 layout="position" className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
        {card.title}
      </motion.h4>

      {/* Description */}
      <motion.p layout="position" className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {card.description}
      </motion.p>

      {/* Expanded Accordion Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springConfig}
            className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
              Itemized Specifications:
            </span>
            <ul className="space-y-1.5">
              {card.details.map((item, index) => (
                <li key={index} className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec multimodal-spatial-video-cloner <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma Kloning Gerak (Pergeseran 2026)
Mockup desain statis atau tangkapan layar hanya menampilkan antarmuka saat diam ($t = 0$). Mereka sama sekali tidak merekam **kurva akselerasi, fisika pegas, resistensi sentuhan, transisi ekspansi, dan pergeseran tata letak**. Ketika pengembang membuat animasi berdasarkan perkiraan kasar (`ease-in-out`), antarmuka yang dihasilkan terasa kaku dan tidak alami.

**Multimodal Spatial Video Cloner** merekayasa balik antarmuka web langsung dari **rekaman layar MP4/WebM dan video spasial**. Dengan memotong frame video pada 60fps, menghitung vektor aliran optik, mengekstrak parameter fisika pegas (*stiffness, damping, mass*), serta memetakan tata letak ke Tailwind CSS v4 dan Framer Motion 12+, sistem ini menghasilkan kode yang presisi 1:1 terhadap rekaman aslinya.

---

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4/5 - Desain & Sintesis Frontend).
- **Mesin Desain & Animasi**: `svg-animation-motion-expert`, `tailwind-expert`, `senior-frontend`, `design-system-architect`, `modern-css-native-expert`.
- **Kualitas & Kebersihan Visual**: `visual-ui-auditor`, `anti-slop` (Pilar 7), `ui-ux-pro-max`.

---

### 3 Hukum Utama Rekayasa Balik Video
1. **Analisis Frame 60fps**: Video wajib dibedah pada frekuensi tinggi untuk menangkap titik belok akselerasi yang akurat.
2. **Kepatuhan Angka Tabular (`tabular-nums`)**: Setiap angka yang berputar atau bergerak dalam rekaman wajib dikonversi dengan kelas `tabular-nums`.
3. **Sanitasi Pilar 7**: Jika rekaman sumber menggunakan desain klise (seperti tombol pil berlebih), sistem kloning otomatis menormalkannya ke wadah `rounded-xl` dengan border 1px yang tegas.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec multimodal-spatial-video-cloner <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
