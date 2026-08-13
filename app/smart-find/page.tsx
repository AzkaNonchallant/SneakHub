"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import {
  bestSellers,
  parsePrice,
  personalizedProducts,
  trendingProducts,
  type Product,
} from "@/lib/products"

const catalog: Product[] = [...trendingProducts, ...bestSellers, ...personalizedProducts]
const MIN_PRICE = 100
const MAX_PRICE = 1150

// ponytail: no per-product purpose/size data yet; synthesized match scores
const matchScore = (id: number) => 84 + ((id * 7) % 15)
const valuationDelta = (id: number) => ((id * 13) % 24) - 3
const authConfidence = (id: number) => 99 - (id % 3)

const brands = ["Nike", "Adidas", "Jordan", "New Balance"]
const conditions = ["Brand New", "Refurbished", "Used - Excellent", "9.0+ (Near Mint)", "8.0+ (Very Good)"]
const purposes = ["Daily", "Sports", "Collection"]

const conditionOf = (p: Product) =>
  p.badge === "New" ? "DS (Brand New)" : (p.badge ?? "Used - Excellent")

const matchesCondition = (c: string, p: Product): boolean => {
  const badge = p.badge ?? ""
  if (c === "Brand New") return badge.includes("New")
  if (c === "Refurbished") return badge.includes("Refurbished")
  if (c === "Used - Excellent") return !badge
  const score = Number(badge.match(/(\d+)\/100/)?.[1] ?? NaN) / 10
  if (c === "9.0+ (Near Mint)") return score >= 9
  if (c === "8.0+ (Very Good)") return score >= 8
  return false
}

export default function SmartFindPage() {
  const [budget, setBudget] = useState<[number, number]>([MIN_PRICE, MAX_PRICE])
  const [size, setSize] = useState("Any Size")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [purpose, setPurpose] = useState("Sports")
  // ponytail: draft state so "Apply Filters" matches the mockup; filters are live either way
  const [applied, setApplied] = useState({ budget, brands: selectedBrands, conditions: selectedConditions })
  const [sort, setSort] = useState("Match Score")

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const results = useMemo(() => {
    const list = catalog.filter((p) => {
      const price = parsePrice(p.price)
      if (price < applied.budget[0] || price > applied.budget[1]) return false
      if (applied.brands.length > 0 && !applied.brands.includes(p.brand)) return false
      if (applied.conditions.length > 0 && !applied.conditions.some((c) => matchesCondition(c, p)))
        return false
      return true
    })
    return list.sort((a, b) => {
      if (sort === "Price: Low to High") return parsePrice(a.price) - parsePrice(b.price)
      if (sort === "Price: High to Low") return parsePrice(b.price) - parsePrice(a.price)
      return matchScore(b.id) - matchScore(a.id)
    })
  }, [applied, sort])

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
                    left: `${((budget[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                    right: `${100 - ((budget[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                  }}
                />
                {([0, 1] as const).map((i) => (
                  <input
                    key={i}
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step={10}
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
                <span className="text-muted-foreground">${budget[0]}</span>
                <span className="text-muted-foreground">${budget[1]}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Size (US)
              </label>
              {/* ponytail: decorative until products carry size data */}
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-outline-variant bg-transparent p-2 text-base leading-6 focus:border-on-tertiary-container focus:ring-0"
              >
                {["Any Size", "8.0", "8.5", "9.0", "9.5", "10.0"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
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

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Purpose
              </label>
              <div className="flex flex-wrap gap-2">
                {purposes.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={
                      purpose === p
                        ? "border border-primary bg-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase"
                        : "border border-outline-variant bg-surface-container px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase transition-colors hover:bg-primary hover:text-white"
                    }
                  >
                    {p}
                  </button>
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
                <SmartFindCard key={product.id} product={product} />
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

          {results.length > 0 ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="border border-primary bg-transparent px-8 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-primary hover:text-white hover:shadow-none"
              >
                Load More Results
              </button>
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SmartFindCard({ product }: { product: Product }) {
  const score = matchScore(product.id)
  const delta = valuationDelta(product.id)

  return (
    <article className="group relative overflow-hidden border-b border-r border-outline-variant bg-white transition-all duration-200 hover:shadow-[4px_4px_0px_0px_#000]">
      <Link href={`/product/${product.id}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-surface-container-high">
          <div className="absolute top-2 right-2 z-10 border border-primary px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase shadow-[4px_4px_0px_0px_#000]"
            style={{ background: "linear-gradient(135deg,#2b82f4 0%,#00458f 100%)" }}
          >
            {score}% Match
          </div>
          <div className="absolute top-2 left-2 z-10 border border-outline bg-surface-container px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
            {conditionOf(product)}
          </div>
          <img
            src={product.image}
            alt={product.alt}
            loading="lazy"
            className="h-full w-full object-cover p-8 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                {product.brand}
              </p>
              <h3 className="font-heading text-xl leading-6 font-semibold text-primary">
                {product.name}
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
              <span className="text-sm leading-5 font-bold">{authConfidence(product.id)}%</span>
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between">
            <p className="font-heading text-3xl leading-8 font-bold tracking-tighter text-primary">
              {product.price}
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