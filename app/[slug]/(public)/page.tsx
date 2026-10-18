import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSettings } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'
import { fmt } from '@/lib/settings'

export default async function SalonHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const s = await getSettings(salon.id, ['heroLine1', 'heroLine2', 'heroCopy', 'heroImage'])
  const services = await prisma.service.findMany({ where: { salonId: salon.id, isAddon: false }, orderBy: { order: 'asc' } })
  const photos = await prisma.galleryPhoto.findMany({ where: { salonId: salon.id }, orderBy: { order: 'asc' }, take: 4 })
  const signature = services[0]

  return (
    <>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-7 pt-14 pb-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="animate-rise">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-pbr-accent" />
            <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Clean · Structured · Refined</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(42px,6vw,74px)', lineHeight: 1.02, color: '#3C3328', margin: '0 0 22px' }}>
            {s.heroLine1 || salon.name}<br />
            <em style={{ fontStyle: 'italic', color: '#A8927C' }}>{s.heroLine2}</em>
          </h1>
          <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.78, color: '#6E6253', maxWidth: 430, margin: '0 0 32px' }}>{s.heroCopy}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href={`/${slug}/booking`} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999, textDecoration: 'none' }}>Book an appointment</Link>
            <Link href={`/${slug}/services`} style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', padding: '15px 8px', borderBottom: '1px solid #A8927C', textDecoration: 'none' }}>View the menu</Link>
          </div>
        </div>
        <div className="animate-fade relative flex justify-center">
          <div className="relative w-full max-w-[400px]" style={{ borderRadius: '220px 220px 16px 16px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 30px 70px -30px rgba(71,60,48,.45)' }}>
            {(s.heroImage && s.heroImage.startsWith('data:')) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.heroImage} alt={salon.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Image src={s.heroImage || '/images/hero.jpeg'} alt={salon.name} fill style={{ objectFit: 'cover' }} priority />
            )}
          </div>
        </div>
      </section>

      {/* Signature service */}
      {signature && (
        <section style={{ background: '#E7DBC9', borderTop: '1px solid rgba(71,60,48,.1)', borderBottom: '1px solid rgba(71,60,48,.1)' }}>
          <div className="max-w-[1200px] mx-auto px-5 sm:px-7 py-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>The signature</span>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(32px,4.4vw,50px)', lineHeight: 1.05, color: '#3C3328', margin: '14px 0 16px' }}>{signature.name}</h2>
              <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.78, color: '#6E6253', maxWidth: 440, margin: '0 0 24px' }}>{signature.description}</p>
              <div className="flex items-baseline gap-3 mb-7">
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 44, color: '#3C3328' }}>{fmt(signature.price)}</span>
              </div>
              <Link href={`/${slug}/services`} style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', paddingBottom: 4, borderBottom: '1px solid #A8927C', textDecoration: 'none' }}>See full price list →</Link>
            </div>
            <div className="flex gap-4">
              <div className="flex-1" style={{ borderRadius: '150px 150px 12px 12px', aspectRatio: '3/5', background: 'linear-gradient(160deg,#E5D3C9,#D8C7B7)', boxShadow: '0 22px 50px -26px rgba(71,60,48,.5)' }} />
              <div className="flex-1 mt-10" style={{ borderRadius: '12px 12px 150px 150px', aspectRatio: '3/5', background: 'linear-gradient(160deg,#EADBD4,#DDCBC0)', boxShadow: '0 22px 50px -26px rgba(71,60,48,.5)' }} />
            </div>
          </div>
        </section>
      )}

      {/* Gallery teaser */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-7 py-16">
        <div className="flex items-end justify-between gap-5 mb-8">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(28px,4vw,44px)', color: '#3C3328', margin: 0 }}>Recent work</h2>
          <Link href={`/${slug}/gallery`} style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', paddingBottom: 4, borderBottom: '1px solid #A8927C', textDecoration: 'none', whiteSpace: 'nowrap' }}>View gallery →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {photos.map(g => (
            <div key={g.id} className="relative" style={{ aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden', background: '#E7DBC9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
          {photos.length === 0 && [0,1,2,3].map(i => (
            <div key={i} style={{ aspectRatio: '4/5', borderRadius: 12, background: '#E7DBC9' }} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-7 pb-20">
        <div style={{ background: '#473C30', borderRadius: 22, padding: 'clamp(40px,6vw,64px) clamp(24px,4vw,48px)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(24px,4vw,40px)', lineHeight: 1.25, color: '#F4EEE4', maxWidth: 640, margin: '0 auto 26px' }}>
            "Slots fill up quickly — reserve the chair that&apos;s truly yours."
          </p>
          <Link href={`/${slug}/booking`} style={{ display: 'inline-block', background: '#F4EEE4', color: '#473C30', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>
            Reserve your appointment
          </Link>
        </div>
      </section>
    </>
  )
}
