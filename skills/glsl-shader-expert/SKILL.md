---
name: glsl-shader-expert
description: "Expert guide for writing custom GLSL shaders (Vertex/Fragment) for WebGL using Three.js and Babylon.js. Covers shader materials, post-processing, noise, and performance optimization."
author: "Roedy Rustam"
---

# GLSL Shader Expert (WebGL 3D Graphics)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidance for writing and integrating custom GLSL (OpenGL Shading Language) shaders into web applications using **Three.js** (`ShaderMaterial` / `RawShaderMaterial`) or **Babylon.js** (`ShaderMaterial`). Focuses on creating advanced visual effects, custom lighting models, procedural textures (noise), and post-processing passes.

### Trigger Conditions
Activate this skill when the user is:
- Asking to create custom materials that standard PBR materials cannot achieve.
- Writing Vertex or Fragment shaders in GLSL.
- Implementing procedural generation (e.g., Perlin noise, Simplex noise) on the GPU.
- Creating post-processing effects or screen-space shaders.
- Optimizing GPU performance by moving CPU calculations to vertex shaders.

### Core Concepts

#### 1. The Graphics Pipeline
Understand the flow:
1. **Vertex Shader:** Runs for every vertex. Used to manipulate geometry (position) and pass data (varyings) to the fragment shader. Must set `gl_Position`.
2. **Fragment Shader:** Runs for every pixel (fragment). Used to determine color. Must set `gl_FragColor`.

#### 2. Three.js `ShaderMaterial` Example
```javascript
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Standard projection
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // Simple animated color based on UV coordinates and time
    vec3 color = vec3(vUv.x, vUv.y, sin(uTime) * 0.5 + 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 }
  }
});
```
*Note: In the render loop, you must update `material.uniforms.uTime.value += delta;`*

#### 3. Best Practices for Shaders
- **Avoid Branching:** GPU threads run in lockstep (warps/wavefronts). `if/else` statements can cause significant performance drops. Prefer mathematical functions like `step()`, `smoothstep()`, `mix()`, and `clamp()`.
- **Precision:** Explicitly declare float precision (`precision mediump float;` or `highp` if necessary). Use `mediump` for colors/UVs to save performance, particularly on mobile.
- **Use Uniforms Wisely:** Only pass data that changes per frame or per object as uniforms.

---

### Integration with Other Skills (MANDATORY)
This skill works best when combined with:
- `web-3d-graphics-expert` — For setting up the core WebGL scene in Three.js/Babylon.js.
- `web-game-engine-expert` — For linking shader uniforms with physics data (e.g., impact ripples).
- `ui-ux-pro-max` — For ensuring shader visual effects match the modern Web design tokens.

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "3D & Graphics" or "UI/UX & Design Systems".
- `zero-to-prod-orchestrator` — Phase 5 (Frontend / WebGL Implementation).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk menulis dan mengintegrasikan shader GLSL khusus ke dalam aplikasi web menggunakan **Three.js** atau **Babylon.js**. Mencakup pembuatan *Vertex Shader*, *Fragment Shader*, efek visual prosedural, dan optimasi GPU.

### Kondisi Pemicu
- Saat pengguna ingin membuat efek visual kustom (seperti air, hologram, distorsi) yang tidak bisa dilakukan oleh material standar.
- Menulis kode GLSL untuk *ShaderMaterial*.
- Mengoptimalkan performa grafis dengan memindahkan komputasi CPU ke GPU.

### Panduan Singkat
- **Vertex vs Fragment:** *Vertex shader* mengatur posisi dan memanipulasi geometri (`gl_Position`), sedangkan *Fragment shader* mengatur pewarnaan setiap pixel (`gl_FragColor`).
- **Hindari If/Else:** CPU sangat cepat dalam percabangan (`if/else`), tetapi GPU sangat lambat. Gunakan fungsi interpolasi matematika bawaan GLSL seperti `step()`, `smoothstep()`, dan `mix()`.
- **Gunakan Uniforms:** Gunakan `uniforms` untuk mengirim data dari JavaScript (seperti waktu, posisi mouse, atau tekstur) ke dalam shader. Update nilai uniform ini di dalam *render loop*.
- **Presisi (Precision):** Gunakan `precision mediump float;` secara default untuk menyeimbangkan performa dan kualitas visual, terutama untuk optimalisasi *mobile*.
