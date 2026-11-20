"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal de tagline (regla B11 del skill de diseño): cada palabra pasa de un
 * tono apagado al color completo al cruzar la línea de activación, en orden
 * de lectura, con la curva base. Con prefers-reduced-motion se muestra el
 * texto final de inmediato, sin animación palabra por palabra.
 */
export function TaglineReveal({ text, className }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("is-done");
      return;
    }
    const spans = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-on");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 },
    );
    spans.forEach((span) => observer.observe(span));
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={rootRef} className={`tagline-reveal ${className ?? ""}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-word className="tagline-reveal__word">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
