---
name: solidjs-expert
description: "Expert guide for SolidJS 2 and SolidStart — fine-grained reactivity, signals, createResource, and server-first rendering / Panduan ahli SolidJS 2 dan SolidStart — reaktivitas fine-grained, signals, createResource, dan rendering server-first."
author: "vibes-plug-swarm"
---

# SolidJS Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`performance-web-vitals`**: SolidJS's top-tier runtime performance.
- **`tailwind-expert`**: Tailwind CSS integration with SolidJS.
- **`state-management-expert`**: Solid signals vs other state management patterns.
- **`typescript-expert`**: Type-safe SolidJS components.

### Description
Expert guide for SolidJS 2 and SolidStart, the fine-grained reactive framework with near-zero overhead. Covers signals (`createSignal`), derived state (`createMemo`), effects (`createEffect`), resources (`createResource`), stores, context, SolidStart routing, server functions, and migration patterns from React.

### Trigger Conditions
- Building applications with SolidJS or SolidStart.
- Choosing SolidJS for performance-critical interactive UIs.
- Comparing SolidJS vs React for a new project.
- Understanding fine-grained reactivity patterns.

---

### SolidJS Core

```tsx
import { createSignal, createMemo, createEffect, createResource, For, Show } from 'solid-js';

function TodoApp() {
  const [todos, setTodos] = createSignal<{ id: number; text: string; done: boolean }[]>([]);
  const [filter, setFilter] = createSignal<'all' | 'active' | 'done'>('all');

  const filtered = createMemo(() => {
    const f = filter();
    return f === 'all' ? todos() : todos().filter((t) => (f === 'done' ? t.done : !t.done));
  });

  const remaining = createMemo(() => todos().filter((t) => !t.done).length);

  createEffect(() => {
    document.title = `${remaining()} todos remaining`;
  });

  return (
    <div>
      <h1>Todos ({remaining()} remaining)</h1>
      <For each={filtered()}>
        {(todo) => <div classList={{ done: todo.done }}>{todo.text}</div>}
      </For>
      <Show when={todos().length > 0} fallback={<p>No todos yet!</p>}>
        <button onClick={() => setTodos([])}>Clear All</button>
      </Show>
    </div>
  );
}
```

## Orchestration & Integration
- `performance-web-vitals`, `tailwind-expert`, `typescript-expert`

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli SolidJS 2 dan SolidStart, framework reaktif fine-grained dengan overhead hampir nol. Mencakup signals, derived state, effects, resources, stores, dan routing SolidStart.

### Kondisi Pemicu
- Membangun aplikasi dengan SolidJS atau SolidStart.
- Memilih SolidJS untuk UI interaktif yang kritis performa.
