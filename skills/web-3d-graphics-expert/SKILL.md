---
name: web-3d-graphics-expert
description: "Expert guide for WebGL and 3D graphics in the browser using Three.js, Babylon.js, React Three Fiber (R3F), and TresJS. Covers scene optimization, shaders, lighting, 3D model loading (GLTF/GLB), and performance tuning."
author: "Roedy Rustam"
---

# Web 3D Graphics Expert (Three.js & Babylon.js)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-level guidance for developing high-performance 3D graphics in the browser. Covers the raw APIs of **Three.js** and **Babylon.js**, as well as framework-specific wrappers like **React Three Fiber (R3F)** for React and **TresJS** for Vue. Focuses on rendering performance, efficient memory management, and realistic lighting/material setups.

### Trigger Conditions
Activate this skill when the user is:
- Initializing a WebGL/WebGPU 3D scene.
- Using `three`, `@react-three/fiber`, `@babylonjs/core`, or `@tresjs/core`.
- Loading 3D models (`.glb`, `.gltf`, `.obj`).
- Adding advanced lighting, shadows, or Post-Processing effects (Bloom, Depth of Field).
- Asking about framerate drops, memory leaks, or rendering performance in 3D apps.

---

### Core Concepts & Framework Selection

#### 1. React Three Fiber (R3F) vs Vanilla Three.js
When building with React, always use **React Three Fiber**. It manages the scene graph, object lifecycles, and `requestAnimationFrame` natively within the React component tree.

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

export default function App() {
  const { scene } = useGLTF('/model.glb')
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} castShadow />
      <primitive object={scene} />
      <Environment preset="city" />
      <OrbitControls />
    </Canvas>
  )
}
```
*Note: Always use `@react-three/drei` for common helpers (OrbitControls, Text, Environment).*

#### 2. Babylon.js vs Three.js
- **Three.js**: Lighter, more flexible, vast community, excellent for creative coding, landing page animations, and React/Vue integrations.
- **Babylon.js**: Robust, game-engine-like architecture, built-in physics, excellent for web-based games, AR/VR (WebXR), and complex interactive simulations. Fully written in TypeScript.

```typescript
// Basic Babylon.js Setup
import { Engine, Scene, FreeCamera, Vector3, MeshBuilder, HemisphericLight } from '@babylonjs/core'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
const engine = new Engine(canvas, true)
const scene = new Scene(engine)

const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
camera.setTarget(Vector3.Zero())
camera.attachControl(canvas, true)

const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)

engine.runRenderLoop(() => {
  scene.render()
})
```

#### 3. Asset Loading & Optimization
- **Format:** ALWAYS use `.glb` or `.gltf`. Avoid `.obj` or `.fbx` in the browser as they are unoptimized.
- **Compression:** Use Draco compression (`glTF-Transform` or `gltf-pipeline`) to dramatically reduce file sizes.
- **Loading:** Preload models if they are critical to the first paint.

---

### Best Practices for Performance

1. **Geometry and Material Reuse:**
   Never create new Geometries or Materials inside the render loop. Instantiate them once and reuse them. Use `InstancedMesh` (Three.js) or `Thin Instances` (Babylon.js) when rendering hundreds of identical objects.
2. **Memory Management (Disposing):**
   WebGL does not automatically garbage collect textures and geometries. When an object is removed from the scene, you MUST call `.dispose()` on its geometry and material.
   *(Note: R3F handles this automatically when components unmount).*
3. **Shadows & Lighting:**
   Limit the number of shadow-casting lights to 1 or 2. Use baked shadows (lightmaps) for static scenes. Use `Environment` maps (HDRI) instead of multiple lights for realistic reflections.
4. **Post-Processing:**
   Post-processing requires rendering the scene multiple times. Use it sparingly. Group passes together when possible.

---

### Integration with Other Skills (MANDATORY)

This skill works best when combined with:
- `senior-frontend` — When integrating React Three Fiber into Next.js/React applications.
- `vue-frontend-expert` — When integrating TresJS into Vue 3/Nuxt 3 applications.
- `performance-web-vitals` — To optimize the bundle size of 3D libraries and reduce Total Blocking Time (TBT).

### Referenced By Orchestrators (MANDATORY)

This skill should be referenced by the following orchestrators:
- `brainstorming` — Add to "UI/UX & Design Systems" or create a "3D & Graphics" category.
- `zero-to-prod-orchestrator` — Phase 5 (Frontend Implementation).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan produksi untuk pengembangan grafis 3D performa tinggi di browser. Mencakup **Three.js** dan **Babylon.js**, serta integrasi framework seperti **React Three Fiber (R3F)** untuk React dan **TresJS** untuk Vue. Fokus pada performa render, manajemen memori, dan pencahayaan realistis.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna sedang:
- Menginisialisasi *scene* WebGL 3D.
- Menggunakan library `three`, `@react-three/fiber`, atau `@babylonjs/core`.
- Memuat model 3D (terutama format `.glb`/`.gltf`).
- Mengoptimalkan FPS (frame-rate) atau menangani masalah *memory leak* pada aplikasi 3D.

### Panduan Singkat
- **Pemilihan Alat:** Gunakan **React Three Fiber** jika menggunakan React. Gunakan **TresJS** jika menggunakan Vue. Gunakan **Babylon.js** jika membuat game berbasis web yang membutuhkan mesin fisika kuat (physics engine).
- **Format Aset:** Selalu gunakan format `.glb` dengan kompresi Draco.
- **Performa:** Jangan membuat *Geometry* atau *Material* baru di dalam *render loop* (`requestAnimationFrame`). 
- **Manajemen Memori:** Panggil method `.dispose()` pada geometry, material, dan texture yang sudah tidak digunakan di vanilla Three.js/Babylon.js untuk mencegah kebocoran memori.
- **Pencahayaan:** Gunakan *Environment map* (HDRI) untuk pencahayaan realistis yang lebih ringan diproses daripada banyak lampu *directional/point*. Batasi lampu yang memancarkan bayangan maksimal 1-2 saja.
