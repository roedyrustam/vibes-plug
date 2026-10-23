---
name: realtime-collaboration-expert
description: "Expert guide for building real-time collaboration features using WebSockets, WebRTC, CRDTs (Yjs, Automerge), and Liveblocks / Panduan ahli untuk fitur kolaborasi real-time."
author: "Roedy Rustam"
version: "4.4.2"
---

# Real-Time Collaboration Expert / Ahli Kolaborasi Real-Time

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production engineering guide for building multiplayer, conflict-free real-time collaboration systems. Covers state-based and operation-based CRDTs (`Yjs`, `Automerge`, `Loro`), ephemeral presence/awareness protocols, IndexedDB offline persistence (`y-indexeddb`), and horizontally scaled WebSocket sync servers with binary delta compaction.

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

### 4. Production Verification Checklist
- [ ] Choose a CRDT library (`Yjs`, `Loro`, or `Automerge`) matched to the document topology and enable garbage collection (`gc: true`) unless full causal time-travel is required.
- [ ] Separate high-frequency awareness broadcasts (cursors/selections throttled via `requestAnimationFrame`) from durable CRDT document mutations.
- [ ] Persist local edits to `IndexedDB` (`y-indexeddb`) so offline edits merge automatically without data loss upon WebSocket reconnection.
- [ ] Compact incremental binary updates (`Y.mergeUpdatesV2`) on the server to prevent unbounded database growth.
- [ ] Authenticate every WebSocket upgrade and enforce room-level RBAC/ReBAC permissions before broadcasting state vectors.

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

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan rekayasa produksi untuk membangun fitur kolaborasi real-time dan *multiplayer* bebas konflik. Mencakup CRDT berbasis state dan operasi (`Yjs`, `Automerge`, `Loro`), protokol kehadiran (*awareness*) efemeral, persistensi offline `IndexedDB`, serta server sinkronisasi WebSocket dengan kompaksi biner.

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
