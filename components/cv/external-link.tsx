import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
