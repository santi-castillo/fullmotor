import type { Metadata } from "next";
import "./globals.css";
import { spaceGrotesk, hankenGrotesk, jetbrainsMono } from "./fonts";
import AuthProvider from "./components/AuthProvider";
import SavedProvider from "./components/SavedProvider";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL('https://todomotor.uy'),
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
    siteName: "TodoMotor Uruguay",
    locale: "es_UY",
    url: "https://todomotor.uy",
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
    canonical: "https://todomotor.uy",
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
      </body>
    </html>
  );
}
