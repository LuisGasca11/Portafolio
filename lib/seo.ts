import type { Metadata, Viewport } from "next";
import { getContent, identity, siteUrl } from "@/lib/content";
import { createT, defaultLocale, locales, ogOf, pathFor, tagOf } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

/** `hreflang` de una página: una entrada por idioma y `x-default`. */
export function alternatesFor(path: string): Record<string, string> {
  const entries = locales.map((locale) => [tagOf(locale), pathFor(locale, path)] as const);
  return { ...Object.fromEntries(entries), "x-default": pathFor(defaultLocale, path) };
}

const keywordNames = [
  "Next.js",
  "TypeScript",
  "React",
  "Vue.js",
  "Laravel",
  "PHP",
  "Expo",
  "React Native",
  "Flutter",
  "Python",
  "Microsip",
];

/** Metadatos de la raíz de un idioma (las páginas heredan y pueden sobrescribir). */
export function rootMetadata(locale: Locale): Metadata {
  const t = createT(locale);
  const { site } = getContent(locale);
  const title = `${identity.name} | ${site.shortTitle}`;
  const other = locales.filter((item) => item !== locale).map(ogOf);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: identity.brand, template: `%s | ${identity.brand}` },
    description: site.about,
    applicationName: identity.brand,
    authors: [{ name: identity.name, url: identity.githubUrl }],
    creator: identity.name,
    keywords: [
      identity.name,
      t("meta.keywords.role"),
      t("meta.keywords.devRole"),
      ...keywordNames,
    ],
    alternates: { canonical: pathFor(locale, "/"), languages: alternatesFor("/") },
    openGraph: {
      type: "website",
      locale: ogOf(locale),
      alternateLocale: other,
      url: pathFor(locale, "/"),
      siteName: identity.brand,
      title,
      description: site.about,
    },
    twitter: { card: "summary", title, description: site.about },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export function curriculumMetadata(locale: Locale): Metadata {
  const t = createT(locale);
  const title = t("meta.cvTitle", { name: identity.name });
  const description = t("meta.cvDescription", { name: identity.name });
  const path = pathFor(locale, "/curriculum");
  return {
    title: { absolute: title },
    description,
    applicationName: t("meta.cvApplicationName", { name: identity.name }),
    keywords: [identity.name, t("meta.keywords.cv"), t("meta.keywords.role"), t("meta.keywords.devRole"), t("meta.keywords.city")],
    alternates: { canonical: path, languages: alternatesFor("/curriculum") },
    openGraph: {
      title,
      description,
      url: path,
      locale: ogOf(locale),
      type: "profile",
      firstName: "Luis Alberto",
      lastName: "Aguilar Gasca",
      username: "LuisGasca11",
    },
    twitter: { card: "summary", title, description },
  };
}
