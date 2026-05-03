import Link from 'next/link'
import { Suspense } from 'react'
import { fetchClassifieds } from '@/lib/classifieds-api'
import { ClassifiedCategory } from '@/types/classified'
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
    <div className="fade-in">
      <Suspense fallback={null}>
        <LoginAutoOpener />
      </Suspense>

      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">Clasificados</span>
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Compra y vende vehículos, repuestos y accesorios entre usuarios.
            </p>
          </div>
          <Link href="/clasificados/nuevo" className="btn btn-primary">
            ➕ Publicar
          </Link>
        </div>

        <Suspense fallback={<div className="h-12 bg-[var(--muted)] rounded-lg animate-pulse mb-6" />}>
          <ClassifiedFilters />
        </Suspense>

        <div className="mb-4 text-sm text-[var(--foreground-muted)]">
          Mostrando {data.data.length} de {data.meta.total} publicaciones
        </div>

        {errorMessage && (
          <div className="card p-4 mb-4 border-red-500/40 bg-red-500/10 text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        <ClassifiedList
          classifieds={data.data}
          emptyTitle="Aún no hay publicaciones en tu zona"
          emptyDescription="Sé el primero en publicar y conectá con compradores."
          emptyCta={{ label: 'Publicar el primero', href: '/clasificados/nuevo' }}
        />

        <Suspense fallback={null}>
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.lastPage}
            total={data.meta.total}
            basePath="/clasificados"
          />
        </Suspense>
      </section>
    </div>
  )
}
