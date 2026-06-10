'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/** Compact vehicle snapshot persisted in localStorage so the
 *  /guardados page can render without hitting the backend. */
export interface SavedVehicle {
  slug: string
  brand: string
  model: string
  version?: string
  year: number
  price: number
  currency: string
  fuelType?: string
  engineHp?: number
  image?: string
  savedAt: string
}

interface SavedContextValue {
  items: SavedVehicle[]
  count: number
  hydrated: boolean
  has: (slug: string) => boolean
  toggle: (snapshot: Omit<SavedVehicle, 'savedAt'>) => void
  remove: (slug: string) => void
}

const STORAGE_KEY = 'todomotor.saved.v1'

const SavedContext = createContext<SavedContextValue>({
  items: [],
  count: 0,
  hydrated: false,
  has: () => false,
  toggle: () => {},
  remove: () => {},
})

function readStorage(): SavedVehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => x && typeof x.slug === 'string') : []
  } catch {
    return []
  }
}

function writeStorage(next: SavedVehicle[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage full or unavailable — keep in-memory state
  }
}

export default function SavedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SavedVehicle[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setItems(readStorage())
      setHydrated(true)
    })
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items])

  const toggle = useCallback((snapshot: Omit<SavedVehicle, 'savedAt'>) => {
    setItems((current) => {
      const exists = current.some((x) => x.slug === snapshot.slug)
      const next = exists
        ? current.filter((x) => x.slug !== snapshot.slug)
        : [{ ...snapshot, savedAt: new Date().toISOString() }, ...current]
      writeStorage(next)
      return next
    })
  }, [])

  const remove = useCallback((slug: string) => {
    setItems((current) => {
      const next = current.filter((x) => x.slug !== slug)
      writeStorage(next)
      return next
    })
  }, [])

  return (
    <SavedContext.Provider value={{ items, count: items.length, hydrated, has, toggle, remove }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  return useContext(SavedContext)
}
