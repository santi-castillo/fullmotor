import type { Metadata } from 'next'
import CotizacionDetailClient from './CotizacionDetailClient'

export const metadata: Metadata = {
  title: 'Tu cotización — TodoMotor',
  // Nothing here is public. The seller's phone, the offers and the dealerships
  // that made them all live on this page, so it must never be indexed or
  // followed out of.
  robots: { index: false, follow: false },
}

export default function CotizacionDetailPage() {
  return <CotizacionDetailClient />
}
