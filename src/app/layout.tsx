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
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--border)]">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span className="text-xl font-bold text-[var(--foreground)]">FullMotor</span>
              <span className="text-sm text-[var(--secondary)]">Uruguay</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/autos" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition">Autos</Link>
              <Link href="/suvs" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition">SUVs</Link>
              <Link href="/camionetas" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition">Camionetas</Link>
              <Link href="/motos" className="text-[var(--secondary)] hover:text-[var(--foreground)] transition">Motos</Link>
            </div>
            
            <Link href="/buscar" className="btn btn-primary">
              🔍 Buscar
            </Link>
          </nav>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-[#1e293b] text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🚗</span> FullMotor
                </h3>
                <p className="text-slate-400 text-sm">
                  Fichas técnicas de vehículos nuevos en Uruguay. Información completa y actualizada.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Categorías</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link href="/autos" className="hover:text-white transition">Autos</Link></li>
                  <li><Link href="/suvs" className="hover:text-white transition">SUVs</Link></li>
                  <li><Link href="/camionetas" className="hover:text-white transition">Camionetas</Link></li>
                  <li><Link href="/motos" className="hover:text-white transition">Motos</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Marcas Populares</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>Toyota</li>
                  <li>Volkswagen</li>
                  <li>Chevrolet</li>
                  <li>Ford</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">API</h4>
                <p className="text-slate-400 text-sm mb-2">
                  Accede a nuestros datos via API REST.
                </p>
                <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                  GET /api/vehicles
                </code>
              </div>
            </div>
            
            <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
              © {new Date().getFullYear()} FullMotor Uruguay. Información de referencia.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
