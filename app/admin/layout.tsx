"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AdminSidebar } from "@/components/admin-sidebar"
import { SiteHeader } from "@/components/site-header"
import { isAdminRole } from "@/lib/api"
import { useMe } from "@/lib/hooks"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: me, isLoading } = useMe()

  // ponytail: guard client-side, pola sama dengan layout (dashboard) seller
  useEffect(() => {
    if (!isLoading && !isAdminRole(me?.peran)) router.replace("/home")
  }, [isLoading, me?.peran, router])

  if (isLoading || !isAdminRole(me?.peran)) return null

  return (
    <div className="flex h-screen bg-surface-container-low">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
