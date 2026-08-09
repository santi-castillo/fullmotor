import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'
import { fetchClassifiedById } from '@/lib/classifieds-api'
import { categoryLabels, type Classified } from '@/types/classified'
import { formatPrice } from '@/lib/format'
import { absoluteUrl, SITE_URL } from '@/lib/site'
import JsonLd from '../../components/JsonLd'
import CategoryBadge from '../../components/CategoryBadge'
import StatusBadge from '../../components/StatusBadge'
import ClassifiedGallery from '../../components/ClassifiedGallery'
import ContactReveal from '../../components/ContactReveal'
import OwnerActions from '../../components/OwnerActions'
import CommentsSection from '../../components/CommentsSection'
import { Avatar } from '../../components/ui/Avatar'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * fetchClassifiedById is `cache: 'no-store'`, so generateMetadata and the page
 * body would otherwise hit the API twice per request.
 */
const getClassified = cache(fetchClassifiedById)

function isExpired(classified: Classified) {
  return new Date(classified.expiresAt) < new Date()
}

/** A listing is only worth indexing while someone can still act on it. */
function isIndexable(classified: Classified) {
  return classified.status === 'active' && !isExpired(classified)
}

const AVAILABILITY: Record<Classified['status'], string> = {
  active: 'https://schema.org/InStock',
  sold: 'https://schema.org/SoldOut',
  paused: 'https://schema.org/Discontinued',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const classified = await getClassified(id)
  if (!classified) return { title: 'Aviso no encontrado' }

  const title = `${classified.title} — ${classified.city}`
  const description = classified.description.replace(/\s+/g, ' ').trim().slice(0, 160)

  return {
    title,
    description,
    robots: isIndexable(classified)
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl(`/clasificados/${id}`),
      images: classified.images.length > 0 ? classified.images.map(url => ({ url })) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: classified.images.slice(0, 1),
    },
    alternates: { canonical: `/clasificados/${id}` },
  }
}

function formatFullDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-UY', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default async function ClassifiedDetailPage({ params }: PageProps) {
  const { id } = await params
  const classified = await getClassified(id)
  if (!classified) notFound()

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: classified.title,
    description: classified.description,
    category: categoryLabels[classified.category],
    ...(classified.images.length > 0 && { image: classified.images }),
    offers: {
      '@type': 'Offer',
      price: classified.price,
      priceCurrency: classified.currency === 'US$' ? 'USD' : 'UYU',
      availability: AVAILABILITY[classified.status],
      url: absoluteUrl(`/clasificados/${classified.id}`),
      availableAtOrFrom: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: classified.city, addressCountry: 'UY' },
      },
      seller: { '@type': 'Person', name: classified.user.name },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Clasificados', item: absoluteUrl('/clasificados') },
      { '@type': 'ListItem', position: 3, name: classified.title },
    ],
  }

  return (
    <div className="dt pb-16">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav className="dt__crumb mb-4">
        <Link href="/clasificados">Clasificados</Link>
        <span>/</span>
        <span>{categoryLabels[classified.category]}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <ClassifiedGallery images={classified.images} title={classified.title} />

          <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1
                  className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  {classified.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden="true" />
                    {classified.city}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Publicado el <span className="font-mono">{formatFullDate(classified.createdAt)}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={classified.status} expiresAt={classified.expiresAt} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="tm-price text-3xl sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
                {formatPrice(classified.currency, classified.price)}
              </span>
              <CategoryBadge category={classified.category} />
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-ink mb-2">Descripción</h2>
              <p className="text-sm whitespace-pre-wrap text-body leading-relaxed">
                {classified.description}
              </p>
            </div>
          </div>

        </div>

        {/*
          Source order is deliberate. In one column — every phone — grid items
          stack in source order, so with the comments still inside the left
          column the seller card landed below the entire thread: the single most
          important action on the page, under an unbounded list. Splitting the
          comments into their own grid item puts contact directly under the
          listing on mobile, and changes nothing on desktop, where auto-placement
          still fills columns 1-2 with the listing, column 3 with the aside, and
          the next row with the comments.
        */}
        <aside className="space-y-4">
          <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar
                src={classified.user.avatarUrl}
                name={classified.user.name}
                size="lg"
                tone="accent-soft"
              />
              <div>
                <p className="tm-eyebrow">Vendedor</p>
                <p className="font-semibold text-ink">{classified.user.name}</p>
              </div>
            </div>

            {classified.contactInfo && classified.showContactInfo ? (
              <ContactReveal contactInfo={classified.contactInfo} />
            ) : (
              <p className="text-sm text-muted">
                El contacto no está disponible públicamente. Dejá un comentario para preguntar.
              </p>
            )}
          </div>

          <OwnerActions classified={classified} />
        </aside>

        <div className="lg:col-span-2">
          {(() => {
            const reason =
              classified.status === 'sold'
                ? 'Esta publicación está marcada como vendida y no acepta más comentarios.'
                : classified.status === 'paused'
                  ? 'Esta publicación está pausada por el dueño y no acepta más comentarios.'
                  : isExpired(classified)
                    ? 'Esta publicación venció y no acepta más comentarios.'
                    : undefined
            return (
              <CommentsSection
                resourceId={classified.id}
                disabled={!!reason}
                disabledReason={reason}
              />
            )
          })()}
        </div>
      </div>
    </div>
  )
}
