---
name: glsl-shader-expert
description: "Expert guide for modern web shaders: Three Shading Language (TSL), WebGPU WGSL, Compute Shaders, and WebGL GLSL in Three.js and Babylon.js. Covers procedural generation, compute kernels, and post-processing / Panduan ahli shader web modern: TSL, WGSL, Compute Shader, dan GLSL."
author: "Roedy Rustam"
version: "4.4.2"

---

# Modern Web Shader Expert (TSL, WGSL, Compute Shaders & GLSL)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `web-3d-graphics-expert` — WebGPU/WebGL scene rendering and NodeMaterial binding.
- `web-game-engine-expert` — Physics simulations, particle systems, and VFX materials.
- `ui-ux-pro-max` — Modern visual effects, glassmorphism, and screen-space distortion.
- `visual-ui-auditor` — Visual validation of shader effects, color spaces, and post-processing aesthetics.
- `anti-slop` — Anti-slop graphics enforcement, eliminating cheap neon glow and unoptimized fullscreen blurs.
- `performance-web-vitals` — GPU profiling, draw call reduction, and compute shader optimization.

### Description
Production-grade guidance for authoring, compiling, and optimizing GPU shaders for modern web applications. Focuses on the cutting-edge **TSL (Three Shading Language)** node system which cross-compiles to both **WGSL (WebGPU)** and **GLSL (WebGL2)**, standalone **WGSL Compute Shaders** for parallel processing (particles, boids, simulation), and legacy **GLSL** optimization.

### Trigger Conditions
Activate this skill when the user is:
- Writing custom shader materials in Three.js or Babylon.js.
- Refactoring legacy GLSL shaders to Three Shading Language (TSL) or WebGPU WGSL.
- Implementing WebGPU Compute Shaders (`@compute` workgroups, storage buffers).
- Creating procedural VFX: fluid simulations, volumetric clouds, noise-based terrain, or holographic shields.
- Designing post-processing screen passes (bloom, chromatic aberration, SSAO/GTAO, depth of field).
- Optimizing GPU bottlenecks, thread divergence, or ALU instruction counts.

---

### Modern Web Shader Paradigms (2026)

| Paradigm | Target API | Key Advantages | When to Use |
| :--- | :--- | :--- | :--- |
| **TSL (Three Shading Language)** | WebGPU + WebGL2 | Cross-compiles node trees to WGSL and GLSL; type-safe JavaScript/TypeScript syntax. | Default standard for modern Three.js (r170+) materials and post-processing. |
| **WGSL (WebGPU Shading Language)** | WebGPU native | Direct GPU memory access, structured storage buffers, atomic operations. | Raw WebGPU apps, Babylon.js WebGPU compute, custom WebGPU pipelines. |
| **Compute Shaders** | WebGPU | General-purpose GPU (GPGPU) computing; runs without rasterization or vertex buffers. | 100,000+ particle systems, cloth physics, fluid simulation, GPU boids. |
| **GLSL (ES 3.0)** | WebGL2 fallback | Universal device compatibility on legacy hardware. | Legacy Three.js/Babylon.js projects and fallback pipelines. |

---

### 1. Three Shading Language (TSL) Node System

TSL replaces string-concatenated GLSL with modular, type-safe node expressions that Three.js automatically compiles to WGSL on WebGPU and GLSL on WebGL2.

