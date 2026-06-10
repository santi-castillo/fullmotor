'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Vehicle } from '@/types/vehicle';
import VehicleList from './VehicleList';

interface InfiniteVehicleListProps {
  initialVehicles: Vehicle[];
  initialMeta: { total: number; page: number; lastPage: number };
}

export default function InfiniteVehicleList({ initialVehicles, initialMeta }: InfiniteVehicleListProps) {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [currentPage, setCurrentPage] = useState(initialMeta.page);
  const [lastPage, setLastPage] = useState(initialMeta.lastPage);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when filters change (searchParams change)
  const filterKey = searchParams.toString();
  const prevFilterKey = useRef(filterKey);

  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey;
      setVehicles(initialVehicles);
      setCurrentPage(initialMeta.page);
      setLastPage(initialMeta.lastPage);
    }
  }, [filterKey, initialVehicles, initialMeta]);

  const loadMore = useCallback(async () => {
    if (loading || currentPage >= lastPage) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());
    params.set('limit', '9');

    try {
      const res = await fetch(`/api/vehicles?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: { vehicles: Vehicle[]; meta: { total: number; page: number; lastPage: number } } = await res.json();

      setVehicles(prev => [...prev, ...data.vehicles]);
      setCurrentPage(data.meta.page);
      setLastPage(data.meta.lastPage);
    } catch (error) {
      console.error('Error loading more vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentPage, lastPage, searchParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <VehicleList vehicles={vehicles} />

      {/* Sentinel + loading indicator */}
      {currentPage < lastPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-3 text-muted">
              <span className="tm-btn__spinner" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.08em]">Cargando…</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
