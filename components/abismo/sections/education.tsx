import { Seahorse } from "@/components/abismo/art/creatures";
import { SectionHeading } from "@/components/abismo/ui/section-heading";
import { useContent, useT } from "@/components/shared/locale-provider";

export function Education({ glOn }: { glOn: boolean }) {
  const t = useT();
  const { studies } = useContent();
  return (
    <section id="educacion" aria-labelledby="educacion-titulo" className="relative px-5 py-24">
      {/* Dibujos planos de animales: solo en el respaldo sin WebGL; con la escena 3D sobran. */}
      {glOn ? null : (
        <div data-parallax="1.6" aria-hidden="true" className="pointer-events-none absolute top-16 right-3 w-16 opacity-90 sm:right-[8%] sm:w-24">
          <Seahorse className="ab-bob" />
        </div>
      )}
      <div className="mx-auto max-w-4xl">
        <SectionHeading id="educacion-titulo" meters={1040} title={t("education.heading")} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {studies.map((study) => (
            <li key={study.id} data-reveal className="ab-glass rounded-3xl p-6">
              <p className="text-sm text-cyan-200">{study.period}</p>
              <h3 className="ab-display mt-1 text-2xl font-semibold">{study.title}</h3>
              {study.institution !== undefined ? <p className="mt-2 text-sm text-cyan-50/75">{study.institution}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
