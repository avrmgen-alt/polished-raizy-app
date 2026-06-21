import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'

const pillars = [
  { title: 'Dry technique', body: 'No water soaking — preserves the nail structure and extends wear.' },
  { title: 'One-on-one', body: 'Every appointment is private and unhurried, just for you.' },
  { title: 'Certified', body: 'Formally trained in the Russian manicure technique.' },
]

export default async function AboutPage() {
  const s = await getSettings(['aboutCopy1', 'aboutCopy2'])
  return (
    <>
      <section className="max-w-[1100px] mx-auto px-5 sm:px-7 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div className="relative w-full max-w-[420px] mx-auto md:mx-0" style={{ borderRadius: '190px 190px 14px 14px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 26px 60px -30px rgba(71,60,48,.5)' }}>
          <Image src="/images/russian-manicure.jpeg" alt="Russian manicure detail" fill style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>About</span>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(34px,4.6vw,54px)', lineHeight: 1.06, color: '#3C3328', margin: '12px 0 20px' }}>Meet Raizy</h1>
          <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: '#6E6253', margin: '0 0 16px' }}>{s.aboutCopy1}</p>
          <p style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: '#6E6253', margin: '0 0 26px' }}>{s.aboutCopy2}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pillars.map(p => (
              <div key={p.title} style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.1)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 18, color: '#A8927C', marginBottom: 5 }}>{p.title}</div>
                <div style={{ fontWeight: 300, fontSize: 13, lineHeight: 1.6, color: '#6E6253' }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: '#473C30', marginTop: 40 }}>
        <div className="max-w-[1000px] mx-auto px-5 sm:px-7 py-16 text-center">
          <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(22px,3.4vw,36px)', lineHeight: 1.4, color: '#F4EEE4' }}>Clean. Structured. Refined.<br />Healthy, long-lasting manicures — by appointment only.</div>
          <Link href="/booking" style={{ display: 'inline-block', marginTop: 26, background: '#F4EEE4', color: '#473C30', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 30px', borderRadius: 999, textDecoration: 'none' }}>Book with Raizy</Link>
        </div>
      </section>
    </>
  )
}
