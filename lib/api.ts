import axios from "axios";

// ponytail: satu file client API — nggak perlu layer tambahan buat app sebesar ini

export const TOKEN_KEY = "sneakhub_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function formatRp(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ponytail: admin sengaja tidak di sini — admin punya dashboard terpisah tersendiri
export function isSellerRole(peran?: string): boolean {
  return peran === "seller" || peran === "penjual";
}

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null);
      // ponytail: reload ke login — SPA tanpa router store
      if (typeof window !== "undefined" && !location.pathname.startsWith("/login"))
        location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export function errMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data as Record<string, unknown> | undefined;
    if (d?.message && typeof d.message === "string") return d.message;
    const err = d?.error ?? d?.errors;
    if (typeof err === "string") return err;
    if (Array.isArray(err) && err[0] && typeof err[0] === "string") return err[0];
    if (typeof err === "object" && err) {
      const first = Object.values(err)[0];
      if (typeof first === "string") return first;
    }
  }
  return "Terjadi kesalahan, coba lagi.";
}

// ponytail: ini data dummy yang dipakai page wishlist (nggak ada endpoint di postman)
export const PLACEHOLDER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxPMOvyNzilLTPzxyNkFxzjqnuO0BI4PzH6RFS99H1H-g5ttiOyASk0hNpWZk9IYthePNWXwt58oMCS7I9WF22K2IJnVa4a4_5HFYxmzNUSNXuBzZdu7nWeL5_PpBu30PHbVHHhzhl7kq18l4thUBzndw3hTMGvKfvu1tuKdgSW0a2qx0c7mRbh3J7WoEcdNneDuinBdDGt41EKtW7tDx5roAQIyqwh_l0sBNQZlxtVa-zLg3gYw67";

/* ---------- Types (shape hasil probe API live) ---------- */

export type User = {
  user_id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  peran: string;
  status_akun: string;
  preferensi_ukuran?: string[];
  brand_favorit?: string[];
};

export type ApiProduct = {
  product_id: string;
  seller_id?: string;
  nama_produk: string;
  brand_id?: string;
  category_id?: string;
  brand?: string;
  kondisi: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  ukuran_tersedia: string[];
  condition_score?: number;
  status_publikasi?: string;
  image_url: string;
  images?: { image_id: string; image_url: string; urutan_tampil?: number }[];
  seller?: { seller_id: string; nama_toko: string; seller_trust_score: number | null };
  created_at?: string;
};

export type ApiCategory = {
  // ponytail: backend typo `cateogry_id` di respons list — dipakai apa adanya
  cateogry_id: string;
  nama_kategori: string;
};

export type ApiAddress = {
  address_id: string;
  nama_penerima: string;
  nomor_telepon: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  is_default: boolean;
};

export type ApiCartItem = {
  cart_item_id: string;
  product_id: string;
  jumlah: number;
  // ponytail: asumsi nested product — belum bisa probe (semua produk stok 0)
  product?: ApiProduct;
  harga?: number;
};

export type ApiCart = {
  cart_id: string;
  items: ApiCartItem[];
  total_item: number;
  total: number;
};

// ponytail: shape order nggak bisa diprobe penuh (peran JWT stuck customer);
// field dibikin optional biar render aman apa pun yang dikirim backend
export type ApiOrder = {
  order_id: string;
  status_order?: string;
  total?: number;
  created_at?: string;
  items?: { product_id?: string; jumlah?: number; nama_produk?: string; harga?: number }[];
};

export type Pagination = { page: number; limit: number; total: number; total_pages: number };

export type ApiList<T> = { items: T[]; pagination: Pagination };

/* ---------- Mapping API -> UI ---------- */

export type ProductCardData = {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  badge?: string;
  trend?: string;
  harga: number;
  kondisi: string;
  ukuran: string[];
};

export function toCard(p: ApiProduct): ProductCardData {
  return {
    id: p.product_id,
    brand: p.brand ?? p.seller?.nama_toko ?? "",
    name: p.nama_produk,
    price: `${formatRp(p.harga)}`,
    image: p.images?.[0]?.image_url || p.image_url || PLACEHOLDER_IMAGE,
    alt: p.nama_produk,
    badge: p.kondisi,
    trend: p.condition_score ? `Score ${p.condition_score}` : undefined,
    harga: p.harga,
    kondisi: p.kondisi,
    ukuran: p.ukuran_tersedia ?? [],
  };
}