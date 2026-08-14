"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, Heart, Info, LineChart } from "lucide-react"
import { notFound } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { formatRp, PLACEHOLDER_IMAGE } from "@/lib/api"
import { useAddCartItems, useProduct } from "@/lib/hooks"
import { useWishlistStore } from "@/lib/wishlist-store"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id)
  const { data: product, isLoading } = useProduct(id)
  const [activeImage, setActiveImage] = useState(0)

  const addToCart = useAddCartItems()
  const wishlist = useWishlistStore((s) => s.items)
  const addWishlist = useWishlistStore((s) => s.add)
  const removeWishlist = useWishlistStore((s) => s.remove)

  if (isLoading) return <div className="p-10 font-heading text-2xl text-primary uppercase">Loading…</div>
  if (!product) notFound()

  const gallery =
    product.images && product.images.length > 0
      ? product.images.map((i) => i.image_url)
      : [product.image_url || PLACEHOLDER_IMAGE]
  const conditionScore = product.condition_score ?? 0
  const marketPrice = Math.round(product.harga * 1.1)
  const sellerName = product.seller?.nama_toko ?? "SneakHub Seller"
  const inWishlist = wishlist.some((i) => i.id === id)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-12 md:px-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
          <Link href="/home" className="transition-colors hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-primary">{product.nama_produk}</span>
        </nav>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-low p-8">
              <span className="absolute top-4 left-4 border border-primary bg-surface-container-highest px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Condition: {product.kondisi}
              </span>
              <img
                src={gallery[activeImage]}
                alt={product.nama_produk}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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
                      ? "flex aspect-square cursor-pointer items-center justify-center border border-primary bg-surface-container-low"
                      : "flex aspect-square cursor-pointer items-center justify-center border border-outline-variant bg-surface-container-low transition-colors hover:border-primary"
                  }
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-2" />
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
                  Stok {product.stok} • {product.ukuran_tersedia.length} ukuran
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => addToCart.mutate([{ product_id: product.product_id, jumlah: 1 }])}
                className="h-auto rounded-none border border-primary bg-primary py-4 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-background hover:text-primary"
              >
                Add to Cart
              </Button>
              <Button
                type="button"
                onClick={() =>
                  inWishlist ? removeWishlist(id) : addWishlist({
                    id,
                    name: product.nama_produk,
                    colorway: "",
                    price: product.harga,
                    tag: "NEW",
                    score: String(conditionScore),
                    image: gallery[0],
                    alt: product.nama_produk,
                  })
                }
                className="h-auto rounded-none border border-primary bg-background py-4 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase transition-colors hover:bg-surface-container-low"
              >
                <Heart className="size-4" fill={inWishlist ? "currentColor" : "none"} />
                {inWishlist ? "In Wishlist" : "Wishlist"}
              </Button>
            </div>

            <div className="flex flex-col gap-4 border border-outline-variant bg-surface p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  Condition Score
                </h3>
                <span className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase">
                  Overall <span className="text-base font-bold">{conditionScore}/10</span>
                </span>
              </div>
              <div className="h-1 w-full bg-surface-container">
                <div className="h-1 bg-primary" style={{ width: `${conditionScore * 10}%` }} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {product.deskripsi || "Produk ini terverifikasi oleh SneakHub."}
              </p>
            </div>

            <div className="flex flex-col gap-4 border border-outline-variant bg-surface p-6">
              <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                Ukuran Tersedia
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
                  <span className="text-sm text-muted-foreground">Belum ada ukuran terdaftar.</span>
                )}
              </div>
            </div>

            <div className="relative flex flex-col gap-4 overflow-hidden border border-outline-variant bg-surface p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="size-5 text-on-tertiary-container" fill="currentColor" />
                  <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                    Price Insight
                  </h3>
                </div>
                <span className="text-xs leading-4 font-bold tracking-[0.05em] text-on-tertiary-container uppercase">
                  {product.harga < marketPrice ? "Below Market" : "At Market"}
                </span>
              </div>
              <div className="relative mt-4 flex h-12 w-full items-end">
                <div className="absolute bottom-0 h-1 w-full bg-surface-container-high" />
                <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[#10B981]" />
                <div className="absolute bottom-0 left-[20%] flex -translate-x-1/2 translate-y-2 flex-col items-center">
                  <div className="mb-1 h-0 w-0 border-b-8 border-l-6 border-r-6 border-b-primary border-l-transparent border-r-transparent" />
                  <span className="rounded-sm bg-primary px-2 py-1 font-mono text-[10px] whitespace-nowrap text-white">
                    THIS LISTING
                  </span>
                </div>
                <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 -translate-y-8 flex-col items-center">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    MARKET AVG: {formatRp(marketPrice)}
                  </span>
                  <div className="mt-1 h-6 w-0.5 bg-secondary" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Listed {Math.round((1 - product.harga / marketPrice) * 100)}% below current average
                market value for similar condition.
              </p>
            </div>

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
                    Verified Merchant
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-heading text-2xl leading-7 font-semibold text-[#10B981]">
                  {product.seller?.seller_trust_score ?? "-"}/100
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  TRUST SCORE <Info className="size-3" />
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