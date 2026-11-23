"use client";

import { zoneOf } from "@/components/abismo/data";
import { useLocale, useT } from "@/components/shared/locale-provider";
import { tagOf } from "@/lib/i18n";

type SectionHeadingProps = {
  /** Id del `<h2>` (la sección lo usa en `aria-labelledby`). */
  id: string;
  meters: number;
  title: string;
  /** Texto después de la profundidad; por defecto, la zona oceánica. */
  zone?: string;
  intro?: string;
  size?: "md" | "lg" | "xl";
};

const sizes = {
  md: "text-4xl sm:text-5xl",
  lg: "text-4xl sm:text-6xl",
  xl: "text-5xl sm:text-7xl",
} as const;

/** Encabezado de sección: profundidad y zona, título e introducción. */
export function SectionHeading({ id, meters, title, zone, intro, size = "lg" }: SectionHeadingProps) {
  const t = useT();
  const locale = useLocale();
  return (
    <>
      <p className="ab-depth" data-reveal>
        — {meters.toLocaleString(tagOf(locale))} m · {zone ?? zoneOf(meters, t)}
      </p>
      <h2 id={id} className={`ab-display mt-4 font-light tracking-tight ${sizes[size]}`}>
        {title}
      </h2>
      {intro !== undefined ? <p className="mt-4 max-w-xl text-cyan-50/80">{intro}</p> : null}
    </>
  );
}
