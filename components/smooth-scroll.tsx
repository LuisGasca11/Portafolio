"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProps = {
  children: ReactNode;
};

let current: Lenis | null = null;

/** Instancia activa de Lenis (si la página usa scroll suave). */
export function getLenis(): Lenis | null {
  return current;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      syncTouch: false,
      anchors: { offset: -84 },
    });

    current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh).catch(() => undefined);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      if (current === lenis) {
        current = null;
      }
    };
  }, []);

  return children;
}
