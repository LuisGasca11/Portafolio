"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ExternalLink } from "@/components/external-link";
import { AmbientVideo } from "@/components/worlds/ambient-video";
import { ContactForm } from "@/components/worlds/contact-form";
import type { ContactFormClasses } from "@/components/worlds/contact-form";
import { gsap, ScrollTrigger, setupCommonMotion, useReducedMotion } from "@/components/worlds/motion";
import { Banners, Kite, Landscape, Marigold, Star, Sun, Zigzag } from "@/components/worlds/papel-art";
import { cvUrl, projects, roles, site, skillGroups, stats, studies } from "@/lib/content";
import "./papel.css";

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1.5",
  label: "text-xs font-extrabold tracking-[0.14em] text-[#7a1650] uppercase",
  input:
    "w-full rounded-lg border-2 border-[#3b1230] bg-white px-4 py-3 text-sm text-[#3b1230] placeholder:text-[#3b1230]/40 focus:border-[#e6007e] focus:outline-none",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#e6007e] px-7 text-sm font-extrabold text-white shadow-[0_5px_0_#8f0050] disabled:opacity-60",
  error: "text-sm font-bold text-[#b00020]",
  sent: "rounded-xl border-2 border-dashed border-[#00b8a9] p-6",
  sentTitle: "pp-display text-2xl text-[#00867c]",
  sentText: "mt-2 text-sm",
  again: "mt-4 inline-flex h-10 items-center rounded-full border-2 border-[#3b1230] px-4 text-sm font-bold",
};

