"use client";

type PrintButtonProps = {
  className?: string;
};

export function PrintButton({ className }: PrintButtonProps) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      Imprimir CV
    </button>
  );
}
