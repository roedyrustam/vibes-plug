---
name: chatbot-messaging-expert
description: "Expert guide for chatbot and messaging platform integration (WhatsApp Business, Telegram Bot, Discord.js, Slack Bolt) and conversational AI / Panduan ahli integrasi chatbot dan platform messaging (WhatsApp Business, Telegram Bot, Discord.js, Slack Bolt) dan AI percakapan."
author: "vibes-plug-swarm"
---

# Chatbot & Messaging Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`ai-llm-integration-expert`**: LLM-powered conversational AI and tool calling.
- **`sse-websocket-streaming-expert`**: Real-time messaging protocols.
- **`webhook-receiver`**: Secure webhook endpoints for messaging platforms.
- **`async-queue-temporal-expert`**: Message queue processing for high-volume bots.

### Description
Expert guide for building chatbots and integrating messaging platforms into applications. Covers WhatsApp Business API (Cloud API), Telegram Bot API, Discord.js v14, Slack Bolt, LINE Messaging API, and conversational AI patterns. Includes webhook verification, message handlers, interactive components (buttons, carousels), media handling, and AI-powered response generation.

### Trigger Conditions
- Building a chatbot for WhatsApp, Telegram, Discord, or Slack.
- Integrating messaging platform APIs into existing applications.
- Creating AI-powered conversational agents on messaging platforms.
- Implementing webhook handlers for messaging notifications.

---

### Platform Quick Reference

| Platform | API Type | Auth | Message Types | Webhook |
|----------|----------|------|---------------|---------|
| WhatsApp Business | REST (Cloud API) | Bearer Token | Text, Image, Template, Interactive | ✅ Verify token |
| Telegram | REST (Bot API) | Bot Token | Text, Photo, Inline Keyboard, Callback | ✅ setWebhook |
| Discord | Gateway + REST | Bot Token | Text, Embed, Components, Slash Commands | Gateway events |
| Slack | Events API + REST | OAuth + Signing Secret | Blocks, Modals, Slash Commands | ✅ Request signing |

### Core Patterns

#### WhatsApp Business Cloud API
```typescript
// Webhook verification + message handler
import { Hono } from 'hono';
const app = new Hono();

app.get('/webhook/whatsapp', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');
  if (mode === 'subscribe' && token === process.env.WA_VERIFY_TOKEN) {
    return c.text(challenge!);
  }
  return c.text('Forbidden', 403);
});

app.post('/webhook/whatsapp', async (c) => {
  const body = await c.req.json();
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (message?.type === 'text') {
    await sendWhatsAppReply(message.from, `Echo: ${message.text.body}`);
  }
  return c.text('OK');
});

async function sendWhatsAppReply(to: string, text: string) {
  await fetch(`https://graph.facebook.com/v21.0/${process.env.WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }),
  });
}
```

#### Telegram Bot
```typescript
import { Bot, InlineKeyboard } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

bot.command('start', (ctx) => ctx.reply('Welcome! How can I help?'));
bot.on('message:text', async (ctx) => {
  const aiResponse = await generateAIResponse(ctx.message.text);
  const keyboard = new InlineKeyboard()
    .text('👍 Helpful', 'feedback_good')
    .text('👎 Not helpful', 'feedback_bad');
  await ctx.reply(aiResponse, { reply_markup: keyboard });
});

bot.callbackQuery('feedback_good', (ctx) => ctx.answerCallbackQuery('Thanks!'));
bot.start();
```

## Orchestration & Integration
- `ai-llm-integration-expert`, `webhook-receiver`, `async-queue-temporal-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun chatbot dan mengintegrasikan platform messaging ke dalam aplikasi. Mencakup WhatsApp Business API, Telegram Bot API, Discord.js v14, Slack Bolt, dan pola AI percakapan.

### Kondisi Pemicu
- Membangun chatbot untuk WhatsApp, Telegram, Discord, atau Slack.
- Mengintegrasikan API platform messaging ke aplikasi yang sudah ada.
- Membuat agen percakapan berbasis AI di platform messaging.
