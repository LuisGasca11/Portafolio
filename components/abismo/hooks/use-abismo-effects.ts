"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { maxDepth, zoneOf } from "@/components/abismo/data";
import { gsap, ScrollTrigger, setupCommonMotion } from "@/components/abismo/hooks/motion";

/**
 * Efectos de scroll de la portada, todos ligados al avance de la página:
 * medidor y zona de profundidad, encabezado, linterna, texto que se ilumina,
 * contadores, robot submarino y criaturas que cruzan. Con `reduced` solo
 * se mantienen el medidor y el fondo (no son movimiento).
 */
export function useAbismoEffects(root: RefObject<HTMLElement | null>, reduced: boolean, drawn: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const gauge = element.querySelector<HTMLElement>("[data-gauge-dot]");
    const readouts = element.querySelectorAll<HTMLElement>("[data-gauge-text]");
    const zoneText = element.querySelector<HTMLElement>("[data-zone-text]");
    const dark = element.querySelector<HTMLElement>("[data-dark]");
    const header = element.querySelector<HTMLElement>("[data-header]");

    const onPointer = (event: PointerEvent) => {
      element.style.setProperty("--fx", `${event.clientX}px`);
      element.style.setProperty("--fy", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const context = gsap.context(() => {
      gsap.to(dark, {
        opacity: 1,
        ease: "power1.in",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const meters = Math.round((self.progress * maxDepth) / 10) * 10;
            if (gauge) gauge.style.top = `${self.progress * 100}%`;
            readouts.forEach((node) => {
              node.textContent = `${meters.toLocaleString("es-MX")} m`;
            });
            if (zoneText) zoneText.textContent = zoneOf(meters);
            element.style.setProperty("--p", self.progress.toFixed(3));
            if (header) header.dataset.solid = String(window.scrollY > 60);
          },
        },
      });

      if (reduced) {
        return;
      }
      setupCommonMotion(element);

      gsap.from("[data-hero-word]", { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.1 });
      gsap.from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.7 });

      gsap.utils.toArray<HTMLElement>("[data-school]", element).forEach((fish) => {
        const speed = Number(fish.dataset.school ?? "1");
        gsap.fromTo(
          fish,
          { x: "-30vw" },
          { x: `${130 * speed}vw`, ease: "none", scrollTrigger: { trigger: "#sobre-mi", start: "top 85%", end: "bottom top", scrub: 0.8 } },
        );
      });

      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-word]", element),
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: "[data-about]", start: "top 80%", end: "bottom 45%", scrub: true } },
      );

      gsap.utils.toArray<HTMLElement>("[data-count]", element).forEach((node) => {
        const target = Number(node.dataset.count ?? "0");
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { value: 1 },
          onUpdate: () => {
            node.textContent = String(counter.value);
          },
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });

      // Las criaturas dibujadas solo existen sin WebGL: se animan si están.
      const present = (selector: string) => element.querySelector(selector) !== null;
      if (present("[data-whale]")) gsap.fromTo(
        "[data-whale]",
        { x: "-60vw" },
        { x: "120vw", ease: "none", scrollTrigger: { trigger: "#experiencia", start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-rov]",
        { y: 0 },
        {
          y: () => Math.max(0, (document.querySelector("[data-rov-track]")?.getBoundingClientRect().height ?? 0) - 120),
          ease: "none",
          scrollTrigger: { trigger: "[data-rov-track]", start: "top 65%", end: "bottom 65%", scrub: 0.6, invalidateOnRefresh: true },
        },
      );
      if (present("[data-angler]")) gsap.fromTo(
        "[data-angler]",
        { x: "40vw", opacity: 0 },
        { x: "0vw", opacity: 1, ease: "power2.out", scrollTrigger: { trigger: "#habilidades", start: "top 60%", end: "center center", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-sub]",
        { x: "-60vw" },
        { x: "0vw", ease: "power2.out", scrollTrigger: { trigger: "#contacto", start: "top 70%", end: "top 15%", scrub: 1 } },
      );
    }, element);

    // Recalcula los disparadores cuando cambia la altura de la página
    // (carga de fuentes, imágenes o el formulario enviado).
    let refresh = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    let lastHeight = document.body.scrollHeight;
    const heightObserver = new ResizeObserver(() => {
      const height = document.body.scrollHeight;
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      cancelAnimationFrame(refresh);
      refresh = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
    heightObserver.observe(document.body);
    return () => {
      cancelAnimationFrame(refresh);
      heightObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      context.revert();
    };
  }, [root, reduced, drawn]);
}
