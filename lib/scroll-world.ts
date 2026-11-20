/**
 * Configuración del vuelo scrubbeado de la portada (scroll world).
 *
 * Seis escenas, una por sección del portafolio. Cada escena es un clip de
 * inmersión generado por image-to-video desde su still: el scroll solo mueve
 * el tiempo del clip. Los empalmes entre escenas son crossfades directos,
 * sin clips conectores (el presupuesto de video es de 6 clips en total).
 *
 * En móvil y con prefers-reduced-motion no se carga la cadena de video:
 * se sirven los stills con cross-dissolve.
 */

export type FlightCta = {
  label: string;
  href: string;
};

export type FlightScene = {
  /** Id de la sección (ancla del contenido) y del dwell (#escena-<id>). */
  id: string;
  /** Etiqueta corta para la navegación y el riel de ruta. */
  label: string;
  /** Foto fija de la escena (también póster del clip). */
  still: string;
  /** Clip de inmersión de la escena. */
  clip: string;
  /** Acento de la escena (variaciones de ámbar de hora dorada). */
  accent: string;
  eyebrow: string;
  title: string;
  /** Última palabra del título, en acento. */
  titleAccent?: string;
  body: string;
  tags: readonly string[];
  /** Altos de scroll del dwell, en altos de viewport. */
  dwell: number;
  /** 0–0.6: la cámara se asienta a mitad de escena, donde el copy llega. */
  linger: number;
  cta?: {
    primary: FlightCta;
    secondary?: FlightCta;
  };
  /** Enlaces pequeños bajo los botones (solo el hero). */
  links?: readonly FlightCta[];
};

export const flightScenes: readonly FlightScene[] = [
  {
    id: "sobre-mi",
    label: "Sobre mí",
    still: "/images/hero-montana.jpg",
    clip: "/scroll-world/clip-01-hero.mp4",
    accent: "#f0b45a",
    eyebrow: "Ingeniero en TIC",
    title: "Luis Alberto Aguilar Gasca",
    titleAccent: "Gasca",
    body: "Desarrollo web full stack y móvil. Aprendizaje rápido, trabajo en equipo y orientación a resultados.",
    tags: ["8 desarrollos", "2 roles", "23 tecnologías"],
    dwell: 1.6,
    linger: 0.45,
    cta: {
      primary: { label: "Ver desarrollos", href: "#desarrollos" },
      secondary: { label: "Contacto", href: "#contacto" },
    },
    links: [
      { label: "luisgasca0245@hotmail.com", href: "mailto:luisgasca0245@hotmail.com" },
      { label: "github.com/LuisGasca11", href: "https://github.com/LuisGasca11" },
      { label: "Currículum", href: "/curriculum" },
    ],
  },
  {
    id: "desarrollos",
    label: "Desarrollos",
    still: "/images/proyecto-web.jpg",
    clip: "/scroll-world/clip-02-desarrollos.mp4",
    accent: "#f0b45a",
    eyebrow: "Desarrollos",
    title: "Cada proyecto, una parada del camino.",
    body: "Sistemas web y móviles en producción para varias empresas, del LMS al facturador integrado con Microsip.",
    tags: ["Next.js", "Laravel", "React Native"],
    dwell: 1.4,
    linger: 0.35,
  },
  {
    id: "experiencia",
    label: "Experiencia",
    still: "/images/ciudad.jpg",
    clip: "/scroll-world/clip-03-experiencia.mp4",
    accent: "#e8a04c",
    eyebrow: "Experiencia",
    title: "Dos equipos, un mismo oficio.",
    body: "Desarrollador full stack en Grupo Fyttsa y en Black Sheep Labs.",
    tags: ["Grupo Fyttsa", "Black Sheep Labs"],
    dwell: 1.3,
    linger: 0.35,
  },
  {
    id: "habilidades",
    label: "Habilidades",
    still: "/images/scene-observatorio.jpg",
    clip: "/scroll-world/clip-04-habilidades.mp4",
    accent: "#d99a4e",
    eyebrow: "Habilidades",
    title: "El equipo para el camino.",
    body: "Front end, back end, móvil, DevOps y ERP: lo que uso en cada etapa del viaje.",
    tags: ["Next.js", "Laravel", "Expo"],
    dwell: 1.3,
    linger: 0.35,
  },
  {
    id: "educacion",
    label: "Educación",
    still: "/images/scene-campus.jpg",
    clip: "/scroll-world/clip-05-educacion.mp4",
    accent: "#f0b45a",
    eyebrow: "Educación",
    title: "Formación con disciplina.",
    body: "Ingeniería en TIC en la Universidad Politécnica del Valle de México y CECyTEM.",
    tags: ["UPVM", "CECyTEM"],
    dwell: 1.3,
    linger: 0.35,
  },
  {
    id: "contacto",
    label: "Contacto",
    still: "/images/costa.jpg",
    clip: "/scroll-world/clip-06-contacto.mp4",
    accent: "#f0b45a",
    eyebrow: "Destino final",
    title: "Llegaste al final del recorrido.",
    body: "¿Tienes un proyecto en mente? Escríbeme.",
    tags: [],
    dwell: 1.6,
    linger: 0.45,
    cta: {
      primary: { label: "Escríbeme", href: "#contacto" },
      secondary: { label: "Ver currículum", href: "/curriculum" },
    },
  },
];
