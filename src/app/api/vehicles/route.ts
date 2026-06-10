import { NextRequest, NextResponse } from 'next/server'
import { fetchVehicles } from '@/lib/api'
import { Category } from '@/types/vehicle'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '9', 10)
  const brand = searchParams.get('brand') || undefined
  const category = searchParams.get('category') || undefined
  const fuelType = searchParams.get('fuel_type') || undefined
  const minPrice = searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!) : undefined
  const maxPrice = searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!) : undefined
  const sort = (searchParams.get('sort') as NonNullable<Parameters<typeof fetchVehicles>[0]>['sort']) || undefined

  const result = await fetchVehicles({
    page,
    limit,
    brand,
    category: (category && category !== 'all') ? category as Category : undefined,
    fuelType,
    minPrice,
    maxPrice,
    sort,
  })

  return NextResponse.json(result)
}
