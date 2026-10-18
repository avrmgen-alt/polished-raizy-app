import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSettings } from '@/lib/settings'
import { getSalonBySlug } from '@/lib/tenant'

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const s = await getSettings(salon.id, ['aboutTitle', 'aboutBody', 'studioLocation', 'studioPhone', 'studioIg', 'studioHours'])

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-7 py-16">
      <div className="mb-12">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>The studio</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,60px)', color: '#3C3328', margin: '12px 0 0' }}>{s.aboutTitle || `About ${salon.name}`}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        <div>
          {s.aboutBody ? (
            s.aboutBody.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: '#6E6253', margin: '0 0 18px' }}>{para}</p>
            ))
          ) : (
            <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: '#6E6253' }}>Welcome to {salon.name}. We look forward to seeing you.</p>
          )}
        </div>
        <div style={{ background: '#FBF7F1', borderRadius: 18, padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 26, color: '#3C3328', margin: '0 0 20px' }}>Visit us</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {s.studioLocation && <li style={{ fontSize: 15, color: '#6E6253' }}>📍 {s.studioLocation}</li>}
            {s.studioPhone && <li style={{ fontSize: 15, color: '#6E6253' }}>📞 {s.studioPhone}</li>}
            {s.studioIg && <li style={{ fontSize: 15, color: '#6E6253' }}>📸 @{s.studioIg}</li>}
            {s.studioHours && <li style={{ fontSize: 15, color: '#6E6253', whiteSpace: 'pre-line' }}>🕐 {s.studioHours}</li>}
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link href={`/${slug}/booking`} style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 32px', borderRadius: 999, textDecoration: 'none' }}>
          Book an appointment
        </Link>
      </div>
    </div>
  )
}
