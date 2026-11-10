import { cvUrl, site } from "@/lib/content";
import { ExternalLink } from "@/components/external-link";
import { HeroCanvas } from "@/components/hero-canvas";

const words = site.name.split(" ");
const firstLine = words.slice(0, 2).join(" ");
const secondLead = words.slice(2, -1).join(" ");
const lastWord = words.at(-1) ?? "";

export function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-16">
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-canvas" />
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <p className="inline-flex rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[0.7rem] font-medium tracking-[0.22em] text-white/85 uppercase backdrop-blur-sm">
          {site.shortTitle}
        </p>
        <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3.1rem,8.4vw,6.6rem)] leading-[0.92] tracking-[-0.045em] text-balance">
          <span className="block">{firstLine}</span>
          <span className="block">
            {secondLead} <span className="text-accent">{lastWord}</span>
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{site.title}</p>
        <p className="mt-3 text-sm text-muted sm:text-base">
          {site.focus}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {site.location}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#desarrollos"
            className="inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-black"
          >
            Ver desarrollos
          </a>
          <a
            href="#contacto"
            className="inline-flex h-12 items-center rounded-full border border-white/20 bg-black/20 px-5 text-sm font-semibold text-white backdrop-blur-sm"
          >
            Contacto
          </a>
        </div>
        <ul className="mt-8 flex flex-col items-center gap-2 text-sm text-white/80 sm:flex-row sm:justify-center sm:gap-6">
          <li>
            <a href={`mailto:${site.email}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-accent">
              {site.email}
            </a>
          </li>
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
      </div>
    </section>
  );
}
