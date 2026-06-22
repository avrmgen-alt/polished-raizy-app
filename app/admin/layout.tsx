import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F0EA' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }} className="ml-0 sm:ml-56 pt-16 sm:pt-0 px-4 sm:px-7 py-4 sm:py-8">
        {children}
      </main>
    </div>
  )
}
