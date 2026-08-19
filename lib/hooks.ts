import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  api,
  type AdminOrder,
  type AdminProduct,
  type AdminReport,
  type AdminSeller,
  type AdminUser,
  type ApiCart,
  type ApiList,
  type ApiNotification,
  type ApiOrder,
  type ApiProduct,
  type ApiProductReviews,
  type ApiWishlistItem,
  type BestSellerItem,
  type ConditionScore,
  type HomeSection,
  type PriceInsight,
  type PricePrediction,
  type RecommendationItem,
  type SellerActivationResult,
  type SellerDashboard,
  type SellerTrustScore,
  type ShippingRate,
  type SmartFilterItem,
  type TrendingItem,
  type User,
} from "@/lib/api";

// ponytail: semua react-query hooks API di satu file — per-domain splitting overkill
// untuk 30 endpoint sederhana

function pageUrl(path: string, params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

/* ---------- Auth ---------- */

export function useLogin() {
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api.post<{ data: { access_token: string; user?: { peran?: string } } }>("/auth/login", body).then(
        (r) => r.data.data,
      ),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: { nama: string; email: string; password: string; nomor_telepon: string }) =>
      api.post<{ data: { access_token: string } }>("/auth/register", body).then((r) => r.data.data),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: ({ signal }) => api.get<{ data: User }>("/users/me", { signal }).then((r) => r.data.data),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.put<{ data: User }>("/users/me", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useSellerActivation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { nama_toko: string; deskripsi_toko: string }) =>
      api
        .post<{ data: SellerActivationResult }>("/users/me/seller-activation", body)
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useSellerMe(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["seller-me"],
    enabled: options.enabled,
    queryFn: () => api.get<{ data: import("@/lib/api").SellerProfile }>("/seller/me").then((r) => r.data.data),
  });
}

export function useUpdateSellerMe() {
  const qc = useQueryClient();
  return useMutation({
    // ponytail: partial update — field kosong ("") dihapus backend, jadi jangan kirim field kosong
    mutationFn: (body: Record<string, unknown>) =>
      api.put<{ data: import("@/lib/api").SellerProfile }>("/seller/me", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seller-me"] }),
  });
}

export function useSellerReviews(sellerId?: string) {
  return useQuery({
    queryKey: ["seller-reviews", sellerId],
    enabled: Boolean(sellerId),
    queryFn: () =>
      api
        .get<{ data: ApiProductReviews }>(pageUrl(`/sellers/${sellerId}/reviews`, { limit: 20 }))
        .then((r) => r.data.data),
  });
}



export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      api.get<{ data: import("@/lib/api").ApiCategory[] }>("/category").then((r) => r.data.data),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { nama_kategori: string }) => api.post("/category", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nama_kategori }: { id: string; nama_kategori: string }) =>
      api.put(`/category/${id}`, { nama_kategori }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/category/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}



export type ProductParams = {
  page?: number;
  limit?: number;
  search?: string;
  brand_id?: string;
  category_id?: string;
  kondisi?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  sort?: string;
  enabled?: boolean;
};

export function useProducts(params: ProductParams = {}) {
  const { enabled = true, ...rest } = params;
  return useQuery({
    queryKey: ["products", rest],
    enabled,
    queryFn: ({ signal }) =>
      api.get<{ data: ApiList<ApiProduct> }>(pageUrl("/products", rest), { signal }).then((r) => r.data.data),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),
    queryFn: ({ signal }) => api.get<{ data: ApiProduct }>(`/products/${id}`, { signal }).then((r) => r.data.data),
  });
}

export function useProductReviews(productId: string, limit = 20) {
  return useQuery({
    queryKey: ["product-reviews", productId, limit],
    enabled: Boolean(productId),
    queryFn: () =>
      api
        .get<{ data: ApiProductReviews }>(pageUrl(`/products/${productId}/reviews`, { limit }))
        .then((r) => r.data.data),
  });
}

// ponytail: invalidate lintas key — seller UI pakai seller-products, detail pakai product
const PRODUCT_KEYS: string[][] = [["products"], ["seller-products"], ["product"]];

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<{ data: ApiProduct }>("/products", body).then((r) => r.data.data),
    onSuccess: () => PRODUCT_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      api.put<{ data: ApiProduct }>(`/products/${id}`, body).then((r) => r.data.data),
    onSuccess: () => PRODUCT_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => PRODUCT_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useDeleteProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      api.delete(`/products/${productId}/images/${imageId}`),
    onSuccess: () => PRODUCT_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useUploadProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, fd }: { productId: string; fd: FormData }) =>
      api.post(`/products/${productId}/images`, fd),
    onSuccess: () => PRODUCT_KEYS.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function useSearchByImage() {
  return useMutation({
    mutationFn: (fd: FormData) =>
      api.post<{ data: ApiList<ApiProduct> }>("/products/search-by-image", fd).then((r) => r.data.data),
  });
}

/* ---------- Cart ---------- */

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: ({ signal }) => api.get<{ data: ApiCart }>("/carts", { signal }).then((r) => r.data.data),
  });
}

