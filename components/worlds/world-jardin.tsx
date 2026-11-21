"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { AmbientVideo } from "@/components/worlds/ambient-video";
import { ContactForm } from "@/components/worlds/contact-form";
import type { ContactFormClasses } from "@/components/worlds/contact-form";
import { Bloom, Leaf, Lantern, Rings, Sprig, Sprout } from "@/components/worlds/jardin-art";
import { gsap, ScrollTrigger, setupCommonMotion, useReducedMotion } from "@/components/worlds/motion";
import { cvUrl, projects, roles, site, skillGroups, stats, studies } from "@/lib/content";
import "./jardin.css";

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1.5",
  label: "text-xs font-semibold tracking-[0.18em] text-[#ffd98a] uppercase",
  input:
    "w-full rounded-xl border border-[#ffd98a]/30 bg-[#06150d]/70 px-4 py-3 text-sm text-[#fff8e1] placeholder:text-[#fff8e1]/35 focus:border-[#ffd98a] focus:outline-none",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ffd98a] to-[#ff9db4] px-7 text-sm font-bold text-[#2a1a05] shadow-[0_0_30px_rgba(255,190,100,0.45)] disabled:opacity-60",
  error: "text-sm text-rose-300",
  sent: "rounded-2xl border border-[#8fe08a]/50 bg-[#8fe08a]/10 p-6",
  sentTitle: "jd-display text-2xl",
  sentText: "mt-2 text-sm text-[#f3efd9]/85",
  again: "mt-4 inline-flex h-10 items-center rounded-full border border-[#ffd98a]/60 px-4 text-sm font-semibold",
};

const blooms = [
  { hue: "#ff9db4", core: "#ffd98a" },
  { hue: "#ffd98a", core: "#ff9db4" },
  { hue: "#c9a8ff", core: "#ffe9a0" },
  { hue: "#ff8f7a", core: "#fff0b0" },
];

const herbariumTilts = ["-1.2deg", "1deg", "0.8deg", "-0.8deg", "1.2deg", "-1deg"];

function vinePath(height: number): string {
  const step = 200;
  let d = "M40 0";
  for (let y = 0; y < height; y += step) {
    const side = Math.floor(y / step) % 2 === 0 ? 1 : -1;
    d += ` C${40 + 12 * side} ${y + step * 0.33} ${40 - 12 * side} ${y + step * 0.66} 40 ${y + step}`;
  }
  return d;
}

function Heading({ eyebrow, title, bloomIndex = 0 }: { eyebrow: string; title: string; bloomIndex?: number }) {
  const bloom = blooms[bloomIndex % blooms.length] ?? blooms[0];
  return (
    <div className="relative">
      <Bloom animate className="jd-bud !top-3 sm:!top-4" hue={bloom?.hue} core={bloom?.core} />
      <p data-reveal className="text-xs font-semibold tracking-[0.28em] text-[#ff9db4] uppercase">{eyebrow}</p>
      <h2 data-reveal className="jd-display mt-2 text-5xl font-light tracking-tight text-[#fff1c9] sm:text-7xl">{title}</h2>
    </div>
  );
}

