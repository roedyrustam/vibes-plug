---
name: webxr-ar-vr-expert
description: "Expert guide for WebXR spatial computing, Web-based Virtual Reality (VR), Mixed Reality (MR), and Augmented Reality (AR) using Babylon.js and Three.js. Covers Apple Vision Pro, Meta Quest 3, hand tracking, and hit-testing / Panduan ahli WebXR spatial computing (VR/AR/MR)."
author: "Roedy Rustam"
version: "4.4.2"

---

# WebXR Spatial Computing Expert (VR, AR & MR)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
Connects and orchestrates with relevant domain skills:
- `web-3d-graphics-expert` — WebGPU/WebGL 3D scene rendering, lighting, and model optimization.
- `web-game-engine-expert` — Spatial physics, grabbing interactions, and fixed-timestep motion.
- `apple-ecosystem-expert` — Apple Vision Pro visionOS Safari WebXR features and spatial guidelines.
- `glsl-shader-expert` — Passthrough blending and spatial holographic shaders.
- `ui-ux-pro-max` — Spatial UI design patterns, world-space HUDs, and gesture-driven navigation.
- `anti-slop` — Anti-slop spatial ergonomics, zero nauseating jitter, and crisp readable 3D typography.
- `performance-web-vitals` — Maintaining rock-solid 72/90/120 FPS to prevent simulator sickness.

### Description
Production-grade guidance for architecting immersive **Virtual Reality (VR)**, **Mixed Reality (MR)**, and **Augmented Reality (AR)** in the browser via the **WebXR Device API**. Covers modern head-mounted displays (**Meta Quest 3/3S**, **Apple Vision Pro**) and mobile AR, focusing on Babylon.js and Three.js with `@react-three/xr`.

### Trigger Conditions
Activate this skill when the user is:
- Developing spatial computing web applications or immersive web experiences.
- Setting up WebXR sessions (`immersive-vr`, `immersive-ar`).
- Implementing Hand Tracking (joint poses, pinch gestures) or spatial controller interactions.
- Adding Mixed Reality passthrough or depth sensing.
- Implementing AR Hit-Testing to snap 3D models onto real-world planes (floors, walls, tabletops).
- Optimizing XR framerates (fixed foveated rendering) to eliminate motion sickness.

---

### Key Capabilities & Headset Targets (2026)

| Target Platform | Session Mode | Key Features |
| :--- | :--- | :--- |
| **Meta Quest 3 / 3S** | `immersive-vr`, `immersive-ar` | Full-color stereo passthrough, high-precision hand tracking, fixed foveation levels 0-3. |
| **Apple Vision Pro (visionOS)** | `immersive-vr`, `immersive-ar` | Eye-gaze + pinch interaction, 90/120Hz display refresh, strict privacy hand tracking. |
| **Mobile AR (Android / iOS WebKit)** | `immersive-ar` | Surface hit-testing, ambient light estimation, instant plane detection. |

---

### 1. Babylon.js WebXR Setup (Gold Standard)

Babylon.js provides the most comprehensive out-of-the-box WebXR implementation with integrated teleportation, controller profiles, hand tracking, and hit-testing:

```typescript
import {
  Scene,
  Vector3,
  MeshBuilder,
  WebXRFeatureName,
  WebXRDefaultExperience,
  IWebXRHitResult
} from '@babylonjs/core';

export async function initBabylonWebXR(scene: Scene) {
  // 1. Initialize Default WebXR Experience with AR + VR fallbacks
  const xr: WebXRDefaultExperience = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-ar',
      referenceSpaceType: 'local-floor'
    },
    optionalFeatures: ['hit-test', 'hand-tracking', 'anchors', 'plane-detection', 'mesh-detection']
  });

  const fm = xr.baseExperience.featuresManager;

  // 2. Fixed Foveated Rendering: 20-30% GPU saving on Quest 3 / Vision Pro
  fm.enableFeature(WebXRFeatureName.FOVEATION, 'latest', {
    foveationLevel: 2
  });

  // 3. Hand Tracking with Joint & Pinch Detection
  const handTracking = fm.enableFeature(WebXRFeatureName.HAND_TRACKING, 'latest', {
    xrInput: xr.input,
    jointMeshes: {
      invisible: false,
      scaleFactor: 1
    }
  });

  // 4. Real-World Surface Hit-Testing & Reticle Placement
  const marker = MeshBuilder.CreateTorus('reticle', { diameter: 0.15, thickness: 0.02 }, scene);
  marker.isVisible = false;
  marker.rotation.x = Math.PI / 2;

  const hitTest = fm.enableFeature(WebXRFeatureName.HIT_TESTING, 'latest', {
    testOnPointerDownOnly: false
  });

  hitTest.onHitTestResultObservable.add((results: IWebXRHitResult[]) => {
    if (results.length > 0) {
      marker.isVisible = true;
      results[0].transformationMatrix.decompose(
        marker.scaling,
        marker.rotationQuaternion!,
        marker.position
      );
    } else {
      marker.isVisible = false;
    }
  });

  // 5. Spawn object on user tap/pinch
  scene.onPointerDown = () => {
    if (marker.isVisible) {
      const box = MeshBuilder.CreateBox('placedBox', { size: 0.2 }, scene);
      box.position.copyFrom(marker.position);
    }
  };

  return { xr, handTracking, hitTest };
}
```

---

### 2. React Three Fiber Setup (`@react-three/xr`)

