"use client";

import { Children, Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { flightScenes } from "@/lib/scroll-world";
import type { FlightScene } from "@/lib/scroll-world";

/**
 * Vuelo scrubbeado de la portada (scroll world).
 *
 * Adaptación a React del motor vanilla de oso95/scroll-world: la cámara vuela
 * por 6 escenas (un clip de inmersión por sección) y el scroll solo mueve el
 * tiempo. Los empalmes entre escenas son crossfades directos, sin clips
 * conectores. Cada escena tiene un dwell (el vuelo) y después su panel de
 * contenido, que sube como una cortina sobre el escenario fijo.
 *
 * - Los clips se cargan como Blob (siempre seekables) y con lazy load.
 * - En móvil y con prefers-reduced-motion no se carga la cadena de video:
 *   se sirven los stills con cross-dissolve.
 * - El scroll se suaviza con rAF (lerp) y las búsquedas se coalescen.
 */

const CROSSFADE = 0.12; // ancho del crossfade en cada empalme, en altos de viewport
const LERP = 0.18;
const SEEK_EPS = 0.008;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};
/** La cámara se asienta a mitad de escena (donde el copy llega) y se mueve
 * más rápido cerca de los empalmes. f(0)=0 y f(1)=1 siempre. */
const lingerEase = (x: number, l: number) => {
  const c = x - 0.5;
  return (1 - l) * x + l * (4 * c * c * c + 0.5);
};
const pad = (n: number) => String(n).padStart(2, "0");

type Seg = {
  scene: FlightScene;
  el: HTMLDivElement | null;
  img: HTMLImageElement | null;
  video: HTMLVideoElement | null;
  hasClip: boolean;
  loading: boolean;
  ready: boolean;
  cur: number;
  target: number;
  visible: boolean;
  start: number;
  end: number;
};

