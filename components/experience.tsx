import { roles } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";
import { Section } from "@/components/section";

export function Experience() {
  return (
    <Section id="experiencia" title="Experiencia">
      <ol className="grid gap-4">
        {roles.map((role) => (
          <li key={role.organization} className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold">{role.role}</h3>
              {role.period !== undefined ? <p className="text-sm text-accent">{role.period}</p> : null}
            </div>
            {role.href !== undefined ? (
              <p className="mt-2">
                <ExternalLink
                  href={role.href}
                  className="font-medium underline decoration-line underline-offset-4 hover:decoration-accent"
                >
                  {role.organization}
                </ExternalLink>
              </p>
            ) : (
              <p className="mt-2 font-medium">{role.organization}</p>
            )}
            {role.summary !== undefined ? (
              <p className="mt-3 leading-relaxed text-muted">{role.summary}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
