import { DEPTH } from "./context";
import type { SceneContext } from "./context";

export function addSeabed(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime, updaters, flat, floorY } = ctx;
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
        uniforms: { uTime: uniformsTime, uPixel: ctx.pixel },
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

  // Algas laminarias en el fondo (instanciadas, se mecen con el tiempo).
  const kelpGeo = track(new THREE.PlaneGeometry(0.9, 1, 1, 9));
  kelpGeo.translate(0, 0.5, 0);
  const kelpCount = small ? 30 : 64;
  const kelpPhase = new Float32Array(kelpCount);
  const kelpHeight = new Float32Array(kelpCount);
  const kelpMat = track(
    new THREE.ShaderMaterial({
      uniforms: { uTime: uniformsTime, uFog: ctx.fog.uFog, uFogDensity: ctx.fog.uFogDensity },
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

  // Cangrejos y estrellas de mar.
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