```typescript
import * as THREE from 'three/webgpu';
import { Fn, float, vec3, color, uv, time, positionLocal, sin, uniform } from 'three/tsl';

// Define custom dynamic uniforms
const uFrequency = uniform(3.0);
const uSpeed = uniform(1.5);

// Reusable TSL shader function (Node-based)
const waterWave = Fn(([freq, spd]) => {
  const coord = uv();
  const wave = sin(coord.x.mul(freq).add(time.mul(spd)))
    .add(sin(coord.y.mul(freq).add(time.mul(spd))))
    .mul(0.5);
  return wave;
});

// Vertex Position displacement in TSL
const displacedPosition = Fn(() => {
  const wave = waterWave(uFrequency, uSpeed);
  const newPos = positionLocal.add(vec3(0.0, wave.mul(0.2), 0.0));
  return newPos;
});

// Create Node Material
const oceanMaterial = new THREE.MeshStandardNodeMaterial();
oceanMaterial.positionNode = displacedPosition();
oceanMaterial.colorNode = Fn(() => {
  const wave = waterWave(uFrequency, uSpeed);
  const baseColor = color(0x004488);
  const foamColor = color(0x88eeff);
  return baseColor.mix(foamColor, wave.add(0.5));
})();
```

---

### 2. WebGPU Compute Shaders (GPGPU Parallel Processing)

Compute shaders run arbitrary mathematical workloads across thousands of GPU threads simultaneously:

```typescript
import * as THREE from 'three/webgpu';
import { Fn, float, vec3, uniform, storage, instanceIndex } from 'three/tsl';

const PARTICLE_COUNT = 65536;

// Create GPU Storage Buffers
const positionBuffer = new THREE.StorageBufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3);
const velocityBuffer = new THREE.StorageBufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3);

const posStorage = storage(positionBuffer, 'vec3', PARTICLE_COUNT);
const velStorage = storage(velocityBuffer, 'vec3', PARTICLE_COUNT);

// TSL Compute Kernel (executes per particle on GPU)
const computeParticles = Fn(() => {
  const index = instanceIndex;
  const pos = posStorage.element(index);
  const vel = velStorage.element(index);

  // Update position based on velocity
  pos.addAssign(vel.mul(0.016));

  // Bounce off boundaries [-5, 5]
  vel.y.assign(pos.y.lessThan(-5.0).select(vel.y.abs(), vel.y));
  vel.y.assign(pos.y.greaterThan(5.0).select(vel.y.abs().negate(), vel.y));
})().compute(PARTICLE_COUNT);

// In the render loop:
// renderer.compute(computeParticles);
// renderer.render(scene, camera);
```

---

### 3. Babylon.js Node Material & WebGPU WGSL Compute Shader

Babylon.js compiles Node Materials (NME) to WGSL on WebGPU and GLSL on WebGL2. For raw mathematical simulation, Babylon.js provides first-class native WGSL compute shaders:

```typescript
import {
  Scene,
  Mesh,
  NodeMaterial,
  ComputeShader,
  StorageBuffer,
  UniformBuffer
} from '@babylonjs/core';

export async function initBabylonNodeAndCompute(scene: Scene, targetMesh: Mesh) {
  // 1. Node Material: Type-safe visual shader graph
  const nodeMaterial = new NodeMaterial('oceanNodeMat', scene);
  await nodeMaterial.loadAsync('https://assets.babylonjs.com/materials/nme/ocean.json');
  nodeMaterial.build(false);
  targetMesh.material = nodeMaterial;

  // 2. Native WebGPU WGSL Compute Shader
  const wgslSource = `
    struct Particle {
      position : vec3<f32>,
      velocity : vec3<f32>,
    };

    @group(0) @binding(0) var<storage, read_write> particles : array<Particle>;

    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
      let index = global_id.x;
      particles[index].position += particles[index].velocity * 0.016;
    }
  `;

  const computeShader = new ComputeShader(
    'particleCompute',
    scene.getEngine(),
    { computeSource: wgslSource },
    {
      bindingsMapping: {
        particles: { group: 0, binding: 0 }
      }
    }
  );

  return { nodeMaterial, computeShader };
}
```

---

### 4. High-Performance Shader Rules (GPU Architecture)

1. **Eliminate Branching Divergence:**
   - GPU threads execute in lockstep warps (NVIDIA: 32 threads, AMD/Apple: 32-64 threads).
   - If threads inside the same warp take different branches in an `if/else`, both paths are evaluated serially, destroying throughput.
   - **Use Math Primitives:** Replace branches with `step()`, `smoothstep()`, `mix()`, `clamp()`, or `select()`.
   ```glsl
   // BAD: Divergent GPU branch
   if (vDepth > 0.5) { color = vec3(1.0); } else { color = vec3(0.0); }

   // GOOD: Branchless step function
   color = vec3(step(0.5, vDepth));
   ```

