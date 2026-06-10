import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { fetchClassifiedById } from '@/lib/classifieds-api'
import { categoryLabels } from '@/types/classified'
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

function formatPrice(amount: number, currency: string) {
  try {
    return `${currency} ${amount.toLocaleString('es-UY')}`
  } catch {
    return `${currency} ${amount}`
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
  const classified = await fetchClassifiedById(id)
  if (!classified) notFound()

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-4 text-sm text-[var(--foreground-muted)]">
        <Link href="/clasificados" className="hover:text-[var(--primary-light)]">
          Clasificados
        </Link>
        <span className="mx-2">›</span>
        <span>{categoryLabels[classified.category]}</span>
      </nav>

      <Suspense fallback={null}>
        <PaymentResultBanner />
      </Suspense>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClassifiedGallery images={classified.images} title={classified.title} />

          <div className="card p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-tight">{classified.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-[var(--foreground-muted)]">
                  <span>📍 {classified.city}</span>
                  <span>·</span>
                  <span>Publicada el {formatFullDate(classified.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TierBadge tier={classified.tier} />
                <StatusBadge status={classified.status} expiresAt={classified.expiresAt} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="price-tag text-3xl">
                {formatPrice(classified.price, classified.currency)}
              </span>
              <CategoryBadge category={classified.category} />
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-sm whitespace-pre-wrap text-[var(--foreground)]/90 leading-relaxed">
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
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              {classified.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={classified.user.avatarUrl}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center text-lg font-bold">
                  {classified.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                  Vendedor
                </p>
                <p className="font-semibold">{classified.user.name}</p>
              </div>
            </div>

            {classified.contactInfo && classified.showContactInfo ? (
              <ContactReveal contactInfo={classified.contactInfo} />
            ) : (
              <p className="text-sm text-[var(--foreground-muted)]">
                Contacto no disponible públicamente. Dejá un comentario para preguntar.
              </p>
            )}
          </div>

          <OwnerActions classified={classified} />
        </aside>
      </div>
    </div>
  )
}
