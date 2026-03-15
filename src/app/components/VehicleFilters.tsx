'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface VehicleFiltersProps {
    brands: string[];
}

export default function VehicleFilters({ brands }: VehicleFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const currentBrand = searchParams.get('brand') || 'all';
    const currentCategory = searchParams.get('category') || 'all';
    const currentFuel = searchParams.get('fuel') || 'all';
    const currentMinPrice = searchParams.get('min_price') || '';
    const currentMaxPrice = searchParams.get('max_price') || '';

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
                <option value="autos">🚗 Autos</option>
                <option value="suvs">🚙 SUVs</option>
                <option value="pickups">🛻 Camionetas</option>
                <option value="motos">🏍️ Motos</option>
            </select>

            {/* Fuel Filter */}
            <select
                value={currentFuel}
                onChange={(e) => handleFilterChange('fuel', e.target.value)}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="all">Todos los motores</option>
                <option value="gasoline">⛽ Nafta</option>
                <option value="diesel">⛽ Diesel</option>
                <option value="electric">⚡ Eléctrico</option>
                <option value="hybrid">🔋 Híbrido</option>
            </select>

            {/* Price Range Filter */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    placeholder="Precio Min"
                    value={currentMinPrice}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                />
                <span className="text-[var(--foreground-muted)]">-</span>
                <input
                    type="number"
                    placeholder="Precio Max"
                    value={currentMaxPrice}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                />
            </div>
        </div>
    );
}
