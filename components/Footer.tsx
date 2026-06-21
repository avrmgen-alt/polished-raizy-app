import Link from 'next/link'

interface FooterProps {
  location: string
  phone: string
  ig: string
  hours: string
}

export default function Footer({ location, phone, ig, hours }: FooterProps) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <footer style={{ background: '#3C3328', color: '#D8CBB9' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-7 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div style={{ fontFamily: 'var(--font-jost)', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 6 }}>Nails</div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F4EEE4', fontWeight: 500, marginBottom: 14 }}>Polished by Raizy</div>
            <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: '#B7A992', maxWidth: 280 }}>Certified Russian manicures — clean, structured and refined. By appointment only.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 14 }}>Explore</div>
            <div className="flex flex-col gap-1">
              {links.map(l => (
                <Link key={l.href} href={l.href} className="no-underline" style={{ fontWeight: 300, fontSize: 14, color: '#D8CBB9', padding: '5px 0' }}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 14 }}>Studio</div>
            <div style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.9, color: '#D8CBB9' }}>
              {location && <div>{location}</div>}
              {phone && <div>{phone}</div>}
              {ig && <div>{ig}</div>}
              {hours && <div>{hours}</div>}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 300, color: '#9C8B77' }}>© {new Date().getFullYear()} Polished by Raizy</span>
          <Link href="/admin/login" className="no-underline" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6E6253' }}>Owner access</Link>
        </div>
      </div>
    </footer>
  )
}
