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

export function Turtle({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 220 130" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`${id}-s`} cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#c7e58a" />
          <stop offset="0.6" stopColor="#5f9b4a" />
          <stop offset="1" stopColor="#2f5d3a" />
        </radialGradient>
      </defs>
      <g className="ab-flap" style={{ transformOrigin: "120px 64px" }}>
        <path d="M118 60 C128 20 170 6 196 14 C176 32 160 52 134 70Z" fill="#6aa86a" />
      </g>
      <g className="ab-flap2" style={{ transformOrigin: "120px 70px" }}>
        <path d="M118 74 C128 112 170 126 196 118 C176 100 160 82 134 64Z" fill="#5a965c" />
      </g>
      <path d="M72 64 C50 62 36 70 28 82 C46 78 62 78 78 74Z" fill="#6aa86a" />
      <path d="M40 66 C30 60 14 62 6 68 C8 78 22 84 40 78Z" fill="#8fc77a" />
      <circle cx="14" cy="70" r="2.6" fill="#10331f" />
      <ellipse cx="116" cy="66" rx="68" ry="38" fill={`url(#${id}-s)`} stroke="#2a4f31" strokeWidth="2" />
      <path d="M78 66 L100 44 L134 44 L156 66 L134 88 L100 88Z" fill="none" stroke="#2a4f31" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M100 44 L96 30 M134 44 L138 30 M100 88 L96 102 M134 88 L138 102 M78 66 L62 66 M156 66 L172 66" stroke="#2a4f31" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M176 66 C190 68 200 72 208 80 C196 82 184 78 176 74Z" fill="#6aa86a" />
    </svg>
  );
}