2. **Precision Management:**
   - Always specify precision for mobile GPUs.
   - Use `mediump` (16-bit float) for colors, normal vectors, and UVs to gain 2x arithmetic throughput and save bandwidth.
   - Reserve `highp` (32-bit float) for world-space coordinates and depth calculations.

3. **Precompute on CPU or Vertex Shader:**
   - Never compute values in the fragment shader (millions of pixels) that are constant across the mesh or linear across vertices.
   - Move matrix inversions, static lighting directions, or uniform transformations to the CPU or Vertex stage.

### Sovereign Execution, Token Efficiency & Invariants
| Dimension | Sovereign Mandate & Deterministic Contract |
| :--- | :--- |
| **Frontier Model Cascade** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Availability Fallback** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Zero unhandled missing-model errors) |
| **KV-Cache & Token Protocol** | Pin static instructions & schemas at prompt prefix (`kv-cache-prefix-optimizer`); pass surgical `CONTEXT_MAP.md` slices (<250 tokens/call) during Swarm Fan-Out |
| **SaaT CLI & MCP Dispatch** | CLI: `vibes skill exec glsl-shader-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **NFR & Anti-Slop Invariants** | P99 API Gateway Latency < 85ms, OpenAPI 3.1 / TypeSpec strict schema parity, RFC 9457 Problem Details error contracts, Idempotency-Key enforcement; 100% complete zero-placeholder output verified via `node scripts/check-anti-slop.js --strict` |

---


---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `web-3d-graphics-expert` — Rendering scene WebGPU/WebGL dan integrasi NodeMaterial.
- `web-game-engine-expert` — Simulasi fisika, sistem partikel, dan material efek game.
- `ui-ux-pro-max` — Efek visual modern, glassmorphism, dan distorsi screen-space.
- `visual-ui-auditor` — Validasi visual efek shader, ruang warna, dan estetika post-processing.
- `anti-slop` — Penegakan anti-slop grafis, membasmi neon glow murahan dan blur fullscreen tanpa optimasi.
- `performance-web-vitals` — Profiling GPU, optimasi draw call, dan compute shader.

### Deskripsi
Panduan produksi untuk menulis, mengompilasi, dan mengoptimalkan shader GPU untuk aplikasi web modern. Fokus pada sistem node **TSL (Three Shading Language)** yang dapat dikompilasi silang menjadi **WGSL (WebGPU)** dan **GLSL (WebGL2)**, **Compute Shader WGSL** mandiri untuk pemrosesan paralel GPU skala masif (partikel, boids, simulasi cairan), dan optimasi **GLSL**.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna:
- Menulis *custom shader material* pada Three.js atau Babylon.js.
- Merefaktor shader GLSL lama menjadi Three Shading Language (TSL) atau WebGPU WGSL.
- Mengimplementasikan WebGPU Compute Shader (`@compute` workgroups, storage buffers).
- Membuat efek visual prosedural (simulasi air, awan volumetrik, medan prosedural, perisai hologram).
- Merancang *post-processing passes* (bloom, chromatic aberration, SSAO, depth of field).
- Mengatasi bottleneck GPU, *thread divergence*, atau instruksi ALU berlebih.

---

### Prinsip Utama Shader Modern

1. **Adopsi TSL (Three Shading Language)**:
   - Hindari menulis shader dalam bentuk *string concatenation* GLSL mentah pada proyek modern. Gunakan TSL (`Fn`, `color`, `uv`, `positionLocal`). TSL menjaga keamanan tipe (type-safety) dan otomatis menghasilkan WGSL atau GLSL sesuai runtime.

2. **GPGPU dengan Compute Shader**:
   - Manfaatkan WebGPU Compute Shader untuk kalkulasi ribuan partikel atau simulasi matematika tanpa melalui tahap rasterisasi atau vertex buffer tradisional.

3. **Aturan Anti-Branching (Branchless Shader)**:
   - GPU mengeksekusi instruksi dalam kelompok thread (*warp/wavefront*). Percabangan `if/else` yang tidak seragam akan memaksa GPU mengeksekusi kedua cabang secara berurutan (*branch penalty*).
   - Gunakan fungsi matematika seperti `step()`, `smoothstep()`, dan `mix()` alih-alih percabangan logika kondisional.

4. **Manajemen Presisi**:
   - Gunakan `mediump` (16-bit float) untuk warna, koordinat UV, dan vektor normal untuk melipatgandakan kecepatan komputasi pada GPU smartphone.
   - Gunakan `highp` (32-bit float) hanya untuk posisi ruang dunia (*world space*) dan perhitungan kedalaman (*depth*).

5. **Babylon.js Node Material (NME) & WGSL Compute Shader**:
   - Manfaatkan Node Material (`NodeMaterial`) yang otomatis mengompilasi graf visual menjadi WGSL pada WebGPU dan GLSL pada WebGL2.
   - Gunakan `ComputeShader` untuk pemrosesan paralel GPU berbasis kode native WGSL:
   ```typescript
   import { Scene, Mesh, NodeMaterial, ComputeShader } from '@babylonjs/core';

   export async function inisialisasiNodeDanCompute(scene: Scene, targetMesh: Mesh) {
     const nodeMaterial = new NodeMaterial('oceanNodeMat', scene);
     await nodeMaterial.loadAsync('https://assets.babylonjs.com/materials/nme/ocean.json');
     nodeMaterial.build(false);
     targetMesh.material = nodeMaterial;

     const wgslSource = `
       @group(0) @binding(0) var<storage, read_write> partikel : array<vec4<f32>>;
       @compute @workgroup_size(64)
       fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
         let index = global_id.x;
         partikel[index].y += 0.016 * partikel[index].w;
       }
     `;

     const computeShader = new ComputeShader('partikelCompute', scene.getEngine(), { computeSource: wgslSource }, {
       bindingsMapping: { partikel: { group: 0, binding: 0 } }
     });

     return { nodeMaterial, computeShader };
   }
   ```

### Matriks Eksekusi Berdaulat, Efisiensi Token & Invarian
| Dimensi | Mandat Berdaulat & Kontrak Deterministik |
| :--- | :--- |
| **Kaskade Model Frontier** | Medium / High (`GPT-5.6 Sol Medium`, `Gemini 4 Argon`, `Claude Sonnet 5.5 High`, `Grok 4.7 High Fast`) |
| **Invarian Fallback Ketersediaan** | `Gemini 4 Argon/Pro` -> `Gemini 3.8 Flash`; `Claude Opus 5.5` -> `Claude Opus 4.6` (Bebas gagal saat model belum tersedia/kuota penuh) |
| **Protokol Hemat Token & KV-Cache** | Kunci instruksi & skema statis di prefix awal (`kv-cache-prefix-optimizer`); kirim potongan `CONTEXT_MAP.md` (<250 token/panggilan) saat Fan-Out |
| **Eksekusi SaaT CLI & MCP** | CLI: `vibes skill exec glsl-shader-expert <audit\|eval\|verify\|generate\|blueprint>` / MCP: `vibes_skill_dispatch`, `vibes_ast_query`, `vibes_compile_cache`, `vibes_optimize_budget`, `vibes_verify_gate` |
| **Invarian NFR & Anti-Slop** | Latensi P99 API < 85ms, paritas skema ketat OpenAPI 3.1 / TypeSpec, kontrak error RFC 9457 Problem Details, penegakan Idempotency-Key; kode 100% tuntas tanpa placeholder diverifikasi melalui `node scripts/check-anti-slop.js --strict` |
