'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import { CategoryIcon } from './ui/CategoryIcon';
import { FuelTag } from './ui/FuelTag';
import { Select } from './ui/Select';
import type { FuelTagType } from '@/lib/format';
import type { CategoryIconName } from '@/types/vehicle';

interface CategoryCount {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface VehicleFiltersProps {
    brands: string[];
    categories: CategoryCount[];
}

// URL/backend fuel values stay as-is (gasoline/diesel/electric/hybrid);
// the FuelTag key is display-only.
const FUELS: { value: string; tag: FuelTagType }[] = [
    { value: 'gasoline', tag: 'nafta' },
    { value: 'electric', tag: 'electrico' },
    { value: 'hybrid', tag: 'hibrido' },
    { value: 'diesel', tag: 'diesel' },
];

export default function VehicleFilters({ brands, categories }: VehicleFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentBrand = searchParams.get('brand') || 'all';
    const currentCategory = searchParams.get('category') || 'all';
    const currentFuel = searchParams.get('fuel') || 'all';
    const currentMinPrice = searchParams.get('min_price') || '';
    const currentMaxPrice = searchParams.get('max_price') || '';

    const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
    const isInitialMount = useRef(true);

    // Sync local inputs when the URL changes externally (render-phase
    // adjustment — the pattern react.dev recommends over an effect)
    const [prevUrlPrices, setPrevUrlPrices] = useState({ min: currentMinPrice, max: currentMaxPrice });
    if (prevUrlPrices.min !== currentMinPrice || prevUrlPrices.max !== currentMaxPrice) {
        setPrevUrlPrices({ min: currentMinPrice, max: currentMaxPrice });
        setLocalMinPrice(currentMinPrice);
        setLocalMaxPrice(currentMaxPrice);
    }

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
                if (!params.has('category')) params.set('category', 'all');
                router.push(`/?${params.toString()}`);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [localMinPrice, localMaxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

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

            if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
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

    const allCategories: CategoryCount[] = [
        { id: 'all', name: 'Todos', icon: 'layout-grid', count: categories.reduce((a, c) => a + c.count, 0) },
        ...categories,
    ];

    return (
        <aside className="iv__filters">
            <div className="fgroup">
                <h4>Categoría</h4>
                <div className="fcat">
                    {allCategories.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={currentCategory === c.id ? 'on' : ''}
                            onClick={() => handleFilterChange('category', c.id === 'all' ? 'all' : c.id)}
                        >
                            <CategoryIcon name={c.icon as CategoryIconName} size={17} />
                            {c.name}
                            {c.count > 0 && <span className="c">{c.count}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {brands.length > 0 && (
                <div className="fgroup">
                    <h4>Marca</h4>
                    <Select
                        value={currentBrand === 'all' ? '' : currentBrand}
                        onChange={(e) => handleFilterChange('brand', e.target.value || 'all')}
                        placeholder="Todas las marcas"
                        options={brands.map((b) => ({ value: b, label: b }))}
                    />
                </div>
            )}

            <div className="fgroup">
                <h4>Combustible</h4>
                <div className="fchecks">
                    {FUELS.map((f) => (
                        <label className="fcheck" key={f.value}>
                            <input
                                type="checkbox"
                                checked={currentFuel === f.value}
                                onChange={() => handleFilterChange('fuel', currentFuel === f.value ? 'all' : f.value)}
                            />
                            <FuelTag type={f.tag} plain />
                        </label>
                    ))}
                </div>
            </div>

            <div className="fgroup">
                <h4>Precio (USD)</h4>
                <div className="fprice">
                    <input
                        inputMode="numeric"
                        placeholder="Mín"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value.replace(/\D/g, ''))}
                    />
                    <span>–</span>
                    <input
                        inputMode="numeric"
                        placeholder="Máx"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value.replace(/\D/g, ''))}
                    />
                </div>
            </div>
        </aside>
    );
}
