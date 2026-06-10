import { Star } from 'lucide-react'
import { ClassifiedTier } from '@/types/classified'
import { Badge } from './ui/Badge'

export default function TierBadge({ tier }: { tier: ClassifiedTier }) {
  if (tier === 'free') return null

  if (tier === 'featured') {
    return (
      <Badge tone="accent" variant="solid" size="sm">
        <Star size={11} aria-hidden="true" />
        Destacado
      </Badge>
    )
  }

  return (
    <Badge tone="accent" variant="soft" size="sm">
      Premium
    </Badge>
  )
}
