import { studies } from "@/lib/content";
import { Section } from "@/components/section";

export function Education() {
  return (
    <Section id="educacion" title="Educación">
      <ol className="divide-y divide-line border-y border-line">
        {studies.map((study) => (
          <li key={study.period} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <p className="text-sm text-accent">{study.period}</p>
            <div>
              <h3 className="text-lg font-semibold">{study.title}</h3>
              {study.institution !== undefined ? (
                <p className="text-muted">{study.institution}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
