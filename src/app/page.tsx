import Link from "next/link";
import { getLatestVehicles, getCountByCategory } from "@/lib/data";

export default function Home() {
  const latestVehicles = getLatestVehicles(6);
  const categoryStats = getCountByCategory();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fichas Tecnicas de Vehiculos
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Encuentra especificaciones completas de autos, SUVs, camionetas y motos disponibles en Uruguay
          </p>

          <Link href="/buscar" className="inline-block">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Buscar marca, modelo..."
                className="search-input cursor-pointer"
                readOnly
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)]">
                🔍
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryStats.map((cat) => (
            <Link key={cat.id} href={`/${cat.id}`} className="card p-6 text-center hover:border-[var(--primary)]">
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-[var(--secondary)] text-sm">{cat.count} vehiculos</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Vehicles */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Ultimos Agregados</h2>
          <Link href="/buscar" className="text-[var(--primary)] hover:underline">
            Ver todos →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestVehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/vehiculo/${vehicle.slug}`}>
              <article className="card group">
                <div className="aspect-[16/10] bg-[var(--muted)] flex items-center justify-center overflow-hidden">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl opacity-30">
                      {vehicle.category === 'motos' ? '🏍️' :
                       vehicle.category === 'camionetas' ? '🛻' :
                       vehicle.category === 'suvs' ? '🚙' : '🚗'}
                    </span>
                  )}
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
                      <div>
                        <p className="price-tag">USD {vehicle.priceUSD.toLocaleString()}</p>
                      </div>
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
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <span className="text-4xl mb-4 block">📋</span>
            <h3 className="font-bold text-lg mb-2">Fichas Completas</h3>
            <p className="text-[var(--secondary)]">
              Motor, dimensiones, seguridad, equipamiento y mas
            </p>
          </div>
          <div className="text-center p-6">
            <span className="text-4xl mb-4 block">💰</span>
            <h3 className="font-bold text-lg mb-2">Precios Actualizados</h3>
            <p className="text-[var(--secondary)]">
              Precios de referencia en pesos y dolares
            </p>
          </div>
          <div className="text-center p-6">
            <span className="text-4xl mb-4 block">⚡</span>
            <h3 className="font-bold text-lg mb-2">100% Estatico</h3>
            <p className="text-[var(--secondary)]">
              Carga ultrarapida sin base de datos
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
