import { SectionIntro } from "@/components/cv/section-intro";
import { getCv } from "@/lib/cv";
import { createT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function Education({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const { education } = getCv(locale);
  return (
    <section
      id="educacion"
      aria-labelledby="educacion-titulo"
      className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32 print:px-0 print:py-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="05" id="educacion-titulo" title={t("cv.sections.education")} />
        <ol className="mt-12 border-t border-line">
          {education.map((item) => (
            <li
              key={item.institution}
              data-reveal
              className="grid gap-2 border-b border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <p className="text-sm text-accent">{item.period}</p>
              <div>
                <h3 className="font-display text-2xl tracking-tight">{item.program ?? item.institution}</h3>
                {item.program ? <p className="mt-1 text-muted">{item.institution}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
