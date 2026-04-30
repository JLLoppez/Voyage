import { PrismaClient, UserRole, DriverStatus, TripStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database…')

  // Admin user
  const admin = await db.user.upsert({
    where: { email: 'admin@voyage.com' },
    update: {},
    create: {
      email:    'admin@voyage.com',
      name:     'Admin',
      password: await bcrypt.hash('admin123', 12),
      role:     UserRole.ADMIN,
    },
  })
  console.log('  ✓ admin user:', admin.email)

  // Passenger users
  const passengers = await Promise.all([
    db.user.upsert({
      where: { email: 'alice@example.com' }, update: {},
      create: { email:'alice@example.com', name:'Alice R.', password: await bcrypt.hash('password123',12), role: UserRole.PASSENGER },
    }),
    db.user.upsert({
      where: { email: 'tom@example.com' }, update: {},
      create: { email:'tom@example.com', name:'Tom H.', password: await bcrypt.hash('password123',12), role: UserRole.PASSENGER },
    }),
  ])
  console.log(`  ✓ ${passengers.length} passengers`)

  // Driver users + profiles
  const driverData = [
    { email:'marcus@example.com', name:'Marcus V.', car:'Mercedes E-Class', year:2023, rating:4.9, rides:1240, earnings:68200, status: DriverStatus.ACTIVE,         city:'New York'  },
    { email:'sofia@example.com',  name:'Sofia L.',  car:'BMW 5 Series',     year:2022, rating:4.8, rides:874,  earnings:47800, status: DriverStatus.ACTIVE,         city:'New York'  },
    { email:'elena@example.com',  name:'Elena V.',  car:'Tesla Model S',    year:2023, rating:4.9, rides:1580, earnings:92100, status: DriverStatus.ACTIVE,         city:'New York'  },
    { email:'chen@example.com',   name:'Chen W.',   car:'Mercedes S-Class', year:2024, rating:5.0, rides:88,   earnings:9800,  status: DriverStatus.PENDING_REVIEW, city:'New York'  },
  ]

  for (const d of driverData) {
    const user = await db.user.upsert({
      where: { email: d.email }, update: {},
      create: { email: d.email, name: d.name, password: await bcrypt.hash('password123', 12), role: UserRole.DRIVER },
    })
    await db.driver.upsert({
      where:  { userId: user.id },
      update: {},
      create: { userId: user.id, car: d.car, year: d.year, rating: d.rating, rides: d.rides, earnings: d.earnings, status: d.status, city: d.city },
    })
  }
  console.log(`  ✓ ${driverData.length} drivers`)

  console.log('✅ Seed complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
