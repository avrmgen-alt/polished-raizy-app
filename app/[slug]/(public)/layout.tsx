import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getSalonBySlug } from '@/lib/tenant'
import { getSettings } from '@/lib/settings'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) return {}
  return { title: salon.name, description: `Book an appointment at ${salon.name}.` }
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const s = await getSettings(salon.id, ['studioLocation', 'studioPhone', 'studioIg', 'studioHours'])
  return (
    <>
      <div style={{ background: '#473C30', color: '#EFE6D9', textAlign: 'center', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '9px 16px', fontWeight: 300 }}>
        By appointment only &nbsp;·&nbsp; {salon.name} &nbsp;·&nbsp; {s.studioLocation || 'By appointment'}
      </div>
      <Nav slug={slug} salonName={salon.name} />
      <main>{children}</main>
      <Footer location={s.studioLocation} phone={s.studioPhone} ig={s.studioIg} hours={s.studioHours} slug={slug} />
    </>
  )
}
