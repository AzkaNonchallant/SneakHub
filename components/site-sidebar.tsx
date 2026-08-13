"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  LineChart,
  BarChart3,
  Settings,
  Store,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Price Predictor", href: "/price-predictor", icon: LineChart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname?.startsWith(href + "/");

export function SiteSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <>
      {/* Mobile top bar: chips instead of the fixed sidebar */}
      <div className="sticky top-0 z-40 flex flex-col border-b border-outline-variant bg-background md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="font-heading text-xl leading-6 font-black tracking-tighter text-primary uppercase">
            SELLER HUB
          </div>
          <Link
            href="/home"
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
          >
            <Store className="size-3.5" /> Storefront
          </Link>
        </div>
        <nav className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                "shrink-0 border px-3 py-1.5 text-xs leading-4 font-bold tracking-[0.05em] uppercase",
                isActive(pathname, href)
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant text-muted-foreground hover:border-primary hover:text-primary",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 md:flex">
        {/* Brand */}
        <div className="mb-6 px-2">
          <div className="font-heading text-lg leading-6 font-black tracking-tighter text-primary uppercase">
            SELLER HUB
          </div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            PRO STATUS
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
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
