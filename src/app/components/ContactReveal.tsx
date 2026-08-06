'use client'

import { useState } from 'react'
import { AtSign, Eye, MessageCircle, Phone } from 'lucide-react'
import { parseContact } from '@/lib/contact'
import { Button, ButtonLink } from './ui/Button'

const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'uy'

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

  const contact = parseContact(contactInfo, COUNTRY)
  const Icon = contact.kind === 'email' ? AtSign : Phone

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-sunken rounded-[var(--radius-md)] p-3 flex flex-col gap-1.5">
        <span className="tm-eyebrow">Contacto</span>
        {contact.href ? (
          <a
            href={contact.href}
            className="font-mono text-lg text-accent break-all inline-flex items-center gap-2"
          >
            <Icon size={15} className="flex-shrink-0" aria-hidden="true" />
            {contact.display}
          </a>
        ) : (
          // Neither phone nor email — a handle, a name, an address. Showing it
          // plainly beats guessing a protocol and producing a dead link.
          <span className="font-mono text-lg text-ink break-all">{contact.display}</span>
        )}
      </div>

      {contact.whatsappHref && (
        <ButtonLink
          href={contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          block
          iconLeft={<MessageCircle size={15} aria-hidden="true" />}
        >
          Escribile por WhatsApp
        </ButtonLink>
      )}
    </div>
  )
}
