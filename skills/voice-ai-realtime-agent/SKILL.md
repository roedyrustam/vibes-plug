---
name: voice-ai-realtime-agent
description: "Ultra-low latency conversational voice AI (<300ms) with WebRTC / AI suara percakapan latensi ultra-rendah (<300ms) dengan WebRTC."
author: "Roedy Rustam"
version: "4.4.4"

---

# Voice AI Realtime Agent (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Speech Models & Multimodal Streams**: `ai-llm-integration-expert`, `gemini-agent-booster`, `frontier-ai-models-expert`
- **Realtime Protocols & WebSockets**: `realtime-collaboration-expert`, `sse-websocket-streaming-expert`
- **Client Platforms & Audio Processing**: `senior-frontend`, `mobile-expo-expert`, `apple-ecosystem-expert`
- **Agent Swarms & Tools**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `chatbot-messaging-expert`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Description
Expert guide for building ultra-low-latency (<300ms), bi-directional conversational voice AI applications. Covers WebRTC, full-duplex WebSocket audio streaming (PCM 24kHz), OpenAI Realtime API, Gemini Multimodal Live API, LiveKit Agents SDK, and smart interruption (barge-in) handling.

### Trigger Conditions
- Applications requiring sub-second, spoken conversation with an AI agent.
- Voice customer service bots, verbal copilots, language tutors, and interactive voice assistants.
- Implementation of WebRTC audio streaming, full-duplex WebSocket audio (PCM 24kHz), and Silero VAD.
- Setting up OpenAI Realtime API (`gpt-5-realtime-preview` / `gpt-5.6-realtime`) or Gemini Multimodal Live API.

---

## 1. Core Architecture: Full-Duplex Speech-to-Speech

Traditional voice pipelines chain STT ➔ LLM ➔ TTS with cumulative latency exceeding 1,200ms–2,500ms. Modern 2026 voice agents use **native speech-to-speech** or **streamable full-duplex WebRTC pipelines** achieving natural, human-like reaction times (~250–350ms).

```
User Mic ──► [WebRTC / WebSocket] ──► [VAD: Silero / WebRTC VAD]
                                                │
                                                ▼
User Speaks <── [Audio Output] ◄── [Native Audio Stream / Cartesia] ◄── [OpenAI Realtime / Gemini Live]
     │
     └── User Interrupts (Barge-in) ──► Instant Buffer Flush & Cancel Audio Frame Emission
```

---

## 2. Production Recipe: LiveKit Agents + OpenAI Realtime (Python)

```python
# agent.py - Production Voice Agent Worker with LiveKit & OpenAI Realtime
import asyncio
import os
from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, silero

async def entrypoint(ctx: JobContext):
    # Connect to room with audio only to minimize bandwidth & latency
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    
    # Wait for the user participant to join
    participant = await ctx.wait_for_participant()
    
    # Define agent instructions and tools
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a helpful, concise voice assistant. "
            "Respond naturally in 1-2 short sentences. Never output markdown, bullet points, or emojis."
        )
    )

    # Realtime Voice Pipeline: Deepgram (STT) + OpenAI (LLM) + Cartesia/OpenAI (TTS)
    # Or use native OpenAI Realtime Model: gpt-5.6-realtime
    agent = VoicePipelineAgent(
        vad=silero.VAD.load(
            min_speech_duration=0.1,
            min_silence_duration=0.3, # Snappy turn-taking
            prefix_padding_duration=0.2,
        ),
        stt=deepgram.STT(model="nova-2", language="id"), # Multi-language support
        llm=openai.LLM(model="gpt-5-mini"),
        tts=openai.TTS(voice="alloy"),
        chat_ctx=initial_ctx,
        allow_interruptions=True, # Barge-in capability
        interrupt_speech_duration=0.3, # Immediate cutoff when user talks
    )

    agent.start(ctx.room, participant)
    
    # Greet user immediately
    await agent.say("Halo! Ada yang bisa saya bantu hari ini?", now=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

---

## 3. Production Recipe: Gemini Multimodal Live Audio (TypeScript / Node.js)

```typescript
// gemini-live-audio.ts - Bidirectional WebSocket PCM 24kHz
import WebSocket from 'ws';

interface GeminiAudioConfig {
  apiKey: string;
  model?: string;
  systemInstruction?: string;
}

export class GeminiVoiceAgent {
  private ws: WebSocket | null = null;
  private isConnected = false;

  constructor(private config: GeminiAudioConfig) {}

