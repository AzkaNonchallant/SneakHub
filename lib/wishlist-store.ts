import { create } from "zustand"

import { wishlistItems as seedItems, type WishlistItem } from "@/lib/products"

type WishlistState = {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: number) => void
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: seedItems,
  add: (item) =>
    set((s) => (s.items.some((i) => i.id === item.id) ? s : { items: [...s.items, item] })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))