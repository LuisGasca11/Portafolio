import { useId } from "react";
import type { ArtProps } from "./types";

export function Coral({ color = "#ff6bd6", className, style }: ArtProps & { color?: string }) {
  return (
    <svg viewBox="0 0 90 130" className={className} style={style} aria-hidden="true" overflow="visible">
      <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round">
        <path d="M45 130 V70 M45 96 C30 90 24 78 22 56 M45 82 C60 76 66 62 68 40 M22 56 C22 44 26 36 30 28 M68 40 C68 30 66 22 64 14" />
      </g>
      <g fill={color}>
        <circle cx="30" cy="26" r="6" />
        <circle cx="64" cy="12" r="6" />
        <circle cx="45" cy="68" r="6" />
      </g>
    </svg>
  );
}

/** Alga laminaria: un grupo de frondas con degradado, nervadura y flotadores. */
export function Seaweed({ className, style, hue = 150 }: ArtProps & { hue?: number }) {
  const id = useId();
  const blade = "M0 0 C-15 -42 13 -84 -5 -124 C-16 -152 9 -174 0 -200 C7 -174 24 -152 13 -122 C28 -84 3 -42 15 0Z";
  const rib = "M7 0 C-3 -42 10 -84 3 -124 C-3 -152 6 -174 0 -198";
  const blades = [
    { x: 38, rot: -12, sx: 0.9, sy: 0.82, delay: 0 },
    { x: 46, rot: 9, sx: 1, sy: 1, delay: -1.4 },
    { x: 54, rot: 24, sx: 0.8, sy: 0.7, delay: -2.6 },
    { x: 30, rot: -26, sx: 0.7, sy: 0.6, delay: -3.5 },
  ];
  return (
    <svg viewBox="0 0 90 210" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={`hsl(${hue + 10} 70% 22%)`} />
          <stop offset="0.55" stopColor={`hsl(${hue} 65% 38%)`} />
          <stop offset="1" stopColor={`hsl(${hue - 20} 90% 66%)`} />
        </linearGradient>
      </defs>
      {blades.map((item) => (
        <g key={item.x} transform={`translate(${item.x} 208) rotate(${item.rot}) scale(${item.sx} ${item.sy})`}>
          <g className="ab-sway" style={{ animationDelay: `${item.delay}s`, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
            <path d={blade} fill={`url(#${id}-g)`} stroke="#d6ffe9" strokeOpacity="0.28" strokeWidth="1.2" />
            <path d={rib} fill="none" stroke="#d6ffe9" strokeOpacity="0.32" strokeWidth="1.4" strokeLinecap="round" />
            {[-70, -105, -140].map((y, index) => (
              <circle key={y} cx={index % 2 === 0 ? 9 : -7} cy={y} r="4.2" fill={`hsl(${hue - 25} 85% 62%)`} opacity="0.85" />
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}

export function Waves({ className }: { className?: string }) {
  const crest = "M0 64 Q90 16 180 64 T360 64 T540 64 T720 64 T900 64 T1080 64 T1260 64 T1440 64 T1620 64 T1800 64 T1980 64 T2160 64 T2340 64 T2520 64 T2700 64 T2880 64 V0 H0Z";
  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 2880 120" className="ab-wave h-full w-[2880px] max-w-none" preserveAspectRatio="none">
        <path d={crest} fill="rgba(255,255,255,0.22)" />
      </svg>
    </div>
  );
}

