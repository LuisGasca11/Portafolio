import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { MotionEffects } from "@/components/motion-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { personJsonLd, site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const pageTitle = `${site.name} | ${site.shortTitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s | ${site.name}`,
  },
  description: site.about,
  applicationName: `Portafolio de ${site.name}`,
  authors: [{ name: site.name, url: site.githubUrl }],
  creator: site.name,
  keywords: [
    "Luis Alberto Aguilar Gasca",
    "ingeniero en TIC",
    "desarrollador full stack",
    "Next.js",
    "TypeScript",
    "React",
    "Vue.js",
    "Laravel",
    "PHP",
    "Expo",
    "React Native",
    "Microsip",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: site.url,
    siteName: site.name,
    title: pageTitle,
    description: site.about,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: site.about,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

  return (
    <html lang="es-MX" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Saltar al contenido
        </a>
        <SmoothScroll>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <MotionEffects />
        </SmoothScroll>
      </body>
    </html>
  );
}
