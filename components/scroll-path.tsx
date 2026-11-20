"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "desarrollos", label: "Desarrollos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "habilidades", label: "Habilidades" },
  { id: "educacion", label: "Educación" },
  { id: "contacto", label: "Contacto" },
] as const;

type Dot = {
  x: number;
  y: number;
  frac: number;
  label: string;
};

const DOT_IDLE = { background: "transparent", boxShadow: "none" };
const DOT_ACTIVE = { background: "#8fd4ff", boxShadow: "0 0 12px rgba(143,212,255,0.8)" };

/**
 * Ruta dibujada del recorrido: una línea serpenteante en el margen izquierdo
 * (solo escritorio) que se dibuja con el scroll y marca cada sección del
 * portafolio con un hito. Decorativa: no interfiere con el contenido.
 */
export function ScrollPath() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const wrapRect = wrap.getBoundingClientRect();
      const wrapHeight = wrap.offsetHeight;
      if (wrapHeight <= 0) {
        return;
      }
      const length = path.getTotalLength();
      const next: Dot[] = [];
      MILESTONES.forEach((milestone) => {
        const element = document.getElementById(milestone.id);
        if (!element) {
          return;
        }
        const rect = element.getBoundingClientRect();
        const frac = Math.min(
          1,
          Math.max(0, (rect.top - wrapRect.top + rect.height * 0.25) / wrapHeight),
        );
        const point = path.getPointAtLength(frac * length);
        next.push({
          x: (point.x / 48) * 100,
          y: frac * 100,
          frac,
          label: milestone.label,
        });
      });
      setDots(next);
    };

    measure();
    const onResize = () => {
      measure();
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(measure).catch(() => undefined);
    const onRefresh = () => {
      measure();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const lateMeasure = window.setTimeout(() => {
      ScrollTrigger.refresh();
      measure();
    }, 500);

    const setDotsActive = (progress: number) => {
      dotRefs.current.forEach((dot) => {
        if (!dot) {
          return;
        }
        const frac = Number(dot.dataset.frac ?? "0");
        Object.assign(dot.style, frac <= progress + 0.005 ? DOT_ACTIVE : DOT_IDLE);
      });
    };

    let tween: gsap.core.Tween | null = null;
    if (reduce) {
      gsap.set(path, { strokeDashoffset: 0 });
      setDotsActive(1);
    } else {
      const journey = wrap.parentElement;
      if (journey) {
        tween = gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: journey,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
              onUpdate: (self) => {
                setDotsActive(self.progress);
              },
            },
          },
        );
      }
    }

    return () => {
      window.clearTimeout(lateMeasure);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="no-print absolute inset-y-0 left-2 hidden w-12 xl:block"
    >
      <svg className="h-full w-full" viewBox="0 0 48 1000" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M24,0 C40,120 8,260 24,380 C40,500 8,640 24,760 C40,880 8,940 24,1000"
          fill="none"
          stroke="#8fd4ff"
          strokeOpacity="0.35"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
      {dots.map((dot, index) => (
        <div
          key={dot.label}
          ref={(element) => {
            dotRefs.current[index] = element;
          }}
          data-frac={dot.frac}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/70"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
          <span className="absolute top-1/2 left-full ml-3 hidden -translate-y-1/2 text-[0.65rem] font-medium tracking-[0.18em] whitespace-nowrap text-white/50 uppercase 2xl:block">
            {dot.label}
          </span>
        </div>
      ))}
    </div>
  );
}
