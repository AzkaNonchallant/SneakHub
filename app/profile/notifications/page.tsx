"use client"

import { CheckCheck, CheckCircle2, Circle, Package, RefreshCw, TrendingDown } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useMarkNotificationRead, useNotifications } from "@/lib/hooks"

const typeMeta: Record<string, { icon: typeof Circle; cls: string; label: string }> = {
  PRICE_ALERT: { icon: TrendingDown, cls: "text-[#f59e0b]", label: "PRICE ALERT" },
  RESTOCK: { icon: RefreshCw, cls: "text-on-tertiary-container", label: "BACK IN STOCK" },
  RESTOCK_ALERT: { icon: RefreshCw, cls: "text-on-tertiary-container", label: "BACK IN STOCK" },
  ORDER: { icon: Package, cls: "text-primary", label: "ORDER UPDATE" },
  ORDER_STATUS: { icon: Package, cls: "text-primary", label: "ORDER UPDATE" },
}

function typeOf(raw: string): { icon: typeof Circle; cls: string; label: string } {
  return typeMeta[raw] ?? { icon: Package, cls: "text-primary", label: raw }
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "BARU SAJA"
  if (m < 60) return `${m} MENIT LALU`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} JAM LALU`
  return new Date(iso).toLocaleDateString("id-ID")
}

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications({ limit: 50 })
  const markRead = useMarkNotificationRead()
  const items = data?.items ?? []

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-12 md:px-10">
        <header className="flex items-end justify-between border-b border-outline pb-4">
          <h1 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-[48px] md:leading-12">
            Notifications
          </h1>
          <div className="flex items-center gap-4">
            {data?.unread_count ? (
              <span className="border border-primary bg-primary px-2 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase">
                {data.unread_count} Belum dibaca
              </span>
            ) : null}
            {items.some((n) => !n.status_baca) ? (
              <button
                type="button"
                onClick={() => items.filter((n) => !n.status_baca).forEach((n) => markRead.mutate(n.notification_id))}
                className="group flex cursor-pointer items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                <CheckCheck className="size-4 transition-transform group-hover:rotate-12" />
                Mark all as read
              </button>
            ) : null}
          </div>
        </header>

        {isLoading ? (
          <div className="border border-primary bg-surface-container-low p-12 text-center">
            <p className="font-heading text-xl font-semibold text-primary uppercase">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-primary bg-surface-container-low p-12 text-center">
            <p className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              Belum ada notifikasi
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Notifikasi harga turun, stok tersedia, dan status pesanan akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((n) => {
              const isRead = n.status_baca
              const meta = typeOf(n.jenis_notifikasi)
              const TypeIcon = meta.icon
              return (
                <article
                  key={n.notification_id}
                  className={
                    isRead
                      ? "relative flex flex-col gap-6 border border-outline bg-surface-container-lowest p-6 opacity-75 sm:flex-row"
                      : "relative flex flex-col gap-6 border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000] sm:flex-row"
                  }
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-outline">{timeAgo(n.created_at)}</span>
                    {isRead ? (
                      <CheckCircle2 className="size-5 text-outline" />
                    ) : (
                      <button
                        type="button"
                        aria-label="Mark as read"
                        onClick={() => markRead.mutate(n.notification_id)}
                        className="cursor-pointer text-outline transition-colors hover:text-primary"
                      >
                        <Circle className="size-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex size-12 shrink-0 items-center justify-center border border-outline bg-surface-container-high">
                    <TypeIcon className={`size-6 ${meta.cls}`} />
                  </div>
                  <div className="flex grow flex-col justify-between pr-16">
                    <div>
                      <span className={`mb-2 inline-block text-xs leading-4 font-bold tracking-wider uppercase ${meta.cls}`}>
                        {meta.label}
                      </span>
                      <p className="text-base leading-6 text-on-surface-variant">{n.isi_notifikasi}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}