"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CATEGORIES, Vehicle } from "@/types/vehicle";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (category) params.set("category", category);
      
      try {
        const res = await fetch(`/api/vehicles?${params}`);
        const data = await res.json();
        setResults(data.data || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
      setLoading(false);
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, category]);

  const categoryInfo = (cat: string) => 
    CATEGORIES.find(c => c.id === cat) || { icon: '🚗', name: cat };

  return (
    <div className="fade-in">
      {/* Search Header */}
      <div className="bg-[var(--muted)] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Buscar Vehículos</h1>
          
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
            {loading ? "Buscando..." : `${total} resultados`}
          </p>
        </div>

        {results.length === 0 && !loading ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block opacity-30">🔍</span>
            <p className="text-[var(--secondary)]">
              {query || category 
                ? "No se encontraron vehículos con esos criterios" 
                : "Escribe para buscar o selecciona una categoría"}
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
