---
name: synthetic-data-finetuning-expert
description: "Synthetic dataset generation, QLoRA fine-tuning, and local SLM export / Generasi data sintetis, fine-tuning QLoRA, dan ekspor model SLM."
author: "Roedy Rustam"
version: "4.4.4"

---

# Synthetic Data & Fine-Tuning Expert (Custom Domain SLMs)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Local SLM & Quantization**: `local-slm-edge-ai-expert`, `wasm-edge-computing-expert`
- **FinOps & Cost Optimization**: `llm-finops-router`, `adaptive-model-cascade`, `ai-llm-integration-expert`
- **Prompting & Evals**: `ai-prompt-engineering-expert`, `structured-output-contracts`, `ai-safety-governance-expert`
- **Python Pipelines & Tools**: `python-programming-expert`, `data-pipeline-etl-expert`
- **Lifecycle & Governance**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Description
Production-grade guide for generating synthetic training datasets, curating high-signal instruction pairs, executing Parameter-Efficient Fine-Tuning (QLoRA / LoRA) with **Unsloth** and Hugging Face TRL, performing Direct Preference Optimization (DPO), and quantizing custom Small Language Models (SLMs) to GGUF for edge or on-premise execution.

**Swarm Synergy:** Within the **AI Engineering Swarm**, this skill serves as the Model Specialization Lead. When frontier API costs or latency become prohibitive, it trains, aligns, and deploys hyper-efficient domain SLMs (1B–8B parameters) in Phase 4.

### Trigger Conditions
- Generating domain-specific synthetic training data from seed documents, codebases, or APIs.
- Filtering low-quality or hallucinated synthetic data using LLM-as-a-judge curation pipelines.
- Fine-tuning open-weights models (Llama 3.3, Qwen 2.5, Mistral) on custom tasks using 4-bit QLoRA.
- Aligning model outputs using Direct Preference Optimization (DPO) to enforce specific response styles.
- Quantizing fine-tuned models to GGUF (q4_k_m, q8_0) for zero-latency local inference with Ollama or llama.cpp.

### Synthetic Data & Fine-Tuning Lifecycle

```
1. SEED EXTRACTION & SYNTHESIS
   [Raw Docs / Codebase] ──► [Frontier LLM / Distilabel] ──► Raw Instruction Pairs (10k+)

2. QUALITY FILTERING (LLM-AS-A-JUDGE)
   Raw Instruction Pairs ──► [Rubric Scorer / De-duplication] ──► Curated Gold Dataset (2k-5k)

3. 4-BIT QLORA FINE-TUNING (UNSLOTH)
   Base Model (e.g. Qwen 2.5-Coder) + LoRA Adapters ──► SFT / DPO Training Loop

4. QUANTIZATION & LOCAL DEPLOYMENT
   Merged 16-bit Weights ──► [llama.cpp GGUF Export] ──► Local Ollama Service (<50ms latency)
```

### Core Implementation Guidelines

#### 1. Synthetic Instruction Generation & Rejection Sampling
Use frontier models to generate input-output pairs with strict rejection criteria:
```python
from pydantic import BaseModel, Field
from openai import OpenAI
import json

client = OpenAI()

class SyntheticInstructionPair(BaseModel):
    user_instruction: str = Field(description="Realistic developer query")
    input_context: str = Field(description="Code snippet or API contract")
    ground_truth_response: str = Field(description="Flawless, production-grade output")
    quality_score: int = Field(ge=1, le=5, description="Self-evaluated quality score")

def generate_synthetic_samples(seed_text: str) -> list[SyntheticInstructionPair]:
    # Availability Fallback Invariant: Gemini 4 Argon -> Gemini 3.8 Flash
    import os
    model_name = "gemini-4-argon" if os.getenv("FRONTIER_MODEL_AVAILABLE", "true") == "true" else "gemini-3.8-flash"
    try:
        response = client.beta.chat.completions.parse(
            model=model_name,
            messages=[
                {"role": "system", "content": "Generate 5 diverse, hard edge-case instruction pairs based on the seed code."},
                {"role": "user", "content": seed_text}
            ],
            response_format=SyntheticInstructionPair,
        )
    except Exception:
        response = client.beta.chat.completions.parse(
            model="gemini-3.8-flash",
            messages=[
                {"role": "system", "content": "Generate 5 diverse, hard edge-case instruction pairs based on the seed code."},
                {"role": "user", "content": seed_text}
            ],
            response_format=SyntheticInstructionPair,
        )
    # Filter out anything below score 4 (Rejection Sampling)
    return [sample for sample in [response.choices[0].message.parsed] if sample.quality_score >= 4]
```

