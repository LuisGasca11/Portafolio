"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { ExternalLink } from "@/components/shared/external-link";
import { SectionIntro } from "@/components/cv/section-intro";
import { useLocale, useT } from "@/components/shared/locale-provider";
import { getCv } from "@/lib/cv";
import type { Project } from "@/lib/cv";

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
  const t = useT();
  const hasLinks = project.links !== undefined || project.apps !== undefined;
  return (
    <article
      className="tilt-card project-card sheet-card relative flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white/[0.035] p-6 lg:p-8"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.16),transparent_46%)] opacity-80"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-sm text-accent">
          {project.context}
        </p>
        <p className="text-xs tabular-nums text-white/40">{String(index + 1).padStart(2, "0")}</p>
      </div>
      <h3 className="relative mt-5 font-display text-3xl tracking-tight lg:text-4xl">{project.name}</h3>
      <p className="project-copy relative mt-4 text-sm leading-relaxed text-white/75">{project.summary}</p>
      {project.team !== undefined ? <p className="relative mt-3 text-xs text-white/55">{project.team}</p> : null}
      {project.stack.length > 0 || hasLinks ? (
        <div className="relative mt-6">
          {project.stack.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label={t("cv.techOf", { name: project.name })}>
              {project.stack.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-xs text-white/85">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {project.links !== undefined ? (
            <ul className={project.stack.length > 0 ? "mt-4 grid gap-1 text-sm" : "grid gap-1 text-sm"} aria-label={t("cv.sitesOf", { name: project.name })}>
              {project.links.map((link) => (
                <li key={link.href}>
                  <span className="text-white/60">{t("cv.online")} </span>
                  <ExternalLink
                    href={link.href}
                    className="font-semibold text-accent underline decoration-white/20 underline-offset-4 hover:decoration-accent"
                  >
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
          {project.apps !== undefined ? (
            <ul className="mt-4 grid gap-1 text-sm" aria-label={t("projects.appsOf", { name: project.name })}>
              {project.apps.map((app) => (
                <li key={app.label}>
                  <span className="text-white/60">{t("projects.googlePlay")}: </span>
                  <ExternalLink
                    href={app.href}
                    className="font-semibold text-accent underline decoration-white/20 underline-offset-4 hover:decoration-accent"
                  >
                    {app.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function Projects() {
  const t = useT();
  const { projects } = getCv(useLocale());
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    <section id="proyectos" ref={rootRef} aria-labelledby="proyectos-titulo" className="scroll-mt-24 border-b border-line">
      <div className="projects-viewport px-5 py-20 lg:px-8 lg:py-16 print:px-0 print:py-6">
        <SectionIntro index="03" id="proyectos-titulo" title={t("cv.sections.projects")} />
        <div ref={trackRef} className="projects-track mt-8 flex flex-col gap-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
