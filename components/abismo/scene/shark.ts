import { DEPTH } from "./context";
import type { SceneContext } from "./context";
import { finGeometry, mergeParts, orient, smoothProfile } from "./shapes";

/** Tiburones: cuerpo fusiforme, aletas reales y nado ondulante de la cola. */
export function addSharks(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, creature, pathAt } = ctx;
  // Perfil de nariz (y = 3.3) a cola (y = -3.4); se gira para que la nariz apunte a +z.
  const body = new THREE.LatheGeometry(
    smoothProfile(THREE, [
      [0.0, -3.4],
      [0.12, -3.0],
      [0.32, -2.2],
      [0.66, -0.9],
      [0.9, 0.4],
      [0.86, 1.6],
      [0.6, 2.6],
      [0.26, 3.15],
      [0.0, 3.35],
    ]),
    24,
  );
  const dorsal = finGeometry(THREE, [
    [-0.55, 0],
    [0.05, 1.25],
    [0.25, 1.2],
    [0.2, 0.75],
    [0.55, 0],
  ]);
  // Pectoral: cuerda en x (hacia atrás), envergadura en y (hacia afuera y abajo).
  const pectoral = finGeometry(THREE, [
    [-0.45, 0],
    [0.55, 1.35],
    [0.78, 1.38],
    [0.6, 0.6],
    [0.45, 0],
  ], 0.06);
  const tail = finGeometry(THREE, [
    [0.1, -0.2],
    [-1.35, 1.45],
    [-1.1, 1.6],
    [0.05, 0.45],
    [-0.6, -0.95],
    [-0.4, -1.05],
    [0.2, -0.25],
  ], 0.05);
  const small2 = finGeometry(THREE, [
    [-0.25, 0],
    [0.05, 0.4],
    [0.2, 0],
  ], 0.04);
  const geometry = track(
    mergeParts(THREE, [
      { geometry: body, rotation: [Math.PI / 2, 0, 0], scale: [0.82, 1, 1] },
      // Las aletas se extruyen en XY: se giran para quedar verticales a lo largo de z.
      { geometry: dorsal, position: [0, 0.75, 0.3], rotation: [0, Math.PI / 2, 0] },
      { geometry: small2, position: [0, 0.32, -2.1], rotation: [0, Math.PI / 2, 0] },
      { geometry: small2, position: [0, -0.3, -1.9], rotation: [Math.PI, Math.PI / 2, 0] },
      { geometry: pectoral, position: [0.55, -0.35, 1.1], rotation: orient(THREE, [0, 0, -1], [0.85, -0.5, 0]) },
      { geometry: pectoral, position: [-0.55, -0.35, 1.1], rotation: orient(THREE, [0, 0, -1], [-0.85, -0.5, 0]) },
      // La cola apunta hacia atrás (los lóbulos tienen x negativa en el contorno).
      { geometry: tail, position: [0, 0.05, -3.2], rotation: [0, -Math.PI / 2, 0] },
    ]),
  );
  for (const part of [body, dorsal, pectoral, tail, small2]) part.dispose();
  const eyeGeo = track(new THREE.SphereGeometry(0.07, 10, 8));
  const eyeMat = creature({ color: 0x05080c, roughness: 0.15 });

  const sharks = small ? 1 : 2;
  for (let i = 0; i < sharks; i += 1) {
    const g = new THREE.Group();
    const mat = creature({
      color: 0x55788f,
      belly: 0xe3ecf0,
      roughness: 0.42,
      swim: { amp: 0.32, freq: 0.75, speed: 1.9, phase: i * 2.1, from: 1.4 },
    });
    g.add(new THREE.Mesh(geometry, mat));
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * 0.42, 0.18, 2.55);
      g.add(eye);
    }
    g.scale.setScalar(2.1);
    scene.add(g);
    const cy = -(0.4 + i * 0.28) * DEPTH;
    const speed = (i === 0 ? 1 : -1) * 0.055;
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    updaters.push((time) => {
      const ang = time * speed + i * 2.4;
      pathAt(i * 6 - 3, -30, 20, ang, p);
      p.y = cy + Math.sin(time * 0.3 + i) * 1.5;
      g.position.copy(p);
      const dir = speed > 0 ? 1 : -1;
      tgt.set(p.x - Math.sin(ang) * dir * 6, p.y + Math.cos(time * 0.3 + i) * 0.6, p.z + Math.cos(ang) * 3.6 * dir);
      g.lookAt(tgt);
      g.rotateZ(Math.sin(time * 0.5 + i) * 0.08);
    });
  }
}
