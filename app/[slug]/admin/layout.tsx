import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminSidebar from '@/components/AdminSidebar'
import TrialBanner from '@/components/TrialBanner'
import { verifyOwnerToken } from '@/lib/auth'
import { getSalonBySlug } from '@/lib/tenant'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const salon = await getSalonBySlug(slug)
  if (!salon) notFound()

  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null

  if (!owner || owner.slug !== slug) {
    redirect(`/${slug}/admin/login`)
  }

  const showBanner = salon.subscriptionStatus === 'trialing' && !!process.env.STRIPE_PRICE_ID

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F0EA' }}>
      {showBanner && <TrialBanner slug={slug} trialEndsAt={salon.trialEndsAt?.toISOString() ?? null} />}
      <div style={{ flex: 1, display: 'flex' }}>
        <AdminSidebar slug={slug} />
        <main style={{ flex: 1, overflowY: 'auto' }} className="ml-0 sm:ml-56 pt-16 sm:pt-0 px-4 sm:px-7 py-4 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
