---
name: llm-finops-router
description: Expert guide for AI FinOps, dynamic model routing (LiteLLM, Portkey), cost optimization, and latency-based fallback architectures / Panduan ahli untuk AI FinOps, routing model dinamis, optimasi biaya, dan arsitektur fallback.
version: "4.2.0"
author: "Roedy Rustam"
---

# LLM FinOps & Dynamic Model Router

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with `ai-llm-integration-expert`, `vercel-ai-sdk-expert`, `multi-agent-orchestration`, and `cloud-hosting-expert`.

### Purpose
To optimize the operational costs, reliability, and latency of multi-model LLM architectures using dynamic routing, fallbacks, and FinOps analytics.

### Key Technologies
- **LiteLLM**: For standardized API access and basic routing.
- **Portkey**: For AI Gateway, observability, caching, and robust routing rules.
- **Martian / RouteLLM**: For intelligent routing based on task complexity.

### Architectural Guidelines
1. **Cost-Aware Routing**: Direct simple classification or text extraction tasks to smaller models (e.g., Gemini Flash-Lite, Llama 3 8B), and complex reasoning tasks to frontier models (Claude 3.5 Sonnet/Opus, Gemini 3.1 Pro).
2. **Resilience & Fallbacks**: Automatically fall back to secondary providers if the primary provider hits rate limits or experiences downtime.
3. **Semantic Caching**: Implement caching at the gateway level to return immediate responses for similar queries, reducing token costs by up to 30-50%.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi bersama `ai-llm-integration-expert`, `vercel-ai-sdk-expert`, `multi-agent-orchestration`, dan `cloud-hosting-expert`.

### Tujuan
Mengoptimalkan biaya operasional, keandalan, dan latensi arsitektur LLM multi-model menggunakan routing dinamis, fallback, dan analitik FinOps.

### Teknologi Utama
- **LiteLLM**: Untuk akses API standar dan routing dasar.
- **Portkey**: Untuk AI Gateway, observabilitas, caching, dan aturan routing yang kuat.
- **Martian / RouteLLM**: Untuk routing cerdas berdasarkan kompleksitas tugas.

### Panduan Arsitektur
1. **Routing Sadar Biaya**: Arahkan tugas klasifikasi sederhana ke model yang lebih kecil (mis. Gemini Flash-Lite), dan tugas penalaran kompleks ke model frontier (Claude 3.5 Sonnet, Gemini 3.1 Pro).
2. **Ketahanan & Fallback**: Otomatis mundur ke penyedia cadangan jika penyedia utama terkena rate limit atau mengalami downtime.
3. **Semantic Caching**: Implementasikan caching di tingkat gateway untuk mengembalikan respons instan pada kueri yang serupa, mengurangi biaya token hingga 30-50%.
