"use client";

import { useEffect, useRef } from "react";

/**
 * Barra fina de progreso del recorrido, fija bajo el borde superior.
 * Indica cuánto del viaje (de la página) se lleva recorrido.
 */
export function JourneyProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const element = ref.current;
      if (!element) {
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      element.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="no-print fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
