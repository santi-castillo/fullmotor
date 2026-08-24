import type { Metadata } from 'next'
import RequireAuth from '../../components/RequireAuth'
import PrivateListingForm from '../../components/PrivateListingForm'

export const metadata: Metadata = {
  title: 'Cotizá tu auto — TodoMotor',
  description:
    'Cargá tu auto una vez y recibí ofertas de compra de las automotoras registradas en TodoMotor. Gratis y sin compromiso.',
  // The form itself is behind a login, so there is nothing here for a crawler
  // to index — the marketing copy lives on /cotizar, which is public.
  robots: { index: false, follow: true },
}

export default function NuevaCotizacionPage() {
  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <header className="space-y-2">
          <h1
            className="font-display text-2xl sm:text-3xl font-bold text-ink"
            style={{ letterSpacing: '-0.02em' }}
          >
            Cotizá tu auto
          </h1>
          <p className="text-sm text-muted">
            Cargalo una vez. Durante 72 horas las automotoras registradas compiten a ciegas por
            comprártelo, y vos aceptás la oferta que quieras — o ninguna.
          </p>
        </header>

        <PrivateListingForm />
      </div>
    </RequireAuth>
  )
}
