"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  ShieldCheck,
  Package,
  FolderOpen,
  LineChart,
  Users,
  FileText,
  Settings,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Authentication", href: "/admin/authentication", icon: ShieldCheck },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "System Logs", href: "/admin/logs", icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col justify-between border-r border-neutral-800 bg-neutral-950 py-6">
      <div>
        <div className="px-6 pb-6 text-xs font-medium tracking-wide text-neutral-500">
          Admin Terminal
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + "/")

            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100",
                ].join(" ")}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-3">
        <button className="mb-2 w-full rounded-md bg-white py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
          REVIEW PENDING
        </button>
        <Link
          href="/admin/settings"
          className={[
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/admin/settings"
              ? "bg-blue-600 text-white"
              : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100",
          ].join(" ")}
        >
          <Settings className="size-4" aria-hidden />
          Settings
        </Link>
      </div>
    </aside>
  )
}