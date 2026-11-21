/** Divisor entre secciones: dos olas de la termoclina con una etiqueta. */
export function Thermocline({ label }: { label: string }) {
  const wave = "M0 20 Q 100 0 200 20 T400 20 T600 20 T800 20 T1000 20 T1200 20";
  return (
    <div aria-hidden="true" className="mx-auto max-w-5xl px-5">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="ab-thermo h-8 w-full" data-reveal>
        <defs>
          <linearGradient id="ab-thermo-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7ee8ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7ee8ff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7ee8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={wave} />
        <path d={wave} transform="translate(0 8)" opacity="0.45" />
      </svg>
      <p className="-mt-1 text-center text-[0.6rem] tracking-[0.35em] text-cyan-100/55 uppercase">{label}</p>
    </div>
  );
}
