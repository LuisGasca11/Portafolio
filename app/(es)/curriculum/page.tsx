import { CurriculumPage } from "@/components/pages/curriculum-page";
import { curriculumMetadata } from "@/lib/seo";

export const metadata = curriculumMetadata("es");

export default function Page() {
  return <CurriculumPage locale="es" />;
}
