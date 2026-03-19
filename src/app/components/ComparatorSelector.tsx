'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vehicle } from '@/types/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ComparatorSelectorProps {
    vehicles?: Vehicle[]; // Make optional or deprecated
    slot: 1 | 2;
    currentSlug?: string;
}

export default function ComparatorSelector({ slot, currentSlug }: ComparatorSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(async () => {
            if (searchTerm.trim().length === 0) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchTerm)}&type=semantic`, {
                    headers: {
                        'X-Country': 'uy',
                        'X-Vehicle-Type': 'all'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setResults(data.data || []);
                }
            } catch (error) {
                console.error("Error searching:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(`vehicle${slot}`, slug);
        router.push(`/compare?${params.toString()}`);
    };

    return (
        <div className="h-full min-h-[250px] p-4 flex flex-col">
            <h3 className="font-bold mb-4 text-center">Seleccionar Vehículo</h3>

            <input
                type="text"
                placeholder="Buscar por marca o modelo..."
                className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
            />

            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1 custom-scrollbar">
                {loading && (
                    <div className="text-center text-[var(--secondary)] py-4">
                        Buscando...
                    </div>
                )}

                {!loading && results.map(v => (
                    <button
                        key={v.slug}
                        onClick={() => handleSelect(v.slug)}
                        className="w-full text-left p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors flex items-center gap-3 group"
                    >
                        <div className="text-xl">
                            {v.category === 'motos' ? '🏍️' :
                                v.category === 'pickups' ? '🛻' :
                                    v.category === 'suvs' ? '🚙' :
                                        v.category === 'utilitarios' ? '🚐' : '🚗'}
                        </div>
                        <div>
                            <div className="font-bold group-hover:text-[var(--primary)] transition-colors">{v.brand} {v.model}</div>
                            <div className="text-xs text-[var(--secondary)]">{v.version} • {v.year}</div>
                        </div>
                    </button>
                ))}

                {!loading && searchTerm && results.length === 0 && (
                    <div className="text-center text-[var(--secondary)] py-8">
                        No se encontraron vehículos.
                    </div>
                )}

                {!searchTerm && !loading && (
                    <div className="text-center text-[var(--secondary)] py-8 flex flex-col items-center gap-2 opacity-60">
                        <span className="text-2xl">🔍</span>
                        <span className="text-sm">Busca un vehículo para comparar</span>
                    </div>
                )}
            </div>
        </div>
    );
}
