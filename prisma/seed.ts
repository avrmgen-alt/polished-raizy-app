import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'

const url = process.env.TURSO_DATABASE_URL || `file:${path.resolve(__dirname, 'dev.db')}`
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql({ url, authToken })
const prisma = new PrismaClient({ adapter } as any)

const SALON_ID = 'salon_pbr'
const SALON_SLUG = 'polishedbyraizy'

async function main() {
  const hash = await bcrypt.hash('admin123', 12)

  // Upsert the default salon
  await prisma.salon.upsert({
    where: { id: SALON_ID },
    update: {},
    create: {
      id: SALON_ID, name: 'Polished by Raizy', slug: SALON_SLUG,
      businessType: 'nail_salon', ownerEmail: 'raizy@polishedbyraizy.com',
      ownerPasswordHash: hash, subscriptionStatus: 'active',
    },
  })

  const settings = [
    { key: 'accentColor', value: '#A8927C' },
    { key: 'heroLine1', value: 'The art of the' },
    { key: 'heroLine2', value: 'Russian manicure' },
    { key: 'heroCopy', value: 'A meticulous dry Russian manicure — gentle cuticle work, a structured hard-gel finish and a result that lasts. By appointment, in Toms River.' },
    { key: 'studioLocation', value: 'Toms River, NJ' },
    { key: 'studioPhone', value: '' },
    { key: 'studioIg', value: 'polishedbyraizy' },
    { key: 'studioHours', value: 'By appointment' },
    { key: 'heroImage', value: '' },
    { key: 'depositAmount', value: '1000' },
    { key: 'notificationEmail', value: '' },
    { key: 'stripePublishableKey', value: '' },
    { key: 'stripeSecretKey', value: '' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { salonId_key: { salonId: SALON_ID, key: s.key } },
      update: {},
      create: { salonId: SALON_ID, ...s },
    })
  }

  await prisma.service.deleteMany({ where: { salonId: SALON_ID } })
  await prisma.service.createMany({
    data: [
      { salonId: SALON_ID, name: 'Russian Manicure', blurb: 'Soft or hard gel', description: 'A precise, dry technique that reveals the full nail bed.', price: 5500, isAddon: false, order: 0 },
      { salonId: SALON_ID, name: 'Russian Manicure + Pedicure', blurb: 'Full service', description: 'The full experience — manicure paired with a structured pedicure.', price: 9500, isAddon: false, order: 1 },
      { salonId: SALON_ID, name: 'Gel Removal', blurb: 'Add-on', description: 'Safe removal of existing gel before your new set.', price: 1500, isAddon: true, order: 0 },
      { salonId: SALON_ID, name: 'Nail Art', blurb: 'Add-on', description: 'Custom nail art — from minimalist to intricate.', price: 2000, isAddon: true, order: 1 },
      { salonId: SALON_ID, name: 'Chrome Powder', blurb: 'Add-on', description: 'Mirror-finish chrome applied over gel.', price: 1500, isAddon: true, order: 2 },
    ],
  })

  console.log('Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
