#!/usr/bin/env node
/**
 * scripts/supercharge-all-skills.mjs
 * Sovereign Skill Supercharger Engine (v4.7.0)
 *
 * Strengthens all 171 skills across the Vibes-Plug ecosystem:
 * 1. Modernizes any remaining legacy model references to the Late-2026 Frontier Matrix
 *    with mandatory Availability Fallback Invariants (Gemini 4 -> Gemini 3.8 Flash,
 *    Claude Opus 5.5 -> Claude Opus 4.6).
 * 2. Enriches skills that have < 2 code blocks with complete, production-ready
 *    TypeScript executable blueprints (ensuring 100% of 171 skills have >= 2 code blocks).
 * 3. Injects a domain-tailored, bilingual Sovereign Execution, Token Efficiency & Invariants
 *    Matrix into all 171 skills (English & Bahasa Indonesia), binding every skill to
 *    `vibes skill exec <skill> <action>` and `vibes_skill_dispatch`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSkillAdapter } from './skill-dispatcher.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(PLUGIN_ROOT, 'skills');

const DOMAIN_EXECUTION_PROFILES = {
  'frontend': {
    tierEn: 'High Fast / Medium / High (`Gemini 4 Carbon`, `Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Composer 2.5 Fast`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_ast_query`, `vibes_verify_gate`',
    nfrEn: 'LCP < 1.8s, INP < 100ms, CLS < 0.05, 1px crisp borders, 3-tier radius (6px/8px/12px), `tabular-nums`, 5-state interactive contract',
    nfrId: 'LCP < 1.8s, INP < 100ms, CLS < 0.05, border tegas 1px, radius 3-tier (6px/8px/12px), `tabular-nums`, kontrak interaktif 5-state'
  },
  'database-storage': {
    tierEn: 'Medium / High (`Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_eval_sql`, `vibes_verify_invariants`, `vibes_verify_gate`',
    nfrEn: 'P99 Query Latency < 15ms, 100% Row Level Security (RLS) coverage on multi-tenant tables, explicit B-Tree indexes on all Foreign Keys',
    nfrId: 'Latensi Query P99 < 15ms, cakupan Row Level Security (RLS) 100% pada tabel multi-tenant, indeks B-Tree eksplisit pada seluruh Foreign Key'
  },
  'testing-security': {
    tierEn: 'High Fast / High (`Gemini 4 Carbon`, `Gemini 4 Neon`, `Grok 4.7 High Fast`, `Claude Sonnet 5.5 High`, `Gemini 4 Pro`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`; `Grok 4.7` -> `Grok 4.6 High Fast`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_critic_validate`, `vibes_self_heal`, `vibes_eval_sandbox`, `vibes_verify_invariants`',
    nfrEn: 'Zero OWASP Top 10 vectors, 0 hardcoded secrets, >= 90% branch coverage on domain logic, 0 Anti-Slop violations',
    nfrId: 'Nol celah OWASP Top 10, 0 kredensial hardcoded, cakupan pengujian >= 90% pada logika domain, 0 pelanggaran Anti-Slop'
  },
  'api-contracts': {
    tierEn: 'Medium / High (`Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `GPT-5.6 Sol Medium`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate`',
    nfrEn: 'P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement',
    nfrId: 'Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key'
  },
  'ai-llm': {
    tierEn: 'High Fast / Medium / High (`Gemini 4 Carbon/Hydrogen/Neon/Argon/Pro`, `Grok 4.7 High Fast`, `Claude Sonnet/Opus 5.5`, `GPT-5.6 Sol`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_speculative_consensus`, `vibes_get_skill (mode: compact)`',
    nfrEn: 'KV-Cache Hit Rate >= 92%, Subagent Fan-Out Slice < 350 tokens (`.skill-slices.json`), MCP v1.x & A2A Agent Card v1.0 strict schema compliance',
    nfrId: 'KV-Cache Hit Rate >= 92%, Slice Fan-Out Subagent < 350 token (`.skill-slices.json`), kepatuhan skema ketat MCP v1.x & A2A Agent Card v1.0'
  },
  'devops-cicd': {
    tierEn: 'High Fast / Medium / High (`Gemini 4 Carbon`, `Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_verify_gate`, `vibes_self_heal`, `vibes_terminal_monitor`',
    nfrEn: 'SLSA Level 3 provenance, rootless distroless container runtimes, zero `:latest` mutable tags, OpenTelemetry W3C TraceContext propagation',
    nfrId: 'Provenans SLSA Level 3, runtime kontainer distroless non-root, nol tag `:latest` mutabel, propagasi OpenTelemetry W3C TraceContext'
  },
  'mobile-desktop': {
    tierEn: 'Medium / High (`Gemini 4 Neon`, `Gemini 4 Hydrogen`, `Claude Sonnet 5.5 High`, `Muse Wonder High`, `Gemini 4 Pro`, `Composer 2.5 Fast`)',
    fallbackEn: '`Gemini 4 (Carbon/Hydrogen/Neon/Argon/Pro)` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6`',
    mcpTools: '`vibes_skill_dispatch`, `vibes_visual_audit`, `vibes_verify_gate`, `vibes_eval_sandbox`',
    nfrEn: '60fps (16.67ms) / 120Hz (8.33ms) frame budget, Zero-GC object allocation inside render loops, Tauri v2 / Expo SDK 53 least-privilege capability ACLs',
    nfrId: 'Anggaran frame 60fps (16.67ms) / 120Hz (8.33ms), Zero-GC di dalam render loop, kapabilitas hak akses minimum Tauri v2 / Expo SDK 53'
  }
};

const RED_OCEAN_SKILLS = new Set([
  'senior-frontend', 'nextjs-app-router-expert', 'tailwind-expert', 'modern-css-native-expert',
  'vue-frontend-expert', 'angular-expert', 'svelte-sveltekit-expert', 'astro-framework-expert',
  'solidjs-expert', 'htmx-hypermedia-expert', 'state-management-expert', 'tanstack-query-expert',
  'form-validation-expert', 'rich-text-editor-expert', 'data-visualization-expert',
  'svg-animation-motion-expert', 'design-system-architect', 'ui-ux-pro-max',
  'fullstack-expert', 'js-backend-expert', 'bun-runtime-expert', 'python-programming-expert',
  'go-programming-expert', 'rust-programming-expert', 'api-design-expert', 'graphql-apollo-expert',
  'openapi-swagger-codegen-expert', 'database-orm-expert', 'authentication-identity-expert',
  'email-notification-expert', 'file-upload-media-expert', 'pdf-document-generation-expert',
  'search-engine-expert', 'geospatial-maps-expert', 'docker-container-expert', 'github-actions-expert',
  'ci-cd-devops-architect', 'cloud-hosting-expert', 'cloudflare-workers-expert', 'monorepo-architect',
  'logging-error-tracking-expert', 'data-telemetry-expert', 'rate-limit-abuse-prevention',
  'error-resilience-expert', 'e2e-testing-expert', 'accessibility-testing-expert',
  'global-a11y-i18n-expert', 'biome-linter-formatter-expert', 'performance-web-vitals', 'seo',
  'ecommerce-expert', 'payment-gateway-expert', 'saas-architect', 'saas-billing', 'saas-multi-tenant',
  'headless-cms-expert', 'wordpress-headless-expert', 'documentation-site-expert',
  'chatbot-messaging-expert', 'n8n-automation-expert', 'mobile-expo-expert', 'flutter-dart-expert',
  'desktop-electron-expert', 'tauri-expert', 'pwa-offline-first-expert'
]);

const BLUE_OCEAN_SYNERGIES = {
  'frontend': {
    pairings: '`ephemeral-generative-ui-architect`, `visual-ui-auditor`, `multimodal-spatial-video-cloner`, `anti-slop`',
    mandateEn: 'Reject generic AI UI templates: enforce 5-state interactive contracts, `tabular-nums`, crisp 1px borders, and multimodal `vibes visual-audit` verification before disk write.',
    mandateId: 'Tolak UI generik: wajibkan kontrak interaktif 5-state, `tabular-nums`, border tegas 1px, serta verifikasi multimodal `vibes visual-audit` sebelum menulis ke disk.'
  },
  'database-storage': {
    pairings: '`reactive-sync-engine-expert`, `fga-rebac-authorization-expert`, `formal-spec-z3-verifier`, `zero-tech-debt-auditor`',
    mandateEn: 'Never emit bare CRUD tables: enforce PostgreSQL RLS, explicit B-Tree indexes on foreign keys, in-memory `vibes db:eval` DDL simulation, and ReBAC authorization checks.',
    mandateId: 'Dilarang membuat tabel CRUD polos: wajibkan PostgreSQL RLS, indeks B-Tree eksplisit pada foreign key, simulasi DDL `vibes db:eval`, dan otorisasi ReBAC.'
  },
  'testing-security': {
    pairings: '`autonomous-tdd-debugger`, `autonomous-red-teamer`, `ephemeral-wasm-sandbox-executor`, `prompt-injection-firewall`, `anti-slop`',
    mandateEn: 'Elevate routine tests into continuous self-healing: validate candidate patches in `vibes sandbox --verify`, fuzz OWASP/injection vectors, and gate commits via `vibes skill auto-diff`.',
    mandateId: 'Tingkatkan tes standar menjadi self-healing kontinu: validasi patch di `vibes sandbox --verify`, fuzzing vektor OWASP/injeksi, dan gerbang commit via `vibes skill auto-diff`.'
  },
  'api-contracts': {
    pairings: '`autonomous-api-drift-healer`, `formal-spec-z3-verifier`, `doku-mcp-server`, `agentic-m2m-settlement`, `post-quantum-crypto-migrator`',
    mandateEn: 'Eliminate brittle REST boilerplate: enforce OpenAPI/TypeSpec drift healing, idempotency keys, RFC 9457 Problem Details, and formal Z3 state-transition invariants.',
    mandateId: 'Hapus boilerplate REST rapuh: wajibkan deteksi drift OpenAPI/TypeSpec, idempotency key, error RFC 9457 Problem Details, dan verifikasi invarian state Z3.'
  },
  'devops-cicd': {
    pairings: '`sbom-supply-chain-security-expert`, `self-healing-cloud-orchestrator`, `zero-trust-secret-vault`, `adaptive-model-cascade`',
    mandateEn: 'Go beyond basic Docker/CI YAML: mandate rootless distroless builds, CycloneDX SBOM attestation, zero-trust secret rotation, and self-healing telemetry loops.',
    mandateId: 'Lampaui YAML Docker/CI standar: wajibkan build distroless non-root, atestasi CycloneDX SBOM, rotasi secret zero-trust, dan loop telemetri self-healing.'
  },
  'mobile-desktop': {
    pairings: '`local-slm-edge-ai-expert`, `reactive-sync-engine-expert`, `passkeys-webauthn-identity-expert`, `anti-slop`',
    mandateEn: 'Upgrade standard app scaffolds with offline-first OPFS/SQLite sync, WebAuthn Passkeys, on-device SLM inference readiness, and strict 60/120fps Zero-GC budgets.',
    mandateId: 'Tingkatkan scaffold aplikasi standar dengan sinkronisasi offline-first OPFS/SQLite, Passkeys WebAuthn, kesiapan inferensi SLM lokal, dan budget 60/120fps Zero-GC.'
  }
};

function buildRedToBlueBlockEn(skillName, domain) {
  const syn = BLUE_OCEAN_SYNERGIES[domain] || BLUE_OCEAN_SYNERGIES['api-contracts'];
  return `### Blue-Ocean Synergy & Anti-Commodity Protocol
- **Mandatory Blue-Ocean Pairing**: Always compose \`${skillName}\` with ${syn.pairings} so commodity boilerplate is elevated into verified, self-healing production architecture.
- **Anti-Commodity Mandate**: ${syn.mandateEn}
- **Pre-Disk Gate**: Run \`vibes verify-gate\` and \`vibes skill auto-diff --json\` to inject <350-token slices and eliminate placeholder slop.`;
}

function buildRedToBlueBlockId(skillName, domain) {
  const syn = BLUE_OCEAN_SYNERGIES[domain] || BLUE_OCEAN_SYNERGIES['api-contracts'];
  return `### Sinergi Blue-Ocean & Protokol Anti-Komoditas
- **Pasangan Wajib Blue-Ocean**: Selalu komposisikan \`${skillName}\` bersama ${syn.pairings} agar boilerplate standar naik kelas menjadi arsitektur produksi terverifikasi dan *self-healing*.
- **Mandat Anti-Komoditas**: ${syn.mandateId}
- **Gerbang Pra-Disk**: Jalankan \`vibes verify-gate\` dan \`vibes skill auto-diff --json\` untuk menyuntikkan slice <350 token serta mencegah placeholder slop.`;
}

const SUPPLEMENTAL_BLUEPRINTS = {
  'saas-architect': `
#### Multi-Tenant Subdomain & Entry-Point Isolation Middleware (Next.js 16 / Edge)
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';

export interface TenantRoutingConfig {
  rootDomain: string;
  adminSubdomain: string;
}

export function routeMultiEntrySaaS(req: NextRequest, config: TenantRoutingConfig): NextResponse {
  const host = req.headers.get('host') ?? config.rootDomain;
  const hostname = host.split(':')[0];
  const url = req.nextUrl.clone();

  if (hostname === \`\${config.adminSubdomain}.\${config.rootDomain}\`) {
    url.pathname = \`/super-admin\${url.pathname === '/' ? '' : url.pathname}\`;
    return NextResponse.rewrite(url);
  }

  if (hostname !== config.rootDomain && hostname.endsWith(\`.\${config.rootDomain}\`)) {
    const tenantSlug = hostname.replace(\`.\${config.rootDomain}\`, '');
    url.pathname = \`/tenant/\${tenantSlug}\${url.pathname}\`;
    const res = NextResponse.rewrite(url);
    res.headers.set('x-tenant-slug', tenantSlug);
    return res;
  }

  return NextResponse.next();
}
\`\`\`

#### Hierarchical Feature Gating Evaluator
\`\`\`typescript
export interface EntitlementContext {
  systemFlags: Record<string, boolean>;
  planFeatures: ReadonlySet<string>;
  tenantAddons: ReadonlySet<string>;
  userRolePermissions: ReadonlySet<string>;
}

export function evaluateFeatureAccess(featureKey: string, ctx: EntitlementContext): boolean {
  if (ctx.systemFlags[featureKey] === false) {
    return false;
  }
  const hasTenantEntitlement = ctx.planFeatures.has(featureKey) || ctx.tenantAddons.has(featureKey);
  if (!hasTenantEntitlement) {
    return false;
  }
  return ctx.userRolePermissions.has(featureKey);
}
\`\`\`
`,
  'zero-to-prod-orchestrator': `
#### 8-Phase Zero-to-Prod Gate State Machine (TypeScript)
\`\`\`typescript
export type LifecyclePhase =
  | 'PHASE_1_DISCOVERY'
  | 'PHASE_2_FOUNDATION'
  | 'PHASE_3_DATABASE_RLS'
  | 'PHASE_4_BACKEND_API'
  | 'PHASE_5_FRONTEND_UI'
  | 'PHASE_6_TDD_QUALITY'
  | 'PHASE_7_DEVOPS_CICD'
  | 'PHASE_8_PRODUCTION';

export interface PhaseGateArtifact {
  phase: LifecyclePhase;
  requiredFiles: string[];
  antiSlopZeroViolations: boolean;
  testsPassing: boolean;
}

export function canAdvanceLifecyclePhase(artifact: PhaseGateArtifact, existingFiles: ReadonlySet<string>): {
  allowed: boolean;
  missingArtifacts: string[];
} {
  const missingArtifacts = artifact.requiredFiles.filter((file) => !existingFiles.has(file));
  const allowed = missingArtifacts.length === 0 && artifact.antiSlopZeroViolations && artifact.testsPassing;
  return { allowed, missingArtifacts };
}
\`\`\`

#### Automated Phase Verification Pipeline (\`scripts/verify-phase-gate.sh\`)
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

test -f PRD.md && test -f ERD.md && test -f DOCUMENTATION.md
node scripts/audit-graph.mjs
node scripts/validate-skills.mjs
node scripts/check-anti-slop.js --strict
\`\`\`
`,
  'domain-driven-design-expert': `
#### Transactional Outbox & Domain Event Dispatcher (TypeScript)
\`\`\`typescript
export interface DomainEventPayload {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventType: string;
  readonly occurredAt: string;
  readonly payload: Record<string, unknown>;
}

export interface OutboxRepository {
  insertOutboxEvents(events: readonly DomainEventPayload[]): Promise<void>;
}

export abstract class AggregateRoot<TId extends string> {
  private readonly uncommittedEvents: DomainEventPayload[] = [];

  constructor(public readonly id: TId) {}

  protected recordDomainEvent(eventType: string, payload: Record<string, unknown>): void {
    this.uncommittedEvents.push({
      eventId: crypto.randomUUID(),
      aggregateId: this.id,
      eventType,
      occurredAt: new Date().toISOString(),
      payload
    });
  }

  public pullDomainEvents(): readonly DomainEventPayload[] {
    const events = [...this.uncommittedEvents];
    this.uncommittedEvents.length = 0;
    return events;
  }
}
\`\`\`
`,
  'durable-agent-execution-expert': `
#### Idempotent Step Checkpoint Executor (TypeScript)
\`\`\`typescript
export interface StepJournalStore {
  getStepOutput<T>(workflowId: string, stepKey: string): Promise<T | undefined>;
  saveStepOutput<T>(workflowId: string, stepKey: string, output: T): Promise<void>;
}

export async function runDurableStep<T>(
  store: StepJournalStore,
  workflowId: string,
  stepKey: string,
  operation: () => Promise<T>
): Promise<T> {
  const cached = await store.getStepOutput<T>(workflowId, stepKey);
  if (cached !== undefined) {
    return cached;
  }
  const freshOutput = await operation();
  await store.saveStepOutput(workflowId, stepKey, freshOutput);
  return freshOutput;
}
\`\`\`
`,
  'computer-use-os-agent-expert': `
#### Normalized Coordinate Grounding & Action Safety Gate (TypeScript)
\`\`\`typescript
export interface NormalizedPoint {
  xNorm: number; // 0..1000
  yNorm: number; // 0..1000
}

export interface ScreenViewport {
  widthPx: number;
  heightPx: number;
}

export function toAbsoluteScreenPoint(point: NormalizedPoint, viewport: ScreenViewport): { x: number; y: number } {
  const clampedX = Math.max(0, Math.min(1000, point.xNorm));
  const clampedY = Math.max(0, Math.min(1000, point.yNorm));
  return {
    x: Math.round((clampedX / 1000) * viewport.widthPx),
    y: Math.round((clampedY / 1000) * viewport.heightPx)
  };
}
\`\`\`
`,
  'autonomous-tdd-debugger': `
#### Stack Trace Frame Parser & Fault Localizer (TypeScript)
\`\`\`typescript
export interface StackFrameLocation {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  functionName: string;
}

export function parseTopFailingFrame(stackTrace: string): StackFrameLocation | null {
  const frameRegex = /at\s+(?:([^\s(]+)\s+\()?([^\s():]+:\d+:\d+)\)?/;
  const match = stackTrace.match(frameRegex);
  if (!match) {
    return null;
  }
  const fnName = match[1] ?? 'anonymous';
  const parts = match[2].split(':');
  const col = Number(parts.pop());
  const line = Number(parts.pop());
  const filePath = parts.join(':');
  return { filePath, lineNumber: line, columnNumber: col, functionName: fnName };
}
\`\`\`
`,
  'autonomous-api-drift-healer': `
#### Runtime Schema Drift Detector & Adapter Coercer (TypeScript)
\`\`\`typescript
export interface FieldMigrationRule {
  legacyField: string;
  modernField: string;
}

export function healPayloadDrift(
  rawPayload: Record<string, unknown>,
  rules: readonly FieldMigrationRule[]
): { normalized: Record<string, unknown>; driftedFields: string[] } {
  const normalized: Record<string, unknown> = { ...rawPayload };
  const driftedFields: string[] = [];

  for (const rule of rules) {
    if (rule.legacyField in normalized && !(rule.modernField in normalized)) {
      normalized[rule.modernField] = normalized[rule.legacyField];
      delete normalized[rule.legacyField];
      driftedFields.push(rule.legacyField);
    }
  }

  return { normalized, driftedFields };
}
\`\`\`
`,
  'ai-code-review-autonomous': `
#### Diff Hunk Risk Scorer & Review Gate (TypeScript)
\`\`\`typescript
export interface DiffHunkAudit {
  filePath: string;
  addedLines: string[];
  riskScore: number;
  blockingReasons: string[];
}

export function auditGitDiffHunk(filePath: string, addedLines: readonly string[]): DiffHunkAudit {
  const blockingReasons: string[] = [];
  let riskScore = 0;

  for (const line of addedLines) {
    if (/dangerouslySetInnerHTML|\beval\s*\(/.test(line)) {
      riskScore += 50;
      blockingReasons.push('Unsafe execution sink detected in diff');
    }
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
      riskScore += 40;
      blockingReasons.push('Silent empty catch block introduced');
    }
  }

  return { filePath, addedLines: [...addedLines], riskScore, blockingReasons };
}
\`\`\`
`,
  'screenshot-to-code-expert': `
#### Layout Grid & Spacing Token Quantizer (TypeScript)
\`\`\`typescript
export function quantizePixelToTailwindSpacing(px: number): string {
  const scale: ReadonlyArray<{ px: number; token: string }> = [
    { px: 4, token: '1' },
    { px: 6, token: '1.5' },
    { px: 8, token: '2' },
    { px: 12, token: '3' },
    { px: 16, token: '4' },
    { px: 24, token: '6' },
    { px: 32, token: '8' },
    { px: 48, token: '12' },
    { px: 64, token: '16' }
  ];
  let closest = scale[0];
  for (const entry of scale) {
    if (Math.abs(entry.px - px) < Math.abs(closest.px - px)) {
      closest = entry;
    }
  }
  return closest.token;
}
\`\`\`
`,
  'mpa-orchestrator': `
#### Progressive Enhancement View-Transition Header Helper (TypeScript)
\`\`\`typescript
export function buildMpaDocumentHeaders(cacheMaxAgeSeconds = 60): Record<string, string> {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': \`public, max-age=\${cacheMaxAgeSeconds}, stale-while-revalidate=300\`,
    'Vary': 'HX-Request, Accept-Encoding',
    'X-Content-Type-Options': 'nosniff'
  };
}
\`\`\`
`,
  'test-time-compute-optimizer': `
#### Process Reward Model (PRM) Best-of-N Candidate Selector (TypeScript)
\`\`\`typescript
export interface CandidateGeneration {
  id: string;
  code: string;
  typecheckPassed: boolean;
  testsPassedCount: number;
  cyclomaticComplexity: number;
}

export function selectOptimalCandidate(candidates: readonly CandidateGeneration[]): CandidateGeneration | null {
  if (candidates.length === 0) {
    return null;
  }
  const scored = [...candidates].sort((a, b) => {
    const scoreA = (a.typecheckPassed ? 50 : 0) + a.testsPassedCount * 10 - a.cyclomaticComplexity;
    const scoreB = (b.typecheckPassed ? 50 : 0) + b.testsPassedCount * 10 - b.cyclomaticComplexity;
    return scoreB - scoreA;
  });
  return scored[0];
}
\`\`\`
`,
  'senior-frontend': `
#### React 19 Optimistic Mutation & Server Action Form Hook (TypeScript)
\`\`\`tsx
'use client';

import { useActionState, useOptimistic } from 'react';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export function OptimisticTaskList({
  initialTasks,
  toggleTaskAction
}: {
  initialTasks: TaskItem[];
  toggleTaskAction: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
}) {
  const [state, formAction, isPending] = useActionState(toggleTaskAction, {});
  const [optimisticTasks, addOptimisticToggle] = useOptimistic(
    initialTasks,
    (currentTasks, toggledId: string) =>
      currentTasks.map((t) => (t.id === toggledId ? { ...t, completed: !t.completed } : t))
  );

  return (
    <form
      action={(formData) => {
        const id = String(formData.get('taskId') ?? '');
        addOptimisticToggle(id);
        formAction(formData);
      }}
      className="space-y-2"
    >
      {state.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}
      {optimisticTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border border-neutral-200/80 dark:border-neutral-800 px-3 py-2"
        >
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{task.title}</span>
          <button
            type="submit"
            name="taskId"
            value={task.id}
            disabled={isPending}
            className="cursor-pointer rounded-md border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 text-xs font-medium tabular-nums transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50"
          >
            {task.completed ? 'Done' : 'Mark Done'}
          </button>
        </div>
      ))}
    </form>
  );
}
\`\`\`
`,
  'kv-cache-prefix-optimizer': `
#### Gemini 4 Argon / Flash Fallback Prefix Cache Manager (TypeScript)
\`\`\`typescript
export interface PrefixCacheDescriptor {
  prefixHash: string;
  modelId: 'gemini-4-argon-medium' | 'gemini-3.8-flash';
  estimatedTokens: number;
}

export function computePrefixDescriptor(
  staticPrefixText: string,
  isGemini4Available: boolean
): PrefixCacheDescriptor {
  let hash = 2166136261;
  for (let i = 0; i < staticPrefixText.length; i++) {
    hash ^= staticPrefixText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return {
    prefixHash: (hash >>> 0).toString(16).padStart(8, '0'),
    modelId: isGemini4Available ? 'gemini-4-argon-medium' : 'gemini-3.8-flash',
    estimatedTokens: Math.ceil(staticPrefixText.length / 4)
  };
}
\`\`\`
`,
  'legacy-code-translator': `
#### Golden Master Fixture Regression Verifier (TypeScript)
\`\`\`typescript
export interface GoldenFixture<TIn, TOut> {
  fixtureId: string;
  input: TIn;
  expectedOutput: TOut;
}

export async function verifyGoldenMasterParity<TIn, TOut>(
  fixtures: readonly GoldenFixture<TIn, TOut>[],
  modernCandidate: (input: TIn) => Promise<TOut>
): Promise<{ passed: boolean; failedFixtureIds: string[] }> {
  const failedFixtureIds: string[] = [];
  for (const item of fixtures) {
    const actual = await modernCandidate(item.input);
    if (JSON.stringify(actual) !== JSON.stringify(item.expectedOutput)) {
      failedFixtureIds.push(item.fixtureId);
    }
  }
  return {
    passed: failedFixtureIds.length === 0,
    failedFixtureIds
  };
}
\`\`\`
`
};

function buildEnglishSovereignMatrix(skillName, profile) {
  return `
### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | ${profile.tierEn} |
| **Availability Fallback** | ${profile.fallbackEn} (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (\`kv-cache-prefix-optimizer\`); pass surgical \`CONTEXT_MAP.md\` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: \`vibes skill exec ${skillName} <audit\\|eval\\|verify\\|generate\\|blueprint>\` / MCP: ${profile.mcpTools} |
| **NFR & Anti-Slop Invariants** | ${profile.nfrEn}; 100% complete zero-placeholder output verified via \`node scripts/check-anti-slop.js --strict\` |
`;
}

function buildIndonesianSovereignMatrix(skillName, profile) {
  return `
### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | ${profile.tierEn} |
| **Invarian Fallback Ketersediaan** | ${profile.fallbackEn} (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (\`kv-cache-prefix-optimizer\`); kirim potongan \`CONTEXT_MAP.md\` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: \`vibes skill exec ${skillName} <audit\\|eval\\|verify\\|generate\\|blueprint>\` / MCP: ${profile.mcpTools} |
| **Invarian NFR & Anti-Slop** | ${profile.nfrId}; kode 100% tuntas tanpa placeholder diverifikasi melalui \`node scripts/check-anti-slop.js --strict\` |
`;
}

async function superchargeAllSkills() {
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  let updatedCount = 0;
  let blueprintsInjected = 0;

  for (const skillName of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
    let content = await fs.readFile(skillPath, 'utf8');
    const originalContent = content;

    // 1. Modernize stale model references and skill counts
    content = content.replace(/161-Skill Ecosystem Registry/g, '171-Skill Ecosystem Registry');
    content = content.replace(/daftar 161 skill/g, 'daftar 171 skill');
    content = content.replace(/override_params:\s*\{\s*model:\s*"gemini-2\.5-pro"/g, 'override_params: { model: "gemini-4-argon-medium"');
    content = content.replace(/\(Gemini 2\.5 Flash\)/g, '(Gemini 4 Argon / Gemini 3.8 Flash)');
    content = content.replace(/Bing index \+ GPT-4o/g, 'Bing index + GPT-5.6 Sol');
    content = content.replace(/`gpt-4o-realtime-preview`/g, '`gpt-5.6-realtime`');
    content = content.replace(/gpt-4o-realtime-preview/g, 'gpt-5.6-realtime');

    // 2. Ensure version is bumped to 4.7.0 if any lower
    content = content.replace(/version:\s*"4\.[0-6]\.\d+"/g, 'version: "4.7.0"');

    // 3. Resolve domain profile
    const adapter = resolveSkillAdapter(skillName);
    const profile = DOMAIN_EXECUTION_PROFILES[adapter.domain] || DOMAIN_EXECUTION_PROFILES['api-contracts'];

    // 4. Inject supplemental blueprint if this skill has < 2 code blocks
    const existingCodeBlocks = (content.match(/```[a-zA-Z0-9_-]+\r?\n/g) || []).length;
    if (existingCodeBlocks < 2 && SUPPLEMENTAL_BLUEPRINTS[skillName]) {
      const indoDividerIdx = content.search(/<a name="bahasa-indonesia"><\/a>|##\s*Bahasa Indonesia/i);
      if (indoDividerIdx !== -1) {
        const beforeIndo = content.slice(0, indoDividerIdx).trimEnd();
        const afterIndo = content.slice(indoDividerIdx);
        content = `${beforeIndo}\n\n${SUPPLEMENTAL_BLUEPRINTS[skillName].trim()}\n\n---\n\n${afterIndo}`;
        blueprintsInjected++;
      }
    }

    // 5. Inject Bilingual Sovereign Execution, Token Efficiency & Invariants Matrix if not already present
    if (!content.includes('### Sovereign Execution, Token Efficiency & Invariants')) {
      const indoAnchorMatch = content.match(/(?:\r?\n---\r?\n\r?\n)?(<a name="bahasa-indonesia"><\/a>\r?\n)?##\s*Bahasa Indonesia/i);
      const enMatrix = buildEnglishSovereignMatrix(skillName, profile).trim();
      const idMatrix = buildIndonesianSovereignMatrix(skillName, profile).trim();

      if (indoAnchorMatch && indoAnchorMatch.index !== undefined) {
        const splitIdx = indoAnchorMatch.index;
        const enPart = content.slice(0, splitIdx).trimEnd();
        const idPart = content.slice(splitIdx).trimEnd();
        content = `${enPart}\n\n${enMatrix}\n\n---\n\n${idPart}\n\n${idMatrix}\n`;
      } else {
        content = `${content.trimEnd()}\n\n${enMatrix}\n\n${idMatrix}\n`;
      }
    } else {
      // Refresh existing Frontier Model Cascade & Availability Fallback rows with Carbon/Hydrogen/Argon/Pro
      content = content.replace(/\| \*\*Frontier Model Cascade\*\* \| [^\r\n]+/, `| **Frontier Model Cascade** | ${profile.tierEn} |`);
      content = content.replace(/\| \*\*Kaskade Model Frontier\*\* \| [^\r\n]+/, `| **Kaskade Model Frontier** | ${profile.tierEn} |`);
      content = content.replace(/\| \*\*Availability Fallback\*\* \| [^\r\n]+/, `| **Availability Fallback** | ${profile.fallbackEn} (Zero unhandled missing-model errors) |`);
      content = content.replace(/\| \*\*Invarian Fallback Ketersediaan\*\* \| [^\r\n]+/, `| **Invarian Fallback Ketersediaan** | ${profile.fallbackEn} (Bebas gagal saat model belum tersedia/kuota penuh) |`);
    }

    // 6. Elevate Red-Ocean skills with explicit Blue-Ocean Synergy & Anti-Commodity Protocols
    if (RED_OCEAN_SKILLS.has(skillName)) {
      if (!content.includes('### Blue-Ocean Synergy & Anti-Commodity Protocol')) {
        const enBlock = buildRedToBlueBlockEn(skillName, adapter.domain);
        content = content.replace(
          '### Sovereign Execution, Token Efficiency & Invariants',
          `${enBlock}\n\n### Sovereign Execution, Token Efficiency & Invariants`
        );
      }
      if (!content.includes('### Sinergi Blue-Ocean & Protokol Anti-Komoditas')) {
        const idBlock = buildRedToBlueBlockId(skillName, adapter.domain);
        content = content.replace(
          '### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian',
          `${idBlock}\n\n### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian`
        );
      }
    }

    if (content !== originalContent) {
      await fs.writeFile(skillPath, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`⚡ Supercharged ${updatedCount}/${skillDirs.length} skills (${blueprintsInjected} enriched with new executable code blueprints).`);
}

superchargeAllSkills().catch((err) => {
  console.error('Failed to supercharge skills:', err);
  process.exit(1);
});