const stallColors = ["#e6007e", "#ffc400", "#ff6a00", "#7a2cbf"];
const groupColors = ["#e6007e", "#00a99b", "#ff6a00", "#7a2cbf", "#d99a00", "#c2185b"];
const stars = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 53 + 7) % 100}%`,
  top: `${(index * 37 + 11) % 70}%`,
  size: 10 + ((index * 7) % 18),
  delay: -((index * 3) % 9) / 3,
}));
const footMarigolds = [4, 17, 30, 44, 58, 71, 85];

function Title({ children, color = "inherit", className = "" }: { children: string; color?: string; className?: string }) {
  return (
    <h2 data-reveal className={`pp-display text-5xl uppercase sm:text-7xl ${className}`} style={{ color }}>
      {children}
    </h2>
  );
}

export function WorldPapel() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) {
      return;
    }
    const context = gsap.context(() => {
      setupCommonMotion(element);

      gsap.from("[data-hero-word]", {
        y: -160,
        rotate: (index: number) => (index % 2 === 0 ? -8 : 8),
        opacity: 0,
        duration: 1.3,
        ease: "bounce.out",
        stagger: 0.18,
        delay: 0.15,
      });
      gsap.from("[data-sun]", { scale: 0.4, opacity: 0, duration: 1.6, ease: "elastic.out(1, 0.6)" });
      gsap.to("[data-sun]", { rotate: 90, ease: "none", scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: true } });

      gsap.utils.toArray<HTMLElement>("[data-spin]", element).forEach((flower) => {
        gsap.to(flower, {
          rotate: Number(flower.dataset.spin ?? "180"),
          ease: "none",
          scrollTrigger: { trigger: flower.closest("section") ?? flower, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stall]", element).forEach((stall, index) => {
        gsap.from(stall, {
          y: 90,
          rotate: index % 2 === 0 ? -5 : 5,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: stall, start: "top 92%", once: true },
        });
      });

      gsap.fromTo("[data-moon]", { y: 220 }, { y: -40, ease: "none", scrollTrigger: { trigger: "#contacto", start: "top bottom", end: "center center", scrub: true } });

      const kite = element.querySelector<HTMLElement>("[data-kite]");
      if (kite) {
        ScrollTrigger.create({
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.to(kite, {
              left: `${95 + 1.8 * Math.sin(p * Math.PI * 12)}%`,
              top: `${16 + 62 * (0.5 + 0.5 * Math.sin(p * Math.PI * 6))}vh`,
              rotate: 14 * Math.cos(p * Math.PI * 6),
              duration: 0.6,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
      }
    }, element);
    const refresh = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(refresh);
      context.revert();
    };
  }, [reduced]);

  const nameWords = site.name.split(" ");
  const heroLines = [nameWords.slice(0, 2).join(" "), nameWords.slice(2).join(" ")];

  return (
    <div ref={root} className="pp-root overflow-x-clip bg-[#fff4df]">
      <div className="pp-grain" aria-hidden="true" />
      <div data-kite aria-hidden="true" className="pointer-events-none fixed top-[16vh] left-[95%] z-40 hidden w-12 -translate-x-1/2 xl:block">
        <Kite />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-10">
        <a href="#inicio" className="pp-display rounded-lg bg-[#fff4df] px-3 py-1 text-xl text-[#e6007e] shadow-[0_4px_0_rgba(60,10,30,0.25)]">
          {site.brand}
        </a>
        <nav aria-label="Principal" className="hidden gap-2 text-sm font-bold md:flex">
          {[["#desarrollos", "Desarrollos"], ["#experiencia", "Experiencia"], ["#habilidades", "Habilidades"], ["#contacto", "Contacto"]].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full bg-[#fff4df]/90 px-4 py-1.5 text-[#3b1230] shadow-[0_3px_0_rgba(60,10,30,0.2)]">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="inicio" className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-36 pb-[34vh] sm:pt-40">
        <AmbientVideo name="papel" className="absolute inset-0 -z-20" />
        <div data-sun className="pointer-events-none absolute top-[34%] left-1/2 -z-10 w-[min(70vw,520px)] -translate-x-1/2">
          <Sun />
        </div>
        <Landscape className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[58%]" />
        <div className="relative z-10 text-center">
          <p className="pp-paper mx-auto inline-block -rotate-2 rounded-md px-4 py-1.5 text-xs font-extrabold tracking-[0.2em] text-[#e6007e] uppercase">
            {site.shortTitle} · {site.location}
          </p>
          <h1 className="pp-display pp-text-shadow mt-6 text-[clamp(2.6rem,9vw,7rem)] leading-[0.95] text-[#fff4df] uppercase">
            {heroLines.map((line) => (
              <span key={line} className="block">
                {line.split(" ").map((word) => (
                  <span key={word} data-hero-word className="mr-[0.22em] inline-block last:mr-0">
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-semibold text-white [text-shadow:0_2px_8px_rgba(90,10,30,0.5)]">{site.focus}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#desarrollos" className="inline-flex h-12 items-center rounded-full bg-[#fff4df] px-6 text-sm font-extrabold text-[#3b1230] shadow-[0_5px_0_rgba(60,10,30,0.3)]">
              Ver el tianguis
            </a>
            <a href="#contacto" className="inline-flex h-12 items-center rounded-full bg-[#e6007e] px-6 text-sm font-extrabold text-white shadow-[0_5px_0_#8f0050]">
              Contacto
            </a>
          </div>
        </div>
      </section>

      <section id="sobre-mi" className="relative bg-[#fff4df] px-5 pt-16 pb-28">
        <Zigzag color="#fff4df" className="absolute -top-[39px] left-0 h-10 w-full" />
        <div aria-hidden="true" data-spin="200" className="pointer-events-none absolute -top-10 -right-16 w-48 sm:w-72">
          <Marigold />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <p data-reveal className="text-sm font-extrabold tracking-[0.25em] text-[#e6007e] uppercase">Hola, qué gusto verte</p>
          <Title color="#3b1230" className="mt-3">Sobre mí</Title>
          <p data-reveal className="pp-display mt-8 text-3xl leading-tight normal-case text-[#3b1230] sm:text-5xl">{site.about}</p>
          <dl className="mt-14 grid grid-cols-3 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                data-reveal
                className="pp-paper grid aspect-square place-content-center rounded-full text-center"
                style={{ backgroundColor: groupColors[index], rotate: index === 1 ? "4deg" : "-4deg" } as CSSProperties}
              >
                <dd className="pp-display text-5xl text-white sm:text-7xl">{stat.value}</dd>
                <dt className="mt-1 px-2 text-[0.6rem] font-extrabold tracking-[0.12em] text-white/95 uppercase sm:text-xs">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="desarrollos"
        className="relative px-5 pt-20 pb-32"
        style={{ backgroundColor: "#00b8a9", backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 2.5px, transparent 2.5px)", backgroundSize: "30px 30px" }}
      >
        <Zigzag color="#00b8a9" className="absolute -top-[39px] left-0 h-10 w-full" />
        <div className="relative mx-auto max-w-6xl">
          <p data-reveal className="text-sm font-extrabold tracking-[0.25em] text-[#fff4df] uppercase">El tianguis de proyectos</p>
          <Title color="#fff4df" className="mt-3 pp-text-shadow">Desarrollos</Title>
          <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {projects.map((project, index) => {
              const color = stallColors[index % stallColors.length] ?? "#e6007e";
              return (
                <li key={project.name} data-stall>
                  <article className="pp-card relative" style={{ rotate: index % 2 === 0 ? "-1deg" : "1deg" } as CSSProperties}>
                    <div className="pp-awning" aria-hidden="true">
                      {Array.from({ length: 8 }, (_, stripe) => (
                        <span key={stripe} style={{ backgroundColor: stripe % 2 === 0 ? color : "#fff4df" }} />
                      ))}
                    </div>
                    <div className="pp-paper -mt-1 rounded-b-xl px-6 pt-6 pb-7 sm:px-8">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-extrabold tracking-[0.14em] uppercase" style={{ color }}>{project.context}</p>
                        <span className="pp-display grid h-9 w-9 shrink-0 place-items-center rounded-full text-base text-white" style={{ backgroundColor: color }}>
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="pp-display mt-2 text-2xl leading-tight text-[#3b1230] sm:text-3xl">{project.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#3b1230]/85">{project.description}</p>
                      {project.stack.length > 0 ? (
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Stack de ${project.name}`}>
                          {project.stack.map((tag) => (
                            <li key={tag} className="rounded-md bg-[#3b1230] px-2.5 py-1 text-xs font-bold text-[#fff4df]">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {project.href !== undefined ? (
                        <ExternalLink href={project.href} className="mt-4 inline-block text-sm font-extrabold text-[#e6007e] underline underline-offset-4">
                          {project.linkLabel ?? project.href}
                        </ExternalLink>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="experiencia" className="relative bg-[#e6007e] px-5 pt-20 pb-32 text-[#fff4df]">
        <Zigzag color="#e6007e" className="absolute -top-[39px] left-0 h-10 w-full" />
        <div className="relative mx-auto max-w-5xl">
          <p data-reveal className="text-sm font-extrabold tracking-[0.25em] uppercase">Etiquetas de oficio</p>
          <Title className="mt-3 pp-text-shadow">Experiencia</Title>
          <div className="relative mt-16">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[#fff4df]/70" />
            <ul className="grid gap-12 pt-0 md:grid-cols-2">
              {roles.map((role, index) => (
                <li key={role.organization} data-reveal>
                  <div className="pp-dangle" style={{ animationDelay: `${index * -1.8}s` }}>
                    <div aria-hidden="true" className="mx-auto h-12 w-px bg-[#fff4df]/80" />
                    <article className="pp-tag pp-paper relative px-7 pt-10 pb-8 text-[#3b1230]">
                      <span aria-hidden="true" className="absolute top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#e6007e] shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)]" />
                      <h3 className="pp-display text-2xl leading-tight sm:text-3xl">{role.role}</h3>
                      <p className="mt-2 font-bold text-[#c2185b]">
                        {role.href !== undefined ? (
                          <ExternalLink href={role.href} className="underline underline-offset-4">
                            {role.organization}
                          </ExternalLink>
                        ) : (
                          role.organization
                        )}
                      </p>
                      {role.period !== undefined ? <p className="mt-1 text-sm font-semibold text-[#3b1230]/70">{role.period}</p> : null}
                      {role.summary !== undefined ? <p className="mt-4 text-sm leading-relaxed">{role.summary}</p> : null}
                    </article>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="habilidades" className="relative overflow-hidden bg-[#fff4df] px-5 pt-20 pb-32">
        <Zigzag color="#fff4df" className="absolute -top-[39px] left-0 h-10 w-full" />
        <div aria-hidden="true" data-spin="-240" className="pointer-events-none absolute top-24 -left-20 w-56 sm:w-80">
          <Marigold />
        </div>
        <div aria-hidden="true" data-spin="260" className="pointer-events-none absolute -right-14 bottom-10 w-44 sm:w-64">
          <Marigold />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <p data-reveal className="text-sm font-extrabold tracking-[0.25em] text-[#e6007e] uppercase">Mi ramo de flores</p>
          <Title color="#3b1230" className="mt-3">Habilidades</Title>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {skillGroups.map((group, index) => (
              <div key={group.title} data-reveal className="pp-paper rounded-xl p-6" style={{ rotate: index % 2 === 0 ? "-0.8deg" : "0.8deg" } as CSSProperties}>
                <h3 className="pp-display text-2xl" style={{ color: groupColors[index % groupColors.length] }}>{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="pp-chip" style={{ backgroundColor: groupColors[index % groupColors.length] }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="educacion" className="relative overflow-hidden bg-[#ffc400] px-5 pt-28 pb-32">
        <Zigzag color="#ffc400" className="absolute -top-[39px] left-0 h-10 w-full" />
        <Banners count={14} palette={["#e6007e", "#00b8a9", "#7a2cbf", "#ff6a00"]} className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full" />
        <div className="relative mx-auto max-w-4xl">
          <Title color="#3b1230" className="mt-6">Educación</Title>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {studies.map((study, index) => (
              <li key={study.title} data-reveal className="pp-paper rounded-xl border-4 border-dashed border-[#e6007e]/60 p-6" style={{ rotate: index === 0 ? "-1.2deg" : "1.2deg" } as CSSProperties}>
                <p className="text-sm font-extrabold text-[#e6007e]">{study.period}</p>
                <h3 className="pp-display mt-1 text-2xl text-[#3b1230]">{study.title}</h3>
                {study.institution !== undefined ? <p className="mt-2 text-sm font-semibold text-[#3b1230]/80">{study.institution}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacto" className="relative overflow-hidden bg-[#2b1055] px-5 pt-24 pb-60 text-[#fff4df]" style={{ backgroundImage: "linear-gradient(180deg,#2b1055 0%,#4a1a78 60%,#7a2a7a 100%)" }}>
        <Zigzag color="#2b1055" className="absolute -top-[39px] left-0 h-10 w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {stars.map((star) => (
            <Star key={star.left + star.top} className="pp-twinkle absolute" style={{ left: star.left, top: star.top, width: star.size, animationDelay: `${star.delay}s` }} />
          ))}
          <div data-moon className="absolute top-12 right-[8%] h-28 w-28 rounded-full bg-[#fff4df] shadow-[0_0_80px_20px_rgba(255,244,223,0.35)] sm:h-40 sm:w-40">
            <span className="absolute top-[22%] left-[26%] h-6 w-6 rounded-full bg-[#e8dcc0]" />
            <span className="absolute top-[52%] left-[50%] h-9 w-9 rounded-full bg-[#e8dcc0]" />
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <p data-reveal className="text-sm font-extrabold tracking-[0.25em] text-[#ffc400] uppercase">Noche de ofrenda</p>
          <Title className="mt-3 pp-text-shadow">¡Escríbeme!</Title>
          <p data-reveal className="mt-4 max-w-md text-lg">Si tienes un proyecto en mente, aquí te espero con una vela encendida.</p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <ul className="grid gap-3 text-base font-semibold">
                <li>
                  <a href={`mailto:${site.email}`} className="text-xl underline decoration-[#ffc400] underline-offset-4">{site.email}</a>
                </li>
                <li>
                  <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline decoration-[#ffc400]/60 underline-offset-4">{site.phone}</a>
                </li>
                <li>
                  <ExternalLink href={site.githubUrl} className="underline decoration-[#ffc400]/60 underline-offset-4">{site.githubLabel}</ExternalLink>
                </li>
                <li>
                  <Link href={cvUrl} className="underline decoration-[#ffc400]/60 underline-offset-4">Currículum</Link>
                </li>
                <li className="text-[#fff4df]/75">{site.location}</li>
              </ul>
              <div aria-hidden="true" className="mt-10 flex items-end gap-8">
                {[0, 1, 2].map((candle) => (
                  <div key={candle} className="flex flex-col items-center">
                    <div className="pp-flame" style={{ animationDelay: `${candle * -0.3}s` }} />
                    <div className="mt-1 h-16 w-6 rounded-sm bg-[#fff4df]" style={{ height: `${56 + candle * 14}px` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pp-paper relative -rotate-1 rounded-md p-6 text-[#3b1230] sm:p-8">
              <span className="pp-tape" aria-hidden="true" />
              <ContactForm classes={formClasses} submitLabel="Enviar mensaje" />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#150633]" />
          {footMarigolds.map((left, index) => (
            <Marigold key={left} className="absolute w-16 sm:w-24" style={{ left: `${left}%`, bottom: `${index % 2 === 0 ? 6 : 28}px` } as CSSProperties} />
          ))}
        </div>
      </section>

      <p className="bg-[#150633] pb-24 text-center text-xs text-[#fff4df]/70">© 2026 {site.name}</p>
    </div>
  );
}
