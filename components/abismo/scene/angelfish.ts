import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addAngelfish(ctx: SceneContext, fishMat: import("three").ShaderMaterial) {
  const { THREE, scene, small, track, updaters, pathAt } = ctx;
  const a = [0, 0, 0.9, 0, 1.15, -0.1, -0.2, 0, 0, 0, 0, 0.9, 0.2, 0, 0, 0, 1.15, -0.1,
    0, 0, 0.9, -0.2, 0, 0, 0, -1.15, -0.1, 0, 0, 0.9, 0, -1.15, -0.1, 0.2, 0, 0,
    0, 1.15, -0.1, 0, 0, -1, -0.2, 0, 0, 0, 1.15, -0.1, 0.2, 0, 0, 0, 0, -1,
    0, -1.15, -0.1, -0.2, 0, 0, 0, 0, -1, 0, -1.15, -0.1, 0, 0, -1, 0.2, 0, 0];
  const angelGeo = track(new THREE.BufferGeometry());
  angelGeo.setAttribute("position", new THREE.Float32BufferAttribute(a, 3));
  angelGeo.computeVertexNormals();
  const count = small ? 7 : 14;
  const mesh = new THREE.InstancedMesh(angelGeo, fishMat, count);
  mesh.frustumCulled = false;
  mesh.geometry = angelGeo.clone();
  track(mesh.geometry);
  const phase = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const offs = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    phase[i] = Math.random();
    colors.set(i % 3 === 0 ? [1, 0.95, 0.85] : [1, 0.78, 0.3], i * 3);
    offs.set([(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 4], i * 3);
  }
  mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
  mesh.geometry.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
  scene.add(mesh);
  const d = new THREE.Object3D();
  const tgt = new THREE.Vector3();
  const p = new THREE.Vector3();
  updaters.push((time) => {
    for (let i = 0; i < count; i += 1) {
      const ang = time * 0.16 + i * 0.03;
      pathAt(-4, -20, 8, ang, p);
      p.x += offs[i * 3] ?? 0;
      p.z += offs[i * 3 + 2] ?? 0;
      p.y = -0.11 * DEPTH + (offs[i * 3 + 1] ?? 0) + Math.sin(time * 0.7 + i) * 0.3;
      d.position.copy(p);
      tgt.set(p.x - Math.sin(ang) * 3, p.y, p.z + Math.cos(ang) * 2);
      d.lookAt(tgt);
      d.scale.setScalar(0.3 + (i % 4) * 0.04);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });
}
