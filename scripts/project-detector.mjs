#!/usr/bin/env node

/**
 * Vibes-Plug Smart Project & Stack Detector (2026 Edition)
 * 
 * Inspects a project directory (package.json, Cargo.toml, go.mod, pubspec.yaml,
 * pyproject.toml, wrangler.toml, Dockerfile, etc.) to automatically identify the
 * tech stack and recommend or install the optimal bundle of Vibes-Plug skills.
 * 
 * Usage:
 *   node scripts/project-detector.mjs [targetDir] [--apply] [--json]
 *   vibes detect [targetDir] [--apply] [--json]
 * 
 * @author Roedy Rustam
 * @version 4.4.1
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

/**
 * Rules for detecting skills from package.json dependencies
 */
const NPM_DEPENDENCY_MAP = {
  // Frontend frameworks
  'next': ['nextjs-app-router-expert', 'senior-frontend'],
  'react': ['senior-frontend'],
  'vue': ['vue-frontend-expert'],
  'nuxt': ['vue-frontend-expert'],
  'svelte': ['svelte-sveltekit-expert'],
  '@sveltejs/kit': ['svelte-sveltekit-expert'],
  'solid-js': ['solidjs-expert'],
  '@angular/core': ['angular-expert'],
  'astro': ['astro-framework-expert'],
  'htmx.org': ['htmx-hypermedia-expert'],

  // Styling & UI
  'tailwindcss': ['tailwind-expert'],
  '@tailwindcss/postcss': ['tailwind-expert'],
  'three': ['web-3d-graphics-expert'],
  '@react-three/fiber': ['web-3d-graphics-expert'],

  // Backend runtimes & frameworks
  'express': ['js-backend-expert'],
  'fastify': ['js-backend-expert'],
  'hono': ['js-backend-expert', 'cloudflare-workers-expert'],
  '@nestjs/core': ['js-backend-expert'],
  'wrangler': ['cloudflare-workers-expert'],
  '@cloudflare/workers-types': ['cloudflare-workers-expert'],

  // Database & ORM
  'drizzle-orm': ['database-orm-expert'],
  'prisma': ['database-orm-expert'],
  '@prisma/client': ['database-orm-expert'],
  'typeorm': ['database-orm-expert'],
  'pg': ['database-orm-expert'],
  '@supabase/supabase-js': ['database-orm-expert', 'supabase-security-expert'],
  'firebase': ['firebase-security-expert'],
  'firebase-admin': ['firebase-security-expert'],

  // State & Data
  '@tanstack/react-query': ['tanstack-query-expert'],
  'zustand': ['state-management-expert'],
  'redux': ['state-management-expert'],

  // Testing & Quality
  'playwright': ['e2e-testing-expert'],
  '@playwright/test': ['e2e-testing-expert'],
  'vitest': ['autonomous-tdd-debugger', 'e2e-testing-expert'],
  'jest': ['autonomous-tdd-debugger', 'e2e-testing-expert'],
  '@biomejs/biome': ['biome-linter-formatter-expert'],

  // Payments & Commerce
  '@doku/': ['doku-payment-gateway'],
  'stripe': ['payment-gateway-expert', 'saas-billing'],

  // AI & MCP
  'ai': ['vercel-ai-sdk-expert'],
  '@modelcontextprotocol/sdk': ['mcp-server-architect'],
  '@google/genai': ['gemini-agent-booster', 'ai-llm-integration-expert'],

  // Desktop & Native
  'electron': ['desktop-electron-expert'],
  '@tauri-apps/api': ['tauri-expert'],
  'react-native': ['mobile-expo-expert'],
  'expo': ['mobile-expo-expert'],

  // Tooling & Language
  'typescript': ['typescript-expert']
};

/**
 * File presence indicators for languages & architectures
 */
