"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { PageMeta } from "@/components/page-meta"
import { StatCardSkeleton } from "@/components/skeleton"
import { formatRp } from "@/lib/api"
import { useSellerDashboard, useSellerOrders } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export default function SellerAnalyticsPage() {
  const t = useT()
  const { data: dash, isLoading } = useSellerDashboard()
  const { data: ordersData } = useSellerOrders({ limit: 1 })

  const rows = dash
    ? [
        { label: t("Total Products"), value: dash.total_produk },
        { label: t("Active"), value: dash.produk_aktif },
        { label: t("Total Sold"), value: dash.total_terjual },
        { label: t("Orders"), value: ordersData?.pagination.total ?? 0 },
        { label: t("Rating"), value: Math.round(dash.rating_rata_rata * 10) / 10 },
      ]
    : []

  const bestSellers = dash?.produk_terlaris ?? []

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <PageMeta title="Analytics" />
      <div className="mb-8 border-b border-primary pb-4">
        <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {t("Seller Center")}
        </div>
        <h1 className="font-heading text-4xl font-black tracking-tighter text-primary uppercase">
          {t("Analytics")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Your store performance at a glance")}.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-5 lg:col-span-1 lg:grid-cols-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-5 lg:col-span-2">
            <StatCardSkeleton className="h-24" />
            <StatCardSkeleton className="h-64" />
          </div>
        </div>
      ) : dash ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-5 lg:col-span-1 lg:grid-cols-1">
            {rows.map((r) => (
              <div key={r.label} className="border border-outline-variant bg-surface-container-lowest p-5">
                <div className="font-heading text-3xl leading-9 font-black text-primary tabular-nums">{r.value}</div>
                <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                  {r.label}
                </div>
              </div>
            ))}
            <div className="border border-on-tertiary-container bg-on-tertiary-container/5 p-5">
              <div className="font-heading text-3xl leading-9 font-black text-on-tertiary-container tabular-nums">
                {formatRp(dash.total_pendapatan)}
              </div>
              <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-on-tertiary-container uppercase">
                {t("Total Revenue")}
              </div>
            </div>
          </div>

          <div className="border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
            <h2 className="mb-6 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              {t("Best Sellers")}
            </h2>
            {bestSellers.length === 0 ? (
              <div className="flex items-center justify-center border border-dashed border-outline-variant py-16 text-sm text-muted-foreground">
                {t("No data yet.")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={bestSellers} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="#e2e2e2" strokeDasharray="4 0" vertical={false} />
                  <XAxis dataKey="nama_produk" tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "#1b1b1b" }} interval={0} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "#eeeeee" }}
                    contentStyle={{ borderRadius: 0, border: "1px solid #1b1b1b", fontSize: 12 }}
                  />
                  <Bar dataKey="total_terjual" name={t("Sold")} radius={[0, 0, 0, 0]}>
                    {bestSellers.map((p, i) => (
                      <Cell key={p.product_id} fill={i === 0 ? "#2b82f4" : "#000000"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-primary bg-surface-container-low p-10 text-center text-muted-foreground">
          {t("No report data yet.")}
        </div>
      )}
    </div>
  )
}