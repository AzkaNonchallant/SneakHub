import { AdminSidebar } from "@/components/admin-sidebar"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-neutral-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}