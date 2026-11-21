import { DEPTH } from "./context";
import type { SceneContext } from "./context";
import { finGeometry, mergeParts, smoothProfile } from "./shapes";

/**
 * Calamares: manto alargado con aletas al frente (nadan con el manto
 * por delante), ojos grandes y ocho brazos más dos tentáculos que ondulan.
 */
export function addSquids(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, creature, pathAt } = ctx;
  // Manto: punta en y = 2.4, se gira para que apunte a +z.
  const mantle = new THREE.LatheGeometry(
    smoothProfile(THREE, [
      [0.0, 2.45],
      [0.16, 2.2],
      [0.34, 1.4],
      [0.42, 0.5],
      [0.36, 0.0],
    ]),
    18,
  );
  const head = new THREE.SphereGeometry(0.34, 16, 12);
  const fin = finGeometry(THREE, [
    [0, 0],
    [0.55, -0.35],
    [0.05, -0.95],
  ], 0.04);
  const parts: Parameters<typeof mergeParts>[1] = [
    { geometry: mantle, rotation: [Math.PI / 2, 0, 0] },
    { geometry: head, position: [0, 0, -0.2], scale: [1, 0.9, 1.1] },
    { geometry: fin, position: [0.1, 0, 2.35], rotation: [Math.PI / 2, 0, 0] },
    { geometry: fin, position: [-0.1, 0, 2.35], rotation: [Math.PI / 2, 0, 0], scale: [-1, 1, 1] },
  ];
  const arms: import("three").BufferGeometry[] = [];
  for (let a = 0; a < 10; a += 1) {
    const ang = (a / 10) * Math.PI * 2;
    const long = a === 2 || a === 7;
    const len = long ? 3 : 1.5 + (a % 3) * 0.2;
    const r0 = 0.2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(ang) * r0, Math.sin(ang) * r0, -0.4),
      new THREE.Vector3(Math.cos(ang) * r0 * 1.3, Math.sin(ang) * r0 * 1.3, -0.4 - len * 0.4),
      new THREE.Vector3(Math.cos(ang) * r0 * 0.9, Math.sin(ang) * r0 * 0.9 - 0.1, -0.4 - len),
    ]);
    const tube = new THREE.TubeGeometry(curve, 14, long ? 0.035 : 0.05, 5, false);
    arms.push(tube);
    parts.push({ geometry: tube });
  }
  const geometry = track(mergeParts(THREE, parts));
  for (const part of [mantle, head, fin, ...arms]) part.dispose();
  const eyeGeo = track(new THREE.SphereGeometry(0.12, 12, 10));
  const eyeMat = creature({ color: 0x0a0c10, emissive: 0x0a2a3a, roughness: 0.1 });

  const squids = small ? 2 : 3;
  for (let i = 0; i < squids; i += 1) {
    const mat = creature({
      color: 0xff8aa8,
      belly: 0xffd9e3,
      emissive: 0x3a0f1e,
      roughness: 0.35,
      pattern: "spots",
      swim: { amp: 0.16, freq: 2.2, speed: 3.2, phase: i * 1.3, from: -0.3 },
    });
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geometry, mat));
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * 0.27, 0.06, -0.15);
      g.add(eye);
    }
    g.scale.setScalar(0.9 + i * 0.2);
    scene.add(g);
    const cy = -(0.5 + i * 0.17) * DEPTH;
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    let ang = i * 2;
    updaters.push((time, dt) => {
      // Impulso a chorro: avanza a tirones y se estira al impulsarse.
      const pulse = Math.max(0, Math.sin(time * 1.9 + i * 1.3));
      ang += (0.04 + pulse * 0.16) * dt * (i % 2 === 0 ? 1 : -1);
      pathAt(i * 3 - 2, -13 - i * 2, 9, ang, p);
      p.y = cy + Math.sin(time * 0.5 + i) * 1.4;
      g.position.copy(p);
      const dir = i % 2 === 0 ? 1 : -1;
      tgt.set(p.x - Math.sin(ang) * dir * 4, p.y, p.z + Math.cos(ang) * 2.4 * dir);
      g.lookAt(tgt);
      const s = 0.9 + i * 0.2;
      g.scale.set(s * (1 + pulse * 0.06), s * (1 + pulse * 0.06), s * (1 - pulse * 0.1));
    });
  }
}
