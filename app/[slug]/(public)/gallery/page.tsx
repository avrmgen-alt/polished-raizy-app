import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSalonBySlug } from '@/lib/tenant'

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const photos = await prisma.galleryPhoto.findMany({ where: { salonId: salon.id }, orderBy: { order: 'asc' } })

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-7 py-16">
      <div className="mb-12 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Our work</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,60px)', color: '#3C3328', margin: '12px 0 0' }}>Gallery</h1>
      </div>

      {photos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6E6253' }}>No photos yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map(g => (
            <div key={g.id} className="relative" style={{ aspectRatio: '4/5', borderRadius: 14, overflow: 'hidden', background: '#E7DBC9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {g.caption && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px', background: 'linear-gradient(transparent,rgba(60,51,40,.6))', color: '#F4EEE4', fontSize: 13 }}>{g.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
