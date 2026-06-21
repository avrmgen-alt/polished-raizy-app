import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSetting, fmt } from '@/lib/settings'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isAddon: false }, orderBy: { order: 'asc' } })
  const addons = await prisma.service.findMany({ where: { isAddon: true }, orderBy: { order: 'asc' } })
  const depositCents = parseInt(await getSetting('depositAmount') || '1000')

  return (
    <>
      <section className="max-w-[1100px] mx-auto px-5 sm:px-7 pt-16 pb-6 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>The menu</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(38px,5.5vw,64px)', letterSpacing: '0.02em', color: '#3C3328', margin: '12px 0 14px' }}>Price List</h1>
        <div style={{ width: 44, height: 1, background: '#A8927C', margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 19, color: '#6E6253', maxWidth: 500, margin: '0 auto' }}>Russian Manicure pricing reflects the advanced, dry technique.</p>
      </section>

      <section className="max-w-[1040px] mx-auto px-5 sm:px-7 pb-5">
        {services.map(s => (
          <div key={s.id} style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 18, padding: '30px 28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 540 }}>
              <h3 style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 500, fontSize: 26, color: '#3C3328', margin: '0 0 4px' }}>{s.name}</h3>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 12 }}>{s.blurb}</div>
              <p style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.72, color: '#6E6253', margin: 0 }}>{s.description}</p>
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 42, color: '#3C3328', whiteSpace: 'nowrap' }}>{fmt(s.price)}</div>
          </div>
        ))}
      </section>

      {addons.length > 0 && (
        <section className="max-w-[1040px] mx-auto px-5 sm:px-7 pb-8">
          <div style={{ fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 16, textAlign: 'center' }}>Add to any set</div>
          <div style={{ background: '#E7DBC9', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(71,60,48,.12)' }}>
            {addons.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '20px 28px', borderBottom: i < addons.length - 1 ? '1px solid rgba(71,60,48,.1)' : 'none', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 20, color: '#3C3328' }}>{a.name}</div>
                  <div style={{ fontWeight: 300, fontSize: 13, color: '#6E6253', marginTop: 2 }}>{a.description}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#A8927C', whiteSpace: 'nowrap' }}>{fmt(a.price)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-[1040px] mx-auto px-5 sm:px-7 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 56px -28px rgba(71,60,48,.5)' }}>
          <Image src="/images/price-list.jpeg" alt="Price list" width={600} height={800} style={{ width: '100%', display: 'block' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 36, color: '#3C3328', margin: '0 0 14px' }}>Ready when you are</h2>
          <p style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: '#6E6253', margin: '0 0 26px', maxWidth: 360 }}>Choose your service, add a design, and request a time. A {fmt(depositCents)} deposit holds your slot and goes toward your manicure.</p>
          <Link href="/booking" style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999, textDecoration: 'none' }}>Book now</Link>
        </div>
      </section>
    </>
  )
}
