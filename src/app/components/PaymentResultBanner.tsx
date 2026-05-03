'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const messages = {
  success: {
    icon: '✅',
    title: '¡Pago confirmado!',
    description: 'Tu publicación ya fue mejorada. Si no se actualiza al instante, puede tardar unos segundos.',
    classes: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  },
  failure: {
    icon: '❌',
    title: 'Pago no completado',
    description: 'No pudimos procesar el pago. Intentá nuevamente desde "Renovar / Mejorar".',
    classes: 'border-red-500/50 bg-red-500/10 text-red-300',
  },
  pending: {
    icon: '⏳',
    title: 'Pago pendiente',
    description: 'Estamos esperando la confirmación. Te avisaremos cuando se complete.',
    classes: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  },
}

export default function PaymentResultBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('payment') as 'success' | 'failure' | 'pending' | null
  const [dismissedFor, setDismissedFor] = useState<string | null>(null)

  if (!status || dismissedFor === status || !messages[status]) return null

  const msg = messages[status]

  const handleClose = () => {
    setDismissedFor(status)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('payment')
    const query = params.toString()
    router.replace(query ? `?${query}` : window.location.pathname)
  }

  return (
    <div className={`card border ${msg.classes} p-4 mb-6 flex items-start gap-3`}>
      <span className="text-2xl">{msg.icon}</span>
      <div className="flex-1">
        <h3 className="font-semibold">{msg.title}</h3>
        <p className="text-sm opacity-90">{msg.description}</p>
      </div>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Cerrar"
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  )
}