export function WorldJardin() {
  const root = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const target = journey.current;
    if (!target) {
      return;
    }
    const measure = () => {
      setHeight(Math.round(target.offsetHeight / 20) * 20);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    const track = journey.current;
    if (!element || !track || reduced || height === 0) {
      return;
    }
    const context = gsap.context(() => {
      setupCommonMotion(element);

      const timeline = gsap.timeline({ delay: 0.2 });
      const stem = element.querySelector<SVGPathElement>("[data-sprout-stem]");
      if (stem) {
        const length = stem.getTotalLength();
        gsap.set(stem, { strokeDasharray: length, strokeDashoffset: length });
        timeline.to(stem, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
      }
      timeline.from("[data-sprout-leaf]", { scale: 0, duration: 0.8, stagger: 0.25, ease: "back.out(2)" }, "-=0.5");
      timeline.from("[data-sprout-bloom]", { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.7)" }, "-=0.2");
      timeline.to("[data-sprout-glow]", { opacity: 1, duration: 1.2 }, "-=0.6");

      const vine = element.querySelector<SVGPathElement>("[data-vine]");
      if (vine) {
        const length = vine.getTotalLength();
        gsap.set(vine, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(vine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: track, start: "top 70%", end: "bottom 70%", scrub: 0.6 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-vine-leaf]", element).forEach((leaf) => {
        gsap.from(leaf, {
          scale: 0,
          opacity: 0,
          transformOrigin: "0% 50%",
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: { trigger: leaf, start: "top 72%", once: true },
        });
      });

      gsap.utils.toArray<SVGElement>("[data-bloom]", element).forEach((bloom) => {
        gsap.from(bloom, {
          scale: 0,
          rotate: -140,
          transformOrigin: "50% 50%",
          duration: 1.1,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: bloom, start: "top 80%", once: true },
        });
      });

      gsap.utils.toArray<SVGEllipseElement>("[data-ring]", element).forEach((ring, index) => {
        const length = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(ring, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: "#experiencia", start: `top ${80 - index * 3}%`, end: "center 40%", scrub: true },
        });
      });

      gsap.from("[data-lantern]", {
        y: -120,
        opacity: 0,
        duration: 1.2,
        ease: "bounce.out",
        stagger: 0.2,
        scrollTrigger: { trigger: "#contacto", start: "top 60%", once: true },
      });
    }, element);

    const refresh = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(refresh);
      context.revert();
    };
  }, [reduced, height]);

  const leafCount = Math.floor(height / 260);
  const nameWords = site.name.split(" ");

  return (
    <div ref={root} className="jd-root overflow-x-clip">
      <div className="jd-bg" aria-hidden="true" />
      <AmbientVideo name="jardin" className="jd-video" />
      <div className="jd-veil" aria-hidden="true" />

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-10">
        <a href="#inicio" className="jd-display text-xl font-semibold tracking-tight text-[#fff1c9]">
          {site.brand}
        </a>
        <nav aria-label="Principal" className="hidden gap-6 text-sm font-medium text-[#f3efd9]/85 md:flex">
          <a href="#desarrollos">Desarrollos</a>
          <a href="#experiencia">Experiencia</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section id="inicio" className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-24 pb-10 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-[#ff9db4] uppercase">{site.shortTitle} · {site.location}</p>
        <h1 className="jd-display mt-5 text-[clamp(2.8rem,8.4vw,6.8rem)] leading-[0.98] font-light tracking-[-0.02em] text-balance text-[#fff1c9]">
          {nameWords.slice(0, 2).join(" ")}
          <span className="block font-semibold italic text-[#ffd98a]">{nameWords.slice(2).join(" ")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-[#f3efd9]/85">
          {site.focus}. Aquí todo empieza como una semilla.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href="#desarrollos" className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-[#ffd98a] to-[#ff9db4] px-6 text-sm font-bold text-[#2a1a05]">
            Ver cómo ha crecido
          </a>
          <a href="#contacto" className="inline-flex h-12 items-center rounded-full border border-[#ffd98a]/50 px-6 text-sm font-semibold">
            Contacto
          </a>
        </div>
        <Sprout className="mt-8 h-[min(28vh,230px)]" />
      </section>

      <div ref={journey} className="relative mx-auto max-w-5xl pr-5 pl-[4.2rem] sm:pr-8 sm:pl-[7.4rem]">
        <div aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-0 w-20 sm:left-6">
          <svg viewBox={`0 0 80 ${Math.max(height, 1)}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" overflow="visible">
            <defs>
              <linearGradient id="jd-vine-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8fe08a" />
                <stop offset="1" stopColor="#2f8a52" />
              </linearGradient>
            </defs>
            <path data-vine d={vinePath(height)} fill="none" stroke="url(#jd-vine-g)" strokeWidth="6" strokeLinecap="round" />
          </svg>
          {Array.from({ length: leafCount }, (_, index) => (
            <div
              key={index}
              data-vine-leaf
              className="absolute w-9 sm:w-11"
              style={{ top: 150 + index * 260, left: index % 2 === 0 ? 40 : 40, transform: `rotate(${index % 2 === 0 ? -28 : 208}deg)`, transformOrigin: "0% 50%" } as CSSProperties}
            >
              <Leaf />
            </div>
          ))}
        </div>

        <section id="sobre-mi" className="relative py-24 sm:py-32">
          <Heading eyebrow="Raíces" title="Sobre mí" bloomIndex={0} />
          <p data-reveal className="jd-display mt-8 text-3xl leading-snug font-light text-[#f3efd9] sm:text-5xl sm:leading-[1.15]">{site.about}</p>
          <dl className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} data-reveal className="jd-card px-2 py-6 text-center">
                <dd className="jd-display text-5xl font-semibold text-[#ffd98a] sm:text-6xl">{stat.value}</dd>
                <dt className="mt-1 text-[0.62rem] tracking-[0.16em] text-[#f3efd9]/80 uppercase sm:text-xs">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section id="desarrollos" className="relative py-20 sm:py-28">
          <Heading eyebrow="Frutos del jardín" title="Desarrollos" bloomIndex={1} />
          <ul className="mt-14 grid gap-9">
            {projects.map((project, index) => (
              <li key={project.name} data-reveal className="relative">
                <Bloom animate className="jd-bud" hue={blooms[(index + 2) % blooms.length]?.hue} core={blooms[(index + 2) % blooms.length]?.core} />
                <span className="jd-stem" aria-hidden="true" />
                <article className="jd-card p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="jd-display text-2xl font-semibold text-[#ffe7a8] sm:text-4xl">{project.name}</h3>
                    <p className="text-xs font-semibold tracking-[0.16em] text-[#ff9db4] uppercase">{project.context}</p>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#f3efd9]/85 sm:text-base">{project.description}</p>
                  {project.stack.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
                      {project.stack.map((tag) => (
                        <li key={tag} className="jd-leafchip">{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                  {project.href !== undefined ? (
                    <ExternalLink href={project.href} className="mt-5 inline-block text-sm font-semibold text-[#ffd98a] underline underline-offset-4">
                      {project.linkLabel ?? project.href}
                    </ExternalLink>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section id="experiencia" className="relative py-20 sm:py-28">
          <Heading eyebrow="Anillos del árbol" title="Experiencia" bloomIndex={2} />
          <Rings className="pointer-events-none absolute top-14 right-0 w-36 opacity-90 sm:w-56" />
          <ol className="mt-14 grid gap-8">
            {roles.map((role) => (
              <li key={role.organization} data-reveal className="relative">
                <span className="jd-stem" aria-hidden="true" />
                <article className="jd-card p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="jd-display text-2xl font-semibold text-[#ffe7a8] sm:text-3xl">{role.role}</h3>
                    {role.period !== undefined ? <p className="text-sm text-[#ff9db4]">{role.period}</p> : null}
                  </div>
                  <p className="mt-2 font-medium">
                    {role.href !== undefined ? (
                      <ExternalLink href={role.href} className="underline decoration-[#ffd98a]/50 underline-offset-4">{role.organization}</ExternalLink>
                    ) : (
                      role.organization
                    )}
                  </p>
                  {role.summary !== undefined ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#f3efd9]/85">{role.summary}</p> : null}
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section id="habilidades" className="relative py-20 sm:py-28">
          <Heading eyebrow="Herbario" title="Habilidades" bloomIndex={3} />
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {skillGroups.map((group, index) => (
              <article key={group.title} data-reveal className="jd-herbarium relative overflow-hidden p-6 pr-20" style={{ rotate: herbariumTilts[index % herbariumTilts.length] } as CSSProperties}>
                <Sprig className="jd-sway absolute top-2 right-3 h-24 opacity-80" style={{ animationDelay: `${index * -1.1}s` } as CSSProperties} />
                <p className="text-[0.65rem] font-semibold tracking-[0.25em] uppercase opacity-60">Espécimen {String(index + 1).padStart(2, "0")}</p>
                <h3 className="jd-display mt-1 text-2xl font-semibold italic">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="jd-leafchip">{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="educacion" className="relative py-20 sm:py-28">
          <Heading eyebrow="Semilleros" title="Educación" bloomIndex={1} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {studies.map((study) => (
              <li key={study.title} data-reveal className="jd-card p-6">
                <p className="text-sm text-[#ff9db4]">{study.period}</p>
                <h3 className="jd-display mt-1 text-2xl font-semibold text-[#ffe7a8]">{study.title}</h3>
                {study.institution !== undefined ? <p className="mt-2 text-sm text-[#f3efd9]/80">{study.institution}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section id="contacto" className="relative px-5 pt-20 pb-40">
        <div className="mx-auto max-w-5xl">
          <div className="jd-pane relative px-6 pt-28 pb-12 sm:px-12">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 flex justify-around px-[10%]">
              {[0, 1, 2].map((index) => (
                <div key={index} data-lantern className="jd-sway w-10 sm:w-14" style={{ animationDelay: `${index * -1.7}s`, marginTop: index === 1 ? 0 : 28 }}>
                  <Lantern />
                </div>
              ))}
            </div>
            <p data-reveal className="text-center text-xs font-semibold tracking-[0.28em] text-[#ff9db4] uppercase">El invernadero</p>
            <h2 data-reveal className="jd-display mt-3 text-center text-5xl font-light tracking-tight text-[#fff1c9] sm:text-7xl">Cultivemos algo juntos</h2>
            <p data-reveal className="mx-auto mt-4 max-w-md text-center text-[#f3efd9]/85">Cuéntame tu idea: la sembramos, la cuidamos y la vemos crecer.</p>
            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
              <ul className="grid content-start gap-3 text-sm">
                <li>
                  <a href={`mailto:${site.email}`} className="text-lg font-semibold text-[#ffe7a8] underline decoration-[#ffd98a]/50 underline-offset-4">{site.email}</a>
                </li>
                <li>
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline decoration-[#ffd98a]/40 underline-offset-4">{site.phone}</a>
                </li>
                <li>
                  <ExternalLink href={site.githubUrl} className="underline decoration-[#ffd98a]/40 underline-offset-4">{site.githubLabel}</ExternalLink>
                </li>
                <li>
                  <Link href={cvUrl} className="underline decoration-[#ffd98a]/40 underline-offset-4">Currículum</Link>
                </li>
                <li className="text-[#f3efd9]/70">{site.location}</li>
              </ul>
              <div className="rounded-3xl border border-[#ffd98a]/20 bg-[#06150d]/55 p-6 backdrop-blur-sm sm:p-8">
                <ContactForm classes={formClasses} submitLabel="Sembrar mensaje" sendingLabel="Sembrando…" sentTitle="¡Semilla recibida!" />
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#2a1a0c]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-around">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Sprig key={index} className="jd-sway h-20 opacity-70 sm:h-28" style={{ animationDelay: `${index * -0.9}s`, transformOrigin: "50% 100%" } as CSSProperties} />
          ))}
        </div>
      </section>

      <p className="relative bg-[#2a1a0c] pb-24 text-center text-xs text-[#f3efd9]/60">© 2026 {site.name}</p>
    </div>
  );
}
