"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { getContent } from "@/lib/content";
import type { Content } from "@/lib/content";
import { createT } from "@/lib/i18n";
import type { Locale, Translate } from "@/lib/i18n";

const LocaleContext = createContext<Locale | null>(null);

/** Idioma de la página para los componentes de cliente. Los de servidor reciben `locale` por props. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  if (locale === null) {
    throw new Error("useLocale necesita un <LocaleProvider>");
  }
  return locale;
}

export function useT(): Translate {
  const locale = useLocale();
  return useMemo(() => createT(locale), [locale]);
}

export function useContent(): Content {
  const locale = useLocale();
  return useMemo(() => getContent(locale), [locale]);
}
