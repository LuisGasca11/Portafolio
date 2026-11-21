import { useId } from "react";
import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

function BloomShapes({ hue = "#ff9db4", core = "#ffd98a" }: { hue?: string; core?: string }) {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={`${id}-p`} cx="0.5" cy="0.15" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.55" stopColor={hue} />
          <stop offset="1" stopColor={hue} stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id={`${id}-c`}>
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="1" stopColor={core} />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        {Array.from({ length: 8 }, (_, index) => (
          <path
            key={index}
            d="M0 -4 C-16 -14 -14 -40 0 -46 C14 -40 16 -14 0 -4Z"
            fill={`url(#${id}-p)`}
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="0.8"
            transform={`rotate(${index * 45})`}
          />
        ))}
        <circle r="9" fill={`url(#${id}-c)`} />
        <circle r="3" cx="-2" cy="-2" fill="#fff" fillOpacity="0.8" />
      </g>
    </>
  );
}

export function Bloom({ className, style, hue, core, animate = false }: ArtProps & { hue?: string; core?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true" overflow="visible" {...(animate ? { "data-bloom": "" } : {})}>
      <BloomShapes hue={hue} core={core} />
    </svg>
  );
}

export function Leaf({ className, style, flip = false }: ArtProps & { flip?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 70 40" className={className} style={{ ...style, transform: flip ? "scaleX(-1)" : style?.transform }} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f8a52" />
          <stop offset="1" stopColor="#8fe08a" />
        </linearGradient>
      </defs>
      <path d="M2 20 C14 -2 48 -4 68 20 C48 44 14 42 2 20Z" fill={`url(#${id})`} />
      <path d="M4 20 H62" stroke="#d6ffd0" strokeOpacity="0.5" strokeWidth="1.4" />
      <path d="M20 20 L34 9 M30 20 L44 10 M20 20 L34 31 M30 20 L44 30" stroke="#d6ffd0" strokeOpacity="0.28" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function Sprout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="jd-stem" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2f8a52" />
          <stop offset="1" stopColor="#a5f08e" />
        </linearGradient>
        <radialGradient id="jd-glow">
          <stop offset="0" stopColor="#ffe9a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle data-sprout-glow cx="100" cy="30" r="70" fill="url(#jd-glow)" opacity="0" />
      <path data-sprout-stem d="M100 260 C100 210 78 190 90 150 C102 110 108 84 100 50" fill="none" stroke="url(#jd-stem)" strokeWidth="7" strokeLinecap="round" />
      <g data-sprout-leaf style={{ transformOrigin: "92px 160px" }}>
        <path d="M92 160 C60 164 36 148 28 120 C58 118 84 130 92 160Z" fill="#5fbf6a" />
        <path d="M92 160 C70 150 52 138 36 124" fill="none" stroke="#d6ffd0" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>
      <g data-sprout-leaf style={{ transformOrigin: "100px 118px" }}>
        <path d="M100 118 C132 118 156 100 164 72 C134 72 108 88 100 118Z" fill="#7fd67a" />
        <path d="M100 118 C122 106 142 92 158 76" fill="none" stroke="#d6ffd0" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>
      <g data-sprout-bloom style={{ transformOrigin: "100px 46px" }}>
        <g transform="translate(70 16) scale(0.6)">
          <BloomShapes />
        </g>
      </g>
    </svg>
  );
}

export function Rings({ className }: { className?: string }) {
  const radii = [18, 32, 46, 60, 74, 88];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="#ffd98a" strokeLinecap="round">
      {radii.map((r, index) => (
        <ellipse key={r} data-ring cx="100" cy="100" rx={r + (index % 2) * 2} ry={r - (index % 3)} strokeWidth={index % 2 === 0 ? 2.2 : 1.2} strokeOpacity={0.35 + index * 0.1} transform={`rotate(${index * 9} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="4" fill="#ffd98a" stroke="none" />
    </svg>
  );
}

export function Sprig({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 80 160" className={className} style={style} aria-hidden="true">
      <path d="M40 158 C38 110 46 70 40 6" fill="none" stroke="#3b7a4a" strokeWidth="3" strokeLinecap="round" />
      {[22, 48, 76, 104].map((y, index) => (
        <g key={y}>
          <path d={`M40 ${y + 10} C${index % 2 === 0 ? 14 : 66} ${y + 6} ${index % 2 === 0 ? 8 : 72} ${y - 12} ${index % 2 === 0 ? 10 : 70} ${y - 22} C${index % 2 === 0 ? 30 : 50} ${y - 16} 40 ${y - 2} 40 ${y + 10}Z`} fill="#4e9a5c" opacity="0.9" />
        </g>
      ))}
      <circle cx="40" cy="8" r="6" fill="#e0709a" />
    </svg>
  );
}

export function Lantern({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 60 120" className={className} style={style} aria-hidden="true" overflow="visible">
      <circle cx="30" cy="74" r="44" fill="#ffd27a" opacity="0.22" />
      <path d="M30 0 V22" stroke="#d9b45a" strokeWidth="2" />
      <path d="M18 26 H42 L48 40 H12Z" fill="#7a5a1a" />
      <rect x="12" y="40" width="36" height="52" rx="8" fill="#ffd27a" fillOpacity="0.9" stroke="#d9b45a" strokeWidth="2.5" />
      <ellipse cx="30" cy="66" rx="7" ry="12" fill="#fff6c8" />
      <path d="M12 92 H48 L42 102 H18Z" fill="#7a5a1a" />
    </svg>
  );
}
