---
name: web-game-engine-expert
description: "Expert guide for web-based game development. Covers Entity Component System (ECS) architectures, physics engines (Rapier, Havok, Cannon-es), collision detection, and game loop optimization."
author: "vibes-plug-swarm"
---

# Web Game Engine Expert (Physics & ECS)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills like `brainstorming`, `zero-to-prod-orchestrator`, and `project-context-mapper` to ensure cohesive execution.

### Description
Production-grade guidance for building highly interactive 3D simulations and web games. Focuses on integrating modern WebAssembly-based **Physics Engines** (Havok, Rapier, Cannon-es) and structuring application state using the **Entity Component System (ECS)** pattern (e.g., bitECS, Miniplex).

### Trigger Conditions
Activate this skill when the user is:
- Adding physics (gravity, collisions, rigid bodies) to a 3D scene (Three.js/Babylon.js).
- Dealing with performance issues in web games with thousands of objects.
- Structuring a complex game or simulation architecture.
- Using `@dimforge/rapier3d`, `havok`, or `cannon-es`.

### Core Concepts

#### 1. Physics Engine Integration
Avoid calculating collisions manually in JavaScript. Use a dedicated physics engine.
- **Babylon.js + Havok:** Babylon.js natively supports Havok Physics (the same engine used in AAA titles like Zelda BotW).
- **Three.js / React Three Fiber + Rapier:** Use `@react-three/rapier` for seamless integration in R3F. It is written in Rust and compiled to WebAssembly.

```tsx
// React Three Fiber + Rapier Example
import { Physics, RigidBody } from '@react-three/rapier';

function GameScene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Falling Object */}
      <RigidBody colliders="box" position={[0, 10, 0]}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>

      {/* Static Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[10, 1, 10]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
```

#### 2. Entity Component System (ECS)
Traditional Object-Oriented Programming (OOP) can cause performance bottlenecks in games due to poor cache locality. ECS stores data in contiguous memory arrays (Components) and processes them in tight loops (Systems).
- Use **bitECS** for extreme performance (uses TypedArrays).
- Use **Miniplex** for an easier, developer-friendly React integration.

### Best Practices
- **Decouple Logic from Rendering:** The physics engine should update at a fixed timestep (e.g., 60Hz), while rendering should happen at the screen's refresh rate (e.g., 144Hz) using interpolation to prevent stuttering.
- **Use Simple Colliders:** Never use complex mesh colliders (Convex/Trimesh) for moving objects unless absolutely necessary. Use primitives (Spheres, Boxes, Capsules).

---

### Integration with Other Skills (MANDATORY)
This skill works best when combined with:
- `web-3d-graphics-expert` — For the visual rendering of the physics world.
- `webxr-ar-vr-expert` — For adding grabbable physics objects in VR space.
- `realtime-collaboration-expert` — For synchronizing physics state across multiple players using WebRTC.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "3D & Graphics" or "Game Development".
- `zero-to-prod-orchestrator` — Phase 5 (Frontend / Simulation).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan seperti `brainstorming`, `zero-to-prod-orchestrator`, dan `project-context-mapper` untuk memastikan eksekusi yang kohesif.

### Deskripsi
Panduan pengembangan *game* dan simulasi 3D di web. Mencakup integrasi *Physics Engine* berbasis WebAssembly (Rapier, Havok, Cannon) dan arsitektur *Entity Component System* (ECS).

### Kondisi Pemicu
- Saat menambahkan gravitasi, tabrakan (collision), atau benda padat (rigid body) ke dalam aplikasi 3D.
- Saat membuat game web yang membutuhkan performa tinggi dengan ribuan entitas.

### Panduan Singkat
- **Pilih Mesin Fisika:** Gunakan **Havok** jika menggunakan Babylon.js. Gunakan **Rapier** (`@react-three/rapier`) jika menggunakan Three.js/R3F.
- **Gunakan Collider Sederhana:** Untuk objek bergerak, selalu gunakan *primitive colliders* (Kotak, Bola, Kapsul) alih-alih *mesh collider* agar perhitungan CPU/WASM tetap ringan.
- **Pola ECS (Entity Component System):** Untuk game kompleks, pisahkan logika dan data menggunakan arsitektur ECS (seperti `miniplex` atau `bitECS`) untuk memaksimalkan performa *cache* memori.