export function Manta({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 260 120" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c4a6e" />
          <stop offset="1" stopColor="#0f2238" />
        </linearGradient>
      </defs>
      <path d="M130 8 C150 10 168 24 252 46 C206 50 172 62 150 84 C142 94 138 104 130 112 C122 104 118 94 110 84 C88 62 54 50 8 46 C92 24 110 10 130 8Z" fill={`url(#${id}-m)`} />
      <path d="M130 112 C132 128 136 142 140 154" fill="none" stroke="#0f2238" strokeWidth="3" strokeLinecap="round" />
      <path d="M122 14 C112 22 108 30 112 36 M138 14 C148 22 152 30 148 36" fill="none" stroke="#9fd0f0" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="118" cy="30" r="2" fill="#dff4ff" />
      <circle cx="142" cy="30" r="2" fill="#dff4ff" />
      <path d="M60 52 C96 56 112 70 124 84" fill="none" stroke="#9fd0f0" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Shark({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 320 120" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f6f88" />
          <stop offset="0.6" stopColor="#6f8da3" />
          <stop offset="1" stopColor="#e7f3f8" />
        </linearGradient>
      </defs>
      <path d="M270 58 C290 40 306 22 314 6 C308 34 306 50 308 64 C310 80 312 100 318 116 C304 102 288 84 270 70Z" fill="#4a677d" />
      <path d="M118 30 C126 10 138 0 152 -2 C152 12 154 22 160 32Z" fill="#46637a" />
      <path d="M14 58 C50 28 130 20 210 34 C250 42 272 52 274 64 C272 76 250 86 210 92 C130 104 50 92 14 58Z" fill={`url(#${id}-s)`} />
      <path d="M130 84 C128 104 118 116 104 120 C108 106 114 94 120 88Z" fill="#4a677d" />
      <path d="M44 64 C60 72 82 76 102 76" fill="none" stroke="#1f3344" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 58 L36 66 L42 56 L52 66" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="58" cy="52" r="4" fill="#0b1b27" />
      <path d="M150 52 C150 60 152 68 156 74 M160 52 C160 60 162 68 166 74 M170 52 C170 60 172 68 176 74" fill="none" stroke="#1f3344" strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  );
}

export function Octopus({ className, style, color = "#ff7a9c" }: ArtProps & { color?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 140 170" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id={`${id}-o`} cx="0.4" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#ffd0dc" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="#a3375a" />
        </radialGradient>
      </defs>
      {[16, 36, 56, 76, 96, 116].map((x, index) => (
        <path
          key={x}
          className="ab-tentacle"
          style={{ animationDelay: `${index * -0.5}s`, transformOrigin: `${x}px 80px` }}
          d={`M${x} 78 C${x - 14} 104 ${x + 16} 124 ${x - 6} 148 C${x - 14} 158 ${x - 2} 166 ${x + 6} 160`}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      ))}
      <path d="M18 78 C8 20 40 0 70 0 C100 0 132 20 122 78 C110 88 30 88 18 78Z" fill={`url(#${id}-o)`} />
      <circle cx="50" cy="62" r="9" fill="#fff" />
      <circle cx="90" cy="62" r="9" fill="#fff" />
      <circle cx="52" cy="64" r="4.5" fill="#33121f" />
      <circle cx="88" cy="64" r="4.5" fill="#33121f" />
      <circle cx="40" cy="28" r="3" fill="#ffd0dc" opacity="0.7" />
      <circle cx="58" cy="20" r="2" fill="#ffd0dc" opacity="0.7" />
    </svg>
  );
}

export function Seahorse({ className, style }: ArtProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 90 160" className={className} style={style} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd98a" />
          <stop offset="1" stopColor="#ff8a4a" />
        </linearGradient>
      </defs>
      <path d="M52 10 C34 4 22 16 24 30 C14 32 4 36 2 40 C10 40 20 40 26 40 C28 56 36 66 36 84 C36 108 20 112 20 130 C20 146 38 152 46 142 C38 142 32 136 36 128 C42 114 58 108 58 84 C58 68 50 60 54 44 C62 40 64 28 60 20Z" fill={`url(#${id}-h)`} stroke="#c4561f" strokeOpacity="0.4" strokeWidth="1.5" />
      <path d="M30 56 C42 62 50 70 52 82 M28 80 C40 84 48 92 48 100" fill="none" stroke="#c4561f" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <path className="ab-bell" d="M58 70 C74 66 84 74 80 90 C78 98 68 100 62 94" fill="#ffb06a" opacity="0.8" />
      <circle cx="44" cy="22" r="3.4" fill="#33121f" />
      <path d="M36 12 L32 2 M42 8 L42 -2 M48 8 L52 -1" stroke="#ff8a4a" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Crab({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} aria-hidden="true" overflow="visible">
      <g fill="none" stroke="#e8553a" strokeWidth="4" strokeLinecap="round">
        <path d="M32 50 L12 60 L8 72 M36 56 L20 70 L18 78 M84 50 L104 60 L108 72 M80 56 L96 70 L98 78" />
      </g>
      <path className="ab-flap" style={{ transformOrigin: "30px 34px" }} d="M32 36 C16 30 6 20 8 8 C16 12 22 16 26 12 C28 22 34 26 40 28Z" fill="#ff6a4a" />
      <path className="ab-flap2" style={{ transformOrigin: "90px 34px" }} d="M88 36 C104 30 114 20 112 8 C104 12 98 16 94 12 C92 22 86 26 80 28Z" fill="#ff6a4a" />
      <ellipse cx="60" cy="48" rx="34" ry="22" fill="#ff7a52" stroke="#c43c24" strokeWidth="2" />
      <path d="M44 44 C52 38 68 38 76 44" fill="none" stroke="#ffb59e" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 28 V20 M70 28 V20" stroke="#c43c24" strokeWidth="3" />
      <circle cx="50" cy="18" r="5" fill="#fff" />
      <circle cx="70" cy="18" r="5" fill="#fff" />
      <circle cx="51" cy="19" r="2.4" fill="#222" />
      <circle cx="69" cy="19" r="2.4" fill="#222" />
    </svg>
  );
}

export function Starfish({ className, style, color = "#ff8f5a" }: ArtProps & { color?: string }) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 10 - Math.PI / 2;
    const radius = index % 2 === 0 ? 46 : 18;
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <polygon points={points} fill={color} stroke="#b4431c" strokeWidth="3" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((arm) => (
        <circle key={arm} cx={50 + Math.cos((Math.PI * 2 * arm) / 5 - Math.PI / 2) * 26} cy={50 + Math.sin((Math.PI * 2 * arm) / 5 - Math.PI / 2) * 26} r="2.6" fill="#ffd2b8" />
      ))}
    </svg>
  );
}
