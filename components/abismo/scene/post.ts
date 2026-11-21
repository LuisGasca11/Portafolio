import type * as ThreeNamespace from "three";
import type { Three } from "./context";

/**
 * Pase final bajo el agua: la escena se dibuja en un búfer y se muestra con
 * refracción ondulante, haces de luz desde la superficie, absorción del rojo
 * con la profundidad, viñeta y un poco de grano para evitar bandas.
 */
export function createUnderwaterPass(THREE: Three, renderer: ThreeNamespace.WebGLRenderer, small: boolean) {
  const target = new THREE.WebGLRenderTarget(1, 1, { samples: small ? 0 : 4, depthBuffer: true });
  const uniforms = {
    tScene: { value: target.texture },
    uTime: { value: 0 },
    uDepth: { value: 0 },
    uAspect: { value: 1 },
    uStrength: { value: small ? 0.7 : 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: `
      uniform sampler2D tScene; uniform float uTime; uniform float uDepth; uniform float uAspect; uniform float uStrength;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(float x){ float i = floor(x); float f = fract(x); return mix(hash(vec2(i, 0.0)), hash(vec2(i + 1.0, 0.0)), f * f * (3.0 - 2.0 * f)); }
      void main(){
        vec2 uv = vUv;
        // Refracción: dos ondas cruzadas que mueven la imagen apenas.
        float amp = (0.0016 + 0.0016 * (1.0 - uDepth)) * uStrength;
        uv.x += (sin(uv.y * 24.0 + uTime * 1.4) + 0.6 * sin(uv.y * 9.0 - uTime * 0.8 + uv.x * 4.0)) * amp;
        uv.y += (cos(uv.x * 20.0 * uAspect + uTime * 1.1) + 0.6 * cos(uv.x * 7.0 - uTime * 0.6)) * amp * 0.7;
        vec2 d = uv - 0.5;
        float edge = dot(d, d);
        // Leve dispersión de color hacia los bordes.
        vec3 col;
        col.r = texture2D(tScene, uv - d * edge * 0.012).r;
        col.g = texture2D(tScene, uv).g;
        col.b = texture2D(tScene, uv + d * edge * 0.012).b;
        // Haces de luz que bajan inclinados desde la superficie.
        float x = (uv.x - 0.5) * uAspect + (1.0 - uv.y) * 0.35;
        float shafts = noise(x * 9.0 + uTime * 0.15) * noise(x * 23.0 - uTime * 0.22 + 7.0);
        shafts = pow(shafts, 2.2) * smoothstep(0.1, 1.0, uv.y);
        float light = clamp(1.0 - uDepth * 1.6, 0.0, 1.0);
        col += vec3(0.55, 0.9, 1.0) * shafts * 0.32 * light;
        // Absorción: el agua se come primero el rojo y luego el verde.
        col *= mix(vec3(1.0), vec3(0.62, 0.9, 1.06), clamp(uDepth * 1.3, 0.0, 1.0));
        // Viñeta suave.
        col *= 1.0 - smoothstep(0.25, 0.95, length(d * vec2(uAspect * 0.75, 1.0))) * 0.42;
        col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) / 160.0;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  quadScene.add(quad);

  return {
    setSize(width: number, height: number, pixelRatio: number) {
      target.setSize(Math.max(1, Math.floor(width * pixelRatio)), Math.max(1, Math.floor(height * pixelRatio)));
      uniforms.uAspect.value = width / Math.max(1, height);
    },
    render(scene: ThreeNamespace.Scene, camera: ThreeNamespace.Camera, time: number, depth: number) {
      uniforms.uTime.value = time;
      uniforms.uDepth.value = depth;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCamera);
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
