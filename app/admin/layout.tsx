import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F0EA' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }} className="ml-0 sm:ml-56">
        {children}
      </main>
    </div>
  )
}
