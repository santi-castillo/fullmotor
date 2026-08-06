'use client'

import { useEffect } from 'react'
import { LogIn } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/Button'

interface RequireAuthProps {
  children: React.ReactNode
}

/**
 * Gates a page behind a session by opening the login modal in place.
 *
 * This used to redirect to `/clasificados?login=1`, which threw the destination
 * away: someone who tapped "Publicá tu aviso" logged in and landed on the
 * listing, then had to find their way back to the form. Staying put means the
 * page renders as soon as `user` arrives — no destination to carry around, and
 * no `next` param that would need validating against open redirects.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading, login } = useAuth()

  useEffect(() => {
    if (!loading && !user) login()
  }, [loading, user, login])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
      </div>
    )
  }

  // Reachable once the modal is dismissed — without this the page looks broken.
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink mb-2" style={{ letterSpacing: '-0.02em' }}>
          Necesitás una cuenta para seguir
        </h1>
        <p className="text-sm text-muted mb-6">
          Iniciá sesión con Google y volvés justo a esta página.
        </p>
        <Button onClick={login} iconLeft={<LogIn size={16} aria-hidden="true" />}>
          Iniciá sesión
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
