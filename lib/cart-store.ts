import { create } from "zustand"

import { cartItems as seedItems, type CartItem } from "@/lib/products"

export type CartLine = CartItem & { qty: number }

type CartState = {
  items: CartLine[]
  add: (item: CartItem) => void
  remove: (id: number) => void
  setQty: (id: number, qty: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: seedItems.map((i) => ({ ...i, qty: 1 })),
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id)
      return existing
        ? { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) }
        : { items: [...s.items, { ...item, qty: 1 }] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    })),
}))