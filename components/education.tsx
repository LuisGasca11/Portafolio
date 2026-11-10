import { studies } from "@/lib/content";

export function Education() {
  return (
    <section id="educacion" className="scroll-mt-24 border-b border-line px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">05</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Educación</h2>
        </div>
        <ol className="mt-12 border-t border-line">
          {studies.map((study) => (
            <li key={study.period} data-reveal className="grid gap-2 border-b border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <p className="text-sm text-accent">{study.period}</p>
              <div>
                <h3 className="font-display text-2xl tracking-tight">{study.title}</h3>
                {study.institution !== undefined ? <p className="mt-1 text-muted">{study.institution}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
