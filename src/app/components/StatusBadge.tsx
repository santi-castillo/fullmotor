import { ClassifiedStatus, statusLabels } from '@/types/classified'
import { Badge } from './ui/Badge'

interface StatusBadgeProps {
  status: ClassifiedStatus
  expiresAt?: string
  /** Dealership listings carry a sentinel date; never read it directly. */
  neverExpires?: boolean
}

export default function StatusBadge({ status, expiresAt, neverExpires }: StatusBadgeProps) {
  const isExpired = !neverExpires && expiresAt ? new Date(expiresAt) < new Date() : false

  if (isExpired && status === 'active') {
    return (
      <Badge tone="danger" variant="soft" size="sm">
        Vencida
      </Badge>
    )
  }

  const tones: Record<ClassifiedStatus, { tone: 'positive' | 'neutral' | 'warning'; variant: 'soft' | 'solid' }> = {
    active: { tone: 'positive', variant: 'soft' },
    sold: { tone: 'neutral', variant: 'solid' },
    paused: { tone: 'warning', variant: 'soft' },
  }

  const { tone, variant } = tones[status]

  return (
    <Badge tone={tone} variant={variant} size="sm">
      {statusLabels[status]}
    </Badge>
  )
}
