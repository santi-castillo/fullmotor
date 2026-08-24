import type { Metadata } from 'next'
import CompraDetailClient from './CompraDetailClient'

export const metadata: Metadata = {
  title: 'Tasar un auto — TodoMotor',
  robots: { index: false, follow: false },
}

export default function CompraDetailPage() {
  return <CompraDetailClient />
}
