import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
import { defaultLocale, locales, pathFor, tagOf } from "@/lib/i18n";

export const dynamic = "force-static";

const pages = [
  { path: "/", priority: 1 },
  { path: "/curriculum", priority: 0.8 },
] as const;

/** Una entrada por página e idioma, cada una con los enlaces `hreflang` a las demás. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}${pathFor(locale, page.path)}`,
      lastModified: "2026-11-23",
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? page.priority : page.priority - 0.1,
      alternates: {
        languages: Object.fromEntries(locales.map((item) => [tagOf(item), `${siteUrl}${pathFor(item, page.path)}`])),
      },
    })),
  );
}
