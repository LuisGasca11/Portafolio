import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addTurtles(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, flat, pathAt } = ctx;
  const shellGeo = track(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2));
  const headGeo = track(new THREE.IcosahedronGeometry(0.4, 0));
  const flipGeo = track(new THREE.SphereGeometry(1, 6, 4));
  const shellMat = flat(0x6c8f4c);
  const skinMat = flat(0xc2ad76);
  const turtles = small ? 1 : 2;
  for (let i = 0; i < turtles; i += 1) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.scale.set(1.3, 0.6, 1.7);
    const plastron = new THREE.Mesh(shellGeo, skinMat);
    plastron.scale.set(1.2, -0.25, 1.6);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.05, 1.95);
    head.scale.set(1, 0.85, 1.2);
    g.add(shell, plastron, head);
    const flips: import("three").Group[] = [];
    for (const [x, z, s] of [[1.3, 0.8, 1], [-1.3, 0.8, 1], [0.9, -1.3, 0.6], [-0.9, -1.3, 0.6]] as const) {
      const pivot = new THREE.Group();
      pivot.position.set(x, -0.05, z);
      const f = new THREE.Mesh(flipGeo, skinMat);
      f.scale.set(0.9 * s, 0.1, 0.35 * s);
      f.position.x = Math.sign(x) * 0.7 * s;
      pivot.add(f);
      g.add(pivot);
      flips.push(pivot);
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
      tgt.set(p.x - Math.sin(ang) * 4, p.y, p.z + Math.cos(ang) * 2.4);
      g.lookAt(tgt);
      const t = Math.sin(time * 1.6 + i);
      flips.forEach((pivot, index) => {
        pivot.rotation.z = (index % 2 === 0 ? -1 : 1) * (0.3 + t * 0.35);
      });
    });
  }
}
