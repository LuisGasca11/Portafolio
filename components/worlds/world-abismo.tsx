"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ExternalLink } from "@/components/external-link";
import { AmbientVideo } from "@/components/worlds/ambient-video";
import { Angler, Coral, Fish, Jellyfish, Seaweed, Submarine, Waves, Whale } from "@/components/worlds/abismo-art";
import { ContactForm } from "@/components/worlds/contact-form";
import type { ContactFormClasses } from "@/components/worlds/contact-form";
import { gsap, ScrollTrigger, setupCommonMotion, useReducedMotion } from "@/components/worlds/motion";
import { cvUrl, projects, roles, site, skillGroups, stats, studies } from "@/lib/content";
import "./abismo.css";

const maxDepth = 1200;

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1.5",
  label: "text-xs font-semibold tracking-[0.18em] text-cyan-200/80 uppercase",
  input:
    "w-full rounded-xl border border-cyan-200/25 bg-[#02101c]/70 px-4 py-3 text-sm text-white placeholder:text-cyan-100/35 focus:border-cyan-200 focus:outline-none",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 to-emerald-200 px-7 text-sm font-bold text-[#02202e] shadow-[0_0_30px_rgba(126,232,255,0.5)] disabled:opacity-60",
  error: "text-sm text-rose-300",
  sent: "rounded-2xl border border-emerald-200/40 bg-emerald-300/10 p-6",
  sentTitle: "ab-display text-2xl",
  sentText: "mt-2 text-sm text-cyan-50/80",
  again: "mt-4 inline-flex h-10 items-center rounded-full border border-cyan-200/50 px-4 text-sm font-semibold",
};

const bubbles = Array.from({ length: 16 }, (_, index) => ({
  left: `${(index * 61) % 100}%`,
  size: 8 + ((index * 13) % 26),
  duration: 9 + ((index * 7) % 10),
  delay: -((index * 5) % 13),
  dx: ((index % 2 === 0 ? 1 : -1) * (14 + ((index * 11) % 40))),
}));

const school = [
  { top: "6%", w: 78, from: "#9ff4ff", to: "#1b8fb8", speed: 1.0 },
  { top: "14%", w: 56, from: "#b8fff0", to: "#14a58a", speed: 0.85 },
  { top: "26%", w: 92, from: "#9ff4ff", to: "#1b8fb8", speed: 1.15 },
  { top: "38%", w: 64, from: "#ffd9a0", to: "#e07a1f", speed: 0.95 },
  { top: "50%", w: 84, from: "#9ff4ff", to: "#1b8fb8", speed: 1.05 },
  { top: "62%", w: 50, from: "#b8fff0", to: "#14a58a", speed: 0.8 },
  { top: "72%", w: 72, from: "#ffd9a0", to: "#e07a1f", speed: 1.2 },
];

const groupHues = [190, 160, 320, 45, 270, 20];

function Depth({ meters, zone }: { meters: number; zone: string }) {
  return (
    <p className="ab-depth" data-reveal>
      — {meters.toLocaleString("es-MX")} m · {zone}
    </p>
  );
}

