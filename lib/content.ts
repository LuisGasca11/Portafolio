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

export type Project = {
  name: string;
  context: string;
  description: string;
  stack: readonly string[];
  /** Sitios en línea del desarrollo. */
  links?: readonly ProjectLink[];
};

export type ProjectLink = {
  href: string;
  label: string;
};

export const projects: readonly Project[] = [
  {
    name: "LMS Multiempresa",
    context: "Grupo Fyttsa",
    description:
      "Plataforma de gestión de aprendizaje multiempresa: administración de cursos, usuarios y contenidos para distintas organizaciones.",
    stack: [],
  },
  {
    name: "PMS Multiempresa",
    context: "Grupo Fyttsa",
    description: "Sistema de gestión de proyectos centralizado para múltiples empresas.",
    stack: [],
  },
  {
    name: "Facturador + Cotizador Microsip",
    context: "Grupo Fyttsa",
    description:
      "Facturación electrónica y cotizaciones integradas al ERP Microsip, con sincronización automática de datos.",
    stack: ["Microsip"],
    links: [
      { href: "https://fyttsa.facturadorenlinea.mx", label: "fyttsa.facturadorenlinea.mx" },
      { href: "https://casatorres.facturadorenlinea.mx", label: "casatorres.facturadorenlinea.mx" },
    ],
  },
  {
    name: "Apps Móviles con Expo",
    context: "Grupo Fyttsa",
    description:
      "Aplicaciones móviles multiplataforma (iOS y Android) con Expo y React Native.",
    stack: ["Expo", "React Native"],
  },
  {
    name: "Team Page & Sitio Web",
    context: "Grupo Fyttsa",
    description: "Sitio web institucional del equipo de trabajo de la empresa.",
    stack: [],
  },
  {
    name: "Sistema de Inventarios 3D",
    context: "AERIAL DEPOT · Edu. Dual 2025",
    description:
      "Aplicación web con Laravel, Vue.js y MySQL. Visualización 3D del almacén con Three.js para localización de productos.",
    stack: ["Laravel", "Vue.js", "MySQL", "Three.js"],
  },
  {
    name: "Vacantes de Empleo",
    context: "Grupo Geisha Automotriz · 2025",
    description:
      "Gestión y publicación de vacantes para distintas sucursales de la empresa.",
    stack: [],
  },
  {
    name: "BLACK SHEEP NET",
    context: "Black Sheep Labs",
    description:
      "Monorepo web con Next.js y una API en PHP sobre Firebird y Microsip, en producción. Incluye un planeador de ruta con Leaflet y OpenStreetMap, cálculo del orden de visitas con OSRM (Dijkstra exacto hasta 10 paradas; vecino cercano y 2-opt para rutas mayores), geocodificación con Google, pedidos programados mediante cron y despliegue con IIS y PM2.",
    stack: ["Next.js", "TypeScript", "PHP", "Firebird", "Microsip", "Leaflet", "PM2"],
    links: [{ href: "https://black-net.mx", label: "black-net.mx" }],
  },
];

export type Role = {
  role: string;
  organization: string;
  period?: string;
  summary?: string;
  href?: string;
};

export const roles: readonly Role[] = [
  {
    role: "Desarrollador full stack",
    organization: "Grupo Fyttsa",
    period: "Noviembre 2025 – junio 2026",
    summary:
      "Desarrollo de sistemas web y móviles multiempresa: LMS, PMS, facturador y cotizador integrados con ERP Microsip, aplicaciones móviles con Expo y sitio web institucional.",
  },
  {
    role: "Desarrollador full stack",
    organization: "Black Sheep Labs",
    href: "https://blck-sheep.com",
  },
];

export const skillGroups = [
  {
    title: "Front end",
    items: ["HTML", "CSS", "JavaScript", "Vue.js", "React.js", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Back end",
    items: ["PHP", "Laravel", "Java", "Node.js", "Express", "MySQL", "SQL Server", "Supabase"],
  },
  {
    title: "Móvil",
    items: ["Expo", "React Native"],
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
  { value: roles.length, label: "Roles de desarrollo" },
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
