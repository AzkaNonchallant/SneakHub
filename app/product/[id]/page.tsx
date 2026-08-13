"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, Heart, Info, LineChart } from "lucide-react"
import { notFound } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getProductDetail, type CartItem, type ProductDetail } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"

function toCartItem(detail: ProductDetail): CartItem {
  return {
    id: detail.id,
    name: detail.name,
    colorway: detail.colorway,
    price: detail.price,
    condition: detail.condition,
    size: detail.size,
    image: detail.image,
    alt: detail.alt,
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)
  const detail = getProductDetail(id)
  const [activeImage, setActiveImage] = useState(0)

  const addToCart = useCartStore((s) => s.add)
  const wishlist = useWishlistStore((s) => s.items)
  const addWishlist = useWishlistStore((s) => s.add)
  const removeWishlist = useWishlistStore((s) => s.remove)

  if (!detail) notFound()

  const inWishlist = wishlist.some((i) => i.id === detail.id)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-12 md:px-10">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
          <Link href="/home" className="transition-colors hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="size-4" />
          {detail.brand && (
            <>
              <Link href="/home" className="transition-colors hover:text-primary">
                {detail.brand}
              </Link>
              <ChevronRight className="size-4" />
            </>
          )}
          <span className="text-primary">{detail.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-low p-8">
              <span className="absolute top-4 left-4 border border-primary bg-surface-container-highest px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                Condition: {detail.condition}
              </span>
              <img
                src={detail.gallery[activeImage]}
                alt={detail.alt}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {detail.gallery.map((img, i) => (
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
                {detail.name}
              </h1>
              {detail.colorway && (
                <h2 className="font-heading text-2xl leading-7 font-semibold text-muted-foreground">
                  {detail.colorway}
                </h2>
              )}
              <div className="mt-2 flex items-baseline gap-4">
                <span className="font-heading text-3xl leading-9 font-bold text-primary md:text-5xl md:leading-12">
                  ${detail.price.toFixed(2)}
                </span>
                <span className="text-xs leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                  {detail.size}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => addToCart(toCartItem(detail))}
                className="h-auto rounded-none border border-primary bg-primary py-4 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-background hover:text-primary"
              >
                Add to Cart
              </Button>
              <Button
                type="button"
                onClick={() =>
                  inWishlist ? removeWishlist(detail.id) : addWishlist({
                    id: detail.id,
                    name: detail.name,
                    colorway: detail.colorway,
                    price: detail.price,
                    tag: "NEW",
                    score: detail.condition,
                    image: detail.image,
                    alt: detail.alt,
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
                  Condition Breakdown
                </h3>
                <span className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase">
                  Overall <span className="text-base font-bold">{detail.condition}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {detail.breakdown.map((b) => (
                  <div key={b.label} className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-sm font-medium text-muted-foreground">
                      <span>{b.label}</span>
                      <span>{b.score}/100</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container">
                      <div className="h-1 bg-primary" style={{ width: `${b.score}%` }} />
                    </div>
                  </div>
                ))}
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
                  Below Market
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
                    MARKET AVG: ${detail.marketPrice}
                  </span>
                  <div className="mt-1 h-6 w-0.5 bg-secondary" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Listed {Math.round((1 - detail.price / detail.marketPrice) * 100)}% below current
                average market value for similar condition.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/seller-profile")}
              className="flex cursor-pointer items-center justify-between gap-4 border border-outline-variant bg-surface p-6 transition-opacity hover:opacity-80"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center border border-outline bg-surface-container-high font-heading text-2xl leading-7 font-semibold text-primary">
                  {detail.seller.initial}
                </div>
                <div className="text-left">
                  <h3 className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                    {detail.seller.name}
                  </h3>
                  <p className="font-mono text-sm font-medium text-muted-foreground">
                    {detail.seller.role}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-heading text-2xl leading-7 font-semibold text-[#10B981]">
                  {detail.seller.trust}/100
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