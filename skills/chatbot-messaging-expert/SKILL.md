---
name: chatbot-messaging-expert
description: "Chatbots & messaging APIs: WhatsApp Business, Telegram, Discord, Slack / Integrasi chatbot & messaging: WhatsApp, Telegram, Discord, Slack."
author: "Roedy Rustam"
version: "4.4.2"

---

# Chatbot & Messaging Platform Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with domain skills:
- **UI & Chat Components**: `senior-frontend`, `design-system-architect`, `ui-ux-pro-max`, `modern-web-guidance`, and `anti-slop` for web chat drawer widgets, message bubbles, typing indicators, quick reply chips, and streaming Markdown UI.
- **Visual Auditing**: `visual-ui-auditor` for validating chat bubble contrast, mobile drawer responsiveness, and 1px borders.
- **AI & Realtime**: `ai-llm-integration-expert`, `sse-websocket-streaming-expert`, and `voice-ai-realtime-agent` for generative responses, RAG retrieval, and real-time socket connections.
- **Queue & Resilience**: `async-queue-temporal-expert` and `rate-limit-abuse-prevention` for webhook ingestion, BullMQ job queues, and anti-spam protection.
- **Lifecycle**: `brainstorming` and `zero-to-prod-orchestrator` for structured conversational system delivery.

### Description
Production guide for architecting, deploying, and scaling conversational bots across enterprise messaging platforms: WhatsApp Business Cloud API, Telegram Bot API (via grammY), Discord.js v14, Slack Bolt (Block Kit), and LINE Messaging API. Covers cryptographic webhook verification (Meta `hub.challenge` and Slack `v0` HMAC signatures), interactive UI components (buttons, carousels, quick replies), session state persistence, media streaming, and integration with AI tool calling engines.

### Trigger Conditions
- Integrating customer support or transactional notification bots for WhatsApp Business.
- Scaffolding Telegram automation bots with inline keyboards and deep linking.
- Building Discord slash command applications and voice channel event listeners.
- Developing Slack workspace applications with modal forms and Block Kit interactive layouts.
- Ingesting and verifying messaging webhooks with signature authentication.

### Platform Quick Reference Matrix

| Platform | Protocol | Auth Mechanism | Primary Message Types | Webhook Verification |
|---|---|---|---|---|
| **WhatsApp Business** | REST (Meta Cloud API) | System User Token | Text, Interactive Buttons, Lists, Templates | `hub.verify_token` + `hub.challenge` |
| **Telegram** | REST (Bot API) | Bot Token | Text, Photos, Inline Keyboards, Web Apps | Secret token header (`setWebhook`) |
| **Slack** | Events API / Sockets | Bot Token + Signing Secret | Block Kit, Modals, Slash Commands | HMAC-SHA256 (`v0=...`) signature |
| **Discord** | Gateway (WebSockets) + REST | Bot Token | Embeds, Select Menus, Slash Commands | Ed25519 signature verification |

### WhatsApp Business Cloud API Webhook Handler (Hono / TypeScript)

```typescript
// src/routes/whatsapp-webhook.ts
import { Hono } from 'hono';

const app = new Hono();

// 1. Meta Webhook Handshake Verification
app.get('/webhook/whatsapp', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return c.text(challenge!, 200);
  }
  return c.text('Forbidden: Invalid verification token', 403);
});

// 2. Incoming Message Processing
app.post('/webhook/whatsapp', async (c) => {
  const payload = await c.req.json();
  const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message && message.type === 'text') {
    const senderPhone = message.from;
    const incomingText = message.text.body;

    // Acknowledge receipt immediately (WhatsApp requires <3s HTTP 200 response)
    // Execute AI response generation asynchronously
    c.executionCtx?.waitUntil(handleIncomingWhatsAppMessage(senderPhone, incomingText));
  }

  return c.json({ status: 'ok' }, 200);
});

async function handleIncomingWhatsAppMessage(to: string, prompt: string) {
  // Call AI agent and send reply
  await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: `AI Assistant: Processing your request...` },
    }),
  });
}
```

### Telegram Bot with Inline Buttons (grammY)

