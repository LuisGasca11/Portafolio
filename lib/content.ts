/**
 * Contenido público del portafolio.
 * Fuente: CV de Luis Alberto Aguilar Gasca y la descripción de BLACK SHEEP NET.
 * No agregar datos que no estén en esas fuentes.
 */

/** Dominio del portafolio. lgasca.dev aún no está comprado; mientras tanto el
 * sitio sigue publicado en Netlify como portgasca.netlify.app. */
export const siteUrl = "https://lgasca.dev";

/** Currículum en línea (ruta interna del portafolio). */
export const cvUrl = "/curriculum";

export const site = {
  url: siteUrl,
  name: "Luis Alberto Aguilar Gasca",
  shortName: "Luis Gasca",
  /** Marca del sitio: aparece en la pestaña del navegador y en el encabezado. */
  brand: "lgasca",
  title: "Ingeniero en Tecnologías de la Información y la Comunicación",
  shortTitle: "Ingeniero en TIC",
  focus: "Desarrollo web full stack y móvil",
  location: "Ecatepec de Morelos, CDMX",
  email: "luisgasca0245@hotmail.com",
  phone: "+52 26 10840382",
  whatsappUrl: "https://wa.me/522610840382",
  githubUrl: "https://github.com/LuisGasca11",
  githubLabel: "github.com/LuisGasca11",
  linkedinUrl: "https://www.linkedin.com/in/luis-gasca-54a68834b",
  linkedinLabel: "linkedin.com/in/luis-gasca-54a68834b",
  about:
    "Ingeniero en TIC con experiencia comprobada en desarrollo web full stack y móvil. Aprendizaje rápido, trabajo en equipo y orientación a resultados.",
} as const;

export const navItems = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#desarrollos", label: "Desarrollos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#educacion", label: "Educación" },
  { href: "#contacto", label: "Contacto" },
] as const;

export type NavItem = (typeof navItems)[number];

/** Black Sheep Labs y Grupo Fyttsa son la misma empresa: se muestra así. */
export const company = "Black Sheep Labs “Grupo Fyttsa”";

/** Página de desarrollador de la empresa en Google Play. */
export const playStoreUrl = "https://play.google.com/store/apps/dev?id=9017111634471517533";

export type Project = {
  name: string;
  context: string;
  description: string;
  stack: readonly string[];
  /** Nota de trabajo en equipo, si el desarrollo fue colaborativo. */
  team?: string;
  /** Sitios en línea del desarrollo. */
  links?: readonly ProjectLink[];
  /** Aplicaciones publicadas en tiendas. */
  apps?: readonly ProjectLink[];
  /** Destacado: ocupa más espacio en la cuadrícula. */
  featured?: boolean;
};

export type ProjectLink = {
  href: string;
  label: string;
};

const teamNote = "En colaboración con otros compañeros de Black Sheep Labs.";

export const projects: readonly Project[] = [
  {
    name: "BLACK SHEEP NET",
    context: company,
    description:
      "Monorepo web con Next.js y una API en PHP sobre Firebird y Microsip, en producción. Incluye un planeador de ruta con Leaflet y OpenStreetMap, cálculo del orden de visitas con OSRM (Dijkstra exacto hasta 10 paradas; vecino cercano y 2-opt para rutas mayores), geocodificación con Google, pedidos programados mediante cron y despliegue con IIS y PM2.",
    stack: ["Next.js", "TypeScript", "PHP", "Firebird", "Microsip", "Leaflet", "PM2"],
    links: [{ href: "https://black-net.mx", label: "black-net.mx" }],
    featured: true,
  },
  {
    name: "Aerial Depot WMS",
    context: "AERIAL DEPOT · Educación Dual 2025",
    description:
      "Sistema de gestión de almacenes (WMS) con back end y front end separados: API en Laravel 12 con autenticación JWT, base de datos MySQL con migraciones y datos precargados, imágenes de productos procesadas con GD y una interfaz en Vue 3 que muestra el almacén en 3D con Three.js para localizar productos.",
    stack: ["Laravel", "PHP", "Vue.js", "MySQL", "Three.js"],
    featured: true,
  },
  {
    name: "LMS Multiempresa",
    context: company,
    description:
      "Plataforma de gestión de aprendizaje multiempresa: administración de cursos, usuarios y contenidos para distintas organizaciones.",
    stack: [],
    team: teamNote,
    links: [{ href: "https://skool.com.mx", label: "skool.com.mx" }],
  },
  {
    name: "PMS Multiempresa",
    context: company,
    description: "Sistema de gestión de proyectos centralizado para múltiples empresas.",
    stack: [],
    team: teamNote,
    links: [{ href: "https://stick.mx", label: "stick.mx" }],
  },
  {
    name: "Apps móviles en Google Play",
    context: company,
    description:
      "Aplicaciones móviles multiplataforma (iOS y Android) con Expo y React Native, publicadas en Google Play: Black Net, FyttsaNet y BlackLink.",
    stack: ["Expo", "React Native"],
    apps: [
      { href: playStoreUrl, label: "Black Net" },
      { href: "https://play.google.com/store/apps/details?id=com.fyttsanet.app", label: "FyttsaNet" },
      { href: playStoreUrl, label: "BlackLink" },
    ],
  },
  {
    name: "Facturador + Cotizador Microsip",
    context: company,
    description:
      "Facturación electrónica y cotizaciones integradas al ERP Microsip, con sincronización automática de datos.",
    stack: ["Microsip"],
    links: [
      { href: "https://fyttsa.facturadorenlinea.mx", label: "fyttsa.facturadorenlinea.mx" },
      { href: "https://casatorres.facturadorenlinea.mx", label: "casatorres.facturadorenlinea.mx" },
    ],
  },
  {
    name: "Team Page & Sitio Web",
    context: company,
    description: "Sitio web institucional del equipo de trabajo de la empresa.",
    stack: [],
    links: [{ href: "https://blck-sheep.com", label: "blck-sheep.com" }],
  },
  {
    name: "Vacantes de Empleo",
    context: "Grupo Geisha Automotriz · 2025",
    description:
      "Gestión y publicación de vacantes para distintas sucursales de la empresa.",
    stack: [],
  },
];

