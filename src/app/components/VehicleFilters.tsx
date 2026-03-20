'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';

interface VehicleFiltersProps {
    brands: string[];
}

export default function VehicleFilters({ brands }: VehicleFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentBrand = searchParams.get('brand') || 'all';
    const currentCategory = searchParams.get('category') || 'all';
    const currentFuel = searchParams.get('fuel') || 'all';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentMinPrice = searchParams.get('min_price') || '';
    const currentMaxPrice = searchParams.get('max_price') || '';

    const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
    const [showFilters, setShowFilters] = useState(false);
    const isInitialMount = useRef(true);

    useEffect(() => {
        setLocalMinPrice(currentMinPrice);
        setLocalMaxPrice(currentMaxPrice);
    }, [currentMinPrice, currentMaxPrice]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            if (localMinPrice !== currentMinPrice || localMaxPrice !== currentMaxPrice) {
                const params = new URLSearchParams(searchParams.toString());
                if (localMinPrice) {
                    params.set('min_price', localMinPrice);
                } else {
                    params.delete('min_price');
                }
                if (localMaxPrice) {
                    params.set('max_price', localMaxPrice);
                } else {
                    params.delete('max_price');
                }
                params.delete('page');
                router.push(`/?${params.toString()}`);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [localMinPrice, localMaxPrice]);

    const activeFilterCount = [
        currentBrand !== 'all' ? 1 : 0,
        currentCategory !== 'all' ? 1 : 0,
        currentFuel !== 'all' ? 1 : 0,
        currentMinPrice ? 1 : 0,
        currentMaxPrice ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const createQueryString = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'all') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            if (!updates.hasOwnProperty('page')) {
                params.delete('page');
            }

            // Always keep category param so we stay in inventory view
            if (!params.has('category')) {
                params.set('category', 'all');
            }

            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (key: string, value: string) => {
        const query = createQueryString({ [key]: value });
        router.push(`/?${query}`);
    };

    const selectClass = "px-4 py-2.5 rounded-xl bg-[var(--surface-high)] border border-[var(--glass-border)] text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-[#131b2e] [&>option]:text-[var(--foreground)]";

    return (
        <div className="space-y-4">
            {/* Top bar: filter toggle + sort */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        showFilters || activeFilterCount > 0
                            ? 'bg-[var(--primary)] text-[#0b1326]'
                            : 'bg-[var(--surface-high)] text-[var(--foreground)] border border-[var(--glass-border)]'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">tune</span>
                    Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>

                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--foreground-muted)] text-lg">sort</span>
                    <select
                        value={currentSort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className={selectClass}
                    >
                        <option value="newest">M&aacute;s recientes</option>
                        <option value="oldest">M&aacute;s antiguos</option>
                        <option value="price_asc">Menor precio</option>
                        <option value="price_desc">Mayor precio</option>
                        <option value="power_asc">Menor potencia</option>
                        <option value="power_desc">Mayor potencia</option>
                        <option value="value_asc">Mejor relaci&oacute;n precio/potencia</option>
                        <option value="value_desc">Peor relaci&oacute;n precio/potencia</option>
                    </select>
                </div>
            </div>

            {/* Expandable filter panel */}
            {showFilters && (
                <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-[var(--surface-mid)] border border-[var(--glass-border)] animate-[fadeIn_0.2s_ease-out]">
                    <select
                        value={currentBrand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">Todas las marcas</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>

                    <select
                        value={currentCategory}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="autos">Autos</option>
                        <option value="suvs">SUVs</option>
                        <option value="pickups">Camionetas</option>
                        <option value="motos">Motos</option>
                        <option value="utilitarios">Utilitarios</option>
                    </select>

                    <select
                        value={currentFuel}
                        onChange={(e) => handleFilterChange('fuel', e.target.value)}
                        className={selectClass}
                    >
                        <option value="all">Todos los motores</option>
                        <option value="gasoline">Nafta</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">El&eacute;ctrico</option>
                        <option value="hybrid">H&iacute;brido</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Precio Min"
                            value={localMinPrice}
                            onChange={(e) => setLocalMinPrice(e.target.value)}
                            className="w-28 px-3 py-2.5 rounded-xl bg-[var(--surface-high)] border border-[var(--glass-border)] text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                        />
                        <span className="text-[var(--foreground-muted)]">-</span>
                        <input
                            type="number"
                            placeholder="Precio Max"
                            value={localMaxPrice}
                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                            className="w-28 px-3 py-2.5 rounded-xl bg-[var(--surface-high)] border border-[var(--glass-border)] text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
