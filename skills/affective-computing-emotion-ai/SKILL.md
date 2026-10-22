---
name: affective-computing-emotion-ai
description: "Master guide for Affective Computing, emotional AI, and real-time sentiment analysis through native multimodal tokens (voice intonation and facial micro-expressions) / Panduan utama komputasi afektif, AI emosional, dan analisis sentimen real-time melalui token multimodal native."
author: "Roedy Rustam"
version: "4.4.2"
---

# Affective Computing & Emotion AI (2026 Sovereign Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Executive Directive & The Empathic Interface Paradigm (2026 Shift)
Traditional software interfaces and chat systems treat human communication as flat, dry text syntax. In doing so, they miss up to 80% of human cognitive communication: **vocal pitch variance, breathiness, speech rate, pause intervals, and facial micro-expressions**. When an agitated user encounters an automated system that replies with cheerful conversational fluff and complex multi-layered cards, user frustration accelerates exponentially.

**Affective Computing & Emotion AI** equips autonomous AI agents and web interfaces with continuous **biometric perception**. By ingesting raw multimodal audio/video streams (Gemini Multimodal Live API, WebRTC bidirectional audio) and mapping real-time features into the continuous **Russell 2D Circumplex Model of Affect (Valence-Arousal space)**, interfaces dynamically modulate their vocal prosody, interaction pacing, and layout density.

---

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 4 - AI Agents & Multimodal Pipelines).
- **Downstream Cooperating Skills**:
  - `voice-ai-realtime-agent` — Bidirectional WebRTC audio transport and low-latency audio capture (<300ms).
  - `ephemeral-generative-ui-architect` — Dynamically re-render UI components according to calculated `AffectVector`.
  - `ui-ux-pro-max` — Ensure affective UI themes adhere to WCAG 2.2 AA contrast ratios.
  - `ai-llm-integration-expert` — Native multimodal token handling via Gemini Multimodal Live API.
  - `session-memory-manager` — Store ultra-compact session handoffs without retaining raw biometric PII.
  - `anti-slop` — Enforces zero robotic apologies and eliminates sycophancy when de-escalating.

---

### Core Architectural Topologies

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AFFECTIVE EMOTION AI PIPELINE                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Raw Multimodal Input (PCM Audio Stream & Video Frames)              │
│                                  │                                     │
│                                  ▼                                     │
│ 2. Feature Extraction (Pitch Variance, Jitter, Shimmer, Pause Ratio)   │
│                                  │                                     │
│                                  ▼                                     │
│ 3. Russell 2D Circumplex Mapping: AffectVector(Valence, Arousal)       │
│                                  │                                     │
│        ┌─────────────────────────┼─────────────────────────┐           │
│        ▼                         ▼                         ▼           │
│  [High Stress / Agitated]   [Fatigued / Confused]     [Calm / Engaged] │
│  (A > 0.4, V < -0.2)        (A < -0.3, V < 0.1)       (A ~ 0.0, V > 0) │
│        │                         │                         │           │
│        ▼                         ▼                         ▼           │
│ 4. Adaptive Morphing        4. High-Contrast Focus    4. Rich Dynamic  │
│    • Collapse to 1 CTA         • Enlarge Typo (+20%)     • Exploratory │
│    • Soften Animations         • Direct Hints            • Multi-Tab   │
│    • Lower Agent Pitch         • Slow Pacing             • Live Charts │
└────────────────────────────────────────────────────────────────────────┘
```

#### 1. The Russell 2D Circumplex Model of Affect
Affect is mapped to continuous floating-point coordinates $[-1.0, +1.0]$:
- **Valence ($V$)**: Semantic pleasantness (Negative = distressed/angry, Positive = pleased/delighted).
- **Arousal ($A$)**: Neurophysiological activation (Low = sleepy/calm, High = frenetic/alert).

$$\text{Emotion Quadrants}:$$
- **High Arousal, Negative Valence**: Frustrated, Angry, Panic $\to$ Immediate cognitive de-escalation required.
- **Low Arousal, Negative Valence**: Fatigued, Depressed, Bored $\to$ High-contrast clarity and structured guidance.
- **High Arousal, Positive Valence**: Excited, Delighted $\to$ Fluid micro-animations and celebratory feedback.
- **Low Arousal, Positive Valence**: Serene, Focused $\to$ Unobtrusive minimalism.

#### 2. Three Sovereign Laws of Affective Interfaces
1. **Zero-STT Latency Principle**: Affect detection MUST run directly on raw audio waveforms or multimodal token embeddings. Converting audio to text first destroys pitch and breathing telemetry.
2. **Dynamic UI De-escalation**: When $V < -0.3$ and $A > 0.3$, the UI engine MUST suppress popups, banners, and decorative animations, collapsing to a single primary resolution card.
3. **Biometric Privacy Invariant**: Raw audio samples and facial frames must be processed in ephemeral memory and discarded immediately. Only the anonymized `AffectVector` coordinate may be logged.

---

### Production Implementation Blueprints

#### Blueprint 1: Multimodal Telemetry & Affective Engine (`engine/affective-engine.ts`)
```typescript
export interface AcousticFeatures {
  pitchMeanHz: number;
  pitchVariance: number;
  speechRateWpm: number;
  pauseRatio: number; // 0.0 to 1.0 (silence vs speech)
  energyRms: number;
}

