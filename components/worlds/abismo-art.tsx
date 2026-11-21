import { useId } from "react";
import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

export function Fish({ from = "#8ff0ff", to = "#1b8fb8", className, style }: ArtProps & { from?: string; to?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 92 46" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M66 23 L90 6 C85 16 85 30 90 40 Z" fill={to} opacity="0.9" />
      <path d="M30 9 C36 -2 47 -1 52 7 C44 8 37 9 30 9Z" fill={to} />
      <path d="M6 23 C18 4 50 2 68 23 C50 44 18 42 6 23Z" fill={`url(#${id}-b)`} />
      <path d="M12 26 C26 36 48 36 62 26" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 12 C25 21 25 26 30 35" fill="none" stroke="#04243a" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="19" r="3.2" fill="#fff" />
      <circle cx="18.4" cy="19" r="1.5" fill="#04243a" />
    </svg>
  );
}

export function Jellyfish({ color = "#ff7ee0", className, style }: ArtProps & { color?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 170" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`${id}-g`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor={color} stopOpacity="0.75" />
          <stop offset="1" stopColor={color} stopOpacity="0.15" />
        </radialGradient>
        <filter id={`${id}-f`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse cx="50" cy="38" rx="52" ry="40" fill={color} opacity="0.35" filter={`url(#${id}-f)`} />
      <g className="ab-bell">
        <path
          d="M8 58 C8 12 92 12 92 58 C84 52 78 60 70 54 C62 62 54 54 50 60 C46 54 38 62 30 54 C22 60 16 52 8 58Z"
          fill={`url(#${id}-g)`}
          stroke="#fff"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <circle cx="36" cy="38" r="4" fill="#fff" opacity="0.55" />
        <circle cx="58" cy="30" r="3" fill="#fff" opacity="0.45" />
        <circle cx="66" cy="44" r="2.4" fill="#fff" opacity="0.4" />
      </g>
      {[24, 38, 50, 62, 76].map((x, index) => (
        <path
          key={x}
          className="ab-tentacle"
          style={{ animationDelay: `${index * -0.6}s` }}
          d={`M${x} 58 C${x - 8} 84 ${x + 8} 104 ${x - 4} 130 C${x - 10} 146 ${x + 4} 158 ${x} 168`}
          fill="none"
          stroke={color}
          strokeOpacity="0.7"
          strokeWidth={index === 2 ? 3 : 1.8}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function Whale({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 420 170" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14577e" />
          <stop offset="1" stopColor="#06243b" />
        </linearGradient>
      </defs>
      <path
        d="M18 92 C52 18 226 8 306 62 C332 80 352 78 376 46 C370 82 376 112 402 132 C366 118 344 122 322 114 C252 152 96 164 18 92Z"
        fill={`url(#${id}-w)`}
      />
      <path d="M40 98 C110 134 210 138 290 108" fill="none" stroke="#7fd6ff" strokeOpacity="0.28" strokeWidth="6" strokeLinecap="round" />
      <path d="M150 120 C170 150 200 158 214 150 C200 140 184 130 176 118Z" fill="#0a3a5a" />
      <circle cx="62" cy="86" r="3" fill="#bff0ff" opacity="0.8" />
    </svg>
  );
}

export function Angler({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 210 170" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`${id}-l`}>
          <stop offset="0" stopColor="#fffbd0" />
          <stop offset="0.4" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12384f" />
          <stop offset="1" stopColor="#040f18" />
        </linearGradient>
      </defs>
      <path d="M104 44 C100 12 74 2 56 24" fill="none" stroke="#12384f" strokeWidth="3.5" strokeLinecap="round" />
      <circle className="ab-lure" cx="56" cy="26" r="26" fill={`url(#${id}-l)`} />
      <path
        d="M42 104 C30 52 100 30 142 62 C174 84 180 126 152 140 C112 160 52 154 42 104Z"
        fill={`url(#${id}-b)`}
        stroke="#7fd6ff"
        strokeOpacity="0.25"
      />
      <path d="M150 128 L196 150 L186 116 L204 96 L160 100Z" fill="#0a2536" />
      <path d="M42 104 L54 117 L60 103 L71 119 L79 105 L90 121 L98 108" fill="none" stroke="#dff7ff" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="68" cy="82" r="9" fill="#dff7ff" opacity="0.9" />
      <circle cx="66" cy="82" r="4" fill="#02101a" />
    </svg>
  );
}

export function Submarine({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 250 120" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#f0a000" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6c2" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="ab-beam" d="M214 56 L760 -90 L760 220 L214 70Z" fill={`url(#${id}-beam)`} />
      <rect x="104" y="14" width="46" height="30" rx="9" fill={`url(#${id}-h)`} />
      <path d="M128 14 V2 H146" fill="none" stroke="#c88400" strokeWidth="4" strokeLinecap="round" />
      <rect x="22" y="34" width="196" height="58" rx="29" fill={`url(#${id}-h)`} stroke="#b87600" strokeWidth="2" />
      {[70, 118, 166].map((x) => (
        <g key={x}>
          <circle cx={x} cy="63" r="14" fill="#b87600" />
          <circle cx={x} cy="63" r="10.5" fill="#7fe3ff" />
          <circle cx={x - 3} cy="60" r="3" fill="#fff" opacity="0.8" />
        </g>
      ))}
      <path d="M22 48 L2 38 L2 88 L22 78Z" fill="#c88400" />
      <g className="ab-prop" style={{ transformOrigin: "10px 63px" }}>
        <ellipse cx="10" cy="63" rx="3" ry="22" fill="#7a5200" />
      </g>
      <circle cx="214" cy="63" r="6" fill="#fff6c2" />
    </svg>
  );
}

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

export function Seaweed({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 40 150" className={className} style={style} aria-hidden="true">
      <path
        className="ab-sway"
        d="M20 150 C6 126 34 112 20 88 C6 64 34 50 20 26 C14 14 20 6 24 0"
        fill="none"
        stroke="#2fd39a"
        strokeOpacity="0.75"
        strokeWidth="7"
        strokeLinecap="round"
      />
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

export function Rov({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 90 150" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6c2" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="ab-beam" d="M30 46 L-10 150 L100 150 L60 46Z" fill={`url(#${id}-beam)`} />
      <rect x="14" y="10" width="62" height="14" rx="7" fill="#ff7a45" />
      <rect x="16" y="22" width="58" height="26" rx="9" fill="#ffd54a" stroke="#b87600" strokeWidth="2" />
      <circle cx="45" cy="35" r="8" fill="#7fe3ff" stroke="#b87600" strokeWidth="2" />
      <circle cx="43" cy="33" r="2.4" fill="#fff" opacity="0.85" />
      <circle cx="8" cy="36" r="7" fill="#3a4a55" />
      <circle cx="82" cy="36" r="7" fill="#3a4a55" />
      <circle cx="36" cy="48" r="4" fill="#fff6c2" />
      <circle cx="54" cy="48" r="4" fill="#fff6c2" />
      <path d="M45 24 V10" stroke="#b87600" strokeWidth="2" />
    </svg>
  );
}
