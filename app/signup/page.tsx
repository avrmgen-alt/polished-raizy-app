'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BUSINESS_TYPES = [
  { value: 'nail_salon', label: 'Nail salon' },
  { value: 'barber', label: 'Barber shop' },
  { value: 'spa', label: 'Spa' },
  { value: 'lash', label: 'Lash studio' },
  { value: 'brow', label: 'Brow bar' },
  { value: 'massage', label: 'Massage therapy' },
  { value: 'other', label: 'Other' },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [businessType, setBusinessType] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 32)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, businessType }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.push(`/${form.slug}/admin/bookings`)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = { background: '#FBF7F1', border: '1px solid #E7DBC9', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#3C3328', outline: 'none', width: '100%', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'flex' as const, flexDirection: 'column' as const, gap: 6 }
  const labelText = { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#6E6253' }

  return (
    <div style={{ minHeight: '100vh', background: '#EFE6D9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: 'var(--font-jost)' }}>
      <a href="/" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, color: '#3C3328', textDecoration: 'none', marginBottom: 40 }}>BookDesk</a>

      <div style={{ background: '#FBF7F1', borderRadius: 22, padding: '44px 40px', width: '100%', maxWidth: 480 }}>
        {step === 1 ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 32, color: '#3C3328', margin: '0 0 8px' }}>What type of business?</h1>
            <p style={{ fontSize: 15, color: '#9C8B77', fontWeight: 300, margin: '0 0 28px' }}>We'll set up the right defaults for you.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              {BUSINESS_TYPES.map(t => (
                <button key={t.value} onClick={() => setBusinessType(t.value)} style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${businessType === t.value ? '#473C30' : '#E7DBC9'}`, background: businessType === t.value ? '#473C30' : 'transparent', color: businessType === t.value ? '#F4EEE4' : '#6E6253', fontSize: 14, cursor: 'pointer', transition: 'all .15s' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => businessType && setStep(2)} disabled={!businessType} style={{ width: '100%', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '15px', borderRadius: 999, border: 'none', cursor: businessType ? 'pointer' : 'not-allowed', opacity: businessType ? 1 : 0.5 }}>
              Continue →
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 32, color: '#3C3328', margin: '0 0 4px' }}>Create your account</h1>
              <p style={{ fontSize: 14, color: '#9C8B77', fontWeight: 300, margin: 0 }}>14-day free trial, then $29/mo.</p>
            </div>
            <label style={labelStyle}>
              <span style={labelText}>Business name</span>
              <input type="text" required value={form.name} onChange={e => { const n = e.target.value; setForm(f => ({ ...f, name: n, slug: slugify(n) })) }} style={inputStyle} placeholder="Polished by Raizy" />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Your URL slug</span>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FBF7F1', border: '1px solid #E7DBC9', borderRadius: 10, overflow: 'hidden' }}>
                <span style={{ padding: '12px 0 12px 14px', fontSize: 14, color: '#9C8B77', whiteSpace: 'nowrap' }}>bookdesk.app/</span>
                <input type="text" required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1 }} placeholder="yoursalon" />
              </div>
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Email</span>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Password</span>
              <input type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />
            </label>
            {error && <p style={{ color: '#c0392b', fontSize: 14, margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '15px', borderRadius: 999, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account…' : 'Create account & pay →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
