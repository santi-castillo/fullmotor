import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { fetchClassifieds } from '@/lib/classifieds-api'
import { CLASSIFIED_CATEGORIES, isClassifiedCategory } from '@/types/classified'
import { absoluteUrl } from '@/lib/site'
import JsonLd from '../components/JsonLd'
import { ButtonLink } from '../components/ui/Button'
import ClassifiedFilters from '../components/ClassifiedFilters'
import ClassifiedList from '../components/ClassifiedList'
import Pagination from '../components/Pagination'
import LoginAutoOpener from '../components/LoginAutoOpener'
import { translateApiError } from '@/lib/api-error'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    city?: string
    q?: string
    currency?: string
    min_price?: string
    max_price?: string
    sort?: string
    login?: string
  }>
}

const BASE_TITLE = 'Clasificados de vehículos, repuestos y accesorios'
const BASE_DESCRIPTION =
  'Avisos entre usuarios en Uruguay: autos, motos, camionetas, repuestos y accesorios. Publicá tu aviso gratis.'

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category, city, page } = await searchParams
  const hasFilters = Boolean(category || city || (page && page !== '1'))

  if (hasFilters) {
    const categoryLabel = CLASSIFIED_CATEGORIES.find(c => c.id === category)?.label
    const parts = [categoryLabel, city].filter(Boolean).join(' en ')
    const title = parts ? `Clasificados de ${parts}` : BASE_TITLE

    return {
      title,
      description: BASE_DESCRIPTION,
      // Filtered and paginated views are query-string facets over one list —
      // let crawlers follow through to the listings without indexing the facets.
      robots: { index: false, follow: true },
      alternates: { canonical: '/clasificados' },
    }
  }

  return {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
    openGraph: {
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      type: 'website',
      url: absoluteUrl('/clasificados'),
    },
    twitter: { card: 'summary_large_image', title: BASE_TITLE, description: BASE_DESCRIPTION },
    alternates: { canonical: '/clasificados' },
  }
}

export default async function ClassifiedsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const limit = 12
  const hasFilters = Boolean(
    params.q || params.category || params.city || params.min_price || params.max_price || params.currency
  )

  let data
  let errorMessage: string | null = null
  try {
    data = await fetchClassifieds({
      page,
      limit,
      // An unknown category would otherwise reach the API, come back empty and
      // read as "there is nothing here" while the category select silently
      // reset itself to "Todas".
      category: isClassifiedCategory(params.category) ? params.category : undefined,
      city: params.city || undefined,
      q: params.q || undefined,
      currency: params.currency || undefined,
      minPrice: params.min_price || undefined,
      maxPrice: params.max_price || undefined,
      sort: params.sort || undefined,
    })
  } catch (err) {
    errorMessage = translateApiError(err, 'Error al cargar clasificados')
    data = { data: [], meta: { total: 0, page: 1, lastPage: 1 } }
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: data.data.map((classified, i) => ({
      '@type': 'ListItem',
      position: (data.meta.page - 1) * limit + i + 1,
      url: absoluteUrl(`/clasificados/${classified.id}`),
      name: classified.title,
    })),
  }

  return (
    <div className="iv pb-16">
      {data.data.length > 0 && <JsonLd data={itemListJsonLd} />}

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

      {/* An empty result under filters is a different situation from an empty
          marketplace, and telling someone to "publicá el primero" when there
          are hundreds of listings behind their filters reads as broken. */}
      <ClassifiedList
        classifieds={data.data}
        {...(hasFilters
          ? {
              emptyTitle: 'No encontramos avisos con esos filtros',
              emptyDescription: 'Probá con menos filtros o buscando otra palabra.',
              emptyCta: { label: 'Ver todos los avisos', href: '/clasificados' },
            }
          : {
              emptyTitle: 'Todavía no hay clasificados acá',
              emptyDescription: 'Publicá el tuyo y conectá con compradores de todo el país.',
              emptyCta: { label: 'Publicá el primero', href: '/clasificados/nuevo' },
            })}
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
