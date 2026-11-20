"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

function usePhotoParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const tween = gsap.fromTo(
      element,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref]);
}

type PhotoBandProps = {
  src: string;
  alt: string;
  label: string;
};

/**
 * Banda de paisaje entre secciones: foto real a todo lo ancho con parallax
 * suave al hacer scroll. Marca una etapa del recorrido.
 */
export function PhotoBand({ src, alt, label }: PhotoBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePhotoParallax(ref);

  return (
    <div aria-hidden="true" className="no-print relative h-64 overflow-hidden border-b border-line sm:h-80">
      <div ref={ref} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-transparent to-canvas/70" />
      <p className="absolute inset-x-0 bottom-5 text-center text-[0.65rem] font-medium tracking-[0.28em] text-white/75 uppercase">
        {label}
      </p>
    </div>
  );
}

type PhotoBackdropProps = {
  src: string;
  alt: string;
  overlay?: string;
};

/**
 * Foto de fondo con parallax para una sección completa (p. ej. Habilidades).
 * La sección que lo usa debe ser `relative` y poner su contenido con `relative`.
 */
export function PhotoBackdrop({ src, alt, overlay = "bg-black/72" }: PhotoBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  usePhotoParallax(ref);

  return (
    <div aria-hidden="true" className="no-print absolute inset-0 overflow-hidden">
      <div ref={ref} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}
