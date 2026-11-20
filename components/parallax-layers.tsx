"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

function useScrubParallax(ref: RefObject<HTMLElement | null>, from: number, to: number) {
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
      { yPercent: from },
      {
        yPercent: to,
        ease: "none",
        scrollTrigger: {
          trigger: element,
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
  }, [ref, from, to]);
}

/** Silueta de montañas al pie del hero: el horizonte del mundo que se recorre. */
export function HeroLandscape() {
  const ref = useRef<HTMLDivElement>(null);
  useScrubParallax(ref, 0, 30);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="no-print pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[26vh] min-h-36 overflow-hidden"
    >
      <svg
        className="absolute bottom-0 h-full w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          d="M0,140 L120,90 L260,150 L420,70 L600,140 L760,60 L940,150 L1120,80 L1280,140 L1440,100 L1440,220 L0,220 Z"
          fill="#0e2233"
          opacity="0.55"
        />
        <path
          d="M0,180 L160,130 L340,185 L520,120 L720,190 L920,130 L1100,185 L1280,140 L1440,175 L1440,220 L0,220 Z"
          fill="#04060a"
        />
      </svg>
    </div>
  );
}

/** Silueta de ciudad antes del contacto: la ciudad destino al final del recorrido. */
export function CityBand() {
  const ref = useRef<HTMLDivElement>(null);
  useScrubParallax(ref, -8, 8);

  return (
    <div aria-hidden="true" className="no-print relative overflow-hidden border-b border-line">
      <div ref={ref} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <svg
          className="absolute bottom-0 h-full w-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="xMidYMax slice"
        >
          <circle cx="1180" cy="26" r="16" fill="#f3f5f8" opacity="0.75" />
          <circle cx="180" cy="22" r="1.5" fill="#f3f5f8" opacity="0.8" />
          <circle cx="420" cy="14" r="1.2" fill="#f3f5f8" opacity="0.6" />
          <circle cx="760" cy="30" r="1.5" fill="#f3f5f8" opacity="0.7" />
          <circle cx="980" cy="18" r="1.2" fill="#f3f5f8" opacity="0.6" />
          <circle cx="1360" cy="34" r="1.5" fill="#f3f5f8" opacity="0.7" />
          <g fill="#0a0f16">
            <rect x="0" y="90" width="90" height="70" />
            <rect x="100" y="50" width="70" height="110" />
            <rect x="180" y="100" width="110" height="60" />
            <rect x="300" y="30" width="80" height="130" />
            <rect x="390" y="80" width="100" height="80" />
            <rect x="500" y="40" width="70" height="120" />
            <rect x="580" y="95" width="120" height="65" />
            <rect x="710" y="20" width="80" height="140" />
            <rect x="800" y="85" width="100" height="75" />
            <rect x="910" y="45" width="70" height="115" />
            <rect x="990" y="100" width="130" height="60" />
            <rect x="1130" y="25" width="80" height="135" />
            <rect x="1220" y="90" width="110" height="70" />
            <rect x="1340" y="60" width="100" height="100" />
          </g>
          <g fill="#8fd4ff" opacity="0.35">
            <rect x="120" y="70" width="6" height="8" />
            <rect x="140" y="90" width="6" height="8" />
            <rect x="320" y="55" width="6" height="8" />
            <rect x="345" y="80" width="6" height="8" />
            <rect x="520" y="65" width="6" height="8" />
            <rect x="730" y="45" width="6" height="8" />
            <rect x="755" y="70" width="6" height="8" />
            <rect x="930" y="70" width="6" height="8" />
            <rect x="1150" y="50" width="6" height="8" />
            <rect x="1175" y="75" width="6" height="8" />
            <rect x="1360" y="85" width="6" height="8" />
            <rect x="1385" y="105" width="6" height="8" />
          </g>
        </svg>
      </div>
      <div className="relative h-32 sm:h-40" />
    </div>
  );
}
