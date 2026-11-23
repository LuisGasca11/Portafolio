"use client";

import type { ReactNode } from "react";
import { useT } from "@/components/shared/locale-provider";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  const t = useT();
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> {t("common.opensInNewTab")}</span>
    </a>
  );
}
