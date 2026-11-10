import { projects } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";
import { Section } from "@/components/section";

export function Projects() {
  return (
    <Section id="desarrollos" title="Desarrollos">
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.name} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-accent">{project.context}</p>
                <p className="text-xs tabular-nums text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <h3 className="mt-3 font-serif text-2xl tracking-tight">{project.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{project.description}</p>
              {project.stack.length > 0 || project.href !== undefined ? (
                <div className="mt-auto pt-6">
                  {project.stack.length > 0 ? (
                    <ul className="flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
                      {project.stack.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-2.5 py-1 text-xs text-ink"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {project.href !== undefined ? (
                    <p className={project.stack.length > 0 ? "mt-4" : undefined}>
                      <ExternalLink
                        href={project.href}
                        className="text-sm font-semibold text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
                      >
                        {project.linkLabel ?? project.href}
                      </ExternalLink>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
