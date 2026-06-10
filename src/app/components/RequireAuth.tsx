'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

interface RequireAuthProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function RequireAuth({ children, redirectTo = '/clasificados?login=1' }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo)
    }
  }, [loading, user, redirectTo, router])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
