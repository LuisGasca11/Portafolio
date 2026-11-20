"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { skillGroups } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

function constellationPoints(count: number): { x: number; y: number }[] {
  if (count <= 1) {
    return [{ x: 160, y: 32 }];
  }
  return Array.from({ length: count }, (_, index) => ({
    x: 16 + (index * 288) / (count - 1),
    y: 14 + ((index * 37) % 36),
  }));
}

/**
 * Constelación de un grupo de habilidades: los nodos se encienden y las
 * líneas se dibujan cuando la tarjeta entra en pantalla.
 */
function Constellation({ items, label }: { items: readonly string[]; label: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPolylineElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const points = constellationPoints(items.length);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  useEffect(() => {
    const svg = svgRef.current;
    const line = lineRef.current;
    if (!svg || !line) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(line, { strokeDashoffset: 0 });
      gsap.set(nodeRefs.current, { opacity: 1, scale: 1 });
      return;
    }
    const context = gsap.context(() => {
      gsap.fromTo(
        line,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: svg, start: "top 88%", once: true },
        },
      );
      gsap.fromTo(
        nodeRefs.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(2)",
          stagger: 0.08,
          scrollTrigger: { trigger: svg, start: "top 88%", once: true },
        },
      );
    }, svg);
    return () => {
      context.revert();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 64"
      preserveAspectRatio="xMidYMid meet"
      className="mt-5 h-16 w-full"
      aria-hidden="true"
    >
      <polyline
        ref={lineRef}
        points={polyline}
        fill="none"
        stroke="#8fd4ff"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
      />
      {points.map((point, index) => (
        <g key={`${label}-${items[index]}`}>
          <circle cx={point.x} cy={point.y} r="8" fill="#8fd4ff" opacity="0.12" />
          <circle
            ref={(element) => {
              nodeRefs.current[index] = element;
            }}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill="#8fd4ff"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        </g>
      ))}
    </svg>
  );
}

export function Skills() {
  return (
    <section id="habilidades" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">04</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Habilidades técnicas</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Cada grupo es una constelación: las estrellas se encienden al recorrerla.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((group, index) => (
            <li
              key={group.title}
              data-reveal
              className={`rounded-3xl border border-line bg-white/[0.03] p-6 transition-colors hover:border-white/25 ${
                index < 2 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <h3 className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{group.title}</h3>
              <Constellation items={group.items} label={group.title} />
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-2.5 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
