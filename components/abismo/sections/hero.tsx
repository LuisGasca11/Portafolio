import { ExternalLink } from "@/components/shared/external-link";
import { TechIcon } from "@/components/shared/tech-icon";
import type { CSSProperties } from "react";
import { Waves } from "@/components/abismo/art/flora";
import { heroBubbles } from "@/components/abismo/data";
import { AmbientVideo } from "@/components/abismo/ui/ambient-video";
import { site } from "@/lib/content";

export function Hero({ glOn }: { glOn: boolean }) {
  const nameWords = site.name.split(" ");

  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5">
      <AmbientVideo
        name="abismo"
        className={`absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,#000_55%,transparent)] ${glOn ? "opacity-60 mix-blend-screen" : "opacity-90"}`}
      />
      <Waves className="absolute inset-x-0 top-0 z-0 h-20 opacity-80" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.5),transparent_55%)]" />
      {heroBubbles.map((bubble) => (
        <span
          key={`${bubble.left}-${bubble.size}`}
          aria-hidden="true"
          className="ab-bubble"
          style={{ left: bubble.left, width: bubble.size, height: bubble.size, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, "--dx": `${bubble.dx}px` } as CSSProperties}
        />
      ))}
      <div className="relative z-10 mx-auto w-full max-w-5xl pt-20 text-center">
        <p className="ab-depth" style={{ color: "#e6fcff" }} data-hero-fade>
          — 0 m · Superficie
        </p>
        <h1 className="ab-display mt-5 text-[clamp(2.9rem,9vw,7.2rem)] leading-[0.98] font-light tracking-[-0.03em] text-balance">
          <span className="block overflow-hidden pb-[0.12em]">
            {nameWords.slice(0, 2).map((word) => (
              <span key={word} data-hero-word className="mr-[0.22em] inline-block last:mr-0">{word}</span>
            ))}
          </span>
          <span className="block overflow-hidden pb-[0.14em] italic font-semibold text-cyan-100">
            {nameWords.slice(2).map((word) => (
              <span key={word} data-hero-word className="mr-[0.22em] inline-block last:mr-0">{word}</span>
            ))}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-cyan-50/90" data-hero-fade>
          {site.title}. {site.focus}.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3" data-hero-fade>
          <a href="#desarrollos" className="ab-sonar inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-[#04304c]">
            Sumergirme en los desarrollos
          </a>
          <a href="#contacto" className="inline-flex h-12 items-center rounded-full border border-white/50 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm">
            Contacto
          </a>
        </div>
        <ul className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold" data-hero-fade aria-label="Perfiles">
          <li>
            <ExternalLink href={site.githubUrl} className="inline-flex items-center gap-2 rounded-full bg-black/20 py-1 pr-3 pl-1 backdrop-blur-sm">
              <TechIcon name="GitHub" size={1.7} />
              GitHub
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.linkedinUrl} className="inline-flex items-center gap-2 rounded-full bg-black/20 py-1 pr-3 pl-1 backdrop-blur-sm">
              <TechIcon name="LinkedIn" size={1.7} />
              LinkedIn
            </ExternalLink>
          </li>
        </ul>
        <p className="mt-12 text-[0.7rem] tracking-[0.3em] text-white/75 uppercase" data-hero-fade>
          Desliza para descender
          <span aria-hidden="true" className="ab-bob mt-1 block text-xl leading-none">↓</span>
        </p>
      </div>
    </section>
  );
}
