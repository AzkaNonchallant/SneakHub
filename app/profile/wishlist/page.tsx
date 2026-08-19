"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bell, BellOff, Heart, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { PageMeta } from "@/components/page-meta"
import { ProductCardSkeleton } from "@/components/skeleton"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp, PLACEHOLDER_IMAGE } from "@/lib/api"
import { useAddCartItems, usePriceAlert, useRemoveWishlist, useRestockAlert, useWishlist } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export default function WishlistPage() {
  const t = useT()
  const router = useRouter()
  const { data, isLoading } = useWishlist()
  const removeWishlist = useRemoveWishlist()
  const priceAlert = usePriceAlert()
  const restockAlert = useRestockAlert()
  const addToCart = useAddCartItems()
  const [pending, setPending] = useState<string | null>(null)

  const items = data ?? []

  const mutate = async (fn: () => Promise<unknown>, key: string) => {
    setPending(key)
    try {
      await fn()
    } catch (err) {
      toast.error(errMessage(err))
    } finally {
      setPending(null)
    }
  }

  const onPriceAlert = (w: (typeof items)[number]) =>
    mutate(() => priceAlert.mutateAsync({ productId: w.product_id }), w.product_id)

  const onRestockAlert = (w: (typeof items)[number]) =>
    mutate(() => restockAlert.mutateAsync({ productId: w.product_id }), w.product_id)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Wishlist" />
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-4 py-8 md:px-10 md:py-12">
        <header className="mb-12 flex items-end justify-between border-b-2 border-primary pb-4">
          <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
            Wishlist
          </h1>
          <span className="hidden font-mono text-sm font-medium text-muted-foreground md:block">
            {items.length} {t("ITEMS TRACKED")}
          </span>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border border-primary bg-surface-container-low p-12 text-center">
            <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              {t("No wishlist yet")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("Add products from product pages to start tracking prices.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="order-1 grid grid-cols-1 gap-5 md:grid-cols-2 lg:order-2 lg:col-span-9">
              {items.map((item) => {
                const busy = pending === item.product_id
                return (
                  <article
                    key={item.wishlist_id}
                    onClick={() => router.push(`/product/${item.product_id}`)}
                    className="group relative flex cursor-pointer flex-col border border-primary bg-surface-container-lowest transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span
                      className={`absolute top-4 left-4 z-10 border border-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase ${
                        item.price_alert?.enabled ? "bg-[#f59e0b] text-white" : "bg-on-tertiary-container text-white"
                      }`}
                    >
                      {item.price_alert?.enabled ? t("PRICE ALERT ON") : t("TRACKED")}
                    </span>
                    <div className="relative flex aspect-square items-center justify-center border-b border-primary bg-surface-container p-6">
                      <Image
                        src={item.image_url || PLACEHOLDER_IMAGE}
                        alt={item.nama_produk}
                        fill
                        sizes="(max-width:768px) 100vw, 300px"
                        className="max-h-[80%] w-auto object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex grow flex-col p-6">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                            {item.nama_produk}
                          </h3>
                          <p className="mt-1 font-mono text-sm font-medium text-muted-foreground">
                            {t("Stock:")} {item.status_stok_terakhir ?? "-"}
                          </p>
                        </div>
                        <Heart
                          aria-label={t("In wishlist")}
                          className="size-5 shrink-0 cursor-pointer text-on-tertiary-container"
                          fill="currentColor"
                          onClick={(e) => {
                            e.stopPropagation()
                            mutate(() => removeWishlist.mutateAsync(item.product_id), item.product_id)
                          }}
                        />
                      </div>
                      <div className="mt-4 mb-2 flex items-end gap-3">
                        <span className="font-heading text-[32px] leading-none font-bold text-primary">
                          {formatRp(item.harga)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-outline-variant pt-4">
                        <Button
                          type="button"
                          disabled={busy}
                          onClick={(e) => {
                            e.stopPropagation()
                            onPriceAlert(item)
                          }}
                          className={
                            item.price_alert?.enabled
                              ? "flex h-auto items-center justify-center gap-2 rounded-none border border-[#f59e0b] bg-[#f59e0b] py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-[#f59e0b] disabled:opacity-40"
                              : "flex h-auto items-center justify-center gap-2 rounded-none border border-primary bg-primary py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary disabled:opacity-40"
                          }
                        >
                          <Bell className="size-3.5" />
                          {item.price_alert?.enabled ? t("Price Alert On") : t("Notify on Price Drop")}
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            disabled={busy}
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart.mutate([{ product_id: item.product_id, jumlah: 1 }])
                            }}
                            className="h-auto rounded-none border border-primary bg-primary py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary disabled:opacity-40"
                          >
                            {t("Move to Cart")}
                          </Button>
                          <Button
                            type="button"
                            disabled={busy}
                            onClick={(e) => {
                              e.stopPropagation()
                              onRestockAlert(item)
                            }}
                            className={
                              item.restock_alert?.enabled
                                ? "h-auto rounded-none border border-on-tertiary-container bg-on-tertiary-container py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-on-tertiary-container disabled:opacity-40"
                                : "h-auto rounded-none border border-outline bg-surface-container py-3 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:bg-surface-variant disabled:opacity-40"
                            }
                          >
                            <RefreshCw className="size-3.5" />
                            {item.restock_alert?.enabled ? t("Restock On") : t("Restock Alert")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="order-2 mt-8 lg:order-1 lg:col-span-3 lg:mt-0">
              <div className="sticky top-24 border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="mb-2 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  {t("Price Alerts")}
                </h2>
                <p className="mb-4 text-xs leading-4 text-muted-foreground">
                  {t("Turn on alerts to get notified whenever the price drops, any amount.")}
                </p>
                <div className="flex flex-col gap-4 border-t border-outline-variant pt-4">
                  <div className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] uppercase">
                    {items.some((i) => i.price_alert?.enabled) ? (
                      <>
                        <Bell className="size-4 text-[#f59e0b]" />
                        <span className="text-[#f59e0b]">{items.filter((i) => i.price_alert?.enabled).length} {t("active")}</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t("No active alerts")}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] uppercase">
                    {items.some((i) => i.restock_alert?.enabled) ? (
                      <>
                        <RefreshCw className="size-4 text-on-tertiary-container" />
                        <span className="text-on-tertiary-container">
                          {items.filter((i) => i.restock_alert?.enabled).length}{" "}
                          {t(items.filter((i) => i.restock_alert?.enabled).length === 1 ? "restock alert" : "restock alerts")}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t("No restock alerts")}</span>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}