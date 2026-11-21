import type { PointerEvent } from "react";
import { ExternalLink } from "@/components/shared/external-link";
import { TechIcon } from "@/components/shared/tech-icon";
import { Jellyfish } from "@/components/abismo/art/creatures";
import { Chapter } from "@/components/abismo/ui/chapter";
import { playStoreUrl, projects, stats } from "@/lib/content";

function onCardMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
  event.currentTarget.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
}

function onCardLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--ry", "0deg");
  event.currentTarget.style.setProperty("--rx", "0deg");
}

const appCount = stats.find((stat) => stat.label === "Apps en Google Play")?.value ?? 0;

export function Projects() {
  return (
    <section id="desarrollos" aria-labelledby="desarrollos-titulo" className="relative px-5 pb-24">
      <Chapter
        id="desarrollos"
        headingId="desarrollos-titulo"
        title="Desarrollos"
        body="Lo que he construido, cada pieza detrás de su propia escotilla."
        tags={[`${projects.length} desarrollos`, `${appCount} apps en Google Play`, "Sistemas en producción"]}
      />
      <div data-parallax="2" aria-hidden="true" className="pointer-events-none absolute top-[calc(var(--ab-chapter-h)+6rem)] -left-4 hidden w-24 opacity-80 sm:block">
        <Jellyfish color="#ff7ee0" />
      </div>
      <div data-parallax="-1.5" aria-hidden="true" className="pointer-events-none absolute top-[70%] -right-3 hidden w-32 opacity-70 sm:block">
        <Jellyfish color="#7ee8ff" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.name} data-reveal className={project.featured === true ? "md:col-span-2" : undefined}>
              <article
                className={`ab-glass ab-card h-full rounded-3xl p-6 sm:p-8 ${project.featured === true ? "ab-card-featured" : ""}`}
                onPointerMove={onCardMove}
                onPointerLeave={onCardLeave}
              >
                <div className="flex items-start gap-4">
                  <span className="ab-porthole" aria-hidden="true">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">{project.context}</p>
                    <h3 className="ab-display mt-1 text-2xl leading-tight font-semibold sm:text-3xl">{project.name}</h3>
                  </div>
                </div>
                <p className={`mt-5 leading-relaxed text-cyan-50/80 ${project.featured === true ? "max-w-3xl text-base" : "text-sm"}`}>
                  {project.description}
                </p>
                {project.team !== undefined ? (
                  <p className="ab-team mt-4">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="9" cy="8" r="3.2" />
                      <circle cx="17" cy="9.5" r="2.5" />
                      <path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5M15 14.6c2.6-.4 4.9.9 5.6 4.4" />
                    </svg>
                    {project.team}
                  </p>
                ) : null}
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
                {project.apps !== undefined ? (
                  <div className="mt-6">
                    <ul className="flex flex-wrap gap-2.5" aria-label={`Apps de ${project.name} en Google Play`}>
                      {project.apps.map((app) => (
                        <li key={app.label}>
                          <ExternalLink href={app.href} className="ab-store">
                            <TechIcon name="Google Play" size={1.3} />
                            <span>
                              <small>Google Play</small>
                              {app.label}
                            </span>
                          </ExternalLink>
                        </li>
                      ))}
                    </ul>
                    <ExternalLink href={playStoreUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 underline underline-offset-4">
                      Ver todas las apps de la empresa
                      <span aria-hidden="true">↗</span>
                    </ExternalLink>
                  </div>
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
