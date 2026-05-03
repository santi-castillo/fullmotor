'use client'

import { useState } from 'react'

export default function ContactReveal({ contactInfo }: { contactInfo: string }) {
  const [shown, setShown] = useState(false)

  if (!shown) {
    return (
      <button
        type="button"
        onClick={() => setShown(true)}
        className="btn btn-primary"
      >
        📞 Mostrar contacto
      </button>
    )
  }

  return (
    <div className="card p-4 flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
        Contacto
      </span>
      <a
        href={`tel:${contactInfo.replace(/\s+/g, '')}`}
        className="text-lg font-semibold gradient-text break-all"
      >
        {contactInfo}
      </a>
    </div>
  )
}
