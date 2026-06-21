import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings(['studioLocation', 'studioPhone', 'studioIg', 'studioHours'])
  return (
    <>
      <div style={{ background: '#473C30', color: '#EFE6D9', textAlign: 'center', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '9px 16px', fontWeight: 300 }}>
        By appointment only &nbsp;·&nbsp; Certified Russian Manicures &nbsp;·&nbsp; Toms River, NJ
      </div>
      <Nav />
      <main>{children}</main>
      <Footer location={s.studioLocation} phone={s.studioPhone} ig={s.studioIg} hours={s.studioHours} />
    </>
  )
}
