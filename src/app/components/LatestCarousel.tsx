'use client';

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Vehicle } from "@/types/vehicle";

interface LatestCarouselProps {
    vehicles: Vehicle[];
}

export default function LatestCarousel({ vehicles }: LatestCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            // Use a larger buffer to account for padding-left (px-12 = 48px) and snap positioning
            // When snapped to the very first item, scrollLeft is exactly 48px on some browsers.
            setCanScrollLeft(scrollLeft > 50);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        
        let observer: ResizeObserver;
        if (scrollRef.current) {
            observer = new ResizeObserver(() => checkScroll());
            observer.observe(scrollRef.current);
        }

        // Add a small delay check for fonts/images loading
        const timeoutId = setTimeout(checkScroll, 100);

        return () => {
            window.removeEventListener('resize', checkScroll);
            if (observer) observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [vehicles]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'motos': return '🏍️';
            case 'pickups': return '🛻';
            case 'suvs': return '🚙';
            default: return '🚗';
        }
    };

    return (
        <div className="relative">
            {/* Left Button */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 backdrop-blur-sm shadow-lg pointer-events-auto"
                    aria-label="Anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Right Button */}
            {canScrollRight && vehicles?.length > 0 && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 backdrop-blur-sm shadow-lg pointer-events-auto"
                    aria-label="Siguiente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            )}

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto pb-4 px-12 snap-x snap-mandatory scrollbar-hide"
            >
                {(vehicles || []).map((vehicle) => (
                    <Link
                        key={vehicle.id}
                        href={`/vehiculo/${vehicle.slug}`}
                        className="flex-shrink-0 w-72 snap-start"
                    >
                        <article className="card group h-full">
                            <div className="aspect-[16/10] bg-[var(--muted)] flex items-center justify-center overflow-hidden relative">
                                {vehicle.image ? (
                                    <img
                                        src={vehicle.image}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-5xl opacity-30">
                                        {getCategoryIcon(vehicle.category)}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-60"></div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-[var(--foreground-muted)]">{vehicle.brand}</p>
                                <h3 className="font-bold text-base group-hover:text-[var(--primary-light)] transition-colors line-clamp-2">
                                    {vehicle.model} {vehicle.version && <span className="font-normal text-[var(--foreground-muted)]">{vehicle.version}</span>}
                                </h3>
                                <div className="flex items-center justify-between mt-2">
                                    {vehicle.createdAt && (
                                        <span className="category-badge text-xs py-1 px-2">
                                            {new Date(vehicle.createdAt).toLocaleDateString('es-UY')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {/* Gradient fade on edges */}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none transition-opacity duration-300"></div>
            )}
            {canScrollRight && vehicles?.length > 0 && (
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none transition-opacity duration-300"></div>
            )}
        </div>
    );
}
