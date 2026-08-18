'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { FilterChip } from './ui/FilterChip';
import { Select } from './ui/Select';
import { fuelLabel, formatNumber } from '@/lib/format';
import { CATEGORIES } from '@/types/vehicle';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'power_desc', label: 'Más potentes' },
    { value: 'value_asc', label: 'Mejor precio/HP' },
];

const FUEL_PARAM_LABELS: Record<string, string> = {
    gasoline: fuelLabel('nafta'),
    diesel: fuelLabel('diesel'),
    electric: fuelLabel('eléctrico'),
    hybrid: fuelLabel('híbrido'),
};

export default function InventoryToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const brand = searchParams.get('brand');
    const category = searchParams.get('category') || 'all';
    const fuel = searchParams.get('fuel');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort') || 'newest';

    const update = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all') params.delete(key);
            else params.set(key, value);
        });
        params.delete('page');
        if (!params.has('category')) params.set('category', 'all');
        router.push(`${pathname}?${params.toString()}`);
    }, [router, searchParams]);

    const hasActiveFilters = (category !== 'all') || brand || fuel || minPrice || maxPrice;
    const categoryName = CATEGORIES.find((c) => c.id === category)?.name;

    const priceLabel = minPrice && maxPrice
        ? `USD ${formatNumber(Number(minPrice))}–${formatNumber(Number(maxPrice))}`
        : minPrice
            ? `Desde USD ${formatNumber(Number(minPrice))}`
            : maxPrice
                ? `Hasta USD ${formatNumber(Number(maxPrice))}`
                : null;

    return (
        <div className="iv__toolbar">
            <div className="iv__chips">
                <FilterChip
                    active={!hasActiveFilters}
                    onClick={() => router.push(pathname)}
                >
                    Todos
                </FilterChip>
                {categoryName && category !== 'all' && (
                    <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ category: 'all' })}>
                        {categoryName}
                    </FilterChip>
                )}
                {brand && (
                    <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ brand: null })}>
                        {brand}
                    </FilterChip>
                )}
                {fuel && (
                    <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ fuel: null })}>
                        {FUEL_PARAM_LABELS[fuel] || fuel}
                    </FilterChip>
                )}
                {priceLabel && (
                    <FilterChip active icon={<X size={13} aria-hidden="true" />} onClick={() => update({ min_price: null, max_price: null })}>
                        {priceLabel}
                    </FilterChip>
                )}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>ORDENAR</span>
                <Select size="sm" value={sort} onChange={(e) => update({ sort: e.target.value === 'newest' ? null : e.target.value })} options={SORT_OPTIONS} />
            </label>
        </div>
    );
}
