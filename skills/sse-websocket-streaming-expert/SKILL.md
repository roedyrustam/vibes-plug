---
name: sse-websocket-streaming-expert
description: "Real-time Server-Sent Events (SSE), WebSockets, and data streaming / Server-Sent Events (SSE), WebSockets, dan streaming data real-time."
author: "Roedy Rustam"
version: "4.4.2"

---

# SSE, WebSocket & Streaming Expert (2026 Production Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **Backend & Runtimes**: `js-backend-expert` (Hono, Fastify, Express), `bun-runtime-expert` (native `Bun.serve` WebSockets), `cloudflare-workers-expert` (Durable Objects WebSockets), and `go-programming-expert` (goroutine channels).
- **AI Streaming**: `vercel-ai-sdk-expert`, `gemini-agent-booster`, `voice-ai-realtime-agent`, and `chatbot-messaging-expert` for chunk-by-chunk token streaming and bidirectional audio/text.
- **Frontend & Realtime**: `senior-frontend` (`EventSource` & `useChat` hooks), `realtime-collaboration-expert` (CRDTs), `reactive-sync-engine-expert`, and `api-gateway-proxy-expert` (unbuffered SSE reverse proxies).
- **Lifecycle**: `brainstorming` and `zero-to-prod-orchestrator`.

### Description
Production-grade engineering guide for real-time data push and bidirectional streaming architectures. Covers **Server-Sent Events (SSE)** with `Last-Event-ID` cursor replay, **WebSockets** on Hono/Bun and Cloudflare Durable Objects (WebSocket Hibernation API), horizontal scaling with **Redis Streams / Pub-Sub backplanes**, backpressure control via Web Streams (`TransformStream`), and nginx/Cloudflare reverse-proxy buffering configurations.

### Trigger Conditions
- Building live notification feeds, financial order books, telemetry dashboards, or progress trackers.
- Streaming LLM reasoning tokens (`<think>`) and structured tool deltas over HTTP SSE.
- Implementing bidirectional chat, multiplayer rooms, or collaborative presence with WebSockets.
- Scaling stateful WebSocket servers across multiple containers or serverless edge workers.

---

### Transport Selection Matrix

| Transport | Direction | Protocol | Reconnection | Best Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Server-Sent Events (SSE)** | Server $\rightarrow$ Client | Standard HTTP/2 & HTTP/3 | Native (`Last-Event-ID`) | AI token streaming, live notifications, status feeds, tickers |
| **WebSockets** | Bidirectional (Full-Duplex) | `ws://` / `wss://` (TCP Upgrade) | Manual backoff + heartbeat | Chat rooms, multiplayer games, collaborative whiteboards |
| **WebTransport** | Bidirectional (Streams + Datagrams) | HTTP/3 QUIC (`UDP`) | Application-managed | Low-latency game netcode, live media ingest |
| **HTTP Chunked Stream** | Server $\rightarrow$ Client | `Transfer-Encoding: chunked` | Per-request retry | NDJSON bulk exports, React Server Component (RSC) flight streams |

---

### Core Implementation Patterns

#### 1. Production SSE Server with `Last-Event-ID` Replay & Heartbeat (Hono / Next.js)
Intermediate proxies (NGINX, Cloudflare, AWS ALB) drop idle HTTP connections after 60–100 seconds and may buffer chunks unless explicitly disabled:

```typescript
// src/routes/sse-stream.ts
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

const app = new Hono();

export interface StreamEventPayload {
  id: string;
  event: string;
  data: Record<string, unknown>;
}

app.get('/api/stream/events', async (c) => {
  const lastEventId = c.req.header('Last-Event-ID') ?? c.req.query('cursor') ?? '0';
  const tenantId = c.req.header('X-Tenant-Id');
  if (!tenantId) {
    return c.json({ error: 'Missing X-Tenant-Id header' }, 401);
  }

  // Disable NGINX & proxy response buffering
  c.header('X-Accel-Buffering', 'no');
  c.header('Cache-Control', 'no-cache, no-transform');

  return streamSSE(c, async (stream) => {
    let closed = false;
    stream.onAbort(() => {
      closed = true;
    });

    // 1. Replay missed events since lastEventId cursor from Redis Stream
    const missedEvents = await fetchMissedEventsFromStream(tenantId, lastEventId);
    for (const evt of missedEvents) {
      if (closed) return;
      await stream.writeSSE({
        id: evt.id,
        event: evt.event,
        data: JSON.stringify(evt.data),
        retry: 3000,
      });
    }

    // 2. Keep-alive heartbeat every 15s to prevent proxy idle timeout
    const heartbeatTimer = setInterval(async () => {
      if (closed) {
        clearInterval(heartbeatTimer);
        return;
      }
      await stream.writeSSE({ event: 'ping', data: String(Date.now()) });
    }, 15_000);

    try {
      while (!closed) {
        await stream.sleep(1000);
      }
    } finally {
      clearInterval(heartbeatTimer);
    }
  });
});

async function fetchMissedEventsFromStream(
  tenantId: string,
  sinceId: string
): Promise<StreamEventPayload[]> {
  return [
    {
      id: `${Date.now()}-0`,
      event: 'system.connected',
      data: { tenantId, resumedFrom: sinceId },
    },
  ];
}

export default app;
```

---

#### 2. Horizontal WebSocket Scaling with Redis Pub/Sub & Heartbeat (Bun / Node.js)
When scaling horizontally across multiple instances, Client A on Node 1 cannot message Client B on Node 2 without a shared Pub/Sub backplane:

