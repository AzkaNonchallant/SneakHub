"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  LineChart,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Price Predictor", href: "/price-predictor", icon: LineChart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 px-4 py-6">
      {/* Brand */}
      <div className="mb-6 px-2">
        <div className="text-sm font-extrabold tracking-tight text-neutral-900">
          SELLER HUB
        </div>
        <div className="text-[10px] font-semibold tracking-wide text-neutral-400">
          PRO STATUS
        </div>
      </div>

      

      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className="tracking-wide">{label.toUpperCase()}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}