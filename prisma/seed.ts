import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'

const url = process.env.TURSO_DATABASE_URL || `file:${path.resolve(__dirname, 'dev.db')}`
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql({ url, authToken })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const hash = await bcrypt.hash('admin123', 12)

  const settings = [
    { key: 'adminPasswordHash', value: hash },
    { key: 'accentColor', value: '#A8927C' },
    { key: 'heroLine1', value: 'The art of the' },
    { key: 'heroLine2', value: 'Russian manicure' },
    { key: 'heroCopy', value: 'A meticulous dry Russian manicure — gentle cuticle work, a structured hard-gel finish and a result that lasts. By appointment, in Toms River.' },
    { key: 'aboutCopy1', value: 'Polished by Raizy is a private, by-appointment nail studio in Toms River, New Jersey, specialising in the certified Russian manicure — a precise, dry technique built around the health of your natural nail.' },
    { key: 'aboutCopy2', value: 'Every set is unhurried and one-on-one: meticulous cuticle work, a structured builder-gel finish, and a clean result that wears beautifully for weeks. No rush, no crowds — just a calm chair and considered work.' },
    { key: 'studioLocation', value: 'Toms River, NJ' },
    { key: 'studioPhone', value: '' },
    { key: 'studioIg', value: '@polishedbyraizy' },
    { key: 'studioHours', value: 'By appointment' },
    { key: 'heroImage', value: '' },
    { key: 'depositAmount', value: '1000' },
    { key: 'notificationEmail', value: '' },
    { key: 'stripePublishableKey', value: '' },
    { key: 'stripeSecretKey', value: '' },
    { key: 'resendApiKey', value: '' },
    { key: 'gcalAccessToken', value: '' },
    { key: 'gcalRefreshToken', value: '' },
    { key: 'gcalCalendarId', value: '' },
    { key: 'gcalClientId', value: '' },
    { key: 'gcalClientSecret', value: '' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  await prisma.service.deleteMany()
  await prisma.service.createMany({
    data: [
      { name: 'Russian Manicure', blurb: 'Soft or hard gel', description: 'A precise, dry technique that reveals the full nail bed for a clean, elongated look — finished with builder gel for strength that wears beautifully for weeks.', price: 5500, isAddon: false, order: 0 },
      { name: 'Russian Manicure + Pedicure', blurb: 'Full service', description: 'The full experience — meticulous Russian manicure paired with a structured pedicure for hands and feet that match.', price: 9500, isAddon: false, order: 1 },
      { name: 'Gel Removal', blurb: 'Add-on', description: 'Safe, careful removal of existing gel or builder gel before your new set.', price: 1500, isAddon: true, order: 0 },
      { name: 'Nail Art', blurb: 'Add-on', description: 'Custom nail art — from minimalist linework to intricate designs. Discussed at appointment.', price: 2000, isAddon: true, order: 1 },
      { name: 'Chrome Powder', blurb: 'Add-on', description: 'Mirror-finish chrome applied over gel for a sleek, reflective result.', price: 1500, isAddon: true, order: 2 },
    ],
  })

  await prisma.galleryPhoto.deleteMany()
  await prisma.galleryPhoto.create({ data: { url: '/images/hero.jpeg', caption: 'Russian manicure', order: 0 } })

  await prisma.faqItem.deleteMany()
  await prisma.faqItem.createMany({
    data: [
      { question: 'What is a Russian manicure?', answer: 'A Russian manicure is a precise, dry technique that uses an e-file to carefully work around the cuticle area — revealing the full nail bed without cutting or pushing the cuticle. The result is a clean, elongated look with a structured gel finish.', published: true, order: 0, source: 'admin' },
      { question: 'How long does the appointment take?', answer: 'A Russian manicure typically takes 90–120 minutes. The unhurried, one-on-one format means your nails receive full attention from start to finish.', published: true, order: 1, source: 'admin' },
      { question: 'How long will my manicure last?', answer: 'With proper aftercare, a Russian manicure with hard-gel finish typically lasts 3–4 weeks. The structured gel prevents lifting and chipping far better than a traditional manicure.', published: true, order: 2, source: 'admin' },
    ],
  })

  console.log('Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
