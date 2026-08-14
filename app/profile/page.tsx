"use client"

import { BadgeCheck, Bell, Heart, Lock, MapPin, Package, Settings, Star } from "lucide-react"
import Link from "next/link"

import { AddressSection } from "@/components/address-manager"
import { EditProfilButton } from "@/components/edit-profil-dialog"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { formatRp, isSellerRole } from "@/lib/api"
import { useMe, useOrders, useSellerActivation } from "@/lib/hooks"

const menuItems = [
  { label: "Pesanan Saya", href: "/profile", icon: Package, active: true },
  { label: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Ulasan Saya", href: "#", icon: Star },
  { label: "Preferensi", href: "#", icon: Settings },
  { label: "Notifikasi", href: "/profile/notifications", icon: Bell },
  { label: "Keamanan", href: "#", icon: Lock },
  { label: "Alamat Saya", href: "#alamat", icon: MapPin },
]

const statusLabel: Record<string, string> = {
  pending: "Pending",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
}

export default function ProfilePage() {
  const { data: user } = useMe()
  const { data: ordersData } = useOrders({ limit: 10 })
  const activate = useSellerActivation()

  const orders = ordersData?.items ?? []
  const initial = user?.nama?.charAt(0).toUpperCase() ?? "S"
  const isSeller = isSellerRole(user?.peran)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-8 md:flex-row md:px-10 md:py-12">
        <aside className="flex w-full shrink-0 flex-col gap-6 md:w-64">
          <div className="flex flex-col items-center border border-outline bg-surface-container-lowest p-6 text-center shadow-[4px_4px_0px_0px_#000]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center bg-primary font-heading text-5xl leading-none font-bold text-white">
              {initial}
            </div>
            <h2 className="font-heading text-2xl leading-7 font-semibold text-primary">
              {user?.nama ?? "Pengguna"}
            </h2>
            <p className="mb-4 text-base leading-6 text-muted-foreground">{user?.email ?? ""}</p>
            <span className="inline-flex items-center gap-1 border border-outline bg-surface-container-low px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
              <BadgeCheck className="size-4 text-on-tertiary-container" />
              {user?.status_akun ?? "aktif"}
            </span>
            {!isSeller ? (
              <Button
                type="button"
                disabled={activate.isPending}
                onClick={() =>
                  activate.mutate({
                    nama_toko: `${user?.nama ?? "Toko"} Store`,
                    deskripsi_toko: "Toko resmi SneakHub.",
                  })
                }
                className="mt-4 h-auto rounded-none border border-primary bg-primary px-4 py-2 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
              >
                {activate.isPending ? "Mengaktifkan…" : "Jadi Seller"}
              </Button>
            ) : null}
            <EditProfilButton user={user} />
          </div>

          <nav className="flex flex-col border border-outline bg-surface-container-low py-4 shadow-[4px_4px_0px_0px_#000]">
            <div className="mb-4 px-6 font-heading text-2xl leading-7 font-bold text-primary">
              Akun Saya
            </div>
            {/* ponytail: href="#" until those pages exist */}
            {menuItems.map(({ label, href, icon: Icon, active }) => (
              <a
                key={label}
                href={href}
                className={
                  active
                    ? "flex w-full items-center gap-3 border-l-4 border-on-tertiary-container bg-primary p-3 px-6 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase"
                    : "flex w-full items-center gap-3 p-3 px-6 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:bg-surface-container-high hover:text-primary"
                }
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col gap-6">
          <h1 className="border-b-2 border-primary pb-4 font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
            Pesanan Saya
          </h1>

          {orders.length === 0 ? (
            <p className="border border-dashed border-outline-variant p-10 text-center text-sm text-muted-foreground">
              Belum ada pesanan.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Link
                  key={order.order_id}
                  href={`/profile/orders/${order.order_id}`}
                  className="flex flex-col items-start justify-between gap-4 border border-outline bg-surface-container-lowest p-6 transition-shadow hover:shadow-[4px_4px_0px_0px_#000] md:flex-row md:items-center"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium text-muted-foreground">
                        {order.order_id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                          order.status_order === "diproses"
                            ? "bg-primary border-primary text-white"
                            : "bg-surface-container border-outline text-primary"
                        }`}
                      >
                        {statusLabel[order.status_order ?? ""] ?? order.status_order ?? "-"}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      {(order.items?.[0]?.nama_produk ?? "Pesanan") +
                        (order.items && order.items.length > 1 ? ` +${order.items.length - 1}` : "")}
                    </h3>
                    <div className="flex gap-4 text-base leading-6 text-muted-foreground">
                      <span>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("id-ID") : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                    <span className="font-heading text-2xl leading-7 font-black tracking-tight text-primary">
                      {formatRp(order.total_pembayaran ?? 0)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <section id="alamat" className="scroll-mt-24 border-t border-outline-variant pt-8">
            <AddressSection />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}