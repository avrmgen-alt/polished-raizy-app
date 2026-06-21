'use client'
import { useState } from 'react'

const aftercare = [
  'Avoid soaking nails for the first 24 hours.',
  'Apply cuticle oil daily to keep nails healthy and flexible.',
  'Wear gloves for cleaning and washing dishes.',
  'Do not pick or peel — return for a fill or removal.',
  'Book your fill appointment 3–4 weeks after your initial set.',
]

export default function FaqClient({ faqs }: { faqs: { id: string; question: string; answer: string | null }[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!question.trim() || !email.trim()) return
    setLoading(true)
    await fetch('/api/faq-question', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, question }) })
    setSent(true)
    setLoading(false)
  }

  return (
    <>
      <section className="max-w-[780px] mx-auto px-5 sm:px-7 pt-6 pb-4">
        {faqs.map(f => (
          <div key={f.id} onClick={() => setOpen(open === f.id ? null : f.id)} style={{ cursor: 'pointer', background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 14, padding: '20px 24px', marginBottom: 10 }}>
            <div className="flex items-center justify-between gap-4">
              <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 20, color: '#3C3328' }}>{f.question}</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#A8927C', lineHeight: 1, flexShrink: 0 }}>{open === f.id ? '−' : '+'}</div>
            </div>
            {open === f.id && <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.75, color: '#6E6253', margin: '12px 0 0' }}>{f.answer}</p>}
          </div>
        ))}
      </section>

      <section className="max-w-[780px] mx-auto px-5 sm:px-7 pb-10">
        <div style={{ background: '#E7DBC9', border: '1px solid rgba(71,60,48,.12)', borderRadius: 18, padding: '30px 32px' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, color: '#3C3328', marginBottom: 16 }}>Caring for your manicure</div>
          {aftercare.map((tip, i) => (
            <div key={i} className="flex gap-3" style={{ padding: '10px 0', borderBottom: i < aftercare.length - 1 ? '1px solid rgba(71,60,48,.1)' : 'none' }}>
              <div style={{ color: '#A8927C', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 18, flexShrink: 0 }}>—</div>
              <div style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: '#6E6253' }}>{tip}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[780px] mx-auto px-5 sm:px-7 pb-20">
        <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 18, padding: '30px 32px' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 6 }}>Have a question?</div>
          <p style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', margin: '0 0 18px' }}>Submit it below and Raizy will answer it here on the FAQ page.</p>
          {sent ? (
            <div className="text-center py-6">
              <div style={{ width: 48, height: 48, borderRadius: 999, background: '#A8927C', color: '#F4EEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 14px' }}>✓</div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#3C3328', marginBottom: 6 }}>Question received</div>
              <p style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', margin: 0 }}>Raizy will answer it and publish it here soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Your question…" rows={3} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit' }} />
              <button onClick={submit} disabled={loading || !question.trim() || !email.trim()} style={{ background: loading ? '#9C8B77' : '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px', borderRadius: 999, border: 'none', cursor: loading || !question.trim() || !email.trim() ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending…' : 'Submit question'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
