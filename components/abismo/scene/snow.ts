import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addSnow(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime } = ctx;
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
  const snowUniforms = { uTime: uniformsTime, uPixel: ctx.pixel, uColor: { value: new THREE.Color(0xcff6ff) } };
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

}
