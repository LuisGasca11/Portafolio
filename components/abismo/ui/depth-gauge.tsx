import { maxDepth } from "@/components/abismo/data";

/** Medidor vertical de profundidad (escritorio). Lo actualiza `useAbismoEffects`. */
export function DepthGauge() {
  return (
    <div className="ab-gauge" aria-hidden="true">
      <span>PROF.</span>
      <div className="ab-gauge-track">
        <span className="ab-gauge-mark" style={{ top: `${(200 / maxDepth) * 100}%` }}>200 m</span>
        <span className="ab-gauge-mark" style={{ top: `${(1000 / maxDepth) * 100}%` }}>1,000 m</span>
        <span className="ab-gauge-dot" data-gauge-dot />
      </div>
      <span data-gauge-text className="tabular-nums">0 m</span>
      <span data-zone-text className="max-w-[5.5rem] text-center text-[0.55rem] leading-tight opacity-75">Zona de luz</span>
    </div>
  );
}
