---
name: web-3d-graphics-expert
description: "Expert guide for modern WebGPU and WebGL 3D graphics in the browser using Three.js (WebGPURenderer + TSL), Babylon.js, PlayCanvas, React Three Fiber (R3F), and TresJS. Covers scene optimization, compute shaders, KTX2/Meshopt compression, and memory management / Panduan ahli grafis 3D web dan WebGPU modern."
author: "vibes-plug-swarm"
version: "3.0.0"
---

# Web 3D Graphics Expert (WebGPU, Three.js, Babylon.js & PlayCanvas)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `senior-frontend` — Integrating React Three Fiber (R3F) in React 19 / Next.js 15.
- `vue-frontend-expert` — Integrating TresJS in Vue 3 / Nuxt 3.
- `svelte-sveltekit-expert` — Integrating Threlte in Svelte 5 (Runes).
- `web-game-engine-expert` — Physics simulations (Rapier, Jolt, Havok), game loops, and ECS.
- `glsl-shader-expert` — Shading languages, WGSL compute shaders, and TSL nodes.
- `webxr-ar-vr-expert` — WebXR immersive VR/AR experiences.
- `performance-web-vitals` — Minimizing Total Blocking Time (TBT), asset streaming, and bundle sizing.

### Description
Production-grade guidance for architecting high-fidelity, high-framerate 3D experiences in the browser. Covers the modern **WebGPU-first** paradigm with automatic WebGL2 fallbacks, **Three.js (r170+) WebGPURenderer** and **TSL (Three Shading Language)**, **Babylon.js WebGPUEngine** with Snapshot Rendering, and **PlayCanvas Engine** for ultra-lightweight, mobile-first commercial applications.

### Trigger Conditions
Activate this skill when the user is:
- Initializing a WebGPU or WebGL 3D scene.
- Using `three` (`three/webgpu`), `@react-three/fiber`, `@babylonjs/core`, `playcanvas`, `@tresjs/core`, or `@threlte/core`.
- Writing or refactoring shaders to Three Shading Language (TSL) or WGSL.
- Loading and optimizing 3D models (`.glb`, `.gltf`) with KTX2 texture compression or Meshopt.
- Implementing post-processing passes, compute shaders, or particle systems on the GPU.
- Diagnosing FPS drops, draw call bottlenecks, or VRAM memory leaks.

---

### Modern Web 3D Engine Landscape (2026)

| Engine / Stack | Best Use Case | Rendering Backend | Key Strengths |
| :--- | :--- | :--- | :--- |
| **Three.js (WebGPU + TSL)** | Creative landing pages, interactive portfolios, R3F React ecosystems | WebGPU (primary) + WebGL2 (fallback) | Vast community, huge ecosystem, TSL cross-compiles to WGSL & GLSL, node materials. |
| **Babylon.js** | Enterprise 3D simulations, CAD viewers, AAA web games with Havok | WebGPU + WebGL2 | Snapshot rendering, native Havok physics, compute shaders, robust GUI & inspector. |
| **PlayCanvas Engine** | High-performance mobile 3D, instant-load web games, e-commerce configurators | WebGPU + WebGL2 | Tiny runtime (~200KB gzipped), clustered lighting, zero-overhead scene graph. |
| **Threlte (Svelte 5)** | Svelte 5 apps requiring declarative 3D reactive components | Three.js WebGL/WebGPU | Svelte Runes reactivity (`$state`, `$derived`), lightweight bundle footprint. |

---

### 1. Three.js WebGPU & TSL (Three Shading Language)

Starting with modern Three.js, transition from `WebGLRenderer` to `WebGPURenderer`. It natively uses WebGPU when available and falls back cleanly to WebGL2.

```typescript
// Modern Three.js WebGPU Scene Setup
import * as THREE from 'three/webgpu';
import { color, float, positionLocal, time, vec3, Fn } from 'three/tsl';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Initialize async WebGPU pipeline
await renderer.init();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// TSL (Three Shading Language) Custom Node Material
// Compiles automatically to WGSL on WebGPU and GLSL on WebGL2!
const customMaterial = new THREE.MeshStandardNodeMaterial();

// Node-based animated color shader function
const animatedColor = Fn(() => {
  const t = time.mul(2.0);
  const wave = positionLocal.y.add(t).sin().mul(0.5).add(0.5);
  return color(0x00ffff).mul(wave);
});

customMaterial.colorNode = animatedColor();

const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.3, 128, 32), customMaterial);
scene.add(mesh);

// Render loop using setAnimationLoop (WebGPU & WebXR compatible)
renderer.setAnimationLoop(() => {
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
});
```

---

