'use client'
import { useEffect, useState } from 'react'

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Record<string, string>>({})

  useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(setSettings) }, [])

  const msg = (key: string, text: string) => { setMsgs(m => ({ ...m, [key]: text })); setTimeout(() => setMsgs(m => ({ ...m, [key]: '' })), 2500) }

  const save = async (key: string, data: Record<string, string>) => {
    setSaving(key)
    await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(null)
    msg(key, '✓ Saved')
  }

  const changePassword = async () => {
    if (newPassword !== confirmPassword) { msg('password', 'Passwords do not match'); return }
    if (newPassword.length < 6) { msg('password', 'Password must be at least 6 characters'); return }
    await save('password', { newPassword })
    setNewPassword(''); setConfirmPassword('')
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: '#FBF7F1', border: '1px solid rgba(71,60,48,.12)', borderRadius: 16, padding: '22px 20px', marginBottom: 16 }}>
      <div style={{ fontSize: 15, color: '#3C3328', marginBottom: 14, fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 32, color: '#3C3328', margin: '0 0 24px', fontWeight: 400 }}>Settings</h1>

      <Section title="Booking deposit">
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Deposit amount (in cents — e.g. 1000 = $10)</div>
            <input value={settings.depositAmount || '1000'} onChange={e => setSettings(s => ({ ...s, depositAmount: e.target.value }))} style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', width: 200 }} />
          </div>
          <button onClick={() => save('deposit', { depositAmount: settings.depositAmount })} style={{ marginTop: 24, background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '11px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
            {saving === 'deposit' ? 'Saving…' : 'Save'}
          </button>
          {msgs.deposit && <div style={{ marginTop: 28, fontSize: 12, color: '#7AC897' }}>{msgs.deposit}</div>}
        </div>
        <div style={{ fontSize: 12, color: '#9C8B77', marginTop: 8, fontWeight: 300 }}>Current deposit: ${((parseInt(settings.depositAmount || '1000')) / 100).toFixed(0)}</div>
      </Section>

      <Section title="Stripe">
        <div className="flex flex-col gap-3">
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Publishable key (pk_live_… or pk_test_…)</div>
            <input value={settings.stripePublishableKey || ''} onChange={e => setSettings(s => ({ ...s, stripePublishableKey: e.target.value }))} placeholder="pk_live_…" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', fontFamily: 'monospace' }} />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Secret key (sk_live_… or sk_test_…)</div>
            <input type="password" value={settings.stripeSecretKey || ''} onChange={e => setSettings(s => ({ ...s, stripeSecretKey: e.target.value }))} placeholder="sk_live_…" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', fontFamily: 'monospace' }} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => save('stripe', { stripePublishableKey: settings.stripePublishableKey, stripeSecretKey: settings.stripeSecretKey })} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
              {saving === 'stripe' ? 'Saving…' : 'Save Stripe keys'}
            </button>
            {msgs.stripe && <span style={{ fontSize: 12, color: '#7AC897', alignSelf: 'center' }}>{msgs.stripe}</span>}
          </div>
        </div>
      </Section>

      <Section title="Email notifications">
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Send notifications to</div>
            <input type="email" value={settings.notificationEmail || ''} onChange={e => setSettings(s => ({ ...s, notificationEmail: e.target.value }))} placeholder="your@email.com" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Resend API key</div>
            <input type="password" value={settings.resendApiKey || ''} onChange={e => setSettings(s => ({ ...s, resendApiKey: e.target.value }))} placeholder="re_…" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', fontFamily: 'monospace' }} />
          </div>
          <button onClick={() => save('email', { notificationEmail: settings.notificationEmail, resendApiKey: settings.resendApiKey })} style={{ marginTop: 24, background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '11px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
            {saving === 'email' ? 'Saving…' : 'Save'}
          </button>
          {msgs.email && <span style={{ fontSize: 12, color: '#7AC897', alignSelf: 'center', marginTop: 22 }}>{msgs.email}</span>}
        </div>
      </Section>

      <Section title="Google Calendar">
        <p style={{ fontWeight: 300, fontSize: 14, color: '#6E6253', margin: '0 0 14px', lineHeight: 1.7 }}>Connect your Google Calendar so confirmed bookings automatically appear as events. You'll need a Google Cloud project with the Calendar API enabled.</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Google Client ID</div>
              <input value={settings.gcalClientId || ''} onChange={e => setSettings(s => ({ ...s, gcalClientId: e.target.value }))} placeholder="…apps.googleusercontent.com" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 13, color: '#3C3328', fontFamily: 'monospace' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Google Client Secret</div>
              <input type="password" value={settings.gcalClientSecret || ''} onChange={e => setSettings(s => ({ ...s, gcalClientSecret: e.target.value }))} placeholder="GOCSPX-…" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 13, color: '#3C3328', fontFamily: 'monospace' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Calendar ID (usually your email address or a specific calendar ID)</div>
            <input value={settings.gcalCalendarId || ''} onChange={e => setSettings(s => ({ ...s, gcalCalendarId: e.target.value }))} placeholder="primary or your-calendar@group.calendar.google.com" style={{ width: '100%', background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 13, color: '#3C3328' }} />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <button onClick={() => save('gcal', { gcalClientId: settings.gcalClientId, gcalClientSecret: settings.gcalClientSecret, gcalCalendarId: settings.gcalCalendarId })} style={{ background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
              {saving === 'gcal' ? 'Saving…' : 'Save credentials'}
            </button>
            {settings.gcalClientId && settings.gcalClientSecret && (
              <a href="/api/admin/gcal/connect" style={{ display: 'inline-block', background: '#4285F4', color: '#fff', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 18px', borderRadius: 999, textDecoration: 'none' }}>
                Connect Google Calendar
              </a>
            )}
            {settings.gcalAccessToken && <span style={{ fontSize: 12, color: '#7AC897' }}>✓ Google Calendar connected</span>}
            {msgs.gcal && <span style={{ fontSize: 12, color: '#7AC897' }}>{msgs.gcal}</span>}
          </div>
        </div>
      </Section>

      <Section title="Admin password">
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>New password</div>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', width: 200 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9C8B77', marginBottom: 5 }}>Confirm</div>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" style={{ background: '#EFE6D9', border: '1px solid rgba(71,60,48,.14)', borderRadius: 10, padding: '11px 13px', fontSize: 14, color: '#3C3328', width: 200 }} />
          </div>
          <button onClick={changePassword} disabled={!newPassword || saving === 'password'} style={{ marginTop: 24, background: '#473C30', color: '#F4EEE4', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '11px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>
            {saving === 'password' ? 'Saving…' : 'Update password'}
          </button>
          {msgs.password && <div style={{ marginTop: 26, fontSize: 12, color: msgs.password.startsWith('✓') ? '#7AC897' : '#c87a7a' }}>{msgs.password}</div>}
        </div>
      </Section>
    </div>
  )
}
