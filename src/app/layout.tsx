import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { spaceGrotesk, hankenGrotesk, jetbrainsMono } from "./fonts";
import AuthProvider from "./components/AuthProvider";
import SavedProvider from "./components/SavedProvider";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TodoMotor Uruguay | Fichas Técnicas de Vehículos",
    template: "%s | TodoMotor Uruguay",
  },
  description: "Encontrá las fichas técnicas completas de autos, SUVs, camionetas y motos disponibles en Uruguay. Especificaciones, precios y equipamiento.",
  keywords: "autos uruguay, motos uruguay, fichas técnicas, precios autos, suvs, camionetas",
  openGraph: {
    title: "TodoMotor Uruguay",
    description: "Fichas técnicas de vehículos en Uruguay",
    type: "website",
    siteName: SITE_NAME,
    locale: "es_UY",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "TodoMotor Uruguay",
    description: "Fichas técnicas de vehículos en Uruguay",
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
  },
  alternates: {
    canonical: "/",
    types: {
      'application/rss+xml': [
        { url: '/blog/rss.xml', title: 'Noticias del Motor — TodoMotor Uruguay' },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <SavedProvider>
            <SiteHeader />
            <main className="min-h-screen">
              {children}
            </main>
            <SiteFooter />
          </SavedProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
