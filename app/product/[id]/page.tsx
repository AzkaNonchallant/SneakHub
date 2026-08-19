"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, Heart, Info, LineChart, Plus } from "lucide-react"
import { notFound } from "next/navigation"
import { toast } from "sonner"

import { PageMeta } from "@/components/page-meta"
import { RatingStars } from "@/components/rating-stars"
import { ProductDetailSkeleton } from "@/components/skeleton"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp, PLACEHOLDER_IMAGE, type ConditionScore } from "@/lib/api"
import {
  useAddCartItems,
  useAddWishlist,
  useConditionScores,
  useMe,
  usePriceInsight,
  useProduct,
  useProductReviews,
  useRemoveWishlist,
  useSubmitConditionScore,
  useWishlist,
} from "@/lib/hooks"
import { useLang, useT } from "@/lib/i18n"

const kondisiBadge: Record<string, string> = {
  NEW: "bg-[#10B981] text-white",
  USED: "bg-surface-container-highest text-primary",
  REFURBISHED: "bg-outline text-white",
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const t = useT()
  const id = String(params.id)
  const { data: product, isLoading } = useProduct(id)
  const { data: me } = useMe()
  const { data: wishlist } = useWishlist()
  const [activeImage, setActiveImage] = useState(0)

  const addToCart = useAddCartItems()
  const addWishlist = useAddWishlist()
  const removeWishlist = useRemoveWishlist()

  const inWishlist = useMemo(
    () => (wishlist ?? []).some((w) => w.product_id === id),
    [wishlist, id],
  )

  const toggleWishlist = async () => {
    try {
      if (inWishlist) await removeWishlist.mutateAsync(id)
      else await addWishlist.mutateAsync(id)
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  // ponytail: sebelumnya pakai addToCart.mutate() tanpa try/catch, jadi
  // error dari backend (misal stok kosong) ketelen dan gak ada toast
  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addToCart.mutateAsync([{ product_id: product.product_id, jumlah: 1 }])
      toast.success(t("Added to cart"))
    } catch (err) {
      const msg = errMessage(err)
      // pesan backend nampilin UUID product mentah, sembunyiin di sini
      toast.error(msg.toLowerCase().includes("stok") ? t("Sorry, this item is out of stock") : msg)
    }
  }

  const isSellerOrAdmin = me?.peran === "seller" || me?.peran === "admin" || me?.peran === "SELLER" || me?.peran === "ADMIN"

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) notFound()

  const gallery =
    product.images && product.images.length > 0
      ? product.images.map((i) => i.url)
      : [product.image_url || PLACEHOLDER_IMAGE]
  const sellerName = product.seller?.nama_toko ?? "SneakHub Seller"

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title={product.nama_produk} />
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-12 md:px-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
          <Link href="/home" className="transition-colors hover:text-primary">
            {t("Shop")}
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-primary">{product.nama_produk}</span>
        </nav>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-low p-8">
              <span className={`absolute top-4 left-4 border border-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase ${kondisiBadge[product.kondisi] ?? "bg-surface-container-highest text-primary"}`}>
                {t("Condition")}: {product.kondisi}
              </span>
              <Image
                src={gallery[activeImage]}
                alt={product.nama_produk}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 60vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={
                    i === activeImage
                      ? "relative flex aspect-square cursor-pointer items-center justify-center border border-primary bg-surface-container-low"
                      : "relative flex aspect-square cursor-pointer items-center justify-center border border-outline-variant bg-surface-container-low transition-colors hover:border-primary"
                  }
                >
                  <Image src={img} alt="" fill sizes="25vw" className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="flex flex-col gap-2 border-b border-outline-variant pb-6">
              <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
                {product.nama_produk}
              </h1>
              {product.seller?.nama_toko ? (
                <h2 className="font-heading text-2xl leading-7 font-semibold text-muted-foreground">
                  {product.seller.nama_toko}
                </h2>
              ) : null}
              <div className="mt-2 flex items-baseline gap-4">
                <span className="font-heading text-3xl leading-9 font-bold text-primary md:text-5xl md:leading-12">
                  {formatRp(product.harga)}
                </span>
                <span className="text-xs leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                  {t("Stock")} {product.stok} • {product.ukuran_tersedia.length} {t("sizes")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stok <= 0 || addToCart.isPending}
                className="h-auto rounded-none border border-primary bg-primary py-4 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-background hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {product.stok <= 0 ? t("Out of Stock") : addToCart.isPending ? t("Adding…") : t("Add to Cart")}
              </Button>
              <Button
                type="button"
                onClick={toggleWishlist}
                className="h-auto rounded-none border border-primary bg-background py-4 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase transition-colors hover:bg-surface-container-low"
              >
                <Heart className="size-4" fill={inWishlist ? "currentColor" : "none"} />
                {inWishlist ? t("In Wishlist") : t("Wishlist")}
              </Button>
            </div>

            <ConditionScoreBox productId={id} isSellerOrAdmin={isSellerOrAdmin} />

            <div className="flex flex-col gap-4 border border-outline-variant bg-surface p-6">
              <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                {t("Available Sizes")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ukuran_tersedia.length > 0 ? (
                  product.ukuran_tersedia.map((s) => (
                    <span
                      key={s}
                      className="border border-outline bg-surface-container-low px-3 py-1 font-heading text-sm font-bold text-primary"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t("No sizes registered yet.")}</span>
                )}
              </div>
            </div>

            <PriceInsightBox productId={id} price={product.harga} />

            <ReviewsBox productId={id} />

            <button
              type="button"
              onClick={() => router.push("/seller-profile")}
              className="flex cursor-pointer items-center justify-between gap-4 border border-outline-variant bg-surface p-6 transition-opacity hover:opacity-80"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center border border-outline bg-surface-container-high font-heading text-2xl leading-7 font-semibold text-primary">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <h3 className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                    {sellerName}
                  </h3>
                  <p className="font-mono text-sm font-medium text-muted-foreground">
                    {t("Verified Merchant")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-heading text-2xl leading-7 font-semibold text-[#10B981]">
                  {product.seller?.seller_trust_score ?? "-"}/100
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  {t("TRUST SCORE")} <Info className="size-3" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

const kondisiMeta = (kondisi: string, t: (s: string) => string) =>
  kondisi === "NEW"
    ? { bg: "bg-[#10B981] text-white", label: t("NEW") }
    : kondisi === "USED"
      ? { bg: "bg-surface-container-highest text-primary", label: t("USED") }
      : { bg: "bg-outline text-white", label: t("REFURBISHED") }

function ConditionScoreBox({ productId, isSellerOrAdmin }: { productId: string; isSellerOrAdmin: boolean }) {
  const t = useT()
  const { data: score, isLoading } = useConditionScores(productId)
  const [open, setOpen] = useState(false)
  const latest = score ?? undefined

  const skor = latest?.skor_akhir ?? 0
  const meta = kondisiMeta("USED", t)

  return (
    <div className="flex flex-col gap-4 border border-outline-variant bg-surface p-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
          {t("Condition Score")}
        </h3>
        {isLoading ? (
          <span className="text-xs text-muted-foreground">{t("Loading…")}</span>
        ) : latest ? (
          <span className={`flex items-center gap-2 border border-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase ${meta.bg}`}>
            {t("Overall")} <span className="text-base font-bold">{skor}/100</span>
          </span>
        ) : (
          <span className="border border-outline bg-surface-container-highest px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase">
            {t("NOT RATED")}
          </span>
        )}
      </div>
      {latest ? (
        <>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-1 bg-primary" style={{ width: `${skor}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {(["upper", "outsole", "midsole", "insole", "accessories", "box"] as const).map((k) => (
              <div key={k} className="border border-outline-variant bg-surface-container-lowest px-2 py-2">
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{k}</div>
                <div className="font-heading text-base font-bold text-primary">{latest!.detail[k]}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          {t("No condition assessment from verifier yet.")}
        </p>
      )}
      {isSellerOrAdmin ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="h-auto w-fit rounded-none border border-primary bg-primary px-5 py-2.5 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
        >
          <Plus className="size-3.5" /> {latest ? t("Re-rate") : t("Rate Condition")}
        </Button>
      ) : null}
      {open ? (
        <ConditionScoreDialog
          productId={productId}
          initial={latest}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}

function ConditionScoreDialog({
  productId,
  initial,
  onClose,
}: {
  productId: string
  initial?: ConditionScore
  onClose: () => void
}) {
  const submit = useSubmitConditionScore()
  const t = useT()
  const [komponen, setKomponen] = useState({
    upper: initial?.detail.upper ?? 80,
    outsole: initial?.detail.outsole ?? 80,
    midsole: initial?.detail.midsole ?? 80,
    insole: initial?.detail.insole ?? 80,
    accessories: initial?.detail.accessories ?? 80,
    box: initial?.detail.box ?? 80,
  })
  const set = (k: keyof typeof komponen, v: number) => setKomponen((s) => ({ ...s, [k]: v }))

  const save = async () => {
    try {
      await submit.mutateAsync({ productId, body: { ...komponen, dinilai_oleh: "SELLER" } })
      toast.success(t("Condition score saved"))
      onClose()
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[90vh] w-full max-w-md flex-col border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
        <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-4">
          <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
            {t("Rate Condition")}
          </h3>
          <button type="button" onClick={onClose} className="cursor-pointer text-xs font-bold tracking-widest text-muted-foreground uppercase hover:text-primary">
            {t("Close")}
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto">
          {(["upper", "outsole", "midsole", "insole", "accessories", "box"] as const).map((k) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="flex items-center justify-between text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                {k}
                <span className="font-heading text-base font-bold text-on-tertiary-container">{komponen[k]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={komponen[k]}
                onChange={(e) => set(k, Number(e.target.value))}
                className="w-full accent-black"
              />
            </label>
          ))}
        </div>
        <Button
          type="button"
          disabled={submit.isPending}
          onClick={save}
          className="mt-6 h-auto rounded-none border border-primary bg-primary py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
        >
          {submit.isPending ? t("Saving…") : t("Save Score")}
        </Button>
      </div>
    </div>
  )
}

function ReviewsBox({ productId }: { productId: string }) {
  const t = useT()
  const { lang } = useLang()
  const { data: reviews } = useProductReviews(productId)

  return (
    <div className="flex flex-col gap-4 border border-outline-variant bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
          {t("Reviews")}
        </h3>
        {reviews && reviews.total_review > 0 ? (
          <span className="flex items-center gap-2">
            <RatingStars value={reviews.rating_rata_rata} total={reviews.total_review} />
          </span>
        ) : (
          <span className="border border-outline bg-surface-container-highest px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
            {t("NO REVIEWS")}
          </span>
        )}
      </div>
      {!reviews || reviews.items.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {t("No reviews yet. Be the first to review this product.")}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-outline-variant border-t border-outline-variant">
          {reviews.items.map((r) => (
            <div key={r.review_id} className="flex flex-col gap-1.5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs leading-4 font-bold tracking-widest text-primary uppercase">
                  {r.customer?.nama ?? t("Customer")}
                </span>
                <span className="flex items-center gap-1">
                  <RatingStars value={r.rating} />
                </span>
              </div>
              {r.komentar ? <p className="text-sm leading-6 text-muted-foreground">{r.komentar}</p> : null}
              {r.created_at ? (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {(() => {
                    const d = new Date(r.created_at)
                    return isNaN(d.getTime()) ? "" : d.toLocaleString(lang === "id" ? "id-ID" : "en-US")
                  })()}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PriceInsightBox({ productId, price }: { productId: string; price: number }) {
  const t = useT()
  const { data: insight } = usePriceInsight(productId)

  const anomalyType = insight?.anomaly_type ?? ""
  const isBelow = insight ? insight.current_price < insight.market_average : false
  const isAbove = insight ? insight.current_price > insight.market_average : false
  const diffPct = insight?.price_difference_percent ?? 0
  const marketAvg = insight?.market_average ?? price

  const tone =
    anomalyType === "CHEAP"
      ? { chip: "bg-[#10B981] text-white", text: "text-[#10B981]", label: t("BELOW MARKET") }
      : anomalyType === "OVERPRICED"
        ? { chip: "bg-[#f59e0b] text-white", text: "text-[#f59e0b]", label: t("ABOVE MARKET") }
        : { chip: "bg-surface-container-highest text-muted-foreground", text: "text-muted-foreground", label: t("AT MARKET") }

  const rel = marketAvg ? (price / marketAvg - 1) * 100 : 0
  const markerLeft = Math.min(90, Math.max(10, 10 + rel * 8))

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden border border-outline-variant bg-surface p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart className="size-5 text-on-tertiary-container" fill="currentColor" />
          <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
            {t("Price Insight")}
          </h3>
        </div>
        <span className={`border border-primary px-2 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase ${tone.chip}`}>
          {tone.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: t("Listing Price"), value: formatRp(price) },
          { label: t("Market Average"), value: formatRp(marketAvg) },
          { label: t("Market Range"), value: `${formatRp(insight?.market_price_min ?? price)} – ${formatRp(insight?.market_price_max ?? price)}` },
          { label: t("Difference"), value: `${diffPct >= 0 ? "+" : ""}${diffPct}%`, cls: tone.text },
        ].map((s) => (
          <div key={s.label} className="border border-outline-variant bg-surface-container-lowest p-3">
            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{s.label}</div>
            <div className={`mt-0.5 font-heading text-sm leading-5 font-bold text-primary ${s.cls ?? ""}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-2 h-10 w-full">
        <div className="absolute bottom-2 h-1 w-full bg-surface-container-high" />
        <div
          className="absolute bottom-2 h-1 bg-[#10B981]"
          style={{ width: `${Math.min(50, markerLeft)}%` }}
        />
        <div
          className="absolute bottom-2 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${markerLeft}%` }}
        >
          <span className="font-mono text-[10px] whitespace-nowrap text-primary">
            {formatRp(price)}
          </span>
          <div className="h-0 w-0 border-t-8 border-l-6 border-r-6 border-t-primary border-l-transparent border-r-transparent" />
        </div>
        <span className="absolute right-0 bottom-2 font-mono text-[10px] text-muted-foreground">
          {t("AVG")} {formatRp(marketAvg)}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {insight?.message ?? t("Loading market data…")}
        {isBelow ? ` ${t("This listing is")} ~${Math.abs(Math.round(rel))}% ${t("below market average.")}` : ""}
        {isAbove ? ` ${t("This listing is")} ~${Math.abs(Math.round(rel))}% ${t("above market average.")}` : ""}
      </p>
    </div>
  )
}