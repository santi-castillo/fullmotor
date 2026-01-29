"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { CATEGORIES, Category } from "@/types/vehicle";
import vehiclesData from "../../../data/vehicles.json";

interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  version?: string;
  category: string;
  priceUSD?: number;
  engineHp?: number;
  description?: string;
}

const vehicles = vehiclesData as Vehicle[];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const results = useMemo(() => {
    let filtered = vehicles;

    if (category) {
      filtered = filtered.filter(v => v.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(v =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.description?.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [query, category]);

  const categoryInfo = (cat: string) =>
    CATEGORIES.find(c => c.id === cat) || { icon: '🚗', name: cat };

  return (
    <div className="fade-in">
      {/* Search Header */}
      <div className="bg-[var(--muted)] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Buscar Vehiculos</h1>

          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar marca, modelo..."
              className="search-input"
              autoFocus
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)]">
              🔍
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCategory("")}
              className={`btn ${category === "" ? "btn-primary" : "btn-secondary"}`}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`btn ${category === cat.id ? "btn-primary" : "btn-secondary"}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[var(--secondary)]">
            {results.length} resultados
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block opacity-30">🔍</span>
            <p className="text-[var(--secondary)]">
              {query || category
                ? "No se encontraron vehiculos con esos criterios"
                : "Escribe para buscar o selecciona una categoria"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((vehicle) => (
              <Link key={vehicle.id} href={`/vehiculo/${vehicle.slug}`}>
                <article className="card group">
                  <div className="aspect-[16/10] bg-[var(--muted)] flex items-center justify-center">
                    <span className="text-6xl opacity-30">
                      {categoryInfo(vehicle.category).icon}
                    </span>
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
        )}
      </div>
    </div>
  );
}
