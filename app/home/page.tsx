"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import Link from "next/link"
import {
  ArrowRight,
  BrainCircuit,
  Newspaper,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { PricePredictionButton } from "@/components/price-prediction-dialog"
import { ProductCard } from "@/components/product-card"
import { ProductCardSkeleton } from "@/components/skeleton"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { formatRp, PLACEHOLDER_IMAGE, type ProductCardData } from "@/lib/api"
import { useBestSellerWeekly, useHomePersonalized, useProducts, useTrending } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
}

export default function HomePage() {
  const t = useT()
  const { data: trendingData, isLoading: trendingLoading } = useTrending({ period: "weekly", limit: 8 })
  const [bestLimit, setBestLimit] = useState(4)
  const { data: bestSellerData, isLoading: bestSellerLoading } = useBestSellerWeekly(bestLimit)
  const { data: personalizedData, isLoading: personalizedLoading } = useHomePersonalized()
  // ponytail: catalog 100 — payload trend/best-seller tidak bawa harga, resolve di sini
  const { data: productsData } = useProducts({ limit: 100, sort: "terbaru" })

  const catalog = new Map((productsData?.items ?? []).map((p) => [p.product_id, p]))

  const trending: ProductCardData[] = (trendingData?.items ?? []).map((ti) => {
    const p = catalog.get(ti.product_id)
    return {
      id: ti.product_id,
      brand: p?.brand ?? p?.seller?.nama_toko ?? "",
      name: ti.nama_produk,
      price: p ? formatRp(p.harga) : "",
      image: p?.images?.[0]?.url || p?.image_url || PLACEHOLDER_IMAGE,
      alt: ti.nama_produk,
      badge: "TRENDING",
      trend: `${ti.trend_score} ${t("SCORE")}`,
      harga: p?.harga ?? 0,
      kondisi: "",
      ukuran: [],
    }
  })
  const bestSellers: ProductCardData[] = (bestSellerData?.items ?? []).map((b) => {
    const p = catalog.get(b.product_id)
    return {
      id: b.product_id,
      brand: p?.brand ?? p?.seller?.nama_toko ?? "",
      name: b.nama_produk,
      price: p ? formatRp(p.harga) : "",
      image: p?.images?.[0]?.url || p?.image_url || PLACEHOLDER_IMAGE,
      alt: b.nama_produk,
      badge: `#${b.rank} ${t("BEST SELLER")}`,
      trend: `${b.total_terjual} ${t("SOLD")}`,
      harga: p?.harga ?? 0,
      kondisi: "",
      ukuran: [],
    }
  })
  const personalized: ProductCardData[] =
    (personalizedData?.sections[0]?.products ?? []).map((p) => {
      const full = catalog.get(p.product_id)
      return {
        id: p.product_id,
        brand: full?.brand ?? full?.seller?.nama_toko ?? "",
        name: p.nama_produk,
        price: formatRp(p.harga),
        image: p.image_url || full?.images?.[0]?.url || full?.image_url || PLACEHOLDER_IMAGE,
        alt: p.nama_produk,
        harga: p.harga,
        kondisi: "",
        ukuran: [],
      }
    })

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Home" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex min-h-[600px] w-full items-center border-b border-outline-variant bg-surface-container-lowest">
        <div className="absolute inset-0 z-0 flex justify-end">
          <div
            role="img"
            aria-label="Rare sneaker levitating against a stark white studio background"
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-90 mix-blend-multiply md:w-2/3"
            style={{
              backgroundImage:
                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAmrX73z_v2VjCwaa97Cgb3m3N-Nrmu4Khtq4nKOlcl9LKDkphbTk9HMENbmvhsZD4emfAodCDXZE4YyxJg5qKF5N-f9rs0MbPNZyKH2G9RrkL3fdskWbLhzIdlBXSoBJpm5MLFvK1d605-CC5Q70Qnfrv2IEGXxpBn-kLYSxtcoofMRoiZY49VBfB5rUODNpyVTKzxHa_8pYVxLFf8zRzzVwfvrU6EVzUv_HT7zpb-LlquDEUMJIlX)",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-10">
          <motion.div
            {...fadeUp}
            className="max-w-2xl border border-outline-variant bg-white/80 p-8 shadow-[4px_4px_0px_0px_#000] backdrop-blur-sm"
          >
            <span className="mb-4 inline-block border border-outline-variant bg-surface-container px-3 py-1 text-xs leading-4 font-bold tracking-widest text-primary uppercase">
              {t("Latest Drop")}
            </span>
            <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase sm:text-[56px] sm:leading-[56px] md:text-[72px] md:leading-[72px]">
              {t("Technical")}
              <br />
              {t("Precision")}
              <br />
              {t("In Resale.")}
            </h1>
            <p className="mb-8 mt-4 max-w-md text-lg leading-7 text-muted-foreground">
              {t("Access verified, authenticated, and high-performance footwear. Navigate the market with AI-driven insights.")}
            </p>
            <Button
              className="h-auto rounded-none border border-primary bg-primary px-8 py-4 text-xs leading-4 font-bold tracking-widest text-primary-foreground uppercase shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-surface-container-lowest hover:text-primary hover:shadow-none"
              nativeButton={false}
              render={<Link href="/search" />}
            >
              {t("Explore the Collection")}
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trending Shoes */}
      <section className="border-b border-outline-variant bg-background py-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <motion.div {...fadeUp} className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-5xl md:leading-[48px]">
                {t("Trending Shoes")}
              </h2>
              <p className="mt-2 text-base leading-6 text-muted-foreground">{t("High-growth popular sneakers.")}</p>
            </div>
            <Link
              href="/smart-find"
              className="inline-flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-on-tertiary-container uppercase transition-colors hover:text-primary"
            >
              {t("View All Market Data")}
              <TrendingUp className="size-4" />
            </Link>
          </motion.div>
          {trendingLoading ? (
            <div className="hide-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 pb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} className="w-72 shrink-0" />
              ))}
            </div>
          ) : trending.length > 0 ? (
            <div className="hide-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 pb-8 snap-x snap-mandatory [mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent)] md:-mx-10 md:px-10">
              {trending.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} priority={i < 2} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-outline-variant py-10 text-center text-sm text-muted-foreground">
              {t("No trending data for this period yet.")}
            </div>
          )}
        </div>
      </section>

      {/* Bento: Technical Advantage */}
      <section className="border-b border-outline-variant bg-surface-container-lowest py-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <motion.h2
            {...fadeUp}
            className="font-heading mb-8 text-5xl leading-[48px] font-bold text-primary uppercase"
          >
            {t("Technical Advantage")}
          </motion.h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-[400px_200px]">
            {/* AI Price Predictor */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden border border-primary bg-surface-container-low p-8 md:col-span-8"
            >
              <div
                aria-hidden
                className="absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-on-tertiary-container/10 blur-3xl transition-transform duration-500 group-hover:scale-110"
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="mb-4 inline-flex items-center gap-1 bg-primary px-3 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase">
                    <BrainCircuit className="size-3.5" /> {t("AI Engine")}
                  </span>
                  <h3 className="font-heading text-5xl leading-[48px] font-bold text-primary uppercase">
                    {t("Price Predictor")}
                  </h3>
                  <p className="mt-2 max-w-sm text-base leading-6 text-muted-foreground">
                    {t("Leverage machine learning models to forecast market trends and determine optimal listing prices with technical precision.")}
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-6 items-end justify-between sm:flex-row sm:items-end">
                  <div className="w-full max-w-md border border-outline-variant bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                        {t("Confidence Score")}
                      </span>
                      <span className="text-xs leading-4 font-bold tracking-[0.05em] text-on-tertiary-container">
                        98.4%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden bg-surface-container">
                      <div className="h-full w-[98.4%] bg-on-tertiary-container" />
                    </div>
                  </div>
                  <PricePredictionButton />
                </div>
              </div>
            </motion.div>

            {/* Rigorous Authentication */}
            <motion.div
              {...fadeUp}
              className="group relative flex flex-col justify-between overflow-hidden bg-primary p-8 text-white md:col-span-4"
            >
              <div
                role="img"
                aria-label="Macro photograph of luxury sneaker stitching in monochrome"
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-40"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuD8bkitfrXeW8K10BcMqVjXf6TZ8wm37Vdtuq-WJ5jfcITq8TVZvelGj0pASDbMDIzCUAUUvu9_w7_kSXUf72qoQN1LtxafFeRgyn4CwQKTdNy1K8uIycbhILwG1ILcvKJ_0X5qhMrZ20_2xunqWAzVRyEQeDkJkm2Yi44skEbp8bY3LzTSxfjersBr3Mr0V7uIhjcesT79ahvn16_yayCAH2BmnwWbLFgZe_vkk_Jem10VBWqvaU1I)",
                }}
              />
              <div className="relative z-10">
                <ShieldCheck className="mb-4 size-9 text-on-tertiary-container" />
                <h3 className="font-heading text-2xl leading-7 font-semibold uppercase">
                  {t("Rigorous")}
                  <br />
                  {t("Authentication")}
                </h3>
                <p className="mt-2 text-base leading-6 text-secondary-fixed-dim">
                  {t("Every item passes a multi-point inspection by certified experts before it reaches you.")}
                </p>
              </div>
              <Link
                href="/process"
                className="relative z-10 mt-8 inline-flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] uppercase transition-colors hover:text-on-tertiary-container"
              >
                {t("Process Details")} <ArrowRight className="size-4" />
              </Link>
            </motion.div>

            {/* Visual Search */}
            <motion.div
              {...fadeUp}
              className="group flex items-center justify-between border border-primary bg-surface-container p-6 md:col-span-6"
            >
              <div>
                <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  {t("Visual Search")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("Find exactly what you're looking for using image recognition.")}
                </p>
              </div>
              <Button
                type="button"
                size="icon"
                aria-label="Visual search"
                className="size-12 rounded-none border border-primary bg-white text-primary shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-on-tertiary-container hover:text-white hover:shadow-none"
                nativeButton={false}
                render={<Link href="/search" />}
              >
                <ScanSearch />
              </Button>
            </motion.div>

            {/* Weekly Digest */}
            <motion.div
              {...fadeUp}
              className="group flex items-center justify-between border border-primary bg-surface-container-highest p-6 md:col-span-6"
            >
              <div>
                <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  {t("Weekly Digest")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("Get the latest market fluctuations delivered directly.")}
                </p>
              </div>
              <Button
                type="button"
                size="icon"
                aria-label="Weekly digest"
                className="size-12 rounded-none border border-primary bg-primary text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:text-primary hover:shadow-none"
                nativeButton={false}
                render={<Link href="/profile/notifications" />}
              >
                <Newspaper />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Weekly Best Sellers */}
      <section className="border-b border-outline-variant bg-background py-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <motion.h2
            {...fadeUp}
            className="font-heading mb-8 text-5xl leading-[48px] font-bold text-primary uppercase"
          >
            {t("Weekly Best Sellers")}
          </motion.h2>
          <div className="grid grid-cols-1 gap-0 border-t border-l border-primary sm:grid-cols-2 lg:grid-cols-4">
            {bestSellerLoading ? (
            <div className="grid grid-cols-1 gap-0 border-t border-l border-primary sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} className="w-auto border-r border-b" />
              ))}
            </div>
          ) : bestSellers.length > 0 ? (
              bestSellers.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  number={i + 1}
                  index={i}
                  priority={i < 2}
                  className="w-auto border-r border-b"
                />
              ))
            ) : (
              <div className="border-b border-r border-primary p-10 text-center text-sm text-muted-foreground">
                {t("No best seller data this week yet.")}
              </div>
            )}
          </div>
          {bestSellers.length >= bestLimit ? (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                onClick={() => setBestLimit((l) => l + 4)}
                className="h-auto rounded-none border border-primary bg-white px-8 py-3 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-white"
              >
                {t("Load More Data")}
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {/* Personalized */}
      <section className="border-b border-outline-variant bg-surface-container-lowest py-16">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10">
          <motion.div {...fadeUp} className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="font-heading text-5xl leading-[48px] font-bold text-primary uppercase">
              {t("Made for You")}
            </h2>
            <div className="h-px flex-1 bg-primary" />
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t("Algorithm Generated")}
            </span>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
{personalizedLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : personalized.length > 0 ? (
            personalized.map((product, i) => (
              <motion.div
                key={product.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group border border-outline-variant bg-white p-4 transition-colors hover:border-primary"
              >
                <Link href={`/product/${product.id}`} className="flex h-full">
                <div className="relative mr-4 flex w-1/3 items-center justify-center border border-outline-variant bg-surface-container-low p-2">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width:768px) 30vw, 200px"
                    className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                      {product.brand}
                    </span>
                    <span className="border border-on-tertiary-container/30 bg-on-tertiary-container/10 px-1 text-[10px] font-bold text-on-tertiary-container">
                      {product.badge}
                    </span>
                  </div>
                  <h4 className="font-heading mb-2 text-base leading-5 font-semibold text-primary">
                    {product.name}
                  </h4>
                  <span className="font-heading text-sm font-bold text-primary">
                    {product.price}
                  </span>
                </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="border border-dashed border-outline-variant py-10 text-center text-sm text-muted-foreground">
              {t("Complete your preferences in your profile for personal recommendations.")}
            </div>
          )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}