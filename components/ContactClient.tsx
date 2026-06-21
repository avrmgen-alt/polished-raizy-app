'use client'
import { useState } from 'react'

export default function ContactClient({ studio }: { studio: Record<string, string> }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return
    setLoading(true)
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, email, message }) })
    setSent(true)
    setLoading(false)
  }

  return (
    <section className="max-w-[1060px] mx-auto px-5 sm:px-7 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Say hello</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.05, color: '#3C3328', margin: '12px 0 20px' }}>Get in touch</h1>
        <p style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: '#6E6253', margin: '0 0 28px', maxWidth: 360 }}>Questions about a set, a design or availability? Send a note and Raizy will reply within a few hours.</p>
        <div className="flex flex-col gap-4">
          {studio.studioLocation && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 3 }}>Studio</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>{studio.studioLocation}</div>
            </div>
          )}
          {studio.studioPhone && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 3 }}>Phone</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>{studio.studioPhone}</div>
            </div>
          )}
          {studio.studioIg && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 3 }}>Instagram</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>{studio.studioIg}</div>
            </div>
          )}
          {studio.studioHours && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 3 }}>Hours</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>{studio.studioHours}</div>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '30px 28px' }}>
        {sent ? (
          <div className="text-center py-10">
            <div style={{ width: 52, height: 52, borderRadius: 999, background: '#A8927C', color: '#F4EEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>✓</div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, color: '#3C3328', marginBottom: 8 }}>Message sent</div>
            <p style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', margin: 0 }}>Thank you — Raizy will be in touch soon.</p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 18 }}>Send a message</div>
            <div className="flex flex-col gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              <div className="grid grid-cols-2 gap-3">
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help?" rows={4} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit' }} />
              <button onClick={submit} disabled={loading || !name.trim() || !email.trim() || !message.trim()} style={{ background: loading ? '#9C8B77' : '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
