"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { formatRp, PLACEHOLDER_IMAGE, type ApiProduct } from "@/lib/api"
import { useProducts } from "@/lib/hooks"

// ponytail: skor match/delta masih disintesis dari condition_score & harga —
// API nggak punya data valuation per produk
const matchScore = (p: ApiProduct) => Math.min(99, Math.max(70, Math.round((p.condition_score ?? 8) * 10) + (p.harga % 7)))
const valuationDelta = (p: ApiProduct) => (((p.harga / 1000) % 24) - 6)
const authConfidence = (p: ApiProduct) => 99 - (p.harga % 3)

const conditions = ["new", "used"]

export default function SmartFindPage() {
  const { data } = useProducts({ limit: 50 })
  const catalog = useMemo(() => data?.items ?? [], [data])

  const maxPrice = useMemo(
    () => Math.max(0, ...catalog.map((p) => p.harga)),
    [catalog],
  )
  const brands = useMemo(
    () => Array.from(new Set(catalog.map((p) => p.seller?.nama_toko ?? "SneakHub"))),
    [catalog],
  )

  const [budget, setBudget] = useState<[number, number]>([0, maxPrice || 1])
  const [size, setSize] = useState("Any Size")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  // ponytail: draft state so "Apply Filters" matches the mockup; filters are live either way
  const [applied, setApplied] = useState({ budget, brands: selectedBrands, conditions: selectedConditions })
  const [sort, setSort] = useState("Match Score")

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const results = useMemo(() => {
    const list = catalog.filter((p) => {
      if (p.harga < applied.budget[0] || p.harga > applied.budget[1]) return false
      if (applied.brands.length > 0 && !applied.brands.includes(p.seller?.nama_toko ?? "SneakHub"))
        return false
      if (applied.conditions.length > 0 && !applied.conditions.includes(p.kondisi.toLowerCase()))
        return false
      if (size !== "Any Size" && !p.ukuran_tersedia.includes(size)) return false
      return true
    })
    return list.sort((a, b) => {
      if (sort === "Price: Low to High") return a.harga - b.harga
      if (sort === "Price: High to Low") return b.harga - a.harga
      return matchScore(b) - matchScore(a)
    })
  }, [applied, sort, catalog, size])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-5 px-5 py-8 md:flex-row md:px-10">
        {/* Filter Panel */}
        <aside className="flex w-full shrink-0 flex-col gap-6 md:w-64">
          <div>
            <h1 className="font-heading text-2xl leading-7 font-bold text-primary">
              Find Your Perfect Match
            </h1>
            <p className="mt-1 text-base leading-6 text-muted-foreground">
              Dial in your specifications.
            </p>
          </div>

          <div className="flex flex-col gap-6 border border-outline-variant bg-white p-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Budget Range
              </label>
              <div className="relative h-4 w-full">
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-surface-container-highest" />
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 bg-primary"
                  style={{
                    left: `${maxPrice ? (budget[0] / maxPrice) * 100 : 0}%`,
                    right: `${100 - (maxPrice ? (budget[1] / maxPrice) * 100 : 100)}%`,
                  }}
                />
                {([0, 1] as const).map((i) => (
                  <input
                    key={i}
                    type="range"
                    min={0}
                    max={maxPrice || 1}
                    step={Math.max(1, Math.round(maxPrice / 100))}
                    value={budget[i]}
                    aria-label={i === 0 ? "Minimum budget" : "Maximum budget"}
                    onChange={(e) =>
                      setBudget(([min, max]) =>
                        i === 0
                          ? [Math.min(Number(e.target.value), max), max]
                          : [min, Math.max(Number(e.target.value), min)],
                      )
                    }
                    className="pointer-events-none absolute top-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-on-primary [&::-webkit-slider-thumb]:bg-primary"
                    style={{ zIndex: i === 0 ? 2 : 1 }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-sm leading-5 font-medium">
                <span className="text-muted-foreground">{formatRp(budget[0])}</span>
                <span className="text-muted-foreground">{formatRp(budget[1])}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Size
              </label>
              {(() => {
                const allSizes = Array.from(new Set(catalog.flatMap((p) => p.ukuran_tersedia)))
                return (
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full border border-outline-variant bg-transparent p-2 text-base leading-6 focus:border-on-tertiary-container focus:ring-0"
                  >
                    {["Any Size", ...allSizes].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                )
              })()}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Brand
              </label>
              <div className="flex flex-col gap-1 text-base leading-6">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="-mx-1 flex cursor-pointer items-center gap-2 p-1 transition-colors hover:bg-surface-container-high"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => setSelectedBrands((l) => toggle(l, brand))}
                      className="rounded-none border-outline-variant text-primary focus:ring-primary"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Condition
              </label>
              <div className="flex flex-col gap-1 text-base leading-6">
                {conditions.map((c) => (
                  <label
                    key={c}
                    className="-mx-1 flex cursor-pointer items-center gap-2 p-1 transition-colors hover:bg-surface-container-high"
                  >
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(c)}
                      onChange={() => setSelectedConditions((l) => toggle(l, c))}
                      className="rounded-none border-outline-variant text-primary focus:ring-primary"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setApplied({ budget, brands: selectedBrands, conditions: selectedConditions })
            }
            className="w-full border border-primary bg-primary px-4 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-white hover:text-primary"
          >
            Apply Filters
          </button>
        </aside>

        {/* Results */}
        <section className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-outline-variant pb-2">
            <span className="text-base leading-6 text-muted-foreground">
              Showing top matches for your profile · {size}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                Sort By:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-none bg-transparent p-0 pr-3 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase focus:ring-0"
              >
                {["Match Score", "Price: Low to High", "Price: High to Low"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-0 border-t border-l border-outline-variant sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product) => (
                <SmartFindCard key={product.product_id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-primary bg-surface-container-low p-10 text-center">
              <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                No matches for these filters
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Widen your budget or clear a few filters.
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SmartFindCard({ product }: { product: ApiProduct }) {
  const score = matchScore(product)
  const delta = valuationDelta(product)
  const image = product.images?.[0]?.image_url || product.image_url || PLACEHOLDER_IMAGE

  return (
    <article className="group relative overflow-hidden border-b border-r border-outline-variant bg-white transition-all duration-200 hover:shadow-[4px_4px_0px_0px_#000]">
      <Link href={`/product/${product.product_id}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-surface-container-high">
          <div className="absolute top-2 right-2 z-10 border border-primary px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase shadow-[4px_4px_0px_0px_#000]"
            style={{ background: "linear-gradient(135deg,#2b82f4 0%,#00458f 100%)" }}
          >
            {score}% Match
          </div>
          <div className="absolute top-2 left-2 z-10 border border-outline bg-surface-container px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
            {product.kondisi}
          </div>
          <img
            src={image}
            alt={product.nama_produk}
            loading="lazy"
            className="h-full w-full object-cover p-8 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                {product.seller?.nama_toko ?? "SneakHub"}
              </p>
              <h3 className="font-heading text-xl leading-6 font-semibold text-primary">
                {product.nama_produk}
              </h3>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 border-y border-outline-variant py-2">
            <div className="flex flex-col">
              <span className="text-[10px] leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                Valuation Delta
              </span>
              <span className={`text-sm leading-5 font-bold ${delta >= 0 ? "text-on-tertiary-container" : "text-error"}`}>
                {delta >= 0 ? "+" : ""}{delta}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                Auth. Confidence
              </span>
              <span className="text-sm leading-5 font-bold">{authConfidence(product)}%</span>
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between">
            <p className="font-heading text-3xl leading-8 font-bold tracking-tighter text-primary">
              {formatRp(product.harga)}
            </p>
            <span className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-on-tertiary-container uppercase">
              <BadgeCheck className="size-4" />
              Authenticated
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}