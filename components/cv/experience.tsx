import { ExternalLink } from "@/components/shared/external-link";
import { SectionIntro } from "@/components/cv/section-intro";
import { getCv } from "@/lib/cv";
import { createT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function Experience({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const { experience } = getCv(locale);
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32 print:px-0 print:py-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="02" id="experiencia-titulo" title={t("cv.sections.experience")} />
        <ol className="accent-line relative mt-12 border-l border-accent/50 pl-6">
          {experience.map((job) => (
            <li
              key={`${job.role}-${job.organization}`}
              data-reveal
              className="sheet-card relative mb-4 rounded-3xl border border-line bg-white/[0.03] p-6 last:mb-0 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="accent-dot absolute top-8 -left-[1.95rem] size-3 rounded-full border-2 border-canvas bg-accent"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-2xl tracking-tight sm:text-3xl">{job.role}</h3>
                {job.period ? <p className="text-sm text-accent">{job.period}</p> : null}
              </div>
              <p className="mt-3 font-medium">{job.organization}</p>
              {job.website ? (
                <p className="mt-2">
                  <ExternalLink
                    href={job.website.href}
                    className="text-accent underline decoration-white/25 underline-offset-4 hover:decoration-accent"
                  >
                    {job.website.label}
                  </ExternalLink>
                </p>
              ) : null}
              {job.description ? (
                <p className="mt-4 max-w-3xl leading-relaxed text-white/75">{job.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
