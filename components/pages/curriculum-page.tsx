import { About } from "@/components/cv/about";
import { Contact } from "@/components/cv/contact";
import { Education } from "@/components/cv/education";
import { Experience } from "@/components/cv/experience";
import { Hero } from "@/components/cv/hero";
import { JsonLd } from "@/components/cv/json-ld";
import { Marquee } from "@/components/cv/marquee";
import { Projects } from "@/components/cv/projects";
import { Skills } from "@/components/cv/skills";
import type { Locale } from "@/lib/i18n";

export function CurriculumPage({ locale }: { locale: Locale }) {
  return (
    <div className="curriculum bg-canvas text-ink">
      <JsonLd locale={locale} />
      <Hero locale={locale} />
      <Marquee locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
      <Projects />
      <Skills locale={locale} />
      <Education locale={locale} />
      <Contact locale={locale} />
    </div>
  );
}
