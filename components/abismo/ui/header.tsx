"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/shared/language-switch";
import { useContent, useLocale, useT } from "@/components/shared/locale-provider";
import { cvPath, identity } from "@/lib/content";
import { pathFor } from "@/lib/i18n";

/**
 * Encabezado fijo: marca y navegación en escritorio; en móvil, la
 * profundidad actual y un botón en forma de escotilla que abre el menú.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const locale = useLocale();
  const { navItems } = useContent();
  const desktopLinks = navItems.filter((link) => link.href !== "#sobre-mi" && link.href !== "#educacion");

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = () => {
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("lgasca:close-menu", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lgasca:close-menu", close);
    };
  }, [open]);

  return (
    <>
      <header className="ab-header" data-header data-solid="false">
        <a href="#inicio" className="ab-display text-xl font-semibold tracking-tight">
          {identity.brand}
        </a>
        <nav aria-label={t("common.mainNav")} className="hidden gap-6 text-sm font-medium text-cyan-50/90 md:flex">
          {desktopLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
          <LanguageSwitch className="rounded-full border border-cyan-200/30 px-3 py-0.5 text-xs font-semibold hover:border-cyan-200" />
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <span aria-hidden="true" className="rounded-full border border-cyan-200/30 bg-black/30 px-3 py-1 text-xs font-semibold tabular-nums">
            <span data-gauge-text>0 m</span>
          </span>
          <button
            type="button"
            className="ab-menu-btn"
            aria-label={t("common.openMenu")}
            aria-expanded={open}
            aria-controls="ab-menu"
            onClick={() => {
              setOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 8h14M5 12h14M5 16h14" />
            </svg>
          </button>
        </div>
      </header>

      {open ? (
        <div id="ab-menu" className="ab-menu" role="dialog" aria-modal="true" aria-label={t("common.menu")}>
          <button
            type="button"
            className="ab-menu-btn absolute top-3 right-5"
            aria-label={t("common.closeMenu")}
            onClick={() => {
              setOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {navItems.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setOpen(false);
              }}
              className="ab-display flex items-baseline gap-4 border-b border-cyan-200/15 py-3 text-4xl font-light"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
          <Link href={pathFor(locale, cvPath)} className="mt-4 text-sm font-semibold text-cyan-200 underline underline-offset-4">
            {t("common.viewCv")}
          </Link>
          <LanguageSwitch className="mt-5 inline-flex w-fit rounded-full border border-cyan-200/40 px-4 py-2 text-sm font-semibold text-cyan-100" />
        </div>
      ) : null}
    </>
  );
}
