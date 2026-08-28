'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import RequireAuth from '../components/RequireAuth'
import { useAuth } from '../components/AuthProvider'

const SECTIONS = [
  { href: '/admin', label: 'Imágenes' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/comentarios', label: 'Comentarios' },
  { href: '/admin/clasificados', label: 'Clasificados' },
  { href: '/admin/automotoras', label: 'Automotoras' },
]

function Shell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  // Client-side gate only, and deliberately so: every /api/ops endpoint checks
  // the role itself and answers 403 regardless. This exists so someone who is
  // signed in but not an operator gets told that, instead of a screen of
  // failed requests.
  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink mb-2">No tenés acceso</h1>
        <p className="text-sm text-muted">Esta sección es para operadores de TodoMotor.</p>
      </div>
    )
  }

  return (
    <div>
      <nav className="border-b border-line bg-surface" aria-label="Secciones de administración">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {SECTIONS.map((s) => {
            // Exact match for /admin, prefix for the rest: without the special
            // case every section would light up at once, since they all start
            // with /admin.
            const active = s.href === '/admin' ? pathname === '/admin' : pathname.startsWith(s.href)
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'px-3 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
                  active
                    ? 'border-accent text-ink font-semibold'
                    : 'border-transparent text-muted hover:text-ink',
                ].join(' ')}
              >
                {s.label}
              </Link>
            )
          })}
        </div>
      </nav>
      {children}
    </div>
  )
}

/**
 * The chrome every /admin page shares: a session, the operator check, and the
 * section nav.
 *
 * Mounted from the layout so a new screen gets all three by existing, rather
 * than by remembering to copy the gate — which is how one of them eventually
 * ships without it.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Shell>{children}</Shell>
    </RequireAuth>
  )
}
