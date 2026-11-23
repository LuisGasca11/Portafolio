/* Punto de entrada que esbuild empaqueta para `render.mjs`: expone los datos
 * del currículum y los textos tal como los usa el sitio. */
export { getCv } from "@/lib/cv";
export { cvPdf } from "@/lib/content";
export { createT, locales, tagOf } from "@/lib/i18n";
