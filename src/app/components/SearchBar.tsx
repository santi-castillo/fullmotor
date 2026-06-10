'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { CategoryIcon } from './ui/CategoryIcon';
import { formatPrice } from '@/lib/format';
import { CATEGORIES } from '@/types/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}&type=semantic`, {
                headers: {
                    'X-Country': 'uy',
                    'X-Vehicle-Type': 'all'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data.data || []);
                setIsOpen(true);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            search(value);
        }, 1000);
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    const categoryIcon = (category: string) =>
        CATEGORIES.find((c) => c.id === category)?.icon || 'car-front';

    return (
        <div ref={searchRef} className="k-search">
            <Search size={17} aria-hidden="true" />
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                placeholder="Buscar marca o modelo…"
            />
            {isLoading && (
                <span className="tm-btn__spinner" style={{ position: 'absolute', right: 14, color: 'var(--accent)' }} aria-hidden="true" />
            )}

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-line rounded-[var(--radius-lg)] shadow-pop max-h-[60vh] overflow-y-auto z-50">
                    {results.map((vehicle) => (
                        <Link
                            key={vehicle.id}
                            href={`/vehiculo/${vehicle.slug}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 text-body hover:bg-sunken transition-colors border-b border-hairline last:border-b-0"
                        >
                            <span className="text-muted shrink-0"><CategoryIcon name={categoryIcon(vehicle.category)} size={18} /></span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-ink truncate">
                                    {vehicle.brand} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted truncate">
                                    {vehicle.year} {vehicle.version && `· ${vehicle.version}`}
                                </p>
                            </div>
                            {vehicle.price != null && (
                                <span className="tm-price text-sm whitespace-nowrap">
                                    {formatPrice(vehicle.currency, vehicle.price)}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {isOpen && query && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-line rounded-[var(--radius-lg)] shadow-pop p-4 text-center text-sm text-muted z-50">
                    No encontramos vehículos para &ldquo;{query}&rdquo;. Probá con otra búsqueda.
                </div>
            )}
        </div>
    );
}
