import { SectionIntro } from "@/components/cv/section-intro";
import { getCv } from "@/lib/cv";
import { createT } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function About({ locale }: { locale: Locale }) {
  const t = createT(locale);
  const { about } = getCv(locale);
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32 print:px-0 print:py-6">
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="01" id="sobre-mi-titulo" title={t("cv.sections.about")} />
        <p
          data-reveal
          className="mt-8 max-w-4xl font-display text-2xl leading-snug tracking-tight text-balance sm:text-4xl"
        >
          {about}
        </p>
      </div>
    </section>
  );
}
