'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CLASSIFIED_CATEGORIES, ClassifiedCategory } from '@/types/classified'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

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
    <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-end">
      <div className="w-full md:max-w-60">
        <Select
          label="Categoría"
          value={currentCategory}
          onChange={(e) => updateParam('category', e.target.value)}
          placeholder="Todas las categorías"
          options={CLASSIFIED_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
        />
      </div>
      <form onSubmit={onSubmitCity} className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-end">
        <Input
          label="Ciudad"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ej. Montevideo"
          className="flex-1 md:max-w-60"
        />
        <div className="flex gap-2">
          <Button type="submit" variant="secondary">
            Aplicar
          </Button>
          {(currentCategory || currentCity) && (
            <Button variant="ghost" onClick={() => router.push('/clasificados')}>
              Limpiar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
