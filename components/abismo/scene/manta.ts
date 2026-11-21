import { DEPTH } from "./context";
import type { SceneContext } from "./context";
import { finGeometry, mergeParts, orient } from "./shapes";

/**
 * Mantarrayas: una sola superficie con forma de diamante, aleta cefálica al
 * frente y cola larga. El aleteo es una onda que viaja hacia las puntas.
 */
export function addMantas(ctx: SceneContext) {
  const { THREE, scene, small, track, updaters, creature, pathAt } = ctx;
  const spanSegs = 32;
  const chordSegs = 10;
  const wing = new THREE.PlaneGeometry(1, 1, spanSegs, chordSegs);
  {
    const pos = wing.getAttribute("position");
    for (let i = 0; i < pos.count; i += 1) {
      const u = pos.getX(i) * 2; // -1..1 a lo ancho
      const v = pos.getY(i) + 0.5; // 0 adelante, 1 atrás
      const a = Math.abs(u);
      const lead = 1.35 - 1.5 * Math.pow(a, 1.25); // borde de ataque, barrido hacia atrás
      const chord = 2.6 * Math.pow(1 - a, 0.9) + 0.12;
      const z = lead - v * chord;
      const hump = 0.34 * Math.pow(Math.max(0, 1 - a * 1.8), 2) * Math.sin(Math.PI * Math.min(1, v * 1.1));
      const curl = -0.18 * Math.pow(a, 3);
      pos.setXYZ(i, u * 3.1, hump + curl, z);
    }
    wing.computeVertexNormals();
  }
  // Panza: la misma superficie, un poco más abajo y volteada.
  const underside = wing.clone();
  underside.scale(0.98, -0.35, 0.98);
  // Aletas cefálicas: dos paletas al frente, enrolladas hacia abajo.
  const horn = finGeometry(THREE, [
    [-0.1, 0],
    [-0.13, 0.55],
    [-0.02, 0.78],
    [0.1, 0.6],
    [0.1, 0],
  ], 0.05);
  const tailGeo = new THREE.ConeGeometry(0.06, 3.4, 6);
  const geometry = track(
    mergeParts(THREE, [
      { geometry: wing },
      { geometry: underside, position: [0, -0.04, 0] },
      { geometry: horn, position: [0.4, 0.04, 1.2], rotation: orient(THREE, [1, 0, 0], [0.15, -0.45, 1]) },
      { geometry: horn, position: [-0.4, 0.04, 1.2], rotation: orient(THREE, [1, 0, 0], [-0.15, -0.45, 1]) },
      { geometry: tailGeo, position: [0, 0.02, -2.6], rotation: [-Math.PI / 2, 0, 0] },
    ]),
  );
  for (const part of [wing, underside, horn, tailGeo]) part.dispose();

  const mantas = small ? 2 : 3;
  for (let i = 0; i < mantas; i += 1) {
    const mat = creature({
      color: 0x18324d,
      belly: 0xe6f2f7,
      roughness: 0.5,
      side: THREE.DoubleSide,
      flap: { amp: 0.26, speed: 1.5, phase: i * 1.7 },
    });
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geometry, mat));
    g.scale.setScalar(1.5 + i * 0.25);
    scene.add(g);
    const cy = -(0.22 + i * 0.25) * DEPTH;
    const speed = (i % 2 === 0 ? 1 : -1) * (0.1 + i * 0.015);
    const tgt = new THREE.Vector3();
    const p = new THREE.Vector3();
    updaters.push((time) => {
      const ang = time * speed + i * 2;
      pathAt(i * 3 - 3, -22 - i * 2, 15, ang, p);
      // Sube con cada aletazo y planea al bajar.
      p.y = cy + Math.sin(time * 0.4 + i) * 1.2 + Math.sin(time * 1.5 + i * 1.7) * 0.15;
      g.position.copy(p);
      const dir = speed > 0 ? 1 : -1;
      tgt.set(p.x - Math.sin(ang) * dir * 5, p.y, p.z + Math.cos(ang) * 3 * dir);
      g.lookAt(tgt);
      g.rotateZ(-dir * 0.18);
    });
  }
}