export function useAddCartItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { product_id: string; jumlah: number }[]) =>
      api.post("/carts/items", { items }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, jumlah }: { id: string; jumlah: number }) =>
      api.put(`/carts/items/${id}`, { jumlah }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/carts/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

/* ---------- Addresses ---------- */

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.get<{ data: import("@/lib/api").ApiAddress[] }>("/addresses").then((r) => r.data.data),
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post("/addresses", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      api.put(`/addresses/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

/* ---------- Orders ---------- */

export function useOrders(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: ({ signal }) =>
      api.get<{ data: ApiList<ApiOrder> }>(pageUrl("/orders", params), { signal }).then((r) => r.data.data),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    enabled: Boolean(id),
    queryFn: () => api.get<{ data: ApiOrder }>(`/orders/${id}`).then((r) => r.data.data),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status_order }: { id: string; status_order: string }) =>
      api.put(`/orders/${id}`, { status_order }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
      qc.invalidateQueries({ queryKey: ["seller-dashboard"] });
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string;
      body: { product_id: string; rating: number; komentar: string };
    }) => api.post(`/orders/${orderId}/review`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["order"] }),
  });
}

export type CheckoutResult = {
  order_id: string;
  status_order: string;
  subtotal: number;
  biaya_pengiriman: number;
  total_pembayaran: number;
  metode_pembayaran: string;
  payment_url?: string;
};

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { address_id: string; metode_pembayaran: string; pengiriman?: { seller_id: string; kurir: string }[] }) =>
      // ponytail: backend kirim ARRAY (satu entry per seller); frontend pakai entry pertama
      api.post<{ data: CheckoutResult[] }>("/checkout", body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useShippingRates(addressId?: string) {
  return useQuery({
    queryKey: ["shipping-rates", addressId],
    enabled: Boolean(addressId),
    queryFn: () =>
      api
        .post<{ data: ShippingRate[] }>("/checkout/shipping-rates", { address_id: addressId })
        .then((r) => r.data.data),
  });
}

/* ---------- Wishlist & Alerts ---------- */

export type WishlistItem = ApiWishlistItem & { image_url?: string };

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api.get<{ data: WishlistItem[] }>("/wishlist").then((r) => r.data.data),
  });
}

export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product_id: string) => api.post("/wishlist", { product_id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product_id: string) => api.delete(`/wishlist/${product_id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

function useAlertMutation(path: (productId: string) => string, keys: string[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, body }: { productId: string; body?: Record<string, unknown> }) =>
      api[body ? "post" : "delete"](path(productId), body),
    onSuccess: () => keys.forEach((k) => qc.invalidateQueries({ queryKey: k })),
  });
}

export function usePriceAlert() {
  return useAlertMutation((id) => `/wishlist/${id}/price-alert`, [["wishlist"]]);
}

export function useRestockAlert() {
  return useAlertMutation((id) => `/wishlist/${id}/restock-alert`, [["wishlist"]]);
}

/* ---------- Notifications ---------- */

export function useNotifications(params: { page?: number; limit?: number; type?: string } = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () =>
      api
        .get<{ data: { items: ApiNotification[]; unread_count: number; pagination?: ApiList<ApiNotification>["pagination"] } }>(
          pageUrl("/notifications", params),
        )
        .then((r) => r.data.data),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/* ---------- Discovery & AI ---------- */

export type SmartFilterParams = {
  budget_min?: number;
  budget_max?: number;
  brand?: string[];
  ukuran?: string[];
  kondisi?: string[];
  kategori?: string[];
  prioritas?: { harga?: number; kondisi?: number; seller_trust?: number };
};

export function useSmartFilter() {
  return useMutation({
    mutationFn: (body: SmartFilterParams) =>
      api.post<{ data: { items: SmartFilterItem[] } }>("/discovery/smart-filter", body).then((r) => r.data.data),
  });
}

export function useHomePersonalized() {
  return useQuery({
    queryKey: ["home-personalized"],
    queryFn: () =>
      api.get<{ data: { sections: HomeSection[] } }>("/home/personalized").then((r) => r.data.data),
  });
}

export function useRecommendations(limit = 10) {
  return useQuery({
    queryKey: ["recommendations", limit],
    queryFn: () =>
      api
        .get<{ data: { items: RecommendationItem[] } }>(pageUrl("/recommendation/cocok-untuk-kamu", { limit }))
        .then((r) => r.data.data),
  });
}

export function useTrending(params: { period?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ["trending", params],
    queryFn: () =>
      api.get<{ data: { period: string; items: TrendingItem[] } }>(pageUrl("/trending", params)).then((r) => r.data.data),
  });
}

export function useBestSellerWeekly(limit = 4) {
  return useQuery({
    queryKey: ["best-seller", limit],
    queryFn: () =>
      api
        .get<{ data: { period_start: string; period_end: string; items: BestSellerItem[] } }>(
          pageUrl("/best-seller/weekly", { limit }),
        )
        .then((r) => r.data.data),
  });
}

/* ---------- Seller ---------- */

export function useSellerDashboard() {
  return useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () =>
      api.get<{ data: SellerDashboard }>("/seller/dashboard").then((r) => r.data.data),
  });
}