### 2. Babylon.js WebGPU Engine & Snapshot Rendering

For scenes with thousands of static meshes, Babylon.js **Snapshot Rendering** records GPU command buffers once and replays them, bypassing JavaScript CPU draw call overhead.

```typescript
import { WebGPUEngine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from '@babylonjs/core';

async function initBabylonWebGPU() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  const engine = new WebGPUEngine(canvas, { antialiasing: true });
  await engine.initAsync();

  const scene = new Scene(engine);
  const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Enable Snapshot Rendering for extreme draw call reduction
  engine.snapshotRendering = true;
  engine.snapshotRenderingMode = WebGPUEngine.SNAPSHOTRENDERING_FAST;

  engine.runRenderLoop(() => {
    scene.render();
  });
}
```

---

### 3. PlayCanvas Engine (Ultra-Lightweight & Fast-Loading)

When bundle size and instant mobile loading are the primary constraints, use the standalone PlayCanvas Engine:

```typescript
import * as pc from 'playcanvas';

const canvas = document.getElementById('application-canvas') as HTMLCanvasElement;
const app = new pc.Application(canvas, {
  graphicsDeviceOptions: { alpha: false, antialias: true, preferWebGpu: true }
});
app.start();
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Create Entity: Camera
const camera = new pc.Entity('camera');
camera.addComponent('camera', { clearColor: new pc.Color(0.1, 0.1, 0.15) });
camera.translate(0, 2, 6);
camera.lookAt(0, 0, 0);
app.root.addChild(camera);

// Create Entity: Clustered Directional Light
const light = new pc.Entity('light');
light.addComponent('light', { type: 'directional', castShadows: true });
light.setEulerAngles(45, 30, 0);
app.root.addChild(light);

// Create Entity: Box with Standard Material
const box = new pc.Entity('box');
box.addComponent('render', { type: 'box' });
app.root.addChild(box);

app.on('update', (dt: number) => {
  box.rotate(10 * dt, 20 * dt, 30 * dt);
});
```

---

### 4. React Three Fiber (R3F) with React 19

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Float } from '@react-three/drei';

function ModelViewer() {
  const { scene } = useGLTF('/models/drone.glb');
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive object={scene} />
    </Float>
  );
}

export default function App() {
  return (
    <Canvas
      gl={(canvas) => new THREE.WebGPURenderer({ canvas, antialias: true })}
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} castShadow intensity={1.5} />
      <ModelViewer />
      <Environment preset="city" />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}

