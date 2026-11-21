import type { SceneContext } from "./context";
import { causticGlsl } from "./materials";

/**
 * La superficie del mar vista desde abajo: brilla dentro de la ventana de
 * Snell (mirando hacia arriba) y refleja el agua fuera de ella, con el
 * oleaje marcando líneas de luz. Se desvanece al descender.
 */
export function addSurface(ctx: SceneContext) {
  const { THREE, scene, track, time: uniformsTime, updaters } = ctx;
  const uniforms = { uTime: uniformsTime, uFade: { value: 1 } };
  const surface = new THREE.Mesh(
    track(new THREE.PlaneGeometry(260, 260, 1, 1)),
    track(
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        vertexShader: `
          varying vec3 vWPos;
          void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWPos = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `
          uniform float uTime; uniform float uFade; varying vec3 vWPos;
          ${causticGlsl}
          void main(){
            vec3 toCam = cameraPosition - vWPos;
            float dist = length(toCam);
            float up = clamp(-toCam.y / dist, 0.0, 1.0);
            // Ventana de Snell: cono de ~49° sobre la cámara por donde se ve el cielo.
            float window = smoothstep(0.55, 0.8, up);
            float waves = causticAt(vWPos.xz * 0.6, uTime * 1.3);
            vec3 reflection = vec3(0.12, 0.42, 0.55) + waves * vec3(0.35, 0.6, 0.65);
            vec3 sky = vec3(0.85, 0.98, 1.0) + waves * 0.15;
            vec3 col = mix(reflection, sky, window);
            float alpha = mix(0.55, 0.95, window) * exp(-dist * 0.018) * uFade;
            gl_FragColor = vec4(col, alpha);
          }`,
      }),
    ),
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 7;
  surface.renderOrder = -10;
  scene.add(surface);
  updaters.push((_time, _dt, smooth) => {
    uniforms.uFade.value = Math.max(0, 1 - smooth * 6);
    surface.visible = uniforms.uFade.value > 0.01;
  });
}
