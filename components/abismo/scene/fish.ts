import { DEPTH } from "./context";
import type { SceneContext, Three } from "./context";
import { causticGlsl } from "./materials";

type FishShape = {
  /** Alto del cuerpo respecto al largo (pez ángel: alto). */
  height: number;
  /** Ancho del cuerpo (los peces son aplanados de lado). */
  width: number;
  /** Tamaño de la cola. */
  tail: number;
  /** Alto de las aletas dorsal y anal. */
  fin: number;
};

/**
 * Cuerpo de pez: anillos elípticos de la nariz (z = 1.2) a la base de la cola
 * (z = -0.9), cola bifurcada y aletas dorsal y anal. Sin índices, con normales.
 */
export function buildFishGeometry(THREE: Three, shape: FishShape) {
  const rings = 12;
  const segs = 12;
  const zAt = (t: number) => 1.2 - t * 2.1;
  // Perfil: nariz redondeada, más grueso en el primer tercio, fino en la cola.
  const radius = (t: number) => Math.pow(Math.sin(Math.PI * Math.pow(t, 0.75)), 0.85) * (1 - t * 0.55) * 0.34 + 0.012;
  const ring = (t: number, s: number) => {
    const a = (s / segs) * Math.PI * 2;
    const r = radius(t);
    return [Math.cos(a) * r * shape.width, Math.sin(a) * r * shape.height, zAt(t)] as const;
  };
  const pos: number[] = [];
  const tri = (a: readonly number[], b: readonly number[], c: readonly number[]) => {
    pos.push(...a, ...b, ...c);
  };
  for (let i = 0; i < rings; i += 1) {
    const t0 = i / rings;
    const t1 = (i + 1) / rings;
    for (let s = 0; s < segs; s += 1) {
      const a = ring(t0, s);
      const b = ring(t1, s);
      const c = ring(t1, s + 1);
      const d = ring(t0, s + 1);
      tri(a, b, c);
      tri(a, c, d);
    }
  }
  const tz = zAt(1);
  const tl = shape.tail;
  // Cola bifurcada (dos lóbulos).
  tri([0, 0.1 * tl, tz + 0.05], [0, 0.62 * tl, tz - 0.75 * tl], [0, 0.08 * tl, tz - 0.42 * tl]);
  tri([0, -0.1 * tl, tz + 0.05], [0, -0.08 * tl, tz - 0.42 * tl], [0, -0.58 * tl, tz - 0.72 * tl]);
  tri([0, 0.1 * tl, tz + 0.05], [0, 0.08 * tl, tz - 0.42 * tl], [0, -0.08 * tl, tz - 0.42 * tl]);
  tri([0, 0.1 * tl, tz + 0.05], [0, -0.08 * tl, tz - 0.42 * tl], [0, -0.1 * tl, tz + 0.05]);
  // Aletas dorsal y anal.
  const top = radius(0.3) * shape.height;
  const fin = shape.fin;
  tri([0, top * 0.95, 0.45], [0, top + 0.42 * fin, -0.35], [0, top * 0.55, -0.55]);
  tri([0, -top * 0.9, 0.05], [0, -top * 0.5, -0.6], [0, -top - 0.3 * fin, -0.45]);
  // Aletas pectorales.
  for (const side of [-1, 1]) {
    const x = radius(0.25) * shape.width * side;
    tri([x, -0.05, 0.55], [x + side * 0.28, -0.18, 0.15], [x, -0.1, 0.3]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Material instanciado de peces: contrasombreado, línea lateral, ojos, cáusticas y brillo. */
export function makeFishMaterial(ctx: SceneContext, options: { stripes: boolean }) {
  const { THREE, track } = ctx;
  return track(
    new THREE.ShaderMaterial({
      uniforms: { uTime: ctx.time, uFog: ctx.fog.uFog, uFogDensity: ctx.fog.uFogDensity, uCaustic: ctx.caustic },
      side: THREE.DoubleSide,
      defines: options.stripes ? { STRIPES: 1 } : {},
      vertexShader: `
        uniform float uTime; attribute float aPhase; attribute vec3 aColor;
        varying vec3 vColor; varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vWPos; varying float vDist;
        void main(){
          vec3 p = position;
          float tail = smoothstep(0.4, -1.7, p.z);
          float beat = uTime * 9.0 + aPhase * 6.28;
          p.x += sin(beat + p.z * 2.5) * 0.2 * tail;
          p.x += sin(beat * 0.5 + p.z * 1.2) * 0.03;
          vLocal = position;
          vec4 world = modelMatrix * instanceMatrix * vec4(p, 1.0);
          vec4 mv = viewMatrix * world;
          vN = normalize(mat3(viewMatrix) * mat3(modelMatrix) * mat3(instanceMatrix) * normal);
          vView = normalize(-mv.xyz);
          vWPos = world.xyz;
          vColor = aColor;
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uFog; uniform float uFogDensity; uniform float uTime; uniform float uCaustic;
        varying vec3 vColor; varying vec3 vLocal; varying vec3 vN; varying vec3 vView; varying vec3 vWPos; varying float vDist;
        ${causticGlsl}
        void main(){
          vec3 n = normalize(vN);
          if (!gl_FrontFacing) n = -n;
          // Lomo del color de la especie, vientre plateado y línea lateral clara.
          float side = vLocal.y;
          vec3 back = vColor * 0.7;
          vec3 belly = mix(vec3(0.92, 0.97, 1.0), vColor, 0.25);
          vec3 col = mix(belly, back, smoothstep(-0.12, 0.12, side));
          col = mix(col, vColor * 1.25 + 0.1, smoothstep(0.035, 0.0, abs(side - 0.01)) * step(-0.8, vLocal.z) * 0.7);
          #ifdef STRIPES
            col *= 0.45 + 0.55 * smoothstep(0.2, 0.45, abs(sin(vLocal.z * 6.5 + 0.6)));
          #endif
          // Ojo.
          float eye = length(vec2(vLocal.y - 0.07, vLocal.z - 0.86));
          col = mix(col, vec3(0.02, 0.03, 0.05), smoothstep(0.075, 0.055, eye));
          col = mix(col, vec3(1.0), smoothstep(0.022, 0.0, length(vec2(vLocal.y - 0.09, vLocal.z - 0.88))));
          // Luz desde arriba, cáusticas sobre el lomo y brillo iridiscente.
          float light = 0.5 + 0.5 * max(0.0, dot(n, normalize(vec3(0.2, 1.0, 0.4))));
          col *= light;
          float c = causticAt(vWPos.xz + vWPos.y * 0.3, uTime) * uCaustic * max(0.0, n.y);
          col += col * c * 0.9;
          float fres = pow(1.0 - abs(dot(n, vView)), 3.0);
          col += mix(vec3(0.35, 0.85, 1.0), vec3(0.8, 0.5, 1.0), 0.5 + 0.5 * sin(vLocal.z * 4.0)) * fres * 0.45;
          float f = 1.0 - exp(-uFogDensity * uFogDensity * vDist * vDist);
          gl_FragColor = vec4(mix(col, uFog, clamp(f, 0.0, 0.92)), 1.0);
        }`,
    }),
  );
}

export function addFishSchools(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters } = ctx;
  const fishGeo = track(buildFishGeometry(THREE, { height: 1, width: 0.42, tail: 1, fin: 1 }));
  const fishMat = makeFishMaterial(ctx, { stripes: false });

  type School = { mesh: import("three").InstancedMesh; count: number; center: [number, number, number]; radius: number; speed: number; offsets: Float32Array };
  const schools: School[] = [];
  const addSchool = (depthFrac: number, count: number, radius: number, speed: number, palette: number[][], z: number, x: number) => {
    const geometry = track(fishGeo.clone());
    const mesh = new THREE.InstancedMesh(geometry, fishMat, count);
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
    geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
    geometry.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
    scene.add(mesh);
    schools.push({ mesh, count, center: [x, -depthFrac * DEPTH, z], radius, speed, offsets });
  };
  const k = small ? 0.55 : 1;
  addSchool(0.045, Math.round(46 * k), 9, 0.22, [[0.45, 0.85, 1], [0.55, 0.95, 0.85], [1, 0.8, 0.35]], -17, 0);
  addSchool(0.16, Math.round(34 * k), 11, -0.18, [[0.4, 0.75, 1], [1, 0.6, 0.3], [0.6, 0.95, 0.8]], -20, 2);
  addSchool(0.34, Math.round(28 * k), 10, 0.15, [[0.3, 0.6, 0.85], [0.45, 0.75, 0.95]], -22, -3);
  addSchool(0.62, Math.round(24 * k), 12, -0.12, [[0.25, 0.5, 0.75], [0.35, 0.6, 0.85]], -24, 1);

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
        target.set(px - Math.sin(ang) * school.radius * dir, py + Math.cos(time * 0.8 + ph) * 0.3, pz + Math.cos(ang) * school.radius * 0.6 * dir);
        dummy.lookAt(target);
        dummy.scale.setScalar(0.55 + (ph % 1) * 0.25);
        dummy.updateMatrix();
        school.mesh.setMatrixAt(i, dummy.matrix);
      }
      school.mesh.instanceMatrix.needsUpdate = true;
    }
  });
}
