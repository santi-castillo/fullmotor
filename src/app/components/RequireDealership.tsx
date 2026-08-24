'use client'

import RequireAuth from './RequireAuth'
import { useAuth } from './AuthProvider'
import { ButtonLink } from './ui/Button'

/**
 * Gates a page behind an approved business account.
 *
 * Mirrors the check the API's DealershipMiddleware makes, so an account whose
 * application is pending gets an explanation here instead of a 403 from a fetch
 * it cannot see. `approved` specifically — pending, rejected and suspended all
 * read as an ordinary seller, which is what makes suspension a real sanction.
 */
export default function RequireDealership({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Inner>{children}</Inner>
    </RequireAuth>
  )
}

function Inner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const dealership = user?.dealership

  if (!dealership) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Esto es para automotoras</h1>
        <p className="text-sm text-muted">
          Registrá tu automotora y, una vez aprobada, vas a ver los autos que los particulares
          ponen a cotizar.
        </p>
        <ButtonLink href="/automotoras/solicitar">Registrá tu automotora</ButtonLink>
      </div>
    )
  }

  if (dealership.status !== 'approved') {
    const copy: Record<string, string> = {
      pending: 'Tu solicitud está en revisión. Te avisamos apenas la aprobemos.',
      rejected: dealership.rejectionReason
        ? `Tu solicitud fue rechazada: ${dealership.rejectionReason}`
        : 'Tu solicitud fue rechazada.',
      suspended: 'Tu cuenta está suspendida. Escribinos si creés que es un error.',
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">Todavía no podés ver esto</h1>
        <p className="text-sm text-muted">{copy[dealership.status] ?? 'Tu cuenta no está activa.'}</p>
        <ButtonLink href="/automotoras/panel" variant="secondary">
          Ir a mi panel
        </ButtonLink>
      </div>
    )
  }

  return <>{children}</>
}
