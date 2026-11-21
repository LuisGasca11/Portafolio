export type EducationItem = {
  period: string;
  institution: string;
  program?: string;
};

export type SkillGroup = {
  label: string;
  items: readonly string[];
};

export type ExperienceItem = {
  role: string;
  organization: string;
  period?: string;
  description?: string;
  website?: {
    href: string;
    label: string;
  };
};

export type Project = {
  name: string;
  organization: string;
  description: string;
  stack: readonly string[];
  detail?: string;
  /** Sitios en línea del desarrollo. */
  hrefs?: readonly string[];
};

export const profile = {
  name: "Luis Alberto Aguilar Gasca",
  title: "Ingeniero en Tecnologías de la Información y la Comunicación",
  email: "luisgasca0245@hotmail.com",
  phone: "+52 26 10840382",
  location: "Ecatepec de Morelos",
  portfolio: {
    href: "/",
    label: "lgasca.dev",
  },
  github: {
    href: "https://github.com/LuisGasca11",
    label: "github.com/LuisGasca11",
  },
} as const;

/** Navegación por secciones del currículum (ruta /curriculum). */
export const cvNavItems = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#educacion", label: "Educación" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const about =
  "Ingeniero en TIC con experiencia comprobada en desarrollo web full stack y mobile. Aprendizaje rápido, trabajo en equipo y orientación a resultados. Disciplina forjada en el deporte aplicada a cada proyecto.";

export const education: readonly EducationItem[] = [
  {
    period: "2019 – 2022",
    institution: "CECyTEM Plantel Ecatepec 1",
  },
  {
    period: "2023 – 2026",
    program: "Ingeniería en TIC",
    institution: "Universidad Politécnica del Valle de México",
  },
];

export const technicalSkills: readonly SkillGroup[] = [
  {
    label: "Front end",
    items: ["HTML", "CSS", "JavaScript", "Vue.js", "React.js", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Back end",
    items: ["PHP", "Laravel", "Java", "Node.js", "Express", "MySQL", "SQL Server", "Supabase"],
  },
  {
    label: "Mobile",
    items: ["Expo", "React Native"],
  },
  {
    label: "DevOps",
    items: ["Git", "GitHub", "Vercel", "Netlify", "Cloudflare", "PM2", "IIS"],
  },
  {
    label: "ERP",
    items: ["Microsip (básico)"],
  },
];

export const softSkills: readonly string[] = [
  "Comprometido",
  "Trabajo en equipo",
  "Proactivo",
  "Comunicación asertiva",
  "Liderazgo",
  "Resolución de problemas",
  "Responsable",
];

export const experience: readonly ExperienceItem[] = [
  {
    role: "Desarrollador Full Stack",
    organization: "Grupo Fyttsa",
    period: "Nov 2025 – Jun 2026",
    description:
      "Desarrollo de sistemas web y móviles multiempresa: LMS, PMS, facturador y cotizador integrados con ERP Microsip, aplicaciones móviles con Expo y sitio web institucional.",
  },
  {
    role: "Desarrollador Full Stack",
    organization: "Black Sheep Labs",
    website: {
      href: "https://blck-sheep.com",
      label: "blck-sheep.com",
    },
  },
  {
    role: "Entrenador Deportivo",
    organization: "CECYTEM Tultitlán",
    period: "2022 – Actualidad",
    description:
      "Formación de niños de 4 a 15 años en disciplina deportiva, liderazgo y comunicación efectiva. Desarrollo de habilidades de mentoría y gestión de grupos.",
  },
  {
    role: "Empleado Administrativo",
    organization: "Curiosidades Ale",
    period: "2023",
    description:
      "Administración del software de punto de venta SICAR, gestión de base de datos, ingresos y egresos del negocio.",
  },
  {
    role: "Promotor de Ventas",
    organization: "Telmex",
    period: "2018",
    description:
      "Desarrollo de habilidades de comunicación asertiva y construcción de relaciones con clientes.",
  },
];

export const projects: readonly Project[] = [
  {
    name: "LMS Multiempresa",
    organization: "Grupo Fyttsa",
    description:
      "Plataforma de gestión de aprendizaje multiempresa: administración de cursos, usuarios y contenidos para distintas organizaciones.",
    stack: [],
  },
  {
    name: "PMS Multiempresa",
    organization: "Grupo Fyttsa",
    description: "Sistema de gestión de proyectos centralizado para múltiples empresas.",
    stack: [],
  },
  {
    name: "Facturador + Cotizador Microsip",
    organization: "Grupo Fyttsa",
    description:
      "Facturación electrónica y cotizaciones integradas al ERP Microsip con sincronización automática de datos.",
    stack: ["Microsip"],
    hrefs: ["https://fyttsa.facturadorenlinea.mx", "https://casatorres.facturadorenlinea.mx"],
  },
  {
    name: "Apps Móviles con Expo",
    organization: "Grupo Fyttsa",
    description:
      "Desarrollo de aplicaciones móviles multiplataforma (iOS/Android) con Expo y React Native.",
    stack: ["Expo", "React Native"],
  },
  {
    name: "Team Page & Sitio Web",
    organization: "Grupo Fyttsa",
    description: "Sitio web institucional del equipo de trabajo de la empresa.",
    stack: [],
  },
  {
    name: "Sistema de Inventarios 3D",
    organization: "AERIAL DEPOT",
    detail: "Edu. Dual 2025",
    description:
      "App web con Laravel, Vue.js y MySQL. Visualización 3D del almacén con Three.js para localización de productos.",
    stack: ["Laravel", "Vue.js", "MySQL", "Three.js"],
  },
  {
    name: "Vacantes de Empleo",
    organization: "Grupo Geisha Automotriz",
    detail: "2025",
    description: "Gestión y publicación de vacantes para distintas sucursales de la empresa.",
    stack: [],
  },
  {
    name: "BLACK SHEEP NET",
    organization: "Black Sheep Labs",
    description:
      "Monorepo web con Next.js y API en PHP sobre Firebird y Microsip. Incluye un Planeador de Ruta con Leaflet, OpenStreetMap y OSRM: Dijkstra exacto hasta 10 paradas y vecino cercano con 2-opt para más paradas. Geocodificación con Google, pedidos programados por cron y despliegue en IIS con PM2.",
    stack: ["Next.js", "TypeScript", "PHP", "Firebird", "Microsip", "Leaflet", "PM2"],
    hrefs: ["https://black-net.mx"],
  },
];
