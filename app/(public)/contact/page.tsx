import ContactClient from '@/components/ContactClient'
import { getSettings } from '@/lib/settings'

export default async function ContactPage() {
  const s = await getSettings(['studioLocation', 'studioPhone', 'studioIg', 'studioHours'])
  return <ContactClient studio={s} />
}
