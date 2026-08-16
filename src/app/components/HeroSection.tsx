'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Search, ArrowRight, Compass } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { formatNumber, formatPrice } from '@/lib/format';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface HeroSectionProps {
    total?: number;
    brandsCount?: number;
}

export default function HeroSection({ total, brandsCount }: HeroSectionProps) {
    const router = useRouter();
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

    const goToInventory = () => {
        router.push(query ? `/?category=all&brand=${encodeURIComponent(query)}` : '/?category=all');
    };

    return (
        <section className="h-hero">
            <div className="h-hero__in">
                <span className="h-eyebrow">
                    <BadgeCheck size={14} aria-hidden="true" />
                    {total ? `${formatNumber(total)} fichas técnicas en Uruguay` : 'Fichas técnicas en Uruguay'}
                </span>
                <h1 className="h-title">Encontrá tu <em>próximo</em> vehículo</h1>
                <p className="h-sub">Fichas técnicas completas, precios de referencia y comparativas. Sin vueltas, con datos.</p>

                <div className="h-searchbar" ref={searchRef}>
                    <div className="field">
                        <Search size={20} aria-hidden="true" />
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => results.length > 0 && setIsOpen(true)}
                            onKeyDown={(e) => { if (e.key === 'Enter') goToInventory(); }}
                            placeholder="Buscá por marca o modelo — ej. Taos, Corolla…"
                        />
                        {isLoading && (
                            <span className="tm-btn__spinner" style={{ position: 'absolute', right: 16, color: 'var(--accent)' }} aria-hidden="true" />
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
                                        {vehicle.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={vehicle.image} alt="" className="w-10 h-10 rounded-[var(--radius-sm)] object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-sunken flex-shrink-0" />
                                        )}
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
                    <button type="button" className="tm-btn tm-btn--lg" onClick={goToInventory}>
                        Ver inventario
                        <ArrowRight size={18} aria-hidden="true" />
                    </button>
                </div>

                <Link href="/guia-de-compra" className="h-guide-link">
                    <Compass size={16} aria-hidden="true" />
                    ¿No sabés por dónde empezar? Probá la guía de compra
                    <ArrowRight size={14} aria-hidden="true" />
                </Link>

                <div className="h-stats">
                    {total != null && total > 0 && (
                        <div className="h-stat"><div className="n">{formatNumber(total)}</div><div className="l">vehículos</div></div>
                    )}
                    {brandsCount != null && brandsCount > 0 && (
                        <div className="h-stat"><div className="n">{brandsCount}</div><div className="l">marcas</div></div>
                    )}
                    <div className="h-stat"><div className="n">5</div><div className="l">categorías</div></div>
                    <div className="h-stat"><div className="n">{new Date().getFullYear()}</div><div className="l">modelos al día</div></div>
                </div>
            </div>
        </section>
    );
}