```tsx
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore, Hands, Controllers } from '@react-three/xr';

const store = createXRStore({
  foveation: 1,
  handTracking: true
});

export function SpatialApp() {
  return (
    <>
      <button className="xr-btn" onClick={() => store.enterAR()}>
        Enter Mixed Reality
      </button>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} />
          <Controllers />
          <Hands />
          {/* Spatial 3D Objects */}
          <mesh position={[0, 1.2, -1]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
```

---

### Best Practices for Spatial Performance
1. **Rock-Solid Framerates:** VR requires stable 72, 90, or 120 FPS. Any frame drop causes instant vestibular nausea.
2. **Fixed Foveated Rendering (FFR):** Reduces fragment shader resolution in the user's peripheral vision, freeing substantial GPU overhead.
3. **No 2D DOM Overlays in VR:** Standard HTML elements cannot render inside an immersive session. Render spatial 3D UI panels using world-space 3D meshes or canvas textures.

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
Terhubung dan mengorkestrasi skill domain yang relevan:
- `web-3d-graphics-expert` — Rendering scene 3D WebGPU/WebGL, pencahayaan, dan optimasi model.
- `web-game-engine-expert` — Fisika spasial, interaksi menggenggam objek, dan pergerakan fixed-timestep.
- `apple-ecosystem-expert` — Fitur WebXR Safari di Apple Vision Pro visionOS dan pedoman spasial.
- `glsl-shader-expert` — Shader hologram dan blending passthrough AR.
- `ui-ux-pro-max` — Pola desain UI spasial, HUD world-space, dan navigasi berbasis gestur.
- `anti-slop` — Ergonomi spasial anti-slop, nol getaran pemicu mual, dan tipografi 3D yang tajam.
- `performance-web-vitals` — Menjaga kestabilan 72/90/120 FPS demi mencegah *motion sickness*.

### Deskripsi
Panduan produksi untuk membangun aplikasi spasial imersif **Virtual Reality (VR)**, **Mixed Reality (MR)**, dan **Augmented Reality (AR)** di browser melalui **WebXR Device API**. Mencakup headset modern (**Meta Quest 3/3S**, **Apple Vision Pro**) serta perangkat mobile AR.

### Kondisi Pemicu
Aktifkan skill ini ketika pengguna:
- Mengembangkan aplikasi web *Spatial Computing* (VR/AR/MR).
- Menginisialisasi sesi WebXR (`immersive-vr`, `immersive-ar`).
- Mengimplementasikan *Hand Tracking* (pelacakan sendi tangan, gerakan cubit/pinch) atau kontroler spasial.
- Mengaktifkan *Passthrough* warna Mixed Reality.
- Menggunakan AR *Hit-Testing* untuk menempatkan objek 3D di lantai atau meja fisik.
- Mengoptimalkan performa VR dengan *Fixed Foveated Rendering* (FFR).

---

### Panduan Inti Pengembangan Spasial

1. **Stabilitas Frame Rate Mutlak**:
   - Targetkan 72–90 FPS tanpa toleransi *stutter*. Pada kacamata VR, keterlambatan frame (*latency hitch*) langsung memicu rasa mual (*motion sickness*).
2. **Fixed Foveated Rendering (FFR)**:
   - Aktifkan fitur foveation pada Meta Quest untuk menurunkan resolusi tepi lensa (periferi mata), menghemat 20-30% daya GPU.
3. **Antarmuka 3D Spasial (Bukan HTML DOM)**:
   - Elemen HTML standar tidak dapat ditampilkan di dalam sesi imersif. Buat UI berupa panel 3D melayang (*world-space meshes*).
4. **Hit-Testing untuk AR**:
   - Manfaatkan *Hit-Test API* bawaan WebXR untuk mendeteksi bidang nyata permukaan meja atau lantai secara instan sebelum meletakkan objek 3D.
5. **Implementasi Lengkap Babylon.js WebXR (AR/VR/MR)**:
   ```typescript
   import { Scene, MeshBuilder, WebXRFeatureName, WebXRDefaultExperience, IWebXRHitResult } from '@babylonjs/core';

   export async function inisialisasiBabylonWebXR(scene: Scene) {
     const xr: WebXRDefaultExperience = await scene.createDefaultXRExperienceAsync({
       uiOptions: { sessionMode: 'immersive-ar', referenceSpaceType: 'local-floor' },
       optionalFeatures: ['hit-test', 'hand-tracking', 'plane-detection', 'mesh-detection']
     });

     const fm = xr.baseExperience.featuresManager;
     fm.enableFeature(WebXRFeatureName.FOVEATION, 'latest', { foveationLevel: 2 });
     fm.enableFeature(WebXRFeatureName.HAND_TRACKING, 'latest', { xrInput: xr.input });

     const reticle = MeshBuilder.CreateTorus('reticle', { diameter: 0.15, thickness: 0.02 }, scene);
     reticle.isVisible = false;
     reticle.rotation.x = Math.PI / 2;

     const hitTest = fm.enableFeature(WebXRFeatureName.HIT_TESTING, 'latest', { testOnPointerDownOnly: false });
     hitTest.onHitTestResultObservable.add((results: IWebXRHitResult[]) => {
       if (results.length > 0) {
         reticle.isVisible = true;
         results[0].transformationMatrix.decompose(reticle.scaling, reticle.rotationQuaternion!, reticle.position);
       } else {
         reticle.isVisible = false;
       }
     });

     return { xr, hitTest };
   }
   ```