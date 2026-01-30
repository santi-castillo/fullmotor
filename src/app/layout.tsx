import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "FullMotor Uruguay | Fichas Técnicas de Vehículos",
  description: "Encuentra las fichas técnicas completas de autos, SUVs, camionetas y motos disponibles en Uruguay. Especificaciones, precios y equipamiento.",
  keywords: "autos uruguay, motos uruguay, fichas técnicas, precios autos, suvs, camionetas",
  openGraph: {
    title: "FullMotor Uruguay",
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
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.svg" alt="FullMotor" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold gradient-text">FullMotor</span>
                <span className="text-sm text-[var(--foreground-muted)]">Uruguay</span>
              </div>
            </Link>
          </nav>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)] py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="FullMotor" className="w-6 h-6" />
                <span className="gradient-text font-bold">FullMotor</span>
                <span className="text-[var(--foreground-muted)] text-sm">Uruguay</span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm">
                © {new Date().getFullYear()} FullMotor Uruguay. Información de referencia.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
