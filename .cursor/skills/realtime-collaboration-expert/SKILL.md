---
name: realtime-collaboration-expert
description: "Real-time collaboration: WebSockets, WebRTC, and CRDTs (Yjs) / Kolaborasi real-time: WebSockets, WebRTC, dan CRDT (Yjs)."
author: "Roedy Rustam"
version: "4.8.0"
---

# Real-Time Collaboration Expert / Ahli Kolaborasi Real-Time

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production engineering guide for building multiplayer, conflict-free real-time collaboration systems. Covers state-based and operation-based CRDTs (`Yjs`, `Automerge`, `Loro`), ephemeral presence/awareness protocols, IndexedDB offline persistence (`y-indexeddb`), and horizontally scaled WebSocket sync servers with binary delta compaction.

### Hard Guardrails (Declarative Invariants)
- **Authenticate & Authorize Every Document Room**: Verify JWT identity and per-document read/write permissions inside the Hocuspocus `onAuthenticate` hook (`connection.readOnly = true` for viewers) before exchanging state vectors.
- **Persist Incremental Binary Deltas, Never JSON Keystroke Dumps**: Never call `JSON.stringify` on every CRDT update; append compact binary `Uint8Array` updates (`Y.encodeStateAsUpdateV2`) and periodically compact via `Y.mergeUpdatesV2`.
- **Enforce WebSocket `maxPayload` & Rate Limits**: Configure `maxPayload` (e.g., `2 * 1024 * 1024` bytes) on WebSocket servers so a rogue client cannot exhaust heap memory with oversized CRDT frames.
- **Decouple Ephemeral Awareness from Durable State**: Broadcast cursor coordinates and selection ranges via ephemeral `y-protocols/awareness` throttled with `requestAnimationFrame`, never inside the persisted `Y.Doc`.
- **Origin-Scoped Local Undo/Redo**: Configure `Y.UndoManager` with an explicit local `trackedOrigins` set so pressing Ctrl+Z only reverts the local user's edits, never remote collaborators' changes.
- **Server-Stamped Awareness Identity**: Bind awareness `userId` and `displayName` to the authenticated WebSocket session rather than trusting client-supplied identity strings.

### 1. CRDT & Multiplayer Engine Selection Matrix (2026)

| Engine / Protocol | Data Model | Memory & Wire Footprint | Offline Merge | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Yjs (`y-protocols`)** | Rich Text (`Y.XmlFragment`), `Y.Map`, `Y.Array` | Ultra-compact binary (`Uint8Array` updates) | Native (`y-indexeddb` + `Y.mergeUpdates`) | Collaborative rich-text editors (Tiptap/Lexical), whiteboards |
| **Loro (Rust / WASM CRDT)** | Rich Text (Fugue + Peritext), Movable Tree, Map | Fast WASM zero-copy + time-travel history | Built-in shallow/full snapshot export | Hierarchical node trees (Figma/Notion-like block trees), version graphs |
| **Automerge 2.x** | JSON-like immutable document tree | Columnar binary compression | Full causal history DAG | Git-like branching/merging of structured JSON documents |
| **Liveblocks / PartyKit** | Managed edge rooms + Yjs/Storage primitives | Edge WebSocket hibernation | Automatic client buffer | Rapid deployment of multiplayer cursors, comments, and rooms |

### 2. Production Yjs Binary Sync + Ephemeral Awareness Client (TypeScript)
Separate **durable document state** (`Y.Doc` persisted to PostgreSQL/S3) from **ephemeral awareness state** (cursor coordinates, selection ranges, user status, broadcast at `30Hz` with linear interpolation and never persisted to DB).

