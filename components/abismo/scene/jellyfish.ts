import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addJellyfish(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime, updaters } = ctx;
  const jellyBell = track(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2));
  const tentacleGeo = track(new THREE.BufferGeometry());
  {
    const tentacles = 14;
    const segments = 16;
    const pos: number[] = [];
    const t: number[] = [];
    for (let a = 0; a < tentacles; a += 1) {
      const ang = (a / tentacles) * Math.PI * 2;
      const r = 0.35 + (a % 3) * 0.2;
      for (let s = 0; s < segments; s += 1) {
        for (const j of [s, s + 1]) {
          pos.push(Math.cos(ang) * r, -(j / segments) * (1.6 + (a % 4) * 0.4), Math.sin(ang) * r);
          t.push(j / segments + a * 0.37);
        }
      }
    }
    tentacleGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    tentacleGeo.setAttribute("aT", new THREE.Float32BufferAttribute(t, 1));
  }
  // Cuatro cintas cruzadas, ancho decreciente hacia abajo.
  const oralGeo = track(new THREE.BufferGeometry());
  {
    const pos: number[] = [];
    const t: number[] = [];
    const segs = 18;
    for (let k = 0; k < 4; k += 1) {
      const ang = (k / 4) * Math.PI;
      const cx = Math.cos(ang);
      const cz = Math.sin(ang);
      for (let j = 0; j < segs; j += 1) {
        for (const jj of [j, j + 1]) {
          const h = jj / segs;
          const w = 0.22 * (1 - h * 0.6) * (1 + 0.35 * Math.sin(h * 18));
          pos.push(-cx * w, -h * 2.4, -cz * w, cx * w, -h * 2.4, cz * w);
          t.push(h + k * 0.25, h + k * 0.25);
        }
      }
    }
    const idx: number[] = [];
    for (let k = 0; k < 4; k += 1) {
      for (let j = 0; j < segs; j += 1) {
        const b = (k * segs + j) * 4;
        idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }
    oralGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    oralGeo.setAttribute("aT", new THREE.Float32BufferAttribute(t, 1));
    oralGeo.setIndex(idx);
  }
  const oralMat = (color: import("three").Color, phase: number) =>
    track(
      new THREE.ShaderMaterial({
        uniforms: { uTime: uniformsTime, uColor: { value: color }, uPhase: { value: phase } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime; uniform float uPhase; attribute float aT; varying float vH;
          void main(){
            vec3 p = position; float d = -p.y;
            p.x += sin(uTime*1.4 + d*2.2 + uPhase)*0.18*d;
            p.z += cos(uTime*1.1 + d*1.8 + uPhase)*0.14*d;
            vH = d / 2.4;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }`,
        fragmentShader: "uniform vec3 uColor; varying float vH; void main(){ gl_FragColor = vec4(mix(vec3(1.0), uColor, 0.6), (1.0 - vH) * 0.28); }",
      }),
    );

  type Jelly = { group: import("three").Group; base: [number, number, number]; phase: number; mats: import("three").ShaderMaterial[] };
  const jellies: Jelly[] = [];
  const jellyCount = small ? 5 : 10;
  const palette = [0xff6bd6, 0x7ee8ff, 0xb28bff, 0x5dffc9, 0xff9d7a];
  for (let i = 0; i < jellyCount; i += 1) {
    const color = new THREE.Color(palette[i % palette.length]);
    const phase = Math.random() * 6.28;
    const bellMat = track(
      new THREE.ShaderMaterial({
        uniforms: { uTime: uniformsTime, uColor: { value: color }, uPhase: { value: phase }, uFade: { value: 1 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime; uniform float uPhase; varying vec3 vN; varying vec3 vV; varying float vH; varying vec2 vUv;
          void main(){
            vUv = uv;
            float pulse = sin(uTime*1.8 + uPhase);
            vec3 p = position;
            p.xz *= 1.0 + 0.12*pulse*(1.0 - p.y);
            p.y *= 1.0 - 0.14*pulse;
            vec4 mv = modelViewMatrix*vec4(p,1.0);
            vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); vH = p.y;
            gl_Position = projectionMatrix*mv;
          }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uFade; varying vec3 vN; varying vec3 vV; varying float vH; varying vec2 vUv;
          void main(){
            float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
            // Costillas radiales, gónadas en forma de trébol y borde festoneado.
            float ribs = pow(abs(sin(vUv.x * 3.14159 * 16.0)), 10.0) * smoothstep(0.95, 0.4, vUv.y);
            float gonad = smoothstep(0.32, 0.0, abs(vUv.y - 0.72)) * pow(0.5 + 0.5 * cos(vUv.x * 6.28318 * 4.0), 3.0);
            float rim = smoothstep(0.08, 0.0, vUv.y) * (0.6 + 0.4 * sin(vUv.x * 6.28318 * 24.0));
            vec3 col = mix(uColor, vec3(1.0), fr*0.55 + vH*0.12);
            col += uColor * gonad * 0.9 + vec3(1.0) * ribs * 0.25 + uColor * rim * 0.8;
            float alpha = 0.08 + fr * 0.65 + ribs * 0.12 + gonad * 0.35 + rim * 0.3;
            gl_FragColor = vec4(col*(0.55 + fr), alpha*uFade);
          }`,
      }),
    );
    const tentMat = track(
      new THREE.ShaderMaterial({
        uniforms: { uTime: uniformsTime, uColor: { value: color }, uPhase: { value: phase } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime; uniform float uPhase; attribute float aT; varying float vA;
          void main(){
            vec3 p = position;
            float depth = -p.y;
            p.x += sin(uTime*1.6 + aT*4.0 + uPhase)*0.16*depth;
            p.z += cos(uTime*1.3 + aT*3.0 + uPhase)*0.12*depth;
            p.y += sin(uTime*1.8 + uPhase)*0.08*depth;
            vA = 0.75 * (1.0 - fract(aT)*0.5);
            gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }`,
        fragmentShader: "uniform vec3 uColor; varying float vA; void main(){ gl_FragColor = vec4(mix(uColor, vec3(1.0), 0.35), vA*0.6); }",
      }),
    );
    const group = new THREE.Group();
    const bell = new THREE.Mesh(jellyBell, bellMat);
    bell.scale.set(1.2, 0.95, 1.2);
    const tentacles = new THREE.LineSegments(tentacleGeo, tentMat);
    tentacles.position.y = 0.02;
    tentacles.scale.set(1.15, 1, 1.15);
    // Brazos orales: cintas onduladas que cuelgan del centro.
    const arms = new THREE.Mesh(oralGeo, oralMat(color, phase));
    arms.scale.set(1, 1.1, 1);
    group.add(bell, tentacles, arms);
    const s = 0.7 + Math.random() * 1.0;
    group.scale.setScalar(s);
    const depthFrac = 0.1 + (i / jellyCount) * 0.82 + (Math.random() - 0.5) * 0.04;
    const side = i % 2 === 0 ? -1 : 1;
    const base: [number, number, number] = [side * (4 + Math.random() * 9), -depthFrac * DEPTH, -13 - Math.random() * 16];
    group.position.set(...base);
    scene.add(group);
    jellies.push({ group, base, phase, mats: [bellMat] });
  }

  updaters.push((time) => {
    for (const jelly of jellies) {
      jelly.group.position.set(
        jelly.base[0] + Math.sin(time * 0.25 + jelly.phase) * 1.2,
        jelly.base[1] + Math.sin(time * 0.5 + jelly.phase) * 1.1,
        jelly.base[2],
      );
      jelly.group.rotation.y = time * 0.15 + jelly.phase;
    }
  });
}
