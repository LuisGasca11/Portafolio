import type { SceneContext } from "./context";

export function addRays(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime, updaters } = ctx;
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

  updaters.push((time, _dt, smooth) => {
    rayUniforms.uStrength.value = Math.max(0, 1 - smooth * 3.2);
    for (const ray of rays) {
      ray.rotation.z += Math.sin(time * 0.3 + ray.position.x) * 0.0002;
    }
  });
}
