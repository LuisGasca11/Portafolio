"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAbismoEffects } from "@/components/abismo/hooks/use-abismo-effects";
import { useReducedMotion } from "@/components/abismo/hooks/motion";
import { AbismoScene } from "@/components/abismo/scene/abismo-scene";
import type { SceneStatus } from "@/components/abismo/scene/abismo-scene";
import { About } from "@/components/abismo/sections/about";
import { Contact } from "@/components/abismo/sections/contact";
import { Education } from "@/components/abismo/sections/education";
import { Experience } from "@/components/abismo/sections/experience";
import { Hero } from "@/components/abismo/sections/hero";
import { Projects } from "@/components/abismo/sections/projects";
import { Skills } from "@/components/abismo/sections/skills";
import { Header } from "@/components/abismo/ui/header";
import { Route } from "@/components/abismo/ui/route";
import { TechBubbles } from "@/components/abismo/ui/tech-bubbles";
import { site } from "@/lib/content";
import "./abismo.css";

/** Color del fondo del documento mientras la portada está montada (evita destellos negros). */
const seaColor = "#042a45";

/**
 * Portada: un descenso al océano. Orden de la página, de arriba abajo:
 * Hero → Sobre mí → Desarrollos → Experiencia → Habilidades → Educación → Contacto.
 */
export function Abismo() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [gl, setGl] = useState<SceneStatus | "pending">("pending");
  const onStatus = useCallback((status: SceneStatus) => {
    setGl(status);
  }, []);
  const glOn = gl === "on";

  useAbismoEffects(root, reduced);

  useEffect(() => {
    const html = document.documentElement;
    const previousHtml = html.style.backgroundColor;
    const previousBody = document.body.style.backgroundColor;
    html.style.backgroundColor = seaColor;
    document.body.style.backgroundColor = seaColor;
    return () => {
      html.style.backgroundColor = previousHtml;
      document.body.style.backgroundColor = previousBody;
    };
  }, []);

  return (
    <div ref={root} className={`ab-root overflow-x-clip ${glOn ? "ab-gl" : ""}`}>
      <div className="ab-bg" aria-hidden="true" />
      <div className="ab-dark" data-dark aria-hidden="true" />
      {reduced ? null : <AbismoScene onStatus={onStatus} />}
      {reduced ? null : <TechBubbles />}
      <div className="ab-vignette" aria-hidden="true" />
      <div className="ab-scrim" aria-hidden="true" />
      <div className="ab-flash" aria-hidden="true" />

      <Route />
      <Header />

      <Hero glOn={glOn} />
      <About glOn={glOn} />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Contact glOn={glOn} />

      <p className="relative pb-24 text-center text-xs text-cyan-100/60">© 2026 {site.name}</p>
    </div>
  );
}
