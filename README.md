# Portafolio de Luis Alberto Aguilar Gasca

Sitio personal en español (México), construido con Next.js (App Router), TypeScript y Tailwind CSS. Se publica en Netlify como [portgasca.netlify.app](https://portgasca.netlify.app). `npm run build` genera un export estático en `out/`.

El contenido sale del CV y de la descripción de BLACK SHEEP NET. El sitio publica desarrollos, una presentación breve, habilidades técnicas, educación y contacto. No incluye teléfono ni empleos ajenos al desarrollo.

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

El enlace «Currículum» apunta a `cvUrl` en `lib/content.ts` (`https://cvgasca.netlify.app`). Si esa dirección cambia, edita solo esa constante.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación y export estático |
| `npm run lint` | ESLint |

## Contacto publicado

- Correo: luisgasca0245@hotmail.com
- GitHub: https://github.com/LuisGasca11
- Currículum: `cvUrl` en `lib/content.ts`
