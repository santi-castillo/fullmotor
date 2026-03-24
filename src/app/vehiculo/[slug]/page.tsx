import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getAllVehicles } from "@/lib/data";
import ImageCarousel from "@/app/components/ImageCarousel";
import JsonLd from "@/app/components/JsonLd";
import CommentsSection from "@/app/components/CommentsSection";

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: 'Vehiculo no encontrado' };

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
  const priceText = vehicle.price ? ` - ${vehicle.currency} ${vehicle.price.toLocaleString('es-UY')}` : '';
  const description = vehicle.description || `Ficha t\u00e9cnica del ${vehicle.brand} ${vehicle.model} ${vehicle.year}${priceText}. Especificaciones, precios y equipamiento en Uruguay.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title}${priceText}`,
      description,
      type: 'website',
      url: `https://todomotor.uy/vehiculo/${slug}`,
      images: vehicle.images?.length > 0
        ? vehicle.images.map((img) => ({ url: img }))
        : vehicle.image ? [{ url: vehicle.image }] : [],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title}${priceText}`,
      description,
      images: vehicle.image ? [vehicle.image] : [],
    },
    alternates: {
      canonical: `https://todomotor.uy/vehiculo/${slug}`,
    },
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
    pickups: 'Camionetas',
    motos: 'Motos',
    utilitarios: 'Utilitarios'
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

  const allImages = vehicle.images?.length > 0 
    ? [vehicle.image, ...vehicle.images].filter((v, i, a) => v && a.indexOf(v) === i) as string[]
    : vehicle.image ? [vehicle.image] : [];

  const categorySchemaType = ['autos', 'suvs', 'pickups'].includes(vehicle.category)
    ? 'Car'
    : vehicle.category === 'motos'
      ? 'Motorcycle'
      : 'Vehicle';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': categorySchemaType,
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    modelDate: String(vehicle.year),
    vehicleModelDate: String(vehicle.year),
    image: allImages,
    description: vehicle.description || `Ficha t\u00e9cnica del ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    url: `https://todomotor.uy/vehiculo/${vehicle.slug}`,
    ...(vehicle.fuelType && { fuelType: vehicle.fuelType }),
    ...(vehicle.transmission && { vehicleTransmission: vehicle.transmission }),
    ...(vehicle.engineCc && { vehicleEngine: { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: vehicle.engineCc, unitCode: 'CMQ' } } }),
    offers: vehicle.price ? {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: vehicle.currency === 'US$' ? 'USD' : 'UYU',
      availability: 'https://schema.org/InStock',
      url: `https://todomotor.uy/vehiculo/${vehicle.slug}`,
    } : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://todomotor.uy' },
      { '@type': 'ListItem', position: 2, name: categoryNames[vehicle.category], item: `https://todomotor.uy/?category=${vehicle.category}` },
      { '@type': 'ListItem', position: 3, name: `${vehicle.brand} ${vehicle.model}` },
    ],
  };

  return (
    <div className="fade-in">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Breadcrumb */}
      <div className="bg-[var(--muted)] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--secondary)]">
            <Link href="/" className="hover:text-[var(--foreground)]">Inicio</Link>
            <span>/</span>
            <Link href={`/?category=${vehicle.category}`} className="hover:text-[var(--foreground)]">
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
            <ImageCarousel 
              images={allImages} 
              altPrefix={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`} 
              category={vehicle.category} 
            />

            {/* Description (Moved here) */}
            {vehicle.description && (
              <div className="mt-8">
                <p className="text-[var(--secondary)] leading-relaxed text-lg">
                  {vehicle.description}
                </p>
              </div>
            )}
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

              <div className="mt-4">
                <Link href={`/compare?vehicle1=${vehicle.slug}`} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium glass-panel hover:border-[var(--primary)] transition-colors text-[var(--primary)]">
                  <span className="material-symbols-outlined text-base">compare_arrows</span>
                  Comparar
                </Link>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[var(--muted)] rounded-xl p-6 mb-6">
              {vehicle.price && (
                <div className="mb-2">
                  <p className="price-tag text-3xl">{vehicle.currency} {vehicle.price.toLocaleString()}</p>
                </div>
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
              {vehicle.batteryKwh != null && vehicle.batteryKwh > 0 && (
                <div className="spec-item">
                  <p className="spec-label">Batería</p>
                  <p className="spec-value">{vehicle.batteryKwh} kWh</p>
                </div>
              )}
              {vehicle.autonomyKm != null && vehicle.autonomyKm > 0 && (
                <div className="spec-item">
                  <p className="spec-label">Autonomía eléctrica</p>
                  <p className="spec-value">{vehicle.autonomyKm} km</p>
                </div>
              )}
            </div>

            {/* Related Versions (Moved here) */}
            {vehicle.relatedVersions && vehicle.relatedVersions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Otras versiones disponibles</h3>
                <div className="flex flex-col gap-2">
                  {vehicle.relatedVersions.map((v) => (
                    <Link key={v.slug} href={`/vehiculo/${v.slug}`} className="flex justify-between items-center p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)] transition-all">
                      <span className="font-medium">{v.version || vehicle.model}</span>
                      <span className="text-[var(--secondary)] font-semibold">{v.currency} {v.price?.toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Report */}
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <p className="text-xs text-[var(--foreground-muted)]">
                ¿Encontraste un error? Escribinos a <span className="text-[var(--secondary)]">contacto@todomotor.uy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Especificaciones Tecnicas</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Motor */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">bolt</span> Motor
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
                {vehicle.batteryKwh != null && vehicle.batteryKwh > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Capacidad Batería</dt>
                    <dd className="font-medium">{vehicle.batteryKwh} kWh</dd>
                  </div>
                )}
                {vehicle.autonomyKm != null && vehicle.autonomyKm > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--secondary)]">Autonomía eléctrica</dt>
                    <dd className="font-medium">{vehicle.autonomyKm} km</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Transmission */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">settings</span> Transmision
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
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">straighten</span> Dimensiones
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
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">inventory_2</span> Capacidades
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
            {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--primary)] text-xl">shield</span> Seguridad
                </h3>
                <ul className="space-y-2">
                  {vehicle.safetyFeatures.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-[var(--primary)]">check</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Equipment */}
            {vehicle.equipment && vehicle.equipment.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--primary)] text-xl">star</span> Equipamiento
                </h3>
                <ul className="space-y-2">
                  {vehicle.equipment.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-sm text-[var(--primary)]">check</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Comments */}
        <CommentsSection resourceId={slug} />
      </div>
    </div>
  );
}
