"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp, PLACEHOLDER_IMAGE } from "@/lib/api"
import { useCreateReview, useOrder } from "@/lib/hooks"

const statusLabel: Record<string, string> = {
  pending: "Pending",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Pilih rating").max(5),
  komentar: z.string().trim().min(1, "Komentar wajib diisi"),
})

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(params.id)
  const review = useCreateReview()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")

  const isDone = order?.status_order === "selesai"

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
        body: { product_id: order?.items?.[0]?.product_id ?? "", ...parsed.data },
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
                      order.status_order === "selesai"
                        ? "bg-primary border-primary text-white"
                        : "bg-surface-container border-outline text-primary"
                    }`}
                  >
                    {statusLabel[order.status_order ?? ""] ?? order.status_order ?? "-"}
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
              <div className="sticky top-8 border border-outline bg-surface-container-lowest p-6">
                <h3 className="mb-4 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                  Total
                </h3>
                <p className="font-heading text-[36px] leading-9 font-black text-primary">
                  {formatRp(order.total_pembayaran ?? 0)}
                </p>

                {isDone ? (
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
        )}
      </main>
      <SiteFooter />
    </div>
  )
}