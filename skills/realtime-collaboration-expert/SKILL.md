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
Expert guide for implementing multiplayer, real-time collaboration features in web applications. Covers Conflict-free Replicated Data Types (CRDTs) like Yjs/Automerge, WebSockets, WebRTC, and Managed services like Liveblocks or Pusher.

### Instructions
- **CRDTs for State**: Use CRDTs (e.g., `yjs` or `automerge`) instead of Operational Transformation (OT) for handling distributed state and concurrent document editing smoothly.
- **Connection Resiliency**: Always implement automatic reconnection logic with exponential backoff for WebSockets. Handle offline states gracefully by syncing local changes once reconnected.
- **Presence & Awareness**: Implement presence indicators (who is online, cursor positions) separated from the core document state to reduce bandwidth and storage overhead.
- **Security in Real-time**: Authenticate and authorize every WebSocket connection upon establishment and validate all incoming socket messages to prevent malicious payloads.
- **Scale**: Be mindful of message broadcasting limits. Use Redis Pub/Sub or similar message brokers when scaling WebSocket servers across multiple instances.

### Implementation Checklist
- [ ] Choose a CRDT library (Yjs/Automerge) and a corresponding provider (WebSockets, WebRTC, Liveblocks).
- [ ] Initialize the shared document state and bind it to the frontend UI components (e.g., ProseMirror, Monaco).
- [ ] Implement presence (awareness) to broadcast cursor positions and active user lists.
- [ ] Handle offline states by buffering local changes and syncing upon reconnection.

### Example: Yjs with WebSocket Provider
```javascript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

// 1. Initialize a shared Yjs document
const ydoc = new Y.Doc()

// 2. Connect to the WebSocket room
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room-name', ydoc)

// 3. Share state (e.g., an array of chat messages)
const yarray = ydoc.getArray('messages')
yarray.observe(event => {
  console.log('Messages updated:', yarray.toArray())
})
```

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

### Trigger Conditions
Active whenever the user is building multiplayer features, live cursors, document co-editing, real-time chats, or working with WebSockets, Yjs, or WebRTC.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk mengimplementasikan fitur kolaborasi real-time dan *multiplayer* pada aplikasi web. Mencakup Conflict-free Replicated Data Types (CRDTs) seperti Yjs/Automerge, WebSockets, WebRTC, dan layanan terkelola seperti Liveblocks atau Pusher.

### Instruksi
- **CRDT untuk State**: Gunakan CRDT (misalnya `yjs` atau `automerge`) daripada Operational Transformation (OT) untuk menangani *state* terdistribusi dan pengeditan dokumen secara bersamaan dengan lancar.
- **Ketahanan Koneksi**: Selalu terapkan logika penyambungan ulang otomatis dengan *exponential backoff* untuk WebSockets. Tangani *offline state* dengan baik dengan menyinkronkan perubahan lokal setelah tersambung kembali.
- **Presence & Awareness**: Terapkan indikator kehadiran (siapa yang sedang online, posisi kursor) yang dipisahkan dari status dokumen inti untuk mengurangi *overhead* bandwidth dan penyimpanan.
- **Keamanan Real-time**: Lakukan autentikasi dan otorisasi setiap koneksi WebSocket pada saat tersambung dan validasi semua pesan *socket* yang masuk untuk mencegah *payload* berbahaya.
- **Skalabilitas**: Perhatikan batas penyiaran (broadcasting) pesan. Gunakan Redis Pub/Sub atau *message broker* serupa saat meningkatkan (scaling) server WebSocket di beberapa instans.

### Checklist Implementasi
- [ ] Pilih pustaka CRDT (Yjs/Automerge) dan provider yang sesuai (WebSockets, WebRTC, Liveblocks).
- [ ] Inisialisasi state dokumen bersama dan ikat ke komponen UI frontend (misal: ProseMirror, Monaco).
- [ ] Implementasikan presence (kesadaran) untuk menyiarkan posisi kursor dan daftar pengguna aktif.
- [ ] Tangani state offline dengan melakukan buffer perubahan lokal dan sinkronisasi ulang saat terhubung kembali.

### Contoh: Yjs dengan Provider WebSocket
```javascript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

// 1. Inisialisasi dokumen Yjs bersama
const ydoc = new Y.Doc()

// 2. Hubungkan ke ruangan WebSocket
const provider = new WebsocketProvider('ws://localhost:1234', 'nama-ruangan-saya', ydoc)

// 3. Berbagi state (misal: array pesan chat)
const yarray = ydoc.getArray('messages')
yarray.observe(event => {
  console.log('Pesan diperbarui:', yarray.toArray())
})
```

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

### Kondisi Pemicu
Aktif setiap kali pengguna sedang membangun fitur *multiplayer*, kursor langsung (live cursors), pengeditan dokumen bersama, obrolan real-time, atau bekerja dengan WebSockets, Yjs, atau WebRTC.