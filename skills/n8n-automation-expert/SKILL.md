---
name: n8n-automation-expert
description: "Expert guide for workflow automation (n8n, Zapier, Make), custom nodes, webhook triggers, and AI-powered automation chains / Panduan ahli otomasi workflow (n8n, Zapier, Make), custom nodes, webhook triggers, dan rantai otomasi berbasis AI."
author: "vibes-plug-swarm"
---

# Workflow Automation Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`cron-scheduler-expert`**: Scheduled triggers for automation workflows.
- **`ai-llm-integration-expert`**: AI-powered automation steps and LLM chains.
- **`email-notification-expert`**: Email triggers and notification actions.
- **`webhook-receiver`**: Webhook endpoints as automation triggers.

### Description
Expert guide for building automation workflows with n8n (self-hosted, open-source), Zapier, and Make (Integromat). Covers workflow design, custom n8n nodes, webhook triggers, AI chains within workflows, error handling, credential management, and integration patterns with databases, APIs, and messaging platforms.

### Trigger Conditions
- Building automated workflows connecting multiple services.
- Setting up n8n for self-hosted automation.
- Creating AI-powered automation pipelines.
- Integrating no-code/low-code automation with custom applications.

---

### Platform Selection

| Platform | Hosting | Custom Code | AI Support | Pricing | Best For |
|----------|---------|-------------|------------|---------|----------|
| n8n | Self-hosted/Cloud | ✅ Full | ✅ AI nodes | Free (self) | Developers, privacy |
| Zapier | Cloud only | Limited | ✅ AI actions | $29+/mo | Non-technical teams |
| Make | Cloud only | ✅ Modules | ✅ AI modules | $10+/mo | Visual workflows |

**Recommendation:** Use **n8n** for developer teams needing full control and self-hosting. Use **Zapier** for simple integrations by non-technical users.

### n8n Core Patterns

```typescript
// Custom n8n node — AI Content Processor
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class AiContentProcessor implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AI Content Processor',
    name: 'aiContentProcessor',
    group: ['transform'],
    version: 1,
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      { displayName: 'Prompt Template', name: 'prompt', type: 'string', default: '' },
      { displayName: 'Model', name: 'model', type: 'options', options: [
        { name: 'GPT-4o', value: 'gpt-4o' },
        { name: 'Claude 4 Sonnet', value: 'claude-4-sonnet' },
      ], default: 'gpt-4o' },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const prompt = this.getNodeParameter('prompt', 0) as string;
    // Process each item with AI...
    return [items];
  }
}
```

## Orchestration & Integration
- `cron-scheduler-expert`, `ai-llm-integration-expert`, `webhook-receiver`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk membangun alur kerja otomatis dengan n8n, Zapier, dan Make. Mencakup desain workflow, custom nodes n8n, webhook triggers, rantai AI, dan integrasi dengan database dan API.

### Kondisi Pemicu
- Membangun alur kerja otomatis yang menghubungkan beberapa layanan.
- Menyiapkan n8n untuk otomasi self-hosted.
- Membuat pipeline otomasi berbasis AI.
