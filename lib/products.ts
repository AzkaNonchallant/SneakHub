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
    id: 1,
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
    id: 2,
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
    id: 1,
    brand: "Asics",
    name: "Gel-Kayano 14 'Silver Blue'",
    price: "$190",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfwAYLjJ5c1iC_sHivtaQzIOVufNKgzmdVVnVvAOCjAB1X16FLT8P4TM-mBrSj6WIbiRQfWRukihZTSuHD8RLOQzb2PgItCKYgq6CFoZ1-fAYf3LtfofA66f8Js7W_umyewVY_egdbik7Phtub7OnqH56dB4t5y_34BDey452GXgvcdygYk5KYIQ5zm4-XmLv5-LzB0n1bOMEsm9t7FmO5AiHluIs7QFJABF-T0mrvbs0_wKoICrhX",
    alt: "Asics Gel-Kayano 14 Silver Blue",
  },
  {
    id: 2,
    brand: "Jordan",
    name: "AJ1 Low 'Travis Scott'",
    price: "$1,150",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvAevLPXpNJciU2shlgDfX0G1fF62dQznXZM73Cd_J8uukXpv7Iw2Ip0NjBoYrP2uKpSaKkCThrSAh5Foh_ZNWtEunohAjj_-dpLVRlSFLpZCO4lKLFXLdmq4KMVIw-1_QvvAPylvNcDATCNYFb_ffGDx0uMLKMvqhiQqCPfYZWZAf7O266TEhEmqxV3EXp_VvS0_aAWEnu_9szTSI6cjF_oTgynqNtFT-tnmoyI0SkKbJQG0lI4nR",
    alt: "Travis Scott AJ1 Low Reverse Mocha",
  },
  {
    id: 4,
    brand: "Adidas",
    name: "Yeezy Slide 'Onyx'",
    price: "$125",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1BTIy7rBJhhum68HD5_YFgL3QQT76mCnfKNNWV8dsfZJru2v8PpklA-zR9i2YeYfyUmkhsK4GNDV6hulgK5YXAroYFRaw0zB79GMDx3LLyZ4r4HPaEuiKttamThJlNM1iXGhIxciFd3zc3FxLTFck5l3ASL23oOpsKEhL9JbnVKKQJTvol23jJC0_Ufhd8dDi72al5DY9pa4LRmOFri-GHT0eOKKFEcknh3yMXLgBTSZYbFaR0wY9",
    alt: "Adidas Yeezy Slide Onyx",
  },
  {
    id: 5,
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
    id: 1,
    brand: "New Balance",
    name: "550 'White Green'",
    price: "$130",
    match: "92%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrLHDCMGxsuI-MTFjqYCxm5CZAArKl3neI4-bJxmpfS3DWWheN31ZcSJiHnrCBdWPFvS5nJ6zLfKIY5KbxPtLXsS0MlkdS39inQC5pdGPjJrADWfVH-XY6tjzKv_y-Esx-4IC7t52QeTDHtq6JPSMJjkxGJLzjjIEnNvk5HtOvdYOZglwba0BgTrGZHQy_ssi3VQVtk8S9ehtdaU1-mPmdqTAJGypv4RPRAPTgANgY_Xs9yCEeZSVv",
    alt: "New Balance 550 White Green",
  },
  {
    id: 2,
    brand: "On Running",
    name: "Cloudmonster 'Triple Black'",
    price: "$170",
    match: "88%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDBMzv1HvZg-9rGPMo8ajU0kGbjk0pIKdyl_B_mNbYfFahueAausc1s5ixww0YgwqP2R948M4mzdx31Nqmq_r8F_ooqIqfZEmLAH4FA1bNqJ8q29JCJA1tmF0jwrmzNut74AUAEmmPP73aY-uq-7wS-N2Ds2M_b-MFvyx-Wa8_OVw-fVA7E8i3ThqkSXs_AdPSIlti9sZOiWdg_jV2K5px5hkYOSRkQmQe12ID0H9IisGW7LcSc0zX",
    alt: "On Running Cloudmonster Triple Black",
  },
  {
    id: 3,
    brand: "Salomon",
    name: "XT-6 'Lunar Rock'",
    price: "$200",
    match: "85%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgCh8FyQZ0zgu1sJK2e_PRE1Al6UhRm5208nNtW8TCdwvq3X3JQFjjchFkV8tJkbRy0Sy1qXCB_de6WpU2SYkFn7PqItRbN5cYAcxK8cyglK2uvBcIXb4fZOUTg3rzao7bYoQeJfm1I729WO_IefWgdrgpZJ7Zf_PG5D0OXXZnZx8Agd9PY-hLTF9RsDiO2g9v5dr_P3zZjN8bjpLKszGncKsQ7uPhVLfqGa4jLbtHbaT9ETgSOxyT",
    alt: "Salomon XT-6 Lunar Rock",
  },
]
