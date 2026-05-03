'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Classified } from '@/types/classified'
import { fetchMyClassifieds } from '@/lib/classifieds-api'
import { useAuth } from '../../components/AuthProvider'
import RequireAuth from '../../components/RequireAuth'
import ClassifiedList from '../../components/ClassifiedList'

function MyClassifiedsInner() {
  const { user } = useAuth()
  const [classifieds, setClassifieds] = useState<Classified[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetchMyClassifieds({ limit: 50 })
        if (!cancelled) setClassifieds(res.data)
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
  }, [user])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            Mis <span className="gradient-text">publicaciones</span>
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Todas tus publicaciones, incluyendo vencidas, pausadas y vendidas.
          </p>
        </div>
        <Link href="/clasificados/nuevo" className="btn btn-primary">
          ➕ Nueva publicación
        </Link>
      </div>

      {error && (
        <div className="card p-4 border-red-500/40 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center text-sm text-[var(--foreground-muted)]">
          Cargando…
        </div>
      ) : (
        <ClassifiedList
          classifieds={classifieds}
          showStatus
          emptyTitle="No publicaste nada todavía"
          emptyDescription="Creá tu primera publicación y conectá con compradores."
          emptyCta={{ label: 'Publicar la primera', href: '/clasificados/nuevo' }}
        />
      )}
    </div>
  )
}

export default function MyClassifiedsPage() {
  return (
    <RequireAuth>
      <MyClassifiedsInner />
    </RequireAuth>
  )
}
