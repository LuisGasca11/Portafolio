import type * as ThreeNamespace from "three";
import type { SceneContext } from "./context";

/**
 * Estela de plancton bioluminiscente que une los escenarios de los
 * capítulos: un río de luz que la cámara sigue durante el descenso.
 * `build` recibe los puntos del recorrido y se vuelve a llamar al cambiar
 * el tamaño de la página.
 */
export function addTrail(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, time: uniformsTime } = ctx;
  const count = small ? 320 : 900;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const offsets: [number, number, number][] = [];
  for (let i = 0; i < count; i += 1) {
    seeds[i] = Math.random();
    // Dispersión alrededor de la curva, más densa en el centro.
    const r = Math.pow(Math.random(), 1.6) * 1.8;
    const a = Math.random() * Math.PI * 2;
    offsets.push([Math.cos(a) * r, (Math.random() - 0.5) * 0.8, Math.sin(a) * r]);
  }
  const geometry = track(new THREE.BufferGeometry());
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const material = track(
    new THREE.ShaderMaterial({
      uniforms: { uTime: uniformsTime, uPixel: ctx.pixel },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime; uniform float uPixel; attribute float aSeed; varying float vA; varying float vS;
        void main(){
          vec3 p = position;
          p.x += sin(uTime*0.6 + aSeed*40.0)*0.25;
          p.y += cos(uTime*0.5 + aSeed*30.0)*0.25;
          vec4 mv = modelViewMatrix*vec4(p,1.0);
          float twinkle = 0.45 + 0.55*sin(uTime*(1.2 + aSeed*2.0) + aSeed*60.0);
          vA = twinkle * smoothstep(60.0, 4.0, -mv.z);
          vS = aSeed;
          gl_PointSize = (2.0 + aSeed*3.0) * uPixel * (24.0 / max(1.0, -mv.z));
          gl_Position = projectionMatrix*mv;
        }`,
      fragmentShader: `
        varying float vA; varying float vS;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float glow = smoothstep(0.5, 0.0, d);
          vec3 color = mix(vec3(0.49, 0.91, 1.0), vec3(0.36, 1.0, 0.79), vS);
          gl_FragColor = vec4(color, glow*vA*0.9);
        }`,
    }),
  );
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.visible = false;
  scene.add(points);

  let curve: ThreeNamespace.CatmullRomCurve3 | undefined;
  const point = new THREE.Vector3();
  const attribute = geometry.getAttribute("position");

  const build = (path: ThreeNamespace.Vector3[]) => {
    if (path.length < 2) {
      points.visible = false;
      return;
    }
    // Descarta puntos inválidos o repetidos (una curva con tramos de largo
    // cero no se puede recorrer por longitud).
    const clean: ThreeNamespace.Vector3[] = [];
    for (const p of path) {
      const last = clean[clean.length - 1];
      if (Number.isFinite(p.x + p.y + p.z) && (!last || last.distanceTo(p) > 0.5)) clean.push(p);
    }
    if (clean.length < 2) {
      curve = undefined;
      points.visible = false;
      return;
    }
    curve = new THREE.CatmullRomCurve3(clean, false, "centripetal");
    points.visible = true;
  };

  // El plancton fluye lentamente a lo largo del camino.
  updaters.push((time) => {
    if (!curve) return;
    for (let i = 0; i < count; i += 1) {
      const t = ((seeds[i] ?? 0) + time * 0.004) % 1;
      curve.getPointAt(t, point);
      const offset = offsets[i] ?? [0, 0, 0];
      attribute.setXYZ(i, point.x + offset[0], point.y + offset[1], point.z + offset[2]);
    }
    attribute.needsUpdate = true;
  });

  return { build };
}
