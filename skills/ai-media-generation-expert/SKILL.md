---
name: ai-media-generation-expert
description: "Expert guide for AI image generation (Flux, DALL-E, Stable Diffusion), video generation (Sora, Runway), voice synthesis (ElevenLabs TTS), and speech recognition (Whisper STT) integration / Panduan ahli integrasi AI generasi gambar, video, suara (TTS), dan pengenalan suara (STT)."
author: "Roedy Rustam"
version: "4.4.2"

---

# AI Media Generation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Orchestrators**: Works under `brainstorming` and `zero-to-prod-orchestrator` (Phase 5 - Core Feature Development & Media Generation) to integrate multimodal generative pipelines.
- **Downstream Cooperating Skills**:
  - `ai-llm-integration-expert` — Prompt engineering, reasoning model selection, and orchestration chains.
  - `file-upload-media-expert` — Persistent storage (R2/S3), CDN distribution, and media pipeline handling.
  - `sse-websocket-streaming-expert` — Progressive image generation streaming and real-time audio playback.
  - `async-queue-temporal-expert` — Durable background queue execution for long-running video/audio generation.
  - `zero-trust-secret-vault` — Secure API key rotation and credential vault for Replicate, OpenAI, and ElevenLabs.
  - `session-memory-manager` — Store generation task metadata, prompt history, and asset references.

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

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec ai-media-generation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Orkestrator Hulu**: Beroperasi di bawah arahan `brainstorming` dan `zero-to-prod-orchestrator` (Fase 5 - Pengembangan Fitur Utama & Generasi Media) untuk mengintegrasikan pipeline generatif multimodal.
- **Skill Hilir & Kerja Sama**:
  - `ai-llm-integration-expert` — Rekayasa prompt, pemilihan model penalaran, dan rantai orkestrasi.
  - `file-upload-media-expert` — Penyimpanan permanen (R2/S3), distribusi CDN, dan pipeline media.
  - `sse-websocket-streaming-expert` — Streaming generasi gambar progresif dan pemutaran audio real-time.
  - `async-queue-temporal-expert` — Eksekusi antrean background job untuk generasi video dan audio panjang.
  - `zero-trust-secret-vault` — Rotasi kunci API aman dan brankas kredensial Replicate, OpenAI, dan ElevenLabs.
  - `session-memory-manager` — Menyimpan metadata tugas generasi, riwayat prompt, dan referensi aset.

### Deskripsi
Panduan tingkat produksi untuk mengintegrasikan generasi media berbasis AI ke dalam aplikasi web dan mobile modern. Mencakup generasi gambar (Flux 1.1 Pro, SDXL, DALL-E 3), generasi video (Sora, Runway Gen-3, MiniMax), text-to-speech (ElevenLabs v3, OpenAI TTS), speech-to-text (Whisper large-v3, Deepgram Nova-3), dan kloning audio. Dilengkapi pola pemrosesan asinkron via webhook, mitigasi biaya, serta penyaringan keamanan konten (NSFW/moderasi).

### Kondisi Pemicu
- Mengintegrasikan API generasi gambar AI beresolusi tinggi (Flux 1.1 Pro, DALL-E 3, SDXL).
- Membangun fitur sintesis suara ekspresif (Text-to-Speech) atau transkripsi audio otomatis (Speech-to-Text).
- Mengembangkan pipeline video AI asinkron berbasis webhook callback.
- Menerapkan pembatasan kuota generasi dan verifikasi keamanan konten pengguna.

---

### Matriks Pemilihan Model Generasi Media

| Tipe Media | Provider & Model | Latensi | Kualitas Visual/Audio | Estimasi Biaya | Rekomendasi Penggunaan |
|---|---|---|---|---|---|
| **Gambar** | Replicate (Flux 1.1 Pro) | ~3 detik | ★★★★★ | $0.04 / gambar | Gambar fotorealistik & tipografi akurat |
| **Gambar (Draft)** | Replicate (Flux Schnell) | ~1 detik | ★★★★ | $0.003 / gambar | Pratinjau instan & volume tinggi |
| **Gambar** | OpenAI (DALL-E 3) | ~5 detik | ★★★★ | $0.04 / gambar | Ilustrasi kreatif & pemahaman prompt deskriptif |
| **Suara (TTS)** | ElevenLabs (eleven_v3) | ~500 ms | ★★★★★ | $0.30 / 1K karakter | Narasi audio buku & karakter ekspresif |
| **Suara (Realtime)**| ElevenLabs (eleven_flash_v2_5) | ~200 ms | ★★★★ | $0.15 / 1K karakter | Agen percakapan AI & voicebot interaktif |
| **Transkripsi** | OpenAI (Whisper large-v3) | Cepat | ★★★★★ | $0.006 / menit | Transkripsi rapat & subtitling multibahasa |

---

### Pola Implementasi Teknis (TypeScript)

#### 1. Generasi Gambar Berkualitas Tinggi dengan Replicate (Flux 1.1 Pro)
```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

interface ImageGenOptions {
  width?: number;
  height?: number;
  mode?: 'production' | 'preview';
}

export async function hasilkanGambarAI(promptTeks: string, options: ImageGenOptions = {}) {
  const isPreview = options.mode === 'preview';
  const modelIdentifier = isPreview 
    ? 'black-forest-labs/flux-schnell' 
    : 'black-forest-labs/flux-1.1-pro';

  const output = await replicate.run(modelIdentifier, {
    input: {
      prompt: promptTeks,
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      num_inference_steps: isPreview ? 4 : 28,
      output_format: 'webp',
      output_quality: 90,
    },
  });

  return output; // Mengembalikan URL langsung ke aset WebP yang dihasilkan
}
```

#### 2. Streaming Text-to-Speech (TTS) ElevenLabs
```typescript
export async function streamSuaraTeks(teks: string, voiceId: string): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: teks,
      model_id: 'eleven_v3',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  return response.body as ReadableStream<Uint8Array>;
}
```

#### 3. Transkripsi Audio Whisper Berpresisi Tinggi
```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transkripsiAudio(fileBuffer: Buffer, namaFile: string) {
  const file = await OpenAI.toFile(fileBuffer, namaFile);
  
  const hasil = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word', 'segment'],
  });

  return hasil;
}
```

#### 4. Pola Produksi Kritis
- **Arsitektur Asinkron**: Wajib menggunakan antrean tugas latar belakang (`BullMQ` atau `Inngest`) untuk setiap operasi media yang memerlukan waktu komputasi >2 detik.
- **Penerimaan Callback Webhook**: Jangan gunakan polling HTTP terus-menerus; gunakan endpoint webhook yang divalidasi dengan tanda tangan kriptografis untuk menerima hasil generasi dari Replicate.
- **Pencegahan Konten Terlarang (NSFW)**: Lakukan penyaringan ganda menggunakan OpenAI Moderation API sebelum memproses prompt dan verifikasi gambar hasil sebelum ditampilkan kepada pengguna umum.
- **Penyimpanan Permanen**: Jangan bergantung pada URL hosting sementara dari vendor AI. Segera unduh dan simpan aset ke Cloudflare R2 atau AWS S3, lalu sajikan melalui domain CDN kustom.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec ai-media-generation-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
