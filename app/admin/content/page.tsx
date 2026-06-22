'use client'
import { useEffect, useState, useRef } from 'react'

const FIELDS = [
  { key: 'heroLine1', label: 'Hero — line 1', hint: 'e.g. The art of the' },
  { key: 'heroLine2', label: 'Hero — line 2 (italic)', hint: 'e.g. Russian manicure' },
  { key: 'heroCopy', label: 'Hero — body copy', multiline: true },
  { key: 'heroImage', label: 'Hero — photo', image: true },
  { key: 'aboutCopy1', label: 'About — paragraph 1', multiline: true },
  { key: 'aboutCopy2', label: 'About — paragraph 2', multiline: true },
  { key: 'studioLocation', label: 'Studio location', hint: 'e.g. Toms River, NJ' },
  { key: 'studioPhone', label: 'Phone number' },
  { key: 'studioIg', label: 'Instagram handle', hint: 'e.g. @polishedbyraizy' },
  { key: 'studioHours', label: 'Hours', hint: 'e.g. By appointment' },
]

export default function ContentAdmin() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetch('/api/admin/content').then(r => r.json()).then(data => { setValues(data); setLoading(false) }) }, [])

  const save = async () => {
    await fetch('/api/admin/content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const uploadHeroImage = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setValues(v => ({ ...v, heroImage: url }))
    }
    setUploading(false)
  }

  if (loading) return <div style={{ color: '#9C8B77' }}>Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: 0, fontWeight: 400 }}>Content</h1>
        <button onClick={save} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
      <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '22px 20px' }}>
        <div className="flex flex-col gap-5">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9C8B77', display: 'block', marginBottom: 6 }}>{f.label}</label>
              {f.image ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={values.heroImage || '/images/hero.jpeg'} alt="Hero" style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8, background: '#E7DBC9', flexShrink: 0 }} />
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadHeroImage(f) }} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '9px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
                      {uploading ? 'Uploading…' : 'Change photo'}
                    </button>
                    <div style={{ fontSize: 12, color: '#9C8B77', marginTop: 6, fontWeight: 300 }}>Portrait orientation works best</div>
                  </div>
                </div>
              ) : f.multiline ? (
                <textarea value={values[f.key] || ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} rows={3} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit' }} />
              ) : (
                <input value={values[f.key] || ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.hint || ''} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#3C3328' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
