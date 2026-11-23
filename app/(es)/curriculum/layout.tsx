import type { ReactNode } from "react";
import { CurriculumShell } from "@/components/pages/curriculum-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <CurriculumShell locale="es">{children}</CurriculumShell>;
}
