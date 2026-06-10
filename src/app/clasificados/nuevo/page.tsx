'use client'

import Link from 'next/link'
import RequireAuth from '../../components/RequireAuth'
import ClassifiedForm from '../../components/ClassifiedForm'

export default function NewClassifiedPage() {
  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <nav className="iv__crumb mb-3">
            <Link href="/clasificados">Clasificados</Link>
            <span>/</span>
            <span>Nuevo aviso</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-ink" style={{ letterSpacing: '-0.03em' }}>
            Publicá tu aviso
          </h1>
          <p className="text-sm text-muted mt-2">
            Tu publicación queda activa 30 días. Podés mejorarla a Premium o Destacado en cualquier momento.
          </p>
        </div>

        <ClassifiedForm mode="create" />
      </div>
    </RequireAuth>
  )
}
