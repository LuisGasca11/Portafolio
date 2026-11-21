# Portafolio de Luis Alberto Aguilar Gasca

Sitio personal en español (México), construido con Next.js (App Router), TypeScript y Tailwind CSS. Se publica en Netlify y vivirá en [lgasca.dev](https://lgasca.dev). El dominio aún no está comprado: mientras tanto el sitio sigue en [portgasca.netlify.app](https://portgasca.netlify.app). `npm run build` genera un export estático en `out/`.

El contenido sale del CV y de la descripción de BLACK SHEEP NET. Black Sheep Labs y Grupo Fyttsa son la misma empresa y se muestra como Black Sheep Labs “Grupo Fyttsa” (`company` en `lib/content.ts`); las apps de Google Play enlazan a la página de desarrollador de la empresa (`playStoreUrl`). El sitio publica desarrollos, una presentación breve, habilidades técnicas, educación y contacto. El teléfono se publica en la sección de contacto. No incluye empleos ajenos al desarrollo: esos están en la ruta `/curriculum`.

La portada es un descenso al océano con scroll («Abismo»), en 3D con Three.js, contado como un recorrido continuo por capítulos (inspirado en el estilo «scroll world»). Cada sección abre con una portada (profundidad, título grande, una línea y etiquetas) que queda fija mientras la cámara, siempre descendiendo, rodea en espiral el escenario 3D de ese capítulo y sigue hacia el siguiente. Una estela de plancton bioluminiscente une los escenarios y marca el camino; la sombra detrás del texto es una capa fija, así no hay bordes entre secciones. En móvil los desarrollos son un carrusel deslizable, los paneles no usan desenfoque de fondo y la escena baja su resolución si el equipo no alcanza a dibujarla con fluidez:

| Capítulo | Profundidad | Escenario |
| --- | --- | --- |
| Sobre mí | 40 m | Arco de arrecife con corales |
| Desarrollos | 180 m | Estación de investigación con domo de cristal |
| Experiencia | 520 m | Barco hundido con portillas encendidas |
| Habilidades | 880 m | Jardín bioluminiscente |
| Educación | 1,040 m | Chimeneas hidrotermales |
| Contacto | 1,200 m | Faro sonar y mensaje en una botella |

Alrededor siguen la nieve marina, cardúmenes, medusas, mantarrayas, tortugas, tiburones, calamares, algas y cangrejos. A la derecha, una ruta con un punto por capítulo, la profundidad y la zona; arriba, una barra de progreso del color del capítulo (cada capítulo tiene su acento). En móvil, el encabezado muestra el capítulo y la profundidad, y la escena usa menos criaturas y menor resolución.

Si el dispositivo no tiene WebGL se usa el fondo CSS con ilustraciones SVG; con «reducir movimiento» no hay escena 3D y las portadas de capítulo ocupan solo su contenido. Orden de la página: Hero → Sobre mí → Desarrollos → Experiencia → Habilidades → Educación → Contacto.

### Estructura del código

```
app/                      rutas (inicio y /curriculum) y layout raíz
components/
  abismo/                 la portada
    abismo.tsx            composición de la página
    sections/             una sección por archivo (hero, about, projects, experience, skills, education, contact)
    ui/                   piezas compartidas (portada de capítulo, ruta y progreso, encabezado y menú, burbujas, formulario, video)
    scene/                escena 3D: engine.ts arma el mundo y mueve la cámara; cada capa (snow, rays, fish, jellyfish, manta, turtle, shark, squid, seabed…) es un módulo y landmarks.ts tiene los escenarios de los capítulos y trail.ts la estela de plancton
    art/                  ilustraciones SVG (creatures.tsx, flora.tsx)
    hooks/                efectos de scroll (GSAP) y movimiento reducido
    data.ts               capítulos (profundidad y acento), zonas oceánicas y configuración de las burbujas
  transition/             transición de vista con burbujas y animales (Framer Motion)
  cv/                     la ruta /curriculum (con su encabezado, pie y efectos)
  shared/                 enlace externo, icono de tecnología, scroll suave
lib/                      contenido (content.ts, cv.ts) y datos de iconos (tech-icons.ts)
tools/                    generadores del video ambiental y de los iconos
```

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
