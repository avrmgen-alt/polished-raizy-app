'use client'
import { useEffect, useState } from 'react'

type Message = { id: string; name: string; email: string; phone?: string; message: string; read: boolean; createdAt: string }

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([])
  const load = () => fetch('/api/admin/messages').then(r => r.json()).then(setMessages)
  useEffect(() => { load() }, [])

  const markRead = async (id: string, read: boolean) => {
    await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read }) })
    load()
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: '0 0 6px', fontWeight: 400 }}>Messages</h1>
      {unread > 0 && <div style={{ fontSize: 13, color: '#A8927C', marginBottom: 20 }}>{unread} unread message{unread !== 1 ? 's' : ''}</div>}
      {messages.length === 0 ? <div style={{ color: '#9C8B77', fontWeight: 300 }}>No messages yet.</div> : (
        <div className="flex flex-col gap-3">
          {messages.map(m => (
            <div key={m.id} style={{ background: m.read ? '#FBF7F1' : '#FFF8F0', border: `1px solid ${m.read ? 'rgba(71,60,48,.1)' : 'rgba(168,146,124,.3)'}`, borderRadius: 14, padding: '18px 20px' }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, color: '#3C3328' }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: '#6E6253', fontWeight: 300, marginTop: 2 }}>{m.email}{m.phone && ` · ${m.phone}`}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 11, color: '#9C8B77' }}>{new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button onClick={() => markRead(m.id, !m.read)} style={{ fontSize: 11, color: m.read ? '#9C8B77' : '#473C30', background: 'none', border: `1px solid ${m.read ? 'rgba(71,60,48,.2)' : '#473C30'}`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </div>
              <p style={{ fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: '#6E6253', margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
