"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { projects } from "@/lib/content";
import type { Project } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

gsap.registerPlugin(ScrollTrigger);

function onPointerMove(event: PointerEvent<HTMLElement>) {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
}

function onPointerLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--ry", "0deg");
  event.currentTarget.style.setProperty("--rx", "0deg");
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="tilt-card relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white/[0.035] p-6 lg:h-[30rem] lg:w-[34rem] lg:shrink-0 lg:p-8"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="relative -m-6 mb-6 h-44 overflow-hidden lg:-m-8 lg:mb-8 lg:h-52">
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          style={{ objectPosition: project.imagePosition ?? "center" }}
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-sm text-accent">{project.context}</p>
        <p className="text-xs font-medium tracking-[0.14em] whitespace-nowrap text-white/50 uppercase">
          Parada {String(index + 1).padStart(2, "0")}
        </p>
      </div>
      <h3 className="mt-5 font-display text-3xl tracking-tight lg:text-4xl">{project.name}</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/70 lg:flex-1 lg:overflow-y-auto">{project.description}</p>
      {project.stack.length > 0 || project.href !== undefined ? (
        <div className="mt-6">
          {project.stack.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
              {project.stack.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-xs text-white/85">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {project.href !== undefined ? (
            <p className={project.stack.length > 0 ? "mt-4" : undefined}>
              <ExternalLink
                href={project.href}
                className="text-sm font-semibold text-accent underline decoration-white/20 underline-offset-4 hover:decoration-accent"
              >
                {project.linkLabel ?? project.href}
              </ExternalLink>
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 48),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 0)}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section id="desarrollos" ref={rootRef} className="scroll-mt-24 border-b border-line">
      <div className="flex flex-col justify-center px-5 py-20 lg:h-screen lg:overflow-hidden lg:px-8 lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">02</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Desarrollos</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Cada proyecto es una parada del recorrido: avanza para visitarlas todas.
          </p>
          <div className="mt-6 hidden h-px w-full bg-white/10 lg:block" aria-hidden="true">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
        <div ref={trackRef} className="mt-8 flex flex-col gap-4 lg:mt-8 lg:w-max lg:flex-row lg:pr-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
