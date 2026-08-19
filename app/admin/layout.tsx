"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AdminSidebar } from "@/components/admin-sidebar"
import { BrandLoading } from "@/components/brand-loading"
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

  if (isLoading || !isAdminRole(me?.peran)) return <BrandLoading />

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto overflow-x-clip pb-20 md:pb-0">{children}</main>
      </div>
    </div>
  )
}
