import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { fetchClassifieds } from '@/lib/classifieds-api'
import { ClassifiedCategory } from '@/types/classified'
import { ButtonLink } from '../components/ui/Button'
import ClassifiedFilters from '../components/ClassifiedFilters'
import ClassifiedList from '../components/ClassifiedList'
import Pagination from '../components/Pagination'
import LoginAutoOpener from '../components/LoginAutoOpener'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    city?: string
    login?: string
  }>
}

export default async function ClassifiedsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const limit = 12

  let data
  let errorMessage: string | null = null
  try {
    data = await fetchClassifieds({
      page,
      limit,
      category: (params.category as ClassifiedCategory) || undefined,
      city: params.city || undefined,
    })
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Error al cargar clasificados'
    data = { data: [], meta: { total: 0, page: 1, lastPage: 1 } }
  }

  return (
    <div className="iv pb-16">
      <Suspense fallback={null}>
        <LoginAutoOpener />
      </Suspense>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="iv__title">Clasificados</h1>
          <p className="iv__count">
            {data.meta.total} avisos entre usuarios · vehículos, repuestos y accesorios
          </p>
        </div>
        <ButtonLink href="/clasificados/nuevo" iconLeft={<Plus size={16} aria-hidden="true" />}>
          Publicá tu aviso
        </ButtonLink>
      </div>

      <Suspense fallback={<div className="h-12 bg-sunken rounded-[var(--radius-md)] animate-pulse mb-6" />}>
        <ClassifiedFilters />
      </Suspense>

      <div className="mb-4 text-sm text-muted">
        Mostrando <span className="font-mono text-ink">{data.data.length}</span> de{' '}
        <span className="font-mono text-ink">{data.meta.total}</span> publicaciones
      </div>

      {errorMessage && (
        <div className="p-4 mb-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
          {errorMessage}
        </div>
      )}

      <ClassifiedList
        classifieds={data.data}
        emptyTitle="Todavía no hay clasificados acá"
        emptyDescription="Publicá el tuyo y conectá con compradores de todo el país."
        emptyCta={{ label: 'Publicá el primero', href: '/clasificados/nuevo' }}
      />

      <Suspense fallback={null}>
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.lastPage}
          total={data.meta.total}
          basePath="/clasificados"
        />
      </Suspense>
    </div>
  )
}
