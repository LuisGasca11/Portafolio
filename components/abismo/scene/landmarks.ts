import type * as ThreeNamespace from "three";
import type { SceneContext } from "./context";

/**
 * Escenarios del descenso: uno por capítulo. La cámara se lanza hacia cada
 * uno cuando su capítulo queda fijo en pantalla (ver `engine.ts`).
 */
export type Station = {
  /** Igual que el `data-chapter` del capítulo. */
  id: string;
  group: ThreeNamespace.Group;
  /** Posición horizontal y de fondo del escenario. */
  x: number;
  z: number;
  /** Distancia a la que se detiene la cámara. */
  stand: number;
  /** Si va apoyado en el fondo marino. */
  onFloor?: boolean;
};

export function addLandmarks(ctx: SceneContext): Station[] {
  const { THREE, scene, track, flat, updaters, small } = ctx;

  // Halo radial compartido por los brillos.
  const glowTexture = (() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const g = canvas.getContext("2d");
    if (g) {
      const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.35, "rgba(255,255,255,0.45)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gradient;
      g.fillRect(0, 0, size, size);
    }
    return track(new THREE.CanvasTexture(canvas));
  })();
  const glow = (color: number, scale: number) => {
    const sprite = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glowTexture, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })),
    );
    sprite.scale.setScalar(scale);
    return sprite;
  };
  const shine = (color: number) => track(new THREE.MeshBasicMaterial({ color }));
  const rock = track(new THREE.IcosahedronGeometry(1, 0));
  const cone = track(new THREE.ConeGeometry(1, 1, 5));
  const cylinder = track(new THREE.CylinderGeometry(1, 1, 1, 8));
  const ball = track(new THREE.SphereGeometry(1, 12, 8));
  const box = track(new THREE.BoxGeometry(1, 1, 1));

  const mesh = (geometry: ThreeNamespace.BufferGeometry, material: ThreeNamespace.Material, parent: ThreeNamespace.Object3D) => {
    const m = new THREE.Mesh(geometry, material);
    parent.add(m);
    return m;
  };

  const stations: Station[] = [];
  const side = small ? 1.6 : 7.4;

  // 02 · Sobre mí: arco de arrecife con corales.
  {
    const group = new THREE.Group();
    const coral = flat(0xe86f62, 0x2a0606);
    const arch = mesh(track(new THREE.TorusGeometry(2.6, 0.6, 6, 16, Math.PI)), coral, group);
    arch.position.y = 0.2;
    const stone = flat(0x6f7f86);
    for (const sx of [-2.6, 2.6]) {
      const base = mesh(rock, stone, group);
      base.position.set(sx, -0.4, 0);
      base.scale.set(1.3, 1, 1.2);
    }
    const colors = [0xff6bd6, 0xffd27a, 0xb28bff, 0xff8a5c, 0x5dffc9];
    const branches: ThreeNamespace.Mesh[] = [];
    for (let i = 0; i < 16; i += 1) {
      const branch = mesh(cone, flat(colors[i % colors.length] ?? 0xff8a5c, 0x110411), group);
      const a = (i / 16) * Math.PI;
      const onArch = i % 2 === 0;
      if (onArch) {
        branch.position.set(Math.cos(a) * 2.6, 0.2 + Math.sin(a) * 3.2, 0.2);
      } else {
        branch.position.set((i % 4 < 2 ? -1 : 1) * (2 + (i % 3) * 0.5), -0.2 + (i % 3) * 0.3, 0.6);
      }
      branch.scale.set(0.18, 0.9 + (i % 3) * 0.4, 0.18);
      branch.rotation.z = (i % 2 ? 1 : -1) * 0.3;
      branches.push(branch);
    }
    const anemone = glow(0xff9fe0, 1.6);
    anemone.position.set(0, -0.2, 0.8);
    group.add(anemone);
    updaters.push((time) => {
      branches.forEach((branch, i) => {
        branch.rotation.x = Math.sin(time * 1.2 + i) * 0.12;
      });
      anemone.material.opacity = 0.6 + Math.sin(time * 2) * 0.25;
    });
    stations.push({ id: "sobre-mi", group, x: side, z: -17, stand: 12 });
  }

  // 03 · Desarrollos: estación de investigación con domo de cristal.
  {
    const group = new THREE.Group();
    const metal = flat(0x3b5866);
    const platform = mesh(cylinder, metal, group);
    platform.scale.set(2.6, 0.45, 2.6);
    for (let i = 0; i < 3; i += 1) {
      const leg = mesh(cylinder, metal, group);
      const a = (i / 3) * Math.PI * 2;
      leg.position.set(Math.cos(a) * 2, -1.4, Math.sin(a) * 2);
      leg.scale.set(0.12, 2.6, 0.12);
    }
    const domeGeo = track(new THREE.SphereGeometry(2, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2));
    const dome = mesh(
      domeGeo,
      track(new THREE.MeshBasicMaterial({ color: 0x2bb8e0, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending })),
      group,
    );
    dome.position.y = 0.2;
    const wire = new THREE.LineSegments(
      track(new THREE.WireframeGeometry(domeGeo)),
      track(new THREE.LineBasicMaterial({ color: 0x7ee8ff, transparent: true, opacity: 0.45 })),
    );
    wire.position.y = 0.2;
    group.add(wire);
    const core = mesh(track(new THREE.IcosahedronGeometry(0.55, 0)), shine(0xbff6ff), group);
    core.position.y = 1;
    const coreGlow = glow(0x7ee8ff, 4);
    coreGlow.position.y = 1;
    group.add(coreGlow);
    const antenna = mesh(cylinder, metal, group);
    antenna.position.set(0.9, 2.6, 0);
    antenna.scale.set(0.05, 1.6, 0.05);
    const beacon = glow(0xff6b6b, 0.9);
    beacon.position.set(0.9, 3.45, 0);
    group.add(beacon);
    // Pantallas que orbitan el domo: un desarrollo cada una.
    const screens: ThreeNamespace.Mesh[] = [];
    const screenMat = track(new THREE.MeshBasicMaterial({ color: 0x7ee8ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    const screenGeo = track(new THREE.PlaneGeometry(1.1, 0.7));
    for (let i = 0; i < 5; i += 1) {
      screens.push(mesh(screenGeo, screenMat, group));
    }
    updaters.push((time) => {
      core.rotation.set(time * 0.6, time * 0.9, 0);
      coreGlow.material.opacity = 0.7 + Math.sin(time * 2.2) * 0.2;
      beacon.material.opacity = Math.sin(time * 4) > 0.4 ? 1 : 0.15;
      screens.forEach((screen, i) => {
        const a = time * 0.35 + (i / screens.length) * Math.PI * 2;
        screen.position.set(Math.cos(a) * 3.3, 1 + Math.sin(time * 0.8 + i) * 0.4, Math.sin(a) * 3.3);
        screen.lookAt(0, 1, 0);
      });
    });
    stations.push({ id: "desarrollos", group, x: side, z: -18, stand: 12.5 });
  }

  // 04 · Experiencia: barco hundido con portillas encendidas.
  {
    const group = new THREE.Group();
    const wood = flat(0x6b4a33);
    const darkWood = flat(0x4a3022);
    const hull = mesh(box, wood, group);
    hull.scale.set(5.6, 1.5, 1.9);
    const bow = mesh(track(new THREE.ConeGeometry(1.05, 2, 4)), wood, group);
    bow.rotation.set(0, Math.PI / 4, -Math.PI / 2);
    bow.position.set(3.7, 0, 0);
    bow.scale.set(1, 1, 1.35);
    const deck = mesh(box, darkWood, group);
    deck.position.set(-1.2, 1.2, 0);
    deck.scale.set(1.8, 1, 1.5);
    const mast = mesh(cylinder, darkWood, group);
    mast.position.set(0.8, 2.4, 0);
    mast.scale.set(0.12, 3.8, 0.12);
    mast.rotation.z = -0.35;
    const lights: ThreeNamespace.Sprite[] = [];
    for (let i = 0; i < 4; i += 1) {
      const porthole = mesh(track(new THREE.CircleGeometry(0.2, 10)), shine(0xffd27a), group);
      porthole.position.set(-1.8 + i * 1.3, 0, 0.96);
      const light = glow(0xffc46b, 1.3);
      light.position.copy(porthole.position);
      light.position.z += 0.1;
      group.add(light);
      lights.push(light);
    }
    const lantern = glow(0xffd27a, 2.4);
    lantern.position.set(-1.2, 2, 0.9);
    group.add(lantern);
    group.rotation.set(0.12, -0.5, 0.16);
    updaters.push((time) => {
      lights.forEach((light, i) => {
        light.material.opacity = 0.55 + Math.sin(time * 1.6 + i * 1.3) * 0.3;
      });
      lantern.material.opacity = 0.7 + Math.sin(time * 3.1) * 0.2;
    });
    stations.push({ id: "experiencia", group, x: side, z: -19, stand: 13.5 });
  }

  // 05 · Habilidades: jardín bioluminiscente.
  {
    const group = new THREE.Group();
    const base = mesh(rock, flat(0x23303a), group);
    base.scale.set(3, 0.9, 2.2);
    base.position.y = -0.6;
    const hues = [190, 160, 320, 45, 270, 20];
    const pods: { sprite: ThreeNamespace.Sprite; bulb: ThreeNamespace.Mesh; phase: number }[] = [];
    const stalkMat = flat(0x1d4a4a, 0x062020);
    for (let i = 0; i < 15; i += 1) {
      const a = i * 2.39;
      const r = 0.4 + (i % 5) * 0.45;
      const h = 1 + ((i * 7) % 5) * 0.45;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * 0.7;
      const stalk = mesh(cylinder, stalkMat, group);
      stalk.position.set(x, h / 2 - 0.2, z);
      stalk.scale.set(0.05, h, 0.05);
      const color = new THREE.Color().setHSL((hues[i % hues.length] ?? 190) / 360, 1, 0.65);
      const bulb = mesh(ball, track(new THREE.MeshBasicMaterial({ color })), group);
      bulb.position.set(x, h - 0.2, z);
      bulb.scale.setScalar(0.16);
      const sprite = glow(color.getHex(), 1.3);
      sprite.position.copy(bulb.position);
      group.add(sprite);
      pods.push({ sprite, bulb, phase: i * 0.9 });
    }
    updaters.push((time) => {
      for (const pod of pods) {
        const pulse = 0.5 + Math.sin(time * 1.8 + pod.phase) * 0.5;
        pod.sprite.material.opacity = 0.35 + pulse * 0.65;
        pod.sprite.scale.setScalar(1 + pulse * 0.7);
        pod.bulb.scale.setScalar(0.13 + pulse * 0.06);
      }
    });
    stations.push({ id: "habilidades", group, x: side, z: -17, stand: 11.5 });
  }

  // 06 · Educación: chimeneas hidrotermales con gusanos de tubo.
  {
    const group = new THREE.Group();
    const chimneyMat = flat(0x3a302b);
    const vents: [number, number, number][] = [
      [-1.4, 2.6, 0],
      [0.6, 3.6, -0.6],
      [1.9, 2, 0.5],
    ];
    const plumeCount = 70;
    const plumePos = new Float32Array(vents.length * plumeCount * 3);
    const plumeSeed: number[] = [];
    vents.forEach(([vx, vh, vz], v) => {
      const chimney = mesh(track(new THREE.CylinderGeometry(0.35, 0.85, 1, 7)), chimneyMat, group);
      chimney.position.set(vx, vh / 2 - 0.5, vz);
      chimney.scale.y = vh;
      const mouth = glow(0xff9d5c, 1.8);
      mouth.position.set(vx, vh - 0.5, vz);
      group.add(mouth);
      for (let i = 0; i < plumeCount; i += 1) {
        plumeSeed.push(Math.random(), vx, vh - 0.5, vz);
        plumePos[(v * plumeCount + i) * 3] = vx;
      }
    });
    const plumeGeo = track(new THREE.BufferGeometry());
    plumeGeo.setAttribute("position", new THREE.BufferAttribute(plumePos, 3));
    const plume = new THREE.Points(
      plumeGeo,
      track(new THREE.PointsMaterial({ color: 0x9fe8d8, size: 0.16, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })),
    );
    group.add(plume);
    const wormMat = flat(0xf2efe6);
    const tips: ThreeNamespace.Mesh[] = [];
    for (let i = 0; i < 12; i += 1) {
      const worm = mesh(cylinder, wormMat, group);
      const x = -2.6 + i * 0.45;
      const h = 0.6 + (i % 3) * 0.3;
      worm.position.set(x, h / 2 - 0.5, 1 + (i % 2) * 0.3);
      worm.scale.set(0.05, h, 0.05);
      const tip = mesh(ball, shine(0xff3b5c), group);
      tip.position.set(x, h - 0.5, worm.position.z);
      tip.scale.setScalar(0.1);
      tips.push(tip);
    }
    const positions = plumeGeo.getAttribute("position");
    updaters.push((time) => {
      for (let i = 0; i < positions.count; i += 1) {
        const seed = plumeSeed[i * 4] ?? 0;
        const t = (time * 0.18 + seed) % 1;
        positions.setXYZ(
          i,
          (plumeSeed[i * 4 + 1] ?? 0) + Math.sin(seed * 40 + time) * t * 0.7,
          (plumeSeed[i * 4 + 2] ?? 0) + t * 5,
          (plumeSeed[i * 4 + 3] ?? 0) + Math.cos(seed * 30 + time) * t * 0.7,
        );
      }
      positions.needsUpdate = true;
      tips.forEach((tip, i) => {
        tip.scale.setScalar(0.08 + Math.max(0, Math.sin(time * 2 + i)) * 0.05);
      });
    });
    stations.push({ id: "educacion", group, x: side, z: -17, stand: 12 });
  }

  // 07 · Contacto: faro sonar en el fondo y un mensaje en una botella.
  {
    const group = new THREE.Group();
    const pole = mesh(cylinder, flat(0x5d7480), group);
    pole.scale.set(0.12, 3.2, 0.12);
    pole.position.y = 1.6;
    const lamp = mesh(ball, shine(0xffb3ec), group);
    lamp.position.y = 3.3;
    lamp.scale.setScalar(0.3);
    const lampGlow = glow(0xff7ed8, 3.2);
    lampGlow.position.y = 3.3;
    group.add(lampGlow);
    const ringGeo = track(new THREE.RingGeometry(0.9, 1, 40));
    const rings: ThreeNamespace.Mesh<ThreeNamespace.RingGeometry, ThreeNamespace.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(
        ringGeo,
        track(new THREE.MeshBasicMaterial({ color: 0xff7ed8, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.1;
      group.add(ring);
      rings.push(ring);
    }
    const bottle = new THREE.Group();
    mesh(cylinder, track(new THREE.MeshBasicMaterial({ color: 0x5dffc9, transparent: true, opacity: 0.35, depthWrite: false })), bottle).scale.set(0.35, 1.2, 0.35);
    const neck = mesh(cylinder, track(new THREE.MeshBasicMaterial({ color: 0x5dffc9, transparent: true, opacity: 0.35, depthWrite: false })), bottle);
    neck.scale.set(0.14, 0.5, 0.14);
    neck.position.y = 0.85;
    const note = glow(0xfff2c4, 1.2);
    bottle.add(note);
    bottle.rotation.z = Math.PI / 2.3;
    bottle.position.set(-2, 0.4, 1.2);
    group.add(bottle);
    updaters.push((time) => {
      rings.forEach((ring, i) => {
        const t = (time * 0.35 + i / rings.length) % 1;
        ring.scale.setScalar(0.5 + t * 6);
        ring.material.opacity = (1 - t) * 0.7;
      });
      lampGlow.material.opacity = 0.65 + Math.sin(time * 2.4) * 0.3;
      note.material.opacity = 0.6 + Math.sin(time * 1.5) * 0.3;
    });
    stations.push({ id: "contacto", group, x: small ? 1.2 : 4.2, z: -16, stand: 12.5, onFloor: true });
  }

  for (const station of stations) {
    station.group.position.set(station.x, 0, station.z);
    scene.add(station.group);
  }
  return stations;
}
