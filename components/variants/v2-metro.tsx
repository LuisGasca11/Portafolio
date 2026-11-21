"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { ContactForm } from "@/components/variants/contact-form";
import type { ContactFormClasses } from "@/components/variants/contact-form";
import { cvUrl, projects, roles, site, skillGroups, studies } from "@/lib/content";

const normalize = (value: string) => value.replace(/\s*\(.*\)\s*$/, "").trim().toLowerCase();

type Line = { id: string; title: string; color: string; stations: string[] };

const lineColors = ["#0067b2", "#00a651", "#f08a1f", "#d6336c", "#6f2c91", "#6b4423"];

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1",
  label: "text-xs font-bold tracking-wider text-neutral-600 uppercase",
  input:
    "w-full rounded-lg border-2 border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#f08a1f] focus:outline-none",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#f08a1f] px-7 text-sm font-bold text-neutral-950 disabled:opacity-60",
  error: "text-sm font-medium text-red-700",
  sent: "rounded-2xl border-2 border-[#00a651] bg-white p-6",
  sentTitle: "text-xl font-bold",
  sentText: "mt-2 text-sm text-neutral-700",
  again: "mt-4 inline-flex h-10 items-center rounded-full border-2 border-neutral-900 px-4 text-sm font-bold",
};

type Selection = { kind: "tech" | "project"; key: string } | null;

