// ponytail: static dummy data until there's a backend/db

export type Product = {
  id: number
  brand: string
  name: string
  price: string
  image: string
  alt: string
  badge?: string
  trend?: string
  match?: string
}

export type CartItem = {
  id: number
  name: string
  colorway: string
  price: number
  condition: string
  size: string
  image: string
  alt: string
}

export const cartItems: CartItem[] = [
  {
    id: 101,
    name: "Jordan 4 Retro",
    colorway: "'Military Black'",
    price: 345.0,
    condition: "87/100",
    size: "10.5",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTYlY-Qtz7p-QNT2oCgSEBCA5ndhZwCLTe53k761zOy-fZz0gN0RJhJ181CLvScjiyez-BQB-k-Ej3NJbSSvLu2VfGYPDypg255TJXKe9mFdixKU6wH7ah6qInP8AaEXI5XJ8iyZ15nldjyt3p3SvEx63YD952fWUKD3qoZ1OmbnPi76v0viPFbmV9a41sRXeFqgUbKsSleV-EY-pYFtzlrH5rnPf321qD5Kyv-eWCNrXSszC0ZmFC",
    alt: "Jordan 4 Retro Military Black",
  },
  {
    id: 102,
    name: "Nike Dunk Low",
    colorway: "'Panda'",
    price: 185.0,
    condition: "NEW",
    size: "11.0",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxPMOvyNzilLTPzxyNkFxzjqnuO0BI4PzH6RFS99H1H-g5ttiOyASk0hNpWZk9IYthePNWXwt58oMCS7I9WF22K2IJnVa4a4_5HFYxmzNUSNXuBzZdu7nWeL5_PpBu30PHbVHHhzhl7kq18l4thUBzndw3hTMGvKfvu1tuKdgSW0a2qx0c7mRbh3J7WoEcdNneDuinBdDGt41EKtW7tDx5roAQIyqwh_l0sBNQZlxtVa-zLg3gYw67",
    alt: "Nike Dunk Low Panda",
  },
]

export const trendingProducts: Product[] = [
  {
    id: 1,
    brand: "Nike",
    name: "Dunk Low 'Panda'",
    price: "$185",
    badge: "New",
    trend: "+12%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxPMOvyNzilLTPzxyNkFxzjqnuO0BI4PzH6RFS99H1H-g5ttiOyASk0hNpWZk9IYthePNWXwt58oMCS7I9WF22K2IJnVa4a4_5HFYxmzNUSNXuBzZdu7nWeL5_PpBu30PHbVHHhzhl7kq18l4thUBzndw3hTMGvKfvu1tuKdgSW0a2qx0c7mRbh3J7WoEcdNneDuinBdDGt41EKtW7tDx5roAQIyqwh_l0sBNQZlxtVa-zLg3gYw67",
    alt: "Nike Dunk Low Panda black and white colorway",
  },
  {
    id: 2,
    brand: "Jordan",
    name: "Air Jordan 1 High 'Chicago'",
    price: "$450",
    badge: "Refurbished 92/100",
    trend: "+8%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDL9nG0t4OXUrTGkq9SFl2JGpmNOacURpHjV6b_ue7J7eEOojv8s3s9u9z96NR15PkuPi1VFtG9ATYuBessqJGssbK25__DnIFQ2PArqiVvqL-fR-x0KzYfWFMLF2LJtsGaFnesb4RqDjYb1l9u9Ofzm0nb86vE7FNc-cNJbJ2s7g85NIqigAsokUCZShzRL6_jgFASiAMDBv2AbSOo4brm8kt2GK9EJJtqH_V2H60Jq05eBU-QCpSJ",
    alt: "Air Jordan 1 High Chicago refurbished",
  },
  {
    id: 3,
    brand: "New Balance",
    name: "990v6 'Grey'",
    price: "$220",
    badge: "New",
    trend: "+24%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWSosc_D8lOAOd4iBXgvYVpmEG0lNNvAgOUCNcIJ8rdxAnSUkO7xWv3tuPCdVixkyMpQwwR__C9x2bo5oddXWMHqbsn4ef0jIbJhJYPgIq8_FibDCY3B40JKWWX4wcklZ5rTeR7Dmr9BLeabNKXDZx91AOaGQ3RKlZiiQAxCzVAhl-jgbVFgYm6eM4YuvaOgdn3P4u6r-3IwPwwlOh8md88owwkzRPCSoHsBK3-9k0NifMMKMTVSIg",
    alt: "New Balance 990v6 Grey",
  },
  {
    id: 4,
    brand: "Adidas",
    name: "Samba OG 'White Black'",
    price: "$110",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_xtxkh6viQvFC1PYkpCpRKzyQt8CKFECpAovjVSdYX6TahrbssAmNtX0rk6dLQZSbOLYo4-TbUSx4E3_SHw0RlGs5pGTgM4KOgUbdaOG5LCE7bUzX1281F0Xz1NboVEuWN2eoC_H9WKycLYYQP2ddIH4TmKel3ymluSZ3d3ZHReGZkzIepf4TG7QzD8xU-_HbuL3pEd1H8sU8FphhiPKt-sIly7aj-npX4RoK39rcELodLdFJWLWq",
    alt: "Adidas Samba OG White Black",
  },
]

export const bestSellers: Product[] = [
  {
    id: 5,
    brand: "Asics",
    name: "Gel-Kayano 14 'Silver Blue'",
    price: "$190",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfwAYLjJ5c1iC_sHivtaQzIOVufNKgzmdVVnVvAOCjAB1X16FLT8P4TM-mBrSj6WIbiRQfWRukihZTSuHD8RLOQzb2PgItCKYgq6CFoZ1-fAYf3LtfofA66f8Js7W_umyewVY_egdbik7Phtub7OnqH56dB4t5y_34BDey452GXgvcdygYk5KYIQ5zm4-XmLv5-LzB0n1bOMEsm9t7FmO5AiHluIs7QFJABF-T0mrvbs0_wKoICrhX",
    alt: "Asics Gel-Kayano 14 Silver Blue",
  },
  {
    id: 6,
    brand: "Jordan",
    name: "AJ1 Low 'Travis Scott'",
    price: "$1,150",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvAevLPXpNJciU2shlgDfX0G1fF62dQznXZM73Cd_J8uukXpv7Iw2Ip0NjBoYrP2uKpSaKkCThrSAh5Foh_ZNWtEunohAjj_-dpLVRlSFLpZCO4lKLFXLdmq4KMVIw-1_QvvAPylvNcDATCNYFb_ffGDx0uMLKMvqhiQqCPfYZWZAf7O266TEhEmqxV3EXp_VvS0_aAWEnu_9szTSI6cjF_oTgynqNtFT-tnmoyI0SkKbJQG0lI4nR",
    alt: "Travis Scott AJ1 Low Reverse Mocha",
  },
  {
    id: 7,
    brand: "Adidas",
    name: "Yeezy Slide 'Onyx'",
    price: "$125",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1BTIy7rBJhhum68HD5_YFgL3QQT76mCnfKNNWV8dsfZJru2v8PpklA-zR9i2YeYfyUmkhsK4GNDV6hulgK5YXAroYFRaw0zB79GMDx3LLyZ4r4HPaEuiKttamThJlNM1iXGhIxciFd3zc3FxLTFck5l3ASL23oOpsKEhL9JbnVKKQJTvol23jJC0_Ufhd8dDi72al5DY9pa4LRmOFri-GHT0eOKKFEcknh3yMXLgBTSZYbFaR0wY9",
    alt: "Adidas Yeezy Slide Onyx",
  },
  {
    id: 8,
    brand: "New Balance",
    name: "550 'White Green'",
    price: "$130",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrLHDCMGxsuI-MTFjqYCxm5CZAArKl3neI4-bJxmpfS3DWWheN31ZcSJiHnrCBdWPFvS5nJ6zLfKIY5KbxPtLXsS0MlkdS39inQC5pdGPjJrADWfVH-XY6tjzKv_y-Esx-4IC7t52QeTDHtq6JPSMJjkxGJLzjjIEnNvk5HtOvdYOZglwba0BgTrGZHQy_ssi3VQVtk8S9ehtdaU1-mPmdqTAJGypv4RPRAPTgANgY_Xs9yCEeZSVv",
    alt: "New Balance 550 White Green",
  },
]

