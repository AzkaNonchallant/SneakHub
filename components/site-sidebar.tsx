"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  BarChart3,
  Settings,
  Store,
  Languages,
  LogOut,
} from "lucide-react";

import { setToken } from "@/lib/api";
import { useLang, useT } from "@/lib/i18n";

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname?.startsWith(href + "/");

export function SiteSidebar() {
  const pathname = usePathname() ?? "";
  const t = useT();
  const { lang, toggleLang } = useLang();
  const router = useRouter();
  const qc = useQueryClient();
  const navItems = [
    { label: t("Dashboard"), href: "/dashboard", icon: LayoutGrid },
    { label: t("Store Profile"), href: "/seller-profile", icon: Store },
    { label: t("Inventory"), href: "/inventory", icon: Package },
    { label: t("Analytics"), href: "/analytics", icon: BarChart3 },
    { label: t("Settings"), href: "/settings", icon: Settings },
  ];

  const signOut = () => {
    qc.clear();
    setToken(null);
    router.push("/login");
  };

  return (
    <>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant bg-background px-4 md:hidden">
        <div className="font-heading text-xl leading-6 font-black tracking-tighter text-primary uppercase">
          {t("SELLER HUB")}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            aria-label={t("Storefront")}
            title={t("Storefront")}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
          >
            <Store className="size-3.5" />
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("Language")}
            title={t("Language")}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            <Languages className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={signOut}
            aria-label={t("Sign Out")}
            title={t("Sign Out")}
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-error"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>


      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 bg-surface-container-lowest md:hidden">
        {navItems.map(({ label, href, icon: Icon }) => (
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
            {label === t("Price Predictor") ? t("Predictor") : label}
          </Link>
        ))}
      </nav>

      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 md:flex">

        <div className="mb-6 px-2">
          <div className="font-heading text-lg leading-6 font-black tracking-tighter text-primary uppercase">
            {t("SELLER HUB")}
          </div>
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {t("PRO STATUS")}
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
            <span>{t("Sign Out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
