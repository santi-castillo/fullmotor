import type { Metadata } from 'next'
import ComprasClient from './ComprasClient'

export const metadata: Metadata = {
  title: 'Autos para tasar — TodoMotor',
  // These are cars whose owners asked us not to publish them.
  robots: { index: false, follow: false },
}

export default function ComprasPage() {
  return <ComprasClient />
}