export interface AffectVector {
  valence: number; // -1.0 to +1.0
  arousal: number; // -1.0 to +1.0
  confidence: number; // 0.0 to 1.0
  dominantState: 'agitated' | 'fatigued' | 'calm' | 'delighted';
}

export interface UIAdaptationContract {
  theme: 'calm-slate' | 'high-contrast-focus' | 'vibrant-standard';
  layoutDensity: 'compact-single' | 'balanced' | 'exploratory-multi';
  animationSpringDamping: number; // Higher damping = less bounce/calmer
  speechPacingMultiplier: number; // 0.8 = slower agent speech
}

export class AffectiveEngine {
  public static computeAffectVector(features: AcousticFeatures): AffectVector {
    // Arousal correlates with pitch variance, speech rate, and energy RMS
    const rawArousal =
      (features.pitchVariance / 50) * 0.4 +
      ((features.speechRateWpm - 140) / 60) * 0.3 +
      (features.energyRms - 0.5) * 0.3;
    const arousal = Math.max(-1.0, Math.min(1.0, rawArousal));

    // Valence negatively correlates with excessive pause ratio and erratic jitter
    const rawValence = 0.5 - features.pauseRatio * 0.8 - (features.pitchVariance > 60 ? 0.3 : 0);
    const valence = Math.max(-1.0, Math.min(1.0, rawValence));

    let dominantState: AffectVector['dominantState'] = 'calm';
    if (arousal > 0.3 && valence < -0.1) dominantState = 'agitated';
    else if (arousal < -0.2 && valence < 0.1) dominantState = 'fatigued';
    else if (arousal > 0.2 && valence > 0.2) dominantState = 'delighted';

    return {
      valence: Number(valence.toFixed(2)),
      arousal: Number(arousal.toFixed(2)),
      confidence: 0.92,
      dominantState,
    };
  }

  public static deriveUIContract(affect: AffectVector): UIAdaptationContract {
    // Frustrated / Agitated User
    if (affect.dominantState === 'agitated') {
      return {
        theme: 'calm-slate',
        layoutDensity: 'compact-single',
        animationSpringDamping: 45, // Zero bounce, instant crispness
        speechPacingMultiplier: 0.85, // Slower, deeper conversational cadence
      };
    }

    // Fatigued / Confused User
    if (affect.dominantState === 'fatigued') {
      return {
        theme: 'high-contrast-focus',
        layoutDensity: 'compact-single',
        animationSpringDamping: 35,
        speechPacingMultiplier: 0.9,
      };
    }

    // Delighted / Exploratory User
    if (affect.dominantState === 'delighted') {
      return {
        theme: 'vibrant-standard',
        layoutDensity: 'exploratory-multi',
        animationSpringDamping: 22,
        speechPacingMultiplier: 1.05,
      };
    }

    // Default Balanced Baseline
    return {
      theme: 'vibrant-standard',
      layoutDensity: 'balanced',
      animationSpringDamping: 28,
      speechPacingMultiplier: 1.0,
    };
  }
}
```

---

#### Blueprint 2: Gemini Multimodal Live Audio Stream Processor (`engine/gemini-live-affect.ts`)
```typescript
import { GoogleGenAI } from '@google/genai';
import { AffectiveEngine, AffectVector } from './affective-engine';

export class GeminiLiveAffectProcessor {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  public async createEmpathicLiveSession(onAffectCalculated: (affect: AffectVector) => void) {
    const sessionConfig = {
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
      systemInstruction: [
        'You are an empathic, emotionally attuned system sentinel.',
        'Analyze user pitch variability, cadence, and breathiness from raw audio frames.',
        'Continuously emit JSON markers containing estimated valence and arousal coordinates.',
        'If the user sounds agitated, adopt a grounding, calm, low-frequency tone with shorter sentences.',
      ].join('\n'),
    };

    // Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
    try {
      return await this.ai.models.createWebsocketSession({
        model: 'gemini-4-argon',
        config: sessionConfig,
      });
    } catch {
      return await this.ai.models.createWebsocketSession({
        model: 'gemini-3.8-flash',
        config: sessionConfig,
      });
    }
  }
}
```

---

#### Blueprint 3: Adaptive Generative UI Container (`components/affective/adaptive-container.tsx`)
```tsx
'use client';

import React, { useMemo } from 'react';
import { AffectiveEngine, AffectVector } from '../../engine/affective-engine';

interface AdaptiveContainerProps {
  affect: AffectVector;
  children: React.ReactNode;
}

export function AdaptiveContainer({ affect, children }: AdaptiveContainerProps) {
  const adaptation = useMemo(() => AffectiveEngine.deriveUIContract(affect), [affect]);

  const themeClasses = {
    'calm-slate': 'bg-slate-950 text-slate-100 border-slate-800',
    'high-contrast-focus': 'bg-black text-neutral-50 border-neutral-700',
    'vibrant-standard': 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border-neutral-200/80 dark:border-neutral-800',
  }[adaptation.theme];

  return (
    <div
      role="region"
      aria-live="polite"
      className={`min-h-[400px] w-full p-6 rounded-2xl border transition-colors duration-500 ease-out shadow-xs ${themeClasses}`}
    >
      {/* Telemetry Indicator */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit opacity-75">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              affect.dominantState === 'agitated'
                ? 'bg-rose-500 animate-ping'
                : affect.dominantState === 'fatigued'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Cognitive State: {affect.dominantState}
          </span>
        </div>
        <div className="text-[11px] font-mono tabular-nums">
          V: {affect.valence > 0 ? `+${affect.valence}` : affect.valence} | A: {affect.arousal > 0 ? `+${affect.arousal}` : affect.arousal}
        </div>
      </div>

      {/* Main Content Area with Adaptive Density */}
      <div className={adaptation.layoutDensity === 'compact-single' ? 'max-w-xl mx-auto' : 'w-full'}>
        {children}
      </div>
    </div>
  );
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Direktif Eksekutif & Paradigma Antarmuka Empatik (Pergeseran 2026)
Antarmuka perangkat lunak dan sistem chat konvensional hanya memproses teks datar. Dengan cara ini, sistem kehilangan hingga 80% komunikasi kognitif manusia: **variasi nada suara, desahan nafas, tempo bicara, jeda hening, dan ekspresi mikro wajah**. Ketika pengguna yang sedang panik atau frustrasi menghadapi AI yang merespons dengan basa-basi panjang dan tata letak UI yang ramai, kemarahan pengguna akan meningkat tajam.

**Komputasi Afektif & AI Emosional** membekali agen AI otonom dan antarmuka web dengan **persepsi biometrik real-time**. Dengan memproses aliran audio/video mentah (Gemini Multimodal Live API, WebRTC audio dua arah) dan memetakan sinyal ke dalam ruang koordinat kontinu **Model Sirkumpleks 2D Russell (Valence-Arousal)**, sistem secara dinamis memodulasi nada suara agen, tempo bicara, dan kepadatan antarmuka pengguna.

---

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 4 - Agen AI & Pipeline Multimodal).
- **Skill Hilir & Kerja Sama**:
  - `voice-ai-realtime-agent` — Transport audio WebRTC dua arah berlatensi rendah (<300ms).
  - `ephemeral-generative-ui-architect` — Menyesuaikan tata letak komponen UI secara reaktif terhadap `AffectVector`.
  - `ui-ux-pro-max` — Menjamin kepatuhan rasio kontras WCAG 2.2 AA.
  - `ai-llm-integration-expert` — Penanganan token multimodal via Gemini Multimodal Live API.
  - `session-memory-manager` — Menyimpan checkpoint sesi tanpa menyimpan rekaman suara biometrik pribadi.
  - `anti-slop` — Meniadakan permintaan maaf robotik dan basa-basi saat melakukan de-eskalasi emosi.

---

### 3 Hukum Utama Antarmuka Afektif
1. **Prinsip Latensi Nol-STT**: Deteksi emosi wajib dilakukan langsung pada gelombang audio mentah (*raw waveform*). Mengubah suara menjadi teks terlebih dahulu akan membuang intonasi dan desahan nafas.
2. **De-eskalasi UI Dinamis**: Ketika terdeteksi frustrasi tinggi ($V < -0.3$ dan $A > 0.3$), UI wajib menonaktifkan pop-up atau animasi berlebih dan menyederhanakan tampilan menjadi satu kartu aksi penyelesaian utama.
3. **Privasi Biometrik Mutlak**: Aliran audio mentah diproses secara efemeral di memori dan langsung dibuang setelah analisis. Hanya koordinat numerik `AffectVector` yang boleh dicatat.
