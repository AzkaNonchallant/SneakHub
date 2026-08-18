"use client"

import Link from "next/link"
import { Lock, Minus, Plus, ShieldCheck, X } from "lucide-react"
import { motion } from "motion/react"

import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { formatRp, PLACEHOLDER_IMAGE, type ApiCartItem } from "@/lib/api"
import { useCart, useDeleteCartItem, useProducts, useUpdateCartItem } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

function CartItemRow({
  item,
  stock,
  onChange,
  onRemove,
}: {
  item: ApiCartItem
  stock?: number
  onChange: (qty: number) => void
  onRemove: () => void
}) {
  const t = useT()
  const name = item.nama_produk ?? t("Product")
  const image = item.image_url || PLACEHOLDER_IMAGE
  const price = item.harga ?? 0
  const size = "-"
  const maxQty = typeof stock === "number" ? stock : undefined
  const outOfStock = typeof stock === "number" && stock <= 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col border border-outline bg-surface-container-lowest sm:flex-row"
    >
      <div className="relative flex aspect-square w-full items-center justify-center border-b border-outline bg-surface-container-low p-4 sm:aspect-auto sm:w-48 sm:border-r sm:border-b-0">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover mix-blend-multiply"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="font-heading text-2xl leading-7 font-semibold tracking-tight text-primary uppercase">
                <Link href={`/product/${item.product_id}`} className="hover:underline">
                  {name}
                </Link>
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {formatRp(item.subtotal ?? price * item.jumlah)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${name}`}
              onClick={onRemove}
              className="rounded-none text-muted-foreground hover:text-error"
            >
              <X />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 border border-outline bg-surface-container-highest px-3 py-1">
              <span className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                {t("Size")}
              </span>
              <span className="font-heading text-[18px] font-semibold leading-7 text-primary">
                {size}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="flex items-center border border-outline bg-background">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onChange(Math.max(1, item.jumlah - 1))}
              className="px-3 py-1 text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="border-x border-outline px-4 py-1 text-sm font-medium">{item.jumlah}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={outOfStock || (typeof maxQty === "number" && item.jumlah >= maxQty)}
              onClick={() => onChange(item.jumlah + 1)}
              className="px-3 py-1 text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <div className="text-right">
            {outOfStock ? (
              <span className="block border border-error px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-error uppercase">
                {t("Out of Stock")}
              </span>
            ) : typeof stock === "number" ? (
              <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {t("Stock")} {stock}
              </span>
            ) : null}
            <div className="font-heading text-2xl leading-7 font-semibold text-primary">
              {formatRp(price * item.jumlah)}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function CartPage() {
  const t = useT()
  const { data: cart } = useCart()
  const updateItem = useUpdateCartItem()
  const deleteItem = useDeleteCartItem()
  const { data: productsData } = useProducts({ limit: 100 })
  // ponytail: stok per produk dari endpoint publik (cart item tidak bawa stok)
  const stockById = new Map((productsData?.items ?? []).map((p) => [p.product_id, p.stok]))

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Cart" />
      {/* ponytail: transactional header — nav suppressed per mockup */}
      <header className="sticky top-0 z-50 w-full border-b border-outline bg-background">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/home"
            className="font-heading text-4xl leading-10 font-bold tracking-tighter text-primary uppercase md:text-5xl md:leading-[48px]"
          >
            SNEAKHUB
          </Link>
          <span className="inline-flex items-center gap-2 text-xs leading-4 font-bold tracking-widest text-muted-foreground uppercase">
            <Lock className="size-4" /> {t("Secure Checkout")}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
            {t("Cart")}
          </h1>
          <p className="mt-2 text-lg leading-7 text-muted-foreground">
            {items.length} {items.length === 1 ? t("Item") : t("Items")} {t("in your cart.")}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="border border-outline bg-surface-container-lowest p-16 text-center">
            <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              {t("Your cart is empty")}
            </p>
            <Link
              href="/home"
              className="mt-4 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
            >
              {t("Back to Shop")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              {items.map((item) => (
                <CartItemRow
                  key={item.cart_item_id}
                  item={item}
                  stock={stockById.get(item.product_id)}
                  onChange={(qty) => updateItem.mutate({ id: item.cart_item_id, jumlah: qty })}
                  onRemove={() => deleteItem.mutate(item.cart_item_id)}
                />
              ))}
            </div>

            <div className="lg:sticky lg:top-[100px] lg:col-span-4">
              <div className="relative flex flex-col gap-6 border border-outline bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  {t("Order Summary")}
                </h2>
                <div className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{t("Subtotal")}</span>
                    <span className="font-bold text-primary">{formatRp(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Shipping")}</span>
                    <span className="text-right">{t("Calculated at next step")}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-outline pt-4">
                  <span className="font-heading text-[18px] font-semibold text-primary uppercase">
                    {t("Total")}
                  </span>
                  <span className="font-heading text-[32px] leading-none font-bold text-primary">
                    {formatRp(subtotal)}
                  </span>
                </div>
                <Button
                  type="button"
                  nativeButton={false}
                  render={<Link href="/checkout" />}
                  className="mt-2 h-auto rounded-none border border-primary bg-primary py-4 text-xs leading-4 font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary"
                >
                  {t("Checkout")}
                </Button>
                <div className="mt-4 flex items-start gap-3 border border-outline bg-surface-container-low p-4">
                  <ShieldCheck
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-on-tertiary-container"
                  />
                  <div>
                    <h4 className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                      {t("Authentication Process")}
                    </h4>
                    <p className="mt-1 text-xs leading-tight text-muted-foreground">
                      {t("Every item passes rigorous multi-point verification before shipping.")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter variant="dark" />
    </div>
  )
}