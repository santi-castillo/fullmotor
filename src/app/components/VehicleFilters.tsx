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

    // Local state for debounced price inputs
    const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
    const isInitialMount = useRef(true);

    // Sync local state when URL params change externally (e.g. back/forward navigation)
    useEffect(() => {
        setLocalMinPrice(currentMinPrice);
        setLocalMaxPrice(currentMaxPrice);
    }, [currentMinPrice, currentMaxPrice]);

    // Debounce price changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            // Only navigate if values actually differ from URL
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

            // Reset to page 1 when filters change
            if (!updates.hasOwnProperty('page')) {
                params.delete('page');
            }

            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (key: string, value: string) => {
        const query = createQueryString({ [key]: value });
        router.push(`/?${query}`);
    };

    return (
        <div className="flex flex-wrap gap-3 mb-6 items-center">
            {/* Brand Filter */}
            <select
                value={currentBrand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="all">Todas las marcas</option>
                {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            {/* Category Filter */}
            <select
                value={currentCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="all">Todos los tipos</option>
                <option value="autos">Autos</option>
                <option value="suvs">SUVs</option>
                <option value="pickups">Camionetas</option>
                <option value="motos">Motos</option>
                <option value="utilitarios">Utilitarios</option>
            </select>

            {/* Fuel Filter */}
            <select
                value={currentFuel}
                onChange={(e) => handleFilterChange('fuel', e.target.value)}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="all">Todos los motores</option>
                <option value="gasoline">Nafta</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Eléctrico</option>
                <option value="hybrid">Híbrido</option>
            </select>

            {/* Price Range Filter */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    placeholder="Precio Min"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                />
                <span className="text-[var(--foreground-muted)]">-</span>
                <input
                    type="number"
                    placeholder="Precio Max"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                />
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-[var(--foreground-muted)]">Ordenar por:</span>
                <select
                    value={currentSort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
                >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="power_asc">Menor potencia</option>
                    <option value="power_desc">Mayor potencia</option>
                    <option value="value_asc">Mejor relación precio/potencia</option>
                    <option value="value_desc">Peor relación precio/potencia</option>
                </select>
            </div>
        </div>
    );
}
