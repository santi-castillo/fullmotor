import Link from 'next/link'
import { Logo } from './ui/Logo'

export default function SiteFooter() {
  return (
    <footer className="k-footer">
      <div className="k-footer__in">
        <div style={{ maxWidth: 280 }}>
          <Logo size={20} inverse />
          <p style={{ color: 'var(--text-inverse-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginTop: 14 }}>
            Fichas técnicas, precios y comparativas de vehículos en Uruguay. Información de referencia para decidir mejor.
          </p>
        </div>
        <div className="k-footer__cols">
          <div className="k-footer__col">
            <h5>Catálogo</h5>
            <Link href="/?category=autos">Autos</Link>
            <Link href="/?category=suvs">SUVs</Link>
            <Link href="/?category=pickups">Camionetas</Link>
            <Link href="/?category=motos">Motos</Link>
            <Link href="/?category=utilitarios">Utilitarios</Link>
          </div>
          <div className="k-footer__col">
            <h5>TodoMotor</h5>
            <Link href="/blog">Blog del Motor</Link>
            <Link href="/compare">Comparador</Link>
            <Link href="/clasificados">Clasificados</Link>
            <a href="mailto:contacto@todomotor.uy">Escribinos</a>
          </div>
        </div>
      </div>
      <div className="k-footer__bottom">
        <div className="in">
          <span>© {new Date().getFullYear()} TodoMotor Uruguay · Información de referencia</span>
          <span>Hecho en Montevideo, Uruguay</span>
        </div>
      </div>
    </footer>
  )
}
