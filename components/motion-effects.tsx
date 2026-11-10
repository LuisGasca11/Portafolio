"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function MotionEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count ?? "0");
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = String(Math.round(state.value));
          },
        });
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}
