'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, ExternalLink, Gavel } from 'lucide-react'
import { updateMyDealership } from '@/lib/dealerships-api'
import { fetchPendingCount } from '@/lib/private-listings-api'
import { DEPARTAMENTOS } from '@/lib/uruguay'
import { translateApiError } from '@/lib/api-error'
import RequireAuth from '../../components/RequireAuth'
import { useAuth } from '../../components/AuthProvider'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'

function PanelInner() {
  const { user } = useAuth()
  const dealership = user?.dealership

  const [name, setName] = useState(dealership?.name ?? '')
  const [description, setDescription] = useState(dealership?.description ?? '')
  const [city, setCity] = useState(dealership?.city ?? '')
  const [address, setAddress] = useState(dealership?.address ?? '')
  const [phone, setPhone] = useState(dealership?.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(dealership?.whatsapp ?? '')
  const [website, setWebsite] = useState(dealership?.website ?? '')
  const [hours, setHours] = useState(dealership?.hours ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Alerts default to on for a new application, so an undefined value here —
  // an account created before the column existed — should read as on too.
  const [notifyOnNewListing, setNotifyOnNewListing] = useState(
    dealership?.notifyOnNewListing ?? true
  )
  const [notifyDepartments, setNotifyDepartments] = useState<string[]>(
    dealership?.notifyDepartments ?? []
  )

  // The badge. Null until it loads, so nothing flashes a zero that then jumps.
  const [pending, setPending] = useState<number | null>(null)
  const approved = dealership?.status === 'approved'

  useEffect(() => {
    if (!approved) return
    fetchPendingCount()
      .then(setPending)
      // Non-fatal: the panel is useful without the badge.
      .catch(() => setPending(null))
  }, [approved])

  if (!dealership) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Todavía no sos automotora</h1>
        <p className="text-sm text-muted">Registrate y revisamos tu solicitud a mano.</p>
        <ButtonLink href="/automotoras/solicitar">Registrá tu automotora</ButtonLink>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (!name.trim()) {
      setError('El nombre no puede quedar vacío.')
      return
    }

    setSaving(true)
    try {
      await updateMyDealership({
        name: name.trim(),
        description: description.trim(),
        city: city.trim(),
        address: address.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        website: website.trim(),
        hours: hours.trim(),
        notifyOnNewListing,
        notifyDepartments,
      })
      setSaved(true)
    } catch (err) {
      setError(translateApiError(err, 'No pudimos guardar los cambios'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <nav className="iv__crumb mb-3">
          <Link href="/clasificados/mis">Mis clasificados</Link>
          <span>/</span>
          <span>Mi automotora</span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-ink" style={{ letterSpacing: '-0.03em' }}>
          {dealership.name}
        </h1>
        {dealership.status === 'approved' && (
          <Link
            href={`/automotoras/${dealership.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-accent mt-2"
          >
            Ver mi vidriera
            <ExternalLink size={13} aria-hidden="true" />
          </Link>
        )}
      </div>

      {dealership.status !== 'approved' && (
        <div className="p-4 rounded-[var(--radius-md)] bg-sunken text-sm text-body">
          {dealership.status === 'pending' &&
            'Tu solicitud está en revisión. Podés dejar tus datos listos mientras tanto.'}
          {dealership.status === 'rejected' &&
            `Tu solicitud fue rechazada${dealership.rejectionReason ? `: ${dealership.rejectionReason}` : '.'}`}
          {dealership.status === 'suspended' && 'Tu cuenta está suspendida.'}
        </div>
      )}

      {approved && (
        <Link
          href="/automotoras/panel/compras"
          className="flex items-center gap-3 bg-surface border border-line rounded-[var(--radius-lg)] p-5 hover:border-ink transition-colors"
        >
          <Gavel size={20} className="shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Autos para tasar</p>
            <p className="text-sm text-muted">
              Particulares que pusieron su auto a cotizar. Ofertás a ciegas.
            </p>
          </div>
          {pending !== null && pending > 0 && (
            <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
              {pending}
            </span>
          )}
        </Link>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">Datos del negocio</h2>

          <Input
            label="Nombre"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
          {/* The slug is not editable: it is the storefront's public address,
              and renaming it would break every link already out there. */}
          <p className="text-xs text-muted">
            Dirección de tu vidriera: <span className="font-mono">/automotoras/{dealership.slug}</span>
          </p>

          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ciudad" type="text" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
            <Input label="Dirección" type="text" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Teléfono" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
            <Input label="WhatsApp" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={40} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Sitio web" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={200} />
            <Input label="Horarios" type="text" value={hours} onChange={(e) => setHours(e.target.value)} maxLength={200} />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-[var(--radius-lg)] p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-ink">Avisos de autos para tasar</h2>
            <p className="text-sm text-muted">
              Las cotizaciones duran 72 horas. Si no te avisamos, se te pasan.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOnNewListing}
              onChange={(e) => setNotifyOnNewListing(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-body">
              Avisame por mail cuando entre un auto para tasar
            </span>
          </label>

          <fieldset className="space-y-2" disabled={!notifyOnNewListing}>
            <legend className="tm-field__label">Departamentos que te interesan</legend>
            <p className="text-xs text-muted">
              Si no marcás ninguno, te avisamos de todos.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEPARTAMENTOS.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyDepartments.includes(d)}
                    onChange={(e) =>
                      setNotifyDepartments((prev) =>
                        e.target.checked ? [...prev, d] : prev.filter((x) => x !== d)
                      )
                    }
                  />
                  {d}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-danger-soft text-danger-ink text-sm">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-sunken text-sm text-body">
            <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-accent" aria-hidden="true" />
            Guardamos los cambios.
          </div>
        )}

        <Button type="submit" loading={saving}>
          Guardá los cambios
        </Button>
      </form>
    </div>
  )
}

export default function DealershipPanelPage() {
  return (
    <RequireAuth>
      <PanelInner />
    </RequireAuth>
  )
}
