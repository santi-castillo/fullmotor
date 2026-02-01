'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
}

export default function Pagination({ currentPage, totalPages, total }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        router.push(`/?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-4 px-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                ← Anterior
            </button>
            <span className="text-sm text-[var(--foreground-muted)]">
                Página {currentPage} de {totalPages} ({total} vehículos)
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Siguiente →
            </button>
        </div>
    );
}
