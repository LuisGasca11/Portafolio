"use client";

import { useEffect, useId, useState } from "react";
import { navItems, site } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
        scrolled || open ? "border-line bg-canvas/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#inicio" className="truncate font-display text-lg tracking-tight">
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-5 text-sm text-white/70">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#contacto"
            className="hidden h-10 items-center rounded-full bg-white px-4 text-sm font-medium text-black sm:inline-flex"
          >
            Contacto
          </a>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => {
              setOpen((current) => !current);
            }}
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id={menuId} className="border-t border-line bg-canvas px-5 py-4 lg:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-3 font-display text-3xl tracking-tight"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
