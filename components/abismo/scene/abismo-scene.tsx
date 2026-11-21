"use client";

import { useEffect, useRef } from "react";

export type SceneStatus = "on" | "off";

/**
 * Escena 3D fija detrás de la página: la cámara desciende con el scroll.
 * Three.js y el motor se cargan solo aquí, con `import()`. Si WebGL no está
 * disponible avisa con `off` y la página conserva su fondo CSS.
 */
export function AbismoScene({ onStatus }: { onStatus: (status: SceneStatus) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    let disposed = false;
    let stop: (() => void) | undefined;

    Promise.all([import("three"), import("./engine")])
      .then(([THREE, engine]) => {
        if (disposed) {
          return;
        }
        stop = engine.startScene(THREE, canvas);
        onStatus("on");
      })
      .catch(() => {
        onStatus("off");
      });

    return () => {
      disposed = true;
      stop?.();
    };
  }, [onStatus]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 -z-10 h-[100lvh] w-full" />;
}
