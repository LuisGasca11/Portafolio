"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSyncExternalStore } from "react";

gsap.registerPlugin(ScrollTrigger);

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
  };
}

/** `true` cuando la persona pidió menos movimiento. En el servidor devuelve `false`. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Efectos comunes a todos los mundos, para llamar dentro de un `gsap.context`:
 * - `[data-reveal]`: aparece desde abajo al entrar en pantalla.
 * - `[data-parallax="n"]`: se desplaza `n * 60px` en vertical mientras cruza la pantalla.
 */
export function setupCommonMotion(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((element) => {
    gsap.from(element, {
      y: 44,
      opacity: 0,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 90%", once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((element) => {
    const amount = Number(element.dataset.parallax ?? "0") * 60;
    const trigger = element.closest("section") ?? element;
    gsap.fromTo(
      element,
      { y: amount },
      {
        y: -amount,
        ease: "none",
        scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.6 },
      },
    );
  });
}

export { gsap, ScrollTrigger };
