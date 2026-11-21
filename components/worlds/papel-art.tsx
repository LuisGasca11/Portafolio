import { useId } from "react";
import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

export function Marigold({ className, style }: ArtProps) {
  const rings = [
    { n: 14, r: 31, rx: 9, ry: 21, fill: "#ff8c00" },
    { n: 11, r: 22, rx: 8.5, ry: 17, fill: "#ffa51f" },
    { n: 8, r: 13, rx: 7, ry: 12, fill: "#ffc23c" },
  ];
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      {rings.map((ring) => (
        <g key={ring.n} transform="translate(60 60)">
          {Array.from({ length: ring.n }, (_, index) => (
            <ellipse
              key={index}
              cx="0"
              cy={-ring.r}
              rx={ring.rx}
              ry={ring.ry}
              fill={ring.fill}
              stroke="#c95f00"
              strokeOpacity="0.35"
              strokeWidth="1"
              transform={`rotate(${(360 / ring.n) * index + (ring.n === 11 ? 8 : 0)})`}
            />
          ))}
        </g>
      ))}
      <circle cx="60" cy="60" r="6" fill="#a63d00" />
    </svg>
  );
}

export function Sun({ className, style }: ArtProps) {
  const rays = Array.from({ length: 28 }, (_, index) => index);
  return (
    <svg viewBox="0 0 300 300" className={className} style={style} aria-hidden="true">
      <g transform="translate(150 150)">
        {rays.map((index) => (
          <polygon
            key={index}
            points={`-9,-96 9,-96 0,${index % 2 === 0 ? -146 : -128}`}
            fill={index % 2 === 0 ? "#ff7a3c" : "#ffb53d"}
            transform={`rotate(${(360 / rays.length) * index})`}
          />
        ))}
        <circle r="92" fill="#ff9e2c" />
        <circle r="72" fill="#ffc83d" />
        <circle r="48" fill="#ffe27a" />
      </g>
    </svg>
  );
}

const houses = [
  { x: 40, w: 90, h: 70, roof: "flat" },
  { x: 150, w: 70, h: 96, roof: "gable" },
  { x: 250, w: 110, h: 64, roof: "flat" },
  { x: 380, w: 80, h: 110, roof: "gable" },
  { x: 480, w: 120, h: 76, roof: "flat" },
  { x: 640, w: 96, h: 90, roof: "gable" },
  { x: 760, w: 80, h: 120, roof: "flat" },
  { x: 860, w: 110, h: 70, roof: "gable" },
  { x: 1000, w: 90, h: 100, roof: "flat" },
  { x: 1110, w: 100, h: 74, roof: "gable" },
  { x: 1230, w: 80, h: 92, roof: "flat" },
  { x: 1330, w: 90, h: 68, roof: "gable" },
];

export function Landscape({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="pp-layer absolute inset-0 h-full w-full" data-parallax="2.4">
        <polygon points="0,420 0,310 160,250 280,210 380,130 430,96 478,118 540,190 650,236 790,214 890,160 960,112 1012,92 1062,124 1130,196 1250,256 1440,290 1440,420" fill="#b5179e" />
        <polygon points="380,130 430,96 478,118 440,134 410,126" fill="#ffe9c4" />
        <polygon points="960,112 1012,92 1062,124 1022,138 990,126" fill="#ffe9c4" />
      </svg>
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="pp-layer absolute inset-0 h-full w-full" data-parallax="1.5">
        <polygon points="0,420 0,300 130,258 270,286 430,236 610,288 770,244 950,296 1130,250 1300,288 1440,266 1440,420" fill="#7209b7" />
      </svg>
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="pp-layer absolute inset-0 h-full w-full" data-parallax="0.9">
        <rect x="0" y="330" width="1440" height="90" fill="#3a0ca3" />
        {houses.map((house) => (
          <g key={house.x}>
            {house.roof === "gable" ? (
              <polygon points={`${house.x - 6},${330 - house.h} ${house.x + house.w / 2},${330 - house.h - 30} ${house.x + house.w + 6},${330 - house.h}`} fill="#3a0ca3" />
            ) : null}
            <rect x={house.x} y={330 - house.h} width={house.w} height={house.h + 4} fill="#3a0ca3" />
            <rect x={house.x + house.w * 0.18} y={330 - house.h + 18} width="14" height="20" fill="#ffd24a" />
            <rect x={house.x + house.w * 0.58} y={330 - house.h + 18} width="14" height="20" fill="#ffb53d" />
          </g>
        ))}
        <path d="M560 330 V230 C560 200 600 190 600 160 C600 190 640 200 640 230 V330Z" fill="#2a0a7a" />
        <rect x="596" y="130" width="8" height="34" fill="#2a0a7a" />
      </svg>
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="pp-layer absolute inset-0 h-full w-full" data-parallax="0.2">
        <polygon points="0,420 0,360 180,336 380,364 600,340 840,368 1060,338 1260,364 1440,346 1440,420" fill="#240046" />
      </svg>
    </div>
  );
}

