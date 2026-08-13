---
name: ai-prompt-engineering-expert
description: "Expert guide for systematic Prompt Engineering, Chain-of-Thought, few-shot prompting, structured output (JSON mode), prompt versioning, and LLM evaluation / Panduan ahli rekayasa prompt dan evaluasi LLM."
author: vibes-plug-swarm
---

# AI Prompt Engineering Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
A specialized guide focused purely on the *craft* of interacting with Large Language Models (LLMs). While `ai-llm-integration-expert` covers the architecture (RAG, Vector DBs, APIs), this skill covers how to write, version, evaluate, and defend prompts. It focuses on maximizing accuracy and reliability from foundation models (Claude, GPT-4, Llama 3, Gemini).

### Trigger Conditions
- When writing complex system prompts for autonomous AI agents.
- When an LLM is hallucinating or returning poorly formatted data.
- When the user asks about "Chain-of-Thought", "few-shot", or "JSON mode".
- When building a prompt testing and evaluation pipeline (e.g., using LangSmith or Braintrust).
- When defending an application against Prompt Injection attacks.

### Core Architectural Guidelines

#### 1. Structured Output (JSON Mode & Tool Calling)
Never rely on prompt instructions alone to get JSON. Always use the model's native Tool Calling/Function Calling capabilities or Structured Output mode (e.g., passing a JSON Schema).
- **Zod**: Use Zod to define your desired schema in TypeScript, then convert it to JSON Schema for the LLM. Parse the response back through Zod to guarantee type safety.

#### 2. Advanced Prompting Techniques
- **Chain-of-Thought (CoT)**: Force the model to think before it acts. Provide a `<thinking>` tag for the model to use before it outputs the final answer.
- **Few-Shot Prompting**: Provide 2-3 highly varied examples of the input-output pairs you expect.
- **Clear Boundaries**: Use XML tags to separate instructions from user input to prevent confusion (e.g., `<user_input>`, `<system_rules>`).

#### 3. Defense Against Prompt Injection
- Never trust user input. If you are building a tool that summarizes user-provided text, wrap the text tightly in delimiters and instruct the model to ignore any instructions within those delimiters.
- Keep system prompts isolated from the user's direct chat window.

#### 4. Prompt Versioning & Evaluation
- Prompts are code. Do not hardcode massive prompts directly in your application logic. Store them in version control (or a Prompt CMS like LangSmith).
- Build automated evaluation suites using LLM-as-a-Judge to score whether a change in the prompt improved or degraded performance on a golden dataset.

## Orchestration & Integration
- Enhances `ai-llm-integration-expert` with high-quality, reliable prompt designs.
- Crucial for `gemini-agent-booster` when creating multi-agent swarms with distinct system personalities.
- Pairs with `autonomous-red-teamer` to penetration test prompts against injection attacks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan khusus yang berfokus murni pada *seni dan sains* berinteraksi dengan Large Language Models (LLMs). Berbeda dengan `ai-llm-integration-expert` yang fokus pada infrastruktur (RAG, API), skill ini membahas cara menulis, memberikan versi, mengevaluasi, dan melindungi prompt untuk memaksimalkan akurasi model dasar.

### Kondisi Pemicu
- Saat menyusun system prompt yang kompleks untuk agen AI otonom.
- Saat LLM berhalusinasi atau mengembalikan data dengan format yang salah.
- Saat Anda perlu menjamin output berformat JSON yang ketat.
- Saat melindungi aplikasi dari serangan *Prompt Injection*.

### Panduan Arsitektur Inti

#### 1. Output Terstruktur (Structured Output)
Jangan hanya menyuruh model "berikan output JSON" di dalam teks prompt. Gunakan fitur *Tool Calling* / *Function Calling* bawaan model, atau berikan JSON Schema yang ketat. Gunakan Zod (di TypeScript) atau Pydantic (di Python) untuk memvalidasi output tersebut.

#### 2. Teknik Prompting Lanjutan
- **Chain-of-Thought (CoT)**: Selalu instruksikan model untuk "berpikir" terlebih dahulu sebelum memberikan jawaban akhir. Minta model untuk menuliskan alur logikanya di dalam tag `<thinking>`.
- **Few-Shot**: Berikan 2-3 contoh input dan output (contoh positif maupun negatif) agar model memahami pola yang Anda inginkan.
- **Pembatasan (Delimiters)**: Gunakan tag XML (`<aturan>`, `<data_pengguna>`) untuk memisahkan instruksi dari data mentah.

#### 3. Pertahanan Terhadap Prompt Injection
- Jika aplikasi Anda memproses teks dari pengguna eksternal (misal: ringkasan email), selalu bungkus teks tersebut dengan tag XML dan beri peringatan eksplisit pada model untuk mengabaikan instruksi apa pun yang berada di dalam tag tersebut.

#### 4. Versioning & Evaluasi
- Prompt adalah kode sumber (source code). Simpan dalam *version control* atau *Prompt Management System*.
- Buat pipeline evaluasi (LLM-as-a-Judge) untuk mengukur secara kuantitatif apakah perubahan prompt Anda meningkatkan atau menurunkan kualitas hasil.

## Integrasi Orkestrasi
- Melengkapi `ai-llm-integration-expert` dengan desain prompt berkualitas tinggi.
- Sangat penting bagi `gemini-agent-booster` saat mengonfigurasi kepribadian agen yang berbeda-beda.
- Bekerja sama dengan `autonomous-red-teamer` untuk menguji ketahanan prompt dari serangan.
