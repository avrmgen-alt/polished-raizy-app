'use client'
import { useEffect, useState } from 'react'

type Service = { id: string; name: string; blurb: string; description: string; price: number; isAddon: boolean; order: number }

const fmt = (c: number) => (c / 100).toFixed(2)
const parseDollars = (s: string) => Math.round(parseFloat(s) * 100)

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', blurb: '', description: '', price: '', isAddon: false })

  const load = () => fetch('/api/admin/services').then(r => r.json()).then(setServices)
  useEffect(() => { load() }, [])

  const save = async () => {
    const data = { ...form, price: parseDollars(form.price) }
    if (editing) {
      await fetch('/api/admin/services', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...data }) })
    } else {
      await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    }
    setEditing(null); setAdding(false); setForm({ name: '', blurb: '', description: '', price: '', isAddon: false }); load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await fetch('/api/admin/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const startEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, blurb: s.blurb, description: s.description, price: fmt(s.price), isAddon: s.isAddon }); setAdding(true) }

  const mainServices = services.filter(s => !s.isAddon)
  const addonServices = services.filter(s => s.isAddon)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: 0, fontWeight: 400 }}>Services & Pricing</h1>
        {!adding && <button onClick={() => setAdding(true)} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>+ Add service</button>}
      </div>

      {adding && (
        <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '22px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, color: '#3C3328', marginBottom: 14 }}>{editing ? 'Edit service' : 'New service'}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
            <input placeholder="Blurb (e.g. Soft or hard gel)" value={form.blurb} onChange={e => setForm(f => ({ ...f, blurb: e.target.value }))} style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
            <input placeholder="Price in dollars (e.g. 55.00)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
            <label className="flex items-center gap-2" style={{ fontSize: 14, color: '#6E6253', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isAddon} onChange={e => setForm(f => ({ ...f, isAddon: e.target.checked }))} />
              This is an add-on
            </label>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit', marginTop: 10 }} />
          <div className="flex gap-3 mt-3">
            <button onClick={save} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Save</button>
            <button onClick={() => { setAdding(false); setEditing(null); setForm({ name: '', blurb: '', description: '', price: '', isAddon: false }) }} style={{ background: 'none', border: '1px solid rgba(71,60,48,.2)', color: '#6E6253', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 999, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {[{ title: 'Services', items: mainServices }, { title: 'Add-ons', items: addonServices }].map(group => (
        group.items.length > 0 && (
          <div key={group.title} className="mb-6">
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 10 }}>{group.title}</div>
            {group.items.map(s => (
              <div key={s.id} style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 14, padding: '16px 18px', marginBottom: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 19, color: '#3C3328' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#9C8B77', marginTop: 2 }}>{s.blurb}</div>
                  <div style={{ fontSize: 13, color: '#6E6253', fontWeight: 300, marginTop: 4 }}>{s.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#3C3328' }}>${fmt(s.price)}</div>
                  <button onClick={() => startEdit(s)} style={{ fontSize: 11, color: '#6E6253', background: 'none', border: '1px solid rgba(71,60,48,.2)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => del(s.id)} style={{ fontSize: 11, color: '#c87a7a', background: 'none', border: '1px solid rgba(200,122,122,.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  )
}
