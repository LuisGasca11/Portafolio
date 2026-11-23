import type { Metadata } from "next";
import { display, fraunces, inter } from "@/lib/fonts";
import { createT, defaultLocale, locales, pathFor, tagOf } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

/**
 * 404 de rutas desconocidas. No hay idioma que inferir de una URL que no
 * existe, así que se muestra en todos los idiomas, uno debajo del otro.
 */
export default function GlobalNotFound() {
  return (
    <html lang={tagOf(defaultLocale)} className={`${inter.variable} ${display.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <div className="mx-auto max-w-5xl px-5 py-36">
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">404</p>
          {locales.map((locale) => {
            const t = createT(locale);
            return (
              <section key={locale} lang={tagOf(locale)} className="mt-8 first:mt-4">
                <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{t("notFound.heading")}</h1>
                <p className="mt-3 max-w-xl text-muted">{t("notFound.text")}</p>
                <a
                  href={pathFor(locale, "/")}
                  className="mt-5 inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-black"
                >
                  {t("notFound.home")}
                </a>
              </section>
            );
          })}
        </div>
      </body>
    </html>
  );
}
