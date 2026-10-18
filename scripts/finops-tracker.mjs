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

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  if (command === 'reset') {
    await resetFinOpsData();
    console.log('✅ FinOps telemetry has been reset to zero.');
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
