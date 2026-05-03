'use client'

import Link from 'next/link'
import RequireAuth from '../../components/RequireAuth'
import ClassifiedForm from '../../components/ClassifiedForm'

export default function NewClassifiedPage() {
  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <nav className="mb-2 text-sm text-[var(--foreground-muted)]">
            <Link href="/clasificados" className="hover:text-[var(--primary-light)]">
              Clasificados
            </Link>
            <span className="mx-2">›</span>
            <span>Nueva publicación</span>
          </nav>
          <h1 className="text-3xl font-bold">
            Publicar <span className="gradient-text">aviso</span>
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Tu publicación se mantendrá activa 30 días. Podés mejorarla a Premium o Destacado en cualquier momento.
          </p>
        </div>

        <ClassifiedForm mode="create" />
      </div>
    </RequireAuth>
  )
}
