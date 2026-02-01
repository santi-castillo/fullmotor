import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getAllVehicles } from "@/lib/data";

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehiculo no encontrado' };

  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.year} | FullMotor`,
    description: vehicle.description || `Ficha tecnica del ${vehicle.brand} ${vehicle.model} ${vehicle.year}. Especificaciones, precios y equipamiento.`
  };
}

export async function generateStaticParams() {
  const vehicles = await getAllVehicles();
  return vehicles.map(v => ({ slug: v.slug }));
}

export default async function VehiclePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const categoryNames: Record<string, string> = {
    autos: 'Autos',
    suvs: 'SUVs',
    camionetas: 'Camionetas',
    motos: 'Motos'
  };

  const fuelNames: Record<string, string> = {
    nafta: 'Nafta',
    diesel: 'Diesel',
    electrico: 'Electrico',
    hibrido: 'Hibrido'
  };

  const transmissionNames: Record<string, string> = {
    manual: 'Manual',
    automatica: 'Automatica',
    cvt: 'CVT'
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="bg-[var(--muted)] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--secondary)]">
            <Link href="/" className="hover:text-[var(--foreground)]">Inicio</Link>
            <span>/</span>
            <Link href={`/${vehicle.category}`} className="hover:text-[var(--foreground)]">
              {categoryNames[vehicle.category]}
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{vehicle.brand} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <div className="aspect-[16/10] bg-[var(--muted)] rounded-xl flex items-center justify-center overflow-hidden">
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[120px] opacity-30">
                  {vehicle.category === 'motos' ? '🏍️' :
                    vehicle.category === 'camionetas' ? '🛻' :
                      vehicle.category === 'suvs' ? '🚙' : '🚗'}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-6">
              <span className="category-badge mb-3 inline-block">
                {categoryNames[vehicle.category]}
              </span>
              <p className="text-[var(--secondary)] text-lg">{vehicle.brand}</p>
              <h1 className="text-4xl font-bold mb-2">
                {vehicle.model} {vehicle.year}
              </h1>
              {vehicle.version && (
                <p className="text-xl text-[var(--secondary)]">{vehicle.version}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-[var(--muted)] rounded-xl p-6 mb-6">
              {vehicle.priceUSD && (
                <div className="mb-2">
                  <p className="price-tag text-3xl">USD {vehicle.priceUSD.toLocaleString()}</p>
                </div>
              )}
              {vehicle.priceUYU && (
                <p className="text-[var(--secondary)]">
                  ${vehicle.priceUYU.toLocaleString()} UYU
                </p>
              )}
              <p className="text-xs text-[var(--secondary)] mt-2">
                * Precio de referencia. Consultar con concesionario.
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {vehicle.engineHp && (
                <div className="spec-item">
                  <p className="spec-label">Potencia</p>
                  <p className="spec-value">{vehicle.engineHp} HP</p>
                </div>
              )}
              {vehicle.engineCc && (
                <div className="spec-item">
                  <p className="spec-label">Cilindrada</p>
                  <p className="spec-value">{vehicle.engineCc} cc</p>
                </div>
              )}
              {vehicle.transmission && (
                <div className="spec-item">
                  <p className="spec-label">Transmision</p>
                  <p className="spec-value">{transmissionNames[vehicle.transmission] || vehicle.transmission}</p>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="spec-item">
                  <p className="spec-label">Combustible</p>
                  <p className="spec-value">{fuelNames[vehicle.fuelType] || vehicle.fuelType}</p>
                </div>
              )}
            </div>

            {vehicle.description && (
              <p className="text-[var(--secondary)] leading-relaxed">
                {vehicle.description}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Specs */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Especificaciones Tecnicas</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Motor */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚡</span> Motor
              </h3>
              <dl className="space-y-3">
                {vehicle.engineCc && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Cilindrada</dt>
                    <dd className="font-medium">{vehicle.engineCc} cc</dd>
                  </div>
                )}
                {vehicle.engineHp && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Potencia</dt>
                    <dd className="font-medium">{vehicle.engineHp} HP</dd>
                  </div>
                )}
                {vehicle.engineTorque && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Torque</dt>
                    <dd className="font-medium">{vehicle.engineTorque} Nm</dd>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Combustible</dt>
                    <dd className="font-medium">{fuelNames[vehicle.fuelType] || vehicle.fuelType}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Transmission */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚙️</span> Transmision
              </h3>
              <dl className="space-y-3">
                {vehicle.transmission && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Tipo</dt>
                    <dd className="font-medium">{transmissionNames[vehicle.transmission] || vehicle.transmission}</dd>
                  </div>
                )}
                {vehicle.gears !== null && vehicle.gears !== undefined && vehicle.gears > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Marchas</dt>
                    <dd className="font-medium">{vehicle.gears}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Dimensions */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📐</span> Dimensiones
              </h3>
              <dl className="space-y-3">
                {vehicle.length && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Largo</dt>
                    <dd className="font-medium">{vehicle.length} mm</dd>
                  </div>
                )}
                {vehicle.width && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Ancho</dt>
                    <dd className="font-medium">{vehicle.width} mm</dd>
                  </div>
                )}
                {vehicle.height && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Alto</dt>
                    <dd className="font-medium">{vehicle.height} mm</dd>
                  </div>
                )}
                {vehicle.wheelbase && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Distancia entre ejes</dt>
                    <dd className="font-medium">{vehicle.wheelbase} mm</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Capacities */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📦</span> Capacidades
              </h3>
              <dl className="space-y-3">
                {vehicle.trunkCapacity !== null && vehicle.trunkCapacity !== undefined && vehicle.trunkCapacity > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Baul</dt>
                    <dd className="font-medium">{vehicle.trunkCapacity} L</dd>
                  </div>
                )}
                {vehicle.fuelTank && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Tanque</dt>
                    <dd className="font-medium">{vehicle.fuelTank} L</dd>
                  </div>
                )}
                {vehicle.weight && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Peso</dt>
                    <dd className="font-medium">{vehicle.weight} kg</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Safety */}
            {vehicle.safetyFeatures.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span>🛡️</span> Seguridad
                </h3>
                <ul className="space-y-2">
                  {vehicle.safetyFeatures.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Equipment */}
            {vehicle.equipment.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span>✨</span> Equipamiento
                </h3>
                <ul className="space-y-2">
                  {vehicle.equipment.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-blue-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
