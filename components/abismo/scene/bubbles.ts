import type { SceneContext } from "./context";

/**
 * Burbujas que suben alrededor de la cámara durante todo el descenso:
 * esferas brillantes con reflejo, que se mecen al subir y vuelven a nacer
 * abajo al salir de la vista.
 */
export function addBubbles(ctx: SceneContext, camera: import("three").Camera) {
  const { THREE, scene, small, track } = ctx;
  const count = small ? 70 : 170;
  const span = 40;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    // Agrupadas en columnas, como las que suben de una fumarola o un buzo.
    const column = i % 9;
    pos[i * 3] = Math.sin(column * 2.3) * 16 + (Math.random() - 0.5) * 2.5;
    pos[i * 3 + 1] = Math.random() * span;
    pos[i * 3 + 2] = -6 - Math.abs(Math.cos(column * 1.7)) * 22 + (Math.random() - 0.5) * 2.5;
    seed[i] = Math.random();
  }
  const geometry = track(new THREE.BufferGeometry());
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const uniforms = { uTime: ctx.time, uPixel: ctx.pixel, uCamY: { value: 0 }, uSpan: { value: span } };
  const points = new THREE.Points(
    geometry,
    track(
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        vertexShader: `
          uniform float uTime; uniform float uPixel; uniform float uCamY; uniform float uSpan; attribute float aSeed; varying float vA;
          void main(){
            vec3 p = position;
            float rise = uTime * (1.2 + aSeed * 1.6);
            // Posición relativa a la cámara, con vuelta al llegar arriba.
            p.y = uCamY - uSpan * 0.5 + mod(p.y + rise - uCamY, uSpan);
            p.x += sin(uTime * (1.5 + aSeed) + aSeed * 30.0) * 0.25;
            p.z += cos(uTime * (1.2 + aSeed) + aSeed * 20.0) * 0.2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uPixel * (5.0 + aSeed * 11.0) * (22.0 / max(-mv.z, 1.0));
            vA = smoothstep(55.0, 6.0, -mv.z);
          }`,
        fragmentShader: `
          varying float vA;
          void main(){
            vec2 c = gl_PointCoord - 0.5;
            float r = length(c);
            if (r > 0.5) discard;
            // Borde brillante, interior casi transparente y un reflejo arriba a la izquierda.
            float ring = smoothstep(0.32, 0.47, r) * smoothstep(0.5, 0.45, r);
            float glint = smoothstep(0.14, 0.0, length(c - vec2(-0.16, -0.16)));
            float body = 0.08 * smoothstep(0.5, 0.0, r);
            gl_FragColor = vec4(vec3(0.85, 0.97, 1.0), (ring * 0.75 + glint * 0.9 + body) * vA);
          }`,
      }),
    ),
  );
  points.frustumCulled = false;
  scene.add(points);
  ctx.updaters.push(() => {
    uniforms.uCamY.value = camera.position.y;
  });
}