export function ScrollWorld({ children }: { children: ReactNode }) {
  const panels = Children.toArray(children).slice(0, flightScenes.length);
  const journeyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dwellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const journey = journeyRef.current;
    const stage = stageRef.current;
    if (!journey || !stage) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const smallMQ = window.matchMedia("(max-width: 860px)");
    const isMobile = () => coarse || smallMQ.matches;
    // Sin cadena de video en móvil ni con movimiento reducido: stills.
    const stillsOnly = () => reduce || isMobile();

    const journeyEl = journey;
    const stageEl = stage;

    const segs: Seg[] = flightScenes.map((scene) => ({
      scene,
      el: null,
      img: null,
      video: null,
      hasClip: false,
      loading: false,
      ready: false,
      cur: 0,
      target: 0,
      visible: false,
      start: 0,
      end: 0,
    }));
    let rafId = 0;
    let ticking = false;
    let activeIndex = -1;
    let journeyH = 0;
    let laidOutW = window.innerWidth;
    let destroyed = false;

    function loadClip(s: Seg) {
      if (stillsOnly() || s.loading || !s.scene.clip || !s.el) {
        return;
      }
      s.loading = true;
      const url = s.scene.clip;
      fetch(url)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("404"))))
        .then((blob) => {
          if (destroyed || !s.el) {
            return;
          }
          const v = document.createElement("video");
          v.className = "sw-scene__video";
          v.muted = true;
          v.playsInline = true;
          v.preload = "auto";
          v.setAttribute("muted", "");
          v.setAttribute("playsinline", "");
          v.setAttribute("aria-hidden", "true");
          v.src = URL.createObjectURL(blob);
          v.addEventListener("loadedmetadata", () => {
            s.ready = true;
            read();
          });
          // Mostrar el video solo cuando un frame real haya pintado.
          v.addEventListener(
            "seeked",
            () => {
              s.el?.classList.add("has-clip");
            },
            { once: true },
          );
          v.addEventListener("loadeddata", () => {
            try {
              v.pause();
            } catch {
              /* noop */
            }
          });
          s.el.appendChild(v);
          s.video = v;
          s.hasClip = true;
        })
        .catch(() => {
          s.loading = false;
        });
    }

    function layout() {
      const stageH = stageEl.getBoundingClientRect().height;
      const journeyTop = journeyEl.getBoundingClientRect().top + window.scrollY;
      const shift = journeyTop + stageH;
      segs.forEach((s, i) => {
        const dwell = dwellRefs.current[i];
        if (!dwell) {
          return;
        }
        const rect = dwell.getBoundingClientRect();
        s.start = rect.top + window.scrollY - shift;
        s.end = s.start + rect.height;
      });
      journeyH = journeyEl.offsetHeight;
      laidOutW = window.innerWidth;
      read();
    }

    function read() {
      const y = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;
      const fade = CROSSFADE * vh;
      let ci = 0;
      for (let i = 0; i < segs.length; i++) {
        if (y >= segs[i].start) {
          ci = i;
        }
      }

      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        if (y > s.start - 1.6 * vh && y < s.end + 1.6 * vh) {
          loadClip(s);
        }
        const local = clamp((y - s.start) / Math.max(s.end - s.start, 1), 0, 1);
        s.target = s.scene.linger ? lingerEase(local, s.scene.linger) : local;
        let outside = 0;
        if (y < s.start) {
          outside = s.start - y;
        } else if (y > s.end) {
          outside = y - s.end;
        }
        const op = smooth(1 - outside / fade);
        if (s.el) {
          s.el.style.opacity = String(op);
          s.el.style.zIndex = i === ci ? "120" : String(100 + Math.round(op * 10));
        }
        s.visible = op > 0.001;
        if (s.img && (!s.hasClip || !s.ready)) {
          const sc = reduce ? 1 : 1.03 + local * 0.14;
          s.img.style.transform = `translateX(-2vw) scale(${sc.toFixed(3)})`;
        }
      }

      for (let i = 0; i < flightScenes.length; i++) {
        const seg = segs[i];
        const pr = clamp((y - seg.start) / Math.max(seg.end - seg.start, 1), 0, 1);
        const before = y < seg.start;
        const after = y > seg.end;
        let cop: number;
        if (i === 0) {
          cop = after ? 0 : smooth(1 - pr / 0.62);
        } else if (i === flightScenes.length - 1) {
          cop = before ? 0 : smooth(pr / 0.4);
        } else {
          cop = before || after ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
        }
        const c = copyRefs.current[i];
        if (c) {
          c.style.opacity = String(cop);
          c.style.transform = reduce ? "none" : `translateY(${((0.5 - pr) * 4).toFixed(2)}vh)`;
          c.style.pointerEvents = cop > 0.5 ? "auto" : "none";
        }
      }

      const near = clamp(ci, 0, flightScenes.length - 1);
      if (near !== activeIndex) {
        activeIndex = near;
        dotRefs.current.forEach((d, k) => d?.classList.toggle("is-active", k === near));
        journeyEl.style.setProperty("--sw-accent", flightScenes[near].accent);
      }
      if (progressRef.current) {
        const total = Math.max(journeyH - stageEl.getBoundingClientRect().height, 1);
        progressRef.current.style.transform = `scaleX(${clamp(y / total)})`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp(1 - y / (0.5 * vh)));
      }
      ticking = false;
    }

    function raf() {
      if (destroyed) {
        return;
      }
      if (!stillsOnly()) {
        for (let i = 0; i < segs.length; i++) {
          const s = segs[i];
          if (!s.hasClip || !s.ready || !s.video) {
            continue;
          }
          // Nunca encolar una búsqueda mientras el decodificador sigue
          // resolviendo la anterior.
          if (s.video.seeking) {
            continue;
          }
          if (!s.visible && Math.abs(s.cur - s.target) < 0.002) {
            continue;
          }
          s.cur += (s.target - s.cur) * LERP;
          const dur = s.video.duration || 1;
          const t = clamp(s.cur, 0, 0.999) * dur;
          if (Math.abs(s.video.currentTime - t) > SEEK_EPS) {
            try {
              s.video.currentTime = t;
            } catch {
              /* noop */
            }
          }
        }
      }
      rafId = requestAnimationFrame(raf);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(read);
      }
    }

    function onResize() {
      // En táctil, ignorar los cambios de alto (la barra de URL sube y baja)
      // y solo recalcular cuando cambia el ancho (rotación).
      if (coarse && window.innerWidth === laidOutW) {
        return;
      }
      layout();
    }

    // Vincular los nodos del DOM a los segmentos.
    segs.forEach((s, i) => {
      s.el = sceneRefs.current[i] ?? null;
      s.img = imgRefs.current[i] ?? null;
    });

    const observer = new ResizeObserver(layout);
    observer.observe(journeyEl);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", layout);
    document.fonts?.ready.then(layout).catch(() => undefined);
    layout();
    rafId = requestAnimationFrame(raf);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", layout);
      segs.forEach((s) => {
        if (s.video) {
          URL.revokeObjectURL(s.video.src);
          s.video.remove();
          s.video = null;
        }
      });
    };
  }, []);

  return (
    <div
      ref={journeyRef}
      className="sw-journey"
      style={{ "--sw-accent": flightScenes[0].accent } as CSSProperties}
    >
      <div ref={stageRef} className="sw-stage">
        <div className="sw-scrollbar" aria-hidden="true">
          <span ref={progressRef} />
        </div>
        {flightScenes.map((scene, i) => (
          <div
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="sw-scene"
            style={{ "--sw-accent": scene.accent } as CSSProperties}
          >
            <img
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              src={scene.still}
              alt=""
              aria-hidden="true"
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              className="sw-scene__still"
            />
          </div>
        ))}
        <div className="sw-copylayer">
          {flightScenes.map((scene, i) => {
            const TitleTag = i === 0 ? "h1" : "h2";
            const title = scene.titleAccent
              ? scene.title.slice(0, -scene.titleAccent.length)
              : scene.title;
            return (
              <article
                key={scene.id}
                ref={(el) => {
                  copyRefs.current[i] = el;
                }}
                className="sw-copy"
                style={{ "--sw-accent": scene.accent } as CSSProperties}
              >
                <span className="sw-copy__num">
                  {pad(i + 1)} / {pad(flightScenes.length)}
                </span>
                <span className="sw-copy__eyebrow">{scene.eyebrow}</span>
                <TitleTag className="sw-copy__title">
                  {title}
                  {scene.titleAccent ? (
                    <span className="sw-copy__title-accent">{scene.titleAccent}</span>
                  ) : null}
                </TitleTag>
                <p className="sw-copy__body">{scene.body}</p>
                {scene.tags.length > 0 ? (
                  <ul className="sw-copy__tags">
                    {scene.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
                {scene.cta ? (
                  <div className="sw-copy__cta">
                    <a className="sw-btn sw-btn--primary" href={scene.cta.primary.href}>
                      {scene.cta.primary.label}
                    </a>
                    {scene.cta.secondary ? (
                      <a className="sw-btn sw-btn--ghost" href={scene.cta.secondary.href}>
                        {scene.cta.secondary.label}
                      </a>
                    ) : null}
                  </div>
                ) : null}
                {scene.links ? (
                  <ul className="sw-copy__links">
                    {scene.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
        <nav className="sw-route" aria-label="Escenas del recorrido">
          {flightScenes.map((scene, i) => (
            <a
              key={scene.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              href={`#escena-${scene.id}`}
              className="sw-route__dot"
              style={{ "--sw-accent": scene.accent } as CSSProperties}
              aria-label={scene.label}
            >
              <span className="sw-route__label">{scene.label}</span>
              <i aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div ref={hintRef} className="sw-hint">
          <span>Desliza para recorrer el mundo</span>
          <i aria-hidden="true" />
        </div>
      </div>
      {panels.map((panel, i) => (
        <Fragment key={flightScenes[i].id}>
          <div
            ref={(el) => {
              dwellRefs.current[i] = el;
            }}
            id={`escena-${flightScenes[i].id}`}
            className="sw-dwell"
            style={{ height: `${flightScenes[i].dwell * 100}vh` }}
            aria-hidden="true"
          />
          <div className="sw-panel">{panel}</div>
        </Fragment>
      ))}
    </div>
  );
}
