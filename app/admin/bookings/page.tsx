'use client'
import { useEffect, useState } from 'react'

type Booking = { id: string; name: string; email: string; phone: string; serviceName: string; addons: string; date: string; time: string; depositPaid: number; status: string; notes?: string; createdAt: string }

const STATUS_COLORS: Record<string, string> = { pending: '#E7C87A', confirmed: '#7AC897', cancelled: '#C87A7A' }
const fmt = (c: number) => `$${(c / 100).toFixed(0)}`

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => fetch('/api/admin/bookings').then(r => r.json()).then(setBookings).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const setStatus = async (id: string, status: string) => {
    await fetch('/api/admin/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    load()
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: '0 0 24px', fontWeight: 400 }}>Bookings</h1>
      {loading ? <div style={{ color: '#9C8B77' }}>Loading…</div> : bookings.length === 0 ? (
        <div style={{ color: '#9C8B77', fontWeight: 300 }}>No bookings yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map(b => {
            const addons = JSON.parse(b.addons || '[]')
            return (
              <div key={b.id} style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '20px 22px' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328', marginBottom: 2 }}>{b.name}</div>
                    <div style={{ fontSize: 13, color: '#6E6253', fontWeight: 300 }}>{b.email} {b.phone && `· ${b.phone}`}</div>
                  </div>
                  <span style={{ background: STATUS_COLORS[b.status] || '#ccc', color: '#3C3328', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999 }}>{b.status}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4" style={{ fontSize: 13, color: '#6E6253', fontWeight: 300 }}>
                  <div><div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 2 }}>Service</div>{b.serviceName}</div>
                  <div><div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 2 }}>Date & Time</div>{b.date} · {b.time}</div>
                  <div><div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 2 }}>Deposit</div>{fmt(b.depositPaid)}</div>
                  {addons.length > 0 && <div><div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 2 }}>Add-ons</div>{addons.join(', ')}</div>}
                </div>
                {b.notes && <div style={{ marginTop: 10, fontSize: 13, color: '#6E6253', fontWeight: 300 }}><span style={{ color: '#9C8B77' }}>Notes: </span>{b.notes}</div>}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['pending', 'confirmed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setStatus(b.id, s)} style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 999, border: `1px solid ${b.status === s ? '#473C30' : 'rgba(71,60,48,.2)'}`, background: b.status === s ? '#473C30' : 'transparent', color: b.status === s ? '#F4EEE4' : '#6E6253', cursor: 'pointer' }}>{s}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
