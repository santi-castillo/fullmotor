import Link from 'next/link'
import { CATEGORIES } from '@/types/vehicle'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter text-[var(--accent)] mb-4">
        404
      </h1>
      <p className="text-xl text-[var(--foreground-muted)] mb-8">
        La p&aacute;gina que buscas no existe o fue movida.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[#0b1326] font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg">home</span>
        Volver al inicio
      </Link>

      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-sm text-[var(--foreground-muted)] mb-4">O explor&aacute; por categor&iacute;a:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className="px-4 py-2 rounded-full border border-[var(--border)] text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
