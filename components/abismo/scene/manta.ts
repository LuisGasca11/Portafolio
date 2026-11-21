import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addMantas(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, flat, pathAt } = ctx;
  const wing = track(new THREE.BufferGeometry());
  wing.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 1.2, 3, 0, -0.2, 0, 0, -1.1, 0, 0, 1.2, 1.4, 0.08, -0.6, 3, 0, -0.2], 3));
  wing.computeVertexNormals();
  const bodyGeo = track(new THREE.SphereGeometry(1, 8, 6));
  const tailGeo = track(new THREE.ConeGeometry(0.08, 3.2, 5));
  const mat = flat(0x1d3c5c);
  const belly = flat(0xcfe6f2);
  const mantas = small ? 2 : 3;
  for (let i = 0; i < mantas; i += 1) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, mat);
    body.scale.set(0.6, 0.22, 1.1);
    const left = new THREE.Group();
    const right = new THREE.Group();
    left.add(new THREE.Mesh(wing, mat));
    const r = new THREE.Mesh(wing, mat);
    r.scale.x = -1;
    right.add(r);
    const tail = new THREE.Mesh(tailGeo, mat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.z = -2.5;
    const underside = new THREE.Mesh(bodyGeo, belly);
    underside.scale.set(0.5, 0.1, 0.9);
    underside.position.y = -0.12;
    g.add(body, left, right, tail, underside);
    g.scale.setScalar(1.5 + i * 0.25);
    scene.add(g);
    const cy = -(0.22 + i * 0.25) * DEPTH;
    const speed = (i % 2 === 0 ? 1 : -1) * (0.1 + i * 0.015);
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    updaters.push((time) => {
      const ang = time * speed + i * 2;
      pathAt(i * 3 - 3, -22 - i * 2, 15, ang, p);
      p.y = cy + Math.sin(time * 0.4 + i) * 1.2;
      g.position.copy(p);
      const dir = speed > 0 ? 1 : -1;
      tgt.set(p.x - Math.sin(ang) * dir * 5, p.y, p.z + Math.cos(ang) * 3 * dir);
      g.lookAt(tgt);
      const flap = Math.sin(time * 1.5 + i) * 0.35;
      left.rotation.z = flap;
      right.rotation.z = -flap;
    });
  }
}
