"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { ExternalLink } from "@/components/external-link";
import { TechIcon } from "@/components/tech-icon";
import { AbismoScene } from "@/components/abismo/abismo-3d";
import type { SceneStatus } from "@/components/abismo/abismo-3d";
import { Angler, Coral, Crab, Fish, Jellyfish, Octopus, Rov, Seahorse, Seaweed, Starfish, Submarine, Turtle, Waves, Whale } from "@/components/abismo/abismo-art";
import { AmbientVideo } from "@/components/abismo/ambient-video";
import { ContactForm } from "@/components/abismo/contact-form";
import type { ContactFormClasses } from "@/components/abismo/contact-form";
import { gsap, ScrollTrigger, setupCommonMotion, useReducedMotion } from "@/components/abismo/motion";
import { cvUrl, projects, roles, site, skillGroups, stats, studies } from "@/lib/content";
import "./abismo.css";

const maxDepth = 1200;

const formClasses: ContactFormClasses = {
  form: "grid gap-4",
  field: "grid gap-1.5",
  label: "text-xs font-semibold tracking-[0.18em] text-cyan-200/80 uppercase",
  input:
    "w-full rounded-xl border border-cyan-200/25 bg-[#02101c]/70 px-4 py-3 text-base text-white placeholder:text-cyan-100/35 focus:border-cyan-200 focus:outline-none sm:text-sm",
  button:
    "mt-2 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 to-emerald-200 px-7 text-sm font-bold text-[#02202e] shadow-[0_0_30px_rgba(126,232,255,0.5)] disabled:opacity-60",
  error: "text-sm text-rose-300",
  sent: "rounded-2xl border border-emerald-200/40 bg-emerald-300/10 p-6",
  sentTitle: "ab-display text-2xl",
  sentText: "mt-2 text-sm text-cyan-50/80",
  again: "mt-4 inline-flex h-10 items-center rounded-full border border-cyan-200/50 px-4 text-sm font-semibold",
};

const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#desarrollos", label: "Desarrollos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#educacion", label: "Educación" },
  { href: "#contacto", label: "Contacto" },
] as const;

