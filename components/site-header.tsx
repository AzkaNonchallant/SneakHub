import Link from "next/link"
import { CircleUser, ScanSearch, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

const navLinks = ["Smart Find", "Shop", "Market Insights", "Seller Hub"]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-background">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-8">
          <Link
            href="/home"
            className="font-heading text-5xl leading-[48px] font-black tracking-tighter text-primary"
          >
            SNEAKHUB
          </Link>
          {/* ponytail: decorative search, wired up when there's a search API */}
          <div className="relative hidden md:block">
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search brands, models, styles..."
              className="w-80 rounded-sm border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-base text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container"
            />
          </div>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((label) =>
            label === "Seller Hub" ? (
              <Link
                key={label}
                href="/seller-profile"
                className="border-b-2 border-primary text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase transition-colors hover:text-on-tertiary-container"
              >
                {label}
              </Link>
            ) : (
              <Link
                key={label}
                href="#"
                className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Image search" className="rounded-none">
            <ScanSearch />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Shopping cart"
            className="rounded-none"
            nativeButton={false}
            render={<Link href="/cart" />}
          >
            <ShoppingCart />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" className="rounded-none" nativeButton={false}
            >
            <CircleUser />
          </Button>
        </div>
      </div>
    </header>
  )
}