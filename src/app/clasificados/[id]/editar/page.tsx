'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Classified } from '@/types/classified'
import { fetchClassifiedById } from '@/lib/classifieds-api'
import { useAuth } from '../../../components/AuthProvider'
import RequireAuth from '../../../components/RequireAuth'
import ClassifiedForm from '../../../components/ClassifiedForm'

function EditInner() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [classified, setClassified] = useState<Classified | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id || !user) return
    let cancelled = false
    const load = async () => {
      try {
        const c = await fetchClassifiedById(params.id)
        if (cancelled) return
        if (!c) {
          setError('No se encontró la publicación.')
          return
        }
        if (user && c.userId !== user.id) {
          router.replace(`/clasificados/${c.id}`)
          return
        }
        setClassified(c)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [params?.id, user, router])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm text-[var(--foreground-muted)]">
        Cargando…
      </div>
    )
  }

  if (error || !classified) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 mb-4">{error || 'No se encontró la publicación.'}</p>
        <Link href="/clasificados/mis" className="btn btn-primary inline-flex">
          Volver a mis publicaciones
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <nav className="mb-2 text-sm text-[var(--foreground-muted)]">
          <Link href="/clasificados" className="hover:text-[var(--primary-light)]">
            Clasificados
          </Link>
          <span className="mx-2">›</span>
          <Link
            href={`/clasificados/${classified.id}`}
            className="hover:text-[var(--primary-light)]"
          >
            {classified.title}
          </Link>
          <span className="mx-2">›</span>
          <span>Editar</span>
        </nav>
        <h1 className="text-3xl font-bold">
          Editar <span className="gradient-text">publicación</span>
        </h1>
      </div>

      <ClassifiedForm mode="edit" initial={classified} />
    </div>
  )
}

export default function EditClassifiedPage() {
  return (
    <RequireAuth>
      <EditInner />
    </RequireAuth>
  )
}