#### 2. High-Speed 4-Bit QLoRA with Unsloth
Fine-tune on consumer GPUs (e.g., RTX 3090/4090 or single A10G) with 5x faster throughput:
```python
from unsloth import FastLanguageModel
import torch
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Load Model & Tokenizer in 4-bit
max_seq_length = 2048
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen2.5-Coder-7B-Instruct-bnb-4bit",
    max_seq_length=max_seq_length,
    load_in_4bit=True,
)

# 2. Add LoRA Adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0, # Optimized 0 dropout for Unsloth
    bias="none",
)

# 3. Supervised Fine-Tuning (SFT)
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=10,
        max_steps=100,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        output_dir="outputs",
    ),
)
trainer.train()
```

#### 3. GGUF Export for Local Ollama Deployment
Export merged model to 4-bit or 8-bit quantized GGUF format:
```python
# Save to 16bit or GGUF directly
model.save_pretrained_gguf("custom-domain-coder", tokenizer, quantization_method="q4_k_m")

# Generate Modelfile for Ollama:
# FROM ./custom-domain-coder-q4_k_m.gguf
# PARAMETER temperature 0.2
# SYSTEM You are an expert domain coder.
```

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec synthetic-data-finetuning-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **SLM Lokal & Kuantisasi**: `local-slm-edge-ai-expert`, `wasm-edge-computing-expert`
- **FinOps & Optimasi Biaya**: `llm-finops-router`, `adaptive-model-cascade`, `ai-llm-integration-expert`
- **Prompting & Evaluasi**: `ai-prompt-engineering-expert`, `structured-output-contracts`, `ai-safety-governance-expert`
- **Pipeline Python & Tools**: `python-programming-expert`, `data-pipeline-etl-expert`
- **Siklus Hidup & Tata Kelola**: `zero-to-prod-orchestrator`, `session-memory-manager`, `anti-slop`

### Deskripsi
Panduan produksi untuk menghasilkan dataset pelatihan sintetis, mengurasi pasangan instruksi bernilai tinggi, mengeksekusi Parameter-Efficient Fine-Tuning (QLoRA / LoRA) dengan **Unsloth** dan Hugging Face TRL, menerapkan Direct Preference Optimization (DPO), dan mengkuantisasi Small Language Models (SLM) kustom ke format GGUF untuk inferensi lokal atau on-premise berlatensi ultra-rendah.

**Sinergi Swarm:** Di dalam **AI Engineering Swarm**, skill ini memegang peranan sebagai Pemimpin Spesialisasi Model. Ketika biaya API atau latensi model cloud frontier terlalu tinggi, skill ini melatih, menyelaraskan (*align*), dan men-deploy SLM domain yang sangat efisien (1B–8B parameter) pada Fase 4.

### Kondisi Pemicu
- Menghasilkan data pelatihan sintetis spesifik domain dari dokumen panduan, codebase, atau skema API.
- Menyaring data sintetis berkualitas rendah menggunakan pipeline penilaian otomatis *LLM-as-a-judge*.
- Melakukan fine-tuning model berbobot terbuka (Llama 3.3, Qwen 2.5, Mistral) dengan QLoRA 4-bit secara hemat memori VRAM.
- Menyelaraskan respon model dengan Direct Preference Optimization (DPO) agar mematuhi aturan format dan gaya tertentu.
- Mengkuantisasi model hasil fine-tuning ke format GGUF (q4_k_m, q8_0) untuk inferensi lokal instan di Ollama atau llama.cpp.

---

### Implementasi Pola Kunci (Python)

#### 1. Fine-Tuning Cepat QLoRA 4-Bit dengan Unsloth
```python
from unsloth import FastLanguageModel
import torch
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Muat Model dan Tokenizer dalam mode 4-bit hemat VRAM
panjang_maksimum = 2048
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen2.5-Coder-7B-Instruct-bnb-4bit",
    max_seq_length=panjang_maksimum,
    load_in_4bit=True,
)

# 2. Pasang Adapter PEFT LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
)

# 3. Ekspor Langsung ke GGUF untuk Ollama Lokal
model.save_pretrained_gguf("model-koding-kustom", tokenizer, quantization_method="q4_k_m")
```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec synthetic-data-finetuning-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
