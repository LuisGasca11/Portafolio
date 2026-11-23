type ContactIconProps = {
  kind: "mail" | "phone" | "web";
  /** Lado del círculo en rem; igual que `TechIcon` para que se vean parejos. */
  size?: number;
  className?: string;
};

const paths = {
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M6 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2L20 13v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-3z",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
} as const;

/** Icono de contacto (correo, teléfono, web) en una perla blanca, igual que los de tecnologías. */
export function ContactIcon({ kind, size = 1.7, className = "" }: ContactIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] ${className}`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
    >
      <svg
        viewBox="0 0 24 24"
        style={{ width: `${size * 0.6}rem`, height: `${size * 0.6}rem` }}
        fill="none"
        stroke="#0a6f94"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={paths[kind]} />
      </svg>
    </span>
  );
}
