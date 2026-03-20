'use client';

import { useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';

export default function HeaderSearch() {
    const searchParams = useSearchParams();
    const hasFilters = searchParams.has('category') || searchParams.has('brand') || searchParams.has('fuel') || searchParams.has('page');

    // Hide on home page (no filters = hero with its own search is showing)
    if (!hasFilters) return null;

    return <SearchBar />;
}
