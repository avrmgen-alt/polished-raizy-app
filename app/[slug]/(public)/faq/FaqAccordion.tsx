'use client'
import { useState } from 'react'
import Link from 'next/link'

type FaqItem = { id: string; question: string; answer: string | null }

export default function FaqAccordion({ items, slug }: { items: FaqItem[]; slug: string }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <>
      <div className="grid gap-3 mb-16">
        {items.map(f => (
          <div key={f.id} style={{ background: '#FBF7F1', borderRadius: 14, overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === f.id ? null : f.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#3C3328' }}>{f.question}</span>
              <span style={{ fontSize: 20, color: '#A8927C', flexShrink: 0 }}>{open === f.id ? '−' : '+'}</span>
            </button>
            {open === f.id && (
              <div style={{ padding: '0 24px 20px', fontSize: 15, color: '#6E6253', lineHeight: 1.7 }}>{f.answer ?? ''}</div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link href={`/${slug}/contact`} style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#473C30', paddingBottom: 4, borderBottom: '1px solid #A8927C', textDecoration: 'none' }}>
          Still have questions? Contact us →
        </Link>
      </div>
    </>
  )
}