```typescript
// src/collaboration/yjs-room-manager.ts
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';

export interface CollaboratorPresence {
  userId: string;
  displayName: string;
  colorHex: string;
  cursor: { x: number; y: number } | null;
  updatedAt: number;
}

export class CollaborativeRoomSession {
  public readonly ydoc: Y.Doc;
  public readonly provider: WebsocketProvider;
  public readonly localPersistence: IndexeddbPersistence;
  private rafThrottleId: number | null = null;

  constructor(params: {
    wsEndpoint: string;
    roomId: string;
    authToken: string;
    user: Omit<CollaboratorPresence, 'cursor' | 'updatedAt'>;
  }) {
    this.ydoc = new Y.Doc({ gc: true });

    // 1. Hydrate immediately from browser IndexedDB for 0ms offline-first load
    this.localPersistence = new IndexeddbPersistence(`vibes-collab-${params.roomId}`, this.ydoc);

    // 2. Connect to authenticated WebSocket sync cluster
    this.provider = new WebsocketProvider(params.wsEndpoint, params.roomId, this.ydoc, {
      params: { token: params.authToken },
      maxBackoffTime: 5000,
    });

    // 3. Initialize local user awareness metadata
    this.provider.awareness.setLocalStateField('user', {
      ...params.user,
      cursor: null,
      updatedAt: Date.now(),
    } satisfies CollaboratorPresence);
  }

  public updateCursorPosition(x: number, y: number): void {
    if (this.rafThrottleId !== null) return;
    this.rafThrottleId = requestAnimationFrame(() => {
      const current = this.provider.awareness.getLocalState()?.user as CollaboratorPresence | undefined;
      if (current) {
        this.provider.awareness.setLocalStateField('user', {
          ...current,
          cursor: { x: Math.round(x), y: Math.round(y) },
          updatedAt: Date.now(),
        } satisfies CollaboratorPresence);
      }
      this.rafThrottleId = null;
    });
  }

  public compactDocumentState(): Uint8Array {
    return Y.encodeStateAsUpdateV2(this.ydoc);
  }

  public destroy(): void {
    if (this.rafThrottleId !== null) {
      cancelAnimationFrame(this.rafThrottleId);
    }
    this.provider.awareness.setLocalState(null);
    this.provider.destroy();
    this.localPersistence.destroy();
    this.ydoc.destroy();
  }
}
```

### 3. Server-Side Binary Update Compaction (Preventing WAL & Memory Bloat)
Never store millions of individual Yjs keystroke updates as separate rows forever. Periodically compact incremental `Uint8Array` updates into a single `V2` snapshot inside an atomic transaction:

```typescript
// src/collaboration/compact-yjs-updates.ts
import * as Y from 'yjs';

export function mergeAndCompactYjsUpdates(
  baseSnapshotV2: Uint8Array | null,
  incrementalUpdatesV2: readonly Uint8Array[]
): Uint8Array {
  const allFragments = baseSnapshotV2
    ? [baseSnapshotV2, ...incrementalUpdatesV2]
    : [...incrementalUpdatesV2];

  if (allFragments.length === 0) {
    const emptyDoc = new Y.Doc();
    return Y.encodeStateAsUpdateV2(emptyDoc);
  }

  // Merge updates directly in binary form without full AST instantiation overhead
  return Y.mergeUpdatesV2(allFragments);
}
```

### 4. Authenticated Hocuspocus Server with PostgreSQL `bytea` Persistence (`@hocuspocus/server`)
Verify document-level permissions inside `onAuthenticate`, enforce `connection.readOnly` for viewers, and persist binary Yjs snapshots to PostgreSQL:

```typescript
// src/collaboration/hocuspocus-server.ts
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';

export interface DocumentAuthVerifier {
  verifyTokenAndAccess(
    token: string,
    documentName: string
  ): Promise<{ userId: string; role: 'editor' | 'viewer' }>;
}

export interface BinaryDocRepository {
  loadDocumentState(documentName: string): Promise<Uint8Array | null>;
  saveDocumentState(documentName: string, state: Uint8Array): Promise<void>;
}

export function createCollaborativeServer(params: {
  port: number;
  authVerifier: DocumentAuthVerifier;
  repository: BinaryDocRepository;
}) {
  return Server.configure({
    port: params.port,
    debounce: 2000,
    maxDebounce: 10000,
    async onAuthenticate(data) {
      const { userId, role } = await params.authVerifier.verifyTokenAndAccess(
        data.token,
        data.documentName
      );
      if (role === 'viewer') {
        data.connection.readOnly = true;
      }
      return { userId, role };
    },
    extensions: [
      new Database({
        async fetch({ documentName }) {
          return params.repository.loadDocumentState(documentName);
        },
        async store({ documentName, state }) {
          await params.repository.saveDocumentState(documentName, new Uint8Array(state));
        },
      }),
    ],
  });
}
```

### 5. Loro CRDT Version-Vector Delta Sync & Movable Tree (`loro-crdt`)
Use `LoroDoc` for Figma/Notion-style hierarchical block trees where nodes can be reparented concurrently without cycle anomalies:

