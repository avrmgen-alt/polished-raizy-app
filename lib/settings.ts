import { prisma } from './prisma'

export async function getSetting(key: string): Promise<string> {
  const s = await prisma.setting.findUnique({ where: { key } })
  return s?.value ?? ''
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

export async function setSetting(key: string, value: string) {
  return prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
}

export function fmt(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}
