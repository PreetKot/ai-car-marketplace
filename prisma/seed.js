import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing cars first
  await prisma.car.deleteMany({})
  console.log('🗑️ Cleared existing cars')

  // Sample cars data
  const cars = [
    {
      make: 'BMW',
      model: 'X5',
      year: 2023,
      price: 65000.00,
      mileage: 15000,
      color: 'Black',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'SUV',
      seats: 5,
      description: 'Luxury SUV with premium features, leather seats, and advanced safety technology.',
      featured: true,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Mercedes',
      model: 'C-Class',
      year: 2022,
      price: 55000.00,
      mileage: 22000,
      color: 'White',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      seats: 5,
      description: 'Elegant sedan with advanced technology and premium interior.',
      featured: true,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 32000.00,
      mileage: 8000,
      color: 'Silver',
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      seats: 5,
      description: 'Reliable hybrid sedan with excellent fuel economy.',
      featured: true,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2022,
      price: 42000.00,
      mileage: 18000,
      color: 'Red',
      fuelType: 'Petrol',
      transmission: 'Manual',
      bodyType: 'Coupe',
      seats: 4,
      description: 'Classic American muscle car with powerful V8 engine.',
      featured: false,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Honda',
      model: 'CR-V',
      year: 2023,
      price: 38000.00,
      mileage: 12000,
      color: 'Gray',
      fuelType: 'Petrol',
      transmission: 'CVT',
      bodyType: 'SUV',
      seats: 5,
      description: 'Compact SUV with excellent reliability and spacious cargo area.',
      featured: false,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 52000.00,
      mileage: 5000,
      color: 'White',
      fuelType: 'Electric',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      seats: 5,
      description: 'Electric sedan with autopilot capabilities and zero emissions.',
      featured: true,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Audi',
      model: 'A4',
      year: 2021,
      price: 48000.00,
      mileage: 35000,
      color: 'Blue',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      seats: 5,
      description: 'Sporty sedan with excellent performance and premium build quality.',
      featured: false,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
      ]
    },
    {
      make: 'Jeep',
      model: 'Wrangler',
      year: 2022,
      price: 45000.00,
      mileage: 25000,
      color: 'Green',
      fuelType: 'Petrol',
      transmission: 'Manual',
      bodyType: 'SUV',
      seats: 4,
      description: 'Rugged off-road SUV with removable doors and roof.',
      featured: false,
      status: 'AVAILABLE',
      images: [
        'https://images.unsplash.com/photo-1544636331-6e4e4d9b6d5d?w=800&h=600&fit=crop'
      ]
    }
  ]

  // Create cars one by one
  for (const carData of cars) {
    const car = await prisma.car.create({
      data: carData
    })
    console.log(`✅ Created car: ${car.make} ${car.model}`)
  }

  console.log(`🎉 Successfully seeded ${cars.length} cars!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })