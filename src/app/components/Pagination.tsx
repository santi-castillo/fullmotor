'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    basePath?: string;
}

export default function Pagination({ currentPage, totalPages, total, basePath = '/' }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    void total;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        const qs = params.toString();
        router.push(qs ? `${basePath}?${qs}` : basePath);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-5 mt-8 py-4">
            <Button
                variant="secondary"
                iconOnly
                aria-label="Página anterior"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                iconLeft={<ChevronLeft size={17} aria-hidden="true" />}
            />
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                Página {currentPage} de {totalPages}
            </span>
            <Button
                variant="secondary"
                iconOnly
                aria-label="Página siguiente"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                iconLeft={<ChevronRight size={17} aria-hidden="true" />}
            />
        </div>
    );
}
