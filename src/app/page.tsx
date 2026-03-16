import { Suspense } from "react";
import { fetchVehicles, fetchFilters } from "@/lib/api";
import { getLatestVehicles } from "@/lib/data";
import { Category } from "@/types/vehicle";
import LatestCarousel from "./components/LatestCarousel";
import VehicleList from "./components/VehicleList";
import VehicleFilters from "./components/VehicleFilters";
import Pagination from "./components/Pagination";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    brand?: string;
    category?: string;
    fuel?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const latestVehicles = await getLatestVehicles(8, params.category as Category | undefined);

  // Parse search params
  const page = parseInt(params.page || '1', 10);
  const limit = 8;

  // Fetch vehicles with server-side filtering
  const { vehicles, meta } = await fetchVehicles({
    page,
    limit,
    brand: params.brand || undefined,
    category: params.category as Category | undefined,
    fuelType: params.fuel || undefined,
    minPrice: params.min_price ? parseInt(params.min_price) : undefined,
    maxPrice: params.max_price ? parseInt(params.max_price) : undefined,
  });

  // Fetch filter metadata (brands list)
  const filters = await fetchFilters();
  const brands = (filters.brands || []).map(b => b.name);

  return (
    <div className="fade-in">
      {/* Featured Carousel */}
      <section className="pt-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <LatestCarousel vehicles={latestVehicles} />
        </div>
      </section>

      {/* All Vehicles with Filters */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Todos los <span className="gradient-text">Vehiculos</span>
          </h2>
          <span className="text-sm text-[var(--foreground-muted)]">
            Mostrando {vehicles.length} de {meta.total} vehículos
          </span>
        </div>

        {/* Filters - Client Component */}
        <Suspense fallback={<div className="h-12 bg-[var(--muted)] rounded-lg animate-pulse" />}>
          <VehicleFilters brands={brands} />
        </Suspense>

        {/* Vehicle List - Server Rendered */}
        <VehicleList vehicles={vehicles} />

        {/* Pagination - Client Component */}
        <Suspense fallback={null}>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.lastPage}
            total={meta.total}
          />
        </Suspense>
      </section>
    </div>
  );
}
