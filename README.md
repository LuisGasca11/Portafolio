# Portafolio de Luis Alberto Aguilar Gasca

Sitio personal en español (México), construido con Next.js (App Router), TypeScript y Tailwind CSS. Se publica en Netlify y vivirá en [lgasca.dev](https://lgasca.dev). El dominio aún no está comprado: mientras tanto el sitio sigue en [portgasca.netlify.app](https://portgasca.netlify.app). `npm run build` genera un export estático en `out/`.

El contenido sale del CV y de la descripción de BLACK SHEEP NET. El sitio publica desarrollos, una presentación breve, habilidades técnicas, educación y contacto. El teléfono se publica en la sección de contacto. No incluye empleos ajenos al desarrollo: esos están en la ruta `/curriculum`.

La portada es un «mundo con scroll»: el cielo del hero pasa de la mañana al atardecer y a la noche conforme se baja por la página, una ruta dibujada une las secciones, los proyectos son paradas de un mapa con scroll horizontal en escritorio y las habilidades se presentan como constelaciones. Todo respeta `prefers-reduced-motion` y tiene alternativa en móvil.

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
```

La carpeta `out/` contiene el HTML, CSS y JavaScript. Sírvela con cualquier hosting estático.

En Netlify, `netlify.toml` fija el comando `npm run build` y el directorio de publicación `out`. `next.config.ts` usa `output: "export"`, así que el despliegue no necesita un servidor de Node.

## Currículum en línea

El currículum vive como ruta interna del portafolio: `/curriculum` (`app/curriculum/page.tsx`, componentes en `components/cv/`, datos en `lib/cv.ts`). El enlace «Currículum» apunta a `cvUrl` en `lib/content.ts`.

## Formulario de contacto

La sección de contacto tiene un formulario (nombre, correo y mensaje) que usa [Netlify Forms](https://docs.netlify.com/forms/overview/): el formulario está en el HTML estático con `data-netlify="true"` y se envía con `fetch` sin salir de la página. Los mensajes llegan al panel de Netlify (Site → Forms).

Para que los mensajes también lleguen por correo a luisgasca0245@hotmail.com hay que activar la notificación en Netlify, una sola vez: **Site settings → Forms → Form notifications → Add notification → Email notification** y poner ese correo. Sin ese paso los mensajes solo se ven en el panel de Netlify.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación y export estático |
| `npm run lint` | ESLint |

## Contacto publicado

- Correo: luisgasca0245@hotmail.com
- Teléfono: +52 26 10840382
- WhatsApp: https://wa.me/522610840382
- GitHub: https://github.com/LuisGasca11
- Currículum: `cvUrl` en `lib/content.ts`
