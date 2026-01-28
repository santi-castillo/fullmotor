import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear API Key
  await prisma.apiKey.upsert({
    where: { key: 'fm_dev_key_2026' },
    update: {},
    create: {
      key: 'fm_dev_key_2026',
      name: 'Development Key'
    }
  })

  // AUTOS
  await prisma.vehicle.upsert({
    where: { slug: 'toyota-corolla-2026-xli' },
    update: {},
    create: {
      slug: 'toyota-corolla-2026-xli',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2026,
      version: 'XLi 2.0',
      category: 'autos',
      subcategory: 'sedan',
      priceUSD: 32900,
      priceUYU: 1380000,
      engineCc: 1987,
      engineHp: 170,
      engineTorque: 203,
      fuelType: 'nafta',
      transmission: 'cvt',
      gears: 10,
      length: 4630,
      width: 1780,
      height: 1435,
      wheelbase: 2700,
      trunkCapacity: 470,
      fuelTank: 50,
      weight: 1340,
      safetyFeatures: JSON.stringify(['7 Airbags', 'ABS', 'Control de estabilidad', 'Cámara trasera', 'Sensores de estacionamiento']),
      equipment: JSON.stringify(['Pantalla táctil 9"', 'Apple CarPlay', 'Android Auto', 'Climatizador automático', 'Llantas 17"']),
      images: JSON.stringify([]),
      description: 'El Toyota Corolla 2026 combina eficiencia, confort y la reconocida confiabilidad Toyota.'
    }
  })

  await prisma.vehicle.upsert({
    where: { slug: 'chevrolet-cruze-2026-lt' },
    update: {},
    create: {
      slug: 'chevrolet-cruze-2026-lt',
      brand: 'Chevrolet',
      model: 'Cruze',
      year: 2026,
      version: 'LT 1.4T',
      category: 'autos',
      subcategory: 'sedan',
      priceUSD: 34500,
      priceUYU: 1450000,
      engineCc: 1399,
      engineHp: 153,
      engineTorque: 240,
      fuelType: 'nafta',
      transmission: 'automatica',
      gears: 6,
      length: 4666,
      width: 1786,
      height: 1457,
      wheelbase: 2700,
      trunkCapacity: 445,
      fuelTank: 52,
      weight: 1395,
      safetyFeatures: JSON.stringify(['6 Airbags', 'ABS', 'ESP', 'Alerta de colisión frontal', 'Alerta de cambio de carril']),
      equipment: JSON.stringify(['MyLink 8"', 'Cargador inalámbrico', 'Asientos de cuero', 'Techo solar']),
      images: JSON.stringify([]),
      description: 'El Chevrolet Cruze 2026 ofrece tecnología de punta y un motor turbo eficiente.'
    }
  })

  // SUVS
  await prisma.vehicle.upsert({
    where: { slug: 'volkswagen-taos-2026-comfortline' },
    update: {},
    create: {
      slug: 'volkswagen-taos-2026-comfortline',
      brand: 'Volkswagen',
      model: 'Taos',
      year: 2026,
      version: 'Comfortline 250 TSI',
      category: 'suvs',
      subcategory: 'crossover',
      priceUSD: 38900,
      priceUYU: 1635000,
      engineCc: 1395,
      engineHp: 150,
      engineTorque: 250,
      fuelType: 'nafta',
      transmission: 'automatica',
      gears: 6,
      length: 4461,
      width: 1841,
      height: 1636,
      wheelbase: 2680,
      trunkCapacity: 498,
      fuelTank: 50,
      weight: 1380,
      safetyFeatures: JSON.stringify(['6 Airbags', 'ABS', 'ESC', 'Control de tracción', 'Frenos de emergencia autónomo']),
      equipment: JSON.stringify(['VW Play 10"', 'Digital Cockpit', 'Climatizador bi-zona', 'Llantas 18"', 'LED Matrix']),
      images: JSON.stringify([]),
      description: 'La Volkswagen Taos redefine el segmento SUV compacto con tecnología alemana.'
    }
  })

  await prisma.vehicle.upsert({
    where: { slug: 'jeep-compass-2026-longitude' },
    update: {},
    create: {
      slug: 'jeep-compass-2026-longitude',
      brand: 'Jeep',
      model: 'Compass',
      year: 2026,
      version: 'Longitude 2.0 TD',
      category: 'suvs',
      subcategory: 'suv',
      priceUSD: 45900,
      priceUYU: 1930000,
      engineCc: 1956,
      engineHp: 170,
      engineTorque: 350,
      fuelType: 'diesel',
      transmission: 'automatica',
      gears: 9,
      length: 4405,
      width: 1818,
      height: 1640,
      wheelbase: 2636,
      trunkCapacity: 438,
      fuelTank: 60,
      weight: 1650,
      safetyFeatures: JSON.stringify(['6 Airbags', 'ABS', 'ESP', 'Hill Holder', 'Cámara 360°']),
      equipment: JSON.stringify(['Uconnect 10.1"', 'Tracción 4x4', 'Modo Off-Road', 'Asientos calefaccionados']),
      images: JSON.stringify([]),
      description: 'El Jeep Compass 2026 con motor diesel y tracción 4x4 para cualquier aventura.'
    }
  })

  // CAMIONETAS
  await prisma.vehicle.upsert({
    where: { slug: 'toyota-hilux-2026-srv' },
    update: {},
    create: {
      slug: 'toyota-hilux-2026-srv',
      brand: 'Toyota',
      model: 'Hilux',
      year: 2026,
      version: 'SRV 2.8 TDI 4x4',
      category: 'camionetas',
      subcategory: 'pickup',
      priceUSD: 52900,
      priceUYU: 2225000,
      engineCc: 2755,
      engineHp: 204,
      engineTorque: 500,
      fuelType: 'diesel',
      transmission: 'automatica',
      gears: 6,
      length: 5325,
      width: 1855,
      height: 1815,
      wheelbase: 3085,
      trunkCapacity: null,
      fuelTank: 80,
      weight: 2100,
      safetyFeatures: JSON.stringify(['7 Airbags', 'ABS', 'VSC', 'Control de descenso', 'Bloqueo de diferencial trasero']),
      equipment: JSON.stringify(['Pantalla 8"', 'Toyota Safety Sense', 'Cámara trasera', 'Sensores delanteros y traseros']),
      images: JSON.stringify([]),
      description: 'La Toyota Hilux 2026, líder indiscutida del segmento pickup en Uruguay.'
    }
  })

  await prisma.vehicle.upsert({
    where: { slug: 'ford-ranger-2026-xlt' },
    update: {},
    create: {
      slug: 'ford-ranger-2026-xlt',
      brand: 'Ford',
      model: 'Ranger',
      year: 2026,
      version: 'XLT 3.0 V6 TDI',
      category: 'camionetas',
      subcategory: 'pickup',
      priceUSD: 55900,
      priceUYU: 2350000,
      engineCc: 2993,
      engineHp: 250,
      engineTorque: 600,
      fuelType: 'diesel',
      transmission: 'automatica',
      gears: 10,
      length: 5370,
      width: 1918,
      height: 1884,
      wheelbase: 3270,
      trunkCapacity: null,
      fuelTank: 80,
      weight: 2200,
      safetyFeatures: JSON.stringify(['8 Airbags', 'ABS', 'ESP', 'Pre-colisión con frenado', 'Monitoreo de ángulo muerto']),
      equipment: JSON.stringify(['SYNC 4 12"', 'Cámara 360°', 'Asientos de cuero', 'Suspensión adaptativa']),
      images: JSON.stringify([]),
      description: 'La nueva Ford Ranger 2026 con motor V6 diesel de 250 CV.'
    }
  })

  // MOTOS
  await prisma.vehicle.upsert({
    where: { slug: 'yamaha-mt-07-2026' },
    update: {},
    create: {
      slug: 'yamaha-mt-07-2026',
      brand: 'Yamaha',
      model: 'MT-07',
      year: 2026,
      version: 'ABS',
      category: 'motos',
      subcategory: 'naked',
      priceUSD: 9900,
      priceUYU: 416000,
      engineCc: 689,
      engineHp: 73,
      engineTorque: 68,
      fuelType: 'nafta',
      transmission: 'manual',
      gears: 6,
      length: 2085,
      width: 745,
      height: 1090,
      wheelbase: 1400,
      trunkCapacity: null,
      fuelTank: 14,
      weight: 184,
      safetyFeatures: JSON.stringify(['ABS', 'Control de tracción']),
      equipment: JSON.stringify(['Display LCD', 'LED Full', 'Asistente de arranque en pendiente']),
      images: JSON.stringify([]),
      description: 'La Yamaha MT-07 2026, la naked más versátil del mercado.'
    }
  })

  await prisma.vehicle.upsert({
    where: { slug: 'honda-cb-500x-2026' },
    update: {},
    create: {
      slug: 'honda-cb-500x-2026',
      brand: 'Honda',
      model: 'CB 500X',
      year: 2026,
      version: 'ABS',
      category: 'motos',
      subcategory: 'adventure',
      priceUSD: 8900,
      priceUYU: 374000,
      engineCc: 471,
      engineHp: 47,
      engineTorque: 43,
      fuelType: 'nafta',
      transmission: 'manual',
      gears: 6,
      length: 2180,
      width: 830,
      height: 1355,
      wheelbase: 1410,
      trunkCapacity: null,
      fuelTank: 17,
      weight: 199,
      safetyFeatures: JSON.stringify(['ABS', 'Control de par deslizante']),
      equipment: JSON.stringify(['Panel digital LCD', 'Iluminación full LED', 'Parabrisas ajustable']),
      images: JSON.stringify([]),
      description: 'La Honda CB 500X 2026, ideal para ciudad y rutas.'
    }
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
