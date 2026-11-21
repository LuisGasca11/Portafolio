import { getTechIcon } from "@/lib/tech-icons";

type TechIconProps = {
  /** Nombre de la tecnología tal como aparece en `lib/content.ts`. */
  name: string;
  /** Lado del círculo en rem. */
  size?: number;
  className?: string;
};

/**
 * Icono de una tecnología dentro de una perla blanca, para que se lea igual
 * sobre fondos claros y oscuros. Si no hay icono, no pinta nada.
 */
export function TechIcon({ name, size = 1.5, className = "" }: TechIconProps) {
  const icon = getTechIcon(name);
  if (icon === undefined) {
    return null;
  }
  const color = `#${icon.hex}`;
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] ${className}`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
    >
      <svg viewBox="0 0 24 24" style={{ width: `${size * 0.62}rem`, height: `${size * 0.62}rem` }}>
        {icon.path !== undefined ? <path d={icon.path} fill={color} /> : null}
        {icon.strokes !== undefined ? (
          <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon.strokes.map((stroke) => (
              <path key={stroke} d={stroke} />
            ))}
          </g>
        ) : null}
      </svg>
    </span>
  );
}
