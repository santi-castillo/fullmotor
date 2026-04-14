import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';

interface PremiumListingsProps {
    vehicles: Vehicle[];
}

function getFuelLabel(fuelType: string | undefined): string {
    const fuel = fuelType?.toLowerCase() || '';
    if (fuel === 'electrico' || fuel === 'eléctrico' || fuel === 'electric') return 'Eléctrico';
    if (fuel === 'hibrido' || fuel === 'híbrido' || fuel === 'hybrid') return 'Híbrido';
    if (fuel === 'mild-hybrid' || fuel === 'mild hybrid') return 'Mild Hybrid';
    if (fuel === 'diesel') return 'Diesel';
    if (fuel === 'nafta' || fuel === 'gasoline') return 'Nafta';
    return '-';
}

export default function PremiumListings({ vehicles }: PremiumListingsProps) {
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
                        Novedades
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[var(--accent)] mt-1">
                        Destacados
                    </h2>
                </div>
                <Link
                    href="/?category=all"
                    className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                >
                    Ver Todo el Inventario
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.slice(0, 6).map((vehicle) => (
                    <Link
                        key={vehicle.id}
                        href={`/vehiculo/${vehicle.slug}`}
                        className="group card overflow-hidden"
                    >
                        {/* Image */}
                        <div className="relative h-48 md:h-56 overflow-hidden bg-[var(--card)]" style={{ boxShadow: 'inset 0 -40px 30px -20px var(--card)' }}>
                            {vehicle.image ? (
                                <Image
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-[var(--foreground-muted)] opacity-20">
                                        directions_car
                                    </span>
                                </div>
                            )}

                            {/* Badge */}
                            {vehicle.createdAt && (
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--primary)] text-[#0b1326]">
                                        Nuevo
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <p className="text-xs text-[var(--foreground-muted)] mb-1">{vehicle.brand} &middot; {vehicle.year}</p>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter text-[var(--accent)] group-hover:text-[var(--primary-light)] transition-colors line-clamp-1">
                                {vehicle.model}
                            </h3>
                            {vehicle.version && (
                                <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-1">{vehicle.version}</p>
                            )}

                            {/* Price */}
                            <div className="mt-3">
                                {vehicle.price ? (
                                    <span className="text-xl font-black text-[var(--primary)]">
                                        {vehicle.currency} {vehicle.price.toLocaleString('es-UY')}
                                    </span>
                                ) : (
                                    <span className="text-sm text-[var(--foreground-muted)]">Consultar precio</span>
                                )}
                            </div>

                            {/* Specs grid */}
                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">A&ntilde;o</p>
                                    <p className="text-sm font-bold text-[var(--accent)]">{vehicle.year}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">Potencia</p>
                                    <p className="text-sm font-bold text-[var(--accent)]">{vehicle.engineHp ? `${vehicle.engineHp} HP` : '-'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">Tipo</p>
                                    <p className="text-sm font-bold text-[var(--accent)]">{getFuelLabel(vehicle.fuelType)}</p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-4">
                                <span className="block w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--surface-highest)] text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-[#0b1326] transition-all">
                                    Ver Ficha T&eacute;cnica
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile "View all" link */}
            <div className="mt-8 text-center md:hidden">
                <Link
                    href="/?category=all"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--primary)]"
                >
                    Ver Todo el Inventario
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>
        </section>
    );
}
