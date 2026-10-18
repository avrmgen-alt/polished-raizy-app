'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TrialBanner({ slug, trialEndsAt }: { slug: string; trialEndsAt: string | null }) {
  const [loading, setLoading] = useState(false)

  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
    : 14

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch(`/${slug}/api/subscribe`, { method: 'POST' })
      const data = await res.json()
      if (data.successUrl) window.location.href = data.successUrl
      else if (data.checkoutUrl) window.location.href = data.checkoutUrl
    } catch {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#473C30', color: '#F4EEE4', padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      fontSize: 14, zIndex: 100, position: 'relative',
    }}>
      <span>
        ⏳ Your free trial ends in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>.
        Add a payment method to keep your booking page live.
      </span>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          background: '#A8927C', color: '#fff', border: 'none', borderRadius: 999,
          padding: '6px 18px', fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 600, opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Redirecting…' : 'Subscribe — $29/mo →'}
      </button>
    </div>
  )
}
