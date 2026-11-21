"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Angler, Fish, Jellyfish, Manta, Octopus, Seahorse, Shark, Turtle, Whale } from "@/components/abismo/art/creatures";
import { getLenis } from "@/components/shared/smooth-scroll";

type Phase = "idle" | "in" | "out";

/** Alto en px del borde de olas que sobresale del agua. */
const WAVE = 160;

/** Burbujas determinísticas (sin Math.random) para que el render sea puro. */
const bubbles = Array.from({ length: 58 }, (_, index) => ({
  left: (index * 37 + 5) % 100,
  size: 16 + ((index * 53) % 170),
  delay: ((index * 17) % 70) / 100,
  duration: 1.1 + ((index * 29) % 14) / 10,
  drift: ((index % 2 === 0 ? 1 : -1) * (10 + ((index * 13) % 50))),
}));

type Animal = {
  key: string;
  node: ReactNode;
  width: number;
  /** Hacia dónde mira el dibujo original: 1 derecha, -1 izquierda. */
  face: 1 | -1;
  mode: "h" | "v";
  /** `top` en % (modo h) o `left` en % (modo v). */
  at: number;
  delay: number;
  duration: number;
};

const animals: Animal[] = [
  { key: "shark", node: <Shark />, width: 380, face: -1, mode: "h", at: 12, delay: 0.05, duration: 3.2 },
  { key: "whale", node: <Whale />, width: 470, face: -1, mode: "h", at: 56, delay: 0.45, duration: 3.8 },
  { key: "manta", node: <Manta />, width: 300, face: 1, mode: "h", at: 33, delay: 0.2, duration: 3.1 },
  { key: "turtle", node: <Turtle />, width: 200, face: -1, mode: "h", at: 74, delay: 0.7, duration: 3.4 },
  { key: "angler", node: <Angler />, width: 190, face: -1, mode: "h", at: 86, delay: 0.3, duration: 3.0 },
  { key: "fish1", node: <Fish from="#9ff4ff" to="#1b8fb8" />, width: 110, face: 1, mode: "h", at: 6, delay: 0.1, duration: 2.1 },
  { key: "fish2", node: <Fish from="#b8fff0" to="#14a58a" />, width: 84, face: 1, mode: "h", at: 21, delay: 0.55, duration: 2.4 },
  { key: "fish3", node: <Fish from="#ffd9a0" to="#e07a1f" />, width: 100, face: 1, mode: "h", at: 44, delay: 0.25, duration: 2.2 },
  { key: "fish4", node: <Fish from="#9ff4ff" to="#1b8fb8" />, width: 72, face: 1, mode: "h", at: 50, delay: 0.8, duration: 2.6 },
  { key: "fish5", node: <Fish from="#ffd9a0" to="#e07a1f" />, width: 92, face: 1, mode: "h", at: 66, delay: 0.15, duration: 2.3 },
  { key: "fish6", node: <Fish from="#b8fff0" to="#14a58a" />, width: 120, face: 1, mode: "h", at: 91, delay: 0.6, duration: 2.5 },
  { key: "fish7", node: <Fish from="#ffb0d6" to="#c2347f" />, width: 64, face: 1, mode: "h", at: 28, delay: 0.95, duration: 2.0 },
  { key: "jelly1", node: <Jellyfish color="#ff7ee0" />, width: 100, face: 1, mode: "v", at: 8, delay: 0.1, duration: 2.8 },
  { key: "jelly2", node: <Jellyfish color="#7ee8ff" />, width: 130, face: 1, mode: "v", at: 36, delay: 0.4, duration: 3.0 },
  { key: "jelly3", node: <Jellyfish color="#b28bff" />, width: 90, face: 1, mode: "v", at: 74, delay: 0.7, duration: 2.7 },
  { key: "octopus", node: <Octopus />, width: 130, face: 1, mode: "v", at: 54, delay: 0.3, duration: 3.1 },
  { key: "seahorse", node: <Seahorse />, width: 70, face: 1, mode: "v", at: 90, delay: 0.55, duration: 2.9 },
];

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path) || "/";

function jumpTo(element: HTMLElement) {
  const top = element.getBoundingClientRect().top + window.scrollY - 70;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(Math.max(0, top), { immediate: true, force: true });
  } else {
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }
}

