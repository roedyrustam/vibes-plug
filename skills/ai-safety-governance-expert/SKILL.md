---
name: ai-safety-governance-expert
description: "Expert guide for AI Safety, Governance, and Responsible AI in production — Constitutional AI enforcement, runtime guardrails (NeMo Guardrails 2.0, Llama Guard 3), bias auditing, hallucination detection, EU AI Act compliance, model cards, and content provenance / Panduan ahli untuk Keamanan AI, Tata Kelola, dan AI Bertanggung Jawab di produksi."
author: "Roedy Rustam"
version: "4.4.2"

---

# AI Safety, Governance, and Responsible AI Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **Prompt Defense & Firewalls**: `prompt-injection-firewall`, `ai-prompt-engineering-expert`
- **Red Teaming & Security**: `autonomous-red-teamer`, `zero-trust-secret-vault`
- **Compliance & Privacy**: `compliance-gdpr-privacy-expert`, `formal-spec-z3-verifier`
- **Model Evaluation & Memory**: `ai-llm-integration-expert`, `session-memory-manager`, `agentic-memory-architect`
- **Lifecycle & Hardening**: `zero-to-prod-orchestrator`, `production-ready-hardener`, `anti-slop`, `brainstorming`

### 1. Constitutional AI Enforcement
Define constitutional rules as structured guardrails for all AI operations. Implement policies at multiple interception points: pre-generation, post-generation, and retrieval.

### Principles & Configuration
- Embed constitution directly into system prompts.
- Implement explicit Colang 2.0 flows for conversational state management.
- Abort sequences when user prompts violate strict constitutional principles.

```yaml
# NeMo Guardrails configuration example (config.yml)
models:
  - type: main
    engine: google
    model: gemini-4-argon # Availability Fallback: degrades to gemini-3.8-flash
  - type: fallback
    engine: google
    model: gemini-3.8-flash

rails:
  input:
    flows:
      - check_jailbreak
      - check_topic_restriction
  output:
    flows:
      - check_hallucination
      - check_toxicity

instructions:
  - type: general
    content: |
      You are a helpful, respectful, and honest assistant.
      Always prioritize safety, avoid giving harmful advice, and maintain neutrality.
```

## 2. Runtime Safety Guardrails / Pembatasan Keamanan Saat Berjalan

Implement layered defense mechanisms to intercept unsafe input and redact sensitive output. Utilize state-of-the-art moderation models such as Llama Guard 3.

### Layered Defense Architecture
1. **System Prompt**: Set boundaries and behavior guidelines.
2. **Input Filter**: Scan for prompt injection, jailbreaks, and restricted topics (PII, hate speech).
3. **Model Generation**: Generate response using the core LLM.
4. **Output Filter**: Redact PII, filter toxicity, and enforce factuality checking.
5. **Delivery**: Send safe response to the user.

```typescript
// Multi-layer guardrail pipeline in TypeScript
import { LlamaGuard } from '@safety/llama-guard';
import { PIIRedactor } from '@safety/redactor';
import { LLMService } from './llm';

export async function generateSafeResponse(prompt: string): Promise<string> {
  // Layer 2: Input Guardrail
  const inputCheck = await LlamaGuard.checkPrompt(prompt);
  if (!inputCheck.isSafe) {
    throw new Error(`Unsafe prompt detected: ${inputCheck.violationCategory}`);
  }

  // Layer 3: Model Generation
  const rawResponse = await LLMService.generate(prompt);

  // Layer 4: Output Guardrails
  const outputCheck = await LlamaGuard.checkResponse(prompt, rawResponse);
  if (!outputCheck.isSafe) {
    throw new Error('Unsafe response blocked by output guardrails.');
  }

  const redactedResponse = PIIRedactor.redact(rawResponse);
  
  // Layer 5: Delivery
  return redactedResponse;
}
```

## 3. Hallucination Detection & Grounding / Deteksi Halusinasi & Grounding

Employ grounding techniques and retrieval-augmented verification to minimize hallucinations. Implement real-time factuality metrics on generated text.

### Citation Verification Pipeline
- **Claim Extraction**: Extract factual claims from the response.
- **Source Matching**: Retrieve grounding documents for each claim.
- **Confidence Scoring**: Calculate factuality using NLI (Natural Language Inference) models.

```python
# Hallucination detection with SelfCheckGPT principles
from selfcheckgpt.modeling_selfcheck import SelfCheckNLI
import spacy

nlp = spacy.load("en_core_web_sm")
selfcheck_nli = SelfCheckNLI(device="cpu") # use cuda if available

def detect_hallucination(response_text, context_documents):
    sentences = [sent.text for sent in nlp(response_text).sents]
    
    # Calculate NLI scores against provided context
    nli_scores = selfcheck_nli.predict(
        sentences=sentences,
        sampled_passages=[context_documents] * len(sentences)
    )
    
    threshold = 0.85
    hallucinated_sentences = [
        sentences[i] for i, score in enumerate(nli_scores) if score < threshold
    ]
    
    return {
        "is_grounded": len(hallucinated_sentences) == 0,
        "hallucinations": hallucinated_sentences
    }
```

## 4. Automated Bias Auditing / Audit Bias Otomatis

Continuously monitor AI systems for demographic parity, equal opportunity, and equalized odds.

### Audit Pipeline
1. **Test Suite**: Run standardized prompts targeting various demographics.
2. **Metric Collection**: Evaluate embeddings and outputs for representational and allocative harms.
3. **Report**: Aggregate fairness metrics into actionable dashboards.
4. **Remediation**: Apply fairness constraints during fine-tuning.

