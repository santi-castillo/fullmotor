import Link from 'next/link'
import { ImageOff, MapPin } from 'lucide-react'
import { Classified } from '@/types/classified'
import { formatNumber } from '@/lib/format'
import { RawImageWithFallback } from './ui/ImageWithFallback'
import CategoryBadge from './CategoryBadge'
import TierBadge from './TierBadge'
import StatusBadge from './StatusBadge'

interface ClassifiedCardProps {
  classified: Classified
  showStatus?: boolean
}

export default function ClassifiedCard({ classified, showStatus = false }: ClassifiedCardProps) {
  const cover = classified.images[0]
  const cur =
    !classified.currency || classified.currency === 'US$' || classified.currency === 'U$S'
      ? 'USD'
      : classified.currency

  return (
    <Link href={`/clasificados/${classified.id}`} className="tm-vcard h-full">
      <div className="tm-vcard__media">
        <RawImageWithFallback
          src={cover}
          alt={classified.title}
          fallback={<ImageOff size={34} className="text-faint" aria-hidden="true" />}
        />
        <div className="tm-vcard__topl">
          <TierBadge tier={classified.tier} />
        </div>
        {showStatus && (
          <div className="tm-vcard__topr">
            <StatusBadge status={classified.status} expiresAt={classified.expiresAt} />
          </div>
        )}
      </div>
      <div className="tm-vcard__body">
        <h3 className="tm-vcard__model line-clamp-2" style={{ fontSize: 'var(--text-lg)' }}>
          {classified.title}
        </h3>
        <span className="flex items-center gap-1.5 text-sm text-muted mt-1">
          <MapPin size={13} aria-hidden="true" />
          {classified.city}
        </span>
        <div className="tm-vcard__foot">
          <span className="tm-vcard__price">
            <span className="cur">{cur}</span>
            {formatNumber(classified.price)}
          </span>
          <CategoryBadge category={classified.category} />
        </div>
      </div>
    </Link>
  )
}
