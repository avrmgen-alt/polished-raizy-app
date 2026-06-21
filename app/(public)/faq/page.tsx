import { prisma } from '@/lib/prisma'
import FaqClient from '@/components/FaqClient'

export default async function FaqPage() {
  const faqs = await prisma.faqItem.findMany({ where: { published: true }, orderBy: { order: 'asc' } })
  return (
    <>
      <section className="max-w-[860px] mx-auto px-5 sm:px-7 pt-16 pb-6 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Good to know</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,58px)', color: '#3C3328', margin: '12px 0 14px' }}>FAQ &amp; Aftercare</h1>
        <div style={{ width: 44, height: 1, background: '#A8927C', margin: '0 auto' }} />
      </section>
      <FaqClient faqs={faqs} />
    </>
  )
}
