import { SectionIntro } from "@/components/cv/section-intro";
import { getCv } from "@/lib/cv";
import { createT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function Skills({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const { technicalSkills, softSkills, languages } = getCv(locale);
  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-tecnicas"
      className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32 print:px-0 print:py-6"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="04" id="habilidades-tecnicas" title={t("cv.sections.technical")} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {technicalSkills.map((group, index) => (
            <li
              key={group.label}
              data-reveal
              className={`sheet-card rounded-3xl border border-line bg-white/[0.03] p-6 transition-colors hover:border-accent/60 ${
                index < 2 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <h3 className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{group.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-2.5 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-16" data-reveal>
          <h2 id="habilidades-blandas" className="font-display text-4xl tracking-tight text-balance sm:text-6xl">
            {t("cv.sections.soft")}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {softSkills.map((skill) => (
              <li
                key={skill}
                className="sheet-card rounded-3xl border border-line bg-white/[0.03] px-5 py-6 font-display text-2xl tracking-tight transition-colors hover:border-accent/60"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16" data-reveal>
          <h2 id="idiomas" className="font-display text-4xl tracking-tight text-balance sm:text-6xl">
            {t("cv.sections.languages")}
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {languages.map((language) => (
              <li
                key={language}
                className="sheet-card rounded-3xl border border-line bg-white/[0.03] px-5 py-4 font-display text-2xl tracking-tight"
              >
                {language}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
