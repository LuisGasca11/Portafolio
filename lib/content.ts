/**
 * Contenido público del portafolio, en todos los idiomas.
 * Fuente: CV de Luis Alberto Aguilar Gasca y la descripción de BLACK SHEEP NET.
 * No agregar datos que no estén en esas fuentes.
 *
 * Aquí viven los datos que no cambian con el idioma (enlaces, tecnologías,
 * fechas, nombres propios). Los textos salen de `lib/i18n/locales/*.json`.
 */
import { createT, formatMonth, pathFor, tagOf } from "@/lib/i18n";
import type { Locale, MessageKey } from "@/lib/i18n";

/** Dominio del portafolio. lgasca.dev aún no está comprado; mientras tanto el
 * sitio sigue publicado en Netlify como portgasca.netlify.app. */
export const siteUrl = "https://lgasca.dev";

/** Ruta interna del currículum (sin prefijo de idioma). */
export const cvPath = "/curriculum";

/** Black Sheep Labs y Grupo Fyttsa son la misma empresa: se muestra así. */
export const company = "Black Sheep Labs “Grupo Fyttsa”";

/** Página de desarrollador de la empresa en Google Play. */
export const playStoreUrl = "https://play.google.com/store/apps/dev?id=9017111634471517533";

/** PDFs del currículum, uno por idioma (se generan con `tools/render-cv`). */
export const cvPdf: Record<Locale, { href: string; file: string }> = {
  es: { href: "/cv/CV_Luis_Aguilar_ES.pdf", file: "CV_Luis_Aguilar_ES.pdf" },
  en: { href: "/cv/CV_Luis_Aguilar_EN.pdf", file: "CV_Luis_Aguilar_EN.pdf" },
};

export const identity = {
  name: "Luis Alberto Aguilar Gasca",
  shortName: "Luis Gasca",
  /** Marca del sitio: aparece en la pestaña del navegador y en el encabezado. */
  brand: "lgasca",
  email: "luisgasca0245@hotmail.com",
  phone: "+52 56 10840382",
  whatsappUrl: "https://wa.me/525610840382",
  githubUrl: "https://github.com/LuisGasca11",
  githubLabel: "github.com/LuisGasca11",
  linkedinUrl: "https://www.linkedin.com/in/luis-gasca-54a68834b",
  linkedinLabel: "linkedin.com/in/luis-gasca-54a68834b",
} as const;

/** Inicio y fin (`2025-11` o `2022`). `ongoing` = sigue vigente («Actualidad»). */
export type Period = { from: string; to?: string; ongoing?: boolean };

export function formatPeriod(locale: Locale, period: Period, present: string): string {
  const tag = tagOf(locale);
  const part = (value: string) => (value.length === 4 ? value : formatMonth(tag, value));
  if (period.ongoing === true) return `${part(period.from)} – ${present}`;
  if (period.to !== undefined && period.to !== period.from) return `${part(period.from)} – ${part(period.to)}`;
  return part(period.from);
}

export type ProjectId = "blackNet" | "aerial" | "lms" | "pms" | "apps" | "invoicing" | "website" | "jobs";

export type ProjectLink = { href: string; label: string };

type ProjectDef = {
  id: ProjectId;
  /** Contexto propio (si no, la empresa). */
  context?: string | MessageKey;
  stack: readonly string[];
  team?: boolean;
  links?: readonly ProjectLink[];
  apps?: readonly ProjectLink[];
  featured?: boolean;
};

const projectDefs: readonly ProjectDef[] = [
  {
    id: "blackNet",
    stack: ["Next.js", "TypeScript", "PHP", "Firebird", "Microsip", "Leaflet", "PM2"],
    links: [{ href: "https://black-net.mx", label: "black-net.mx" }],
    featured: true,
  },
  {
    id: "aerial",
    context: "projects.items.aerial.context",
    stack: ["Laravel", "PHP", "Vue.js", "MySQL", "Three.js"],
    featured: true,
  },
  { id: "lms", stack: [], team: true, links: [{ href: "https://skool.com.mx", label: "skool.com.mx" }] },
  { id: "pms", stack: [], team: true, links: [{ href: "https://stick.mx", label: "stick.mx" }] },
  {
    id: "apps",
    stack: ["Expo", "React Native"],
    apps: [
      { href: playStoreUrl, label: "Black Net" },
      { href: "https://play.google.com/store/apps/details?id=com.fyttsanet.app", label: "FyttsaNet" },
      { href: playStoreUrl, label: "BlackLink" },
    ],
  },
  {
    id: "invoicing",
    stack: ["Microsip"],
    links: [
      { href: "https://fyttsa.facturadorenlinea.mx", label: "fyttsa.facturadorenlinea.mx" },
      { href: "https://casatorres.facturadorenlinea.mx", label: "casatorres.facturadorenlinea.mx" },
    ],
  },
  { id: "website", stack: [], links: [{ href: "https://blck-sheep.com", label: "blck-sheep.com" }] },
  { id: "jobs", context: "Grupo Geisha Automotriz · 2025", stack: [] },
];