export type Role = {
  role: string;
  organization: string;
  period?: string;
  summary?: string;
  href?: string;
  highlights?: readonly string[];
};

export const roles: readonly Role[] = [
  {
    role: "Desarrollador full stack",
    organization: company,
    period: "Noviembre 2025 – junio 2026",
    href: "https://blck-sheep.com",
    summary:
      "Desarrollo de sistemas web y móviles multiempresa: LMS, PMS, facturador y cotizador integrados con ERP Microsip, aplicaciones móviles con Expo y sitio web institucional.",
    highlights: [
      "BLACK SHEEP NET en producción: Next.js, API en PHP sobre Firebird y Microsip, planeador de rutas con OSRM.",
      "LMS y PMS multiempresa (skool.com.mx y stick.mx), en equipo con compañeros de Black Sheep Labs.",
      "Facturador y cotizador integrados con el ERP Microsip.",
      "Apps móviles con Expo publicadas en Google Play: Black Net, FyttsaNet y BlackLink.",
      "Sitio web institucional y team page.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Front end",
    items: ["HTML", "CSS", "JavaScript", "Vue.js", "React.js", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Back end",
    items: ["PHP", "Laravel", "Python", "Java", "Node.js", "Express", "MySQL", "SQL Server", "Supabase"],
  },
  {
    title: "Móvil",
    items: ["Expo", "React Native", "Flutter"],
  },
  {
    title: "DevOps",
    items: ["Git", "GitHub", "Vercel", "Netlify", "Cloudflare", "PM2", "IIS"],
  },
  {
    title: "ERP",
    items: ["Microsip (básico)"],
  },
] as const;

export type Study = {
  period: string;
  title: string;
  institution?: string;
};

const listedTechnologies = [
  ...skillGroups.flatMap((group) => [...group.items]),
  ...projects.flatMap((project) => [...project.stack]),
];

export const technologies = [...new Set(listedTechnologies)];

export const stats = [
  { value: projects.length, label: "Desarrollos" },
  { value: projects.reduce((total, project) => total + (project.apps?.length ?? 0), 0), label: "Apps en Google Play" },
  { value: technologies.length, label: "Tecnologías" },
] as const;

export const studies: readonly Study[] = [
  {
    period: "2023 – 2026",
    title: "Ingeniería en TIC",
    institution: "Universidad Politécnica del Valle de México",
  },
  {
    period: "2019 – 2022",
    title: "CECyTEM Plantel Ecatepec 1",
  },
];

export const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: `Portafolio de ${site.name}`,
      url: site.url,
      inLanguage: "es-MX",
      description: site.about,
    },
    {
      "@type": "Person",
      name: site.name,
      jobTitle: site.title,
      description: site.about,
      email: site.email,
      telephone: site.phone,
      url: site.url,
      homeLocation: {
        "@type": "Place",
        name: site.location,
      },
      sameAs: [site.githubUrl, site.linkedinUrl],
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Universidad Politécnica del Valle de México",
        },
        {
          "@type": "EducationalOrganization",
          name: "CECyTEM Plantel Ecatepec 1",
        },
      ],
      knowsAbout: skillGroups.flatMap((group) => [...group.items]),
    },
  ],
};
