#!/usr/bin/env node

/**
 * Vibes-Plug Autonomous Critic-Validator Engine (Epoch 3)
 * 
 * Implements Pilar 5: MCP Sampling & Critic-in-the-Loop Quality Gate.
 * Enforces the 7 Pillars of Sovereign Anti-Slop, 5-state UI contracts,
 * OWASP security guardrails, and provides MCP Sampling payloads
 * for host LLM review before disk persistence.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

export function criticValidate(target, options = {}) {
  const code = String(target || '');
  const lang = (options.language || 'general').toLowerCase();
  const strictness = (options.strictness || 'standard').toLowerCase();

  let score = 100;
  const violations = [];
  const suggestions = [];

  // 1. Anti-Slop Directive Checks (Pillar 1 - 7)
  const lines = code.split('\n');
  let hasTodo = false;
  let hasTruncation = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/(?:^|\s)\/\/\s*TODO\b/i.test(trimmed) || /\/\*\s*TODO\b/i.test(trimmed)) {
      if (!/['"`].*\/\/\s*TODO.*['"`]/.test(trimmed)) {
        hasTodo = true;
      }
    }
    if (/(?:^|\s)\/\/\s*\.\.\./.test(trimmed) || /\/\*\s*\.\.\.\s*\*\//.test(trimmed) || /\/\/\s*rest of code/i.test(trimmed)) {
      if (!/['"`].*\/\/\s*\.\.\..*['"`]/.test(trimmed)) {
        hasTruncation = true;
      }
    }
  }

  if (hasTodo) {
    score -= 15;
    violations.push({
      rule: 'R-02 (Anti-Slop)',
      severity: 'ERROR',
      message: "Placeholder comment '// TODO' detected. All code must be 100% complete."
    });
    suggestions.push("Implement the complete logic or delete the TODO marker.");
  }

  if (hasTruncation) {
    score -= 20;
    violations.push({
      rule: 'R-02 (Anti-Slop)',
      severity: 'CRITICAL',
      message: "Code truncation detected ('// ...' or '// rest of code'). Production code must never be truncated."
    });
    suggestions.push("Provide the complete, untruncated implementation on the first try.");
  }

  if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(code)) {
    score -= 20;
    violations.push({
      rule: 'R-05 (Anti-Slop / Security)',
      severity: 'CRITICAL',
      message: "Silent empty catch block detected. Error swallowing is prohibited."
    });
    suggestions.push("Log the error or rethrow with structured context: 'logger.error(err); throw err;'");
  }

  // 2. UI Craft & 5-State Interactive Contract
  const isUiCode = lang.includes('react') || lang.includes('html') || lang.includes('vue') || /<button|<Button|<a\s|<Input/.test(code);
  if (isUiCode) {
    if (/rounded-full(?!\s+w-\d+\s+h-\d+)/.test(code) && /<button|<Button/.test(code)) {
      score -= 10;
      violations.push({
        rule: 'R-07 (UI Craft)',
        severity: 'WARNING',
        message: "Pill-button addiction detected ('rounded-full' on standard rectangular button)."
      });
      suggestions.push("Use modern crisp border radius: 'rounded-md' or 'rounded-lg' with 1px border.");
    }

    const hasHover = /hover:/.test(code) || /:hover\b/.test(code);
    const hasFocus = /focus-visible:|focus:/.test(code) || /:focus-visible\b/.test(code);
    const hasDisabled = /disabled:/.test(code) || /:disabled\b/.test(code) || /disabled=\{/.test(code);

    if (strictness !== 'standard' && (!hasHover || !hasFocus || !hasDisabled)) {
      score -= 10;
      violations.push({
        rule: 'R-07 (5-State Contract)',
        severity: 'WARNING',
        message: "Incomplete 5-state interactive contract (missing hover, focus-visible, or disabled state)."
      });
      suggestions.push("Ensure all 5 states are declared: default, hover, focus-visible, active, disabled.");
    }
  }

  // 3. Security & OWASP Guardrails
  if (/dangerouslySetInnerHTML\s*=|innerHTML\s*=/.test(code)) {
    score -= 25;
    violations.push({
      rule: 'SEC-01 (XSS Risk)',
      severity: 'CRITICAL',
      message: "Direct DOM HTML injection sink detected ('dangerouslySetInnerHTML' or 'innerHTML')."
    });
    suggestions.push("Sanitize input using DOMPurify or use typed JSX text rendering.");
  }

  if (/SELECT\s+.*\s+FROM\s+.*\s*\+\s*['"]/.test(code) || /SELECT\s+.*\s+FROM\s+.*\$\{/.test(code)) {
    score -= 25;
    violations.push({
      rule: 'SEC-02 (SQL Injection Risk)',
      severity: 'CRITICAL',
      message: "Unparameterized dynamic SQL concatenation detected."
    });
    suggestions.push("Use parameterized queries ($1, $2) or type-safe ORM query builders (Prisma/Drizzle).");
  }

  // 4. Type Strictness (TS)
  if (lang.includes('typescript') || lang === 'ts' || lang === 'tsx') {
    if (/:\s*any\b|as\s+any\b/.test(code)) {
      score -= 15;
      violations.push({
        rule: 'TS-01 (Type Safety)',
        severity: 'ERROR',
        message: "Permissive ': any' or 'as any' detected. Strict typing required."
      });
      suggestions.push("Replace 'any' with 'unknown', generics, or branded type contracts.");
    }
  }

  // Clamp score
  if (score < 0) score = 0;

  let verdict = 'APPROVED';
  if (score < 75) {
    verdict = 'REJECTED_WITH_FEEDBACK';
  } else if (score < 90) {
    verdict = 'APPROVED_WITH_WARNINGS';
  }

  return {
    score,
    verdict,
    violationsCount: violations.length,
    violations,
    suggestions,
    passedGate: verdict !== 'REJECTED_WITH_FEEDBACK',
    timestamp: new Date().toISOString()
  };
}

/**
 * Formats a standard MCP Sampling request for host LLM review
 */
