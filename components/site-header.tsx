"use client"

import { useEffect, useDeferredValue, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { Bell, Camera, CircleUser, Heart, Image as ImageIcon, Languages, LogOut, Menu, Package,  Search, ShoppingCart, X } from "lucide-react"

import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { isSellerRole, setToken, toCard } from "@/lib/api"
import { useMe, useProducts } from "@/lib/hooks"
import { useLang, useT } from "@/lib/i18n"
import { useVisualSearchStore } from "@/lib/visual-search-store"
import { cn } from "@/lib/utils"

const navLinks = ["Smart Find", "Shop", "Market Insights", "Seller Hub"]

const navHref: Record<string, string> = {
  "Smart Find": "/smart-find",
  Shop: "/home",
  "Market Insights": "/smart-find",
  "Seller Hub": "/seller-profile",
}

const navLinksFor = (isSeller: boolean) =>
  navLinks.filter((label) => isSeller || label !== "Seller Hub")

const mobileLinks: { label: string; href: string }[] = navLinks.map((label) => ({
  label,
  href: navHref[label],
}))

const accountLinks: { label: string; href: string; icon: typeof CircleUser }[] = [
  { label: "Profile", href: "/profile", icon: CircleUser },
  { label: "Orders", href: "/profile", icon: Package },
  { label: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Notifications", href: "/profile/notifications", icon: Bell },
]

const mobileActions: { label: string; href: string; icon: typeof CircleUser }[] = [
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Profile", href: "/profile", icon: CircleUser },
  { label: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Notifications", href: "/profile/notifications", icon: Bell },
  { label: "Sign Out", href: "/login", icon: LogOut },
]

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const qc = useQueryClient()
  const t = useT()
  const { lang, toggleLang } = useLang()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const deferredQuery = useDeferredValue(query)
  const trimmed = deferredQuery.trim()
  const { data: resultsData } = useProducts({ search: trimmed, limit: 8, enabled: trimmed.length > 0 })
  const results = trimmed ? (resultsData?.items.map(toCard) ?? []) : []
  const { data: me } = useMe()
  const isSeller = isSellerRole(me?.peran)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setMobileOpen(false)
      setAccountOpen(false)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const onPhoto = (file: File | undefined) => {
    setMenuOpen(false)
    setMobileOpen(false)
    if (!file) return
    useVisualSearchStore.getState().setFile(file)
    router.push("/search")
  }

  const submitQuery = () => router.push(`/search?q=${encodeURIComponent(query)}`)

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const hit = results[active]
      if (hit) router.push(`/product/${hit.id}`)
      else submitQuery()
    } else if (e.key === "Escape") {
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 md:h-20 md:px-10">
        <div className="flex items-center gap-8">
          <Link
            href="/home"
            className="font-heading text-4xl leading-10 font-black tracking-tighter text-primary md:text-5xl md:leading-[48px]"
          >
            SNEAKHUB
          </Link>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              submitQuery()
            }}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            className="relative hidden md:block"
          >
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
                setActive(-1)
                setMenuOpen(false)
              }}
              onKeyDown={onKeyDown}
              placeholder={t("Search brands, models, styles...")}
              className="w-80 rounded-sm border border-outline-variant bg-surface-container-low py-2 pr-12 pl-10 text-base text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-on-tertiary-container focus:ring-1 focus:ring-on-tertiary-container"
            />
            <Button
              type="button"
              size="icon"
              aria-label="Visual match search"
              tabIndex={-1}
              onClick={() => {
                setMenuOpen((v) => !v)
                setOpen(false)
              }}
              className="absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-none text-on-tertiary-container hover:bg-transparent hover:text-on-tertiary-container"
            >
              <Camera />
            </Button>

            {/* Camera options */}
            {menuOpen ? (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-full right-0 z-50 mt-2 w-52 border border-primary bg-white shadow-[4px_4px_0px_0px_#000]"
              >
                <span className="block border-b border-outline-variant px-3 py-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Visual Match
                </span>
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex w-full items-center gap-3 px-3 py-3 text-sm leading-5 transition-colors hover:bg-surface-container"
                >
                  <Camera className="size-4 text-on-tertiary-container" />
                  {t("Take Photo")}
                </button>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="flex w-full items-center gap-3 px-3 py-3 text-sm leading-5 transition-colors hover:bg-surface-container"
                >
                  <ImageIcon className="size-4 text-on-tertiary-container" />
                  {t("From Gallery")}
                </button>
              </div>
            ) : null}

            {/* Autocomplete dropdown */}
            {open && query.trim() ? (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-full left-0 z-50 mt-2 w-full border border-primary bg-white shadow-[4px_4px_0px_0px_#000]"
              >
                {results.length > 0 ? (
                  results.slice(0, 8).map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 border-b border-outline-variant px-3 py-2.5 last:border-b-0 ${
                        i === active ? "bg-surface-container" : ""
                      }`}
                    >
                      <span className="relative size-10 shrink-0 border border-outline-variant bg-surface-container-low">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="40px"
                        className="object-contain p-0.5 mix-blend-multiply"
                      />
                    </span>
                      <span className="flex-1">
                        <span className="block text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                          {p.brand}
                        </span>
                        <span className="font-heading text-sm leading-5 font-semibold text-primary">
                          {p.name}
                        </span>
                      </span>
                      <span className="font-heading text-sm leading-5 font-bold text-primary">
                        {p.price}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-3 text-sm text-muted-foreground">
                    {t("No results for")} &quot;{query}&quot;
                  </p>
                )}
                <button
                  type="button"
                  onClick={submitQuery}
                  onMouseEnter={() => setActive(-1)}
                  className="flex w-full items-center justify-between bg-surface-container-low px-3 py-2.5 text-xs leading-4 font-bold tracking-widest text-on-tertiary-container uppercase transition-colors hover:bg-surface-container-highest"
                >
                  {t("View all results for")} &quot;{query}&quot;
                  <Search className="size-4" />
                </button>
              </div>
            ) : null}
          </form>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinksFor(isSeller).map((label) => (
            <Link
              key={label}
              href={navHref[label]}
              className={cn(
                "pb-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase transition-colors hover:text-on-tertiary-container",
                pathname.startsWith(navHref[label])
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-muted-foreground",
              )}
            >
              {t(label)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-none md:hidden"
          >
            <Menu />
          </Button>
          <div className="hidden items-center gap-4 md:flex">
           
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
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Account"
                aria-expanded={accountOpen}
                onClick={() => {
                  setAccountOpen((v) => !v)
                  setMenuOpen(false)
                }}
                className="rounded-none"
              >
                <CircleUser />
              </Button>
              {accountOpen ? (
                <>
                  {/* ponytail: invisible backdrop closes on any outside click */}
                  <button
                    type="button"
                    aria-label="Close account menu"
                    tabIndex={-1}
                    onClick={() => setAccountOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute top-full right-0 z-50 mt-2 w-56 border border-primary bg-white shadow-[4px_4px_0px_0px_#000]">
                    <span className="block border-b border-outline-variant px-3 py-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      {t("My Account")}
                    </span>
                    {accountLinks.map(({ label, href, icon: Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setAccountOpen(false)}
                        className="flex w-full items-center gap-3 px-3 py-3 text-sm leading-5 text-primary transition-colors hover:bg-surface-container"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        {t(label)}
                      </Link>
                    ))}
                    <Link
                      href="/login"
                      onClick={() => {
                        setAccountOpen(false)
                        setToken(null)
                        qc.clear()
                      }}
                      className="flex w-full items-center gap-3 border-t border-outline-variant px-3 py-3 text-sm leading-5 text-error transition-colors hover:bg-surface-container"
                    >
                      <LogOut className="size-4" />
                      {t("Sign Out")}
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("Language")}
              title={t("Language")}
              onClick={toggleLang}
              className="rounded-none"
            >
              <Languages />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: full-screen black takeover menu */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-[60] flex flex-col bg-primary text-white md:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/20 px-5">
              <Link href="/home" className="font-heading text-4xl leading-10 font-black tracking-tighter">
                SNEAKHUB
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 cursor-pointer items-center justify-center border border-white/30 text-white transition-colors hover:bg-white hover:text-primary"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault()
                  submitQuery()
                  setMobileOpen(false)
                }}
                className="relative mb-8"
              >
                <Search
                  aria-hidden
                  className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("Search brands, models, styles...")}
                  className="w-full border border-white bg-transparent py-3 pr-4 pl-10 text-base text-white outline-none transition-colors placeholder:text-white/50 focus:border-b-2 focus:border-on-tertiary-container"
                />
              </form>

              <nav className="flex flex-col">
                {mobileLinks
                  .filter(({ label }) => isSeller || label !== "Seller Hub")
                  .map(({ label, href }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.3, ease: "easeOut" }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-baseline gap-4 border-b border-white/15 py-4"
                    >
                      <span className="text-[10px] font-bold tracking-widest text-white/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-heading text-3xl leading-9 font-bold tracking-tight uppercase transition-colors",
                          pathname.startsWith(href) && href !== "/home"
                            ? "text-on-tertiary-container"
                            : "text-white",
                        )}
                      >
                        {t(label)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <button
                type="button"
                onClick={toggleLang}
                className="mt-8 flex items-center gap-3 border border-white/30 px-4 py-3 text-xs font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-white hover:text-primary"
              >
                <Languages className="size-4" />
                {t("Language")}: {lang === "en" ? "Bahasa Indonesia" : "English"}
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34, duration: 0.3 }}
                className="mt-10 border-t border-white/20 pt-6"
              >
                <span className="mb-3 block text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  Visual Match
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-white py-3 text-xs leading-4 font-bold tracking-[0.05em] uppercase transition-colors hover:bg-white hover:text-primary"
                  >
                    <Camera className="size-4 text-on-tertiary-container" />
                    {t("Take Photo")}
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-white py-3 text-xs leading-4 font-bold tracking-[0.05em] uppercase transition-colors hover:bg-white hover:text-primary"
                  >
                    <ImageIcon className="size-4 text-on-tertiary-container" />
                    {t("Gallery")}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.3, ease: "easeOut" }}
              className="grid shrink-0 grid-cols-3 gap-px border-t border-white/20 bg-white/20"
            >
              {mobileActions.map(({ label, href, icon: Icon }) =>
                label === "Sign Out" ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setToken(null)
                      qc.clear()
                      router.push("/login")
                    }}
                    className="flex flex-col items-center gap-1.5 bg-primary py-4 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-white/10"
                  >
                    <Icon className="size-5" />
                    {t(label)}
                  </button>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center gap-1.5 bg-primary py-4 text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-white/10"
                  >
                    <Icon className="size-5" />
                    {t(label)}
                  </Link>
                ),
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ponytail: hidden until picked by the camera menu; button-triggered so no clickjacking */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          onPhoto(e.target.files?.[0])
          e.target.value = ""
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onPhoto(e.target.files?.[0])
          e.target.value = ""
        }}
      />
    </header>
  )
}
