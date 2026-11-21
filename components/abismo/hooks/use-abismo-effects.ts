"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { chapters, maxDepth, zoneOf } from "@/components/abismo/data";
import { gsap, richMotion, ScrollTrigger, setupCommonMotion } from "@/components/abismo/hooks/motion";

/**
 * Efectos de scroll de la portada, todos ligados al avance de la página:
 * ruta de capítulos, progreso, profundidad y zona, encabezado, portadas de
 * capítulo, linterna, texto que se ilumina, contadores, robot submarino y
 * criaturas que cruzan. Con `reduced` solo se mantienen la ruta, el progreso
 * y el fondo (no son movimiento).
 */
export function useAbismoEffects(root: RefObject<HTMLElement | null>, reduced: boolean) {
  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const readouts = element.querySelectorAll<HTMLElement>("[data-gauge-text]");
    const zoneText = element.querySelector<HTMLElement>("[data-zone-text]");
    const chapterLabel = element.querySelector<HTMLElement>("[data-chapter-label]");
    const progressBar = element.querySelector<HTMLElement>("[data-progress]");
    const dark = element.querySelector<HTMLElement>("[data-dark]");
    const header = element.querySelector<HTMLElement>("[data-header]");
    const dots = element.querySelectorAll<HTMLAnchorElement>("[data-route]");

    const onPointer = (event: PointerEvent) => {
      element.style.setProperty("--fx", `${event.clientX}px`);
      element.style.setProperty("--fy", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /** Marca el capítulo activo: ruta, acento de la página y etiqueta del encabezado. */
    const setActive = (id: string) => {
      const chapter = chapters.find((item) => item.id === id);
      if (!chapter) return;
      dots.forEach((dot) => {
        const active = dot.dataset.route === id;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });
      element.style.setProperty("--ab-accent", chapter.accent);
      if (chapterLabel) chapterLabel.textContent = chapter.label;
    };
    setActive("inicio");

    // Profundidad mostrada: se interpola entre las paradas de los capítulos,
    // así la lectura coincide con la profundidad que anuncia cada capítulo.
    let depthStops: { y: number; m: number }[] = [{ y: 0, m: 0 }];
    const measureDepth = () => {
      depthStops = [{ y: 0, m: 0 }];
      for (const chapter of chapters.slice(1)) {
        const node = element.querySelector<HTMLElement>(`[data-chapter="${chapter.id}"]`);
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        const pinned = Math.max(0, rect.height - window.innerHeight);
        depthStops.push({ y: rect.top + window.scrollY + pinned * 0.55, m: chapter.meters });
      }
    };
    const depthAt = (y: number) => {
      for (let i = 1; i < depthStops.length; i += 1) {
        const a = depthStops[i - 1]!;
        const b = depthStops[i]!;
        if (y <= b.y) return a.m + ((b.m - a.m) * Math.max(0, y - a.y)) / Math.max(1, b.y - a.y);
      }
      return maxDepth;
    };
    ScrollTrigger.addEventListener("refresh", measureDepth);
    measureDepth();

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
            const meters = Math.round(depthAt(window.scrollY) / 10) * 10;
            readouts.forEach((node) => {
              node.textContent = `${meters.toLocaleString("es-MX")} m`;
            });
            if (zoneText) zoneText.textContent = zoneOf(meters);
            if (progressBar) progressBar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            element.style.setProperty("--p", self.progress.toFixed(3));
            if (header) header.dataset.solid = String(window.scrollY > 60);
          },
        },
      });

      for (const chapter of chapters) {
        ScrollTrigger.create({
          trigger: `#${chapter.id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(chapter.id);
          },
        });
      }

      if (reduced) {
        return;
      }
      setupCommonMotion(element);

      gsap.from("[data-hero-word]", { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.1 });
      gsap.from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.7 });
      gsap.to("[data-hero-content]", {
        y: -120,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom 20%", scrub: 0.5 },
      });

      // Capítulos: el texto entra mientras la cámara se acerca al escenario y
      // se disuelve en el agua al seguir bajando.
      const rich = richMotion();
      gsap.utils.toArray<HTMLElement>("[data-chapter]", element).forEach((chapter) => {
        const copy = chapter.querySelector<HTMLElement>("[data-chapter-copy]");
        const lines = chapter.querySelectorAll<HTMLElement>("[data-chapter-line]");
        gsap.fromTo(
          lines,
          { y: 70, opacity: 0, ...(rich ? { filter: "blur(10px)" } : {}) },
          {
            y: 0,
            opacity: 1,
            ...(rich ? { filter: "blur(0px)" } : {}),
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 90%", end: "top 15%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          copy,
          { y: 0, opacity: 1 },
          {
            y: -90,
            opacity: 0,
            ...(rich ? { filter: "blur(6px)" } : {}),
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: chapter, start: "bottom 98%", end: "bottom 40%", scrub: 0.6 },
          },
        );
      });

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

      gsap.fromTo(
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
      gsap.fromTo(
        "[data-angler]",
        { x: "40vw", opacity: 0 },
        { x: "0vw", opacity: 1, ease: "power2.out", scrollTrigger: { trigger: "#habilidades", start: "top 60%", end: "center center", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-sub]",
        { x: "-60vw" },
        { x: "0vw", ease: "power2.out", scrollTrigger: { trigger: "#contacto [data-chapter]", start: "bottom 90%", end: "bottom 30%", scrub: 1 } },
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
      ScrollTrigger.removeEventListener("refresh", measureDepth);
      window.removeEventListener("pointermove", onPointer);
      context.revert();
    };
  }, [root, reduced]);
}
