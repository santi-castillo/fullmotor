import { Classified } from '@/types/classified'
import { ButtonLink } from './ui/Button'
import ClassifiedCard from './ClassifiedCard'

interface ClassifiedListProps {
  classifieds: Classified[]
  emptyTitle?: string
  emptyDescription?: string
  emptyCta?: { label: string; href: string }
  showStatus?: boolean
}

export default function ClassifiedList({
  classifieds,
  emptyTitle = 'Todavía no hay clasificados acá',
  emptyDescription = 'Publicá el tuyo y llegá a compradores de todo el país.',
  emptyCta,
  showStatus,
}: ClassifiedListProps) {
  if (classifieds.length === 0) {
    return (
      <div className="iv__empty">
        <h3 className="font-display text-lg font-bold text-ink mb-2">{emptyTitle}</h3>
        <p className="text-sm text-muted mb-6">{emptyDescription}</p>
        {emptyCta && <ButtonLink href={emptyCta.href}>{emptyCta.label}</ButtonLink>}
      </div>
    )
  }

  return (
    <div className="iv__grid">
      {classifieds.map((c) => (
        <ClassifiedCard key={c.id} classified={c} showStatus={showStatus} />
      ))}
    </div>
  )
}