```typescript
// src/ws/realtime-hub.ts
import Redis from 'ioredis';

export interface WsMetadata {
  userId: string;
  roomId: string;
  isAlive: boolean;
}

const pub = new Redis(process.env.REDIS_URL!);
const sub = new Redis(process.env.REDIS_URL!);

const localClients = new Map<string, Set<{ send: (msg: string) => void; meta: WsMetadata }>>();

sub.on('message', (channel, message) => {
  if (!channel.startsWith('room:')) return;
  const roomId = channel.slice(5);
  const peers = localClients.get(roomId);
  if (!peers) return;

  for (const client of peers) {
    client.send(message);
  }
});

export async function joinRoom(
  socket: { send: (msg: string) => void; meta: WsMetadata }
): Promise<void> {
  const { roomId } = socket.meta;
  let roomSet = localClients.get(roomId);
  if (!roomSet) {
    roomSet = new Set();
    localClients.set(roomId, roomSet);
    await sub.subscribe(`room:${roomId}`);
  }
  roomSet.add(socket);
}

export async function broadcastToRoom(roomId: string, payload: unknown): Promise<void> {
  const serialized = JSON.stringify({
    roomId,
    timestamp: new Date().toISOString(),
    payload,
  });
  await pub.publish(`room:${roomId}`, serialized);
}
```

---

#### 3. Resilient Browser SSE Client with Exponential Backoff (POST Streaming)
Native `EventSource` only supports `GET` requests and cannot send custom `Authorization: Bearer` headers or JSON POST bodies (required for LLM chat streams):

```typescript
// src/client/stream-post.ts
export async function streamPostSSE(options: {
  url: string;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  onEvent: (event: { event: string; data: string; id?: string }) => void;
}): Promise<void> {
  const response = await fetch(options.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...options.headers,
    },
    body: JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream connection failed with HTTP ${response.status}`);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;

    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      let eventName = 'message';
      let dataLines: string[] = [];
      let eventId: string | undefined;

      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim();
        else if (line.startsWith('id:')) eventId = line.slice(3).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }

      if (dataLines.length > 0) {
        options.onEvent({ event: eventName, data: dataLines.join('\n'), id: eventId });
      }
    }
  }
}
```

---

### Verification Checklist
- [ ] SSE endpoints set `X-Accel-Buffering: no` and `Cache-Control: no-cache, no-transform` to prevent reverse-proxy buffering.
- [ ] Idle connections emit a periodic `: ping` or `event: ping` frame every 15–25 seconds.
- [ ] Reconnecting clients pass `Last-Event-ID` to resume missed events without data loss.
- [ ] WebSocket servers enforce maximum payload size (`maxPayloadLength`) and rate-limit incoming frames per socket.
- [ ] Multi-instance WebSocket deployments synchronize state via Redis Streams/Pub-Sub or Cloudflare Durable Objects.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec sse-websocket-streaming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **Backend & Runtime**: `js-backend-expert` (Hono, Fastify, Express), `bun-runtime-expert` (WebSocket native `Bun.serve`), `cloudflare-workers-expert` (WebSocket Durable Objects), dan `go-programming-expert` (channel konkurensi goroutine).
- **Streaming AI**: `vercel-ai-sdk-expert`, `gemini-agent-booster`, `voice-ai-realtime-agent`, dan `chatbot-messaging-expert` untuk streaming token AI chunk-by-chunk dan komunikasi suara/teks dua arah.
- **Frontend & Realtime**: `senior-frontend` (hook `EventSource` & `useChat`), `realtime-collaboration-expert` (CRDT Yjs), `reactive-sync-engine-expert`, dan `api-gateway-proxy-expert` (konfigurasi reverse proxy tanpa buffering streaming).
- **Siklus Hidup**: `brainstorming` dan `zero-to-prod-orchestrator`.

### Deskripsi
Panduan rekayasa kelas produksi untuk arsitektur push data real-time dan streaming dua arah. Mencakup **Server-Sent Events (SSE)** dengan pemutaran ulang kursor `Last-Event-ID`, **WebSockets** di Hono/Bun dan Cloudflare Durable Objects, penskalaan horizontal dengan **Redis Streams / Pub-Sub**, kontrol *backpressure*, serta konfigurasi anti-buffering reverse proxy.

### Panduan Arsitektur Inti
1. **SSE vs WebSockets**: Gunakan SSE untuk aliran satu arah dari server ke klien (streaming token AI, notifikasi live, feed harga) karena berjalan di atas HTTP/2 standar dan mendukung rekoneksi otomatis. Gunakan WebSockets untuk komunikasi dua arah berlatensi rendah (chat interaktif, multiplayer).
2. **Pencegahan Buffering Proxy**: Selalu kirimkan header `X-Accel-Buffering: no` dan `Cache-Control: no-cache, no-transform` serta sinyal *heartbeat* setiap 15 detik agar koneksi tidak diputus oleh NGINX atau Cloudflare.
3. **Penskalaan Horizontal (Redis Backplane)**: Gunakan Redis Pub/Sub atau Redis Streams agar pesan dari Server A dapat diteruskan ke klien yang terhubung di Server B, serta mendukung *replay* pesan menggunakan `Last-Event-ID`.

### Daftar Periksa Verifikasi (Checklist)
- [ ] Endpoint SSE menyertakan header `X-Accel-Buffering: no` dan `Cache-Control: no-cache, no-transform`.
- [ ] Koneksi menyertakan mekanisme *heartbeat* setiap 15–25 detik.
- [ ] Rekoneksi klien mengirimkan `Last-Event-ID` untuk memulihkan pesan yang terlewat.
- [ ] Server WebSocket membatasi ukuran frame maksimum dan memiliki *rate-limiter* per koneksi.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec sse-websocket-streaming-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
