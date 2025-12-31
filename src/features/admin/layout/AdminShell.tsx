import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--header-height': '3rem',
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
