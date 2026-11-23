import type { ReactNode } from "react";
import { BubbleTransition } from "@/components/transition/bubble-transition";
import { LocaleProvider } from "@/components/shared/locale-provider";
import { getContent } from "@/lib/content";
import { display, fraunces, inter } from "@/lib/fonts";
import { createT, dirOf, tagOf } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import "@/app/globals.css";

/** `<html>` y `<body>` de un idioma: cada idioma tiene su propia raíz para que `lang` sea el correcto. */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = createT(locale);
  const jsonLd = JSON.stringify(getContent(locale).personJsonLd).replace(/</g, "\\u003c");

  return (
    <html
      lang={tagOf(locale)}
      dir={dirOf(locale)}
      className={`${inter.variable} ${display.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          {t("common.skipToContent")}
        </a>
        <LocaleProvider locale={locale}>
          <BubbleTransition>{children}</BubbleTransition>
        </LocaleProvider>
      </body>
    </html>
  );
}
