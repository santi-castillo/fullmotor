import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchVehicles, fetchFilters } from "@/lib/api";
import { getLatestVehicles, getCountByCategory } from "@/lib/data";
import { Category } from "@/types/vehicle";
import { formatNumber } from "@/lib/format";
import HeroSection from "./components/HeroSection";
import CategoryGrid from "./components/CategoryGrid";
import PremiumListings from "./components/PremiumListings";
import VehicleFilters from "./components/VehicleFilters";
import InventoryToolbar from "./components/InventoryToolbar";
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
    sort: (params.sort as NonNullable<Parameters<typeof fetchVehicles>[0]>['sort']) || undefined,
  });

  const filters = await fetchFilters();
  const brands = (filters.brands || []).map(b => b.name);

  // For the home page (no filters), also fetch hero data
  if (!isShowingInventory) {
    const [latestVehicles, categoryCounts, latestBlogPosts] = await Promise.all([
      getLatestVehicles(8),
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
      logo: 'https://todomotor.uy/brand/todomotor-mark.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contacto@todomotor.uy',
        contactType: 'customer service',
      },
    };

    return (
      <div style={{ paddingBottom: 24 }}>
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <HeroSection total={meta.total} brandsCount={brands.length} />
        <CategoryGrid categories={categoryCounts} totalCount={meta.total} />
        <PremiumListings vehicles={latestVehicles} />
        <BlogPreviewSection posts={latestBlogPosts} />
      </div>
    );
  }

  // Inventory view (when category or filters are selected)
  const categoryName = params.category && params.category !== 'all'
    ? CATEGORY_NAMES[params.category] || params.category
    : null;

  const categoryCounts = await getCountByCategory();

  return (
    <div className="iv" style={{ paddingBottom: 24 }}>
      <div className="iv__crumb">
        <Link href="/">Inicio</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span>Vehículos</span>
        <ChevronRight size={13} aria-hidden="true" />
        <span style={{ color: 'var(--text-strong)' }}>{categoryName || 'Todos'}</span>
      </div>
      <h1 className="iv__title">{categoryName || 'Todos los vehículos'}</h1>
      <p className="iv__count">{formatNumber(meta.total)} vehículos encontrados</p>

      <div className="iv__body">
        <Suspense fallback={<div />}>
          <VehicleFilters brands={brands} categories={categoryCounts} />
        </Suspense>

        <div>
          <Suspense fallback={<div className="iv__toolbar" />}>
            <InventoryToolbar />
          </Suspense>
          <Suspense fallback={null}>
            <InfiniteVehicleList initialVehicles={vehicles} initialMeta={meta} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
