import { create } from "zustand"

export type WishlistItem = {
  id: string | number
  name: string
  colorway: string
  price: number
  oldPrice?: number
  tag: string
  score: string
  image: string
  alt: string
}

// ponytail: seed lokal — wishlist nggak punya endpoint di postman collection
const seedItems: WishlistItem[] = [
  {
    id: 201,
    name: "Nike Air Max Plus",
    colorway: "Volt/Black-White",
    price: 2400,
    oldPrice: 2800,
    tag: "PRICE DROP",
    score: "9.5/10",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANI733IW1Io5NROI_V5T6L8Hsl62eUpAxlpRIT8DRUf_nsNM36HEp-S4cSUZqh33QzAVbDURa6tkvUvSoy9ttXMqru_PVYnZ-UavpRFBmgf7Wev2aCWbCWjsYhw9C52HEUBnnkYsP57DXr0MrJ7HmcTEREw57Du6sVfHoxwPOP9v1osrIVNPOYpdV53tAY5Gdzd39tCLBrjrPIRxq2Gs0X-qrUm6ufId5LMtd39LQj4W3Q24_JpARi",
    alt: "Nike Air Max Plus Volt Black White",
  },
  {
    id: 101,
    name: "Jordan 4 Retro",
    colorway: "Military Blue",
    price: 4100,
    tag: "BACK IN STOCK",
    score: "DS / NEW",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0EJyvdbp9l_ZauNHHYdMaAAPXXpp3ltVjYeXsnhwO5K_LDC7OiM1d9tC_PPrt_hErCNLs4QG1ZWb-0bmv6YHOVcumdJ8upqd-qWkg72Wq4k3F4-TbI5DMFwvTQbyVsm5bgF98r_XTvxC9Pl9BvSHkA2Z1rIAx-dUh_C83JN40-qyf4k6yQyDJIniTUTR8ahCbfSdI676gnJsnE0gzqZn8ewwyHjjjBoZj39w9zc2l4nrABi6qqiOl",
    alt: "Jordan 4 Retro Military Blue",
  },
]

type WishlistState = {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: string | number) => void
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: seedItems,
  add: (item) =>
    set((s) => (s.items.some((i) => i.id === item.id) ? s : { items: [...s.items, item] })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))