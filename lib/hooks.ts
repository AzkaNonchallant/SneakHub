import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type ApiCart, type ApiList, type ApiOrder, type ApiProduct, type User } from "@/lib/api";

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
      api.post<{ data: { access_token: string } }>("/auth/login", body).then((r) => r.data.data),
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
    queryFn: () => api.get<{ data: User }>("/users/me").then((r) => r.data.data),
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
      api.post("/users/me/seller-activation", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

/* ---------- Products ---------- */

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
};

export function useProducts(params: ProductParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      api.get<{ data: ApiList<ApiProduct> }>(pageUrl("/products", params)).then((r) => r.data.data),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),
    queryFn: () => api.get<{ data: ApiProduct }>(`/products/${id}`).then((r) => r.data.data),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<{ data: ApiProduct }>("/products", body).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: ({ productId, fd }: { productId: string; fd: FormData }) =>
      api.post(`/products/${productId}/images`, fd),
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
    queryFn: () => api.get<{ data: ApiCart }>("/carts").then((r) => r.data.data),
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

/* ---------- Orders ---------- */

export function useOrders(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () =>
      api.get<{ data: ApiList<ApiOrder> }>(pageUrl("/orders", params)).then((r) => r.data.data),
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { address_id: string; metode_pembayaran: string }) =>
      api.post<{ data: { payment_url?: string; order_id?: string } }>("/checkout", body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}