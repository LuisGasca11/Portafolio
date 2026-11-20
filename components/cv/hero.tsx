import Link from "next/link";
import { ExternalLink } from "@/components/cv/external-link";
import { HeroCanvas } from "@/components/cv/hero-canvas";
import { profile } from "@/lib/cv";

const words = profile.name.split(" ");
const firstLine = words.slice(0, 2).join(" ");
const secondLead = words.slice(2, -1).join(" ");
const lastWord = words.at(-1) ?? "";

const linkClass = "underline decoration-white/25 underline-offset-4 hover:decoration-accent";

export function Hero() {
  return (
    <section
      id="inicio"
      className="hero-stage relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-16 print:min-h-0 print:px-0 print:py-0"
    >
      <HeroCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-canvas" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,9,8,0.78)_0%,rgba(10,9,8,0.28)_42%,transparent_68%)]" />
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <p className="inline-flex rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[0.7rem] font-medium tracking-[0.22em] text-white/85 uppercase backdrop-blur-sm">
          Currículum vitae
        </p>
        <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(3.1rem,8.4vw,6.6rem)] leading-[0.92] tracking-[-0.045em] text-balance">
          <span className="block">{firstLine}</span>
          <span className="block">
            {secondLead} <span className="text-accent">{lastWord}</span>
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{profile.title}</p>
        <p className="mt-3 text-sm text-muted sm:text-base">{profile.location}</p>
        <div className="no-print mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#contacto" className="btn-accent inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold">
            Contacto
          </a>
          <a
            href="#proyectos"
            className="inline-flex h-12 items-center rounded-full border border-white/20 bg-black/20 px-5 text-sm font-semibold text-white backdrop-blur-sm hover:border-accent"
          >
            Proyectos
          </a>
        </div>
        <ul className="mt-8 flex flex-col items-center gap-2 text-sm text-white/85 sm:flex-row sm:justify-center sm:gap-6">
          <li>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              {profile.email}
            </a>
          </li>
          <li>
            <Link href={profile.portfolio.href} className={linkClass}>
              {profile.portfolio.label}
            </Link>
          </li>
          <li>
            <ExternalLink href={profile.github.href} className={linkClass}>
              {profile.github.label}
            </ExternalLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
