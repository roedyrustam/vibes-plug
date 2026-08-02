---
name: realtime-collaboration-expert
description: "Expert guide for building real-time collaboration features using WebSockets, WebRTC, CRDTs (Yjs, Automerge), and Liveblocks / Panduan ahli untuk fitur kolaborasi real-time."
author: "Antigravity"
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

### Kondisi Pemicu
Aktif setiap kali pengguna sedang membangun fitur *multiplayer*, kursor langsung (live cursors), pengeditan dokumen bersama, obrolan real-time, atau bekerja dengan WebSockets, Yjs, atau WebRTC.
