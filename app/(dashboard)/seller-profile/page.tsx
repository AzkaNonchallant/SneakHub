"use client"

import { CheckCircle2, Star } from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { useMe, useSellerDashboard, useSellerMe, useSellerOrders, useSellerReviews, useTrustScore } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-3 border-b border-outline-variant pb-4">
      <span className="font-heading text-sm leading-4 font-black text-on-tertiary-container">
        {number}
      </span>
      <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
        {title}
      </h2>
    </div>
  )
}

export default function SellerProfilePage() {
  const t = useT()
  const { data: user } = useMe()
  const { data: seller } = useSellerMe()
  const { data: dash } = useSellerDashboard()
  const { data: ordersData } = useSellerOrders({ limit: 100 })
  const { data: trust, isPending: trustPending, isError: trustError } = useTrustScore(seller?.seller_id)
  const { data: reviewsData } = useSellerReviews(seller?.seller_id)

  const storeName = seller?.nama_toko ?? `${user?.nama ?? t("Store")} ${t("Store")}`
  const totalOrders = ordersData?.pagination.total ?? 0
  // ponytail: backend isi skor_akhir=0 utk seller baru walau completion >0 — fallback ke completion
  const rawScore = trust?.skor_akhir ?? dash?.seller_trust_score
  const trustScore = rawScore && rawScore > 0 ? rawScore : (trust?.order_completion_rate ?? 0)

  return (
    <div className="mx-auto w-full max-w-[1280px] bg-background px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <PageMeta title="Seller Profile" />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            {t("Seller Center")}
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary uppercase">
            {t("Store Profile")}
          </h1>
        </div>
      </div>

      {/* 01 Profil */}
      <section className="mb-6 border border-outline-variant bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
        <SectionHeader number="01" title={t("Store Profile")} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-primary font-heading text-3xl leading-none font-bold text-white">
              {storeName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                {storeName}
              </h3>
              <p className="mt-1 max-w-md text-base leading-6 text-muted-foreground">
                {seller?.deskripsi_toko || user?.email}
              </p>
              {seller?.alamat_asal ? (
                <p className="mt-1 max-w-md text-sm leading-5 text-muted-foreground">
                  {seller.alamat_asal}
                  {seller.kota_asal ? `, ${seller.kota_asal}` : ""}
                  {seller.kode_pos_asal ? ` ${seller.kode_pos_asal}` : ""}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: t("TOTAL ORDERS"), value: String(totalOrders) },
            { label: t("ACTIVE PRODUCTS"), value: String(dash?.produk_aktif ?? "-") },
            { label: t("TOTAL SOLD"), value: String(dash?.total_terjual ?? "-") },
            { label: t("RATING"), value: dash?.rating_rata_rata ? String(dash.rating_rata_rata) : "-", suffix: "★" },
          ].map((stat) => (
            <div key={stat.label} className="border border-outline-variant px-3 py-4 text-center">
              <div className="font-heading text-lg leading-6 font-black break-words text-primary tabular-nums sm:text-xl sm:leading-7 lg:text-2xl lg:leading-7">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1 text-lg font-bold text-tertiary">{stat.suffix}</span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 Trust Score + 03 Produk Aktif */}
      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionHeader number="02" title={t("Trust Score")} />
          <div className="flex flex-wrap items-center gap-6">
            <TrustGauge score={trustScore} />
            <div>
              <div className="font-heading text-3xl leading-9 font-black text-primary">
                {trust ? `${trustScore}/100` : trustScore || "-"}
              </div>
              {trust ? (
                <div className="mt-1 flex flex-col gap-1 text-sm font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-[#10B981]" /> {t("Completed")} {trust.order_completion_rate}%
                  </span>
                  <span>{t("Cancelled")} {trust.cancellation_rate}% • {t("Response")} {trust.response_rate}%</span>
                </div>
              ) : trustPending ? (
                <div className="mt-1 text-base font-bold text-muted-foreground">{t("Loading…")}</div>
              ) : trustError ? (
                <div className="mt-1 text-sm font-bold text-error">{t("Failed to load trust score")}</div>
              ) : (
                <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-muted-foreground">
                  <CheckCircle2 className="size-4" /> {t("No ratings yet")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionHeader number="03" title={`${t("Active Products")} (${dash?.produk_aktif ?? "-"})`} />
          {!dash || dash.produk_terlaris.length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
              {t("No data yet.")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {dash.produk_terlaris.map((p) => (
                <div key={p.product_id} className="flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm leading-5 font-medium text-primary">
                      {p.nama_produk}
                    </div>
                    <div className="font-heading text-sm leading-5 font-bold text-primary">
                      {p.total_terjual} {t("sold")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 04 Ulasan Pelanggan */}
      <section className="border border-outline-variant bg-surface-container-lowest p-6">
        <SectionHeader number="04" title={t("Customer Reviews")} />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-base leading-6 text-muted-foreground">
            {t("See how buyers rate this store's quality and service.")}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Star className="size-4 fill-tertiary text-tertiary" />
            <span className="font-heading font-black text-primary">
              {reviewsData?.rating_rata_rata ? String(reviewsData.rating_rata_rata) : "-"}
            </span>
            <span>{t("(store rating)")}</span>
          </div>
        </div>
        {(reviewsData?.items ?? []).length === 0 ? (
          <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
            {t("No reviews yet.")}
          </div>
        ) : (
          <div className="divide-y divide-outline-variant border-t border-outline-variant">
            {(reviewsData?.items ?? []).map((r) => (
              <div key={r.review_id} className="flex flex-col gap-2 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-heading text-sm leading-5 font-bold text-primary uppercase">
                    {r.customer?.nama ?? t("Customer")}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`size-4 ${n <= Math.round(r.rating) ? "fill-tertiary text-tertiary" : "text-outline-variant"}`}
                      />
                    ))}
                  </span>
                </div>
                {r.komentar ? (
                  <p className="text-sm leading-6 text-muted-foreground">{r.komentar}</p>
                ) : null}
                {r.created_at ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("id-ID")}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Lingkaran progress trust score, dibuat dengan SVG (tidak butuh library tambahan)
function TrustGauge({ score }: { score: number }) {
  const size = 88
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-outline-variant"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#10B981]"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-heading text-xl leading-7 font-black text-primary">
        {score ?? "-"}
      </div>
    </div>
  )
}