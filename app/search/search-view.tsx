"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, LoaderCircle, ScanSearch, Search, X } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { ProductCard } from "@/components/product-card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  personalizedProducts,
  searchProducts,
  type Product,
} from "@/lib/products"
import { useVisualSearchStore } from "@/lib/visual-search-store"

type MatchPhase = "analyzing" | "done"

type Match = { preview: string; phase: MatchPhase }

export function SearchView({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [match, setMatch] = useState<Match | null>(() => {
    // ponytail: photo handed over from the header camera menu; real recognition later
    const photo = useVisualSearchStore.getState().file
    if (!photo || !photo.type.startsWith("image/")) return null
    useVisualSearchStore.getState().clear()
    return { preview: URL.createObjectURL(photo), phase: "analyzing" }
  })
  const cameraRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (match?.phase !== "analyzing") return
    const t = setTimeout(() => setMatch((m) => (m ? { ...m, phase: "done" } : m)), 1400)
    return () => clearTimeout(t)
  }, [match?.phase])

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setMatch((old) => {
      if (old) URL.revokeObjectURL(old.preview)
      return { preview: URL.createObjectURL(file), phase: "analyzing" }
    })
  }

  const clearMatch = () =>
    setMatch((old) => {
      if (old) URL.revokeObjectURL(old.preview)
      return null
    })

  const dropzone = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDropAccepted: ([file]) => applyFile(file),
  })

  const results = searchProducts(query)
  const hasQuery = query.trim().length > 0

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <section className="border-b border-outline-variant bg-surface-container-lowest py-14">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <span className="mb-4 inline-block bg-on-tertiary-container px-3 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase">
            Smart Find
          </span>
          <h1 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-6xl">
            Search The Market
          </h1>
          <p className="mt-2 max-w-xl text-base leading-6 text-muted-foreground">
            Find sneakers by keyword, silhouette, or a photo of the pair you&apos;re after.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              const q = String(new FormData(e.currentTarget).get("q") ?? "")
              setQuery(q)
              router.push(`/search?q=${encodeURIComponent(q)}`)
            }}
            className="relative mt-8 max-w-2xl"
          >
            <Search
              aria-hidden
              className="absolute top-1/2 left-4 size-6 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands, models, colorways..."
              autoFocus
              className="w-full border border-primary bg-white py-4 pr-24 pl-14 text-lg text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-on-tertiary-container focus:ring-2 focus:ring-on-tertiary-container md:pr-32"
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 gap-2">
              <Button
                type="button"
                size="icon"
                aria-label="Visual match search"
                onClick={() => dropzone.open()}
                className="size-10 rounded-none border border-on-tertiary-container bg-on-tertiary-container text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:text-on-tertiary-container hover:shadow-none"
              >
                <ScanSearch />
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-none border border-primary bg-primary px-2 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary md:px-4"
              >
                <span className="hidden md:inline">Search</span>
                <Search className="size-4 md:hidden" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Visual Match */}
      <section className="border-b border-outline-variant bg-background py-14">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Camera className="size-8 text-on-tertiary-container" />
                <h2 className="font-heading text-4xl leading-9 font-bold text-primary uppercase">
                  Visual Match
                </h2>
              </div>
              <p className="mt-2 max-w-xl text-base leading-6 text-muted-foreground">
                Upload a photo or snap one with your camera — AI matches the silhouette,
                colorway, and brand.
              </p>
            </div>
            {match ? (
              <button
                type="button"
                onClick={clearMatch}
                className="inline-flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase hover:text-on-tertiary-container"
              >
                Clear <X className="size-4" />
              </button>
            ) : null}
          </div>

          {!match ? (
            <div
              {...dropzone.getRootProps()}
              className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary bg-surface-container-low px-6 py-16 text-center transition-colors hover:border-on-tertiary-container hover:bg-surface-container"
            >
              <input {...dropzone.getInputProps()} />
              <div className="mb-4 flex size-16 items-center justify-center border border-primary bg-on-tertiary-container text-white shadow-[4px_4px_0px_0px_#000]">
                <ScanSearch className="size-8" />
              </div>
              <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                Drag &amp; drop your sneaker photo
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                or tap to browse your files
              </p>
              <div className="mt-6 flex items-center gap-6">
                <Button
                  type="button"
                  size="icon"
                  aria-label="Open camera to take a photo"
                  onClick={(e) => {
                    e.stopPropagation()
                    cameraRef.current?.click()
                  }}
                  className="size-12 rounded-none border border-primary bg-primary text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-on-tertiary-container hover:shadow-none"
                >
                  <Camera />
                </Button>
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Or use camera
                </span>
              </div>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) applyFile(file)
                  e.target.value = ""
                }}
              />
            </div>
          ) : (
            <div className="border border-primary bg-white p-6">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <img
                  src={match.preview}
                  alt="Selected sneaker for visual match"
                  className="h-56 w-full max-w-xs border border-primary bg-surface-container-low object-contain mix-blend-multiply"
                />
                <div className="flex-1">
                  {match.phase === "analyzing" ? (
                    <>
                      <span className="inline-flex items-center gap-2 bg-on-tertiary-container px-3 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase">
                        <LoaderCircle className="size-3.5 animate-spin" />
                        Analyzing Silhouette
                      </span>
                      <p className="mt-4 max-w-md text-base leading-6 text-muted-foreground">
                        Matching shape, colorway, and branding against the catalog…
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-2 bg-on-tertiary-container px-3 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase">
                        Match Found
                      </span>
                      <p className="mt-4 max-w-md text-base leading-6 text-muted-foreground">
                        {/* ponytail: static "matches" until a real image-recognition API exists */}
                        Top matches ranked by silhouette and colorway confidence.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {match?.phase === "done" ? (
            <div className="mt-8 space-y-3">
              {personalizedProducts.map((product, i) => (
                <MatchRow key={product.id} product={product} rank={i + 1} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Results */}
      <section className="border-b border-outline-variant bg-surface-container-lowest py-14">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10">
          {hasQuery ? (
            <>
              <div className="mb-8 flex items-end justify-between">
                <h2 className="font-heading text-4xl leading-9 font-bold text-primary uppercase">
                  {results.length} Result{results.length === 1 ? "" : "s"} For &quot;{query}&quot;
                </h2>
              </div>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-0 border-t border-l border-primary sm:grid-cols-2 lg:grid-cols-4">
                  {results.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      number={i + 1}
                      className="w-auto border-r border-b"
                    />
                  ))}
                </div>
              ) : (
                <div className="border border-primary bg-surface-container-low p-10 text-center">
                  <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                    No matches for &quot;{query}&quot;
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another model, brand, or use Visual Match above.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="font-heading text-4xl leading-9 font-bold text-primary uppercase">
                  Rekomendasi Untuk Kamu
                </h2>
                <div className="h-px flex-1 bg-primary" />
                <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Algorithm Generated
                </span>
              </div>
              <div className="grid grid-cols-1 gap-0 border-t border-l border-primary sm:grid-cols-2 lg:grid-cols-3">
                {personalizedProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    number={i + 1}
                    className="w-auto border-r border-b"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function MatchRow({ product, rank }: { product: Product; rank: number }) {
  return (
    <div className="flex items-center gap-4 border border-primary bg-white p-4">
      <span className="font-heading w-10 text-2xl leading-7 font-black text-outline opacity-40">
        {String(rank).padStart(2, "0")}
      </span>
      <img
        src={product.image}
        alt={product.alt}
        loading="lazy"
        className="h-20 w-20 border border-outline-variant bg-surface-container-low object-contain p-1 mix-blend-multiply"
      />
      <div className="flex-1">
        <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          {product.brand}
        </span>
        <h3 className="font-heading text-xl leading-6 font-semibold text-primary">
          {product.name}
        </h3>
        <span className="font-heading text-sm font-bold text-primary">{product.price}</span>
      </div>
      <span className="border border-on-tertiary-container bg-on-tertiary-container/10 px-2 py-1 text-xs leading-4 font-bold text-on-tertiary-container">
        {product.match} Match
      </span>
    </div>
  )
}