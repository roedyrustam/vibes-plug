#!/usr/bin/env node

/**
 * Vibes-Plug Local FinOps & Token Savings Tracker (2026 Edition)
 * 
 * Tracks token economics, KV-Cache prompt caching reuse, and calculates estimated
 * financial savings across Google Gemini 4 Pro / Flash (75% cache discount),
 * Anthropic Claude 5.1 / Sonnet (90% cache discount), and OpenAI o3 / GPT-5 (50% cache discount).
 * 
 * Zero external dependencies. Persists metrics locally to .agents/telemetry/finops_summary.json.
 * 
 * Usage:
 *   node scripts/finops-tracker.mjs [status]
 *   node scripts/finops-tracker.mjs record --model gemini-4-pro --input 4000 --output 1200 --cached 3200
 *   node scripts/finops-tracker.mjs reset
 *   vibes finops [status|record|reset]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const TELEMETRY_DIR = path.resolve(process.cwd(), '.agents', 'telemetry');
const TELEMETRY_FILE = path.join(TELEMETRY_DIR, 'finops_summary.json');

// Standard 2026 Frontier Pricing per 1M tokens ($USD)
const PRICING_PER_1M = {
  claude: {
    inputBase: 3.00,
    cachedRead: 0.30,   // 90% discount on prompt cache hits
    output: 15.00
  },
  gemini: {
    inputBase: 2.00,
    cachedRead: 0.50,   // 75% discount on prompt cache hits
    output: 8.00
  },
  openai: {
    inputBase: 2.50,
    cachedRead: 1.25,   // 50% discount on prompt cache hits
    output: 10.00
  }
};

function createDefaultData() {
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalRequests: 0,
    tokens: {
      inputTotal: 0,
      outputTotal: 0,
      cachedTotal: 0,
      grandTotal: 0
    },
    economics: {
      cacheHitRatio: '0.0%',
      claudeSavedUsd: '0.000',
      geminiSavedUsd: '0.000',
      openAiSavedUsd: '0.000',
      primaryEstSavedUsd: '0.000'
    },
    records: []
  };
}

/**
 * Loads current FinOps metrics
 * @returns {Promise<Object>}
 */