export type Project = {
  id: ProjectId;
  name: string;
  context: string;
  description: string;
  /** Versión corta, para el currículum y el PDF. */
  summary: string;
  stack: readonly string[];
  /** Nota de trabajo en equipo, si el desarrollo fue colaborativo. */
  team?: string;
  links?: readonly ProjectLink[];
  apps?: readonly ProjectLink[];
  featured?: boolean;
};

export type Role = {
  role: string;
  organization: string;
  period: string;
  summary: string;
  cvSummary: string;
  href: string;
  highlights: readonly string[];
};

export type Study = {
  id: "upvm" | "cecytem";
  period: string;
  title: string;
  institution: string;
};

const universities = { upvm: "Universidad Politécnica del Valle de México" } as const;

export function getContent(locale: Locale) {
  const t = createT(locale);

  const site = {
    url: siteUrl,
    ...identity,
    title: t("site.title"),
    shortTitle: t("site.shortTitle"),
    focus: t("site.focus"),
    location: t("site.location"),
    about: t("site.about"),
  };

  const projects: readonly Project[] = projectDefs.map((def) => {
    const base = `projects.items.${def.id}` as const;
    const context =
      def.context === undefined ? company : def.context.startsWith("projects.") ? t(def.context as MessageKey) : def.context;
    return {
      id: def.id,
      name: t(`${base}.name`),
      context,
      description: t(`${base}.description`),
      summary: t(`${base}.summary`),
      stack: def.stack,
      team: def.team === true ? t("projects.team") : undefined,
      links: def.links,
      apps: def.apps,
      featured: def.featured,
    };
  });

  const roles: readonly Role[] = [
    {
      role: t("experience.role"),
      organization: company,
      period: formatPeriod(locale, { from: "2025-11", to: "2026-06" }, t("cv.present")),
      href: "https://blck-sheep.com",
      summary: t("experience.summary"),
      cvSummary: t("experience.cvSummary"),
      highlights: [
        t("experience.highlights.blackNet"),
        t("experience.highlights.lmsPms"),
        t("experience.highlights.invoicing"),
        t("experience.highlights.apps"),
        t("experience.highlights.website"),
      ],
    },
  ];

  const skillGroups = [
    {
      title: t("skills.groups.frontend"),
      items: ["HTML", "CSS", "JavaScript", "Vue.js", "React.js", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: t("skills.groups.backend"),
      items: ["PHP", "Laravel", "Python", "Java", "Node.js", "Express", "MySQL", "SQL Server", "Supabase"],
    },
    { title: t("skills.groups.mobile"), items: ["Expo", "React Native", "Flutter"] },
    { title: t("skills.groups.devops"), items: ["Git", "GitHub", "Vercel", "Netlify", "Cloudflare", "PM2", "IIS"] },
    { title: t("skills.groups.erp"), items: [t("skills.microsipBasic")] },
  ] as const;

  const studies: readonly Study[] = [
    { id: "upvm", period: "2023 – 2026", title: t("education.items.upvm.title"), institution: universities.upvm },
    { id: "cecytem", period: "2019 – 2022", title: t("education.items.cecytem.title"), institution: t("education.items.cecytem.institution") },
  ];

  const technologies = [
    ...new Set([...skillGroups.flatMap((group) => [...group.items]), ...projects.flatMap((project) => [...project.stack])]),
  ];

  const stats = [
    { id: "projects", value: projects.length, label: t("about.stats.projects") },
    {
      id: "apps",
      value: projects.reduce((total, project) => total + (project.apps?.length ?? 0), 0),
      label: t("about.stats.apps"),
    },
    { id: "technologies", value: technologies.length, label: t("about.stats.technologies") },
  ] as const;

  const navItems = [
    { href: "#sobre-mi", label: t("about.heading") },
    { href: "#desarrollos", label: t("projects.heading") },
    { href: "#experiencia", label: t("experience.heading") },
    { href: "#habilidades", label: t("skills.heading") },
    { href: "#educacion", label: t("education.heading") },
    { href: "#contacto", label: t("common.contact") },
  ] as const;

  const siteUrlFor = (path: string) => `${siteUrl}${pathFor(locale, path)}`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: t("site.portfolioOf", { name: identity.name }),
        url: siteUrlFor("/"),
        inLanguage: tagOf(locale),
        description: site.about,
      },
      {
        "@type": "Person",
        name: identity.name,
        jobTitle: site.title,
        description: site.about,
        email: identity.email,
        telephone: identity.phone,
        url: siteUrlFor("/"),
        homeLocation: { "@type": "Place", name: site.location },
        sameAs: [identity.githubUrl, identity.linkedinUrl],
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: universities.upvm },
          { "@type": "EducationalOrganization", name: studies[1]?.institution ?? "" },
        ],
        knowsAbout: skillGroups.flatMap((group) => [...group.items]),
      },
    ],
  };

  return { site, projects, roles, skillGroups, studies, technologies, stats, navItems, personJsonLd };
}

export type Content = ReturnType<typeof getContent>;
