import { prisma } from './prisma'

export async function getSalonBySlug(slug: string) {
  return prisma.salon.findUnique({ where: { slug } })
}
