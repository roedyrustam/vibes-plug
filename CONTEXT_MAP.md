# 🗺️ Subagent Context Map: Skill-as-a-Tool (SaaT) Contracts
**Target**: Downstream Subagents (`fullstack-craftsman`, `quality-guardian`, `swarm-architect`)  
**Scope**: High-density contract slice; zero unnecessary token waste  

---

## 1. Core TypeScript Type Contracts

```typescript
export type SkillDomain = 
  | 'discovery'
  | 'ui-ux'
  | 'frontend'
  | 'mobile-desktop'
  | 'backend-runtimes'
  | 'api-contracts'
  | 'database-storage'
  | 'architecture-scale'
  | 'ai-llm'
  | 'saas-fintech'
  | 'testing-security'
  | 'devops-cicd';

export interface SkillActionRequest {
  skill: string;             // e.g. "database-orm-expert", "tailwind-expert"
  action: string;            // e.g. "eval", "audit", "generate", "verify", "fuzz"
  payload: Record<string, unknown>;
  options?: {
    format?: 'json' | 'table' | 'pretty';
    strict?: boolean;
    timeoutMs?: number;
  };
}

export interface SkillActionResponse<T = unknown> {
  status: 'success' | 'failure';
  skill: string;
  action: string;
  durationMs: number;
  telemetry?: {
    fullSkillTokens: number;
    responseTokens: number;
    tokensSaved: number;
    tokenReductionPercent: string;
    estimatedSavingsUsd: number;
  };
  result?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface SkillAdapter {
  domain: SkillDomain;
  supportedSkills: string[];
  supportedActions: string[];
  execute(action: string, payload: Record<string, unknown>): Promise<unknown>;
}
```

---

## 2. Downstream Delegation Matrix (8 Native Subagents <-> 8 Domain Adapters)

| Subagent Role | Bound Domain Adapter | Assigned Implementation & Verification Scope |
| :--- | :--- | :--- |
| **`fullstack-craftsman`** | `frontend.mjs`, `api.mjs` | OKLCH `@theme` tokens, 5-state UI contracts, OpenAPI 3.1 & Hono RPC verification. |
| **`data-rag-architect`** | `database.mjs` | PostgreSQL DDL, multi-tenant RLS policies, pgvector HNSW, and foreign-key indexing. |
| **`quality-guardian`** | `tdd.mjs`, `security.mjs` | Ephemeral micro-sandbox execution, Critic-in-the-Loop quality gates, and OWASP fuzzing. |
| **`fintech-payment-sentinel`** | `security.mjs`, `database.mjs` | DOKU SNAP BI signature checks, immutable double-entry ledger invariants, and PQC. |
| **`ai-mcp-engineer`** | `ai-mcp.mjs`, `skill-dispatcher.mjs` | FastMCP tool schemas, A2A Agent Cards, KV-cache prefix locking, and `.skill-slices.json`. |
| **`cloud-devops-sre`** | `cloud-devops.mjs` | Rootless distroless Dockerfiles, Kubernetes GitOps manifests, and CycloneDX SBOMs. |
| **`mobile-spatial-craftsman`** | `mobile-spatial.mjs` | Expo SDK 53, Tauri v2 capability ACLs, and Zero-GC 60fps/120Hz render loops. |
| **`swarm-architect`** | `skill-dispatcher.mjs` | Autonomous Skill Composition Chains (`vibes skill chain`) and PRD/ERD/Context Map invariants. |

