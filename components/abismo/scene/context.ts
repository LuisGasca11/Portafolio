import type * as ThreeNamespace from "three";
import type { CreatureOptions } from "./materials";

export type Three = typeof ThreeNamespace;

/** Se llama en cada cuadro: tiempo (s), delta (s) y profundidad suavizada (0–1). */
export type Updater = (time: number, dt: number, smooth: number) => void;

/** Alto total de la columna de agua, en unidades de la escena. */
export const DEPTH = 150;

/** Lo que cada capa de la escena recibe para construirse y animarse. */
export type SceneContext = {
  THREE: Three;
  scene: ThreeNamespace.Scene;
  small: boolean;
  /** Registra un recurso para liberarlo al desmontar. */
  track: <T extends { dispose: () => void }>(item: T) => T;
  /** Tiempo compartido por los shaders. */
  time: { value: number };
  /** Relación de píxeles del renderizador, compartida por los puntos. */
  pixel: { value: number };
  /** Niebla manual de los shaders propios. */
  fog: { uFog: { value: ThreeNamespace.Color }; uFogDensity: { value: number } };
  updaters: Updater[];
  /** Material de criaturas y objetos (cáusticas, contorno y vientre claro). */
  creature: (options: CreatureOptions) => ThreeNamespace.MeshStandardMaterial;
  /** Intensidad compartida de las cáusticas. */
  caustic: { value: number };
  /** Altura del fondo marino en un punto (x, z). */
  floorY: (wx: number, wz: number) => number;
  /** Posición sobre una trayectoria elíptica alrededor de (cx, cz). */
  pathAt: (cx: number, cz: number, radius: number, ang: number, out: ThreeNamespace.Vector3) => ThreeNamespace.Vector3;
};
