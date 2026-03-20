'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Vehicle } from '@/types/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function HeroSection() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    return (
        <section className="relative py-20 md:py-32 px-4">
            {/* Background glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1326] via-[#131b2e] to-[#0b1326]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,220,229,0.08)_0%,transparent_70%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.05)_0%,transparent_70%)]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="max-w-3xl">
                    {/* Label */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-[var(--primary)] text-xl">electric_bolt</span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
                            Todo Motor Uruguay
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
                        <span className="electric-gradient">Encontr&aacute;</span>
                        <br />
                        <span className="text-[var(--accent)]">Tu Pr&oacute;ximo</span>
                        <br />
                        <span className="electric-gradient">Veh&iacute;culo</span>
                    </h1>

                    {/* Subtitle with left cyan border */}
                    <div className="border-l-2 border-[var(--primary)] pl-4 mb-10">
                        <p className="text-[var(--foreground-muted)] text-base md:text-lg max-w-lg">
                            Fichas t&eacute;cnicas completas de autos, SUVs, camionetas y motos disponibles en Uruguay.
                        </p>
                    </div>

                    {/* Search bar with live results */}
                    <div ref={searchRef} className="relative max-w-xl">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] text-xl">search</span>
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                onFocus={() => results.length > 0 && setIsOpen(true)}
                                placeholder="Marca, modelo o tipo..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl glass-panel text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                            />
                            {isLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Results Dropdown */}
                        {isOpen && results.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--glass-border)] rounded-xl shadow-2xl overflow-hidden z-50">
                                {results.map((vehicle) => (
                                    <Link
                                        key={vehicle.id}
                                        href={`/vehiculo/${vehicle.slug}`}
                                        onClick={handleResultClick}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-high)] transition-colors border-b border-[var(--border)] last:border-b-0"
                                    >
                                        {vehicle.image ? (
                                            <img src={vehicle.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-[var(--surface-high)] flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-[var(--foreground-muted)] text-lg">directions_car</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-[var(--accent)] truncate">
                                                {vehicle.brand} {vehicle.model}
                                            </p>
                                            <p className="text-xs text-[var(--foreground-muted)]">
                                                {vehicle.year} {vehicle.version && `· ${vehicle.version}`}
                                            </p>
                                        </div>
                                        {vehicle.price && (
                                            <span className="text-sm font-bold text-[var(--primary)]">
                                                {vehicle.currency} {vehicle.price.toLocaleString()}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {isOpen && query && results.length === 0 && !isLoading && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--glass-border)] rounded-xl shadow-2xl p-4 text-center text-sm text-[var(--foreground-muted)] z-50">
                                No se encontraron veh&iacute;culos para &ldquo;{query}&rdquo;
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center gap-4">
                        <Link
                            href="/?category=all"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-[#0b1326] hover:shadow-[0_6px_30px_rgba(0,220,229,0.4)] transition-all"
                            style={{ background: 'linear-gradient(135deg, #00dce5 0%, #00f5ff 100%)' }}
                        >
                            <span className="material-symbols-outlined text-lg">inventory_2</span>
                            Ver Inventario
                        </Link>
                        <span className="text-xs text-[var(--foreground-muted)]">o busc&aacute; por nombre arriba</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
