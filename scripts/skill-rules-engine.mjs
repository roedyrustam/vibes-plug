#!/usr/bin/env node
/**
 * scripts/skill-rules-engine.mjs
 * Sovereign Fine-Grained Skill Rules Engine & Contextual Auto-Router (v4.7.0)
 *
 * Bridges declarative knowledge across all 178 skills with:
 * 1. Per-Skill Deterministic AST/Regex Guardrails (React 19, Next.js 15, Vue 3.5, Svelte 5,
 *    Tailwind v4, Rust 2024, Go 1.24, Python/Pydantic v2, PostgreSQL RLS, FinTech SNAP BI,
 *    Docker/K8s, MCP v1.x, Zero-Trust Security, WebGPU/Three.js, ClickHouse/DuckDB OLAP,
 *    SLSA/Sigstore supply chain, Lean 4 proofs, Electric/Yjs sync, OpenFGA ReBAC, WebAuthn).
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
    },
    {
      id: 'TAILWIND_OUTLINE_NONE_WITHOUT_FOCUS_VISIBLE',
      severity: 'WARN',
      name: 'Tailwind outline-none / focus:outline-none Without focus-visible:ring Replacement',
      regex: /(?:class|className)\s*=\s*["'][^"']*\b(?:focus:)?outline-none\b(?![\s\S]{0,120}?\bfocus-visible:ring-)/,
      remediation: 'Never suppress keyboard focus outline with outline-none alone; pair it with explicit focus-visible:ring-2 focus-visible:ring-offset-2.'
    }
  ],
  'vue-frontend-expert': [
    {
      id: 'VUE3_LEGACY_OPTIONS_OR_VUEX',
      severity: 'WARN',
      name: 'Legacy Vue Options API or Vuex Store',
      regex: /\b(?:createStore\s*\(\s*\{[\s\S]{0,120}?mutations\s*:|export\s+default\s+\{\s*data\s*\(\s*\)\s*\{)/m,
      remediation: 'Use Vue 3 <script setup lang="ts">, Composition API (ref/computed/defineModel), and Pinia setup stores (defineStore).'
    },
    {
      id: 'VUE3_MUTATING_PROPS_DIRECTLY',
      severity: 'ERROR',
      name: 'Direct Mutation of Component Props in Vue 3',
      regex: /\bprops\.\w+\s*=\s*[^;=]/,
      remediation: 'Never mutate props directly in Vue 3. Use defineModel() for two-way binding or emit updates with defineEmits().'
    }
  ],
  'svelte-sveltekit-expert': [
    {
      id: 'SVELTE5_LEGACY_LET_REACTIVITY',
      severity: 'WARN',
      name: 'Legacy Svelte 4 Reactive Syntax (export let / $:)',
      regex: /^\s*(?:export\s+let\s+\w+|\$:\s+\w+\s*=)/m,
      remediation: 'Migrate to Svelte 5 Runes: use $state(), $derived(), $effect(), and let { ... } = $props().'
    },
    {
      id: 'SVELTE5_EFFECT_SYNCING_PROPS_ANTI_PATTERN',
      severity: 'WARN',
      name: 'Svelte 5 $effect Syncing Props to Local State Anti-Pattern',
      regex: /\$effect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]{0,120}?\b\w+\s*=\s*(?:\[\s*\.\.\.\s*data\.|data\.)/m,
      remediation: 'Do not synchronize incoming props to local state inside $effect; derive combined state using $derived() or track pending mutations in an isolated state.'
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
    },
    {
      id: 'RUST_LEGACY_AXUM_COLON_ROUTE_PARAM',
      severity: 'WARN',
      name: 'Legacy Axum 0.7 :param Route Syntax Used Instead of Axum 0.8 {param}',
      regex: /\.route\s*\(\s*["']\/[^"']*:[a-zA-Z_]\w*[^"']*["']/,
      remediation: 'Update Axum 0.8 route path parameters from legacy ":id" syntax to brace syntax "{id}" (e.g., .route("/api/v1/accounts/{id}", get(handler))).'
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
    },
    {
      id: 'GO_HTTP_LISTEN_WITHOUT_TIMEOUTS',
      severity: 'ERROR',
      name: 'Direct http.ListenAndServe Call Without ReadHeaderTimeout / ReadTimeout (Slowloris Risk)',
      regex: /\bhttp\.ListenAndServe\s*\(/,
      remediation: 'Configure &http.Server{ Addr, Handler, ReadHeaderTimeout: 5*time.Second, ReadTimeout: 15*time.Second, WriteTimeout: 30*time.Second } instead of bare http.ListenAndServe.'
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
    },
    {
      id: 'PYTHON_BLOCKING_IO_IN_ASYNC_DEF',
      severity: 'ERROR',
      name: 'Blocking requests.get/post or time.sleep Called Inside async def Function',
      regex: /\basync\s+def\s+\w+[\s\S]{0,300}?\b(?:requests\.(?:get|post|put|delete)|time\.sleep)\s*\(/,
      remediation: 'Never block the asyncio event loop with requests.* or time.sleep() inside async def; use httpx.AsyncClient and await asyncio.sleep().'
    }
  ],
  'database-orm-expert': [
    {
      id: 'DB_MISSING_RLS_ON_TABLE',
      severity: 'ERROR',
      name: 'PostgreSQL Table Created Without Row Level Security',
      regex: /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+[\w."]+[\s\S]+?;(?![\s\S]*ENABLE\s+ROW\s+LEVEL\s+SECURITY)/i,
      remediation: 'Enable Row Level Security (ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;) and define tenant isolation policies.'
    },
    {
      id: 'DB_DEEP_OFFSET_PAGINATION',
      severity: 'WARN',
      name: 'Deep OFFSET Pagination on Large Relational Table',
      regex: /prisma\.\w+\.findMany\s*\(\s*\{[\s\S]{0,150}?\bskip\s*:\s*(?:input\.page|page|\d{3,})[\s\S]{0,150}?\btake\s*:/,
      remediation: 'Use cursor-based keyset pagination ({ cursor: { id }, skip: 1, take }) instead of offset-based skip on large relational tables.'
    }
  ],
  'supabase-security-expert': [
    {
      id: 'SUPABASE_SERVICE_ROLE_CLIENT_EXPOSURE',
      severity: 'ERROR',
      name: 'Supabase Service Role Key Exposed in Client Bundle',
      regex: /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE|VITE_SUPABASE_SERVICE_ROLE/,
      remediation: 'Never expose SUPABASE_SERVICE_ROLE_KEY in NEXT_PUBLIC_* or VITE_* client environment variables.'
    },
    {
      id: 'SUPABASE_SECURITY_DEFINER_WITHOUT_SEARCH_PATH',
      severity: 'ERROR',
      name: 'PostgreSQL SECURITY DEFINER Function Missing Fixed search_path',
      regex: /SECURITY\s+DEFINER(?![\s\S]{0,120}?\bSET\s+search_path\s*=\s*['"]?['"]?)/i,
      remediation: 'All SECURITY DEFINER functions in Supabase/PostgreSQL must explicitly declare SET search_path = \'\' to prevent privilege escalation via schema search path injection.'
    }
  ],
  'doku-payment-gateway': [
    {
      id: 'DOKU_NON_TIMING_SAFE_SIGNATURE',
      severity: 'ERROR',
      name: 'Non-Constant-Time Webhook Signature Comparison',
      regex: /signature\s*===?\s*expected|expectedSignature\s*===?\s*signature/i,
      remediation: 'Use crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) when verifying SNAP BI / DOKU HMAC-SHA256 or asymmetric signatures.'
    },
    {
      id: 'DOKU_CHECKOUT_WRONG_HMAC_SHA512',
      severity: 'ERROR',
      name: 'HMAC-SHA512 Used on Non-SNAP DOKU Checkout Endpoint (/checkout/v1/payment)',
      regex: /\/checkout\/v1\/payment[\s\S]{0,300}?createHmac\s*\(\s*['"]sha512['"]/i,
      remediation: 'Non-SNAP DOKU Checkout (/checkout/v1/payment) requires HMAC-SHA256 (HMACSHA256=...), whereas SNAP BI Direct APIs require HMAC-SHA512.'
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
    },
    {
      id: 'DOCKER_EXPOSED_SECRET_IN_ARG_OR_ENV',
      severity: 'ERROR',
      name: 'Sensitive Token or Secret Baked Into Dockerfile ARG/ENV Layer',
      regex: /^\s*(?:ARG|ENV)\s+[A-Z0-9_]*(?:SECRET|PASSWORD|PRIVATE_KEY|NPM_TOKEN|GITHUB_TOKEN|API_KEY)\b/im,
      remediation: 'Never pass secrets via Dockerfile ARG or ENV (which persist in image layer history); use BuildKit secret mounts (--mount=type=secret,id=npmrc).'
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
    },
    {
      id: 'VAULT_WEAK_UNAUTHENTICATED_CIPHER',
      severity: 'ERROR',
      name: 'Unauthenticated Cipher Mode (AES-CBC / AES-ECB) Used for Secret Encryption',
      regex: /createCipheriv\s*\(\s*['"]aes-\d+-(?:cbc|ecb)['"]/i,
      remediation: 'Encrypt stored secrets exclusively with authenticated encryption (aes-256-gcm or chacha20-poly1305) with unique 12-byte IVs and tenant-bound AAD (cipher.setAAD).'
    }
  ],
  'olap-columnar-analytics-expert': [
    {
      id: 'OLAP_INTERPOLATED_SQL_LITERAL',
      severity: 'ERROR',
      name: 'User Value Interpolated Into Analytical SQL String',
      regex: /`[^`]*\bWHERE\b[^`]*'\$\{[^}]+\}'[^`]*`/,
      remediation: 'Bind values with typed parameters: ClickHouse {tenantId: UUID} + query_params, or DuckDB prepared statements ($1) via @duckdb/node-api. Never quote ${...} into SQL.'
    },
    {
      id: 'OLAP_UNBOUNDED_SELECT_STAR',
      severity: 'WARN',
      name: 'Unbounded SELECT * on Columnar Table',
      regex: /\bSELECT\s+\*\s+FROM\s+[\w.`"]+(?:(?!\bLIMIT\b)[^;])*(?:;|$)/i,
      remediation: 'Columnar engines read only referenced columns. Project explicit columns and add LIMIT / time-range predicates to avoid full wide-table scans.'
    },
    {
      id: 'OLAP_FINAL_WITHOUT_FILTER',
      severity: 'WARN',
      name: 'ClickHouse FINAL Without Partition/Tenant Filter',
      regex: /\bFROM\s+[\w.`"]+\s+FINAL\b(?![\s\S]{0,200}?\bWHERE\b)/i,
      remediation: 'FINAL forces merge-on-read across all parts. Restrict it with WHERE tenant_id / partition-key predicates, or deduplicate with argMax(col, version) GROUP BY key.'
    },
    {
      id: 'OLAP_HOT_PATH_MUTATION',
      severity: 'WARN',
      name: 'ClickHouse ALTER TABLE UPDATE/DELETE Mutation',
      regex: /\bALTER\s+TABLE\s+[\w.`"]+\s+(?:ON\s+CLUSTER\s+\S+\s+)?(?:UPDATE|DELETE)\b/i,
      remediation: 'Mutations rewrite whole data parts. Model updates with ReplacingMergeTree(version, is_deleted) or CollapsingMergeTree; reserve mutations for rare GDPR erasure jobs.'
    }
  ],
  'sbom-supply-chain-security-expert': [
    {
      id: 'SUPPLY_CHAIN_UNPINNED_ACTION',
      severity: 'WARN',
      name: 'Third-Party GitHub Action Not Pinned to Commit SHA',
      regex: /\buses:\s*["']?(?!\.\/)[\w.-]+\/[\w./-]+@(?![0-9a-f]{40}\b)[\w.-]+/,
      remediation: 'Pin every third-party action to a full 40-char commit SHA (uses: owner/action@<sha> # vX.Y.Z) and let Dependabot/Renovate bump it.'
    },
    {
      id: 'SUPPLY_CHAIN_WRITE_ALL_PERMISSIONS',
      severity: 'ERROR',
      name: 'Workflow Grants write-all Token Permissions',
      regex: /\bpermissions:\s*write-all\b/,
      remediation: 'Default to permissions: contents: read and grant id-token/packages/attestations: write only on the release job that needs them.'
    },
    {
      id: 'SUPPLY_CHAIN_CURL_PIPE_SHELL',
      severity: 'ERROR',
      name: 'Remote Script Piped Directly Into Shell',
      regex: /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/,
      remediation: 'Download installers to disk, verify a pinned SHA256 checksum or Sigstore signature, then execute.'
    },
    {
      id: 'SUPPLY_CHAIN_CI_NPM_INSTALL',
      severity: 'WARN',
      name: 'Mutable npm install With Lifecycle Scripts in CI',
      regex: /\brun:\s*npm\s+install\b(?![^\n]*--ignore-scripts)/,
      remediation: 'Use npm ci --ignore-scripts (or pnpm install --frozen-lockfile with onlyBuiltDependencies) so CI installs exactly the lockfile without postinstall execution.'
    }
  ],
  'formal-theorem-verifier-lean4': [
    {
      id: 'LEAN_SORRY_OR_ADMIT',
      severity: 'ERROR',
      name: 'Unfinished Proof (sorry / admit)',
      regex: /(?:^|[^\w'])(?:sorry|admit)(?![\w'])/m,
      remediation: 'Merged proofs must be closed. Decompose the goal into lemmas and discharge them with omega, simp, decide, or bv_decide; CI must fail on any sorry warning.'
    },
    {
      id: 'LEAN_UNCHECKED_AXIOM',
      severity: 'ERROR',
      name: 'Custom axiom Declaration in Specification',
      regex: /^\s*axiom\s+\w+/m,
      remediation: 'Custom axioms can make the whole theory inconsistent. Replace with a def + proved theorem, or model the assumption as an explicit hypothesis.'
    },
    {
      id: 'LEAN_FLOAT_IN_SPEC',
      severity: 'WARN',
      name: 'Float Used in Formal Specification',
      regex: /:\s*Float\b/,
      remediation: 'Float has no useful algebraic laws in Lean proofs. Model money and counters with Nat, Int, or BitVec n for exact fixed-width semantics.'
    }
  ],
  'reactive-sync-engine-expert': [
    {
      id: 'SYNC_CLIENT_DEFINED_SHAPE_WHERE',
      severity: 'WARN',
      name: 'Client-Defined Electric Shape where Clause',
      regex: /\bShapeStream\s*\(\s*\{[\s\S]{0,400}?\bwhere\s*:/,
      remediation: 'Clients must not choose shape filters. Route ShapeStream through an authorizing proxy that injects table/where/columns server-side from the authenticated tenant.'
    },
    {
      id: 'SYNC_MUTATION_WITHOUT_IDEMPOTENCY',
      severity: 'WARN',
      name: 'Offline-Replayable Mutation Without Idempotency Key',
      regex: /\bfetch\s*\([^)]*,\s*\{\s*method:\s*['"](?:POST|PUT|PATCH)['"](?![\s\S]{0,400}?[Ii]dempotency-[Kk]ey)/,
      remediation: 'Queued offline mutations are retried. Send an Idempotency-Key header and dedupe server-side; reconcile optimistic state via the returned txid.'
    }
  ],
  'realtime-collaboration-expert': [
    {
      id: 'COLLAB_UNAUTHENTICATED_HOCUSPOCUS',
      severity: 'ERROR',
      name: 'Hocuspocus Server Without onAuthenticate Hook',
      regex: /(?:\bServer\.configure|\bnew\s+(?:Server|Hocuspocus))\s*\(\s*\{(?![\s\S]{0,3000}?\bonAuthenticate\b)/,
      remediation: 'Verify the JWT and per-document permission in onAuthenticate (set connection.readOnly for viewers) before a client joins a document room.'
    },
    {
      id: 'COLLAB_JSON_SNAPSHOT_PER_UPDATE',
      severity: 'WARN',
      name: 'Full JSON Snapshot Persisted on Every CRDT Update',
      regex: /\.on\(\s*['"]update['"][\s\S]{0,300}?JSON\.stringify\s*\(/,
      remediation: 'Persist binary Yjs/Loro updates (Uint8Array) incrementally with debounce, and compact via Y.mergeUpdates / snapshots instead of serializing the whole document per keystroke.'
    },
    {
      id: 'COLLAB_UNBOUNDED_WS_PAYLOAD',
      severity: 'WARN',
      name: 'WebSocketServer Without maxPayload Limit',
      regex: /\bnew\s+WebSocketServer\s*\(\s*\{(?![^}]*\bmaxPayload\b)/,
      remediation: 'Set maxPayload (e.g. 1-5 MiB) and rate-limit incoming updates so a single client cannot exhaust server memory with oversized CRDT frames.'
    }
  ],
  'kubernetes-gitops-platform-expert': [
    {
      id: 'K8S_LATEST_IMAGE_TAG',
      severity: 'ERROR',
      name: 'Container Image Uses Mutable :latest Tag',
      regex: /^\s*(?:-\s*)?image:\s*["']?[^\s"'@]+:latest\b/m,
      remediation: 'Pin images to an immutable version plus digest (registry/app:1.4.2@sha256:...) so GitOps rollouts and rollbacks are reproducible.'
    },
    {
      id: 'K8S_PRIVILEGED_CONTAINER',
      severity: 'ERROR',
      name: 'Privileged Container or Privilege Escalation Enabled',
      regex: /\b(?:privileged|allowPrivilegeEscalation):\s*true\b/,
      remediation: 'Comply with Pod Security "restricted": privileged: false, allowPrivilegeEscalation: false, capabilities.drop: [ALL], seccompProfile.type: RuntimeDefault.'
    },
    {
      id: 'K8S_HOST_NAMESPACE_SHARING',
      severity: 'ERROR',
      name: 'Pod Shares Host Network/PID/IPC Namespace',
      regex: /\bhost(?:Network|PID|IPC):\s*true\b/,
      remediation: 'Remove hostNetwork/hostPID/hostIPC; expose traffic through Services and Gateway API routes instead.'
    },
    {
      id: 'K8S_PLAINTEXT_SECRET_MANIFEST',
      severity: 'ERROR',
      name: 'Plain Kubernetes Secret Manifest Committed to Git',
      regex: /\bkind:\s*Secret\b[\s\S]{0,400}?\b(?:data|stringData):/,
      remediation: 'Never commit Secret data. Use External Secrets Operator (ExternalSecret -> Vault/AWS SM/Infisical) or Sealed Secrets.'
    },
    {
      id: 'K8S_WORKLOAD_MISSING_LIMITS',
      severity: 'WARN',
      name: 'Workload Manifest Without Resource Limits',
      regex: /\bkind:\s*(?:Deployment|StatefulSet|DaemonSet|Rollout)\b(?![\s\S]*\blimits:)/,
      remediation: 'Declare resources.requests and resources.limits (at minimum memory) for every container so the scheduler, HPA, and Karpenter can bin-pack safely.'
    },
    {
      id: 'K8S_WORKLOAD_MISSING_RUN_AS_NON_ROOT',
      severity: 'WARN',
      name: 'Workload Manifest Without runAsNonRoot',
      regex: /\bkind:\s*(?:Deployment|StatefulSet|DaemonSet|Rollout)\b(?![\s\S]*\brunAsNonRoot:\s*true)/,
      remediation: 'Set securityContext.runAsNonRoot: true with an explicit non-zero runAsUser and readOnlyRootFilesystem: true.'
    }
  ],
  'fga-rebac-authorization-expert': [
    {
      id: 'FGA_CHECK_IN_LOOP',
      severity: 'WARN',
      name: 'N+1 OpenFGA Check Calls Inside a Loop',
      regex: /(?:\bfor\s*(?:await\s*)?\([^)]*\)\s*\{|\.map\s*\(\s*async\b)[\s\S]{0,300}?\.check\s*\(\s*\{[\s\S]{0,200}?\brelation\s*:/,
      remediation: 'Use batchCheck for a known set of objects or listObjects to filter collections in a single round-trip.'
    },
    {
      id: 'FGA_UNPINNED_MODEL_ID',
      severity: 'WARN',
      name: 'OpenFgaClient Without Pinned authorizationModelId',
      regex: /\bnew\s+OpenFgaClient\s*\(\s*\{(?![\s\S]{0,500}?\bauthorizationModelId\b)/,
      remediation: 'Pin authorizationModelId from configuration in production so model writes cannot silently change live authorization semantics.'
    },
    {
      id: 'FGA_PUBLIC_WILDCARD_PRIVILEGED_RELATION',
      severity: 'ERROR',
      name: 'Public Wildcard Granted a Privileged Relation',
      regex: /user\s*:\s*['"`]user:\*['"`][\s\S]{0,120}?relation\s*:\s*['"`](?:owner|admin|editor|writer|member)['"`]/,
      remediation: 'Restrict user:* wildcards to read-only relations (e.g. viewer on public resources); privileged relations require explicit subjects.'
    }
  ],
  'passkeys-webauthn-identity-expert': [
    {
      id: 'WEBAUTHN_STATIC_CHALLENGE',
      severity: 'ERROR',
      name: 'Hardcoded or Non-Cryptographic WebAuthn Challenge',
      regex: /\bchallenge\s*:\s*(?:['"`][^'"`]+['"`]|[^,\n]*Math\.random)/,
      remediation: 'Let generate*Options create a CSPRNG challenge, store it server-side bound to the session with a 5-minute TTL, and consume it atomically (single use).'
    },
    {
      id: 'WEBAUTHN_MISSING_EXPECTED_ORIGIN',
      severity: 'ERROR',
      name: 'WebAuthn Verification Without expectedOrigin',
      regex: /\bverify(?:Registration|Authentication)Response\s*\(\s*\{(?![\s\S]{0,800}?\bexpectedOrigin\b)/,
      remediation: 'Always pass explicit expectedOrigin, expectedRPID, and expectedChallenge to verifyRegistrationResponse / verifyAuthenticationResponse.'
    },
    {
      id: 'WEBAUTHN_WILDCARD_ORIGIN',
      severity: 'ERROR',
      name: 'Wildcard expectedOrigin in WebAuthn Verification',
      regex: /\bexpectedOrigin\s*:\s*['"`]\*['"`]/,
      remediation: 'List exact HTTPS origins (and Related Origin Requests entries) instead of a wildcard.'
    },
    {
      id: 'WEBAUTHN_USER_VERIFICATION_DISABLED',
      severity: 'WARN',
      name: 'User Verification Explicitly Disabled',
      regex: /\brequireUserVerification\s*:\s*false\b/,
      remediation: 'Require user verification for sign-in and credential management; downgrade only with an explicit, documented risk decision.'
    }
  ],
  'graphql-apollo-expert': [
    {
      id: 'GRAPHQL_PROD_INTROSPECTION_ENABLED',
      severity: 'WARN',
      name: 'GraphQL Introspection Explicitly Enabled',
      regex: /\bintrospection\s*:\s*true\b/,
      remediation: 'Set introspection: false in production (or gate behind authenticated developer roles) and enforce query depth/complexity limits.'
    },
    {
      id: 'GRAPHQL_RESOLVER_N_PLUS_ONE_QUERY',
      severity: 'WARN',
      name: 'Direct Database Lookup Inside Field Resolver Without DataLoader',
      regex: /@ResolveField\s*\([^)]*\)[\s\S]{0,240}?\.(?:findUnique|findFirst|findMany|findOne|query)\s*\(/,
      remediation: 'Batch nested @ResolveField lookups through a request-scoped DataLoader instance to eliminate N+1 database queries.'
    }
  ],
  'biome-linter-formatter-expert': [
    {
      id: 'BIOME_FORMAT_WITH_ERRORS_ENABLED',
      severity: 'ERROR',
      name: 'Biome formatWithErrors Enabled in Configuration',
      regex: /"formatWithErrors"\s*:\s*true\b/,
      remediation: 'Set "formatWithErrors": false in biome.json so syntax-broken files are never reformatted.'
    },
    {
      id: 'BIOME_CI_MUTATING_WRITE_FLAG',
      severity: 'WARN',
      name: 'Mutating biome check --write Used in CI Workflow',
      regex: /\brun:\s*(?:npx\s+@biomejs\/)?biome\s+check\s+--write\b/,
      remediation: 'Use read-only "biome ci ." in CI pipelines so formatting or lint violations fail with exit code 1.'
    }
  ],
  'durable-agent-execution-expert': [
    {
      id: 'DURABLE_WORKFLOW_SETINTERVAL_POLLING',
      severity: 'WARN',
      name: 'In-Memory setInterval Polling Inside Durable Workflow',
      regex: /\bsetInterval\s*\(/,
      remediation: 'Use durable step.sleep() or step.waitForEvent() / Temporal signals instead of in-memory setInterval loops.'
    },
    {
      id: 'DURABLE_UNJOURNALED_FETCH',
      severity: 'WARN',
      name: 'Direct fetch() Outside Durable step.do() Boundary',
      regex: /export\s+async\s+function\s+run\w*Workflow[\s\S]{0,300}?(?<!step\.do\([^{]+)\bfetch\s*\(/,
      remediation: 'Wrap every external fetch() or LLM call inside a journaled step.do() / Activity block so replays are deterministic.'
    }
  ],
  'computer-use-os-agent-expert': [
    {
      id: 'CUA_UNCLAMPED_RAW_COORDINATES',
      severity: 'WARN',
      name: 'Unclamped Normalized [0..1000] Screen Coordinate Division',
      regex: /\/\s*1000\s*\*\s*viewport\.(?:width|height)(?![\s\S]{0,120}?Math\.(?:min|max))/,
      remediation: 'Clamp normalized [0, 1000] coordinates with Math.max(0, Math.min(viewport.widthPx - 1, xPx)) before dispatching OS mouse events.'
    },
    {
      id: 'CUA_DESTRUCTIVE_HOST_EXEC',
      severity: 'ERROR',
      name: 'Unfiltered Shell Execution in Computer-Use Agent',
      regex: /\bexecSync\s*\(\s*`[^`]*\$\{/,
      remediation: 'Never pass interpolated model strings to execSync on the host; execute inside an ephemeral microVM/container behind an action policy gate.'
    }
  ],
  'a2a-agent-protocol-expert': [
    {
      id: 'A2A_UNBOUNDED_DELEGATION_HOP',
      severity: 'WARN',
      name: 'A2A Task Delegation Without Hop-Depth Check',
      regex: /method\s*:\s*['"]tasks\/send['"](?![\s\S]{0,400}?\b(?:hopDepth|maxHops|delegationDepth)\b)/,
      remediation: 'Propagate and enforce a maximum delegation hop count (maxHops <= 4) on federated tasks/send calls to prevent agent ping-pong loops.'
    },
    {
      id: 'A2A_INSECURE_HTTP_AGENT_CARD_URL',
      severity: 'WARN',
      name: 'Non-HTTPS URL in Production A2A Agent Card',
      regex: /\bFINTECH_AUDITOR_AGENT_CARD[\s\S]{0,200}?\burl\s*:\s*['"]http:\/\/(?!localhost|127\.0\.0\.1)/,
      remediation: 'Publish A2A Agent Card endpoints over HTTPS with Bearer OAuth2 or MutualTLS authentication.'
    }
  ],
  'sse-websocket-streaming-expert': [
    {
      id: 'SSE_MISSING_ACCEL_BUFFERING_HEADER',
      severity: 'WARN',
      name: 'SSE Stream Missing X-Accel-Buffering: no Header',
      regex: /\bstreamSSE\s*\((?![\s\S]{0,300}?X-Accel-Buffering)/,
      remediation: 'Set X-Accel-Buffering: no and Cache-Control: no-cache, no-transform before calling streamSSE() so reverse proxies do not buffer chunks.'
    },
    {
      id: 'SSE_HEARTBEAT_INTERVAL_LEAK',
      severity: 'ERROR',
      name: 'SSE Heartbeat setInterval Without clearInterval Cleanup',
      regex: /\bstreamSSE\s*\([\s\S]{0,600}?\bsetInterval\s*\((?![\s\S]{0,600}?\bclearInterval\s*\()/,
      remediation: 'Always clear SSE heartbeat intervals inside stream.onAbort() and a finally {} block to prevent server timer leaks.'
    }
  ],
  'micro-frontend-architect': [
    {
      id: 'MFE_SHARED_REACT_WITHOUT_SINGLETON',
      severity: 'ERROR',
      name: 'Module Federation Shared React Without singleton: true',
      regex: /shared\s*:\s*\{[\s\S]{0,200}?['"]?react['"]?\s*:\s*\{(?![^}]*\bsingleton\s*:\s*true)/,
      remediation: 'Configure shared: { react: { singleton: true }, "react-dom": { singleton: true } } in Module Federation to prevent multiple React instances.'
    }
  ],
  'authentication-identity-expert': [
    {
      id: 'AUTH_WEAK_PASSWORD_HASH',
      severity: 'ERROR',
      name: 'Weak Hash Algorithm (MD5/SHA1/SHA256) Used for Password Hashing',
      regex: /createHash\s*\(\s*['"](?:md5|sha1|sha256)['"]\s*\)[\s\S]{0,120}?password/i,
      remediation: 'Hash passwords exclusively with Argon2id (@node-rs/argon2) or bcrypt (cost >= 12); never use fast general-purpose hashes.'
    },
    {
      id: 'AUTH_JWT_NONE_ALGORITHM',
      severity: 'ERROR',
      name: 'JWT Verification Allowing "none" Algorithm',
      regex: /algorithms\s*:\s*\[[^\]]*['"]none['"]/i,
      remediation: 'Pin explicit asymmetric or HMAC algorithms (e.g. ["EdDSA", "ES256"]) in jwtVerify() and reject "none".'
    }
  ],
  'logging-error-tracking-expert': [
    {
      id: 'LOGGING_UNREDACTED_PII_SECRET',
      severity: 'ERROR',
      name: 'Pino Logger Created Without Sensitive Field Redaction',
      regex: /\bpino\s*\(\s*\{(?![\s\S]{0,400}?\bredact\s*:)/,
      remediation: 'Configure redact: { paths: ["req.headers.authorization", "*.password", "*.token", "*.secret"], censor: "[REDACTED]" } in Pino.'
    },
    {
      id: 'LOGGING_ERROR_MESSAGE_ONLY_DROPPING_STACK',
      severity: 'WARN',
      name: 'Logger Called With err.message String Instead of Structured err Object',
      regex: /\b(?:logger|log)\.error\s*\(\s*(?:err|error)\.message\s*\)/,
      remediation: 'Pass the structured error object first: logger.error({ err }, "Operation failed") so the stack trace and error.cause chain are preserved.'
    }
  ],
  'saas-multi-tenant': [
    {
      id: 'SAAS_TENANT_QUERY_WITHOUT_TENANT_FILTER',
      severity: 'WARN',
      name: 'Multi-Tenant Query Missing tenantId Scope',
      regex: /prisma\.(?:invoice|subscription|project|member|document)\.findMany\s*\(\s*\{\s*\}\s*\)/,
      remediation: 'Scope every multi-tenant query by tenantId and enforce PostgreSQL Row Level Security (current_setting("app.current_tenant_id")).'
    },
    {
      id: 'SAAS_SHARED_TABLE_MISSING_TENANT_ID',
      severity: 'ERROR',
      name: 'Multi-Tenant Entity Table Created Without tenant_id Column',
      regex: /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+(?:projects|documents|invoices|members|workspaces_data)\s*\((?![\s\S]{0,400}?\btenant_id\b)/i,
      remediation: 'Every shared multi-tenant table MUST declare a tenant_id UUID NOT NULL column with an index and RLS policy.'
    }
  ],
  'spa-orchestrator': [
    {
      id: 'SPA_TOKEN_IN_LOCALSTORAGE',
      severity: 'WARN',
      name: 'Sensitive Access/Refresh Token Stored in localStorage',
      regex: /localStorage\.setItem\s*\(\s*['"][^'"]*(?:token|jwt|session)['"]/i,
      remediation: 'Store session and refresh tokens in HttpOnly, Secure, SameSite=Lax/Strict cookies or BFF session stores instead of XSS-accessible localStorage.'
    }
  ],
  'rea-tool-design': [
    {
      id: 'REA_MISSING_EVIDENCE_SPAN',
      severity: 'WARN',
      name: 'REA Tool Result Constructed Without Evidence Array',
      regex: /\bexaminedScope\s*:[\s\S]{0,200}?\bdata\s*:(?![\s\S]{0,200}?\bevidence\s*:)/,
      remediation: 'Attach a verified ReaEvidenceSpan[] array (artifactDigest, provider, addressOrPath, confidence) to every ReaToolResult.'
    }
  ],
  'data-pipeline-etl-expert': [
    {
      id: 'ETL_INCREMENTAL_MISSING_UNIQUE_KEY',
      severity: 'WARN',
      name: 'dbt Incremental Model Configured Without unique_key Idempotency Contract',
      regex: /materialized\s*=\s*['"]incremental['"](?![\s\S]{0,240}?\bunique_key\b)/,
      remediation: 'Declare an explicit unique_key and incremental_strategy = "merge" in dbt incremental models so partition reruns are idempotent.'
    },
    {
      id: 'ETL_UNEXPORTED_RAW_CSV_DUMP',
      severity: 'WARN',
      name: 'Uncompressed CSV Output in Analytical Lakehouse Pipeline',
      regex: /\bCOPY\b[\s\S]{0,240}?\bFORMAT\s+CSV\b/i,
      remediation: 'Write analytical lakehouse outputs in columnar PARQUET format with ZSTD compression (FORMAT PARQUET, CODEC "ZSTD").'
    }
  ],
  'search-engine-expert': [
    {
      id: 'SEARCH_LEADING_WILDCARD_ILIKE',
      severity: 'WARN',
      name: 'Unindexed Leading-Wildcard SQL LIKE/ILIKE Full-Table Scan',
      regex: /\bI?LIKE\s+['"]%\$\{[^}]+\}%['"]/i,
      remediation: 'Replace leading-wildcard LIKE "%query%" scans with PostgreSQL tsvector GIN indexes (websearch_to_tsquery), pg_trgm, or Typesense/Meilisearch.'
    },
    {
      id: 'SEARCH_RAW_SCORE_SUM_WITHOUT_RRF',
      severity: 'WARN',
      name: 'Naive Raw Addition of Lexical BM25 and Cosine Vector Scores',
      regex: /\bbm25Score\s*\+\s*(?:vectorScore|cosineSimilarity)\b/,
      remediation: 'Merge lexical and vector rankings using Reciprocal Rank Fusion: 1 / (60 + lexicalRank) + 1 / (60 + vectorRank).'
    }
  ],
  'graph-rag-knowledge-expert': [
    {
      id: 'GRAPHRAG_MUTATING_CYPHER_EXECUTION',
      severity: 'ERROR',
      name: 'Mutating Cypher Clause Executed in GraphRAG Query Path',
      regex: /session\.run\s*\(\s*[`'"]\s*(?:CREATE|MERGE|DELETE|DETACH\s+DELETE|DROP)\b/i,
      remediation: 'Enforce read-only access (defaultAccessMode: neo4j.session.READ) and validate Text2Cypher queries through a deterministic read-only firewall.'
    },
    {
      id: 'GRAPHRAG_UNBOUNDED_VARIABLE_HOP',
      severity: 'WARN',
      name: 'Unbounded Variable-Length Cypher Path Traversal [*]',
      regex: /-\[\s*[a-zA-Z0-9_]*\s*\*\s*\]->/,
      remediation: 'Cap multi-hop Cypher traversals to explicit bounds (e.g., -[*1..3]->) and include a LIMIT clause to prevent combinatorial graph explosion.'
    }
  ],
  'event-driven-architect': [
    {
      id: 'EDA_DUAL_WRITE_BROKER_IN_DB_TX',
      severity: 'ERROR',
      name: 'Direct Message Broker Publish Inside Database Transaction (Dual-Write Anomaly)',
      regex: /db\.transaction\s*\([\s\S]{0,500}?\b(?:kafkaProducer\.send|producer\.send|channel\.publish|rabbit\.publish)\s*\(/,
      remediation: 'Never publish directly to a message broker inside a DB transaction; insert into outbox_events in the same SQL transaction and relay asynchronously.'
    },
    {
      id: 'EDA_OUTBOX_POLL_WITHOUT_SKIP_LOCKED',
      severity: 'WARN',
      name: 'Outbox Table Polling Query Missing FOR UPDATE SKIP LOCKED',
      regex: /SELECT[\s\S]{0,200}?FROM\s+outbox_events[\s\S]{0,160}?WHERE\s+status\s*=\s*['"]PENDING['"](?![\s\S]{0,120}?FOR\s+UPDATE\s+SKIP\s+LOCKED)/i,
      remediation: 'Append FOR UPDATE SKIP LOCKED when polling outbox_events so concurrent relay workers never publish duplicate events.'
    }
  ],
  'domain-driven-design-expert': [
    {
      id: 'DDD_INFRASTRUCTURE_IMPORT_IN_DOMAIN',
      severity: 'ERROR',
      name: 'ORM or HTTP Framework Imported Inside Pure Domain Layer',
      regex: /\/\/\s*src\/domain\/[\s\S]{0,240}?import\s+[\s\S]{0,80}?from\s+['"](?:@prisma\/client|drizzle-orm|typeorm|express|hono|next\/server)['"]/,
      remediation: 'Keep src/domain/ 100% pure: move ORM mappers and HTTP adapters to src/infrastructure/ and depend only on domain interfaces.'
    },
    {
      id: 'DDD_FLOAT_NUMBER_CURRENCY_VO',
      severity: 'WARN',
      name: 'Floating-Point number Used for Monetary Value Object Amount',
      regex: /class\s+Money\b[\s\S]{0,200}?\bamount\s*:\s*number\b/,
      remediation: 'Represent monetary amounts in Value Objects as bigint minor units (amountMinor: bigint) to eliminate IEEE-754 rounding drift.'
    }
  ],
  'api-gateway-proxy-expert': [
    {
      id: 'PROXY_SPOOFABLE_XFF_FIRST_HOP',
      severity: 'WARN',
      name: 'Spoofable Leftmost X-Forwarded-For Hop Used for Client IP',
      regex: /headers(?:\.get)?\s*\(\s*['"]x-forwarded-for['"]\s*\)[\s\S]{0,40}?\.split\s*\(\s*['"],['"]\s*\)\s*\[\s*0\s*\]/i,
      remediation: 'Do not trust the leftmost X-Forwarded-For entry directly; parse right-to-left skipping only verified trusted proxy CIDR hops.'
    },
    {
      id: 'PROXY_SSE_BUFFERING_ON',
      severity: 'ERROR',
      name: 'NGINX proxy_buffering on Configured on Streaming Location',
      regex: /location\s+[^\n{]*(?:stream|sse|events)[^\n{]*\{[\s\S]{0,300}?proxy_buffering\s+on\s*;/i,
      remediation: 'Set proxy_buffering off; and proxy_cache off; on SSE and AI streaming locations so chunks flush immediately.'
    }
  ],
  'ci-cd-devops-architect': [
    {
      id: 'CICD_UNFROZEN_LOCKFILE_INSTALL',
      severity: 'WARN',
      name: 'CI Pipeline Running pnpm/yarn Install Without --frozen-lockfile',
      regex: /\brun:\s*pnpm\s+install\b(?![^\n]*--frozen-lockfile)/,
      remediation: 'Always pass --frozen-lockfile (or npm ci) in CI workflows so lockfile drift fails the build deterministically.'
    },
    {
      id: 'CICD_STATIC_AWS_SECRET_KEYS_IN_WORKFLOW',
      severity: 'ERROR',
      name: 'Static Long-Lived Cloud Access Keys Used in GitHub Actions',
      regex: /\baws-secret-access-key\s*:\s*\$\{\{\s*secrets\./,
      remediation: 'Replace static cloud access keys with keyless OIDC federation (role-to-assume + permissions: id-token: write).'
    }
  ],
  'feature-flag-analytics-expert': [
    {
      id: 'FLAG_NON_DETERMINISTIC_MATH_RANDOM',
      severity: 'ERROR',
      name: 'Non-Deterministic Math.random() Used for Feature Flag Rollout Bucketing',
      regex: /Math\.random\s*\(\s*\)\s*<\s*(?:rollout|percentage|flag)/i,
      remediation: 'Bucket users deterministically by hashing (flagKey + ":" + distinctId) with SHA-256 or Murmur3 so users never flip variants on refresh.'
    }
  ],
  'error-resilience-expert': [
    {
      id: 'RESILIENCE_RETRY_WITHOUT_JITTER',
      severity: 'WARN',
      name: 'Exponential Backoff Retry Delay Without Random Jitter',
      regex: /\b(?:baseDelay\w*|delay\w*)\s*\*\s*(?:2\s*\*\*\s*attempt|Math\.pow\s*\(\s*2\s*,\s*attempt\s*\))(?![^\n;]*Math\.random)/,
      remediation: 'Add randomized full jitter (+ Math.random() * baseDelayMs) to exponential backoff calculations to prevent thundering-herd retry storms.'
    },
    {
      id: 'RESILIENCE_RAW_ERROR_STACK_IN_RESPONSE',
      severity: 'ERROR',
      name: 'Raw Error Stack Trace Leaked in HTTP JSON Response',
      regex: /Response\.json\s*\(\s*\{[^}]*\bstack\s*:\s*(?:err|error)\.stack\b/,
      remediation: 'Never expose internal error.stack in production API responses; return an RFC 9457 Problem Details payload with an opaque correlation digest.'
    }
  ],
  'rate-limit-abuse-prevention': [
    {
      id: 'RATELIMIT_IN_MEMORY_MAP_COUNTER',
      severity: 'WARN',
      name: 'Process-Local In-Memory Map Used for API Rate Limiting',
      regex: /const\s+(?:rateLimit\w*|requestCounts|ipHits)\s*=\s*new\s+Map\s*[<(]/,
      remediation: 'Do not use process-local Map() for production rate limiting across horizontal replicas; use atomic Redis/Upstash Sliding Window or Lua Token Bucket.'
    },
    {
      id: 'RATELIMIT_429_MISSING_RETRY_AFTER',
      severity: 'WARN',
      name: 'HTTP 429 Too Many Requests Response Missing Retry-After Header',
      regex: /status\s*:\s*429\b(?![\s\S]{0,220}?['"]Retry-After['"])/,
      remediation: 'Include Retry-After and X-RateLimit-Reset headers on every HTTP 429 response so clients back off deterministically.'
    }
  ],
  'async-queue-temporal-expert': [
    {
      id: 'BULLMQ_MISSING_MAX_RETRIES_NULL',
      severity: 'ERROR',
      name: 'BullMQ ioredis Connection Created Without maxRetriesPerRequest: null',
      regex: /new\s+Redis\s*\([^)]*\)\s*;[\s\S]{0,180}?new\s+(?:Queue|Worker)\b(?![\s\S]{0,180}?maxRetriesPerRequest\s*:\s*null)/,
      remediation: 'Configure new Redis(url, { maxRetriesPerRequest: null }) on all ioredis instances shared with BullMQ Workers and Queues.'
    },
    {
      id: 'TEMPORAL_NON_DETERMINISTIC_WORKFLOW_API',
      severity: 'ERROR',
      name: 'Non-Deterministic Date.now() or Math.random() Inside Temporal Workflow',
      regex: /from\s+['"]@temporalio\/workflow['"][\s\S]{0,600}?\b(?:Math\.random|process\.env)\b/,
      remediation: 'Never call Math.random() or read process.env directly inside a @temporalio/workflow file; move non-deterministic calls into Activities.'
    }
  ],
  'data-telemetry-expert': [
    {
      id: 'TELEMETRY_UNENDED_ACTIVE_SPAN',
      severity: 'ERROR',
      name: 'OpenTelemetry startActiveSpan Block Missing span.end()',
      regex: /\.startActiveSpan\s*\([^,]+,\s*async\s*\(\s*span\s*\)\s*=>\s*\{(?![\s\S]{0,500}?\bspan\.end\s*\(\s*\))/,
      remediation: 'Always call span.end() inside a finally {} block when using tracer.startActiveSpan() to prevent memory and trace context leaks.'
    },
    {
      id: 'TELEMETRY_HIGH_CARDINALITY_METRIC_LABEL',
      severity: 'WARN',
      name: 'High-Cardinality User/Request Identifier Passed to Metric Counter/Histogram',
      regex: /\b(?:counter|histogram)\.(?:add|record)\s*\([^,]+,\s*\{[^}]*\b(?:user_id|userId|email|request_id|requestId|session_id)\s*:/,
      remediation: 'Do not attach unbounded high-cardinality IDs (userId, email, requestId) to OTel Metrics; place them on Trace Spans or Logs instead.'
    }
  ],
  'state-management-expert': [
    {
      id: 'STATE_UNSELECTED_ZUSTAND_HOOK_CALL',
      severity: 'WARN',
      name: 'Zustand Store Hook Invoked Without Atomic Selector Function',
      regex: /\bconst\s+\{[^}]+\}\s*=\s*use(?:App|Ui|Auth|Cart|Workspace)\w*Store\s*\(\s*\)/,
      remediation: 'Select atomic slices with useStore((s) => s.field) or useShallow() instead of destructuring useStore() with no selector.'
    },
    {
      id: 'STATE_SERVER_QUERY_COPIED_TO_STORE',
      severity: 'WARN',
      name: 'Server Query Data Mirrored Into Client Store Inside useEffect',
      regex: /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]{0,140}?\bset\w*Store\b[\s\S]{0,80}?\}\s*,\s*\[\s*data\s*\]\s*\)/,
      remediation: 'Do not mirror TanStack Query server data into Zustand/Redux inside useEffect; let TanStack Query own server cache.'
    }
  ],
  'tanstack-query-expert': [
    {
      id: 'TANSTACK_QUERY_USEEFFECT_FETCH',
      severity: 'WARN',
      name: 'Raw fetch() Inside useEffect Instead of TanStack useQuery',
      regex: /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[\s\S]{0,200}?\bfetch\s*\(/,
      remediation: 'Replace useEffect + fetch() with TanStack Query useQuery() or useSuspenseQuery() using queryOptions().'
    },
    {
      id: 'TANSTACK_MUTATION_MISSING_CANCEL_QUERIES',
      severity: 'WARN',
      name: 'Optimistic setQueryData in onMutate Without Prior cancelQueries',
      regex: /onMutate\s*:\s*async\s*\([^)]*\)\s*=>\s*\{(?![\s\S]{0,180}?cancelQueries)[\s\S]{0,180}?setQueryData\s*\(/,
      remediation: 'Always await queryClient.cancelQueries({ queryKey }) in onMutate before calling setQueryData() so in-flight refetches do not overwrite optimistic state.'
    }
  ],
  'form-validation-expert': [
    {
      id: 'FORM_SUBMIT_BUTTON_MISSING_DISABLED_GUARD',
      severity: 'WARN',
      name: 'Form Submit Button Without disabled={isSubmitting || isPending} Lock',
      regex: /<button\s+type=["']submit["'](?![^>]*\bdisabled\s*=)[^>]*>/,
      remediation: 'Bind disabled={isSubmitting || isPending} on <button type="submit"> to prevent double-submission race conditions.'
    },
    {
      id: 'FORM_VAGUE_ERROR_MESSAGE_LITERAL',
      severity: 'WARN',
      name: 'Generic Non-Actionable Validation Error Message',
      regex: /\b(?:message|error)\s*:\s*['"](?:Invalid input|Invalid field|Error|Input salah)['"]/i,
      remediation: 'Provide specific, actionable field validation messages explaining what failed and how to fix it.'
    }
  ],
  'pwa-offline-first-expert': [
    {
      id: 'PWA_SW_CACHING_NON_GET_MUTATION',
      severity: 'ERROR',
      name: 'Service Worker cache.put() Executed Without GET Method Guard',
      regex: /self\.addEventListener\s*\(\s*['"]fetch['"][\s\S]{0,260}?cache\.put\s*\((?![\s\S]{0,260}?request\.method)/,
      remediation: 'Guard Service Worker fetch caching with if (request.method !== "GET") return; and route offline mutations through an idempotent Background Sync outbox.'
    },
    {
      id: 'PWA_UNPARAMETERIZED_SYNC_GRAPHQL_STRING',
      severity: 'ERROR',
      name: 'Unsanitized Document Interpolated Directly Into Offline Sync GraphQL Mutation',
      regex: /query\s*:\s*`mutation\s*\{[^`]*\$\{JSON\.stringify\(/,
      remediation: 'Pass offline sync documents via parameterized GraphQL variables ({ query, variables: { input: doc } }) instead of string interpolation.'
    }
  ],
  'compliance-gdpr-privacy-expert': [
    {
      id: 'PRIVACY_UNSALTED_SHA256_PII_HASH',
      severity: 'ERROR',
      name: 'Unsalted SHA-256/MD5 Hash Used for Searchable PII (NIK/SSN/Email)',
      regex: /createHash\s*\(\s*['"](?:sha256|md5|sha1)['"]\s*\)\.update\s*\(\s*(?:email|nik|ssn|phone|nationalId)/i,
      remediation: 'Never hash low-entropy PII (NIK, SSN, email, phone) with unsalted createHash("sha256"); use keyed HMAC-SHA256 (createHmac("sha256", blindIndexKey)) with a 32-byte secret key.'
    },
    {
      id: 'PRIVACY_HARD_DELETE_USER_CASCADE_LEDGER',
      severity: 'WARN',
      name: 'Hard DELETE FROM users CASCADE Destroying Financial/Audit Records',
      regex: /\bDELETE\s+FROM\s+users\b[\s\S]{0,40}?\bCASCADE\b/i,
      remediation: 'Execute Crypto-Shredding and PII column tombstoning (UPDATE users SET email = anonymized, national_id = NULL) while retaining immutable financial ledger entries.'
    }
  ],
  'prompt-injection-firewall': [
    {
      id: 'PROMPT_FIREWALL_RAW_UNTRUSTED_SYSTEM_INTERPOLATION',
      severity: 'ERROR',
      name: 'Raw Untrusted User/RAG Content Interpolated Directly Into System Prompt',
      regex: /role\s*:\s*['"]system['"]\s*,\s*content\s*:\s*`[^`]*\$\{(?:req\.body|userInput|rawInput|untrusted\w*|retrievedChunk)\}/,
      remediation: 'Never interpolate raw user or untrusted RAG strings into a system prompt; normalize with NFKC, strip Unicode tags, and isolate untrusted context in a <untrusted_external_content nonce="..."> user block.'
    },
    {
      id: 'PROMPT_FIREWALL_CLOUD_METADATA_SSRF_FETCH',
      severity: 'ERROR',
      name: 'Direct HTTP Fetch to Cloud Instance Metadata Service (169.254.169.254)',
      regex: /\bfetch\s*\(\s*['"`]https?:\/\/169\.254\.169\.254\b/,
      remediation: 'Block agent tool egress to link-local/metadata (169.254.0.0/16), loopback (127.0.0.0/8), and RFC 1918 private CIDR ranges.'
    }
  ],
  'ai-safety-governance-expert': [
    {
      id: 'AI_GOVERNANCE_PROHIBITED_SOCIAL_SCORING',
      severity: 'ERROR',
      name: 'EU AI Act Prohibited Risk Category (social_scoring / subliminal_manipulation) Enabled',
      regex: /\bsystemPurpose\s*:\s*['"](?:social_scoring|subliminal_manipulation)['"]\s*,\s*enabled\s*:\s*true\b/,
      remediation: 'Systems classified as UNACCEPTABLE_RISK under the EU AI Act (social_scoring, subliminal_manipulation) must be hard-blocked before execution.'
    },
    {
      id: 'AI_GOVERNANCE_HIGH_RISK_WITHOUT_HITL',
      severity: 'WARN',
      name: 'EU AI Act High-Risk Decision Executed Without Human-in-the-Loop Reviewer',
      regex: /\briskTier\s*:\s*['"]HIGH_RISK['"]\s*,\s*requireHumanReview\s*:\s*false\b/,
      remediation: 'High-risk AI decisions (credit_scoring, employment, biometrics) require human-in-the-loop verification under GDPR Art. 22 and the EU AI Act.'
    }
  ],
  'llm-observability-expert': [
    {
      id: 'LLM_OBS_UNSCRUBBED_API_KEY_IN_TRACE_INPUT',
      severity: 'ERROR',
      name: 'Raw Authorization Header or Secret Passed Into Langfuse/OTel Trace Input',
      regex: /langfuse\.trace\s*\(\s*\{[\s\S]{0,200}?\binput\s*:\s*\{[^}]*\b(?:authorization|apiKey|secretKey)\b/i,
      remediation: 'Scrub PII, Bearer tokens, and API keys before passing prompt/input payloads to Langfuse or OpenTelemetry spans.'
    },
    {
      id: 'LLM_OBS_EMPTY_METRICS_DIVISION_BY_ZERO',
      severity: 'WARN',
      name: 'Unchecked Division by metrics.length Without Empty-Array Guard',
      regex: /metrics\.reduce\s*\([^)]+\)\s*\/\s*metrics\.length\b/,
      remediation: 'Guard against empty metric arrays (if (metrics.length === 0) return [];) before dividing by metrics.length to avoid NaN alerts.'
    }
  ],
  'vercel-ai-sdk-expert': [
    {
      id: 'VERCEL_AI_TOOLS_WITHOUT_MAX_STEPS',
      severity: 'WARN',
      name: 'Vercel AI SDK streamText/generateText With tools Missing Bounded maxSteps',
      regex: /\b(?:streamText|generateText)\s*\(\s*\{(?![\s\S]{0,450}?\bmaxSteps\s*:)[\s\S]{0,280}?\btools\s*:\s*\{/,
      remediation: 'Specify an explicit maxSteps ceiling (e.g., maxSteps: 5..10) when passing tools to streamText/generateText to bound agentic tool-calling loops.'
    },
    {
      id: 'VERCEL_AI_DEPRECATED_STREAMING_TEXT_RESPONSE',
      severity: 'ERROR',
      name: 'Deprecated AI SDK v2 StreamingTextResponse Class Used',
      regex: /\bnew\s+StreamingTextResponse\s*\(/,
      remediation: 'Replace legacy new StreamingTextResponse() with result.toDataStreamResponse() or result.toTextStreamResponse() from the modern Vercel AI SDK.'
    }
  ],
  'pydantic-ai-expert': [
    {
      id: 'PYDANTIC_AI_RUN_WITHOUT_USAGE_LIMITS',
      severity: 'WARN',
      name: 'Pydantic AI AgentConfigured With Excessive Retries (> 5)',
      regex: /\bAgent\b[\s\S]{0,240}?\bretries\s*=\s*(?:[6-9]|\d{2,})\b/,
      remediation: 'Keep Pydantic AI Agent retries <= 5 and pass UsageLimits(request_limit=..., total_tokens_limit=...) to agent.run() to prevent runaway token loops.'
    },
    {
      id: 'PYDANTIC_AI_RAW_VALUE_ERROR_IN_VALIDATOR',
      severity: 'WARN',
      name: 'Raw ValueError Raised Inside @agent.result_validator Instead of ModelRetry',
      regex: /@\w+\.result_validator[\s\S]{0,300}?\braise\s+ValueError\s*\(/,
      remediation: 'Raise ModelRetry("actionable correction message") inside @agent.result_validator so Pydantic AI feeds the validation error back to the LLM for self-healing.'
    }
  ],
  'saas-billing': [
    {
      id: 'BILLING_WEBHOOK_PARSED_JSON_BEFORE_SIGNATURE',
      severity: 'ERROR',
      name: 'Stripe constructEvent Called With Parsed req.json() Object Instead of Raw Body',
      regex: /stripe\.webhooks\.constructEvent\s*\(\s*(?:await\s+req\.json\(\)|JSON\.stringify\()/,
      remediation: 'Pass the exact unparsed raw request body (await req.text()) to stripe.webhooks.constructEvent() so HMAC signature verification succeeds.'
    },
    {
      id: 'BILLING_INSECURE_MATH_RANDOM_PAYMENT_CODE',
      severity: 'ERROR',
      name: 'Insecure Math.random() Used for Unique Payment Code Generation',
      regex: /\b(?:uniqueCode|paymentCode)\s*=\s*Math\.floor\s*\(\s*Math\.random\s*\(\s*\)/,
      remediation: 'Generate unique payment codes using cryptographically secure crypto.randomInt(1, 1000) instead of predictable Math.random().'
    }
  ],
  'e2e-testing-expert': [
    {
      id: 'PLAYWRIGHT_ARBITRARY_WAIT_FOR_TIMEOUT',
      severity: 'ERROR',
      name: 'Flaky Hardcoded page.waitForTimeout() Sleep in Playwright Test',
      regex: /\bpage\.waitForTimeout\s*\(\s*\d+\s*\)/,
      remediation: 'Eliminate arbitrary page.waitForTimeout() sleeps; use web-first assertions (await expect(locator).toBeVisible()) or deterministic virtual time (page.clock.fastForward).'
    },
    {
      id: 'PLAYWRIGHT_FRAGILE_XPATH_LOCATOR',
      severity: 'WARN',
      name: 'Fragile Absolute XPath Selector Used in Playwright Locator',
      regex: /\bpage\.locator\s*\(\s*['"`](?:xpath=)?\/\/html\/body\//,
      remediation: 'Replace fragile XPath selectors with resilient user-facing locators: page.getByRole(), page.getByLabel(), or toMatchAriaSnapshot().'
    }
  ],
  'property-mutation-testing-expert': [
    {
      id: 'PROP_TEST_DOUBLE_WITHOUT_NO_NAN',
      severity: 'WARN',
      name: 'fast-check fc.double() / fc.float() Arbitrary Without noNaN: true Constraint',
      regex: /\bfc\.(?:double|float)\s*\(\s*\{\s*(?:min|max)\b(?![^}]*\bnoNaN\s*:\s*true)[^}]*\}\s*\)/,
      remediation: 'Include noNaN: true (and noDefaultInfinity: true) in fc.double() / fc.float() options so IEEE-754 NaN values do not falsify algebraic properties.'
    },
    {
      id: 'MUTATION_STRYKER_BREAK_THRESHOLD_DISABLED',
      severity: 'WARN',
      name: 'Stryker Mutation Testing Configured With break: null or break < 50',
      regex: /"thresholds"\s*:\s*\{[^}]*"break"\s*:\s*(?:null|[0-4]?\d)\b/,
      remediation: 'Set Stryker thresholds.break >= 75 (and >= 95 on financial/auth modules) so surviving mutants fail the CI build.'
    }
  ],
  'accessibility-testing-expert': [
    {
      id: 'A11Y_AXE_COLOR_CONTRAST_RULE_DISABLED',
      severity: 'WARN',
      name: 'AxeBuilder Disabling Critical color-contrast Rule in Accessibility Audit',
      regex: /\.disableRules\s*\(\s*\[\s*['"]color-contrast['"]\s*\]\s*\)/,
      remediation: 'Do not disable the WCAG 2.2 AA color-contrast rule in production AxeBuilder audits; fix low-contrast tokens (>= 4.5:1 body text, >= 3:1 large text).'
    },
    {
      id: 'A11Y_NON_SEMANTIC_DIV_ONCLICK_WITHOUT_ROLE',
      severity: 'ERROR',
      name: 'Non-Semantic <div onClick> Without role="button" and tabIndex={0}',
      regex: /<div\b(?![^>]*\brole=["']button["'])(?![^>]*\btabIndex=)[^>]*\bonClick=/,
      remediation: 'Use a semantic <button type="button"> element instead of <div onClick>, or provide role="button", tabIndex={0}, and onKeyDown (Enter/Space) handlers.'
    }
  ],
  'bun-runtime-expert': [
    {
      id: 'BUN_SQL_UNSAFE_INTERPOLATION',
      severity: 'ERROR',
      name: 'Unparameterized String Concatenation in Bun sql.unsafe() Call',
      regex: /\bsql\.unsafe\s*\(\s*`[^`]*\$\{/,
      remediation: 'Use Bun tagged template parameterization (await sql`SELECT * FROM users WHERE id = ${id}`) instead of interpolating values into sql.unsafe().'
    },
    {
      id: 'BUN_SERVE_RAW_ERROR_MESSAGE_LEAK',
      severity: 'WARN',
      name: 'Raw error.message Interpolated in Bun.serve HTTP 500 Response',
      regex: /new\s+Response\s*\(\s*`Internal Server Error:\s*\$\{error\.message\}`/,
      remediation: 'Log internal errors on the server and return a structured RFC 9457 Problem Details JSON response without leaking error.message.'
    }
  ],
  'cloudflare-workers-expert': [
    {
      id: 'CF_D1_UNBOUND_INTERPOLATED_SQL',
      severity: 'ERROR',
      name: 'Unparameterized Template String Passed to Cloudflare D1 .prepare() / .exec()',
      regex: /\.DB\.(?:prepare|exec)\s*\(\s*`[^`]*\$\{/,
      remediation: 'Always use positional "?" placeholders with .prepare("SELECT ... WHERE id = ?").bind(id) on Cloudflare D1 to prevent SQL injection.'
    },
    {
      id: 'CF_HONO_OBJECT_SPREAD_LOSING_FETCH',
      severity: 'ERROR',
      name: 'Spreading Hono Instance ({ ...app, queue }) Loses Prototype app.fetch Handler',
      regex: /export\s+default\s+\{\s*\.\.\.app\s*,/,
      remediation: 'Export { fetch: app.fetch, queue(batch, env, ctx) { ... } } instead of spreading { ...app } so the Hono fetch prototype method is preserved.'
    }
  ],
  'wasm-edge-computing-expert': [
    {
      id: 'WASM_UNBOUNDED_MEMORY_WITHOUT_MAXIMUM',
      severity: 'WARN',
      name: 'WebAssembly.Memory Instantiated Without Explicit maximum Page Limit',
      regex: /new\s+WebAssembly\.Memory\s*\(\s*\{\s*initial\s*:\s*\d+\s*\}\s*\)/,
      remediation: 'Specify an explicit maximum page cap in new WebAssembly.Memory({ initial, maximum }) to prevent unbounded linear memory growth.'
    },
    {
      id: 'WASM_SYNC_INSTANTIATE_ON_MAIN_THREAD',
      severity: 'WARN',
      name: 'Synchronous new WebAssembly.Instance / Module Compilation on Main Thread',
      regex: /\bnew\s+WebAssembly\.(?:Instance|Module)\s*\(/,
      remediation: 'Compile and instantiate WASM asynchronously via WebAssembly.instantiateStreaming() inside a dedicated Web Worker.'
    }
  ],
  'tauri-expert': [
    {
      id: 'TAURI_WILDCARD_PERMISSION_GRANT',
      severity: 'ERROR',
      name: 'Unconditional PermissionState::Granted Returned in Tauri on_permission_request',
      regex: /\.on_permission_request\s*\(\s*\|[^|]*\|[\s\S]{0,140}?PermissionState::Granted\s*\}\s*\)(?![\s\S]{0,40}?Denied)/,
      remediation: 'Match request.permission() against an explicit least-privilege allowlist and return PermissionState::Denied by default.'
    },
    {
      id: 'TAURI_CAPABILITY_DANGEROUS_SHELL_EXECUTE',
      severity: 'ERROR',
      name: 'Unscoped shell:allow-execute or fs:allow-all Permission in Tauri Capability',
      regex: /"(?:shell:allow-execute|fs:allow-all)"/,
      remediation: 'Replace broad shell:allow-execute or fs:allow-all capabilities with scoped Rust #[tauri::command] handlers and canonicalized app_data_dir paths.'
    }
  ],
  'mobile-expo-expert': [
    {
      id: 'EXPO_PLAINTEXT_ASYNC_STORAGE_TOKEN',
      severity: 'ERROR',
      name: 'Sensitive Auth/Refresh Token Stored in Unencrypted AsyncStorage',
      regex: /AsyncStorage\.setItem\s*\(\s*['"][^'"]*(?:token|jwt|secret|password)['"]/i,
      remediation: 'Store tokens and secrets in hardware-backed expo-secure-store (SecureStore.setItemAsync with WHEN_UNLOCKED_THIS_DEVICE_ONLY) instead of plaintext AsyncStorage.'
    },
    {
      id: 'EXPO_SCROLLVIEW_ARRAY_MAP_ANTI_PATTERN',
      severity: 'WARN',
      name: 'Dynamic Array .map() Rendered Directly Inside React Native <ScrollView>',
      regex: /<ScrollView[^>]*>[\s\S]{0,240}?\.map\s*\(/,
      remediation: 'Replace <ScrollView>{items.map(...)}</ScrollView> with virtualized <FlashList estimatedItemSize={...} /> or <FlatList />.'
    }
  ],
  'flutter-dart-expert': [
    {
      id: 'FLUTTER_DOUBLE_USED_FOR_CURRENCY',
      severity: 'WARN',
      name: 'IEEE-754 double Field Used for Monetary Price/Amount in Dart Model',
      regex: /\brequired\s+double\s+(?:price|amount|balance|total)\b/,
      remediation: 'Represent monetary amounts in Dart models as integer minor units (required int priceCents / amountIdr) to avoid floating-point rounding drift.'
    },
    {
      id: 'FLUTTER_LISTVIEW_CHILDREN_MAP_EAGER',
      severity: 'WARN',
      name: 'Eager ListView(children: items.map().toList()) Instantiating All Offscreen Widgets',
      regex: /\bListView\s*\(\s*children\s*:\s*\w+\.map\s*\(/,
      remediation: 'Use lazy ListView.builder(itemCount: items.length, itemBuilder: ...) or SliverList.builder for dynamic collections.'
    }
  ],
  'web-3d-graphics-expert': [
    {
      id: 'WEB3D_ALLOCATION_INSIDE_RENDER_LOOP',
      severity: 'ERROR',
      name: 'Heap Allocation (new THREE.Vector3 / Matrix4 / Color) Inside Animation Loop',
      regex: /(?:setAnimationLoop|useFrame|runRenderLoop)\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]{0,320}?\bnew\s+(?:THREE\.)?(?:Vector[234]|Matrix[34]|Quaternion|Color)\s*\(/,
      remediation: 'Pre-allocate scratch Vector3/Matrix4/Quaternion/Color instances outside setAnimationLoop / useFrame and mutate them with .set() / .copy().'
    },
    {
      id: 'WEB3D_UNCLAMPED_DEVICE_PIXEL_RATIO',
      severity: 'WARN',
      name: 'Unclamped window.devicePixelRatio Passed Directly to setPixelRatio()',
      regex: /\.setPixelRatio\s*\(\s*window\.devicePixelRatio\s*\)/,
      remediation: 'Clamp devicePixelRatio with renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) to prevent GPU fill-rate collapse on 3x/4x mobile screens.'
    }
  ],
  'astro-framework-expert': [
    {
      id: 'ASTRO_CLIENT_LOAD_OVERUSE',
      severity: 'WARN',
      name: 'Overuse of client:load on Static Content Islands',
      regex: /<[A-Z]\w+[^>]*\bclient:load\b(?![\s\S]{0,150}?\b(?:Menu|Nav|Auth|Modal|Cart|Drawer)\b)/,
      remediation: 'Default to zero JavaScript. Prefer client:visible or client:idle for below-the-fold or non-critical interactive islands instead of eager client:load.'
    },
    {
      id: 'ASTRO_CONTENT_COLLECTION_MISSING_ZOD_SCHEMA',
      severity: 'ERROR',
      name: 'Astro Content Collection Defined Without Strict Zod Schema',
      regex: /defineCollection\s*\(\s*\{[\s\S]{0,200}?(?![\s\S]{0,150}?\bschema\s*:\s*z\.)[\s\S]{0,200}?\}\s*\)/,
      remediation: 'Every Astro content collection must declare a strict Zod schema (schema: z.object({ ... })) for type-safe frontmatter validation.'
    }
  ],
  'glsl-shader-expert': [
    {
      id: 'SHADER_DIVERGENT_BRANCH_IN_FRAGMENT',
      severity: 'WARN',
      name: 'Divergent if/else Branch Inside Fragment Shader Calculation',
      regex: /(?:gl_FragColor|fragColor|outputColor)[\s\S]{0,100}?if\s*\([^)]+\)\s*\{[\s\S]{0,80}?\}\s*else/m,
      remediation: 'Avoid divergent if/else branches on GPU warps. Use branchless step(), smoothstep(), mix(), or WGSL select() for constant execution time.'
    },
    {
      id: 'WGSL_UNALIGNED_STORAGE_STRUCT',
      severity: 'ERROR',
      name: 'WGSL Struct Missing Required 16-Byte Padding / Vector Alignment',
      regex: /struct\s+\w+\s*\{[\s\S]{0,200}?\bvec3<f32>[\s\S]{0,100}?(?!\b(?:pad\d*|align\(16\)|vec4<f32>))\}/,
      remediation: 'In WebGPU WGSL, struct members matching vec3<f32> have 16-byte alignment requirements. Add an explicit scalar f32 pad field or use vec4<f32>.'
    }
  ],
  'webxr-ar-vr-expert': [
    {
      id: 'WEBXR_HIT_TEST_SPAWN_WITHOUT_RESULT_CHECK',
      severity: 'ERROR',
      name: 'WebXR Object Spawned Without Hit-Test Verification',
      regex: /onHitTestResultObservable\.add\s*\(\s*\([^)]*\)\s*=>\s*\{[\s\S]{0,200}?(?![\s\S]{0,100}?\b(?:results\.length\s*>\s*0|results\[0\]))\bCreate(?:Box|Sphere|Mesh)\b/m,
      remediation: 'Always verify results.length > 0 and decompose the transform matrix before spawning AR objects at hit-test coordinates.'
    },
    {
      id: 'WEBXR_MISSING_FOVEATION_ON_MOBILE_XR',
      severity: 'WARN',
      name: 'WebXR Mobile Experience Missing Fixed Foveated Rendering (FFR)',
      regex: /createDefaultXRExperienceAsync\s*\([\s\S]{0,350}?\)(?![\s\S]{0,300}?\bFOVEATION\b)/m,
      remediation: 'Enable WebXRFeatureName.FOVEATION (level 1-3) on mobile headsets like Meta Quest to prevent GPU thermal throttling and frame drops.'
    }
  ],
  'post-quantum-crypto-migrator': [
    {
      id: 'PQC_INSECURE_STATIC_PRIME_ECDH',
      severity: 'ERROR',
      name: 'Vulnerable Classical Prime256v1 ECDH Without Post-Quantum Hybrid Combiner',
      regex: /createECDH\s*\(\s*['"]prime256v1['"]\s*\)(?![\s\S]{0,250}?\b(?:ML-KEM|mlkem|hybrid|HKDF|hkdf)\b)/i,
      remediation: 'Classical prime256v1 is vulnerable to Harvest Now, Decrypt Later. Combine with FIPS 203 ML-KEM-768 using dual-combiner HKDF-SHA256.'
    },
    {
      id: 'PQC_SIGNATURE_TIMING_NON_CONSTANT',
      severity: 'ERROR',
      name: 'Non-Constant-Time PQC / Classical Digital Signature Comparison',
      regex: /pqcSignature\s*===?\s*\w+|\w+\s*===?\s*pqcSignature/,
      remediation: 'Verify digital signatures and KEM shared secrets using crypto.timingSafeEqual with preliminary byte-length checks.'
    }
  ],
  'ai-llm-integration-expert': [
    {
      id: 'AI_LLM_PROMPT_INJECTION_UNSANITIZED_INTERPOLATION',
      severity: 'WARN',
      name: 'Unsanitized Variable Interpolation in LLM Prompt Template',
      regex: /messages\s*:\s*\[\s*\{[\s\S]{0,60}?role\s*:\s*['"](?:user|system)['"]\s*,\s*content\s*:\s*`[^`]*\$\{[^}]+\}/,
      remediation: 'Pass variables as discrete structured parameters or filter through prompt-injection-firewall before string interpolation.'
    },
    {
      id: 'AI_LLM_MISSING_STRUCTURED_OUTPUT_SCHEMA',
      severity: 'WARN',
      name: 'LLM Structured Output Generation Without Schema / Grammar Mask',
      regex: /\b(?:generateObject|generateText)\s*\(\s*\{(?![\s\S]{0,300}?\b(?:schema|response_format|json_schema)\b)[\s\S]{0,300}?model\s*:/,
      remediation: 'Attach an explicit Zod schema or response_format: { type: "json_schema" } to guarantee structured LLM outputs via token-level grammar masks.'
    }
  ],
  'agentic-memory-architect': [
    {
      id: 'AGENTIC_MEMORY_UNSCOPED_LOOKUP',
      severity: 'ERROR',
      name: 'Agentic Memory Search Executed Without Tenancy / User Scope',
      regex: /\b(?:mem0|zep|letta)\.(?:search|get|getMemory)\s*\(\s*['"][^'"]+['"]\s*\)(?![\s\S]{0,100}?user_id)/,
      remediation: 'Scope memory lookups explicitly with a user_id or tenant_id (e.g. mem0.search(query, { user_id })) to prevent cross-tenant data leakage.'
    },
    {
      id: 'AGENTIC_MEMORY_UNRESTRICTED_COSINE_SIMILARITY',
      severity: 'WARN',
      name: 'Vector Memory Retrieval Without Minimum Similarity Threshold',
      regex: /ORDER\s+BY\s+[\w.]+\s*<\s*=>\s*[\w$]+(?:\s+ASC)?\s+LIMIT(?![\s\S]{0,200}?similarity\s*(?:>|>=)\s*0\.\d+)/i,
      remediation: 'Enforce a minimum cosine similarity threshold (e.g. similarity >= 0.70) to prevent low-relevance hallucinations from polluting the context window.'
    }
  ],
  'agentic-m2m-settlement': [
    {
      id: 'M2M_SETTLEMENT_UNLOCKED_BALANCE_MUTATION',
      severity: 'ERROR',
      name: 'Agent Wallet Balance Mutation Without Pessimistic Row Lock',
      regex: /UPDATE\s+agent_wallets\s+SET\s+balance_minor\s*=(?![\s\S]{0,400}?FOR\s+UPDATE)/i,
      remediation: 'Execute balance mutations within a transaction locking the target wallet row (SELECT ... FOR UPDATE) to eliminate race conditions and double-spending.'
    },
    {
      id: 'M2M_SETTLEMENT_FLOAT_ARITHMETIC',
      severity: 'ERROR',
      name: 'M2M Settlement Using Floating Point Currency Math',
      regex: /(?:parseFloat|Number)\s*\(\s*(?:amount|balance|fee|tariff)\s*\)\s*(?:\*|\/|\+|-)/,
      remediation: 'Perform all agentic financial calculations in integer minor units (BigInt or NUMERIC(20, 0)) to avoid IEEE 754 precision loss.'
    }
  ],
  'agentic-micro-economy-architect': [
    {
      id: 'MICRO_ECONOMY_MISSING_KILLSWITCH',
      severity: 'WARN',
      name: 'Micro-Economy Treasury Dispatch Without Emergency Killswitch',
      regex: /class\s+\w*Treasury\w*[\s\S]{0,400}?(?![\s\S]{0,400}?\b(?:killswitch|halt|freeze|circuitBreaker)\b)allocateBudget\s*\(/,
      remediation: 'Include an automated killswitch check in the root treasury manager to halt agent spending immediately upon budget breach or anomaly detection.'
    },
    {
      id: 'MICRO_ECONOMY_HTTP_402_NO_EXPIRATION',
      severity: 'WARN',
      name: 'HTTP 402 Payment Challenge Without Strict Expiration Window',
      regex: /create402Challenge\s*\(\s*\{(?![\s\S]{0,250}?\b(?:expiresAt|expiry|maxAge)\b)/,
      remediation: 'Include a cryptographically signed expiresAt timestamp (max 30 seconds) on HTTP 402 challenges to prevent payment replay attacks.'
    }
  ],
  'multi-agent-orchestration': [
    {
      id: 'MULTI_AGENT_UNBOUNDED_SUBAGENT_RECURSION',
      severity: 'ERROR',
      name: 'Subagent Invocation Without Recursion / Hop Depth Limit',
      regex: /function\s+dispatchSubagent\s*\([^)]*\)\s*\{(?![\s\S]{0,300}?\b(?:maxDepth|depth\s*>|hopCount)\b)/,
      remediation: 'Enforce a strict maximum recursion depth (maxDepth <= 4) on subagent delegation to prevent infinite agent dispatch loops.'
    },
    {
      id: 'MULTI_AGENT_DESTRUCTIVE_TOOL_WITHOUT_HITL',
      severity: 'ERROR',
      name: 'Subagent Granted Destructive Tool Execution Without Human-in-the-Loop',
      regex: /tools\s*:\s*\[[^\]]*(?:dropDatabase|deleteProductionData|executeRawShell)[^\]]*\](?![\s\S]{0,200}?\b(?:human_input\s*:\s*true|requireApproval\s*:\s*true)\b)/,
      remediation: 'Enforce human_input: true or explicit HITL approval gates before granting subagents destructive file, database, or shell tools.'
    }
  ],
  'api-design-expert': [
    {
      id: 'API_DESIGN_RAW_ERROR_MESSAGE_LEAK',
      severity: 'WARN',
      name: 'API Error Response Leaking Raw Error Message Instead of RFC 9457',
      regex: /res\.status\s*\(\s*(?:500|400|404|422)\s*\)\.json\s*\(\s*\{\s*(?:error|message)\s*:\s*err\.message\s*\}\s*\)/,
      remediation: 'Wrap error responses in RFC 9457 Problem Details ({ type, title, status, detail }) and avoid leaking raw err.message or stack traces.'
    },
    {
      id: 'API_DESIGN_MISSING_IDEMPOTENCY_KEY_ON_MUTATION',
      severity: 'WARN',
      name: 'Payment/Mutation Route Handler Missing Idempotency-Key Check',
      regex: /app\.post\s*\(\s*['"]\/(?:api\/v\d+\/)?(?:payments|charges|transfers|payouts)['"][\s\S]{0,250}?\((?:req|request),\s*(?:res|response)\)[\s\S]{0,250}?\{(?![\s\S]{0,300}?idempotency-key)/i,
      remediation: 'Verify and validate the Idempotency-Key header on critical mutation and financial transaction endpoints.'
    }
  ],
  'spec-driven-development-expert': [
    {
      id: 'SPEC_DRIVEN_UNVALIDATED_REQUEST_BODY',
      severity: 'WARN',
      name: 'Route Handler Consuming Request Body Without Schema Parse',
      regex: /(?:const|let)\s+\w+\s*=\s*await\s+req\.json\(\);(?![\s\S]{0,150}?\.(?:parse|safeParse)\()/,
      remediation: 'Parse request payloads through generated TypeSpec / Zod contract schemas (.parse(body)) before accessing entity properties.'
    },
    {
      id: 'SPEC_DRIVEN_TYPE_CAST_BYPASS',
      severity: 'ERROR',
      name: 'Contract Specification Bypassed With Force Type-Casting',
      regex: /\bas\s+unknown\s+as\s+[A-Z]\w*|\bas\s+any\b/,
      remediation: 'Do not bypass generated OpenAPI / TypeSpec type contracts with "as any" or "as unknown as T"; ensure data conform to schemas.'
    }
  ],
  'saas-architect': [
    {
      id: 'SAAS_SUPERADMIN_UNPROTECTED_SUBDOMAIN',
      severity: 'ERROR',
      name: 'Super Admin Route Handler Missing Role / MFA Gate',
      regex: /export\s+async\s+function\s+(?:GET|POST|PUT|DELETE)\s*\([^)]*\)[\s\S]{0,300}?\/super-admin(?![\s\S]{0,300}?\b(?:isSuperAdmin|requireSuperAdmin|role\s*===?\s*['"]super_admin['"])\b)/,
      remediation: 'Gate all super-admin endpoints with strict role checks (isSuperAdmin) and multi-factor authentication on dedicated admin subdomains.'
    },
    {
      id: 'SAAS_MISSING_PRIVACY_TERMS_LEGAL_TRIO',
      severity: 'WARN',
      name: 'SaaS App Scaffold Missing Mandatory Privacy / Data Deletion Routes',
      regex: /createSaaSApp\s*\(\s*\{(?![\s\S]{0,300}?\b(?:privacyPolicy|termsOfService|dataDeletion)\b)/,
      remediation: 'Implement the mandatory legal trio (/terms, /privacy, and /delete-account) required by UU PDP, GDPR Art. 17, and app store policies.'
    }
  ],
  'vector-db-rag-expert': [
    {
      id: 'VECTOR_RAG_NAIVE_SCORE_SUMMATION',
      severity: 'WARN',
      name: 'Naive Addition of BM25 Lexical and Vector Cosine Scores Without RRF',
      regex: /\bbm25Score\s*\+\s*(?:vectorScore|cosineSimilarity)\b/,
      remediation: 'Combine lexical and vector search scores using Reciprocal Rank Fusion (RRF: 1 / (60 + rank)) or normalized score distributions.'
    },
    {
      id: 'VECTOR_RAG_MISSING_TENANT_ISOLATION',
      severity: 'ERROR',
      name: 'Vector Search Query Missing Tenant / Workspace Scope',
      regex: /SELECT\s+[\s\S]+?FROM\s+(?:document_embeddings|vector_store|embeddings)[\s\S]{0,120}?(?![\s\S]{0,150}?\btenant_id\b)ORDER\s+BY/i,
      remediation: 'Scope vector similarity queries with a tenant_id or workspace_id WHERE filter to prevent cross-tenant vector leakage.'
    }
  ],
  'frontier-ai-models-expert': [
    {
      id: 'FRONTIER_AI_UNBOUNDED_REASONING_BUDGET',
      severity: 'WARN',
      name: 'Extended Thinking Enabled Without Explicit Budget Tokens Limit',
      regex: /thinking\s*:\s*\{\s*type\s*:\s*['"]enabled['"]\s*\}(?![\s\S]{0,50}?\bbudget_tokens\b)/,
      remediation: 'Specify budget_tokens when enabling extended thinking on frontier models (e.g. Claude Sonnet 5.5) to control latency and token costs.'
    },
    {
      id: 'FRONTIER_AI_HARDCODED_UNFALLBACKABLE_MODEL',
      severity: 'WARN',
      name: 'Hardcoded Frontier Model Call Without Availability Fallback',
      regex: /model\s*:\s*['"](?:gemini-4-argon|claude-opus-5\.5)['"](?![\s\S]{0,150}?\b(?:fallback|fallbackModel)\b)/,
      remediation: 'Configure an explicit availability fallback (e.g. gemini-3.8-flash or claude-opus-4.6) for frontier models that may be unprovisioned.'
    }
  ],
  'ai-prompt-engineering-expert': [
    {
      id: 'PROMPT_ENG_UNENCLOSED_USER_VARIABLE',
      severity: 'WARN',
      name: 'Untrusted User Variable Injected Without XML Structural Tag',
      regex: /prompt\s*:\s*`[\s\S]{0,100}?User question:\s*\$\{[^}]+\}`/,
      remediation: 'Enclose untrusted user inputs in explicit XML structural tags (<user_input>...</user_input>) and instruct the model to treat contents strictly as data.'
    },
    {
      id: 'PROMPT_ENG_REGEX_JSON_EXTRACTION',
      severity: 'WARN',
      name: 'Brittle Regex Markdown Parsing Instead of Structured Output Schema',
      regex: /JSON\.parse\s*\(\s*(?:text|res|response|output)\.match\s*\(\s*\/```json/,
      remediation: 'Use native token-level grammar masks (response_format: { type: "json_schema" }) or structured tool calling rather than brittle regex markdown parsing.'
    }
  ],
  'context-window-engineer': [
    {
      id: 'CONTEXT_WINDOW_UNCHECKED_INJECTION',
      severity: 'ERROR',
      name: 'Unchecked Bulk Codebase Dump in System Context Prompt',
      regex: /messages\s*:\s*\[[\s\S]{0,60}?role\s*:\s*['"]system['"][\s\S]{0,60}?content\s*:\s*(?:entireCodebase|allFilesContent|rawRepoDump)\b/,
      remediation: 'Do not dump unbounded raw file contents into system prompts; partition context into structured zones with relevance scoring and token budgets.'
    },
    {
      id: 'CONTEXT_WINDOW_UNBOUNDED_HISTORY_APPEND',
      severity: 'WARN',
      name: 'Unbounded Conversation History Accumulation Without Sliding Window',
      regex: /history\.push\s*\(\s*\{[\s\S]{0,50}?role[\s\S]{0,50}?content[\s\S]{0,50}?\}\s*\);(?![\s\S]{0,200}?(?:slice|prune|summarize|slidingWindow))/,
      remediation: 'Apply a sliding window or summarization strategy before appending unbounded conversation turns to prevent context window exhaustion.'
    }
  ],
  'llm-finops-router': [
    {
      id: 'FINOPS_UNTRACKED_MODEL_CALL',
      severity: 'WARN',
      name: 'Outbound LLM Call Executed Without Cost Telemetry Tracking',
      regex: /\b(?:openai|anthropic|litellm)\.(?:chat\.completions|messages)\.create\s*\(\s*\{(?![\s\S]{0,250}?\b(?:trackAndCheckBudget|calculateCost|metadata|user_id)\b)/,
      remediation: 'Record cost telemetry (user_id, model, tokens, costUSD) on all LLM calls and verify budget caps before dispatch.'
    },
    {
      id: 'FINOPS_FLOAT_BUDGET_CALCULATION',
      severity: 'WARN',
      name: 'Financial Budget Accumulation Using Floating Point Arithmetic',
      regex: /dailySpent\s*\+=\s*(?:parseFloat|Number)\s*\(/,
      remediation: 'Track token budgets and financial expenses in minor units or using deterministic decimal arithmetic to prevent floating-point drift.'
    }
  ],
  'design-system-architect': [
    {
      id: 'DESIGN_SYSTEM_DIV_AS_BUTTON',
      severity: 'ERROR',
      name: 'Generic <div> Used as Clickable Button Primitives',
      regex: /<div\s+[^>]*onClick\s*=\s*\{[^}]+\}[^>]*className\s*=\s*['"][^'"]*btn/i,
      remediation: 'Use semantic <button> or headless primitives (Base UI, Radix) instead of <div onClick> to guarantee keyboard focus, aria-disabled, and accessibility.'
    },
    {
      id: 'DESIGN_SYSTEM_VIEWPORT_MEDIA_IN_COMPONENT',
      severity: 'WARN',
      name: 'Viewport @media Query Used for Component-Internal Styling',
      regex: /@media\s*\(\s*min-width\s*:\s*\d+px\s*\)[\s\S]{0,100}?\.card/,
      remediation: 'Use Container Queries (@container / @md:) instead of viewport @media queries for component-internal responsive layouts.'
    }
  ],
  'ui-ux-pro-max': [
    {
      id: 'UI_UX_MULTIPLE_PRIMARY_BUTTONS',
      severity: 'WARN',
      name: 'Multiple Primary CTA Buttons in Single Viewport View',
      regex: /<Button[^>]+variant=['"]primary['"][^>]*>[\s\S]{0,150}?<\/Button>[\s\S]{0,150}?<Button[^>]+variant=['"]primary['"][^>]*>/,
      remediation: 'Limit to at most ONE Primary CTA button per view to prevent cognitive choice paralysis; secondary actions should use outline or tonal variants.'
    },
    {
      id: 'UI_UX_METRIC_WITHOUT_TABULAR_NUMS',
      severity: 'WARN',
      name: 'Large Numeric KPI / Metric Display Missing tabular-nums',
      regex: /<div\s+className=['"][^'"]*text-[2345]xl[^'"]*font-bold[^'"]*['"]>\s*\{?\s*(?:price|amount|balance|latency|count|metric)\b(?![\s\S]{0,60}?tabular-nums)/,
      remediation: 'Declare tabular-nums on large metric displays and financial figures to prevent layout shift during state changes.'
    }
  ],
  'browser-automation-expert': [
    {
      id: 'BROWSER_AUTOMATION_ORPHANED_BROWSER_INSTANCE',
      severity: 'ERROR',
      name: 'Browser Instance Launched Without Deterministic finally { close() }',
      regex: /const\s+browser\s*=\s*await\s+(?:chromium|firefox|webkit|puppeteer)\.launch\s*\([^)]*\);(?![\s\S]{0,500}?\bfinally\s*\{[\s\S]{0,100}?browser\.close\(\))/,
      remediation: 'Always close browser instances inside a finally block (finally { await browser.close(); }) to prevent memory leaks and zombie processes.'
    },
    {
      id: 'BROWSER_AUTOMATION_RAW_STRING_EXTRACTION',
      severity: 'WARN',
      name: 'Web Data Extraction Without Strict Zod Schema Validation',
      regex: /await\s+page\.extract\s*\(\s*\{(?![\s\S]{0,150}?\bschema\b)[\s\S]{0,150}?instruction\s*:/,
      remediation: 'Provide a strict Zod schema in page.extract({ instruction, schema: z.object(...) }) to ensure structured type-safe extraction.'
    }
  ],
  'browser-extension-mv3-pro': [
    {
      id: 'MV3_REMOTE_SCRIPT_OR_EVAL_USAGE',
      severity: 'ERROR',
      name: 'Dynamic Script Evaluation or Remote CDN Script in Manifest V3',
      regex: /\beval\s*\(|new\s+Function\s*\(|https:\/\/(?:cdn|unpkg|cdnjs)\.com/i,
      remediation: 'Manifest V3 strictly prohibits dynamic code execution (eval, new Function) and external CDN scripts. Bundle all dependencies locally.'
    },
    {
      id: 'MV3_ASYNC_MESSAGE_MISSING_RETURN_TRUE',
      severity: 'WARN',
      name: 'Asynchronous Chrome Message Listener Missing "return true;"',
      regex: /chrome\.runtime\.onMessage\.addListener\s*\(\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{[\s\S]{0,300}?sendResponse\s*\([^)]*\);(?![\s\S]{0,100}?return\s+true\b)/,
      remediation: 'Return true from chrome.runtime.onMessage listeners when handling responses asynchronously to keep the message channel open.'
    }
  ],
  'ecommerce-expert': [
    {
      id: 'ECOMMERCE_UNPROTECTED_STOCK_DECREMENT',
      severity: 'ERROR',
      name: 'Unconditional Stock Decrement Without Available Quantity Check',
      regex: /UPDATE\s+(?:products|inventory|variants)\s+SET\s+stock\s*=\s*stock\s*-\s*\$1(?![\s\S]{0,100}?WHERE[\s\S]{0,100}?stock\s*>=\s*\$1)/i,
      remediation: 'Include an atomic condition (WHERE stock >= $1) or acquire a pessimistic row lock (SELECT ... FOR UPDATE) when decrementing inventory.'
    },
    {
      id: 'ECOMMERCE_FLOAT_CURRENCY_OPERATION',
      severity: 'WARN',
      name: 'Cart Total Computed Using Floating Point Arithmetic',
      regex: /(?:totalPrice|cartTotal|subtotal)\s*=\s*(?:parseFloat|Number)\s*\(/,
      remediation: 'Compute shopping cart totals, shipping fees, and taxes using integer minor units (cents / sen) rather than floating-point numbers.'
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
  { ext: ['.ts', '.js'], imports: ['doku', 'snap-bi', 'stripe'], skills: ['doku-payment-gateway', 'payment-gateway-expert', 'double-entry-ledger-fintech-expert'] },
  { ext: ['.lean'], imports: ['import Mathlib', 'import Std.Tactic'], skills: ['formal-theorem-verifier-lean4', 'formal-spec-z3-verifier'] },
  { ext: [], imports: ['@clickhouse/client', '@duckdb/node-api', '@duckdb/duckdb-wasm', 'read_parquet(', 'MergeTree', 'iceberg_scan('], skills: ['olap-columnar-analytics-expert', 'data-pipeline-etl-expert'] },
  { ext: [], imports: ['runs-on:', 'cosign ', 'attest-build-provenance', 'cyclonedx', 'openvex'], skills: ['sbom-supply-chain-security-expert', 'github-actions-expert'] },
  { ext: [], imports: ['apiVersion: apps/v1', 'gateway.networking.k8s.io', 'karpenter.sh', 'argoproj.io', 'cilium.io'], skills: ['kubernetes-gitops-platform-expert'] },
  { ext: [], imports: ['@electric-sql/client', '@electric-sql/pglite', '@rocicorp/zero', '@sqlite.org/sqlite-wasm'], skills: ['reactive-sync-engine-expert', 'pwa-offline-first-expert'] },
  { ext: [], imports: ["from 'yjs'", '@hocuspocus/server', '@hocuspocus/provider', 'loro-crdt', 'y-protocols'], skills: ['realtime-collaboration-expert'] },
  { ext: ['.fga'], imports: ['@openfga/sdk', 'OpenFgaClient'], skills: ['fga-rebac-authorization-expert'] },
  { ext: [], imports: ['@simplewebauthn/server', '@simplewebauthn/browser', 'navigator.credentials.'], skills: ['passkeys-webauthn-identity-expert', 'authentication-identity-expert'] }
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

  // Remove Orchestration & Integration blocks so cross-skill metadata links do not pollute domain mandates
  const enWithoutOrchestration = enSection.replace(
    /###?\s+Orchestration\s*&\s*Integration[\s\S]*?(?=\r?\n###?\s+(?!Orchestration)|$)/gi,
    ''
  );

  // Extract bullet points under Hard Guardrails / Best Practices / Technical Guidelines / Checklists
  const guidelineBullets = [];
  const seenTitles = new Set();
  const skipTitleRegex = /^(English|Bahasa Indonesia|Frontier Model|Availability Fallback|KV-Cache|SaaT CLI|NFR\s*&|Upstream Orchestrators|Downstream Cooperating|Cross-Domain Synergy|Formal Mathematical|MANDATORY)$/i;

  const pushMandate = (rawTitle, rawDetail) => {
    const title = rawTitle.replace(/^[`*\s]+|[`*\s:]+$/g, '').trim();
    const detail = rawDetail.replace(/^\s*[:—-]\s*/, '').trim();
    if (!title || !detail || detail.length < 8) return;
    if (skipTitleRegex.test(title) || seenTitles.has(title.toLowerCase())) return;
    if (guidelineBullets.length < 8) {
      seenTitles.add(title.toLowerCase());
      guidelineBullets.push({ rule: title, mandate: detail });
    }
  };

  // 1. Standard bold bullets & checkbox bullets: - **Rule**: detail or - [ ] **Rule**: detail
  const bulletRegex = /^\s*(?:[-*]|\d+\.)\s+(?:\[[ xX]\]\s+)?\*\*([^*]+)\*\*[:\s—-]*([^\r\n]+)/gm;
  let match;
  while ((match = bulletRegex.exec(enWithoutOrchestration)) !== null) {
    pushMandate(match[1], match[2]);
  }

  // 2. Fallback: Markdown table rows with bold first column (excluding Sovereign Execution Matrix headers)
  if (guidelineBullets.length < 5) {
    const tableRowRegex = /^\|\s*\*\*([^|*]+)\*\*\s*\|\s*([^|\r\n]+)\|/gm;
    while ((match = tableRowRegex.exec(enWithoutOrchestration)) !== null) {
      pushMandate(match[1], match[2]);
    }
  }

  // 3. Fallback: Numbered technical guideline headings (### 1. Title / #### 1. Title) followed by prose
  if (guidelineBullets.length < 5) {
    const headingRuleRegex = /^#{2,4}\s+(?:\d+\.\s+|Strategy\s+\d+:\s*)([^\r\n]+)\r?\n+([^\r\n#`|>-][^\r\n]{15,})/gm;
    while ((match = headingRuleRegex.exec(enWithoutOrchestration)) !== null) {
      pushMandate(match[1], match[2]);
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

