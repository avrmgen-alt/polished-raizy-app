'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ContactPage() {
  const params = useParams()
  const slug = params.slug as string
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`/${slug}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-7 py-16">
      <div className="mb-12 text-center">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Get in touch</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,60px)', color: '#3C3328', margin: '12px 0 0' }}>Contact</h1>
      </div>

      {status === 'sent' ? (
        <div style={{ background: '#FBF7F1', borderRadius: 18, padding: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, color: '#3C3328', margin: '0 0 8px' }}>Message sent!</p>
          <p style={{ color: '#6E6253' }}>We'll be in touch shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6E6253' }}>{label}</span>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                required
                style={{ background: '#FBF7F1', border: '1px solid #E7DBC9', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#3C3328', outline: 'none' }}
              />
            </label>
          ))}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6E6253' }}>Message</span>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
              rows={5}
              style={{ background: '#FBF7F1', border: '1px solid #E7DBC9', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#3C3328', outline: 'none', resize: 'vertical' }}
            />
          </label>
          {status === 'error' && <p style={{ color: '#c0392b', fontSize: 14 }}>Something went wrong. Please try again.</p>}
          <button type="submit" disabled={status === 'sending'} style={{ alignSelf: 'flex-start', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px 32px', borderRadius: 999, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.7 : 1 }}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}
