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
        <div className="flex items-center justify-center gap-6 mt-8 py-4">
            {/* Previous */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--surface-high)] border border-[var(--glass-border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#0b1326] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            {/* Page info */}
            <span className="text-xs font-black tracking-[0.15em] uppercase text-[var(--foreground-muted)]">
                P&aacute;gina {currentPage} de {totalPages}
            </span>

            {/* Next */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--surface-high)] border border-[var(--glass-border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#0b1326] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
        </div>
    );
}
