import type * as ThreeNamespace from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Three } from "./context";

/** Pieza de un modelo: geometría y su ubicación dentro del modelo. */
export type Part = {
  geometry: ThreeNamespace.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

/**
 * Une varias piezas en una sola geometría (una llamada de dibujo y una sola
 * deformación al nadar). Conserva solo posiciones y normales.
 */
export function mergeParts(THREE: Three, parts: Part[]): ThreeNamespace.BufferGeometry {
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const prepared = parts.map((part) => {
    const geometry = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
    for (const name of Object.keys(geometry.attributes)) {
      if (name !== "position" && name !== "normal") geometry.deleteAttribute(name);
    }
    if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
    quaternion.setFromEuler(new THREE.Euler(...(part.rotation ?? [0, 0, 0])));
    matrix.compose(
      new THREE.Vector3(...(part.position ?? [0, 0, 0])),
      quaternion,
      new THREE.Vector3(...(part.scale ?? [1, 1, 1])),
    );
    geometry.applyMatrix4(matrix);
    return geometry;
  });
  const merged = mergeGeometries(prepared, false);
  for (const geometry of prepared) geometry.dispose();
  if (!merged) throw new Error("No se pudieron unir las piezas del modelo");
  return merged;
}

/**
 * Aleta: contorno en el plano XY extruido con un grosor fino y bordes
 * redondeados. El borde de unión queda en y = 0.
 */
export function finGeometry(THREE: Three, outline: [number, number][], thickness = 0.06) {
  const shape = new THREE.Shape();
  outline.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.5,
    bevelSize: thickness * 0.5,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geometry.translate(0, 0, -thickness / 2);
  return geometry;
}

/**
 * Rotación (Euler) que lleva el eje X local a `xAxis` y el Y local a `yAxis`
 * (se ortogonalizan). Sirve para orientar aletas con precisión.
 */
export function orient(THREE: Three, xAxis: [number, number, number], yAxis: [number, number, number]): [number, number, number] {
  const x = new THREE.Vector3(...xAxis).normalize();
  const y = new THREE.Vector3(...yAxis);
  y.sub(x.clone().multiplyScalar(y.dot(x))).normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  const euler = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  return [euler.x, euler.y, euler.z];
}

/** Perfil suave para tornear (LatheGeometry) a partir de pocos puntos de control. */
export function smoothProfile(THREE: Three, points: [number, number][], samples = 28) {
  const curve = new THREE.SplineCurve(points.map(([r, y]) => new THREE.Vector2(r, y)));
  return curve.getPoints(samples).map((point) => new THREE.Vector2(Math.max(0.001, point.x), point.y));
}
