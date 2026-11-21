import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addFishSchools(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime, updaters } = ctx;
  const fishGeo = track(new THREE.BufferGeometry());
  const fv = new Float32Array([
    0, 0, 1.2, 0, 0.34, 0.15, -0.3, 0, 0.25,
    0, 0, 1.2, 0.3, 0, 0.25, 0, 0.34, 0.15,
    0, 0, 1.2, 0, -0.28, 0.15, 0.3, 0, 0.25,
    0, 0, 1.2, -0.3, 0, 0.25, 0, -0.28, 0.15,
    0, 0.34, 0.15, 0.3, 0, 0.25, 0, 0, -1,
    0, 0.34, 0.15, 0, 0, -1, -0.3, 0, 0.25,
    0, -0.28, 0.15, 0, 0, -1, 0.3, 0, 0.25,
    0, -0.28, 0.15, -0.3, 0, 0.25, 0, 0, -1,
    0, 0, -0.9, 0, 0.6, -1.7, 0, 0, -1.25,
    0, 0, -0.9, 0, 0, -1.25, 0, -0.55, -1.7,
  ]);
  fishGeo.setAttribute("position", new THREE.BufferAttribute(fv, 3));
  fishGeo.computeVertexNormals();
  const fishUniforms = {
    uTime: uniformsTime,
    uFog: ctx.fog.uFog,
    uFogDensity: ctx.fog.uFogDensity,
  };
  const fishMat = track(
    new THREE.ShaderMaterial({
      uniforms: fishUniforms,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime; attribute float aPhase; attribute vec3 aColor;
        varying vec3 vColor; varying float vShade; varying float vDist;
        void main(){
          vec3 p = position;
          float tail = smoothstep(0.0, -1.7, p.z);
          p.x += sin(uTime*9.0 + aPhase*6.28 + p.z*2.5)*0.22*tail;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
          vec3 n = normalize(mat3(modelViewMatrix) * mat3(instanceMatrix) * normal);
          vShade = 0.55 + 0.45*dot(n, normalize(vec3(0.2, 1.0, 0.4)));
          vColor = aColor * mix(0.75, 1.15, step(0.0, p.y));
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uFog; uniform float uFogDensity; varying vec3 vColor; varying float vShade; varying float vDist;
        void main(){
          vec3 col = vColor * vShade;
          float f = 1.0 - exp(-uFogDensity*uFogDensity*vDist*vDist);
          gl_FragColor = vec4(mix(col, uFog, clamp(f, 0.0, 0.92)), 1.0);
        }`,
    }),
  );

  type School = { mesh: import("three").InstancedMesh; count: number; center: [number, number, number]; radius: number; speed: number; offsets: Float32Array };
  const schools: School[] = [];
  const addSchool = (depthFrac: number, count: number, radius: number, speed: number, palette: number[][], z: number, x: number) => {
    const mesh = new THREE.InstancedMesh(fishGeo, fishMat, count);
    mesh.frustumCulled = false;
    const phase = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const offsets = new Float32Array(count * 4);
    for (let i = 0; i < count; i += 1) {
      phase[i] = Math.random();
      const c = palette[Math.floor(Math.random() * palette.length)] ?? [1, 1, 1];
      colors.set(c, i * 3);
      offsets[i * 4] = (Math.random() - 0.5) * 5;
      offsets[i * 4 + 1] = (Math.random() - 0.5) * 2.6;
      offsets[i * 4 + 2] = (Math.random() - 0.5) * 5;
      offsets[i * 4 + 3] = Math.random() * Math.PI * 2;
    }
    mesh.geometry = fishGeo.clone();
    track(mesh.geometry);
    mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
    mesh.geometry.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
    scene.add(mesh);
    schools.push({ mesh, count, center: [x, -depthFrac * DEPTH, z], radius, speed, offsets });
  };
  const k = small ? 0.55 : 1;
  addSchool(0.045, Math.round(46 * k), 9, 0.22, [[0.55, 0.95, 1], [0.7, 1, 0.9], [1, 0.85, 0.5]], -17, 0);
  addSchool(0.16, Math.round(34 * k), 11, -0.18, [[0.5, 0.85, 1], [1, 0.7, 0.4], [0.7, 1, 0.85]], -20, 2);
  addSchool(0.34, Math.round(28 * k), 10, 0.15, [[0.35, 0.7, 0.9], [0.5, 0.8, 0.95]], -22, -3);
  addSchool(0.62, Math.round(24 * k), 12, -0.12, [[0.25, 0.55, 0.75], [0.35, 0.65, 0.85]], -24, 1);

  const dummy = new THREE.Object3D();
  const target = new THREE.Vector3();
  updaters.push((time) => {
    for (const school of schools) {
      const [cx, cy, cz] = school.center;
      const a = time * school.speed;
      const dir = school.speed > 0 ? 1 : -1;
      for (let i = 0; i < school.count; i += 1) {
        const ox = school.offsets[i * 4] ?? 0;
        const oy = school.offsets[i * 4 + 1] ?? 0;
        const oz = school.offsets[i * 4 + 2] ?? 0;
        const ph = school.offsets[i * 4 + 3] ?? 0;
        const ang = a + ph * 0.05;
        const px = cx + Math.cos(ang) * school.radius + ox;
        const pz = cz + Math.sin(ang) * school.radius * 0.6 + oz;
        const py = cy + oy + Math.sin(time * 0.8 + ph) * 0.4;
        dummy.position.set(px, py, pz);
        target.set(px - Math.sin(ang) * school.radius * dir, py, pz + Math.cos(ang) * school.radius * 0.6 * dir);
        dummy.lookAt(target);
        dummy.scale.setScalar(0.55 + (ph % 1) * 0.25);
        dummy.updateMatrix();
        school.mesh.setMatrixAt(i, dummy.matrix);
      }
      school.mesh.instanceMatrix.needsUpdate = true;
    }
  });
  return fishMat;
}
