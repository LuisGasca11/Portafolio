"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useT } from "@/components/shared/locale-provider";
import { endonymOf, otherLocale, pathFor, stripLocale } from "@/lib/i18n";

/**
 * Cambia a la misma página en el otro idioma. Muestra el nombre del idioma
 * en sí mismo (no una bandera). La URL manda: no hay redirección automática.
 * Cambia al instante: no usa la transición de burbujas, que es para recorrer secciones.
 */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname();
  const target = otherLocale(locale);
  const name = endonymOf(target);

  return (
    <Link
      href={pathFor(target, stripLocale(pathname))}
      data-no-transition=""
      hrefLang={target}
      lang={target}
      className={className}
      aria-label={t("common.switchLanguage", { language: name })}
    >
      {name}
    </Link>
  );
}
