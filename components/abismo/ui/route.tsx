import type { CSSProperties } from "react";
import { chapters } from "@/components/abismo/data";

/**
 * Ruta del descenso (escritorio): un punto por capítulo, con su nombre y
 * profundidad, más la lectura de profundidad actual. Arriba, una barra de
 * progreso del color del capítulo. `useAbismoEffects` marca el activo.
 */
export function Route() {
  return (
    <>
      <div className="ab-progress" aria-hidden="true">
        <span data-progress />
      </div>
      <nav className="ab-route" aria-label="Capítulos del descenso">
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                data-route={chapter.id}
                className="ab-route-dot"
                style={{ "--ab-accent": chapter.accent } as CSSProperties}
              >
                <span className="ab-route-label">
                  {chapter.label}
                  <small>{chapter.meters.toLocaleString("es-MX")} m</small>
                </span>
                <i aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
        <p className="ab-route-readout" aria-hidden="true">
          <span data-gauge-text className="tabular-nums">0 m</span>
          <span data-zone-text>Zona de luz</span>
        </p>
      </nav>
    </>
  );
}
