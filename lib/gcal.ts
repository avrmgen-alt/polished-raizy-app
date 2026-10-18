import { google } from 'googleapis'
import { getSettings, setSetting } from './settings'

export async function createCalendarEvent(salonId: string, booking: {
  name: string; email: string; serviceName: string; addons: string; date: string; time: string; notes?: string | null
}) {
  const s = await getSettings(salonId, ['gcalClientId', 'gcalClientSecret', 'gcalAccessToken', 'gcalRefreshToken', 'gcalCalendarId'])
  if (!s.gcalClientId || !s.gcalAccessToken) return

  const oauth2 = new google.auth.OAuth2(s.gcalClientId, s.gcalClientSecret)
  oauth2.setCredentials({ access_token: s.gcalAccessToken, refresh_token: s.gcalRefreshToken })

  oauth2.on('tokens', async (tokens) => {
    if (tokens.access_token) await setSetting(salonId, 'gcalAccessToken', tokens.access_token)
    if (tokens.refresh_token) await setSetting(salonId, 'gcalRefreshToken', tokens.refresh_token)
  })

  const calendar = google.calendar({ version: 'v3', auth: oauth2 })

  const [datePart] = [booking.date]
  const startDt = parseDateTime(datePart, booking.time)
  const endDt = new Date(startDt.getTime() + 90 * 60 * 1000)

  const addons = (() => { try { return JSON.parse(booking.addons) } catch { return [] } })()

  await calendar.events.insert({
    calendarId: s.gcalCalendarId || 'primary',
    requestBody: {
      summary: `${booking.name} — ${booking.serviceName}`,
      description: [
        `Client: ${booking.name}`,
        `Email: ${booking.email}`,
        `Service: ${booking.serviceName}`,
        addons.length > 0 ? `Add-ons: ${addons.join(', ')}` : '',
        booking.notes ? `Notes: ${booking.notes}` : '',
      ].filter(Boolean).join('\n'),
      start: { dateTime: startDt.toISOString() },
      end: { dateTime: endDt.toISOString() },
    },
  })
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return new Date(dateStr)
  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const period = match[3].toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return new Date(year, month - 1, day, hours, minutes)
}