```python
# Bias audit script using fairlearn
from fairlearn.metrics import demographic_parity_difference
from sklearn.metrics import accuracy_score
import pandas as pd

def audit_model_fairness(predictions, true_labels, sensitive_features):
    df = pd.DataFrame({
        'y_true': true_labels,
        'y_pred': predictions,
        'sensitive_feature': sensitive_features
    })
    
    dp_diff = demographic_parity_difference(
        y_true=df['y_true'], 
        y_pred=df['y_pred'], 
        sensitive_features=df['sensitive_feature']
    )
    
    overall_accuracy = accuracy_score(df['y_true'], df['y_pred'])
    
    print(f"Demographic Parity Difference: {dp_diff:.4f}")
    print(f"Overall Accuracy: {overall_accuracy:.4f}")
    
    if dp_diff > 0.1:
        print("WARNING: Significant demographic parity violation detected.")
```

## 5. AI Model Cards & Documentation / Kartu Model & Dokumentasi AI

Maintain standardized Model Cards for transparency and accountability, automatically generated from evaluation results.

### Required Model Card Sections
- **Intended Use**: Primary use cases and out-of-scope applications.
- **Limitations**: Known failure modes and biases.
- **Training Data**: Overview of pre-training and fine-tuning datasets, including opt-out mechanisms.
- **Performance Metrics**: Standardized benchmark scores (MMLU, HumanEval) and fairness metrics.
- **Ethical Considerations**: Mitigation strategies for potential harms.

## 6. AI Compliance Matrix / Matriks Kepatuhan AI

Map AI deployments against global regulatory frameworks. Implement automated risk classification checks.

### Frameworks & Controls
- **EU AI Act**: Classify systems as Unacceptable (prohibited), High Risk (strict requirements), Limited (transparency required), or Minimal.
- **NIST AI RMF**: Implement Govern, Map, Measure, and Manage functions.
- **GDPR Article 22**: Ensure human-in-the-loop (HITL) for automated decision-making.
- **SOC2**: Implement AI-specific data isolation and auditing controls.

```python
# Risk classification decision tree
def classify_eu_ai_act_risk(system_purpose, employs_biometrics, affects_safety):
    if system_purpose in ["social_scoring", "subliminal_manipulation"]:
        return "UNACCEPTABLE_RISK"
    
    if employs_biometrics or affects_safety or system_purpose in ["employment", "education", "credit_scoring"]:
        return "HIGH_RISK"
        
    if system_purpose in ["chatbot", "deepfake", "emotion_recognition"]:
        return "LIMITED_RISK"
        
    return "MINIMAL_RISK"
```

## 7. Content Provenance & Watermarking / Asal Konten & Watermarking

Ensure transparency in AI-generated outputs by embedding provenance data.

### Implementation Strategies
- **C2PA Credentials**: Attach cryptographic content credentials to AI-generated images and audio.
- **Invisible Text Watermarking**: Alter token probabilities during generation (e.g., SynthID text) to embed a detectable signature.
- **Clear Disclosures**: Always present visible labels indicating content is AI-generated, especially for synthetic media and bots.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **Pertahanan Prompt & Firewall**: `prompt-injection-firewall`, `ai-prompt-engineering-expert`
- **Red Teaming & Keamanan**: `autonomous-red-teamer`, `zero-trust-secret-vault`
- **Kepatuhan & Privasi**: `compliance-gdpr-privacy-expert`, `formal-spec-z3-verifier`
- **Evaluasi Model & Memori**: `ai-llm-integration-expert`, `session-memory-manager`, `agentic-memory-architect`
- **Siklus Hidup & Pengerasan**: `zero-to-prod-orchestrator`, `production-ready-hardener`, `anti-slop`, `brainstorming`

### Deskripsi
Panduan komprehensif tingkat produksi untuk Keamanan AI, Tata Kelola (*Governance*), dan AI Bertanggung Jawab (*Responsible AI*). Menerapkan penegakan AI Konstitusional, pengamanan waktu jalan (*runtime guardrails* via NeMo Guardrails dan Llama Guard), audit bias otomatis, deteksi halusinasi, kepatuhan regulasi EU AI Act / NIST RMF, kartu model terstandarisasi, dan tanda air bukti asal konten (C2PA / SynthID).

### 7 Pilar Tata Kelola AI Produksi
1. **Penegakan AI Konstitusional**: Definisikan aturan konstitusi sebagai guardrail terstruktur untuk seluruh operasi AI pada tahap pra-generasi, pasca-generasi, dan retrieval.
2. **Runtime Safety Guardrails**: Terapkan pertahanan berlapis (filter input jailbreak/injeksi prompt, mitigasi toksisitas, dan redaksi PII).
3. **Deteksi Halusinasi**: Hitung skor faktualitas menggunakan model Natural Language Inference (NLI) dan verifikasi bukti rujukan konteks.
4. **Audit Bias Otomatis**: Pantau perbedaan paritas demografis (*demographic parity difference*) dan metrik keadilan secara berkala.
5. **Kartu Model AI (Model Cards)**: Dokumentasikan batasan model, kasus penggunaan yang sah, dataset pelatihan, dan metrik etika secara transparan.
6. **Matriks Kepatuhan Global**: Klasifikasikan tingkat risiko sistem AI berdasarkan kerangka regulasi EU AI Act (Risiko Tidak Diterima, Tinggi, Terbatas, Minimal), NIST AI RMF, dan Pasal 22 GDPR.
7. **Asal Konten & Watermarking**: Sematkan kredensial kriptografis C2PA pada media sintetis dan terapkan penandaan SynthID agar keluaran AI transparan serta dapat diaudit.
