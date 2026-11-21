"use client";

import { useSyncExternalStore } from "react";
import { SmoothScroll } from "@/components/smooth-scroll";
import { WorldAbismo } from "@/components/worlds/world-abismo";
import { WorldJardin } from "@/components/worlds/world-jardin";
import { WorldPapel } from "@/components/worlds/world-papel";

const worlds = [
  { id: "m1", label: "Abismo", background: "#042a45", Component: WorldAbismo },
  { id: "m2", label: "Papel", background: "#150633", Component: WorldPapel },
  { id: "m3", label: "Jardín", background: "#2a1a0c", Component: WorldJardin },
] as const;

type WorldId = (typeof worlds)[number]["id"];

const defaultWorld: WorldId = "m1";
const storageKey = "lgasca:mundo";
const changeEvent = "lgasca:mundo-cambio";

function isWorldId(value: string | null): value is WorldId {
  return worlds.some((world) => world.id === value);
}

function readWorld(): WorldId {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("v");
    if (isWorldId(fromUrl)) {
      return fromUrl;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (isWorldId(stored)) {
      return stored;
    }
  } catch {
    // Sin acceso a la URL o al almacenamiento: se usa el mundo por defecto.
  }
  return defaultWorld;
}

function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function chooseWorld(id: WorldId) {
  try {
    window.localStorage.setItem(storageKey, id);
  } catch {
    // El almacenamiento puede estar bloqueado; la URL sigue guardando la elección.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("v", id);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(changeEvent));
  window.scrollTo({ top: 0 });
}

export function HomeWorlds() {
  const current = useSyncExternalStore(subscribe, readWorld, () => defaultWorld);
  const active = worlds.find((world) => world.id === current) ?? worlds[0];
  const Active = active.Component;

  return (
    <SmoothScroll>
      <div style={{ backgroundColor: active.background }}>
        <main id="contenido">
          <Active key={active.id} />
        </main>
        <nav
          aria-label="Cambiar de mundo"
          className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-black/80 p-1 shadow-2xl backdrop-blur">
            <span className="hidden pr-1 pl-3 text-[0.65rem] font-semibold tracking-[0.2em] text-white/60 uppercase sm:inline">
              Mundo
            </span>
            {worlds.map((world) => {
              const selected = world.id === active.id;
              return (
                <button
                  key={world.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    chooseWorld(world.id);
                  }}
                  className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
                    selected ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="font-mono text-xs uppercase">{world.id}</span>
                  <span className="hidden min-[420px]:inline">{world.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </SmoothScroll>
  );
}
