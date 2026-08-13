import { ArrowUpRight, Minus, Package, Plus, ShieldCheck, ShoppingBag, Star, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ---- Data contoh — ganti dengan data asli dari API/DB kamu ----
const stats = [
  {
    icon: Wallet,
    trend: "up" as const,
    value: "Rp284.750.000",
    label: "Total Penjualan",
  },
  {
    icon: Package,
    trend: "up" as const,
    value: "312",
    label: "Total Pesanan",
  },
  {
    icon: ShoppingBag,
    trend: "flat" as const,
    value: "24",
    label: "Produk Aktif",
  },
  {
    icon: Star,
    trend: "up" as const,
    value: "4.8",
    valueSuffix: "★",
    label: "Rating Rata-rata",
  },
  {
    icon: ShieldCheck,
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
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            Seller Center
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary">
            Dashboard
          </h1>
        </div>
        <Button
          size="lg"
          className="h-auto rounded-none border border-primary bg-primary px-6 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
        >
          <Plus className="size-4" /> Tambah Produk
        </Button>
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
            <div className="mt-5 font-heading text-lg leading-6 font-black break-words text-primary sm:text-xl sm:leading-7 lg:text-2xl lg:leading-7">
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

      {/* Chart + Trust score */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Penjualan Bulanan */}
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionTitle eyebrow="Sales Analytics" title="Penjualan Bulanan" />
          <MonthlySalesChart data={monthlySales} />
        </div>

        {/* Seller Trust Score */}
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <SectionTitle eyebrow="Reputation" title="Seller Trust Score" />
          <div className="mb-6 flex flex-wrap items-center gap-6">
            <TrustGauge score={94} />
            <div>
              <div className="font-heading text-3xl leading-9 font-black text-primary">94/100</div>
              <div className="mt-0.5 text-base font-bold text-[#10B981]">Seller Terpercaya</div>
            </div>
          </div>
          <dl className="divide-y divide-outline-variant border-t border-outline-variant">
            {trustBreakdown.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3.5"
              >
                <dt className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  {row.label}
                </dt>
                <dd
                  className={[
                    "font-heading text-base font-bold",
                    row.tone === "warning" ? "text-error" : "text-primary",
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
        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle eyebrow="Activity" title="Pesanan Terbaru" className="mb-0" />
            <a
              href="#"
              className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
            >
              Lihat semua <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </a>
          </div>
          {/* TODO: list pesanan terbaru — ganti dengan data asli */}
          <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
            Belum ada data.
          </div>
        </div>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <SectionTitle eyebrow="Top Products" title="Produk Terlaris" className="mb-0" />
            <a
              href="#"
              className="flex items-center gap-1 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
            >
              Kelola <ArrowUpRight className="size-3.5 rotate-45" aria-hidden />
            </a>
          </div>
          {/* TODO: list produk terlaris — ganti dengan data asli */}
          <div className="flex items-center justify-center border border-dashed border-outline-variant py-10 text-sm text-muted-foreground">
            Belum ada data.
          </div>
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
        {score}
      </div>
    </div>
  )
}
