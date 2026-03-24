'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'

export default function UserMenu() {
    const { user, loading, login, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-[var(--surface-mid)] animate-pulse flex-shrink-0" />
        )
    }

    if (!user) {
        return (
            <button
                onClick={login}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors flex-shrink-0"
            >
                <span className="material-symbols-outlined text-base">person</span>
                <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
        )
    }

    return (
        <div ref={menuRef} className="relative flex-shrink-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-lg hover:bg-[var(--surface-mid)] transition-colors p-1"
            >
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-sm font-bold text-[#0b1326]">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false)
                            logout()
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--surface-mid)] transition-colors flex items-center gap-2 text-[var(--foreground-muted)]"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    )
}
