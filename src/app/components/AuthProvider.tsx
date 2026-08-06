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
            if (window.google?.accounts) {
                // Defer so the state update isn't synchronous within the effect body
                queueMicrotask(() => setGsiReady(true))
            } else {
                // Tag is in the DOM but still in flight — wait for it rather than
                // giving up, which would leave the modal permanently buttonless.
                const onLoad = () => setGsiReady(true)
                existing.addEventListener('load', onLoad)
                return () => existing.removeEventListener('load', onLoad)
            }
            return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => setGsiReady(true)
        document.head.appendChild(script)
    }, [])

    /**
     * Initialize GSI and render the button in one effect, in that order.
     *
     * The button used to be mounted via a callback ref, which React attaches
     * during the commit phase — i.e. *before* the separate effect that called
     * initialize(). Whenever the modal was already mounted at the moment the
     * GSI script finished loading — that is, whenever the modal is opened
     * programmatically on mount — renderButton fired first, Google logged
     * "Failed to render button before calling initialize()" and drew nothing.
     * The modal showed only a Cancel button and logging in was impossible.
     *
     * Doing both here makes the ordering structural instead of a side effect of
     * how the effects happen to be declared, and covers either arrival order —
     * script first, or modal first. Re-initializing on each open is cheap and
     * supported; nothing else in the app depends on initialize() having run
     * (One Tap is off: auto_select is false and prompt() is never called).
     */
    useEffect(() => {
        if (!gsiReady || !showLoginModal || !window.google || !GOOGLE_CLIENT_ID) return
        const node = googleBtnRef.current
        if (!node) return

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: 'popup',
            auto_select: false,
            cancel_on_tap_outside: true,
            locale: 'es',
        })

        node.innerHTML = ''
        window.google.accounts.id.renderButton(node, {
            type: 'standard',
            size: 'large',
            theme: 'outline',
            text: 'signin_with',
            shape: 'pill',
            width: 280,
            locale: 'es',
        })
    }, [gsiReady, showLoginModal, handleCredentialResponse])

    // Escape closes the modal, and focus moves into it on open so keyboard
    // users are not stranded behind the backdrop.
    useEffect(() => {
        if (!showLoginModal) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLoginModal(false)
        }
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            previouslyFocused?.focus?.()
        }
    }, [showLoginModal])

    // On mount: validate stored token
    useEffect(() => {
        const stored = getStoredToken()
        if (!stored) {
            queueMicrotask(() => setLoading(false))
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
                    className="fixed inset-0 z-[1100] flex items-center justify-center bg-[rgba(8,21,46,0.45)] backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowLoginModal(false)
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="login-modal-title"
                        tabIndex={-1}
                        ref={(node) => node?.focus()}
                        className="bg-surface border border-line rounded-[var(--radius-xl)] p-8 mx-4 max-w-sm w-full shadow-pop text-center outline-none"
                    >
                        <h3 id="login-modal-title" className="font-display text-lg font-bold text-ink mb-2">
                            Iniciá sesión para continuar
                        </h3>
                        <p className="text-sm text-muted mb-6">
                            Usá tu cuenta de Google para comentar y publicar
                        </p>
                        <div className="flex justify-center mb-4">
                            <div ref={googleBtnRef} />
                        </div>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="text-xs text-muted hover:text-ink transition-colors mt-2 cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    )
}
