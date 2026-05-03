import Link from 'next/link'
import { Classified } from '@/types/classified'
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
  emptyTitle = 'No hay publicaciones todavía',
  emptyDescription = 'Aún no hay clasificados activos en tu zona.',
  emptyCta,
  showStatus,
}: ClassifiedListProps) {
  if (classifieds.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4 opacity-50">📭</div>
        <h3 className="text-lg font-semibold mb-2">{emptyTitle}</h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">{emptyDescription}</p>
        {emptyCta && (
          <Link href={emptyCta.href} className="btn btn-primary inline-flex">
            {emptyCta.label}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classifieds.map((c) => (
        <ClassifiedCard key={c.id} classified={c} showStatus={showStatus} />
      ))}
    </div>
  )
}
