import { Suspense } from "react";
import { fetchVehicles, fetchFilters } from "@/lib/api";
import { getLatestVehicles, getCountByCategory } from "@/lib/data";
import { Category } from "@/types/vehicle";
import HeroSection from "./components/HeroSection";
import CategoryGrid from "./components/CategoryGrid";
import PremiumListings from "./components/PremiumListings";
import VehicleFilters from "./components/VehicleFilters";
import InfiniteVehicleList from "./components/InfiniteVehicleList";
import JsonLd from "./components/JsonLd";
import BlogPreviewSection from "./components/BlogPreviewSection";
import { getLatestBlogPosts } from "@/lib/blog";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    brand?: string;
    category?: string;
    fuel?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
  }>;
}

const CATEGORY_NAMES: Record<string, string> = {
  autos: 'Autos',
  suvs: 'SUVs',
  pickups: 'Camionetas',
  motos: 'Motos',
  utilitarios: 'Utilitarios',
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const hasFilters = params.category || params.brand || params.fuel || params.min_price || params.max_price || params.page;
  const isShowingInventory = hasFilters && params.category !== undefined;

  // Always fetch vehicles for inventory view
  const page = parseInt(params.page || '1', 10);
  const limit = 9;

  const { vehicles, meta } = await fetchVehicles({
    page,
    limit,
    brand: params.brand || undefined,
    category: (params.category && params.category !== 'all') ? params.category as Category : undefined,
    fuelType: params.fuel || undefined,
    minPrice: params.min_price ? parseInt(params.min_price) : undefined,
    maxPrice: params.max_price ? parseInt(params.max_price) : undefined,
    sort: params.sort as any || undefined,
  });

  const filters = await fetchFilters();
  const brands = (filters.brands || []).map(b => b.name);

  // For the home page (no filters), also fetch hero data
  if (!isShowingInventory) {
    const [latestVehicles, categoryCounts, latestBlogPosts] = await Promise.all([
      getLatestVehicles(6),
      getCountByCategory(),
      getLatestBlogPosts(3),
    ]);

    const websiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'TodoMotor Uruguay',
      url: 'https://todomotor.uy',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://todomotor.uy/?category=all&brand={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    };

    const organizationJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TodoMotor Uruguay',
      url: 'https://todomotor.uy',
      logo: 'https://todomotor.uy/favicon.ico',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contacto@todomotor.uy',
        contactType: 'customer service',
      },
    };

    return (
      <div className="fade-in">
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <HeroSection />
        <BlogPreviewSection posts={latestBlogPosts} />
        <PremiumListings vehicles={latestVehicles} />
        <CategoryGrid categories={categoryCounts} totalCount={meta.total} />
      </div>
    );
  }

  // Inventory view (when category or filters are selected)
  const categoryName = params.category && params.category !== 'all'
    ? CATEGORY_NAMES[params.category] || params.category
    : null;

  return (
    <div className="fade-in">
      {/* Inventory header */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
          Cat&aacute;logo
        </span>
        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-[var(--accent)] mt-1">
          {categoryName ? `Inventario de ${categoryName}` : 'Inventario'}
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">
          {meta.total} veh&iacute;culos encontrados
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <Suspense fallback={<div className="h-12 bg-[var(--muted)] rounded-lg animate-pulse" />}>
          <VehicleFilters brands={brands} />
        </Suspense>

        {/* Vehicle grid with infinite scroll */}
        <Suspense fallback={null}>
          <InfiniteVehicleList initialVehicles={vehicles} initialMeta={meta} />
        </Suspense>
      </section>
    </div>
  );
}