export function formatSamplingRequest(target, options = {}) {
  const prompt = options.prompt || 'Review this code for anti-slop violations, security issues, and type correctness:';
  return {
    method: 'sampling/createMessage',
    params: {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `${prompt}\n\n\`\`\`${options.language || ''}\n${target}\n\`\`\``
          }
        }
      ],
      maxTokens: 2048,
      temperature: 0.1,
      systemPrompt: 'You are the Vibes-Plug Sovereign Critic Validator. Audit the submitted artifact against: 7 Anti-Slop Pillars, OWASP Top 10, 5-state UI contracts, and type safety invariants. Return verdict: APPROVED or REJECTED with specific line fixes.'
    }
  };
}

async function main() {
  const args = process.argv.slice(2);
  const targetFile = args[0];

  if (!targetFile) {
    console.log(`
Usage:
  vibes critic <file-path> [--strictness standard|hardcore|production-release]
`);
    process.exit(1);
  }

  try {
    const content = await fs.readFile(path.resolve(process.cwd(), targetFile), 'utf8');
    const ext = path.extname(targetFile).replace('.', '');
    const report = criticValidate(content, { language: ext });

    console.log(`
╔══════════════════════════════════════════════════════════╗
║    Vibes-Plug Critic-Validator Report                    ║
╚══════════════════════════════════════════════════════════╝

📄 File     : ${targetFile}
📊 Score    : ${report.score}/100
🛡️ Verdict  : ${report.verdict}
⚠️ Issues   : ${report.violationsCount}
`);

    if (report.violations.length > 0) {
      console.log('Violations Detected:');
      report.violations.forEach(v => {
        console.log(`  • [${v.severity}] ${v.rule}: ${v.message}`);
      });
    }

    if (report.suggestions.length > 0) {
      console.log('\nActionable Suggestions:');
      report.suggestions.forEach(s => {
        console.log(`  💡 ${s}`);
      });
    }

    console.log('');
    process.exit(report.passedGate ? 0 : 1);
  } catch (err) {
    console.error(`❌ Error reading target file: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('critic-validator.mjs')) {
  main();
}
