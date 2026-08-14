"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useAddCartItems } from "@/lib/hooks"
import { useWishlistStore } from "@/lib/wishlist-store"

const alertSettings = [
  { label: "GLOBAL ALERTS", desc: "Notify me of any price drops on my wishlist.", on: true },
  { label: "RESTOCK NOTIFICATIONS", desc: "Alert when unavailable sizes return.", on: true },
  { label: "MARKET TREND DIGEST", desc: "Weekly summary of wishlist valuations.", on: false },
]

export default function WishlistPage() {
  const router = useRouter()
  const items = useWishlistStore((s) => s.items)
  const removeWishlist = useWishlistStore((s) => s.remove)
  const addToCart = useAddCartItems()
  const [alerts, setAlerts] = useState(alertSettings.map((a) => a.on))

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-4 py-8 md:px-10 md:py-12">
        <header className="mb-12 flex items-end justify-between border-b-2 border-primary pb-4">
          <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
            Wishlist
          </h1>
          <span className="hidden font-mono text-sm font-medium text-muted-foreground md:block">
            {items.length} ITEMS TRACKED
          </span>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="order-2 mt-8 lg:order-1 lg:col-span-3 lg:mt-0">
            <div className="sticky top-24 border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
              <h2 className="mb-6 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                Price Alert Settings
              </h2>
              <div className="flex flex-col gap-6">
                {alertSettings.map((setting, i) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between border-b border-outline-variant pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <h3 className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                        {setting.label}
                      </h3>
                      <p className="mt-1 text-xs leading-4 text-muted-foreground max-w-[220px]">
                        {setting.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Toggle ${setting.label}`}
                      aria-pressed={alerts[i]}
                      onClick={() =>
                        setAlerts((prev) => prev.map((v, j) => (j === i ? !v : v)))
                      }
                      className={
                        alerts[i]
                          ? "relative flex h-5 w-10 items-center bg-on-tertiary-container"
                          : "relative flex h-5 w-10 items-center bg-outline-variant"
                      }
                    >
                      <span
                        className={
                          alerts[i]
                            ? "absolute right-1 size-4 bg-white shadow-md"
                            : "absolute left-1 size-4 bg-white shadow-sm"
                        }
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="order-1 grid grid-cols-1 gap-5 md:grid-cols-2 lg:order-2 lg:col-span-9">
            {items.map((item) => (
              <article
                key={item.id}
                onClick={() => router.push(`/product/${item.id}`)}
                className="group relative flex cursor-pointer flex-col border border-primary bg-surface-container-lowest transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className={`absolute top-4 left-4 z-10 border border-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] uppercase ${
                    item.tag === "PRICE DROP" ? "bg-error text-white" : "bg-on-tertiary-container text-white"
                  }`}
                >
                  {item.tag}
                </span>
                <span className="absolute top-4 right-4 z-10 flex items-center gap-1 border border-primary bg-surface-container-highest px-2 py-1">
                  <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                    {item.score}
                  </span>
                </span>
                <div className="flex aspect-square items-center justify-center border-b border-primary bg-surface-container p-6">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="max-h-[80%] w-auto object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex grow flex-col p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-mono text-sm font-medium text-muted-foreground">
                        {item.colorway}
                      </p>
                    </div>
                    <Heart
                      aria-label="In wishlist"
                      className="size-5 shrink-0 cursor-pointer text-on-tertiary-container"
                      fill="currentColor"
                    />
                  </div>
                  <div className="mt-4 mb-6 flex items-end gap-3">
                    <span className="font-heading text-[32px] leading-none font-bold text-primary">
                      Rp{item.price.toLocaleString("id-ID")}
                    </span>
                    {item.oldPrice && (
                      <span className="mb-1 text-base leading-6 text-muted-foreground line-through">
                        Rp{item.oldPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart.mutate([{ product_id: String(item.id), jumlah: 1 }])
                        removeWishlist(item.id)
                      }}
                      className="h-auto w-full rounded-none border border-primary bg-primary py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary"
                    >
                      Move to Cart
                    </Button>
                    <Button
                      type="button"
                      className="h-auto w-full rounded-none border border-outline bg-surface-container py-3 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:bg-surface-variant"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeWishlist(item.id)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}