export function useSellerOrders(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["seller-orders", params],
    queryFn: () =>
      api
        .get<{ data: ApiList<{ order_id: string; status_order: string; total_pembayaran: number; created_at?: string; customer?: { nama: string } }> }>(
          pageUrl("/seller/orders", params),
        )
        .then((r) => r.data.data),
  });
}

export function useSellerProducts(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["seller-products", params],
    queryFn: () =>
      api
        .get<{ data: ApiList<ApiProduct & { total_terjual?: number }> }>(pageUrl("/seller/products", params))
        .then((r) => r.data.data),
  });
}

export function useShipOrder() {
  const qc = useQueryClient();
  return useMutation({
    // ponytail: body kosong = booking Biteship otomatis; { nomor_resi } = kirim manual
    mutationFn: ({ orderId, body }: { orderId: string; body?: Record<string, unknown> }) =>
      api.post<{ data: { order_id: string; status_order?: string } }>(
        `/seller/orders/${orderId}/ship`,
        body ?? {},
      ).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
      qc.invalidateQueries({ queryKey: ["seller-dashboard"] });
    },
  });
}

export function useConfirmOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      api
        .post<{
          data: {
            order_id: string;
            status_order?: string;
            items?: { product_id: string; nama_produk: string }[];
          };
        }>(`/orders/${orderId}/confirm`, {})
        .then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
  });
}

export function useTrustScore(sellerId?: string) {
  return useQuery({
    queryKey: ["trust-score", sellerId],
    enabled: Boolean(sellerId),
    // ponytail: seller baru belum punya trust score — 404 dianggap kosong,
    // bukan error, biar UI tidak nampilin error
    queryFn: () =>
      api.get<{ data: SellerTrustScore }>(`/sellers/${sellerId}/trust-score`).then((r) => r.data.data)
        .catch((err) => {
          if (err.response?.status === 404) return null;
          throw err;
        }),
  });
}

export function usePricePrediction() {
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<{ data: PricePrediction }>("/price/prediction", body).then((r) => r.data.data),
  });
}

/* ---------- Product extras ---------- */

export function usePriceInsight(productId: string) {
  return useQuery({
    queryKey: ["price-insight", productId],
    enabled: Boolean(productId),
    queryFn: () =>
      api.get<{ data: PriceInsight }>(`/products/${productId}/price-insight`).then((r) => r.data.data),
  });
}

export function useConditionScores(productId: string) {
  return useQuery({
    queryKey: ["condition-score", productId],
    enabled: Boolean(productId),
    // ponytail: backend balikin 404 kalau produk belum pernah dinilai — anggap kosong
    queryFn: () =>
      api
        .get<{ data: ConditionScore }>(`/products/${productId}/condition-score`)
        .then((r) => r.data.data)
        .catch((err) => {
          if (err.response?.status === 404) return null;
          throw err;
        }),
  });
}

export function useSubmitConditionScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, body }: { productId: string; body: Record<string, unknown> }) =>
      api.post<{ data: ConditionScore }>(`/products/${productId}/condition-score`, body).then((r) => r.data.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["condition-score", vars.productId] }),
  });
}

/* ---------- Admin ---------- */

export function useAdminUsers(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () =>
      api.get<{ data: ApiList<AdminUser> }>(pageUrl("/admin/users", params)).then((r) => r.data.data),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: { status_akun: string; alasan: string } }) =>
      api.patch(`/admin/users/${userId}/status`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: { peran: string } }) =>
      api.patch(`/admin/users/${userId}/role`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useAdminSellers(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin-sellers", params],
    queryFn: () =>
      api.get<{ data: ApiList<AdminSeller> }>(pageUrl("/admin/sellers", params)).then((r) => r.data.data),
  });
}

export function useUpdateSellerVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sellerId, body }: { sellerId: string; body: { status: string } }) =>
      api.patch(`/admin/sellers/${sellerId}/verification`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sellers"] }),
  });
}

export function useAdminProducts(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () =>
      api.get<{ data: ApiList<AdminProduct> }>(pageUrl("/admin/products", params)).then((r) => r.data.data),
  });
}

export function useUpdateProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, body }: { productId: string; body: { status_publikasi: string; catatan: string } }) =>
      api.patch(`/admin/products/${productId}/status`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useAdminOrders(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () =>
      api.get<{ data: ApiList<AdminOrder> }>(pageUrl("/admin/orders", params)).then((r) => r.data.data),
  });
}

export function useAdminReports(params: { period?: string; start_date?: string; end_date?: string } = {}) {
  return useQuery({
    queryKey: ["admin-reports", params],
    queryFn: () =>
      api.get<{ data: AdminReport }>(pageUrl("/admin/reports", params)).then((r) => r.data.data),
  });
}