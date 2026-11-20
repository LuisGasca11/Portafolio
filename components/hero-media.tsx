"use client";

import { landscapes } from "@/lib/content";
import { usePrefersReducedMotion } from "@/components/use-prefers-reduced-motion";

/**
 * Fondo del hero: video en loop de la carretera de montaña a la hora dorada.
 * Con prefers-reduced-motion se muestra solo la foto fija del mismo paisaje.
 */
export function HeroMedia() {
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return (
      <img
        src={landscapes.heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={landscapes.heroImage}
      aria-hidden="true"
    >
      <source src={landscapes.heroVideo} type="video/mp4" />
    </video>
  );
}
