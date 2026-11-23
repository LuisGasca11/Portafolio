import en from "./locales/en.json";
import es from "./locales/es.json";
import { defaultLocale, locales } from "./config";
import type { Locale } from "./config";

/** Forma de un paquete: la fija el idioma fuente; el otro debe cumplirla o no compila. */
export type Messages = typeof es;

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

/** Claves con puntos de todos los textos (`projects.items.lms.name`). */
export type MessageKey = Paths<Messages>;

const packs: Record<Locale, Messages> = { es, en };

// Lo mismo que comprueba la verificación de CI, pero también al arrancar.
if (locales.join() !== Object.keys(packs).join()) {
  throw new Error("lib/i18n/registry.json y los paquetes de traducción no coinciden");
}

type Args = Record<string, string | number>;

function lookup(locale: Locale, key: string): string | undefined {
  let node: unknown = packs[locale];
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

function fill(text: string, args?: Args): string {
  if (!args) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in args ? String(args[name]) : match));
}

/**
 * Único punto de búsqueda de textos. Un texto que falta es un error al
 * compilar o renderizar en el servidor (el build falla). En el navegador, y
 * solo como último recurso, cae al idioma fuente y lo reporta.
 */
export function translate(locale: Locale, key: MessageKey, args?: Args): string {
  const found = lookup(locale, key);
  if (found !== undefined) return fill(found, args);
  if (typeof window === "undefined") {
    throw new Error(`Falta el texto «${key}» en el idioma ${locale}`);
  }
  console.error(`i18n: falta «${key}» en ${locale}`);
  return fill(lookup(defaultLocale, key) ?? key, args);
}

export type Translate = (key: MessageKey, args?: Args) => string;

export function createT(locale: Locale): Translate {
  return (key, args) => translate(locale, key, args);
}

/** Mes y año con el formateador del idioma (`nov 2025`). */
export function formatMonth(tag: string, value: string): string {
  const [year, month] = value.split("-");
  if (month === undefined) return value;
  const text = new Intl.DateTimeFormat(tag, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
  );
  const clean = text.replace(/\./g, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
