import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchVehicles, fetchFilters } from "@/lib/api";
import { getLatestVehicles, getCountByCategory } from "@/lib/data";
import { Category, CATEGORIES } from "@/types/vehicle";
import { absoluteUrl, SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/site";
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

const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c.name])
);

/**
 * `/` doubles as the inventory listing. Without per-category metadata every
 * `/?category=x` URL in the sitemap inherits the root layout's canonical of
 * `/`, so Google collapses all five into the home page and drops them.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { category } = params;

  // No category selected — the root layout's metadata is already correct.
  if (!category) return {};

  if (category !== 'all' && !CATEGORY_NAMES[category]) {
    return { robots: { index: false, follow: true }, alternates: { canonical: '/' } };
  }

  const categoryName = category === 'all' ? null : CATEGORY_NAMES[category];
  const title = categoryName
    ? `${categoryName} en Uruguay — Fichas técnicas y precios`
    : 'Todos los vehículos en Uruguay — Fichas técnicas y precios';
  const description = categoryName
    ? `Fichas técnicas de ${categoryName.toLowerCase()} disponibles en Uruguay: especificaciones, precios y equipamiento actualizados.`
    : 'Fichas técnicas de autos, SUVs, camionetas, motos y utilitarios disponibles en Uruguay: especificaciones, precios y equipamiento.';

  const canonical = `/?category=${category}`;

  // Brand/fuel/price/page combinations explode into near-duplicate pages.
  // Point them at the clean category URL and keep them out of the index.
  const isFacetedView = Boolean(
    params.brand || params.fuel || params.min_price || params.max_price || (params.page && params.page !== '1')
  );

  return {
    title,
    description,
    ...(isFacetedView && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl(canonical),
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical },
  };
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: SITE_LOGO },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contacto@todomotor.uy',
    contactType: 'customer service',
  },
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
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'es-UY',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl('/?category=all&brand={search_term_string}') },
        'query-input': 'required name=search_term_string',
      },
    };

    return (
      <div style={{ paddingBottom: 24 }}>
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <HeroSection total={meta.total} brandsCount={brands.length} />
        {/* Editorial first: the news is the reason to come back, and it is the
            only section that changes between visits. The category grid is
            navigation the header already offers, so it closes the page. */}
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

  const categoryCounts = await getCountByCategory();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName || 'Todos los vehículos',
        item: absoluteUrl(`/?category=${params.category}`),
      },
    ],
  };

  return (
    <div className="iv" style={{ paddingBottom: 24 }}>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

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