export async function loadFinOpsData() {
  try {
    const raw = await fs.readFile(TELEMETRY_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return createDefaultData();
  }
}

/**
 * Calculates prompt caching cost savings
 * @param {number} cachedTokens 
 * @returns {{ claudeSaved: number, geminiSaved: number, openAiSaved: number }}
 */
export function calculateSavings(cachedTokens) {
  const tokens = Number(cachedTokens) || 0;
  const claudeSaved = (tokens / 1_000_000) * (PRICING_PER_1M.claude.inputBase - PRICING_PER_1M.claude.cachedRead);
  const geminiSaved = (tokens / 1_000_000) * (PRICING_PER_1M.gemini.inputBase - PRICING_PER_1M.gemini.cachedRead);
  const openAiSaved = (tokens / 1_000_000) * (PRICING_PER_1M.openai.inputBase - PRICING_PER_1M.openai.cachedRead);

  return {
    claudeSaved: parseFloat(claudeSaved.toFixed(4)),
    geminiSaved: parseFloat(geminiSaved.toFixed(4)),
    openAiSaved: parseFloat(openAiSaved.toFixed(4))
  };
}

/**
 * Records a new token usage event
 * @param {Object} entry 
 * @returns {Promise<Object>}
 */
export async function recordFinOpsUsage(entry = {}) {
  const data = await loadFinOpsData();

  const input = Number(entry.inputTokens || entry.input || 0);
  const output = Number(entry.outputTokens || entry.output || 0);
  const cached = Number(entry.cachedTokens || entry.cached || 0);
  const model = String(entry.model || 'frontier-hybrid');
  const task = String(entry.task || 'Autonomous coding routine');

  data.totalRequests += 1;
  data.tokens.inputTotal += input;
  data.tokens.outputTotal += output;
  data.tokens.cachedTotal += cached;
  data.tokens.grandTotal += (input + output);

  const totalInputTokens = data.tokens.inputTotal + data.tokens.cachedTotal;
  const hitRatio = totalInputTokens > 0 
    ? ((data.tokens.cachedTotal / totalInputTokens) * 100).toFixed(1) + '%' 
    : '0.0%';
  data.economics.cacheHitRatio = hitRatio;

  const savings = calculateSavings(data.tokens.cachedTotal);
  data.economics.claudeSavedUsd = savings.claudeSaved.toFixed(3);
  data.economics.geminiSavedUsd = savings.geminiSaved.toFixed(3);
  data.economics.openAiSavedUsd = savings.openAiSaved.toFixed(3);
  data.economics.primaryEstSavedUsd = savings.claudeSaved.toFixed(3);
  data.lastUpdated = new Date().toISOString();

  // Keep last 50 records
  data.records.unshift({
    timestamp: new Date().toISOString(),
    model,
    task: task.slice(0, 80),
    input,
    output,
    cached
  });
  if (data.records.length > 50) {
    data.records = data.records.slice(0, 50);
  }

  await fs.mkdir(TELEMETRY_DIR, { recursive: true });
  await fs.writeFile(TELEMETRY_FILE, JSON.stringify(data, null, 2), 'utf8');

  return data;
}

/**
 * Resets telemetry data
 */
export async function resetFinOpsData() {
  const fresh = createDefaultData();
  await fs.mkdir(TELEMETRY_DIR, { recursive: true });
  await fs.writeFile(TELEMETRY_FILE, JSON.stringify(fresh, null, 2), 'utf8');
  return fresh;
}

/**
 * Generates formatted CLI summary report
 * @returns {Promise<string>}
 */
export async function getFinOpsReport() {
  const data = await loadFinOpsData();
  const t = data.tokens;
  const e = data.economics;

  return `
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Local FinOps & Token Savings Tracker       ║
╚══════════════════════════════════════════════════════════╝

📊 Token Consumption:
  • Total Model Invocations : ${data.totalRequests}
  • Total Input Tokens      : ${t.inputTotal.toLocaleString()}
  • Total Output Tokens     : ${t.outputTotal.toLocaleString()}
  • Reused / Cached Tokens  : ${t.cachedTotal.toLocaleString()}
  • Cache Hit Efficiency    : ${e.cacheHitRatio}

💰 Estimated Financial Savings (KV-Cache Optimization):
  • Anthropic Claude (90% off) : $${e.claudeSavedUsd} USD saved
  • Google Gemini (75% off)    : $${e.geminiSavedUsd} USD saved
  • OpenAI GPT-5/o3 (50% off)  : $${e.openAiSavedUsd} USD saved

📁 Telemetry Storage: .agents/telemetry/finops_summary.json
🕒 Last Updated     : ${data.lastUpdated}
`;
}

/**
 * Exports FinOps report to Markdown, CSV, or JSON format
 * @param {'markdown'|'csv'|'json'} format 
 * @returns {Promise<string>}
 */
export async function exportFinOpsReport(format = 'markdown') {
  const data = await loadFinOpsData();
  const t = data.tokens;
  const e = data.economics;

  if (format === 'csv') {
    const headers = 'timestamp,model,task,input_tokens,output_tokens,cached_tokens,est_claude_savings_usd';
    const rows = (data.records || []).map(r => {
      const savings = calculateSavings(r.cached || 0).claudeSaved;
      const safeTask = `"${(r.task || '').replace(/"/g, '""')}"`;
      return `${r.timestamp || ''},${r.model || ''},${safeTask},${r.input || 0},${r.output || 0},${r.cached || 0},${savings}`;
    });
    return [headers, ...rows].join('\n');
  }

  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // Default: Markdown table report
  const recordRows = (data.records || []).slice(0, 10).map(r => 
    `| ${r.timestamp ? r.timestamp.slice(11, 19) : '-'} | \`${r.model || '-'}\` | ${r.task || '-'} | ${r.input || 0} | ${r.output || 0} | ${r.cached || 0} |`
  ).join('\n');

  return `# 📊 Vibes-Plug FinOps & Token Economics Report

*Generated on ${new Date().toISOString()}*

## ⚡ Executive Token Economics
| Metric | Value |
| :--- | :--- |
| **Total Model Invocations** | \`${data.totalRequests}\` |
| **Total Input Tokens** | \`${t.inputTotal.toLocaleString()}\` |
| **Total Output Tokens** | \`${t.outputTotal.toLocaleString()}\` |
| **Reused / Cached Tokens** | \`${t.cachedTotal.toLocaleString()}\` |
| **KV-Cache Hit Ratio** | **\`${e.cacheHitRatio}\`** |

## 💰 Estimated Cost Reductions (KV-Cache Reuse)
| Provider / Model Family | Cache Discount | Estimated Savings (USD) |
| :--- | :---: | :---: |
| **Anthropic Claude (Sonnet / 5.1)** | 90% | **$${e.claudeSavedUsd}** |
| **Google Gemini (4 Pro / Flash)** | 75% | **$${e.geminiSavedUsd}** |
| **OpenAI (o3 / GPT-5)** | 50% | **$${e.openAiSavedUsd}** |

## 🕒 Recent Invocation History (Last 10 turns)
| Timestamp | Model | Task | Input | Output | Cached |
| :--- | :--- | :--- | :---: | :---: | :---: |
${recordRows || '| - | - | No records yet | - | - | - |'}
`;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  if (command === 'reset') {
    await resetFinOpsData();
    console.log('✅ FinOps telemetry has been reset to zero.');
    return;
  }

  if (command === 'export') {
    let format = 'markdown';
    let outputFile = null;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--format' && args[i + 1]) format = args[++i];
      else if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) outputFile = args[++i];
    }
    const reportText = await exportFinOpsReport(format);
    if (outputFile) {
      const resolved = path.resolve(process.cwd(), outputFile);
      await fs.mkdir(path.dirname(resolved), { recursive: true });
      await fs.writeFile(resolved, reportText, 'utf8');
      console.log(`✅ FinOps report exported to: ${resolved}`);
    } else {
      console.log(reportText);
    }
    return;
  }

  if (command === 'record') {
    let model = 'frontier-hybrid';
    let input = 0;
    let output = 0;
    let cached = 0;
    let task = 'Coding turn';

    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--model' && args[i + 1]) model = args[++i];
      else if (args[i] === '--input' && args[i + 1]) input = parseInt(args[++i], 10) || 0;
      else if (args[i] === '--output' && args[i + 1]) output = parseInt(args[++i], 10) || 0;
      else if (args[i] === '--cached' && args[i + 1]) cached = parseInt(args[++i], 10) || 0;
      else if (args[i] === '--task' && args[i + 1]) task = args[++i];
    }

    const updated = await recordFinOpsUsage({ model, input, output, cached, task });
    console.log(`✅ Recorded usage: +${input} in, +${output} out, +${cached} cached tokens.`);
    console.log(`   New Cache Hit Ratio: ${updated.economics.cacheHitRatio} (Est. Claude Savings: $${updated.economics.claudeSavedUsd})`);
    return;
  }

  const report = await getFinOpsReport();
  console.log(report);
}

if (process.argv[1] && process.argv[1].endsWith('finops-tracker.mjs')) {
  main().catch(err => {
    console.error(`\n❌ FinOps Error: ${err.message}`);
    process.exit(1);
  });
}
