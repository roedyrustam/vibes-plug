---
name: pwa-offline-first-expert
description: "Expert guide for Local-First & Offline-First architectures, CRDT conflict-free sync (RxDB, ElectricSQL, PowerSync), OPFS SQLite, Service Worker v3, and PWABuilder deployment / Panduan ahli arsitektur Offline-First & Local-First PWA."
author: "Roedy Rustam"
---

# PWA & Offline-First Expert (2026 Edition)

Expert guide for building enterprise-grade **Local-First** and **Progressive Web Applications (PWA)**. Eliminates loading spinners by reading and writing to local databases (OPFS SQLite, RxDB, IndexedDB) first, replicating seamlessly in the background with zero conflict (CRDTs, ElectricSQL, PowerSync), and packaging to native stores via PWABuilder.

*Panduan ahli untuk membangun aplikasi web Local-First dan PWA kelas enterprise. Menghilangkan loading spinner dengan membaca dan menulis langsung ke database lokal, sinkronisasi otomatis di latar belakang tanpa bentrok data, dan packaging ke app store.*

---

## 1. The Local-First Principles (2026 Standard)

1. **No Spinners for Local Data**: UI reads and writes to local storage (OPFS / IndexedDB) synchronously. Latency is always 0ms.
2. **Multi-Device Conflict-Free Replication**: Changes replicate in the background using CRDTs or central event logs (ElectricSQL / PowerSync).
3. **Network is an Enhancement**: App is 100% functional on an airplane or subway without internet.
4. **User Owns Their Data**: Data persists on client hardware first; cloud server is a backup/sync relay.

---

## 2. Production Recipe: Service Worker Caching (Workbox v7 / Native SW)

```typescript
// sw.ts - Production Service Worker with Stale-While-Revalidate
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'app-v2.11.0-cache';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/global.css',
  '/icons/icon-512x512.png',
];

// 1. Install & Pre-cache critical application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate & Clean stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 3. Stale-While-Revalidate Strategy for Navigation & API GETs
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore POST/PUT/DELETE mutations (handled by offline sync queues)
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || Response.error());

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Background Sync for offline mutations
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(flushOfflineMutationQueue());
  }
});

async function flushOfflineMutationQueue() {
  // Read pending mutations from IndexedDB and POST to backend
}
```

---

## 3. Production Recipe: Local-First Database Sync with RxDB (TypeScript)

```typescript
// local-db.ts - Reactive Offline-First Database with Background Replication
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';

export interface TaskDocType {
  id: string;
  title: string;
  isCompleted: boolean;
  updatedAt: string;
}

const taskSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    isCompleted: { type: 'boolean' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'title', 'isCompleted', 'updatedAt'],
};

export async function initLocalDB() {
  const db = await createRxDatabase({
    name: 'app_local_db',
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    tasks: { schema: taskSchema },
  });

  // Background Replication with Server (GraphQL / REST Sync)
  replicateGraphQL({
    collection: db.tasks,
    url: 'https://api.myapp.com/graphql',
    pull: {
      queryBuilder: (doc) => ({
        query: `query { syncTasks(since: "${doc ? doc.updatedAt : 0}") { id title isCompleted updatedAt } }`,
        variables: {},
      }),
      modifier: (doc) => doc,
    },
    push: {
      queryBuilder: (doc) => ({
        query: `mutation { pushTask(task: ${JSON.stringify(doc)}) { id } }`,
        variables: {},
      }),
      batchSize: 10,
    },
    live: true,
    retryTime: 1000 * 5, // Auto-retry on network reconnection
  });

  return db;
}
```

---

## 4. App Store Distribution: PWABuilder Standard

To distribute your web application on **Google Play Store** (TWA - Trusted Web Activity) and **Microsoft Windows Store**:
1. Ensure Web App Manifest has:
   - `display: "standalone"`
   - `id: "/?source=pwa"`
   - `icons`: At least 192x192 and 512x512 maskable PNGs.
   - `shortcuts` for rapid action launching.
2. Generate signed Android APK/AAB or Windows MSIX packages using:
   ```bash
   npx @pwabuilder/cli https://myapp.com
   ```

---

## Orchestration & Integration

- **`senior-frontend`**: For UI integration with offline state bars and optimistic mutation hooks.
- **`state-management-expert`**: For connecting RxDB / local stores with Zustand or TanStack Store.
- **`database-orm-expert`**: For designing compatible backend schemas with ElectricSQL / Postgres.
- **`mobile-push-notification-expert`**: For Web Push Notification subscription handling.
