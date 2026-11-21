import type { CSSProperties, ReactNode } from "react";
import { chapterOf, zoneOf } from "@/components/abismo/data";
import type { ChapterId } from "@/components/abismo/data";

type ChapterProps = {
  id: ChapterId;
  /** Id del `<h2>` (la sección lo usa en `aria-labelledby`). */
  headingId: string;
  title: string;
  body: string;
  /** Texto después de la profundidad; por defecto, la zona oceánica. */
  zone?: string;
  tags?: readonly ReactNode[];
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Portada de un capítulo: ocupa más de una pantalla y su texto queda fijo
 * mientras la cámara 3D se lanza hacia el escenario del capítulo. El motor
 * de la escena lee `data-chapter` para saber dónde está cada parada.
 */
export function Chapter({ id, headingId, title, body, zone, tags }: ChapterProps) {
  const chapter = chapterOf(id);
  return (
    <div className="ab-chapter" data-chapter={id} style={{ "--ab-accent": chapter.accent } as CSSProperties}>
      <div className="ab-chapter-pin">
        <div className="ab-chapter-copy" data-chapter-copy>
          <p className="ab-chapter-meta" data-chapter-line>
            <span className="tabular-nums">
              {pad(chapter.index + 1)} / {pad(chapter.total)}
            </span>
            <span aria-hidden="true" className="ab-chapter-rule" />
            <span>
              {chapter.meters.toLocaleString("es-MX")} m · {zone ?? zoneOf(chapter.meters)}
            </span>
          </p>
          <h2 id={headingId} className="ab-display ab-chapter-title" data-chapter-line>
            {title}
          </h2>
          <p className="ab-chapter-body" data-chapter-line>
            {body}
          </p>
          {tags !== undefined && tags.length > 0 ? (
            <ul className="ab-chapter-tags" data-chapter-line>
              {tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