// Preload critical assets outside component tree
useGLTF.preload('/models/drone.glb');
```

---

### Modern Asset Pipeline & GPU Memory Optimization

#### 1. GPU Texture Compression: KTX2 + Basis Universal (`KHR_texture_basisu`)
> **CRITICAL RULE**: Never deploy raw PNG or JPG textures for 3D production models.
- **Why?** PNG/JPG files decompress into uncompressed 32-bit RGBA inside GPU VRAM. A 2048x2048 PNG consumes **16MB of VRAM**; an uncompressed 4K texture consumes **64MB of VRAM**.
- **KTX2 with Basis Universal** transcodes in real-time into native GPU-compressed formats:
  - Mobile: ASTC / ETC2.
  - Desktop: BC7 / BC1.
- **Result:** Saves **75% to 85% of GPU VRAM**, prevents mobile browser tab crashes, and eliminates texture upload GPU hitches.
- **Tooling:** Compress glTF files with `gltf-transform`:
  ```bash
  npx @gltf-transform/cli optimize input.glb output.glb --texture-compress ktx2
  ```

#### 2. Geometry Optimization: Meshopt (`EXT_meshopt_compression`)
- Prefer **Meshopt** over Draco for high-framerate interactive apps and games.
- **Advantage:** Meshopt WASM decompressor runs at **gigabytes per second** (up to 10x faster decompression than Draco on mobile CPUs) and organizes vertex attributes for maximum GPU vertex cache efficiency.
  ```bash
  npx @gltf-transform/cli meshopt input.glb output.glb
  ```

#### 3. Strict Memory Lifecycle Management (`.dispose()`)
Garbage collection does NOT clean up WebGL/WebGPU buffers:
- When removing an object from Three.js or Babylon.js, explicitly traverse and dispose:
```typescript
export function purgeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => disposeMaterial(m));
      } else if (mesh.material) {
        disposeMaterial(mesh.material);
      }
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  Object.keys(material).forEach((prop) => {
    const value = (material as any)[prop];
    if (value && typeof value.dispose === 'function') {
      value.dispose();
    }
  });
  material.dispose();
}
```

---

### Production Checklist
- [ ] Render with `WebGPURenderer` (Three.js) or `WebGPUEngine` (Babylon.js) with fallback enabled.
- [ ] Use KTX2 / Basis Universal compressed textures on all `.glb` assets.
- [ ] Use Meshopt geometry compression to eliminate model loading CPU stalls.
- [ ] Clamp `devicePixelRatio` to `Math.min(window.devicePixelRatio, 2)` to prevent 4K/Retina mobile GPU thermal throttling.
- [ ] Use `InstancedMesh` (Three.js) or `Thin Instances` (Babylon.js) for repetitive assets (>10 meshes).
- [ ] Implement explicit `.dispose()` cleanup in `useEffect` or component unmount hooks.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `senior-frontend` — Integrasi React Three Fiber (R3F) pada React 19 / Next.js 15.
- `vue-frontend-expert` — Integrasi TresJS pada Vue 3 / Nuxt 3.
- `svelte-sveltekit-expert` — Integrasi Threlte pada Svelte 5 (Runes).
- `web-game-engine-expert` — Simulasi fisika (Rapier, Jolt, Havok), game loop, dan ECS.
- `glsl-shader-expert` — Bahasa shader, compute shader WGSL, dan node TSL.
- `webxr-ar-vr-expert` — Pengalaman WebXR VR/AR imersif.
- `performance-web-vitals` — Meminimalkan TBT (Total Blocking Time) dan optimasi ukuran bundle.

### Deskripsi
Panduan produksi untuk membangun grafis 3D performa tinggi di browser. Mengutamakan paradigma modern **WebGPU-first** dengan fallback otomatis ke WebGL2, **Three.js (r170+) WebGPURenderer** dan **TSL (Three Shading Language)**, **Babylon.js WebGPUEngine** dengan Snapshot Rendering, serta **PlayCanvas Engine** untuk aplikasi komersial mobile yang sangat ringan dan cepat dimuat.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna:
- Menginisialisasi *scene* WebGPU atau WebGL 3D.
- Menggunakan `three` (`three/webgpu`), `@react-three/fiber`, `@babylonjs/core`, `playcanvas`, `@tresjs/core`, atau `@threlte/core`.
- Menulis atau merefaktor shader ke Three Shading Language (TSL) atau WGSL.
- Memuat dan mengoptimalkan model 3D (`.glb`, `.gltf`) menggunakan kompresi tekstur KTX2 atau Meshopt.
- Mengimplementasikan post-processing, compute shader, atau sistem partikel pada GPU.
- Mengatasi penurunan FPS (*frame drop*), hambatan *draw call*, atau kebocoran memori VRAM.

---

### Panduan Inti & Rekomendasi Mesin 3D

1. **Three.js WebGPU + TSL**:
   - Gunakan `WebGPURenderer` alih-alih `WebGLRenderer` standar.
   - Manfaatkan TSL (*Three Shading Language*) dan *Node Materials*. Kode shader TSL ditulis secara deklaratif dalam TypeScript/JavaScript dan otomatis dikompilasi menjadi WGSL pada WebGPU dan GLSL pada WebGL2.

2. **Babylon.js Snapshot Rendering**:
   - Untuk skenario dengan ribuan mesh statis, aktifkan `engine.snapshotRendering = true` untuk merekam *command buffer* GPU sekali saja, memotong hampir 100% *overhead* CPU draw call JavaScript.

3. **PlayCanvas Engine (Performa Mobile Ekstrem)**:
   - Jika waktu muat (*initial load*) dan ukuran bundle adalah prioritas utama (misalnya iklan interaktif, 3D e-commerce configurator, game web mobile), PlayCanvas hanya memakan ~200KB gzipped dengan fitur *clustered lighting* yang sangat cepat.

4. **Kompresi Tekstur GPU KTX2 (Wajib)**:
   - Jangan menyajikan file PNG/JPG mentah di produksi. Format PNG/JPG diekspansi menjadi uncompressed RGBA di VRAM GPU (tekstur 4K memakan 64MB VRAM).
   - Gunakan **KTX2 / Basis Universal** yang tetap terkompresi langsung di VRAM GPU (menghemat 75%-85% VRAM dan mencegah browser mobile crash).

5. **Kompresi Geometri Meshopt**:
   - Gunakan kompresi **Meshopt** (`EXT_meshopt_compression`) alih-alih Draco jika membutuhkan dekompresi super cepat di browser (hingga 10x lebih cepat dibanding Draco pada CPU mobile).

6. **Pembersihan Memori Bersih (`.dispose()`)**:
   - Browser garbage collector tidak dapat menghapus buffer GPU secara otomatis. Selalu panggil method `.dispose()` pada geometry, material, dan texture saat komponen di-unmount.