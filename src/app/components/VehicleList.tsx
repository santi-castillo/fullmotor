import Link from "next/link";
import { Vehicle } from "@/types/vehicle";

interface VehicleListProps {
    vehicles: Vehicle[];
}

function getFuelLabel(fuelType: string | undefined): string {
    const fuel = fuelType?.toLowerCase() || '';
    if (fuel === 'electrico' || fuel === 'eléctrico') return 'Eléctrico';
    if (fuel === 'hibrido' || fuel === 'híbrido') return 'Híbrido';
    if (fuel === 'diesel') return 'Diesel';
    if (fuel === 'nafta') return 'Nafta';
    return 'Combustión';
}

export default function VehicleList({ vehicles }: VehicleListProps) {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-[var(--foreground-muted)] opacity-30 mb-4 block">search_off</span>
                <p className="text-[var(--foreground-muted)] text-lg">
                    No se encontraron veh&iacute;culos con los filtros seleccionados
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {vehicles.map((vehicle) => (
                <Link
                    key={vehicle.id}
                    href={`/vehiculo/${vehicle.slug}`}
                    className="group card overflow-hidden"
                >
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden bg-[var(--card)]" style={{ boxShadow: 'inset 0 -40px 30px -20px var(--card)' }}>
                        {vehicle.image ? (
                            <img
                                src={vehicle.image}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-[var(--foreground-muted)] opacity-20">
                                    directions_car
                                </span>
                            </div>
                        )}

                        {/* Category glass badge */}
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider glass-panel text-[var(--accent)]">
                                {vehicle.category === 'pickups' ? 'Camioneta' : vehicle.category === 'motos' ? 'Moto' : vehicle.category === 'utilitarios' ? 'Utilitario' : vehicle.category === 'suvs' ? 'SUV' : 'Auto'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <p className="text-xs text-[var(--foreground-muted)] mb-1">{vehicle.brand} &middot; {vehicle.year}</p>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--accent)] group-hover:text-[var(--primary-light)] transition-colors line-clamp-1">
                            {vehicle.model}
                        </h3>
                        {vehicle.version && (
                            <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-1">{vehicle.version}</p>
                        )}

                        {/* Price */}
                        <div className="mt-3">
                            {vehicle.price ? (
                                <span className="text-2xl font-black text-[var(--primary)]">
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
                                <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
                                    {vehicle.engineHp ? 'Potencia' : vehicle.engineCc ? 'Cilindrada' : 'Motor'}
                                </p>
                                <p className="text-sm font-bold text-[var(--accent)]">
                                    {vehicle.engineHp ? `${vehicle.engineHp} HP` : vehicle.engineCc ? `${vehicle.engineCc} CC` : '-'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">Tipo</p>
                                <p className="text-sm font-bold text-[var(--accent)]">{getFuelLabel(vehicle.fuelType)}</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4">
                            <span className="block w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--surface-highest)] text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-[#0b1326] transition-all">
                                Ver Detalles
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
