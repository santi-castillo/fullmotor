import { ClassifiedCategory, categoryLabels } from '@/types/classified'
import { Badge } from './ui/Badge'

export default function CategoryBadge({ category }: { category: ClassifiedCategory }) {
  return (
    <Badge tone="neutral" variant="outline" size="sm">
      {categoryLabels[category]}
    </Badge>
  )
}
