import registry from "./registry.json";

/** Códigos de idioma. Deben coincidir con `registry.json` (se comprueba al cargar y en CI). */
export type Locale = "es" | "en";

type RegistryEntry = {
  code: string;
  tag: string;
  og: string;
  endonym: string;
  dir: "ltr" | "rtl";
};

const entries = registry.locales as readonly RegistryEntry[];

export const defaultLocale = registry.source as Locale;
export const locales: readonly Locale[] = entries.map((entry) => entry.code as Locale);

export function isLocale(value: string): value is Locale {
  return entries.some((entry) => entry.code === value);
}

function entryOf(locale: Locale): RegistryEntry {
  const entry = entries.find((item) => item.code === locale);
  if (!entry) {
    throw new Error(`Idioma sin registrar: ${locale}`);
  }
  return entry;
}

/** Etiqueta BCP 47 (`es-MX`): para `<html lang>`, `Intl` y `hreflang`. */
export const tagOf = (locale: Locale) => entryOf(locale).tag;
/** Formato de Open Graph (`es_MX`). */
export const ogOf = (locale: Locale) => entryOf(locale).og;
/** Nombre del idioma en sí mismo: es lo que muestra el selector. */
export const endonymOf = (locale: Locale) => entryOf(locale).endonym;
export const dirOf = (locale: Locale) => entryOf(locale).dir;

/** El otro idioma (el sitio tiene dos). */
export function otherLocale(locale: Locale): Locale {
  return locales.find((item) => item !== locale) ?? locale;
}

/**
 * Ruta de una página en un idioma. El idioma por defecto vive en la raíz
 * (`/`, `/curriculum`) y los demás bajo su código (`/en`, `/en/curriculum`).
 */
export function pathFor(locale: Locale, path: string): string {
  const clean = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean;
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Quita el prefijo de idioma de una ruta: `/en/curriculum` → `/curriculum`. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Idioma de una ruta según su prefijo. */
export function localeOfPath(pathname: string): Locale {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
  }
  return defaultLocale;
}
