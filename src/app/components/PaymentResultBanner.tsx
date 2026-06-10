'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react'

const messages = {
  success: {
    Icon: CheckCircle,
    title: 'Pago confirmado',
    description: 'Tu publicación ya fue mejorada. Si no se actualiza al instante, puede tardar unos segundos.',
    classes: 'bg-positive-soft text-positive-ink',
  },
  failure: {
    Icon: AlertCircle,
    title: 'Pago no completado',
    description: 'No pudimos procesar el pago. Intentá de nuevo desde "Destacá tu aviso".',
    classes: 'bg-danger-soft text-danger-ink',
  },
  pending: {
    Icon: Clock,
    title: 'Pago pendiente',
    description: 'Estamos esperando la confirmación. Te avisamos cuando se complete.',
    classes: 'bg-warning-soft text-warning-ink',
  },
}

export default function PaymentResultBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('payment') as 'success' | 'failure' | 'pending' | null
  const [dismissedFor, setDismissedFor] = useState<string | null>(null)

  if (!status || dismissedFor === status || !messages[status]) return null

  const msg = messages[status]
  const Icon = msg.Icon

  const handleClose = () => {
    setDismissedFor(status)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('payment')
    const query = params.toString()
    router.replace(query ? `?${query}` : window.location.pathname)
  }

  return (
    <div className={`rounded-[var(--radius-md)] ${msg.classes} p-4 mb-6 flex items-start gap-3`}>
      <Icon size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{msg.title}</h3>
        <p className="text-sm opacity-90 mt-0.5">{msg.description}</p>
      </div>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Cerrar"
        className="text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
