import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { MapPin } from 'lucide-react'
import { fetchClassifiedById } from '@/lib/classifieds-api'
import { categoryLabels } from '@/types/classified'
import { formatPrice } from '@/lib/format'
import CategoryBadge from '../../components/CategoryBadge'
import TierBadge from '../../components/TierBadge'
import StatusBadge from '../../components/StatusBadge'
import ClassifiedGallery from '../../components/ClassifiedGallery'
import ContactReveal from '../../components/ContactReveal'
import OwnerActions from '../../components/OwnerActions'
import PaymentResultBanner from '../../components/PaymentResultBanner'
import CommentsSection from '../../components/CommentsSection'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
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
  const classified = await fetchClassifiedById(id)
  if (!classified) notFound()

  return (
    <div className="dt pb-16">
      <nav className="dt__crumb mb-4">
        <Link href="/clasificados">Clasificados</Link>
        <span>/</span>
        <span>{categoryLabels[classified.category]}</span>
      </nav>

      <Suspense fallback={null}>
        <PaymentResultBanner />
      </Suspense>

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
                <TierBadge tier={classified.tier} />
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

          {(() => {
            const isExpired = new Date(classified.expiresAt) < new Date()
            const reason =
              classified.status === 'sold'
                ? 'Esta publicación está marcada como vendida y no acepta más comentarios.'
                : classified.status === 'paused'
                  ? 'Esta publicación está pausada por el dueño y no acepta más comentarios.'
                  : isExpired
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

        <aside className="space-y-4">
          <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-5">
            <div className="flex items-center gap-3 mb-4">
              {classified.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={classified.user.avatarUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center text-lg font-bold">
                  {classified.user.name.charAt(0).toUpperCase()}
                </div>
              )}
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
      </div>
    </div>
  )
}
