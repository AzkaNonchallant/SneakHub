import { create } from "zustand"

import { parsePrice, trendingProducts, type Product } from "@/lib/products"

export type InventoryItem = {
  id: number
  brand: string
  name: string
  colorway: string
  price: number
  size: string
  condition: string
  stock: number
  trend?: string
  image: string
  alt: string
}

// ponytail: in-memory dummy until there's a backend; add zustand `persist` to survive refresh
function seed(items: Product[]): InventoryItem[] {
  return items.map((p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name.replace(/[ \t]'[^']*'/, "").trim() || p.name,
    colorway: (p.name.match(/'([^']+)'/) ?? [])[1] ?? "",
    price: Math.round(parsePrice(p.price) * 15000), // ponytail: seed harga USD, konversi kasar ke IDR
    size: "US 10.5",
    condition: p.badge?.startsWith("Refurbished")
      ? (p.badge.match(/(\d+\/\d+)/)?.[1] ?? "USED")
      : "DS",
    stock: 5,
    trend: p.trend,
    image: p.image,
    alt: p.alt,
  }))
}

let nextId = 1000

type InventoryState = {
  items: InventoryItem[]
  add: (item: Omit<InventoryItem, "id">) => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: seed(trendingProducts),
  add: (item) => set((s) => ({ items: [{ ...item, id: nextId++ }, ...s.items] })),
}))

export function formatRp(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}
