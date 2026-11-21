"use client";

import { useEffect, useRef } from "react";

export type SceneStatus = "on" | "off";

const DEPTH = 150;

/** Colores del agua según la profundidad (0 = superficie, 1 = fondo). */
const stops: { p: number; top: [number, number, number]; bottom: [number, number, number] }[] = [
  { p: 0, top: [0.31, 0.85, 0.9], bottom: [0.05, 0.48, 0.65] },
  { p: 0.25, top: [0.08, 0.58, 0.74], bottom: [0.03, 0.31, 0.48] },
  { p: 0.5, top: [0.04, 0.35, 0.53], bottom: [0.02, 0.23, 0.37] },
  { p: 0.8, top: [0.02, 0.18, 0.3], bottom: [0.01, 0.11, 0.19] },
  { p: 1, top: [0.01, 0.1, 0.18], bottom: [0, 0.04, 0.07] },
];

function waterColors(p: number) {
  let index = 0;
  while (index < stops.length - 2 && p > (stops[index + 1]?.p ?? 1)) {
    index += 1;
  }
  const a = stops[index];
  const b = stops[index + 1];
  if (!a || !b) {
    return { top: [0, 0, 0], bottom: [0, 0, 0] } as const;
  }
  const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  const mix = (x: readonly number[], y: readonly number[]) => x.map((value, i) => value + ((y[i] ?? 0) - value) * t);
  return { top: mix(a.top, b.top), bottom: mix(a.bottom, b.bottom) };
}

/**
 * Escena 3D fija detrás de la página: la cámara desciende con el scroll y
 * atraviesa nieve marina, cardúmenes, medusas y haces de luz hasta el fondo.
 * Si WebGL no está disponible avisa con `off` y la página usa su fondo CSS.
 */
