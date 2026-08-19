"use client"

import Link from "next/link"
import { AlertTriangle, ArrowUpRight, Package, ShieldCheck, ShoppingBag, Users } from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { formatRp } from "@/lib/api"
import { useAdminOrders, useAdminProducts, useAdminReports, useAdminUsers } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const tone: Record<string, string> = {
  PENDING: "bg-[#f59e0b] text-white",
  PROCESSING: "bg-surface-container-highest text-primary",
  SHIPPED: "bg-on-tertiary-container text-white",
  COMPLETED: "bg-[#10B981] text-white",
  CANCELLED: "bg-error text-white",
}

export default function AdminDashboardPage() {
  const t = useT()
  const { data: report } = useAdminReports({ period: "monthly" })
  const { data: pending } = useAdminProducts({ status: "PENDING", limit: 5 })
  const { data: orders } = useAdminOrders({ limit: 5 })
  const { data: users } = useAdminUsers({ limit: 5 })

  const statusLabel: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: t("Processing"),
    SHIPPED: t("Shipped"),
    COMPLETED: t("Completed"),
    CANCELLED: t("Cancelled"),
  }

  const stats = [
    { icon: Users, label: "Total Users", value: report?.total_users ?? "-" },
    { icon: ShieldCheck, label: "Total Sellers", value: report?.total_sellers ?? "-" },
    { icon: Package, label: "Total Products", value: report?.total_products ?? "-" },
    { icon: ShoppingBag, label: "Total Orders", value: report?.total_orders ?? "-" },
  ]

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <PageMeta title="Admin Dashboard" />
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          Command Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Platform oversight")} — {t("period")} {report?.period ?? "-"}.
        </p>
      </div>


      <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-outline-variant bg-surface-container-lowest p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                {s.label}
              </span>
              <s.icon className="size-4 text-primary" aria-hidden />
            </div>
            <div className="mt-3 font-heading text-4xl leading-10 font-black text-primary tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 border border-on-tertiary-container bg-on-tertiary-container/5 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] leading-4 font-bold tracking-widest text-on-tertiary-container uppercase">
            Total Revenue
          </span>
          <ArrowUpRight className="size-4 text-on-tertiary-container" aria-hidden />
        </div>
        <div className="mt-3 font-heading text-4xl leading-10 font-black text-on-tertiary-container tabular-nums">
          {formatRp(report?.total_revenue ?? 0)}
        </div>
      </div>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wide text-primary uppercase">
              {t("Moderation Queue")} (PENDING)
            </h2>
            <Link
              href="/admin/inventory?status=PENDING"
              className="flex items-center gap-1 text-xs font-bold tracking-[0.05em] text-on-tertiary-container uppercase hover:text-primary"
            >
              {t("View all")} <ArrowUpRight className="size-3.5 rotate-45" />
            </Link>
          </div>
          {(pending?.items ?? []).length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-8 text-sm text-muted-foreground">
              {t("No products awaiting moderation.")}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant border-t border-outline-variant">
              {pending!.items.map((p) => (
                <div key={p.product_id} className="flex items-center justify-between py-3">
                  <div className="truncate font-heading text-sm font-bold text-primary">{p.nama_produk}</div>
                  <span className="border border-[#f59e0b] bg-[#f59e0b] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                    PENDING
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wide text-primary uppercase">{t("Recent Orders")}</h2>
            <span className="font-mono text-xs text-muted-foreground">{t("All sellers")}</span>
          </div>
          {(orders?.items ?? []).length === 0 ? (
            <div className="flex items-center justify-center border border-dashed border-outline-variant py-8 text-sm text-muted-foreground">
              {t("No orders yet.")}
            </div>
          ) : (
            <div className="divide-y divide-outline-variant border-t border-outline-variant">
              {orders!.items.map((o) => (
                <div key={o.order_id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-heading text-sm font-bold text-primary">
                      {o.customer?.nama ?? "Customer"} • {o.order_id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${tone[o.status_order] ?? "bg-surface-container-highest text-primary"}`}>
                      {statusLabel[o.status_order] ?? o.status_order}
                    </span>
                    <span className="font-heading text-sm font-bold text-primary">
                      {formatRp(o.total_pembayaran)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="mt-6 border border-outline-variant bg-surface-container-lowest p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-wide text-primary uppercase">{t("User Activity")}</h2>
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-xs font-bold tracking-[0.05em] text-on-tertiary-container uppercase hover:text-primary"
          >
            {t("Manage")} <ArrowUpRight className="size-3.5 rotate-45" />
          </Link>
        </div>
        {(users?.items ?? []).length === 0 ? (
          <div className="flex items-center justify-center border border-dashed border-outline-variant py-8 text-sm text-muted-foreground">
            {t("No data yet.")}
          </div>
        ) : (
          <div className="divide-y divide-outline-variant border-t border-outline-variant">
            {users!.items.map((u) => (
              <div key={u.user_id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate font-heading text-sm font-bold text-primary">{u.nama}</div>
                  <div className="font-mono text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-outline px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                    {u.peran}
                  </span>
                  <span className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase ${u.status_akun === "ACTIVE" ? "bg-[#10B981]" : "bg-[#f59e0b]"}`}>
                    {u.status_akun}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 border border-outline-variant bg-surface-container-lowest p-4 text-xs text-muted-foreground">
        <AlertTriangle className="size-4 text-[#f59e0b]" />
        {t("Reports update automatically from the /admin/reports endpoint.")}
      </div>
    </div>
  )
}