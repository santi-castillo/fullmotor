import Link from 'next/link'
import { Classified } from '@/types/classified'
import CategoryBadge from './CategoryBadge'
import TierBadge from './TierBadge'
import StatusBadge from './StatusBadge'

interface ClassifiedCardProps {
  classified: Classified
  showStatus?: boolean
}

const categoryFallbackIcon: Record<string, string> = {
  cars: '🚗',
  motorcycles: '🏍️',
  trucks: '🛻',
  parts: '🔧',
  accessories: '🛠️',
  other: '📦',
}

function formatPrice(amount: number, currency: string) {
  try {
    return `${currency} ${amount.toLocaleString('es-UY')}`
  } catch {
    return `${currency} ${amount}`
  }
}

export default function ClassifiedCard({ classified, showStatus = false }: ClassifiedCardProps) {
  const cover = classified.images[0]

  return (
    <Link
      href={`/clasificados/${classified.id}`}
      className="card flex flex-col overflow-hidden group h-full"
    >
      <div className="relative aspect-[4/3] bg-[var(--glass-bg)] overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={classified.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
            {categoryFallbackIcon[classified.category] || '📷'}
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <TierBadge tier={classified.tier} />
        </div>
        {showStatus && (
          <div className="absolute top-2 right-2">
            <StatusBadge status={classified.status} expiresAt={classified.expiresAt} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-[var(--primary-light)] transition-colors">
            {classified.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
          <span>📍 {classified.city}</span>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="price-tag">{formatPrice(classified.price, classified.currency)}</span>
          <CategoryBadge category={classified.category} />
        </div>
      </div>
    </Link>
  )
}
