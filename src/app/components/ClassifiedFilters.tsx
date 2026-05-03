'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CLASSIFIED_CATEGORIES, ClassifiedCategory } from '@/types/classified'

export default function ClassifiedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = (searchParams.get('category') || '') as ClassifiedCategory | ''
  const currentCity = searchParams.get('city') || ''
  const [city, setCity] = useState(currentCity)

  useEffect(() => {
    setCity(currentCity)
  }, [currentCity])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    const query = params.toString()
    router.push(query ? `/clasificados?${query}` : '/clasificados')
  }

  const onSubmitCity = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('city', city.trim())
  }

  return (
    <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-end">
      <div className="flex-1">
        <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
          Categoría
        </label>
        <select
          value={currentCategory}
          onChange={(e) => updateParam('category', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
        >
          <option value="">Todas las categorías</option>
          {CLASSIFIED_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={onSubmitCity} className="flex-1 flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
            Ciudad
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ej. Montevideo"
            className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] transition-colors"
        >
          Aplicar
        </button>
        {(currentCategory || currentCity) && (
          <button
            type="button"
            onClick={() => router.push('/clasificados')}
            className="px-4 py-2 rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Limpiar
          </button>
        )}
      </form>
    </div>
  )
}