const FILE_INDICATORS = [
  { file: 'pubspec.yaml', skills: ['flutter-dart-expert'], stack: 'Flutter / Dart' },
  { file: 'Cargo.toml', skills: ['rust-programming-expert'], stack: 'Rust' },
  { file: 'go.mod', skills: ['go-programming-expert'], stack: 'Go' },
  { file: 'pyproject.toml', skills: ['python-programming-expert'], stack: 'Python' },
  { file: 'requirements.txt', skills: ['python-programming-expert'], stack: 'Python' },
  { file: 'wrangler.toml', skills: ['cloudflare-workers-expert'], stack: 'Cloudflare Workers' },
  { file: 'wrangler.json', skills: ['cloudflare-workers-expert'], stack: 'Cloudflare Workers' },
  { file: 'wrangler.jsonc', skills: ['cloudflare-workers-expert'], stack: 'Cloudflare Workers' },
  { file: 'Dockerfile', skills: ['docker-container-expert', 'ci-cd-devops-architect'], stack: 'Docker' },
  { file: 'docker-compose.yml', skills: ['docker-container-expert', 'ci-cd-devops-architect'], stack: 'Docker Compose' },
  { file: 'compose.yaml', skills: ['docker-container-expert', 'ci-cd-devops-architect'], stack: 'Docker Compose v2' },
  { file: '.github/workflows', skills: ['github-actions-expert', 'ci-cd-devops-architect'], stack: 'GitHub Actions' },
  { file: 'openapi.yaml', skills: ['openapi-swagger-codegen-expert', 'spec-driven-development-expert'], stack: 'OpenAPI' },
  { file: 'openapi.json', skills: ['openapi-swagger-codegen-expert', 'spec-driven-development-expert'], stack: 'OpenAPI' }
];

/**
 * Scans a project directory and detects frameworks, libraries, and recommended skills
 * @param {string} targetDir
 * @returns {Promise<Object>}
 */
export async function detectProjectStack(targetDir = process.cwd()) {
  const resolvedDir = path.resolve(targetDir);
  const detectedStacks = new Set();
  const recommendedSkills = new Set();
  const matchedRules = [];

  // Check file indicators
  for (const indicator of FILE_INDICATORS) {
    const filePath = path.join(resolvedDir, indicator.file);
    try {
      await fs.access(filePath);
      detectedStacks.add(indicator.stack);
      for (const skill of indicator.skills) {
        recommendedSkills.add(skill);
      }
      matchedRules.push({
        source: indicator.file,
        stack: indicator.stack,
        skills: indicator.skills
      });
    } catch {
      // File not present, continue
    }
  }

  // Inspect package.json if present
  const pkgPath = path.join(resolvedDir, 'package.json');
  try {
    const pkgContent = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {})
    };

    detectedStacks.add('Node.js / JavaScript');

    for (const [depPattern, skills] of Object.entries(NPM_DEPENDENCY_MAP)) {
      const match = Object.keys(allDeps).find(k => k === depPattern || k.startsWith(depPattern));
      if (match) {
        for (const s of skills) {
          recommendedSkills.add(s);
        }
        matchedRules.push({
          source: `package.json [${match}]`,
          stack: match,
          skills
        });
      }
    }
  } catch {
    // package.json not present or invalid
  }

  // Inspect HTML files for HTMX presence if not caught by package.json
  try {
    const htmlFiles = ['index.html', 'views/index.html', 'templates/index.html'];
    for (const hf of htmlFiles) {
      try {
        const content = await fs.readFile(path.join(resolvedDir, hf), 'utf8');
        if (content.includes('hx-get') || content.includes('hx-post') || content.includes('htmx.org')) {
          detectedStacks.add('HTMX / Hypermedia');
          recommendedSkills.add('htmx-hypermedia-expert');
          matchedRules.push({
            source: hf,
            stack: 'HTMX / Hypermedia',
            skills: ['htmx-hypermedia-expert']
          });
          break;
        }
      } catch {
        // file not found
      }
    }
  } catch {
    // continue
  }

  // Always include foundational Sovereign quality standards
  const coreUniversalSkills = [
    'anti-slop',
    'spec-driven-development-expert',
    'production-ready-hardener'
  ];

  for (const c of coreUniversalSkills) {
    recommendedSkills.add(c);
  }

  // Verify all recommended skills actually exist in skills directory
  const availableSkills = await getAvailableSkills();
  const validSkills = Array.from(recommendedSkills).filter(s => availableSkills.has(s)).sort();

  return {
    targetDir: resolvedDir,
    detectedStacks: Array.from(detectedStacks).sort(),
    recommendedSkills: validSkills,
    matchedRules,
    totalSkillsRecommended: validSkills.length
  };
}

