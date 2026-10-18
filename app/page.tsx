import Link from 'next/link'

const BUSINESS_TYPES = ['Nail salon', 'Barber shop', 'Spa', 'Lash studio', 'Brow bar', 'Massage therapy', '…and more']

export default function PlatformHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#EFE6D9', fontFamily: 'var(--font-jost)' }}>
      {/* Nav */}
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, color: '#3C3328', letterSpacing: '-0.01em' }}>BookDesk</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/polishedbyraizy" style={{ fontSize: 13, color: '#6E6253', textDecoration: 'none' }}>Demo</Link>
          <Link href="/signup" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: 999, textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#E7DBC9', borderRadius: 999, padding: '6px 16px', marginBottom: 32 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#A8927C' }}>$29 / month · Free trial</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(46px,7vw,82px)', lineHeight: 1.0, color: '#3C3328', margin: '0 0 24px' }}>
          The booking platform<br /><em style={{ color: '#A8927C', fontStyle: 'italic' }}>built for beauty</em>
        </h1>
        <p style={{ fontWeight: 300, fontSize: 18, lineHeight: 1.7, color: '#6E6253', maxWidth: 520, margin: '0 auto 40px' }}>
          Give your business a beautiful online presence and let clients book 24/7 — no tech skills required.
        </p>
        <Link href="/signup" style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '16px 40px', borderRadius: 999, textDecoration: 'none' }}>
          Start free trial
        </Link>
      </section>

      {/* Business types */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9C8B77', margin: '0 0 18px' }}>Works for any appointment business</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {BUSINESS_TYPES.map(t => (
            <span key={t} style={{ background: '#FBF7F1', color: '#6E6253', fontSize: 14, padding: '8px 18px', borderRadius: 999 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#473C30' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(30px,4vw,48px)', color: '#F4EEE4', textAlign: 'center', margin: '0 0 56px' }}>
            Everything you need
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32 }}>
            {[
              { title: 'Beautiful booking page', body: 'Your clients get a polished booking experience with your brand, services, and photos.' },
              { title: 'Admin dashboard', body: 'Manage bookings, update services, upload gallery photos, and reply to messages — all in one place.' },
              { title: 'Deposit collection', body: 'Collect deposits via Stripe at booking time to reduce no-shows.' },
              { title: 'Your own URL', body: 'Every business gets a clean URL at bookdesk.app/yourname — easy to share.' },
            ].map(f => (
              <div key={f.title} style={{ borderTop: '1px solid rgba(244,238,228,.15)', paddingTop: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 22, color: '#F4EEE4', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(244,238,228,.65)', margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 520, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Pricing</span>
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(30px,4.5vw,52px)', color: '#3C3328', margin: '12px 0 32px' }}>One simple plan</h2>
        <div style={{ background: '#FBF7F1', borderRadius: 22, padding: '44px 36px' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 64, color: '#3C3328', lineHeight: 1 }}>$29</div>
          <div style={{ fontSize: 13, color: '#9C8B77', marginBottom: 28 }}>per month, cancel anytime</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {['Unlimited bookings', 'Custom booking page', 'Gallery & services editor', 'Contact messages', 'Stripe deposit collection', 'Free 14-day trial'].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 15, color: '#6E6253' }}>
                <span style={{ color: '#A8927C' }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <Link href="/signup" style={{ display: 'block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '15px 28px', borderRadius: 999, textDecoration: 'none' }}>
            Start free trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(71,60,48,.12)', padding: '24px', textAlign: 'center', fontSize: 13, color: '#9C8B77' }}>
        © {new Date().getFullYear()} BookDesk
      </footer>
    </div>
  )
}
