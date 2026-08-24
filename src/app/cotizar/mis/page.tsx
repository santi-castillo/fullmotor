import type { Metadata } from 'next'
import MisCotizacionesClient from './MisCotizacionesClient'

export const metadata: Metadata = {
  title: 'Mis cotizaciones — TodoMotor',
  // Private by definition: this lists cars their owners asked us not to
  // publish, together with what dealerships offered for them.
  robots: { index: false, follow: false },
}

export default function MisCotizacionesPage() {
  return <MisCotizacionesClient />
}
