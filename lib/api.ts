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

export function isAdminRole(peran?: string): boolean {
  return peran === "admin";
}

// ponytail: backend wajib isi brand_id tapi TIDAK punya endpoint list brand;
// pakai brand Nike yang sudah ada di seed (dari product detail AF1)
export const DEFAULT_BRAND_ID = "2d72d218-2e0b-449d-a3b2-1521cd21ff20";

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
    // ponytail: backend kadang ngirim `errors` spesifik ("kesalahan password") DAN
    // `message` generik ("terjadi kesalahan server") sekaligus di response yang sama.
    // Prioritaskan errors/error yang lebih spesifik dulu, baru fallback ke message.
    const err = d?.error ?? d?.errors;
    if (typeof err === "string") return err;
    if (Array.isArray(err) && err[0] && typeof err[0] === "string") return err[0];
    if (typeof err === "object" && err) {
      const first = Object.values(err)[0];
      if (typeof first === "string") return first;
    }
    if (d?.message && typeof d.message === "string") return d.message;
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
  avg_rating?: number;
  total_review?: number;
  image_url: string;
  images?: { image_id: string; url: string; urutan_tampil?: number }[];
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

// ponytail: shape cart hasil probe live — field flat, bukan nested product
export type ApiCartItem = {
  cart_item_id: string;
  product_id: string;
  jumlah: number;
  subtotal?: number;
  nama_produk?: string;
  harga?: number;
  image_url?: string;
};

export type ApiCart = {
  cart_id: string;
  items: ApiCartItem[];
  total_item: number;
  total: number;
};

// ponytail: shape verified live via GET /orders/:id
export type ApiOrder = {
  order_id: string;
  status_order?: string;
  subtotal?: number;
  biaya_pengiriman?: number;
  total_pembayaran?: number;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  created_at?: string;
  alamat_pengiriman?: {
    nama_penerima: string;
    nomor_telepon: string;
    alamat: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
  };
  items?: {
    order_item_id?: string;
    product_id?: string;
    jumlah?: number;
    nama_produk?: string;
    harga_saat_transaksi?: number;
  }[];
  payment?: {
    payment_id: string;
    metode_pembayaran: string;
    jumlah: number;
    status_pembayaran: string;
    payment_url?: string;
    gateway_reference?: string;
    paid_at?: string | null;
  };
  shipment?: {
    shipment_id: string;
    kurir?: string;
    nomor_resi?: string | null;
    status_pengiriman?: string;
    shipped_at?: string | null;
    delivered_at?: string | null;
  };
};

export type ApiWishlistItem = {
  wishlist_id: string;
  product_id: string;
  nama_produk: string;
  harga: number;
  status_stok_terakhir?: string;
  price_alert?: { enabled: boolean; target_price?: number };
  restock_alert?: { enabled: boolean };
  image_url?: string;
};

export type ApiNotification = {
  notification_id: string;
  jenis_notifikasi: string;
  isi_notifikasi: string;
  status_baca: boolean;
  created_at: string;
};

export type PriceInsight = {
  current_price: number;
  market_price_min: number;
  market_price_max: number;
  market_average: number;
  price_difference_percent: number;
  anomaly: boolean;
  anomaly_type?: string;
  message: string;
};

export type ConditionScore = {
  product_id: string;
  skor_akhir: number;
  detail: {
    upper: number;
    outsole: number;
    midsole: number;
    insole: number;
    accessories: number;
    box: number;
  };
  dinilai_oleh: string;
};

export type SmartFilterItem = {
  product_id: string;
  nama_produk: string;
  harga: number;
  match_score: number;
  alasan: string[];
  image_url?: string;
};

export type HomeSection = {
  type: string;
  title: string;
  products: { product_id: string; nama_produk: string; harga: number; image_url: string }[];
};

export type RecommendationItem = {
  product_id: string;
  nama_produk: string;
  harga: number;
  score: number;
  reason: string;
  image_url?: string;
};

export type TrendingItem = {
  product_id: string;
  nama_produk: string;
  trend_score: number;
  views: number;
  wishlist_count: number;
  image_url?: string;
};

export type BestSellerItem = {
  rank: number;
  product_id: string;
  nama_produk: string;
  total_terjual: number;
  image_url?: string;
};

export type SellerDashboard = {
  total_produk: number;
  produk_aktif: number;
  total_terjual: number;
  total_pendapatan: number;
  rating_rata_rata: number;
  seller_trust_score: number | null;
  produk_terlaris: { product_id: string; nama_produk: string; total_terjual: number }[];
};

export type SellerTrustScore = {
  seller_id: string;
  skor_akhir: number;
  order_completion_rate: number;
  average_rating: number;
  cancellation_rate: number;
  response_rate: number;
};

export type PricePrediction = {
  estimated_market_price_min: number;
  estimated_market_price_max: number;
  recommended_price: number;
  confidence: number;
};

export type AdminUser = {
  user_id: string;
  nama: string;
  email: string;
  peran: string;
  status_akun: string;
};

export type AdminSeller = {
  seller_id: string;
  user_id: string;
  nama_toko: string;
  status_verifikasi: string;
  nama_user: string;
  email: string;
  created_at: string;
};

export type AdminProduct = {
  product_id: string;
  nama_produk: string;
  seller_id: string;
  harga: number;
  status_publikasi: string;
  stok?: number;
  kondisi?: string;
};

export type AdminOrder = {
  order_id: string;
  customer_id: string;
  seller_id: string;
  status_order: string;
  total_pembayaran: number;
  created_at?: string;
  customer?: { user_id: string; nama: string };
};

export type AdminReport = {
  period: string;
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
};

export type Pagination = { page: number; limit: number; total: number; total_pages: number };

export type ShippingRate = {
  seller_id: string;
  nama_toko: string;
  berat: number;
  kota_asal: string;
  options: {
    kurir: string;
    service: string;
    biaya: number;
    estimasi: string;
    is_fallback: boolean;
  }[];
};

export type ProductReview = {
  review_id: string;
  product_id: string;
  customer?: { user_id: string; nama: string };
  rating: number;
  komentar?: string;
  created_at?: string;
};

export type ApiProductReviews = {
  items: ProductReview[];
  rating_rata_rata: number;
  total_review: number;
};

export type SellerActivationResult = {
  seller_id: string;
  status_verifikasi: string;
};

export type SellerProfile = {
  seller_id: string;
  user_id?: string;
  nama_toko: string;
  deskripsi_toko?: string;
  status_verifikasi?: string;
  kode_pos_asal?: string | null;
  kota_asal?: string | null;
  alamat_asal?: string | null;
};

export type SellerReview = {
  review_id: string;
  product_id: string;
  customer?: { user_id: string; nama: string };
  rating: number;
  komentar?: string;
  created_at?: string;
};

export const SELLER_REQ_KEY = "sneakhub_seller_req";

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
  rating?: number;
  totalReview?: number;
};

export function toCard(p: ApiProduct): ProductCardData {
  return {
    id: p.product_id,
    brand: p.brand ?? p.seller?.nama_toko ?? "",
    name: p.nama_produk,
    price: `${formatRp(p.harga)}`,
    image: p.images?.[0]?.url || p.image_url || PLACEHOLDER_IMAGE,
    alt: p.nama_produk,
    badge: p.kondisi,
    trend: p.condition_score ? `Score ${p.condition_score}` : undefined,
    harga: p.harga,
    kondisi: p.kondisi,
    ukuran: p.ukuran_tersedia ?? [],
    rating: p.avg_rating,
    totalReview: p.total_review,
  };
}