import { cvUrl, site } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";
import { Section } from "@/components/section";

export function Contact() {
  return (
    <Section id="contacto" title="Contacto">
      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">Correo</h3>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-lg break-all underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {site.email}
          </a>
        </li>
        <li className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">GitHub</h3>
          <ExternalLink
            href={site.githubUrl}
            className="mt-3 block text-lg underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {site.githubLabel}
          </ExternalLink>
        </li>
        <li className="rounded-2xl border border-line bg-surface p-6 sm:col-span-2">
          <h3 className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">Currículum</h3>
          <ExternalLink
            href={cvUrl}
            className="mt-3 block text-lg underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            Ver CV en línea
          </ExternalLink>
        </li>
      </ul>
      <p className="mt-6 text-muted">{site.location}</p>
    </Section>
  );
}
