---
name: affective-computing-emotion-ai
description: "Expert guide for Affective Computing, emotional AI, and real-time sentiment analysis through native multimodal tokens (voice intonation and facial micro-expressions) / Panduan ahli komputasi afektif, AI emosional, dan analisis sentimen real-time melalui token multimodal native."
author: "Roedy Rustam"
version: "4.1.0"
---

# Affective Computing & Emotion AI Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with `voice-ai-realtime-agent`, `ephemeral-generative-ui-architect`, `ai-llm-integration-expert`, and `ui-ux-pro-max`.

### Description
Standard AI agents process semantics (text meaning) but often ignore pragmatics (tone, tension, emotion). In the era of Native Any-to-Any Multimodal models (like Gemini 4 Pro), agents directly process raw audio and visual tokens. The **Affective Computing Expert** designs systems that interpret vocal intonation, breathing rates, speech pacing, and facial micro-expressions in real-time. It maps this data to emotional vectors (Valence-Arousal models) and dynamically alters the agent's personality, UI presentation, and response cadence.

### Trigger Conditions
- Designing empathetic customer service or mental health triage bots.
- Building intelligent tutoring systems that detect user frustration and dynamically lower the difficulty or offer encouragement.
- Developing interactive gaming or narrative simulations where characters react to the player's actual tone of voice.
- Adapting the UI in real-time (e.g., calming color palettes, slower animations) when high user cognitive load or stress is detected.

### Core Architecture (2026 Standard)
1. **Multimodal Native Empathy**: Bypassing text transcripts entirely. The LLM's system prompt instructs it to evaluate the *sound* and *visuals* of the input token stream.
2. **Dynamic UI Adaptation (Affective UI)**: Upon detecting stress (high arousal, negative valence), the UI automatically shifts to reduced-clutter mode, uses softer colors, and slows down generative UI animations.
3. **Persona Shifting**: The agent fluidly shifts its persona parameters (e.g., `formality`, `empathy`, `conciseness`) per interaction turn based on the user's emotional state vector.

### Implementation Recipe (TypeScript)
```typescript
import { MultimodalLiveClient } from 'gemini-live-sdk';
import { updateGenerativeUI } from '@/lib/ui-orchestrator';

const client = new MultimodalLiveClient({
  model: 'gemini-4-pro',
  systemInstruction: 'You are an empathetic companion. Analyze the user\'s vocal tension and facial expressions natively. Prefix your responses with a JSON affect vector: {"valence": -1 to 1, "arousal": -1 to 1}.',
});

client.on('turnComplete', async (response) => {
  const { affectVector, textAudio } = parseAffectiveResponse(response);
  
  // Dynamic UI alteration based on emotional state
  if (affectVector.arousal > 0.7 && affectVector.valence < -0.5) {
    // User is highly stressed or angry
    updateGenerativeUI({
      theme: 'calm-minimalist',
      animationSpeed: 'slow',
      cognitiveLoad: 'low',
      widgetDisplay: 'essential-only'
    });
  }
  
  // Play agent's empathetic audio response
  await playAudioStream(textAudio);
});
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama `voice-ai-realtime-agent`, `ephemeral-generative-ui-architect`, `ai-llm-integration-expert`, dan `ui-ux-pro-max`.

### Deskripsi
Agen AI standar memproses semantik (makna teks) namun sering mengabaikan pragmatik (nada, ketegangan, emosi). Di era model Multimodal Any-to-Any (seperti Gemini 4 Pro), agen langsung memproses token audio dan visual mentah tanpa terjemahan teks. Skill **Komputasi Afektif** ini memandu perancangan sistem yang menafsirkan intonasi vokal, tempo bicara, dan mikro-ekspresi wajah secara *real-time*. Sistem kemudian memetakan data tersebut ke vektor emosional (model *Valence-Arousal*) dan secara dinamis mengubah kepribadian agen, antarmuka pengguna (UI), dan tempo respons.

### Kondisi Pemicu
- Merancang layanan pelanggan empatik atau bot pendamping psikologis.
- Membangun sistem tutor cerdas (EdTech) yang mendeteksi frustrasi pengguna, lalu secara dinamis menurunkan tingkat kesulitan atau memberikan dorongan motivasi.
- Mengembangkan game interaktif atau simulasi naratif di mana karakter NPC bereaksi terhadap nada suara asli pemain.
- Mengadaptasi UI secara real-time (misal: beralih ke palet warna yang menenangkan, animasi yang lebih lambat) saat beban kognitif atau tingkat stres pengguna terdeteksi tinggi.

### Arsitektur Inti (Standar 2026)
1. **Empati Multimodal Native**: Menghindari penggunaan transkrip teks (STT) sebagai satu-satunya input. Instruksi sistem (System Prompt) LLM difokuskan untuk mengevaluasi *suara* dan *visual* dari aliran token.
2. **Adaptasi UI Dinamis (Affective UI)**: Saat mendeteksi stres (arousal tinggi, valence negatif), UI secara otomatis beralih ke mode bebas gangguan, menggunakan warna pastel/lembut, dan memperlambat kecepatan render UI generatif.
3. **Pergeseran Persona**: Agen dengan luwes menggeser parameter kepribadiannya (misal: `formalitas`, `empati`, `keringkasan`) di setiap giliran berdasarkan vektor keadaan emosi pengguna.
