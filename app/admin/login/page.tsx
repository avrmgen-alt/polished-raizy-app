'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) {
      router.push('/admin/bookings')
    } else {
      const d = await res.json()
      setError(d.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EFE6D9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400 }}>
        <div className="text-center mb-8">
          <div style={{ fontFamily: 'var(--font-jost)', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A8927C', marginBottom: 5 }}>Nails</div>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#473C30', fontWeight: 500 }}>Polished by Raizy</div>
          <div style={{ fontSize: 12, color: '#9C8B77', marginTop: 8, letterSpacing: '0.1em' }}>Owner access</div>
        </div>
        <div className="flex flex-col gap-3">
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password"
              style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '13px 44px 13px 14px', fontSize: 14, color: '#3C3328', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9C8B77', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0 }}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}
          <button onClick={login} disabled={loading || !password} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
