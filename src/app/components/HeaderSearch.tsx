'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';

export default function HeaderSearch() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasFilters = searchParams.has('category') || searchParams.has('brand') || searchParams.has('fuel') || searchParams.has('page');

    // Hide on home page (no filters = hero with its own search is showing)
    if (pathname === '/' && !hasFilters) return <div className="k-search" aria-hidden="true" />;

    return <SearchBar />;
}
