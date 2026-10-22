---
name: vercel-ai-sdk-expert
description: "Expert guide for Vercel AI SDK (Core, UI, RSC), streaming structured data, multi-provider model switching, tool calling loops, and React 19/Next.js 15 AI engineering / Panduan ahli Vercel AI SDK, streaming data terstruktur, dan integrasi AI pada React 19/Next.js 15."
author: "Roedy Rustam"
version: "4.4.2"

---

# Vercel AI SDK Expert (Core, UI & Fullstack AI Engineering)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Upstream Models & Transports**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`
- **Frontend Presentation & Generative UI**: `senior-frontend`, `nextjs-app-router-expert`, `ephemeral-generative-ui-architect`
- **Tooling & Swarms**: `mcp-server-architect`, `multi-agent-orchestration`, `parallel-tool-orchestrator`
- **Contracts & Schemas**: `structured-output-contracts`, `form-validation-expert`, `typescript-expert`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Description
Production-grade guide for building AI applications using the **Vercel AI SDK (Core & UI)**. Covers unified model provider abstraction (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`), streaming text and structured objects (`streamText`, `streamObject`), dynamic multi-step tool execution loops with `maxSteps`, client-side React 19 hooks (`useChat`, `useCompletion`), streaming data attachments (`createDataStreamResponse`), and generative UI rendering.

**Swarm Synergy:** Within the **Frontend & UI Swarm**, this skill serves as the AI UI Presentation Lead. It translates complex backend multi-agent outputs and streaming tokens into accessible, beautiful web components in Phase 4 & Phase 5.

### Trigger Conditions
- Integrating conversational chat, streaming completions, or generative UI in React 19 / Next.js 15.
- Implementing structured data extraction using `generateObject` or `streamObject` with Zod schemas.
- Building autonomous multi-step tool-calling loops on Next.js Route Handlers or Server Actions.
- Switching seamlessly across frontier providers (Claude 5.1 Fable / 5 Sonnet, Gemini 4 Pro / Flash, OpenAI GPT-5.6 / o3 / GPT-4.5, Ollama).
- Building streaming data channels with custom metadata, tool status indicators, and citations.

### Vercel AI SDK Architecture (Core vs UI)

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
│  useChat / useCompletion / Generative UI React Components    │
│  • Optimistic updates  • Stream reader  • Tool invocation   │
└──────────────────────────────▲──────────────────────────────┘
                               │ HTTP SSE / Data Stream Protocol
┌──────────────────────────────▼──────────────────────────────┐
│                    SERVER ROUTE / ACTION                    │
│  streamText({                                               │
│    model: anthropic('claude-3-7-sonnet-20250219'),          │
│    tools: { weatherTool, dbQueryTool },                     │
│    maxSteps: 5,                                             │
│  }).toDataStreamResponse()                                  │
└─────────────────────────────────────────────────────────────┘
```

### Core Implementation Guidelines

#### 1. Next.js 15 Route Handler with Multi-Step Tool Calling & Step Hooks
Use `streamText` with `maxSteps`, `onStepFinish`, and native prompt caching for iterative tool calling:
```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // Allow long-running agentic reasoning

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    messages,
    maxSteps: 10, // Iterative tool-calling loop up to 10 steps
    providerOptions: {
      anthropic: {
        cacheControl: { type: 'ephemeral' }, // Prompt caching for 90% TTFT acceleration
      },
    },
    tools: {
      calculateMetrics: tool({
        description: 'Computes analytical metrics from raw time series data',
        parameters: z.object({
          datasetId: z.string().min(1),
          metricType: z.enum(['p95_latency', 'error_rate', 'throughput']),
        }),
        execute: async ({ datasetId, metricType }) => {
          const metrics = await fetchDatasetMetrics(datasetId, metricType);
          return { datasetId, metricType, value: metrics.result, timestamp: new Date().toISOString() };
        },
      }),
    },
    system: 'You are an elite software performance auditor. Always ground conclusions with tool metrics.',
    onStepFinish: ({ stepType, text, toolCalls, toolResults, finishReason, usage }) => {
      console.log(`[Step ${stepType}] Finish: ${finishReason}, Prompt Tokens: ${usage.promptTokens}, Completion: ${usage.completionTokens}`);
      if (toolCalls && toolCalls.length > 0) {
        console.log(`Dispatched tools: ${toolCalls.map(t => t.toolName).join(', ')}`);
      }
    },
  });

  return result.toDataStreamResponse();
}

async function fetchDatasetMetrics(datasetId: string, metricType: string) {
  return { result: metricType === 'p95_latency' ? '12.4ms' : '0.01%' };
}
```

#### 2. Streaming Type-Safe Structured Objects (`streamObject`)
Stream validated structured objects to client components with partial object completion:
```typescript
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const SecurityReportSchema = z.object({
  securityVulnerabilities: z.array(z.object({
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    cwe: z.string(),
    explanation: z.string(),
    suggestedFix: z.string(),
  })),
  overallRiskScore: z.number().min(0).max(100),
  passesReview: z.boolean(),
  mitigationSummary: z.string(),
});

export async function POST(req: Request) {
  const { codeDiff } = await req.json();

  const result = streamObject({
    model: google('gemini-2.5-pro'),
    schema: SecurityReportSchema,
    prompt: `Audit the following git diff for security regressions:\n${codeDiff}`,
  });

  return result.toTextStreamResponse();
}
```

#### 3. Client Hook Integration (`useChat` with Interactive Tool Invocations)
Render streaming markdown, reasoning tokens, and interactive human-in-the-loop tool approvals:
```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export function AgenticChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, addToolResult } = useChat({
    maxSteps: 10,
  });

  return (
    <div className="flex flex-col h-[650px] w-full max-w-3xl mx-auto border border-border rounded-xl p-4 bg-background">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/80'}`}>
              {/* Reasoning Accordion */}
              {m.parts?.map((part, index) => {
                if (part.type === 'reasoning') {
                  return (
                    <details key={index} className="mb-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs">
                      <summary className="cursor-pointer font-medium text-muted-foreground">Thinking Process</summary>
                      <pre className="mt-1 whitespace-pre-wrap font-mono text-muted-foreground">{part.reasoning}</pre>
                    </details>
                  );
                }
                return null;
              })}

              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

              {/* Tool Invocations & Interactive Action Requests */}
              {m.toolInvocations?.map((inv) => (
                <div key={inv.toolCallId} className="mt-3 p-3 bg-background border border-border rounded-lg text-xs font-mono">
                  <div className="flex items-center justify-between font-semibold pb-1 border-b border-border">
                    <span>Tool: {inv.toolName}</span>
                    <span className="text-muted-foreground">{'result' in inv ? 'Done' : 'Running...'}</span>
                  </div>
                  {'result' in inv ? (
                    <pre className="mt-2 text-muted-foreground overflow-x-auto">{JSON.stringify(inv.result, null, 2)}</pre>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => addToolResult({ toolCallId: inv.toolCallId, result: { approved: true } })}
                        className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
                      >
                        Approve Execution
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-border">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask the performance auditor..."
          className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

#### 4. Multimodal Attachments (Images, PDFs & Audio)
Pass multimodal file buffers or URLs directly into `streamText` message arrays:
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt, pdfBase64, imageBase64 } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'file', mimeType: 'application/pdf', data: pdfBase64 },
          { type: 'image', image: imageBase64 },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
```

#### 5. Custom LanguageModelV1 Middleware (`wrapLanguageModel`)
Implement security screening, prompt caching telemetry, or rate limiting via unified middleware:
```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

export const auditedModel = wrapLanguageModel({
  model: anthropic('claude-3-7-sonnet-20250219'),
  middleware: {
    wrapGenerate: async ({ doGenerate, params }) => {
      console.log(`[Audit Middleware] Pre-generation prompt tokens: ${params.prompt.length}`);
      const result = await doGenerate();
      console.log(`[Audit Middleware] Generated tokens: ${result.text?.length ?? 0}`);
      return result;
    },
    wrapStream: async ({ doStream, params }) => {
      console.log(`[Audit Middleware] Initiating stream for model: ${params.modelId}`);
      return await doStream();
    },
  },
});
```

#### 6. Direct Data Stream Control with `createDataStreamResponse`
Send custom progress updates, telemetry events, and citations alongside model tokens:
```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // 1. Send initial telemetry annotation
      dataStream.writeMessageAnnotation({ step: 'INITIALIZING_AUDIT', timestamp: Date.now() });

      // 2. Stream LLM tokens
      const result = streamText({
        model: anthropic('claude-3-7-sonnet-20250219'),
        messages,
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Model Hulu & Transport**: `ai-llm-integration-expert`, `frontier-ai-models-expert`, `gemini-agent-booster`
- **Presentasi Frontend & Generative UI**: `senior-frontend`, `nextjs-app-router-expert`, `ephemeral-generative-ui-architect`
- **Tooling & Swarm**: `mcp-server-architect`, `multi-agent-orchestration`, `parallel-tool-orchestrator`
- **Kontrak & Skema**: `structured-output-contracts`, `form-validation-expert`, `typescript-expert`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Deskripsi
Panduan produksi untuk membangun aplikasi AI menggunakan **Vercel AI SDK (Core & UI)**. Mencakup abstraksi penyedia model terpadu (`@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`), streaming teks dan objek terstruktur (`streamText`, `streamObject`), siklus eksekusi tool multi-langkah otonom dengan `maxSteps`, hook klien React 19 (`useChat`, `useCompletion`), streaming respons saluran data (`createDataStreamResponse`), dan rendering Generative UI.

**Sinergi Swarm:** Di dalam **Frontend & UI Swarm**, skill ini berperan sebagai Pemimpin Presentasi UI AI. Skill ini bertugas mentransformasikan keluaran multi-agen backend dan token streaming menjadi komponen web yang interaktif, aksesibel, dan elegan pada Fase 4 & Fase 5.

### Kondisi Pemicu
- Mengintegrasikan chat percakapan, streaming respons, atau generative UI di React 19 / Next.js 15.
- Menerapkan ekstraksi data terstruktur dengan validasi skema Zod via `generateObject` atau `streamObject`.
- Membangun loop pemanggilan tool (*tool-calling loops*) multi-langkah di Route Handler atau Server Actions.
- Beralih fleksibel antar penyedia model frontier (Claude 5.1 Fable / 5 Sonnet, Gemini 4 Pro / Flash, OpenAI GPT-5.6 / o3 / GPT-4.5, Ollama).
- Mengelola status eksekusi tool, indikator loading, dan rendering komponen UI secara dinamis saat streaming berlangsung.

---

### Implementasi Pola Kunci (TypeScript & React 19)

#### 1. Next.js 15 Route Handler dengan Multi-Step Tool Calling & Hooks Langkah
Gunakan `streamText` dengan `maxSteps: 10`, `onStepFinish`, dan prompt caching native untuk siklus pemanggilan tool iteratif otonom:
```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // Izinkan penalaran agen hingga 60 detik

export async function POST(req: Request) {
  const { messages } = await req.json();

  const hasil = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    messages,
    maxSteps: 10, // Siklus iteratif pemanggilan tool hingga 10 langkah
    providerOptions: {
      anthropic: {
        cacheControl: { type: 'ephemeral' }, // Prompt caching untuk akselerasi TTFT hingga 90%
      },
    },
    tools: {
      hitungMetrikPerforma: tool({
        description: 'Menghitung metrik analitik aplikasi dari data deret waktu mentah',
        parameters: z.object({
          datasetId: z.string().min(1),
          metrik: z.enum(['p95_latensi', 'tingkat_error', 'throughput']),
        }),
        execute: async ({ datasetId, metrik }) => {
          const data = await ambilMetrikSistem(datasetId, metrik);
          return { datasetId, metrik, nilai: data.hasil, timestamp: new Date().toISOString() };
        },
      }),
    },
    system: 'Anda adalah auditor performa perangkat lunak elit. Selalu sertakan bukti valid dari pemanggilan tool.',
    onStepFinish: ({ stepType, text, toolCalls, toolResults, finishReason, usage }) => {
      console.log(`[Langkah ${stepType}] Status: ${finishReason}, Prompt Tokens: ${usage.promptTokens}, Completion: ${usage.completionTokens}`);
      if (toolCalls && toolCalls.length > 0) {
        console.log(`Tool dipanggil: ${toolCalls.map(t => t.toolName).join(', ')}`);
      }
    },
  });

  return hasil.toDataStreamResponse();
}

async function ambilMetrikSistem(datasetId: string, metrik: string) {
  return { hasil: metrik === 'p95_latensi' ? '12.4ms' : '0.01%' };
}
```

#### 2. Streaming Objek Terstruktur Type-Safe (`streamObject`)
Streaming objek terstruktur tervalidasi skema Zod secara instan ke antarmuka klien:
```typescript
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const SkemaLaporanKeamanan = z.object({
  kerentananKeamanan: z.array(z.object({
    tingkatKeparahan: z.enum(['rendah', 'sedang', 'tinggi', 'kritis']),
    cwe: z.string(),
    penjelasan: z.string(),
    saranPerbaikan: z.string(),
  })),
  skorRisikoGlobal: z.number().min(0).max(100),
  lolosReview: z.boolean(),
  ringkasanMitigasi: z.string(),
});

export async function POST(req: Request) {
  const { diffKode } = await req.json();

  const hasil = streamObject({
    model: google('gemini-2.5-pro'),
    schema: SkemaLaporanKeamanan,
    prompt: `Audit perubahan kode berikut untuk potensi regresi keamanan:\n${diffKode}`,
  });

  return hasil.toTextStreamResponse();
}
```

#### 3. Integrasi Hook Klien React 19 (`useChat` dengan Invokasi Tool & Persetujuan)
Render token streaming, akordion penalaran (*thinking process*), dan persetujuan eksekusi tool interaktif:
```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export function AntarmukaChatAgen() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, addToolResult } = useChat({
    maxSteps: 10,
  });

  return (
    <div className="flex flex-col h-[650px] w-full max-w-3xl mx-auto border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'}`}>
              {/* Bagian Penalaran Model / Thinking Process */}
              {m.parts?.map((bagian, index) => {
                if (bagian.type === 'reasoning') {
                  return (
                    <details key={index} className="mb-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs">
                      <summary className="cursor-pointer font-medium text-slate-500 dark:text-slate-400">Proses Penalaran (Thinking)</summary>
                      <pre className="mt-1 whitespace-pre-wrap font-mono text-slate-600 dark:text-slate-300">{bagian.reasoning}</pre>
                    </details>
                  );
                }
                return null;
              })}

              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

              {/* Status Pemanggilan Tool & Aksi Interaktif */}
              {m.toolInvocations?.map((inv) => (
                <div key={inv.toolCallId} className="mt-3 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono">
                  <div className="flex items-center justify-between font-semibold pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span>Tool: {inv.toolName}</span>
                    <span className="text-slate-400">{'result' in inv ? 'Selesai' : 'Sedang Berjalan...'}</span>
                  </div>
                  {'result' in inv ? (
                    <pre className="mt-2 text-slate-600 dark:text-slate-300 overflow-x-auto">{JSON.stringify(inv.result, null, 2)}</pre>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => addToolResult({ toolCallId: inv.toolCallId, result: { disetujui: true } })}
                        className="px-2 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded text-xs"
                      >
                        Setujui Eksekusi Tool
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Tanyakan analisis pada agen..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md disabled:opacity-50"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}

#### 4. Pemrosesan Lampiran Multimodal (Gambar, PDF & Dokumen)
Kirim buffer file multimodal atau URL langsung ke dalam array pesan `streamText`:
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt, pdfBase64, imageBase64 } = await req.json();

  const hasil = streamText({
    model: google('gemini-2.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'file', mimeType: 'application/pdf', data: pdfBase64 },
          { type: 'image', image: imageBase64 },
        ],
      },
    ],
  });

  return hasil.toDataStreamResponse();
}
```

#### 5. Middleware Kustom LanguageModelV1 (`wrapLanguageModel`)
Terapkan penyaringan keamanan, logging token, dan guardrail melalui middleware terpadu:
```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

export const modelAudit = wrapLanguageModel({
  model: anthropic('claude-3-7-sonnet-20250219'),
  middleware: {
    wrapGenerate: async ({ doGenerate, params }) => {
      console.log(`[Middleware Audit] Panjang prompt sebelum generasi: ${params.prompt.length}`);
      const hasil = await doGenerate();
      console.log(`[Middleware Audit] Token selesai di-generate: ${hasil.text?.length ?? 0}`);
      return hasil;
    },
    wrapStream: async ({ doStream, params }) => {
      console.log(`[Middleware Audit] Memulai streaming untuk model: ${params.modelId}`);
      return await doStream();
    },
  },
});
```

#### 6. Kendali Aliran Data Langsung dengan `createDataStreamResponse`
Kirim pembaruan progres kustom, metadata status, dan anotasi telemetri bersamaan dengan token LLM:
```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // 1. Tulis anotasi status awal
      dataStream.writeMessageAnnotation({ status: 'MEMULAI_AUDIT', timestamp: Date.now() });

      // 2. Stream token LLM
      const hasil = streamText({
        model: anthropic('claude-3-7-sonnet-20250219'),
        messages,
      });

      hasil.mergeIntoDataStream(dataStream);
    },
  });
}
```