/**
 * Gets the set of all valid skill names from skills/
 * @returns {Promise<Set<string>>}
 */
async function getAvailableSkills() {
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    return new Set(entries.filter(e => e.isDirectory()).map(e => e.name));
  } catch {
    return new Set();
  }
}

/**
 * Installs detected skills into local .agents/skills/ in target directory
 * @param {string} targetDir
 * @param {string[]} skills
 * @returns {Promise<Object>}
 */
export async function applyDetectedSkills(targetDir, skills) {
  const localSkillsDir = path.join(targetDir, '.agents', 'skills');
  await fs.mkdir(localSkillsDir, { recursive: true });

  const installed = [];
  const failed = [];

  for (const skillName of skills) {
    const srcDir = path.join(SKILLS_DIR, skillName);
    const destDir = path.join(localSkillsDir, skillName);

    try {
      await fs.cp(srcDir, destDir, { recursive: true });
      installed.push(skillName);
    } catch (err) {
      failed.push({ skillName, error: err.message });
    }
  }

  return {
    installedCount: installed.length,
    installed,
    failed
  };
}

/**
 * CLI runner
 */
async function main() {
  const args = process.argv.slice(2);
  let targetDir = process.cwd();
  let apply = false;
  let jsonOutput = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--apply') {
      apply = true;
    } else if (args[i] === '--json') {
      jsonOutput = true;
    } else if (!args[i].startsWith('-')) {
      targetDir = path.resolve(args[i]);
    }
  }

  const result = await detectProjectStack(targetDir);

  if (apply) {
    const installResult = await applyDetectedSkills(targetDir, result.recommendedSkills);
    result.installation = installResult;
  }

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`
╔══════════════════════════════════════════════════════════╗
║    🔍 Vibes-Plug Smart Project & Stack Detector          ║
╚══════════════════════════════════════════════════════════╝
`);
  console.log(`📁 Target Directory : ${result.targetDir}`);
  console.log(`⚡ Detected Stacks  : ${result.detectedStacks.length > 0 ? result.detectedStacks.join(', ') : 'Generic Project'}`);
  console.log(`🎯 Recommended Skills: ${result.totalSkillsRecommended} tailored domain skills\n`);

  console.log('Detected Rules & Triggers:');
  for (const m of result.matchedRules) {
    console.log(`  • \x1b[36m${m.source.padEnd(28)}\x1b[0m ➔ ${m.skills.join(', ')}`);
  }

  console.log('\nRecommended Skill Bundle:');
  for (const s of result.recommendedSkills) {
    console.log(`  ✅ \x1b[32m${s}\x1b[0m`);
  }

  if (apply && result.installation) {
    console.log(`\n🎉 Successfully installed ${result.installation.installedCount} skills to .agents/skills/`);
  } else {
    console.log('\n💡 To automatically install this tailored bundle to .agents/skills/:');
    console.log('   vibes detect --apply');
  }
  console.log('');
}

const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase() ||
  process.argv[1].endsWith('project-detector.mjs')
);

if (isDirectExecution) {
  main().catch(err => {
    console.error(`❌ Error detecting stack: ${err.message}`);
    process.exit(1);
  });
}
