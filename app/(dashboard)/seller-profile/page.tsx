"use client"

import { CheckCircle2, Star } from "lucide-react"

import { formatRp, PLACEHOLDER_IMAGE } from "@/lib/api"
import { useMe, useProducts } from "@/lib/hooks"

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
  const { data: user } = useMe()
  const { data: productsData } = useProducts({ limit: 24 })

  const storeName = `${user?.nama ?? "Toko"} Store`
  const products = productsData?.items.slice(0, 4) ?? []
  const totalProducts = productsData?.pagination.total ?? 0
  const trustScore = 0

  return (
    <div className="mx-auto w-full max-w-[1280px] bg-background px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            Seller Center
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary uppercase">
            Profil Toko
          </h1>
        </div>
      </div>

      {/* 01 Profil */}
      <section className="mb-6 border border-outline-variant bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
        <SectionHeader number="01" title="Profil Toko" />
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
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "TOTAL PESANAN", value: "-" },
            { label: "PRODUK AKTIF", value: String(totalProducts) },
            { label: "RATING", value: "-", suffix: "★" },
          ].map((stat) => (
            <div key={stat.label} className="border border-outline-variant px-3 py-4 text-center">
              <div className="font-heading text-lg leading-6 font-black break-words text-primary sm:text-xl sm:leading-7 lg:text-2xl lg:leading-7">
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
          <SectionHeader number="02" title="Trust Score" />
          <div className="flex flex-wrap items-center gap-6">
            <TrustGauge score={trustScore} />
            <div>
              <div className="font-heading text-3xl leading-9 font-black text-primary">
                {trustScore || "-"}/100
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-muted-foreground">
                <CheckCircle2 className="size-4" /> Belum ada penilaian
              </div>
            </div>
          </div>
        </div>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionHeader number="03" title={`Produk Aktif (${totalProducts})`} />
          {products.length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
              Belum ada data.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.product_id} className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 border border-outline-variant bg-surface-container">
                    <img
                      src={p.images?.[0]?.image_url || p.image_url || PLACEHOLDER_IMAGE}
                      alt={p.nama_produk}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm leading-5 font-medium text-primary">
                      {p.nama_produk}
                    </div>
                    <div className="font-heading text-sm leading-5 font-bold text-primary">
                      {formatRp(p.harga)}
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
        <SectionHeader number="04" title="Ulasan Pelanggan" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-base leading-6 text-muted-foreground">
            Lihat bagaimana pembeli menilai kualitas dan layanan toko ini.
          </p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Star className="size-4 fill-tertiary text-tertiary" />
            <span className="font-heading font-black text-primary">-</span>
            <span>(belum ada ulasan)</span>
          </div>
        </div>
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
        {score || "-"}
      </div>
    </div>
  )
}