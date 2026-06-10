'use client'

import { useState } from 'react'
import { Eye, Phone } from 'lucide-react'
import { Button } from './ui/Button'

export default function ContactReveal({ contactInfo }: { contactInfo: string }) {
  const [shown, setShown] = useState(false)

  if (!shown) {
    return (
      <Button
        variant="secondary"
        block
        iconLeft={<Eye size={15} aria-hidden="true" />}
        onClick={() => setShown(true)}
      >
        Mostrá el contacto
      </Button>
    )
  }

  return (
    <div className="bg-sunken rounded-[var(--radius-md)] p-3 flex flex-col gap-1.5">
      <span className="tm-eyebrow">Contacto</span>
      <a
        href={`tel:${contactInfo.replace(/\s+/g, '')}`}
        className="font-mono text-lg text-accent break-all inline-flex items-center gap-2"
      >
        <Phone size={15} className="flex-shrink-0" aria-hidden="true" />
        {contactInfo}
      </a>
    </div>
  )
}
