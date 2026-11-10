import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-24">
      <p className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">404</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight">Esta página no existe</h1>
      <p className="mt-4 max-w-xl text-muted">
        El enlace no corresponde a ninguna sección del portafolio.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
