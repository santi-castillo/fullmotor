import Link from 'next/link';

interface CategoryCount {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface CategoryGridProps {
    categories: CategoryCount[];
    totalCount: number;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
    all: 'from-cyan-900/60 to-[#0b1326]/90',
    autos: 'from-blue-900/60 to-[#0b1326]/90',
    suvs: 'from-emerald-900/60 to-[#0b1326]/90',
    pickups: 'from-amber-900/60 to-[#0b1326]/90',
    motos: 'from-red-900/60 to-[#0b1326]/90',
    utilitarios: 'from-purple-900/60 to-[#0b1326]/90',
};

const CATEGORY_ICONS: Record<string, string> = {
    all: 'apps',
    autos: 'directions_car',
    suvs: 'airport_shuttle',
    pickups: 'local_shipping',
    motos: 'two_wheeler',
    utilitarios: 'fire_truck',
};

export default function CategoryGrid({ categories, totalCount }: CategoryGridProps) {
    const allCategories = [
        { id: 'all', name: 'Todos los Tipos', icon: 'apps', count: totalCount },
        ...categories,
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/* Section header */}
            <div className="mb-8">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
                    Inventario
                </span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[var(--accent)] mt-1">
                    Categor&iacute;as
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCategories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.id === 'all' ? '/?category=all' : `/?category=${cat.id}`}
                        className="group relative h-48 md:h-56 rounded-xl overflow-hidden border border-[var(--glass-border)] hover:border-[var(--primary)] transition-all duration-300"
                    >
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[cat.id] || CATEGORY_GRADIENTS.all}`} />

                        {/* Icon background */}
                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[80px] text-[var(--primary)]">
                                {CATEGORY_ICONS[cat.id] || 'directions_car'}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-[var(--primary)] text-xl">
                                    {CATEGORY_ICONS[cat.id] || 'directions_car'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--accent)] group-hover:text-[var(--primary-light)] transition-colors">
                                {cat.name}
                            </h3>
                            <p className="text-sm text-[var(--foreground-muted)] mt-1">
                                {cat.count} veh&iacute;culos
                            </p>
                        </div>

                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
