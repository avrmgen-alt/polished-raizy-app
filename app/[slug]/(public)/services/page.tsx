import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'
import { fmt } from '@/lib/settings'

export default async function ServicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const services = await prisma.service.findMany({ where: { salonId: salon.id, isAddon: false }, orderBy: { order: 'asc' } })
  const addons = await prisma.service.findMany({ where: { salonId: salon.id, isAddon: true }, orderBy: { order: 'asc' } })

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-7 py-16">
      <div className="mb-12 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>The menu</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,60px)', color: '#3C3328', margin: '12px 0 0' }}>Services &amp; Pricing</h1>
      </div>

      <div className="grid gap-4 mb-16">
        {services.map(s => (
          <div key={s.id} style={{ background: '#FBF7F1', borderRadius: 14, padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#3C3328', margin: '0 0 4px' }}>{s.name}</p>
              {s.description && <p style={{ fontSize: 14, color: '#6E6253', margin: 0 }}>{s.description}</p>}
            </div>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, color: '#3C3328', whiteSpace: 'nowrap' }}>{fmt(s.price)}</span>
          </div>
        ))}
      </div>

      {addons.length > 0 && (
        <div className="mb-16">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(26px,3.5vw,40px)', color: '#3C3328', margin: '0 0 16px' }}>Add-ons</h2>
          <div className="grid gap-4">
            {addons.map(s => (
              <div key={s.id} style={{ background: '#FBF7F1', borderRadius: 14, padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328', margin: '0 0 4px' }}>{s.name}</p>
                  {s.description && <p style={{ fontSize: 13, color: '#6E6253', margin: 0 }}>{s.description}</p>}
                </div>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', whiteSpace: 'nowrap' }}>+{fmt(s.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <Link href={`/${slug}/booking`} style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>
          Book an appointment
        </Link>
      </div>
    </div>
  )
}
