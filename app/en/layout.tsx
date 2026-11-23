import type { ReactNode } from "react";
import { RootShell } from "@/components/shared/root-shell";
import { rootMetadata, viewport } from "@/lib/seo";

export const metadata = rootMetadata("en");
export { viewport };

export default function Layout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
