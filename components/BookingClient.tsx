'use client'
import { useState } from 'react'

type Service = { id: string; name: string; blurb: string; price: number }

const SLOTS = ['9:30 AM', '11:00 AM', '12:30 PM', '2:00 PM', '3:30 PM', '5:00 PM']
const fmt = (c: number) => `$${(c / 100).toFixed(0)}`

function getDays() {
  const days = []
  const today = new Date()
  for (let i = 1; i <= 21; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

export default function BookingClient({
  services, addons, depositCents, stripePk
}: {
  services: Service[]; addons: Service[]; depositCents: number; stripePk: string
}) {
  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState(services[0]?.id || '')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const service = services.find(s => s.id === serviceId)
  const addonTotal = addons.filter(a => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0)
  const total = (service?.price || 0) + addonTotal
  const days = getDays()

  const keyOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const toggleAddon = (id: string) =>
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const submit = async () => {
    if (!name || !email || !date || !time || !service) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          addons: addons.filter(a => selectedAddons.includes(a.id)).map(a => a.name),
          date: keyOf(date),
          time,
          name, phone, email, notes,
          depositCents,
        }),
      })
      if (!res.ok) throw new Error('Booking failed')
      setDone(true)
      setStep(4)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  const stepDot = (n: number) => ({
    bg: step >= n ? '#473C30' : '#FBF7F1',
    fg: step >= n ? '#F4EEE4' : '#9C8B77',
    border: step >= n ? '#473C30' : 'rgba(71,60,48,.2)',
  })

  return (
    <section className="max-w-[920px] mx-auto px-5 sm:px-7 py-16">
      <div className="text-center mb-10">
        <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8927C' }}>Reserve</span>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 'clamp(34px,5vw,54px)', color: '#3C3328', margin: '10px 0 0' }}>Book your appointment</h1>
      </div>

      {step < 4 && (
        <div className="flex items-center justify-center gap-0 mb-10">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex items-center">
              <div style={{ width: 30, height: 30, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: stepDot(n).bg, color: stepDot(n).fg, border: `1px solid ${stepDot(n).border}` }}>{n}</div>
              {i < 2 && <div style={{ width: 52, height: 1, background: 'rgba(71,60,48,.2)' }} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '30px 28px' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 5 }}>Choose your service</div>
          <div style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', marginBottom: 18 }}>Every appointment begins with a certified Russian manicure.</div>
          {services.map(s => (
            <div key={s.id} onClick={() => setServiceId(s.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', borderRadius: 12, border: `1px solid ${serviceId === s.id ? '#473C30' : 'rgba(71,60,48,.12)'}`, background: serviceId === s.id ? 'rgba(71,60,48,.04)' : '#FBF7F1', marginBottom: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 20, color: '#3C3328' }}>{s.name}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A8927C', marginTop: 2 }}>{s.blurb}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, color: '#3C3328' }}>{fmt(s.price)}</div>
            </div>
          ))}
          {addons.length > 0 && (
            <>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9C8B77', margin: '20px 0 12px' }}>Add designs &amp; extras</div>
              {addons.map(a => {
                const on = selectedAddons.includes(a.id)
                return (
                  <div key={a.id} onClick={() => toggleAddon(a.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, border: `1px solid ${on ? '#473C30' : 'rgba(71,60,48,.12)'}`, background: on ? 'rgba(71,60,48,.04)' : '#FBF7F1', marginBottom: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${on ? '#473C30' : '#9C8B77'}`, background: on ? '#473C30' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4EEE4', fontSize: 12, flexShrink: 0 }}>{on ? '✓' : ''}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 17, color: '#3C3328' }}>{a.name}</div>
                      <div style={{ fontWeight: 300, fontSize: 12, color: '#6E6253' }}>{a.blurb}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#A8927C' }}>{fmt(a.price)}</div>
                  </div>
                )
              })}
            </>
          )}
          <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: '1px solid rgba(71,60,48,.12)', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontWeight: 300, color: '#6E6253', fontSize: 14 }}>Estimated total <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#3C3328', marginLeft: 8 }}>{fmt(total)}</span></div>
            <button onClick={() => setStep(2)} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 28px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '30px 28px' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 5 }}>Pick a date</div>
          <div style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', marginBottom: 18 }}>Request any open day in the next three weeks.</div>
          <div className="grid grid-cols-7 gap-2 mb-7">
            {days.map(d => {
              const sel = date && keyOf(date) === keyOf(d)
              return (
                <div key={keyOf(d)} onClick={() => setDate(d)} style={{ cursor: 'pointer', textAlign: 'center', padding: '9px 2px', borderRadius: 10, border: `1px solid ${sel ? '#473C30' : 'rgba(71,60,48,.12)'}`, background: sel ? '#473C30' : '#FBF7F1' }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: sel ? '#D8CBB9' : '#9C8B77' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: sel ? '#F4EEE4' : '#3C3328', lineHeight: 1.2 }}>{d.getDate()}</div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', color: sel ? '#D8CBB9' : '#9C8B77' }}>{d.toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
              )
            })}
          </div>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 14 }}>Pick a time</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SLOTS.map(t => {
              const sel = time === t
              return (
                <div key={t} onClick={() => setTime(t)} style={{ cursor: 'pointer', textAlign: 'center', padding: '13px', borderRadius: 10, border: `1px solid ${sel ? '#473C30' : 'rgba(71,60,48,.12)'}`, background: sel ? '#473C30' : '#FBF7F1', color: sel ? '#F4EEE4' : '#3C3328', fontSize: 14 }}>{t}</div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-8" style={{ flexWrap: 'wrap', gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6253', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            <button onClick={() => { if (date && time) setStep(3) }} style={{ background: date && time ? '#473C30' : '#9C8B77', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 28px', borderRadius: 999, border: 'none', cursor: date && time ? 'pointer' : 'not-allowed' }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_.85fr] gap-4">
          <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '28px 26px' }}>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, color: '#3C3328', marginBottom: 16 }}>Your details</div>
            <div className="flex flex-col gap-3">
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Full name</div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Phone</div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(732) 000-0000" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Email</div>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Notes (optional)</div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Inspo, shape, length…" rows={2} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(71,60,48,.12)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>Deposit</div>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', background: '#A8927C', padding: '3px 8px', borderRadius: 999 }}>Secured by Stripe</div>
              </div>
              <div style={{ background: '#E7DBC9', border: '1px solid rgba(71,60,48,.12)', borderRadius: 10, padding: '14px 16px', marginBottom: 8 }}>
                {stripePk ? (
                  <div style={{ fontSize: 14, color: '#6E6253', fontWeight: 300 }}>Stripe payment will be processed at confirmation. A {fmt(depositCents)} deposit holds your slot.</div>
                ) : (
                  <div style={{ fontSize: 14, color: '#9C8B77', fontWeight: 300 }}>Stripe is not yet configured. Your booking request will be confirmed manually.</div>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 300, color: '#9C8B77' }}>A {fmt(depositCents)} deposit confirms your slot &amp; is applied to your service.</div>
            </div>
            {error && <div style={{ color: '#c0392b', fontSize: 13, marginTop: 10 }}>{error}</div>}
            <div className="flex items-center justify-between mt-6" style={{ flexWrap: 'wrap', gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6253', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
              <button onClick={submit} disabled={submitting || !name || !email} style={{ background: submitting || !name || !email ? '#9C8B77' : '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '14px 26px', borderRadius: 999, border: 'none', cursor: submitting || !name || !email ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Sending…' : `Pay ${fmt(depositCents)} & request`}
              </button>
            </div>
          </div>
          <div style={{ background: '#473C30', borderRadius: 20, padding: '28px 24px', alignSelf: 'start' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 18 }}>Summary</div>
            <div className="flex flex-col gap-3" style={{ color: '#D8CBB9', fontWeight: 300, fontSize: 14 }}>
              <div className="flex justify-between gap-3"><span style={{ color: '#9C8B77' }}>Service</span><span style={{ color: '#F4EEE4', textAlign: 'right' }}>{service?.name}</span></div>
              <div className="flex justify-between gap-3"><span style={{ color: '#9C8B77' }}>Add-ons</span><span style={{ color: '#F4EEE4', textAlign: 'right' }}>{selectedAddons.length === 0 ? '—' : addons.filter(a => selectedAddons.includes(a.id)).map(a => a.name).join(', ')}</span></div>
              <div className="flex justify-between gap-3"><span style={{ color: '#9C8B77' }}>Date</span><span style={{ color: '#F4EEE4' }}>{date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '—'}</span></div>
              <div className="flex justify-between gap-3"><span style={{ color: '#9C8B77' }}>Time</span><span style={{ color: '#F4EEE4' }}>{time || '—'}</span></div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.12)', margin: '4px 0' }} />
              <div className="flex justify-between"><span style={{ color: '#9C8B77' }}>Service total</span><span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, color: '#F4EEE4' }}>{fmt(total)}</span></div>
              <div className="flex justify-between items-baseline"><span style={{ color: '#F4EEE4' }}>Due now</span><span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, color: '#F4EEE4' }}>{fmt(depositCents)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && done && (
        <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 20, padding: '50px 36px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, background: '#A8927C', color: '#F4EEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 400, fontSize: 34, color: '#3C3328', margin: '0 0 10px' }}>Request received</h2>
          <p style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: '#6E6253', maxWidth: 420, margin: '0 auto 24px' }}>
            Thank you, {name}. Your appointment request for {service?.name} on {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {time} has been received. Raizy will confirm shortly — your deposit holds the slot.
          </p>
          <div className="inline-flex gap-3 flex-wrap justify-center">
            <button onClick={() => { setStep(1); setDone(false); setName(''); setEmail(''); setPhone(''); setNotes(''); setDate(null); setTime(null); setSelectedAddons([]) }} style={{ border: '1px solid rgba(71,60,48,.3)', color: '#473C30', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 24px', borderRadius: 999, background: 'none', cursor: 'pointer' }}>Book another</button>
            <a href="/" style={{ display: 'inline-block', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>Back home</a>
          </div>
        </div>
      )}
    </section>
  )
}
