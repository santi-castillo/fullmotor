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
    const [showLoginModal, setShowLoginModal] = useState(false)
    const googleBtnRef = useRef<HTMLDivElement | null>(null)

    // Handle Google credential response
    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            const data = await loginWithGoogle(response.credential)
            storeToken(data.token)
            setToken(data.token)
            setUser(data.user)
            setShowLoginModal(false)
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
    }, [gsiReady, handleCredentialResponse])

    // Render Google button inside the modal when it opens
    useEffect(() => {
        if (!showLoginModal || !gsiReady || !window.google || !googleBtnRef.current) return

        googleBtnRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            size: 'large',
            theme: 'filled_black',
            text: 'signin_with',
            shape: 'pill',
            width: 280,
        })
    }, [showLoginModal, gsiReady])

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
        setShowLoginModal(true)
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
        setToken(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}

            {/* Login modal with real Google button */}
            {showLoginModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowLoginModal(false)
                    }}
                >
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl text-center">
                        <h3 className="text-lg font-bold mb-2">Iniciar sesión</h3>
                        <p className="text-sm text-[var(--foreground-muted)] mb-6">
                            Usá tu cuenta de Google para comentar
                        </p>
                        <div className="flex justify-center mb-4">
                            <div ref={googleBtnRef} />
                        </div>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mt-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    )
}