const bubbles = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 61) % 100}%`,
  size: 8 + ((index * 13) % 26),
  duration: 9 + ((index * 7) % 10),
  delay: -((index * 5) % 13),
  dx: (index % 2 === 0 ? 1 : -1) * (14 + ((index * 11) % 40)),
}));

/** Burbujas con el icono de una tecnología que suben por el hero. */
const iconBubbles = [
  { name: "React.js", left: "3%", size: 4.2, duration: 15, delay: 0.4, dx: 22 },
  { name: "Next.js", left: "11%", size: 3.4, duration: 17, delay: 2.6, dx: -18 },
  { name: "TypeScript", left: "19%", size: 3.8, duration: 16, delay: 5.2, dx: 16 },
  { name: "Node.js", left: "27%", size: 3.4, duration: 18, delay: 7.4, dx: 14 },
  { name: "Laravel", left: "72%", size: 3.2, duration: 18, delay: 1.4, dx: -20 },
  { name: "Expo", left: "80%", size: 4.0, duration: 15, delay: 3.8, dx: 18 },
  { name: "Supabase", left: "87%", size: 3.4, duration: 17, delay: 6.2, dx: -16 },
  { name: "Vue.js", left: "93%", size: 4.2, duration: 16, delay: 8.4, dx: -12 },
];

const school = [
  { top: "6%", w: 78, from: "#9ff4ff", to: "#1b8fb8", speed: 1.0 },
  { top: "18%", w: 56, from: "#b8fff0", to: "#14a58a", speed: 0.85 },
  { top: "32%", w: 92, from: "#9ff4ff", to: "#1b8fb8", speed: 1.15 },
  { top: "48%", w: 64, from: "#ffd9a0", to: "#e07a1f", speed: 0.95 },
  { top: "64%", w: 84, from: "#9ff4ff", to: "#1b8fb8", speed: 1.05 },
];

const groupHues = [190, 160, 320, 45, 270, 20];

function zoneOf(meters: number): string {
  if (meters < 200) return "Zona de luz";
  if (meters < 1000) return "Zona crepuscular";
  return "Zona de medianoche";
}

function Depth({ meters, zone }: { meters: number; zone: string }) {
  return (
    <p className="ab-depth" data-reveal>
      — {meters.toLocaleString("es-MX")} m · {zone}
    </p>
  );
}

function Thermocline({ label }: { label: string }) {
  const wave = "M0 20 Q 100 0 200 20 T400 20 T600 20 T800 20 T1000 20 T1200 20";
  return (
    <div aria-hidden="true" className="mx-auto max-w-5xl px-5">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="ab-thermo h-8 w-full" data-reveal>
        <defs>
          <linearGradient id="ab-thermo-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ee8ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7ee8ff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7ee8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={wave} />
        <path d={wave} transform="translate(0 8)" opacity="0.45" />
      </svg>
      <p className="-mt-1 text-center text-[0.6rem] tracking-[0.35em] text-cyan-100/55 uppercase">{label}</p>
    </div>
  );
}

function onCardMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
}

function onCardLeave(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--ry", "0deg");
  event.currentTarget.style.setProperty("--rx", "0deg");
}

export function WorldAbismo() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [gl, setGl] = useState<SceneStatus | "pending">("pending");
  const [menuOpen, setMenuOpen] = useState(false);
  const onStatus = useCallback((status: SceneStatus) => {
    setGl(status);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const close = () => {
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("lgasca:close-menu", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lgasca:close-menu", close);
    };
  }, [menuOpen]);

  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const gauge = element.querySelector<HTMLElement>("[data-gauge-dot]");
    const readouts = element.querySelectorAll<HTMLElement>("[data-gauge-text]");
    const zoneText = element.querySelector<HTMLElement>("[data-zone-text]");
    const dark = element.querySelector<HTMLElement>("[data-dark]");
    const header = element.querySelector<HTMLElement>("[data-header]");

    const onPointer = (event: globalThis.PointerEvent) => {
      element.style.setProperty("--fx", `${event.clientX}px`);
      element.style.setProperty("--fy", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

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
            const meters = Math.round((self.progress * maxDepth) / 10) * 10;
            if (gauge) gauge.style.top = `${self.progress * 100}%`;
            readouts.forEach((node) => {
              node.textContent = `${meters.toLocaleString("es-MX")} m`;
            });
            if (zoneText) zoneText.textContent = zoneOf(meters);
            element.style.setProperty("--p", self.progress.toFixed(3));
            if (header) header.dataset.solid = String(window.scrollY > 60);
          },
        },
      });

      if (reduced) {
        return;
      }
      setupCommonMotion(element);

      gsap.from("[data-hero-word]", { yPercent: 115, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.1 });
      gsap.from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.7 });

      gsap.utils.toArray<HTMLElement>("[data-school]", element).forEach((fish) => {
        const speed = Number(fish.dataset.school ?? "1");
        gsap.fromTo(
          fish,
          { x: "-30vw" },
          { x: `${130 * speed}vw`, ease: "none", scrollTrigger: { trigger: "#sobre-mi", start: "top 85%", end: "bottom top", scrub: 0.8 } },
        );
      });

      const words = gsap.utils.toArray<HTMLElement>("[data-word]", element);
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: "[data-about]", start: "top 80%", end: "bottom 45%", scrub: true } },
      );

      gsap.utils.toArray<HTMLElement>("[data-count]", element).forEach((node) => {
        const target = Number(node.dataset.count ?? "0");
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { value: 1 },
          onUpdate: () => {
            node.textContent = String(counter.value);
          },
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });

      gsap.fromTo(
        "[data-whale]",
        { x: "-60vw" },
        { x: "120vw", ease: "none", scrollTrigger: { trigger: "#experiencia", start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      gsap.fromTo(
        "[data-rov]",
        { y: 0 },
        {
          y: () => Math.max(0, (document.querySelector("[data-rov-track]")?.getBoundingClientRect().height ?? 0) - 120),
          ease: "none",
          scrollTrigger: { trigger: "[data-rov-track]", start: "top 65%", end: "bottom 65%", scrub: 0.6, invalidateOnRefresh: true },
        },
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
      window.removeEventListener("pointermove", onPointer);
      context.revert();
    };
  }, [reduced]);

  const aboutWords = site.about.split(" ");
  const nameWords = site.name.split(" ");
  const glOn = gl === "on";

  return (
    <div ref={root} className={`ab-root overflow-x-clip ${glOn ? "ab-gl" : ""}`}>
      <div className="ab-bg" aria-hidden="true" />
      <div className="ab-dark" data-dark aria-hidden="true" />
      {reduced ? null : <AbismoScene onStatus={onStatus} />}
      <div className="ab-flash" aria-hidden="true" />

      <div className="ab-gauge" aria-hidden="true">
        <span>PROF.</span>
        <div className="ab-gauge-track">
          <span className="ab-gauge-mark" style={{ top: `${(200 / maxDepth) * 100}%` }}>200 m</span>
          <span className="ab-gauge-mark" style={{ top: `${(1000 / maxDepth) * 100}%` }}>1,000 m</span>
          <span className="ab-gauge-dot" data-gauge-dot />
        </div>
        <span data-gauge-text className="tabular-nums">0 m</span>
        <span data-zone-text className="max-w-[5.5rem] text-center text-[0.55rem] leading-tight opacity-75">Zona de luz</span>
      </div>

      <header className="ab-header" data-header data-solid="false">
        <a href="#inicio" className="ab-display text-xl font-semibold tracking-tight">
          {site.brand}
        </a>
        <nav aria-label="Principal" className="hidden gap-6 text-sm font-medium text-cyan-50/90 md:flex">
          {navLinks.filter((link) => link.href !== "#educacion" && link.href !== "#sobre-mi").map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <span aria-hidden="true" className="rounded-full border border-cyan-200/30 bg-black/30 px-3 py-1 text-xs font-semibold tabular-nums">
            <span data-gauge-text>0 m</span>
          </span>
          <button type="button" className="ab-menu-btn" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="ab-menu" onClick={() => { setMenuOpen(true); }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 8h14M5 12h14M5 16h14" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div id="ab-menu" className="ab-menu" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" className="ab-menu-btn absolute top-3 right-5" aria-label="Cerrar menú" onClick={() => { setMenuOpen(false); }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => { setMenuOpen(false); }}
              className="ab-display flex items-baseline gap-4 border-b border-cyan-200/15 py-3 text-4xl font-light"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
          <Link href={cvUrl} className="mt-4 text-sm font-semibold text-cyan-200 underline underline-offset-4">Ver currículum</Link>
        </div>
      ) : null}

      <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5">
        <AmbientVideo
          name="abismo"
          className={`absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,#000_55%,transparent)] ${glOn ? "opacity-60 mix-blend-screen" : "opacity-90"}`}
        />
        <Waves className="absolute inset-x-0 top-0 z-0 h-20 opacity-80" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.5),transparent_55%)]" />
        {bubbles.map((bubble) => (
          <span
            key={`${bubble.left}-${bubble.size}`}
            aria-hidden="true"
            className="ab-bubble"
            style={{ left: bubble.left, width: bubble.size, height: bubble.size, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, "--dx": `${bubble.dx}px` } as CSSProperties}
          />
        ))}
        {iconBubbles.map((bubble, index) => (
          <span
            key={bubble.name}
            className={`ab-iconbubble ${index === 1 || index === 2 || index === 3 || index === 5 || index === 6 ? "max-sm:hidden" : ""}`}
            style={{ left: bubble.left, width: `${bubble.size}rem`, height: `${bubble.size}rem`, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s`, "--dx": `${bubble.dx}px` } as CSSProperties}
          >
            <TechIcon name={bubble.name} size={bubble.size * 0.62} />
          </span>
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
          <p className="mt-14 text-[0.7rem] tracking-[0.3em] text-white/75 uppercase" data-hero-fade>
            Desliza para descender
            <span aria-hidden="true" className="ab-bob mt-1 block text-xl leading-none">↓</span>
          </p>
        </div>
      </section>

      <section id="sobre-mi" className="relative px-5 py-28 sm:py-36">
        {glOn ? null : (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div data-school="0.7" className="absolute left-0" style={{ top: "80%" }}>
              <Turtle className="ab-bob w-28 opacity-90" />
            </div>
            {school.map((fish) => (
              <div key={fish.top} data-school={fish.speed} className="absolute left-0" style={{ top: fish.top }}>
                <Fish from={fish.from} to={fish.to} className="ab-bob opacity-90" style={{ width: fish.w }} />
              </div>
            ))}
          </div>
        )}
        <div className="relative mx-auto max-w-4xl">
          <Depth meters={40} zone={zoneOf(40)} />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-5xl">Sobre mí</h2>
          <p data-about className="ab-display mt-8 text-[1.75rem] leading-snug font-light text-balance sm:text-5xl sm:leading-[1.15]">
            {aboutWords.map((word, index) => (
              <span key={`${word}-${index}`} data-word className="inline-block pr-[0.28em]">
                {word}
              </span>
            ))}
          </p>
          <dl className="mt-16 grid grid-cols-3 gap-3 text-center sm:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} data-reveal className="ab-glass ab-sonar rounded-2xl px-2 py-6">
                <dt className="order-2 mt-1 text-[0.6rem] tracking-[0.16em] text-cyan-100/80 uppercase sm:text-xs">{stat.label}</dt>
                <dd className="ab-display text-4xl font-semibold text-cyan-100 tabular-nums sm:text-6xl" data-count={stat.value}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Thermocline label="200 m · límite de la luz solar" />

      <section id="desarrollos" className="relative px-5 py-24">
        <div data-parallax="2" aria-hidden="true" className="pointer-events-none absolute top-24 -left-4 hidden w-24 opacity-80 sm:block">
          <Jellyfish color="#ff7ee0" />
        </div>
        <div data-parallax="-1.5" aria-hidden="true" className="pointer-events-none absolute top-[40%] -right-3 hidden w-32 opacity-70 sm:block">
          <Jellyfish color="#7ee8ff" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Depth meters={180} zone={zoneOf(180)} />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Desarrollos</h2>
          <p className="mt-4 max-w-xl text-cyan-50/80">Lo que he construido, cada pieza detrás de su propia escotilla.</p>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <li key={project.name} data-reveal>
                <article className="ab-glass ab-card h-full rounded-3xl p-6 sm:p-8" onPointerMove={onCardMove} onPointerLeave={onCardLeave}>
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
                        <li key={tag} className="ab-chip">
                          <TechIcon name={tag} size={1.35} />
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {project.links !== undefined ? (
                    <ul className="mt-5 grid gap-2 text-sm" aria-label={`Sitios en línea de ${project.name}`}>
                      {project.links.map((link) => (
                        <li key={link.href} className="flex items-center gap-2.5">
                          <span className="ab-ping" aria-hidden="true" />
                          <ExternalLink href={link.href} className="font-semibold break-all text-emerald-200 underline underline-offset-4">
                            {link.label}
                          </ExternalLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Thermocline label="1,000 m · fin de la zona crepuscular" />

      <section id="experiencia" className="relative px-5 py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 overflow-hidden">
          <div data-whale className="w-[min(70vw,520px)] opacity-80">
            <Whale />
          </div>
        </div>
        <div data-parallax="-1.2" aria-hidden="true" className="pointer-events-none absolute right-2 bottom-16 w-24 opacity-90 sm:right-[6%] sm:w-32">
          <Octopus className="ab-bob" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Depth meters={520} zone={zoneOf(520)} />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Experiencia</h2>
          <div data-rov-track className="relative mt-12">
            <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.1rem] border-l border-dashed border-cyan-200/35 sm:left-[1.4rem]" />
            <div aria-hidden="true" data-rov className="absolute top-0 -left-[0.55rem] z-10 w-14 sm:left-0 sm:w-16">
              <Rov />
            </div>
            <ol className="grid gap-6 pl-12 sm:pl-24">
              {roles.map((role) => (
                <li key={role.organization} data-reveal>
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
        </div>
      </section>

      <section id="habilidades" className="relative px-5 py-28">
        <div aria-hidden="true" data-angler className="pointer-events-none absolute right-0 bottom-10 w-40 sm:w-72">
          <div data-parallax="1">
            <Angler />
          </div>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Depth meters={880} zone={`${zoneOf(880)} · bioluminiscencia`} />
          <h2 className="ab-display mt-4 text-4xl font-light tracking-tight sm:text-6xl">Habilidades</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {skillGroups.map((group, index) => (
              <div key={group.title} data-reveal>
                <h3 className="ab-display text-2xl font-semibold italic">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="ab-orb" style={{ "--h": groupHues[index % groupHues.length] } as CSSProperties}>
                      <TechIcon name={item} size={1.7} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="educacion" className="relative px-5 py-24">
        <div data-parallax="1.6" aria-hidden="true" className="pointer-events-none absolute top-16 right-3 w-16 opacity-90 sm:right-[8%] sm:w-24">
          <Seahorse className="ab-bob" />
        </div>
        <div className="mx-auto max-w-4xl">
          <Depth meters={1040} zone={zoneOf(1040)} />
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
                <a href={`mailto:${site.email}`} className="text-lg font-semibold break-all underline decoration-cyan-200/50 underline-offset-4">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="underline decoration-cyan-200/40 underline-offset-4">
                  {site.phone}
                </a>
              </li>
              <li>
                <ExternalLink href={site.githubUrl} className="inline-flex items-center gap-2 underline decoration-cyan-200/40 underline-offset-4">
                  <TechIcon name="GitHub" size={1.4} />
                  {site.githubLabel}
                </ExternalLink>
              </li>
              <li>
                <Link href={cvUrl} className="underline decoration-cyan-200/40 underline-offset-4">
                  Currículum
                </Link>
              </li>
              <li className="text-cyan-100/70">{site.location}</li>
              <li className="pt-2">
                <a href="#inicio" className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-200/40 px-4 text-sm font-semibold text-cyan-100">
                  <span aria-hidden="true">↑</span> Volver a la superficie
                </a>
              </li>
            </ul>
            <div className="ab-glass rounded-3xl p-6 sm:p-8">
              <ContactForm classes={formClasses} submitLabel="Enviar mensaje" />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56">
          {glOn ? null : (
            <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="ab-sand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1d3a4a" />
                  <stop offset="1" stopColor="#050d14" />
                </linearGradient>
              </defs>
              <path d="M0 120 C200 80 380 150 600 110 C820 70 1050 140 1250 100 C1340 84 1400 96 1440 110 L1440 220 L0 220Z" fill="url(#ab-sand)" />
            </svg>
          )}
          <Seaweed hue={155} className="absolute bottom-6 left-[1%] w-14 sm:w-20" />
          <Coral color="#ff6bd6" className="absolute bottom-10 left-[11%] w-16 sm:w-24" />
          <Starfish className="ab-bob absolute bottom-4 left-[22%] w-9 sm:w-12" color="#ff8f5a" />
          <Seaweed hue={140} className="absolute bottom-8 left-[27%] w-12 sm:w-16" />
          <Crab className="absolute bottom-3 left-[40%] w-14 sm:w-20" />
          <Coral color="#ff9d5c" className="absolute bottom-6 left-[52%] w-12 sm:w-16" />
          <Starfish className="ab-bob absolute right-[34%] bottom-3 w-8 sm:w-11" color="#ff6bb0" />
          <Seaweed hue={165} className="absolute right-[24%] bottom-8 w-14 sm:w-20" />
          <Coral color="#5dffc9" className="absolute right-[16%] bottom-8 w-14 sm:w-20" />
          <Seaweed hue={150} className="absolute right-[7%] bottom-6 w-12 sm:w-16" />
          <Coral color="#c18bff" className="absolute right-[0%] bottom-6 w-16 sm:w-24" />
        </div>
      </section>

      <p className="relative pb-24 text-center text-xs text-cyan-100/60">© 2026 {site.name}</p>
    </div>
  );
}
