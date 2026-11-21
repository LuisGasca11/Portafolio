import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addSquids(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, flat, pathAt } = ctx;
  const mantleGeo = track(new THREE.ConeGeometry(0.45, 2.3, 8));
  const headGeo = track(new THREE.SphereGeometry(0.4, 8, 6));
  const finGeo = track(new THREE.ConeGeometry(0.5, 0.9, 3));
  const lineGeo = track(new THREE.BufferGeometry());
  {
    const pts: number[] = [];
    for (let a = 0; a < 8; a += 1) {
      const ang = (a / 8) * Math.PI * 2;
      const len = a % 4 === 0 ? 2.2 : 1.3;
      pts.push(Math.cos(ang) * 0.22, Math.sin(ang) * 0.22, 0.3, Math.cos(ang) * 0.3, Math.sin(ang) * 0.3 - 0.1, 0.3 + len);
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  }
  const mat = flat(0xff9ab4, 0x4a1a2a);
  const lineMat = track(new THREE.LineBasicMaterial({ color: 0xffc2d2, transparent: true, opacity: 0.8 }));
  const squids = small ? 2 : 3;
  for (let i = 0; i < squids; i += 1) {
    const g = new THREE.Group();
    const mantle = new THREE.Mesh(mantleGeo, mat);
    mantle.rotation.x = -Math.PI / 2;
    mantle.position.z = -1.2;
    const head = new THREE.Mesh(headGeo, mat);
    const finA = new THREE.Mesh(finGeo, mat);
    finA.scale.set(1.6, 0.25, 1);
    finA.rotation.x = -Math.PI / 2;
    finA.position.set(0, 0, -2.0);
    g.add(mantle, head, finA, new THREE.LineSegments(lineGeo, lineMat));
    g.scale.setScalar(0.9 + i * 0.2);
    scene.add(g);
    const cy = -(0.5 + i * 0.17) * DEPTH;
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    let ang = i * 2;
    updaters.push((time, dt) => {
      const pulse = Math.max(0, Math.sin(time * 1.9 + i * 1.3));
      ang += (0.04 + pulse * 0.16) * dt * (i % 2 === 0 ? 1 : -1);
      pathAt(i * 3 - 2, -13 - i * 2, 9, ang, p);
      p.y = cy + Math.sin(time * 0.5 + i) * 1.4;
      g.position.copy(p);
      const dir = i % 2 === 0 ? 1 : -1;
      tgt.set(p.x - Math.sin(ang) * dir * 4, p.y, p.z + Math.cos(ang) * 2.4 * dir);
      g.lookAt(tgt);
      g.scale.z = (0.9 + i * 0.2) * (1 - pulse * 0.12);
    });
  }
}
