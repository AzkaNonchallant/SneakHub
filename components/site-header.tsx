"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Camera, CircleUser, Image, ScanSearch, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { searchProducts } from "@/lib/products"
import { useVisualSearchStore } from "@/lib/visual-search-store"

const navLinks = ["Smart Find", "Shop", "Market Insights", "Seller Hub"]

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [menuOpen, setMenuOpen] = useState(false)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const results = searchProducts(query)

  const onPhoto = (file: File | undefined) => {
    setMenuOpen(false)
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
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-8">
          <Link
            href="/home"
            className="font-heading text-5xl leading-[48px] font-black tracking-tighter text-primary"
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
              placeholder="Search brands, models, styles..."
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
              className="absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-none text-muted-foreground hover:bg-transparent hover:text-on-tertiary-container"
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
                  Ambil Foto
                </button>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="flex w-full items-center gap-3 px-3 py-3 text-sm leading-5 transition-colors hover:bg-surface-container"
                >
                  <Image className="size-4 text-on-tertiary-container" />
                  Dari Galeri
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
                      <img
                        src={p.image}
                        alt={p.alt}
                        loading="lazy"
                        className="size-10 border border-outline-variant bg-surface-container-low object-contain p-0.5 mix-blend-multiply"
                      />
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
                    Tidak ada hasil untuk &quot;{query}&quot;
                  </p>
                )}
                <button
                  type="button"
                  onClick={submitQuery}
                  onMouseEnter={() => setActive(-1)}
                  className="flex w-full items-center justify-between bg-surface-container-low px-3 py-2.5 text-xs leading-4 font-bold tracking-widest text-on-tertiary-container uppercase transition-colors hover:bg-surface-container-highest"
                >
                  Lihat semua hasil untuk &quot;{query}&quot;
                  <Search className="size-4" />
                </button>
              </div>
            ) : null}
          </form>
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
            ) : label === "Smart Find" ? (
              <Link
                key={label}
                href="/smart-find"
                className={`pb-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase transition-colors hover:text-on-tertiary-container ${
                  pathname.startsWith("/smart-find")
                    ? "border-b-2 border-on-tertiary-container pb-1 text-primary"
                    : "text-muted-foreground"
                }`}
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Image search"
            className="rounded-none"
            nativeButton={false}
            render={<Link href="/search" />}
          >
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            className="rounded-none"
            nativeButton={false}
            render={<Link href="/profile" />}
          >
            <CircleUser />
          </Button>
        </div>
      </div>

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