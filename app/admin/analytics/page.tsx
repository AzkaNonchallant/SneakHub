"use client"

import { useQueryClient } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { PageMeta } from "@/components/page-meta"
import { StatCardSkeleton } from "@/components/skeleton"
import { formatRp } from "@/lib/api"
import { useAdminReports } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export default function AdminAnalyticsPage() {
  const t = useT()
  const qc = useQueryClient()
  const { data, isLoading, isError } = useAdminReports({ period: "monthly" })


  const rows = data
    ? [
        { label: t("Users"), value: data.total_users ?? 0 },
        { label: t("Sellers"), value: data.total_sellers ?? 0 },
        { label: t("Products"), value: data.total_products ?? 0 },
        { label: t("Orders"), value: data.total_orders ?? 0 },
      ]
    : []

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <PageMeta title="Analytics" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-primary pb-4">
        <div>
          <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("Aggregate platform report")} ({t("period")} {data?.period ?? "-"}).
          </p>
        </div>
        <button
          type="button"
          onClick={() => qc.invalidateQueries({ queryKey: ["admin-reports"] })}
          className="flex items-center gap-2 border border-primary px-3 py-2 text-xs font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-white"
        >
          <RefreshCw className="size-3.5" /> {t("Refresh")}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <StatCardSkeleton className="h-80" />
        </div>
      ) : isError ? (
        <div className="border border-primary bg-surface-container-low p-10 text-center text-error">
          {t("Failed to load data")}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-5 lg:col-span-1 lg:grid-cols-1">
            {rows.slice(0, 4).map((r) => (
              <div key={r.label} className="border border-outline-variant bg-surface-container-lowest p-5">
                <div className="font-heading text-3xl leading-9 font-black text-primary tabular-nums">{r.value}</div>
                <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                  {r.label}
                </div>
              </div>
            ))}
            <div className="border border-on-tertiary-container bg-on-tertiary-container/5 p-5">
              <div className="font-heading text-3xl leading-9 font-black text-on-tertiary-container tabular-nums">
                {formatRp(data.total_revenue)}
              </div>
              <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-on-tertiary-container uppercase">
                Total Revenue
              </div>
            </div>
          </div>

          <div className="border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
            <h2 className="mb-6 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              Platform Metrics
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="#e2e2e2" strokeDasharray="4 0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "#1b1b1b" }} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#eeeeee" }}
                  contentStyle={{ borderRadius: 0, border: "1px solid #1b1b1b", fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                  {rows.map((r) => (
                    <Cell key={r.label} fill="#000000" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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