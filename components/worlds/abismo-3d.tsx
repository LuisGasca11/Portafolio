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
