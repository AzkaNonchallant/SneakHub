"use client"

import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FolderOpen,
  Languages,
  LayoutGrid,
  LineChart,
  LogOut,
  Package,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"

import { setToken } from "@/lib/api"
import { useLang, useT } from "@/lib/i18n"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Authentication", href: "/admin/authentication", icon: ShieldCheck },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Sellers", href: "/admin/sellers", icon: Store },
]

const tabItems = navItems.filter(({ href }) => href !== "/admin/authentication")

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/")

export function AdminSidebar() {
  const t = useT()
  const { lang, toggleLang } = useLang()
  const pathname = usePathname() ?? ""
  const router = useRouter()
  const qc = useQueryClient()

  const signOut = () => {
    qc.clear()
    setToken(null)
    router.push("/login")
  }

  return (
    <>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant bg-background px-4 md:hidden">
        <div className="font-heading text-xl leading-6 font-black tracking-tighter text-primary uppercase">
          ADMIN HUB
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            <Languages className="size-3.5" /> {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-error"
          >
            <LogOut className="size-3.5" /> Sign Out
          </button>
        </div>
      </div>


      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 bg-surface-container-lowest md:hidden">
        {tabItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={[
              "flex flex-col items-center gap-1 border-t-2 pt-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] text-[10px] leading-4 font-bold tracking-[0.05em] uppercase transition-colors",
              isActive(pathname, href)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary",
            ].join(" ")}
          >
            <Icon className="size-5" />
            {t(label === "User Management" ? "Users" : label)}
          </Link>
        ))}
      </nav>

      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 md:flex">

        <div className="mb-6 px-2">
          <div className="font-heading text-lg leading-6 font-black tracking-tighter text-primary uppercase">
            ADMIN HUB
          </div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            TERMINAL
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 text-xs leading-4 font-bold tracking-[0.05em] uppercase",
                isActive(pathname, href)
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-surface-container hover:text-primary",
              ].join(" ")}
            >
              <Icon className="size-4" />
              <span>{t(label)}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
          <button
            type="button"
            onClick={toggleLang}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:bg-surface-container hover:text-primary"
          >
            <Languages className="size-4" />
            <span>{lang === "id" ? "EN" : "ID"}</span>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:bg-surface-container hover:text-error"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
