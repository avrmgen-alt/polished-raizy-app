import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

export default async function GalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: 'asc' } })
  const ig = await getSetting('studioIg')
  return (
    <>
      <section className="max-w-[1100px] mx-auto px-5 sm:px-7 pt-16 pb-6 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Portfolio</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(38px,5.5vw,62px)', color: '#3C3328', margin: '12px 0 14px' }}>The Gallery</h1>
        <div style={{ width: 44, height: 1, background: '#A8927C', margin: '0 auto 14px' }} />
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 19, color: '#6E6253', maxWidth: 500, margin: '0 auto' }}>A quiet record of structured sets, soft chromes and considered finishes.</p>
      </section>
      <section className="max-w-[1160px] mx-auto px-5 sm:px-7 pb-20">
        {photos.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#9C8B77', fontWeight: 300 }}>Gallery coming soon.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
            {photos.map(g => (
              <div key={g.id} className="relative" style={{ aspectRatio: '4/5', borderRadius: 14, overflow: 'hidden', background: '#E7DBC9', boxShadow: '0 16px 38px -24px rgba(71,60,48,.5)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={g.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="absolute inset-x-0 bottom-0 p-4" style={{ background: 'linear-gradient(to top, rgba(60,51,40,.5), transparent)' }}>
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 16, color: '#FBF7F1' }}>{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 18, color: '#6E6253', margin: '0 0 18px' }}>See more on Instagram</p>
          <div className="inline-flex gap-3 flex-wrap justify-center">
            <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', border: '1px solid rgba(71,60,48,.3)', padding: '13px 24px', borderRadius: 999 }}>{ig}</span>
            <Link href="/booking" style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>Book a set</Link>
          </div>
        </div>
      </section>
    </>
  )
}
