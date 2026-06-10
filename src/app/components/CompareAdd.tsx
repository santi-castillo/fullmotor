'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { CategoryIcon } from './ui/CategoryIcon';
import { CATEGORIES } from '@/types/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface CompareAddProps {
    /** Slugs currently in the comparison */
    current: string[];
}

export default function CompareAdd({ current }: CompareAddProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
        const next = [...current.filter((s) => s !== slug), slug].slice(0, 4);
        router.push(`/compare?vehicles=${next.join(',')}`);
    };

    const candidates = results.filter((v) => !current.includes(v.slug));

    return (
        <div className="cm__addbox">
            <Plus size={22} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <p>Agregá un vehículo</p>
            <input
                type="text"
                placeholder="Buscá marca o modelo…"
                className="tm-input tm-input--sm"
                style={{ textAlign: 'center' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && <p>Buscando…</p>}
            {!loading && candidates.length > 0 && (
                <div style={{ width: '100%', maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {candidates.map((v) => (
                        <button
                            key={v.slug}
                            type="button"
                            onClick={() => handleSelect(v.slug)}
                            className="flex items-center gap-2.5 w-full text-left p-2.5 rounded-[var(--radius-md)] bg-surface border border-line hover:border-line-strong hover:bg-sunken transition-colors cursor-pointer"
                        >
                            <span className="text-muted shrink-0">
                                <CategoryIcon name={CATEGORIES.find((c) => c.id === v.category)?.icon || 'car-front'} size={17} />
                            </span>
                            <span style={{ minWidth: 0 }}>
                                <span className="block text-sm font-semibold text-ink truncate">{v.brand} {v.model}</span>
                                <span className="block text-xs text-muted truncate">{[v.version, v.year].filter(Boolean).join(' · ')}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
            {!loading && searchTerm && candidates.length === 0 && (
                <p>No encontramos vehículos.</p>
            )}
        </div>
    );
}
