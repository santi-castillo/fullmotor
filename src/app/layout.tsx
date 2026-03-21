import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import HeaderSearch from "./components/HeaderSearch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://todomotor.uy'),
  title: {
    default: "TodoMotor Uruguay | Fichas Técnicas de Vehículos",
    template: "%s | TodoMotor Uruguay",
  },
  description: "Encuentra las fichas técnicas completas de autos, SUVs, camionetas y motos disponibles en Uruguay. Especificaciones, precios y equipamiento.",
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
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.variable} antialiased pb-0`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="material-symbols-outlined text-[var(--primary)] text-2xl">electric_bolt</span>
              <span className="text-xl font-black italic uppercase tracking-tighter text-[var(--accent)]">
                Todo Motor
              </span>
              <span className="text-sm font-medium text-[var(--foreground-muted)]">Uruguay</span>
            </Link>

            <div className="ml-auto max-w-md w-full hidden md:block">
              <Suspense fallback={null}>
                <HeaderSearch />
              </Suspense>
            </div>

          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)] py-10 mt-20 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)]">electric_bolt</span>
                <span className="text-xl font-black italic uppercase tracking-tighter text-[var(--accent)]">Todo Motor</span>
                <span className="text-[var(--foreground-muted)] text-sm font-medium">Uruguay</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-4 text-sm text-[var(--foreground-muted)]">
                <Link href="/?category=autos" className="hover:text-[var(--primary)] transition-colors">Autos</Link>
                <Link href="/?category=suvs" className="hover:text-[var(--primary)] transition-colors">SUVs</Link>
                <Link href="/?category=pickups" className="hover:text-[var(--primary)] transition-colors">Camionetas</Link>
                <Link href="/?category=motos" className="hover:text-[var(--primary)] transition-colors">Motos</Link>
                <Link href="/?category=utilitarios" className="hover:text-[var(--primary)] transition-colors">Utilitarios</Link>
              </nav>
              <a
                href="mailto:contacto@todomotor.uy"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Cont&aacute;ctanos
              </a>
            </div>
            <p className="text-[var(--foreground-muted)] text-xs text-center mt-4">
              &copy; {new Date().getFullYear()} Todo Motor Uruguay. Informaci&oacute;n de referencia.
            </p>
          </div>
        </footer>

        {/* Mobile Footer */}
        <footer className="md:hidden bg-[var(--background-secondary)] border-t border-[var(--border)] py-6 mt-10">
          <div className="px-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--primary)]">electric_bolt</span>
              <span className="text-lg font-black italic uppercase tracking-tighter text-[var(--accent)]">Todo Motor</span>
              <span className="text-[var(--foreground-muted)] text-sm font-medium">Uruguay</span>
            </div>
            <p className="text-[var(--foreground-muted)] text-xs">
              &copy; {new Date().getFullYear()} Todo Motor Uruguay. Informaci&oacute;n de referencia.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
