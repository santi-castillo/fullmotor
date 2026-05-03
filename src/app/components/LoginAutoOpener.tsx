'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function LoginAutoOpener() {
  const params = useSearchParams()
  const { user, loading, login } = useAuth()
  const wantsLogin = params.get('login') === '1'

  useEffect(() => {
    if (wantsLogin && !loading && !user) {
      login()
    }
  }, [wantsLogin, loading, user, login])

  return null
}
