import {
  BadgeCheck,
  Bell,
  Heart,
  Lock,
  MapPin,
  Package,
  Settings,
  Star,
} from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

// ponytail: static seed until there's a backend
const user = {
  initial: "A",
  name: "Andi Pratama",
  email: "andi@email.com",
}

const menuItems = [
  { label: "Pesanan Saya", href: "#", icon: Package, active: true },
  { label: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Ulasan Saya", href: "#", icon: Star },
  { label: "Preferensi", href: "#", icon: Settings },
  { label: "Notifikasi", href: "/profile/notifications", icon: Bell },
  { label: "Keamanan", href: "#", icon: Lock },
  { label: "Alamat Saya", href: "#", icon: MapPin },
]

// ponytail: static seed until there's a backend
const orders = [
  {
    id: "ORD-2024-001",
    status: "Dikirim",
    statusClass: "bg-surface-container border-outline text-primary",
    name: "Nike Air Force 1 Low",
    size: "Ukuran 42",
    date: "8 Agu 2026",
    price: "Rp1.200.000",
    canReview: false,
  },
  {
    id: "ORD-2024-002",
    status: "Selesai",
    statusClass: "bg-surface-container border-outline text-primary",
    name: "Adidas Forum Low",
    size: "Ukuran 39",
    date: "7 Agu 2026",
    price: "Rp850.000",
    canReview: true,
  },
  {
    id: "ORD-2024-003",
    status: "Diproses",
    statusClass: "bg-primary border-primary text-white",
    name: "Nike Dunk Low Panda",
    size: "Ukuran 43",
    date: "6 Agu 2026",
    price: "Rp1.650.000",
    canReview: false,
  },
  {
    id: "ORD-2024-004",
    status: "Pending",
    statusClass: "bg-surface-container border-outline text-primary",
    name: "Nike Air Max 90",
    size: "Ukuran 40",
    date: "5 Agu 2026",
    price: "Rp950.000",
    canReview: false,
  },
]

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-8 md:flex-row md:px-10 md:py-12">
        <aside className="flex w-full shrink-0 flex-col gap-6 md:w-64">
          <div className="flex flex-col items-center border border-outline bg-surface-container-lowest p-6 text-center shadow-[4px_4px_0px_0px_#000]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center bg-primary font-heading text-5xl leading-none font-bold text-white">
              {user.initial}
            </div>
            <h2 className="font-heading text-2xl leading-7 font-semibold text-primary">
              {user.name}
            </h2>
            <p className="mb-4 text-base leading-6 text-muted-foreground">{user.email}</p>
            <span className="inline-flex items-center gap-1 border border-outline bg-surface-container-low px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
              <BadgeCheck className="size-4 text-on-tertiary-container" />
              Terverifikasi
            </span>
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

          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="flex flex-col items-start justify-between gap-4 border border-outline bg-surface-container-lowest p-6 transition-shadow hover:shadow-[4px_4px_0px_0px_#000] md:flex-row md:items-center"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-muted-foreground">
                      {order.id}
                    </span>
                    <span
                      className={`border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${order.statusClass}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                    {order.name}
                  </h3>
                  <div className="flex gap-4 text-base leading-6 text-muted-foreground">
                    <span>{order.size}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                  <span className="font-heading text-2xl leading-7 font-black tracking-tight text-primary">
                    {order.price}
                  </span>
                  <div className="flex w-full gap-2 md:w-auto">
                    <Button
                      type="button"
                      className="h-auto flex-1 rounded-none border border-primary bg-primary px-6 py-2 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary md:flex-none"
                    >
                      Lacak
                    </Button>
                    {order.canReview && (
                      <Button
                        type="button"
                        className="h-auto flex-1 rounded-none border border-outline bg-surface-container-lowest px-6 py-2 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:border-primary md:flex-none"
                      >
                        Ulas
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}