#!/usr/bin/env node
/**
 * scripts/check-anti-slop.mjs
 * Automated Anti-AI Slop Validator for vibes-plug & user codebases.
 */

import fs from 'fs';
import path from 'path';

const SLOP_PATTERNS = [
  { name: 'Lazy Truncation Placeholder', regex: /\/\/\s*\.\.\.\s*(rest|code|implement|logic)/i },
  { name: 'Unfinished TODO Stub', regex: /\/\/\s*TODO:\s*(implement|add logic|fill in|later)/i },
  { name: 'Mock Data in Production', regex: /\/\/\s*mock data for now/i },
  { name: 'Syntax Narration Comment', regex: /\/\/\s*(increment\s+\w+|return\s+(the\s+)?\w+|import\s+\w+\s+from)/i },
];

const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'artifacts', '.gemini'];

let slopCount = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(ts|tsx|js|jsx|mjs|py|go|rs)$/.test(file) && !file.includes('check-anti-slop')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        SLOP_PATTERNS.forEach(({ name, regex }) => {
          if (regex.test(line)) {
            console.error(`🚨 [AI SLOP DETECTED] ${fullPath}:${index + 1} (${name}) -> ${line.trim()}`);
            slopCount++;
          }
        });
      });
    }
  }
}

console.log('🔍 Scanning repository for AI slop and placeholder code...');
scanDir(process.cwd());

if (slopCount > 0) {
  console.error(`\n❌ Failed: ${slopCount} AI slop violations detected. Purge placeholders before commit.`);
  process.exit(1);
} else {
  console.log('✅ Anti-Slop Audit Passed: Clean code, zero AI slop detected.');
}
