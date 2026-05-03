import { ClassifiedCategory, categoryLabels } from '@/types/classified'

const categoryIcons: Record<ClassifiedCategory, string> = {
  cars: '🚗',
  motorcycles: '🏍️',
  trucks: '🛻',
  parts: '🔧',
  accessories: '🛠️',
  other: '📦',
}

export default function CategoryBadge({ category }: { category: ClassifiedCategory }) {
  return (
    <span className="category-badge">
      <span aria-hidden>{categoryIcons[category]}</span>
      {categoryLabels[category]}
    </span>
  )
}