export function AbismoScene({ onStatus }: { onStatus: (status: SceneStatus) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    let disposed = false;
    let stop: (() => void) | undefined;

    import("three")
      .then((THREE) => {
        if (disposed) {
          return;
        }
        const small = window.matchMedia("(max-width: 768px)").matches;
        const fine = window.matchMedia("(pointer: fine)").matches;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));

        const scene = new THREE.Scene();
        const fogColor = new THREE.Color();
        scene.fog = new THREE.FogExp2(0x0a5a86, small ? 0.03 : 0.022);
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);

        const disposables: { dispose: () => void }[] = [];
        const track = <T extends { dispose: () => void }>(item: T): T => {
          disposables.push(item);
          return item;
        };
        const uniformsTime = { value: 0 };

        // Fondo: degradado a pantalla completa que cambia con la profundidad.
        const bgUniforms = { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() } };
        const bg = new THREE.Mesh(
          track(new THREE.PlaneGeometry(2, 2)),
          track(
            new THREE.ShaderMaterial({
              uniforms: bgUniforms,
              depthTest: false,
              depthWrite: false,
              vertexShader: "varying float vY; void main(){ vY = position.y*0.5+0.5; gl_Position = vec4(position.xy, 0.999, 1.0); }",
              fragmentShader: "uniform vec3 uTop; uniform vec3 uBottom; varying float vY; void main(){ gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, vY)), 1.0); }",
            }),
          ),
        );
        bg.frustumCulled = false;
        bg.renderOrder = -1000;
        scene.add(bg);

        // Nieve marina.
        const snowCount = small ? 520 : 1500;
        const snowPos = new Float32Array(snowCount * 3);
        const snowSeed = new Float32Array(snowCount);
        for (let i = 0; i < snowCount; i += 1) {
          snowPos[i * 3] = (Math.random() - 0.5) * 70;
          snowPos[i * 3 + 1] = -DEPTH - 20 + Math.random() * (DEPTH + 40);
          snowPos[i * 3 + 2] = -Math.random() * 40 + 6;
          snowSeed[i] = Math.random();
        }
        const snowGeo = track(new THREE.BufferGeometry());
        snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3));
        snowGeo.setAttribute("aSeed", new THREE.BufferAttribute(snowSeed, 1));
        const snowUniforms = { uTime: uniformsTime, uPixel: { value: renderer.getPixelRatio() }, uColor: { value: new THREE.Color(0xcff6ff) } };
        const snow = new THREE.Points(
          snowGeo,
          track(
            new THREE.ShaderMaterial({
              uniforms: snowUniforms,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              vertexShader: `
                uniform float uTime; uniform float uPixel; attribute float aSeed; varying float vA;
                void main(){
                  vec3 p = position;
                  float range = ${(DEPTH + 40).toFixed(1)};
                  p.x += sin(uTime*0.25 + aSeed*40.0)*0.8;
                  p.z += cos(uTime*0.2 + aSeed*30.0)*0.8;
                  p.y = mod(p.y - uTime*(0.25 + aSeed*0.35) + ${(DEPTH + 20).toFixed(1)}, range) - ${(DEPTH + 20).toFixed(1)};
                  vec4 mv = modelViewMatrix*vec4(p,1.0);
                  gl_Position = projectionMatrix*mv;
                  float d = -mv.z;
                  gl_PointSize = uPixel*(0.9 + aSeed*2.6)*(34.0/max(d,1.0));
                  vA = smoothstep(70.0, 6.0, d) * (0.35 + 0.65*abs(sin(uTime*0.6 + aSeed*50.0)));
                }`,
              fragmentShader: `
                uniform vec3 uColor; varying float vA;
                void main(){ float r = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(uColor, a*vA*0.8); }`,
            }),
          ),
        );
        snow.frustumCulled = false;
        scene.add(snow);

        // Haces de luz desde la superficie.
        const rayUniforms = { uStrength: { value: 1 }, uTime: uniformsTime };
        const rayMat = track(
          new THREE.ShaderMaterial({
            uniforms: rayUniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
            fragmentShader: `
              uniform float uStrength; uniform float uTime; varying vec2 vUv;
              void main(){
                float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
                float along = pow(vUv.y, 1.6);
                float flicker = 0.75 + 0.25*sin(uTime*0.8 + vUv.y*6.0);
                gl_FragColor = vec4(vec3(0.75, 0.97, 1.0), across*along*flicker*0.16*uStrength);
              }`,
          }),
        );
        const rayGeo = track(new THREE.PlaneGeometry(5, 70));
        const rays: import("three").Mesh[] = [];
        const rayCount = small ? 4 : 7;
        for (let i = 0; i < rayCount; i += 1) {
          const ray = new THREE.Mesh(rayGeo, rayMat);
          ray.position.set(-24 + (i * 48) / (rayCount - 1), -22, -26 - (i % 3) * 5);
          ray.rotation.z = 0.28 + (i % 2) * 0.08;
          ray.scale.x = 0.8 + (i % 3) * 0.5;
          scene.add(ray);
          rays.push(ray);
        }

        // Peces: cardúmenes instanciados.
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
          uFog: { value: new THREE.Color() },
          uFogDensity: { value: (scene.fog as import("three").FogExp2).density },
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

        // Medusas.
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

        // Fondo marino.
        const floorGeo = track(new THREE.PlaneGeometry(120, 80, 48, 32));
        {
          const pos = floorGeo.attributes.position;
          if (pos) {
            for (let i = 0; i < pos.count; i += 1) {
              pos.setZ(i, Math.sin(pos.getX(i) * 0.25) * 0.8 + Math.cos(pos.getY(i) * 0.3) * 0.7 + Math.random() * 0.15);
            }
            floorGeo.computeVertexNormals();
          }
        }
        const floor = new THREE.Mesh(floorGeo, track(new THREE.MeshBasicMaterial({ color: 0x0c2230 })));
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, -DEPTH - 7, -22);
        scene.add(floor);
        const rockGeo = track(new THREE.IcosahedronGeometry(1, 0));
        const rockMat = track(new THREE.MeshBasicMaterial({ color: 0x08161f }));
        for (let i = 0; i < 9; i += 1) {
          const rock = new THREE.Mesh(rockGeo, rockMat);
          rock.position.set((Math.random() - 0.5) * 40, -DEPTH - 6.2, -8 - Math.random() * 30);
          rock.scale.set(0.6 + Math.random() * 1.3, 0.4 + Math.random() * 0.7, 0.6 + Math.random() * 1.2);
          rock.rotation.set(Math.random(), Math.random(), Math.random());
          scene.add(rock);
        }
        // Plancton luminoso del fondo.
        const glowCount = small ? 40 : 90;
        const glowPos = new Float32Array(glowCount * 3);
        const glowSeed = new Float32Array(glowCount);
        for (let i = 0; i < glowCount; i += 1) {
          glowPos[i * 3] = (Math.random() - 0.5) * 44;
          glowPos[i * 3 + 1] = -DEPTH - 5.4 + Math.random() * 4;
          glowPos[i * 3 + 2] = -6 - Math.random() * 28;
          glowSeed[i] = Math.random();
        }
        const glowGeo = track(new THREE.BufferGeometry());
        glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
        glowGeo.setAttribute("aSeed", new THREE.BufferAttribute(glowSeed, 1));
        const glow = new THREE.Points(
          glowGeo,
          track(
            new THREE.ShaderMaterial({
              uniforms: { uTime: uniformsTime, uPixel: snowUniforms.uPixel },
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              vertexShader: `
                uniform float uTime; uniform float uPixel; attribute float aSeed; varying float vA; varying float vH;
                void main(){
                  vec3 p = position; p.y += sin(uTime*0.7 + aSeed*30.0)*0.35;
                  vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
                  gl_PointSize = uPixel*(6.0 + aSeed*10.0)*(30.0/max(-mv.z,1.0));
                  vA = 0.35 + 0.65*pow(0.5 + 0.5*sin(uTime*1.3 + aSeed*60.0), 2.0); vH = aSeed;
                }`,
              fragmentShader: `
                varying float vA; varying float vH;
                void main(){ float r = length(gl_PointCoord-0.5); float a = pow(smoothstep(0.5, 0.0, r), 2.0);
                  vec3 c = mix(vec3(0.36, 1.0, 0.79), vec3(1.0, 0.42, 0.84), step(0.6, vH)); gl_FragColor = vec4(c, a*vA); }`,
            }),
          ),
        );
        glow.frustumCulled = false;
        scene.add(glow);

        // Luces para las criaturas de relieve (el resto usa sombreado propio).
        scene.add(new THREE.AmbientLight(0x9fd8ff, 1.05));
        const sunLight = new THREE.DirectionalLight(0xe6f8ff, 1.5);
        sunLight.position.set(-6, 12, 8);
        scene.add(sunLight);
        const flat = (color: number, emissive = 0x000000) =>
          track(new THREE.MeshLambertMaterial({ color, flatShading: true, emissive, side: THREE.DoubleSide }));
        const floorY = (wx: number, wz: number) =>
          -DEPTH - 7 + Math.sin(wx * 0.25) * 0.8 + Math.cos((-22 - wz) * 0.3) * 0.7;
        const updaters: ((time: number, dt: number) => void)[] = [];
        const pathAt = (cx: number, cz: number, radius: number, ang: number, out: import("three").Vector3) =>
          out.set(cx + Math.cos(ang) * radius, 0, cz + Math.sin(ang) * radius * 0.6);

        // Algas laminarias en el fondo (instanciadas, se mecen con el tiempo).
        const kelpGeo = track(new THREE.PlaneGeometry(0.9, 1, 1, 9));
        kelpGeo.translate(0, 0.5, 0);
        const kelpCount = small ? 30 : 64;
        const kelpPhase = new Float32Array(kelpCount);
        const kelpHeight = new Float32Array(kelpCount);
        const kelpMat = track(
          new THREE.ShaderMaterial({
            uniforms: { uTime: uniformsTime, uFog: fishUniforms.uFog, uFogDensity: fishUniforms.uFogDensity },
            side: THREE.DoubleSide,
            vertexShader: `
              uniform float uTime; attribute float aPhase; attribute float aHeight; varying float vH; varying float vDist;
              void main(){
                vec3 p = position; float h = p.y; vH = h;
                p.x *= mix(1.0, 0.2, h) * (1.0 + 0.3*sin(h*10.0 + aPhase*6.28));
                p.y *= aHeight;
                p.x += sin(uTime*1.1 + aPhase*6.28 + h*3.0) * 0.55 * h*h * aHeight * 0.4;
                p.z += cos(uTime*0.9 + aPhase*5.0 + h*2.5) * 0.3 * h*h * aHeight * 0.3;
                vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
                vDist = -mv.z; gl_Position = projectionMatrix * mv;
              }`,
            fragmentShader: `
              uniform vec3 uFog; uniform float uFogDensity; varying float vH; varying float vDist;
              void main(){
                vec3 col = mix(vec3(0.03, 0.22, 0.16), vec3(0.42, 0.95, 0.52), vH);
                col += vec3(0.1, 0.2, 0.1) * pow(vH, 3.0);
                float f = 1.0 - exp(-uFogDensity*uFogDensity*vDist*vDist);
                gl_FragColor = vec4(mix(col, uFog, clamp(f, 0.0, 0.9)), 1.0);
              }`,
          }),
        );
        const kelpGeoI = kelpGeo.clone();
        track(kelpGeoI);
        const kelp = new THREE.InstancedMesh(kelpGeoI, kelpMat, kelpCount);
        kelp.frustumCulled = false;
        {
          const m = new THREE.Object3D();
          for (let i = 0; i < kelpCount; i += 1) {
            const wx = (Math.random() - 0.5) * 66;
            const wz = -5 - Math.random() * 30;
            m.position.set(wx, floorY(wx, wz) - 0.2, wz);
            m.rotation.set(0, Math.random() * Math.PI, 0);
            const w = 0.8 + Math.random() * 1.2;
            m.scale.set(w, 1, w);
            m.updateMatrix();
            kelp.setMatrixAt(i, m.matrix);
            kelpPhase[i] = Math.random();
            kelpHeight[i] = 3 + Math.random() * 6;
          }
        }
        kelpGeoI.setAttribute("aPhase", new THREE.InstancedBufferAttribute(kelpPhase, 1));
        kelpGeoI.setAttribute("aHeight", new THREE.InstancedBufferAttribute(kelpHeight, 1));
        scene.add(kelp);

        // Pez ángel (cardumen pequeño de cuerpo alto).
        {
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

        // Mantarrayas.
        {
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

        // Tortugas marinas.
        {
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

        // Tiburones lejanos.
        {
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

        // Calamares con propulsión a chorros.
        {
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

        // Cangrejos y estrellas de mar en el fondo.
        {
          const bodyGeo = track(new THREE.SphereGeometry(1, 8, 6));
          const legGeo = track(new THREE.BoxGeometry(0.9, 0.08, 0.08));
          const crabMat = flat(0xff6a4a, 0x401408);
          const crabs = small ? 3 : 6;
          for (let i = 0; i < crabs; i += 1) {
            const g = new THREE.Group();
            const body = new THREE.Mesh(bodyGeo, crabMat);
            body.scale.set(0.8, 0.35, 0.6);
            g.add(body);
            for (const side of [-1, 1]) {
              const claw = new THREE.Mesh(bodyGeo, crabMat);
              claw.scale.set(0.28, 0.2, 0.3);
              claw.position.set(side * 0.8, 0.1, 0.65);
              g.add(claw);
              const eye = new THREE.Mesh(bodyGeo, flat(0xffffff));
              eye.scale.setScalar(0.09);
              eye.position.set(side * 0.28, 0.42, 0.4);
              g.add(eye);
              for (let l = 0; l < 3; l += 1) {
                const leg = new THREE.Mesh(legGeo, crabMat);
                leg.position.set(side * 0.9, -0.05, -0.25 + l * 0.25);
                leg.rotation.z = side * 0.5;
                g.add(leg);
              }
            }
            g.scale.setScalar(0.9 + Math.random() * 0.6);
            scene.add(g);
            const bx = (Math.random() - 0.5) * 34;
            const bz = -6 - Math.random() * 18;
            const ph = Math.random() * 6;
            updaters.push((time) => {
              const x = bx + Math.sin(time * 0.35 + ph) * 3;
              g.position.set(x, floorY(x, bz) + 0.35, bz);
              g.rotation.y = Math.sin(time * 0.35 + ph) > 0 ? Math.PI / 2 : -Math.PI / 2;
              g.rotation.z = Math.sin(time * 6 + ph) * 0.04;
            });
          }
          const starShape = new THREE.Shape();
          for (let i = 0; i < 10; i += 1) {
            const angle = (Math.PI * 2 * i) / 10;
            const r = i % 2 === 0 ? 0.95 : 0.36;
            if (i === 0) starShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else starShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          starShape.closePath();
          const starGeo = track(new THREE.ExtrudeGeometry(starShape, { depth: 0.14, bevelEnabled: false }));
          starGeo.rotateX(-Math.PI / 2);
          const starColors = [0xff8f5a, 0xff6bb0, 0xffc15a, 0xb28bff];
          const stars = small ? 7 : 14;
          for (let i = 0; i < stars; i += 1) {
            const star = new THREE.Mesh(starGeo, flat(starColors[i % starColors.length] ?? 0xff8f5a));
            const wx = (Math.random() - 0.5) * 38;
            const wz = -5 - Math.random() * 22;
            star.position.set(wx, floorY(wx, wz) + 0.12, wz);
            star.rotation.y = Math.random() * Math.PI;
            star.scale.setScalar(0.7 + Math.random() * 0.7);
            scene.add(star);
          }
        }

        // Estado de scroll, puntero y tamaño.
        let maxScroll = 1;
        let progress = 0;
        let smooth = 0;
        let lastY = window.scrollY;
        let velocity = 0;
        const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

        const resize = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          renderer.setSize(w, h, false);
          const aspect = w / h;
          camera.aspect = aspect;
          const hfov = (78 * Math.PI) / 180;
          const vfov = (2 * Math.atan(Math.tan(hfov / 2) / aspect) * 180) / Math.PI;
          camera.fov = Math.min(100, Math.max(50, vfov));
          camera.updateProjectionMatrix();
          maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(document.body);
        window.addEventListener("resize", resize);
        const onPointer = (event: PointerEvent) => {
          pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
          pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
        };
        if (fine) {
          window.addEventListener("pointermove", onPointer, { passive: true });
        }

        const dummy = new THREE.Object3D();
        const target = new THREE.Vector3();
        const clock = new THREE.Clock();
        let raf = 0;

        const frame = () => {
          raf = requestAnimationFrame(frame);
          const dt = Math.min(clock.getDelta(), 0.05);
          const time = clock.elapsedTime;
          uniformsTime.value = time;

          const y = window.scrollY;
          velocity += ((y - lastY) / Math.max(dt, 0.001) / 2000 - velocity) * 0.2;
          lastY = y;
          progress = Math.min(1, Math.max(0, y / maxScroll));
          smooth += (progress - smooth) * (1 - Math.exp(-dt * 4));

          const colors = waterColors(smooth);
          bgUniforms.uTop.value.setRGB(colors.top[0] ?? 0, colors.top[1] ?? 0, colors.top[2] ?? 0);
          bgUniforms.uBottom.value.setRGB(colors.bottom[0] ?? 0, colors.bottom[1] ?? 0, colors.bottom[2] ?? 0);
          fogColor.setRGB(((colors.top[0] ?? 0) + (colors.bottom[0] ?? 0)) / 2, ((colors.top[1] ?? 0) + (colors.bottom[1] ?? 0)) / 2, ((colors.top[2] ?? 0) + (colors.bottom[2] ?? 0)) / 2);
          fishUniforms.uFog.value.copy(fogColor);
          const fog = scene.fog as import("three").FogExp2;
          fog.color.copy(fogColor);
          rayUniforms.uStrength.value = Math.max(0, 1 - smooth * 3.2);

          pointer.x += (pointer.tx - pointer.x) * 0.05;
          pointer.y += (pointer.ty - pointer.y) * 0.05;
          const pitch = -0.28 * Math.min(1, Math.max(0, (smooth - 0.86) / 0.14));
          camera.position.set(pointer.x * 1.4 + Math.sin(time * 0.2) * 0.5, -smooth * DEPTH + Math.sin(time * 0.3) * 0.3 - pointer.y * 0.5, 0);
          camera.rotation.set(pitch - pointer.y * 0.03, -pointer.x * 0.05, Math.max(-0.08, Math.min(0.08, -velocity * 0.02)));

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

          for (const jelly of jellies) {
            jelly.group.position.set(
              jelly.base[0] + Math.sin(time * 0.25 + jelly.phase) * 1.2,
              jelly.base[1] + Math.sin(time * 0.5 + jelly.phase) * 1.1,
              jelly.base[2],
            );
            jelly.group.rotation.y = time * 0.15 + jelly.phase;
          }
          for (const update of updaters) {
            update(time, dt);
          }
          for (const ray of rays) {
            ray.rotation.z += Math.sin(time * 0.3 + ray.position.x) * 0.0002;
          }

          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);
        onStatus("on");

        stop = () => {
          cancelAnimationFrame(raf);
          resizeObserver.disconnect();
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", onPointer);
          for (const item of disposables) {
            item.dispose();
          }
          renderer.dispose();
          renderer.forceContextLoss();
        };
      })
      .catch(() => {
        onStatus("off");
      });

    return () => {
      disposed = true;
      stop?.();
    };
  }, [onStatus]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
