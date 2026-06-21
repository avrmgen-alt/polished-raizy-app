'use client'
import { useEffect, useState, useRef } from 'react'
type Photo = { id: string; url: string; caption: string; order: number }

export default function GalleryAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch('/api/admin/gallery').then(r => r.json()).then(setPhotos)
  useEffect(() => { load() }, [])

  const upload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    // Upload to /api/admin/upload which stores locally or to uploadthing
    const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (uploadRes.ok) {
      const { url } = await uploadRes.json()
      await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, caption }) })
      setCaption('')
      load()
    }
    setUploading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: '0 0 24px', fontWeight: 400 }}>Gallery</h1>
      <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '22px 20px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#3C3328', marginBottom: 12, fontWeight: 400 }}>Upload a photo</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption (optional)" style={{ flex: 1, background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '11px 22px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : 'Choose photo'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map(p => (
          <div key={p.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/5', background: '#E7DBC9' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,51,40,.0)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12 }}>
              <div style={{ background: 'rgba(60,51,40,.7)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 13, color: '#FBF7F1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.caption || '(no caption)'}</span>
                <button onClick={() => del(p.id)} style={{ background: 'rgba(200,122,122,.8)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {photos.length === 0 && <div style={{ gridColumn: '1/-1', color: '#9C8B77', fontWeight: 300 }}>No photos yet. Upload one above.</div>}
      </div>
    </div>
  )
}
