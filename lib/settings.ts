import { prisma } from './prisma'

export async function getSetting(salonId: string, key: string): Promise<string> {
  const s = await prisma.setting.findUnique({ where: { salonId_key: { salonId, key } } })
  return s?.value ?? ''
}

export async function getSettings(salonId: string, keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { salonId, key: { in: keys } } })
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

export async function setSetting(salonId: string, key: string, value: string) {
  return prisma.setting.upsert({
    where: { salonId_key: { salonId, key } },
    update: { value },
    create: { salonId, key, value },
  })
}

export function fmt(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}
