"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Lock, Plus, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { AddressDialog } from "@/components/address-manager"
import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { ListRowSkeleton } from "@/components/skeleton"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp, PLACEHOLDER_IMAGE, type ShippingRate } from "@/lib/api"
import { useAddresses, useCart, useCheckout, useProducts, useShippingRates } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const kurirLabel: Record<string, string> = {
  jne: "JNE",
  "j&t": "J&T",
  anteraja: "AnterAja",
  sicepat: "SiCepat",
  flat: "Flat Rp15.000",
}

function cheapest(rate: ShippingRate) {
  return rate.options.length > 0
    ? rate.options.reduce((a, b) => (b.biaya < a.biaya ? b : a), rate.options[0])
    : undefined
}

export default function CheckoutPage() {
  const router = useRouter()
  const t = useT()
  const { data: cart } = useCart()
  const { data: addresses } = useAddresses()
  const { data: productsData } = useProducts({ limit: 100 })
  const stockById = new Map((productsData?.items ?? []).map((p) => [p.product_id, p.stok]))
  const checkout = useCheckout()
  const [addressId, setAddressId] = useState("")
  const [method, setMethod] = useState("EWALLET")
  const [error, setError] = useState("")
  const [kurir, setKurir] = useState<Record<string, string>>({})

  const items = cart?.items ?? []
  const subtotal = cart?.total ?? 0
  const chosenAddress = addresses?.find((a) => a.address_id === addressId) ?? addresses?.[0]

  const { data: rates, isLoading: ratesLoading } = useShippingRates(chosenAddress?.address_id)

  // ponytail: default = kurir termurah; state hanya menimpa kalau user pilih manual
  const chosen = (r: ShippingRate) => kurir[r.seller_id] ?? cheapest(r)?.kurir ?? ""

  const shippingCost = (rates ?? []).reduce((sum, r) => {
    const opt = r.options.find((o) => o.kurir === chosen(r)) ?? cheapest(r)
    return sum + (opt?.biaya ?? 0)
  }, 0)

  const total = subtotal + shippingCost

  async function onCheckout() {
    setError("")
    if (!chosenAddress) {
      setError(t("Choose or create a shipping address first."))
      return
    }
    const bad = items.find((it) => {
      const stok = stockById.get(it.product_id)
      return typeof stok === "number" && stok < it.jumlah
    })
    if (bad) {
      setError(`${t("Insufficient stock")}: ${bad.nama_produk ?? "..."} (${t("Stock")} ${stockById.get(bad.product_id) ?? 0})`)
      return
    }
    try {
      const pengiriman =
        rates && rates.length > 0
          ? rates.map((r) => ({ seller_id: r.seller_id, kurir: chosen(r) }))
          : undefined
      const data = await checkout.mutateAsync({
        address_id: chosenAddress.address_id,
        metode_pembayaran: method,
        pengiriman,
      })
      // ponytail: backend kirim ARRAY (satu entry per seller) — pakai entry pertama
      const first = data[0]
      if (first?.payment_url) {
        window.location.href = first.payment_url
        return
      }
      toast.success(t("Order created"), { description: `#${first?.order_id ?? "-"}` })
      router.push(`/profile/orders/${first?.order_id}`)
    } catch (e) {
      setError(errMessage(e))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Checkout" />
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest">
        <div className="relative mx-auto flex max-w-[1280px] items-center justify-center px-5 py-4 md:px-10">
          <Link
            href="/home"
            className="font-heading text-[32px] leading-8 font-bold tracking-tighter text-primary uppercase"
          >
            SNEAKHUB
          </Link>
          <span className="absolute right-5 flex items-center gap-2 text-sm font-medium text-on-surface-variant md:right-10">
            <Lock className="size-4" fill="currentColor" />
            {t("Encrypted")}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-10 md:py-12">
        <div className="mb-8">
          <h1 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-[48px] md:leading-12">
            {t("Checkout")}
          </h1>
          <p className="mt-2 text-base leading-6 text-on-surface-variant">
            {t("Complete your technical transaction.")}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="w-full space-y-6 lg:w-2/3">
            {/* Step 1: Alamat */}
            <div className="relative border border-primary bg-surface-container-lowest p-6">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                <span className="flex size-8 items-center justify-center bg-primary text-xs leading-4 font-bold text-white">
                  01
                </span>
                {t("Shipping Address")}
              </h2>
              <AddressDialog
                trigger={
                  <>
                    <Plus className="size-4" /> {t("Add Address")}
                  </>
                }
              />
              {addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <label
                      key={a.address_id}
                      className="flex cursor-pointer items-start gap-3 border border-outline bg-background p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-surface-container-low"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === a.address_id || (!addressId && a === chosenAddress)}
                        onChange={() => setAddressId(a.address_id)}
                        className="mt-1 accent-primary"
                      />
                      <span>
                        <span className="block font-heading text-base font-bold text-primary">
                          {a.nama_penerima} • {a.nomor_telepon}
                          {a.is_default ? (
                            <span className="ml-2 border border-primary px-1 py-0.5 text-[10px] font-bold uppercase">
                              Default
                            </span>
                          ) : null}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {a.alamat}, {a.kota}, {a.provinsi} {a.kode_pos}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="border border-dashed border-outline-variant p-6 text-sm text-muted-foreground">
                  {t('No address yet. Click "Add Address" above to create a shipping address.')}
                </p>
              )}
            </div>

            {/* Step 2: Metode pembayaran */}
            <div className="relative border border-primary bg-surface-container-lowest p-6">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                <span className="flex size-8 items-center justify-center bg-primary text-xs leading-4 font-bold text-white">
                  02
                </span>
                {t("Payment Details")}
              </h2>              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: "EWALLET", label: "E-Wallet (QRIS)" },
                  { value: "BANK_TRANSFER", label: "Bank Transfer / VA" },
                ].map((m) => (
                  <label
                    key={m.value}
                    className="flex cursor-pointer items-center gap-3 border border-outline bg-background p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-surface-container-low"
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.value}
                      checked={method === m.value}
                      onChange={() => setMethod(m.value)}
                      className="accent-primary"
                    />
                    <span className="font-heading text-sm font-bold text-primary uppercase">
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Pengiriman (smart ongkir) */}
            <div className="relative border border-primary bg-surface-container-lowest p-6">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                <span className="flex size-8 items-center justify-center bg-primary text-xs leading-4 font-bold text-white">
                  03
                </span>
                {t("Shipping Method")}
              </h2>
              {!chosenAddress ? (
                <p className="border border-dashed border-outline-variant p-6 text-sm text-muted-foreground">
                  {t("Select a shipping address to calculate shipping costs.")}
                </p>
              ) : ratesLoading ? (
                <div className="space-y-2">
                  <ListRowSkeleton bars={1} />
                </div>
              ) : !rates || rates.length === 0 ? (
                <p className="border border-dashed border-outline-variant p-6 text-sm text-muted-foreground">
                  {t("Shipping rates unavailable. Flat rate Rp15.000 will be applied.")}
                </p>
              ) : (
                <div className="space-y-4">
                  {rates.map((r) => (
                    <div key={r.seller_id} className="border border-outline bg-background p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="font-heading text-sm font-bold text-primary uppercase">
                          {r.nama_toko}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(r.berat / 1000).toFixed(1)} kg • {r.kota_asal}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {r.options.map((o) => (
                          <label
                            key={o.kurir}
                            className={`flex cursor-pointer items-center justify-between gap-3 border p-3 transition-colors ${
                              chosen(r) === o.kurir
                                ? "border-primary bg-surface-container-low"
                                : "border-outline bg-surface-container-lowest"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`kurir-${r.seller_id}`}
                                checked={chosen(r) === o.kurir}
                                onChange={() => setKurir((prev) => ({ ...prev, [r.seller_id]: o.kurir }))}
                                className="accent-primary"
                              />
                              <span>
                                <span className="block font-heading text-sm font-bold text-primary uppercase">
                                  {kurirLabel[o.kurir.toLowerCase()] ?? o.kurir} • {o.service}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {o.estimasi}
                                  {o.is_fallback ? ` • ${t("Flat rate")}` : ""}
                                </span>
                              </span>
                            </span>
                            <span className="font-heading text-base font-black text-primary">
                              {formatRp(o.biaya)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error ? (
              <p className="flex items-center gap-2 bg-error/10 px-3 py-2 text-xs font-bold text-error">
                <AlertCircle className="size-4 shrink-0" /> {error}
              </p>
            ) : null}

            <Button
              type="button"
              onClick={onCheckout}
              disabled={checkout.isPending || items.length === 0}
              className="mt-6 h-auto w-full rounded-none border border-primary bg-primary px-8 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary md:w-auto"
            >
              {checkout.isPending ? t("Processing…") : t("Pay Now")}
            </Button>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 border border-outline bg-surface-container-lowest p-6">
              <h3 className="mb-4 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                {t("Order Summary")}
              </h3>
              {!cart ? (
                <div className="space-y-2">
                  <ListRowSkeleton bars={1} />
                </div>
              ) : items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-heading text-xl leading-7 font-semibold text-primary uppercase">
                    {t("Your cart is empty")}
                  </p>
                  <Link
                    href="/cart"
                    className="mt-3 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
                  >
                    {t("Back to Cart")}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-4">
                    {items.map((item) => (
                      <div key={item.cart_item_id} className="flex gap-4">
                        <div className="relative size-20 shrink-0 border border-outline bg-surface-container">
                          <Image
                            src={item.image_url || PLACEHOLDER_IMAGE}
                            alt={item.nama_produk ?? t("Product")}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            {item.jumlah}
                          </span>
                        </div>
                        <div className="flex grow flex-col justify-between">
                          <div>
                            <p className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                              {item.nama_produk ?? t("Product")}
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              {t("Stock")} {stockById.get(item.product_id) ?? "-"}
                            </p>
                          </div>
                          <p className="font-heading text-2xl leading-7 font-semibold text-primary">
                            {formatRp((item.harga ?? 0) * item.jumlah)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6 space-y-3 border-t border-outline pt-4 text-base leading-6 text-on-surface-variant">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatRp(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Shipping")}</span>
                      <span>{ratesLoading ? t("…") : formatRp(rates && rates.length > 0 ? shippingCost : 15000)}</span>
                    </div>
                  </div>
                  <div className="mb-6 flex items-end justify-between border-t border-primary pt-4">
                    <span className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      Total
                    </span>
                    <span className="font-heading text-[36px] leading-9 font-bold text-primary">
                      {ratesLoading ? t("…") : formatRp(rates && rates.length > 0 ? total : subtotal + 15000)}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 border border-outline bg-surface p-4">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-on-tertiary-container" />
                    <div>
                      <p className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                        {t("SneakHub Verified")}
                      </p>
                      <p className="mt-1 text-sm leading-tight text-on-surface-variant">
                        {t("Every item passes our strict, multi-point physical and technical authentication protocol before shipping.")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter variant="dark" />
    </div>
  )
}