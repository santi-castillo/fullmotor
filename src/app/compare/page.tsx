import Link from "next/link";
import { getVehicleBySlug } from "@/lib/data";
import ComparatorSelector from "@/app/components/ComparatorSelector";
import { Vehicle } from "@/types/vehicle";

// Helper to format values safely
const formatCurrency = (currency: string, value?: number) => {
    if (!value) return null;
    return `${currency} ${value.toLocaleString()}`;
};

const formatValue = (value?: string | number) => value || '-';

export default async function ComparatorPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const v1Slug = params.vehicle1 as string | undefined;
    const v2Slug = params.vehicle2 as string | undefined;

    const vehicle1 = v1Slug ? await getVehicleBySlug(v1Slug) : null;
    const vehicle2 = v2Slug ? await getVehicleBySlug(v2Slug) : null;

    const vehicles = [
        { data: vehicle1, slot: 1, currentSlug: v1Slug },
        { data: vehicle2, slot: 2, currentSlug: v2Slug }
    ];

    const hasVehicles = vehicle1 || vehicle2;

    // Comparison Rows Configuration
    const rows = [
        { label: "Precio", render: (v: Vehicle) => formatCurrency(v.currency, v.price) },
        { section: "Motor y Transmisión" },
        { label: "Combustible", render: (v: Vehicle) => v.fuelType },
        { label: "Transmisión", render: (v: Vehicle) => v.transmission },
        { label: "Marchas", render: (v: Vehicle) => v.gears || '-' },
        { label: "Cilindrada", render: (v: Vehicle) => v.engineCc ? `${v.engineCc} cc` : '-' },
        { label: "Potencia", render: (v: Vehicle) => v.engineHp ? `${v.engineHp} HP` : '-' },
        { label: "Torque", render: (v: Vehicle) => v.engineTorque ? `${v.engineTorque} Nm` : '-' },
        { label: "Batería", render: (v: Vehicle) => v.batteryKwh ? `${v.batteryKwh} kWh` : '-' },
        { label: "Autonomía eléctrica", render: (v: Vehicle) => v.autonomyKm ? `${v.autonomyKm} km` : '-' },
        { section: "Dimensiones y Capacidades" },
        { label: "Largo", render: (v: Vehicle) => v.length ? `${v.length} mm` : '-' },
        { label: "Ancho", render: (v: Vehicle) => v.width ? `${v.width} mm` : '-' },
        { label: "Alto", render: (v: Vehicle) => v.height ? `${v.height} mm` : '-' },
        { label: "Entre ejes", render: (v: Vehicle) => v.wheelbase ? `${v.wheelbase} mm` : '-' },
        { label: "Peso", render: (v: Vehicle) => v.weight ? `${v.weight} kg` : '-' },
        { label: "Baúl", render: (v: Vehicle) => v.trunkCapacity ? `${v.trunkCapacity} L` : '-' },
        { label: "Tanque", render: (v: Vehicle) => v.fuelTank ? `${v.fuelTank} L` : '-' },
        { section: "Seguridad y Equip." },
        { label: "Airbags", render: (v: Vehicle) => v.safetyFeatures?.find(f => f.includes('Airbag')) || '-' }, // Naive extraction
        { label: "Seguridad", render: (v: Vehicle) => v.safetyFeatures?.join(', ') || '-' },
        { label: "Equipamiento", render: (v: Vehicle) => v.equipment?.join(', ') || '-' },
    ];

    return (
        <div className="fade-in min-h-screen pb-12">
            {/* Breadcrumb */}
            <div className="bg-[var(--muted)] py-4 mb-6">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                        <Link href="/" className="hover:text-[var(--foreground)]">Inicio</Link>
                        <span>/</span>
                        <span className="text-[var(--foreground)]">Comparador</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 md:px-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Comparador de Vehículos</h1>

                <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                    <div className="min-w-[350px]"> {/* Ensure min width for very small screens */}

                        {/* Header Row (Images & Names) */}
                        <div className="grid grid-cols-[90px_1fr_1fr] md:grid-cols-[180px_1fr_1fr] divide-x divide-[var(--border)] border-b border-[var(--border)] bg-[var(--muted)]/20">
                            <div className="p-3 flex items-end font-semibold text-[var(--secondary)] text-sm md:text-base">
                                Vehículo
                            </div>
                            {vehicles.map((item, idx) => (
                                <div key={idx} className="p-3 md:p-6 text-center relative group">
                                    {item.data ? (
                                        <>
                                            {/* Remove vehicle button */}
                                            <Link
                                                href={`/compare?vehicle${item.slot === 1 ? '1' : '2'}=&vehicle${item.slot === 1 ? '2' : '1'}=${item.slot === 1 ? item.currentSlug || '' : vehicles[0].currentSlug || ''}`}
                                                className="absolute top-2 right-2 text-[var(--secondary)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Quitar"
                                            >
                                                ✕
                                            </Link>

                                            {/* Image - Hidden on mobile as requested */}
                                            <div className="hidden md:block aspect-[16/10] mb-4 bg-[var(--muted)] rounded-lg overflow-hidden mx-auto max-w-[200px]">
                                                {item.data.image ? (
                                                    <img src={item.data.image} alt={item.data.model} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">🚗</div>
                                                )}
                                            </div>

                                            <div className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider mb-1">
                                                {item.data.brand}
                                            </div>
                                            <h3 className="text-sm md:text-xl font-bold leading-tight mb-2">
                                                <Link href={`/vehiculo/${item.data.slug}`} className="hover:underline">
                                                    {item.data.model}
                                                </Link>
                                            </h3>
                                            <p className="text-xs md:text-sm text-[var(--secondary)]">
                                                {item.data.year} • {item.data.version}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="h-full min-h-[150px] flex items-center justify-center">
                                            <ComparatorSelector
                                                slot={item.slot as 1 | 2}
                                                currentSlug={item.currentSlug}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        <div className="divide-y divide-[var(--border)]">
                            {rows.map((row, idx) => {
                                if (row.section) {
                                    return (
                                        <div key={idx} className="grid grid-cols-[1fr] bg-[var(--muted)]/50 p-2 font-bold text-xs md:text-sm text-center uppercase tracking-wider text-[var(--secondary)]">
                                            {row.section}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={idx} className="grid grid-cols-[90px_1fr_1fr] md:grid-cols-[180px_1fr_1fr] divide-x divide-[var(--border)] hover:bg-[var(--muted)]/10 transition-colors">
                                        <div className="p-3 flex items-center text-xs md:text-sm font-medium text-[var(--secondary)] break-words">
                                            {row.label}
                                        </div>
                                        {vehicles.map((item, vIdx) => (
                                            <div key={vIdx} className="p-3 flex items-center justify-center text-center text-sm md:text-base">
                                                {item.data ? (
                                                    row.render ? row.render(item.data) || '-' : '-'
                                                ) : (
                                                    <span className="text-[var(--border)]">-</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