```typescript
// src/bots/telegram-bot.ts
import { Bot, InlineKeyboard, webhookCallback } from 'grammy';

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('📦 Check Order', 'action_order')
    .text('💬 Human Support', 'action_support')
    .row()
    .url('🌐 Open Web App', 'https://vibesplug.internal/app');

  await ctx.reply(`Hello ${ctx.from?.first_name}! How can I assist you today?`, {
    reply_markup: keyboard,
  });
});

bot.callbackQuery('action_order', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'Fetching order data...' });
  await ctx.reply('Please reply with your Order Number (e.g., #ORD-12345).');
});
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec chatbot-messaging-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama skill domain:
- **UI & Komponen Obrolan**: `senior-frontend`, `design-system-architect`, `ui-ux-pro-max`, `modern-web-guidance`, dan `anti-slop` untuk widget laci obrolan web (chat drawer), gelembung pesan, indikator mengetik, pill quick reply, dan antarmuka streaming Markdown.
- **Audit Visual**: `visual-ui-auditor` untuk validasi kontras warna balon obrolan, responsivitas drawer mobile, dan border tajam 1px.
- **AI & Realtime**: `ai-llm-integration-expert`, `sse-websocket-streaming-expert`, dan `voice-ai-realtime-agent` untuk jawaban generatif cerdas, RAG retrieval, dan koneksi socket dua arah.
- **Antrean & Ketahanan**: `async-queue-temporal-expert` dan `rate-limit-abuse-prevention` untuk penyerapan webhook, antrean job BullMQ, dan pencegahan spam DDoS.
- **Siklus Hidup**: `brainstorming` dan `zero-to-prod-orchestrator` untuk eksekusi sistem percakapan end-to-end.

### Deskripsi
Panduan produksi untuk merancang, meluncurkan, dan menskalakan bot percakapan di berbagai platform perpesanan terkemuka: WhatsApp Business Cloud API, Telegram Bot API (via grammY), Discord.js v14, Slack Bolt (Block Kit), dan LINE Messaging API. Mencakup verifikasi webhook kriptografis (jabat tangan Meta `hub.challenge` dan tanda tangan HMAC Slack `v0`), komponen interaktif (tombol, list menu, keyboard inline), persistensi sesi pengguna, penanganan media, serta integrasi pemanggilan fungsi AI (*tool calling*).

### Kondisi Pemicu
- Membangun bot layanan pelanggan (*customer support*) atau notifikasi transaksi otomatis di WhatsApp Business.
- Membuat bot otomasi Telegram dengan tombol inline interaktif dan integrasi Telegram Web App.
- Mengembangkan aplikasi Discord dengan slash command (`/order`, `/status`).
- Mengembangkan bot internal Slack dengan form modal interaktif (*Block Kit*).
- Memverifikasi webhook platform perpesanan agar kebal dari pemalsuan data (*spoofing*).

### Pola Integrasi Slack Bolt (Slash Commands & Block Kit)

```typescript
// src/bots/slack-app.ts
import { App } from '@slack/bolt';

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Menangani perintah slash command: /faktur
slackApp.command('/faktur', async ({ command, ack, respond }) => {
  // Wajib kirim ack() dalam 3 detik agar Slack tidak menampilkan error timeout
  await ack();

  await respond({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Halo <@${command.user_id}>, berikut adalah rincian faktur pesanan Anda:`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Unduh PDF Faktur' },
            action_id: 'btn_unduh_pdf',
            style: 'primary',
          },
        ],
      },
    ],
  });
});
```

### 3 Aturan Emas Integrasi Platform Perpesanan
1. **Respons Webhook < 3 Detik**: WhatsApp, Slack, dan Telegram akan memutus koneksi jika endpoint tidak mengembalikan HTTP 200 dalam 3 detik. Kembalikan respons 200 terlebih dahulu, lalu proses pembuatan jawaban AI secara asinkron di latar belakang (*background job*).
2. **Validasi Tanda Tangan Kriptografis**: Selalu periksa tanda tangan incoming payload (`x-hub-signature-256` di WhatsApp atau `x-slack-signature` di Slack) untuk mencegah pihak ketiga mengirim pesan palsu ke server Anda.
3. **Penyimpanan Sesi Percakapan**: Simpan konteks percakapan di Redis dengan TTL terukur agar pengguna dapat melanjutkan percakapan tanpa kehilangan konteks.

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec chatbot-messaging-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
