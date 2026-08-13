---
name: sse-websocket-streaming-expert
description: "Expert guide for Server-Sent Events (SSE), WebSockets, and Streaming Architectures. Covers real-time data push, Socket.IO, Hono WebSocket, and AI response streaming / Panduan ahli streaming real-time."
author: "Roedy Rustam"
---

# SSE, WebSocket & Streaming Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Expert guide for building high-performance, real-time streaming architectures. Covers Server-Sent Events (SSE), WebSocket scaling (Socket.IO, native WebSockets, Bun WebSockets), streaming HTTP responses, and bidirectional communication. Crucial for AI response streaming (LLM typing effects), live dashboards, and instant notifications.

### Trigger Conditions
Activate this skill when the user is:
- Building an AI chatbot that requires token-by-token text streaming.
- Implementing a real-time live dashboard or stock ticker.
- Adding instant push notifications to a web client.
- Deciding between WebSockets, SSE, and long-polling for real-time features.

---

### Core Concepts

#### 1. Selection Guide: WebSockets vs SSE
| Feature | WebSockets | Server-Sent Events (SSE) |
|---|---|---|
| **Direction** | Bidirectional (Full Duplex) | Unidirectional (Server -> Client) |
| **Protocol** | `ws://` (Custom TCP) | Standard HTTP/HTTPS |
| **Best For** | Chat, multiplayer games | AI streaming, notifications, live feeds |
| **Complexity** | High (needs load balancer support) | Low (native HTTP, easy to proxy) |

**Recommendation:** Default to SSE for 90% of real-time web features (like AI streaming or notifications) because it runs over standard HTTP, bypasses corporate firewall blocks, and supports automatic reconnection. Only use WebSockets when the client needs to rapidly push high-frequency data *to* the server (like games or collaborative drawing).

#### 2. Streaming LLM Responses via SSE (Next.js Example)
```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Simulate AI generation
  (async () => {
    const text = "Hello from the AI model!";
    for (const char of text) {
      await writer.write(new TextEncoder().encode(`data: ${char}\n\n`));
      await new Promise(r => setTimeout(r, 50));
    }
    await writer.close();
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

### Best Practices

1. **Connection State Management:** Always handle disconnection events and implement exponential backoff reconnection strategies on the client.
2. **Horizontal Scaling for WebSockets:** WebSockets are stateful. To scale horizontally across multiple instances, you MUST use a Pub/Sub backplane (like Redis) so an event emitted on Server A reaches a client connected to Server B.
3. **Keep-Alives (Heartbeats):** Implement ping/pong heartbeats to detect dead TCP connections that haven't been cleanly closed by the network.
4. **Auth Handshakes:** For WebSockets, authenticate during the initial HTTP upgrade handshake using a ticket/token system rather than sending JWTs in plaintext over the active websocket channel.

---

### Common Pitfalls to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| **Using WebSockets for one-way feeds** | Over-engineering, firewall issues | Use Server-Sent Events (SSE) which use standard HTTP. |
| **Ignoring the connection limit** | Browsers limit SSE connections (HTTP/1.1 limits to 6 per domain) | Use HTTP/2 (multiplexing solves the limit) or combine streams. |
| **Missing Redis backplane** | Users don't see messages if routed to different servers | Integrate Redis Pub/Sub for cross-instance WebSocket broadcasting. |

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `realtime-collaboration-expert` — While this skill handles the transport layer (SSE/WS), collaboration handles the state layer (CRDTs).
- `ai-llm-integration-expert` — For streaming AI outputs via Server-Sent Events for the ChatGPT-like typing effect.
- `js-backend-expert` — For implementing WebSocket or SSE servers using Bun, Hono, or Node.js.

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to the "Backend & Infrastructure" domain.
- `zero-to-prod-orchestrator` — Phase 3 (Architecture) and Phase 4 (Backend).
- `production-ready-hardener` — Phase 4 (Backend Hardening) for checking WebSocket scaling architectures.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun arsitektur streaming *real-time* berkinerja tinggi. Mencakup Server-Sent Events (SSE), skalabilitas WebSocket (Socket.IO, Bun WebSockets), streaming respons HTTP, dan komunikasi dua arah. Sangat penting untuk streaming respons AI (efek mengetik), dashboard langsung, dan notifikasi instan.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Membangun chatbot AI yang memerlukan streaming teks per-token.
- Mengimplementasikan *live dashboard* atau *ticker* saham secara *real-time*.
- Menambahkan notifikasi *push* instan ke klien web.
- Memutuskan antara WebSockets, SSE, dan *long-polling* untuk fitur *real-time*.

### Panduan Singkat

- **Pilih SSE Sebelum WebSocket:** Gunakan Server-Sent Events (SSE) untuk 90% kasus (seperti streaming AI atau notifikasi). SSE berjalan di atas HTTP standar, kebal terhadap pemblokiran *firewall*, dan memiliki fitur *auto-reconnect* bawaan. Gunakan WebSocket hanya jika klien perlu mengirim data secara intensif ke server (seperti game *multiplayer*).
- **Wajib Redis Pub/Sub untuk Scaling:** WebSocket memiliki *state* (koneksi terbuka persisten). Jika Anda memiliki dua server, pesan dari Server A tidak akan sampai ke klien di Server B tanpa adanya lapisan komunikasi antar-server (*backplane*) seperti Redis Pub/Sub.
- **Terapkan Heartbeat (Ping/Pong):** Jaringan sering memutuskan koneksi tanpa memberitahu aplikasi. Terapkan mekanisme *ping/pong* untuk mendeteksi dan membersihkan koneksi yang terputus secara diam-diam.
- **Awasi Batasan HTTP/1.1:** Browser membatasi maksimal 6 koneksi persisten HTTP/1.1 per domain (berdampak pada SSE). Pastikan server Anda mendukung HTTP/2 untuk menghindari batasan ini melalui *multiplexing*.

### Integrasi dengan Skill Lain (WAJIB)

Skill ini bekerja paling baik dikombinasikan dengan:
- `realtime-collaboration-expert` — Menangani kolaborasi state (CRDT), sementara skill ini menangani lapisan transportasinya (SSE/WS).
- `ai-llm-integration-expert` — Untuk melakukan streaming keluaran AI menggunakan SSE (efek mengetik ala ChatGPT).
- `js-backend-expert` — Untuk membangun server WebSocket atau SSE menggunakan Bun, Hono, atau Node.js.

### Direferensikan oleh Orchestrator (WAJIB)

Skill ini harus direferensikan oleh orchestrator berikut:
- `brainstorming` — Tambahkan ke domain "Backend & Infrastructure".
- `zero-to-prod-orchestrator` — Fase 3 (Arsitektur) dan Fase 4 (Backend).
- `production-ready-hardener` — Fase 4 (Backend Hardening) untuk memeriksa arsitektur *scaling* WebSocket.