function Overlay({ phase, onCovered, onDone }: { phase: Exclude<Phase, "idle">; onCovered: () => void; onDone: () => void }) {
  const direction = phase === "in" ? 1 : -1;
  const wave = "M0 80 Q 90 20 180 80 T360 80 T540 80 T720 80 T900 80 T1080 80 T1260 80 T1440 80 T1620 80 T1800 80 T1980 80 T2160 80 T2340 80 T2520 80 T2700 80 T2880 80 V160 H0Z";
  return (
    <motion.div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div
        className="absolute inset-x-0"
        style={{ height: `calc(100% + ${WAVE}px)`, top: -WAVE, willChange: "transform" }}
        initial={{ y: "100%" }}
        animate={{ y: phase === "in" ? "0%" : "-100%" }}
        transition={{ duration: 1, ease: [0.7, 0, 0.3, 1], delay: phase === "out" ? 0.1 : 0 }}
        onAnimationComplete={() => {
          if (phase === "in") {
            onCovered();
          } else {
            onDone();
          }
        }}
      >
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: WAVE }}>
          <motion.svg
            viewBox="0 0 2880 160"
            width={2880}
            height={WAVE}
            className="max-w-none"
            animate={{ x: [0, -1440] }}
            transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
          >
            <path d={wave} fill="#46d3e6" />
            <path d={wave} fill="#8ff0ff" opacity="0.5" transform="translate(180 14)" />
          </motion.svg>
        </div>
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            top: WAVE - 2,
            background: "linear-gradient(180deg,#46d3e6 0%,#0f8cb6 22%,#06496f 58%,#031c30 100%)",
          }}
        />
      </motion.div>

      <div key={`bubbles-${phase}`} className="pointer-events-none absolute inset-0">
        {bubbles.map((bubble) => (
          <motion.span
            key={`${bubble.left}-${bubble.size}`}
            className="absolute rounded-full border-2 border-white/60"
            style={{
              left: `${bubble.left}%`,
              top: "100%",
              width: bubble.size,
              height: bubble.size,
              background: "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.65), rgba(255,255,255,0.08) 62%)",
              boxShadow: "inset 0 0 18px rgba(255,255,255,0.25)",
            }}
            initial={{ y: 0, x: 0, opacity: 0, scale: 0.5 }}
            animate={{ y: "-135vh", x: bubble.drift, opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 1.15] }}
            transition={{ duration: bubble.duration, delay: bubble.delay * (phase === "out" ? 0.6 : 1), ease: "easeIn" }}
          />
        ))}
      </div>

      <div key={`animals-${phase}`} className="pointer-events-none absolute inset-0">
        {animals.map((animal) => {
          const flip = animal.mode === "h" && animal.face !== direction;
          return animal.mode === "h" ? (
            <motion.div
              key={animal.key}
              className="absolute left-0"
              style={{ top: `${animal.at}%`, width: animal.width, maxWidth: "70vw" }}
              initial={{ x: direction === 1 ? "-45vw" : "135vw" }}
              animate={{ x: direction === 1 ? "135vw" : "-45vw" }}
              transition={{ duration: animal.duration, delay: animal.delay, ease: "linear" }}
            >
              <motion.div
                animate={{ y: [0, -14, 0, 10, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: flip ? "scaleX(-1)" : undefined }}
              >
                {animal.node}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={animal.key}
              className="absolute top-0"
              style={{ left: `${animal.at}%`, width: animal.width, maxWidth: "36vw" }}
              initial={{ y: "112vh" }}
              animate={{ y: "-40vh" }}
              transition={{ duration: animal.duration, delay: animal.delay, ease: "easeInOut" }}
            >
              <motion.div animate={{ x: [0, 18, 0, -18, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {animal.node}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * Transición de vista: una ola de agua con burbujas y animales marinos cubre
 * la pantalla, cambia de página (o salta a una sección lejana) y se retira.
 * Intercepta los enlaces internos; con «reducir movimiento» no hace nada.
 */
export function BubbleTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const action = useRef<(() => void | Promise<void>) | null>(null);
  const waiter = useRef<{ target: string; resolve: () => void } | null>(null);

  const change = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  useEffect(() => {
    const current = waiter.current;
    if (current && normalize(pathname) === current.target) {
      waiter.current = null;
      window.setTimeout(current.resolve, 250);
    }
  }, [pathname]);

  const onCovered = useCallback(() => {
    const run = action.current;
    action.current = null;
    void Promise.resolve(run?.()).then(() => {
      change("out");
    });
  }, [change]);

  const onDone = useCallback(() => {
    change("idle");
  }, [change]);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const start = (run: () => void | Promise<void>) => {
      if (phaseRef.current !== "idle") {
        return;
      }
      action.current = run;
      window.dispatchEvent(new Event("lgasca:close-menu"));
      change("in");
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || (anchor.target !== "" && anchor.target !== "_self") || anchor.hasAttribute("download")) {
        return;
      }
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      const samePage = normalize(url.pathname) === normalize(window.location.pathname);
      if (samePage) {
        const element = url.hash.length > 1 ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        if (!element || Math.abs(element.getBoundingClientRect().top) < window.innerHeight * 1.1) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        start(() => {
          jumpTo(element);
        });
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      start(
        () =>
          new Promise<void>((resolve) => {
            waiter.current = { target: normalize(url.pathname), resolve };
            router.push(`${url.pathname}${url.search}${url.hash}`);
            window.setTimeout(resolve, 4000);
          }),
      );
    };

    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
    };
  }, [reduced, router, change]);

  return (
    <>
      {children}
      <AnimatePresence>{phase === "idle" ? null : <Overlay key="overlay" phase={phase} onCovered={onCovered} onDone={onDone} />}</AnimatePresence>
    </>
  );
}
