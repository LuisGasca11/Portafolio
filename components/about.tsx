import { site } from "@/lib/content";

export function About() {
  return (
    <section id="sobre-mi" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl" data-reveal>
        <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">01</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Sobre mí</h2>
        <p className="mt-8 max-w-4xl font-display text-2xl leading-snug tracking-tight text-balance sm:text-4xl">
          {site.about}
        </p>
      </div>
    </section>
  );
}
