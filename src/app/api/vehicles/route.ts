import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const API_KEY = process.env.API_KEY || 'fm_dev_key_2026'

function checkAuth(request: NextRequest): boolean {
  const key = request.headers.get('X-API-Key')
  return key === API_KEY
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  const where: Record<string, unknown> = {}
  
  if (category) {
    where.category = category
  }
  
  if (brand) {
    where.brand = { contains: brand }
  }
  
  if (search) {
    where.OR = [
      { brand: { contains: search } },
      { model: { contains: search } },
      { description: { contains: search } }
    ]
  }
  
  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.vehicle.count({ where })
  ])
  
  // Parse JSON fields
  const parsed = vehicles.map(v => ({
    ...v,
    safetyFeatures: v.safetyFeatures ? JSON.parse(v.safetyFeatures) : [],
    equipment: v.equipment ? JSON.parse(v.equipment) : [],
    images: v.images ? JSON.parse(v.images) : []
  }))
  
  return NextResponse.json({ 
    data: parsed, 
    total,
    limit,
    offset 
  })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = `${body.brand}-${body.model}-${body.year}`.toLowerCase().replace(/\s+/g, '-')
    }
    
    // Stringify JSON fields
    if (body.safetyFeatures && Array.isArray(body.safetyFeatures)) {
      body.safetyFeatures = JSON.stringify(body.safetyFeatures)
    }
    if (body.equipment && Array.isArray(body.equipment)) {
      body.equipment = JSON.stringify(body.equipment)
    }
    if (body.images && Array.isArray(body.images)) {
      body.images = JSON.stringify(body.images)
    }
    
    const vehicle = await prisma.vehicle.create({
      data: body
    })
    
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}
