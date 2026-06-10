import { Vehicle } from "@/types/vehicle";
import { VehicleCard } from "./ui/VehicleCard";
import { vehicleToCardProps } from "@/lib/vehicle-card";

interface VehicleListProps {
    vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: VehicleListProps) {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="iv__empty">
                No hay vehículos con esos filtros. Probá ampliar la búsqueda.
            </div>
        );
    }

    return (
        <div className="iv__grid">
            {vehicles.map((vehicle) => (
                <VehicleCard
                    key={vehicle.id}
                    {...vehicleToCardProps(vehicle)}
                    sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
            ))}
        </div>
    );
}
