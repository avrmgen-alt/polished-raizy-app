import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { fmt } from '@/lib/settings'

const pillars = [
  { num: '01', title: 'Dry Technique', body: 'No soaking — the Russian method keeps the natural nail dry for a longer-lasting, healthier result.' },
  { num: '02', title: 'Cuticle Precision', body: 'Meticulous e-file work around the cuticle reveals the full nail bed and eliminates lifting.' },
  { num: '03', title: 'Builder Gel Finish', body: 'A structured hard-gel overlay adds strength and a sleek finish that wears beautifully for weeks.' },
]

const aftercare = [
  'Avoid soaking nails for the first 24 hours.',
  'Apply cuticle oil daily to keep nails healthy and flexible.',
  'Wear gloves for cleaning and washing dishes.',
  'Do not pick or peel — return for a fill or removal.',
]

export default async function HomePage() {
  const s = await getSettings(['heroLine1', 'heroLine2', 'heroCopy'])
  const services = await prisma.service.findMany({ where: { isAddon: false }, orderBy: { order: 'asc' } })
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' }, take: 4 })
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
            {s.heroLine1}<br />
            <em style={{ fontStyle: 'italic', color: '#A8927C' }}>{s.heroLine2}</em>
          </h1>
          <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.78, color: '#6E6253', maxWidth: 430, margin: '0 0 32px' }}>{s.heroCopy}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/booking" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999, textDecoration: 'none' }}>
              Book an appointment
            </Link>
            <Link href="/services" style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', padding: '15px 8px', borderBottom: '1px solid #A8927C', textDecoration: 'none' }}>
              View the menu
            </Link>
          </div>
        </div>
        <div className="animate-fade relative flex justify-center">
          <div className="relative w-full max-w-[400px]" style={{ borderRadius: '220px 220px 16px 16px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 30px 70px -30px rgba(71,60,48,.45)' }}>
            <Image src="/images/hero.jpeg" alt="Certified Russian manicure" fill style={{ objectFit: 'cover' }} priority />
          </div>
          <div className="animate-float absolute hidden sm:flex flex-col items-center justify-center" style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 999, width: 110, height: 110, boxShadow: '0 18px 40px -18px rgba(71,60,48,.4)', right: '4%', bottom: '18%' }}>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 28, color: '#A8927C', lineHeight: 1 }}>est.</span>
            <span style={{ fontFamily: 'var(--font-jost)', fontSize: 10, letterSpacing: '0.28em', color: '#6E6253', marginTop: 4 }}>2024</span>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-7 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(71,60,48,.12)', border: '1px solid rgba(71,60,48,.12)', borderRadius: 18, overflow: 'hidden' }}>
          {pillars.map(p => (
            <div key={p.num} style={{ background: '#FBF7F1', padding: '36px 28px' }}>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 20, color: '#A8927C', marginBottom: 12 }}>{p.num}</div>
              <h3 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500, fontSize: 22, color: '#3C3328', margin: '0 0 8px' }}>{p.title}</h3>
              <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: '#6E6253', margin: 0 }}>{p.body}</p>
            </div>
          ))}
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
                <span style={{ fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9C8B77' }}>{signature.blurb}</span>
              </div>
              <Link href="/services" style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', paddingBottom: 4, borderBottom: '1px solid #A8927C', textDecoration: 'none' }}>See full price list →</Link>
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
          <div>
            <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Recent work</span>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(28px,4vw,44px)', color: '#3C3328', margin: '12px 0 0' }}>A quiet portfolio</h2>
          </div>
          <Link href="/gallery" style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', paddingBottom: 4, borderBottom: '1px solid #A8927C', textDecoration: 'none', whiteSpace: 'nowrap' }}>View gallery →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {photos.map(g => (
            <div key={g.id} className="relative" style={{ aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden', background: '#E7DBC9', boxShadow: '0 14px 34px -22px rgba(71,60,48,.5)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: 'linear-gradient(to top, rgba(60,51,40,.55), transparent)' }}>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 14, color: '#FBF7F1' }}>{g.caption}</span>
              </div>
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
            "Slots fill up quickly through the season — reserve the chair that's truly yours."
          </p>
          <Link href="/booking" style={{ display: 'inline-block', background: '#F4EEE4', color: '#473C30', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>
            Reserve your appointment
          </Link>
        </div>
      </section>
    </>
  )
}
