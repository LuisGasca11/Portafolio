import type { PointerEvent } from "react";
import { ExternalLink } from "@/components/shared/external-link";
import { TechIcon } from "@/components/shared/tech-icon";
import { Jellyfish } from "@/components/abismo/art/creatures";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { projects } from "@/lib/content";

function onCardMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
}

function onCardLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--ry", "0deg");
  event.currentTarget.style.setProperty("--rx", "0deg");
}

export function Projects() {
  return (
    <section id="desarrollos" aria-labelledby="desarrollos-titulo" className="relative px-5 py-24">
      <div data-parallax="2" aria-hidden="true" className="pointer-events-none absolute top-24 -left-4 hidden w-24 opacity-80 sm:block">
        <Jellyfish color="#ff7ee0" />
      </div>
      <div data-parallax="-1.5" aria-hidden="true" className="pointer-events-none absolute top-[40%] -right-3 hidden w-32 opacity-70 sm:block">
        <Jellyfish color="#7ee8ff" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading id="desarrollos-titulo" meters={180} title="Desarrollos" />
        <p className="mt-4 max-w-xl text-cyan-50/80">Lo que he construido, cada pieza detrás de su propia escotilla.</p>
        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.name} data-reveal>
              <article className="ab-glass ab-card h-full rounded-3xl p-6 sm:p-8" onPointerMove={onCardMove} onPointerLeave={onCardLeave}>
                <div className="flex items-start gap-4">
                  <span className="ab-porthole" aria-hidden="true">{index + 1}</span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">{project.context}</p>
                    <h3 className="ab-display mt-1 text-2xl leading-tight font-semibold sm:text-3xl">{project.name}</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-cyan-50/80">{project.description}</p>
                {project.stack.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
                    {project.stack.map((tag) => (
                      <li key={tag} className="ab-chip">
                        <TechIcon name={tag} size={1.35} />
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {project.links !== undefined ? (
                  <ul className="mt-5 grid gap-2 text-sm" aria-label={`Sitios en línea de ${project.name}`}>
                    {project.links.map((link) => (
                      <li key={link.href} className="flex items-center gap-2.5">
                        <span className="ab-ping" aria-hidden="true" />
                        <ExternalLink href={link.href} className="font-semibold break-all text-emerald-200 underline underline-offset-4">
                          {link.label}
                        </ExternalLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
