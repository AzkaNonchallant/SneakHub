"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, MapPin, Star, Truck } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp, PLACEHOLDER_IMAGE } from "@/lib/api"
import { useConfirmOrder, useCreateReview, useOrder, useUpdateOrderStatus } from "@/lib/hooks"

const norm = (s?: string) => (s ?? "").toLowerCase()

// ponytail: backend live campur ID + EN ("dikirim"/"shipped") — norm() + kedua key
const statusLabel: Record<string, string> = {
  pending: "Pending",
  diproses: "Diproses",
  processing: "Diproses",
  dikirim: "Dikirim",
  shipped: "Dikirim",
  selesai: "Selesai",
  completed: "Selesai",
  dibatalkan: "Dibatalkan",
  cancelled: "Dibatalkan",
}

const kurirLabel: Record<string, string> = {
  jne: "JNE",
  "j&t": "J&T",
  anteraja: "AnterAja",
  sicepat: "SiCepat",
  flat: "Flat Rp15.000",
}

const pengirimanLabel: Record<string, string> = {
  menunggu: "Menunggu dikirim",
  dikirim: "Sedang dikirim",
  shipped: "Sedang dikirim",
  selesai: "Sudah diterima",
  diterima: "Sudah diterima",
}

const paymentLabel: Record<string, string> = {
  pending: "Belum dibayar",
  paid: "Lunas",
  failed: "Gagal",
  expired: "Kedaluwarsa",
  refunded: "Dikembalikan",
}

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Pilih rating").max(5),
  komentar: z.string().trim().min(1, "Komentar wajib diisi"),
})

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: order, isLoading } = useOrder(params.id)
  const review = useCreateReview()
  const updateStatus = useUpdateOrderStatus()
  const confirm = useConfirmOrder()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  // ponytail: product reviewable dari response confirm (tanpa refetch); fallback order.items
  const [confirmItems, setConfirmItems] = useState<{ product_id: string; nama_produk: string }[] | null>(null)
  const reviewProduct = (confirmItems ?? order?.items)?.[0]

  const isDone = ["selesai", "completed"].includes(norm(order?.status_order))
  const isPendingPayment =
    norm(order?.status_order) === "pending" && norm(order?.payment?.status_pembayaran) === "pending"
  const isShipped = ["dikirim", "shipped"].includes(norm(order?.status_order))

  const confirmReceipt = async () => {
    try {
      const res = await confirm.mutateAsync(order!.order_id)
      setConfirmItems(res?.items ?? null)
      router.refresh()
      toast.success("Pesanan selesai — terima kasih!")
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const cancelOrder = async () => {
    if (!order) return
    if (!window.confirm("Batalkan pesanan ini? Stok produk akan dikembalikan.")) return
    try {
      await updateStatus.mutateAsync({ id: order.order_id, status_order: "dibatalkan" })
      toast.success("Pesanan dibatalkan")
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const parsed = reviewSchema.safeParse({ rating, komentar: comment })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "")
      return
    }
    try {
      await review.mutateAsync({
        orderId: params.id,
        body: { product_id: reviewProduct?.product_id ?? "", ...parsed.data },
      })
      toast.success("Ulasan terkirim")
      setComment("")
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-10 md:py-12">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:text-on-tertiary-container"
        >
          <ArrowLeft className="size-4" /> Kembali ke Pesanan
        </Link>

        {isLoading || !order ? (
          <p className="border border-dashed border-outline-variant p-10 text-center text-sm text-muted-foreground">
            Memuat detail pesanan…
          </p>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <div className="flex-1">
              <div className="mb-6 border border-outline bg-surface-container-lowest p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Nomor Pesanan
                    </span>
                    <span className="font-mono text-sm font-medium text-primary">
                      {order.order_id}
                    </span>
                  </div>
                  <span
                    className={`border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                      isDone ? "bg-primary border-primary text-white" : "bg-surface-container border-outline text-primary"
                    }`}
                  >
                    {statusLabel[norm(order.status_order)] ?? order.status_order ?? "-"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {order.created_at ? new Date(order.created_at).toLocaleString("id-ID") : ""}
                </p>
              </div>

              <h2 className="mb-4 border-b-2 border-primary pb-2 font-heading text-2xl leading-7 font-bold text-primary uppercase">
                Item Pesanan
              </h2>
              <div className="flex flex-col gap-3">
                {(order.items ?? []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border border-outline bg-surface-container-lowest p-4"
                  >
                    <div className="size-16 shrink-0 border border-outline bg-surface-container-low">
                      <img
                        src={PLACEHOLDER_IMAGE}
                        alt={item.nama_produk ?? "Produk"}
                        className="h-full w-full object-contain p-1 mix-blend-multiply"
                      />
                    </div>
                    <div className="flex grow flex-col gap-1">
                      <span className="font-heading text-lg leading-6 font-semibold text-primary uppercase">
                        {item.nama_produk ?? "Produk"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Jumlah: {item.jumlah ?? "-"}
                      </span>
                      <span className="font-heading text-xl leading-6 font-black text-primary">
                        {formatRp((item.harga_saat_transaksi ?? 0) * (item.jumlah ?? 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80">
              <div className="sticky top-8 flex flex-col gap-4">
                {/* Pembayaran */}
                {order.payment ? (
                  <div
                    className={`border bg-surface-container-lowest p-6 ${
                      isPendingPayment ? "border-error" : "border-outline"
                    }`}
                  >
                    <h3 className="mb-4 flex items-center gap-2 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      <CreditCard className="size-5" /> Pembayaran
                    </h3>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        {paymentLabel[norm(order.payment.status_pembayaran)] ??
                          order.payment.status_pembayaran}
                      </span>
                      <span className="font-heading text-base font-black text-primary">
                        {formatRp(order.payment.jumlah)}
                      </span>
                    </div>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">
                      Metode: {order.payment.metode_pembayaran}
                    </p>
                    {isPendingPayment ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs leading-4 font-bold text-error uppercase">
                          Selesaikan pembayaran untuk memproses pesanan.
                        </p>
                        {order.payment.payment_url ? (
                          <Button
                            type="button"
                            onClick={() => window.open(order.payment!.payment_url!, "_blank")}
                            className="h-auto rounded-none border border-primary bg-primary px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
                          >
                            Lanjutkan Pembayaran
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={cancelOrder}
                          className="h-auto rounded-none border border-error bg-background px-4 py-2 text-xs font-bold tracking-widest text-error uppercase transition-colors hover:bg-error hover:text-white"
                        >
                          {updateStatus.isPending ? "Memproses…" : "Batalkan Pesanan"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Konfirmasi terima */}
                {isShipped ? (
                  <div className="border border-primary bg-surface-container-lowest p-6">
                    <h3 className="mb-4 flex items-center gap-2 border-b border-primary pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      <Truck className="size-5" /> Paket Sudah Tiba?
                    </h3>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">
                      Konfirmasi setelah barang diterima untuk menyelesaikan pesanan dan membuka ulasan.
                    </p>
                    <Button
                      type="button"
                      disabled={confirm.isPending}
                      onClick={confirmReceipt}
                      className="h-auto w-full rounded-none border border-primary bg-primary px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
                    >
                      {confirm.isPending ? "Memproses…" : "Konfirmasi Terima"}
                    </Button>
                  </div>
                ) : null}

                {/* Pengiriman */}
                {order.shipment ? (
                  <div className="border border-outline bg-surface-container-lowest p-6">
                    <h3 className="mb-4 flex items-center gap-2 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      <Truck className="size-5" /> Pengiriman
                    </h3>
                    <dl className="space-y-3 text-sm leading-6">
                      <div className="flex justify-between gap-3">
                        <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                          Kurir
                        </dt>
                        <dd className="font-heading text-sm font-bold text-primary uppercase">
                          {kurirLabel[order.shipment.kurir?.toLowerCase() ?? ""] ?? order.shipment.kurir ?? "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                          Status
                        </dt>
                        <dd className="font-bold text-primary uppercase">
                          {pengirimanLabel[norm(order.shipment.status_pengiriman)] ??
                            order.shipment.status_pengiriman ??
                            "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                          No. Resi
                        </dt>
                        <dd className="font-mono text-sm font-medium text-primary">
                          {order.shipment.nomor_resi ?? "-"}
                        </dd>
                      </div>
                      {order.shipment.shipped_at ? (
                        <div className="flex justify-between gap-3">
                          <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Dikirim
                          </dt>
                          <dd className="font-mono text-sm">
                            {new Date(order.shipment.shipped_at).toLocaleString("id-ID")}
                          </dd>
                        </div>
                      ) : null}
                      {order.shipment.delivered_at ? (
                        <div className="flex justify-between gap-3">
                          <dt className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Tiba
                          </dt>
                          <dd className="font-mono text-sm">
                            {new Date(order.shipment.delivered_at).toLocaleString("id-ID")}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ) : null}

                {/* Alamat pengiriman */}
                {order.alamat_pengiriman ? (
                  <div className="border border-outline bg-surface-container-lowest p-6">
                    <h3 className="mb-4 flex items-center gap-2 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      <MapPin className="size-5" /> Alamat
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      <span className="font-heading text-base font-bold text-primary uppercase">
                        {order.alamat_pengiriman.nama_penerima}
                      </span>
                      <span className="block">{order.alamat_pengiriman.nomor_telepon}</span>
                      <span className="block">
                        {order.alamat_pengiriman.alamat}, {order.alamat_pengiriman.kota},{" "}
                        {order.alamat_pengiriman.provinsi} {order.alamat_pengiriman.kode_pos}
                      </span>
                    </p>
                  </div>
                ) : null}

              <div className="border border-outline bg-surface-container-lowest p-6">
                <h3 className="mb-4 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  Total
                </h3>
                <p className="font-heading text-[36px] leading-9 font-black text-primary">
                  {formatRp(order.total_pembayaran ?? 0)}
                </p>

                {isDone || confirmItems ? (
                  <form onSubmit={submitReview} className="mt-6 flex flex-col gap-4 border-t border-outline pt-4">
                    <span className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                      Beri Ulasan
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} bintang`}
                          onClick={() => setRating(n)}
                          className={n <= rating ? "text-amber-500" : "text-outline-variant"}
                        >
                          <Star className="size-6" fill="currentColor" />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Komentar ulasan…"
                      rows={3}
                      className="w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-b-2 focus:border-ring"
                    />
                    {error ? <p className="text-xs font-bold text-error">{error}</p> : null}
                    <Button
                      type="submit"
                      disabled={review.isPending}
                      className="rounded-none"
                    >
                      {review.isPending ? "Mengirim…" : "Kirim Ulasan"}
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}