```typescript
// src/collaboration/loro-tree-sync.ts
import { LoroDoc, LoroTree } from 'loro-crdt';

export class CollaborativeBlockTree {
  public readonly doc: LoroDoc;
  private readonly tree: LoroTree;

  constructor(peerId: bigint) {
    this.doc = new LoroDoc();
    this.doc.setPeerId(peerId);
    this.tree = this.doc.getTree('workspace_blocks');
  }

  public createBlock(title: string, parentId?: ReturnType<LoroTree['createNode']>['id']): string {
    const node = this.tree.createNode(parentId);
    node.data.set('title', title);
    node.data.set('updatedAt', Date.now());
    this.doc.commit();
    return String(node.id);
  }

  public exportDeltaSince(remoteVersionVectorBytes?: Uint8Array): Uint8Array {
    if (!remoteVersionVectorBytes) {
      return this.doc.export({ mode: 'snapshot' });
    }
    return this.doc.export({
      mode: 'update',
      from: this.doc.importUpdateBatch ? undefined : undefined,
    });
  }

  public applyRemoteUpdate(binaryUpdate: Uint8Array): void {
    this.doc.import(binaryUpdate);
  }
}
```

### 6. Origin-Scoped Local UndoManager & State-Vector Differential Sync (`yjs`)
Scope `Y.UndoManager` strictly to a local transaction origin Symbol so `undo()` never reverts remote peers' keystrokes, and compute minimal binary state-vector diffs on reconnect:

```typescript
// src/collaboration/yjs-undo-and-diff.ts
import * as Y from 'yjs';

export const LOCAL_EDITOR_ORIGIN = Symbol('local-editor-origin');

export class ScopedCollaborativeEditor {
  public readonly doc: Y.Doc;
  public readonly content: Y.Text;
  public readonly undoManager: Y.UndoManager;

  constructor() {
    this.doc = new Y.Doc({ gc: true });
    this.content = this.doc.getText('body');
    this.undoManager = new Y.UndoManager(this.content, {
      trackedOrigins: new Set([LOCAL_EDITOR_ORIGIN]),
      captureTimeout: 400,
    });
  }

  public insertLocalText(index: number, text: string): void {
    this.doc.transact(() => {
      this.content.insert(index, text);
    }, LOCAL_EDITOR_ORIGIN);
  }

  public computeMissingUpdateForPeer(peerStateVector: Uint8Array): Uint8Array {
    return Y.encodeStateAsUpdateV2(this.doc, peerStateVector);
  }
}
```

### 7. Deterministic Awareness Cursor Throttling & State Vector Sync / Sinkronisasi Vektor State & Throttling Kursor

```typescript
export interface CollaboratorPresence {
  clientId: string;
  cursorLine: number;
  cursorCol: number;
  updatedAtMs: number;
}

export function filterActiveCollaborators(states: CollaboratorPresence[], nowMs: number, ttlMs = 15000): CollaboratorPresence[] {
  return states.filter(state => nowMs - state.updatedAtMs <= ttlMs);
}
```

### 8. Production Verification Checklist
- [ ] Choose a CRDT library (`Yjs`, `Loro`, or `Automerge`) matched to the document topology and enable garbage collection (`gc: true`) unless full causal time-travel is required.
- [ ] Separate high-frequency awareness broadcasts (cursors/selections throttled via `requestAnimationFrame`) from durable CRDT document mutations.
- [ ] Persist local edits to `IndexedDB` (`y-indexeddb`) so offline edits merge automatically without data loss upon WebSocket reconnection.
- [ ] Compact incremental binary updates (`Y.mergeUpdatesV2`) on the server to prevent unbounded database growth.
- [ ] Authenticate every WebSocket upgrade in `onAuthenticate`, set `connection.readOnly = true` for viewers, and scope `Y.UndoManager` to local transaction origins.

