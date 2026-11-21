import { DEPTH } from "./context";
import type { SceneContext } from "./context";
import { finGeometry, mergeParts } from "./shapes";

/** Tortugas marinas: caparazón con escudos, aletas largas y cabeza con ojos. */
export function addTurtles(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, creature, pathAt } = ctx;
  const shellGeo = track(new THREE.SphereGeometry(1, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2));
  const plastronGeo = track(new THREE.SphereGeometry(1, 24, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
  const headParts = new THREE.SphereGeometry(0.42, 18, 12);
  const neck = new THREE.CylinderGeometry(0.26, 0.32, 0.6, 14);
  const headGeo = track(
    mergeParts(THREE, [
      { geometry: neck, position: [0, 0, 1.7], rotation: [Math.PI / 2, 0, 0] },
      { geometry: headParts, position: [0, 0.08, 2.15], scale: [1, 0.82, 1.25] },
    ]),
  );
  headParts.dispose();
  neck.dispose();
  // Aleta delantera larga y curva; la trasera, corta.
  const front = track(
    finGeometry(THREE, [
      [0, -0.28],
      [0.7, -0.2],
      [1.6, -0.55],
      [2.1, -1.05],
      [1.95, -1.1],
      [1.2, -0.75],
      [0.4, -0.55],
      [0, 0.18],
    ], 0.12),
  );
  const back = track(
    finGeometry(THREE, [
      [0, -0.2],
      [0.55, -0.35],
      [0.75, -0.6],
      [0.45, -0.7],
      [0, 0.15],
    ], 0.1),
  );
  const shellMat = creature({ color: 0x5f7f3f, belly: 0x8f8a52, roughness: 0.6, pattern: "scutes" });
  const skinMat = creature({ color: 0x9c8a55, belly: 0xe6d8a8, roughness: 0.7, pattern: "spots" });
  const plastronMat = creature({ color: 0xe0cf98, roughness: 0.8 });
  const eyeGeo = track(new THREE.SphereGeometry(0.07, 10, 8));
  const eyeMat = creature({ color: 0x07090b, roughness: 0.2 });

  const turtles = small ? 1 : 2;
  for (let i = 0; i < turtles; i += 1) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.scale.set(1.25, 0.55, 1.65);
    const plastron = new THREE.Mesh(plastronGeo, plastronMat);
    plastron.scale.set(1.15, 0.2, 1.55);
    const head = new THREE.Mesh(headGeo, skinMat);
    g.add(shell, plastron, head);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * 0.3, 0.2, 2.42);
      g.add(eye);
    }
    const flips: { pivot: import("three").Group; front: boolean; side: number }[] = [];
    for (const [x, z, isFront] of [[1.05, 0.75, true], [-1.05, 0.75, true], [0.85, -1.25, false], [-0.85, -1.25, false]] as const) {
      const side = Math.sign(x);
      const pivot = new THREE.Group();
      pivot.position.set(x, -0.08, z);
      const f = new THREE.Mesh(isFront ? front : back, skinMat);
      // El contorno está en XY: se acuesta para que la aleta quede horizontal.
      f.rotation.x = Math.PI / 2;
      f.scale.set(side, 1, 1);
      pivot.add(f);
      g.add(pivot);
      flips.push({ pivot, front: isFront, side });
    }
    g.scale.setScalar(1.1);
    scene.add(g);
    const cy = -(0.12 + i * 0.2) * DEPTH;
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    updaters.push((time) => {
      const ang = time * (0.1 + i * 0.02) + i * 3;
      pathAt(i * 4 - 2, -17 - i * 3, 12, ang, p);
      p.y = cy + Math.sin(time * 0.5 + i * 2) * 0.9;
      g.position.copy(p);
      tgt.set(p.x - Math.sin(ang) * 4, p.y + Math.sin(time * 0.5 + i * 2) * 0.4, p.z + Math.cos(ang) * 2.4);
      g.lookAt(tgt);
      const stroke = Math.sin(time * 1.4 + i);
      for (const flip of flips) {
        // Brazada: las delanteras suben y bajan y se inclinan; las traseras timonean.
        flip.pivot.rotation.z = flip.side * (flip.front ? stroke * 0.55 : 0.15 + stroke * 0.12);
        flip.pivot.rotation.y = flip.side * (flip.front ? -0.25 + stroke * 0.25 : 0.4);
      }
      head.rotation.y = Math.sin(time * 0.4 + i) * 0.12;
    });
  }
}
