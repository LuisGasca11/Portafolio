import { SectionIntro } from "@/components/cv/section-intro";
import { about } from "@/lib/cv";

export function About() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32 print:px-0 print:py-6">
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="01" id="sobre-mi-titulo" title="Sobre mí" />
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