## Orchestration & Integration
- `senior-frontend` — React 19 UI component bindings, live cursor canvas, and optimistic multiplayer rendering.
- `rich-text-editor-expert` — Collaborative rich-text document editing with Tiptap/ProseMirror/Yjs.
- `design-system-architect` — Live avatar presence stacks, color-coded multiplayer cursors, and awareness tags.
- `ui-ux-pro-max` — Smooth cursor interpolation, spring animations for multiplayer presence, and collision feedback.
- `visual-ui-auditor` — Multimodal vision auditing of live collaborative canvas, presence indicators, and cursor alignment.
- `anti-slop` — Anti-slop real-time architecture, eliminating phantom cursor jumps, ghost presence tokens, and desync loops.
- `state-management-expert` — Integrating CRDT state with client-side reactive stores.
- `event-driven-architect` — WebSocket connection clustering and Redis pub/sub scaling.
- `mcp-server-architect` — Real-time agentic collaboration and tool calling channels.
- `reactive-sync-engine-expert` — Combining unstructured CRDT documents with relational Postgres sync shapes.
- **Cross-Domain Synergy & Subagent Swarm Integration**: `sse-websocket-streaming-expert`

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec realtime-collaboration-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan rekayasa produksi untuk membangun fitur kolaborasi real-time dan *multiplayer* bebas konflik. Mencakup CRDT berbasis state dan operasi (`Yjs`, `Automerge`, `Loro`), protokol kehadiran (*awareness*) efemeral, persistensi offline `IndexedDB`, serta server sinkronisasi WebSocket dengan kompaksi biner.

### Guardrail Wajib (Invarian Deklaratif)
- **Autentikasi & Otorisasi Setiap Ruangan Dokumen**: Verifikasi JWT dan izin baca/tulis dokumen di dalam hook `onAuthenticate` Hocuspocus (`connection.readOnly = true` untuk viewer) sebelum sinkronisasi vektor state.
- **Simpan Delta Biner Inkremental, Bukan JSON Penuh**: Dilarang menjalankan `JSON.stringify` pada setiap ketukan tombol; simpan update biner `Uint8Array` dan kompakkan secara berkala dengan `Y.mergeUpdatesV2`.
- **Batasi `maxPayload` & Rate Limit WebSocket**: Tetapkan batas `maxPayload` pada WebSocket server untuk mencegah serangan kehabisan memori.
- **Pisahkan Awareness Efemeral dari State Dokumen**: Kirim koordinat kursor melalui protokol awareness terpisah yang di-throttle dengan `requestAnimationFrame`.
- **Undo/Redo Terikat Origin Lokal**: Konfigurasikan `Y.UndoManager` dengan `trackedOrigins` lokal agar fitur undo hanya membatalkan ketikan pengguna sendiri.
- **Identitas Awareness Terverifikasi Server**: Ikat `userId` kehadiran pada sesi autentikasi server, bukan klaim bebas dari klien.

### Checklist Verifikasi Produksi
- [ ] Gunakan CRDT (`Yjs` / `Loro`) dengan koleksi sampah aktif (`gc: true`) dan simpan perubahan lokal di `IndexedDB` agar tetap berjalan saat offline.
- [ ] Pisahkan siaran posisi kursor (*awareness* yang di-throttle dengan `requestAnimationFrame`) dari state dokumen inti.
- [ ] Lakukan kompaksi berkala pada update biner (`Y.mergeUpdatesV2`) di sisi server agar tabel database tidak membengkak.
- [ ] Validasi token autentikasi dan otorisasi ruangan pada saat jabat tangan WebSocket.

## Integrasi Orkestrasi
- `senior-frontend` — Binding komponen UI React 19, kanvas kursor langsung, dan rendering multiplayer optimistik.
- `rich-text-editor-expert` — Pengeditan dokumen rich-text kolaboratif dengan Tiptap/ProseMirror/Yjs.
- `design-system-architect` — Tumpukan avatar kehadiran langsung, kursor multiplayer berkode warna, dan tag awareness.
- `ui-ux-pro-max` — Interpolasi kursor mulus, animasi spring untuk kehadiran multiplayer, dan feedback benturan.
- `visual-ui-auditor` — Audit visual multimodal untuk kanvas kolaboratif langsung, indikator kehadiran, dan presisi kursor.
- `anti-slop` — Arsitektur real-time anti-slop, mengeliminasi lompatan kursor hantu, token kehadiran palsu, dan desinkronisasi.
- `state-management-expert` — Integrasi state CRDT dengan store reaktif sisi klien.
- `event-driven-architect` — Kluster koneksi WebSocket dan penskalaan Redis pub/sub.
- `mcp-server-architect` — Saluran kolaborasi agen dan tool calling real-time.
- `reactive-sync-engine-expert` — Menggabungkan dokumen CRDT dengan replikasi relasional Postgres.
- **Sinergi Lintas Domain & Integrasi Swarm Subagent**: `sse-websocket-streaming-expert`

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec realtime-collaboration-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
