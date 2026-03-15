import Link from "next/link";
import { Vehicle } from "@/types/vehicle";

interface VehicleListProps {
    vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: VehicleListProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'motos': return '🏍️';
            case 'pickups': return '🛻';
            case 'suvs': return '🚙';
            default: return '🚗';
        }
    };

    const getFuelBadge = (fuelType: string | undefined) => {
        const fuel = fuelType?.toLowerCase() || '';

        const BadgeIcon = ({ icon, letter, color, title }: { icon: string, letter: string, color: string, title: string }) => (
            <div className="relative inline-block" title={title}>
                <span className="text-xl">{icon}</span>
                <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1 rounded ${color} leading-3`}>
                    {letter}
                </span>
            </div>
        );

        if (fuel === 'electrico' || fuel === 'eléctrico') {
            return <BadgeIcon icon="⚡" letter="E" color="bg-green-600 text-white" title="Eléctrico" />;
        }
        if (fuel === 'hibrido' || fuel === 'híbrido') {
            return <BadgeIcon icon="🔋" letter="H" color="bg-blue-600 text-white" title="Híbrido" />;
        }

        const isDiesel = fuel === 'diesel';
        const fuelLabel = isDiesel ? 'Diesel' : fuel === 'nafta' ? 'Nafta' : 'Combustión';
        const badgeColor = isDiesel ? 'bg-gray-600 text-white' : 'bg-orange-500 text-white';
        const badgeLetter = isDiesel ? 'D' : 'N';

        return <BadgeIcon icon="⛽" letter={badgeLetter} color={badgeColor} title={fuelLabel} />;
    };

    const isElectric = (fuelType: string | undefined) => {
        const fuel = fuelType?.toLowerCase() || '';
        return fuel === 'electrico' || fuel === 'eléctrico';
    };

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--glass-bg)]">
                            <th className="text-left px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Vehículo</th>
                            <th className="text-right px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Motor</th>
                            <th className="text-right px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!vehicles || vehicles.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-12 text-center text-[var(--foreground-muted)]">
                                    No se encontraron vehículos con los filtros seleccionados
                                </td>
                            </tr>
                        ) : (
                            vehicles.map((vehicle, index) => (
                                <tr
                                    key={vehicle.id}
                                    className={`border-b border-[var(--border)] hover:bg-[var(--glass-bg)] transition-colors group ${index % 2 === 0 ? '' : 'bg-[var(--muted)]'}`}
                                >
                                    {/* Vehicle Name */}
                                    <td className="px-4 py-4 relative">
                                        <Link href={`/vehiculo/${vehicle.slug}`} className="absolute inset-0 z-10" aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}></Link>
                                        <div className="flex items-center gap-3">
                                            <div title={vehicle.category} className="w-12 h-12 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] flex items-center justify-center text-2xl flex-shrink-0">
                                                {vehicle.image ? (
                                                    <img src={vehicle.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    getCategoryIcon(vehicle.category)
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm group-hover:text-[var(--primary-light)] transition-colors">
                                                    {vehicle.brand} {vehicle.model}
                                                </p>
                                                <p className="text-xs text-[var(--foreground-muted)]">
                                                    {vehicle.version && `${vehicle.version} · `}{vehicle.year}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Motor / Power */}
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex flex-col items-center gap-1 w-fit ml-auto">
                                            <div className="mb-1">{getFuelBadge(vehicle.fuelType)}</div>

                                            {vehicle.engineHp ? (
                                                <span className="font-bold text-sm">{vehicle.engineHp} <span className="text-xs text-[var(--foreground-muted)]">HP</span></span>
                                            ) : (
                                                <span className="text-[var(--foreground-muted)] text-sm">-</span>
                                            )}

                                            {isElectric(vehicle.fuelType) && (vehicle as any).autonomyKm && (
                                                <span className="font-medium text-xs text-green-400">{(vehicle as any).autonomyKm} km</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-4 text-right">
                                        {vehicle.price ? (
                                            <span className="text-sm font-bold text-[var(--primary)]">
                                                {vehicle.currency} {vehicle.price.toLocaleString('es-UY')}
                                            </span>
                                        ) : (
                                            <span className="text-[var(--foreground-muted)] text-sm">Consultar</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
