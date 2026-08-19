"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ProductCardSkeleton } from "@/components/skeleton"
import { formatRp, PLACEHOLDER_IMAGE, type SmartFilterItem } from "@/lib/api"
import { useProducts, useSmartFilter, type SmartFilterParams } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const conditions = ["NEW", "USED", "REFURBISHED"]

export default function SmartFindPage() {
  const t = useT()
  const { data } = useProducts({ limit: 50 })
  const filter = useSmartFilter()
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (maxPrice > 0) setBudget((b) => [b[0], maxPrice])
  }, [maxPrice])
  const [size, setSize] = useState("Any Size")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [sort, setSort] = useState("Match Score")

  const applyFilters = () => {
    const params: SmartFilterParams = {
      budget_min: budget[0] > 0 ? budget[0] : undefined,
      budget_max: budget[1] > 0 ? budget[1] : undefined,
      brand: selectedBrands.length > 0 ? selectedBrands : undefined,
      kondisi: selectedConditions.length > 0 ? selectedConditions : undefined,
      ukuran: size !== "Any Size" ? [size] : undefined,
      prioritas: { harga: 0.5, kondisi: 0.3, seller_trust: 0.2 },
    }
    filter.mutate(params)
  }


  const results = useMemo(() => {
    const list = filter.data?.items ?? []
    if (sort === "Price: Low to High") return [...list].sort((a, b) => a.harga - b.harga)
    if (sort === "Price: High to Low") return [...list].sort((a, b) => b.harga - a.harga)
    return list
  }, [filter.data, sort])

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Smart Find" />
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-5 px-5 py-8 md:flex-row md:px-10">

        <aside className="flex w-full shrink-0 flex-col gap-6 md:w-64">
          <div>
            <h1 className="font-heading text-2xl leading-7 font-bold text-primary">
              {t("Find Your Perfect Match")}
            </h1>
            <p className="mt-1 text-base leading-6 text-muted-foreground">
              {t("Dial in your specifications.")}
            </p>
          </div>

          <div className="flex flex-col gap-6 border border-outline-variant bg-white p-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                {t("Budget Range")}
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
                {t("Size")}
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
                      <option key={s}>{s === "Any Size" ? t("Any Size") : s}</option>
                    ))}
                  </select>
                )
              })()}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                {t("Brand")}
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
                      onChange={() =>
                        setSelectedBrands((l) =>
                          l.includes(brand) ? l.filter((v) => v !== brand) : [...l, brand],
                        )
                      }
                      className="rounded-none border-outline-variant text-primary focus:ring-primary"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                {t("Condition")}
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
                      onChange={() =>
                        setSelectedConditions((l) =>
                          l.includes(c) ? l.filter((v) => v !== c) : [...l, c],
                        )
                      }
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
            onClick={applyFilters}
            disabled={filter.isPending}
            className="w-full border border-primary bg-primary px-4 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
          >
            {filter.isPending ? t("Processing…") : t("Apply Filters")}
          </button>
        </aside>


        <section className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-outline-variant pb-2">
            <span className="text-base leading-6 text-muted-foreground">
              {filter.data
                ? `${t("Top")} ${results.length} ${results.length === 1 ? t("match") : t("matches")} ${t("for your filters")}`
                : t("Press Apply Filters to get match scores")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                {t("Sort By:")}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-none bg-transparent p-0 pr-3 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase focus:ring-0"
              >
                {["Match Score", "Price: Low to High", "Price: High to Low"].map((s) => (
                  <option key={s}>{t(s)}</option>
                ))}
              </select>
            </div>
          </div>

          {filter.isPending && !filter.data ? (
            <div className="grid grid-cols-1 gap-0 border-t border-l border-outline-variant sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} className="w-auto" />
              ))}
            </div>
          ) : filter.data ? (
            results.length > 0 ? (
              <div className="grid grid-cols-1 gap-0 border-t border-l border-outline-variant sm:grid-cols-2 lg:grid-cols-3">
                {results.map((product) => (
                  <SmartFindCard key={product.product_id} item={product} />
                ))}
              </div>
            ) : (
              <div className="border border-primary bg-surface-container-low p-10 text-center">
                <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  {t("No matches for these filters")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("Widen your budget or clear a few filters.")}
                </p>
              </div>
            )
          ) : (
            <div className="border border-outline-variant bg-surface-container-low p-10 text-center">
              <p className="font-heading text-xl leading-6 font-semibold text-primary uppercase">
                {t("No results yet")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {filter.isPending ? t("Processing your filters…") : t("Set your filters, then press Apply Filters.")}
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SmartFindCard({ item }: { item: SmartFilterItem }) {
  const t = useT()
  return (
    <article className="group relative overflow-hidden border-b border-r border-outline-variant bg-white transition-all duration-200 hover:shadow-[4px_4px_0px_0px_#000]">
      <Link href={`/product/${item.product_id}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-surface-container-high">
          <div
            className="absolute top-2 right-2 z-10 border border-primary px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase shadow-[4px_4px_0px_0px_#000]"
            style={{ background: "linear-gradient(135deg,#2b82f4 0%,#00458f 100%)" }}
          >
            {item.match_score}% {t("Match")}
          </div>
          <Image
            src={item.image_url || PLACEHOLDER_IMAGE}
            alt={item.nama_produk}
            fill
            sizes="(max-width:768px) 50vw, 300px"
            className="object-cover p-8 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 bg-white p-4">
          <h3 className="font-heading text-xl leading-6 font-semibold text-primary">
            {item.nama_produk}
          </h3>

          <div className="mt-1 flex flex-col gap-1 border-y border-outline-variant py-2">
            {item.alasan.map((reason) => (
              <span key={reason} className="text-[10px] leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                • {reason}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-end justify-between">
            <p className="font-heading text-3xl leading-8 font-bold tracking-tighter text-primary">
              {formatRp(item.harga)}
            </p>
            <span className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-[#10B981] uppercase">
              <BadgeCheck className="size-4" />
              {t("Trusted")}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}