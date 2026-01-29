import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, Category } from "@/types/vehicle";
import { getVehiclesByCategory } from "@/lib/data";

type Params = Promise<{ category: string }>

const categoryMeta: Record<string, { title: string; description: string }> = {
  autos: {
    title: "Autos en Uruguay",
    description: "Fichas tecnicas de autos sedan, hatchback y coupe disponibles en Uruguay"
  },
  suvs: {
    title: "SUVs en Uruguay",
    description: "Fichas tecnicas de SUVs y crossovers disponibles en Uruguay"
  },
  camionetas: {
    title: "Camionetas en Uruguay",
    description: "Fichas tecnicas de pickups y camionetas disponibles en Uruguay"
  },
  motos: {
    title: "Motos en Uruguay",
    description: "Fichas tecnicas de motos nakeds, deportivas y adventure en Uruguay"
  }
};

export async function generateMetadata({ params }: { params: Params }) {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) return { title: 'Categoria no encontrada' };

  return {
    title: `${meta.title} | FullMotor`,
    description: meta.description
  };
}

export function generateStaticParams() {
  return CATEGORIES.map(cat => ({ category: cat.id }));
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;

  const categoryInfo = CATEGORIES.find(c => c.id === category);
  if (!categoryInfo) {
    notFound();
  }

  const vehicles = getVehiclesByCategory(category as Category);
  const meta = categoryMeta[category];

  // Group by brand
  const byBrand = vehicles.reduce((acc, v) => {
    if (!acc[v.brand]) acc[v.brand] = [];
    acc[v.brand].push(v);
    return acc;
  }, {} as Record<string, typeof vehicles>);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="hero py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span>/</span>
            <span className="text-white">{categoryInfo.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{categoryInfo.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{meta.title}</h1>
              <p className="text-slate-300 mt-1">{vehicles.length} vehiculos disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.keys(byBrand).length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block opacity-30">{categoryInfo.icon}</span>
            <p className="text-[var(--secondary)]">No hay vehiculos en esta categoria aun</p>
          </div>
        ) : (
          Object.entries(byBrand).map(([brand, brandVehicles]) => (
            <div key={brand} className="mb-12">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {brand}
                <span className="text-sm font-normal text-[var(--secondary)]">
                  ({brandVehicles.length})
                </span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandVehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/vehiculo/${vehicle.slug}`}>
                    <article className="card group">
                      <div className="aspect-[16/10] bg-[var(--muted)] flex items-center justify-center">
                        <span className="text-6xl opacity-30">{categoryInfo.icon}</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm text-[var(--secondary)]">{vehicle.brand}</p>
                            <h3 className="font-bold text-lg group-hover:text-[var(--primary)] transition">
                              {vehicle.model}
                            </h3>
                          </div>
                          <span className="category-badge">{vehicle.year}</span>
                        </div>

                        {vehicle.version && (
                          <p className="text-sm text-[var(--secondary)] mb-3">{vehicle.version}</p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                          {vehicle.priceUSD ? (
                            <p className="price-tag">USD {vehicle.priceUSD.toLocaleString()}</p>
                          ) : (
                            <p className="text-[var(--secondary)]">Consultar precio</p>
                          )}

                          <div className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                            {vehicle.engineHp && <span>{vehicle.engineHp} HP</span>}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
