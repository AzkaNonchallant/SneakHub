"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight, Minus, Package, ShieldCheck, ShoppingBag, Star, Store, Wallet } from "lucide-react"
import { toast } from "sonner"

import { PageMeta } from "@/components/page-meta"
import { PricePredictionButton } from "@/components/price-prediction-dialog"
import { TambahProdukButton } from "@/components/tambah-produk-dialog"
import { Button } from "@/components/ui/button"
import { errMessage, formatRp } from "@/lib/api"
import { useSellerDashboard, useSellerOrders, useShipOrder, useUpdateOrderStatus } from "@/lib/hooks"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const norm = (s?: string) => (s ?? "").toLowerCase()

const nextStatus: Record<string, string> = {
  pending: "diproses",
}

function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("mb-6", className)}>
      <span className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <h3 className="mt-0.5 font-heading text-lg leading-6 font-bold text-primary">{title}</h3>
    </div>
  )
}

export default function DashboardPage() {
  const t = useT()
  const statusLabel: Record<string, string> = {
    pending: t("Pending"),
    diproses: t("Processing"),
    processing: t("Processing"),
    dikirim: t("Shipped"),
    shipped: t("Shipped"),
    selesai: t("Completed"),
    completed: t("Completed"),
    dibatalkan: t("Cancelled"),
    cancelled: t("Cancelled"),
  }
  const { data: dash } = useSellerDashboard()
  const { data: ordersData } = useSellerOrders({ limit: 100 })
  const updateStatus = useUpdateOrderStatus()
  const ship = useShipOrder()
  const orders = ordersData?.items ?? []

  const advanceStatus = async (order: { order_id: string; status_order?: string }) => {
    const target = nextStatus[norm(order.status_order)]
    if (!target) return
    try {
      await updateStatus.mutateAsync({ id: order.order_id, status_order: target })
      toast.success(`${t("Status changed to")} ${statusLabel[target]}`)
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const shipOrder = async (order: { order_id: string }) => {
    const send = async (body?: Record<string, unknown>) => {
      await ship.mutateAsync({ orderId: order.order_id, body })
      toast.success(t("Order shipped"))
    }
    try {
      // ponytail: body kosong = Biteship booking resi otomatis; gagal → fallback resi manual
      await send()
    } catch {
      const resi = window.prompt(t("Biteship unavailable — enter tracking number manually:"))
      if (!resi || !resi.trim()) return
      await send({ nomor_resi: resi.trim() })
    }
  }

  const stats = [
    {
      icon: Wallet,
      trend: "up" as const,
      value: formatRp(dash?.total_pendapatan ?? 0),
      label: t("Total Revenue"),
    },
    {
      icon: Package,
      trend: "up" as const,
      value: String(dash?.total_terjual ?? orders.length),
      label: t("Total Sold"),
    },
    {
      icon: ShoppingBag,
      trend: "flat" as const,
      value: String(dash?.produk_aktif ?? 0),
      label: t("Active Products"),
    },
    {
      icon: Star,
      trend: "flat" as const,
      value: dash?.rating_rata_rata ? String(dash.rating_rata_rata) : "-",
      valueSuffix: "★",
      label: t("Average Rating"),
    },
    {
      icon: ShieldCheck,
      trend: "up" as const,
      value: dash?.seller_trust_score ?? "-",
      label: t("Trust Score"),
    },
  ]

  const monthlySales = useMemo(
    // ponytail: agregasi order per bulan, kosong kalau belum ada data
    () => {
      const byMonth = new Map<string, number>()
      for (const o of orders) {
        if (!o.created_at) continue
        const key = new Date(o.created_at).toLocaleString("id-ID", { month: "short" })
        byMonth.set(key, (byMonth.get(key) ?? 0) + (o.total_pembayaran ?? 0))
      }
      const max = Math.max(0, ...byMonth.values())
      return Array.from(byMonth.entries()).map(([month, value], i) => ({
        month,
        value: max > 0 ? Math.round((value / max) * 100) : 0,
        isCurrent: i === byMonth.size - 1,
      }))
    },
    [orders],
  )

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <PageMeta title="Dashboard" />
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            {t("Seller Center")}
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary">
            {t("Dashboard")}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            nativeButton={false}
            render={
              <Link
                href="/home"
                className="flex items-center gap-2"
                aria-label={t("Storefront")}
                title={t("Storefront")}
              >
                <Store className="size-4" />
                {t("Storefront")}
              </Link>
            }
          />
          <PricePredictionButton />
          <TambahProdukButton />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-outline-variant bg-surface-container-lowest p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center border border-outline-variant bg-surface-container-low">
                <stat.icon className="size-5 text-primary" aria-hidden />
              </div>
              {stat.trend === "up" ? (
                <ArrowUpRight className="size-5 text-[#10B981]" aria-hidden />
              ) : (
                <Minus className="size-5 text-muted-foreground" aria-hidden />
              )}
            </div>
            <div className="mt-5 font-heading text-lg leading-6 font-black break-words text-primary tabular-nums sm:text-xl sm:leading-7 lg:text-2xl lg:leading-7">
              {stat.value}
              {stat.valueSuffix ? (
                <span className="ml-1 text-lg text-tertiary">{stat.valueSuffix}</span>
              ) : null}
            </div>
            <div className="mt-1.5 text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionTitle eyebrow={t("Sales Analytics")} title={t("Monthly Sales")} />
          {monthlySales.length > 0 ? (
            <MonthlySalesChart data={monthlySales} />
          ) : (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
              {t("No sales data yet.")}
            </div>
          )}
        </div>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionTitle eyebrow={t("Reputation")} title={t("Trust Score")} />
          <div className="mb-6 flex flex-wrap items-center gap-6">
            <TrustGauge score={dash?.seller_trust_score ?? 0} />
            <div>
              <div className="font-heading text-3xl leading-9 font-black text-primary">
                {dash?.seller_trust_score ?? "-"}
                {dash?.seller_trust_score != null ? (
                  <span className="text-base font-bold text-muted-foreground">/100</span>
                ) : null}
              </div>
              <div className="mt-0.5 text-base font-bold text-muted-foreground">
                {t("No ratings yet")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pesanan Terbaru + Produk */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle eyebrow={t("Activity")} title={t("Recent Orders")} className="mb-0" />
            <Link
              href="/profile"
              className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
            >
              {t("View all")} <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
              {t("No data yet.")}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant border-t border-outline-variant">
              {recentOrders.map((o) => (
                <div key={o.order_id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-heading text-sm font-bold text-primary">
                      {o.customer?.nama ?? t("Order")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {o.order_id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="border border-outline bg-surface-container-low px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                      {statusLabel[norm(o.status_order)] ?? o.status_order ?? "-"}
                    </span>
                    <span className="font-heading text-sm font-bold text-primary">
                      {formatRp(o.total_pembayaran ?? 0)}
                    </span>
                    {nextStatus[norm(o.status_order)] ? (
                      <button
                        type="button"
                        disabled={updateStatus.isPending}
                        onClick={() => advanceStatus(o)}
                        className="border border-primary bg-primary px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
                      >
                        {statusLabel[nextStatus[norm(o.status_order)]]}
                      </button>
                    ) : null}
                    {norm(o.status_order) === "diproses" || norm(o.status_order) === "processing" ? (
                      <button
                        type="button"
                        disabled={ship.isPending}
                        onClick={() => shipOrder(o)}
                        className="border border-primary bg-primary px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
                      >
                        {ship.isPending ? "…" : t("Ship")}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle eyebrow={t("Top Products")} title={t("Products")} className="mb-0" />
            <Link
              href="/inventory"
              className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
            >
              {t("Manage")} <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </Link>
          </div>
          {(dash?.produk_terlaris ?? []).length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
              {t("No data yet.")}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant border-t border-outline-variant">
              {dash!.produk_terlaris.map((p) => (
                <div key={p.product_id} className="flex items-center justify-between py-3">
                  <div className="truncate font-heading text-sm font-bold text-primary">
                    {p.nama_produk}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    {p.total_terjual} {t("sold")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MonthlySalesChart({
  data,
}: {
  data: { month: string; value: number; isCurrent?: boolean }[]
}) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-40 items-end justify-between gap-3">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-bold text-primary">{d.value}%</span>
          <div
            className={[
              "w-full",
              d.isCurrent ? "bg-primary" : "bg-surface-container-highest",
            ].join(" ")}
            style={{ height: `${(d.value / max) * 100}px` }}
          />
          <span
            className={[
              "text-xs",
              d.isCurrent ? "font-bold text-primary" : "text-muted-foreground",
            ].join(" ")}
          >
            {d.month}
          </span>
        </div>
      ))}
    </div>
  )
}

function TrustGauge({ score }: { score: number }) {
  const size = 72
  const stroke = 7
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
      <div className="absolute inset-0 flex items-center justify-center font-heading text-lg leading-6 font-black text-primary">
        {score || "-"}
      </div>
    </div>
  )
}