import { ExternalLink } from "@/components/shared/external-link";
import { Octopus, Rov, Whale } from "@/components/abismo/art/creatures";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { roles } from "@/lib/content";

export function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experiencia-titulo" className="relative px-5 py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 overflow-hidden">
        <div data-whale className="w-[min(70vw,520px)] opacity-80">
          <Whale />
        </div>
      </div>
      <div data-parallax="-1.2" aria-hidden="true" className="pointer-events-none absolute right-2 bottom-16 w-24 opacity-90 sm:right-[6%] sm:w-32">
        <Octopus className="ab-bob" />
      </div>
      <div className="relative mx-auto max-w-4xl">
        <SectionHeading id="experiencia-titulo" meters={520} title="Experiencia" />
        <div data-rov-track className="relative mt-12">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.1rem] border-l border-dashed border-cyan-200/35 sm:left-[1.4rem]" />
          <div aria-hidden="true" data-rov className="absolute top-0 -left-[0.55rem] z-10 w-14 sm:left-0 sm:w-16">
            <Rov />
          </div>
          <ol className="grid gap-6 pl-12 sm:pl-24">
            {roles.map((role) => (
              <li key={role.organization} data-reveal>
                <article className="ab-glass rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="ab-display text-2xl font-semibold sm:text-3xl">{role.role}</h3>
                    {role.period !== undefined ? <p className="text-sm text-cyan-200">{role.period}</p> : null}
                  </div>
                  <p className="mt-2 font-medium">
                    {role.href !== undefined ? (
                      <ExternalLink href={role.href} className="underline decoration-cyan-200/50 underline-offset-4">
                        {role.organization}
                      </ExternalLink>
                    ) : (
                      role.organization
                    )}
                  </p>
                  {role.summary !== undefined ? <p className="mt-4 text-sm leading-relaxed text-cyan-50/80">{role.summary}</p> : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
