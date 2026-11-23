import { cvPdf } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { createT } from "@/lib/i18n";

type DownloadButtonProps = {
  locale: Locale;
  className?: string;
};

/** Descarga el PDF del currículum en el idioma de la página. */
export function DownloadButton({ locale, className }: DownloadButtonProps) {
  const t = createT(locale);
  return (
    <a href={cvPdf[locale].href} download={cvPdf[locale].file} lang={locale} className={className}>
      {t("common.downloadCv")}
    </a>
  );
}
