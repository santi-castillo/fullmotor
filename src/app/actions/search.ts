'use server';

import { searchVehicles } from "@/lib/api";

export async function searchVehiclesAction(query: string) {
    if (!query) return [];
    try {
        return await searchVehicles(query);
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