export function V2Metro() {
  const [selection, setSelection] = useState<Selection>(null);

  const lines = useMemo<Line[]>(() => {
    const known = new Set(skillGroups.flatMap((group) => group.items.map(normalize)));
    const extras: string[] = [];
    for (const tag of projects.flatMap((project) => project.stack)) {
      const key = normalize(tag);
      if (!known.has(key)) {
        known.add(key);
        extras.push(tag);
      }
    }
    const base = skillGroups.map((group, index) => ({
      id: `l${index + 1}`,
      title: group.title,
      color: lineColors[index] ?? "#333",
      stations: [...group.items],
    }));
    return extras.length > 0
      ? [...base, { id: `l${base.length + 1}`, title: "En proyectos", color: lineColors[base.length] ?? "#333", stations: extras }]
      : base;
  }, []);

  const activeTechs = useMemo(() => {
    if (selection === null) {
      return new Set<string>();
    }
    if (selection.kind === "tech") {
      return new Set([selection.key]);
    }
    const project = projects.find((item) => item.name === selection.key);
    return new Set((project?.stack ?? []).map(normalize));
  }, [selection]);

  const activeProjects = useMemo(() => {
    if (selection === null) {
      return new Set<string>();
    }
    if (selection.kind === "project") {
      return new Set([selection.key]);
    }
    return new Set(
      projects.filter((project) => project.stack.some((tag) => normalize(tag) === selection.key)).map((project) => project.name),
    );
  }, [selection]);

  function toggle(next: NonNullable<Selection>) {
    setSelection((current) => (current?.kind === next.kind && current.key === next.key ? null : next));
  }

  const hasSelection = selection !== null;

  return (
    <div className="min-h-screen bg-[#f4efe4] text-neutral-900">
      <header className="border-b-8 border-[#f08a1f] bg-white px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">
            <span className="inline-block h-3 w-3 rounded-full bg-[#f08a1f]" aria-hidden="true" />
            Red de desarrollo · {site.location}
          </p>
          <h1 className="mt-4 text-4xl leading-none font-extrabold tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-neutral-600">
            {site.title}. {site.focus}.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <section id="plano" aria-labelledby="plano-titulo">
          <h2 id="plano-titulo" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Plano de la red
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Cada línea es un área técnica y cada estación una tecnología. Toca una estación para ver en qué desarrollos
            hace parada, o toca un desarrollo para ver su recorrido.
          </p>

          <div className="mt-8 grid gap-8 rounded-3xl border-2 border-neutral-900/10 bg-white p-4 sm:p-8">
            {lines.map((line, lineIndex) => (
              <div key={line.id} className="grid gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold text-white"
                    style={{ backgroundColor: line.color }}
                    aria-hidden="true"
                  >
                    {lineIndex + 1}
                  </span>
                  <h3 className="font-bold">Línea {lineIndex + 1} · {line.title}</h3>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="relative" style={{ minWidth: `${Math.max(line.stations.length, 2) * 5.5}rem` }}>
                    <div
                      className="absolute top-[0.85rem] right-6 left-6 h-2.5 rounded-full"
                      style={{ backgroundColor: line.color, opacity: hasSelection ? 0.35 : 1 }}
                      aria-hidden="true"
                    />
                    <ol className="relative flex justify-between">
                      {line.stations.map((station) => {
                        const key = normalize(station);
                        const active = activeTechs.has(key);
                        return (
                          <li key={station} className="flex w-[5.5rem] flex-1 justify-center">
                            <button
                              type="button"
                              aria-pressed={active}
                              onClick={() => {
                                toggle({ kind: "tech", key });
                              }}
                              className="group flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center"
                            >
                              <span
                                className="block h-[2.1rem] w-[2.1rem] rounded-full border-[5px] bg-white transition-transform group-hover:scale-110"
                                style={{
                                  borderColor: line.color,
                                  backgroundColor: active ? line.color : "#fff",
                                  transform: active ? "scale(1.25)" : undefined,
                                }}
                              />
                              <span className={`text-xs leading-tight ${active ? "font-extrabold" : "font-semibold"}`}>
                                {station}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="desarrollos" className="mt-16" aria-labelledby="desarrollos-titulo">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="desarrollos-titulo" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Desarrollos · Estaciones terminales
            </h2>
            {hasSelection ? (
              <button
                type="button"
                onClick={() => {
                  setSelection(null);
                }}
                className="rounded-full border-2 border-neutral-900 px-4 py-1.5 text-sm font-bold"
              >
                Quitar selección
              </button>
            ) : null}
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => {
              const active = activeProjects.has(project.name);
              const selected = selection?.kind === "project" && selection.key === project.name;
              return (
                <li
                  key={project.name}
                  className={`rounded-2xl border-2 bg-white p-5 transition-opacity ${
                    active ? "border-[#f08a1f]" : "border-neutral-900/10"
                  } ${hasSelection && !active ? "opacity-45" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold tracking-wider text-neutral-500 uppercase">{project.context}</p>
                    <span className="grid h-7 min-w-7 place-items-center rounded-full bg-neutral-900 px-1 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight">{project.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{project.description}</p>
                  {project.stack.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Paradas de ${project.name}`}>
                      {project.stack.map((tag) => (
                        <li key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {project.stack.length > 0 ? (
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          toggle({ kind: "project", key: project.name });
                        }}
                        className="rounded-full border-2 border-neutral-900 px-3.5 py-1 text-xs font-bold"
                      >
                        {selected ? "Ocultar recorrido" : "Ver recorrido en el plano"}
                      </button>
                    ) : null}
                    {project.href !== undefined ? (
                      <ExternalLink href={project.href} className="text-xs font-bold underline underline-offset-4">
                        {project.linkLabel ?? project.href}
                      </ExternalLink>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="experiencia" className="mt-16 grid gap-10 md:grid-cols-2" aria-label="Experiencia y educación">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Experiencia</h2>
            <ol className="mt-5 border-l-[6px] border-[#0067b2] pl-6">
              {roles.map((role) => (
                <li key={role.organization} className="relative pb-6 last:pb-0">
                  <span className="absolute top-1 -left-[2.15rem] h-5 w-5 rounded-full border-[5px] border-[#0067b2] bg-white" aria-hidden="true" />
                  <p className="font-bold">{role.role}</p>
                  <p className="text-sm text-neutral-600">
                    {role.href !== undefined ? (
                      <ExternalLink href={role.href} className="underline underline-offset-4">
                        {role.organization}
                      </ExternalLink>
                    ) : (
                      role.organization
                    )}
                    {role.period !== undefined ? ` · ${role.period}` : ""}
                  </p>
                  {role.summary !== undefined ? <p className="mt-2 text-sm leading-relaxed text-neutral-700">{role.summary}</p> : null}
                </li>
              ))}
            </ol>
          </div>
          <div id="educacion">
            <h2 className="text-2xl font-extrabold tracking-tight">Educación</h2>
            <ol className="mt-5 border-l-[6px] border-[#00a651] pl-6">
              {studies.map((study) => (
                <li key={study.title} className="relative pb-6 last:pb-0">
                  <span className="absolute top-1 -left-[2.15rem] h-5 w-5 rounded-full border-[5px] border-[#00a651] bg-white" aria-hidden="true" />
                  <p className="font-bold">{study.title}</p>
                  <p className="text-sm text-neutral-600">
                    {study.institution !== undefined ? `${study.institution} · ` : ""}
                    {study.period}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contacto" className="mt-16 rounded-3xl bg-neutral-900 p-6 text-white sm:p-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[#f08a1f] uppercase">Terminal · Fin de la línea</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Hagamos transbordo</h2>
          <p className="mt-2 max-w-xl text-neutral-300">¿Tienes un proyecto? Escríbeme y vemos cómo llegar.</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <ul className="grid content-start gap-2 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="font-bold underline underline-offset-4">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline underline-offset-4">
                  {site.phone}
                </a>
              </li>
              <li>
                <ExternalLink href={site.githubUrl} className="underline underline-offset-4">
                  {site.githubLabel}
                </ExternalLink>
              </li>
              <li>
                <Link href={cvUrl} className="underline underline-offset-4">
                  Currículum
                </Link>
              </li>
            </ul>
            <div className="rounded-2xl bg-[#f4efe4] p-5 text-neutral-900">
              <ContactForm classes={formClasses} submitLabel="Abordar" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
