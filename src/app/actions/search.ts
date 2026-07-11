'use server';

import { fetchVehicles } from "@/lib/api";
import { CATEGORIES } from "@/types/vehicle";
import type { Vehicle } from "@/types/vehicle";

const MAX_RESULTS = 12;

/**
 * Header typeahead search.
 *
 * We deliberately search over /api/vehicles (the same endpoint that powers the
 * listings, categories and destacados on the live site) instead of the
 * dedicated /api/search?type=semantic endpoint, which has been chronically
 * unreliable in production. Fetches use revalidate caching, so repeated
 * keystroke calls are cheap after the first.
 */
export async function searchVehiclesAction(query: string): Promise<Vehicle[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const tokens = q.split(/\s+/).filter(Boolean);

    try {
        // X-Vehicle-Type: 'all' omits motorcycles/utilitarios, so query each
        // category explicitly and merge the results.
        const settled = await Promise.allSettled(
            CATEGORIES.map((cat) => fetchVehicles({ category: cat.id, limit: 100 }))
        );

        const seen = new Set<string>();
        const matches: Vehicle[] = [];

        for (const result of settled) {
            if (result.status !== 'fulfilled') continue;
            for (const vehicle of result.value.vehicles) {
                if (seen.has(vehicle.id)) continue;
                const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.version ?? ''}`.toLowerCase();
                if (tokens.every((token) => haystack.includes(token))) {
                    seen.add(vehicle.id);
                    matches.push(vehicle);
                    if (matches.length >= MAX_RESULTS) return matches;
                }
            }
        }

        return matches;
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
