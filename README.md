# Portafolio de Luis Alberto Aguilar Gasca

Sitio personal en español (México), construido con Next.js (App Router), TypeScript y Tailwind CSS. Se publica en Netlify y vivirá en [lgasca.dev](https://lgasca.dev). El dominio aún no está comprado: mientras tanto el sitio sigue en [portgasca.netlify.app](https://portgasca.netlify.app). `npm run build` genera un export estático en `out/`.

El contenido sale del CV y de la descripción de BLACK SHEEP NET. El sitio publica desarrollos, una presentación breve, habilidades técnicas, educación y contacto. El teléfono se publica en la sección de contacto. No incluye empleos ajenos al desarrollo: esos están en la ruta `/curriculum`.

La portada es un «mundo con scroll» con tres mundos distintos y un menú fijo abajo para cambiar entre ellos (se recuerda la elección y también se puede enlazar con `?v=m1`, `?v=m2` o `?v=m3`):

- **M1 Abismo**: un descenso al océano en 3D (Three.js). La cámara baja con el scroll a través de nieve marina, cardúmenes, medusas y haces de luz hasta el fondo; la barra de profundidad y las zonas (de luz, crepuscular, de medianoche) siguen el avance. Hay un robot submarino que recorre la experiencia, y las habilidades son organismos bioluminiscentes. Tiene menú propio y medidor de profundidad en móvil, y si el dispositivo no tiene WebGL o se pide menos movimiento, usa el fondo CSS y las ilustraciones SVG.
- **M2 Papel**: un mundo de papel picado mexicano. Capas de papel con parallax (volcanes y pueblo), los desarrollos como puestos de tianguis con toldo, etiquetas colgantes, un papalote que acompaña el scroll y una noche de ofrenda para el contacto.
- **M3 Jardín**: una enredadera que crece conforme se baja por la página; cada desarrollo es una flor que se abre en su rama, las habilidades son un herbario y el contacto es un invernadero.

Los mundos viven en `components/worlds/` (uno por archivo `world-*.tsx`, con su ilustración en `*-art.tsx` y su CSS) y comparten los datos de `lib/content.ts`, el formulario de contacto (`contact-form.tsx`) y los efectos de scroll (`motion.ts`). Para añadir uno nuevo, crea su componente y regístralo en `home-worlds.tsx`. Todo respeta `prefers-reduced-motion`.

### Imágenes y videos

Los videos ambientales (`public/worlds/*.webm`, `*.mp4`) y sus pósters se generan por código, sin material externo: `tools/render-loops/` dibuja cada escena en un canvas como función del tiempo (todo se mueve con ciclos enteros, así el bucle es perfecto) y la convierte a video con ffmpeg. Para regenerarlos hace falta Playwright y ffmpeg:

```bash
node tools/render-loops/render.cjs all
```

Las ilustraciones (peces, medusas, volcanes, flores, enredadera…) son SVG escritos a mano dentro de los componentes `*-art.tsx`. La escena 3D de Abismo (`abismo-3d.tsx`) se carga con `import()` solo en ese mundo.

### Iconos de tecnologías

Cada tecnología muestra su icono (`components/tech-icon.tsx`). Los datos salen de `lib/tech-icons.ts`, que se genera con `tools/gen-tech-icons.cjs` a partir de [simple-icons](https://simpleicons.org) (CC0); Java, SQL Server, Firebird y Microsip, que no están ahí, son glifos propios. Para añadir una tecnología, agrégala al script y vuelve a generarlo: `npm i --no-save simple-icons && node tools/gen-tech-icons.cjs`.

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
