import Link from 'next/link';
import { CategoryIcon } from './ui/CategoryIcon';
import { formatNumber } from '@/lib/format';
import type { CategoryIconName } from '@/types/vehicle';

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

export default function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <section className="h-sect">
            <div className="h-sect__head">
                <div>
                    <h2>Explorá por categoría</h2>
                    <p>Filtrá el catálogo por tipo de vehículo</p>
                </div>
            </div>
            <div className="h-cats">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/vehiculos?category=${cat.id}`} className="h-cat">
                        <div className="h-cat__ic">
                            <CategoryIcon name={cat.icon as CategoryIconName} size={22} />
                        </div>
                        <div className="h-cat__l">{cat.name}</div>
                        <div className="h-cat__c">{formatNumber(cat.count)} vehículos</div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
