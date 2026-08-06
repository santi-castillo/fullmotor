'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CLASSIFIED_CATEGORIES, ClassifiedCategory } from '@/types/classified'
import { formatNumber } from '@/lib/format'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { FilterChip } from './ui/FilterChip'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'UYU', label: 'UYU' },
]

/**
 * Long enough that typing a model name is one request instead of ten, short
 * enough that the list still feels live.
 */
const TYPING_DEBOUNCE_MS = 500

export default function ClassifiedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentQ = searchParams.get('q') || ''
  const currentCategory = (searchParams.get('category') || '') as ClassifiedCategory | ''
  const currentCity = searchParams.get('city') || ''
  const currentMin = searchParams.get('min_price') || ''
  const currentMax = searchParams.get('max_price') || ''
  const currentCurrency = searchParams.get('currency') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  const [panelOpen, setPanelOpen] = useState(false)
  const [q, setQ] = useState(currentQ)
  const [city, setCity] = useState(currentCity)
  const [minPrice, setMinPrice] = useState(currentMin)
  const [maxPrice, setMaxPrice] = useState(currentMax)

  const update = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      })
      // Any change to the result set invalidates the page number.
      params.delete('page')
      const query = params.toString()
      router.push(query ? `/clasificados?${query}` : '/clasificados')
    },
    [router, searchParams]
  )

  // Adopt external URL changes — back button, "Limpiar" — into the text inputs.
  const [prevUrl, setPrevUrl] = useState({ q: currentQ, city: currentCity, min: currentMin, max: currentMax })
  if (
    prevUrl.q !== currentQ ||
    prevUrl.city !== currentCity ||
    prevUrl.min !== currentMin ||
    prevUrl.max !== currentMax
  ) {
    setPrevUrl({ q: currentQ, city: currentCity, min: currentMin, max: currentMax })
    setQ(currentQ)
    setCity(currentCity)
    setMinPrice(currentMin)
    setMaxPrice(currentMax)
  }

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const t = setTimeout(() => {
      if (q === currentQ && city === currentCity && minPrice === currentMin && maxPrice === currentMax) return
      update({
        q: q.trim() || null,
        city: city.trim() || null,
        min_price: minPrice || null,
        max_price: maxPrice || null,
      })
    }, TYPING_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [q, city, minPrice, maxPrice, currentQ, currentCity, currentMin, currentMax, update])

  const categoryLabel = CLASSIFIED_CATEGORIES.find((c) => c.id === currentCategory)?.label
  const cur = currentCurrency || 'USD'
  const priceLabel =
    currentMin && currentMax
      ? `${cur} ${formatNumber(Number(currentMin))}–${formatNumber(Number(currentMax))}`
      : currentMin
        ? `Desde ${cur} ${formatNumber(Number(currentMin))}`
        : currentMax
          ? `Hasta ${cur} ${formatNumber(Number(currentMax))}`
          : null

  const hasFilters = Boolean(
    currentQ || currentCategory || currentCity || currentMin || currentMax || currentCurrency
  )

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Input
            type="search"
            aria-label="Buscar en clasificados"
            placeholder="Buscá por modelo, repuesto o palabra clave…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            iconLeft={<Search size={15} aria-hidden="true" />}
          />
        </div>
        {/* The panel is always open from md up. On a phone it would otherwise
            push every listing below the fold before anyone saw a single one.
            md:hidden goes on a wrapper rather than the button: components.css is
            imported after Tailwind, so .tm-btn's display would win. */}
        <div className="md:hidden">
          <Button
            variant="secondary"
            aria-expanded={panelOpen}
            iconLeft={<SlidersHorizontal size={15} aria-hidden="true" />}
            onClick={() => setPanelOpen((v) => !v)}
          >
            Filtros
          </Button>
        </div>
      </div>

      <div
        className={`${panelOpen ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-start`}
      >
        <Select
          label="Categoría"
          value={currentCategory}
          onChange={(e) => update({ category: e.target.value || null })}
          placeholder="Todas"
          options={CLASSIFIED_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
        />
        <Input
          label="Ciudad"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ej. Montevideo"
        />
        <Input
          label="Precio desde"
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          className="[&_.tm-input]:font-mono"
        />
        <Input
          label="Precio hasta"
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Sin tope"
          className="[&_.tm-input]:font-mono"
        />
        <Select
          label="Moneda"
          value={currentCurrency}
          onChange={(e) => update({ currency: e.target.value || null })}
          placeholder="USD"
          options={CURRENCIES}
        />
      </div>

      <div className="iv__toolbar">
        <div className="iv__chips">
          {currentQ && (
            <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ q: null })}>
              “{currentQ}”
            </FilterChip>
          )}
          {categoryLabel && (
            <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ category: null })}>
              {categoryLabel}
            </FilterChip>
          )}
          {currentCity && (
            <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ city: null })}>
              {currentCity}
            </FilterChip>
          )}
          {priceLabel && (
            <FilterChip
              active
              icon={<X size={13} aria-hidden="true" />}
              onClick={() => update({ min_price: null, max_price: null })}
            >
              {priceLabel}
            </FilterChip>
          )}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => router.push('/clasificados')}>
              Limpiar
            </Button>
          )}
        </div>

        <label className="flex items-center gap-2">
          <span className="tm-eyebrow">Ordenar</span>
          <Select
            size="sm"
            aria-label="Ordenar"
            value={currentSort}
            onChange={(e) => update({ sort: e.target.value === 'newest' ? null : e.target.value })}
            options={SORT_OPTIONS}
          />
        </label>
      </div>
    </div>
  )
}
