'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

function buildLinks(slug?: string) {
  const base = slug ? `/${slug}` : ''
  return [
    { href: `${base}/`, label: 'Home' },
    { href: `${base}/services`, label: 'Services' },
    { href: `${base}/about`, label: 'About' },
    { href: `${base}/gallery`, label: 'Gallery' },
    { href: `${base}/faq`, label: 'FAQ' },
    { href: `${base}/contact`, label: 'Contact' },
  ]
}

export default function Nav({ slug, salonName }: { slug?: string; salonName?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const links = buildLinks(slug)
  const displayName = salonName || 'Polished by Raizy'

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(243,236,225,.92)', backdropFilter: 'saturate(140%) blur(14px)', WebkitBackdropFilter: 'saturate(140%) blur(14px)', borderBottom: '1px solid rgba(71,60,48,.12)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-7 h-[70px] flex items-center justify-between gap-6">
        <Link href={slug ? `/${slug}/` : '/'} className="flex flex-col items-start leading-none no-underline">
          <span style={{ fontFamily: 'var(--font-jost)', fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 3 }}>Beauty</span>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#473C30', fontWeight: 500 }}>{displayName}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="relative py-1 no-underline" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: pathname === l.href ? '#473C30' : '#6E6253', fontWeight: 400 }}>
              {l.label}
              {pathname === l.href && <span className="absolute bottom-0 left-0 right-0 h-px bg-pbr-accent" />}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href={slug ? `/${slug}/booking` : '/booking'} className="no-underline" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '11px 20px', borderRadius: 999 }}>
            Book
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col justify-between w-6 h-4 border-none bg-transparent cursor-pointer p-0" aria-label="Menu">
          <span className="block h-px bg-pbr-dark" />
          <span className="block h-px bg-pbr-dark" />
          <span className="block h-px bg-pbr-dark" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(71,60,48,.12)', background: 'rgba(243,236,225,.97)' }} className="md:hidden px-5 pb-5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block no-underline py-3 border-b" style={{ fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#473C30', borderColor: 'rgba(71,60,48,.08)' }}>
              {l.label}
            </Link>
          ))}
          <Link href={slug ? `/${slug}/booking` : '/booking'} onClick={() => setOpen(false)} className="block no-underline mt-4 text-center" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px', borderRadius: 999 }}>
            Book an appointment
          </Link>
        </div>
      )}
    </nav>
  )
}
