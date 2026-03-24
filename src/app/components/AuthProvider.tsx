'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
    User,
    getStoredToken,
    storeToken,
    removeToken,
    loginWithGoogle,
    fetchCurrentUser,
} from '@/lib/auth'

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: Record<string, unknown>) => void
                    prompt: () => void
                    renderButton: (el: HTMLElement, config: Record<string, unknown>) => void
                    revoke: (email: string, cb: () => void) => void
                }
            }
        }
    }
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: () => {},
    logout: () => {},
})

export function useAuth() {
    return useContext(AuthContext)
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [gsiReady, setGsiReady] = useState(false)
    const loginBtnRef = useRef<HTMLDivElement | null>(null)

    // Handle Google credential response
    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            const data = await loginWithGoogle(response.credential)
            storeToken(data.token)
            setToken(data.token)
            setUser(data.user)
        } catch (err) {
            console.error('Login failed:', err)
            removeToken()
        }
    }, [])

    // Load Google Identity Services script
    useEffect(() => {
        if (typeof window === 'undefined' || !GOOGLE_CLIENT_ID) return

        const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
        if (existing) {
            if (window.google?.accounts) setGsiReady(true)
            return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => setGsiReady(true)
        document.head.appendChild(script)
    }, [])

    // Initialize GSI once script is loaded
    useEffect(() => {
        if (!gsiReady || !window.google || !GOOGLE_CLIENT_ID) return

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: 'popup',
            auto_select: false,
            cancel_on_tap_outside: true,
        })

        // Render hidden Google button so we can programmatically click it
        if (loginBtnRef.current) {
            loginBtnRef.current.innerHTML = ''
            window.google.accounts.id.renderButton(loginBtnRef.current, {
                type: 'standard',
                size: 'large',
                theme: 'filled_black',
                text: 'signin_with',
            })
        }
    }, [gsiReady, handleCredentialResponse])

    // On mount: validate stored token
    useEffect(() => {
        const stored = getStoredToken()
        if (!stored) {
            setLoading(false)
            return
        }

        fetchCurrentUser(stored)
            .then((u) => {
                setUser(u)
                setToken(stored)
            })
            .catch(() => {
                removeToken()
            })
            .finally(() => setLoading(false))
    }, [])

    const login = useCallback(() => {
        if (!window.google || !GOOGLE_CLIENT_ID) return

        // Click the hidden Google rendered button to trigger the popup flow
        const btn = loginBtnRef.current?.querySelector('[role="button"]') as HTMLElement
            || loginBtnRef.current?.querySelector('div[style]') as HTMLElement
        if (btn) {
            btn.click()
        } else {
            // Fallback: try prompt (works in production with HTTPS)
            window.google.accounts.id.prompt()
        }
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
        setToken(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
            {/* Hidden Google sign-in button — clicked programmatically */}
            <div ref={loginBtnRef} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} />
        </AuthContext.Provider>
    )
}
