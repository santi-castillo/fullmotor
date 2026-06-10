'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Classified } from '@/types/classified'
import { fetchMyClassifieds } from '@/lib/classifieds-api'
import { useAuth } from '../../components/AuthProvider'
import { ButtonLink } from '../../components/ui/Button'
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
    <div className="iv pb-16 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="iv__title">Mis clasificados</h1>
          <p className="iv__count">
            Todos tus avisos, incluyendo vencidos, pausados y vendidos
          </p>
        </div>
        <ButtonLink href="/clasificados/nuevo" iconLeft={<Plus size={16} aria-hidden="true" />}>
          Publicá tu aviso
        </ButtonLink>
      </div>

      {error && (
        <div className="p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="iv__grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="iv__skel">
              <div className="m" />
              <div className="b">
                <div className="l" />
                <div className="l l--w60" />
                <div className="l l--w40" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ClassifiedList
          classifieds={classifieds}
          showStatus
          emptyTitle="Todavía no publicaste nada"
          emptyDescription="Creá tu primer aviso y conectá con compradores."
          emptyCta={{ label: 'Publicá tu primer aviso', href: '/clasificados/nuevo' }}
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