export const personalizedProducts: Product[] = [
  {
    id: 9,
    brand: "New Balance",
    name: "550 'White Green'",
    price: "$130",
    match: "92%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrLHDCMGxsuI-MTFjqYCxm5CZAArKl3neI4-bJxmpfS3DWWheN31ZcSJiHnrCBdWPFvS5nJ6zLfKIY5KbxPtLXsS0MlkdS39inQC5pdGPjJrADWfVH-XY6tjzKv_y-Esx-4IC7t52QeTDHtq6JPSMJjkxGJLzjjIEnNvk5HtOvdYOZglwba0BgTrGZHQy_ssi3VQVtk8S9ehtdaU1-mPmdqTAJGypv4RPRAPTgANgY_Xs9yCEeZSVv",
    alt: "New Balance 550 White Green",
  },
  {
    id: 10,
    brand: "On Running",
    name: "Cloudmonster 'Triple Black'",
    price: "$170",
    match: "88%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDBMzv1HvZg-9rGPMo8ajU0kGbjk0pIKdyl_B_mNbYfFahueAausc1s5ixww0YgwqP2R948M4mzdx31Nqmq_r8F_ooqIqfZEmLAH4FA1bNqJ8q29JCJA1tmF0jwrmzNut74AUAEmmPP73aY-uq-7wS-N2Ds2M_b-MFvyx-Wa8_OVw-fVA7E8i3ThqkSXs_AdPSIlti9sZOiWdg_jV2K5px5hkYOSRkQmQe12ID0H9IisGW7LcSc0zX",
    alt: "On Running Cloudmonster Triple Black",
  },
  {
    id: 11,
    brand: "Salomon",
    name: "XT-6 'Lunar Rock'",
    price: "$200",
    match: "85%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgCh8FyQZ0zgu1sJK2e_PRE1Al6UhRm5208nNtW8TCdwvq3X3JQFjjchFkV8tJkbRy0Sy1qXCB_de6WpU2SYkFn7PqItRbN5cYAcxK8cyglK2uvBcIXb4fZOUTg3rzao7bYoQeJfm1I729WO_IefWgdrgpZJ7Zf_PG5D0OXXZnZx8Agd9PY-hLTF9RsDiO2g9v5dr_P3zZjN8bjpLKszGncKsQ7uPhVLfqGa4jLbtHbaT9ETgSOxyT",
    alt: "Salomon XT-6 Lunar Rock",
  },
]

export type WishlistItem = {
  id: number
  name: string
  colorway: string
  price: number
  oldPrice?: number
  tag: string
  score: string
  image: string
  alt: string
}

// ponytail: static seed until there's a backend
export const wishlistItems: WishlistItem[] = [
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

const searchCatalog: Product[] = [...trendingProducts, ...bestSellers, ...personalizedProducts]

export function searchProducts(q: string): Product[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return searchCatalog.filter((p) =>
    `${p.brand} ${p.name} ${p.alt}`.toLowerCase().includes(needle),
  )
}

export function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, ""))
}

export type ProductDetail = {
  id: number
  brand: string
  name: string
  colorway: string
  price: number
  condition: string
  size: string
  image: string
  alt: string
  gallery: string[]
  breakdown: { label: string; score: number }[]
  marketPrice: number
  seller: { initial: string; name: string; role: string; trust: number }
}