  public async connect(): Promise<void> {
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.config.apiKey}`;
    
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.isConnected = true;
      this.sendInitialHandshake();
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      this.handleIncomingAudio(data);
    });
  }

  private sendInitialHandshake(): void {
    const setupMessage = {
      setup: {
        // Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
        model: `models/${this.config.model || (process.env.GEMINI_FALLBACK ? 'gemini-3.8-flash' : 'gemini-4-argon')}`,
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: this.config.systemInstruction || "You are a conversational voice agent. Keep answers brief." }]
        }
      }
    };
    this.ws?.send(JSON.stringify(setupMessage));
  }

  // Stream raw PCM 16-bit 24kHz mono audio from mic
  public sendAudioChunk(pcm16Chunk: Buffer): void {
    if (!this.isConnected || !this.ws) return;

    const base64Audio = pcm16Chunk.toString('base64');
    const msg = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: "audio/pcm;rate=24000",
            data: base64Audio
          }
        ]
      }
    };
    this.ws.send(JSON.stringify(msg));
  }

  private handleIncomingAudio(data: WebSocket.Data): void {
    try {
      const response = JSON.parse(data.toString());
      const parts = response.serverContent?.modelTurn?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            this.playAudioSpeaker(pcmBuffer);
          }
        }
      }
    } catch {
      // Binary PCM frame handler
    }
  }

  private playAudioSpeaker(pcmChunk: Buffer): void {
    // Send to WebRTC audio track or audio output device
  }
}
```

---

## 4. Key 2026 Performance Guardrails

1. **Barge-in Latency Budget (<150ms)**: When the user speaks while the bot is talking, cancel outgoing audio immediately. Do not wait for the LLM to finish streaming its chunk.
2. **Audio Sample Rates**:
   - Mic Input: 16kHz or 24kHz 16-bit Linear PCM Mono.
   - Bot Output: 24kHz PCM for crystal-clear natural prosody.
3. **Turn-Taking Jitter Prevention**: Use minimum silence thresholds between `300ms` and `450ms`. Lower thresholds cause the bot to interrupt users when they pause to think; higher thresholds make the conversation feel robotic.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec voice-ai-realtime-agent <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Model Suara & Aliran Multimodal**: `ai-llm-integration-expert`, `gemini-agent-booster`, `frontier-ai-models-expert`
- **Protokol Realtime & WebSocket**: `realtime-collaboration-expert`, `sse-websocket-streaming-expert`
- **Platform Klien & Pemrosesan Audio**: `senior-frontend`, `mobile-expo-expert`, `apple-ecosystem-expert`
- **Swarm Agen & Tools**: `multi-agent-orchestration`, `parallel-tool-orchestrator`, `chatbot-messaging-expert`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Deskripsi
Panduan ahli untuk membangun aplikasi AI suara percakapan berlatensi ultra-rendah (<300ms) dan dua arah (*bi-directional*). Mencakup WebRTC, streaming audio WebSocket full-duplex (PCM 16-bit 24kHz), OpenAI Realtime API, Gemini Multimodal Live API, LiveKit Agents SDK, dan penanganan interupsi percakapan cerdas (*smart barge-in*).

### Kondisi Pemicu
- Aplikasi yang memerlukan percakapan suara langsung dengan agen AI dalam latensi sub-detik.
- Voicebot layanan pelanggan, verbal co-pilot, tutor bahasa interaktif, dan asisten suara pintar.
- Implementasi streaming audio WebRTC, WebSocket audio full-duplex, dan Silero VAD (Voice Activity Detection).
- Konfigurasi model native OpenAI Realtime atau Gemini Multimodal Live.

---

### Implementasi Pola Kunci

#### 1. Worker Agen Suara dengan LiveKit Agents & OpenAI Realtime (Python)
```python
# agen_suara.py - Worker Agen Suara LiveKit Produksi
import asyncio
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, silero

async def entrypoint(ctx: JobContext):
    # Sambungkan ke room hanya dengan audio untuk meminimalkan bandwidth & latensi
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    peserta = await ctx.wait_for_participant()

    konteks_awal = llm.ChatContext().append(
        role="system",
        text=(
            "Anda adalah asisten suara yang ramah dan ringkas. "
            "Jawablah dengan 1-2 kalimat pendek secara natural. Jangan pernah mengeluarkan format markdown atau emoji."
        )
    )

    agen = VoicePipelineAgent(
        vad=silero.VAD.load(
            min_speech_duration=0.1,
            min_silence_duration=0.3, # Pengambilan giliran bicara yang responsif
            prefix_padding_duration=0.2,
        ),
        stt=deepgram.STT(model="nova-2", language="id"),
        llm=openai.LLM(model="gpt-5-mini"),
        tts=openai.TTS(voice="alloy"),
        chat_ctx=konteks_awal,
        allow_interruptions=True, # Memungkinkan interupsi pengguna (barge-in)
        interrupt_speech_duration=0.3,
    )

    agen.start(ctx.room, peserta)
    await agen.say("Halo! Ada yang bisa saya bantu hari ini?", now=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

#### 2. Klien Audio Streaming Gemini Multimodal Live (TypeScript)
```typescript
// gemini-suara-agent.ts
import WebSocket from 'ws';

export class AgenSuaraGemini {
  private ws: WebSocket | null = null;
  private terhubung = false;

  constructor(private apiKey: string) {}

  public async hubungkan(): Promise<void> {
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      this.terhubung = true;
      this.kirimHandshakeAwal();
    });
  }

  private kirimHandshakeAwal(): void {
    const konfigurasi = {
      setup: {
        // Invarian Pengalihan Ketersediaan: Gemini 4 Argon -> Gemini 3.8 Flash
        model: `models/${process.env.GEMINI_FALLBACK ? 'gemini-3.8-flash' : 'gemini-4-argon'}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          }
        },
        systemInstruction: {
          parts: [{ text: 'Anda adalah asisten suara cerdas. Berikan jawaban yang singkat dan padat.' }]
        }
      }
    };
    this.ws?.send(JSON.stringify(konfigurasi));
  }

  // Alirkan potongan audio mentah PCM 16-bit 24kHz dari mikrofon
  public alirkanAudio(chunkPcm: Buffer): void {
    if (!this.terhubung || !this.ws) return;
    const pesanAudio = {
      realtimeInput: {
        mediaChunks: [{ mimeType: 'audio/pcm;rate=24000', data: chunkPcm.toString('base64') }]
      }
    };
    this.ws.send(JSON.stringify(pesanAudio));
  }
}
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec voice-ai-realtime-agent <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
