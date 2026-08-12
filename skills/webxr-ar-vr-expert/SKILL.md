---
name: webxr-ar-vr-expert
description: "Expert guide for WebXR (Web-based Virtual and Augmented Reality) development using Babylon.js and Three.js. Covers device compatibility, immersive sessions, controllers, and hit-testing."
author: "Roedy Rustam"
---

# WebXR AR/VR Expert

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Description
Production-grade guidance for building immersive **Augmented Reality (AR)** and **Virtual Reality (VR)** experiences in the browser using the **WebXR Device API**. Focuses on implementation via **Babylon.js** (which has industry-leading WebXR support) and **Three.js** / React Three Fiber.

### Trigger Conditions
Activate this skill when the user is:
- Building AR/VR experiences for Oculus/Meta Quest, Apple Vision Pro, or mobile AR devices.
- Setting up an `immersive-vr` or `immersive-ar` WebXR session.
- Implementing controller tracking, hand tracking, or teleportation in 3D space.
- Using AR Hit-Testing to place digital objects on physical surfaces (floors/tables).

### Core Concepts

#### 1. Babylon.js WebXR Setup
Babylon.js provides the most robust default WebXR experience.
```typescript
import { Scene, FreeCamera, Vector3, Engine } from '@babylonjs/core';

async function setupXR(scene: Scene) {
  // Initialize default WebXR experience
  // This automatically adds the "Enter VR/AR" button, teleportation, and controller models
  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-vr', // or 'immersive-ar'
    },
    optionalFeatures: true
  });
  
  // Example: Listen for controller input
  xr.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      // Handle button presses
    });
  });
}
```

#### 2. Three.js / React Three Fiber Setup
In R3F, use `@react-three/xr`.
```tsx
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';

const store = createXRStore();

export default function App() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
```

#### 3. AR Hit-Testing
In AR mode, "Hit-Testing" allows you to detect real-world surfaces.
- Ensure `immersive-ar` is used.
- Request the `hit-test` feature when initializing the session.
- Use the hit-test results (a matrix/position) to place a reticle or object.

### Best Practices
- **Performance is Critical:** VR requires a consistent 72 to 90 FPS (or 120 FPS on Apple Vision Pro). Dropped frames cause motion sickness.
- **Polycount:** Keep polygon counts and draw calls low.
- **UI in XR:** Standard HTML UI will not work in immersive mode. You must use 3D UI (e.g., Babylon's GUI 3D system or Three.js spatial HTML layers if supported).

---

### Integration with Other Skills (MANDATORY)
This skill works best when combined with:
- `web-3d-graphics-expert` — For building the 3D scene that XR will visualize.
- `apple-ecosystem-expert` — For optimizing WebXR compatibility with iOS (Safari) and visionOS.
- `web-game-engine-expert` — For adding physics to VR interactions (e.g., throwing objects).

### Referenced By Orchestrators (MANDATORY)
- `brainstorming` — Add to "3D & Graphics" or "Spatial Computing".
- `zero-to-prod-orchestrator` — Phase 5 (Frontend / XR Implementation).

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Deskripsi
Panduan ahli untuk pengembangan *Virtual Reality* (VR) dan *Augmented Reality* (AR) di web menggunakan **WebXR API**. Difokuskan pada implementasi menggunakan **Babylon.js** dan **Three.js** untuk ekosistem *Spatial Computing*.

### Kondisi Pemicu
- Mengembangkan aplikasi VR/AR untuk Meta Quest, Apple Vision Pro, atau Mobile AR.
- Mengimplementasikan pelacakan pengontrol (controller), pelacakan tangan (hand tracking), atau teleportasi.
- Menggunakan AR Hit-Testing untuk meletakkan objek 3D di permukaan dunia nyata.

### Panduan Singkat
- **Performa Mutlak:** Jaga FPS tetap stabil di angka 72-90 FPS. *Frame drop* pada VR menyebabkan rasa mual (motion sickness) pada pengguna. Batasi jumlah poligon dan *draw calls*.
- **Babylon.js sebagai Prioritas:** Untuk proyek XR berskala besar, prioritaskan Babylon.js karena dukungan bawaannya untuk interaksi VR, fisika, dan UI 3D jauh lebih matang dibanding library lain.
- **UI Spasial:** Ingat bahwa elemen HTML biasa tidak muncul di dalam sesi `immersive-vr` atau `immersive-ar`. Anda harus membuat UI berupa objek 3D (seperti panel yang melayang di udara).
- **Hit-Testing:** Untuk AR, gunakan fitur *Hit-Test* yang disediakan WebXR API untuk mengenali lantai atau meja sebagai tempat menaruh objek.
