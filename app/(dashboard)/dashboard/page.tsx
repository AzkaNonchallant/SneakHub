import { ArrowUpRight, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"

// ---- Data contoh — ganti dengan data asli dari API/DB kamu ----
const stats = [
  {
    icon: "💰",
    trend: "up" as const,
    value: "Rp284.750.000",
    label: "Total Penjualan",
  },
  {
    icon: "📦",
    trend: "up" as const,
    value: "312",
    label: "Total Pesanan",
  },
  {
    icon: "👟",
    trend: "flat" as const,
    value: "24",
    label: "Produk Aktif",
  },
  {
    icon: "⭐",
    trend: "up" as const,
    value: "4.8",
    valueSuffix: "★",
    label: "Rating Rata-rata",
  },
  {
    icon: "🛡️",
    trend: "up" as const,
    value: "94/100",
    label: "Trust Score",
  },
]

const monthlySales = [
  { month: "Mar", value: 42 },
  { month: "Apr", value: 58 },
  { month: "Mei", value: 71 },
  { month: "Jun", value: 65 },
  { month: "Jul", value: 89 },
  { month: "Agu", value: 76, isCurrent: true },
]

const trustBreakdown = [
  { label: "Rating", value: "4.8", suffix: "★" },
  { label: "Order Completion", value: "98%" },
  { label: "Response Rate", value: "96%" },
  { label: "Cancellation Rate", value: "2%", tone: "warning" as const },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 py-10 md:px-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            Seller Center
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary">
            Dashboard
          </h1>
        </div>
        <Button size="lg" className="rounded-none">+ Tambah Produk</Button>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-outline-variant bg-surface-container-low p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center bg-surface-container text-xl">
                {stat.icon}
              </div>
              {stat.trend === "up" ? (
                <ArrowUpRight className="size-5 text-tertiary" aria-hidden />
              ) : (
                <Minus className="size-5 text-muted-foreground" aria-hidden />
              )}
            </div>
            <div className="mt-5 font-heading text-2xl font-black text-primary">
              {stat.value}
              {stat.valueSuffix ? (
                <span className="ml-1 text-lg text-tertiary">{stat.valueSuffix}</span>
              ) : null}
            </div>
            <div className="mt-1.5 text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Trust score */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Penjualan Bulanan */}
        <div className="border border-outline-variant bg-surface-container-low p-8">
          <h3 className="mb-8 font-heading text-lg font-bold text-primary">
            Penjualan Bulanan
          </h3>
          <MonthlySalesChart data={monthlySales} />
        </div>

        {/* Seller Trust Score */}
        <div className="border border-outline-variant bg-surface-container-low p-8">
          <h3 className="mb-6 font-heading text-lg font-bold text-primary">
            Seller Trust Score
          </h3>
          <div className="mb-6 flex items-center gap-6">
            <TrustGauge score={94} />
            <div>
              <div className="font-heading text-3xl font-black text-primary">94/100</div>
              <div className="mt-0.5 text-base font-bold text-tertiary">
                Seller Terpercaya
              </div>
            </div>
          </div>
          <dl className="divide-y divide-outline-variant border-t border-outline-variant">
            {trustBreakdown.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3.5 text-base"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd
                  className={[
                    "font-bold",
                    row.tone === "warning" ? "text-red-500" : "text-primary",
                  ].join(" ")}
                >
                  {row.value}
                  {row.suffix ? <span className="ml-1 text-tertiary">{row.suffix}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Pesanan Terbaru + Produk Terlaris */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border border-outline-variant bg-surface-container-low p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-primary">
              Pesanan Terbaru
            </h3>
            <a
              href="#"
              className="flex items-center gap-1 text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase hover:text-on-tertiary-container"
            >
              Lihat semua <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </a>
          </div>
          {/* TODO: list pesanan terbaru — ganti dengan data asli */}
          <div className="mt-5 text-sm text-muted-foreground">Belum ada data.</div>
        </div>

        <div className="border border-outline-variant bg-surface-container-low p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-primary">
              Produk Terlaris
            </h3>
            <a
              href="#"
              className="flex items-center gap-1 text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase hover:text-on-tertiary-container"
            >
              Kelola <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </a>
          </div>
          {/* TODO: list produk terlaris — ganti dengan data asli */}
          <div className="mt-5 text-sm text-muted-foreground">Belum ada data.</div>
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
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="flex h-40 items-end justify-between gap-3">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-bold text-primary">{d.value}</span>
          <div
            className={[
              "w-full",
              d.isCurrent ? "bg-primary" : "bg-surface-container",
            ].join(" ")}
            style={{ height: `${(d.value / max) * 100}px` }}
          />
          <span
            className={[
              "text-xs",
              d.isCurrent
                ? "font-bold text-primary"
                : "text-muted-foreground",
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
          className="stroke-tertiary"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-heading text-lg font-black text-primary">
        {score}
      </div>
    </div>
  )
}