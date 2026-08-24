import { Badge } from './ui/Badge'
import type { PrivateListingStatus } from '@/types/private-listing'

const labels: Record<PrivateListingStatus, string> = {
  open: 'Recibiendo ofertas',
  closed: 'Cerrada',
  sold: 'Vendido',
  cancelled: 'Dada de baja',
}

const tones: Record<PrivateListingStatus, 'positive' | 'neutral' | 'warning'> = {
  open: 'positive',
  closed: 'warning',
  sold: 'positive',
  cancelled: 'neutral',
}

export default function PrivateListingStatusBadge({ status }: { status: PrivateListingStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>
}
