'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Vehicle } from '@/types/vehicle';

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
            const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}&type=semantic`);
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

        // Debounce search
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

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'motos': case 'motorcycles': return '🏍️';
            case 'camionetas': case 'trucks': return '🛻';
            case 'suvs': return '🚙';
            default: return '🚗';
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder="Buscar vehículos..."
                    className="w-full px-4 py-2 pl-10 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none transition-colors"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {results.slice(0, 6).map((vehicle) => (
                        <Link
                            key={vehicle.id}
                            href={`/vehiculo/${vehicle.slug}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--glass-bg)] transition-colors border-b border-[var(--border)] last:border-b-0"
                        >
                            <span className="text-xl">{getCategoryIcon(vehicle.category)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                    {vehicle.brand} {vehicle.model}
                                </p>
                                <p className="text-xs text-[var(--foreground-muted)]">
                                    {vehicle.year} {vehicle.version && `· ${vehicle.version}`}
                                </p>
                            </div>
                            {vehicle.priceUSD && (
                                <span className="text-sm font-bold text-[var(--primary)]">
                                    ${vehicle.priceUSD.toLocaleString()}
                                </span>
                            )}
                        </Link>
                    ))}
                    {results.length > 6 && (
                        <div className="px-4 py-2 text-center text-xs text-[var(--foreground-muted)] bg-[var(--muted)]">
                            +{results.length - 6} resultados más
                        </div>
                    )}
                </div>
            )}

            {/* No Results */}
            {isOpen && query && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-xl p-4 text-center text-sm text-[var(--foreground-muted)] z-50">
                    No se encontraron vehículos para "{query}"
                </div>
            )}
        </div>
    );
}
