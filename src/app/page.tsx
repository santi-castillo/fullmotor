import { getAllVehicles, getLatestVehicles } from "@/lib/data";
import VehicleTable from "./components/VehicleTable";
import LatestCarousel from "./components/LatestCarousel";

export default function Home() {
  const allVehicles = getAllVehicles();
  const latestVehicles = getLatestVehicles(8);

  return (
    <div className="fade-in">
      {/* Featured Carousel - Future: ads/blog entries */}
      <section className="pt-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <LatestCarousel vehicles={latestVehicles} />
        </div>
      </section>

      {/* All Vehicles with Filters */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Todos los <span className="gradient-text">Vehiculos</span>
          </h2>
        </div>

        <VehicleTable vehicles={allVehicles} />
      </section>
    </div>
  );
}

