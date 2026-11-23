# Portafolio de Luis Alberto Aguilar Gasca

Sitio personal en español (México), construido con Next.js (App Router), TypeScript y Tailwind CSS. Se publica en Netlify y vivirá en [lgasca.dev](https://lgasca.dev). El dominio aún no está comprado: mientras tanto el sitio sigue en [portgasca.netlify.app](https://portgasca.netlify.app). `npm run build` genera un export estático en `out/`.

El contenido sale del CV y de la descripción de BLACK SHEEP NET. Black Sheep Labs y Grupo Fyttsa son la misma empresa y se muestra como Black Sheep Labs “Grupo Fyttsa” (`company` en `lib/content.ts`); las apps de Google Play enlazan a la página de desarrollador de la empresa (`playStoreUrl`). El sitio publica desarrollos, una presentación breve, habilidades técnicas, educación y contacto. El teléfono se publica en la sección de contacto. No incluye empleos ajenos al desarrollo: esos están en la ruta `/curriculum`.

La portada es un descenso al océano con scroll («Abismo»), en 3D con Three.js. La cámara baja con el scroll a través de nieve marina, burbujas, cardúmenes, peces ángel, medusas, mantarrayas, tortugas, tiburones, calamares, algas, corales, anémonas, cangrejos y estrellas de mar hasta el fondo; el medidor de profundidad y las zonas (de luz, crepuscular, de medianoche) siguen el avance. Un robot submarino recorre la experiencia y las habilidades son organismos bioluminiscentes. En móvil hay encabezado con la profundidad y menú propio, los desarrollos son un carrusel deslizable y la escena usa menos criaturas y baja su resolución si el equipo no alcanza a dibujarla con fluidez.

Para que todo se vea como agua:

- La escena se dibuja en un búfer y pasa por un filtro bajo el agua (`scene/post.ts`): refracción ondulante, haces de luz desde la superficie, absorción del rojo con la profundidad, viñeta y grano fino.
- Animales y objetos usan un material común (`scene/materials.ts`): cáusticas que se mueven sobre el lomo, brillo de contorno del color del agua y vientre claro (contrasombreado). Al bajar, las cáusticas y el sol se apagan y se enciende un faro en la cámara.
- La superficie se ve desde abajo (ventana de Snell) en los primeros metros, y las burbujas suben alrededor de la cámara durante todo el descenso.
- Los modelos se arman por código: peces con aletas, ojos y línea lateral; tiburones con nado ondulante; mantarrayas con aleteo en onda; tortugas con caparazón de escudos; calamares con brazos; medusas con costillas y brazos orales.

Si el dispositivo no tiene WebGL o se pide menos movimiento, se usa el fondo CSS con ilustraciones SVG. Orden de la página: Hero → Sobre mí → Desarrollos → Experiencia → Habilidades → Educación → Contacto.

### Estructura del código

```
app/                      rutas: (es)/ en español (/ y /curriculum), en/ en inglés (/en y /en/curriculum), 404 global
components/
  abismo/                 la portada
    abismo.tsx            composición de la página
    sections/             una sección por archivo (hero, about, projects, experience, skills, education, contact)
    ui/                   piezas compartidas (encabezado y menú, medidor, burbujas, divisores, formulario, video)
    scene/                escena 3D: engine.ts arma el mundo; cada capa (surface, snow, bubbles, rays, fish, jellyfish, manta, turtle, shark, squid, seabed…) es un módulo; materials.ts, shapes.ts y post.ts dan el aspecto de agua
    art/                  ilustraciones SVG (creatures.tsx, flora.tsx)
    hooks/                efectos de scroll (GSAP) y movimiento reducido
    data.ts               navegación, zonas oceánicas y configuración de las burbujas
  transition/             transición de vista con burbujas y animales (Framer Motion)
  cv/                     la ruta /curriculum (con su encabezado, pie y efectos)
  shared/                 raíz por idioma, proveedor de idioma, selector de idioma, enlace externo, icono de tecnología, scroll suave
  pages/                  páginas compartidas por los dos idiomas (inicio y currículum)
lib/                      contenido (content.ts, cv.ts), idiomas (i18n/), SEO (seo.ts) y datos de iconos (tech-icons.ts)
tools/                    generadores del video ambiental, de los iconos y de los PDF del CV; verificación de traducciones
```

## Idiomas (español e inglés)

El sitio está en español (`/`, `/curriculum`) y en inglés (`/en`, `/en/curriculum`). El idioma lo marca la URL: cada página tiene su propio `<html lang>`, título, descripción, datos estructurados y enlaces `hreflang`, y el mapa del sitio lista las dos versiones. Es una exportación estática, así que no hay redirección automática por el idioma del navegador: se cambia con el selector («English» / «Español») del encabezado y del menú. Si algún día se quiere, Netlify puede redirigir `/` a `/en` según el idioma del navegador con una regla `Language` en `netlify.toml`.

- **Registro de idiomas:** `lib/i18n/registry.json` es la única lista (código, etiqueta BCP 47, nombre del idioma en sí mismo, estado y revisión). `lib/i18n/config.ts` deriva de él las rutas y etiquetas.
- **Textos:** un paquete por idioma en `lib/i18n/locales/` (`es.json` es el fuente y `en.json`). Se piden con `t("clave")` (`lib/i18n/messages.ts`); las claves están tipadas, así que una clave inexistente no compila. No hay textos de respaldo en los componentes: si falta uno, el build falla.
- **Datos y textos:** `lib/content.ts` y `lib/cv.ts` guardan lo que no cambia con el idioma (enlaces, tecnologías, nombres propios) y arman el contenido con los textos de cada idioma. Las fechas se formatean con `Intl` según el idioma.
- **Verificación:** `npm run i18n:check` (corre solo antes de `npm run build`) falla si a un idioma le falta una clave, le sobra una, deja un valor vacío o idéntico al español sin estar en `allowIdentical`, o cambia los `{marcadores}`. Para añadir un texto: agrégalo en `es.json` y `en.json` y úsalo con `t()`. Para añadir un idioma: súmalo a `registry.json`, crea su paquete y regístralo en `lib/i18n/messages.ts`.
- **Revisión:** el inglés está como `beta` en el registro hasta que una persona lo revise; al hacerlo, anota `reviewedBy`/`reviewedAt` y pásalo a `live`.

## Currículum en PDF

El botón «Descargar CV (PDF)» (en `/curriculum` y en la sección de contacto del portafolio) baja el PDF del idioma de la página, y hay un enlace a la versión del otro idioma. Los PDF (`public/cv/CV_Luis_Aguilar_ES.pdf` y `_EN.pdf`) tienen el estilo de una hoja A4: etiquetas a la izquierda, acento morado y proyectos en dos columnas. Se generan con los mismos datos y textos del sitio, así que para actualizarlos basta con regenerarlos después de cambiar el contenido:

```bash
npm run cv:pdf
```

Requiere Playwright (Chromium), igual que el video ambiental. La plantilla está en `tools/render-cv/render.mjs`.

Los datos de la portada salen de `lib/content.ts` y el formulario de contacto conserva los campos de Netlify Forms.

### Transición entre vistas

`components/transition/bubble-transition.tsx` usa Framer Motion: al ir a otra página (por ejemplo `/curriculum`) o saltar a una sección lejana, una ola con burbujas y muchos animales marinos cubre la pantalla, cambia de vista y se retira. Intercepta los enlaces internos; con «reducir movimiento» se desactiva y los enlaces funcionan normal.

### Imágenes y videos

El video ambiental (`public/worlds/abismo.webm`, `.mp4` y póster) se genera por código, sin material externo: `tools/render-loops/` dibuja la escena en un canvas como función del tiempo (todo se mueve con ciclos enteros, así el bucle es perfecto) y la convierte a video con ffmpeg. Para regenerarlo hace falta Playwright y ffmpeg:

```bash
node tools/render-loops/render.cjs all
```

### Iconos de tecnologías

Cada tecnología muestra su icono (`components/shared/tech-icon.tsx`). Los datos salen de `lib/tech-icons.ts`, que se genera con `tools/gen-tech-icons.cjs` a partir de [simple-icons](https://simpleicons.org) (CC0); Java, SQL Server, Firebird, IIS y Microsip, que no están ahí, son glifos propios. Para añadir una tecnología, agrégala al script y vuelve a generarlo: `npm i --no-save simple-icons && node tools/gen-tech-icons.cjs`.

## Requisitos

- Node.js 22 o superior
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

El currículum vive como ruta interna del portafolio: `/curriculum` y `/en/curriculum` (`components/pages/curriculum-page.tsx`, componentes en `components/cv/`, datos en `lib/cv.ts`). El enlace «Currículum» apunta a `cvPath` en `lib/content.ts`.

## Formulario de contacto

La sección de contacto tiene un formulario (nombre, correo y mensaje) que usa [Netlify Forms](https://docs.netlify.com/forms/overview/): el formulario está en el HTML estático con `data-netlify="true"` y se envía con `fetch` sin salir de la página. Los mensajes llegan al panel de Netlify (Site → Forms).

Para que los mensajes también lleguen por correo a luisgasca0245@hotmail.com hay que activar la notificación en Netlify, una sola vez: **Site settings → Forms → Form notifications → Add notification → Email notification** y poner ese correo. Sin ese paso los mensajes solo se ven en el panel de Netlify.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación y export estático |
| `npm run lint` | ESLint |
| `npm run i18n:check` | Verifica que los textos estén completos en todos los idiomas |
| `npm run cv:pdf` | Regenera los PDF del currículum |

## Contacto publicado

- Correo: luisgasca0245@hotmail.com
- Teléfono: +52 56 10840382
- WhatsApp: https://wa.me/525610840382
- GitHub: https://github.com/LuisGasca11
- Currículum: `cvPath` en `lib/content.ts` y PDF en `public/cv/`
