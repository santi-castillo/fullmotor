import { ClassifiedStatus, statusLabels } from '@/types/classified'

interface StatusBadgeProps {
  status: ClassifiedStatus
  expiresAt?: string
}

export default function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false

  if (isExpired && status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
        Vencida
      </span>
    )
  }

  const styles: Record<ClassifiedStatus, string> = {
    active: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/40',
    sold: 'bg-blue-600/20 text-blue-400 border border-blue-600/40',
    paused: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/40',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
