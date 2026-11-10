import { cvUrl, site } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24">
      <div className="cta-band px-5 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl" data-reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">06</p>
          <h2 className="mt-4 max-w-4xl font-display text-6xl tracking-[-0.04em] sm:text-8xl">Contacto</h2>
          <p className="mt-6 max-w-xl text-lg text-white/75">{site.focus}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-black"
          >
            {site.email}
          </a>
          <ul className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
            <li>
              <ExternalLink
                href={site.githubUrl}
                className="underline decoration-white/25 underline-offset-4 hover:decoration-accent"
              >
                {site.githubLabel}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={cvUrl} className="underline decoration-white/25 underline-offset-4 hover:decoration-accent">
                Currículum
              </ExternalLink>
            </li>
          </ul>
          <p className="mt-8 text-sm text-muted">{site.location}</p>
        </div>
      </div>
    </section>
  );
}