const flagPalette = ["#e6007e", "#00b8a9", "#ffc400", "#7a2cbf", "#ff6a00"];

export function Banners({ count = 12, className, palette = flagPalette }: { count?: number; className?: string; palette?: readonly string[] }) {
  const id = useId();
  return (
    <svg viewBox={`0 0 ${count * 120} 170`} preserveAspectRatio="xMidYMin slice" className={className} aria-hidden="true">
      <path
        d={`M0 8 Q${(count * 120) / 2} 44 ${count * 120} 8`}
        fill="none"
        stroke="#5b1030"
        strokeOpacity="0.5"
        strokeWidth="2.5"
      />
      {Array.from({ length: count }, (_, index) => {
        const x = index * 120 + 12;
        const u = (index + 0.5) / count - 0.5;
        const y = 8 + 36 * (1 - 4 * u * u) * 0.5 + 6;
        const color = palette[index % palette.length] ?? "#e6007e";
        const teeth = Array.from({ length: 8 }, (_, tooth) => `L${x + 96 - (tooth + 0.5) * 12},${y + 132} L${x + 96 - (tooth + 1) * 12},${y + 118}`).join(" ");
        const diamonds = [0, 1, 2, 3, 4, 5]
          .flatMap((d) => [28, 108].map((dy) => `M${x + 14 + d * 13.5},${y + dy - 7} l5,7 l-5,7 l-5,-7Z`))
          .join(" ");
        return (
          <g key={`${id}-${index}`} className="pp-swing" style={{ animationDelay: `${index * -0.45}s`, transformOrigin: `${x + 48}px ${y}px` }}>
            <path
              fillRule="evenodd"
              fill={color}
              d={`M${x},${y} H${x + 96} V${y + 118} ${teeth} Z M${x + 48},${y + 38} m-26,0 a26,26 0 1,0 52,0 a26,26 0 1,0 -52,0 M${x + 48},${y + 38} m-17,0 a17,17 0 1,1 34,0 a17,17 0 1,1 -34,0 ${diamonds}`}
              style={{ filter: "drop-shadow(0 5px 3px rgba(70,10,30,0.28))" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function Zigzag({ color, flip = false, className }: { color: string; flip?: boolean; className?: string }) {
  const teeth = 60;
  const points = ["0,40", ...Array.from({ length: teeth * 2 + 1 }, (_, index) => `${(index * 1440) / (teeth * 2)},${index % 2 === 0 ? 40 : 6}`), "1440,40"].join(" ");
  return (
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className={className} style={flip ? { transform: "scaleY(-1)" } : undefined} aria-hidden="true">
      <polygon points={points} fill={color} />
    </svg>
  );
}

export function Kite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true" overflow="visible">
      <g style={{ filter: "drop-shadow(0 6px 4px rgba(60,10,30,0.3))" }}>
        <polygon points="60,0 118,66 60,130" fill="#e6007e" />
        <polygon points="60,0 2,66 60,130" fill="#ffc400" />
        <polygon points="60,0 118,66 60,66" fill="#ff6a00" />
        <polygon points="60,130 2,66 60,66" fill="#00b8a9" />
        <path d="M60 0 V130 M2 66 H118" stroke="#fff6e5" strokeWidth="2.5" />
      </g>
      <path d="M60 130 C48 150 72 166 58 188 C50 200 64 210 60 220" fill="none" stroke="#5b1030" strokeOpacity="0.6" strokeWidth="2" />
      {[[56, 152, "#e6007e"], [64, 174, "#00b8a9"], [57, 196, "#ffc400"]].map(([x, y, fill]) => (
        <polygon key={String(y)} points={`${Number(x) - 9},${Number(y) - 6} ${Number(x) + 9},${Number(y) + 6} ${Number(x) + 9},${Number(y) - 6} ${Number(x) - 9},${Number(y) + 6}`} fill={String(fill)} />
      ))}
    </svg>
  );
}

export function Star({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <polygon points="20,0 25,15 40,20 25,25 20,40 15,25 0,20 15,15" fill="#ffe27a" />
    </svg>
  );
}
