"use client";

import { useReducedMotion } from "@/components/abismo/motion";

type AmbientVideoProps = {
  /** Nombre base en `public/worlds/` (sin extensión). */
  name: "abismo";
  className?: string;
};

/**
 * Bucle de video ambiental. Mientras carga, y siempre que se pida menos
 * movimiento, se ve el póster en su lugar.
 */
export function AmbientVideo({ name, className = "" }: AmbientVideoProps) {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(/worlds/${name}-poster.jpg)` }}
    >
      {reduced ? null : (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`/worlds/${name}-poster.jpg`}
          tabIndex={-1}
        >
          <source src={`/worlds/${name}.webm`} type="video/webm" />
          <source src={`/worlds/${name}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
