"use client";

import type { PointerEvent } from "react";
import { projects } from "@/lib/content";
import type { Project } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

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
      className="tilt-card relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-white/[0.035] p-6 lg:p-8"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-sm text-accent">{project.context}</p>
        <p className="text-xs font-medium tracking-[0.14em] whitespace-nowrap text-white/50 uppercase">
          Parada {String(index + 1).padStart(2, "0")}
        </p>
      </div>
      <h3 className="mt-5 font-display text-3xl tracking-tight lg:text-4xl">{project.name}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">{project.description}</p>
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
  return (
    <section id="desarrollos" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">02</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Desarrollos</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Cada proyecto es una parada del recorrido: avanza para visitarlas todas.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.name} data-reveal>
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
