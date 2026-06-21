'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(243,236,225,.92)', backdropFilter: 'saturate(140%) blur(14px)', WebkitBackdropFilter: 'saturate(140%) blur(14px)', borderBottom: '1px solid rgba(71,60,48,.12)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-7 h-[70px] flex items-center justify-between gap-6">
        <Link href="/" className="flex flex-col items-start leading-none no-underline">
          <span style={{ fontFamily: 'var(--font-jost)', fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 3 }}>Nails</span>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#473C30', fontWeight: 500 }}>Polished by Raizy</span>
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
          <Link href="/booking" className="no-underline" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '11px 20px', borderRadius: 999 }}>
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
          <Link href="/booking" onClick={() => setOpen(false)} className="block no-underline mt-4 text-center" style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px', borderRadius: 999 }}>
            Book an appointment
          </Link>
        </div>
      )}
    </nav>
  )
}
