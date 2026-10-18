import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'
import FaqAccordion from './FaqAccordion'

export default async function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const items = await prisma.faqItem.findMany({ where: { salonId: salon.id }, orderBy: { order: 'asc' } })

  return (
    <div className="max-w-[760px] mx-auto px-5 sm:px-7 py-16">
      <div className="mb-12 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Questions</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,60px)', color: '#3C3328', margin: '12px 0 0' }}>FAQ</h1>
      </div>
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6E6253' }}>No FAQ items yet.</p>
      ) : (
        <FaqAccordion items={items} slug={slug} />
      )}
    </div>
  )
}
