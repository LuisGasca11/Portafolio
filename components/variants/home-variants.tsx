"use client";

import { useSyncExternalStore } from "react";
import { V1Factura } from "@/components/variants/v1-factura";
import { V2Metro } from "@/components/variants/v2-metro";
import { V3Ticket } from "@/components/variants/v3-ticket";
import { V4Editor } from "@/components/variants/v4-editor";

const variants = [
  { id: "v1", label: "Factura", background: "#e9e6dd", Component: V1Factura },
  { id: "v2", label: "Metro", background: "#f4efe4", Component: V2Metro },
  { id: "v3", label: "Ticket", background: "#3a3a3c", Component: V3Ticket },
  { id: "v4", label: "Editor", background: "#1e1e1e", Component: V4Editor },
] as const;

type VariantId = (typeof variants)[number]["id"];

const defaultVariant: VariantId = "v1";
const storageKey = "lgasca:variante";
const changeEvent = "lgasca:variante-cambio";

function isVariantId(value: string | null): value is VariantId {
  return variants.some((variant) => variant.id === value);
}

function readVariant(): VariantId {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("v");
    if (isVariantId(fromUrl)) {
      return fromUrl;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (isVariantId(stored)) {
      return stored;
    }
  } catch {
    // Sin acceso a la URL o al almacenamiento: se usa la versión por defecto.
  }
  return defaultVariant;
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

function chooseVariant(id: VariantId) {
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

export function HomeVariants() {
  const current = useSyncExternalStore(subscribe, readVariant, () => defaultVariant);
  const active = variants.find((variant) => variant.id === current) ?? variants[0];
  const Active = active.Component;

  return (
    <div style={{ backgroundColor: active.background }}>
      <main id="contenido" className="pb-24">
        <Active />
      </main>
      <nav
        aria-label="Cambiar versión del portafolio"
        className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-black/85 p-1 shadow-2xl backdrop-blur">
          <span className="hidden pr-1 pl-3 text-[0.65rem] font-semibold tracking-[0.2em] text-white/60 uppercase sm:inline">
            Versión
          </span>
          {variants.map((variant) => {
            const selected = variant.id === active.id;
            return (
              <button
                key={variant.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  chooseVariant(variant.id);
                }}
                className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
                  selected ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="font-mono text-xs uppercase">{variant.id}</span>
                <span className="hidden min-[420px]:inline">{variant.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
