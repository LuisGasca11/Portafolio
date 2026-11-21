import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addSharks(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, flat, pathAt } = ctx;
  const prof = [[0, -3.2], [0.28, -2.8], [0.7, -1.6], [0.92, 0], [0.8, 1.6], [0.45, 2.7], [0.12, 3.2], [0, 3.3]].map(([r, y]) => new THREE.Vector2(r, y));
  const bodyGeo = track(new THREE.LatheGeometry(prof, 12));
  const finGeo = track(new THREE.ConeGeometry(0.5, 1.2, 4));
  const mat = flat(0x56768d);
  const lightMat = flat(0xb9d2df);
  const sharks = small ? 1 : 2;
  for (let i = 0; i < sharks; i += 1) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, mat);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1, 1, 0.8);
    const belly = new THREE.Mesh(bodyGeo, lightMat);
    belly.rotation.x = Math.PI / 2;
    belly.scale.set(0.92, 0.96, 0.6);
    belly.position.y = -0.18;
    const dorsal = new THREE.Mesh(finGeo, mat);
    dorsal.scale.set(0.25, 1, 1);
    dorsal.position.set(0, 1.05, 0.2);
    dorsal.rotation.x = -0.3;
    g.add(body, belly, dorsal);
    for (const side of [-1, 1]) {
      const fin = new THREE.Mesh(finGeo, mat);
      fin.scale.set(0.9, 0.9, 0.22);
      fin.position.set(side * 0.95, -0.4, 0.9);
      fin.rotation.z = -side * 1.3;
      g.add(fin);
    }
    const tail = new THREE.Group();
    tail.position.z = -3.1;
    const up = new THREE.Mesh(finGeo, mat);
    up.scale.set(0.2, 1.4, 1);
    up.position.set(0, 0.7, -0.4);
    up.rotation.x = -0.7;
    const low = new THREE.Mesh(finGeo, mat);
    low.scale.set(0.2, 0.9, 0.8);
    low.position.set(0, -0.45, -0.3);
    low.rotation.x = Math.PI + 0.7;
    tail.add(up, low);
    g.add(tail);
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
      tgt.set(p.x - Math.sin(ang) * dir * 6, p.y, p.z + Math.cos(ang) * 3.6 * dir);
      g.lookAt(tgt);
      tail.rotation.y = Math.sin(time * 1.8 + i) * 0.3;
    });
  }
}
