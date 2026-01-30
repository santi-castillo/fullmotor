'use client';

import Link from "next/link";
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";

interface VehicleTableProps {
    vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [fuelFilter, setFuelFilter] = useState<string>('all');
    const [brandFilter, setBrandFilter] = useState<string>('all');
    const [priceMin, setPriceMin] = useState<string>('');
    const [priceMax, setPriceMax] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get unique brands for filter
    const brands = [...new Set(vehicles.map(v => v.brand))].sort();

    // Filter vehicles
    const filteredVehicles = vehicles.filter(vehicle => {
        // Category filter
        if (categoryFilter !== 'all' && vehicle.category !== categoryFilter) {
            return false;
        }

        // Fuel type filter
        if (fuelFilter !== 'all') {
            const fuelType = vehicle.fuelType?.toLowerCase() || '';
            if (fuelFilter === 'electrico' && fuelType !== 'electrico' && fuelType !== 'eléctrico') {
                return false;
            }
            if (fuelFilter === 'hibrido' && fuelType !== 'hibrido' && fuelType !== 'híbrido') {
                return false;
            }
            if (fuelFilter === 'combustion' && (fuelType === 'electrico' || fuelType === 'eléctrico' || fuelType === 'hibrido' || fuelType === 'híbrido')) {
                return false;
            }
        }

        // Brand filter
        if (brandFilter !== 'all' && vehicle.brand !== brandFilter) {
            return false;
        }

        // Price filter
        if (priceMin && vehicle.priceUSD) {
            if (vehicle.priceUSD < parseInt(priceMin)) {
                return false;
            }
        }
        if (priceMax && vehicle.priceUSD) {
            if (vehicle.priceUSD > parseInt(priceMax)) {
                return false;
            }
        }

        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filters change
    const handleFilterChange = (setter: Function, value: string) => {
        setter(value);
        setCurrentPage(1);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'motos': return '🏍️';
            case 'camionetas': return '🛻';
            case 'suvs': return '🚙';
            default: return '🚗';
        }
    };

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'motos': return 'Moto';
            case 'camionetas': return 'Camioneta';
            case 'suvs': return 'SUV';
            default: return 'Auto';
        }
    };

    const getFuelBadge = (fuelType: string | undefined) => {
        const fuel = fuelType?.toLowerCase() || '';
        if (fuel === 'electrico' || fuel === 'eléctrico') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">⚡ Eléctrico</span>;
        }
        if (fuel === 'hibrido' || fuel === 'híbrido') {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">🔋 Híbrido</span>;
        }
        const fuelLabel = fuel === 'diesel' ? 'Diesel' : fuel === 'nafta' ? 'Nafta' : 'Combustión';
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">⛽ {fuelLabel}</span>;
    };

    const isElectric = (fuelType: string | undefined) => {
        const fuel = fuelType?.toLowerCase() || '';
        return fuel === 'electrico' || fuel === 'eléctrico';
    };

    return (
        <div>
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                {/* Brand Filter */}
                <select
                    value={brandFilter}
                    onChange={(e) => { setBrandFilter(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
                >
                    <option value="all">Todas las marcas</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
                >
                    <option value="all">Todos los tipos</option>
                    <option value="autos">🚗 Autos</option>
                    <option value="suvs">🚙 SUVs</option>
                    <option value="camionetas">🛻 Camionetas</option>
                    <option value="motos">🏍️ Motos</option>
                </select>

                {/* Fuel Filter */}
                <select
                    value={fuelFilter}
                    onChange={(e) => setFuelFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm text-white focus:border-[var(--primary)] focus:outline-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white"
                >
                    <option value="all">Todos los motores</option>
                    <option value="combustion">⛽ Combustión</option>
                    <option value="electrico">⚡ Eléctrico</option>
                    <option value="hibrido">🔋 Híbrido</option>
                </select>

                {/* Price Range Filter */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="USD Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-32 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                    />
                    <span className="text-[var(--foreground-muted)]">-</span>
                    <input
                        type="number"
                        placeholder="USD Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-32 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm focus:border-[var(--primary)] focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--glass-bg)]">
                                <th className="text-left px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Vehículo</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Tipo</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Potencia</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Motor</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Autonomía</th>
                                <th className="text-right px-4 py-4 text-sm font-semibold text-[var(--foreground-muted)]">Precio USD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--foreground-muted)]">
                                        No se encontraron vehículos con los filtros seleccionados
                                    </td>
                                </tr>
                            ) : (
                                paginatedVehicles.map((vehicle, index) => (
                                    <tr
                                        key={vehicle.id}
                                        className={`border-b border-[var(--border)] hover:bg-[var(--glass-bg)] transition-colors group ${index % 2 === 0 ? '' : 'bg-[var(--muted)]'}`}
                                    >
                                        {/* Vehicle Name */}
                                        <td className="px-4 py-4 relative">
                                            <Link href={`/vehiculo/${vehicle.slug}`} className="absolute inset-0 z-10" aria-label={`Ver ${vehicle.brand} ${vehicle.model}`}></Link>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] flex items-center justify-center text-2xl flex-shrink-0">
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

                                        {/* Category */}
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1 text-sm">
                                                <span>{getCategoryIcon(vehicle.category)}</span>
                                                <span className="text-[var(--foreground-muted)]">{getCategoryName(vehicle.category)}</span>
                                            </span>
                                        </td>

                                        {/* HP */}
                                        <td className="px-4 py-4 text-center">
                                            {vehicle.engineHp ? (
                                                <span className="font-bold text-sm">{vehicle.engineHp} <span className="text-xs text-[var(--foreground-muted)]">HP</span></span>
                                            ) : (
                                                <span className="text-[var(--foreground-muted)] text-sm">-</span>
                                            )}
                                        </td>

                                        {/* Fuel Type */}
                                        <td className="px-4 py-4 text-center">
                                            {getFuelBadge(vehicle.fuelType)}
                                        </td>

                                        {/* Autonomy (only for electric) */}
                                        <td className="px-4 py-4 text-center">
                                            {isElectric(vehicle.fuelType) && (vehicle as any).autonomyKm ? (
                                                <span className="font-medium text-sm text-green-400">{(vehicle as any).autonomyKm} km</span>
                                            ) : isElectric(vehicle.fuelType) ? (
                                                <span className="text-[var(--foreground-muted)] text-sm">-</span>
                                            ) : (
                                                <span className="text-[var(--foreground-muted)] text-xs">N/A</span>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-4 text-right">
                                            {vehicle.priceUSD ? (
                                                <span className="price-tag text-sm font-bold">
                                                    USD {vehicle.priceUSD.toLocaleString()}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Anterior
                    </button>
                    <span className="text-sm text-[var(--foreground-muted)]">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--border)] text-sm hover:border-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
