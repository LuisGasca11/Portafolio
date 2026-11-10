import { cvUrl, site } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";

const primaryLinkClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90";

const secondaryLinkClass =
  "inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold text-ink hover:border-accent";

export function Hero() {
  return (
    <section id="inicio" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">Portafolio</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-snug text-balance sm:text-2xl">{site.title}</p>
        <p className="mt-4 text-muted">
          {site.focus}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {site.location}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#desarrollos" className={primaryLinkClass}>
            Ver desarrollos
          </a>
          <a href="#contacto" className={secondaryLinkClass}>
            Contacto
          </a>
        </div>
        <ul className="mt-8 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {site.email}
            </a>
          </li>
          <li>
            <ExternalLink
              href={site.githubUrl}
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {site.githubLabel}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={cvUrl}
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              Currículum
            </ExternalLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
