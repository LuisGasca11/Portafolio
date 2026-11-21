import { DEPTH } from "./context";
import type { SceneContext } from "./context";
import { mergeParts } from "./shapes";

export function addSeabed(ctx: SceneContext) {
  const { THREE, scene, small, track, time: uniformsTime, updaters, creature, floorY } = ctx;
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
  const floor = new THREE.Mesh(floorGeo, creature({ color: 0x3a5d63, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -DEPTH - 7, -22);
  scene.add(floor);
  // Rocas irregulares: icosaedros deformados con ruido (mismo desplazamiento
  // para vértices repetidos, así no se abren grietas).
  const rockGeo = track(new THREE.IcosahedronGeometry(1, 2));
  {
    const pos = rockGeo.getAttribute("position");
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i += 1) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 3.1 + v.y * 1.7) * 0.5 + Math.sin(v.y * 4.3 - v.z * 2.9) * 0.35 + Math.sin(v.z * 5.7 + v.x * 2.3) * 0.2;
      v.multiplyScalar(1 + n * 0.18);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    rockGeo.computeVertexNormals();
  }
  const rockMat = creature({ color: 0x2c3f46, belly: 0x16242a, roughness: 0.95, faceted: true });
  for (let i = 0; i < 11; i += 1) {
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set((Math.random() - 0.5) * 40, -DEPTH - 6.4, -8 - Math.random() * 30);
    rock.scale.set(0.8 + Math.random() * 1.6, 0.5 + Math.random() * 0.9, 0.8 + Math.random() * 1.4);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(rock);
  }

  // Corales ramificados y anémonas, con algo de bioluminiscencia.
  const branch = new THREE.CylinderGeometry(0.045, 0.08, 1, 6);
  branch.translate(0, 0.5, 0);
  const coralParts: Parameters<typeof mergeParts>[1] = [];
  const grow = (x: number, y: number, z: number, ax: number, az: number, len: number, depth: number) => {
    coralParts.push({ geometry: branch, position: [x, y, z], rotation: [ax, 0, az], scale: [1 - depth * 0.2, len, 1 - depth * 0.2] });
    if (depth >= 3) return;
    // Punta de la rama, siguiendo la inclinación.
    const tip = new THREE.Vector3(0, len, 0).applyEuler(new THREE.Euler(ax, 0, az)).add(new THREE.Vector3(x, y, z));
    for (let k = 0; k < 2; k += 1) {
      const spread = 0.35 + depth * 0.1;
      grow(tip.x, tip.y, tip.z, ax + (k === 0 ? spread : -spread) * 0.6, az + (k === 0 ? -spread : spread), len * 0.72, depth + 1);
    }
  };
  grow(0, 0, 0, 0, 0, 0.9, 0);
  grow(0.1, 0, 0.1, 0.4, 0.5, 0.7, 1);
  grow(-0.1, 0, -0.05, -0.3, -0.6, 0.75, 1);
  const coralGeo = track(mergeParts(THREE, coralParts));
  branch.dispose();
  const stalk = new THREE.CylinderGeometry(0.28, 0.36, 0.5, 14);
  const tentacle = new THREE.ConeGeometry(0.05, 0.7, 5);
  tentacle.translate(0, 0.35, 0);
  const anemoneParts: Parameters<typeof mergeParts>[1] = [{ geometry: stalk, position: [0, 0.25, 0] }];
  for (let k = 0; k < 26; k += 1) {
    const a = k * 2.399;
    const r = 0.08 + (k % 3) * 0.08;
    anemoneParts.push({ geometry: tentacle, position: [Math.cos(a) * r, 0.48, Math.sin(a) * r], rotation: [Math.sin(a) * r * 2, 0, -Math.cos(a) * r * 2] });
  }
  const anemoneGeo = track(mergeParts(THREE, anemoneParts));
  stalk.dispose();
  tentacle.dispose();
  const coralColors: [number, number][] = [
    [0xff6f91, 0x3a0b18],
    [0xff9a5c, 0x351406],
    [0xb28bff, 0x1e0f3d],
    [0x5dffc9, 0x063a2a],
  ];
  const corals = small ? 8 : 16;
  for (let i = 0; i < corals; i += 1) {
    const [color, glowColor] = coralColors[i % coralColors.length] ?? [0xff6f91, 0x3a0b18];
    const isAnemone = i % 3 === 2;
    const mesh = new THREE.Mesh(isAnemone ? anemoneGeo : coralGeo, creature({ color, emissive: glowColor, roughness: 0.6 }));
    const wx = (Math.random() - 0.5) * 36;
    const wz = -6 - Math.random() * 22;
    mesh.position.set(wx, floorY(wx, wz) - 0.1, wz);
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.scale.setScalar(isAnemone ? 0.9 + Math.random() * 0.6 : 1 + Math.random() * 1.1);
    scene.add(mesh);
    if (isAnemone) {
      const ph = Math.random() * 6;
      const base = mesh.scale.x;
      updaters.push((time) => {
        mesh.rotation.z = Math.sin(time * 0.9 + ph) * 0.06;
        mesh.scale.y = base * (1 + Math.sin(time * 1.3 + ph) * 0.05);
      });
    }
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

  // Cangrejos: caparazón, pinzas con dos dedos, patas articuladas y ojos en pedúnculos.
  const shell = new THREE.SphereGeometry(1, 18, 12);
  const arm = new THREE.CapsuleGeometry(0.07, 0.45, 4, 8);
  const finger = new THREE.ConeGeometry(0.09, 0.42, 8);
  const legA = new THREE.CapsuleGeometry(0.045, 0.45, 3, 6);
  const stalkGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 6);
  const crabParts: Parameters<typeof mergeParts>[1] = [{ geometry: shell, scale: [0.85, 0.36, 0.62] }];
  for (const side of [-1, 1]) {
    crabParts.push(
      { geometry: arm, position: [side * 0.75, 0.05, 0.45], rotation: [0, 0, side * 1.0] },
      { geometry: shell, position: [side * 1.0, 0.12, 0.72], scale: [0.26, 0.18, 0.3] },
      { geometry: finger, position: [side * 1.02, 0.18, 1.02], rotation: [Math.PI / 2 - 0.2, 0, 0] },
      { geometry: finger, position: [side * 1.0, 0.04, 0.98], rotation: [Math.PI / 2 + 0.25, 0, 0], scale: [0.8, 0.8, 0.8] },
      { geometry: stalkGeo, position: [side * 0.25, 0.42, 0.42] },
    );
    for (let l = 0; l < 3; l += 1) {
      crabParts.push(
        { geometry: legA, position: [side * 0.95, 0.05, -0.25 + l * 0.25], rotation: [0, 0, side * 1.2] },
        { geometry: legA, position: [side * 1.28, -0.2, -0.25 + l * 0.25], rotation: [0, 0, -side * 0.5] },
      );
    }
  }
  const crabGeo = track(mergeParts(THREE, crabParts));
  for (const part of [shell, arm, finger, legA, stalkGeo]) part.dispose();
  const eyeGeo = track(new THREE.SphereGeometry(0.07, 10, 8));
  const crabMat = creature({ color: 0xe8573a, belly: 0xffb08a, emissive: 0x2a0804, roughness: 0.45, pattern: "spots" });
  const eyeMat = creature({ color: 0x0a0a0a, roughness: 0.1 });
  const crabs = small ? 3 : 6;
  for (let i = 0; i < crabs; i += 1) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(crabGeo, crabMat));
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * 0.25, 0.56, 0.42);
      g.add(eye);
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
  // Estrellas de mar con brazos redondeados y textura granulada.
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10;
    const r = i % 2 === 0 ? 0.95 : 0.36;
    if (i === 0) starShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else starShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  starShape.closePath();
  const starGeo = track(new THREE.ExtrudeGeometry(starShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 }));
  starGeo.rotateX(-Math.PI / 2);
  const starColors = [0xff8f5a, 0xff6bb0, 0xffc15a, 0xb28bff];
  const starMats = starColors.map((color) => creature({ color, belly: color, emissive: 0x150505, roughness: 0.75, pattern: "spots" }));
  const stars = small ? 7 : 14;
  for (let i = 0; i < stars; i += 1) {
    const star = new THREE.Mesh(starGeo, starMats[i % starMats.length]);
    const wx = (Math.random() - 0.5) * 38;
    const wz = -5 - Math.random() * 22;
    star.position.set(wx, floorY(wx, wz) + 0.12, wz);
    star.rotation.y = Math.random() * Math.PI;
    star.scale.setScalar(0.7 + Math.random() * 0.7);
    scene.add(star);
  }
}
