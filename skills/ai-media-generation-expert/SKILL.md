---
name: ai-media-generation-expert
description: "Expert guide for AI image generation (Flux, DALL-E, Stable Diffusion), video generation (Sora, Runway), voice synthesis (ElevenLabs TTS), and speech recognition (Whisper STT) integration / Panduan ahli integrasi AI generasi gambar, video, suara (TTS), dan pengenalan suara (STT)."
author: "vibes-plug-swarm"
---

# AI Media Generation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`ai-llm-integration-expert`**: Core LLM patterns and model selection.
- **`file-upload-media-expert`**: Storage, CDN, and media pipeline for generated assets.
- **`sse-websocket-streaming-expert`**: Real-time streaming for progressive image/audio generation.
- **`async-queue-temporal-expert`**: Background job processing for long-running generation tasks.
- **`zero-trust-secret-vault`**: Secure API key management for Replicate, OpenAI, ElevenLabs.

### Description
Production-grade guide for integrating AI-powered media generation into web and mobile applications. Covers image generation (Flux 1.1 Pro, SDXL, DALL-E 3), video generation (Sora, Runway Gen-3), text-to-speech (ElevenLabs v3, OpenAI TTS), speech-to-text (Whisper large-v3, Deepgram Nova-3), and voice cloning. Includes async processing patterns, cost optimization, and content safety filtering.

### Trigger Conditions
- Integrating AI image generation (Flux, DALL-E, Stable Diffusion, Midjourney API).
- Building text-to-speech or speech-to-text features.
- Implementing voice cloning or AI avatar generation.
- Adding AI video generation or editing capabilities.
- Building media processing pipelines with AI models.

---

### Core Architecture

#### 1. Image Generation

**Provider Selection Matrix:**

| Provider | Model | Speed | Quality | Cost | Best For |
|----------|-------|-------|---------|------|----------|
| Replicate | Flux 1.1 Pro | ~3s | ★★★★★ | $0.04/img | Photorealism, text rendering |
| Replicate | Flux Schnell | ~1s | ★★★★ | $0.003/img | High-volume, previews |
| OpenAI | DALL-E 3 | ~5s | ★★★★ | $0.04/img | Creative, prompt following |
| Stability | SDXL Turbo | ~2s | ★★★★ | $0.002/img | Self-hosted, customization |

**Recommendation:** Use **Flux 1.1 Pro** via Replicate for production quality. Use **Flux Schnell** for previews/drafts.

```typescript
// Image generation with Replicate (Flux)
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function generateImage(prompt: string, options?: {
  width?: number;
  height?: number;
  model?: 'flux-1.1-pro' | 'flux-schnell';
}) {
  const model = options?.model ?? 'flux-1.1-pro';
  const output = await replicate.run(
    `black-forest-labs/${model}`,
    {
      input: {
        prompt,
        width: options?.width ?? 1024,
        height: options?.height ?? 1024,
        num_inference_steps: model === 'flux-schnell' ? 4 : 28,
      },
    }
  );
  return output; // URL to generated image
}
```

#### 2. Text-to-Speech (TTS)

**Provider Selection:**

| Provider | Model | Latency | Expressiveness | Cost |
|----------|-------|---------|----------------|------|
| ElevenLabs | eleven_v3 | ~500ms | ★★★★★ | $0.30/1K chars |
| ElevenLabs | eleven_flash_v2_5 | ~200ms | ★★★★ | $0.15/1K chars |
| OpenAI | tts-1-hd | ~300ms | ★★★ | $0.030/1K chars |

**Recommendation:** Use **ElevenLabs eleven_v3** for expressive content. Use **eleven_flash_v2_5** for real-time chatbots.

```typescript
// ElevenLabs TTS streaming
async function textToSpeech(text: string, voiceId: string): Promise<ReadableStream> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_v3',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  return response.body!; // Stream audio chunks
}
```

#### 3. Speech-to-Text (STT)

```typescript
// OpenAI Whisper transcription
import OpenAI from 'openai';

const openai = new OpenAI();

async function transcribeAudio(audioFile: File) {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word', 'segment'],
  });
  return transcription;
}
```

#### 4. Video Generation

```typescript
// Replicate video generation (async with webhook)
async function generateVideo(prompt: string) {
  const prediction = await replicate.predictions.create({
    model: 'minimax/video-01',
    input: { prompt, duration: 5 },
    webhook: `${process.env.APP_URL}/api/webhooks/replicate`,
    webhook_events_filter: ['completed'],
  });
  return prediction.id; // Poll or wait for webhook
}
```

#### 5. Production Patterns

- **Async Processing:** Always use background jobs (BullMQ, Inngest) for generation tasks >2s.
- **Webhook Architecture:** Use webhooks for Replicate predictions instead of polling.
- **Content Safety:** Implement NSFW filtering (OpenAI Moderation API, Replicate safety checker).
- **Cost Control:** Set per-user daily limits. Cache identical prompts. Use cheaper models for drafts.
- **Storage Pipeline:** Generate → upload to S3/R2 → serve via CDN → store URL in DB.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`ai-llm-integration-expert`**: Pola LLM inti dan pemilihan model.
- **`file-upload-media-expert`**: Penyimpanan, CDN, dan pipeline media untuk aset yang dihasilkan.
- **`sse-websocket-streaming-expert`**: Streaming real-time untuk generasi gambar/audio progresif.
- **`async-queue-temporal-expert`**: Pemrosesan job latar belakang untuk tugas generasi yang lama.

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan generasi media berbasis AI ke dalam aplikasi web dan mobile. Mencakup generasi gambar (Flux 1.1 Pro, SDXL, DALL-E 3), generasi video (Sora, Runway Gen-3), text-to-speech (ElevenLabs v3, OpenAI TTS), speech-to-text (Whisper large-v3, Deepgram Nova-3), dan kloning suara.

### Kondisi Pemicu
- Mengintegrasikan generasi gambar AI (Flux, DALL-E, Stable Diffusion).
- Membangun fitur text-to-speech atau speech-to-text.
- Mengimplementasikan kloning suara atau generasi avatar AI.
- Menambahkan kemampuan generasi atau editing video AI.
- Membangun pipeline pemrosesan media dengan model AI.
