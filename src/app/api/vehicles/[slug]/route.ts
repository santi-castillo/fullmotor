import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ slug: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params
  
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug }
  })
  
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  }
  
  // Parse JSON fields
  const parsed = {
    ...vehicle,
    safetyFeatures: vehicle.safetyFeatures ? JSON.parse(vehicle.safetyFeatures) : [],
    equipment: vehicle.equipment ? JSON.parse(vehicle.equipment) : [],
    images: vehicle.images ? JSON.parse(vehicle.images) : []
  }
  
  return NextResponse.json(parsed)
}