export function WorldAbismo() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const gauge = element.querySelector<HTMLElement>("[data-gauge-dot]");
    const readout = element.querySelector<HTMLElement>("[data-gauge-text]");
    const dark = element.querySelector<HTMLElement>("[data-dark]");

    const context = gsap.context(() => {
      gsap.to(dark, {
        opacity: 1,
        ease: "power1.in",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            if (gauge) gauge.style.top = `${self.progress * 100}%`;
            if (readout) readout.textContent = `${(Math.round((self.progress * maxDepth) / 10) * 10).toLocaleString("es-MX")} m`;
          },
        },
      });

      if (reduced) {
        return;
      }
      setupCommonMotion(element);

      gsap.utils.toArray<HTMLElement>("[data-school]", element).forEach((fish) => {
        const speed = Number(fish.dataset.school ?? "1");
        gsap.fromTo(
          fish,
          { x: "-30vw" },
          {
            x: `${130 * speed}vw`,
            ease: "none",
            scrollTrigger: { trigger: "#sobre-mi", start: "top 85%", end: "bottom top", scrub: 0.8 },
          },
        );
      });

      const words = gsap.utils.toArray<HTMLElement>("[data-word]", element);
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: "[data-about]", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );

      gsap.fromTo(
        "[data-whale]",
        { x: "-60vw" },
        { x: "120vw", ease: "none", scrollTrigger: { trigger: "#experiencia", start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-angler]",
        { x: "40vw", opacity: 0 },
        { x: "0vw", opacity: 1, ease: "power2.out", scrollTrigger: { trigger: "#habilidades", start: "top 60%", end: "center center", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-sub]",
        { x: "-60vw" },
        { x: "0vw", ease: "power2.out", scrollTrigger: { trigger: "#contacto", start: "top 70%", end: "top 15%", scrub: 1 } },
      );
    }, element);

    const refresh = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(refresh);
      context.revert();
    };
  }, [reduced]);

  const aboutWords = site.about.split(" ");

  return (
    <div ref={root} className="ab-root overflow-x-clip">
      <div className="ab-bg" aria-hidden="true" />
      <div className="ab-dark" data-dark aria-hidden="true" />

      <div className="ab-gauge" aria-hidden="true">
        <span>PROF.</span>
        <div className="ab-gauge-track">
          <span className="ab-gauge-dot" data-gauge-dot />
        </div>
        <span data-gauge-text className="tabular-nums">0 m</span>
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-10">
        <a href="#inicio" className="ab-display text-xl font-semibold tracking-tight">
          {site.brand}
        </a>
        <nav aria-label="Principal" className="hidden gap-6 text-sm font-medium text-cyan-50/85 md:flex">
          <a href="#desarrollos">Desarrollos</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5">
        <AmbientVideo name="abismo" className="absolute inset-0 -z-10 opacity-90 [mask-image:linear-gradient(180deg,#000_55%,transparent)]" />
        <Waves className="absolute inset-x-0 top-0 z-0 h-20 opacity-80" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.55),transparent_55%)]" />
        {bubbles.map((bubble) => (
          <span
            key={`${bubble.left}-${bubble.size}`}
            aria-hidden="true"
            className="ab-bubble"
            style={{ left: bubble.left, width: bubble.size, height: bubble.size, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, "--dx": `${bubble.dx}px` } as React.CSSProperties}
          />
        ))}
        <div className="relative mx-auto w-full max-w-5xl pt-16 text-center">
          <p className="ab-depth" style={{ color: "#e6fcff" }}>
            — 0 m · Superficie
          </p>
          <h1 className="ab-display mt-5 text-[clamp(3rem,9vw,7.2rem)] leading-[0.95] font-light tracking-[-0.03em] text-balance">
            {site.name.split(" ").slice(0, 2).join(" ")}
            <span className="block italic font-semibold text-cyan-100">{site.name.split(" ").slice(2).join(" ")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cyan-50/90">
            {site.title}. {site.focus}.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#desarrollos" className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-[#04304c]">
              Sumergirme en los desarrollos
            </a>
            <a href="#contacto" className="inline-flex h-12 items-center rounded-full border border-white/50 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm">
              Contacto
            </a>
          </div>
          <p className="mt-14 text-[0.7rem] tracking-[0.3em] text-white/75 uppercase">
            Desliza para descender
            <span aria-hidden="true" className="ab-bob mt-1 block text-xl leading-none">↓</span>
          </p>
        </div>
      </section>

      <section id="sobre-mi" className="relative px-5 py-28 sm:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {school.map((fish) => (
            <div key={fish.top} data-school={fish.speed} className="absolute left-0" style={{ top: fish.top }}>
              <Fish from={fish.from} to={fish.to} className="ab-bob opacity-90" style={{ width: fish.w }} />
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Depth meters={40} zone="Aguas claras" />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-5xl">Sobre mí</h2>
          <p data-about className="ab-display mt-8 text-3xl leading-snug font-light text-balance sm:text-5xl sm:leading-[1.15]">
            {aboutWords.map((word, index) => (
              <span key={`${word}-${index}`} data-word className="inline-block pr-[0.28em]">
                {word}
              </span>
            ))}
          </p>
          <dl className="mt-16 grid grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} data-reveal className="ab-glass rounded-2xl px-2 py-6">
                <dt className="order-2 mt-1 text-[0.65rem] tracking-[0.18em] text-cyan-100/80 uppercase sm:text-xs">{stat.label}</dt>
                <dd className="ab-display text-4xl font-semibold text-cyan-100 sm:text-6xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="desarrollos" className="relative px-5 py-28">
        <div data-parallax="2" aria-hidden="true" className="pointer-events-none absolute top-24 -left-4 hidden w-24 opacity-80 sm:block">
          <Jellyfish color="#ff7ee0" />
        </div>
        <div data-parallax="-1.5" aria-hidden="true" className="pointer-events-none absolute top-[40%] -right-3 hidden w-32 opacity-70 sm:block">
          <Jellyfish color="#7ee8ff" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Depth meters={180} zone="Zona de luz tenue" />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Desarrollos</h2>
          <p className="mt-4 max-w-xl text-cyan-50/80">Lo que he construido, cada pieza detrás de su propia escotilla.</p>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <li key={project.name} data-reveal>
                <article className="ab-glass ab-card h-full rounded-3xl p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="ab-porthole" aria-hidden="true">{index + 1}</span>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">{project.context}</p>
                      <h3 className="ab-display mt-1 text-2xl leading-tight font-semibold sm:text-3xl">{project.name}</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-cyan-50/80">{project.description}</p>
                  {project.stack.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
                      {project.stack.map((tag) => (
                        <li key={tag} className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2.5 py-1 text-xs font-medium">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {project.href !== undefined ? (
                    <ExternalLink href={project.href} className="mt-5 inline-block text-sm font-semibold text-emerald-200 underline underline-offset-4">
                      {project.linkLabel ?? project.href}
                    </ExternalLink>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experiencia" className="relative px-5 py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 overflow-hidden">
          <div data-whale className="w-[min(70vw,520px)] opacity-80">
            <Whale />
          </div>
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Depth meters={520} zone="Zona crepuscular" />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Experiencia</h2>
          <ol className="relative mt-12 grid gap-6 border-l border-dashed border-cyan-200/35 pl-6 sm:pl-10">
            {roles.map((role) => (
              <li key={role.organization} data-reveal className="relative">
                <span aria-hidden="true" className="absolute top-8 -left-[2.05rem] h-3.5 w-3.5 rounded-full bg-cyan-200 shadow-[0_0_16px_#7ee8ff] sm:-left-[3.05rem]" />
                <article className="ab-glass rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="ab-display text-2xl font-semibold sm:text-3xl">{role.role}</h3>
                    {role.period !== undefined ? <p className="text-sm text-cyan-200">{role.period}</p> : null}
                  </div>
                  <p className="mt-2 font-medium">
                    {role.href !== undefined ? (
                      <ExternalLink href={role.href} className="underline decoration-cyan-200/50 underline-offset-4">
                        {role.organization}
                      </ExternalLink>
                    ) : (
                      role.organization
                    )}
                  </p>
                  {role.summary !== undefined ? <p className="mt-4 text-sm leading-relaxed text-cyan-50/80">{role.summary}</p> : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="habilidades" className="relative px-5 py-32">
        <div aria-hidden="true" data-angler className="pointer-events-none absolute right-0 bottom-10 w-44 sm:w-72">
          <div data-parallax="1">
            <Angler />
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Depth meters={880} zone="Zona abisal · bioluminiscencia" />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Habilidades</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {skillGroups.map((group, index) => (
              <div key={group.title} data-reveal>
                <h3 className="ab-display text-2xl font-semibold italic">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="ab-orb" style={{ "--h": groupHues[index % groupHues.length] } as React.CSSProperties}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="educacion" className="relative px-5 py-28">
        <div className="mx-auto max-w-4xl">
          <Depth meters={1040} zone="La fosa" />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Educación</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {studies.map((study) => (
              <li key={study.title} data-reveal className="ab-glass rounded-3xl p-6">
                <p className="text-sm text-cyan-200">{study.period}</p>
                <h3 className="ab-display mt-1 text-2xl font-semibold">{study.title}</h3>
                {study.institution !== undefined ? <p className="mt-2 text-sm text-cyan-50/75">{study.institution}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacto" className="relative overflow-hidden px-5 pt-28 pb-64 sm:pb-72">
        <div aria-hidden="true" data-sub className="pointer-events-none absolute top-24 left-0 hidden w-[min(34vw,330px)] lg:block">
          <Submarine className="ab-bob" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Depth meters={1200} zone="Fondo marino" />
          <h2 className="ab-display mt-4 text-5xl font-light tracking-tight sm:text-7xl">Llegaste al fondo</h2>
          <p className="mt-4 max-w-xl text-cyan-50/85">Aquí abajo hay silencio y buenas ideas. Si tienes un proyecto, escríbeme.</p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:pl-[22%]">
            <ul className="grid content-start gap-3 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="text-lg font-semibold underline decoration-cyan-200/50 underline-offset-4">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline decoration-cyan-200/40 underline-offset-4">
                  {site.phone}
                </a>
              </li>
              <li>
                <ExternalLink href={site.githubUrl} className="underline decoration-cyan-200/40 underline-offset-4">
                  {site.githubLabel}
                </ExternalLink>
              </li>
              <li>
                <Link href={cvUrl} className="underline decoration-cyan-200/40 underline-offset-4">
                  Currículum
                </Link>
              </li>
              <li className="text-cyan-100/70">{site.location}</li>
            </ul>
            <div className="ab-glass rounded-3xl p-6 sm:p-8">
              <ContactForm classes={formClasses} submitLabel="Enviar mensaje" />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ab-sand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1d3a4a" />
                <stop offset="1" stopColor="#050d14" />
              </linearGradient>
            </defs>
            <path d="M0 120 C200 80 380 150 600 110 C820 70 1050 140 1250 100 C1340 84 1400 96 1440 110 L1440 220 L0 220Z" fill="url(#ab-sand)" />
          </svg>
          <Coral color="#ff6bd6" className="absolute bottom-10 left-[6%] w-16 sm:w-24" />
          <Coral color="#ff9d5c" className="absolute bottom-6 left-[20%] w-12 sm:w-16" />
          <Seaweed className="absolute bottom-8 left-[34%] w-8 sm:w-10" />
          <Seaweed className="absolute bottom-10 left-[38%] w-6 sm:w-8" />
          <Coral color="#5dffc9" className="absolute right-[24%] bottom-8 w-14 sm:w-20" />
          <Seaweed className="absolute right-[14%] bottom-10 w-8 sm:w-10" />
          <Coral color="#c18bff" className="absolute right-[5%] bottom-6 w-16 sm:w-24" />
        </div>
      </section>

      <p className="relative pb-24 text-center text-xs text-cyan-100/60">© 2026 {site.name}</p>
    </div>
  );
}