// ponytail: full detail only for the mockup hero; everything else synthesized
const productDetails: Record<number, Omit<ProductDetail, "id" | "brand" | "name" | "image" | "alt">> = {
  101: {
    colorway: "'Military Black'",
    price: 345.0,
    condition: "87/100",
    size: "US 10.5",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhVhu7Lhl3r0vsogRewqi7u5xhATDnJ5Kmk0_PKut5XQtKLzvKDkc_lkdzmaDvfszycPg41E2nI-26fp4zC0YnAmnm-yNGdWeGYhunWt1aZnWVgHN0nhptspp39--BcwXlp4Am-a0CQ8kB0rU5-N1u4aX-9MoUV24FzPoBqg3IpeEPlC5bgCwRhfsWjBUzIGCOkPkvFhFc1XDzUfd7BUYVIG2U_w9fl65GRBzdwCJUNnbtbGQJfZfR",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCje6O_VWGEA2jXOL9ZdWjYVtQuzRaYtF-4MDGFk2G75Em8oKTL7GCRepQi8bI9k4SE46V7lQk-0NlldHPzrWkofODoCzNeFsDLd55PYoLYDFvnfdkDTg5EoaM3NBztC56tvfeaqTh0MnLA0FnBvq1MZEA4pYUZNW3kUCdy_TUugIXjbLMryLWm1hJDt4oM8ogojgcBeyl8o7u3UBDGkJFRJ_YfBG-BrZQhNyV8xjW0c5CsYnTyCEG9",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKjNOo4PsNXewCrCax0IXXpO1MqXH6rtGF8ZoLAdOMZ0BWMfAc8J0YXPTK6e64Td1x22RTJG_nyegR3mgOibKRN2j3I8SU0XfBwBIJcrqGsFS0zhTXmcRtyJbEfhXZjsdAPwJvbzegZpZAT65C7GUCPnJRdBN9RQR9tGe0qHbe68lAP7g1xEkIbb59J7zuwzhnYqt3AgWAkMSKTLcajmkp7F4zTJIz3lsped9YKnesqmasoWQtkac-",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxPpjxI3qTmzx39vldmH63qvBqIETNx9X3_BBXeaSvH8gJVGgvLmATlsrcWgFAm6peBvPrdy1EgpG-kiYQ4RJHukIQtUV9Cn-QI4wkmsfC9u3LgN9_Ubsq2ALCfILeuJG50i1rMBzxo5tNu4WS6U4ibpm4RZvAqfeyTrD_LakyVFb9amp7tZV_R27iJ4qz0axF33vC3rQpmy8v3Fzp0FFHOoWzBLaqmWIkendy6qrl9JOKAwvD_5oQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBihDHK0UDZX1oO9Wov3afLp5iW82AQvJc9VEtpUnA0pyv0wDPwEQroQ9He5zilQZ7Nl2g47zkSBiIVopFCYQ03iar8TzoemBUCX9PlE_VIPEU7CSr_LA4GeDODULuygK4kBUBZi9kVXLPBTItUXi4q3rjOkvScARRh4WsUpaME3Xrk4Os2sOx6y8U9NAiaccFTAzyEohFG6EJ9Bft8aAcx69hFYHHCfx_YSnX7yd9r5iVyBUYwPICt",
    ],
    breakdown: [
      { label: "Upper", score: 90 },
      { label: "Midsole", score: 85 },
      { label: "Outsole", score: 82 },
      { label: "Box", score: 95 },
    ],
    marketPrice: 385,
    seller: { initial: "TR", name: "TechResell", role: "Verified Merchant", trust: 94 },
  },
}

const allProducts: (Product | CartItem | WishlistItem)[] = [
  ...cartItems,
  ...trendingProducts,
  ...bestSellers,
  ...personalizedProducts,
  ...wishlistItems,
]

// ponytail: synthesized detail for non-hero products, real data when there's a backend
export function getProductDetail(id: number): ProductDetail | null {
  const detail = productDetails[id]
  if (detail) {
    const base = allProducts.find((p) => p.id === id)
    if (!base) return null
    return {
      id,
      brand: "brand" in base ? base.brand : "",
      name: base.name,
      image: base.image,
      alt: base.alt,
      ...detail,
    }
  }

  const base = allProducts.find((p) => p.id === id)
  if (!base) return null

  const price = "price" in base ? (typeof base.price === "number" ? base.price : parsePrice(base.price)) : 0
  return {
    id,
    brand: "brand" in base ? base.brand : "",
    name: base.name,
    colorway: "colorway" in base ? base.colorway : "",
    price,
    condition: "condition" in base ? base.condition : ("badge" in base ? base.badge ?? "NEW" : "NEW"),
    size: "size" in base ? `US ${base.size}` : "US 10.5",
    image: base.image,
    alt: base.alt,
    gallery: [base.image],
    breakdown: [
      { label: "Upper", score: 90 },
      { label: "Midsole", score: 88 },
      { label: "Outsole", score: 85 },
      { label: "Box", score: 92 },
    ],
    marketPrice: Math.round(price * 1.1),
    seller: { initial: "TR", name: "TechResell", role: "Verified Merchant", trust: 94 },
  }
}
