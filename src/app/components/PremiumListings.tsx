import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Vehicle } from '@/types/vehicle'
import { VehicleCard } from './ui/VehicleCard'
import { vehicleToCardProps } from '@/lib/vehicle-card'

interface PremiumListingsProps {
    vehicles: Vehicle[]
}

export default function PremiumListings({ vehicles }: PremiumListingsProps) {
    if (vehicles.length === 0) return null

    return (
        <section className="h-sect">
            <div className="h-sect__head">
                <div>
                    <h2>Destacados</h2>
                    <p>Novedades y lanzamientos del momento</p>
                </div>
                <Link href="/vehiculos" className="h-link">
                    Ver todo el inventario <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </div>
            <div className="h-grid">
                {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} {...vehicleToCardProps(vehicle)} />
                ))}
            </div>
        </section>
    )
}
