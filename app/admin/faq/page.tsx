'use client'
import { useEffect, useState } from 'react'

type FaqItem = { id: string; question: string; answer: string | null; published: boolean; source: string; order: number }

export default function FaqAdmin() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const load = () => fetch('/api/admin/faq').then(r => r.json()).then((data: FaqItem[]) => {
    setItems(data)
    const ans: Record<string, string> = {}
    data.forEach(i => { if (i.answer) ans[i.id] = i.answer })
    setAnswers(ans)
  })
  useEffect(() => { load() }, [])

  const addItem = async () => {
    if (!newQ.trim()) return
    await fetch('/api/admin/faq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: newQ, answer: newA || null, published: !!newA }) })
    setNewQ(''); setNewA(''); load()
  }

  const publish = async (item: FaqItem) => {
    const answer = answers[item.id] || item.answer || ''
    if (!answer) return alert('Write an answer first')
    await fetch('/api/admin/faq', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, answer, published: true }) })
    load()
  }

  const unpublish = async (id: string) => {
    await fetch('/api/admin/faq', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: false }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return
    await fetch('/api/admin/faq', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const adminItems = items.filter(i => i.source === 'admin')
  const customerItems = items.filter(i => i.source === 'customer')

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: '0 0 24px', fontWeight: 400 }}>FAQ</h1>

      {/* Add new */}
      <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '20px 20px', marginBottom: 26 }}>
        <div style={{ fontSize: 13, color: '#3C3328', marginBottom: 12 }}>Add a FAQ item</div>
        <div className="flex flex-col gap-3">
          <input value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Question" style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
          <textarea value={newA} onChange={e => setNewA(e.target.value)} placeholder="Answer (optional — add later)" rows={2} style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit' }} />
          <button onClick={addItem} style={{ alignSelf: 'flex-start', background: '#473C30', color: '#F4EEE4', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>Add FAQ item</button>
        </div>
      </div>

      {/* Published items */}
      <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 10 }}>Published ({adminItems.filter(i => i.published).length})</div>
      {adminItems.map(item => (
        <div key={item.id} style={{ background: '#FBF7F1', border: `1px solid ${item.published ? 'rgba(71,60,48,.12)' : 'rgba(71,60,48,.06)'}`, borderRadius: 14, padding: '16px 18px', marginBottom: 8 }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 18, color: '#3C3328', flex: 1 }}>{item.question}</div>
            <div className="flex gap-2">
              {item.published ? (
                <button onClick={() => unpublish(item.id)} style={{ fontSize: 11, color: '#9C8B77', background: 'none', border: '1px solid rgba(71,60,48,.2)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Unpublish</button>
              ) : (
                <button onClick={() => publish(item)} style={{ fontSize: 11, color: '#473C30', background: 'none', border: '1px solid #473C30', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Publish</button>
              )}
              <button onClick={() => del(item.id)} style={{ fontSize: 11, color: '#c87a7a', background: 'none', border: '1px solid rgba(200,122,122,.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
          <textarea value={answers[item.id] ?? (item.answer || '')} onChange={e => setAnswers(a => ({ ...a, [item.id]: e.target.value }))} onBlur={async () => { await fetch('/api/admin/faq', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, answer: answers[item.id] }) }) }} placeholder="Answer…" rows={2} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.1)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit', marginTop: 10 }} />
          <div style={{ display: 'inline-block', marginTop: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: item.published ? '#7AC897' : '#9C8B77' }}>{item.published ? 'Live' : 'Draft'}</div>
        </div>
      ))}

      {/* Customer questions */}
      {customerItems.length > 0 && (
        <>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9C8B77', margin: '24px 0 10px' }}>Customer questions ({customerItems.length})</div>
          {customerItems.map(item => (
            <div key={item.id} style={{ background: '#FBF7F1', border: '2px solid #E7DBC9', borderRadius: 14, padding: '16px 18px', marginBottom: 8 }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 18, color: '#3C3328', flex: 1 }}>{item.question}</div>
                <div className="flex gap-2">
                  <button onClick={() => publish(item)} style={{ fontSize: 11, color: '#473C30', background: 'none', border: '1px solid #473C30', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Answer & publish</button>
                  <button onClick={() => del(item.id)} style={{ fontSize: 11, color: '#c87a7a', background: 'none', border: '1px solid rgba(200,122,122,.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Dismiss</button>
                </div>
              </div>
              <textarea value={answers[item.id] || ''} onChange={e => setAnswers(a => ({ ...a, [item.id]: e.target.value }))} placeholder="Write your answer here…" rows={2} style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.1)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#3C3328', resize: 'vertical', fontFamily: 'inherit', marginTop: 10 }} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
