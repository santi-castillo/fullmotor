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
  title: "TodoMotor Uruguay | Fichas Técnicas de Vehículos",
  description: "Encuentra las fichas técnicas completas de autos, SUVs, camionetas y motos disponibles en Uruguay. Especificaciones, precios y equipamiento.",
  keywords: "autos uruguay, motos uruguay, fichas técnicas, precios autos, suvs, camionetas",
  openGraph: {
    title: "TodoMotor Uruguay",
    description: "Fichas técnicas de vehículos en Uruguay",
    type: "website",
  }
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
      <body className={`${inter.variable} antialiased pb-16 md:pb-0`}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="material-symbols-outlined text-[var(--primary)] text-2xl">electric_bolt</span>
              <span className="text-xl font-black italic uppercase tracking-tighter text-[var(--accent)]">
                Todo Motor
              </span>
            </Link>

            <div className="ml-auto max-w-md w-full hidden md:block">
              <Suspense fallback={null}>
                <HeaderSearch />
              </Suspense>
            </div>

            <div className="flex items-center gap-2">
              <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center glass-panel hover:border-[var(--primary)] transition-colors">
                <span className="material-symbols-outlined text-[var(--foreground-muted)] text-xl">search</span>
              </button>
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
              <p className="text-[var(--foreground-muted)] text-sm">
                &copy; {new Date().getFullYear()} Todo Motor Uruguay. Informaci&oacute;n de referencia.
              </p>
              <a
                href="mailto:contacto@todomotor.uy"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Cont&aacute;ctanos
              </a>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--background-secondary)]/95 backdrop-blur-xl border-t border-[var(--border)]">
          <div className="flex items-center justify-around py-2">
            <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--primary)]">
              <span className="material-symbols-outlined text-xl">home</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
            </Link>
            <Link href="/?category=all" className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Buscar</span>
            </Link>
            <Link href="/?category=all" className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              <span className="material-symbols-outlined text-xl">sell</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Vender</span>
            </Link>
            <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
              <span className="material-symbols-outlined text-xl">person</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
            </button>
          </div>
        </nav>
      </body>
    </html>
  );
}
