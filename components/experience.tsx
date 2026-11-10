import { roles } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

export function Experience() {
  return (
    <section id="experiencia" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">03</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Experiencia</h2>
        </div>
        <ol className="mt-12 grid gap-4">
          {roles.map((role) => (
            <li key={role.organization} data-reveal className="rounded-3xl border border-line bg-white/[0.03] p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-2xl tracking-tight sm:text-3xl">{role.role}</h3>
                {role.period !== undefined ? <p className="text-sm text-accent">{role.period}</p> : null}
              </div>
              {role.href !== undefined ? (
                <p className="mt-3">
                  <ExternalLink
                    href={role.href}
                    className="font-medium underline decoration-white/25 underline-offset-4 hover:decoration-accent"
                  >
                    {role.organization}
                  </ExternalLink>
                </p>
              ) : (
                <p className="mt-3 font-medium">{role.organization}</p>
              )}
              {role.summary !== undefined ? (
                <p className="mt-4 max-w-3xl leading-relaxed text-white/70">{role.summary}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
