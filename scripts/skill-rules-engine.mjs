#!/usr/bin/env node
/**
 * scripts/skill-rules-engine.mjs
 * Sovereign Fine-Grained Skill Rules Engine & Contextual Auto-Router (v4.7.0)
 *
 * Bridges declarative knowledge across all 178 skills with:
 * 1. Per-Skill Deterministic AST/Regex Guardrails (React 19, Next.js 15, Vue 3.5, Svelte 5,
 *    Tailwind v4, Rust 2024, Go 1.24, Python/Pydantic v2, PostgreSQL RLS, FinTech SNAP BI,
 *    Docker/K8s, MCP v1.x, Zero-Trust Security, WebGPU/Three.js).
 * 2. Dynamic Markdown Rule & Invariant Extractor for any of the 178 SKILL.md files.
 * 3. Contextual File-Extension, Import-Signature & Prompt Intent Auto-Router.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

/**
 * Curated per-skill deterministic AST/Regex rules
 */
export const SKILL_GUARD_RULES = Object.freeze({
  'senior-frontend': [
    {
      id: 'REACT19_NO_FETCH_IN_USEEFFECT',
      severity: 'WARN',
      name: 'Client-Side Fetch Inside useEffect',
      regex: /useEffect\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*\{[\s\S]{0,240}?\b(?:fetch|axios\.(?:get|post))\s*\(/m,
      remediation: 'Use React 19 Server Components, use(promise) with <Suspense>, or TanStack Query v5 (useQuery/useSuspenseQuery) instead of manual fetch inside useEffect.'
    },
    {
      id: 'REACT19_MANUAL_MEMO_OVERUSE',
      severity: 'INFO',
      name: 'Manual useMemo / useCallback Under React 19 Compiler',
      regex: /\b(?:useMemo|useCallback)\s*\(/,
      remediation: 'Rely on the React 19 Compiler for automatic memoization unless profiling proves manual stabilization is required.'
    }
  ],
  'nextjs-app-router-expert': [
    {
      id: 'NEXT15_SYNC_PARAMS_ACCESS',
      severity: 'ERROR',
      name: 'Synchronous params / searchParams Access in Next.js 15',
      regex: /export\s+default\s+function\s+\w+\s*\(\s*\{\s*(?:params|searchParams)\s*\}/,
      remediation: 'In Next.js 15+, params and searchParams are Promises. Mark the component async and await params/searchParams before accessing properties.'
    },
    {
      id: 'NEXT15_MISSING_USE_SERVER_DIRECTIVE',
      severity: 'WARN',
      name: 'Server Action Missing Explicit Input Validation',
      regex: /['"]use server['"][\s\S]{0,300}?export\s+async\s+function\s+\w+\s*\([^)]*\)\s*\{(?![\s\S]{0,250}?\b(?:safeParse|parse|validate|z\.))/m,
      remediation: 'Validate all Server Action payloads using Zod (.safeParse) before executing mutations.'
    }
  ],
  'tailwind-expert': [
    {
      id: 'TAILWIND_V4_LEGACY_DIRECTIVES',
      severity: 'ERROR',
      name: 'Legacy Tailwind v3 @tailwind Directives',
      regex: /@tailwind\s+(?:base|components|utilities)\s*;/,
      remediation: 'Upgrade to Tailwind CSS v4 CSS-first syntax: replace @tailwind directives with @import "tailwindcss"; and configure tokens inside @theme { ... }.'
    }
  ],
  'vue-frontend-expert': [
    {
      id: 'VUE3_LEGACY_OPTIONS_OR_VUEX',
      severity: 'WARN',
      name: 'Legacy Vue Options API or Vuex Store',
      regex: /\b(?:createStore\s*\(\s*\{[\s\S]{0,120}?mutations\s*:|export\s+default\s+\{\s*data\s*\(\s*\)\s*\{)/m,
      remediation: 'Use Vue 3 <script setup lang="ts">, Composition API (ref/computed/defineModel), and Pinia setup stores (defineStore).'
    }
  ],
  'svelte-sveltekit-expert': [
    {
      id: 'SVELTE5_LEGACY_LET_REACTIVITY',
      severity: 'WARN',
      name: 'Legacy Svelte 4 Reactive Syntax (export let / $:)',
      regex: /^\s*(?:export\s+let\s+\w+|\$:\s+\w+\s*=)/m,
      remediation: 'Migrate to Svelte 5 Runes: use $state(), $derived(), $effect(), and let { ... } = $props().'
    }
  ],
  'rust-programming-expert': [
    {
      id: 'RUST_UNSAFE_WITHOUT_SAFETY_DOC',
      severity: 'ERROR',
      name: 'Undocumented unsafe Block in Rust',
      regex: /(?!\/\/\s*SAFETY:[\s\S]{0,120})\bunsafe\s*\{/,
      remediation: 'Every unsafe block in Rust 2024 must be preceded by a // SAFETY: comment proving pointer validity, aliasing, and lifetime invariants.'
    },
    {
      id: 'RUST_UNWRAP_IN_PRODUCTION',
      severity: 'WARN',
      name: 'Unhandled .unwrap() Call in Rust',
      regex: /\.unwrap\s*\(\s*\)/,
      remediation: 'Propagate errors idiomatically with the ? operator and thiserror/anyhow context instead of panicking via .unwrap().'
    }
  ],
  'go-programming-expert': [
    {
      id: 'GO_SWALLOWED_ERROR',
      severity: 'ERROR',
      name: 'Ignored Error Return in Go (_ = err)',
      regex: /\b_\s*=\s*\w+\s*\(|,\s*_\s*:?=\s*\w+\.\w+\(/,
      remediation: 'Explicitly check if err != nil and wrap with fmt.Errorf("context: %w", err).'
    },
    {
      id: 'GO_UNBOUNDED_GOROUTINE',
      severity: 'WARN',
      name: 'Goroutine Launched Without Context Cancellation',
      regex: /\bgo\s+func\s*\(\s*\)\s*\{(?![\s\S]{0,200}?\bctx\.Done\(\))/m,
      remediation: 'Bind concurrent goroutines to context.Context cancellation or errgroup.WithContext(ctx) to prevent goroutine leaks.'
    }
  ],
  'python-programming-expert': [
    {
      id: 'PYTHON_PYDANTIC_V1_DEPRECATED',
      severity: 'ERROR',
      name: 'Deprecated Pydantic v1 Method (.dict / .parse_obj / @validator)',
      regex: /\.(?:parse_obj|parse_raw)\s*\(|@validator\s*\(/,
      remediation: 'Upgrade to Pydantic v2 APIs: use .model_dump(), .model_validate(), .model_validate_json(), and @field_validator.'
    },
    {
      id: 'PYTHON_MUTABLE_DEFAULT_ARG',
      severity: 'ERROR',
      name: 'Mutable Default Argument in Python Function',
      regex: /\bdef\s+\w+\s*\([^)]*=\s*(?:\[\s*\]|\{\s*\})/,
      remediation: 'Use None as default and initialize mutable list/dict inside the function body, or use dataclasses.field(default_factory=...).'
    }
  ],
  'database-orm-expert': [
    {
      id: 'DB_MISSING_RLS_ON_TABLE',
      severity: 'ERROR',
      name: 'PostgreSQL Table Created Without Row Level Security',
      regex: /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+[\w."]+[\s\S]+?;(?![\s\S]*ENABLE\s+ROW\s+LEVEL\s+SECURITY)/i,
      remediation: 'Enable Row Level Security (ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;) and define tenant isolation policies.'
    }
  ],
  'supabase-security-expert': [
    {
      id: 'SUPABASE_SERVICE_ROLE_CLIENT_EXPOSURE',
      severity: 'ERROR',
      name: 'Supabase Service Role Key Exposed in Client Bundle',
      regex: /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE|VITE_SUPABASE_SERVICE_ROLE/,
      remediation: 'Never expose SUPABASE_SERVICE_ROLE_KEY in NEXT_PUBLIC_* or VITE_* client environment variables.'
    }
  ],
  'doku-payment-gateway': [
    {
      id: 'DOKU_NON_TIMING_SAFE_SIGNATURE',
      severity: 'ERROR',
      name: 'Non-Constant-Time Webhook Signature Comparison',
      regex: /signature\s*===?\s*expected|expectedSignature\s*===?\s*signature/i,
      remediation: 'Use crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) when verifying SNAP BI / DOKU HMAC-SHA256 or asymmetric signatures.'
    }
  ],
  'double-entry-ledger-fintech-expert': [
    {
      id: 'FINTECH_FLOATING_POINT_MONEY',
      severity: 'ERROR',
      name: 'Floating-Point Type Used for Monetary Balance/Amount',
      regex: /\b(?:amount|balance|price|credit|debit)\s*:\s*float\b|\b(?:amount|balance)\s+(?:FLOAT|DOUBLE\s+PRECISION|REAL)\b/i,
      remediation: 'Represent all monetary values as integer minor units (BIGINT cents/sen) or exact NUMERIC(19, 4). Never use IEEE 754 floats for currency.'
    }
  ],
  'docker-container-expert': [
    {
      id: 'DOCKER_MUTABLE_LATEST_TAG',
      severity: 'WARN',
      name: 'Mutable :latest Image Tag in Dockerfile',
      regex: /^\s*FROM\s+[^\s:@]+:latest\b/im,
      remediation: 'Pin container base images to explicit semantic versions and SHA256 digests (e.g., node:22.14.0-alpine@sha256:...).'
    }
  ],
  'mcp-server-architect': [
    {
      id: 'MCP_STDIO_CONSOLE_LOG_CORRUPTION',
      severity: 'ERROR',
      name: 'stdout Pollution via console.log in MCP Stdio Transport',
      regex: /StdioServerTransport[\s\S]{0,400}?console\.log\s*\(/m,
      remediation: 'Never write diagnostic logs to stdout (console.log) in MCP stdio servers as it corrupts JSON-RPC frames; use console.error or process.stderr.write.'
    }
  ],
  'zero-trust-secret-vault': [
    {
      id: 'HARDCODED_SECRET_TOKEN',
      severity: 'ERROR',
      name: 'Hardcoded Live API Key or Secret Literal',
      regex: /\b(?:sk_live_[0-9a-zA-Z]{16,}|ghp_[0-9a-zA-Z]{24,}|AIza[0-9A-Za-z-_]{30,})\b/,
      remediation: 'Inject secrets dynamically via Zero-Trust vault (Infisical/Vault) or validated process.env variables.'
    }
  ]
});

/**
 * File extension and import signature mapping to specialized skills
 */
export const CONTEXTUAL_SKILL_TRIGGERS = Object.freeze([
  { ext: ['.tsx', '.jsx'], imports: ['next/', 'next'], skills: ['nextjs-app-router-expert', 'senior-frontend', 'tailwind-expert', 'visual-ui-auditor'] },
  { ext: ['.tsx', '.jsx'], imports: ['react'], skills: ['senior-frontend', 'tailwind-expert', 'visual-ui-auditor'] },
  { ext: ['.vue'], imports: ['vue', 'pinia', 'nuxt'], skills: ['vue-frontend-expert', 'tailwind-expert', 'visual-ui-auditor'] },
  { ext: ['.svelte'], imports: ['svelte'], skills: ['svelte-sveltekit-expert', 'tailwind-expert', 'visual-ui-auditor'] },
  { ext: ['.astro'], imports: ['astro'], skills: ['astro-framework-expert', 'tailwind-expert'] },
  { ext: ['.rs'], imports: ['axum', 'tokio', 'serde', 'tauri'], skills: ['rust-programming-expert', 'tauri-expert'] },
  { ext: ['.go'], imports: ['net/http', 'context', 'sqlc'], skills: ['go-programming-expert'] },
  { ext: ['.py'], imports: ['fastapi', 'pydantic', 'pydantic_ai'], skills: ['python-programming-expert', 'pydantic-ai-expert'] },
  { ext: ['.sql', '.prisma'], imports: ['drizzle-orm', '@prisma/client', '@supabase/supabase-js'], skills: ['database-orm-expert', 'supabase-security-expert'] },
  { ext: ['.wgsl', '.glsl', '.frag', '.vert'], imports: ['three', '@react-three/fiber', 'babylonjs'], skills: ['glsl-shader-expert', 'web-3d-graphics-expert'] },
  { ext: ['.css'], imports: ['@theme', 'tailwindcss'], skills: ['tailwind-expert', 'modern-css-native-expert'] },
  { ext: ['dockerfile', '.dockerfile'], imports: [], skills: ['docker-container-expert', 'ci-cd-devops-architect'] },
  { ext: ['.yaml', '.yml'], imports: ['openapi:', 'paths:', 'kubernetes', 'argoproj'], skills: ['openapi-swagger-codegen-expert', 'kubernetes-gitops-platform-expert'] },
  { ext: ['.ts', '.mjs', '.js'], imports: ['@modelcontextprotocol/sdk', 'StdioServerTransport'], skills: ['mcp-server-architect', 'ai-llm-integration-expert'] },
  { ext: ['.ts', '.js'], imports: ['doku', 'snap-bi', 'stripe'], skills: ['doku-payment-gateway', 'payment-gateway-expert', 'double-entry-ledger-fintech-expert'] }
]);

/**
 * Matches relevant skills based on filePath, code content, and/or user prompt intent
 * @param {Object} context
 * @param {string} [context.filePath]
 * @param {string} [context.code]
 * @param {string} [context.prompt]
 * @returns {string[]}
 */
export function matchSkillsForTarget(context = {}) {
  const filePath = String(context.filePath || '').toLowerCase();
  const code = String(context.code || '');
  const prompt = String(context.prompt || '').toLowerCase();
  const matched = new Set();

  const ext = filePath ? (path.basename(filePath).startsWith('dockerfile') ? 'dockerfile' : path.extname(filePath)) : '';

  for (const trigger of CONTEXTUAL_SKILL_TRIGGERS) {
    const extHit = ext && trigger.ext.includes(ext);
    const importHit = trigger.imports.some((imp) => code.includes(imp) || prompt.includes(imp.toLowerCase()));
    if (extHit || importHit) {
      for (const s of trigger.skills) matched.add(s);
    }
  }

  // Additional code content heuristics
  if (/CREATE\s+TABLE|ALTER\s+TABLE|ROW\s+LEVEL\s+SECURITY/i.test(code)) {
    matched.add('database-orm-expert');
    matched.add('supabase-security-expert');
  }
  if (/\bunsafe\s*\{|\bfn\s+\w+.*->\s*Result</.test(code)) {
    matched.add('rust-programming-expert');
  }
  if (/\bfunc\s+\w+\(.*context\.Context/.test(code) || /\bpackage\s+main\b/.test(code)) {
    matched.add('go-programming-expert');
  }
  if (/\bdef\s+\w+.*BaseModel|\bfrom\s+pydantic\s+import/.test(code)) {
    matched.add('python-programming-expert');
  }
  if (/useEffect\s*\(|useActionState|useOptimistic/.test(code)) {
    matched.add('senior-frontend');
  }
  if (/@tailwind\s+|@theme\s*\{/.test(code)) {
    matched.add('tailwind-expert');
  }

  if (matched.size === 0) {
    matched.add('anti-slop');
    matched.add('scalability-clean-code');
  }

  return [...matched];
}

/**
 * Dynamically extracts structured rules, best practices, and NFR invariants from any SKILL.md
 * @param {string} skillName
 * @param {string} [rawContent]
 * @returns {Promise<Object>}
 */
export async function extractDeclarativeRulesFromSkill(skillName, rawContent = null) {
  const content = rawContent || await fs.readFile(path.join(SKILLS_DIR, skillName, 'SKILL.md'), 'utf8');

  // Extract English section only to avoid bilingual duplication
  const enSection = extractLanguageSection(content, 'en');

  // Extract bullet points under Best Practices / Technical Guidelines / Invariants
  const guidelineBullets = [];
  const bulletRegex = /^\s*(?:[-*]|\d+\.)\s+\*\*([^*]+)\*\*[:\s—-]*([^\r\n]+)/gm;
  let match;
  while ((match = bulletRegex.exec(enSection)) !== null) {
    const title = match[1].trim();
    const detail = match[2].trim();
    if (
      !/^(English|Bahasa Indonesia|Frontier Model|Availability Fallback|KV-Cache|SaaT CLI)$/i.test(title) &&
      guidelineBullets.length < 8
    ) {
      guidelineBullets.push({ rule: title, mandate: detail });
    }
  }

  // Extract NFR row from Sovereign Execution Matrix if present
  const nfrMatch = content.match(/\*\*NFR & Anti-Slop Invariants\*\*\s*\|\s*([^|\r\n]+)/i);
  const nfrMandate = nfrMatch ? nfrMatch[1].trim() : '100% complete zero-placeholder implementation';

  const astRules = SKILL_GUARD_RULES[skillName] || [];

  return {
    skill: skillName,
    astGuardRulesCount: astRules.length,
    astGuardRules: astRules.map((r) => ({
      id: r.id,
      severity: r.severity,
      name: r.name,
      remediation: r.remediation
    })),
    declarativeMandatesCount: guidelineBullets.length,
    declarativeMandates: guidelineBullets,
    nfrContract: nfrMandate
  };
}

/**
 * Evaluates code against specific skill guardrails (or auto-matched contextual skills)
 * @param {Object} params
 * @param {string} [params.skill]
 * @param {string} [params.code]
 * @param {string} [params.filePath]
 * @param {string} [params.prompt]
 * @returns {Promise<Object>}
 */
export async function evaluateContextualSkillGuards(params = {}) {
  const code = String(params.code || '');
  const targetSkills = params.skill
    ? [params.skill, ...matchSkillsForTarget(params).filter((s) => s !== params.skill)]
    : matchSkillsForTarget(params);

  const findings = [];
  const checkedRuleIds = new Set();

  for (const skillName of targetSkills) {
    const rules = SKILL_GUARD_RULES[skillName] || [];
    for (const rule of rules) {
      if (checkedRuleIds.has(rule.id)) continue;
      checkedRuleIds.add(rule.id);
      if (code && rule.regex.test(code)) {
        findings.push({
          skill: skillName,
          ruleId: rule.id,
          severity: rule.severity,
          name: rule.name,
          remediation: rule.remediation
        });
      }
    }
  }

  const errorCount = findings.filter((f) => f.severity === 'ERROR').length;
  const warnCount = findings.filter((f) => f.severity === 'WARN').length;

  return {
    matchedSkills: targetSkills,
    rulesEvaluated: checkedRuleIds.size,
    passed: errorCount === 0,
    errorCount,
    warnCount,
    findingsCount: findings.length,
    findings
  };
}

/**
 * Segments a SKILL.md document by language ('en' | 'id' | 'full') to save ~45-50% context tokens
 * @param {string} content
 * @param {'en'|'id'|'full'} [lang='full']
 * @param {{ stripBoilerplate?: boolean }} [options]
 * @returns {string}
 */
export function extractLanguageSection(content, lang = 'full', options = {}) {
  const normalizedLang = String(lang || 'full').toLowerCase().trim();
  if (normalizedLang === 'full' || normalizedLang === 'all') {
    return content;
  }

  const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---/);
  const frontmatter = fmMatch ? `${fmMatch[0]}\n\n` : '';
  const titleMatch = content.match(/^#\s+[^\r\n]+/m);
  const titleHeader = titleMatch ? `${titleMatch[0]}\n\n` : '';

  const idSplitRegex = /<a\s+name=["']bahasa-indonesia["']\s*><\/a>|##\s+(?:Bahasa Indonesia|🇮🇩\s*Bahasa Indonesia)/i;
  const enSplitRegex = /<a\s+name=["']english["']\s*><\/a>|##\s+(?:English|🇬🇧\s*English)/i;

  let body = content;
  const idMatch = idSplitRegex.exec(content);
  const enMatch = enSplitRegex.exec(content);

  if (normalizedLang === 'en' || normalizedLang === 'english') {
    if (enMatch && idMatch && idMatch.index > enMatch.index) {
      body = content.slice(enMatch.index, idMatch.index).trim();
    } else if (idMatch) {
      body = content.slice(fmMatch ? fmMatch[0].length : 0, idMatch.index).trim();
    }
  } else if (normalizedLang === 'id' || normalizedLang === 'id-id' || normalizedLang === 'indonesia') {
    if (idMatch) {
      body = content.slice(idMatch.index).trim();
    }
  }

  if (options.stripBoilerplate) {
    body = body
      .replace(/###\s+(?:Sovereign Execution, Token Efficiency & Invariants|Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian)[\s\S]*?(?=\r?\n(?:---|##\s|<a\s)|$)/gi, '')
      .trim();
  }

  return `${frontmatter}${titleHeader}${body}\n`;
}

/**
 * Extracts a meaningful, AST-signature-aware snippet from a code block instead of naive 14-line slicing
 * @param {string} rawCode
 * @param {number} [maxLines=18]
 * @returns {string}
 */
export function extractSmartCodeSnippet(rawCode, maxLines = 18) {
  const lines = String(rawCode || '').trim().split(/\r?\n/);
  if (lines.length <= maxLines) {
    return lines.join('\n');
  }

  // Locate first high-signal declaration line (export, function, class, interface, CREATE TABLE, pub fn, def, etc.)
  const sigIndex = lines.findIndex((line) =>
    /^(?:export\s+|async\s+function|function\s+|class\s+|interface\s+|type\s+|const\s+\w+\s*=|CREATE\s+TABLE|ALTER\s+TABLE|pub\s+(?:async\s+)?fn|func\s+|def\s+|@theme|<script\s+setup)/i.test(line.trim())
  );

  if (sigIndex > 2 && sigIndex < lines.length - 4) {
    const leadingImports = lines.slice(0, Math.min(2, sigIndex));
    const coreBody = lines.slice(sigIndex, sigIndex + (maxLines - leadingImports.length));
    return [...leadingImports, ...coreBody].join('\n');
  }

  return lines.slice(0, maxLines).join('\n');
}

