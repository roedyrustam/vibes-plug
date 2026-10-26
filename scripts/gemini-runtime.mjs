#!/usr/bin/env node

/**
 * Vibes-Plug Native Gemini 4.x / 3.8 Flash Accelerator Runtime
 *
 * Implements:
 * 1. Monolithic Repository Context Ingestion (1M-2M+ tokens)
 * 2. Deterministic Context Caching Preparation & REST/SDK Client API (`cachedContent`)
 * 3. Dynamic System-2 Thinking Budget Controller (`thinkingConfig.thinkingBudget`)
 * 4. Model Cascading & Fallback Invariant (Gemini 4 Pro -> Gemini 3.8 Flash)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeTaskComplexity } from './token-budget-optimizer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

const DEFAULT_IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '.turbo',
  'coverage', '.vscode', '.idea', 'assets', '.npm'
]);

const TEXT_EXTENSIONS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json', '.md',
  '.sql', '.py', '.go', '.rs', '.html', '.css', '.scss', '.yaml', '.yml'
]);

/**
 * Scans a directory recursively collecting text file contents
 */
export async function collectRepositoryContext(rootDir = process.cwd(), maxSizeBytes = 25 * 1024 * 1024) {
  const fileEntries = [];
  let totalBytes = 0;

  async function walk(currentDir) {
    let dirents;
    try {
      dirents = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    // Deterministic canonical sort
    dirents.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of dirents) {
      if (entry.name.startsWith('.') && entry.name !== '.cursorrules' && entry.name !== '.env.example') {
        if (entry.isDirectory()) continue;
      }
      if (DEFAULT_IGNORE.has(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (TEXT_EXTENSIONS.has(ext)) {
          try {
            const stat = await fs.stat(fullPath);
            if (stat.size > 1024 * 1024) continue; // Skip single files > 1MB
            if (totalBytes + stat.size > maxSizeBytes) break;

            const content = await fs.readFile(fullPath, 'utf8');
            const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
            fileEntries.push({ path: relPath, size: stat.size, content });
            totalBytes += stat.size;
          } catch {
            // Skip unreadable files
          }
        }
      }
    }
  }

  await walk(rootDir);
  return { files: fileEntries, totalBytes, fileCount: fileEntries.length };
}

/**
 * Assembles a monolithic codebase dump formatted for Gemini Context Caching
 */
export function formatMonolithicDump(files = [], metadata = {}) {
  const parts = [];
  parts.push(`--- REPOSITORY SNAPSHOT FOR GEMINI MONOLITHIC CONTEXT ---`);
  parts.push(`Generated: ${new Date().toISOString()}`);
  parts.push(`Files Count: ${files.length}`);
  if (metadata.title) parts.push(`Project: ${metadata.title}`);
  parts.push('---------------------------------------------------------');

  for (const file of files) {
    parts.push(`\n=== FILE: ${file.path} (${file.size} bytes) ===`);
    parts.push(file.content);
  }

  return parts.join('\n');
}

/**
 * Prepares the payload for Google GenAI Context Caching API
 * @param {Object} options
 */
export async function prepareGeminiCachePayload(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const model = options.model || 'models/gemini-4-pro';
  const ttlSeconds = options.ttlSeconds || 7200;
  const projectTitle = options.projectTitle || path.basename(rootDir);

  const { files, totalBytes, fileCount } = await collectRepositoryContext(rootDir);
  const monolithicText = formatMonolithicDump(files, { title: projectTitle });

  // Rough estimation: 1 token ~ 4 chars for code
  const estimatedTokens = Math.ceil(monolithicText.length / 3.8);
  const meetsMinThreshold = estimatedTokens >= 32768;

  const payload = {
    model,
    displayName: `vibes-cache-${projectTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`,
    ttl: `${ttlSeconds}s`,
    contents: [
      {
        role: 'user',
        parts: [{ text: monolithicText }]
      }
    ]
  };

  return {
    success: true,
    rootDir,
    fileCount,
    totalBytes,
    estimatedTokens,
    meetsMinThreshold,
    ttlSeconds,
    model,
    cachePayload: payload,
    sdkExample: `// Google GenAI SDK (@google/genai) Example:
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cache = await ai.caches.create({
  model: '${model}',
  contents: [{ role: 'user', parts: [{ text: monolithicDump }] }],
  ttl: '${ttlSeconds}s',
});

const res = await ai.models.generateContent({
  model: '${model}',
  contents: [{ role: 'user', parts: [{ text: 'Your task here' }] }],
  cachedContent: cache.name,
});`
  };
}

/**
 * Calibrates Gemini Thinking Config based on task complexity
 */
export async function getGeminiThinkingConfig(taskInput = '') {
  const budgetResult = await analyzeTaskComplexity(taskInput);
  const score = budgetResult.compositeScore ?? budgetResult.complexityScore ?? 0;
  const tier = budgetResult.tier;

  let thinkingBudget = 0;
  let targetModel = 'models/gemini-3.8-flash';
  let mode = 'flash';

  if (score >= 81) {
    thinkingBudget = 65536; // Max System-2 Thinking
    targetModel = 'models/gemini-4-pro';
    mode = 'deep-reasoning';
  } else if (score >= 56) {
    thinkingBudget = 32768;
    targetModel = 'models/gemini-4-pro';
    mode = 'architectural';
  } else if (score >= 26) {
    thinkingBudget = 8192;
    targetModel = 'models/gemini-4-argon';
    mode = 'balanced';
  } else {
    thinkingBudget = 2048;
    targetModel = 'models/gemini-3.8-flash';
    mode = 'fast-iteration';
  }

  const thinkingConfig = {
    thinkingConfig: {
      thinkingBudget
    }
  };

  return {
    task: budgetResult.task || taskInput,
    complexityScore: score,
    tier,
    mode,
    targetModel,
    fallbackModel: 'models/gemini-3.8-flash',
    thinkingBudget,
    thinkingConfig,
    sdkConfigSnippet: {
      model: targetModel,
      config: thinkingConfig
    }
  };
}

// CLI Execution if called directly
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = process.argv.slice(2);
  const subCmd = args[0] || 'cache';

  if (subCmd === 'budget') {
    const taskInput = args[1] || 'Default architecture audit task';
    getGeminiThinkingConfig(taskInput).then(result => {
      if (args.includes('--json')) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n🚀 === Vibes-Plug Gemini Dynamic Thinking Config ===');
        console.log(`Task        : ${result.task}`);
        console.log(`Score       : ${result.complexityScore}/100 (${result.tier})`);
        console.log(`Mode        : ${result.mode}`);
        console.log(`Target Model: \x1b[36m${result.targetModel}\x1b[0m`);
        console.log(`Fallback    : ${result.fallbackModel}`);
        console.log(`Thinking    : \x1b[32m${result.thinkingBudget} tokens\x1b[0m`);
        console.log('\nGoogle GenAI Config:');
        console.log(JSON.stringify(result.thinkingConfig, null, 2));
      }
    });
  } else {
    // cache command
    const targetDir = args[1] && !args[1].startsWith('--') ? path.resolve(args[1]) : process.cwd();
    prepareGeminiCachePayload({ rootDir: targetDir }).then(res => {
      if (args.includes('--json')) {
        console.log(JSON.stringify(res, null, 2));
      } else {
        console.log('\n⚡ === Vibes-Plug Gemini Context Cache Accelerator ===');
        console.log(`Target Dir  : ${res.rootDir}`);
        console.log(`Scanned     : ${res.fileCount} files (${(res.totalBytes / 1024).toFixed(1)} KB)`);
        console.log(`Est. Tokens : ~${res.estimatedTokens.toLocaleString()} tokens`);
        console.log(`Cache Status: ${res.meetsMinThreshold ? '\x1b[32mQUALIFIED (>32,768 tokens)\x1b[0m' : '\x1b[33mBELOW 32K THRESHOLD (Direct Ingestion OK)\x1b[0m'}`);
        console.log(`TTL         : ${res.ttlSeconds}s`);
        console.log(`Target Model: \x1b[36m${res.model}\x1b[0m`);
        console.log('\nSample Integration Snippet:');
        console.log(res.sdkExample);
      }
    }).catch(err => {
      console.error('Error preparing cache:', err.message);
      process.exit(1);
    });
  }
}
