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
          uniform float uTime; uniform float uPhase; varying vec3 vN; varying vec3 vV; varying float vH;
          void main(){
            float pulse = sin(uTime*1.8 + uPhase);
            vec3 p = position;
            p.xz *= 1.0 + 0.12*pulse*(1.0 - p.y);
            p.y *= 1.0 - 0.14*pulse;
            vec4 mv = modelViewMatrix*vec4(p,1.0);
            vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); vH = p.y;
            gl_Position = projectionMatrix*mv;
          }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uFade; varying vec3 vN; varying vec3 vV; varying float vH;
          void main(){
            float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
            vec3 col = mix(uColor, vec3(1.0), fr*0.55 + vH*0.12);
            gl_FragColor = vec4(col*(0.55 + fr), (0.1 + fr*0.7)*uFade);
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
    group.add(bell, tentacles);
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
