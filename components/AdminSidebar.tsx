'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const nav = [
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼' },
  { href: '/admin/services', label: 'Services', icon: '💅' },
  { href: '/admin/faq', label: 'FAQ', icon: '💬' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/content', label: 'Content', icon: '✏️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside style={{ width: 220, background: '#473C30', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 40 }} className="hidden sm:flex">
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ fontFamily: 'var(--font-jost)', fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 4 }}>Nails</div>
        <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F4EEE4', fontWeight: 500 }}>Polished by Raizy</div>
        <div style={{ fontSize: 10, color: '#9C8B77', marginTop: 3, letterSpacing: '0.1em' }}>Admin</div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '0 16px' }} />
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        {nav.map(n => (
          <Link key={n.href} href={n.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', background: pathname.startsWith(n.href) ? 'rgba(255,255,255,.12)' : 'transparent', color: pathname.startsWith(n.href) ? '#F4EEE4' : '#B7A992', fontSize: 13, fontWeight: 300, letterSpacing: '0.04em' }}>
            <span style={{ fontSize: 15 }}>{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 10px' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,.1)', marginBottom: 12 }} />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: '#9C8B77', fontSize: 12, marginBottom: 4 }}>
          ← View site
        </Link>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: '#9C8B77', fontSize: 12, cursor: 'pointer', width: '100%' }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
