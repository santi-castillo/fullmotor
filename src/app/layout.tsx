import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SearchBar from "./components/SearchBar";

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
      <body className={`${inter.variable} antialiased`}>
        <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold gradient-text">Todo Motor</span>
                <span className="text-sm font-medium text-[var(--foreground-muted)] hidden sm:inline">Uruguay</span>
              </div>
            </Link>
            <SearchBar />
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)] py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold gradient-text">Todo Motor</span>
                <span className="text-[var(--foreground-muted)] text-sm font-medium">Uruguay</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                © {new Date().getFullYear()} Todo Motor Uruguay. Información de referencia.
              </p>
              <a
                href="mailto:contacto@todomotor.uy"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
              >
                <span>✉️</span>
                Contáctanos
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
